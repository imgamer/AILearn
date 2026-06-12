# KBEngine 重写 — 源码变迁对照文档

> **维护规则**: 每完成一个 Phase，必须更新此文档，标记对应模块的映射状态
> **最后更新**: 2026-06-11 (Phase 1 + Phase 2 + Phase 3 + Phase 4 完成)
> **原始引擎**: `I:/kbengine/kbengine_master/kbe/src/`
> **新引擎**: `I:/kbengine/AI-Refactor-KBEngine/rewrite/`

---

## 目录

1. [库级模块映射总览](#1-库级模块映射总览)
2. [Phase 1 已完成模块 — 逐文件对照](#2-phase-1-已完成模块--逐文件对照)
3. [Phase 2-4 计划模块 — 映射规划](#3-phase-2-4-计划模块--映射规划)
4. [数据类型变迁对照](#4-数据类型变迁对照)
5. [API 变迁对照](#5-api-变迁对照)
6. [文件索引 (原→新)](#6-文件索引-原新)

---

## 1. 库级模块映射总览

### 1.1 原始 KBEngine 库结构

```
kbe/src/lib/
├── common/        ← 核心工具：字节流、定时器、对象池、单例、加密、压缩
├── thread/        ← 线程：线程池、互斥锁、线程守卫
├── network/       ← 网络层：Channel、Bundle、Packet、epoll/IOCP、KCP
├── server/        ← 服务框架：ServerApp、Components、配置、信号
├── entitydef/     ← 实体定义：DataType、Property、Method、ScriptDefModule
├── pyscript/      ← Python 脚本封装：Script、PyMemoryStream、Vector2/3/4
├── math/          ← 数学库：Vector2/3/4、Matrix
├── navigation/    ← 寻路：Recast/Detour 集成
├── helper/        ← 调试辅助：DebugHelper、Profile、Watcher、CrashHandler
├── db_interface/  ← 数据库抽象层
├── db_mysql/      ← MySQL 实现
├── db_mongodb/    ← MongoDB 实现
├── db_redis/      ← Redis 实现
├── resmgr/        ← 资源管理
├── client_lib/    ← 客户端 SDK
├── python/        ← 内嵌 Python 2.7 完整源码
└── dependencies/  ← 19 个第三方库完整源码
```

### 1.2 新引擎模块映射（按 Phase）

| 原始模块 | 新模块 | Phase | 状态 |
|----------|--------|-------|------|
| `lib/common/` (字节流/对象池/定时器/单例) | `common/byte_stream.h` + `object_pool.h` + `timer_queue.h` + `singleton.h` | 1 | ✅ 完成 |
| `lib/common/` (加密: blowfish/md5/sha1/rsa/ssl) | `crypto/crypto.h` | 1 | ✅ 完成 |
| `lib/common/` (日志: DebugHelper) | `common/logger.h` (spdlog) | 1 | ✅ 完成 |
| `lib/thread/` | `thread/thread_pool.h` | 1 | ✅ 完成 |
| `lib/common/` (类型定义/平台) | `common/` (C++20 `<cstdint>`, `<bit>` 替代) | 1 | ✅ 完成 |
| `lib/entitydef/` (DataType, Property, Method) | `entitydef/` | 4 | ✅ 完成 |
| `lib/network/` | `network/` | 2 | ✅ 完成 |
| `lib/server/` | `server/` | 3 | ✅ 完成 |
| `lib/pyscript/` | pybind11 集成 | 4 | 🔲 规划中 |
| `lib/math/` | `math/` 或 glm | 4 | 🔲 规划中 |
| `lib/navigation/` | `navigation/` | 4 | 🔲 规划中 |
| `lib/db_interface/` + `db_mysql/` + `db_mongodb/` | `db/` | 3 | 🔲 规划中 |
| `lib/helper/` | 分散到各模块 | 1-3 | 🔲 部分完成 |
| `lib/dependencies/` (19个库) | CMake FetchContent + vcpkg | 1 | ✅ 策略已定 |

---

## 2. Phase 1 已完成模块 — 逐文件对照

### 2.1 common — 核心工具库

#### 字节流: MemoryStream → ByteStream

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/common/memorystream.h` (438行) | `common/byte_stream.h` (208行) | 完全重写，行数减少 52% |
| `lib/common/memorystream.cpp` (138行) | `common/byte_stream.cpp` (仅包含头文件) | 改为 header-only 模板 |
| `lib/common/memorystream_converter.h` | **消除** | 端序转换内联到 `to_little_endian()` |

**变迁详情：**

```
原始 (C++98 风格):
┌─────────────────────────────────────────────────────────┐
│ 命名空间: KBEngine                                        │
│ 类名: MemoryStream                                       │
│ 头文件: memorystream.h (438行) + memorystream.cpp (138行)│
│                                                         │
│ << 操作符: 每个类型单独重载                                │
│   MemoryStream& operator<<(uint8 v);                    │
│   MemoryStream& operator<<(uint16 v);                   │
│   MemoryStream& operator<<(uint32 v);                   │
│   MemoryStream& operator<<(uint64 v);                   │
│   MemoryStream& operator<<(int8 v);                     │
│   ... (共 14 个独立重载)                                  │
│                                                         │
│ >> 操作符: 同上，14 个独立重载                             │
│                                                         │
│ 端序转换: 运行时判断 + 手动字节交换                         │
│   void _swap(void* val, size_t size);                   │
│                                                         │
│ 打包浮点:                                                 │
│   appendPackXZ → 将 x,z 打包为一个 uint32                 │
│   readPackX / readPackZ → 从同一个 uint32 解析            │
│                                                         │
│ 内存管理: 手动 new/delete                                 │
└─────────────────────────────────────────────────────────┘

                              ↓ 重写为 ↓

新 (C++20 风格):
┌─────────────────────────────────────────────────────────┐
│ 命名空间: kbengine                                        │
│ 类名: ByteStream                                         │
│ 文件: byte_stream.h (208行，header-only)                  │
│                                                         │
│ << 操作符: 一个模板覆盖全部整数类型                         │
│   template<typename T> requires std::integral<T>        │
│   ByteStream& operator<<(T val);                        │
│                                                         │
│ >> 操作符: 同上                                           │
│   template<typename T> requires std::integral<T>        │
│   ByteStream& operator>>(T& val);                       │
│                                                         │
│ 端序转换: 编译期判断，零运行时开销                           │
│   if constexpr (std::endian::native == std::endian::big)│
│       val = to_little_endian(val);  // 仅大端平台编译     │
│                                                         │
│ 打包浮点: 简化为直接写入两个 int16_t                        │
│   appendPackXZ → *this << sx << sz;                     │
│   readPackX / readPackZ → 各读一个 int16_t                │
│                                                         │
│ 内存管理: std::vector<uint8_t> 自动管理                    │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**

1. **模板替代重载**: 14 个 `operator<<` + 14 个 `operator>>` 减少为各 1 个模板
2. **编译期端序**: `if constexpr` + `std::endian::native` 替代运行时 `_swap()`
3. **打包浮点简化**: 原始将 x,z 两个 int16_t 打包为一个 uint32_t，再手动位移解析。新版本直接依次写入/读取两个 int16_t，逻辑更清晰
4. **智能指针**: `std::vector<uint8_t>` 替代原始 `uint8_t*` + 手动管理
5. **边界安全**: `std::out_of_range` 异常替代原始 `MemoryStreamException`

#### 对象池: ObjectPool → ObjectPool

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/common/objectpool.h` (~200行) | `common/object_pool.h` (99行) | 重写，行数减少 50% |
| (无对应) | `common/object_pool.cpp` | 仅包含头文件 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: ObjectPool<T>                                     │
│ 依赖: thread/threadmutex.h, common/timestamp.h          │
│ 同步: KBEngine::thread::ThreadMutex (自定义包装)         │
│ 缩减: OBJECT_POOL_REDUCING_TIME_OUT 宏 (300秒)           │
│ 工厂: 无，总是 T*                                       │
│ 分配: 返回裸指针 T*，需手动 release()                     │
│ RAII: SmartPoolObject<T> (引用计数智能指针)              │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: ObjectPool<T>                                     │
│ 依赖: <mutex>, <chrono>, <memory>, <functional>         │
│ 同步: std::mutex + std::lock_guard                       │
│ 缩减: tryReduce() 方法，5 分钟间隔                         │
│ 工厂: std::function<std::unique_ptr<T>()>，可自定义      │
│ 分配: 返回 std::unique_ptr<T>，自动管理生命周期           │
│ RAII: Guard 内部类，离开作用域自动归还                    │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**

1. **智能指针**: `std::unique_ptr<T>` 替代裸指针 `T*`，消除手动 delete
2. **标准同步**: `std::mutex` 替代自定义 `ThreadMutex`
3. **可定制工厂**: `setFactory()` 允许自定义构造逻辑
4. **Guard RAII**: 替代 `SmartPoolObject` 引用计数方案，更简洁

#### 定时器: Timer → TimerQueue

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/common/timer.h` + `timer.cpp` + `timer.inl` | `common/timer_queue.h` (128行) | 重写，架构简化 |
| `lib/common/timestamp.h` + `timestamp.cpp` | **消除** | 由 `<chrono>` 替代 |
| `lib/common/tasks.h` + `tasks.cpp` | **消除** | 回调改用 `std::function` |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类: TimerHandle, TimeBase, TimersBase                   │
│ 时间: 自定义 Timestamp (基于平台 tick)                    │
│ 存储: 自定义链表/数组结构                                  │
│ 回调: Tasks 任务系统                                      │
│ 取消: 立即从数据结构中移除                                  │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类: TimerQueue (单一类，简化)                             │
│ 时间: std::chrono::steady_clock                          │
│ 存储: std::vector + std::push_heap/pop_heap (二叉堆)     │
│ 回调: std::function<void(TimerId, void*)>               │
│ 取消: 惰性标记 cancelled = true，process() 时清理          │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**

1. **单一类**: TimerHandle + TimeBase + TimersBase 三件套简化为一个 TimerQueue
2. **标准时间库**: `std::chrono` 替代自定义 Timestamp
3. **二叉堆**: 标准堆算法替代自定义数据结构
4. **惰性取消**: 避免在遍历中修改容器

#### 单例: Singleton → Singleton

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/common/singleton.h` | `common/singleton.h` (26行) | 重写，行数减少 60% |

**变迁详情：**

```
原始 (CRTP + 手动指针):
┌─────────────────────────────────────────────────────────┐
│ template<typename T> class Singleton {                  │
│     static T* singleton_;  // 手动管理的静态指针          │
│     Singleton() { singleton_ = static_cast<T*>(this); } │
│     ~Singleton() { singleton_ = 0; }                    │
│ };                                                      │
│ // 每个子类需要在 .cpp 中:                                │
│ // template<> T* Singleton<T>::singleton_ = 0;          │
│ // 需要 KBE_SINGLETON_INIT 宏                            │
└─────────────────────────────────────────────────────────┘

                              ↓

新 (Meyer's Singleton):
┌─────────────────────────────────────────────────────────┐
│ template<typename T> class Singleton {                  │
│     static T& instance() {                              │
│         static T inst;  // C++11 保证线程安全            │
│         return inst;                                    │
│     }                                                   │
│ };                                                      │
│ // 无需 .cpp 初始化                                      │
│ // 无需宏                                                │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**

1. **Meyer's Singleton**: C++11 保证的线程安全局部静态变量，替代手动指针管理
2. **无需初始化宏**: 删除 `KBE_SINGLETON_INIT`，简化使用
3. **移动不可**: 显式 delete 拷贝和移动构造函数

#### 日志: DebugHelper → Logger

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/helper/debug_helper.h` + `debug_helper.cpp` | `common/logger.h` (56行) | 完全重写，使用 spdlog |
| `lib/helper/debug_option.h` + `debug_option.cpp` | **消除** | 日志级别由 spdlog 管理 |
| `lib/helper/script_loglevel.h` + `.cpp` | **消除** | Python 日志级别延后到 Phase 4 |
| `lib/helper/profile.h` + `profile.cpp` | **延后** | 性能分析延后到 Phase 3 |
| `lib/helper/watcher.h` + `watch_pools.h` | **延后** | 监控系统延后到 Phase 3 |
| `lib/helper/sys_info.h` + `sys_info.cpp` | **延后** | 系统信息延后到 Phase 3 |
| `lib/helper/crashhandler.h` + `crashhandler.cpp` | **延后** | 崩溃处理延后到 Phase 3 |
| `lib/helper/console_helper.h` | **延后** | 控制台辅助延后到 Phase 3 |
| `lib/helper/eventhistory_stats.h` | **延后** | 事件统计延后到 Phase 3 |
| `lib/helper/memory_helper.h` | **消除** | C++20 智能指针已覆盖 |

**变迁详情：**

```
原始 (自研):
┌─────────────────────────────────────────────────────────┐
│ DebugHelper: 自研日志系统                                 │
│   - 文件 + 控制台输出                                     │
│   - 自定义日志级别枚举                                     │
│   - 自定义格式化                                          │
│   - 依赖 log4cxx (额外第三方库)                           │
│                                                         │
│ 宏: DEBUG_MSG, INFO_MSG, WARNING_MSG, ERROR_MSG 等      │
└─────────────────────────────────────────────────────────┘

                              ↓

新 (spdlog):
┌─────────────────────────────────────────────────────────┐
│ Logger: spdlog 封装                                      │
│   - 文件 + 彩色控制台输出                                  │
│   - spdlog 级别: trace/debug/info/warn/error/critical   │
│   - 高性能异步日志                                        │
│   - header-only，无需额外编译                             │
│                                                         │
│ 宏: KBE_LOG_TRACE/DEBUG/INFO/WARN/ERROR/CRITICAL        │
└─────────────────────────────────────────────────────────┘
```

#### 加密: 分散文件 → crypto 模块

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/common/blowfish.h` + `blowfish.cpp` | `crypto/crypto.h` (Blowfish 类) | 合并到单一头文件 |
| `lib/common/md5.h` + `md5.cpp` | `crypto/crypto.h` (md5 函数) | 同上 |
| `lib/common/sha1.h` + `sha1.cpp` | `crypto/crypto.h` (sha1 函数) | 同上 |
| `lib/common/rsa.h` + `rsa.cpp` | `crypto/crypto.h` (RSA 类) | 同上 |
| `lib/common/ssl.h` + `ssl.cpp` | **消除** | 功能由 OpenSSL EVP API 覆盖 |
| `lib/common/kbekey.h` + `kbekey.cpp` | **消除** | 密钥交换延后到 Phase 2 |

**变迁详情：**

```
原始 (OpenSSL 1.x 旧 API):
┌─────────────────────────────────────────────────────────┐
│ blowfish.h: BF_KEY 直接暴露，BF_ecb_encrypt              │
│ md5.h: MD5() 函数，返回 unsigned char[]                  │
│ sha1.h: SHA1() 函数                                      │
│ sha256.h: 无 (kst 分支新增 SHA256)                        │
│ rsa.h: RSA* 裸指针，需手动 RSA_free()                     │
│ ssl.h: SSL_CTX* 裸指针                                    │
│                                                         │
│ 6 个独立 .h/.cpp 文件对                                   │
│ 所有函数返回 unsigned char 数组或 hex 字符串               │
└─────────────────────────────────────────────────────────┘

                              ↓

新 (OpenSSL 3.x EVP API):
┌─────────────────────────────────────────────────────────┐
│ crypto.h (单一文件, 141行):                               │
│   Blowfish 类: BF_KEY 封装，const 正确性                  │
│   RSA 类: EVP_PKEY + std::unique_ptr RAII               │
│   md5/sha1/sha256: 自由函数，返回 std::string hex        │
│                                                         │
│ 全部返回 std::string (RAII 安全)                          │
│ 使用 OpenSSL 3.x EVP 高层 API                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 thread — 线程池

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/thread/threadpool.h` + `threadpool.cpp` + `threadpool.inl` | `thread/thread_pool.h` (149行) | 重写 |
| `lib/thread/threadmutex.h` | **消除** | 由 `<mutex>` 替代 |
| `lib/thread/threadguard.h` | **消除** | 由 `std::lock_guard` 替代 |
| `lib/thread/threadtask.h` | **消除** | 由 `std::packaged_task` 替代 |
| `lib/thread/concurrency.h` + `concurrency.cpp` | **消除** | 由 `std::thread::hardware_concurrency()` 替代 |

**变迁详情：**

```
原始 (pthread/Win32 手动封装):
┌─────────────────────────────────────────────────────────┐
│ ThreadPool:                                             │
│   - 平台相关: #if KBE_PLATFORM == PLATFORM_WIN32        │
│     #include <windows.h>, _beginthread()                │
│     #else: #include <pthread.h>                         │
│   - 自定义 ThreadMutex 包装                               │
│   - 自定义 ThreadGuard 包装                               │
│   - 自定义 ThreadTask 任务封装                             │
│   - 固定线程数 + 忙线程池分离架构                          │
│   - THREAD_BUSY_SIZE 宏控制忙线程上限                     │
│   - startMainThreadPool() / startIOThreadPool() 分类   │
└─────────────────────────────────────────────────────────┘

                              ↓

新 (std::thread 跨平台):
┌─────────────────────────────────────────────────────────┐
│ ThreadPool:                                             │
│   - 完全跨平台: std::thread (C++11 标准)                  │
│   - std::mutex + std::condition_variable                 │
│   - std::packaged_task + std::future 任务封装            │
│   - 固定线程数，统一工作循环                               │
│   - submit(F, Args...) → std::future<ReturnType>        │
│   - submitWithCallback + processMainThreadCallbacks     │
└─────────────────────────────────────────────────────────┘
```

### 2.3 占位模块

这些模块在 Phase 1 仅有类型定义，完整实现在后续 Phase：

#### entitydef — 实体定义（Phase 4 已完成）

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/entitydef/datatype.h` + `datatype.cpp` + `datatype.inl` | `entitydef/data_type.h` + `data_type.cpp` | 完全重写，C++20 模板 + variant |
| `lib/entitydef/datatypes.h` + `datatypes.cpp` | 合并到 `entitydef/data_type.h` | DataTypes 注册表内置 |
| `lib/entitydef/property.h` + `property.cpp` | `entitydef/property.h` + `property.cpp` | 重写，std::variant 替代 PyObject |
| `lib/entitydef/method.h` + `method.cpp` | `entitydef/method.h` + `method.cpp` | 重写，简化暴露类型枚举 |
| `lib/entitydef/entitydef.h` + `entitydef.cpp` | 合并到 `entitydef/scriptdef_module.h` | ScriptDefModule 统一管理 |
| `lib/entitydef/scriptdef_module.h` + `.cpp` | `entitydef/scriptdef_module.h` + `.cpp` | 重写，简化 defaults 管理 |
| `lib/entitydef/entity_call.h` + `.cpp` | 延后 | EntityCall 类型延后到后续阶段 |
| `lib/entitydef/fixedarray.h` + `.cpp` | 延后 | FixedArray/FixedDict 复合类型延后 |
| `lib/entitydef/fixeddict.h` + `.cpp` | 延后 | 同上 |
| `lib/entitydef/volatileinfo.h` + `.cpp` | 合并到 `entitydef/property.h` | VolatileInfo 结构体内联 |
| `lib/entitydef/detaillevel.h` + `.cpp` | 合并到 `entitydef/property.h` | DetailLevel 枚举内联 |

**关键变迁点：**
1. PropertyValue = `std::variant<monostate, int8_t, ..., Vector2, Vector3, Vector4>` 替代 Python PyObject
2. DataType::addToStream/createFromStream 使用 `void*` 替代 `PyObject*`
3. 原始 20+ 文件合并为 6 个组件（data_type, property, method, scriptdef_module, entity 共 10 个源文件）
4. NumericType<T> 使用 C++20 `if constexpr` 编译期分支处理有符号/无符号/浮点三类

### 2.2 network — 网络层

> **状态**: Phase 2 完成，使用 ASIO standalone 替代原始 epoll/IOCP 手动封装

#### Address — IPv4 地址

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/address.h` + `address.cpp` | `network/address.h` + `address.cpp` | 重写，C++20 `<=>` 三路比较 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::Address                                   │
│ 字段: ip (uint32), port (uint16)                         │
│ 方法: 手动实现所有比较运算符 (==, !=, <, >, <=, >=)       │
│ Hash: 手动组合 ip+port 为 key                            │
│ 命名空间: KBEngine::Network                              │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::Address                         │
│ 字段: ip (uint32_t), port (uint16_t)                     │
│ 方法: auto operator<=>(const Address&) const = default;  │
│       (C++20 三路比较自动生成全部 6 种比较运算符)          │
│ Hash: std::hash<Address> 特化                            │
│ 命名空间: kbengine::network                              │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. `operator<=>` 一行替代 6 个手动比较运算符
2. `std::hash` 特化支持 `unordered_map` 查找
3. 添加 `isNone()` 便捷方法

#### EndPoint — 网络端点

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/endpoint.h` + `endpoint.cpp` | `network/endpoint.h` + `endpoint.cpp` | 重写，ASIO 替代 epoll/IOCP 手动封装 |

**变迁详情：**

```
原始 (epoll/IOCP 手动封装):
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::EndPoint                                  │
│ Socket: int socket_ (Linux) / SOCKET socket_ (Windows)   │
│ 事件循环: EventDispatcher (手动 epoll/IOCP 封装)         │
│ 操作: send/recv/sendto/recvfrom 直接调用系统 API         │
│ 地址: sockaddr_in 手动处理                                │
│ 平台: #if KBE_PLATFORM == PLATFORM_WIN32 分支            │
└─────────────────────────────────────────────────────────┘

                              ↓

新 (ASIO standalone):
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::EndPoint                        │
│ Socket: asio::ip::tcp::socket / asio::ip::udp::socket   │
│ 事件循环: asio::io_context                               │
│ 操作: asio 跨平台 API (不区分平台)                        │
│ 地址: asio::ip::address_v4 自动处理                       │
│ 平台: ASIO 内部处理，零平台条件编译                        │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. ASIO 跨平台 socket 替代平台相关 epoll/IOCP
2. `localPort()` 返回 bind 时保存的端口（listen 后 acceptor 接管 socket）
3. `accept()` 返回 `std::unique_ptr<EndPoint>`，RAII 管理
4. 所有操作使用 `asio::error_code` 非异常错误处理

#### Packet — 数据包

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/packet.h` + `packet.cpp` | `network/packet.h` (header-only) | 重写，继承 ByteStream |
| `lib/network/tcp_packet.h` + `tcp_packet.cpp` | **消除** (合并到 Packet) | TCP/UDP 标志位区分 |
| `lib/network/udp_packet.h` + `udp_packet.cpp` | **消除** (合并到 Packet) | 同上 |
| `lib/network/packet_receiver.h` + `packet_receiver.cpp` | **消除** (合并到 PacketReader) | 职责合并 |
| `lib/network/packet_sender.h` + `packet_sender.cpp` | **消除** (合并到 Channel) | 职责合并 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ Packet: 独立类，管理自己的内存缓冲区                       │
│ TCPPacket: Packet 子类，TCP 特有逻辑                      │
│ UDPPacket: Packet 子类，UDP 特有逻辑                      │
│ PacketReceiver: 接收管理                                 │
│ PacketSender: 发送管理                                   │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ Packet: 继承 ByteStream，复用序列化能力                    │
│ 元数据: msgID_, tcp_, encrypted_, bundle_, sentSize_     │
│ 类型区分: tcp_ 布尔标志 (非继承)                          │
│ 最大缓冲: TCP=1460, UDP=1472                             │
│ PacketReader: 消息边界解析（接收端）                       │
│ Channel: 发送队列管理（发送端）                            │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. 继承 ByteStream 获得全部序列化能力
2. TCP/UDP 包合并为单一 Packet 类，用 `tcp_` 布尔标志区分
3. PacketReceiver/PacketSender 职责分别合并到 PacketReader/Channel

#### PacketReader — 消息边界解析

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/packet_reader.h` + `packet_reader.cpp` | `network/packet_reader.h` + `packet_reader.cpp` | 重写 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::PacketReader                              │
│ 分片: fragmentBuffer_ 保存不完整消息                      │
│ 扩展长度: readingExtendedLength_ 状态标志                  │
│ 与 PacketReceiver 紧耦合                                  │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::PacketReader                    │
│ 分片: 通过保存/恢复 Packet::rpos() 实现，无额外缓冲区       │
│ 扩展长度: 内联判断 (bodyLen == 65535 → 读 4 字节扩展)      │
│ 职责单一: readMessageHeader + processMessages            │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. 分片处理简化：利用 ByteStream 的 rpos() 保存/恢复机制
2. 消除 `fragmentBuffer_` 和 `readingExtendedLength_` 状态
3. `processMessages()` 循环解析流中所有消息

#### Bundle — 消息打包器

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/bundle.h` + `bundle.cpp` | `network/bundle.h` + `bundle.cpp` | 重写 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::Bundle                                    │
│ 写入: 14 个 operator<< 独立重载                           │
│ 消息边界: currMsgLengthPos_ 回填长度                      │
│ 扩展长度: 在消息体末尾写入 (编码器与解码器位置不一致)       │
│ 打包浮点: appendPackXZ/Y/XYZ                             │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::Bundle                          │
│ 写入: 12 个 operator<< 独立重载 (整数+浮点+字符串)         │
│ 消息边界: currMsgBodyLen_ 增量跟踪                        │
│ 扩展长度: 在 0xFFFF 后立即插入 4 字节 (与解码器一致)       │
│ 打包浮点: appendPackXZ/Y/XYZ (保持兼容)                   │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. `currMsgBodyLen_` 增量跟踪替代跨包位置计算
2. 扩展长度插入位置修正（与解码器一致）
3. `onPacketAppend()` 自动检测写入溢出并创建新 Packet

#### Channel — 端到端通信通道

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/channel.h` + `channel.cpp` | `network/channel.h` + `channel.cpp` | 重写，ASIO 异步 I/O |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::Channel                                   │
│ 读写: EventDispatcher 注册回调 (epoll/IOCP)               │
│ 发送: 手动管理 send buffer                               │
│ 加密: EncryptionFilter 集成                               │
│ 超时: updateTick 检查                                    │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::Channel                         │
│ 读写: ASIO async_receive / async_send                    │
│ 发送: std::queue<unique_ptr<Bundle>> + 批量 flush        │
│ 加密: 可选 kbengine_crypto (CMake 条件链接)               │
│ 超时: updateTick 使用 >= 比较, 默认 30s                    │
│ RAII: enable_shared_from_this 确保异步回调安全            │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. `std::enable_shared_from_this` 确保 ASIO 异步回调期间不被销毁
2. `flushSends()` 将队列中所有 Bundle 序列化到单缓冲区，一次 async_send
3. 状态机: New → Connecting → Connected → Disconnecting → Destroyed

#### MessageHandler — 消息注册与分发

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/message_handler.h` + `message_handler.cpp` | `network/message_handler_fwd.h` + `message_handler.cpp` | 重写 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::MessageHandlers                           │
│ 注册: add(messageName, msgLen, handler)                  │
│ 分发: handle(channel, packet)                            │
│ 处理器: 函数指针 / 成员函数绑定                            │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::MessageHandlers                 │
│ 注册: add(name, msgLen, std::function<...>)              │
│ 分发: handle(channel, packet)                            │
│ 处理器: std::function<void(Channel*, Packet&)>           │
│ 存储: std::unordered_map<MessageID, MessageHandler>      │
│ 单例: Meyer's Singleton (main() 静态局部变量)             │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. `std::function` 替代函数指针/成员函数绑定
2. `std::unordered_map` O(1) 查找
3. 自动分配递增 MessageID（从 1 开始）

#### EventPoller — 事件循环

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/event_poller.h` + `event_poller.cpp` | `network/event_poller.h` + `event_poller.cpp` | 完全重写 |
| `lib/network/event_dispatcher.h` + `event_dispatcher.cpp` | **消除** (ASIO 替代) | io_context 统一调度 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ EventPoller: epoll (Linux) / IOCP (Windows) 手动封装     │
│ EventDispatcher: 事件分发器                               │
│ InputNotificationHandler: 读事件回调接口                  │
│ OutputNotificationHandler: 写事件回调接口                 │
│ 平台: 两套实现 (#if PLATFORM_WIN32)                       │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ EventPoller: ASIO io_context 薄封装                       │
│   - executor_work_guard 防止空闲退出                      │
│   - processPendingEvents(0) → poll() (非阻塞)            │
│   - processPendingEvents(>0) → run_for() (限时)          │
│   - run() / stop() (阻塞/停止)                           │
│ EventDispatcher: 消除 (io_context 统一调度)               │
│ Input/OutputNotificationHandler: 消除 (lambda 回调替代)   │
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. 约 3000 行平台相关代码缩减为 ~40 行 ASIO 封装
2. 消除 EventDispatcher、InputNotificationHandler、OutputNotificationHandler
3. 所有异步操作通过 lambda 回调，无需继承回调接口

#### NetworkInterface — 网络管理器

| 原始文件 | 新文件 | 变迁说明 |
|----------|--------|----------|
| `lib/network/network_interface.h` + `network_interface.cpp` | `network/network_interface.h` + `network_interface.cpp` | 重写 |

**变迁详情：**

```
原始:
┌─────────────────────────────────────────────────────────┐
│ 类名: Network::NetworkInterface                          │
│ Channel 管理: 手动管理 channels 列表                      │
│ Listener: ListenerReceiver 回调                           │
│ 与 EventDispatcher 紧耦合                                 │
└─────────────────────────────────────────────────────────┘

                              ↓

新:
┌─────────────────────────────────────────────────────────┐
│ 类名: kbengine::network::NetworkInterface                │
│ Channel 管理: channelMap_ (Address→Channel) + channels_   │
│ Listener: 内联 startTcpListener                          │
│ processChannels: 安全遍历 + 收集后 deregister              │
│ 回调: std::function (timeoutCallback_, deregisterCallback_)│
└─────────────────────────────────────────────────────────┘
```

**关键变迁点：**
1. 双重索引：`channelMap_` (O(1) 查找) + `channels_` (O(n) 遍历)
2. `processChannels()` 先清理已销毁 Channel，再收集待 deregister 统一处理（避免迭代器失效）
3. `std::function` 回调替代继承接口

#### 未迁移/消除的文件

| 原始文件 | 处理 | 原因 |
|----------|------|------|
| `lib/network/ikcp.h` + `ikcp.c` | **延后** | KCP 可靠传输延后评估 |
| `lib/network/kcp_packet_*.h` + `.cpp` (4个文件) | **延后** | 依赖 KCP |
| `lib/network/encryption_filter.h` + `.cpp` | **消除** | 加密由 kbengine_crypto 模块处理 |
| `lib/network/error_reporter.h` + `.cpp` | **消除** | Logger 覆盖错误报告功能 |
| `lib/network/network_stats.h` + `.cpp` | **延后** | 网络统计延后到 Phase 3 |
| `lib/network/listener_receiver.h` + `.cpp` | **消除** | NetworkInterface 内联监听 |
| `lib/network/delayed_channels.h` + `.cpp` | **延后** | 延迟 Channel 延后评估 |
| `lib/network/websocket_protocol.h` + `.cpp` | **延后** | WebSocket 延后评估 |
| `lib/network/websocket_packet_filter.h` + `.cpp` | **延后** | 同上 |
| `lib/network/websocket_packet_reader.h` + `.cpp` | **延后** | 同上 |
| `lib/network/http_utility.h` + `.cpp` | **延后** | HTTP 工具延后评估 |

#### server — 服务框架（Phase 3 已完成）

| 原始文件 | 新文件 | 迁移说明 |
|----------|--------|----------|
| `lib/server/serverapp.h/.cpp` (~600行) | `server/server_app.h` + `.cpp` (~150行) | 主循环 / 初始化 / 关闭流程，删去 Watcher/Profile/XML 等耦合，使用 std::atomic 替代手动同步 |
| `lib/server/serverconfig.h/.cpp` (~1000行 XML 解析) | `server/server_config.h` + `.cpp` (~180行) | 改用 INI 风格 key=value + section，避免引入 libxml2 |
| `lib/server/signal_handler.h/.cpp` | `server/signal_handler.h` + `.cpp` | 多回调注册 / std::atomic pending 计数 / `process()` 在主线程派发 |
| `lib/server/shutdown_handler.h/.cpp` | `server/shutdown_handler.h` + `.cpp` | 多阶段步骤队列 + 可重试 step 返回值 + Begin/InProgress/Completed 状态机 |
| `lib/server/components.h/.cpp` (~1200行) | `server/components.h` + `.cpp` (~220行) | 仅保留组件注册表核心：addComponent / findByType / NotificationHandler |
| `lib/server/idallocate.h` (template) | `server/id_allocator.h` (header-only) | C++20 concepts 约束，std::mutex 加锁，三个模板 IDAllocator/IDServer/IDClient |
| `lib/server/entity_app.h/.cpp` | — | Phase 4 |
| `lib/server/python_app.h/.cpp` | — | Phase 4 |
| `lib/server/telnet_server.h/.cpp` | — | 延后评估 |
| `lib/server/machine_infos.h/.cpp` | — | Phase 4 |
| `lib/server/forward_messagebuffer.h/.cpp` | — | Phase 4 |
| `lib/server/globaldata_client.h/.cpp` | — | Phase 4 |
| `lib/server/globaldata_server.h/.cpp` | — | Phase 4 |
| `lib/server/script_timers.h/.cpp` | — | Phase 4 |
| `lib/server/component_active_report_handler.h/.cpp` | — | Phase 4（依赖 Channel ping） |
| `lib/server/id_component_querier.h/.cpp` | — | Phase 4 |
| `lib/server/pendingLoginmgr.h/.cpp` | — | Loginapp 专属，Phase 4 |
| `lib/server/py_file_descriptor.h/.cpp` | — | Phase 4 |
| `lib/server/sendmail_threadtasks.h/.cpp` | — | 延后评估 |
| `lib/server/callbackmgr.h` | — | Phase 4（Python 回调） |
| `lib/server/server_errors.h` | — | Phase 4 |
| `lib/server/kbemain.h` | — | Phase 3 入口宏延后，可由用户直接 main |

---

---

## 2.3 server — 服务进程框架（Phase 3）

#### ServerApp 主循环

```
原始: ServerApp 继承 SignalHandler/TimerHandler/ShutdownHandler/ChannelTimeOutHandler/
      ChannelDeregisterHandler/ComponentsNotificationHandler（六重继承）
      ↓
新版: ServerApp 仅持有子系统（EventPoller / NetworkInterface / TimerQueue /
      ThreadPool / ShutdownHandler 智能指针），SignalHandler 改为全局单例。
      主循环 = process(timer) → poll(network) → process(thread cb) → process(signal)
              → onTick() → tick(shutdown)
      游戏帧率由 gameUpdateHertz 控制（默认 10Hz，可调）。
```

#### ServerConfig 配置加载

```
原始: kbe.xml + kbengine.xml + kbengine_defs.xml + ssl_certificates 多层 XML 解析（libxml2）
      ↓
新版: INI 风格 key=value，支持 [section] 分组、`#` 行内注释、from_file/from_string
      所有键值以 std::unordered_map<std::string, std::string> 存储
      额外暴露 ChannelCommonConfig / EntityAppConfig 结构化字段（per ComponentType）
```

#### Components 集群组件注册

```
原始: Components (~1200行) 继承 Task + Singleton<Components>，含心跳广播、断线检测、网络发现
      ↓
新版: 仅保留组件注册表核心（addComponent/findComponent/findByType/removeByChannel）
      心跳与组件发现延后到 Phase 4 由具体 ServerApp 子类实现
      使用 std::unordered_map<ComponentID, ComponentInfo>，std::mutex 保护
      ComponentNotificationHandler 抽象类（onAdd/onRemove/onAllFound）
```

#### SignalHandler 跨平台信号

```
原始: 每个 ServerApp 子类继承 SignalHandler，手动注册 SIGINT/SIGUSR1 等
      ↓
新版: 全局单例，registerHandler(signum, cb) 返回 SignalHandlerId 用于注销
      底层 std::signal 注册 rawHandler，rawHandler 将 pending 计数累加到原子数组
      主循环 process() 时派发回调，避免在信号上下文执行业务逻辑
```

#### ShutdownHandler 优雅关闭

```
原始: ShutdownHandler 抽象基类 + Shutdowner 状态机（位于 common/）
      ↓
新版: 独立类，addStep(callback) 注册多阶段关闭步骤
      step 返回 false 表示"未完成需重试"，tick() 每帧推进一个 step
      状态机: Running → Begin → InProgress → Completed
      requestShutdown() 幂等；onShutdownBegin/End 提供子类钩子
```

#### IDAllocator/IDServer/IDClient 模板族

```
原始: IDAllocate<T> + IDAllocateFromList<T> + IDServer<T> + IDClient<T> + EntityIDClient
      ↓
新版: 全部 header-only 模板，C++20 concepts IntegralId<T> 约束
      关键改进:
      - mutable std::mutex 保护，线程安全
      - alloc() 跳过 0 值（与原版一致），但用 ++last_ 后判断而非 do-while
      - IDClient::onAddRange 自动转移到 pending 队列
      - 实体专用类 EntityIDClient 延后到 Phase 4（依赖 ServerApp::pendingMessages）
```

---



### 3.1 数学库 (math → math/ 或 glm)

| 原始 | 计划 | 策略 |
|------|------|------|
| `lib/math/math.h` + `math.cpp` | 使用 glm (header-only) | 避免重复造轮子 |
| `lib/pyscript/vector2.h` + `.cpp` | 同上 | pybind11 绑定 glm 类型 |
| `lib/pyscript/vector3.h` + `.cpp` | 同上 | |
| `lib/pyscript/vector4.h` + `.cpp` | 同上 | |

### 3.2 寻路 (navigation → navigation/)

| 原始 | 计划 | 策略 |
|------|------|------|
| `lib/navigation/navigation.h` + `.cpp` | 保留 | Recast/Detour 不可替代 |
| `lib/navigation/Recast*` / `Detour*` | 更新到最新版 | vcpkg 管理 |

### 3.3 数据库 (db_* → db/)

| 原始 | 计划 | 策略 |
|------|------|------|
| `lib/db_interface/` | `db/db_interface.h` | 抽象接口保留 |
| `lib/db_mysql/` | `db/db_mysql.h` | 换用 mariadb-connector-c |
| `lib/db_mongodb/` | `db/db_mongodb.h` | 换用 mongocxx |
| `lib/db_redis/` | `db/db_redis.h` | 精简 hiredis 内嵌 |

### 3.4 Python 脚本 (pyscript → pybind11 集成)

| 原始 | 计划 | 策略 |
|------|------|------|
| `lib/pyscript/script.h` + `.cpp` | pybind11 嵌入解释器 | 现代 C++/Python 互操作 |
| `lib/pyscript/pickler.h` + `.cpp` | pybind11 pickle | |
| `lib/pyscript/py_memorystream.h` + `.cpp` | ByteStream pybind11 绑定 | |
| `lib/pyscript/copy.h` + `.cpp` | 消除 (pybind11 内建) | |
| `lib/pyscript/pystruct.h` + `.cpp` | 消除 (pybind11 内建) | |
| `lib/python/` (完整 Python 2.7 源码) | 消除 | 用户自行安装 Python 3.x |

---

## 4. 数据类型变迁对照

### 4.1 基础类型

| 原始 KBEngine 类型 | C++20 标准类型 | 所在头文件 |
|--------------------|----------------|------------|
| `uint8` | `uint8_t` | `<cstdint>` |
| `uint16` | `uint16_t` | `<cstdint>` |
| `uint32` | `uint32_t` | `<cstdint>` |
| `uint64` | `uint64_t` | `<cstdint>` |
| `int8` | `int8_t` | `<cstdint>` |
| `int16` | `int16_t` | `<cstdint>` |
| `int32` | `int32_t` | `<cstdint>` |
| `int64` | `int64_t` | `<cstdint>` |
| `ArraySize` (uint32) | `size_t` | `<cstddef>` |
| `ENTITY_ID` (int32) | `int32_t` | `<cstdint>` |
| `COMPONENT_ID` (int32) | `uint64_t` (ComponentID) | `server/server_app.h` |
| `SPACE_ID` (uint32) | `uint32_t` | `<cstdint>` |

### 4.2 枚举类型

| 原始 | 新 | 位置 |
|------|-----|------|
| `DataTypeId` (namespace 级别常量) | `enum class DataTypeId : uint8_t` | `entitydef/entity_def.h` |
| 无统一枚举 | `enum class ProtocolType : uint8_t` | `network/network_defs.h` |
| 无统一枚举 | `enum class ProtocolSubType : uint8_t` | `network/network_defs.h` |
| `COMPONENT_TYPE` (宏 + 常量) | `enum class ComponentType : uint32_t` | `server/server_app.h` |

### 4.3 关键类名变迁

| 原始类名 (命名空间 KBEngine) | 新类名 (命名空间 kbengine) | 文件 |
|------------------------------|----------------------------|------|
| `MemoryStream` | `ByteStream` | `common/byte_stream.h` |
| `ObjectPool<T>` | `ObjectPool<T>` (保持) | `common/object_pool.h` |
| `TimerHandle` + `TimersBase` | `TimerQueue` | `common/timer_queue.h` |
| `Singleton<T>` (指针风格) | `Singleton<T>` (Meyer's) | `common/singleton.h` |
| `DebugHelper` (静态方法集合) | `Logger` (静态方法集合) | `common/logger.h` |
| `KBEBlowfish` | `crypto::Blowfish` | `crypto/crypto.h` |
| `KBERSA` | `crypto::RSA` | `crypto/crypto.h` |
| `ThreadPool` | `ThreadPool` (保持) | `thread/thread_pool.h` |
| `Network::Address` | `network::Address` | `network/address.h` |
| `Network::EndPoint` | `network::EndPoint` | `network/endpoint.h` |
| `Network::Channel` | `network::Channel` | `network/channel.h` |
| `Network::Bundle` | `network::Bundle` | `network/bundle.h` |
| `Network::Packet` | `network::Packet` | `network/packet.h` |
| `Network::PacketReader` | `network::PacketReader` | `network/packet_reader.h` |
| `Network::MessageHandlers` | `network::MessageHandlers` | `network/message_handler_fwd.h` |
| `Network::EventPoller` | `network::EventPoller` | `network/event_poller.h` |
| `Network::NetworkInterface` | `network::NetworkInterface` | `network/network_interface.h` |
| `Network::EventDispatcher` | **消除** (ASIO 替代) | — |
| `Network::InputNotificationHandler` | **消除** (lambda 替代) | — |
| `Network::OutputNotificationHandler` | **消除** (lambda 替代) | — |
| `Network::PacketReceiver` | **消除** (合并到 PacketReader) | — |
| `Network::PacketSender` | **消除** (合并到 Channel) | — |
| `Network::TCPPacket` | **消除** (合并到 Packet) | — |
| `Network::UDPPacket` | **消除** (合并到 Packet) | — |
| `Network::EncryptionFilter` | **消除** (kbengine_crypto 替代) | — |
| `Network::ListenerReceiver` | **消除** (NetworkInterface 内联) | — |
| `ThreadMutex` | **消除** (→ `std::mutex`) | — |
| `ThreadGuard` | **消除** (→ `std::lock_guard`) | — |
| `Entity` (Baseapp/Cellapp 各自定义) | `entitydef::Entity` | `entitydef/entity.h` |
| `ScriptDefModule` | `entitydef::ScriptDefModule` | `entitydef/scriptdef_module.h` |
| `EntityDefRegistry` | `entitydef::EntityDefRegistry` | `entitydef/scriptdef_module.h` |
| `PropertyDescription` | `entitydef::PropertyDescription` | `entitydef/property.h` |
| `MethodDescription` | `entitydef::MethodDescription` | `entitydef/method.h` |

### 4.4 宏变迁

| 原始宏 | 新宏/替代 | 说明 |
|--------|-----------|------|
| `KBE_SINGLETON_INIT(TYPE)` | **消除** | Meyer's Singleton 无需显式初始化 |
| `OBJECT_POOL_INIT_SIZE` | `ObjectPool` 构造参数默认值 16 | 不再使用宏 |
| `OBJECT_POOL_INIT_MAX_SIZE` | `ObjectPool` 构造参数默认值 16*1024 | 不再使用宏 |
| `THREAD_BUSY_SIZE` | **消除** | 新线程池架构不需要 |
| `DEBUG_MSG(...)` | `KBE_LOG_DEBUG(...)` | spdlog 宏 |
| `INFO_MSG(...)` | `KBE_LOG_INFO(...)` | spdlog 宏 |
| `WARNING_MSG(...)` | `KBE_LOG_WARN(...)` | spdlog 宏 |
| `ERROR_MSG(...)` | `KBE_LOG_ERROR(...)` | spdlog 宏 |
| `CRITICAL_MSG(...)` | `KBE_LOG_CRITICAL(...)` | spdlog 宏 |
| `KBE_PLATFORM == PLATFORM_WIN32` | **消除** | C++ 标准库跨平台 |
| `KBENGINE_VERSION` | `kbengine-ng` VERSION 0.1.0 | CMake project() |

---

## 5. API 变迁对照

### 5.1 ByteStream vs MemoryStream

```
操作              MemoryStream (原)              ByteStream (新)
────────────────  ────────────────────────────  ────────────────────────────────
写入整数          ms << uint32_t val;            bs << uint32_t val;  (相同 API)
读取整数          ms >> uint32_t val;            bs >> uint32_t val;  (相同 API)
写入字符串        ms.appendString(str);         bs << str;  (统一为 <<)
读取字符串        ms.readString(str);           bs >> str;  (统一为 >>)
写入 Blob         ms.appendBlob(data, len);     bs.appendBlob(data, len);  (相同)
读取 Blob         ms.readBlob();                bs.readBlob();  (相同)
打包浮点 XZ       ms.appendPackXZ(x, z);        bs.appendPackXZ(x, z);  (相同)
打包浮点 Y        ms.appendPackY(y);            bs.appendPackY(y);  (相同)
打包浮点 XYZ      ms.appendPackXYZ(x, y, z);    bs.appendPackXYZ(x, y, z);  (相同)
读打包 X          ms.readPackX();               bs.readPackX();  (相同)
读打包 Y          ms.readPackY();               bs.readPackY();  (相同)
读打包 Z          ms.readPackZ();               bs.readPackZ();  (相同)
获取读位置        ms.rpos();                    bs.rpos();  (相同)
设置读位置        ms.rpos(pos);                 bs.rpos(pos);  (相同)
获取写位置        ms.wpos();                    bs.wpos();  (相同)
设置写位置        ms.wpos(pos);                 bs.wpos(pos);  (相同)
获取大小          ms.size();                    bs.size();  (相同)
清空              ms.clear();                   bs.clear();  (相同)
原始数据指针      ms.data();                    bs.data();  (相同)
可读字节数        ms.opsize() → 计算属性         bs.readSpace();  (新增)
```

### 5.2 ObjectPool API

```
操作              ObjectPool (原)               ObjectPool (新)
────────────────  ────────────────────────────  ────────────────────────────────
获取对象          T* obj = pool.createObject();  auto obj = pool.acquire();  (unique_ptr)
归还对象          pool.reclaimObject(obj);       pool.release(std::move(obj));
RAII 包装         SmartPoolObject<T>             pool.acquireGuard() → Guard
自定义工厂        不支持                          pool.setFactory([]() { ... });
空闲数量          pool.freeObjectCount();        pool.freeCount();
```

### 5.3 ThreadPool API

```
操作              ThreadPool (原)               ThreadPool (新)
────────────────  ────────────────────────────  ────────────────────────────────
构造              ThreadPool(min, max, ...)      ThreadPool(numThreads)
提交任务          自定义 ThreadTask 继承          pool.submit(f, args...) → future
主线程回调        不支持                          pool.submitWithCallback(work, cb)
停止              pool.destroy();                pool.shutdown();
线程数            pool.currentFreeThreadCount()  pool.threadCount()
```

### 5.4 TimerQueue vs Timer

```
操作              Timer (原)                     TimerQueue (新)
────────────────  ────────────────────────────  ────────────────────────────────
添加定时器        TimersBase::add(init, repeat)  tq.add(offset, interval, cb)
取消定时器        handle.cancel();               tq.cancel(id);
处理到期          手动遍历                         tq.process(); / tq.process(now);
下次延迟          —                              tq.nextDelay();
清空              —                              tq.clear();
活跃数量          —                              tq.size();
```

### 5.5 EndPoint vs EndPoint

```
操作              EndPoint (原)                  EndPoint (新)
────────────────  ────────────────────────────  ────────────────────────────────
构造              EndPoint(fd, sockaddr_in)      EndPoint() → init(Type, ioCtx)
绑定              bind(port)                     bind(port)
监听              listen(backlog)                listen(backlog)
接受连接          accept(sockaddr_in*)           accept(addr&) → unique_ptr<EndPoint>
连接              connect(ip, port)              connect(ip, port)
TCP 发送          send(data, len)                send(data, len)
TCP 接收          recv(data, len)                recv(data, len)
UDP 发送          sendto(data, len, addr)        sendto(data, len, ip, port) / sendto(data, len, Address)
UDP 接收          recvfrom(data, len, addr)      recvfrom(data, len, addr)
获取本地地址      getLocalAddress()              localAddr() / localPort()
获取远程地址      getRemoteAddress()             remoteAddr()
关闭              close()                        close()
Socket 访问       socket_ (int/SOCKET)           tcpSocket() / udpSocket() (类型安全)
错误处理          返回值/异常                     asio::error_code 非异常
```

### 5.6 Channel vs Channel

```
操作              Channel (原)                   Channel (新)
────────────────  ────────────────────────────  ────────────────────────────────
构造              Channel(NetworkInterface&)     Channel(ioCtx, NetworkInterface&)
初始化            initialize(endpoint, proto)    initialize(endpoint, protoType)
接受连接          accept(EndPoint*)              accept(unique_ptr<EndPoint>)
连接              connect(ip, port)              connect(ip, port)
发送              send(Bundle*)                  send(unique_ptr<Bundle>)
状态查询          state()                        state() (强类型枚举)
销毁              destroy()                      condemn() → destroy()
超时设置          timeout_ (成员变量)             timeoutSeconds() / setTimeoutSeconds()
RAII              Channel* 裸指针                 shared_ptr + enable_shared_from_this
```

### 5.7 Bundle vs Bundle

```
操作              Bundle (原)                    Bundle (新)
────────────────  ────────────────────────────  ────────────────────────────────
开始消息          newMessage(msgHandler)         newMessage(msgHandler)
结束消息          finiMessage(isSend)            finiMessage(isSend)
写入整数          << val (14 个重载)              << val (12 个重载)
写入字符串        << string                       << string
写入 Blob         appendBlob(data, len)          appendBlob(data, len)
打包浮点          appendPackXZ/Y/XYZ             appendPackXZ/Y/XYZ (保持兼容)
获取包列表        packets()                       packets()
消息数量          numMessages()                   numMessages()
清空              clear()                         clear()
扩展长度          消息体末尾写入                   0xFFFF 后立即插入 (修正)
```

---

## 6. 文件索引 (原→新)

```
原始文件 (kbe/src/lib/)                      新文件 (rewrite/)
──────────────────────────────────────────   ───────────────────────────────────

=== common ===
common/memorystream.h               →       common/byte_stream.h
common/memorystream.cpp             →       common/byte_stream.cpp
common/memorystream_converter.h     →       [消除] 内联到 to_little_endian()
common/objectpool.h                 →       common/object_pool.h
common/timer.h                      →       common/timer_queue.h
common/timer.cpp                    →       common/timer_queue.cpp
common/timer.inl                    →       [消除] header-only
common/tasks.h                      →       [消除] std::function 替代
common/tasks.cpp                    →       [消除]
common/timestamp.h                  →       [消除] <chrono> 替代
common/timestamp.cpp                →       [消除]
common/singleton.h                  →       common/singleton.h
common/common.h                     →       [消除] 分散到 <cstdint>/<bit>
common/common.cpp                   →       [消除]
common/platform.h                   →       [消除] C++20 标准替代
common/blowfish.h                   →       crypto/crypto.h (Blowfish 类)
common/blowfish.cpp                 →       crypto/crypto.cpp
common/md5.h                        →       crypto/crypto.h (md5 函数)
common/md5.cpp                      →       crypto/crypto.cpp
common/sha1.h                       →       crypto/crypto.h (sha1 函数)
common/sha1.cpp                     →       crypto/crypto.cpp
common/rsa.h                        →       crypto/crypto.h (RSA 类)
common/rsa.cpp                      →       crypto/crypto.cpp
common/ssl.h                        →       [消除] OpenSSL EVP 覆盖
common/ssl.cpp                      →       [消除]
common/kbekey.h                     →       [消除] 延后到 Phase 2
common/kbekey.cpp                   →       [消除]
common/kbeversion.h                 →       [消除] CMake project VERSION
common/kbeversion.cpp               →       [消除]
common/base64.h                     →       [未迁移] 按需添加
common/base64.cpp                   →       [未迁移]
common/strutil.h                    →       [未迁移] 按需添加
common/strutil.cpp                  →       [未迁移]
common/stringconv.h                 →       [未迁移]
common/deadline.h                   →       [未迁移]
common/refcountable.h               →       [消除] shared_ptr 替代
common/smartpointer.h               →       [消除] unique_ptr/shared_ptr 替代
common/stdfindif_handers.h          →       [消除] C++20 ranges 替代
common/kbemalloc.h                  →       [消除] 可选 jemalloc/mimalloc

=== thread ===
thread/threadpool.h                 →       thread/thread_pool.h
thread/threadpool.cpp               →       thread/thread_pool.cpp
thread/threadpool.inl               →       [消除] header-only
thread/threadmutex.h                →       [消除] std::mutex 替代
thread/threadguard.h                →       [消除] std::lock_guard 替代
thread/threadtask.h                 →       [消除] std::packaged_task 替代
thread/concurrency.h                →       [消除] std::thread::hardware_concurrency()
thread/concurrency.cpp              →       [消除]

=== helper → 分散 ===
helper/debug_helper.h               →       common/logger.h
helper/debug_helper.cpp             →       [消除] spdlog 替代
helper/debug_option.h               →       [消除] spdlog 级别替代
helper/debug_option.cpp             →       [消除]
helper/profile.h                    →       [延后] Phase 3
helper/profile.cpp                  →       [延后]
helper/profile_handler.h            →       [延后]
helper/profile_handler.cpp          →       [延后]
helper/profiler.h                   →       [延后]
helper/profiler.cpp                 →       [延后]
helper/watcher.h                    →       [延后]
helper/watch_pools.h                →       [延后]
helper/sys_info.h                   →       [延后]
helper/sys_info.cpp                 →       [延后]
helper/crashhandler.h               →       [延后]
helper/crashhandler.cpp             →       [延后]
helper/console_helper.h             →       [延后]
helper/memory_helper.h              →       [消除] C++20 智能指针替代
helper/eventhistory_stats.h         →       [延后]
helper/eventhistory_stats.cpp       →       [延后]
helper/script_loglevel.h            →       [延后] Phase 4
helper/script_loglevel.cpp          →       [延后]

=== entitydef ===
entitydef/datatype.h                →       entitydef/data_type.h
entitydef/datatype.cpp              →       entitydef/data_type.cpp
entitydef/datatype.inl              →       [消除] header-only 模板
entitydef/datatypes.h               →       entitydef/data_type.h (合并)
entitydef/datatypes.cpp             →       entitydef/data_type.cpp (合并)
entitydef/property.h                →       entitydef/property.h
entitydef/property.cpp              →       entitydef/property.cpp
entitydef/method.h                  →       entitydef/method.h
entitydef/method.cpp                →       entitydef/method.cpp
entitydef/entitydef.h               →       entitydef/scriptdef_module.h (合并)
entitydef/entitydef.cpp             →       entitydef/scriptdef_module.cpp (合并)
entitydef/scriptdef_module.h        →       entitydef/scriptdef_module.h
entitydef/scriptdef_module.cpp      →       entitydef/scriptdef_module.cpp
entitydef/entity_call.h             →       [延后] EntityCall 类型
entitydef/entity_call.cpp           →       [延后]
entitydef/fixedarray.h              →       [延后] FixedArray 复合类型
entitydef/fixedarray.cpp            →       [延后]
entitydef/fixeddict.h               →       [延后] FixedDict 复合类型
entitydef/fixeddict.cpp             →       [延后]
entitydef/volatileinfo.h            →       entitydef/property.h (合并)
entitydef/volatileinfo.cpp          →       entitydef/property.cpp (合并)
entitydef/detaillevel.h             →       entitydef/property.h (合并)
entitydef/detaillevel.cpp           →       entitydef/property.cpp (合并)
entitydef/entity_garbages.h         →       [延后]
entitydef/entity_macro.h            →       [延后]
entitydef/remote_entity_method.h    →       [延后]

=== network ===
network/address.h                   →       network/address.h
network/address.cpp                 →       network/address.cpp
network/endpoint.h                  →       network/endpoint.h
network/endpoint.cpp                →       network/endpoint.cpp
network/channel.h                   →       network/channel.h
network/channel.cpp                 →       network/channel.cpp
network/bundle.h                    →       network/bundle.h
network/bundle.cpp                  →       network/bundle.cpp
network/packet.h                    →       network/packet.h
network/packet.cpp                  →       [消除] header-only
network/tcp_packet.h                →       [消除] 合并到 Packet
network/tcp_packet.cpp              →       [消除]
network/udp_packet.h                →       [消除] 合并到 Packet
network/udp_packet.cpp              →       [消除]
network/packet_reader.h             →       network/packet_reader.h
network/packet_reader.cpp           →       network/packet_reader.cpp
network/packet_receiver.h           →       [消除] 合并到 PacketReader
network/packet_receiver.cpp         →       [消除]
network/packet_sender.h             →       [消除] 合并到 Channel
network/packet_sender.cpp           →       [消除]
network/message_handler.h           →       network/message_handler_fwd.h
network/message_handler.cpp         →       network/message_handler.cpp
network/event_poller.h              →       network/event_poller.h
network/event_poller.cpp            →       network/event_poller.cpp
network/event_dispatcher.h          →       [消除] ASIO io_context 替代
network/event_dispatcher.cpp        →       [消除]
network/network_interface.h         →       network/network_interface.h
network/network_interface.cpp       →       network/network_interface.cpp
network/ikcp.h + ikcp.c             →       [延后] KCP 可靠传输延后评估
network/kcp_packet_*.h/.cpp (4个)   →       [延后] 依赖 KCP
network/encryption_filter.h         →       [消除] kbengine_crypto 替代
network/encryption_filter.cpp       →       [消除]
network/error_reporter.h            →       [消除] Logger 覆盖
network/error_reporter.cpp          →       [消除]
network/network_stats.h             →       [延后] Phase 3
network/network_stats.cpp           →       [延后]
network/listener_receiver.h         →       [消除] NetworkInterface 内联
network/listener_receiver.cpp       →       [消除]
network/delayed_channels.h          →       [延后] 延后评估
network/delayed_channels.cpp        →       [延后]
network/websocket_protocol.h        →       [延后] WebSocket 延后评估
network/websocket_protocol.cpp      →       [延后]
network/websocket_packet_filter.h   →       [延后]
network/websocket_packet_filter.cpp →       [延后]
network/websocket_packet_reader.h   →       [延后]
network/websocket_packet_reader.cpp →       [延后]
network/http_utility.h              →       [延后]
network/http_utility.cpp            →       [延后]

=== server ===
server/serverapp.h                  →       server/server_app.h (占位)
server/serverapp.cpp                →       server/server_app.cpp
server/components.h                 →       [延后] Phase 3
server/serverconfig.h               →       [延后]
server/signal_handler.h             →       [延后]
server/entity_app.h                 →       [延后] Phase 4
server/python_app.h                 →       [延后]
server/telnet_server.h              →       [延后]
server/machine_infos.h              →       [延后]
server/forward_messagebuffer.h      →       [延后]
server/globaldata_client.h          →       [延后]
server/globaldata_server.h          →       [延后]
server/script_timers.h              →       [延后]
server/callbackmgr.h                →       [延后]
server/shutdown_handler.h           →       [延后]
server/server_errors.h              →       [延后]

=== pyscript → pybind11 集成 (Phase 4) ===
pyscript/script.h                   →       [延后] Phase 4
pyscript/pickler.h                  →       [延后]
pyscript/py_memorystream.h          →       [延后]
pyscript/vector2.h                  →       [延后] → glm
pyscript/vector3.h                  →       [延后] → glm
pyscript/vector4.h                  →       [延后] → glm
pyscript/py_compression.h           →       [延后]
pyscript/py_gc.h                    →       [延后]
pyscript/py_platform.h              →       [延后]
pyscript/py_macros.h                →       [延后]
pyscript/pyobject_pointer.h         →       [消除] pybind11 自动管理
pyscript/pyprofile.h                →       [延后]
pyscript/pyurl.h                    →       [延后]
pyscript/pywatcher.h                →       [延后]
pyscript/pystruct.h                 →       [消除] pybind11 内建
pyscript/copy.h                     →       [消除] pybind11 内建
pyscript/sequence.h                 →       [消除] pybind11 内建
pyscript/map.h                      →       [消除] pybind11 内建
pyscript/pythread_lock.h            →       [消除] pybind11 gil_scoped_release
python/ (完整 Python 2.7 源码)       →       [消除] 用户安装 Python 3.x

=== math → glm (Phase 4) ===
math/math.h                         →       [延后] Phase 4 → glm
math/math.cpp                       →       [延后] → glm

=== navigation (Phase 4) ===
navigation/navigation.h             →       [延后] Phase 4
navigation/Recast* / Detour*        →       [延后] 更新版本

=== db_* (Phase 3) ===
db_interface/db_interface.h         →       [延后] Phase 3
db_mysql/                           →       [延后] → mariadb-connector-c
db_mongodb/                         →       [延后] → mongocxx
db_redis/                           →       [延后] → hiredis 精简

=== dependencies (19个库) ===
dependencies/apr                    →       [消除] C++20 标准库替代
dependencies/apr-util               →       [消除]
dependencies/fmt                    →       [消除] std::format 替代
dependencies/utf8cpp                →       [消除] char8_t 替代
dependencies/sigar                  →       [消除] 系统原生 API
dependencies/jwsmtp                 →       [消除]
dependencies/log4cxx                →       spdlog (FetchContent)
dependencies/tinyxml                →       pugixml (FetchContent, Phase 3)
dependencies/expat                  →       pugixml (同上)
dependencies/openssl                →       OpenSSL 3.x (vcpkg/系统包)
dependencies/mysql                  →       mariadb-connector-c (vcpkg)
dependencies/mongodb                →       mongocxx (vcpkg)
dependencies/g3dlite                →       glm (FetchContent, Phase 4)
dependencies/jemalloc               →       mimalloc (vcpkg, 可选)
dependencies/curl                   →       libcurl (vcpkg, 按需)
dependencies/zlib                   →       zlib (精简内嵌, Phase 2)
dependencies/hiredis                →       hiredis (精简内嵌, Phase 3)
dependencies/tmxparser              →       [按需保留]
dependencies/vld                    →       AddressSanitizer (跨平台)
```

---

## 维护日志

| 日期 | Phase | 变更 |
|------|-------|------|
| 2026-06-08 | 1 | 初始版本 — 完成 Phase 1 全部模块映射 |
| | | common: ByteStream, ObjectPool, TimerQueue, Singleton, Logger |
| | | crypto: Blowfish, RSA, MD5/SHA1/SHA256 |
| | | thread: ThreadPool |
| | | entitydef/network/server: 占位类型定义 |
| 2026-06-08 | 2 | Phase 2 网络层全部映射完成 |
| | | network: Address, EndPoint, Packet, PacketReader, Bundle, Channel, MessageHandler, EventPoller, NetworkInterface |
| | | ASIO standalone 替代 epoll/IOCP 手动封装 |
| | | TCPPacket/UDPPacket → Packet (合并), EventDispatcher → 消除, PacketReceiver/Sender → 消除 |
| | | 新增 kbengine_network 静态库，11 个源文件，55 个测试用例 |
| 2026-06-09 | 3 | Phase 3 服务进程框架全部映射完成 |
| | | server: ServerApp, ServerConfig, SignalHandler, ShutdownHandler, Components, IDAllocator |
| | | 原始 XML 解析 → INI key=value 格式，六重继承 → 持有子系统智能指针 |
| | | 新增 6 个测试套件（30 个测试用例），kbengine_server 静态库从占位升级为完整实现 |
| 2026-06-11 | 4 | Phase 4 实体系统全部映射完成 |
| | | entitydef: DataType, PropertyDescription, MethodDescription, ScriptDefModule, Entity |
| | | PropertyValue std::variant 替代 PyObject，原始 20+ 文件合并为 10 个源文件 |
| | | 新增 5 个测试套件（32 个测试用例），kbengine_entitydef 从占位升级为完整实现 |
