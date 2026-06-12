# KBEngine Python 3.11 升级 — Phase 2 编译指南

> **分支**: `python-upgrade-3.11`
> **日期**: 2026-06-09
> **前置**: Phase 1 代码修改已完成

---

## 目录

1. [环境要求](#1-环境要求)
2. [编译概览](#2-编译概览)
3. [步骤 1: 编译 Python 3.11 静态库](#3-步骤-1-编译-python-311-静态库)
4. [步骤 2: 编译 KBEngine 依赖库](#4-步骤-2-编译-kbengine-依赖库)
5. [步骤 3: 编译 KBEngine 核心库](#5-步骤-3-编译-kbengine-核心库)
6. [步骤 4: 编译服务器组件](#6-步骤-4-编译服务器组件)
7. [步骤 5: 验证编译产物](#7-步骤-5-验证编译产物)
8. [常见问题排查](#8-常见问题排查)
9. [Windows 编译](#9-windows-编译)
10. [回滚方案](#10-回滚方案)

---

## 1. 环境要求

### 操作系统

- **推荐**: CentOS 7+ / Ubuntu 18.04+ / Debian 10+ (64-bit)
- 确保是 **x86_64** 架构（KBEngine 默认配置 `Hybrid64`）

### 编译工具链

| 工具 | 最低版本 | 检查命令 |
|------|---------|---------|
| GCC/G++ | 5.0+ (需支持 C++11) | `gcc --version` |
| GNU Make | 3.81+ | `make --version` |
| autoconf | 2.69+ | `autoconf --version` |

### 系统库依赖

```bash
# CentOS / RHEL
sudo yum install -y gcc gcc-c++ make autoconf openssl-devel zlib-devel \
    mysql-devel ncurses-devel bzip2-devel readline-devel sqlite-devel \
    libffi-devel expat-devel

# Ubuntu / Debian
sudo apt-get install -y build-essential autoconf libssl-dev zlib1g-dev \
    libmysqlclient-dev libncurses5-dev libbz2-dev libreadline-dev \
    libsqlite3-dev libffi-dev libexpat1-dev
```

> **注意**: KBEngine 自带编译 openssl、zlib、expat，系统级安装是可选的。但 `libffi`、`libbz2`、`libreadline`、`libsqlite3` 等在 Python `./configure` 阶段需要系统库支持，否则相关标准库模块将缺失。

### 验证

```bash
# 确认所有必需工具可用
gcc --version && g++ --version && make --version && autoconf --version

# 确认 x86_64 架构
uname -m   # 应输出: x86_64
```

---

## 2. 编译概览

KBEngine 的编译是**分层递进**的：

```
┌────────────────────────────────────────────────┐
│  第 1 层: Python 3.11 静态库                      │
│  kbe/src/lib/python/  →  libpython3.11.a         │
│  (./configure && make)                            │
├────────────────────────────────────────────────┤
│  第 2 层: KBEngine 依赖库                          │
│  dependencies/{zlib,fmt,jemalloc,openssl,curl,    │
│    hiredis,g3dlite,tinyxml,sigar,tmxparser,       │
│    jwsmtp,apr,expat,apr-util,log4cxx}             │
├────────────────────────────────────────────────┤
│  第 3 层: KBEngine 核心库                          │
│  client_lib, common, db_redis, db_mysql,          │
│  db_interface, entitydef, math, resmgr,           │
│  pyscript, server, navigation, network,           │
│  helper, thread, xml                              │
├────────────────────────────────────────────────┤
│  第 4 层: 服务器可执行文件                          │
│  baseapp, baseappmgr, cellapp, cellappmgr,        │
│  centermgr, dbmgr, loginapp, machine,             │
│  tools/{bots, interfaces, kbcmd, logger}          │
└────────────────────────────────────────────────┘
```

执行入口是 `kbe/src/lib/Makefile`（第 1-3 层）和 `kbe/src/server/Makefile`（第 4 层）。

---

## 3. 步骤 1: 编译 Python 3.11 静态库

### 3.1 进入 Python 源码目录

```bash
cd /path/to/kbengine_master/kbe/src/lib/python
```

### 3.2 清理旧构建产物（如果有）

```bash
make distclean 2>/dev/null || true
```

### 3.3 运行 configure

```bash
./configure \
    --enable-shared=no \
    --without-ensurepip \
    --disable-ipv6 \
    --disable-test-modules \
    CFLAGS="-O2 -fPIC"
```

#### 参数说明

| 参数 | 作用 | 为什么需要 |
|------|------|-----------|
| `--enable-shared=no` | 编译为静态库 | KBEngine 静态链接 Python，不依赖系统 `libpython.so` |
| `--without-ensurepip` | 不安装 pip | KBEngine 运行时不使用 pip，减小体积 |
| `--disable-ipv6` | 禁用 IPv6 支持 | KBEngine 使用自己的网络层，不依赖 Python socket 模块的 IPv6 |
| `--disable-test-modules` | 跳过测试模块 | 减少编译时间，KBEngine 不运行 CPython 测试套件 |
| `CFLAGS="-O2 -fPIC"` | 优化 + 位置无关代码 | `-fPIC` 是静态库链接到共享对象（.so）所必需的 |

#### 预期输出

成功时最后几行：

```
creating Modules/Setup.local
creating Makefile
...
configure: creating ./config.status
config.status: creating Makefile.pre
config.status: creating Modules/Setup.config
config.status: creating Misc/python.pc
config.status: creating Misc/python-config.sh
config.status: creating pyconfig.h
```

如果出现错误，跳到 [8. 常见问题排查](#8-常见问题排查)。

### 3.4 验证 pyconfig.h 已生成

```bash
ls -la pyconfig.h
# 应存在且时间戳为当前时间
```

### 3.5 编译 Python

```bash
make -j$(nproc)
```

- `-j$(nproc)` 使用所有 CPU 核心并行编译，加速构建
- 编译时间：通常 3-8 分钟（取决于 CPU 核心数）

#### 预期输出

成功时最后几行：

```
...
gcc -c -O2 -fPIC ... Python/dynamic_annotations.c -o Python/dynamic_annotations.o
...
ar rsu libpython3.11.a Modules/getbuildinfo.o ...
```

### 3.6 确认静态库已生成

```bash
ls -la libpython3.11.a
# 应看到: libpython3.11.a (通常 50-80 MB)

# 验证库中有目标文件
ar t libpython3.11.a | head -20
# 应列出 .o 文件
```

### 3.7 快速验证 Python 解释器

```bash
# 生成的 python 可执行文件
./python --version
# 应输出: Python 3.11.11

# 测试基本功能
./python -c "import sys; print(sys.version)"
# 应输出: 3.11.11 (main, ...)
```

---

## 4. 步骤 2: 编译 KBEngine 依赖库

### 4.1 编译所有依赖和核心库

```bash
cd /path/to/kbengine_master/kbe/src/lib
make -j$(nproc)
```

这个命令会自动按顺序编译：

1. **zlib** → `kbe/src/libs/libz.a`
2. **fmt** → `kbe/src/libs/libfmt.a`
3. **jemalloc** → `kbe/src/libs/libjemalloc.a`
4. **openssl** → `kbe/src/libs/libssl.a`, `libcrypto.a`
5. **curl** → `kbe/src/libs/libcurl.a`
6. **hiredis** → `kbe/src/libs/libhiredis.a`
7. **g3dlite** → `kbe/src/libs/libg3dlite.a`
8. **tinyxml** → `kbe/src/libs/libtinyxml.a`
9. **sigar** → `kbe/src/libs/libsigar.a`
10. **tmxparser** → `kbe/src/libs/libtmxparser.a`
11. **jwsmtp** → `kbe/src/libs/libjwsmtp.a`
12. **apr** → `kbe/src/libs/libapr-1.a`
13. **expat** → `kbe/src/libs/libexpat.a`
14. **apr-util** → `kbe/src/libs/libaprutil-1.a`
15. **log4cxx** → `kbe/src/libs/liblog4cxx.a`

然后是 **Python**（已在步骤 1 编译）和核心库。

### 4.2 检查依赖库编译结果

```bash
ls -la /path/to/kbengine_master/kbe/src/libs/
# 应看到: libpython.a, libz.a, libfmt.a, libjemalloc.a, libssl.a, libcrypto.a, ...

# 确认 libpython.a 是从 libpython3.11.a 复制的
ls -la /path/to/kbengine_master/kbe/src/libs/libpython.a
```

---

## 5. 步骤 3: 编译 KBEngine 核心库

Makefile 的第 40-56 行会自动编译这些库（已包含在 `make` 中）：

| 库 | 路径 | 说明 |
|----|------|------|
| client_lib | `kbe/src/lib/client_lib/` | 客户端库 |
| common | `kbe/src/lib/common/` | 通用功能 |
| db_redis | `kbe/src/lib/db_redis/` | Redis 数据库接口 |
| db_mysql | `kbe/src/lib/db_mysql/` | MySQL 数据库接口 |
| db_interface | `kbe/src/lib/db_interface/` | 数据库抽象层 |
| entitydef | `kbe/src/lib/entitydef/` | 实体定义 |
| math | `kbe/src/lib/math/` | 数学库 |
| resmgr | `kbe/src/lib/resmgr/` | 资源管理 |
| **pyscript** | `kbe/src/lib/pyscript/` | **Python 脚本桥接层（核心修改文件所在库）** |
| server | `kbe/src/lib/server/` | 服务器基础框架 |
| navigation | `kbe/src/lib/navigation/` | 导航网格 |
| network | `kbe/src/lib/network/` | 网络层 |
| helper | `kbe/src/lib/helper/` | 辅助工具 |
| thread | `kbe/src/lib/thread/` | 线程池 |
| xml | `kbe/src/lib/xml/` | XML 解析 |

**重点关注 `pyscript` 库**，这是 Phase 1 修改 `scriptobject.cpp` 所在的库。

### 5.1 检查 pyscript 编译

```bash
# 确认 pyscript 库编译成功
ls -la /path/to/kbengine_master/kbe/src/libs/libpyscript.a

# 验证 scriptobject.o 在其中
ar t /path/to/kbengine_master/kbe/src/libs/libpyscript.a | grep scriptobject
```

---

## 6. 步骤 4: 编译服务器组件

### 6.1 编译所有服务器

```bash
cd /path/to/kbengine_master/kbe/src/server
make -j$(nproc)
```

这会编译以下可执行文件到 `kbe/bin/server/`：

| 可执行文件 | 说明 | 使用 Python |
|-----------|------|------------|
| `baseapp` | 游戏逻辑服务器（最复杂） | ✅ |
| `baseappmgr` | Baseapp 管理器 | ✅ |
| `cellapp` | 空间模拟服务器 | ✅ |
| `cellappmgr` | Cellapp 管理器 | ✅ |
| `centermgr` | 中心管理器 | ✅ |
| `dbmgr` | 数据库管理器 | ✅ |
| `loginapp` | 登录服务器 | ✅ |
| `machine` | 守护进程 | ✅ |
| `tools/bots` | 压力测试客户端 | ✅ |
| `tools/interfaces` | HTTP 网关 | ✅ |
| `tools/kbcmd` | SDK 生成工具 | ✅ |
| `tools/logger` | 集中日志收集 | ✅ |

所有组件都标记了 `USE_PYTHON = 1`，因此都链接了 `libpython.a`。

### 6.2 确认可执行文件生成

```bash
ls -la /path/to/kbengine_master/kbe/bin/server/
# 应看到: baseapp, cellapp, dbmgr, loginapp, machine, ...
```

---

## 7. 步骤 5: 验证编译产物

### 7.1 验证 Python 版本嵌入正确

```bash
# 检查 baseapp 是否链接了正确的 libpython
ldd /path/to/kbengine_master/kbe/bin/server/baseapp 2>/dev/null | grep python || \
    echo "Python 是静态链接的，不出现在 ldd 输出中（正常）"

# 用 strings 检查嵌入的 Python 版本
strings /path/to/kbengine_master/kbe/bin/server/baseapp | grep "Python 3\."
# 应输出: Python 3.11.11
```

### 7.2 验证标准库复制

```bash
# 确认 Python 标准库已复制到运行时目录
ls /path/to/kbengine_master/kbe/res/scripts/common/Lib/ | wc -l
# 应有 ~200+ 个模块/包

# 确认 os.py 等核心模块存在
ls /path/to/kbengine_master/kbe/res/scripts/common/Lib/os.py
ls /path/to/kbengine_master/kbe/res/scripts/common/Lib/sys.py

# 确认动态模块目录
ls /path/to/kbengine_master/kbe/res/scripts/common/lib-dynload/
# 应有 .so 文件（如 math.cpython-311-x86_64-linux-gnu.so 等）
```

### 7.3 验证 Python 3.11 特性可用

```bash
# 测试合并字典操作符 (Python 3.9+)
/path/to/kbengine_master/kbe/src/lib/python/python -c \
    "a = {'x': 1}; b = {'y': 2}; print(a | b)"
# 应输出: {'x': 1, 'y': 2}

# 测试 match-case (Python 3.10+)
/path/to/kbengine_master/kbe/src/lib/python/python -c \
    "match 1: case 1: print('ok')"
# 应输出: ok

# 测试异常组 (Python 3.11+)
/path/to/kbengine_master/kbe/src/lib/python/python -c \
    "try: raise ExceptionGroup('test', [ValueError('a')])
except* ValueError: print('caught')"
# 应输出: caught
```

### 7.4 验证移除的模块

```bash
# imp 模块在 Python 3.4+ 废弃，3.12 移除（3.11 中仍可用但警告）
/path/to/kbengine_master/kbe/src/lib/python/python -c \
    "import imp; print('imp available')"
# 应输出但可能有 DeprecationWarning
```

---

## 8. 常见问题排查

### 8.1 `configure` 失败

#### 问题：找不到 C 编译器

```
configure: error: no acceptable C compiler found in $PATH
```

**解决**：
```bash
sudo yum install -y gcc    # CentOS
sudo apt install -y gcc    # Ubuntu
```

#### 问题：缺少 OpenSSL 头文件

```
error: openssl/ssl.h: No such file or directory
```

**解决**：
```bash
sudo yum install -y openssl-devel    # CentOS
sudo apt install -y libssl-dev       # Ubuntu
```

或使用 KBEngine 自带的 OpenSSL：
```bash
# 确保依赖库中的 OpenSSL 已编译
cd /path/to/kbengine_master/kbe/src/lib/dependencies/openssl
make
```

#### 问题：缺少 libffi

```
ModuleNotFoundError: No module named '_ctypes'
```

**解决**：
```bash
sudo yum install -y libffi-devel     # CentOS
sudo apt install -y libffi-dev       # Ubuntu
```

### 8.2 编译错误

#### 问题：`PyObject_INIT` 未定义

```
error: 'PyObject_INIT' was not declared in this scope
```

**原因**：这个宏在 Python 3.12 中被移除。如果遇到此错误，说明链接到了 Python 3.12+ 的头文件。
**确认**：Phase 1 已将 `scriptobject.cpp` 改为 `PyObject_Init`，不应出现此错误。如果出现，检查 `scriptobject.cpp` 是否已修改。

#### 问题：`_PyObject_NEW` 未定义

```
error: '_PyObject_NEW' was not declared
```

**原因**：`_PyObject_NEW` 在 Python 3.8 废弃，3.11 中仍存在但标记为内部 API。
**确认**：Phase 0 审计确认 KBEngine 未使用此 API。如果出现，说明某个未扫描到的文件使用了它。

#### 问题：`tp_print` 字段警告

```
warning: 'tp_print' is deprecated [-Wdeprecated-declarations]
```

**影响**：这是 Python 3.11 中的废弃警告，不影响编译和运行。Phase 1 已验证宏中值为 0，安全。

### 8.3 链接错误

#### 问题：找不到 `-lpython3.7m`

```
/usr/bin/ld: cannot find -lpython3.7m
```

**原因**：某个 `.vcxproj` 或 `.depend` 缓存未更新。
**解决**：
```bash
# 检查是否还有残留的 python37 引用
grep -r "python3.7" /path/to/kbengine_master/kbe/src/build/
grep -r "python37" /path/to/kbengine_master/kbe/src/server/*/Makefile

# 清理依赖文件
find /path/to/kbengine_master/kbe/src -name "*.d" -delete
find /path/to/kbengine_master/kbe/src -name "*.o" -delete
```

#### 问题：符号未定义

```
undefined reference to `PyObject_Init'
```

**原因**：链接时找不到 Python 库。
**检查**：
```bash
# 确认 libpython.a 存在
ls -la /path/to/kbengine_master/kbe/src/libs/libpython.a

# 确认符号在其中
nm /path/to/kbengine_master/kbe/src/libs/libpython.a | grep PyObject_Init
# 应显示: T PyObject_Init  (T = text section, 函数已定义)
```

### 8.4 `pyscript` 编译失败

如果 `pyscript` 库编译失败，这是最需要关注的问题——它包含 Phase 1 修改的 `scriptobject.cpp`。

```bash
# 单独编译 pyscript 查看详细错误
cd /path/to/kbengine_master/kbe/src/lib/pyscript
make clean
make
```

常见原因：
- **头文件版本不匹配**：检查 `#include` 路径是否正确指向 Python 3.11 的 `Include/`
- **C++11 兼容性**：Python 3.11 头文件使用了一些 C++11 特性，确保 `common.mak` 中 `-std=c++11` 已设置

---

## 9. Windows 编译 (VS2019 实测结果)

> **编译日期**: 2026-06-09
> **编译环境**: Windows 10 + Visual Studio 2019 Community (MSVC 14.29.30133, PlatformToolset v142)
> **Shell**: MSYS2 bash (需设置 `MSYS2_ARG_CONV_EXCL="*"` 防止路径转换)
> **编译配置**: Debug x64 (Release 同理)

### 9.1 前提

- Visual Studio 2019 Community（MSVC v142）
- Python 3.11.11 源码已在 `kbe/src/lib/python/`
- Phase 1 中所有 vcxproj 文件已修改（python37→python311）
- KBEngine 自带的 OpenSSL（旧版本 < 1.1.1）和 zlib 在 `kbe/src/lib/dependencies/` 下

### 9.2 编译步骤与实测结果

#### Step 1: 编译 Python 3.11 (pythoncore)

**关键发现**: 不能直接编译 `pythoncore.vcxproj`，因为缺少 frozen modules 头文件。必须通过 `pcbuild.proj` 入口编译。

**MSYS2 兼容性**: 在 MSYS2 bash 中调用 MSBuild 必须设置 `MSYS2_ARG_CONV_EXCL="*"`，否则 `/t:Build` 会被转换为 Windows 路径。

**编译命令**:

```bash
cd /I/kbengine/kbengine_master/kbe/src/lib/python/PCbuild

# 先编译 _freeze_module.exe（生成 frozen modules 头文件）
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj \
  /t:_freeze_module \
  /p:Configuration=Debug /p:Platform=x64

# 编译完整 pythoncore（Debug + Release 均测试通过）
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj \
  /t:Build \
  /p:Configuration=Debug /p:Platform=x64 \
  /p:IncludeCTypes=false /p:IncludeSSL=false
```

**必须禁用的模块**: `IncludeCTypes=false`（缺少 libffi）、`IncludeSSL=false`（OpenSSL 版本过旧）。

**编译产物**:

| 文件 | 路径 |
|------|------|
| `python311_d.dll` | `PCbuild/amd64/python311_d.dll` |
| `python311_d.lib` | `PCbuild/amd64/python311_d.lib` |
| `python311_d.pdb` | `PCbuild/amd64/python311_d.pdb` |
| `python311.lib` | 复制到 `kbe/src/libs/python311.lib` |
| `python311_d.lib` | 复制到 `kbe/src/libs/python311_d.lib` |

**结果**: ✅ 编译通过（0 errors），Release 和 Debug 均成功。

---

#### Step 2: 解决 Python externals 依赖

Python 的 PCbuild 系统期望 externals 在 `kbe/src/lib/python/externals/` 下。

##### zlib 缺失修复

错误: `fatal error C1083: Cannot open include file: 'zlib.h'`

修复:
```bash
# 从 KBEngine 自带的 zlib 复制到 Python externals 目录
SRC=/I/kbengine/kbengine_master/kbe/src/lib/dependencies/zlib
DST=/I/kbengine/kbengine_master/kbe/src/lib/python/externals/zlib-1.3.1
mkdir -p "$DST"
cp "$SRC"/*.h "$SRC"/*.c "$DST/"
```

##### OpenSSL 版本不兼容

KBEngine 自带的 OpenSSL 版本过旧（< 1.1.1），不支持 `SSL_OP_NO_TLSv1_3` 等 API。

**决定**: `_ssl` 和 `_hashlib` 模块通过 `IncludeSSL=false` 禁用。这些模块不是 KBEngine 服务器运行所必需的——KBEngine 使用自己的加密和网络层。

##### libffi 缺失

**决定**: `_ctypes` 模块通过 `IncludeCTypes=false` 禁用。KBEngine 服务器不依赖 ctypes。

---

#### Step 3: 编译 KBEngine 依赖库

**编译命令**:

```bash
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe \
  /I/kbengine/kbengine_master/kbe/kbengine.sln \
  /t:Build \
  /p:Configuration=Debug /p:Platform=x64
```

**编译成功的依赖库（共 28 个）**:

| 库 | 输出 |
|----|------|
| entitydef | `entitydef_d.lib` |
| apr | `apr-1_d.lib` |
| aprutil | `aprutil-1_d.lib` |
| expat | `expat_d.lib` |
| log4cxx | `log4cxx_d.lib` |
| helper | `helper_d.lib` |
| math | `math_d.lib` |
| libeay32 (OpenSSL libcrypto) | `libeay32_d.lib` |
| ssleay32 (OpenSSL libssl) | `ssleay32_d.lib` |
| zlib | `zlib_d.lib` |
| **pythoncore** | `python311_d.dll` + `python311_d.lib` |
| **pyscript** | `pyscript_d.lib` （含修改后的 scriptobject.cpp）|
| xml | `xml_d.lib` |
| jwsmtp | `jwsmtp_d.lib` |
| server | `server_d.lib` |
| thread | `thread_d.lib` |
| common | `common_d.lib` |
| libcurl | `libcurl_d.lib` |
| network | `network_d.lib` |
| client_lib | `client_lib_d.lib` |
| resmgr | `resmgr_d.lib` |
| db_mysql | `db_mysql_d.lib` |
| navigation | `navigation_d.lib` |
| tmxparser | `tmxparser_d.lib` |
| hiredis | `hiredis_d.lib` |
| fmt | `fmt_d.lib` |
| bson_static | `bson_static_d.lib` |
| mongoc_static | `mongoc_static_d.lib` |

**pyscript 编译**: ✅ 0 errors, 仅 warnings（C4244/C4267 类型转换警告，来自 Python C API 的 Py_ssize_t↔int 转换，不影响功能）。

**失败的项目**（预期内，不影响服务器运行）:

| 项目 | 失败原因 |
|------|---------|
| `_ctypes` | 缺少 libffi 头文件 (`ffi.h`) |
| `_ssl` | OpenSSL 版本过旧（< 1.1.1），缺少 `SSL_OP_NO_TLSv1_3` 等 |
| `_hashlib` | 同上，依赖新版 OpenSSL |

---

#### Step 4: 编译 KBEngine 服务器组件

由于 `kbengine.sln` 中包含上述会失败的 Python 扩展模块项目，改为逐个编译各服务器项目。

**编译命令**:

```bash
# 逐个编译 12 个服务器可执行文件
for proj in baseapp baseappmgr cellapp cellappmgr centermgr dbmgr loginapp machine \
    tools/bots tools/interfaces tools/kbcmd tools/logger; do
    MSYS2_ARG_CONV_EXCL="*" MSBuild.exe \
        "/I/kbengine/kbengine_master/kbe/src/server/$proj/${proj##*/}.vcxproj" \
        /t:Build \
        /p:Configuration=Debug /p:Platform=x64
done
```

**编译结果: 全部 12 个服务器组件编译成功 ✅**

| 可执行文件 | 大小 | 状态 |
|-----------|------|------|
| `baseapp.exe` | ~15 MB | ✅ |
| `baseappmgr.exe` | ~8 MB | ✅ |
| `cellapp.exe` | ~14 MB | ✅ |
| `cellappmgr.exe` | ~8 MB | ✅ |
| `centermgr.exe` | ~7 MB | ✅ |
| `dbmgr.exe` | ~10 MB | ✅ |
| `loginapp.exe` | ~7 MB | ✅ |
| `machine.exe` | ~7 MB | ✅ |
| `bots.exe` | ~8 MB | ✅ |
| `interfaces.exe` | ~7 MB | ✅ |
| `kbcmd.exe` | ~6 MB | ✅ |
| `logger.exe` | ~7 MB | ✅ |

**Python 3.11 链接验证**: 通过 `strings baseapp.exe | findstr "python311"` 确认 `python311_d.dll` 已嵌入 baseapp.exe 的导入表中。

---

### 9.3 编译结果汇总

| 阶段 | 状态 | 说明 |
|------|------|------|
| Python 3.11 静态库 | ✅ 通过 | Debug + Release 均编译成功 |
| KBEngine 依赖库 | ✅ 通过 | 28 个 .lib 全部生成 |
| KBEngine 核心库 (pyscript) | ✅ 通过 | 含 Phase 1 修改，0 errors |
| 服务器组件 | ✅ 通过 | 12 个 .exe 全部编译成功 |
| Python 扩展模块 | ⚠️ 部分 | `_ctypes`, `_ssl`, `_hashlib` 未编译（不需要） |

### 9.4 Windows 编译注意事项

- **MSYS2 bash**: 必须在 MSBuild 前加 `MSYS2_ARG_CONV_EXCL="*"` 防止路径转换
- **MSBuild 入口**: 使用 `pcbuild.proj` 而非 `pythoncore.vcxproj`（自动生成 frozen modules）
- **Python externals**: 需要手动复制 zlib 源文件到 `externals/zlib-1.3.1/`
- **禁用不必要的扩展**: `IncludeCTypes=false IncludeSSL=false`
- **不要编译完整 .sln**: 直接编译的 Python 扩展模块项目会失败，应逐个编译服务器项目
- **guiconsole**: 依赖 MFC/Qt，不在本次编译范围内

---

## 10. 回滚方案

如果编译失败且无法修复，可以回滚到 Python 3.7：

### 方式 1: Git 回滚

```bash
cd /path/to/kbengine_master
git checkout master
git branch -D python-upgrade-3.11
```

### 方式 2: 备份恢复

```bash
cd /path/to/kbengine_master

# 恢复 Python 源码
rm -rf kbe/src/lib/python
mv kbe/src/lib/python-3.7-backup kbe/src/lib/python

# 恢复标准库
rm -rf kbe/res/scripts/common/Lib
mv kbe/res/scripts/common/Lib-3.7-backup kbe/res/scripts/common/Lib

# 清理 Python 3.11 编译产物
rm -f kbe/src/libs/libpython.a
rm -rf kbe/res/scripts/common/lib-dynload/
```

---

## 附录 A: 构建时间估算

| 步骤 | 内容 | 预计时间 |
|------|------|---------|
| 1 | Python 3.11 configure + make | 5-10 分钟 |
| 2 | KBEngine 依赖库 | 3-5 分钟 |
| 3 | KBEngine 核心库 | 2-4 分钟 |
| 4 | 服务器组件 | 3-5 分钟 |
| **总计** | | **15-25 分钟** |

> 基于 4 核 CPU 估算，实际时间取决于硬件配置。

## 附录 B: 一键编译脚本

```bash
#!/bin/bash
# Phase2_build.sh — KBEngine Python 3.11 升级一键编译脚本
set -e

KBE_ROOT="/path/to/kbengine_master"   # 修改为实际路径
JOBS=$(nproc)

echo "=== Phase 2: KBEngine Python 3.11 Build ==="
echo "KBE_ROOT=$KBE_ROOT"
echo "JOBS=$JOBS"
echo ""

# Step 1: Python 3.11
echo "--- Step 1: Building Python 3.11 ---"
cd "$KBE_ROOT/kbe/src/lib/python"
make distclean 2>/dev/null || true
./configure \
    --enable-shared=no \
    --without-ensurepip \
    --disable-ipv6 \
    --disable-test-modules \
    CFLAGS="-O2 -fPIC"
make -j$JOBS
echo "Python 3.11 build OK."

# Step 2-3: KBEngine libs
echo ""
echo "--- Step 2-3: Building KBEngine libraries ---"
cd "$KBE_ROOT/kbe/src/lib"
make -j$JOBS
echo "KBEngine libraries build OK."

# Step 4: Server components
echo ""
echo "--- Step 4: Building server components ---"
cd "$KBE_ROOT/kbe/src/server"
make -j$JOBS
echo "Server components build OK."

echo ""
echo "=== Build Complete ==="
echo "Binaries: $KBE_ROOT/kbe/bin/server/"
ls -la "$KBE_ROOT/kbe/bin/server/"
```

## 附录 C: 编译成功标志

全部编译成功后，你应该看到：

```
------ Configuration baseapp - Hybrid64 ------
...
------ Configuration cellapp - Hybrid64 ------
...
------ Configuration dbmgr - Hybrid64 ------
...
------ Configuration loginapp - Hybrid64 ------
...
------ Configuration machine - Hybrid64 ------
...
completed all (KBE_CONFIG = Hybrid64)
```

`kbe/bin/server/` 目录下应包含所有可执行文件，`kbe/res/scripts/common/Lib/` 包含 Python 3.11 标准库。

---

> **下一步**: Phase 3 — 运行时验证（启动集群、登录测试、热更新测试）
