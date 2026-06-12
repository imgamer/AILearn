# 方案 B：Rust 全量重写 + Lua/Luau (mlua)

> 状态：备选 (★★★☆☆) | 日期：2026-06-09
> 引擎层：Rust | 脚本层：Luau（mlua 嵌入） | 替代对象：KBEngine v1.2.2 C++ 核心 + Python 3.7
>
> **适用场景**：无 Python 历史包袱的新项目；或长期希望脚本层极致轻量（嵌入体积、调用开销）

---

## 一、技术方案

### 1.1 设计目标

| 目标 | 量化指标 |
|------|---------|
| 内存安全 | 同方案 A，引擎层零 UB，unsafe 集中在 FFI |
| 性能 | 脚本调用开销 < 100 ns（Rust↔Lua）；Cellapp ≥ 5000 实体 @ 10 Hz（脚本更轻量带来收益） |
| 嵌入体积 | 单 Cellapp 二进制 < 30 MB（含 Luau runtime ~2 MB） |
| 协议兼容 | 同方案 A，客户端零修改 |
| 脚本迁移 | 提供 Python→Lua 半自动迁移工具，覆盖 70%+ 模板代码 |
| 类型安全 | 所有引擎暴露 API 提供 Luau type definitions (.d.luau) |

### 1.2 与方案 A 的差异点（仅列差异）

| 维度 | 方案 A (pyo3+Python) | 方案 B (mlua+Luau) |
|------|---------------------|---------------------|
| 脚本引擎 | CPython 3.12（嵌入 ~15 MB） | Luau VM（嵌入 ~2 MB） |
| 绑定层 | pyo3 + `#[pyclass]` | mlua + `UserData` trait |
| GIL | 有 GIL（架构上不是瓶颈） | 无 GIL，每 LuaState 独占 |
| 类型 | 可选 Python type hints | Luau 渐进类型（编译期校验） |
| 热加载 | reload 模块 | `LuaState::load` 即可，更轻 |
| 调用开销 | ~200 ns | ~50 ns |
| 调试 | pdb / debugpy | Luau LSP + 内置 debugger |
| 现有项目迁移 | 零迁移 | 100% 重写（提供工具辅助） |

### 1.3 架构总图

与方案 A 完全相同，只把 `kb-script` 内部从 pyo3 换为 mlua：

```
kb-script
├── lua_state.rs      // LuaState 池（每 Cellapp 一个或一池）
├── api/              // KBEngine.* API 绑定
│   ├── entity.rs     // Entity / Mailbox 暴露为 UserData
│   ├── kbengine.rs   // createEntity, globalData, addTimer
│   └── math.rs       // Vec3 / Matrix
├── codegen/          // Python→Lua 迁移工具（独立 binary）
└── types.d.luau      // 自动生成的 Luau 类型定义
```

### 1.4 关键设计决策

**D-1 Luau vs 标准 Lua 5.4**
- 选择 Luau：Roblox 维护，渐进类型系统，沙箱安全，性能 ~2x 标准 Lua
- mlua 已支持 Luau 后端
- 缺点：生态比标准 Lua 小，但 Roblox 加持下足够活跃

**D-2 LuaState 模型**
- 每个 Cellapp 进程一个 LuaState（与 Python 单 GIL 类比）
- 所有 Entity 实例共享 state，通过 `_ENV` 隔离逻辑
- 不使用 multi-state 模式（避免跨 state 调用复杂度）

**D-3 Entity 绑定**
- Rust 侧 `Entity` 实现 `mlua::UserData`，方法通过 `add_method` 注册
- Lua 侧用 metatable 模拟继承：`setmetatable(Avatar, {__index = Entity})`
- 自动生成 `.d.luau` 类型文件，IDE 体验接近 TypeScript

**D-4 Python→Lua 迁移工具**
- 工具名：`kb-py2lua`（独立 CLI）
- 覆盖：class/method/import/常见控制流/KBEngine.* API 1:1 映射
- 不覆盖：装饰器、动态属性、metaclass、yield/async
- 输出注释标记需要人工审查的位置
- 目标：节省 70% 的样板迁移工作

**D-5 热加载策略**
- 开发期：编辑器保存触发 `lua_state.exec(file)`，秒级生效
- 不依赖运行时热更新（仍然 reload 模块 + 重启进程是默认流程）

**D-6 沙箱（可选）**
- Luau 原生支持安全沙箱（禁 io/os/loadstring）
- 生产环境可启用，对 UGC 场景友好

### 1.5 风险登记册

| # | 风险 | 概率 | 影响 | 缓解 |
|---|------|------|------|------|
| R1 | 现有 Python 项目无法快速迁移 | 高 | 极高 | Phase 0 完成 py2lua 工具 PoC；评估真实项目转换率 |
| R2 | 团队无 Lua 经验，培训成本 | 中 | 中 | 1 周培训足够（Lua 极简），Luau 类型系统 2 周熟练 |
| R3 | Luau 生态比 Python 小（HTTP/JSON/解析库） | 中 | 中 | 调用 Rust 侧实现，Lua 只写游戏逻辑 |
| R4 | mlua 在 Windows MSVC 的链接复杂度 | 低 | 低 | vendored 模式预编译 |
| R5 | 调试器体验不如 pdb | 中 | 中 | 集成 Luau LSP + 自研 inspector |

---

## 二、开发计划

### 2.1 总体节奏（相比方案 A 增加约 20-40 人月用于迁移工具与重写）

| Phase | 主题 | 人月 | 团队规模 | 日历 |
|-------|------|------|---------|------|
| 0 | 学习 + 原型 + py2lua PoC | 14-26 | 4-6 | 3 月 |
| 1 | 基础设施 | 40-60 | 8-10 | 5-7 月 |
| 2 | 框架 + mlua 绑定 + 类型生成 | 55-85 | 8-10 | 6-8 月 |
| 3 | 核心组件 | 80-140 | 10-14 | 8-12 月 |
| 4 | 工具链 + SDK + 压测 + 迁移文档 | 50-80 | 6-8 | 5-7 月 |
| **总计** | | **239-391** | | **22-28** |

### 2.2 Phase 0 (3 个月) — 与方案 A 差异

- 月 1：Rust 培训（同 A）+ 第 4 周加入 Luau 速成（2 天）
- 月 2：原型 1 — 网络层（同 A）
- 月 3：原型 2 — mlua Entity 绑定 + **py2lua 工具 PoC**
  - 选择 ouroboros 项目中最复杂的 1 个 Python Entity 类
  - 用 py2lua 工具转换，统计人工修补行数
  - 通过条件：人工修补 ≤ 20% 行
- Go/No-Go：原型通过 + py2lua 转换率达标 → 进入 Phase 1

### 2.3 Phase 1 — 基础设施 (5-7 个月)

与方案 A 完全一致（基础设施无关脚本语言）。

### 2.4 Phase 2 — 框架 + mlua 绑定 (6-8 个月)

| Sprint | 内容 |
|--------|------|
| S1-2 | 组件生命周期 + 服务发现（同 A） |
| S3-4 | 实体定义系统（proc-macro，输出同时支持 Lua 和后续可能的 Python） |
| S5-8 | `kb-db` 三库适配（同 A） |
| S9-12 | `kb-script` mlua 嵌入 + Entity UserData + KBEngine.* API 第一批 |
| S13-14 | Luau 类型定义自动生成（从 entity def 派生 .d.luau） |
| S15-16 | py2lua 工具产品化（CLI + 报表） |

**里程碑 M2'**：能用 Lua 定义 Entity，且 py2lua 能转换一个真实项目的 80% 文件

### 2.5 Phase 3 — 核心组件 (8-12 个月)

与方案 A 内容一致，差异：
- 测试 fixture 用 Lua 重写一份（不能直接复用 ouroboros Python demo）
- Phase 3 末必须完成 ouroboros demo 的完整 Lua 移植版本

### 2.6 Phase 4 — 工具链 + 迁移文档 (5-7 个月)

新增（相对方案 A）：
- **Python→Lua 迁移指南**：30-50 页，覆盖常见模式、陷阱、人工干预清单
- **Luau IDE 配置文档**：VS Code + Luau LSP 配置
- 至少完成 2 个 demo 项目从 Python 到 Lua 的完整迁移并发布

### 2.7 团队画像（差异）

| 角色 | 数量 | 与 A 差异 |
|------|------|----------|
| Lua 工程师 / 迁移工程师 | 2-3 | 新增，负责 py2lua + 文档 + demo 迁移 |
| Python 工程师 | 0-1 | 减少，只在 py2lua 工具初期需要 |

### 2.8 成功标准

- [ ] 所有方案 A 的成功标准
- [ ] py2lua 工具对 3 个真实 KBEngine 项目转换率 ≥ 70%（按行）
- [ ] Luau 类型定义覆盖 100% 暴露 API
- [ ] 至少 1 个外部团队用 Lua 完成 PoC 集成

### 2.9 风险对冲建议

考虑到迁移成本高，建议同时维护一个**最小 Python shim**（基于方案 A 的 pyo3 子集），让无法迁移的关键项目仍有出路。
- 工作量：约 20 人月增量
- 价值：避免"全押 Lua"在迁移失败时无路可退

---

> **决策建议**：仅当满足以下任一条件才选择本方案：
> 1. 项目从零开始，无 Python 历史负担
> 2. 团队偏好 Lua，且能接受现有 KBEngine 生态全部重写
> 3. 对脚本层调用开销极度敏感（如百万级实体 server）
