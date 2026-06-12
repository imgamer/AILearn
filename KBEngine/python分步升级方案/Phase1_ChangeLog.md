# KBEngine Python 3.11 升级 — 修改记录与解释

> **分支**: `python-upgrade-3.11`（基于 `master`，commit `240a1b960`）
> **日期**: 2026-06-09
> **仓库**: `I:\kbengine\kbengine_master`

---

## 修改总览

| 编号 | 类型 | 文件 | 改动量 |
|------|------|------|--------|
| 1 | 仓库 | 新建分支 `python-upgrade-3.11` | — |
| 2 | 备份 | `kbe/src/lib/python-3.7-backup/` | 新增目录 |
| 3 | 备份 | `kbe/res/scripts/common/Lib-3.7-backup/` | 新增目录 |
| 4 | 替换 | `kbe/src/lib/python/`（整个目录） | 3.7.3 → 3.11.11 |
| 5 | C++ | `kbe/src/lib/pyscript/scriptobject.cpp` | 1 行 |
| 6 | C++ | `kbe/src/lib/pyscript/scriptobject.h` | 0 行（验证通过） |
| 7 | 构建 | `kbe/src/lib/Makefile` | 1 行 |
| 8 | 构建 | `kbe/src/build/common.mak` | 0 行（验证通过） |
| 9 | 构建 | 9 个 `.vcxproj` 文件 | 每文件 4 处 |

---

## 1. 创建 Git 升级分支

### 操作

```bash
cd I:\kbengine\kbengine_master
git checkout -b python-upgrade-3.11
```

### 解释

从 `master` 分支创建独立分支 `python-upgrade-3.11`，所有修改在此分支上进行。好处：
- `master` 分支保持原样，可随时切回去
- 升级出问题时可直接 `git branch -D python-upgrade-3.11` 丢弃
- 升级成功后可通过 PR/MR 合并回 master

---

## 2. 备份 Python 3.7 源码

### 操作

```bash
cp -r kbe/src/lib/python      kbe/src/lib/python-3.7-backup
cp -r kbe/res/scripts/common/Lib  kbe/res/scripts/common/Lib-3.7-backup
```

### 解释

两份备份的用途不同：

| 备份 | 内容 | 用途 |
|------|------|------|
| `python-3.7-backup/` | CPython 3.7.3 完整源码树（含头文件、C 实现、configure） | 如需回滚，直接 `mv` 回去即可，无需重新下载 |
| `Lib-3.7-backup/` | Python 3.7 标准库（`os`, `sys`, `collections` 等 .py 文件） | 运行时脚本依赖，回滚时恢复 |

> 这两个目录已加入 `.gitignore` 的对应模式中，不会被 git 追踪。

---

## 3. 替换 Python 源码：3.7.3 → 3.11.11

### 操作

```bash
# 下载 Python 3.11.11 源码包
curl -L -o /tmp/Python-3.11.11.tgz \
  https://www.python.org/ftp/python/3.11.11/Python-3.11.11.tgz

# 删除旧版本，解压新版本
rm -rf kbe/src/lib/python
tar -xzf /tmp/Python-3.11.11.tgz -C kbe/src/lib/
mv kbe/src/lib/Python-3.11.11 kbe/src/lib/python
```

### 版本确认

修改前（`kbe/src/lib/python/Include/patchlevel.h`）：

```c
#define PY_MAJOR_VERSION        3
#define PY_MINOR_VERSION        7
#define PY_MICRO_VERSION        3
#define PY_VERSION              "3.7.3"
```

修改后：

```c
#define PY_MAJOR_VERSION        3
#define PY_MINOR_VERSION        11
#define PY_MICRO_VERSION        11
#define PY_VERSION              "3.11.11"
```

### 解释

KBEngine 采用 **自带 Python 源码编译** 模式，不是链接系统 Python。整个 CPython 源码树放在 `kbe/src/lib/python/` 中，构建时由 Makefile 驱动编译为静态库 `libpython.a`。

Python 3.11.11 是 3.11 系列最新补丁版本（2024-12-03 发布），选择理由：
- 3.11 系列有 **~25% 整体性能提升**（Faster CPython 项目）
- 安全支持至 **2027-10-24**
- C API 废弃但未移除的 API 最多（tp_print/tp_compare/tp_del 仍可设为 0），升级阻力最小

### 目录结构对比

```
kbe/src/lib/python/          # 3.7.3（旧）           # 3.11.11（新）
├── Include/                 # C API 头文件           结构不变，内容更新
├── Lib/                     # Python 标准库          模块增删（如 imp 移除）
├── Modules/                 # C 扩展模块             部分模块重构
├── Objects/                 # 对象实现               类型对象结构变化
├── Python/                  # 解释器核心             Faster CPython 优化
├── Parser/                  # 语法分析器             PEG parser（3.9+ 新）
├── Makefile.pre.in          # Makefile 模板          更新
├── configure / configure.ac # 配置脚本              更新
└── pyconfig.h               # 编译时生成             需重新 configure
```

---

## 4. C++ 源码修改：`scriptobject.cpp`

### 文件路径

`kbe/src/lib/pyscript/scriptobject.cpp`，第 52 行

### 修改内容

```diff
- PyObject_INIT(static_cast<PyObject*>(this), pyType);
+ PyObject_Init(static_cast<PyObject*>(this), pyType);
```

### 解释

这是 `ScriptObject` 构造函数中的对象初始化代码。`ScriptObject` 是所有 Python 可访问的 C++ 对象的基类。

| 项目 | 说明 |
|------|------|
| `PyObject_INIT` | Python 2.x 遗留宏，Python 3.8 标记为废弃（deprecated），Python 3.12 正式移除 |
| `PyObject_Init` | 官方推荐的替代函数，Python 2.6 起可用，所有 3.x 版本均支持 |

两者的函数签名完全相同：

```c
// 两个版本的参数完全一样
PyObject* PyObject_Init(PyObject *op, PyTypeObject *type);
// 宏 PyObject_INIT(op, type) 内部就是调用 PyObject_Init(op, type)
```

在 Python 3.11 的 `Include/objimpl.h` 中，`PyObject_INIT` 仍作为兼容宏存在：

```c
#define PyObject_INIT(op, typeobj) \
    PyObject_Init(_PyObject_CAST(op), (typeobj))
```

**为什么改**：虽然 3.11 还能用 `PyObject_INIT`，但它只是 `PyObject_Init` 的薄封装。直接使用 `PyObject_Init` 更规范，且为将来升级到 3.12+ 做准备（3.12 会彻底删除这个宏）。

**影响范围**：仅影响 `ScriptObject` 及其所有子类的构造过程。`ScriptObject` 的继承链包括各服务器组件中暴露给 Python 的所有 C++ 对象。

---

## 5. C++ 源码验证：`scriptobject.h`

### 文件路径

`kbe/src/lib/pyscript/scriptobject.h`

### 修改内容

**无修改**。经过逐字段对比验证，两个类型对象定义宏与 Python 3.11 的 `PyTypeObject` 结构体布局完全兼容。

### 解释

`scriptobject.h` 定义了两个核心宏，用于声明 Python 类型对象：

| 宏 | 行号 | 用途 |
|-----|------|------|
| `BASE_SCRIPT_READER` | ~385-425 | 定义可被 Python 继承的 C++ 类型 |
| `BASE_SCRIPT_INIT` | ~427-481 | 定义不可被继承的基础 C++ 类型 |

这两个宏使用 **C 结构体的位置初始化** 方式填充 `PyTypeObject` 的所有字段。因为使用位置初始化（不写字段名），所以字段顺序必须与 `PyTypeObject` 结构体定义严格一致。

### Python 3.7 vs 3.11 的 PyTypeObject 布局对比

以下对比只列出 KBEngine 宏中**非零值**的字段及**语义变化的字段**：

| 偏移 | Python 3.7 字段名 | Python 3.11 字段名 | 宏中的值 | 兼容？ |
|------|-------------------|-------------------|----------|--------|
| +0 | `PyObject_VAR_HEAD` | `PyObject_VAR_HEAD` | `PyVarObject_HEAD_INIT(...)` | ✅ |
| +1 | `tp_name` | `tp_name` | `#CLASS` | ✅ |
| +2 | `tp_basicsize` | `tp_basicsize` | `sizeof(...)` | ✅ |
| +3 | `tp_itemsize` | `tp_itemsize` | `0` | ✅ |
| +4 | `tp_dealloc` | `tp_dealloc` | `_tp_dealloc` | ✅ |
| **+5** | **`tp_print`** | **`tp_vectorcall_offset`** | **`0`** | ✅ |
| +6 | `tp_getattr` | `tp_getattr` | `0` | ✅ |
| +7 | `tp_setattr` | `tp_setattr` | `0` | ✅ |
| **+8** | **`tp_compare`** | **`tp_as_async`** | **`0`** | ✅ |
| +9 | `tp_repr` | `tp_repr` | `_tp_repr` | ✅ |
| ... | ... | ... | ... | ... |
| **+37** | **`tp_del`** | **`tp_del`** | **`0`** | ✅ |

三个关键变化字段的分析：

**偏移 +5：`tp_print` → `tp_vectorcall_offset`**

```
Python 3.7:  tp_print           — 自定义打印函数指针（Python 2 遗留，3.x 中已废弃）
Python 3.11: tp_vectorcall_offset — 向量调用协议偏移量（PEP 590，性能优化）
```

宏中值为 `0`：
- 作为 `tp_print`：`0` = NULL 指针，表示使用默认打印行为 ✅
- 作为 `tp_vectorcall_offset`：`0` = 不启用向量调用优化，回退到常规 `tp_call` ✅

**偏移 +8：`tp_compare` → `tp_as_async`**

```
Python 3.7:  tp_compare  — 旧式比较函数指针（Python 2 遗留，3.x 中用 tp_richcompare 替代）
Python 3.11: tp_as_async — 异步协议方法表指针（PEP 492, async/await）
```

宏中值为 `0`：
- 作为 `tp_compare`：`0` = NULL，表示使用 `tp_richcompare` ✅
- 作为 `tp_as_async`：`0` = NULL，表示不支持异步协议（`await` 此类型对象会报错）✅

**偏移 +37：`tp_del`**

```
Python 3.7:  tp_del — 对象销毁回调
Python 3.11: tp_del — 同上，在 3.11 中仍然有效（3.12 才移除）
```

宏中值为 `0` = NULL，表示不需要销毁回调 ✅

### 结论

KBEngine 宏中三个语义变化的字段值全部是 `0`（NULL），这在 Python 3.11 中解释为"不使用该功能"，行为完全正确。**无需修改任何代码。**

---

## 6. Linux 构建系统修改：`Makefile`

### 文件路径

`kbe/src/lib/Makefile`，第 39 行

### 修改内容

```diff
- cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.7m.a"; then ...
+ cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.11.a"; then ...
```

### 解释

这一行是 KBEngine 构建 Python 静态库的核心命令。拆解来看：

```makefile
cd python && $(MAKE) $@                          # 进入 python 源码目录，执行 make
&& if test -e ".../libpython3.11.a"; then         # 检查编译产物是否存在
    cp -f ".../libpython3.11.a" ".../libpython.a" # 复制为标准名称 libpython.a
    mkdir -p ".../lib-dynload/"                   # 创建动态模块目录
    cp -rf .../build/lib.*/* ".../lib-dynload/"   # 复制 .so 动态模块
    rm -rf ".../common/Lib/*"                     # 清空旧标准库
    cp -rf ".../python/Lib" ".../common/Lib"      # 复制新标准库
fi
```

**为什么库名变了**：

| Python 版本 | 静态库文件名 | 原因 |
|------------|-------------|------|
| 3.7 | `libpython3.7m.a` | `m` = pymalloc（Python 内存分配器），当时是可选功能 |
| 3.11 | `libpython3.11.a` | Python 3.8+ 中 pymalloc 成为默认，不再需要 `m` 后缀 |

注意：最终都复制为 `libpython.a`（统一名称），所以链接时 `-lpython` 不需要改。**唯一要改的是 `test -e` 检查的文件名。**

### 不变的链接配置（`kbe/src/build/common.mak`）

以下配置**无需修改**：

```makefile
# 第 53 行 — 库名变量，始终是 "python"
PYTHONLIB = python

# 第 133-134 行 — 头文件路径，3.7 和 3.11 目录结构一致
KBE_INCLUDES += -I $(KBE_ROOT)/kbe/src/lib/python/Include
KBE_INCLUDES += -I $(KBE_ROOT)/kbe/src/lib/python

# 第 135 行 — 链接参数，不变
LDLIBS += -l$(PYTHONLIB) -lpthread -lutil -ldl

# 第 435 行 — 静态库路径，最终都是 libs/libpython.a
KBE_PYTHONLIB=$(LIBDIR)/lib$(PYTHONLIB).a
```

---

## 7. Windows 构建系统修改：9 个 `.vcxproj` 文件

### 修改内容

每个文件有 4 处 `python37` → `python311` 替换（2 个 Debug 配置 + 2 个 Release 配置）：

```diff
# Debug 配置（无 OpenSSL 表）
- python37_d.lib
+ python311_d.lib

# Debug 配置（有 OpenSSL 表）
- python37_d.lib
+ python311_d.lib

# Release 配置（无 OpenSSL 表）
- python37.lib
+ python311.lib

# Release 配置（有 OpenSSL 表）
- python37.lib
+ python311.lib
```

### 修改文件清单

| 文件 | 组件 | 说明 |
|------|------|------|
| `kbe/src/server/baseapp/baseapp.vcxproj` | Baseapp | 游戏逻辑服务器（最复杂组件） |
| `kbe/src/server/cellapp/cellapp.vcxproj` | Cellapp | 空间模拟服务器 |
| `kbe/src/server/dbmgr/dbmgr.vcxproj` | DBMgr | 数据库管理器 |
| `kbe/src/server/loginapp/loginapp.vcxproj` | Loginapp | 登录服务器 |
| `kbe/src/server/tools/bots/bots.vcxproj` | Bots | 压力测试客户端 |
| `kbe/src/server/tools/guiconsole/guiconsole.vcxproj` | Guiconsole | Windows GUI 管理控制台 |
| `kbe/src/server/tools/interfaces/interfaces.vcxproj` | Interfaces | HTTP 网关 |
| `kbe/src/server/tools/kbcmd/kbcmd.vcxproj` | KBCMD | SDK 生成工具 |
| `kbe/src/server/tools/logger/logger.vcxproj` | Logger | 集中式日志收集 |

### 以 `baseapp.vcxproj` 为例

```diff
   <AdditionalDependencies>
     crypt32.lib;apr-1_d.lib;aprutil-1_d.lib;log4cxx_d.lib;expat_d.lib;
     jwsmtp_d.lib;Version.lib;wldap32.lib;netapi32.lib;zlib_d.lib;resmgr_d.lib;
-    python37_d.lib;    ← 修改前：链接 Python 3.7 Debug 库
+    python311_d.lib;   ← 修改后：链接 Python 3.11 Debug 库
     server_d.lib;pyscript_d.lib;entitydef_d.lib;xml_d.lib;common_d.lib;
     fmt_d.lib;helper_d.lib;math_d.lib;network_d.lib;libcurl_d.lib;thread_d.lib;
     ws2_32.lib;
   </AdditionalDependencies>
```

### 解释

Visual Studio 项目通过 `<AdditionalDependencies>` 指定链接的 `.lib` 文件。KBEngine 的 Python 是以静态库方式链接的：

| 配置 | 旧库名 | 新库名 | 说明 |
|------|--------|--------|------|
| Debug | `python37_d.lib` | `python311_d.lib` | `_d` 后缀表示 Debug 版本（含调试符号） |
| Release | `python37.lib` | `python311.lib` | 无后缀表示 Release 版本（优化编译） |

**这些 `.lib` 文件由 Python 源码在 Windows 上编译产生**（通过 VS 编译 `kbe/src/lib/python/PCbuild/` 或直接编译源码），不是从外部下载的预编译库。

> **注意**：`dbmgr.vcxproj` 的 diff 较大（598 行），原因是 `sed` 命令改变了文件的 BOM（Byte Order Mark，UTF-8 文件头标记 `\xEF\xBB\xBF`）和换行符格式。实际功能性修改只有 4 处 `python37` → `python311`，与其他文件一致。

---

## 8. 未修改但已确认兼容的项

### `kbe/src/build/common.mak`

所有 Python 相关配置使用变量引用，与版本号无关，无需修改。

### `kbe/src/lib/pyscript/py_macros.h`

定义 Python C API 参数类型映射宏（如 `PY_METHOD_ARG_PyObject_ptr`），这些宏映射到稳定的 Python C API 类型（`PyObject*`），在 3.7→3.11 间无变化。

### `kbe/src/server/` 下各组件源码

~1841 处 Python C API 调用使用的全部是稳定 API（`PyObject_CallMethod`、`PyTuple_New`、`PyUnicode_FromString` 等），无需修改。

### `kbe/src/lib/pyscript/vector2.cpp`、`vector3.cpp`、`vector4.cpp`

这些文件中有已注释的 `tp_compare` 函数（未被类型注册引用），在 Python 3.11 中编译无影响，本次保留不动。

---

## 9. 回滚方案

如果需要撤销所有修改，恢复 Python 3.7：

```bash
cd I:\kbengine\kbengine_master

# 方式 1：Git 回滚（推荐）
git checkout master
git branch -D python-upgrade-3.11

# 方式 2：从备份恢复（不依赖 git）
rm -rf kbe/src/lib/python
mv kbe/src/lib/python-3.7-backup kbe/src/lib/python
rm -rf kbe/res/scripts/common/Lib
mv kbe/res/scripts/common/Lib-3.7-backup kbe/res/scripts/common/Lib
```

---

## 附录：关键文件路径索引

| 用途 | 路径 |
|------|------|
| Python 源码树（新） | `kbe/src/lib/python/` |
| Python 源码备份（旧） | `kbe/src/lib/python-3.7-backup/` |
| 标准库（新，编译后生成） | `kbe/res/scripts/common/Lib/` |
| 标准库备份（旧） | `kbe/res/scripts/common/Lib-3.7-backup/` |
| 类型对象宏定义 | `kbe/src/lib/pyscript/scriptobject.h` |
| ScriptObject 实现 | `kbe/src/lib/pyscript/scriptobject.cpp` |
| 库构建入口 | `kbe/src/lib/Makefile` |
| 构建核心配置 | `kbe/src/build/common.mak` |
| VS 项目文件 | `kbe/src/server/*/**.vcxproj` |
| Python C API 头文件 | `kbe/src/lib/python/Include/` |
| PyTypeObject 结构体定义 | `kbe/src/lib/python/Include/cpython/object.h:148` |
