# KBEngine 现代 C++ 重写 — 新手指南

> **适合读者**: 初次接触本项目的开发者
> **前置知识**: C++ 基础，了解 CMake 基本用法

---

## 1. 这是什么项目？

这个项目是用**现代 C++20** 重新实现 KBEngine 分布式游戏服务器引擎。

**KBEngine 是什么？** 一个开源的大型多人在线游戏 (MMOG) 服务器引擎。原来的引擎用 C++98/03 编写，游戏逻辑用 Python 编写。

**为什么要重写？** 利用 C++20 的新特性（智能指针、模板约束、编译期端序处理等）让代码更安全、更简洁、更易维护。

## 2. 快速开始

### 2.1 你需要什么

| 工具 | 用途 | 如何获取 |
|------|------|----------|
| Git | 下载依赖库 | `winget install Git.Git` 或 https://git-scm.com |
| CMake 3.20+ | 构建系统 | `pip install cmake` 或 https://cmake.org |
| Visual Studio 2019+ | C++ 编译器 (Windows) | https://visualstudio.microsoft.com |
| 或 GCC 11+ / Clang 14+ | C++ 编译器 (Linux/Mac) | 系统包管理器 |

### 2.2 下载和构建（3 步）

```bash
# 第 1 步: 进入项目目录
cd I:/kbengine/AI-Refactor-KBEngine/rewrite

# 第 2 步: 配置 CMake（自动下载 spdlog 和 Google Test）
cmake -B build -DCMAKE_BUILD_TYPE=Debug

# 第 3 步: 编译
cmake --build build --config Debug
```

首次运行 `cmake -B build` 时会自动从 GitHub 下载依赖库，需要几分钟。

### 2.3 运行测试

```bash
ctest --test-dir build -C Debug --output-on-failure
```

看到 `100% tests passed` 就表示一切正常。

### 2.4 安装到指定目录

```bash
cmake --install build --config Debug --prefix install
```

安装后的目录结构：
```
install/
├── include/kbengine/    # 头文件
├── lib/                 # 静态库 (.lib)
└── lib/cmake/kbengine/  # CMake 配置（供外部项目引用）
```

---

## 3. 项目结构一览

```
rewrite/
├── CMakeLists.txt          ← 顶层构建配置
├── cmake/
│   ├── CompilerWarnings.cmake  ← 编译警告策略
│   └── Dependencies.cmake      ← 第三方库声明
│
├── common/                 ← 核心工具库
│   ├── byte_stream.h      二进制字节流（序列化核心）
│   ├── object_pool.h      线程安全对象池
│   ├── timer_queue.h      定时器队列
│   ├── singleton.h        单例模板
│   └── logger.h           spdlog 日志封装
│
├── crypto/                 ← 加密模块（可选）
│   └── crypto.h           Blowfish/RSA/SHA
│
├── thread/                 ← 线程模块
│   └── thread_pool.h      线程池
│
├── entitydef/              ← 实体系统 (Phase 4 完成)
│   ├── data_type.h         数据类型系统 (16 个内置类型)
│   ├── property.h          属性描述 (PropertyValue variant)
│   ├── method.h            方法描述
│   ├── scriptdef_module.h  定义模块 + 注册表
│   └── entity.h            实体基类
│
├── network/                ← 网络层 (Phase 2 完成)
│   ├── address.h          IPv4 地址
│   ├── endpoint.h         网络端点 (TCP/UDP)
│   ├── packet.h           协议数据包
│   ├── packet_reader.h    消息边界解析
│   ├── bundle.h           消息打包器
│   ├── message_handler_fwd.h 消息注册与分发
│   ├── channel.h          端到端通信通道
│   ├── event_poller.h     ASIO 事件循环
│   ├── network_interface.h 网络管理器
│   └── network_defs.h     协议常量
│
├── server/                 ← 服务框架 (Phase 3 完成)
│   ├── server_app.h        服务基类（主循环/初始化/关闭）
│   ├── server_config.h     INI 风格配置加载
│   ├── signal_handler.h    跨平台信号处理
│   ├── shutdown_handler.h  多阶段优雅关闭
│   ├── components.h        集群组件注册表
│   └── id_allocator.h      分布式 ID 分配
│
└── tests/                  ← 单元测试
    ├── common/             核心工具测试 (10+4+4+3)
    ├── crypto/             加密测试 (5)
    ├── thread/             线程池测试 (4)
    ├── network/            网络层测试 (6+5+4+6+5+5=31)
    └── server/             服务框架测试 (5+4+6+7+6+5=33)
    └── entitydef/          实体系统测试 (9+7+4+5+7=32)
```

### 各库依赖关系

```
kbengine_common (核心)     ← 依赖 spdlog
    ↓
kbengine_thread            ← 依赖 kbengine_common
kbengine_entitydef         ← 依赖 kbengine_common
kbengine_network           ← 依赖 kbengine_common + asio
    ↓
kbengine_server            ← 依赖以上全部
kbengine_crypto (可选)     ← 依赖 OpenSSL
```

---

## 4. 核心概念速览

### 4.1 ByteStream — 怎么读写数据

```cpp
#include <common/byte_stream.h>
using namespace kbengine;

ByteStream bs;

// 写入各种类型
bs << uint32_t(100) << 3.14f << std::string("hello");

// 读出
uint32_t n; float f; std::string s;
bs >> n >> f >> s;
```

### 4.2 ObjectPool — 怎么复用对象

```cpp
#include <common/object_pool.h>

ObjectPool<MyClass> pool(16);  // 预分配 16 个

// 自动归还模式（推荐）
{
    auto obj = pool.acquireGuard();
    obj->doWork();
}  // 离开作用域自动归还

// 手动归还
auto obj = pool.acquire();
obj->doWork();
pool.release(std::move(obj));
```

### 4.3 TimerQueue — 怎么添加定时器

```cpp
#include <common/timer_queue.h>

TimerQueue tq;

// 延迟 100ms 后触发一次
tq.add(100ms, [](TimerId id, void*) {
    KBE_LOG_INFO("timer fired!");
});

// 延迟 500ms，之后每 100ms 重复触发
tq.add(500ms, 100ms, [](TimerId id, void*) {
    KBE_LOG_INFO("repeating timer!");
});

// 主循环中处理
while (running) {
    tq.process();  // 处理所有到期定时器
}
```

### 4.4 ThreadPool — 怎么提交异步任务

```cpp
#include <thread/thread_pool.h>

ThreadPool pool(4);  // 4 个工作线程

// 提交任务，获取 future
auto future = pool.submit([](int x) { return x * x; }, 10);
int result = future.get();  // 阻塞等待 → 100

// 提交带回调的任务（回调在主线程执行）
pool.submitWithCallback(
    []() { /* 工作线程执行 */ },
    []() { /* 主线程回调 */ }
);
pool.processMainThreadCallbacks();  // 主线程调用
```

### 4.5 Logger — 怎么打日志

```cpp
#include <common/logger.h>

// 初始化（程序启动时调用一次）
Logger::init("myapp.log", Logger::Level::Debug, Logger::Level::Info);

// 使用宏打日志
KBE_LOG_INFO("Player {} connected from {}", playerId, ip);
KBE_LOG_WARN("High memory usage: {} MB", memMB);
KBE_LOG_ERROR("Failed to save entity {}", entityId);
```

---

## 5. 当前开发阶段

| 阶段 | 状态 | 内容 |
|------|------|------|
| Phase 1 | **✅ 已完成** | CMake 构建、ByteStream、ObjectPool、TimerQueue、Logger、Crypto、ThreadPool |
| Phase 2 | **✅ 已完成** | 网络层 (ASIO, TCP/UDP, Channel, Bundle, MessageHandler, EventPoller) |
| Phase 3 | **✅ 已完成** | 服务进程框架 (ServerApp, ServerConfig, SignalHandler, ShutdownHandler, Components, IDAllocator) |
| Phase 4 | **✅ 已完成** | 实体系统 (DataType, Property, Method, Entity, ScriptDefModule) |

---

## 6. 常见问题

**Q: 编译报错 "spdlog not found"？**
A: 首次构建会自动下载，需要网络连接。如果 GitHub 不可达，可以手动设置代理。

**Q: 加密模块怎么启用？**
A: 需要安装 OpenSSL 3.x 开发库，然后 `cmake -B build -DENABLE_CRYPTO=ON`。

**Q: 怎么添加新的源文件？**
A: 在对应模块的 `CMakeLists.txt` 中添加 `.cpp` 文件，头文件 (.h) 不需要添加。

**Q: 测试怎么添加？**
A: 在 `tests/` 对应子目录创建 `test_xxx.cpp`，在 `CMakeLists.txt` 中参照已有测试添加即可。

---

## 7. 下一步

阅读详细技术文档: [KBEngine_Rewrite_Technical_Document.md](KBEngine_Rewrite_Technical_Document.md)
