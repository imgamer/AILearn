# 07 — 风险与限制

把整份分析里反复触及的"坑、面、限"集中起来。读这一章像读 release note 的 "Known Issues"。

## 1. Experimental 标记

- `IsExperimentalVersion: true`（`ModelContextProtocol.uplugin:16`）
- `EnabledByDefault: false`（`:18`）

Epic 在 README 中明示：API 在 5.9 / 6.x 可能 break。`IModelContextProtocolTool` 的 virtual 表已经在 spec 演进中调整过几次（`RunAsync` 是后加的），下个版本可能继续动。

**对策**：把你的 Tool / Provider 实现封装在自家插件里，依赖**最小可用**接口；不要 fork / 改插件源码。

## 2. NoRedist 与商用限制

`NoRedist: true`（`.uplugin:8`）。许可证文本不允许把插件作为 SDK re-distribute 给你的客户。具体后果：

| 场景 | 允许？ |
|---|---|
| 开发组内部用 .uproject 引用插件 | 是（默认行为） |
| 把插件打包进 shipping 游戏交付给玩家 | 否（违反 EULA） |
| 在 CI / 开发构建里跑 | 技术上可行，但法律上取决 EULA 条款 |
| 公开一个依赖它的第三方插件的源码（不含插件本身） | 一般允许（但你得确保用户有自己的引擎拷贝） |

**对策**：Shipping 产品如果要 mcp 能力，需等 Epic 把 `NoRedist` 移除（可能 final release 时改为 `NoRedist: false`），或实现自己的轻量版 standalone MCP server。

## 3. 安全面

### 3.1 唯一访问控制：Origin 白名单

`ValidateOriginHeader`（`ModelContextProtocolServer.cpp:45-93`）只做：
- 有 Origin → 仅放行 `localhost / 127.0.0.1 / [::1]`
- 无 Origin（CLI / curl）→ **全部放行**

含义：**任何能访问到监听端口的 CLI 进程都能调用所有 tool**。如果监听端口被路由到公网，等于无鉴权裸奔。

### 3.2 没有鉴权

不实现 OAuth / Bearer / API Key。MCP spec 也未强制，但生产部署一定要套层 reverse proxy + auth。

### 3.3 工具执行特权

`tools/call` 在 Editor 进程内同线程或后台线程执行，**拥有完整 Editor 权限**：能读所有 asset、能改资产、能跑 Python script、能下硬盘文件……这是 feature 不是 bug，但意味着：

- 不要装来源不明的第三方 MCP tool 插件
- LLM client 端如果配置错把 server URL 指向同事的机器，等价给同事开了 Editor 远程操控

**对策**：把 server 绑死回环（HTTPServer 的默认行为通常如此，但 OS-level 防火墙也加一道）；CI 跑 mcp 时用 Docker network namespace 隔离。

### 3.4 SSE 长连接资源

`tools/call` 期间，HTTP 连接保持打开。如果客户端不发 `notifications/cancelled` 也不断网，server 端 `Session->ActiveRequests` 一直挂着对应 entry。当前实现**没有 idle timeout**。恶意 client 可以无限发起 `tools/call` 然后 hold 连接耗资源。

**对策**：依赖 reverse proxy 的连接限制和超时。

## 4. 协议覆盖度不全

| MCP 2025-11-25 能力 | 本插件 |
|---|---|
| `initialize / ping` | ✓ |
| `tools/list, tools/call` | ✓ |
| `notifications/tools/list_changed` | ✓ |
| `resources/list, resources/read` | ✓ |
| `notifications/resources/list_changed` | ✗ |
| `resources/subscribe, notifications/resources/updated` | ✗ |
| `prompts/list, prompts/get` | ✗（capability struct 存在但未路由：`ModelContextProtocolCapabilities.h:52-58` vs `ModelContextProtocolServer.cpp:541-611`） |
| `notifications/prompts/list_changed` | ✗ |
| `logging/setLevel, notifications/message` | ✗ |
| `completion/complete` | ✗ |
| `sampling/createMessage`（反向，server→client） | ✗ |
| `roots/list`（反向） | ✗ |
| Stdio transport | ✗ |
| WebSocket transport | ✗ |

**含义**：
- 想做 agentic 场景（让 server 反过来调 LLM）不行
- 想给 Claude Desktop 这种**只支持 stdio**的 client 用不行
- 资源变更只能客户端轮询

## 5. 实现层观察到的细节

### 5.1 ODR 风险候选

`ModelContextProtocol/Public/ModelContextProtocolUtils.h` 包含非 `inline` 的自由函数定义（survey 阶段记录的 hunch）。如果该 header 被多个 .cpp 包含且函数未 `inline / static`，链接期会报 multiple definition。当前仅核心模块内部使用，所以没暴。但**自定义 Tool 若也 include 该 header**就可能踩到。

**对策**：除非必要不要 include 内部 utils header；用 public 接口。

### 5.2 Resource 缓存的轻微一致性窗口

`resources/read` 先查 `LastResourceDescriptorList`（上次 list 的结果，`ModelContextProtocolServer.cpp:976`），未命中再 fallback。如果 provider 在 list 和 read 之间增删了资源，可能导致：
- 已存在的资源被报 `ResourceNotFound`（fallback 会找回来，所以是 fallback 后正确）
- 已删除的资源仍能命中缓存里那个 provider 然后 provider 自己再 error 出来

不构成正确性问题，但可能影响调试体验。

### 5.3 Eager 模式下 tool 数量上限

没有显式上限。`tools/list` 有 base64-cursor 分页（`PaginationPageSize` CVar），但**LLM 一次性看 inputSchema 的 token 量**没人替你拦。Eager 模式下，假如装了 5 个大 toolset、每个 30 tool、平均 schema 2KB → ~300KB 描述塞 context。**这是 deferred 模式默认开的根本原因**。

### 5.4 Tool callback 在哪个线程

`Tool->RunAsync` 在 GameThread / Tick 线程（HTTP server 的 request dispatcher 通常 marshal 到 game thread）。`OnComplete` 可以从任意线程调（`FHttpResultCallback` 内部线程安全），但 server 的 lambda 体内会做 `FindSession` 等容器操作——所以**`OnComplete` 必须由 server 持有的执行域调度回 GameThread 才安全**。当前实现没有在 callback 入口加 `IsInGameThread()` 断言。

**对策**：自己的 RunAsync 在 IO 线程拿到结果后，`AsyncTask(ENamedThreads::GameThread, ...)` 再调 `OnComplete`。

## 6. 客户端兼容性

支持 5 个客户端（`ModelContextProtocolClientConfig.h:8-21`，均需支持 Streamable HTTP transport）：

| Client | 文件 | 备注 |
|---|---|---|
| Claude Code | `.mcp.json` | 推荐；Anthropic 官方实现 |
| Cursor | `.cursor/mcp.json` | |
| VSCode / Copilot | `.vscode/mcp.json` | |
| Gemini CLI | `.gemini/settings.json` | |
| Codex CLI | `.codex/config.toml` | **write-once**，已存在不覆盖 |

**Claude Desktop 不能直接用**——它默认走 stdio transport，需要 mcp-remote 这种 adapter 桥到 HTTP。

## 7. 部署清单（"什么时候不该上"）

不要在以下场景启用：

- ❌ Shipping build（NoRedist + 鉴权缺失）
- ❌ 共享开发机器、未做防火墙隔离
- ❌ 关键素材库的 read/write 权限工具（除非配合代码 review 流程）
- ❌ 在不受信任的 LLM 客户端上调用敏感 tool（LLM 提示注入会让它执行你没意识到的工具调用）

适合启用：

- ✓ 单机开发流：让 Claude Code 在你电脑上读关卡 / 跑测试 / 改 BP
- ✓ CI 临时启用 + 防火墙隔离：让 LLM 跑预发布检查
- ✓ 教学 / demo

## 8. 升级到下个引擎版本的迁移信号

留意这几个文件的 diff，它们决定 API 是否 break：

| 文件 | 关注点 |
|---|---|
| `IModelContextProtocolTool.h` | 任何 virtual 签名变化 = 你的 Tool 类要改 |
| `IModelContextProtocolResourceProvider.h` | 同上 |
| `ModelContextProtocolToolResults.h` | `MakeXxxResult` 入参变化 |
| `IModelContextProtocolModule.h` | `AddTool/RemoveTool/OnRefreshTools` 签名 |
| `ModelContextProtocol.uplugin` | `IsExperimentalVersion` 翻 `false`、`NoRedist` 翻 `false` 都是重要信号 |
| `ModelContextProtocol.h` | `ProtocolVersion` 升级，看 changelog 决定要不要新增能力 |

