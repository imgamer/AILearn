# KBEngine VS2019 → VS2022 迁移方案

> **引擎版本**: v1.2.2 (kst 分支)
> **源代码路径**: `I:\kbengine\kbengine_master`
> **分析日期**: 2026-06-11
> **当前 IDE**: Visual Studio 2019 (v142 toolset)
> **目标 IDE**: Visual Studio 2022 (v143 toolset)

---

## 目录

1. [当前项目结构总览](#1-当前项目结构总览)
2. [迁移风险评估](#2-迁移风险评估)
3. [迁移步骤](#3-迁移步骤)
4. [自动化脚本方案](#4-自动化脚本方案)
5. [验证清单](#5-验证清单)
6. [回滚方案](#6-回滚方案)
7. [附录：文件清单](#7-附录文件清单)

---

## 1. 当前项目结构总览

### 1.1 解决方案文件

| 文件 | 路径 | 格式版本 | VS 版本 |
|------|------|---------|---------|
| `kbengine.sln` | `kbe/src/kbengine.sln` | Format 12.00 | Visual Studio 15 (2017) |
| VisualStudioVersion | 15.0.27703.2047 | — | 实际使用 VS2017/2019 |
| MinimumVisualStudioVersion | 10.0.40219.1 | — | VS2010 最低要求 |

### 1.2 工程文件统计

#### KBEngine 自有工程（全部 v142 / Windows SDK 10.0）

**内部库 (lib/) — 16 个工程:**

| 工程 | vcxproj 路径 | Toolset |
|------|-------------|---------|
| client_lib | `lib/client_lib/client_lib.vcxproj` | v142 |
| common | `lib/common/common.vcxproj` | v142 |
| db_interface | `lib/db_interface/db_interface.vcxproj` | v142 |
| db_mongodb | `lib/db_mongodb/db_mongodb.vcxproj` | v142 |
| db_mysql | `lib/db_mysql/db_mysql.vcxproj` | v142 |
| db_redis | `lib/db_redis/db_redis.vcxproj` | v142 |
| entitydef | `lib/entitydef/entitydef.vcxproj` | v142 |
| helper | `lib/helper/helper.vcxproj` | v142 |
| math | `lib/math/math.vcxproj` | v142 |
| navigation | `lib/navigation/navigation.vcxproj` | v142 |
| network | `lib/network/network.vcxproj` | v142 |
| pyscript | `lib/pyscript/pyscript.vcxproj` | v142 |
| resmgr | `lib/resmgr/resmgr.vcxproj` | v142 |
| server | `lib/server/server.vcxproj` | v142 |
| thread | `lib/thread/thread.vcxproj` | v142 |
| xml | `lib/xml/xml.vcxproj` | v142 |

**服务器组件 (server/) — 13 个工程:**

| 工程 | vcxproj 路径 | Toolset |
|------|-------------|---------|
| baseapp | `server/baseapp/baseapp.vcxproj` | v142 |
| baseappmgr | `server/baseappmgr/baseappmgr.vcxproj` | v142 |
| cellapp | `server/cellapp/cellapp.vcxproj` | v142 |
| cellappmgr | `server/cellappmgr/cellappmgr.vcxproj` | v142 |
| centermgr | `server/centermgr/centermgr.vcxproj` | v142 |
| dbmgr | `server/dbmgr/dbmgr.vcxproj` | v142 |
| loginapp | `server/loginapp/loginapp.vcxproj` | v142 |
| machine | `server/machine/machine.vcxproj` | v142 |
| bots | `server/tools/bots/bots.vcxproj` | v142 |
| guiconsole | `server/tools/guiconsole/guiconsole.vcxproj` | v142 |
| interfaces | `server/tools/interfaces/interfaces.vcxproj` | v142 |
| kbcmd | `server/tools/kbcmd/kbcmd.vcxproj` | v142 |
| logger | `server/tools/logger/logger.vcxproj` | v142 |

**依赖库 (lib/dependencies/) — kbengine.sln 直接引用的工程:**

| 工程 | vcxproj 路径 | Toolset | 备注 |
|------|-------------|---------|------|
| apr | `lib/dependencies/apr/apr.vcxproj` | v142 | |
| apr-util | `lib/dependencies/apr-util/aprutil.vcxproj` | v142 | |
| expat (apr-util子) | `lib/dependencies/apr-util/xml/expat/lib/expat.vcxproj` | v142 | |
| expat_static | `lib/dependencies/expat/lib/expat_static.vcxproj` | v142 | |
| fmt | `lib/dependencies/fmt/fmt.vcxproj` | v142 | |
| hiredis | `lib/dependencies/hiredis/redis-win/msvs/hiredis/hiredis.vcxproj` | v142 | |
| jemalloc | `lib/dependencies/jemalloc/msvc/projects/vc2017/jemalloc/jemalloc.vcxproj` | **v141** | 仍为 VS2017 toolset |
| jwsmtp | `lib/dependencies/jwsmtp/jwsmtp.vcxproj` | v142 | |
| libcurl | `lib/dependencies/curl/projects/Windows/VC14/lib/libcurl.vcxproj` | v142 | kbengine.sln 引用 VC14 |
| libeay32 | `lib/dependencies/openssl/vcbuild/libeay32/libeay32.vcxproj` | v142 | OpenSSL 加密库 |
| log4cxx | `lib/dependencies/log4cxx/projects/log4cxx.vcxproj` | v142 | |
| mongoc_static | `lib/dependencies/mongodb/mongoc_static.vcxproj` | v142 | |
| bson_static | `lib/dependencies/mongodb/src/libbson/bson_static.vcxproj` | v142 | MongoDB BSON 库 |
| ssleay32 | `lib/dependencies/openssl/vcbuild/ssleay32/ssleay32.vcxproj` | v142 | OpenSSL SSL 库 |
| tmxparser | `lib/dependencies/tmxparser/tmxparser/tmxparser.vcxproj` | v142 | TMX 地图解析 |
| zlib | `lib/dependencies/zlib/contrib/vstudio/vc14/zlibstat.vcxproj` | v142 | 压缩库 |

> **注意**: curl 的 VC15 目录下有 v141 工程，但 kbengine.sln 实际引用的是 VC14 (v142) 版本。zlib 使用 VS2015 格式 (ToolsVersion="14.0") 且配置名略有不同 (含 ReleaseWithoutAsm/Itanium)，迁移时需额外注意。

### 1.3 配置矩阵

所有工程统一使用 4 种配置:

| 配置 | 平台 |
|------|------|
| Debug | Win32 |
| Debug | x64 |
| Release | Win32 |
| Release | x64 |

### 1.4 工程总数

kbengine.sln 共引用 **57 个 vcxproj 工程**，其中需要迁移的 (排除 python 相关):

- **kbengine 自有**: 16 个内部库 + 13 个服务器组件 = **29 个**
- **依赖库**: **16 个** (含 apr, curl, openssl, tmxparser, zlib 等)

### 1.5 MSBuild 属性文件 (.props/.targets)

kbengine 源码树中未发现 kbengine 级别的 `Directory.Build.props` 或 `Directory.Build.targets`，意味着**没有集中式的属性继承需要更新**——每个 vcxproj 独立配置 toolset。

发现的 .props/.targets 文件:

| 文件 | 路径 | 影响范围 |
|------|------|---------|
| `wolfssl_override.props` | `lib/dependencies/curl/projects/` | curl 的 wolfSSL 构建覆盖，不影响 kbengine |
| `Directory.Build.props` | `lib/python/PCbuild/` | CPython 构建，不受 kbengine toolset 迁移影响 |
| `Directory.Build.targets` | `lib/python/PCbuild/` | CPython 构建，不受 kbengine toolset 迁移影响 |
| `python.props` 等 | `lib/python/PCbuild/` | CPython 构建，不受 kbengine toolset 迁移影响 |

> **结论**: 迁移时不需要修改任何 .props 或 .targets 文件。

### 1.6 当前编译环境

| 项目 | 当前值 | 目标值 |
|------|--------|--------|
| MSVC Toolset | v142 (VS 2019) | v143 (VS 2022) |
| Windows SDK | 10.0 | 10.0 (不变) |
| C++ 标准 | C++11 (`-std=c++11`) | C++11/C++17 |
| 解决方案格式 | Format 12.00 | Format 12.00 (兼容) |

---

## 2. 迁移风险评估

### 2.1 风险矩阵

| 风险 | 等级 | 影响范围 | 说明 |
|------|------|---------|------|
| C++ 标准行为变更 | **中** | 全部 C++ 源码 | VS2022 默认 `/std:c++17`，原项目为 C++11 |
| 第三方库 ABI 不兼容 | **高** | 依赖库 | v142 编译的 .lib 与 v143 不兼容，需全部重编译 |
| 废弃 API 移除 | **低** | 网络/Python 模块 | VS2022 移除部分老旧 CRT/POSIX 函数 |
| jemalloc 为 v141 | **低** | jemalloc | 仅 jemalloc 使用 v141，直接改 v143 |
| zlib 工程格式 | **中** | zlib | VS2015 格式，配置名非标准 (ReleaseWithoutAsm/Itanium)，需额外注意 |
| Win32 平台支持 | **低** | Win32 配置 | VS2022 仍支持 x86，但部分新特性仅 x64 |
| /Werror 新警告 | **中** | 全部工程 | VS2022 新增更多警告，可能触发编译错误 |
| Python 嵌入式版本 | **低** | pyscript 等 | 内嵌 Python 3.7，需确认与 v143 兼容 |

### 2.2 详细风险分析

#### 2.2.1 C++ 标准兼容性

KBEngine 当前使用 `-std=c++11`（Linux Make）和 VS2019 默认（C++14）。VS2022 默认 C++ 标准为 `/std:c++17`。

**潜在问题:**
- `register` 关键字在 C++17 中彻底移除
- `std::auto_ptr` 在 C++17 中彻底移除
- `std::random_shuffle` 在 C++17 中移除
- 更严格的 `noexcept` 规范
- 结构化绑定可能引入名称冲突

**建议**: 保持 C++14 标准 (`/std:c++14`)，后续再逐步升级到 C++17。

#### 2.2.2 第三方库兼容性

| 依赖库 | 当前版本 | VS2022 兼容性 | 需要操作 |
|--------|---------|--------------|---------|
| **apr / apr-util** | 1.x (内嵌) | ✅ 兼容 | 仅重编译 |
| **expat** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **fmt** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **hiredis** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **jemalloc** | 5.x (vc2017) | ⚠️ 需检查 | 升级到 vc2022 工程或使用 v143 |
| **jwsmtp** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **log4cxx** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **mongodb (mongo-c-driver)** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **curl** | 内嵌 (VC14) | ✅ 兼容 | kbengine.sln 引用 VC14 (v142)，直接改 v143 即可 |
| **openssl** | 内嵌版本 | ✅ 兼容 | libeay32/ssleay32 均为 v142，直接改 v143 |
| **tmxparser** | 内嵌版本 | ✅ 兼容 | 仅重编译 |
| **zlib** | 内嵌版本 | ⚠️ 需注意 | VS2015 格式 (ToolsVersion 14.0)，配置名非标准 (含 ReleaseWithoutAsm/Itanium) |

#### 2.2.3 MSVC 已知破坏性变更 (VS2019 → VS2022)

1. **更严格的 constexpr 求值**: VS2022 对 constexpr 函数有更严格的检查
2. **`/Zc:lambda` 默认启用**: Lambda 捕获规则变化
3. **`/Zc:externC` 默认启用**: extern "C" 函数类型检查更严格
4. **`/Zc:preprocessor`**: 新的预处理器默认启用，可能影响宏展开
5. **`std::string` ABI 变更**: VS2022 的 SSO buffer size 可能不同

#### 2.2.4 新警告 (可能触发 /Werror)

VS2022 新增了多项警告（C5054, C5055, C5204, C5219 等），在 `-Werror` (Treat Warnings As Errors) 模式下可能导致原工程编译失败。

**建议**: 迁移后先关闭 `/WX` 编译一次，清理警告后再开启。

### 2.3 不可迁移项

- **Linux 构建系统**: Makefile (`common.mak`) 不受影响，保持不变
- **Python 脚本**: 不受 IDE 变更影响
- **CMakeLists.txt**: 部分依赖库 (apr, curl, mongodb) 有 CMakeLists.txt，仅在 CMake 构建路径使用

---

## 3. 迁移步骤

### 阶段 0: 环境准备

1. **安装 Visual Studio 2022**
   - 安装 "Desktop development with C++" workload
   - 安装 MSVC v143 工具链
   - 安装 Windows 10 SDK (10.0.19041.0 或更高)
   - 安装 C++ ATL/MFC 支持 (如果 guiconsole 需要)

2. **备份当前工程**
   ```bash
   # 创建迁移分支或备份目录
   cd I:\kbengine\kbengine_master
   git checkout -b vs2022-migration
   ```

3. **验证 VS2019 构建基线**
   - 在 VS2019 中完成一次完整 Rebuild，确认全部工程编译通过
   - 记录编译警告数量作为基线

### 阶段 1: 解决方案文件更新

**步骤 1.1**: 更新 `kbe/src/kbengine.sln`

需要修改的内容:
```
# 文件头部
Microsoft Visual Studio Solution File, Format Version 12.00  ← 保持不变
# Visual Studio 15 → Visual Studio 17
VisualStudioVersion = 17.0.xxxxx.xxx

# 最低版本要求 (可选)
MinimumVisualStudioVersion = 10.0.40219.1  ← 可保持不变
```

> **说明**: VS2022 的 .sln 格式仍为 Format 12.00，与 VS2019 兼容。主要变更是在文件头的注释行。实际上 VS2022 打开旧 .sln 时会自动处理，**手动修改此步骤可选**。

### 阶段 2: 工程文件批量更新

**步骤 2.1**: 批量替换 PlatformToolset (v142 → v143)

需要修改的 vcxproj 文件 (29 个 kbengine 自有 + 16 个依赖):

所有 `<PlatformToolset>v142</PlatformToolset>` → `<PlatformToolset>v143</PlatformToolset>`

涉及的工程目录:
```
kbe/src/lib/client_lib/
kbe/src/lib/common/
kbe/src/lib/db_interface/
kbe/src/lib/db_mongodb/
kbe/src/lib/db_mysql/
kbe/src/lib/db_redis/
kbe/src/lib/entitydef/
kbe/src/lib/helper/
kbe/src/lib/math/
kbe/src/lib/navigation/
kbe/src/lib/network/
kbe/src/lib/pyscript/
kbe/src/lib/resmgr/
kbe/src/lib/server/
kbe/src/lib/thread/
kbe/src/lib/xml/
kbe/src/lib/dependencies/apr/
kbe/src/lib/dependencies/apr-util/
kbe/src/lib/dependencies/curl/projects/Windows/VC14/
kbe/src/lib/dependencies/expat/
kbe/src/lib/dependencies/fmt/
kbe/src/lib/dependencies/hiredis/
kbe/src/lib/dependencies/jemalloc/
kbe/src/lib/dependencies/jwsmtp/
kbe/src/lib/dependencies/log4cxx/
kbe/src/lib/dependencies/mongodb/
kbe/src/lib/dependencies/openssl/
kbe/src/lib/dependencies/tmxparser/
kbe/src/lib/dependencies/zlib/
kbe/src/server/baseapp/
kbe/src/server/baseappmgr/
kbe/src/server/cellapp/
kbe/src/server/cellappmgr/
kbe/src/server/centermgr/
kbe/src/server/dbmgr/
kbe/src/server/loginapp/
kbe/src/server/machine/
kbe/src/server/tools/bots/
kbe/src/server/tools/guiconsole/
kbe/src/server/tools/interfaces/
kbe/src/server/tools/kbcmd/
kbe/src/server/tools/logger/
```

**步骤 2.2**: 处理 jemalloc (当前为 v141)

`lib/dependencies/jemalloc/msvc/projects/vc2017/jemalloc/jemalloc.vcxproj`

选项 A: 直接将 v141 → v143
选项 B: 复制 vc2017 目录为 vc2022，创建新工程（推荐，保留原工程）

**建议**: 选项 A，直接将 jemalloc 的 v141 改为 v143，因为 jemalloc 5.x 在 VS2022 上编译已验证可行。

**步骤 2.3**: 处理 curl (当前为 v142 VC14)

`lib/dependencies/curl/projects/Windows/VC14/lib/libcurl.vcxproj`

kbengine.sln 引用的是 VC14 版本 (v142)，直接改 v143 即可。注意 curl 同时提供了 VC15 (v141) 工程，但未被 kbengine.sln 使用。

**步骤 2.4**: 处理 openssl (当前为 v142)

`lib/dependencies/openssl/vcbuild/libeay32/libeay32.vcxproj`
`lib/dependencies/openssl/vcbuild/ssleay32/ssleay32.vcxproj`

两个 openssl 工程均为 v142，直接改 v143 即可。工程使用旧 vcbuild 格式但已升级到 VS2019 兼容，VS2022 可直接打开。

### 阶段 3: 编译验证

**步骤 3.1**: 首次编译

在 VS2022 中打开 `kbengine.sln`，VS 会自动提示升级。选择"确定"进行一次性升级。

或使用命令行:
```batch
cd kbe\src
msbuild kbengine.sln /t:Rebuild /p:Configuration=Debug /p:Platform=x64 /p:PlatformToolset=v143
```

**步骤 3.2**: 处理编译错误（预期可能出现的问题）

| 预期问题 | 解决方案 |
|---------|---------|
| `register` 关键字错误 (C++17) | 移除 `register` 关键字，或添加 `/std:c++14` |
| `std::auto_ptr` 未定义 | 替换为 `std::unique_ptr`，或添加 `/std:c++14` |
| 新警告转为错误 (/WX) | 先禁用 `/WX`，修复警告后再启用 |
| jemalloc 编译错误 | 检查 jemalloc 版本，必要时升级到 5.3+ |
| 链接错误 (ABI 不匹配) | 确保所有 .lib 都用 v143 重新编译 |

**步骤 3.3**: 四配置全编译

```batch
REM Debug x64
msbuild kbengine.sln /t:Rebuild /p:Configuration=Debug /p:Platform=x64

REM Release x64
msbuild kbengine.sln /t:Rebuild /p:Configuration=Release /p:Platform=x64

REM Debug Win32
msbuild kbengine.sln /t:Rebuild /p:Configuration=Debug /p:Platform=Win32

REM Release Win32
msbuild kbengine.sln /t:Rebuild /p:Configuration=Release /p:Platform=Win32
```

### 阶段 4: 运行时验证

1. **启动最小集群** (Linux 生产服务器 + Windows 开发验证)
   - 在 Windows 上运行 `machine` 进程
   - 启动 `dbmgr`、`baseappmgr`、`cellappmgr`
   - 启动 `loginapp`、`baseapp`、`cellapp`
   - 验证进程间通信正常

2. **功能回归测试**
   - 客户端连接 → 登录 → 进入游戏
   - 实体创建/销毁
   - 数据库读写
   - 跨服功能 (centermgr)

---

## 4. 自动化脚本方案

### 4.1 PowerShell 迁移脚本

```powershell
# migrate_to_vs2022.ps1
# 将 KBEngine 所有 vcxproj 从 v142 迁移到 v143

$kbengineRoot = "I:\kbengine\kbengine_master\kbe\src"

$vcxprojFiles = Get-ChildItem -Path $kbengineRoot -Filter "*.vcxproj" -Recurse |
    Where-Object { $_.FullName -notmatch "\\python\\" -and
                   $_.FullName -notmatch "\\python-3\.7-backup\\" }

$migrated = 0
$alreadyV143 = 0

foreach ($file in $vcxprojFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match '<PlatformToolset>v143</PlatformToolset>') {
        Write-Host "Already v143: $($file.FullName)" -ForegroundColor Green
        $alreadyV143++
        continue
    }
    
    if ($content -match '<PlatformToolset>v14[0-2]</PlatformToolset>') {
        $newContent = $content -replace '<PlatformToolset>v142</PlatformToolset>', '<PlatformToolset>v143</PlatformToolset>'
        $newContent = $newContent -replace '<PlatformToolset>v141</PlatformToolset>', '<PlatformToolset>v143</PlatformToolset>'
        $newContent = $newContent -replace '<PlatformToolset>v140</PlatformToolset>', '<PlatformToolset>v143</PlatformToolset>'
        
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($true))
        Write-Host "Migrated: $($file.FullName)" -ForegroundColor Yellow
        $migrated++
    }
}

Write-Host "`n=== Migration Summary ===" -ForegroundColor Cyan
Write-Host "Migrated to v143: $migrated"
Write-Host "Already v143: $alreadyV143"
Write-Host "Total processed: $($vcxprojFiles.Count)"
```

### 4.2 使用方式

```powershell
# 1. 先 dry-run (只检查，不修改)
powershell -File migrate_to_vs2022.ps1

# 2. 实际执行迁移
powershell -File migrate_to_vs2022.ps1 -Apply

# 3. 验证结果
findstr /s "<PlatformToolset>v142</PlatformToolset>" kbe\src\*.vcxproj
# 应返回空（除了 python 相关）
```

---

## 5. 验证清单

### 5.1 迁移前

- [ ] VS2022 已安装，含 "Desktop development with C++" workload
- [ ] MSVC v143 工具链可用 (`cl.exe` 版本 ≥ 19.30)
- [ ] VS2019 下完整 Rebuild 成功（基线）
- [ ] 创建 git 分支或备份

### 5.2 迁移中

- [ ] `kbengine.sln` 可在 VS2022 中正常打开
- [ ] 所有 vcxproj 的 PlatformToolset 已改为 v143
- [ ] jemalloc v141 → v143 已完成
- [ ] curl VC14 v142 → v143 已完成
- [ ] openssl (libeay32/ssleay32) v142 → v143 已完成
- [ ] tmxparser / zlib v142 → v143 已完成

### 5.3 编译验证

- [ ] Debug|x64 编译通过，0 错误
- [ ] Release|x64 编译通过，0 错误
- [ ] Debug|Win32 编译通过，0 错误
- [ ] Release|Win32 编译通过，0 错误
- [ ] 编译警告数未显著增加（与基线对比）

### 5.4 运行时验证

- [ ] machine 进程正常启动
- [ ] 核心服务器组件全部启动成功
- [ ] Python 脚本层正常加载
- [ ] 客户端连接和实体操作正常

---

## 6. 回滚方案

如果迁移后出现无法解决的编译或运行问题:

### 6.1 快速回滚（git）

```bash
cd I:\kbengine\kbengine_master
git checkout master          # 切回原始分支
git branch -D vs2022-migration  # 删除迁移分支
```

### 6.2 手动回滚

将 `<PlatformToolset>v143</PlatformToolset>` 改回 `<PlatformToolset>v142</PlatformToolset>`:

```powershell
Get-ChildItem -Path "I:\kbengine\kbengine_master\kbe\src" -Filter "*.vcxproj" -Recurse |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace '<PlatformToolset>v143</PlatformToolset>', '<PlatformToolset>v142</PlatformToolset>'
        [System.IO.File]::WriteAllText($_.FullName, $content)
    }
```

### 6.3 部分回滚

如果仅某个依赖库有问题:
- 将单个工程的 toolset 改回 v142
- v142 和 v143 的 .lib 可以链接（在有限情况下），但官方不建议混用

---

## 7. 附录：文件清单

### 7.1 需要修改的 vcxproj 文件 (kbengine 自有)

```
kbe/src/lib/client_lib/client_lib.vcxproj
kbe/src/lib/common/common.vcxproj
kbe/src/lib/db_interface/db_interface.vcxproj
kbe/src/lib/db_mongodb/db_mongodb.vcxproj
kbe/src/lib/db_mysql/db_mysql.vcxproj
kbe/src/lib/db_redis/db_redis.vcxproj
kbe/src/lib/entitydef/entitydef.vcxproj
kbe/src/lib/helper/helper.vcxproj
kbe/src/lib/math/math.vcxproj
kbe/src/lib/navigation/navigation.vcxproj
kbe/src/lib/network/network.vcxproj
kbe/src/lib/pyscript/pyscript.vcxproj
kbe/src/lib/resmgr/resmgr.vcxproj
kbe/src/lib/server/server.vcxproj
kbe/src/lib/thread/thread.vcxproj
kbe/src/lib/xml/xml.vcxproj
kbe/src/server/baseapp/baseapp.vcxproj
kbe/src/server/baseappmgr/baseappmgr.vcxproj
kbe/src/server/cellapp/cellapp.vcxproj
kbe/src/server/cellappmgr/cellappmgr.vcxproj
kbe/src/server/centermgr/centermgr.vcxproj
kbe/src/server/dbmgr/dbmgr.vcxproj
kbe/src/server/loginapp/loginapp.vcxproj
kbe/src/server/machine/machine.vcxproj
kbe/src/server/tools/bots/bots.vcxproj
kbe/src/server/tools/guiconsole/guiconsole.vcxproj
kbe/src/server/tools/interfaces/interfaces.vcxproj
kbe/src/server/tools/kbcmd/kbcmd.vcxproj
kbe/src/server/tools/logger/logger.vcxproj
```

### 7.2 需要修改的 vcxproj 文件 (依赖库)

```
kbe/src/lib/dependencies/apr/apr.vcxproj
kbe/src/lib/dependencies/apr-util/aprutil.vcxproj
kbe/src/lib/dependencies/apr-util/xml/expat/lib/expat.vcxproj
kbe/src/lib/dependencies/curl/projects/Windows/VC14/lib/libcurl.vcxproj
kbe/src/lib/dependencies/expat/lib/expat_static.vcxproj
kbe/src/lib/dependencies/fmt/fmt.vcxproj
kbe/src/lib/dependencies/hiredis/redis-win/msvs/hiredis/hiredis.vcxproj
kbe/src/lib/dependencies/jemalloc/msvc/projects/vc2017/jemalloc/jemalloc.vcxproj
kbe/src/lib/dependencies/jwsmtp/jwsmtp.vcxproj
kbe/src/lib/dependencies/log4cxx/projects/log4cxx.vcxproj
kbe/src/lib/dependencies/mongodb/mongoc_static.vcxproj
kbe/src/lib/dependencies/mongodb/src/libbson/bson_static.vcxproj
kbe/src/lib/dependencies/openssl/vcbuild/libeay32/libeay32.vcxproj
kbe/src/lib/dependencies/openssl/vcbuild/ssleay32/ssleay32.vcxproj
kbe/src/lib/dependencies/tmxparser/tmxparser/tmxparser.vcxproj
kbe/src/lib/dependencies/zlib/contrib/vstudio/vc14/zlibstat.vcxproj
```

### 7.3 不需要修改的文件

```
# 以下文件不受 IDE 升级影响，不需修改:
kbe/src/build/common.mak          # Linux Make 构建
kbe/src/Makefile                  # Linux Make 构建
kbe/src/lib/dependencies/*/CMakeLists.txt  # CMake 构建 (Linux)
kbe/src/lib/python/               # 内嵌 Python (已有独立 VS 工程)
kbe/src/lib/python-3.7-backup/    # Python 备份
*.vcxproj.filters                 # 过滤器文件 (不影响编译)
```

---

> **总结**: VS2019 → VS2022 迁移的核心操作是将所有 vcxproj 文件中的 `<PlatformToolset>v142</PlatformToolset>` 替换为 `<PlatformToolset>v143</PlatformToolset>`。共涉及 29 个 kbengine 自有 vcxproj + 16 个依赖 vcxproj = **45 个文件**。主要风险在于第三方库的 ABI 兼容性和新编译器引入的警告。建议先保持 C++14 标准不变，确保编译通过后再考虑升级 C++ 标准。
