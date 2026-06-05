# 05 — 启动与运行时时序

把零散的"哪个回调在什么时候被谁触发"串起来。三张图：模块加载 → 服务启动 → `tools/call` 全流程。

## 1. 模块加载（Editor target）

```mermaid
sequenceDiagram
    autonumber
    participant UE as UE Editor 进程
    participant MCP as ModelContextProtocol 模块
    participant MCPEng as ModelContextProtocolEngine 模块
    participant MCPEd as ModelContextProtocolEditor 模块
    participant TR as ToolsetRegistry 子系统

    UE->>MCP: StartupModule (LoadingPhase=Default)
    Note over MCP: 注册 IModelContextProtocolModule 单例<br/>无 server，无 tool
    UE->>MCPEng: StartupModule
    MCPEng->>UE: FCoreDelegates::OnPostEngineInit.AddLambda
    UE->>MCPEd: StartupModule
    MCPEd->>MCPEd: 注册 Kismet BP 类型覆盖
    MCPEd->>MCP: OnRefreshTools.AddLambda(RegisterTools)
    alt GEditor 已存在
        MCPEd->>MCPEd: SetupEditorIntegration() 立即
    else
        MCPEd->>UE: OnPostEngineInit.AddLambda(SetupEditorIntegration)
    end

    UE-->>UE: ... 引擎继续初始化 ...
    UE->>MCPEng: PostEngineInit 回调
    MCPEng->>MCP: SetAnalyticsProvider(FEngineAnalytics proxy)
    UE->>MCPEd: PostEngineInit 回调 (若 deferred)
    MCPEd->>TR: OnToolsetRegistered.AddLambda(RegisterTools)
    MCPEd->>MCPEd: ToolsetRegistryAdapterManager.RegisterTools()
    alt deferred mode (默认)
        MCPEd->>MCP: AddTool(list_toolsets / describe_toolset / load_toolset)
    else eager mode
        MCPEd->>MCP: AddTool(× N for every toolset's every tool)
    end

    alt ShouldAutoStartServer()
        MCPEd->>MCP: StartServer(Port, UrlPath)
    end
```

来源：`ModelContextProtocolEditor.cpp:17-71`、`ModelContextProtocolEngineModule.cpp:75-129`、`ModelContextProtocolToolsetRegistryAdapter.cpp:138-211`。

## 2. `StartServer` 内部

```mermaid
sequenceDiagram
    autonumber
    participant Caller as 调用方 (Editor / 业务代码)
    participant MCP as IModelContextProtocolModule
    participant Server as FModelContextProtocolServer
    participant HTTP as FHttpServerModule
    participant Tick as FTSTicker

    Caller->>MCP: StartServer(Port=8000, UrlPath="/mcp")
    MCP->>Server: StartServer(Port, UrlPath)
    alt HttpRouter 已存在 (re-start)
        Server->>Server: StopServer() 先清场
    end
    Server->>HTTP: GetHttpRouter(Port)
    Server->>HTTP: BindRoute("/mcp", POST,   ProcessPostRequest)
    Server->>HTTP: BindRoute("/mcp", GET,    ProcessGetRequest)
    Server->>HTTP: BindRoute("/mcp", DELETE, ProcessDeleteRequest)
    Server->>HTTP: StartAllListeners()
    Server->>Tick: AddTicker("ModelContextProtocolServer", 0.0f, Tick)
```

源码：`ModelContextProtocolServer.cpp:388-419`。

## 3. `tools/call` 完整流程（含 SSE 与 cancel）

```mermaid
sequenceDiagram
    autonumber
    participant Client as MCP Client (Claude Code 等)
    participant HTTP as FHttpServerModule
    participant Server as FModelContextProtocolServer
    participant Session as FModelContextProtocolSession
    participant Tool as IModelContextProtocolTool
    participant Tick as Server::Tick

    Client->>HTTP: POST /mcp \n {"method":"initialize", ...}
    HTTP->>Server: ProcessPostRequest → ProcessInitializeJsonRpcCall
    Server->>Session: new (Status=Initializing, ID=GUID)
    Server-->>Client: 200 \n header Mcp-Session-Id=<GUID> \n result.serverCapabilities

    Client->>HTTP: POST /mcp \n {"method":"notifications/initialized"} \n header Mcp-Session-Id
    HTTP->>Server: ProcessInitializedNotificationJsonRpcCall
    Server->>Session: Status=Initialized
    Server->>Server: Analytics::RecordSessionStartEvent
    Server-->>Client: 202 Accepted

    Client->>HTTP: POST /mcp \n {"method":"tools/call", "params":{name, arguments, _meta.progressToken}}
    HTTP->>Server: ProcessToolCallJsonRpcCall
    Server->>Session: ActiveRequests.Add(RequestId, ToolContext{Tool, ProgressToken, EventStreamWrite=OnComplete})
    Server-->>Client: 200 text/event-stream \n Connection:keep-alive \n (空 body)
    Server->>Tool: RunAsync(RequestId, Params, OnComplete=lambda)

    loop 每 frame
        Tick->>Session: 遍历 ActiveRequests
        opt 距上次推送 >= ProgressIntervalSeconds
            Tick-->>Client: SSE notifications/progress \n {progressToken, value=++N}
        end
    end

    alt Tool 正常完成
        Tool->>Server: OnComplete(Result)
        Server->>Server: WeakAlive.IsValid() && Session->ActiveRequests.Contains(RequestId)?
        Server->>Server: Analytics::RecordToolCallEvent(SessionId, ToolName, Duration, Success)
        Server->>Session: ActiveRequests.Remove(RequestId)
        Server-->>Client: SSE message \n {"jsonrpc":"2.0","id":<RequestId>,"result":<Result.json>}
    else 客户端取消
        Client->>HTTP: POST /mcp \n {"method":"notifications/cancelled", "params":{requestId}}
        HTTP->>Server: ProcessNotificationCancelledJsonRpcCall
        Server->>Tool: CancelAsync(RequestId)
        Server->>Session: ActiveRequests.Remove(RequestId)
        Server-->>Client: 202 Accepted
        Note over Server: 之后 Tool 若仍调 OnComplete<br/>由于 ActiveRequests 不再包含 RequestId<br/>结果与 analytics 都被静默 drop
    end

    Client->>HTTP: DELETE /mcp \n header Mcp-Session-Id
    HTTP->>Server: ProcessDeleteRequest
    alt Session 处于 Initialized
        Server->>Server: Analytics::RecordSessionEndEvent
    end
    Server->>Session: Sessions.RemoveAll
    Server-->>Client: 202 Accepted
```

源码定位：
- POST 处理与分发：`ModelContextProtocolServer.cpp:497-611`
- `initialize`：`:622-656`；`notifications/initialized`：`:658-682`
- `tools/call`：`:779-920`（SSE 设置在 `:863-869`，异步 callback 在 `:871-917`）
- progress Tick：`:1012-1042`
- cancel：`:684-730`
- DELETE：`:1056-1095`

## 4. ShutdownModule 倒序

Editor 模块 `ShutdownModule`（`ModelContextProtocolEditor.cpp:73-88`）：
1. 解除 `OnRefreshTools` 订阅
2. 解除 `OnToolsetRegistered` 订阅
3. `ToolsetRegistryAdapterManager.DeregisterTools()` —— `Module->RemoveTool` 所有 adapter

Engine 模块 `ShutdownModule`（`ModelContextProtocolEngineModule.cpp:86-106`）：
1. 解除 `PostEngineInit` 订阅
2. 如果当前 analytics provider 还是自己装的 proxy，调 `SetAnalyticsProvider(nullptr)` 清理。第三方覆盖过则不动。

核心模块 `ShutdownModule` 里 `StopServer()`（`:421-462`）：
- 对每个 `Initialized` 状态的 Session 发 `SessionEnd`
- `RemoveTicker`、`UnbindRoute`、`HttpRouter.Reset()`
- 不主动通知任何活跃 SSE 流——`AliveGuard` 自然失效，后续 callback 被 weak ptr 守住
