# 06 — 扩展指南

本章给出**实战级**的扩展配方。配合 [`examples/MinimalMcpTool/`](../examples/MinimalMcpTool/) 工程一起看，那个是可直接放到 `<Project>/Plugins/` 下编译的最小例子。

选择哪条路径：

| 你的需求 | 推荐路径 |
|---|---|
| 完全自定义、想直接控制 schema 和异步逻辑 | **§1 直接派生 `IModelContextProtocolTool`**（本章主线、示例工程演示） |
| Editor 工具集，多人协作、需要在编辑器里可视化管理 | ToolsetRegistry 插件的 `UToolsetDefinition`，本插件会自动适配（**不在本章范畴**） |
| 把现成的 `UFUNCTION` 一键暴露给 LLM | 看 `UModelContextProtocolToolLibrary`，但**官方已弃用**，迁去 ToolsetRegistry |

## 1. 注册一个自定义 Tool

### 1.1 头文件

```cpp
#pragma once
#include "IModelContextProtocolTool.h"

class FMyActorTransformTool : public IModelContextProtocolTool
{
public:
    virtual FString GetName() const override { return TEXT("report_actor_transform"); }
    virtual FString GetDescription() const override
    {
        return TEXT("Return the world transform of an actor identified by its label in the active editor world.");
    }
    virtual TSharedPtr<FJsonObject> GetInputJsonSchema() const override;
    virtual FModelContextProtocolToolResult Run(const TSharedPtr<FJsonObject>& Params) override;
};
```

### 1.2 InputSchema

`GetInputJsonSchema()` 必须返回 `{"type":"object", ...}`。即便没有参数，也至少 `{"type":"object"}`（基类默认值已满足）。带参数版本：

```cpp
TSharedPtr<FJsonObject> FMyActorTransformTool::GetInputJsonSchema() const
{
    using namespace UE::ModelContextProtocol;
    FJsonDomBuilder::FObject Properties;
    {
        FJsonDomBuilder::FObject Label;
        Label.Set(TEXT("type"), TEXT("string"));
        Label.Set(TEXT("description"), TEXT("Actor label as shown in the World Outliner."));
        Properties.Set(TEXT("actor_label"), Label);
    }
    FJsonDomBuilder::FArray Required;
    Required.Add(TEXT("actor_label"));

    FJsonDomBuilder::FObject Schema;
    Schema.Set(TEXT("type"), TEXT("object"));
    Schema.Set(TEXT("properties"), Properties);
    Schema.Set(TEXT("required"), Required);
    return Schema.AsJsonObject().ToSharedPtr();
}
```

### 1.3 Run（同步实现）

```cpp
FModelContextProtocolToolResult FMyActorTransformTool::Run(const TSharedPtr<FJsonObject>& Params)
{
    using namespace UE::ModelContextProtocol;
    if (!Params.IsValid()) { return MakeErrorResult(TEXT("Missing params")); }

    FString Label;
    if (!Params->TryGetStringField(TEXT("actor_label"), Label) || Label.IsEmpty())
        return MakeErrorResult(TEXT("Missing 'actor_label' string parameter"));

    UWorld* World = GEditor ? GEditor->GetEditorWorldContext().World() : nullptr;
    if (!World) { return MakeErrorResult(TEXT("No editor world")); }

    for (TActorIterator<AActor> It(World); It; ++It)
    {
        if (It->GetActorLabel().Equals(Label, ESearchCase::IgnoreCase))
        {
            const FTransform T = It->GetActorTransform();
            return MakeTextResult(FString::Printf(
                TEXT("Location=%s Rotation=%s Scale=%s"),
                *T.GetLocation().ToString(),
                *T.GetRotation().Rotator().ToString(),
                *T.GetScale3D().ToString()));
        }
    }
    return MakeErrorResult(FString::Printf(TEXT("Actor '%s' not found"), *Label));
}
```

### 1.4 注册 / 反注册

```cpp
// MyPluginModule.cpp
void FMyPluginModule::StartupModule()
{
    if (IModelContextProtocolModule* MCP = IModelContextProtocolModule::Get())
    {
        MyTool = MakeShared<FMyActorTransformTool>();
        MCP->AddTool(MyTool.ToSharedRef());

        // 关键：核心层在 RefreshTools 时会清空所有 tool。订阅 OnRefreshTools 重新注册。
        OnRefreshHandle = MCP->OnRefreshTools().AddLambda([this]()
        {
            if (auto* M = IModelContextProtocolModule::Get())
            {
                M->AddTool(MyTool.ToSharedRef());
            }
        });
    }
}

void FMyPluginModule::ShutdownModule()
{
    if (IModelContextProtocolModule* MCP = IModelContextProtocolModule::Get())
    {
        MCP->OnRefreshTools().Remove(OnRefreshHandle);
        if (MyTool.IsValid()) { MCP->RemoveTool(MyTool.ToSharedRef()); }
    }
    MyTool.Reset();
}
```

⚠️ **三个坑**：
1. **`OnRefreshTools` 不重新注册 = 你的 tool 静默消失**。Editor 端用户点 "重启 ToolsetRegistry" 或类似操作会触发它。
2. `AddTool` 重名会失败并打 error。给 tool 起名前过一遍 `UE::ModelContextProtocol::ValidateToolName`（`ModelContextProtocol.cpp:9-38`）。
3. Tool 内部如果**持有 `UObject*`**，必须覆盖 `AddReferencedObjects(FReferenceCollector&)`，否则可能被 GC 回收。

### 1.5 异步 Tool（长任务）

如果工具是 IO/网络/长跑任务，覆盖 `RunAsync` 而非 `Run`：

```cpp
class FSlowTool : public IModelContextProtocolTool
{
    virtual FString GetName() const override { return TEXT("slow_query"); }
    virtual FString GetDescription() const override { return TEXT("Sleeps then returns."); }

    virtual void RunAsync(
        const FModelContextProtocolToolRequestId& RequestId,
        const TSharedPtr<FJsonObject>& Params,
        const FResultCallback& OnComplete) override
    {
        InflightRequests.Add(RequestId);
        AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this, RequestId, OnComplete]()
        {
            FPlatformProcess::Sleep(3.0f);
            AsyncTask(ENamedThreads::GameThread, [this, RequestId, OnComplete]()
            {
                if (!InflightRequests.Contains(RequestId)) { return; } // 已 cancel
                InflightRequests.Remove(RequestId);
                OnComplete(UE::ModelContextProtocol::MakeTextResult(TEXT("done")));
            });
        });
    }
    virtual void CancelAsync(const FModelContextProtocolToolRequestId& RequestId) override
    {
        InflightRequests.Remove(RequestId);   // 让 callback 自查后 silently drop
    }

private:
    TSet<FModelContextProtocolToolRequestId> InflightRequests;
};
```

要点：
- `OnComplete` 必须**最终**被调用一次（否则 client 会一直挂着等 SSE 帧），但 cancel 之后调也安全——server 会自检 `Session->ActiveRequests` 然后 drop（见 [02 章 §5](02-protocol-core.md#5-toolscall-的-sse-异步流程)）。
- 通过 client 在 `params._meta.progressToken` 里给的 progress token，server 会自动每 N 秒推一次心跳，你不需要自己写。

## 2. 注册一个 ResourceProvider

接口：

```cpp
// IModelContextProtocolResourceProvider.h:20-34
struct IModelContextProtocolResourceProvider : TSharedFromThis<IModelContextProtocolResourceProvider>
{
    virtual void ListResources(FModelContextProtocolResourceDescriptorList& Out) const = 0;
    virtual TValueOrError<FModelContextProtocolResource, FString> ReadResource(const FString& Uri) const = 0;
};
```

最小实现（示例工程里有完整版）：

```cpp
class FLevelListResourceProvider : public IModelContextProtocolResourceProvider
{
    virtual void ListResources(FModelContextProtocolResourceDescriptorList& Out) const override
    {
        // 用 AssetRegistry 枚举所有关卡，每个加一条 descriptor
        // URI 用 "level://<PackageName>" 这种自定义 scheme
        // ... Out.AddDescriptor(...) ...
    }
    virtual TValueOrError<FModelContextProtocolResource, FString> ReadResource(const FString& Uri) const override
    {
        // 解析 Uri，返回 FModelContextProtocolResource 或 MakeError
    }
};
```

注册：`MCP->AddResourceProvider(MakeShared<FLevelListResourceProvider>())`。
反注册：`MCP->RemoveResourceProvider(Provider)`。

⚠️ Resource 的 `subscribe / list_changed` **没实现**——所以 provider 只能被动响应 `resources/list` 和 `resources/read`，没法主动 push update。

## 3. 启动 server 的几种方式

| 方式 | 优势 | 劣势 |
|---|---|---|
| **Editor → Project Settings → Plugins → Model Context Protocol → bAutoStartServer = true** | 一键，per-user 设置 | 必须 Editor target |
| 命令行 `-StartModelContextProtocolServer -ModelContextProtocolPort=8000` | 适合 CI / headless | 一样要 Engine 模块加载 |
| C++ 代码 `IModelContextProtocolModule::Get()->StartServer(8000, "/mcp")` | 灵活，可在 runtime / dedicated server 跑 | 自己负责 lifetime |
| Console `ModelContextProtocol.StartServer` | 临时调试 | 输入麻烦 |

## 4. 生成 client config

跑一次：
```
ModelContextProtocol.GenerateClientConfig ClaudeCode
```
会在引擎根（source build）或项目根（installed build）生成 `.mcp.json`，里面填好 `http://127.0.0.1:8000/mcp`，Claude Code 在该目录下启动时会自动发现。详见 [03 章 §2](03-engine-integration.md#2-clientconfig-生成)。

## 5. 自检清单

写完工具之前对自己问一遍：

- [ ] `GetName()` 通过 `ValidateToolName`（1-128 字符、`[A-Za-z0-9_\-.]`）
- [ ] `GetDescription()` 写清楚**LLM 何时应该用这个工具**——这比写"它做了什么"更重要
- [ ] `GetInputJsonSchema()` 的 `properties + required` 完整准确——LLM 完全靠这个生成调用参数
- [ ] `Run` / `RunAsync` 错误路径都走 `MakeErrorResult`（带 `isError: true`）而不是 throw 或 ensure
- [ ] 持有 `UObject*` → `AddReferencedObjects` 覆盖
- [ ] `StartupModule` → `OnRefreshTools` 订阅；`ShutdownModule` → `RemoveTool` + 解绑
- [ ] 在 Editor 里跑：`Project Settings` 里勾 `bAutoStartServer`，重启 Editor，`tools/list` 应能看到你的 tool

