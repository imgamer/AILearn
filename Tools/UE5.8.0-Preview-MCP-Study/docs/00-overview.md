# 00 — 全景

## 这是什么

`ModelContextProtocol` 是 Epic 官方在 UE 5.8 Preview 中提供的实验性插件，实现了 [Anthropic Model Context Protocol](https://modelcontextprotocol.io/) **服务器侧**协议，把 UE 编辑器（以及运行时进程，理论上）变成一个 MCP Server，供 Claude Code / Cursor / VSCode Copilot 等 MCP 客户端连入并调用工具。

## 关键事实卡

| 项 | 值 | 出处 |
|---|---|---|
| 插件名 / 友好名 | `ModelContextProtocol` / `Unreal MCP` | `ModelContextProtocol.uplugin:5` |
| 创建者 | Epic Games, Inc. | `ModelContextProtocol.uplugin:9` |
| 实验性 | `IsExperimentalVersion: true` | `ModelContextProtocol.uplugin:16` |
| 商用限制 | `NoRedist: true`（**不可随项目发布**） | `ModelContextProtocol.uplugin:8` |
| 默认不启用 | `EnabledByDefault: false` | `ModelContextProtocol.uplugin:18` |
| 协议版本 | `2025-11-25`（向下兼容 `2025-06-18`、`2024-11-05`） | `ModelContextProtocol.h:19-30` |
| 默认端口/路径 | `8000` / `/mcp` | `ModelContextProtocol.h:45-46` |
| 默认 Server 名 | `unreal-mcp` | `ModelContextProtocol.h:47` |
| 传输 | **Streamable HTTP + SSE**（只此一种） | `ModelContextProtocolServer.cpp:388-419`；全仓 grep `stdio/WebSocket` 无命中 |
| RPC 协议 | JSON-RPC 2.0 | `ModelContextProtocol.h:16` |
| 模块数 | 6（3 功能 + 3 测试） | `ModelContextProtocol.uplugin:19-49` |
| 内嵌依赖插件 | `EngineAssetDefinitions`, `ToolsetRegistry` | `ModelContextProtocol.uplugin:51-60` |

## 它能做什么

服务器实现了以下 MCP JSON-RPC 方法（参见 `ModelContextProtocolServer.cpp:541-611`）：

- `ping` — 心跳
- `initialize` — 协议版本协商，分配 Session ID
- `notifications/initialized` — 客户端就绪通知（触发分析事件 `SessionStart`）
- `notifications/cancelled` — 取消某个进行中的工具调用，路由到 `IModelContextProtocolTool::CancelAsync`
- `tools/list` — 列出已注册工具（支持 base64 cursor 分页）
- `tools/call` — 执行工具，**响应通过 SSE 流式回写**，允许中途推 `notifications/progress` 心跳
- `resources/list` — 列出 Resource Provider 暴露的资源
- `resources/read` — 读取指定 URI 的资源
- 通知客户端：`notifications/tools/list_changed`（工具集合变更时主动广播给所有 active SSE 流）

## 它**不**做什么

| 能力 | 状态 | 说明 |
|---|---|---|
| stdio 传输 | ❌ | 不存在 stdio adapter，全局 grep 无任何 stdio/StdIo 关键字 |
| WebSocket 传输 | ❌ | 同上 |
| MCP `prompts/*` 方法 | ❌ | `FModelContextProtocolPromptsCapability` 结构体定义了但 server 没注册路由 (`ModelContextProtocolCapabilities.h:52-58`，`ModelContextProtocolServer.cpp:541-611` 无对应分支) |
| MCP `roots/*` / `sampling/*`（client→server 反向调用） | ❌ | 仅作为 client capability 字段读入，无主动调用代码 |
| Resource `subscribe` / `list_changed` 通知 | ❌ | 仅 tools 有 `list_changed`；resources capability 字段空 (`ModelContextProtocolServer.cpp:653`) |
| 鉴权（OAuth / Bearer） | ❌ | 唯一访问控制是 **Origin header 白名单**（仅 localhost）+ HTTP server 默认绑定 |
| 跨机器访问 | ⚠️ | 默认绑定取决于 `HTTPServer` 模块；Origin 校验只允许 `localhost / 127.0.0.1 / [::1]`，浏览器无法跨域；CLI 客户端可任意来源（无 Origin 头时放行） |

## 与官方 MCP 规范的关系

- 实现侧贴近最新 spec：协议版本 `2025-11-25`（写本文档时仍是最新），兼容旧两个版本。
- Tool name 校验严格按 [MCP 2025-11-25 tool-names 规则](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool-names)：`1-128` 字符，`A-Z a-z 0-9 _ - .`（实现：`ModelContextProtocol.cpp:9-38`）。
- Tool result 结构遵守 [tool-result spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result)：支持 `text / image / audio / resourceLink / embeddedResource / structuredContent`（`ModelContextProtocolToolResults.h:17-27`）。

## 谁应该用 / 不该用

**适合**：
- 想给单机编辑器开"AI 助手"的工作流：让 Claude/Cursor 通过工具调用读关卡、改资产、跑测试。
- 内部工具链原型：开发期跑、不进 shipping 包。

**不适合**：
- 想把 LLM 集成到出货游戏里跑（`NoRedist` + 默认绑定 localhost + 没有鉴权）。
- 想用 stdio 形式接 Claude Desktop —— 本插件**只支持 HTTP 传输**，必须用支持 HTTP/SSE transport 的 client 端（参见 `ModelContextProtocolClientConfig.h:8-21` 列出的 5 个客户端）。
- 想要 prompts/sampling/roots 反向能力的复杂 agentic 场景 —— 当前不支持。
