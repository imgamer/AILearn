# 方案 A：Rust 全量重写 + Python 3.12 (pyo3)

> 状态：推荐 (★★★★★) | 日期：2026-06-09
> 引擎层：Rust | 脚本层：CPython 3.12（pyo3 嵌入） | 替代对象：KBEngine v1.2.2 C++ 核心 + Python 3.7

---

## 一、技术方案

### 1.1 设计目标

| 目标 | 量化指标 |
|------|---------|
| 内存安全 | 引擎层零 use-after-free / data race（编译期保证），unsafe 块 < 5% 且集中在 FFI 边界 |
| 性能 | Cellapp 单进程 ≥ 4000 实体 @ 10 Hz，端到端消息延迟 P99 < 50 ms（与 C++ 持平） |
| 协议兼容 | 现有 Unity/UE4/JS 客户端 SDK 零修改可登录、创建实体、移动同步 |
| 脚本迁移 | 现有 Python 游戏逻辑 90% 接口签名不变，剩余 10% 提供 shim |
| 可观测 | 全链路 OpenTelemetry trace，结构化 JSON 日志，Prometheus metrics 默认开启 |

### 1.2 架构总图

```
                      ┌──────────────────────────────────────┐
                      │     Cargo Workspace (monorepo)       │
                      ├──────────────────────────────────────┤
                      │  kb-core      kb-net      kb-proto  │
                      │  kb-entity    kb-db       kb-nav    │
                      │  kb-script    kb-cluster  kb-tools  │
                      └──────────────────────────────────────┘
                                       │
            ┌──────────────┬───────────┼────────────┬────────────────┐
            ▼              ▼           ▼            ▼                ▼
       Loginapp        Baseapp      Cellapp       Dbmgr         Centermgr
        (binary)       (binary)     (binary)     (binary)        (binary)
            │              │           │            │                │
            └──────────────┴───── tonic gRPC 内网 ──┴────────────────┘
                                       │
                              ┌────────┴─────────┐
                              ▼                  ▼
                       Machine (服务发现)    Logger (集中日志)
```

### 1.3 子系统技术选型

| KBEngine 子系统 | Rust 替代 | 备注 |
|----------------|-----------|------|
| EventDispatcher + epoll | `tokio` 1.x multi-thread runtime | work-stealing scheduler |
| TCP/UDP/KCP/WebSocket | `tokio::net` + `tokio-tungstenite` + `quinn` (QUIC) | QUIC 替代 KCP 作为新协议；旧 KCP 通过 FFI 保留兼容 |
| MemoryStream + DataType | `serde` + `bincode` + 自定义 `PackXZ/PackXYZ` codec | derive macro 替代手写 |
| MySQL/Redis/MongoDB | `sqlx` + `redis-rs` + `mongodb` | 全部 async，sqlx 编译期 SQL 校验 |
| Python 嵌入 | `pyo3` 0.21+ | `#[pyclass]` / `#[pymethods]` 替代 py_macros.h 宏链 |
| Recast/Detour | `bindgen` 自动生成 FFI + safe wrapper crate `kb-nav` | 保留 C 库，封装 safe API |
| 数学库 (g3dlite) | `glam`（默认）+ `nalgebra`（高级用例） | SIMD 加速 |
| log4cxx | `tracing` + `tracing-opentelemetry` + `tracing-subscriber` | 结构化日志 + 分布式追踪 |
| TinyXML 配置 | `serde_xml_rs`（兼容旧 def）+ `ron`（新格式） | 双格式支持 |
| 线程池 | `tokio::task` (IO) + `rayon` (CPU 密集，如导航/AOI) | 明确分工 |
| 进程间通信 | `tonic` (gRPC) 默认 + 关键热路径用自定义 `tokio::codec` | 性能与可维护性权衡 |
| 服务发现 (Machine UDP) | `etcd` 客户端（生产）+ mDNS（开发） | 双模式 |
| 实体模型 | `bevy_ecs`（System+Component）+ Base/Cell 双 Entity 视图 | ECS 替代继承式 ScriptObject→Entity→Proxy |

### 1.4 关键设计决策

**D-1 Base/Cell 双视图 ECS 映射**
- 一个游戏 EntityId 对应两个 ECS Entity：`base_world` 和 `cell_world`
- 跨 Cellapp 的 Ghost 在 `cell_world` 中以 `Ghost` component 标记，只读
- Witness/AOI 由 System 驱动，每 Tick 计算视野内实体集差分

**D-2 Python 边界**
- 每个 EntityApp 进程嵌入一个 Python 解释器（free-threaded 3.13 可选）
- Rust 调用 Python：通过 pyo3 `Python::with_gil` 获取 GIL，调用 Entity 类方法
- Python 调用 Rust：所有 KBE API（如 `KBEngine.createEntity`）通过 `#[pyfunction]` 暴露
- GIL 不是瓶颈：单 Baseapp/Cellapp 主线程串行执行 Python；并发由多进程提供

**D-3 协议兼容层**
- `kb-proto` crate 提供两套编解码：
  - `legacy_v1`：精确字节级兼容 KBEngine 1.2.2 协议（MessageID + Bundle + Stream）
  - `next_v2`：新 protobuf/flatbuffers（可选，Phase 4 引入）
- 客户端通过握手包协商版本，旧 SDK 永远走 v1

**D-4 开发期热加载**
- 不实现运行时热补丁（与 v3.0 结论一致）
- 提供 `kb-dev` CLI：`kb-dev restart cell`、`kb-dev reload-scripts <process>`
- 单进程冷启动 < 3 秒（依赖 Python import 优化和 entity def 缓存）

**D-5 unsafe 政策**
- 仅允许在 `kb-nav`（FFI Recast）、`kb-script`（pyo3 边界）、`kb-proto`（零拷贝 codec）三个 crate 出现
- 每个 `unsafe` 块必须附带 `# Safety` 注释和 miri 测试
- CI 拒绝其他 crate 引入 unsafe（`#![forbid(unsafe_code)]`）

### 1.5 接口契约

**Python 侧（向后兼容）**
```python
# 现有项目代码可直接迁移
class Avatar(KBEngine.Entity):
    def __init__(self):
        KBEngine.Entity.__init__(self)
    def teleport(self, space, pos):
        self.cell.teleport(space.cellId, pos, (0,0,0))
```

**Rust 侧（新增 API）**
```rust
#[pyclass(extends=PyEntity)]
pub struct Avatar { hp: i32 }

#[pymethods]
impl Avatar {
    fn teleport(&self, space: &Space, pos: Vec3) -> PyResult<()> {
        kb_core::teleport(self.id, space.cell_id, pos)
            .map_err(|e| PyRuntimeError::new_err(e.to_string()))
    }
}
```

### 1.6 风险登记册

| # | 风险 | 概率 | 影响 | 缓解 |
|---|------|------|------|------|
| R1 | pyo3 API 表面与 KBEngine.* 差异需要大量 shim | 中 | 高 | Phase 0 完整列出 KBEngine 公开 API；自动生成 shim 表 |
| R2 | tonic gRPC 在 1K+ QPS 下的延迟尾部 | 中 | 中 | 热路径切换到 `kb-net` 自定义 codec，gRPC 仅用于管理面 |
| R3 | Recast FFI 在 Windows 上的链接问题 | 低 | 中 | 预编译静态库 + vendored 模式，CI 双平台 |
| R4 | bevy_ecs 借用规则与跨实体调用冲突 | 中 | 中 | 引入命令缓冲（CommandBuffer），系统结束统一应用 |
| R5 | 团队 Rust 学习曲线超过 Phase 0 预算 | 高 | 高 | Phase 0 末设 Go/No-Go 评审，不能则切方案 C |

---

## 二、开发计划

### 2.1 总体节奏

| Phase | 主题 | 人月 | 团队规模 | 日历 | 退出条件 |
|-------|------|------|---------|------|---------|
| 0 | 学习 + 原型验证 | 12-24 | 4-6 | 3 月 | 完成两个原型 + Go/No-Go 通过 |
| 1 | 基础设施 | 40-60 | 8-10 | 5-7 月 | 收发 KBE v1 协议、结构化日志、CI 绿色 |
| 2 | 服务器框架 + pyo3 绑定 | 50-80 | 8-10 | 6-8 月 | Python 实体类可注册、可连数据库 |
| 3 | 核心组件 | 80-140 | 10-14 | 8-12 月 | Unity 客户端可登录、移动、AOI |
| 4 | 工具链 + SDK + 压测 | 40-70 | 6-8 | 5-7 月 | 达到 C++ 引擎 95% 性能，alpha 发布 |
| **总计** | | **222-374** | | **21-27** | |

### 2.2 Phase 0 — 学习 + 原型 (3 个月)

**月 1：集中培训**
- 全员完成 The Rust Book + Rustlings + 100 Exercises
- 结对编程：每天 2 小时，互换 driver/navigator
- 周五技术分享：所有权 / 借用 / 生命周期 / async / unsafe / FFI（每周一主题）
- 交付物：每人提交 5 个 Rustlings 难题题解 + 1 篇学习总结

**月 2：原型 1 — 网络层**
- 范围：用 tokio 实现一个最小服务端，能解析 KBE 客户端 LoginApp 握手包并返回登录成功
- 验证点：与现有 kbengine.js SDK 完成一次完整握手
- 交付物：`prototype-net/` crate + 集成测试 + 性能基线（QPS）

**月 3：原型 2 — pyo3 Python 绑定**
- 范围：定义 `KBEngine.Entity` 基类，能在 Python 中继承并被 Rust 调用 `__init__/onTimer`
- 验证点：注册一个 `Avatar` 类，触发 100 次/秒 onTimer，无内存泄漏（valgrind）
- 交付物：`prototype-pyo3/` crate + Python 示例 + 文档

**Go/No-Go 评审（月 3 末）**
- 团队能独立完成两个原型 → 进入 Phase 1
- 至少 60% 成员能不查文档写出基础 async 代码 → 通过
- 否则切换到方案 C

### 2.3 Phase 1 — 基础设施 (5-7 个月)

| Sprint (2w) | 内容 | 负责 crate |
|------------|------|-----------|
| S1-2 | Cargo workspace 骨架，rustfmt/clippy/CI 标准，跨平台编译矩阵 | infra |
| S3-4 | `kb-proto` 协议编解码（v1 兼容）+ fuzz 测试 | kb-proto |
| S5-6 | `kb-net` tokio 服务端骨架 + TCP/UDP/WebSocket 多协议 | kb-net |
| S7-8 | KCP FFI 绑定 + QUIC (quinn) 预研 | kb-net |
| S9-10 | `kb-log` tracing + OTLP 输出 + JSON 格式化 | kb-log |
| S11-12 | `kb-cfg` 配置加载（XML/RON 双格式）+ hot reload | kb-cfg |
| S13-14 | 缓冲：协议兼容性回归 + 性能基线 | all |

**里程碑 M1**：用真实 Unity 客户端打开 LoginApp，能完成 SDK 协议握手（不需要进入游戏）

### 2.4 Phase 2 — 框架 + Python 绑定 (6-8 个月)

| Sprint | 内容 |
|--------|------|
| S1-2 | `kb-cluster` 组件生命周期（startup/shutdown/health） |
| S3-4 | 服务发现（etcd + mDNS 双后端） |
| S5-6 | `kb-entity` 实体定义系统（proc-macro 替代 .def XML，但兼容旧 XML） |
| S7-10 | `kb-db` MySQL/Redis/MongoDB 三库适配 + 连接池 + 事务封装 |
| S11-14 | `kb-script` pyo3 嵌入 + KBEngine.* API 第一批（createEntity / globalData / addTimer 等 30 个） |
| S15-16 | Python 3.12 嵌入 + 开发期 reload + Sentry 异常上报 |

**里程碑 M2**：能用纯 Python 定义一个 Entity 类，启动一个伪 Baseapp 进程，从 MySQL 加载该实体并保存回去

### 2.5 Phase 3 — 核心组件 (8-12 个月)

| 子项目 | 人月 | 关键交付 |
|--------|------|---------|
| Loginapp | 8-12 | 账号注册/登录/Token 派发，对接 Interfaces |
| Baseapp | 24-40 | 实体管理、客户端代理（Mailbox）、持久化、Base↔Cell 通信 |
| Cellapp | 28-48 | Space/Cell、AOI/Witness/Ghost、导航、动态分裂（Phase 3.5） |
| Dbmgr | 8-12 | EntityID 分配、GlobalData、跨进程数据一致性 |
| 管理组件 | 12-28 | BaseappMgr/CellappMgr/Machine/Centermgr，负载均衡算法 |

**里程碑 M3**：用现有 KBEngine Demo（如 ouroboros）的 Python 脚本，连接新引擎完成"登录→选角→进入主城→看到其他玩家→移动"完整流程

### 2.6 Phase 4 — 工具链 + 压测 (5-7 个月)

- Logger / Bots / Interfaces / KBCMD（Go 实现也可，因为无状态）
- WebConsole：React + tonic-web，替代 Django Admin
- 客户端 SDK 适配：Unity/UE4/JS 三端 v1 兼容层验证
- 单元测试覆盖率 ≥ 70%，集成测试覆盖核心场景 100%
- 压测：3000 bot 模拟，验证 P99 延迟与吞吐
- 文档：迁移指南、API 参考、运维手册

**里程碑 M4 (Alpha 发布)**：性能达到 C++ 引擎 95%，至少一个外部团队完成 PoC 集成

### 2.7 团队画像

| 角色 | 人数 | 技能要求 |
|------|------|---------|
| Tech Lead | 1 | 5y+ Rust，有游戏服务器或分布式经验 |
| Rust 后端工程师 | 6-10 | 中级 Rust（Phase 0 培训后），熟 tokio |
| Python 工程师 | 2-3 | 熟 KBEngine 现有项目，做绑定层共建 |
| 网络/协议工程师 | 1-2 | 熟 QUIC、KCP、二进制协议设计 |
| QA / 性能 | 2 | 熟性能 profiling、混沌工程 |
| DevOps | 1 | etcd、k8s、Prometheus、CI/CD |

### 2.8 关键依赖与外部输入

- KBEngine 原作者或长期维护者顾问（按需，估 0.2 FTE）
- 一套真实 MMORPG 游戏脚本（用作集成测试 fixture）
- 至少两台 64C/128G 压测服务器
- etcd 集群 + Prometheus + Grafana + Loki（基础设施）

### 2.9 成功标准（Definition of Done）

- [ ] 所有 v1 协议消息字节级兼容，旧客户端可登录
- [ ] 单 Cellapp ≥ 4000 实体 @ 10 Hz，CPU < 80%
- [ ] 端到端延迟 P99 < 50 ms（3000 玩家压测）
- [ ] 24 小时浸泡测试无 panic、无内存增长
- [ ] 任意一个现有 KBEngine demo 项目可零修改迁移
- [ ] 文档完备：迁移指南、API 参考、运维手册、贡献指南

---

> **下一步**：团队评审本方案 → 拿到预算和团队组建批准 → 启动 Phase 0
