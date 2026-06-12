# KBEngine 现代 C++ 重写 — 技术思路与实现文档

> **版本**: 0.1.0
> **日期**: 2026-06-08
> **项目路径**: I:/kbengine/AI-Refactor-KBEngine/rewrite/
> **原始引擎**: KBEngine v1.2.2 (kst 分支)

---

## 目录

1. [项目背景与目标](#1-项目背景与目标)
2. [KBEngine 原始架构分析](#2-kbengine-原始架构分析)
3. [重写总体设计思路](#3-重写总体设计思路)
4. [Phase 1: 基础设施层 — 已完成](#4-phase-1-基础设施层--已完成)
5. [Phase 2: 网络层 — 已完成](#5-phase-2-网络层--已完成)
6. [Phase 3: 服务进程框架 — 已完成](#6-phase-3-服务进程框架--已完成)
7. [Phase 4: 实体系统 — 已完成](#7-phase-4-实体系统--已完成)
8. [附录: 构建与测试](#8-附录-构建与测试)

---

## 1. 项目背景与目标

### 1.1 原始引擎简介

KBEngine 是一款开源的 MMOG（大型多人在线游戏）服务器引擎。核心使用 C++ 编写，游戏逻辑层使用 Python 脚本。引擎采用**多进程分布式动态负载均衡**架构，支持热更新。

### 1.2 重写动机

原始 KBEngine 代码库基于 C++98/03 编写，存在以下改进空间：

| 问题 | 重写方案 |
|------|----------|
| C++98/03 风格，大量手动内存管理 | C++20，智能指针，RAII |
| 自定义整数类型 (uint8→uint8_t 等) | 标准 `<cstdint>` 类型 |
| 手动线程管理，少量同步原语 | `std::thread` + `std::mutex` + `std::condition_variable` |
| 自定义网络层 (epoll 包装) | 考虑 ASIO 或 C++23 网络库 |
| Python 2.7 依赖 | pybind11 支持 Python 3.x |
| CMake 构建系统可维护性 | 现代化 CMake 3.20+ |

### 1.3 重写原则

1. **保持架构兼容**: 多进程分布式模型不变，进程间协议兼容
2. **渐进式替换**: 按阶段实施，每阶段独立可验证
3. **头文件优先**: 核心工具类使用 header-only 模板，减少编译依赖
4. **零警告编译**: `/W4 /WX` (MSVC) 或 `-Wall -Wextra -Werror` (GCC/Clang)
5. **测试驱动**: 每个模块配备单元测试

---

## 2. KBEngine 原始架构分析

### 2.1 进程模型

KBEngine 由以下独立服务器进程组成：

```
                    ┌─────────────┐
                    │   Machine   │  进程守护/服务发现 (UDP广播)
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐     ┌─────▼──────┐    ┌──────▼──────┐
   │ Loginapp │     │ BaseappMgr │    │ CellappMgr  │
   │ (登录服) │     │ (负载均衡) │    │ (空间管理)  │
   └────┬─────┘     └─────┬──────┘    └──────┬──────┘
        │                  │                  │
        │           ┌──────▼──────┐    ┌──────▼──────┐
        │           │  Baseapp×N  │    │  Cellapp×N  │
        │           │ (游戏逻辑)  │    │ (空间模拟)  │
        │           └──────┬──────┘    └──────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐     ┌──────────┐
                    │    DBMgr    │     │ Centermgr│
                    │  (数据库)   │────▶│ (跨服)   │
                    └─────────────┘     └──────────┘
```

**组件职责：**

| 组件 | 职责 |
|------|------|
| **Machine** | 进程守护，UDP 广播服务发现 |
| **Loginapp** | 客户端登录认证，分配 Baseapp |
| **BaseappMgr** | Baseapp 负载均衡，进程间调度 |
| **CellappMgr** | Cellapp 负载均衡，空间分配 |
| **Baseapp** | 游戏逻辑主进程，管理 Entity 的 Base 部分 |
| **Cellapp** | 空间模拟，管理 Entity 的 Cell 部分（AOI、移动） |
| **DBMgr** | 数据库访问代理（MySQL/MongoDB），实体持久化 |
| **Centermgr** | 跨服中心管理器 |
| **Logger** | 日志收集服务 |
| **Interfaces** | 第三方接口网关 |

### 2.2 Entity 模型

KBEngine 的核心是 **Entity（实体）** 系统，采用 BigWorld 风格的 **Base-Cell 分离模型**：

```
     客户端                    服务端
   ┌────────┐           ┌──────────────┐
   │ Player │◄──────────►│   Baseapp    │
   │ Entity │   Base部分  │  ┌────────┐  │
   └────────┘            │  │ Entity  │  │
                         │  │  Base   │  │
                         │  └───┬────┘  │
                         └──────┼───────┘
                                │ 内部通信
                         ┌──────┼───────┐
                         │  ┌───▼────┐  │
                         │  │ Entity  │  │
                         │  │  Cell   │  │
                         │  └────────┘  │
                         │   Cellapp    │
                         └──────────────┘
```

- **Base 部分**: 常驻 Baseapp，处理客户端请求、物品操作、非空间逻辑
- **Cell 部分**: 在 Cellapp 上运行，处理移动、AOI、碰撞、寻路等空间逻辑
- **Ghost 实体**: 当玩家在不同 Cellapp 边界时，其他 Cellapp 创建轻量 Ghost 副本用于 AOI

### 2.3 网络通信架构

```
客户端 ◄──TCP──► Loginapp (登录)
客户端 ◄──TCP/UDP/KCP──► Baseapp (游戏数据)
Baseapp ◄──TCP──► BaseappMgr (负载上报)
Baseapp ◄──TCP──► CellappMgr (空间请求)
Baseapp ◄──TCP──► Cellapp (实体迁移/远程调用)
Baseapp ◄──TCP──► DBMgr (数据读写)
Cellapp ◄──TCP──► Cellapp (跨空间通信)
```

- **Message Handlers**: 基于 ID 的消息分发，支持 TCP/UDP/KCP 三种传输
- **Bundle**: 消息打包器，批量发送减少系统调用
- **Channel**: 端到端通信通道，处理拆包粘包

### 2.4 核心 C++ 库结构

原始引擎的核心 C++ 库位于 `kbe/src/lib/`：

| 库 | 用途 |
|----|------|
| `common` | 字节流、定时器、对象池、单例 |
| `network` | 网络端点、Channel、Bundle、消息处理 |
| `thread` | 线程池、线程安全队列 |
| `entitydef` | 实体定义、数据类型、属性/方法描述 |
| `server` | 服务组件基类、Python 集成 |
| `pyscript` | Python 脚本引擎封装 |
| `navigation` | 寻路 (Recast/Detour) |
| `client_lib` | 客户端 SDK |
| `dbmgr_lib` | 数据库管理接口 |
| `math` | 数学库 (Vector2/3/4, Matrix) |
| `helper` | 调试辅助、配置文件解析 |

### 2.5 关键技术特性

1. **数据序列化**: 自定义二进制流，支持基本类型、字符串、Blob、打包浮点压缩
2. **实体属性同步**: 基于属性变化标记的增量同步（Ghost 仅同步 AOI 相关属性）
3. **远程方法调用**: 客户端→Base、Base→Cell、Cell→Client 四种调用方向
4. **动态负载均衡**: BaseappMgr/CellappMgr 根据 CPU/内存/实体数自动分配
5. **热更新**: Python 脚本重载、实体属性/方法热更新
6. **多数据库支持**: MySQL（默认）、MongoDB（kst 分支新增）

---

## 3. 重写总体设计思路

### 3.1 技术选型

| 组件 | 原始方案 | 重写方案 | 理由 |
|------|----------|----------|------|
| 语言标准 | C++98/03 | C++20 | concepts, if constexpr, std::endian, ranges |
| 构建系统 | CMake 2.8+ | CMake 3.20+ | FetchContent, 现代 target 模式 |
| 序列化 | 自定义 MemoryStream | ByteStream (C++20 concepts) | 模板化, 类型安全 |
| 日志 | 自定义 DebugHelper | spdlog 1.13.0 | 工业级, header-only, 高性能 |
| 加密 | 内嵌 OpenSSL 1.x | OpenSSL 3.x (可选) | 现代 EVP API |
| 测试 | 无 | Google Test 1.14.0 | xUnit 风格, 广泛使用 |
| 线程 | pthread (Linux) / Win32 Thread | std::thread + std::mutex | 跨平台标准库 |
| 定时器 | 自定义 Timer | TimerQueue (std::chrono) | 类型安全的时间操作 |
| Python 绑定 | 自定义 PyScript | pybind11 (Phase 4) | 现代 C++/Python 互操作 |
| 网络 | epoll (Linux) / IOCP (Win) | 待定 (ASIO 或 C++23) | Phase 2 确定 |

### 3.2 四阶段路线图

```
Phase 1: 基础设施层 (已完成)        Phase 2: 网络层
┌─────────────────────────┐        ┌─────────────────────────┐
│ CMake + C++20 构建      │        │ ASIO 事件循环           │
│ ByteStream 字节流       │───────►│ TCP/UDP/KCP Channel     │
│ ObjectPool 对象池       │        │ Bundle 消息打包         │
│ TimerQueue 定时器       │        │ MessageHandler 分发     │
│ Logger (spdlog)         │        │ 网络协议兼容原始引擎    │
│ Crypto (OpenSSL 3.x)    │        └─────────────────────────┘
│ ThreadPool 线程池       │
│ Singleton 单例          │                  │
└─────────────────────────┘                  ▼
                                    Phase 3: 服务进程框架
         ┌──────────────────────────────────────────────┐
         │ ServerApp 基类 (配置/信号/生命周期)          │
         │ Component 注册与发现                         │
         │ 各组件进程实现 (Loginapp/Baseapp/Cellapp...) │
         │ DBMgr 数据库代理 (MySQL/MongoDB)             │
         │ Machine 进程守护                             │
         └──────────────────────────────────────────────┘
                                    │
                                    ▼
                          Phase 4: 实体系统 + Python
         ┌──────────────────────────────────────────────┐
         │ DataType 类型系统                            │
         │ Entity 实体 (Base/Cell 分离)                 │
         │ PropertyDescription / MethodDescription      │
         │ AOI / Ghost 实体同步                         │
         │ pybind11 Python 3.x 绑定                     │
         │ 远程方法调用 (Client/Base/Cell)              │
         └──────────────────────────────────────────────┘
```

### 3.3 目录结构

```
rewrite/
├── CMakeLists.txt              # 顶层 CMake (C++20, FetchContent)
├── cmake/
│   ├── CompilerWarnings.cmake  # 编译警告策略 (/W4 /WX 或 -Wall -Werror)
│   └── Dependencies.cmake      # spdlog, googletest
├── common/                     # kbengine_common 静态库
│   ├── byte_stream.h/.cpp      # 二进制字节流
│   ├── object_pool.h/.cpp      # 线程安全对象池
│   ├── timer_queue.h/.cpp      # 定时器队列
│   ├── singleton.h             # CRTP 单例模板
│   └── logger.h                # spdlog 封装
├── crypto/                     # kbengine_crypto 静态库 (可选)
│   └── crypto.h/.cpp           # Blowfish, RSA, MD5/SHA
├── thread/                     # kbengine_thread 静态库
│   └── thread_pool.h/.cpp      # 线程池
├── entitydef/                  # kbengine_entitydef 静态库 (Phase 4 完成)
│   ├── CMakeLists.txt
│   ├── data_type.h/.cpp        # DataType 类型系统 (16 个内置类型)
│   ├── property.h/.cpp         # PropertyDescription + VolatileInfo
│   ├── method.h/.cpp           # MethodDescription
│   ├── scriptdef_module.h/.cpp # ScriptDefModule + EntityDefRegistry
│   └── entity.h/.cpp           # Entity 基类
├── network/                    # kbengine_network 静态库 (Phase 2 完成)
│   ├── CMakeLists.txt
│   ├── address.h / address.cpp              # IPv4 地址 + hash
│   ├── endpoint.h / endpoint.cpp            # TCP/UDP socket 封装
│   ├── packet.h                             # KBEngine 协议数据包
│   ├── packet_reader.h / packet_reader.cpp  # 消息边界解析
│   ├── bundle.h / bundle.cpp                # 消息打包器
│   ├── message_handler_fwd.h / message_handler.cpp  # 消息注册与分发
│   ├── channel.h / channel.cpp              # 端到端通信通道
│   ├── event_poller.h / event_poller.cpp    # ASIO 事件循环
│   ├── network_interface.h / network_interface.cpp  # 网络管理器
│   └── network_defs.h                       # 协议常量/枚举
├── server/                     # kbengine_server 静态库 (Phase 3 完成)
│   ├── CMakeLists.txt
│   ├── server_app.h/.cpp       # 服务基类（主循环/初始化/关闭）
│   ├── server_config.h/.cpp    # INI 风格配置加载
│   ├── signal_handler.h/.cpp   # 跨平台信号处理
│   ├── shutdown_handler.h/.cpp # 多阶段优雅关闭
│   ├── components.h/.cpp       # 集群组件注册表
│   └── id_allocator.h          # 分布式 ID 分配（header-only 模板）
└── tests/
    ├── common/                 # ByteStream, ObjectPool, TimerQueue, Logger 测试
    ├── crypto/                 # Blowfish, RSA, MD5/SHA 测试
    ├── thread/                 # ThreadPool 测试
    ├── network/                # EndPoint, Packet, Bundle, MessageHandler, Channel, EventPoller 测试
    ├── server/                 # ServerConfig, SignalHandler, ShutdownHandler, Components, IDAllocator, ServerApp 测试
    └── entitydef/              # DataType, Property, Method, ScriptDefModule, Entity 测试
```

### 3.4 库依赖关系

```
                   ┌──────────────┐
                   │ kbengine_    │
                   │ common       │──── spdlog
                   └──┬───┬───┬──┘
                      │   │   │
         ┌────────────┘   │   └────────────┐
         ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐     ┌──────────────┐
   │ kbengine │    │ kbengine │     │ kbengine     │
   │ _thread  │    │ _network │────▶│ _crypto      │
   └────┬─────┘    └────┬─────┘     │ (可选)       │
        │               │           └──────────────┘
        │          ┌────▼─────┐
        │          │ kbengine │
        └─────────►│ _entitydef│
                   └────┬─────┘
                        │
                   ┌────▼─────┐
                   │ kbengine │
                   │ _server  │
                   └──────────┘
```

**依赖说明：**
- `kbengine_network` 依赖 `kbengine_common`（ByteStream）和 `asio`（FetchContent）
- `kbengine_network` 可选依赖 `kbengine_crypto`（`ENABLE_CRYPTO=ON` 时）
- 所有库通过 `target_link_libraries(... PUBLIC ...)` 传递依赖

---

## 4. Phase 1: 基础设施层 — 已完成

### 4.1 构建系统

**CMakeLists.txt 关键配置：**

```cmake
cmake_minimum_required(VERSION 3.20)
project(kbengine-ng VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(ENABLE_CRYPTO "Build with OpenSSL cryptography support" OFF)
option(BUILD_TESTS "Build unit tests" ON)
```

**依赖管理 (FetchContent):**

```cmake
# spdlog v1.13.0 — 高性能 C++ 日志库
FetchContent_Declare(spdlog
    GIT_REPOSITORY https://github.com/gabime/spdlog.git
    GIT_TAG v1.13.0
    GIT_SHALLOW TRUE
)

# Google Test v1.14.0 — C++ 单元测试框架
FetchContent_Declare(googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
    GIT_SHALLOW TRUE
)
```

**编译警告策略：**

```cmake
# MSVC: /W4 /WX (警告等级4 + 警告即错误)
# GCC/Clang: -Wall -Wextra -Wpedantic -Werror -Wshadow 等 12 项
function(set_project_warnings target_name)
    if(MSVC)
        target_compile_options(${target_name} PRIVATE /W4 /WX)
    else()
        target_compile_options(${target_name} PRIVATE
            -Wall -Wextra -Wpedantic -Werror -Wshadow
            -Wnon-virtual-dtor -Wold-style-cast -Wcast-align
            -Wunused -Woverloaded-virtual -Wconversion
            -Wsign-conversion -Wnull-dereference -Wdouble-promotion
            -Wformat=2 -Wmisleading-indentation
        )
    endif()
endfunction()
```

### 4.2 ByteStream — 二进制字节流

原始 KBEngine 的核心序列化组件是 `MemoryStream`，使用手动内存管理和运行时类型判断。重写版本使用 C++20 特性彻底重构。

**设计思路：**

1. **模板化序列化**: 使用 `template<typename T> requires std::integral<T>` 概念约束，一个模板覆盖所有整数类型
2. **编译期端序处理**: 使用 `std::endian::native` 在编译期判断，仅在 big-endian 平台执行字节交换（零运行时开销）
3. **安全边界检查**: 读取时检查边界，超界抛出 `std::out_of_range`
4. **KBEngine 协议兼容**: 保持打包浮点压缩、长度前缀字符串、Blob 格式一致

**核心实现：**

```cpp
// 整数序列化 — C++20 concepts 约束，编译期端序处理
template<typename T> requires std::integral<T>
ByteStream& operator<<(T val) {
    if constexpr (std::endian::native == std::endian::big) {
        T le = to_little_endian(val);  // 仅在 big-endian 平台编译
        write(&le, sizeof(T));
    } else {
        write(&val, sizeof(T));
    }
    return *this;
}
```

**打包浮点压缩** — 匹配 KBEngine 网络格式：

```cpp
// 将 float 乘以 10 存储为 int16_t，精度 0.1
void appendPackXZ(float x, float z) {
    int16_t sx = static_cast<int16_t>(x * 10.0f);
    int16_t sz = static_cast<int16_t>(z * 10.0f);
    *this << sx << sz;
}
```

**支持的类型：**
- 整数: `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t`, `int8_t`, `int16_t`, `int32_t`, `int64_t`
- 浮点: `float`, `double`
- 字符串: `std::string` (uint32_t 长度前缀)
- 二进制: Blob (uint32_t 长度前缀)

### 4.3 ObjectPool — 线程安全对象池

替代原始引擎的手动对象池，使用 RAII 和智能指针。

**设计思路：**

1. **预分配 + 按需扩展**: 构造时预分配 initSize 个对象，池空时通过工厂函数创建新对象
2. **自动缩减**: 每 5 分钟检查一次，将超过 initSize 的闲置对象释放
3. **最大容量**: maxSize 控制池上限，超过则直接丢弃归还对象
4. **Guard RAII 包装器**: `acquireGuard()` 返回 Guard 对象，离开作用域自动归还
5. **自定义工厂**: `setFactory()` 支持自定义对象构造逻辑

```cpp
// 使用示例
ObjectPool<MyObj> pool(16, 1024);
{
    auto guard = pool.acquireGuard();
    guard->doSomething();
}  // 自动归还

pool.setFactory([]() { return std::make_unique<MyObj>(42); });
```

### 4.4 TimerQueue — 定时器队列

使用 `std::chrono` 和二叉堆实现。

**设计思路：**

1. **二叉堆排序**: 使用 `std::push_heap`/`std::pop_heap` 维护按过期时间排序的最小堆
2. **惰性取消**: `cancel()` 仅标记 `cancelled = true`，在 `process()` 或 `purgeCancelled()` 时清理
3. **重复定时器**: 支持 `repeatInterval`，到期后自动重新调度
4. **类型安全的时间操作**: 基于 `std::chrono::steady_clock`

```cpp
// 使用示例
TimerQueue tq;
auto id = tq.add(100ms, 50ms, [](TimerId id, void* data) {
    // 每 50ms 触发一次，首次延迟 100ms
});
tq.process();  // 处理所有到期定时器
```

### 4.5 Logger — 日志系统

封装 spdlog，提供引擎统一的日志接口。

**设计思路：**

1. **双输出**: 控制台（彩色）+ 文件
2. **可配置级别**: Trace / Debug / Info / Warn / Error / Critical
3. **宏接口**: `KBE_LOG_TRACE`, `KBE_LOG_DEBUG`, `KBE_LOG_INFO`, `KBE_LOG_WARN`, `KBE_LOG_ERROR`, `KBE_LOG_CRITICAL`

### 4.6 Singleton — 单例模板

使用 CRTP 模式 + Meyer's Singleton（C++11 保证线程安全）。

```cpp
template<typename T>
class Singleton {
public:
    static T& instance() {
        static T inst;  // C++11 保证线程安全的静态局部变量初始化
        return inst;
    }
protected:
    Singleton() = default;
    ~Singleton() = default;
};
```

### 4.7 Crypto — 加密模块

封装 OpenSSL 3.x EVP API（可选模块，`ENABLE_CRYPTO=OFF` 默认禁用）。

**已实现接口：**

| 组件 | 说明 |
|------|------|
| `Blowfish` | 对称加密，ECB 模式，8 字节块 |
| `RSA` | 非对称加密，EVP_PKEY RAII 管理，OAEP 填充 |
| `md5()` | MD5 哈希，返回 32 位 hex 字符串 |
| `sha1()` | SHA-1 哈希，返回 40 位 hex 字符串 |
| `sha256()` | SHA-256 哈希，返回 64 位 hex 字符串 |

**RSA 实现要点：**
- 使用 `std::unique_ptr<EVP_PKEY, PKeyDeleter>` 管理密钥生命周期
- 两阶段加密/解密：先获取输出长度，再分配缓冲区
- OAEP 填充模式（推荐的安全填充）

### 4.8 ThreadPool — 线程池

**设计思路：**

1. **固定大小池**: 构造时创建 N 个工作线程
2. **任务提交**: `submit(F, Args...)` 返回 `std::future<ReturnType>`
3. **主线程回调**: `submitWithCallback(workFunc, onMainThread)` — 任务完成后将回调推入 `mainThreadCallbacks_` 队列，由主线程调用 `processMainThreadCallbacks()` 执行
4. **优雅关闭**: `shutdown()` 设置停止标志，通知所有工作线程，join 等待完成

```cpp
ThreadPool pool(4);

// 提交任务，获取 future
auto future = pool.submit([](int x) { return x * x; }, 10);
int result = future.get();  // 100

// 提交带主线程回调的任务
pool.submitWithCallback(
    []() { /* 耗时 DB 操作 */ },
    []() { /* 主线程处理结果 */ }
);
pool.processMainThreadCallbacks();  // 主线程泵送回调
```

### 4.9 占位模块

为 Phase 2-3 准备的命名空间和类型定义：

**entitydef/entity_def.h** — 数据类型 ID 枚举：
```cpp
enum class DataTypeId : uint8_t {
    FixedArray = 1, FixedDict = 2, String = 3, Digit = 4,
    Blob = 5, Python = 6, Vector2 = 7, Vector3 = 8, Vector4 = 9,
    Unicode = 10, EntityCall = 11, PyDict = 12, PyTuple = 13, PyList = 14,
};
```

**network/network_defs.h** — 网络协议定义：
```cpp
enum class ProtocolType : uint8_t { TCP = 0, UDP = 1 };
enum class ProtocolSubType : uint8_t { Default = 0, UDP = 1, KCP = 2 };
constexpr uint16_t PACKET_MAX_SIZE_TCP = 1460;
constexpr uint16_t PACKET_MAX_SIZE_UDP = 1472;
```

**server/server_app.h** — 服务组件类型：
```cpp
enum class ComponentType : uint32_t {
    Baseapp = 1, BaseappMgr = 2, Cellapp = 3, CellappMgr = 4,
    Dbmgr = 5, Loginapp = 6, Logger = 7, Machine = 8,
    Interfaces = 9, Bots = 10, Centermgr = 11, Kbcmd = 12,
};
```

---

## 5. Phase 2: 网络层 — 已完成

### 5.1 目标

实现与原始 KBEngine 协议兼容的网络层，使用 ASIO standalone 替代原始 epoll/IOCP 手动封装。

### 5.2 技术选型

**事件循环方案：ASIO standalone (asio-1-28-2)**

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| ASIO (standalone) | 跨平台，异步模型成熟，头文件可用 | 额外依赖，模板编译慢 | ✅ 采用 |
| epoll + IOCP 手写 | 无额外依赖，完全控制 | 两套实现，维护成本高 | ❌ |
| C++23 `std::net` | 标准库 | 编译器支持有限 | ❌ |

ASIO 通过 CMake FetchContent 集成，不需要 Boost：

```cmake
FetchContent_Declare(
    asio
    GIT_REPOSITORY https://github.com/chriskohlhoff/asio.git
    GIT_TAG asio-1-28-2
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(asio)
add_library(asio INTERFACE)
target_compile_definitions(asio INTERFACE ASIO_STANDALONE)
if(WIN32)
    target_link_libraries(asio INTERFACE ws2_32 wsock32)
endif()
```

### 5.3 核心组件实现

#### Address — IPv4 地址

```cpp
struct Address {
    uint32_t ip = 0;
    uint16_t port = 0;

    Address() = default;
    Address(uint32_t i, uint16_t p) : ip(i), port(p) {}
    Address(const std::string& ipStr, uint16_t p);

    std::string ipAsString() const;
    static Address fromString(const std::string& ipStr, uint16_t port);
    auto operator<=>(const Address&) const = default;
    bool isNone() const { return ip == 0 && port == 0; }
};
```

使用 `<=>` (C++20 三路比较) 实现完整比较运算，`std::hash<Address>` 特化支持 `unordered_map` 查找。

#### EndPoint — 网络端点

封装 ASIO TCP/UDP socket，提供同步操作接口：

```cpp
class EndPoint {
public:
    enum class Type { None, TCP, UDP };

    bool init(Type type, asio::io_context& ioCtx);
    void close();

    // 服务端
    bool bind(uint16_t port);
    bool listen(int backlog = 128);
    std::unique_ptr<EndPoint> accept(Address& addr);

    // 客户端
    bool connect(const std::string& ip, uint16_t port);

    // TCP 收发
    int send(const void* data, size_t len);
    int recv(void* data, size_t len);

    // UDP 收发
    int sendto(const void* data, size_t len, uint16_t port, uint32_t ip);
    int sendto(const void* data, size_t len, const Address& addr);
    int recvfrom(void* data, size_t len, Address& addr);
};
```

**关键设计决策：**
- `listen()` 关闭 TCP socket 后将端口转移给 acceptor，同时保存 `boundAddr_` 供 `localPort()` 查询
- `accept()` 返回新的 EndPoint（已连接），通过 `tcpSocket()` 引用访问底层 socket
- 所有操作使用 `asio::error_code` 非异常错误处理

#### Packet — 数据包

```cpp
class Packet : public kbengine::ByteStream {
public:
    Packet() = default;
    explicit Packet(size_t capacity) : kbengine::ByteStream(capacity) {}

    uint16_t msgID() const;
    bool isTCPPacket() const;
    bool encrypted() const;
    size_t maxBufferSize() const;  // TCP=1460, UDP=1472
};
```

继承 ByteStream 获得序列化能力，增加网络层元数据（消息ID、加密标志、关联 Bundle）。

#### PacketReader — 消息边界解析

KBEngine TCP 流没有包头，消息边界由内联的 MessageID + MessageLength 标识：

```
普通消息: [msgID:2B][bodyLen:2B][body:bodyLen B]
扩展消息: [msgID:2B][0xFFFF:2B][bodyLen:4B][body:bodyLen B]
```

```cpp
class PacketReader {
public:
    bool readMessageHeader(Packet& packet, uint16_t& outMsgID, uint32_t& outMsgLen);
    size_t processMessages(MessageHandlers* pMsgHandlers, Packet& packet);
};
```

- 当 `bodyLen == 65535` (NETWORK_MESSAGE_MAX_SIZE) 时触发扩展长度，再读 4 字节 uint32_t
- `processMessages` 循环解析流中的消息，保存/恢复读位置避免半包丢失

#### Bundle — 消息打包器

支持多条消息累积打包，超过 MTU 自动分包：

```cpp
class Bundle {
public:
    void newMessage(const MessageHandler& msgHandler);
    void finiMessage(bool isSend = true);

    Bundle& operator<<(uint8_t val);   // 所有整数/浮点类型
    Bundle& operator<<(const std::string& val);
    void appendBlob(const void* data, size_t len);
    void appendPackXZ(float x, float z);
    void appendPackY(float y);
    void appendPackXYZ(float x, float y, float z);
};
```

**关键设计：**
- `newMessage()` 写入 MessageID，预留 2 字节长度占位符
- `finiMessage()` 回填消息长度（跟踪 `currMsgBodyLen_` 增量计算）
- `onPacketAppend()` 检测写入是否会溢出，自动创建新 Packet
- 扩展长度（≥65535 字节）：占位符写入 0xFFFF，紧接 4 字节 uint32_t 实际长度

#### Channel — 端到端通信通道

管理一个 TCP 连接的生命周期，使用 ASIO 异步 I/O：

```
状态机: New → Connecting → Connected → Disconnecting → Destroyed
```

```cpp
class Channel : public std::enable_shared_from_this<Channel> {
public:
    bool initialize(std::unique_ptr<EndPoint> endpoint, ProtocolType protoType);
    bool accept(std::unique_ptr<EndPoint> endpoint);
    bool connect(const std::string& ip, uint16_t port);

    void send(std::unique_ptr<Bundle> pBundle);
    void updateTick();

    void condemn(Reason reason = Reason::ChannelLost);
    void destroy();
};
```

**关键设计：**
- `shared_from_this()` 确保异步回调期间 Channel 不被销毁
- `flushSends()` 将队列中所有 Bundle 序列化到一个缓冲区，单次 `async_send` 发送
- `startRead()` / `handleRead()` 实现异步读循环
- `updateTick()` 检测超时（`>=` 比较，支持 0 秒立即超时）
- 同步测试中不调用 `startRead()`（避免 io_context 未运行时注册异步操作）

#### MessageHandler — 消息注册与分发

```cpp
class MessageHandlers {
public:
    MessageHandler* add(std::string name, int32_t msgLen, HandlerFunc handler);
    MessageHandler* find(MessageID msgID);
    bool handle(Channel* channel, Packet& packet);
    static MessageHandlers& main();
};
```

- 自动分配递增 MessageID（从 1 开始）
- `handle()` 根据 `packet.msgID()` 查找并调用注册的处理函数
- `main()` 返回全局单例（Meyer's Singleton）

#### EventPoller — 事件循环

```cpp
class EventPoller {
public:
    EventPoller();
    ~EventPoller();

    asio::io_context& ioContext();
    void processPendingEvents(int maxWaitMs = 0);  // poll() 或 run_for()
    void run();   // 阻塞运行
    void stop();  // 停止事件循环
};
```

- 构造时创建 `executor_work_guard` 防止 `io_context::run()` 空闲退出
- `processPendingEvents(0)` → `poll()`（非阻塞），`>0` → `run_for()`（限时等待）

#### NetworkInterface — 网络管理器

```cpp
class NetworkInterface {
public:
    bool initialize(uint16_t extTcpPort, uint16_t extUdpPort = 0, uint16_t intTcpPort = 0);
    bool registerChannel(std::shared_ptr<Channel> ch);
    void deregisterChannel(Channel* ch);
    std::shared_ptr<Channel> findChannel(const Address& addr);
    void processChannels();
};
```

**关键设计：**
- `channelMap_` (按 Address) + `channels_` (向量) 双重索引
- `processChannels()` 先清理已销毁 Channel（同时清除 channelMap_），再收集 Disconnecting 的 Channel 统一 deregister（避免迭代器失效）

### 5.4 协议兼容性

与原始 KBEngine 的 TCP 包格式完全兼容：

```
普通消息 (< 65535 字节):
+----------+-----------+------------+
| MsgID(2) | Len(2)   | Body(N)    |
+----------+-----------+------------+

扩展消息 (>= 65535 字节):
+----------+-----------+-----------+------------+
| MsgID(2) | 0xFFFF(2) | Len(4)   | Body(N)    |
+----------+-----------+-----------+------------+
```

- 所有多字节字段使用小端序
- `PACKET_MAX_SIZE_TCP = 1460`, `PACKET_MAX_SIZE_UDP = 1472`
- `NETWORK_MESSAGE_MAX_SIZE = 65535`

### 5.5 构建配置

```cmake
add_library(kbengine_network STATIC
    address.cpp
    endpoint.cpp
    packet_reader.cpp
    bundle.cpp
    message_handler.cpp
    channel.cpp
    event_poller.cpp
    network_interface.cpp
)

target_link_libraries(kbengine_network
    PUBLIC
        kbengine_common
        asio
)
```

### 5.6 架构审查与 Bug 修复

Phase 2 完成后进行了架构审查，发现并修复了以下问题：

| 严重度 | 问题 | 修复 |
|--------|------|------|
| 严重 | 扩展长度编码/解码格式不一致：编码器将扩展长度写在消息体末尾，解码器从 0xFFFF 后读取 | 改为在 0xFFFF 后立即插入 uint32_t 扩展长度，与解码器一致 |
| 严重 | `processChannels()` 在遍历 channels_ 时调用 deregisterChannel 导致迭代器失效 | 先收集待 deregister 的 Channel 指针，循环结束后统一处理 |
| 严重 | `finiMessage()` bodyLen 跨包计算错误：`currMsgLengthPos_` 在 Packet1 但 `pCurrPacket_` 可能是 PacketN | 改为增量跟踪 `currMsgBodyLen_`，每次写入时累加 |
| 中等 | `processMessages()` 在 handler 调用后无条件推进读位置 | 保存/恢复 bodyStart 位置，确保正确跳过消息体 |
| 中等 | `processChannels()` 清理已销毁 Channel 时未同步清除 channelMap_ | 在 remove_if 谓词中同时 erase channelMap_ |

---

## 6. Phase 3: 服务进程框架 — 已完成

### 6.1 概述

Phase 3 实现了服务进程框架的 6 个核心组件，为 Phase 4 的实体系统与 Python 绑定提供基础。原始 KBEngine 的 ServerApp 继承 6 个基类（SignalHandler / TimerHandler / ShutdownHandler / ChannelTimeOutHandler / ChannelDeregisterHandler / ComponentsNotificationHandler），新版本改为持有子系统智能指针。

### 6.2 ServerConfig — 配置加载

**设计对比**:

| 方面 | 原始 | 重写 |
|------|------|------|
| 格式 | 多层 XML (kbe.xml + kbengine.xml + kbengine_defs.xml) | INI 风格 key=value + [section] |
| 依赖 | libxml2 库 | 无第三方依赖，纯 C++ 标准库 |
| 解析 | XML DOM 树遍历 | std::istringstream 逐行解析 |
| 类型查询 | XML 节点属性类型 | 类型安全的 getString/getInt/getFloat/getBool |

```cpp
#include <server/server_config.h>
using namespace kbengine::server;

ServerConfig& cfg = ServerConfig::instance();
cfg.loadFromFile("server.cfg");

// 读配置：key=value 格式，支持 [section] 分组
// 示例 server.cfg:
//   gameUpdateHertz = 30
//   uid = 42
//   [channelCommon]
//   externalTimeoutMs = 90000

uint32_t hz = cfg.gameUpdateHertz();           // 30
int32_t uid = cfg.uid();                       // 42
uint32_t timeout = cfg.channelCommon().externalTimeoutMs;  // 90000

// 通用查询
auto name = cfg.getString("appName");          // std::optional<std::string>
auto port = cfg.getInt("baseapp.port");        // std::optional<int64_t>
cfg.setInt("maxPlayers", 500);
```

### 6.3 SignalHandler — 跨平台信号处理

**设计对比**:

| 方面 | 原始 | 重写 |
|------|------|------|
| 继承方式 | 每个 ServerApp 子类继承 SignalHandler | 全局单例，registerHandler 注册回调 |
| 安全 | 信号上下文中执行业务逻辑 | rawHandler 仅递增原子计数器，主线程 process() 派发 |
| 多回调 | 每个信号一个处理函数 | 支持多回调 per 信号，SignalHandlerId 精确注销 |

```cpp
#include <server/signal_handler.h>
using namespace kbengine::server;

auto& sh = SignalHandler::instance();
auto id = sh.registerHandler(SIGINT, [](int sig) {
    // 此回调在主线程 process() 中执行，安全
    ServerApp::instance().requestShutdown();
});

// 主循环中处理
while (running) {
    sh.process();  // 派发所有 pending 信号回调
}
```

### 6.4 ShutdownHandler — 优雅关闭

**状态机: Running → Begin → InProgress → Completed**

```cpp
#include <server/shutdown_handler.h>
using namespace kbengine::server;

ShutdownHandler h;
h.addStep([] { return networkInterface->closeAllChannels(); });
h.addStep([] { return threadPool->shutdown();  });  // 返回 false 则重试
h.addStep([] { Logger::shutdown(); return true; });

h.requestShutdown();          // 幂等，Begin 只触发一次
while (!h.tick()) { /* 每帧调用 */ }  // 逐个执行 step
assert(h.state() == ShutdownState::Completed);
```

### 6.5 Components — 集群组件注册表

精简自原始约 1200 行代码，仅保留注册表核心（CRUD + 回调通知），心跳与发现延后到 Phase 4。

```cpp
#include <server/components.h>
using namespace kbengine::server;

auto& mgr = Components::instance();
mgr.initialize(netInterface, ComponentType::Baseapp, 1);

ComponentInfo info;
info.componentType = ComponentType::Loginapp;
info.componentID = 100;
mgr.addComponent(info);

auto* found = mgr.findComponent(100);
auto baseapps = mgr.findByType(ComponentType::Baseapp);
auto sameUid = mgr.findByType(ComponentType::Baseapp, 42); // kAnyUid = -1
mgr.markShuttingDown(100);  // 标记组件正在关闭
```

### 6.6 IDAllocator/IDServer/IDClient — 分布式 ID

三个 header-only 模板，C++20 `concept IntegralId<T>` 约束：

| 模板 | 用途 | 线程安全 |
|------|------|----------|
| `IDAllocator<T>` | 简单自增 ID 分配，跳过 0 值 | mutable std::mutex |
| `IDAllocatorFromList<T>` | 带回收队列的分配器 | mutable std::mutex |
| `IDServer<T>` | 服务端分配 ID 段 | mutable std::mutex |
| `IDClient<T>` | 客户端消费 ID 段，支持多段链式 | mutable std::mutex |

```cpp
IDServer<uint32_t> server(1000, 500);
auto [begin, end] = server.allocRange();  // {1000, 1500}

IDClient<uint32_t> client;
client.onAddRange(begin, end);
uint32_t eid = client.alloc();  // 1000
```

### 6.7 ServerApp — 服务基类

**架构对比**:

```
原始: ServerApp : SignalHandler, TimerHandler, ShutdownHandler,
                   ChannelTimeOutHandler, ChannelDeregisterHandler,
                   ComponentsNotificationHandler  (六重继承)
      ↓
新版: ServerApp 持有 subsystem unique_ptr:
      EventPoller / NetworkInterface / TimerQueue / ThreadPool / ShutdownHandler
```

**主循环**:
```cpp
int ServerApp::run() {
    running_.store(true);
    while (running_.load()) {
        auto now = std::chrono::steady_clock::now();
        if (now - lastTick_ < tickInterval) {
            std::this_thread::sleep_for(tickInterval - (now - lastTick_));
            continue;
        }
        lastTick_ = now;
        processOneTick();  // timer → network → thread cb → signal → onTick() → shutdown
    }
    return 0;
}
```

**使用示例**:
```cpp
class MyServer : public ServerApp {
public:
    MyServer() : ServerApp(ComponentType::Baseapp, 1) {}
    void onTick() override {
        // 每帧业务逻辑
    }
    bool initializeEnd() override {
        // 自定义初始化
        return true;
    }
};

int main() {
    MyServer app;
    if (!app.initialize()) return 1;
    return app.run();
}
```

### 6.8 阶段验收

| 指标 | 数值 |
|------|------|
| 新增源文件 | 11 个（5 头 + 5 cpp + 1 header-only 模板） |
| 修改源文件 | 2 个（server_app.h/cpp 从占位扩展为完整实现） |
| 新增测试套件 | 6 个（test_server_config, test_signal_handler, test_shutdown_handler, test_components, test_id_allocator, test_server_app） |
| 新增测试用例 | 33 |
| 累计测试套件 | 17 |
| 累计测试用例 | 88 |
| 构建警告 | 0 (/W4 /WX) |
| 测试通过率 | 100% (88/88) |
| 第三方依赖 | 无新增 |

---

## 7. Phase 4: 实体系统 — 已完成

> **状态**: ✅ 已完成
> **完成日期**: 2026-06-11
> **测试**: 5 个新套件, 32 个新用例 (累计 22 套件 120 用例, 100% 通过)
> **注意**: Python 绑定 (pybind11) 延后到后续阶段，Phase 4 为纯 C++ 实体系统

### 7.1 设计概述

Phase 4 实现了 KBEngine 的核心实体定义系统。原始 entitydef 模块约 20+ 文件，与 Python/PyScript 深度耦合。重写版本使用 C++20 现代特性，将类型系统与 Python 解耦：

| 原始方案 | 重写方案 |
|----------|----------|
| DataType 操作 PyObject* | DataType 操作 void* (纯 C++) |
| 属性值为 Python 对象 | PropertyValue = std::variant (16 种类型) |
| 20+ 文件分散定义 | 6 个组件 10 个源文件 |
| XML 定义文件加载 | 延后（当前通过代码注册） |
| Python 脚本绑定 | 延后（pybind11 Phase 5） |

### 7.2 DataType 类型系统

**DataType 基类** (`entitydef/data_type.h:50-75`):

```cpp
class DataType {
public:
    virtual void addToStream(ByteStream& s, const void* value) const = 0;
    virtual void createFromStream(ByteStream& s, void* out) const = 0;
    virtual size_t fixedSize() const;
    virtual bool isFixedSize() const;
    virtual std::string toString(const void* value) const = 0;
    virtual bool fromString(std::string_view str, void* out) const = 0;
};
```

**NumericType<T> 模板** — 使用 C++20 `if constexpr` 编译期分支：

```cpp
template<typename T>
class NumericType : public DataType {
    static DataTypeCategory categoryFor() {
        if (std::is_integral_v<T>)
            return std::is_signed_v<T> ? DataTypeCategory::Int : DataTypeCategory::UInt;
        return DataTypeCategory::Float;
    }
    // addToStream/createFromStream 直接使用 ByteStream << / >> 操作符
    // toString/fromString 使用 std::to_string / std::stoll / std::stod
};
```

**内置类型** (16 个): INT8, INT16, INT32, INT64, UINT8, UINT16, UINT32, UINT64, FLOAT, DOUBLE, STRING, UNICODE, BLOB, VECTOR2, VECTOR3, VECTOR4

**DataTypes 全局注册表** — Meyer's Singleton，支持按名称/ID/别名查找。

### 7.3 PropertyDescription 属性描述

**PropertyValue** — 编译期类型安全的 variant：

```cpp
using PropertyValue = std::variant<
    std::monostate,
    int8_t, int16_t, int32_t, int64_t,
    uint8_t, uint16_t, uint32_t, uint64_t,
    float, double,
    std::string, std::u16string,
    std::vector<uint8_t>,
    Vector2, Vector3, Vector4
>;
```

**PropertyFlag** — 属性同步标志（CellPublic/CellPrivate/AllClients/BaseAndClient 等），使用 `enum class` + `operator|` 支持位组合。

**PropertyDescription** — 属性元数据：utype, name, dataType, flags, persistent, identifier, detailLevel, dbLength, defaultVal。

**序列化设计**:
- `addToStream(s, val)`: 使用 `std::visit` 派发到 DataType::addToStream（不写 utype 前缀，由调用者管理帧格式）
- `createFromStream(s)`: 按 DataTypeCategory switch 创建对应 variant 类型

### 7.4 MethodDescription 方法描述

- MethodExposedType: None / Exposed / ExposedAndCallerCheck
- MethodArg: shared_ptr<DataType> + name
- 支持参数列表和返回类型

### 7.5 ScriptDefModule 定义模块

- 管理 PropertyDescription 和 MethodDescription 的注册与查找
- PropMap (按名称) + PropUidMap (按 utype) 双重索引
- defaults_ 存储属性默认值
- EntityDefRegistry: 全局单例，管理所有 ScriptDefModule

### 7.6 Entity 实体基类

```cpp
class Entity {
    using EntityID = uint64_t;
    using RemoteCallHandler = std::function<void(uint16_t, ByteStream&)>;

    void setProperty(string_view name, PropertyValue val);
    const PropertyValue* getProperty(string_view name) const;
    bool hasProperty(string_view name) const;
    void initDefaults();                    // 从 PropertyDescription 加载默认值
    void writeProperties(ByteStream& s);    // 序列化所有属性
    void readProperties(ByteStream& s);     // 反序列化所有属性
    void callRemoteMethod(uint16_t utype, ByteStream& args);
};
```

**属性存储**: `unordered_map<uint16_t, PropertyValue>`（按 utype 索引，O(1) 查找）

**序列化格式**: `count(uint16_t) + [utype(uint16_t) + value]*`

### 7.7 架构决策

1. **void\* 替代 PyObject\***: DataType 操作纯 C++ 类型，不依赖 Python
2. **std::variant 替代 PyObject**: 属性值编译期类型安全，std::visit 派发
3. **NumericType\<T\> 模板**: 10 个数值类型共享一个模板实现
4. **utype 帧格式由调用者管理**: addToStream 不写 utype，writeProperties 统一管理帧格式

### 7.8 测试覆盖

| 套件 | 用例数 | 覆盖内容 |
|------|--------|----------|
| test_data_type | 9 | 16 个内置类型注册、Int32/Float/String/Vector3/Blob 序列化往返、toString/fromString、别名查找 |
| test_property | 7 | PropertyDescription 构造、序列化、VolatileInfo、标志组合、默认值 |
| test_method | 4 | MethodDescription 构造、参数、返回类型、Exposed 类型 |
| test_scriptdef_module | 5 | ScriptDefModule 属性/方法管理、EntityDefRegistry 注册查找 |
| test_entity | 7 | Entity 构造/标识、默认值、属性读写、脏标志、序列化往返、远程调用 |
| **总计** | **32** | **100% 通过** |

### 7.9 阶段统计

| 指标 | 数值 |
|------|------|
| 新增文件 | 10 (头文件 5 + 实现 5) |
| 修改文件 | 2 (CMakeLists.txt × 2) |
| 消除文件 | 2 (entity_def.h/.cpp 占位) |
| 新增测试文件 | 5 |
| 代码行数 (核心) | ~900 行 |
| 测试代码行数 | ~550 行 |
| Bug 修复 | 4 个 |
| 编译警告 | 0 (/W4 /WX) |
| 测试通过率 | 100% (32/32) |

---

## 8. 附录: 构建与测试

### 8.1 构建要求

| 工具 | 版本 |
|------|------|
| CMake | 3.20+ |
| C++ 编译器 | MSVC 2019+ / GCC 11+ / Clang 14+ |
| OpenSSL (可选) | 3.x (仅加密模块需要) |

### 8.2 构建步骤

```bash
# 配置（不含加密模块）
cmake -B build -DCMAKE_BUILD_TYPE=Debug -DENABLE_CRYPTO=OFF

# 编译
cmake --build build --config Debug

# 运行测试
ctest --test-dir build -C Debug --output-on-failure

# 安装
cmake --install build --config Debug --prefix install
```

### 8.3 测试覆盖

| 测试套件 | 用例数 | 覆盖内容 |
|----------|--------|----------|
| ByteStream | 10 | 整数读写、浮点、字符串、Blob、打包浮点、边界检查、端序验证 |
| ObjectPool | 4 | 获取/归还、Guard RAII、自定义工厂、最大容量 |
| TimerQueue | 4 | 触发、取消、批量处理、空队列安全 |
| Logger | 3 | 初始化/关闭、级别设置、宏编译验证 |
| ThreadPool | 4 | 任务提交、批量、关闭、主线程回调 |
| **EndPoint** | **6** | TCP/UDP 初始化、绑定、echo 服务端/客户端、UDP echo |
| **Packet** | **4** | 默认构造、TCP/UDP 最大缓冲、消息 ID、消息头解析、不完整头、扩展长度 |
| **Bundle** | **4** | 新消息、多消息、消息 ID 写入、长度回填、打包浮点、清空 |
| **MessageHandler** | **6** | 添加/查找、顺序 ID、查找缺失、分发、未注册分发、全局单例 |
| **Channel** | **5** | 创建/销毁、接受连接、收发数据、超时检测 |
| **EventPoller** | **5** | 创建/停止、空事件处理、echo server、多连接、定时器集成 |
| test_data_type | 9 | ✅ |
| test_property | 7 | ✅ |
| test_method | 4 | ✅ |
| test_scriptdef_module | 5 | ✅ |
| test_entity | 7 | ✅ |
| **总计** | **120** | **100% 通过** |

### 8.4 已实现文件清单

```
rewrite/
├── CMakeLists.txt
├── cmake/CompilerWarnings.cmake
├── cmake/Dependencies.cmake
├── common/
│   ├── CMakeLists.txt
│   ├── byte_stream.h / byte_stream.cpp
│   ├── object_pool.h / object_pool.cpp
│   ├── timer_queue.h / timer_queue.cpp
│   ├── singleton.h
│   └── logger.h
├── crypto/
│   ├── CMakeLists.txt
│   └── crypto.h / crypto.cpp
├── thread/
│   ├── CMakeLists.txt
│   └── thread_pool.h / thread_pool.cpp
├── entitydef/
│   ├── CMakeLists.txt
│   └── entity_def.h / entity_def.cpp
├── network/
│   ├── CMakeLists.txt
│   ├── address.h / address.cpp
│   ├── endpoint.h / endpoint.cpp
│   ├── packet.h
│   ├── packet_reader.h / packet_reader.cpp
│   ├── bundle.h / bundle.cpp
│   ├── message_handler_fwd.h / message_handler.cpp
│   ├── channel.h / channel.cpp
│   ├── event_poller.h / event_poller.cpp
│   ├── network_interface.h / network_interface.cpp
│   └── network_defs.h
├── server/
│   ├── CMakeLists.txt
│   └── server_app.h / server_app.cpp
└── tests/
    ├── CMakeLists.txt
    ├── common/
    │   ├── CMakeLists.txt
    │   ├── test_byte_stream.cpp
    │   ├── test_object_pool.cpp
    │   ├── test_timer_queue.cpp
    │   └── test_logger.cpp
    ├── crypto/
    │   ├── CMakeLists.txt
    │   └── test_crypto.cpp
    └── thread/
        ├── CMakeLists.txt
        └── test_thread_pool.cpp
    └── network/
        ├── CMakeLists.txt
        ├── test_endpoint.cpp
        ├── test_packet.cpp
        ├── test_bundle.cpp
        ├── test_message_handler.cpp
        ├── test_channel.cpp
        └── test_event_poller.cpp
```

### 8.5 已知限制

1. **加密模块**: 需要手动安装 OpenSSL 3.x 开发库并设置 `-DENABLE_CRYPTO=ON`
2. **字节交换**: MSVC 使用 `_byteswap_ushort/ulong/uint64` 内建函数（C++23 的 `std::byteswap` 在 MSVC 2019 中不可用）
3. **KCP 可靠传输**: 延后评估，当前仅支持 TCP/UDP
4. **Python 绑定**: Phase 4 未开始，需要 pybind11
5. **跨平台**: 当前仅在 Windows/MSVC 验证，GCC/Clang 编译待测试
6. **UDP/KCP**: KCP 可靠传输延后评估，当前仅支持 TCP

---

> **下一阶段**: Phase 3 服务进程框架 — 实现 ServerApp 基类（配置/信号/生命周期）、Component 注册与发现、各组件进程（Loginapp/Baseapp/Cellapp/DBMgr/Machine）
