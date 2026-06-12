# KBEngine Python 升级 Phase 0 — 代码审计报告

> **任务**: Python 3.7 → 3.11 升级的全面代码审计与准备
> **审计日期**: 2026-06-09
> **源代码路径**: I:\kbengine\kbengine_master

---

## 目录

1. [审计概览](#1-审计概览)
2. [Python C API 详细审计](#2-python-c-api-详细审计)
3. [废弃/风险 API 逐项分析](#3-废弃风险-api-逐项分析)
4. [标准库依赖审计](#4-标准库依赖审计)
5. [构建系统完整梳理](#5-构建系统完整梳理)
6. [修改优先级排序](#6-修改优先级排序)
7. [Phase 1 实施建议](#7-phase-1-实施建议)

---

## 1. 审计概览

### 1.1 审计范围

| 审计维度 | 扫描范围 | 结果 |
|---------|---------|------|
| Python C API 调用 | `kbe/src/lib/pyscript/` (47文件) | **~1674** 处 API 引用 |
| Python C API 调用 | `kbe/src/server/` (30+文件) | **~1841** 处 API 引用 |
| Python 脚本导入 | `kbe/res/scripts/` + `kbe/tools/` | **8393** 行导入语句 |
| 构建系统 | Makefile, common.mak, vcxproj | **12** 个文件需修改 |

### 1.2 核心结论（一句话）

**KBEngine 的 Python C API 使用非常规范，实际需要修改的代码极少 —— 所有废弃 API 集中在 4 个文件 ~10 行代码中。**

---

## 2. Python C API 详细审计

### 2.1 pyscript 库 — 按文件 API 密度排序

| 文件 | API 引用数 | 关键 API | 风险等级 |
|------|-----------|---------|---------|
| `vector3.cpp` | 173 | PyObject, PyFloat, PyArg_ParseTuple | 🟢 安全 |
| `py_memorystream.cpp` | 157 | PyObject, PyBytes, PySequence | 🟢 安全 |
| `vector4.cpp` | 157 | PyObject, PyFloat, PySequence | 🟢 安全 |
| `vector2.cpp` | 146 | PyObject, PyFloat, PySequence | 🟢 安全 |
| `py_macros.h` | 136 | 宏定义（参数类型映射） | 🟢 安全 |
| `sequence.cpp` | 80 | PySequence_*, PyObject | 🟢 安全 |
| **`scriptobject.h`** | **73** | **tp_print, tp_compare, tp_del** | **🔴 需修改** |
| `script.cpp` | 59 | PyImport, PyObject, PyErr | 🟢 安全 |
| `pyurl.cpp` | 57 | PyObject_CallObject, PyUnicode | 🟢 安全 |
| `py_gc.cpp` | 53 | PyGC_*, PyObject | 🟢 安全 |
| `pywatcher.cpp` | 41 | PyObject, PyUnicode | 🟢 安全 |
| `map.cpp` | 41 | PyObject, PyMapping | 🟢 安全 |
| `pyprofile.cpp` | 40 | PyProfile, PyObject | 🟢 安全 |
| `py_platform.cpp` | 36 | PyPlatform, PyObject | 🟢 安全 |
| **`scriptobject.cpp`** | **27** | **PyObject_INIT** | **🟡 需修改** |
| `pyprofile_handler.cpp` | 25 | PyProfileHandler | 🟢 安全 |
| `py_compression.cpp` | 24 | PyObject_CallObject | 🟢 安全 |
| `pickler.cpp` | 23 | PyObject, PyBytes, PyDict | 🟢 安全 |
| `pystruct.cpp` | 20 | PyStruct, PyObject | 🟢 安全 |
| 其余 28 个文件 | <20 each | 辅助/接口定义 | 🟢 安全 |

### 2.2 server 组件 — 按文件 API 密度排序

| 文件 | API 引用数 | 组件 | 风险等级 |
|------|-----------|------|---------|
| `cellapp/entity.cpp` | 474 | Cellapp | 🟢 安全 |
| `baseapp/baseapp.cpp` | 406 | Baseapp | 🟢 安全 |
| `cellapp/cellapp.cpp` | 192 | Cellapp | 🟢 安全 |
| `baseapp/entity.cpp` | 134 | Baseapp | 🟢 安全 |
| `cellapp/space.cpp` | 88 | Cellapp | 🟢 安全 |
| `baseapp/proxy.cpp` | 86 | Baseapp | 🟢 安全 |
| `tools/bots/bots.cpp` | 52 | Bots | 🟢 安全 |
| `dbmgr/dbmgr.cpp` | 47 | DBMgr | 🟢 安全 |
| `tools/interfaces/interfaces.cpp` | 44 | Interfaces | 🟢 安全 |
| `cellapp/entity.h` | 43 | Cellapp | 🟢 安全 |
| `tools/bots/pybots.cpp` | 34 | Bots | 🟢 安全 |
| 其余 ~20 个文件 | <30 each | 各组件 | 🟢 安全 |

### 2.3 API 使用频次 TOP 20（全局）

| API | pyscript | server | 总计 | 3.7→3.11 状态 |
|-----|----------|--------|------|--------------|
| `PyObject` | 501 | 402 | **903** | ✅ STABLE |
| `PyErr_PrintEx` | 139 | 291 | **430** | ✅ STABLE |
| `PyExc_AssertionError` | 17 | 166 | **183** | ✅ STABLE |
| `PyExc_TypeError` | 48 | 114 | **162** | ✅ STABLE |
| `PyArg_ParseTuple` | 26 | 81 | **107** | ✅ STABLE |
| `PyFloat_FromDouble` | 51 | 31 | **82** | ✅ STABLE |
| `PyTuple_Size` | 48 | 36 | **84** | ✅ STABLE |
| `PyFloat_AsDouble` | 45 | 20 | **65** | ✅ STABLE |
| `PyObject_CallMethod` | 20 | 30 | **50** | ✅ STABLE |
| `PyTuple_New` | 24 | 21 | **45** | ✅ STABLE |
| `PyUnicode_FromString` | 19 | 16 | **35** | ✅ STABLE |
| `PyObject_GetAttrString` | 28 | 15 | **43** | ✅ STABLE |
| `PyLong_FromLong` | 10 | 19 | **29** | ✅ STABLE |
| `PySequence_GetItem` | 20 | 16 | **36** | ✅ STABLE |
| `PyList_New` | 8 | 17 | **25** | ✅ STABLE |
| `PyErr_Clear` | 19 | 4 | **23** | ✅ STABLE |
| `PyUnicode_AsUTF8` | 8 | 26 | **34** | ✅ STABLE |
| `PyLong_AsLong` | 18 | 7 | **25** | ✅ STABLE |
| `PyObject_CallFunction` | 13 | 15 | **28** | ✅ STABLE |
| `PyObject_CallObject` | 6 | 7 | **13** | ✅ STABLE |

> **关键发现**：TOP 20 高频 API **全部是 STABLE API**，在 3.7→3.11 期间无破坏性变更。

---

## 3. 废弃/风险 API 逐项分析

### 3.1 需要修改的 API（共 4 类，~10 行代码）

#### A. `tp_print` — scriptobject.h（2 处）

```c
// 文件: kbe/src/lib/pyscript/scriptobject.h
// 行 390, 439

// 当前代码:
0,  /* tp_print */

// Python 3.11 中此位置变为 tp_vectorcall_offset
// 修改方案: 无需修改！该值已经是 0，字段位置和语义兼容。
// 在 3.8-3.11 中，0 表示不使用 vectorcall 优化，行为与 tp_print=NULL 一致。
```

**影响**: 🟢 **无需修改**（值 0 在 3.8-3.12 间均兼容）

#### B. `tp_compare` — scriptobject.h（1 处）

```c
// 文件: kbe/src/lib/pyscript/scriptobject.h
// 行 393

// 当前代码:
0,  /* tp_compare */

// Python 3.8+ 中此位置变为 tp_as_async (PyAsyncMethods*)
// 修改方案: 无需修改！NULL 指针表示不支持异步协议，行为正确。
```

**影响**: 🟢 **无需修改**（NULL 在新旧语义下均正确）

#### C. `tp_del` — scriptobject.h（1 处）

```c
// 文件: kbe/src/lib/pyscript/scriptobject.h
// 行 479

// 当前代码:
0,  /* tp_del */

// Python 3.12 中 tp_del 被移除
// Python 3.11: tp_del 仍然可用（deprecated but functional）
// 修改方案: 在 3.11 中保持不动。仅升级到 3.12+ 时需要移除。
```

**影响**: 🟢 **3.11 中无需修改**（仅 3.12+ 需要）

#### D. `PyObject_INIT()` — scriptobject.cpp（1 处）

```c
// 文件: kbe/src/lib/pyscript/scriptobject.cpp
// 行 52

// 当前代码:
PyObject_INIT(static_cast<PyObject*>(this), pyType);

// Python 3.8 废弃, 3.12 移除
// 修改方案 (3.11):
PyObject_Init(static_cast<PyObject*>(this), pyType);
// 注意: 函数名是 PyObject_Init (无大写 INIT)
```

**影响**: 🟡 **需修改 1 行**（函数名替换，参数签名不变）

### 3.2 已注释的废弃代码

```c
// vector2.cpp:88  — static int tp_compare(PyObject* v, PyObject* w)
// vector3.cpp:88  — static int tp_compare(PyObject* v, PyObject* w)
// vector4.cpp:89  — static int tp_compare(PyObject* v, PyObject* w)
// 以上函数均已从类型注册中注释掉（不再使用），编译无影响
```

**建议**: 升级时直接删除这些已注释的函数体，保持代码整洁。

### 3.3 未使用的废弃 API（安全清单）

以下 API 在 3.7→3.11 中被废弃/移除，但 **KBEngine 代码中未使用**：

| API | 移除版本 | KBEngine 使用 | 状态 |
|-----|---------|-------------|------|
| `PyEval_CallObject` | 3.9 废弃 | ❌ 未使用（使用 PyObject_CallObject） | ✅ |
| `Py_UNICODE` 系列 | 3.12 移除 | ❌ 未使用 | ✅ |
| `PyString_*` | Python 3 已移除 | ❌ 未使用 | ✅ |
| `PyInt_*` | Python 3 已移除 | ❌ 未使用 | ✅ |
| `_PyObject_NEW` | 3.8 废弃 | ❌ 未使用 | ✅ |
| `PyFrame_*` 直接访问 | 3.11 不透明化 | ❌ 未使用 | ✅ |
| `PyCode_*` 直接访问 | 3.11 变更 | ❌ 未使用 | ✅ |
| `tp_reserved` | 3.8 废弃 | ❌ 未使用 | ✅ |
| `Py_TYPE()`, `Py_REFCNT()` 作为左值 | 3.10+ | ❌ 未使用 | ✅ |

### 3.4 小结：实际修改量

| 类别 | 文件数 | 行数 | 工作量 |
|------|--------|------|--------|
| 必须修改（PyObject_INIT） | 1 | 1 | 5 分钟 |
| 建议清理（已注释代码） | 3 | ~50 | 15 分钟 |
| 需验证（tp_print/tp_compare/tp_del 设为 0） | 1 | 4 | 10 分钟 |
| **总计** | **4** | **~55** | **30 分钟** |

---

## 4. 标准库依赖审计

### 4.1 KBEngine 自有脚本分析

KBEngine 的自有 Python 脚本位于：
- `kbe/res/scripts/` — 运行时脚本
- `kbe/tools/server/` — 管理工具

**关键发现：`kbe/res/scripts/` 下没有 KBEngine 自有业务脚本**（仅 `common/` 目录，包含 Python stdlib）。

这意味着：
- KBEngine 引擎本身**不自带游戏逻辑脚本**
- 游戏逻辑脚本由各游戏项目独立维护
- 标准库依赖的检查需要**针对具体游戏项目**进行

### 4.2 工具脚本依赖分析

从 `kbe/tools/` 的导入分析：

| 模块 | 用途 | 3.7→3.11 状态 |
|------|------|--------------|
| `django` | WebConsole | ✅ STABLE（需确认 Django 版本兼容） |
| `settings`, `models`, `views` | WebConsole | ✅ STABLE |
| `openpyxl` | xlsx2py | ✅ STABLE |
| `telnetlib` | Guiconsole | ⚠️ 3.11 废弃, 3.13 移除 |
| `uwsgi` | WebConsole 部署 | ✅ STABLE |
| `ElementTree` (xml.etree) | 配置解析 | ✅ STABLE |
| `hashlib` | 密码加密 | ✅ STABLE |
| `base64` | 编码 | ✅ STABLE |
| `subprocess` | 进程管理 | ✅ STABLE |
| `socket`, `select` | 网络 | ✅ STABLE |
| `struct` | 二进制 | ✅ STABLE |

**唯一风险点**：`telnetlib` 在 Python 3.11 中被标记为废弃（PEP 594），在 3.13 中移除。Guiconsole 的 TelnetConsole 使用了此模块。**在 3.11 中仍可使用**，但建议后续替换为 `telnetlib3` 或直接 socket 实现。

### 4.3 Python 标准库自身

KBEngine 嵌入完整 Python stdlib（`kbe/res/scripts/common/Lib/`），升级时**整体替换**即可：

```bash
# 升级时自动完成：
rm -rf kbe/res/scripts/common/Lib/*
cp -r kbe/src/lib/python/Lib/* kbe/res/scripts/common/Lib/
```

标准库中的废弃模块（`imp`, `inspect.getargspec` 等）存在于 Python 3.7 stdlib 中，但在 3.11 stdlib 中已被处理。**只要不直接在 KBEngine 代码中调用这些废弃 API，就不受影响。**

---

## 5. 构建系统完整梳理

### 5.1 Linux Make 构建

#### 文件: `kbe/src/lib/Makefile`（1 处修改）

```makefile
# 第 39 行 — 唯一需要修改的行
# 修改前:
cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.7m.a"; then \
    cp -f "$(KBE_ROOT)/kbe/src/lib/python/libpython3.7m.a" "$(KBE_ROOT)/kbe/src/libs/libpython.a" && ...

# 修改后:
cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.11.a"; then \
    cp -f "$(KBE_ROOT)/kbe/src/lib/python/libpython3.11.a" "$(KBE_ROOT)/kbe/src/libs/libpython.a" && ...
```

**变更说明**：
- `libpython3.7m.a` → `libpython3.11.a`
- Python 3.8+ 移除了 `m` 后缀（pymalloc 成为默认）
- 库的复制路径不变（始终输出为 `libpython.a`）

#### 文件: `kbe/src/build/common.mak`（无需修改）

```makefile
# 第 53 行 — 无需修改
PYTHONLIB = python   # 库名变量，配合 LDLIBS 展开为 -lpython

# 第 131-136 行 — 无需修改
ifdef USE_PYTHON
USE_KBE_PYTHON = 1
KBE_INCLUDES += -I $(KBE_ROOT)/kbe/src/lib/python/Include
KBE_INCLUDES += -I $(KBE_ROOT)/kbe/src/lib/python
LDLIBS += -l$(PYTHONLIB) -lpthread -lutil -ldl
endif

# 第 435 行 — 无需修改
KBE_PYTHONLIB=$(LIBDIR)/lib$(PYTHONLIB).a
# 展开为: kbe/src/libs/libpython.a（始终正确）
```

### 5.2 Windows Visual Studio 构建

#### 需修改的 vcxproj 文件（9 个）

所有文件需要将 `python37.lib` / `python37_d.lib` 替换为 `python311.lib` / `python311_d.lib`：

| 文件 | python37 出现次数 |
|------|------------------|
| `server/baseapp/baseapp.vcxproj` | 4 处 (2 debug + 2 release) |
| `server/cellapp/cellapp.vcxproj` | 4 处 |
| `server/dbmgr/dbmgr.vcxproj` | 4 处 |
| `server/loginapp/loginapp.vcxproj` | 4 处 |
| `server/tools/bots/bots.vcxproj` | 4 处 |
| `server/tools/guiconsole/guiconsole.vcxproj` | 待确认 |
| `server/tools/interfaces/interfaces.vcxproj` | 待确认 |
| `server/tools/kbcmd/kbcmd.vcxproj` | 待确认 |
| `server/tools/logger/logger.vcxproj` | 待确认 |

**修改模式**（批量替换）：
```
python37.lib    → python311.lib
python37_d.lib  → python311_d.lib
```

**额外检查项**：
- `baseapp.vcxproj:228` 引用了 `lib\python\Modules\getbuildinfo.c` — 确认 Python 3.11 中该文件仍存在
- Python Include 路径 (`../../lib/python/Include`, `../../lib/python/PC`) 确认在 3.11 中目录结构不变

### 5.3 Python configure 参数（Phase 1 使用）

```bash
cd kbe/src/lib/python

# 清理旧的 configure 产物
make distclean 2>/dev/null || true

# 配置（与 3.7 时代保持一致）
./configure \
    --enable-shared=no \
    --without-ensurepip \
    --disable-ipv6 \
    --disable-test-modules \
    CFLAGS="-O2 -fPIC"

# 编译
make -j$(nproc)
```

### 5.4 构建系统修改汇总

| 文件 | 修改类型 | 修改量 |
|------|---------|--------|
| `kbe/src/lib/Makefile` | 字符串替换 | 1 行 |
| 9 个 `.vcxproj` 文件 | 字符串替换 | ~36 处 |
| `kbe/src/build/common.mak` | 无需修改 | 0 |
| Python configure | 重新运行 | 一次性 |

---

## 6. 修改优先级排序

### P0 — 阻塞项（必须先完成）

| 序号 | 任务 | 文件 | 预估时间 |
|------|------|------|---------|
| 1 | 替换 Python 3.7 源码为 3.11 | `kbe/src/lib/python/` | 10min |
| 2 | 运行 configure + 验证编译 | `kbe/src/lib/python/` | 20min |
| 3 | 修改 Makefile 库名 | `kbe/src/lib/Makefile:39` | 2min |
| 4 | 修改 PyObject_INIT → PyObject_Init | `scriptobject.cpp:52` | 2min |

### P1 — 高优先级（编译通过后立即验证）

| 序号 | 任务 | 文件 | 预估时间 |
|------|------|------|---------|
| 5 | 全量编译 kbe/src/lib | Makefile | 30min |
| 6 | 编译所有 server 组件 | Makefile | 20min |
| 7 | 修复编译错误（如有） | 各源文件 | 不定 |

### P2 — 中优先级

| 序号 | 任务 | 文件 | 预估时间 |
|------|------|------|---------|
| 8 | 更新 vcxproj 中的 Python 库名 | 9 个 vcxproj | 30min |
| 9 | 清理已注释的 tp_compare 代码 | vector2/3/4.cpp | 15min |
| 10 | 验证 scriptobject.h 类型布局 | scriptobject.h | 15min |

### P3 — 低优先级

| 序号 | 任务 | 文件 | 预估时间 |
|------|------|------|---------|
| 11 | 更新 README 中的 Python 版本说明 | README.md | 5min |
| 12 | 文档化 configure 参数 | 文档 | 10min |
| 13 | 验证 telnetlib 替代方案 | tools/guiconsole | 30min |

---

## 7. Phase 1 实施建议

### 7.1 推荐的执行顺序

```
第1步: 备份 + 环境准备 (30min)
  ├── 备份 kbe/src/lib/python/ → python-3.7-backup/
  ├── 备份 kbe/res/scripts/common/Lib/ → Lib-3.7-backup/
  └── 创建 git 分支 python-upgrade-3.11

第2步: Python 3.11 源码替换 (15min)
  ├── 下载 Python 3.11.11
  ├── 解压到 kbe/src/lib/python/
  └── 复制 PC/pyconfig.h 等 Windows 头文件

第3步: Linux 编译验证 (1h)
  ├── cd kbe/src/lib/python && ./configure ... && make
  ├── 修改 kbe/src/lib/Makefile:39（库名）
  ├── 修改 scriptobject.cpp:52（PyObject_INIT）
  ├── cd kbe/src/lib && make
  └── cd kbe/src/server && make

第4步: 运行时验证 (2h)
  ├── 启动单个组件（Machine）
  ├── 启动全集群
  ├── 运行 Bots 登录测试
  └── 验证热更新（reloadScripts）

第5步: Windows 适配 (1h)
  ├── 更新 9 个 vcxproj 文件
  ├── VS 编译验证
  └── Windows 运行时验证
```

### 7.2 快速验证脚本

```bash
#!/bin/bash
# verify_python_upgrade.sh — Phase 1 完成后运行

KBE_ROOT="I:/kbengine/kbengine_master"

# 1. 检查 Python 版本
echo "=== Python Version ==="
"$KBE_ROOT/kbe/src/lib/python/python" --version

# 2. 检查库文件
echo "=== Library Check ==="
ls -la "$KBE_ROOT/kbe/src/libs/libpython.a"

# 3. 检查标准库
echo "=== Stdlib Check ==="
ls "$KBE_ROOT/kbe/res/scripts/common/Lib/" | wc -l

# 4. 检查动态模块
echo "=== Dynload Check ==="
ls "$KBE_ROOT/kbe/res/scripts/common/lib-dynload/" | wc -l

# 5. 编译所有组件
echo "=== Build ==="
cd "$KBE_ROOT/kbe/src" && make -j$(nproc)

echo "=== Done ==="
```

### 7.3 风险评估

| 风险 | 概率 | 缓解措施 |
|------|------|---------|
| Python 3.11 configure 参数不兼容 | 低 | 使用最小参数集，逐步添加 |
| 第三方 C 扩展模块编译失败 | 低 | KBEngine 不自带第三方 C 扩展 |
| 类型对象布局差异导致运行时 crash | 低 | tp_print/tp_compare 值为 0/NULL，安全 |
| 游戏脚本兼容性问题 | 极低 | KBEngine 不自带游戏脚本 |
| 热更新机制失效 | 低 | Phase 1 重点验证 reloadScripts |

---

## 附录 A：所有需修改文件清单

| 文件 | 修改内容 | 优先级 |
|------|---------|--------|
| `kbe/src/lib/python/` (整个目录) | 替换为 Python 3.11 源码 | P0 |
| `kbe/src/lib/Makefile:39` | `libpython3.7m.a` → `libpython3.11.a` | P0 |
| `kbe/src/lib/pyscript/scriptobject.cpp:52` | `PyObject_INIT` → `PyObject_Init` | P0 |
| `kbe/src/lib/pyscript/vector2.cpp` | 删除已注释的 tp_compare | P2 |
| `kbe/src/lib/pyscript/vector3.cpp` | 删除已注释的 tp_compare | P2 |
| `kbe/src/lib/pyscript/vector4.cpp` | 删除已注释的 tp_compare | P2 |
| `server/baseapp/baseapp.vcxproj` | `python37` → `python311` (4处) | P2 |
| `server/cellapp/cellapp.vcxproj` | `python37` → `python311` (4处) | P2 |
| `server/dbmgr/dbmgr.vcxproj` | `python37` → `python311` (4处) | P2 |
| `server/loginapp/loginapp.vcxproj` | `python37` → `python311` (4处) | P2 |
| `server/tools/bots/bots.vcxproj` | `python37` → `python311` (4处) | P2 |
| `server/tools/guiconsole/guiconsole.vcxproj` | `python37` → `python311` | P2 |
| `server/tools/interfaces/interfaces.vcxproj` | `python37` → `python311` | P2 |
| `server/tools/kbcmd/kbcmd.vcxproj` | `python37` → `python311` | P2 |
| `server/tools/logger/logger.vcxproj` | `python37` → `python311` | P2 |

## 附录 B：无需修改的关键 API

以下高频 API 在 3.7→3.11 期间完全稳定，无需任何修改：

`PyObject`, `PyErr_PrintEx`, `PyExc_*`, `PyArg_ParseTuple`, `PyFloat_FromDouble`, `PyFloat_AsDouble`, `PyTuple_New`, `PyTuple_Size`, `PyTuple_GetItem`, `PyTuple_SetItem`, `PyTuple_GET_ITEM`, `PyTuple_SET_ITEM`, `PyDict_New`, `PyDict_SetItemString`, `PyDict_GetItemString`, `PyList_New`, `PyList_SET_ITEM`, `PyUnicode_FromString`, `PyUnicode_AsUTF8`, `PyUnicode_Check`, `PyUnicode_FromFormat`, `PyLong_FromLong`, `PyLong_AsLong`, `PyLong_FromUnsignedLong`, `PyLong_FromUnsignedLongLong`, `PyLong_Check`, `PyBytes_Check`, `PyBytes_AsStringAndSize`, `PyBytes_FromStringAndSize`, `PyObject_CallMethod`, `PyObject_CallObject`, `PyObject_CallFunction`, `PyObject_GetAttrString`, `PyObject_SetAttrString`, `PyObject_HasAttrString`, `PyObject_IsTrue`, `PyObject_TypeCheck`, `PyImport_ImportModule`, `PyImport_AddModule`, `PyCallable_Check`, `PySequence_Check`, `PySequence_Size`, `PySequence_GetItem`, `PyBool_FromLong`, `Py_INCREF`, `Py_DECREF`, `PyErr_Clear`, `PyErr_Occurred`, `PyModule_AddIntConstant`, `PyCFunction_New`, `PyMem_Free`

---

> **审计结论**: Phase 0 完成。实际代码修改量极小（~5 行 C++ 代码），升级风险低。建议直接进入 Phase 1 编译验证。
