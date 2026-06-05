# UE5.8 Preview — Unreal MCP 插件总览分析

> 分析对象：`Engine/Plugins/Experimental/ModelContextProtocol`
> 引擎版本：Unreal Engine 5.8 Preview
> 插件版本：`1.0`（`IsExperimentalVersion: true`，`NoRedist: true`）
> 分析日期：2026-06-04
> 分析深度：Survey（总览级，足够回答"它是什么、怎么用、值不值得集成"）

Epic 官方在 5.8 中首次以 `Experimental` 插件形式提供了 **Model Context Protocol (MCP)** 服务器实现。本仓库是一份**中文源码分析 + 最小可跑示例**，目标读者是想把 LLM 客户端（Claude Code / Cursor / VSCode Copilot / Gemini CLI / Codex）接入到 UE 编辑器/运行时的 C++ 开发者。

## 文档地图

| 章节 | 内容 |
|---|---|
| [00 — 全景](docs/00-overview.md) | 插件定位、能做什么/不能做什么、与官方 MCP 规范的关系 |
| [01 — 模块拓扑](docs/01-modules.md) | 六个模块依赖图、各自职责、可裁剪性 |
| [02 — 协议核心](docs/02-protocol-core.md) | HTTP+SSE 传输、JSON-RPC 路由、Session/Tool/Resource 抽象 |
| [03 — 引擎集成](docs/03-engine-integration.md) | UDeveloperSettings、ClientConfig 生成、（已废弃的）ToolLibrary 路径 |
| [04 — 编辑器集成](docs/04-editor-integration.md) | ToolsetRegistry 适配、Deferred Tool Loading 模式 |
| [05 — 启动与运行时时序](docs/05-lifecycle.md) | 从模块加载到 `tools/call` 的完整时序图 |
| [06 — 扩展指南](docs/06-extension-guide.md) | 如何注册自定义 Tool / ResourceProvider（接示例工程） |
| [07 — 风险与限制](docs/07-risks-and-limits.md) | Experimental 标记、NoRedist、安全面、已知坑、不实现的能力 |

## 示例工程

[`examples/MinimalMcpTool/`](examples/MinimalMcpTool/) — 一个最小可用的第三方插件，演示：

1. 通过 `IModelContextProtocolTool` 接口注册一个自定义 Tool（一行命令把 actor 的 Transform 报回 LLM）
2. 通过 `IModelContextProtocolResourceProvider` 暴露关卡名单作为 MCP Resource
3. 在 `StartupModule` / `ShutdownModule` 中处理生命周期与 `OnRefreshTools` 重注册

配套使用说明：[`examples/MinimalMcpTool/HOWTO.md`](examples/MinimalMcpTool/HOWTO.md)

## 一句话总结

**Unreal MCP** = `Streamable HTTP + JSON-RPC 2.0 + SSE` 实现的 MCP Server，跑在编辑器进程里（默认 `http://127.0.0.1:8000/mcp`），允许 LLM 客户端通过工具调用直接操控 UE Editor。工具来源的**推荐路径已经从插件自带的 `UModelContextProtocolToolLibrary`（已废弃）迁移到独立的 `ToolsetRegistry` 插件**——读 04 章和示例工程理解为什么。
