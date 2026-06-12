# KBEngine Python 3.11 升级 — Phase 1 实施报告

> **分支**: `python-upgrade-3.11`
> **基准分支**: `master` (commit: 240a1b960)
> **实施日期**: 2026-06-09
> **仓库路径**: I:\kbengine\kbengine_master

---

## 1. 变更概览

### 1.1 修改文件统计

| 类别 | 文件数 | 说明 |
|------|--------|------|
| Python 源码替换 | 1 (整个目录) | `kbe/src/lib/python/` 3.7.3 → 3.11.11 |
| C++ 源码修改 | 1 | `scriptobject.cpp` PyObject_INIT→PyObject_Init |
| Linux 构建 | 1 | `kbe/src/lib/Makefile` 库名更新 |
| Windows 构建 | 9 | vcxproj 文件 python37→python311 |
| 备份目录 | 2 | python-3.7-backup, Lib-3.7-backup |

### 1.2 11 个修改文件的详细 diff

```
 kbe/src/lib/Makefile                               |   2 +-
 kbe/src/lib/pyscript/scriptobject.cpp              |   2 +-
 kbe/src/server/baseapp/baseapp.vcxproj             |   8 +-
 kbe/src/server/cellapp/cellapp.vcxproj             |   8 +-
 kbe/src/server/dbmgr/dbmgr.vcxproj                 | 598 +-(BOM变化)
 kbe/src/server/loginapp/loginapp.vcxproj           |   8 +-
 kbe/src/server/tools/bots/bots.vcxproj             |   8 +-
 kbe/src/server/tools/guiconsole/guiconsole.vcxproj |   8 +-
 kbe/src/server/tools/interfaces/interfaces.vcxproj |   8 +-
 kbe/src/server/tools/kbcmd/kbcmd.vcxproj           |   8 +-
 kbe/src/server/tools/logger/logger.vcxproj         |   8 +-
```

---

## 2. 详细变更清单

### 2.1 Python 源码替换

```
kbe/src/lib/python/  (整个目录树)
  3.7.3 → 3.11.11

  版本验证: Include/patchlevel.h
    #define PY_MAJOR_VERSION  3
    #define PY_MINOR_VERSION  11
    #define PY_MICRO_VERSION  11
    #define PY_VERSION        "3.11.11"
```

**备份**:
- `kbe/src/lib/python-3.7-backup/` — 原 Python 3.7.3 完整源码
- `kbe/res/scripts/common/Lib-3.7-backup/` — 原 Python 3.7 标准库

### 2.2 C++ 源码修改

#### `kbe/src/lib/pyscript/scriptobject.cpp` (第 52 行)

```diff
- PyObject_INIT(static_cast<PyObject*>(this), pyType);
+ PyObject_Init(static_cast<PyObject*>(this), pyType);
```

**原因**: `PyObject_INIT` 在 Python 3.8 中废弃，3.12 中移除。`PyObject_Init` 是推荐替代函数，签名完全兼容。

**注**: Python 3.11 的 `objimpl.h` 仍保留 `PyObject_INIT` 宏作为向后兼容，但直接使用 `PyObject_Init` 更面向未来。

#### `kbe/src/lib/pyscript/scriptobject.h` — 无需修改

经对比 Python 3.11 `struct _typeobject` 字段布局（`Include/cpython/object.h:148-227`），KBEngine 的类型对象宏在以下位置的值均为 0/NULL，与 Python 3.11 期望完全兼容：

| 宏中字段 | Python 3.7 语义 | Python 3.11 语义 | 值 | 兼容性 |
|---------|----------------|-----------------|-----|--------|
| 位置 390 | `tp_print` | `tp_vectorcall_offset` | `0` | ✅ (0 = 不使用 vectorcall) |
| 位置 393 | `tp_compare` | `tp_as_async` | `0` | ✅ (NULL = 不支持异步) |
| 位置 479 | `tp_del` | `tp_del` | `0` | ✅ (Python 3.11 中仍有效) |

### 2.3 构建系统修改

#### `kbe/src/lib/Makefile` (第 39 行)

```diff
- cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.7m.a"
+ cd python && $(MAKE) $@ && if test -e "$(KBE_ROOT)/kbe/src/lib/python/libpython3.11.a"
```

**原因**: Python 3.8+ 移除了 pymalloc 的 `m` 后缀，库名从 `libpython3.7m.a` 变为 `libpython3.11.a`。

#### `kbe/src/build/common.mak` — 无需修改

所有 Python 相关配置均为变量引用，与版本无关：
- `PYTHONLIB = python` → 链接 `-lpython`
- `KBE_INCLUDES` 路径不变
- `KBE_PYTHONLIB` 展开为 `libs/libpython.a`（始终正确）

#### 9 个 vcxproj 文件

所有文件统一替换：
```
python37.lib   → python311.lib
python37_d.lib → python311_d.lib
```

| 文件 | Debug 引用 | Release 引用 | 状态 |
|------|-----------|-------------|------|
| `server/baseapp/baseapp.vcxproj` | 2 | 2 | ✅ |
| `server/cellapp/cellapp.vcxproj` | 2 | 2 | ✅ |
| `server/dbmgr/dbmgr.vcxproj` | 2 | 2 | ✅ |
| `server/loginapp/loginapp.vcxproj` | 2 | 2 | ✅ |
| `server/tools/bots/bots.vcxproj` | 2 | 2 | ✅ |
| `server/tools/guiconsole/guiconsole.vcxproj` | 2 | 2 | ✅ |
| `server/tools/interfaces/interfaces.vcxproj` | 2 | 2 | ✅ |
| `server/tools/kbcmd/kbcmd.vcxproj` | 2 | 2 | ✅ |
| `server/tools/logger/logger.vcxproj` | 2 | 2 | ✅ |

**验证项**:
- `baseapp.vcxproj:228` 引用 `lib\python\Modules\getbuildinfo.c` → 文件在 Python 3.11 中存在 ✅
- Python Include 路径 (`../../lib/python/Include`, `../../lib/python/PC`) → 在 Python 3.11 中存在 ✅

---

## 3. 未修改项（无需变更）

### 3.1 C API — 确认安全

| 高频 API (TOP 20) | 调用次数 | 3.7→3.11 状态 |
|-------------------|---------|--------------|
| PyObject | ~903 | ✅ STABLE |
| PyErr_PrintEx | ~430 | ✅ STABLE |
| PyExc_AssertionError | ~183 | ✅ STABLE |
| PyExc_TypeError | ~162 | ✅ STABLE |
| PyArg_ParseTuple | ~107 | ✅ STABLE |
| PyFloat_FromDouble | ~82 | ✅ STABLE |
| PyTuple_Size | ~84 | ✅ STABLE |
| 其余 15 个 | ~500+ | ✅ STABLE |

### 3.2 废弃 API — 确认未使用

| API | 移除版本 | KBEngine 使用 |
|-----|---------|-------------|
| PyEval_CallObject | 3.9 废弃 | ❌ 未使用（用 PyObject_CallObject） |
| Py_UNICODE 系列 | 3.12 移除 | ❌ 未使用 |
| PyFrame 直接访问 | 3.11 不透明化 | ❌ 未使用 |
| PyCode 直接访问 | 3.11 变更 | ❌ 未使用 |
| _PyObject_NEW | 3.8 废弃 | ❌ 未使用 |

### 3.3 scriptobject.h 类型宏 — 确认兼容

两个类型对象定义宏（`BASE_SCRIPT_READER` 和 `BASE_SCRIPT_INIT`）使用位置初始化，在 Python 3.11 `PyTypeObject` 结构中的字段布局经逐字段对比确认兼容。

---

## 4. 下一步操作 (Phase 2: 编译验证)

### 4.1 Linux 编译步骤

```bash
cd /path/to/kbengine_master/kbe/src/lib/python

# 清理（如有旧构建产物）
make distclean 2>/dev/null || true

# 配置
./configure \
    --enable-shared=no \
    --without-ensurepip \
    --disable-ipv6 \
    --disable-test-modules \
    CFLAGS="-O2 -fPIC"

# 编译 Python
make -j$(nproc)

# 编译 KBEngine 库
cd /path/to/kbengine_master/kbe/src/lib
make -j$(nproc)

# 编译服务器组件
cd /path/to/kbengine_master/kbe/src/server
make -j$(nproc)
```

### 4.2 运行时验证

```bash
# 1. 验证 Python 版本
kbe/src/lib/python/python --version  # 应输出: Python 3.11.11

# 2. 验证标准库
ls kbe/res/scripts/common/Lib/ | wc -l  # 应有 ~200+ 模块

# 3. 启动 Machine
./kbe/bin/server/machine

# 4. 启动全集群并运行 Bots 登录测试
```

### 4.3 Windows 编译

1. 打开 `kbe/kbengine.sln` 在 Visual Studio 2017/2019/2022
2. 确认所有项目的 Python 库引用指向 `python311.lib` / `python311_d.lib`
3. 编译解决方案

---

## 5. 回滚方案

如需回滚：

```bash
cd /path/to/kbengine_master

# 方式 1: Git 回滚
git checkout master
git branch -D python-upgrade-3.11

# 方式 2: 恢复备份
rm -rf kbe/src/lib/python
mv kbe/src/lib/python-3.7-backup kbe/src/lib/python
rm -rf kbe/res/scripts/common/Lib
mv kbe/res/scripts/common/Lib-3.7-backup kbe/res/scripts/common/Lib
```

---

## 6. 文件清单

### 新增文件
- `kbe/src/lib/python/` (Python 3.11.11 完整源码树)
- `kbe/src/lib/python-3.7-backup/` (备份)
- `kbe/res/scripts/common/Lib-3.7-backup/` (备份)

### 修改文件
- `kbe/src/lib/Makefile`
- `kbe/src/lib/pyscript/scriptobject.cpp`
- `kbe/src/server/baseapp/baseapp.vcxproj`
- `kbe/src/server/cellapp/cellapp.vcxproj`
- `kbe/src/server/dbmgr/dbmgr.vcxproj`
- `kbe/src/server/loginapp/loginapp.vcxproj`
- `kbe/src/server/tools/bots/bots.vcxproj`
- `kbe/src/server/tools/guiconsole/guiconsole.vcxproj`
- `kbe/src/server/tools/interfaces/interfaces.vcxproj`
- `kbe/src/server/tools/kbcmd/kbcmd.vcxproj`
- `kbe/src/server/tools/logger/logger.vcxproj`

---

> **实施状态**: Phase 1 代码修改完成。待在有编译工具链的 Linux 环境中进行 Phase 2 编译验证。
> **分支**: `python-upgrade-3.11` (基于 master: 240a1b960)
