# MinimalMcpTool — 使用说明

一个最小可用的第三方插件，演示如何在不修改 Epic 官方 `ModelContextProtocol` 插件源码的前提下，把自定义 Tool 和 ResourceProvider 接到 MCP server。

## 它做了什么

- **Tool: `report_actor_transform`** — 根据 actor label 查找 editor world 内的 actor，返回 location/rotation/scale/class。
- **Resource Provider: `level://<PackageName>`** — 把项目内所有 World 资产暴露为 MCP Resource，`resources/read` 返回 asset 的元数据文本。

## 1. 前置条件

- UE 5.8 Preview（或更新，只要 `ModelContextProtocol` 插件 API 兼容）
- Epic 官方 `ModelContextProtocol` 插件已存在于 `Engine/Plugins/Experimental/ModelContextProtocol`
- 项目使用 C++（必须含 `Source/` 文件夹，否则无法编译 module 类）

## 2. 安装

把整个 `MinimalMcpTool/` 目录拷贝到：

```
<YourProject>/Plugins/MinimalMcpTool/
```

目录结构应为：

```
MinimalMcpTool/
├── MinimalMcpTool.uplugin
├── HOWTO.md
└── Source/
    └── MinimalMcpTool/
        ├── MinimalMcpTool.Build.cs
        ├── Public/
        │   ├── MinimalMcpToolModule.h
        │   ├── ReportActorTransformTool.h
        │   └── LevelListResourceProvider.h
        └── Private/
            ├── MinimalMcpToolModule.cpp
            ├── ReportActorTransformTool.cpp
            └── LevelListResourceProvider.cpp
```

## 3. 启用插件并编译

1. 打开你的 `.uproject`，在 **Edit → Plugins** 里：
   - 找到 **Unreal MCP**（Epic 官方 `ModelContextProtocol`），勾选启用
   - 找到 **Minimal MCP Tool Example**，勾选启用
2. 关闭 Editor，让 Editor 重启时编译 module（或先在 IDE 里 build `<YourProject>Editor` target）。

## 4. 启动 MCP server

任选其一：

- **GUI**：Editor → **Edit → Editor Preferences → Plugins → Model Context Protocol** → 勾 `bAutoStartServer`，重启 Editor。
- **命令行**：用 `-StartModelContextProtocolServer -ModelContextProtocolPort=8000` 启动 Editor。
- **Console**：在 Editor output log 里跑 `ModelContextProtocol.StartServer`（具体命令名以源码为准）。

默认监听 `http://127.0.0.1:8000/mcp`。

## 5. 生成 client config 并连入

在 Editor output log（` 键打开）跑：

```
ModelContextProtocol.GenerateClientConfig ClaudeCode
```

会在引擎根（source build）或项目根（installed build）生成 `.mcp.json`。
然后在那个目录下启动 Claude Code，它会自动发现 `unreal-mcp` server。

支持的客户端枚举见 [`docs/03-engine-integration.md` §2](../../docs/03-engine-integration.md#2-clientconfig-生成)。

## 6. 验证

在 Claude Code 中提问，例如：

> "List all MCP tools available."

应包含 `report_actor_transform`，外加 Epic 默认的 `list_toolsets / describe_toolset / load_toolset`（deferred 模式）。

> "Use report_actor_transform to find the transform of PlayerStart in the current level."

LLM 应该生成 `tools/call` 请求 `{"name":"report_actor_transform","arguments":{"actor_label":"PlayerStart"}}`，server 返回该 actor 的 transform 文本。

> "List MCP resources."

应能看到 `level:///Game/Maps/...` 形式的 URI。

## 7. 调试

- Editor output log 过滤 `LogModelContextProtocol`（核心层）和 `LogMinimalMcpTool`（本插件）
- 若 tool 注册失败常见原因：
  - `ModelContextProtocol` 插件未启用 → 本插件 `IModelContextProtocolModule::Get()` 返回 nullptr，会打 warning
  - 名字冲突（比如重复加载） → 看 warning `AddTool(report_actor_transform) failed (name conflict?)`
- 若 server 不响应：用 `curl -X POST -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"ping"}' http://127.0.0.1:8000/mcp` 验证 server 起着没

## 8. 改造方向

- 把 `ReportActorTransformTool` 改成异步：覆盖 `RunAsync` 而不是 `Run`，按 [`docs/06-extension-guide.md` §1.5](../../docs/06-extension-guide.md) 写。
- 把 `LevelListResourceProvider` 扩展成内容索引：在 `ReadResource` 里读 World，列出所有 actor 名。
- 加更多 tool：例如 `spawn_actor`、`move_actor`、`save_current_level`。每加一个，记得在 `RegisterAll` 里 `AddTool` 并在 `ShutdownModule` 中 `RemoveTool`。

## 9. 限制

- **依赖 Editor**：本插件 module type 是 `Editor`，不会进非编辑器 target。如果你需要 runtime 里跑工具，把 module type 换成 `Runtime` 并移除对 `UnrealEd` 的依赖。
- **未实现取消语义**：`ReportActorTransformTool` 是同步 tool，没法 cancel。异步版本要覆盖 `CancelAsync`。
- **未实现 resources/subscribe**：本插件和上游 MCP 一样不支持资源订阅。
