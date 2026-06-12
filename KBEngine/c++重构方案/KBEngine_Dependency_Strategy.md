# KBEngine 重写 — 第三方依赖库处理策略

> **日期**: 2026-06-08
> **背景**: 原始 KBEngine 将 19 个第三方库的完整源码内嵌在 `kbe/src/lib/dependencies/` 目录中

---

## 1. 原始依赖库分析

### 1.1 完整清单

原始 KBEngine 在 `kbe/src/lib/dependencies/` 下内嵌了以下 19 个库：

| 依赖库 | 原始用途 | 版本状态 | 替代方案 |
|--------|----------|----------|----------|
| **apr** | Apache 可移植运行时（线程、文件、网络） | 极度老旧 | `std::thread`、`std::filesystem`、ASIO |
| **apr-util** | APR 扩展工具 | 同上 | 同上 |
| **openssl** | SSL/TLS 加密 | 1.0.x 时代 | OpenSSL 3.x（系统安装或 vcpkg） |
| **log4cxx** | 日志系统 | Apache 归档项目 | **spdlog**（已采用，header-only） |
| **tinyxml** | XML 解析 | 停更多年 | pugixml 或 std::from_chars 自行解析 |
| **expat** | XML 流解析 | 旧版 | pugixml（统一 XML 方案） |
| **zlib** | 数据压缩 | 可用 | zlib 或 zstd |
| **mysql** | MySQL 客户端 | 旧 connector | MySQL Connector/C++ 或 mariadb-connector-c |
| **mongodb** | MongoDB C 驱动 | 旧版 | mongocxx (mongo-c-driver 的 C++ 封装) |
| **hiredis** | Redis C 客户端 | 可用 | hiredis（仍活跃维护，可保留） |
| **curl** | HTTP 客户端 | 可用 | libcurl 或 C++ REST SDK |
| **jemalloc** | 内存分配器 | 可用 | jemalloc / mimalloc |
| **fmt** | C++ 格式化 | 旧版 | **C++20 std::format**（编译器内建） |
| **g3dlite** | 3D 数学库 | 停更 | glm 或自写简单数学库 |
| **jwsmtp** | SMTP 邮件 | 停更 | libcurl SMTP 或删除（非核心功能） |
| **sigar** | 系统监控 (CPU/内存) | 停更 | 操作系统原生 API |
| **tmxparser** | Tiled 地图解析 | 旧版 | 按需保留，非引擎核心 |
| **utf8cpp** | UTF-8 处理 | 可用 | C++20 `char8_t` + 少量工具函数 |
| **vld** | Visual Leak Detector | Windows 专用 | AddressSanitizer (ASan) 跨平台 |

### 1.2 问题诊断

```
原始策略的问题：

1. 源码膨胀 — 19 个依赖库完整源码拖入仓库，数万文件
2. 版本锁定 — 所有库固定在某一版本，无法获取安全补丁
3. 构建缓慢 — 每次全量编译所有依赖
4. 维护负担 — 必须手动移植到新平台/编译器
5. 许可混乱 — 各种许可证混合，审计困难
6. 功能冗余 — apr+apr-util 做的事 std::thread/filesystem 已覆盖
```

---

## 2. 依赖分层策略

按照「紧耦合度」和「是否可被标准库替代」将依赖分为四层：

```
┌──────────────────────────────────────────────────────┐
│ Layer 0: 消除层 — 用 C++20 标准库完全替代           │
│ apr, apr-util, fmt, utf8cpp 的大部分, sigar          │
├──────────────────────────────────────────────────────┤
│ Layer 1: 升级层 — 用现代等价库替换                    │
│ log4cxx→spdlog, tinyxml+expat→pugixml,               │
│ openssl 1.x→3.x, mysql→mariadb-connector-c           │
├──────────────────────────────────────────────────────┤
│ Layer 2: 嵌入式 — 仍内嵌源码的小型关键库              │
│ zlib, hiredis (header-only 可精简)                    │
├──────────────────────────────────────────────────────┤
│ Layer 3: 包管理层 — 通过系统/vcpkg/conan 管理         │
│ OpenSSL, jemalloc/mimalloc, curl, mongo-c-driver      │
└──────────────────────────────────────────────────────┘
```

---

## 3. 逐库决策

### 3.1 Layer 0: 完全消除（用 C++20 替代）

| 原依赖 | 替代方案 | 原因 |
|--------|----------|------|
| **apr** | `std::thread`, `std::mutex`, `std::filesystem`, ASIO | C++20 标准库已覆盖线程、文件、网络基础操作 |
| **apr-util** | 同上 | APR 扩展，同样被标准库覆盖 |
| **fmt** | `std::format` (C++20) | 内建于编译器，无需外部依赖 |
| **utf8cpp** | `char8_t` + 少量辅助函数 | C++20 原生支持 UTF-8 字符类型 |
| **sigar** | `/proc` (Linux) / `GetProcessMemoryInfo` (Win) | 几十行代码即可替代，不需要完整库 |
| **jwsmtp** | 直接删除 | 发送邮件不是游戏服务器的核心功能，需要时用 libcurl SMTP |

**收益**: 消除 6 个库，减少数万行第三方代码。

### 3.2 Layer 1: 用现代等价库替换

| 原依赖 | 新依赖 | 版本策略 | 集成方式 |
|--------|--------|----------|----------|
| **log4cxx** | **spdlog 1.13+** | 固定主版本 | CMake FetchContent（已实施） |
| **tinyxml** | **pugixml 1.14+** | 固定主版本 | CMake FetchContent |
| **expat** | 同上（统一为 pugixml） | 同上 | 同上 |
| **openssl 1.x** | **OpenSSL 3.x** | 系统包或 vcpkg | `find_package(OpenSSL)` |
| **mysql** | **mariadb-connector-c** | 系统包或 vcpkg | `find_package` 或 FetchContent |
| **mongodb** | **mongo-c-driver + mongocxx** | vcpkg 推荐 | `find_package` |
| **g3dlite** | **glm** (header-only) | 固定版本 | CMake FetchContent（需要时才引入） |

### 3.3 Layer 2: 精简后内嵌

以下库体积小、无外部依赖、稳定，适合精简后内嵌：

| 库 | 精简方式 | 保留理由 |
|----|----------|----------|
| **zlib** | 只保留 `.c` 和 `.h`，去除文档/示例/测试 | 压缩是网络协议核心，必须内嵌保证可用 |
| **hiredis** | 只保留核心 `.c` 和 `.h` | Redis 客户端，体积小（~20 文件） |
| **tmxparser** | 按需，非 Phase 1-3 必需 | Tiled 地图解析，仅在需要时引入 |

**内嵌规范**:
```
rewrite/
├── third_party/              ← 统一的内嵌依赖目录
│   ├── CMakeLists.txt         ← 统一构建所有内嵌库
│   ├── zlib/
│   │   ├── CMakeLists.txt
│   │   ├── zlib.h
│   │   └── ...（仅核心源文件）
│   └── hiredis/
│       ├── CMakeLists.txt
│       ├── hiredis.h
│       └── ...（仅核心源文件）
```

### 3.4 Layer 3: 包管理器管理

以下库体积大、构建复杂、有系统依赖，通过包管理器获取：

| 库 | 推荐方式 | 备选 |
|----|----------|------|
| **OpenSSL 3.x** | vcpkg / 系统包 | CMake `find_package` |
| **jemalloc / mimalloc** | vcpkg | CMake `find_package` |
| **libcurl** | vcpkg / 系统包 | 按需（HTTP 客户端功能才需要） |
| **mongo-c-driver** | vcpkg | 按需（MongoDB 数据库才需要） |

---

## 4. 实施计划

### Phase 1（已完成）
- log4cxx → spdlog（CMake FetchContent，已实施）
- 其他依赖暂不引入，核心库纯 C++20 自包含

### Phase 2（网络层）
- 引入 zlib 内嵌（精简版，网络压缩需要）
- 引入 OpenSSL 3.x（加密通道需要）
- 决策: 网络事件循环 — ASIO 作为 FetchContent 还是系统包？

### Phase 3（服务框架）
- 引入 hiredis 内嵌（Redis 缓存可选）
- 引入 mariadb-connector-c（数据库代理）
- 引入 pugixml（配置文件解析）

### Phase 4（实体系统 + Python）
- 引入 pybind11（CMake FetchContent，header-only 可行）
- 引入 glm（3D 数学，header-only）

---

## 5. CMake 统一管理方案

```cmake
# rewrite/cmake/ThirdParty.cmake

# === Layer 2: 内嵌库 ===
add_subdirectory(third_party)  # zlib, hiredis

# === Layer 1+3: 包管理库 ===

# 方式 A: 优先使用系统已安装的
find_package(OpenSSL QUIET)
if(NOT OpenSSL_FOUND)
    message(STATUS "OpenSSL not found, crypto module disabled")
    set(ENABLE_CRYPTO OFF)
endif()

# 方式 B: vcpkg 集成（开发者只需 cmake -DCMAKE_TOOLCHAIN_FILE=...）
# find_package(OpenSSL REQUIRED)

# 方式 C: FetchContent 兜底（仅对 header-only 或小型库适用）
# FetchContent_Declare(pugixml ...)
```

### 推荐: vcpkg manifest 模式

```json
// rewrite/vcpkg.json
{
    "name": "kbengine-ng",
    "version": "0.1.0",
    "dependencies": [
        "openssl",
        "zlib",
        "hiredis",
        "pugixml",
        "mariadb-connector-c",
        "glm"
    ],
    "features": {
        "mongodb": {
            "dependencies": ["mongo-c-driver"]
        },
        "allocator": {
            "dependencies": ["mimalloc"]
        }
    }
}
```

开发者在自己的机器上：
```bash
# 安装 vcpkg 后，一条命令拉取所有依赖
vcpkg install --triplet x64-windows
cmake -B build -DCMAKE_TOOLCHAIN_FILE=[vcpkg-root]/scripts/buildsystems/vcpkg.cmake
```

---

## 6. 对比总结

| 维度 | 原始策略 | 新策略 |
|------|----------|--------|
| 依赖总数 | 19 个全部内嵌 | 6 个消除 + 6 个替换 + 3 个精简内嵌 + 4 个包管理 |
| 仓库体积 | 数万第三方文件 | 内嵌部分 < 200 文件 |
| 版本更新 | 手动替换源码 | 修改版本号/vcpkg.json |
| 安全补丁 | 手动追踪 | 包管理器自动更新 |
| 编译速度 | 每次全量编译 | 内嵌库只编译一次（静态库缓存） |
| 平台适配 | 手动移植 | 标准库 + vcpkg 已适配 |
| 许可合规 | 19 种许可证混杂 | 每种明确标注，vcpkg 自动检查 |

---

## 7. 每个 Phase 完成后的依赖状态

```
Phase 1 完成时:
  内嵌: 无（纯 C++20）
  FetchContent: spdlog, Google Test
  包管理: 无

Phase 2 完成时:
  内嵌: zlib (精简版)
  FetchContent: spdlog, Google Test, ASIO(待定)
  包管理: OpenSSL 3.x

Phase 3 完成时:
  内嵌: zlib, hiredis
  FetchContent: spdlog, Google Test, ASIO, pugixml
  包管理: OpenSSL 3.x, mariadb-connector-c, mimalloc

Phase 4 完成时:
  内嵌: zlib, hiredis
  FetchContent: spdlog, Google Test, ASIO, pugixml, pybind11, glm
  包管理: OpenSSL 3.x, mariadb-connector-c, mimalloc
```
