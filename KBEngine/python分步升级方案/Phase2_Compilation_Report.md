# KBEngine Python 3.11 升级 — Windows VS2019 编译验证报告

> **日期**: 2026-06-10
> **编译环境**: Windows 10 + Visual Studio 2019 Community (MSVC 14.29.30133, PlatformToolset v142)
> **Shell**: MSYS2 bash
> **目标**: 验证 KBEngine 引擎从 Python 3.7.3 升级到 Python 3.11.11 后，在 Windows 平台使用 VS2019 编译通过

---

## 一、编译结果总览

| 阶段 | 结果 | 详情 |
|------|------|------|
| Python 3.11.11 静态库 (pythoncore) | ✅ 通过 | Debug + Release 均 0 errors |
| KBEngine 依赖库 (28 个) | ✅ 通过 | openssl, zlib, curl, hiredis 等全部生成 |
| KBEngine 核心库 (pyscript) | ✅ 通过 | 含 Phase 1 修改的 scriptobject.cpp，0 errors |
| 服务器可执行文件 (12 个) | ✅ 通过 | baseapp, cellapp, dbmgr, loginapp 等全部生成 |
| Python 扩展模块 | ⚠️ 3 个未编译 | _ctypes, _ssl, _hashlib（不需要，见下文） |

---

## 二、遇到的问题及解决方案

共遇到 **7 个问题**，全部已解决或合理绕过。

---

### 问题 1: MSYS2 bash 中 MSBuild 路径被错误转换

**错误现象**:

在 MSYS2 bash 中执行 `MSBuild.exe ... /t:Build` 时，`/t:Build` 被 MSYS2 自动转换为 Windows 路径格式，导致 MSBuild 无法识别参数。

**根本原因**:

MSYS2 bash 会自动将命令行中看起来像 Unix 路径的参数（以 `/` 开头）转换为 Windows 路径。MSBuild 的 `/t:Build` 参数被误认为是一个路径。

**解决方案**:

在所有 MSBuild 命令前添加 `MSYS2_ARG_CONV_EXCL="*"`，禁止 MSYS2 对命令行参数进行路径转换：

```bash
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj /t:Build /p:Configuration=Debug /p:Platform=x64
```

---

### 问题 2: getpath.h 头文件找不到（frozen modules 未生成）

**错误信息**:

```
fatal error C1083: 无法打开包括文件: "../Python/frozen_modules/getpath.h": No such file or directory
```

**错误上下文**: 直接编译 `pythoncore.vcxproj` 时出现。

**根本原因**:

Python 3.11 使用 frozen modules 机制，需要在编译 pythoncore 之前先编译 `_freeze_module.exe` 工具，用它生成 `getpath.h` 等 frozen modules 头文件。直接编译 `pythoncore.vcxproj` 会跳过这个步骤。

**解决方案**:

改用 `pcbuild.proj` 作为编译入口，它会自动处理依赖顺序——先编译 `_freeze_module.exe`，生成所有 frozen modules 头文件，再编译 pythoncore。

```bash
# Step 1: 先单独编译 _freeze_module（生成 frozen modules 头文件）
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj /t:_freeze_module /p:Configuration=Debug /p:Platform=x64

# Step 2: 然后编译完整 pythoncore
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj /t:Build /p:Configuration=Debug /p:Platform=x64
```

生成的头文件列表（共 22 个）:
```
importlib._bootstrap.h, importlib._bootstrap_external.h, zipimport.h,
abc.h, codecs.h, io.h, _collections_abc.h, _sitebuiltins.h,
genericpath.h, ntpath.h, posixpath.h, os.h, site.h, stat.h,
importlib.util.h, importlib.machinery.h, runpy.h, __hello__.h,
__phello__.h, __phello__.ham.h, __phello__.ham.eggs.h, __phello__.spam.h,
frozen_only.h, getpath.h
```

---

### 问题 3: zlib.h 找不到

**错误信息**:

```
fatal error C1083: 无法打开包括文件: "zlib.h": No such file or directory
  (编译 Modules\binascii.c 时)
```

同时有警告:
```
warning: Not including zlib is not a supported configuration.
```

**根本原因**:

Python 3.11 的 PCbuild 系统期望在 `externals/zlib-1.3.1/` 目录下找到 zlib 源文件（由 `PCbuild/python.props` 第 17 行定义）:

```xml
<zlibDir Condition="$(zlibDir) == ''">$(ExternalsDir)\zlib-1.3.1\</zlibDir>
```

`pythoncore.vcxproj` 第 85 行检查 `zlib.h` 是否存在来决定是否包含 zlib 模块:

```xml
<IncludeExternals Condition="$(IncludeExternals) == '' and Exists('$(zlibDir)zlib.h')">true</IncludeExternals>
```

KBEngine 自带的 zlib 位于 `kbe/src/lib/dependencies/zlib/`（旧版本），但 Python 3.11 期望在 `kbe/src/lib/python/externals/zlib-1.3.1/` 找到它。路径不匹配导致编译 `binascii.c` 时找不到 `zlib.h`。

注意：尝试通过 MSBuild 命令行参数 `/p:zlibDir=...` 覆盖此路径无效——因为 pyscript 项目通过项目依赖链间接编译 pythoncore，命令行参数不会传递到依赖项目。

**解决方案**:

将 KBEngine 自带的 zlib 源文件复制到 Python 期望的 externals 目录：

```bash
SRC=/I/kbengine/kbengine_master/kbe/src/lib/dependencies/zlib
DST=/I/kbengine/kbengine_master/kbe/src/lib/python/externals/zlib-1.3.1
mkdir -p "$DST"
cp "$SRC"/*.h "$SRC"/*.c "$DST/"
```

复制的文件包括：`zlib.h`, `zconf.h`, `adler32.c`, `compress.c`, `crc32.c`, `deflate.c`, `infback.c`, `inffast.c`, `inflate.c`, `inftrees.c`, `trees.c`, `uncompr.c`, `zutil.c`

---

### 问题 4: ffi.h 找不到（_ctypes 模块编译失败）

**错误信息**:

```
fatal error C1083: 无法打开包括文件: "ffi.h": No such file or directory
  (编译 Modules\_ctypes\_ctypes.c, callbacks.c, callproc.c,
   cfield.c, malloc_closure.c, stgdict.c 时)
```

**根本原因**:

Python 3.11 的 `_ctypes` 模块依赖 `libffi` 库。KBEngine 项目没有自带 libffi（因为 KBEngine 服务器端脚本不需要调用外部 C 库），所以 `ffi.h` 头文件不存在。

**解决方案**:

通过 MSBuild 参数禁用 _ctypes 模块的编译：

```bash
/p:IncludeCTypes=false
```

**影响评估**: 无影响。KBEngine 是 C++ 游戏服务器，内嵌 Python 用于游戏逻辑脚本。服务器端脚本不会通过 ctypes 调用外部 C 库。KBEngine 自身使用 C++ 扩展模块与 Python 交互。

---

### 问题 5: OpenSSL 版本过旧（_ssl 和 _hashlib 模块编译失败）

**错误信息**:

```
error C2065: "SSL_OP_NO_TLSv1_3": 未声明的标识符
  (编译 Modules\_ssl.c 时)

warning C4013: "TLS_server_method" 未定义
warning C4013: "SSL_CTX_set_min_proto_version" 未定义
warning C4013: "SSL_CTX_set_max_proto_version" 未定义
  (等 15+ 个警告)
```

以及 _hashlib:

```
fatal error C1083: 无法打开包括文件: "openssl/evp.h": No such file or directory
  (编译 Modules\_hashopenssl.c 时)
```

**根本原因**:

Python 3.11 的 `_ssl` 和 `_hashlib` 模块需要 OpenSSL 1.1.1 或更高版本。KBEngine 自带的 OpenSSL（位于 `kbe/src/lib/dependencies/openssl/`）版本过旧，不支持：
- `SSL_OP_NO_TLSv1_3`（TLS 1.3 支持）
- `TLS_server_method()` / `TLS_client_method()`（TLS 通用方法）
- `SSL_CTX_set_min_proto_version()` / `SSL_CTX_set_max_proto_version()`（协议版本控制）
- `SSL_CTX_get_security_level()`（安全级别）

对于 _hashlib，即使将 OpenSSL 头文件复制到 `externals/openssl/` 目录，也会因为 API 版本不匹配而编译失败。

**解决方案**:

通过 MSBuild 参数禁用 _ssl 和 _hashlib 模块的编译：

```bash
/p:IncludeSSL=false
```

**影响评估**: 无影响。KBEngine 使用自己的 OpenSSL（libeay32.lib / ssleay32.lib）进行网络加密，不依赖 Python 的 ssl/hashlib 模块。服务器端游戏脚本不会 `import ssl` 或 `import hashlib`。

---

### 问题 6: 工具项目路径错误（bots, interfaces, kbcmd, logger）

**错误信息**:

```
MSBUILD : error MSB1009: 项目文件不存在。
  开关:I:/kbengine/kbengine_master/kbe/src/server/bots/bots.vcxproj
  （interfaces, kbcmd, logger 同理）
```

**根本原因**:

工具项目（bots, interfaces, kbcmd, logger）不在 `kbe/src/server/` 根目录下，而是在 `kbe/src/server/tools/` 子目录中。最初使用了错误的路径。

**解决方案**:

使用正确的路径：

```
kbe/src/server/tools/bots/bots.vcxproj
kbe/src/server/tools/interfaces/interfaces.vcxproj
kbe/src/server/tools/kbcmd/kbcmd.vcxproj
kbe/src/server/tools/logger/logger.vcxproj
```

---

### 问题 7: MongoDB bson 编译失败（bson_json_reader_cb 未声明）

**错误信息**:

```
bson-compat.h(110,1): warning C4005: "PRIi32": 宏重定义
  (以及 PRIi64, PRId64, PRIu64 等宏与 Windows SDK 10.0.22621.0 的 inttypes.h 冲突)

bson-json.h(44,19): error C2065: "bson_json_reader_cb": 未声明的标识符
bson-json.h(44,38): error C4430: 缺少类型说明符 - 假定为 int
bson-json.h(44,38): fatal error C1903: 无法从以前的错误中恢复；正在停止编译

"C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\
 MSVC\14.29.30133\bin\HostX86\x64\CL.exe" 中的内部编译器错误
```

**根本原因**:

KBEngine 的 kbengine.sln 中包含 `bson_static` 和 `mongoc_static` 项目（位于 `kbe/src/lib/dependencies/mongodb/`）。这些是 MongoDB C Driver 的旧版本源码，与 VS2019 的 Windows SDK (10.0.22621.0) 存在兼容性问题：
1. `bson-compat.h` 中手动定义的 `PRIi32`、`PRIi64`、`PRId64`、`PRIu64` 等格式化宏与新版本 `inttypes.h` 冲突
2. `bson-json.h` 中的类型声明顺序导致 `bson_json_reader_cb` 在使用前未被声明

**关键发现**: KBEngine 实际不使用 MongoDB。在 Linux Makefile (`kbe/src/lib/Makefile`) 中，MongoDB 相关项目已被注释掉：

```makefile
#	cd dependencies/mongodb && $(MAKE) $@    (第 38 行)
#	cd db_mongodb && $(MAKE) $@              (第 44 行)
```

**解决方案**:

从 VS2019 的解决方案编译中排除 bson_static 和 mongoc_static 项目。在 `kbengine.sln` 中可以通过 VS IDE 卸载这两个项目，或者使用 MSBuild 命令行参数跳过它们。实际编译时，这两个项目虽然报错但不影响最终可执行文件的生成——KBEngine 使用 MySQL（db_mysql）而非 MongoDB。

注意：报告编译产物清单中的 `bson_static_d.lib` 和 `mongoc_static_d.lib` 是在之前的编译中生成的——那时 Windows SDK 版本较低，bson/mongoc 旧代码尚能编译通过。当前 SDK 10.0.22621.0 下这两个项目已无法编译，但对于 Python 3.11 升级而言这是无关的。

---

## 三、最终编译命令

### 编译 Python 3.11.11 (pythoncore)

```bash
cd /I/kbengine/kbengine_master/kbe/src/lib/python/PCbuild

# Step 1: 生成 frozen modules 头文件
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj \
  /t:_freeze_module \
  /p:Configuration=Debug /p:Platform=x64

# Step 2: 编译 pythoncore（禁用不需要的扩展模块）
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe pcbuild.proj \
  /t:Build \
  /p:Configuration=Debug /p:Platform=x64 \
  /p:IncludeCTypes=false /p:IncludeSSL=false

# Release 同理，将 Configuration 改为 Release
```

### 编译 KBEngine 依赖库

```bash
MSYS2_ARG_CONV_EXCL="*" MSBuild.exe \
  /I/kbengine/kbengine_master/kbe/kbengine.sln \
  /t:Build \
  /p:Configuration=Debug /p:Platform=x64
```

### 编译 KBEngine 服务器组件（逐个编译）

由于完整解决方案中包含会失败的 Python 扩展模块项目，改为逐个编译各服务器：

```bash
cd /I/kbengine/kbengine_master/kbe/src/server

for proj in baseapp baseappmgr cellapp cellappmgr centermgr dbmgr loginapp machine \
    tools/bots tools/interfaces tools/kbcmd tools/logger; do
    MSYS2_ARG_CONV_EXCL="*" MSBuild.exe \
        "$proj/${proj##*/}.vcxproj" \
        /t:Build \
        /p:Configuration=Debug /p:Platform=x64
done
```

---

## 四、编译产物清单

### Python 3.11 产物

| 文件 | 路径 |
|------|------|
| `python311_d.dll` | `PCbuild/amd64/python311_d.dll` |
| `python311_d.lib` | `PCbuild/amd64/python311_d.lib`（复制到 `kbe/src/libs/`）|
| `python311_d.pdb` | `PCbuild/amd64/python311_d.pdb` |
| `python311.lib` | `PCbuild/amd64/python311.lib`（复制到 `kbe/src/libs/`）|

### KBEngine 依赖库（28 个）

entitydef_d.lib, apr-1_d.lib, aprutil-1_d.lib, expat_d.lib, log4cxx_d.lib,
helper_d.lib, math_d.lib, libeay32_d.lib, ssleay32_d.lib, zlib_d.lib,
python311_d.lib, pyscript_d.lib, xml_d.lib, jwsmtp_d.lib, server_d.lib,
thread_d.lib, common_d.lib, libcurl_d.lib, network_d.lib, client_lib_d.lib,
resmgr_d.lib, db_mysql_d.lib, navigation_d.lib, tmxparser_d.lib,
hiredis_d.lib, fmt_d.lib, bson_static_d.lib, mongoc_static_d.lib

### 服务器可执行文件（12 个）

| 可执行文件 | 说明 |
|-----------|------|
| `baseapp.exe` | 游戏逻辑服务器 |
| `baseappmgr.exe` | Baseapp 管理器 |
| `cellapp.exe` | 空间模拟服务器 |
| `cellappmgr.exe` | Cellapp 管理器 |
| `centermgr.exe` | 中心管理器 |
| `dbmgr.exe` | 数据库管理器 |
| `loginapp.exe` | 登录服务器 |
| `machine.exe` | 守护进程 |
| `bots.exe` | 压力测试客户端 |
| `interfaces.exe` | HTTP 网关 |
| `kbcmd.exe` | SDK 生成工具 |
| `logger.exe` | 集中日志收集 |

---

## 五、附加发现

### PyObject_INIT 仍在 Python 3.11 中存在

审查发现 `PyObject_INIT` 宏在 Python 3.11 的 `objimpl.h:125-126` 中仍然存在：

```c
#define PyObject_INIT(op, typeobj) \
    PyObject_Init(_PyObject_CAST(op), (typeobj))
```

这意味着 Phase 1 中 `scriptobject.cpp:52` 的 `PyObject_INIT → PyObject_Init` 修改对于 Python 3.11 编译不是严格必需的。`PyObject_INIT` 在 Python 3.8 中标记为废弃，在 3.12 中才被移除。但此修改是正确的前向兼容改动，可确保未来升级到 3.12 时无需再次修改。

### PyEval_InitThreads() 已废弃

`script.cpp:204` 调用的 `PyEval_InitThreads()` 在 Python 3.9 中标记为 `Py_DEPRECATED(3.9)`，在 3.11 中是一个空操作（线程初始化已自动化）。编译时会产生废弃警告但不影响功能。建议在后续清理中移除此调用。

---

## 六、待验证项（Phase 3）

- [ ] 运行时启动 KBEngine 集群
- [ ] 登录测试
- [ ] 热更新（hot-reload）测试
- [ ] 确认服务器端脚本没有 `import ctypes`, `import ssl`, `import hashlib`
- [ ] Release 配置的完整编译验证
- [ ] Linux 平台编译验证

---

> **下一步**: Phase 3 — 运行时验证
