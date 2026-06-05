# 03 — 引擎集成

`ModelContextProtocolEngine` 模块的存在意义是把核心层"散装"的 C++ API 包装成 UE 风格的便利层。它本身**不启动 server**，只做三件事：Settings、ClientConfig 生成、Analytics 默认 provider 接线。

## 1. `UModelContextProtocolSettings`

声明：`ModelContextProtocolSettings.h`（UDeveloperSettings，category 在 `EditorPerProjectUserSettings` 下）。

| 字段 | 默认 | 说明 |
|---|---|---|
| `bAutoStartServer` | `false` | Editor 启动后是否自动 `StartServer`（由 Editor 模块在 `SetupEditorIntegration` 中读取） |
| `ServerPortNumber` | `8000` | 监听端口 |
| `ServerUrlPath` | `"/mcp"` | URL path |

对外暴露的 free function（namespace `UE::ModelContextProtocol`）：
- `ShouldAutoStartServer()` — 综合 settings + 命令行（`-StartModelContextProtocolServer`）
- `GetServerPortNumber()` — 综合 settings + 命令行（`-ModelContextProtocolPort=N`）
- `GetServerUrlPath()` — settings

UI 位置：**Editor → Edit → Editor Preferences → Plugins → Model Context Protocol**（per-project-user，不会进 ini 进 git）。

## 2. ClientConfig 生成

枚举（`ModelContextProtocolClientConfig.h:8-21`）：

| EModelContextProtocolClient | 输出文件 | 格式 |
|---|---|---|
| `ClaudeCode` | `<root>/.mcp.json` | JSON，merge |
| `Cursor` | `<root>/.cursor/mcp.json` | JSON，merge |
| `VSCode` | `<root>/.vscode/mcp.json` | JSON，merge |
| `Gemini` | `<root>/.gemini/settings.json` | JSON，merge |
| `Codex` | `<root>/.codex/config.toml` | TOML，**write-once**（已存在就报错） |

API：
```cpp
// ModelContextProtocolClientConfig.h:38, 48
MODELCONTEXTPROTOCOLENGINE_API bool WriteClientConfiguration(
    EModelContextProtocolClient Client, uint32 Port, const FString& UrlPath,
    const FString& BaseDirectory = FString());

MODELCONTEXTPROTOCOLENGINE_API int32 WriteAllClientConfigurations(
    uint32 Port, const FString& UrlPath, const FString& BaseDirectory = FString());
```

`BaseDirectory` 默认值：source build 用 `FPaths::RootDir()`（引擎根），installed build 用 `FPaths::ProjectDir()`（项目根）。

控制台命令（`ModelContextProtocolEngineModule.cpp:40-70`）：
```
ModelContextProtocol.GenerateClientConfig <ClaudeCode|Cursor|VSCode|Gemini|Codex|All>
```
跑一次就在工作目录下铺好对应客户端的配置文件，省去手写。"Claude" 是 "ClaudeCode" 的别名，"Copilot" 是 "VSCode" 的别名。

## 3. Analytics 接线

Engine 模块在 `PostEngineInit` 时把 `FEngineAnalytics` 包了个 proxy（`FEngineAnalyticsProviderProxy`）安装为 MCP 默认的 analytics provider（`ModelContextProtocolEngineModule.cpp:73-129`）：

```cpp
PostEngineInitHandle = FCoreDelegates::GetOnPostEngineInit().AddLambda([this]()
{
    RegisterDefaultAnalyticsProvider();
});
```

被记的事件（在协议核心层触发）：
- `SessionStart` — `notifications/initialized` 时（`ModelContextProtocolServer.cpp:677`）
- `SessionEnd` — `DELETE /mcp` 或 `StopServer` 时，**仅** Initialized 状态发，避免幻象事件
- `ToolCall` — `tools/call` 完成时，记 tool 名（Blake3 hash 匿名化）、duration、success bool

Shutdown 时只在确认 `Module->GetAnalyticsProvider() == EngineAnalyticsProviderProxy` 才反注册——避免覆盖第三方代码用 `SetAnalyticsProvider` 装的自定义 provider（`:94-105`）。

## 4. 被废弃的 `UModelContextProtocolToolLibrary`

`ModelContextProtocolToolLibrary.h` 和 `ModelContextProtocolToolAsyncAction.h` 提供过这样一条路径：

1. 写一个 `UBlueprintFunctionLibrary` 子类，标 `UCLASS()` 用 `UModelContextProtocolToolLibrary` 作为父类
2. 每个 `UFUNCTION()` 自动暴露成 MCP Tool，参数 schema 从 UFUNCTION 反射自动生成
3. 类似的 `UModelContextProtocolToolAsyncAction` 包装异步行为

两者都被 `DeprecatedNode` 元数据明确标记：
```
"Use UToolsetDefinition (ToolsetRegistry plugin) instead."
```

迁移方向：用 `ToolsetRegistry` 插件的 `UToolsetDefinition`，由 Editor 模块的适配层自动桥到 MCP Tool。详见 [04 — 编辑器集成](04-editor-integration.md)。

## 5. 这一层"不"做什么

- **不调 `StartServer`**：自动启动是 Editor 模块的责任。Runtime 单跑时需要业务代码自己 `IModelContextProtocolModule::Get()->StartServer(...)`。
- **不注册任何 Tool**：核心层默认 0 个 tool；引擎层只提供 schema 生成的胶水（且已弃用）；新工具来源在 Editor 层经 ToolsetRegistry 注入。
- **不依赖 UnrealEd / Editor-only 模块**：所以这层可以打包进非编辑器 target，给 dedicated server / 开发构建用。
