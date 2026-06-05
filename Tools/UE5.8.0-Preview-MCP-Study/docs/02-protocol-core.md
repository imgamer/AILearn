# 02 — 协议核心

本章只讨论 `ModelContextProtocol` 模块的运行时层：HTTP 路由、JSON-RPC 分发、Session 生命周期、Tool / Resource 接口。引擎层与 Editor 层在后续章节展开。

## 1. 传输栈

| 层 | 实现 | 关键文件 |
|---|---|---|
| 物理传输 | UE 自带 `HTTPServer` 模块的 `IHttpRouter`，绑定单端口 | `ModelContextProtocolServer.cpp:397-412` |
| HTTP 动词 | `POST /mcp`（JSON-RPC 请求）、`GET /mcp`（保留但返回 405）、`DELETE /mcp`（关闭会话） | `ModelContextProtocolServer.cpp:402-409`、`:1044-1095` |
| MIME | 请求体 `application/json`；`tools/call` 的响应是 `text/event-stream`（SSE 单连接复用） | `ModelContextProtocolServer.cpp:148`、`:863-867` |
| 反向通道 | **不是**独立 SSE endpoint；而是把 `tools/call` 的 POST 响应 _保持打开_，用 `EHttpServerResponseFlags::MultipleWriteStream` 把后续 progress / 结果继续往这条响应里写 | `ModelContextProtocolServer.cpp:863-869`、`:910-916` |
| 会话标识 | HTTP header `Mcp-Session-Id`（GUID）+ `Mcp-Protocol-Version`（协商后的版本） | `ModelContextProtocolServer.cpp:22-23` |

**没有**独立 `GET /sse` endpoint：

```cpp
// ModelContextProtocolServer.cpp:1044-1054
bool FModelContextProtocolServer::ProcessGetRequest(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete)
{
    if (!UE::ModelContextProtocol::Private::ValidateOriginHeader(Request, OnComplete))
    {
        return true;
    }
    // We do not currently support sse on a separate endpoint
    UE::ModelContextProtocol::Private::CompleteWithResponseCode(OnComplete, EHttpServerResponseCodes::BadMethod);
    return true;
}
```

意味着客户端必须支持"用 POST 的响应通道当 SSE 用"的 Streamable HTTP transport 模式。这是 MCP 2025-06-18 之后引入的形式。

## 2. Origin 校验（唯一的访问控制）

服务端没有 OAuth、Bearer 或 API Key 鉴权，唯一的访问控制是 **Origin header 白名单**，目的是防止 DNS rebinding 攻击：

```cpp
// ModelContextProtocolServer.cpp:45-93 (节选)
bool ValidateOriginHeader(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete)
{
    const TArray<FString>* OriginHeaders = Request.Headers.Find(TEXT("Origin"));
    if (!OriginHeaders || OriginHeaders->IsEmpty())
    {
        // No Origin header — non-browser client, allow
        return true;
    }
    // ... 解析 host，剥 [::1] 这种 IPv6 括号 ...
    if (Host == TEXT("localhost") || Host == TEXT("127.0.0.1") || Host == TEXT("[::1]"))
    {
        return true;
    }
    // 否则 403
}
```

**后果**：
- 浏览器内 fetch（必带 Origin）只允许 `localhost / 127.0.0.1 / [::1]`。
- CLI 客户端（curl、Claude Code、Cursor）通常不带 Origin → 全部放行。
- 真正的访问边界由 HTTPServer 监听地址决定（默认通常是回环地址）。**不要**把这套配置直接拿去公网暴露。

## 3. JSON-RPC 路由表

入口 `ProcessJsonRpcCall` 在 `ModelContextProtocolServer.cpp:541-611`：

| Method | 处理函数 | 备注 |
|---|---|---|
| `ping` | `ProcessPingJsonRpcCall:613` | 回空 `FModelContextProtocolPingResult` |
| `initialize` | `ProcessInitializeJsonRpcCall:622` | 协商版本、生成 Session GUID、写回 `Mcp-Session-Id` |
| `notifications/initialized` | `ProcessInitializedNotificationJsonRpcCall:658` | Session 状态从 `Initializing`→`Initialized`，触发 `SessionStart` analytics |
| `notifications/cancelled` | `ProcessNotificationCancelledJsonRpcCall:684` | 查 `Session->ActiveRequests`，调 `Tool->CancelAsync(RequestId)` 然后移除 |
| `tools/list` | `ProcessListToolsJsonRpcCall:732` | base64 cursor 分页 |
| `tools/call` | `ProcessToolCallJsonRpcCall:779` | SSE 流式响应，详见 §5 |
| `resources/list` | `ProcessListResourcesJsonRpcCall:922` | base64 cursor 分页 |
| `resources/read` | `ProcessReadResourceJsonRpcCall:959` | 命中 `LastResourceDescriptorList` 缓存，再 fallback 全 provider 扫描 |
| 其它 | 返回 `MethodNotFound` (`-32601`) | `:608-610` |

JSON-RPC 错误码沿用规范，外加 MCP 自定义的 `ResourceNotFound = -32002`（`:96-117`）。

每次进入分发前还要做 `Mcp-Protocol-Version` header 校验（`:556-575`）：如果客户端带了这个 header，必须跟 Session 协商出来的版本完全一致，否则 `InvalidRequest`。`initialize` / `ping` 本身免检。

## 4. Session 模型

```cpp
// ModelContextProtocolSession.h:128-139
struct FModelContextProtocolSession : TSharedFromThis<FModelContextProtocolSession>
{
    FString ID;                                    // GUID (DigitsLower)
    EModelContextProtocolSessionStatus Status;     // Initializing / Initialized
    FString NegotiatedProtocolVersion;             // 2025-11-25 / 2025-06-18 / 2024-11-05
    TSharedPtr<FInternetAddr> ClientAddress;       // 来自 FHttpServerRequest::PeerAddress
    FModelContextProtocolClientCapabilities ClientCapabilities;
    TMap<FModelContextProtocolToolRequestId, FModelContextProtocolToolContext> ActiveRequests;
};
```

生命周期：
1. **`initialize`** → server `new FModelContextProtocolSession`，状态 `Initializing`，写回 header `Mcp-Session-Id`（`ModelContextProtocolServer.cpp:638-654`）
2. **`notifications/initialized`** → 状态翻 `Initialized`，记 `SessionStart`（`:674-677`）
3. **`tools/call`** → 创建 `FModelContextProtocolToolContext`，缓存 `Tool` 指针、`ProgressToken`、SSE 写回 callback（`:844-849`）
4. **`notifications/cancelled`** → 调 `Tool->CancelAsync()` 并从 `ActiveRequests` 移除（`:712-720`）
5. **`DELETE /mcp`** → 移除 Session、记 `SessionEnd`（**仅** Initialized 状态才记，防止 garbage session id 制造幻象事件）（`:1056-1095`）

## 5. `tools/call` 的 SSE 异步流程

这是整个协议最复杂的一处，把它拆开看：

```cpp
// ModelContextProtocolServer.cpp:863-869（节选）
TUniquePtr<FHttpServerResponse> Response = FHttpServerResponse::Create(FString(TEXT("")), UE::ModelContextProtocol::ContentTypeEventStream);
Response->Headers.Add(TEXT("Connection"), { TEXT("keep-alive") });
Response->Headers.Add(TEXT("Cache-Control"), { TEXT("no-cache") });
Response->Headers.Add(McpSessionIdHeader, { SessionId });
EnumAddFlags(Response->Flags, EHttpServerResponseFlags::MultipleWriteStream | EHttpServerResponseFlags::HasAdditionalWrites);
OnComplete(MoveTemp(Response));    // ← 先发一个"空 SSE header"出去，把连接保持打开
```

随后：

```cpp
// ModelContextProtocolServer.cpp:871-917（节选）
TWeakPtr<bool> WeakAlive = AliveGuard;
Tool->RunAsync(ToolRequestId, ToolArguments,
    [this, WeakAlive, RequestId, SessionId, ToolRequestId, ToolName, ToolCallStartTime, OnComplete]
    (const FModelContextProtocolToolResult& Result)
    {
        if (!WeakAlive.IsValid()) { return; }                  // server 已销毁 → 静默 drop
        TSharedPtr<FModelContextProtocolSession> Session = FindSession(SessionId);
        if (!Session.IsValid() || !Session->ActiveRequests.Contains(ToolRequestId))
        {
            return;   // 已 cancel → 静默 drop，**且不记 analytics**
        }
        // ... 构造 jsonrpc result，序列化，封装成 SSE message ...
        TUniquePtr<FHttpServerResponse> ServerResponse = FHttpServerResponse::Create(
            FormatSSEMessage(ResponseStr), ContentTypeEventStream);
        EnumAddFlags(ServerResponse->Flags,
            EHttpServerResponseFlags::MultipleWriteStream | EHttpServerResponseFlags::SkipHeaderWrite);
        OnComplete(MoveTemp(ServerResponse));                   // ← 沿用同一个 OnComplete 继续写流
    });
```

**关键设计点**：
- `AliveGuard` 是个 `TSharedPtr<bool>`（`ModelContextProtocolServer.h` 私有成员），析构时所有 `WeakPtr` 失效。**所有进入 lambda 的 `this` 捕获**必须先 `WeakAlive.IsValid()` 才能用。这避免了 `Server` 已被销毁但 `Tool::RunAsync` 的 promise 仍在 fly 的崩溃。
- `OnComplete` 是 HTTPServer 给的"写回"句柄。把它存进 `FModelContextProtocolToolContext::EventStreamWrite` 后（`:848`），Tick 可以异步往同一条响应里推 progress 帧。
- 取消语义：cancellation 不只是停止处理，还要**禁止补发 analytics**——否则 Cancel 之后到达的 result 会冒充成功被记进去。

### Progress 心跳

`FModelContextProtocolServer::Tick` 每 frame 跑（`:1012-1042`）：

```cpp
if (UE::ModelContextProtocol::ProgressIntervalSeconds > 0.0f) {
    for (TSharedPtr<FModelContextProtocolSession>& Session : Sessions)
        for (auto& [Id, Context] : Session->ActiveRequests)
            if (Context.ProgressToken.IsValid() && Context.EventStreamWrite.IsSet())
                if (Now - Context.LastProgressSeconds >= ProgressIntervalSeconds)
                    SendProgressUpdate(Context.EventStreamWrite, Context.ProgressToken, ++Context.LastProgressValue);
}
```

只有当 client 在 `tools/call` 的 `params._meta.progressToken` 里给了 token，server 才会推 `notifications/progress`。CVar `ModelContextProtocol.ProgressIntervalSeconds`（`ModelContextProtocol.h` 附近 CVar 区，默认见源码）控制频率，置 0 关闭。

## 6. Tool 接口

```cpp
// IModelContextProtocolTool.h:23-97
struct IModelContextProtocolTool : TSharedFromThis<IModelContextProtocolTool>
{
    typedef TFunction<void(const FModelContextProtocolToolResult&)> FResultCallback;

    virtual FString GetName() const = 0;
    virtual FString GetDescription() const = 0;

    // 默认 {"type":"object"}，接受任意参数
    virtual TSharedPtr<FJsonObject> GetInputJsonSchema() const;
    virtual TSharedPtr<FJsonObject> GetOutputJsonSchema() const { return {}; }

    // 同步实现：派生类必须覆盖 Run 或 RunAsync 之一
    virtual FModelContextProtocolToolResult Run(const TSharedPtr<FJsonObject>& Params);

    // 异步实现：默认转发到 Run。覆盖时务必最终 OnComplete 一次。
    virtual void RunAsync(const FModelContextProtocolToolRequestId& RequestId,
                          const TSharedPtr<FJsonObject>& Params,
                          const FResultCallback& OnComplete);

    virtual void CancelAsync(const FModelContextProtocolToolRequestId& RequestId) {}

    // 持有 UObject 的工具必须实现，参与 GC 标记
    virtual void AddReferencedObjects(FReferenceCollector& Collector) {}
};
```

派生姿势：
- **`TSharedFromThis`** ＋ shared-ref 注册：`Module->AddTool(MakeShared<FMyTool>())`，模块持有强引用，调 `RemoveTool` 释放。
- **不是 UObject**：所以 Tool 内部如果持有 UObject 指针，需要覆盖 `AddReferencedObjects` 把它们告诉 GC，否则 cooker 帮不了你。
- **结果构造器**：`UE::ModelContextProtocol::MakeTextResult / MakeImageResult / MakeAudioResult / MakeStructuredContentResult / MakeErrorResult / MakeResourceLinkResult`（`ModelContextProtocolToolResults.h:71-121`）。
- **Name 校验**：`tools/list` 不校，但插件层在 `AddTool` 时调 `ValidateToolName`（`ModelContextProtocol.cpp:9-38`）拒绝不合 spec 的名字。规则：1-128 字符，`[A-Za-z0-9_\-.]`。

## 7. Resource 接口

```cpp
// IModelContextProtocolResourceProvider.h:20-34
struct IModelContextProtocolResourceProvider : TSharedFromThis<IModelContextProtocolResourceProvider>
{
    virtual void ListResources(FModelContextProtocolResourceDescriptorList& OutDescriptors) const = 0;
    virtual TValueOrError<FModelContextProtocolResource, FString> ReadResource(const FString& Uri) const = 0;
};
```

`resources/read` 的实现先查 `LastResourceDescriptorList` 缓存命中哪个 provider，未命中则遍历所有 provider 重新 list 一次找 URI（`ModelContextProtocolServer.cpp:974-990`）——意味着 client 不调 `resources/list` 直接 `resources/read` 也能工作，代价是慢一些。

⚠️ **未实现**：`resources/subscribe`、`notifications/resources/updated`、`notifications/resources/list_changed`。`InitializeResult.Capabilities.Resources` 是空对象（`:653`），不声明任何 sub-capability。

## 8. 启动 / 停止

```cpp
// ModelContextProtocolServer.cpp:388-419
void FModelContextProtocolServer::StartServer(uint32 Port, const FString& UrlPath)
{
    if (HttpRouter.IsValid()) { StopServer(); }                  // 幂等：重启
    HttpRouter = FHttpServerModule::Get().GetHttpRouter(Port);
    MainMcpRoute  = HttpRouter->BindRoute(UrlPath, POST,   ProcessPostRequest);
    SseMcpRoute   = HttpRouter->BindRoute(UrlPath, GET,    ProcessGetRequest);
    DeleteMcpRoute= HttpRouter->BindRoute(UrlPath, DELETE, ProcessDeleteRequest);
    FHttpServerModule::Get().StartAllListeners();
    TickerHandle = FTSTicker::GetCoreTicker().AddTicker(... Tick ...);
}
```

`StopServer`（`:421-462`）逐个 `UnbindRoute`，并对每个仍处于 `Initialized` 的 Session 发 `SessionEnd`。

调用方：
- `ModelContextProtocolEditor` 在 `SetupEditorIntegration()` 里看 `ShouldAutoStartServer()` 后启动（`ModelContextProtocolEditor.cpp:63-70`）。
- 也可以从 C++ 代码直接 `IModelContextProtocolModule::Get()->StartServer(8000, "/mcp")`。
- 命令行：`-StartModelContextProtocolServer`、`-ModelContextProtocolPort=N`（在 `IModelContextProtocolModule` 实现里读，参考 `ModelContextProtocolModule.cpp`）。