# 方案 C：现代 C++20 渐进式重构 + Python 3.12

> 状态：稳妥备选 (★★★★☆) | 日期：2026-06-09
> 引擎层：C++20 | 脚本层：CPython 3.12（pybind11） | 替代对象：原 KBEngine v1.2.2 C++11 + Python 3.7
>
> **适用场景**：资源有限，需要 6 个月内交付改进版本；团队 C++ 强、Rust 弱

---

## 一、技术方案

### 1.1 设计目标

| 目标 | 量化指标 |
|------|---------|
| 现有代码复用 | 至少 70% 现有 C++ 代码保留，逐模块替换 |
| 现有游戏逻辑零修改 | 所有 Python 脚本直接运行（仅版本升级） |
| 安全 | OpenSSL 3.x、log4cxx→spdlog、py_macros→pybind11；可观测的内存泄漏减半 |
| 可测试性 | 引入 GoogleTest，核心模块覆盖率 ≥ 40% |
| 现代构建 | CMake 统一替代 GNU Make + VS sln，跨平台一键构建 |
| 性能 | Python 3.12 带来 30%+ 脚本层提速；引擎层无明显回退 |

### 1.2 升级路径（9 步）

| # | 步骤 | 难度 | 工作量（人月） | 收益 |
|---|------|------|---------------|------|
| 1 | C++11 → C++20（GCC 11+ / Clang 14+ / MSVC 2022+） | 低 | 2-3 | `std::format`, coroutines, concepts, ranges, `<bit>` |
| 2 | GNU Make + sln → CMake | 中 | 2-3 | 跨平台统一 + vcpkg/conan 集成 |
| 3 | OpenSSL 1.0.2e → 3.x | 低 | 1-2 | 安全合规 |
| 4 | log4cxx → spdlog | 低 | 1-2 | 现代日志、编译更快 |
| 5 | SmartPointer → std::shared_ptr / unique_ptr | 中 | 2-3 | 标准兼容、工具链支持 |
| 6 | py_macros.h → pybind11 | 中 | 4-6 | 类型安全、宏链消失、IDE 友好 |
| 7 | Python 3.7 → 3.12 嵌入 | 中 | 2-3 | 50%+ 性能、新特性 |
| 8 | PythonApp/EntityApp 继承链修复 | 中 | 2-3 | 消除重复代码 |
| 9 | EntityDef 去静态化 + 引入 GoogleTest | 中 | 4-6 | 可测试性、可多实例化 |
| **总计** | | | **20-31**（不含集成测试） | |

加上 WebConsole 现代化、单元测试基础设施和回归保障：**28-46 人月**

### 1.3 架构总图

保留 KBEngine 既有架构：

```
原架构图不变（Loginapp/Baseapp/Cellapp/Dbmgr/Mgrs/Machine/Logger/Centermgr）
变化点：
  - 编译器从 GCC 4.8 → GCC 11+
  - C++11 → C++20 标准
  - 第三方库逐个替换
  - Python 3.7 → 3.12
  - 构建系统 CMake 化
  - 引入测试和 CI 流水线
```

### 1.4 子系统改造清单

| 子系统 | 改造内容 | 优先级 |
|--------|---------|-------|
| common | `std::format` 替代手写 fmt；`std::span` 替代裸指针；`<bit>` 替代位操作宏 | P1 |
| thread | `std::jthread` 替代 pthread；`std::stop_token` 优雅退出 | P1 |
| network | 引入 `<coroutine>` 协程，减少回调金字塔（可选） | P2 |
| pyscript | 全量切到 pybind11；保留 KBEngine.* API 不变 | P0 |
| entitydef | 去 static，实例化 + 单元测试 | P0 |
| baseapp/cellapp | 继承链修复（ServerApp→PythonApp→EntityApp）+ Singleton 清理 | P0 |
| db_interface | 接口不变；底层驱动升级（MySQL 8 / MongoDB C++ Driver 3.x） | P1 |
| navigation | Recast/Detour 升级到最新版 | P2 |
| webconsole | Django → 现代 React/Vue + FastAPI 后端 | P2 |

### 1.5 关键设计决策

**D-1 不动核心架构**
- 多进程模型、实体双端、AOI/Ghost、Manager/Worker 全部保留
- 客户端协议字节级不变，SDK 零修改

**D-2 pybind11 迁移策略**
- 增量替换：每次 PR 替换一个模块的 py_macros 使用
- 提供 `KBENGINE_PYBIND_CLASS` 宏作为过渡，封装 pybind11 模板细节
- 保持 `KBEngine.*` Python API 表面 100% 兼容
- Python 3.7→3.12 在 pybind11 切换完成后进行（pybind11 已完整支持）

**D-3 EntityDef 去静态化**
- 现状：`class EntityDef { static map<...> propertys_; static ... }`
- 目标：`class EntityDef { map<...> propertys_; }` + 全局单例 `EntityDef::instance()`
- 进一步：在 Baseapp/Cellapp 中作为 owned 成员，支持单元测试时构造独立实例

**D-4 继承链修复**
- 当前：`ServerApp ↘ EntityApp`，且 `PythonApp` 独立继承 `ServerApp`
- 目标：`ServerApp → PythonApp → EntityApp`，将 Python 初始化（installPyModules/reloadScript）下沉到 PythonApp
- 影响面：Baseapp、Cellapp 主类（继承链调整），约 6-8 个文件
- 风险：reloadScript 路径变更，需要回归现有所有 demo

**D-5 CMake 迁移**
- 单 `CMakeLists.txt` per crate（库 + 可执行）+ 顶层聚合
- vcpkg manifest 模式管理第三方依赖
- 同时保留 GNU Make 直到 CMake 完整通过所有 CI 任务

**D-6 单元测试基础**
- 框架：GoogleTest + GoogleMock
- 优先覆盖：common、math、network codec、entitydef、db_interface
- CI 门禁：新增代码必须有对应单元测试（lcov 增量覆盖率 ≥ 60%）

### 1.6 风险登记册

| # | 风险 | 概率 | 影响 | 缓解 |
|---|------|------|------|------|
| R1 | C++20 编译器在某些 Linux 发行版上不可用 | 中 | 中 | 文档化最低发行版要求（Ubuntu 22.04+ / RHEL 9+） |
| R2 | pybind11 迁移引入 Python API 微小差异 | 高 | 高 | 端到端集成测试 + ouroboros demo 回归 |
| R3 | EntityDef 去静态化破坏现有代码 | 中 | 高 | 灰度迁移：先保留 static 转发，逐模块切换 |
| R4 | 内存安全问题未根本解决 | 高 | 中 | 引入 AddressSanitizer / ThreadSanitizer 到 CI |
| R5 | "重构无止境"陷阱，scope creep | 高 | 高 | 每个 Phase 严格 timebox，超时砍范围 |

---

## 二、开发计划

### 2.1 总体节奏

| Phase | 主题 | 人月 | 团队规模 | 日历 |
|-------|------|------|---------|------|
| 1 | 构建系统 + 编译器升级 | 4-6 | 4-6 | 2-3 月 |
| 2 | 第三方库现代化 | 8-12 | 4-6 | 3-4 月 |
| 3 | 架构问题修复 | 6-10 | 4-6 | 2-3 月 |
| 4 | 工具链 + 测试 + 文档 | 10-18 | 4-6 | 3-4 月 |
| **总计** | | **28-46** | **4-6 人团队** | **4-6 月**（部分并行） |

### 2.2 Phase 1 — 构建系统 + 编译器升级 (2-3 个月)

| Sprint | 内容 |
|--------|------|
| S1-2 | 调研 + 设计 CMake 结构；选定 vcpkg 配置 |
| S3-4 | common/math/thread/xml/resmgr 完成 CMake 迁移 |
| S5-6 | network/server/db_interface CMake 迁移 |
| S7-8 | C++20 启用 + 编译警告清零 + CI 接入 |

**里程碑 M1**：所有进程在 GCC 11/Clang 14/MSVC 2022 下用 CMake + vcpkg 编译通过；ouroboros demo 端到端跑通

### 2.3 Phase 2 — 第三方库现代化 (3-4 个月)

| Sprint | 内容 |
|--------|------|
| S1-2 | OpenSSL 1.0.2e → 3.x；TLS 接口适配 |
| S3-4 | log4cxx → spdlog；日志接口封装层 |
| S5-6 | SmartPointer → std::shared_ptr（自动化脚本 + 人工审查） |
| S7-10 | py_macros.h → pybind11（核心模块） |
| S11-12 | Python 3.7 → 3.12 嵌入 |

**里程碑 M2**：所有第三方库现代化完成，ouroboros demo 在 Python 3.12 上无回归

### 2.4 Phase 3 — 架构问题修复 (2-3 个月)

| Sprint | 内容 |
|--------|------|
| S1-2 | PythonApp 类创建 + EntityApp 重新继承；reloadScript 下沉 |
| S3-4 | EntityDef 去 static（保留 wrapper 兼容） |
| S5-6 | CRTP Singleton 清理（最常用的 5-8 个） |

**里程碑 M3**：架构清晰，所有继承断裂修复；单元测试覆盖核心模块

### 2.5 Phase 4 — 工具链 + 测试 + 文档 (3-4 个月)

- GoogleTest 框架引入 + 优先模块单元测试
- AddressSanitizer / UBSan / TSan 集成到 CI
- WebConsole React/Vue 重写（如有资源）
- 文档更新：CMake 构建指南、新模块开发指南、迁移说明

**里程碑 M4**：1.3.0 版本发布，向后兼容现有所有项目

### 2.6 团队画像

| 角色 | 人数 |
|------|------|
| Tech Lead | 1 |
| 资深 C++ 工程师 | 2-3 |
| Python 工程师 | 1 |
| 前端工程师（WebConsole） | 1 |
| QA | 1 |

### 2.7 与方案 A/B 的取舍

| 维度 | 方案 C |
|------|--------|
| 周期 | 4-6 月 vs A/B 的 21-28 月 |
| 人月 | 28-46 vs A/B 的 220-390 |
| 内存安全 | 未根本解决（仍是 C++） |
| 长期维护成本 | 仍需要 C++ 高级人才（市场稀缺） |
| 招聘难度 | 高（C++ 服务器开发者稀缺） |
| 风险等级 | 低（增量改进） |

### 2.8 成功标准

- [ ] 所有现有 KBEngine demo 项目零修改运行
- [ ] CMake 一键构建跨 Linux/Windows
- [ ] 核心模块单元测试覆盖率 ≥ 40%
- [ ] CI 在 Sanitizer 模式下 ouroboros demo 无报错
- [ ] Python 3.12 + 新 pybind11 性能不低于原版
- [ ] 文档完备：升级指南、构建指南、测试指南

### 2.9 后续可选演进

完成方案 C 后，仍可在 1-2 年后启动方案 A（Rust 重写），将方案 C 作为"过渡稳定版本"长期维护，新版本作为"下一代"并行开发。这是最稳健的路线。

---

> **决策建议**：当满足以下任一条件，选择本方案：
> 1. 团队 Rust 经验为零，且无法承担 3 月 Phase 0 学习投入
> 2. 业务侧要求 6 个月内交付改进版
> 3. 风险偏好极低，宁可慢一步也要稳一步
> 4. 作为方案 A 的"前置过渡"，2 年后再做大重写
