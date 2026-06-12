# KBEngine 重写 — 各阶段变迁记录

> **目的**: 按阶段记录每次实现/重构的具体修改，便于追溯"什么时候做了什么"
> **维护规则**: 每完成一个 Phase 或重要修改，必须在对应章节追加条目
> **最后更新**: 2026-06-11

---

## 目录

1. [Phase 1: 基础设施层](#phase-1-基础设施层)
2. [Phase 2: 网络层](#phase-2-网络层)
3. [Phase 3: 服务进程框架](#phase-3-服务进程框架-未开始)
4. [Phase 4: 实体系统](#phase-4-实体系统-已完成)
5. [跨阶段总览](#跨阶段总览)

---

## Phase 1: 基础设施层

> **状态**: ✅ 已完成
> **完成日期**: 2026-06-08
> **测试**: 5 套件 + 1 可选 (crypto), 25+5 用例, 100% 通过

### 1.1 构建系统

| 时间 | 变更类型 | 内容 |
|------|----------|------|
| 2026-06-08 | 新增 | 顶层 `CMakeLists.txt`，C++20 标准 (`CMAKE_CXX_STANDARD 20`) |
| 2026-06-08 | 新增 | `cmake/CompilerWarnings.cmake` — MSVC `/W4 /WX` + GCC/Clang `-Wall -Wextra -Werror -Wshadow` 等 12 项 |
| 2026-06-08 | 新增 | `cmake/Dependencies.cmake` — FetchContent 集成 spdlog v1.13.0 + Google Test v1.14.0 |
| 2026-06-08 | 新增 | CMake 选项 `ENABLE_CRYPTO` (默认 OFF) 控制加密模块 |
| 2026-06-08 | 新增 | CMake 选项 `BUILD_TESTS` (默认 ON) 控制测试构建 |
| 2026-06-08 | 新增 | `install(EXPORT)` 导出 `kbengine-targets.cmake` 供外部 `find_package(kbengine)` 使用 |

### 1.2 common 模块 (kbengine_common 静态库)

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `common/byte_stream.h` (208行) | C++20 concepts 模板序列化，编译期端序处理 (`std::endian`) |
| 2026-06-08 | 新增 | `common/byte_stream.cpp` | 仅包含头文件（header-only 模板） |
| 2026-06-08 | 新增 | `common/object_pool.h` (99行) | 线程安全对象池，`std::unique_ptr` + Guard RAII |
| 2026-06-08 | 新增 | `common/object_pool.cpp` | 仅包含头文件 |
| 2026-06-08 | 新增 | `common/timer_queue.h` (128行) | `std::chrono::steady_clock` + 二叉堆 (`std::push_heap`/`pop_heap`) |
| 2026-06-08 | 新增 | `common/timer_queue.cpp` | 实现文件 |
| 2026-06-08 | 新增 | `common/singleton.h` (26行) | Meyer's Singleton，C++11 线程安全静态局部变量 |
| 2026-06-08 | 新增 | `common/logger.h` (56行) | spdlog 封装，6 级宏 `KBE_LOG_TRACE/DEBUG/INFO/WARN/ERROR/CRITICAL` |

**关键决策：**
- 原始 `MemoryStream` 14 个 `operator<<` 重载 → 1 个 C++20 concepts 模板
- 原始 `Timer + TimersBase + TimerHandle` 三件套 → 单一 `TimerQueue` 类
- 原始自定义 `ThreadMutex` → `std::mutex` (彻底移除)
- 原始 `DebugHelper` (依赖 log4cxx) → `spdlog` (header-only)

### 1.3 thread 模块 (kbengine_thread 静态库)

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `thread/thread_pool.h` (149行) | `std::thread` + `std::packaged_task` + `std::future`，固定大小池 |
| 2026-06-08 | 新增 | `thread/thread_pool.cpp` | 实现文件 |
| 2026-06-08 | 消除 | — | 原始 `pthread`/Win32 thread 平台分支 → `std::thread` 跨平台 |
| 2026-06-08 | 消除 | — | 原始 `ThreadMutex`/`ThreadGuard`/`ThreadTask` → 标准库替代 |

**关键决策：**
- 主线程回调机制: `submitWithCallback(work, onMainThread)` + `processMainThreadCallbacks()` 队列泵送

### 1.4 crypto 模块 (kbengine_crypto 可选静态库)

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `crypto/crypto.h` (141行) | OpenSSL 3.x EVP API 封装 |
| 2026-06-08 | 新增 | `crypto/crypto.cpp` | Blowfish, RSA (EVP_PKEY + RAII), md5/sha1/sha256 自由函数 |
| 2026-06-08 | 合并 | — | 原始 6 个 `.h/.cpp` 对 (blowfish/md5/sha1/rsa/ssl/kbekey) → 单一 `crypto.h` |
| 2026-06-08 | 消除 | — | `ssl.h/cpp` (OpenSSL EVP API 覆盖), `kbekey.h/cpp` (延后到 Phase 2) |

**关键决策：**
- 使用 `std::unique_ptr<EVP_PKEY, PKeyDeleter>` 管理 RSA 密钥生命周期
- RSA 使用 OAEP 填充（推荐的安全填充模式）
- 所有哈希函数返回 `std::string` (RAII 安全的 hex 字符串)

### 1.5 占位模块

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `entitydef/entity_def.h` | `enum class DataTypeId : uint8_t` (14 个数据类型常量) |
| 2026-06-08 | 新增 | `network/network_defs.h` | `ProtocolType`, `ProtocolSubType`, MTU 常量 |
| 2026-06-08 | 新增 | `server/server_app.h` | `enum class ComponentType : uint32_t` (12 个组件类型) |

### 1.6 测试 (5 套件, 25 用例)

| 时间 | 套件 | 用例数 | 覆盖内容 |
|------|------|--------|----------|
| 2026-06-08 | `test_byte_stream` | 10 | 整数读写、浮点、字符串、Blob、打包浮点、边界检查、端序 |
| 2026-06-08 | `test_object_pool` | 4 | 获取/归还、Guard RAII、自定义工厂、最大容量 |
| 2026-06-08 | `test_timer_queue` | 4 | 触发、取消、批量、空队列 |
| 2026-06-08 | `test_logger` | 3 | 初始化、级别设置、6 级宏 |
| 2026-06-08 | `test_thread_pool` | 4 | 任务提交、批量、关闭、主线程回调 |
| 2026-06-08 | `test_crypto` (可选) | 5 | Blowfish 加解密、MD5/SHA1/SHA256、RSA 密钥生成与加解密 |

### 1.7 Phase 1 阶段统计

| 指标 | 数值 |
|------|------|
| 新增文件 | 18 (头文件 9 + 实现 4 + CMakeLists 5) |
| 消除文件 | 30+ (原始 helper、thread 同步原语、Python 2.7 源码等) |
| 代码行数 (核心) | ~750 行 (不含测试) |
| 测试代码行数 | ~600 行 |
| 编译警告 | 0 (`/W4 /WX`) |
| 第三方依赖 | spdlog (FetchContent), googletest (FetchContent), OpenSSL 3.x (可选, 系统包) |

---

## Phase 2: 网络层

> **状态**: ✅ 已完成
> **完成日期**: 2026-06-08
> **测试**: 6 个新套件, 25 个新用例 (累计 11 套件 55 用例, 100% 通过)

### 2.1 构建系统更新

| 时间 | 变更类型 | 内容 |
|------|----------|------|
| 2026-06-08 | 新增 | `cmake/Dependencies.cmake` 添加 ASIO standalone (asio-1-28-2) FetchContent |
| 2026-06-08 | 新增 | `add_library(asio INTERFACE)` + `ASIO_STANDALONE` 宏定义 |
| 2026-06-08 | 新增 | Windows 平台链接 `ws2_32`, `wsock32`, 设置 `_WIN32_WINNT=0x0A00` |
| 2026-06-08 | 新增 | 顶层 `CMakeLists.txt` 添加 `/utf-8` (MSVC) 解决 UTF-8 源码警告 |
| 2026-06-08 | 新增 | `network/CMakeLists.txt` 链接 `kbengine_common` + `asio` (可选 `kbengine_crypto`) |
| 2026-06-08 | 新增 | `tests/network/CMakeLists.txt` 注册 6 个测试目标 |

### 2.2 network 模块 (kbengine_network 静态库)

#### Address — IPv4 地址

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/address.h` | `struct Address { uint32_t ip; uint16_t port; }`，C++20 `<=>` 三路比较 |
| 2026-06-08 | 新增 | `network/address.cpp` | `fromString()`, `ipAsString()` 实现 |
| 2026-06-08 | 新增 | `std::hash<Address>` 特化支持 `unordered_map` |

#### EndPoint — 网络端点

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/endpoint.h` | ASIO TCP/UDP socket 封装，`enum class Type { None, TCP, UDP }` |
| 2026-06-08 | 新增 | `network/endpoint.cpp` | bind/listen/accept/connect/send/recv/sendto/recvfrom 实现 |
| 2026-06-08 | **Bug 修复** | `endpoint.cpp` | `bind()` 新增 `boundAddr_` 保存（listen 后 acceptor 接管 socket，原 `localAddr().port` 返回 0） |
| 2026-06-08 | **Bug 修复** | `endpoint.cpp` | `accept()` 内联实现（原 AcceptImpl 函数引发链接错误） |

#### Packet — 数据包

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/packet.h` (header-only) | 继承 `kbengine::ByteStream`，添加 msgID/tcp/encrypted/bundle 元数据 |
| 2026-06-08 | 消除 | — | 原始 `TCPPacket`/`UDPPacket` 子类合并为单一 Packet (用 `tcp_` 布尔标志区分) |

#### PacketReader — 消息边界解析

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/packet_reader.h` | `readMessageHeader()` + `processMessages()` 接口 |
| 2026-06-08 | 新增 | `network/packet_reader.cpp` | KBEngine 消息边界解析（包含扩展长度处理） |
| 2026-06-08 | **Bug 修复** | `packet_reader.cpp` | `processMessages()` 保存/恢复 `bodyStart` 位置（原 handler 调用后双倍推进读位置） |

#### Bundle — 消息打包器

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/bundle.h` | 12 个 `operator<<` 重载，自动分包，`currMsgBodyLen_` 增量跟踪 |
| 2026-06-08 | 新增 | `network/bundle.cpp` | `newMessage`/`finiMessage`/`appendBlob`/`appendPackXZ` 实现 |
| 2026-06-08 | **Bug 修复** | `bundle.cpp` | 扩展长度（≥65535 字节）编码位置修正：在 0xFFFF 后立即插入 uint32_t（原写入消息体末尾，与解码器不一致） |
| 2026-06-08 | **Bug 修复** | `bundle.h` | 新增 `currMsgBodyLen_` 成员（原 `wpos() - bodyStart` 跨包计算错误） |

#### Channel — 端到端通信通道

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/channel.h` | `enable_shared_from_this`，状态机 New→Connecting→Connected→Disconnecting→Destroyed |
| 2026-06-08 | 新增 | `network/channel.cpp` | ASIO async_receive/async_send，`flushSends()` 批量发送 |
| 2026-06-08 | **Bug 修复** | `channel.cpp` | `accept()` 移除 `startRead()` 调用（同步测试中 io_context 未运行导致 SEH 访问违例） |
| 2026-06-08 | **Bug 修复** | `channel.cpp` | `updateTick()` 超时比较改为 `>=`（原 `>` 不支持 0 秒立即超时） |
| 2026-06-08 | Deslop | `channel.h` | 移除未使用的 `#include <common/timer_queue.h>` 和 `processPendingSends()` 声明 |

#### MessageHandler — 消息注册与分发

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/message_handler_fwd.h` | `MessageHandler` + `MessageHandlers`，`std::function<void(Channel*, Packet&)>` |
| 2026-06-08 | 新增 | `network/message_handler.cpp` | `add`/`find`/`handle`/`main()` 实现 |

#### EventPoller — 事件循环

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/event_poller.h` | `asio::io_context` + `executor_work_guard` 薄封装 (~40 行) |
| 2026-06-08 | 新增 | `network/event_poller.cpp` | `processPendingEvents()` (poll/run_for), `run()`, `stop()` |
| 2026-06-08 | 消除 | — | 原始 `EventDispatcher` 类（ASIO io_context 统一调度替代） |
| 2026-06-08 | 消除 | — | 原始 `InputNotificationHandler`/`OutputNotificationHandler` 接口（lambda 回调替代） |
| 2026-06-08 | Deslop | `event_poller.h/cpp` | 移除空的 `registerForRead/Write`/`deregisterForRead/Write` 方法 |

#### NetworkInterface — 网络管理器

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `network/network_interface.h` | `channelMap_` (Address→Channel) + `channels_` 双重索引 |
| 2026-06-08 | 新增 | `network/network_interface.cpp` | `initialize`/`registerChannel`/`deregisterChannel`/`processChannels` 实现 |
| 2026-06-08 | **Bug 修复** | `network_interface.cpp` | `processChannels()` 收集 `toDeregister` 指针后统一 deregister（原遍历时 deregister 导致迭代器失效） |
| 2026-06-08 | **Bug 修复** | `network_interface.cpp` | `processChannels()` 在 `remove_if` 谓词中同步清除 `channelMap_`（原仅清除 vector） |
| 2026-06-08 | Deslop | `network_interface.h/cpp` | 移除 `poller()` setter 和空的 `acceptLoop()` 方法 |

### 2.3 common/byte_stream.h 扩展

| 时间 | 变更类型 | 文件 | 内容 |
|------|----------|------|------|
| 2026-06-08 | 新增 | `common/byte_stream.h` | `insert(pos, data, len)` 方法 — 在缓冲区指定位置插入字节，调整 rpos/wpos |
| 2026-06-08 | 新增 | `common/byte_stream.h` | `erase(pos, count)` 方法 — 从缓冲区删除字节，调整 rpos/wpos |

> 用途：支持 Bundle 扩展长度协议（在 0xFFFF 后插入 4 字节 uint32_t）

### 2.4 测试 (6 套件, 25 用例)

| 时间 | 套件 | 用例数 | 覆盖内容 |
|------|------|--------|----------|
| 2026-06-08 | `test_endpoint` | 6 | TCP/UDP 初始化、bind 端口、TCP echo server/client、UDP echo |
| 2026-06-08 | `test_packet` | 5 | 默认构造、最大缓冲、msgID、消息头解析、扩展长度 |
| 2026-06-08 | `test_bundle` | 4 | 新消息、多消息、长度回填、打包浮点、Clear |
| 2026-06-08 | `test_message_handler` | 6 | 添加/查找、顺序 ID、查找缺失、分发、未注册分发、单例 |
| 2026-06-08 | `test_channel` | 5 | 创建/销毁、accept、收发、超时检测、Bundle 发送 |
| 2026-06-08 | `test_event_poller` | 5 | 创建/停止、空事件处理、echo server、多连接、定时器集成 |

### 2.5 架构审查 Bug 修复汇总

| 严重度 | 问题 | 修复文件 | 验证 |
|--------|------|----------|------|
| 严重 | 扩展长度编码位置与解码器不一致（编码器写消息体末尾，解码器从 0xFFFF 后读） | `bundle.cpp` | `test_packet.ExtendedLength` |
| 严重 | `processChannels` 遍历时 deregister 导致迭代器失效 | `network_interface.cpp` | 代码审查 |
| 严重 | `finiMessage` bodyLen 跨包计算错误 | `bundle.cpp`/`bundle.h` | `test_bundle.LengthPatch` |
| 中等 | `processMessages` handler 调用后双倍推进读位置 | `packet_reader.cpp` | `test_packet.ReadMessageHeader` |
| 中等 | `processChannels` 清理已销毁 Channel 未同步清除 `channelMap_` | `network_interface.cpp` | 代码审查 |

### 2.6 Deslop 清理（架构审查后）

| 时间 | 文件 | 清理内容 |
|------|------|----------|
| 2026-06-08 | `event_poller.h/cpp` | 移除 `InputNotificationHandler`/`OutputNotificationHandler` 类及其 register/deregister 方法 |
| 2026-06-08 | `channel.h` | 移除未使用的 `#include <common/timer_queue.h>` 和 `processPendingSends()` |
| 2026-06-08 | `packet.h` | 移除未使用的 `#include <memory>` |
| 2026-06-08 | `packet_reader.h` | 移除未使用的 `#include <memory>`, `<vector>`, `fragmentBuffer_`, `readingExtendedLength_` |
| 2026-06-08 | `message_handler_fwd.h` | 移除未使用的 `#include <memory>`, `ByteStream` 前向声明 |
| 2026-06-08 | `address.cpp` | 移除未使用的 `#include <cstring>` |
| 2026-06-08 | `network/CMakeLists.txt` | 移除 `network_defs.cpp`（已改为 header-only） |
| 2026-06-08 | `network_interface.h/cpp` | 移除 `poller()` setter, 空的 `acceptLoop()` 方法 |

### 2.7 文档更新

| 时间 | 文档 | 章节 | 内容 |
|------|------|------|------|
| 2026-06-08 | `KBEngine_Rewrite_Technical_Document.md` | 第 5 章 | 状态 "计划" → "已完成"，新增 9 个组件设计描述、协议格式、架构审查表 |
| 2026-06-08 | `KBEngine_Rewrite_Technical_Document.md` | 目录结构 | network/ 展开为 11 个文件 |
| 2026-06-08 | `KBEngine_Rewrite_Technical_Document.md` | 库依赖图 | 新增 ASIO 依赖说明 |
| 2026-06-08 | `KBEngine_Rewrite_Technical_Document.md` | 测试覆盖表 | 30 → 55 用例 |
| 2026-06-08 | `KBEngine_Source_Mapping.md` | 第 2.2 节 | 新增 Phase 2 网络模块全部映射 (9 组件) |
| 2026-06-08 | `KBEngine_Source_Mapping.md` | 类名映射 | 新增 15 个 Network::* 条目 |
| 2026-06-08 | `KBEngine_Source_Mapping.md` | API 对照 | 新增 EndPoint/Channel/Bundle 3 个 API 表 |
| 2026-06-08 | `KBEngine_Verification_Guide.md` | 第 2 章 | 状态 "未开始" → "已完成"，6 层验证全部填充实际结果 |
| 2026-06-08 | `KBEngine_Rewrite_Beginners_Guide.md` | 项目结构 | network/ 从 1 个文件展开为 10 个 |
| 2026-06-08 | `KBEngine_Rewrite_Beginners_Guide.md` | 阶段表 | Phase 2 → "✅ 已完成" |
| 2026-06-09 | `KBEngine_Phase_Changelog.md` | 全文 | 新建本文档 |

### 2.8 Phase 2 阶段统计

| 指标 | 数值 |
|------|------|
| 新增文件 (源码) | 17 (头文件 10 + 实现 7) |
| 新增文件 (测试) | 6 |
| 消除文件 | 14+ (EventDispatcher, InputNotificationHandler, TCPPacket, UDPPacket, PacketReceiver, PacketSender, ListenerReceiver, EncryptionFilter, ErrorReporter 等) |
| 代码行数 (新增) | ~1500 行 (网络层核心) |
| 测试代码行数 | ~800 行 |
| Bug 修复 | 5 个 (3 严重 + 2 中等) |
| 编译警告 | 0 (`/W4 /WX`) |
| 第三方依赖 | ASIO standalone (asio-1-28-2 FetchContent) |
| 测试通过率 | 100% (55/55) |

---

## Phase 3: 服务进程框架 (已完成)

> **状态**: ✅ 完成
> **完成日期**: 2026-06-09
> **前置**: Phase 1 + Phase 2 验收通过

### 3.1 构建系统更新

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 修改 | `rewrite/server/CMakeLists.txt` | 从 1 个源文件扩展为 5 个（server_app, server_config, signal_handler, shutdown_handler, components） |
| 修改 | `rewrite/tests/CMakeLists.txt` | 添加 `add_subdirectory(server)` |
| 新增 | `rewrite/tests/server/CMakeLists.txt` | 6 个测试可执行文件 |

### 3.2 ServerConfig — 配置加载

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/server/server_config.h` | 配置系统头文件，继承 Singleton，支持 key=value + [section] INI 格式 |
| 新增 | `rewrite/server/server_config.cpp` | 实现 loadFromFile/loadFromString，类型安全的 getString/getInt/getFloat/getBool |

**架构决策**: 原始使用 libxml2 解析三层 XML（kbe.xml + kbengine.xml + kbengine_defs.xml），重写版改用简化的 INI 风格配置，避免引入第三方 XML 库依赖。配置文件保留 `#` 行内注释和 `[section]` 分组语法。

### 3.3 SignalHandler — 跨平台信号处理

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/server/signal_handler.h` | 信号处理头文件，全局单例，多回调注册 |
| 新增 | `rewrite/server/signal_handler.cpp` | std::signal + atomic pending 计数，主线程 process() 派发 |

**架构决策**: 原始每个 ServerApp 子类继承 SignalHandler，新版本改为全局单例。信号回调在 rawHandler 中仅递增原子计数器（可重入安全），实际派发延迟到主循环 process()。

### 3.4 ShutdownHandler — 优雅关闭

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/server/shutdown_handler.h` | 关闭处理器头文件，多阶段步骤队列 |
| 新增 | `rewrite/server/shutdown_handler.cpp` | Running→Begin→InProgress→Completed 状态机 |

**关键改进**: step 回调返回 `false` 表示需重试（原版用轮询标志位），requestShutdown() 幂等（重复调用不改变首次请求时间戳）。

### 3.5 Components — 集群组件注册表

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/server/components.h` | 组件注册表头文件，继承 Singleton |
| 新增 | `rewrite/server/components.cpp` | addComponent/findByType/findByChannel/removeByChannel |

**精简说明**: 原始 Components 约 1200 行，含心跳广播、断线检测、网络发现协议。新版本仅保留注册表核心（CRUD + 回调通知），心跳与发现延后到 Phase 4 由具体 ServerApp 子类实现。

### 3.6 IDAllocator — 分布式 ID 分配

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/server/id_allocator.h` (header-only) | IDAllocator/IDAllocatorFromList/IDServer/IDClient 四个模板 |

**关键改进**: C++20 `concept IntegralId<T>` 约束模板参数，每个类带 `mutable std::mutex` 线程安全保护，alloc() 跳过 0 值（与原版行为一致）。EntityIDClient 延后到 Phase 4。

### 3.7 ServerApp — 服务进程基类

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 重写 | `rewrite/server/server_app.h` | 从 ComponentType 枚举占位扩展为完整基类 |
| 重写 | `rewrite/server/server_app.cpp` | 主循环 + 子系统初始化 + 帧率控制 |

**架构决策**: 
- 原始 ServerApp 继承 6 个基类（SignalHandler/TimerHandler/ShutdownHandler/ChannelTimeOutHandler/ChannelDeregisterHandler/ComponentsNotificationHandler），新版本仅持有子系统智能指针
- 主循环 = `process(timer) → poll(network) → process(thread cb) → process(signal) → onTick() → tick(shutdown)`
- 游戏帧率由 `gameUpdateHertz` 控制（默认 10Hz），`std::this_thread::sleep_for` 精确控制

### 3.8 测试套件

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/tests/server/test_server_config.cpp` | 5 用例：字符串加载、类型读写、EntityApp 配置、文件加载、Clear |
| 新增 | `rewrite/tests/server/test_signal_handler.cpp` | 4 用例：注册派发、多回调、注销停止、pending 计数 |
| 新增 | `rewrite/tests/server/test_shutdown_handler.cpp` | 6 用例：初始状态、触发、幂等、步骤顺序、重试、Reset |
| 新增 | `rewrite/tests/server/test_components.cpp` | 7 用例：添加查找、移除、按类型查询、按 uid 查询、通知回调、ShuttingDown 标记、类型名称 |
| 新增 | `rewrite/tests/server/test_id_allocator.cpp` | 6 用例：顺序分配、跳过 0 值、回收重用、范围分配、范围消费、多段链式 |
| 新增 | `rewrite/tests/server/test_server_app.cpp` | 5 用例：初始化子系统、类型/ID、帧率设置、运行至关闭、外部停止 |

### 3.9 阶段统计

| 指标 | 数值 |
|------|------|
| 新增文件 | 13 个（5 头文件 + 5 cpp 文件 + 1 模板头文件 + 6 测试文件 + 1 CMakeLists） |
| 修改文件 | 3 个（server_app.h/cpp 重写 + tests/CMakeLists.txt） |
| 新增测试套件 | 6 |
| 新增测试用例 | 33 |
| 新增代码行数 | ~1300 行 |
| 累计测试套件 | 17 |
| 累计测试用例 | 88 |
| 构建警告 | 0 (/W4 /WX) |
| 测试通过率 | 100% (88/88) |
| 第三方依赖 | 无新增 |

---

## Phase 4: 实体系统 (已完成)

> **状态**: ✅ 已完成
> **完成日期**: 2026-06-11
> **前置**: Phase 1 + Phase 2 + Phase 3 验收通过
> **说明**: Python 绑定 (pybind11) 已显式延后 — Phase 4 仅包含纯 C++ 实体系统

### 4.1 构建系统更新

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 修改 | `rewrite/entitydef/CMakeLists.txt` | 从 1 个占位源文件扩展为 5 个（data_type, property, method, scriptdef_module, entity） |
| 修改 | `rewrite/tests/CMakeLists.txt` | 添加 `add_subdirectory(entitydef)` |
| 新增 | `rewrite/tests/entitydef/CMakeLists.txt` | 5 个测试可执行文件 |

### 4.2 DataType — 类型系统

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/entitydef/data_type.h` (241行) | DataType 基类（虚函数 addToStream/createFromStream/toString/fromString），DataTypeId/DataTypeCategory 枚举，NumericType<T> 模板（C++20 if constexpr），StringType/UnicodeType/BlobType，Vector2/3/4 类型与结构体，DataTypes 全局注册表 |
| 新增 | `rewrite/entitydef/data_type.cpp` (280行) | registerBuiltins() 注册 16 个内置类型，StringType/UnicodeType/BlobType/VectorType 实现 |
| 消除 | `rewrite/entitydef/entity_def.h` | Phase 1 占位 DataTypeId 枚举 → 完整 data_type.h |
| 消除 | `rewrite/entitydef/entity_def.cpp` | Phase 1 占位文件 |

**架构决策**: 
- 原始 20+ 文件（datatype.h/cpp/inl, datatypes.h/cpp, entity_call.h/cpp, fixedarray.h/cpp, fixeddict.h/cpp 等）合并为 2 个文件
- 原始 Python/PyScript 耦合全部消除（DataType::addToStream 直接接受 void* 而非 PyObject*）
- NumericType<T> 使用 C++20 `if constexpr` 编译期分支处理有符号/无符号/浮点三类
- PropertyValue = `std::variant<monostate, int8_t, int16_t, int32_t, int64_t, uint8_t, uint16_t, uint32_t, uint64_t, float, double, string, u16string, vector<uint8_t>, Vector2, Vector3, Vector4>`

### 4.3 PropertyDescription — 属性描述

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/entitydef/property.h` (112行) | PropertyFlag 枚举（CellPublic/CellPrivate/AllClients/BaseAndClient 等）+ operator\|，PropertyValue variant 类型，DetailLevel 枚举，VolatileInfo 结构体，PropertyDescription 类 |
| 新增 | `rewrite/entitydef/property.cpp` (57行) | addToStream（std::visit 派发到 DataType），createFromStream（按 DataTypeCategory switch 创建对应 variant） |

**架构决策**: addToStream 不写入 utype 前缀（由调用者管理帧格式），createFromStream 不读取 utype（由调用者先读取 utype 再调用）

### 4.4 MethodDescription — 方法描述

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/entitydef/method.h` | MethodExposedType 枚举（None/Exposed/ExposedAndCallerCheck），MethodArg 结构体，MethodDescription 类 |
| 新增 | `rewrite/entitydef/method.cpp` | 最小实现 |

### 4.5 ScriptDefModule — 定义模块

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/entitydef/scriptdef_module.h` (91行) | ScriptDefModule（PropMap/PropUidMap/MethodMap/MethodUidMap/defaults_），EntityDefRegistry 全局单例 |
| 新增 | `rewrite/entitydef/scriptdef_module.cpp` | addProperty/addMethod/findProperty/findMethod/setDefault，EntityDefRegistry::registerModule/find/findByUType |

### 4.6 Entity — 实体基类

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/entitydef/entity.h` (58行) | Entity 类：EntityID(uint64_t)，RemoteCallHandler(function<void(uint16_t,ByteStream&)>)，properties_(unordered_map<uint16_t, PropertyValue>)，dirty_ 标志 |
| 新增 | `rewrite/entitydef/entity.cpp` (100行) | setProperty/getProperty/hasProperty/initDefaults/writeProperties/readProperties/callRemoteMethod |

**架构决策**: 
- 属性存储为 `unordered_map<uint16_t, PropertyValue>`（按 utype 索引）
- writeProperties 格式: count(uint16_t) + [utype(uint16_t) + value]*  (utype 由 writeProperties 写入，addToStream 不再写 utype)
- initDefaults 从 PropertyDescription::defaultVal() 读取默认值

### 4.7 测试套件

| 变更类型 | 文件 | 说明 |
|----------|------|------|
| 新增 | `rewrite/tests/entitydef/test_data_type.cpp` | 9 用例：注册内置类型、Int32/Float/String/Vector3/Blob 序列化往返、toString/fromString、按 ID 查找、别名查找 |
| 新增 | `rewrite/tests/entitydef/test_property.cpp` | 7 用例：构造、Int32 序列化、String 反序列化、VolatileInfo 序列化、标志组合、默认值、Float 属性 |
| 新增 | `rewrite/tests/entitydef/test_method.cpp` | 4 用例：构造、参数、返回类型、Exposed 与调用者检查 |
| 新增 | `rewrite/tests/entitydef/test_scriptdef_module.cpp` | 5 用例：基本属性、属性增删查找、方法增删查找、默认值、EntityDefRegistry 注册查找 |
| 新增 | `rewrite/tests/entitydef/test_entity.cpp` | 7 用例：构造与标识、默认值初始化、属性读写、脏标志、属性序列化往返、远程方法调用、hasProperty |

### 4.8 阶段统计

| 指标 | 数值 |
|------|------|
| 新增文件 | 15 个（5 头文件 + 5 cpp 文件 + 5 测试文件 + 1 CMakeLists） |
| 修改文件 | 2 个（entitydef/CMakeLists.txt + tests/CMakeLists.txt） |
| 消除文件 | 2 个（entity_def.h + entity_def.cpp 占位文件） |
| 新增测试套件 | 5 |
| 新增测试用例 | 32 |
| 新增代码行数 | ~1200 行 |
| 累计测试套件 | 22 |
| 累计测试用例 | 120 |
| 构建警告 | 0 (/W4 /WX) |
| 测试通过率 | 100% (120/120) |
| 第三方依赖 | 无新增 |

---

## 跨阶段总览

### 总体进度

| 阶段 | 状态 | 完成日期 | 套件数 | 用例数 | 累计套件 | 累计用例 |
|------|------|----------|--------|--------|----------|----------|
| Phase 1 | ✅ 完成 | 2026-06-08 | 5 (+1 可选) | 25 (+5) | 5 | 25 |
| Phase 2 | ✅ 完成 | 2026-06-08 | 6 | 25 | 11 | 55 |
| Phase 3 | ✅ 完成 | 2026-06-09 | +6 | 33 | 17 | 88 |
| Phase 4 | ✅ 完成 | 2026-06-11 | +5 | 32 | 22 | 120 |

### 静态库构建状态

| 库 | Phase | 状态 |
|----|-------|------|
| `kbengine_common` | 1 | ✅ 完成 |
| `kbengine_thread` | 1 | ✅ 完成 |
| `kbengine_crypto` (可选) | 1 | ✅ 完成 |
| `kbengine_entitydef` (占位) | 1 | ✅ 完成 (类型定义占位) |
| `kbengine_server` (占位) | 1 | ✅ 完成 (类型定义占位) |
| `kbengine_network` | 2 | ✅ 完成 |
| `kbengine_entitydef` (完整) | 4 | ✅ 完成 |
| `kbengine_server` (完整) | 3 | ✅ 完成 |

### 第三方依赖累计

| 库 | Phase 引入 | 集成方式 | 用途 |
|----|-----------|----------|------|
| spdlog v1.13.0 | 1 | FetchContent | 日志 |
| Google Test v1.14.0 | 1 | FetchContent | 单元测试 |
| OpenSSL 3.x | 1 | 系统包（可选） | 加密 |
| ASIO standalone v1.28.2 | 2 | FetchContent | 网络事件循环 |
| pugixml | 3 (计划) | FetchContent | XML 配置解析 |
| mariadb-connector-c | 3 (计划) | vcpkg | MySQL 客户端 |
| mongocxx | 3 (计划) | vcpkg | MongoDB 客户端 |
| pybind11 | 4 (计划) | FetchContent | Python 绑定 |
| glm | 4 (计划) | FetchContent | 数学库 (Vector2/3/4) |

### 累计消除的原始组件

| Phase | 消除组件类型 | 示例 |
|-------|--------------|------|
| 1 | 平台抽象层 | `KBE_PLATFORM == PLATFORM_WIN32` 分支全部消除 |
| 1 | 自研同步原语 | `ThreadMutex`/`ThreadGuard`/`ThreadTask` → 标准库 |
| 1 | 自研单例机制 | `KBE_SINGLETON_INIT` 宏 → Meyer's Singleton |
| 1 | 自研日志 | `DebugHelper` + log4cxx → spdlog |
| 1 | 自研时间库 | `Timestamp` → `std::chrono` |
| 1 | 内嵌 Python 2.7 源码 | 完整删除 (Phase 4 用 pybind11 + 系统 Python 3.x) |
| 2 | 平台网络封装 | epoll/IOCP 手动封装 → ASIO 统一 |
| 2 | 事件分发框架 | `EventDispatcher`/`InputNotificationHandler`/`OutputNotificationHandler` → lambda 回调 |
| 2 | TCP/UDP 包子类 | `TCPPacket`/`UDPPacket` → 单一 Packet + 布尔标志 |
| 2 | 接收/发送分离 | `PacketReceiver`/`PacketSender` → 合并到 PacketReader/Channel |
| 4 | Python 耦合 | DataType/PyScript 全部消除，PropertyValue 用 std::variant 替代 PyObject |
| 4 | entitydef 文件膨胀 | 原始 20+ 文件合并为 6 个组件（5 头文件 + 5 实现） |

### 关键架构决策时间线

| 时间 | 决策 | 影响 |
|------|------|------|
| 2026-06-08 | 选定 C++20 标准 | 启用 concepts, `if constexpr`, `<=>`, `std::endian`, `std::format` |
| 2026-06-08 | CMake FetchContent 而非 vcpkg | 主要依赖（spdlog/gtest）自动下载，无需用户配置 |
| 2026-06-08 | OpenSSL 设为可选 | 简化默认构建，加密模块按需启用 |
| 2026-06-08 | header-only 优先 | 减少编译依赖，简化分发 |
| 2026-06-08 | 选定 ASIO standalone（非 Boost.Asio） | 避免引入整个 Boost，编译时间可控 |
| 2026-06-08 | 选定 Meyer's Singleton | 消除 `KBE_SINGLETON_INIT` 宏，无需 .cpp 初始化 |
| 2026-06-08 | KCP 延后评估 | 优先保证 TCP/UDP 基本功能，KCP 留待后续 |
| 2026-06-08 | Channel 使用 `shared_ptr` + `enable_shared_from_this` | 确保 ASIO 异步回调期间不被销毁 |
| 2026-06-11 | PropertyValue 使用 std::variant 替代 Python PyObject | 编译期类型安全，消除运行时 Python 类型检查 |
| 2026-06-11 | DataType::addToStream/createFromStream 使用 void* 替代 PyObject* | 纯 C++ 类型系统，不依赖 Python |
| 2026-06-11 | Entity 属性存储使用 unordered_map<uint16_t, PropertyValue> | O(1) 按 utype 查找，简化序列化 |

---

## 维护说明

**何时更新本文档：**
1. 完成一个 Phase 时：在对应章节追加完整记录
2. 修复重要 Bug 时：在对应 Phase 的 Bug 修复表追加条目
3. 引入新依赖时：在"第三方依赖累计"表追加条目
4. 做出重大架构决策时：在"关键架构决策时间线"追加条目
5. 大规模重构时：在对应 Phase 创建子章节记录

**条目格式规范：**
- 时间统一使用 `YYYY-MM-DD` 格式
- 变更类型: `新增` / `修改` / `消除` / `合并` / `Deslop` / `Bug 修复`
- Bug 修复条目必须关联验证方式（测试用例或代码审查）
