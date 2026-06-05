# 04 — 编辑器集成

`ModelContextProtocolEditor` 是把 **ToolsetRegistry 插件**（独立内嵌依赖）适配到 MCP 的桥。它也是 `bAutoStartServer` 真正起作用的地方。

## 1. 启动时序

```cpp
// ModelContextProtocolEditor.cpp:17-47
void FModelContextProtocolEditorModule::StartupModule()
{
    // 1) 注册 BlueprintGraph 类型覆盖（给被弃用的 ToolLibrary 用，保持向后兼容编辑器图）
    KismetCompilerModule.OverrideBPTypeForClass(UModelContextProtocolToolLibrary::StaticClass(), ...);
    KismetCompilerModule.OverrideBPTypeForClass(UModelContextProtocolEditorToolLibrary::StaticClass(), ...);

    // 2) 订阅 MCP 模块的 OnRefreshTools — 工具集合被外部清空时重注册一遍
    OnRefreshToolsHandle = Module->OnRefreshTools().AddLambda([this]() {
        ToolsetRegistryAdapterManager.RegisterTools();
    });

    // 3) 视 GEditor 是否就绪，立刻 SetupEditorIntegration 或 defer 到 PostEngineInit
    if (GEditor) { SetupEditorIntegration(); }
    else         { PostEngineInitHandle = ... AddLambda([this]() { SetupEditorIntegration(); }); }
}
```

`SetupEditorIntegration` 三步走（`:49-71`）：
1. 订阅 `UToolsetRegistrySubsystem::ToolsetRegistry.OnToolsetRegistered()` — 新 Toolset 资产被发现时重注册
2. 首次 `ToolsetRegistryAdapterManager.RegisterTools()` 把已加载的 toolset 接进来
3. 如果 `ShouldAutoStartServer()` 返回 true，调 `Module->StartServer(GetServerPortNumber(), GetServerUrlPath())`

## 2. ToolsetRegistry 适配器

`FToolsetRegistryToolAdapter`（`ModelContextProtocolToolsetRegistryAdapter.cpp:28-77`）继承 `IModelContextProtocolTool`，把每个 ToolsetRegistry 的 tool 包装成 MCP tool：

```cpp
void FToolsetRegistryToolAdapter::RunAsync(
    const FModelContextProtocolToolRequestId& RequestId,
    const TSharedPtr<FJsonObject>& Params,
    const FResultCallback& OnComplete)
{
    UE::ToolsetRegistry::FToolsetRegistry* Registry = GetToolsetRegistry();
    auto Descriptor = UE::ToolsetRegistry::FToolDescriptor::FromString(ToolName);
    FString ArgumentsJson = /* 序列化 Params */;
    Registry->ExecuteTool(Descriptor.GetValue(), ArgumentsJson).Then([OnComplete](TFuture<TValueOrError<FString, FString>> Future) {
        auto Result = Future.Get();
        OnComplete(Result.HasError()
            ? UE::ModelContextProtocol::MakeErrorResult(Result.GetError())
            : UE::ModelContextProtocol::MakeTextResult(Result.GetValue()));
    });
}
```

ToolsetRegistry 的 `ExecuteTool` 返回 `TFuture<TValueOrError<FString, FString>>`，适配层做的就是把这个 future-of-result 桥到 MCP 的 `OnComplete` 回调。

## 3. 两种注册模式

CVar `ModelContextProtocol.DeferredToolLoading`（默认 **on**）决定走 eager 还是 deferred：

### Eager（CVar 关）

`ModelContextProtocolToolsetRegistryAdapter.cpp:200-210`：
```cpp
ToolsetRegistry->ForEachToolset([this](const FString&, const UE::ToolsetRegistry::FToolset& Toolset) {
    RegisterToolsFromSchema(Toolset.GetToolsetJsonSchema());
});
```
所有 toolset 的所有 tool 一次性 `AddTool`。简单粗暴。

### Deferred（默认）

`:154-197`：只注册 3 个 meta-tool，让 LLM 按需 list / describe / load：

| Tool 名 | 行为 | 实现 |
|---|---|---|
| `list_toolsets` | 返回所有 toolset 的 `name: description` 列表 | `FListToolsetsTool` + `GetToolsetCatalogText` (`:343-364`) |
| `describe_toolset` | 给定 toolset 名，返回它的完整 JSON schema（含所有 tool 描述） | `FDescribeToolsetTool` + `GetToolsetSchemaText` (`:366-390`) |
| `load_toolset` | 把目标 toolset 内所有 tool 真正 `AddTool` 到 module，并广播 `notifications/tools/list_changed` | `FLoadToolsetTool` + `RegisterToolset` (`:244-341`) |

**为什么默认 deferred**：UE Editor 装上各种插件后，可能有几十个 toolset、上百个 tool，把全部 schema 直接送给 LLM 会撑爆 context window。让 LLM 自己探索"我现在做这件事需要哪个 toolset"再 load 它，是个聪明的妥协。

`load_toolset` 成功后会调 `Server->BroadcastToolsListChanged()`（`:289-295`），向所有活跃 SSE 流推 `notifications/tools/list_changed`，让客户端重新 `tools/list`。

## 4. 与核心层的协议

| 触发 | 反应 |
|---|---|
| `Module->OnRefreshTools()` 被广播 | Editor 模块 `RegisterTools()` 全部重来 |
| `ToolsetRegistry->OnToolsetRegistered()` | 同上：新 toolset 出现就重新注册 |
| `ShutdownModule` | `DeregisterTools(bBroadcast=false)` 移除所有注册过的 adapter |

`DeregisterTools(true)` 也可调，会顺便 `BroadcastToolsListChanged`，但当前只在 `RegisterToolset` 成功后用到这个分支。

## 5. ModelContextProtocolEditorToolLibrary

`ModelContextProtocolEditorToolLibrary.h` 类似 Runtime 的 `ToolLibrary`，但跑在 Editor target——也被同样的 deprecated 注释覆盖。`StartupModule` 之所以还要 `OverrideBPTypeForClass`，是为了让旧资产打开时蓝图编译器不报错。新代码不要碰这两个 UCLASS。
