# 第 7 篇：异构技术栈项目改造实战（UE5.7 客户端 + slua + bigworld 服务端）

> 本篇回答两个问题：
> 1. **澄清**：`Schema_Ability_DT.csv` 的"结构通用"到底指什么？不同项目的战斗/技能属性不同，怎么算通用？
> 2. **实战**：一个具体场景——UE5.7 只做客户端、嵌入 slua 脚本层、bigworld 服务端、自定义网络协议的 MMORPG，如何改造 `ue57-gamepiece-designer`？
>
> 这是本系列最复杂的一篇，因为涉及**异构技术栈**（C++ 客户端 + Lua 脚本 + Python 服务端 + 自定义协议），改造幅度远超第 6 篇的通用原则。
>
> 阅读建议：先读第 1 章澄清 Schema 歧义，再带着你的项目情况对照第 2-6 章逐步改造。

---

## 1. 澄清：Schema_Ability_DT.csv 的"通用性"到底指什么

### 1.1 我之前说法的歧义

在第 6 篇 Step 5 我说过：

> **保留通用模板**：蓝图配方骨架、DataTable schema 这两个跨项目通用，不要动。

这句话有歧义。"通用"指的是**形式**，不是**内容**。下面拆开讲。

### 1.2 Schema 的两层结构

`Schema_Ability_DT.csv` 包含两层：

```
┌─────────────────────────────────────────────────┐
│  形式层（通用）                                  │
│  ─────────                                       │
│  • CSV 格式（UE DataTable 原生支持）             │
│  • 第一行字段名 + 后续数据行的结构               │
│  • Tab 分隔                                      │
│  • 字段名 PascalCase（UE 风格）                  │
│  • bool 用 TRUE/FALSE 全大写                     │
│  • 数值字段带单位（如 GCDSeconds）               │
│  ↓ 这些是"形式约定"，跨项目通用                  │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  内容层（项目特异）                              │
│  ─────────                                       │
│  • 具体字段名（AbilityId / School / GCDSeconds） │
│  • 字段数量（14 个）                             │
│  • 字段含义（RequiresLOS / CanMoveWhileCasting） │
│  • 示例数据（FIREBALL / HEAL / MELEE_SWING）     │
│  ↓ 这些是作者为"某种 RPG"做的具体填充            │
└─────────────────────────────────────────────────┘
```

**所以"通用"指的是**：CSV 格式 + 字段表 + 示例数据**这种形式**是通用的模板写法。
**不是指**：FIREBALL / HEAL / 14 个字段 / RequiresLOS 这些**具体内容**通用。

### 1.3 不同项目的 Schema 必然不同

你的质疑完全正确。不同项目的战斗/技能属性当然不同：

| 项目类型 | 典型字段差异 |
|---|---|
| 动作 RPG | 连招段数、霸体值、硬直帧 |
| 回合制 RPG | MP 消耗、元素克制、命中率 |
| MOBA | GCD、Silence/Slow 状态、装备加成 |
| MMORPG（你的） | 服务端权威字段、客户端缓存字段、协议 ID |
| 卡牌游戏 | 费用、稀有度、卡组限制 |

所以改造时，**Schema 的内容层必须改**，形式层（CSV 格式、字段表结构、示例数据组织方式）可以保留。

### 1.4 修正第 6 篇的说法

第 6 篇 Step 5 应该更精确地说：

> **保留形式层**：CSV 格式、字段表 + 示例数据的组织方式、PascalCase 命名约定。
> **替换内容层**：具体字段名、字段数量、示例数据，必须按你项目的战斗属性重新定义。

本篇第 4 章会演示如何为你的 MMORPG 重新设计 Schema 的内容层。

---

## 2. 异构项目画像：UE5.7 + slua + bigworld

### 2.1 你的项目技术栈

```
┌─────────────────────────────────────────────────────────────┐
│  客户端                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  UE5.7（C++ 引擎）                                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  slua（Lua 脚本层）                            │  │   │
│  │  │  • 客户端业务逻辑（技能触发、UI 交互、状态机） │  │   │
│  │  │  • 调用 UE C++ API（通过 slua 绑定）           │  │   │
│  │  │  • 处理服务端消息                              │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  UE 层只做：渲染、UI、特效、输入、资源管理         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
                  自定义网络协议
                          ↕
┌─────────────────────────────────────────────────────────────┐
│  服务端                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  bigworld Technology                                 │   │
│  │  • Python 服务端逻辑（权威）                         │   │
│  │  • Entity / Cell / Base 架构                         │   │
│  │  • 处理所有战斗判定、状态、同步                       │   │
│  │  • 维护游戏世界状态                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 这个技术栈的核心特征

| 特征 | 含义 | 对 skill 改造的影响 |
|---|---|---|
| **UE 只做客户端** | UE 不做服务器、不做 replication | 删除所有 Replication Notes，改成"协议设计" |
| **slua 脚本层** | 客户端逻辑用 Lua 写，不用蓝图或 C++ | 蓝图配方 → Lua 脚本配方 |
| **bigworld 服务端** | Python 写服务端逻辑，有 entity 架构 | 加"服务端 Python 逻辑"产物 |
| **自定义协议** | 不用 UE 内置网络，自己定义消息格式 | 加"协议消息定义"产物 |
| **异构分层** | 客户端/服务端/协议三层分立 | Output format 要按"层"组织 |

### 2.3 与原版 skill 的根本冲突

原版 `ue57-gamepiece-designer` 的所有假设都基于"UE 单体架构"：

| 原版假设 | 你的项目实际 | 冲突程度 |
|---|---|---|
| UE 做服务器和客户端 | UE 只做客户端 | 🔴 严重冲突 |
| 蓝图是主逻辑层 | slua 才是主逻辑层，蓝图只做 UI | 🔴 严重冲突 |
| UE replication 同步状态 | bigworld 自定义协议同步 | 🔴 严重冲突 |
| Server RPC / Client RPC | 自定义协议消息 | 🔴 严重冲突 |
| 测试 PIE + Dedicated Server | 测试要起 bigworld + 多客户端 | 🟡 中度冲突 |
| DataTable 存战斗数据 | 数据可能分服务端权威 + 客户端缓存两份 | 🟡 中度冲突 |

**结论**：这不是"改填充"能解决的，需要**重构输出结构**。但通用骨架（When-Then 触发、Safety 安全规则、6 段编号结构）仍然保留。

---

## 3. 改造方案：异构项目的 7 大改动

下面按改动顺序逐一讲解。每项给"做什么 / 怎么做 / 为什么"。

### 3.1 改动 1：description 重写

**原版**：
```yaml
description: Designs UE5.7 multiplayer-friendly game pieces (Blueprint node chains, data schemas, asset naming, and test checklists). Text-only, no scripts.
```

**改造后**：
```yaml
description: Designs MMORPG game pieces for heterogeneous stack (UE5.7 client + slua Lua + bigworld Python server + custom protocol). Produces Lua scripts, UE Blueprint recipes, server Python logic, protocol definitions, and test checklists. Text-only, no scripts.
```

**为什么**：
- 明确写出**异构技术栈四要素**：UE5.7 client / slua / bigworld / custom protocol
- 产物从"Blueprint chains"扩展为四类：Lua / Blueprint / Python / Protocol
- 触发关键词覆盖：MMORPG、slua、bigworld、Lua、Python server

### 3.2 改动 2：What 段重写产物清单

**原版 5 个产物**：
- Blueprint node chain recipes
- DataTable / DataAsset schemas
- Asset / folder plan
- Multiplayer sanity: server/client responsibility, replication notes
- Test checklist

**改造后 6 个产物**（按异构分层）：
```markdown
## What this skill does
When the user asks for an MMORPG game piece or system, produce a structured design
ready to implement across the heterogeneous stack (UE5.7 client + slua + bigworld server):

- **Client Lua logic** (slua scripts: state machines, input handling, message dispatch)
- **UE Blueprint layer** (UI binding, VFX spawning, animation triggers — thin layer only)
- **Server Python logic** (bigworld entity methods, combat resolution, state authority)
- **Network protocol** (custom message definitions, field layout, request/response pairs)
- **Data schemas** (client-side DataTable for display + server-side config tables)
- **Test checklist** (single client, bigworld + multi-client, protocol mock, weak network)
```

**为什么**：
- 产物按**技术层**组织：客户端 Lua / UE 表现层 / 服务端 Python / 协议层 / 数据层 / 测试
- 每个产物明确写**哪层负责什么**，避免逻辑写错层（比如战斗判定不能写客户端）
- 数据 schema 拆成"客户端显示用 + 服务端权威"两份，反映异构项目的数据分布

### 3.3 改动 3：Output format 重构 Implementation 段

这是最大的改动。原版的 Implementation 段假设"全在 UE 蓝图里实现"，异构项目要按层拆分。

**原版 Output format**：
```markdown
5) **Implementation**
   - **Blueprint Recipe** (step-by-step)
   - **Replication Notes** (Server vs Client, replicated vars, RPCs)
   - **Assets / Naming / Folders**
```

**改造后 Output format**：
```markdown
5) **Implementation**
   - **Layer Responsibility** (which layer owns what: UE / slua / bigworld / protocol)
   - **Client Lua Recipe** (slua script: state machine, input, message handling)
   - **UE Blueprint Layer** (UI binding, VFX, animation — thin layer)
   - **Server Python Recipe** (bigworld entity methods, combat logic, authority)
   - **Protocol Definition** (message IDs, fields, request/response, reliability)
   - **Data Schemas** (client DataTable + server config table)
   - **Assets / Naming / Folders**
```

**为什么**：
- **Layer Responsibility 子段是关键新增**：异构项目最容易出的问题是"逻辑写错层"（比如客户端做了权威判定）。这个子段强制先划分职责，再写实现。
- **4 个实现子段对应 4 层**：Lua / Blueprint / Python / Protocol。每层独立配方，职责清晰。
- **Data Schemas 拆成两份**：客户端 DataTable（显示用）+ 服务端配置表（权威用），反映数据分布的真实情况。
- **删除 Replication Notes**：UE 不做 replication，bigworld 用自定义协议，这个子段完全无用。

### 3.4 改动 4：UE naming 段扩展为多技术栈命名

**原版**只有 UE 资产命名。异构项目要加 slua 和 bigworld 的命名规范。

**改造后**：
```markdown
## Naming + folders (default)

### UE assets (client-side only)
- Root: `/Game/Client/<SystemName>/`
- Blueprints (UI only): `WBP_<Thing>` (Widget Blueprints)
- Materials: `M_<Thing>`
- Niagara Systems: `NS_<Effect>`
- Textures: `T_<Thing>`
- DataTables (display cache): `DT_<Thing>_ClientCache`

### slua Lua scripts (client business logic)
- Root: `Script/Client/<SystemName>/`
- Main logic: `<SystemName>Logic.lua` (e.g., `AbilityLogic.lua`)
- State machine: `<SystemName>FSM.lua`
- Message handler: `<SystemName>MsgHandler.lua`
- Config: `<SystemName>Config.lua`

### bigworld Python (server authority)
- Root: `server/scripts/<SystemName>/`
- Entity methods: `<EntityName>_abilities.py`
- Cell logic: `<EntityName>_cell.py`
- Base logic: `<EntityName>_base.py`
- Config: `<SystemName>_config.py`

### Network protocol
- Message ID enum: `MSG_<SystemName>_<Action>` (e.g., `MSG_ABILITY_CAST`)
- Request message: `Req< SystemName><Action>` (e.g., `ReqAbilityCast`)
- Response message: `Ack<SystemName><Action>` (e.g., `AckAbilityCast`)
- Notify message: `Ntf<SystemName><Action>` (e.g., `NtfAbilityResult`)
```

**为什么**：
- **4 套命名规范对应 4 层**：UE / slua / bigworld / protocol，每层有自己的命名习惯
- **UE 资产限定"客户端"**：明确 UE 不做服务端，避免误把服务端逻辑塞进 UE
- **Lua 命名按职责分文件**：Logic / FSM / MsgHandler / Config，避免单文件膨胀
- **协议命名用 Req/Ack/Ntf 前缀**：这是网络协议的通用约定，区分请求/响应/通知

### 3.5 改动 5：Multiplayer defaults → Heterogeneous defaults

原版的 Multiplayer defaults 假设"UE 服务器权威"。异构项目要改成"bigworld 权威 + 协议同步"。

**原版**：
```markdown
## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**改造后**：
```markdown
## Heterogeneous stack defaults (unless user says otherwise)

### Authority model
- bigworld server is authoritative for ALL combat/state decisions
- slua client only sends intent (via protocol), never resolves combat locally
- UE Blueprint layer is display-only: receives state from slua, renders it

### Performance (MMORPG 100+ concurrent)
- Max protocol messages per frame: 50 (client) / 500 (server)
- Lua GC budget: <2ms per frame
- UE tick: disabled for game logic, only for UI/VFX
- Entity culling: server sends state only for entities within 80m radius

### Protocol design
- Reliable: combat results, loot, level-up (must arrive)
- Unreliable: movement, cosmetic VFX (can drop)
- Batch: stack small messages (e.g., 10 HP deltas in one message)

### Layer separation (non-negotiable)
- ❌ Never put combat math in slua (client can be hacked)
- ❌ Never put authority logic in UE Blueprint
- ❌ Never let client directly modify server state
- ✅ Client predicts UI feedback, server confirms via Ack
```

**为什么**：
- **Authority model 段明确三层职责**：bigworld 权威 / slua 发意图 / UE 只显示
- **Performance 段用量化指标**：50 msg/帧、2ms GC、80m 半径，给 Claude 锚点
- **Protocol design 段定义可靠性**：哪些消息必须送达，哪些可丢
- **Layer separation 段用反例**：❌ 列出禁止的跨层操作，比正面规则更有效

### 3.6 改动 6：Templates 重构（3 个新模板）

原版 3 个模板（BlueprintRecipe / Checklist_Networking / Schema_Ability_DT）都是 UE 单体假设。异构项目要重构。

#### 模板 A：`Templates/LayeredImplementation_Template.md`（替代 BlueprintRecipe）

```markdown
# Layered Implementation Template (Heterogeneous Stack)

## Layer Responsibility
| Layer | Owns | Does NOT do |
|---|---|---|
| UE Blueprint | UI binding, VFX spawn, animation | Combat math, state authority |
| slua Lua | Client state machine, input, msg dispatch | Combat resolution, authority |
| bigworld Python | Combat resolution, state authority, sync | Rendering, UI |
| Protocol | Message format, field layout | Business logic |

## Client Lua Recipe (slua)
1. Input: <IA_xxx triggered>
2. State: check <CurrentState> allows <action>
3. Send: <ReqXxx> message to server
4. Predict: <optimistic UI feedback>
5. On Ack: <apply confirmed result>
6. On Ntf: <handle server-pushed event>

## UE Blueprint Layer (thin)
1. Event: <slua calls UE via binding>
2. Spawn: <NS_xxx> at <location>
3. Play: <Animation Montage>
4. Update: <WBP_xxx> from slua data

## Server Python Recipe (bigworld)
1. Entity method: <self.<method>>(args)
2. Validate: <range / LOS / cooldown / cost>
3. Resolve: <damage / heal / state change>
4. Apply: <modify entity properties>
5. Broadcast: <NtfXxx> to relevant clients

## Protocol Definition
- Msg ID: MSG_<SYSTEM>_<ACTION> = <0xXXXX>
- Direction: <Client→Server / Server→Client / Server→All>
- Reliable: <Yes/No>
- Fields:
  - <field1>: <type> - <purpose>
  - <field2>: <type> - <purpose>

## Data Schemas
### Client DataTable (display cache)
<CSV format, fields for UI display only>

### Server config table (authority)
<Python dict / XML / custom format, fields for combat logic>
```

#### 模板 B：`Templates/Checklist_Protocol.md`（替代 Checklist_Networking）

```markdown
# Protocol & Layer Checklist (Heterogeneous Stack)

## Layer Separation
- [ ] Combat math only in bigworld Python (not in slua or UE)
- [ ] Authority state only modified by server
- [ ] UE Blueprint only does rendering/UI (no game logic)
- [ ] slua sends intent, never resolves combat

## Protocol Design
- [ ] Every request has a corresponding Ack
- [ ] Combat results use Reliable messages
- [ ] Cosmetic VFX use Unreliable messages
- [ ] Message IDs are unique across system
- [ ] Fields have explicit types (no dynamic typing)

## Data Synchronization
- [ ] Client cache validated against server on Ack
- [ ] Server pushes Ntf for state changes client didn't request
- [ ] Reconnect: client re-requests full state snapshot
- [ ] No client-side prediction of combat outcome (UI feedback only)

## Testing
- [ ] Single client: input → server → Ack → UI update
- [ ] bigworld + 2 clients: both see same combat result
- [ ] Protocol mock: test client without real server
- [ ] Weak network (300ms): no desync, no stuck state
- [ ] 100 clients stress: server frame < 50ms
- [ ] Reconnect: state restored correctly
- [ ] Client hack: modified slua cannot affect server authority
```

#### 模板 C：`Templates/Schema_Ability_Heterogeneous.md`（替代 Schema_Ability_DT.csv）

这是关键改造——拆成客户端和服务端两份 schema。详见第 4 章。

### 3.7 改动 7：Test Checklist 重写

原版测试场景（PIE / Dedicated Server / Latency）完全不适用。异构项目测试场景：

```markdown
## Test scenarios (replace original Test Checklist)

1. **Single client + mock server**
   - slua 发 Req → mock 返回 Ack → UI 正确反馈
   - 验证客户端预测与服务器确认一致

2. **bigworld + 2 real clients**
   - 客户端 1 施放技能 → 客户端 2 看到相同结果
   - 服务器日志显示权威判定
   - 两个客户端的 UI 显示一致

3. **Protocol mock (no server)**
   - 用 mock 协议层测试 slua 逻辑
   - 验证消息序列正确

4. **Weak network (300ms latency, 5% packet loss)**
   - 战斗结果最终一致（Reliable 消息重传）
   - 移动表现平滑（Unreliable 消息插值）
   - 无卡死状态

5. **100 clients stress test**
   - 服务器帧时间 < 50ms
   - 客户端帧率 ≥ 30fps
   - 协议带宽 < 100KB/s per client

6. **Reconnect test**
   - 断线 10 秒后重连
   - 客户端状态与服务端同步
   - 无重复或丢失的状态

7. **Security test (anti-cheat)**
   - 修改 slua 本地文件 → 服务器拒绝非法请求
   - 篡改协议消息 → 服务器校验字段类型
   - 客户端无法直接修改服务器状态
```

---

## 4. Schema 改造详解：客户端 + 服务端双 schema

这是你质疑的核心，详细讲。

### 4.1 为什么异构项目要拆成两份 Schema

在 UE 单体项目里，一份 DataTable 就够——服务器和客户端共用 UE 的 replication。

但在你的异构项目里：
- **服务端**（bigworld Python）需要**完整的战斗属性**用于权威判定
- **客户端**（slua + UE）只需要**显示用的属性**子集

如果把完整数据给客户端，会有两个问题：
1. **安全风险**：客户端能看到伤害公式、暴击率等，容易被逆向后作弊
2. **同步成本**：每次服务端改字段，客户端也要同步更新，维护成本高

所以拆成两份：
- **服务端 schema**：完整字段，权威数据，bigworld Python 读取
- **客户端 schema**：显示子集，缓存数据，UE DataTable + slua 读取

### 4.2 服务端 Schema（bigworld Python 配置）

```python
# server/scripts/Ability/ability_config.py

# 服务端权威配置：完整战斗属性
# 格式：Python dict，bigworld 启动时加载

ABILITY_CONFIG = {
    "FIREBALL": {
        # === 基础信息（客户端也有） ===
        "display_name": "火球术",
        "ability_type": "Damage",
        "school": "Fire",
        "icon_id": "icon_fireball",

        # === 战斗属性（仅服务端，客户端不可见） ===
        "damage_base": 150,              # 基础伤害
        "damage_coefficient": 1.2,       # 法术强度系数
        "crit_rate": 0.15,               # 暴击率
        "crit_multiplier": 1.5,          # 暴击倍率
        "damage_variance": 0.1,          # 伤害浮动 ±10%

        # === 限制条件 ===
        "range_max": 3000,               # 最大射程（UE 单位 cm）
        "range_min": 0,
        "requires_los": True,            # 需要视线
        "requires_target": True,         # 需要目标
        "forbidden_states": ["Stunned", "Silenced"],  # 禁用状态

        # === 资源消耗 ===
        "cost_type": "Mana",
        "cost_base": 20,
        "cost_coefficient": 0.5,         # 等级消耗系数

        # === 冷却 ===
        "cooldown_base": 8.0,            # 基础冷却（秒）
        "cooldown_category": "FIRE",     # 共享冷却组
        "gcd": 1.5,                      # 公共冷却

        # === 施法 ===
        "cast_time": 2.0,
        "can_move_while_casting": False,
        "can_cancel_cast": True,

        # === 效果链（服务端处理） ===
        "on_cast_complete": [
            {"type": "spawn_projectile", "projectile_id": "PROJ_FIREBALL"},
            {"type": "play_vfx", "vfx_id": "NS_Fireball_Cast", "target": "caster"}
        ],
        "on_hit": [
            {"type": "apply_damage", "formula": "spell_damage"},
            {"type": "apply_status", "status": "Burning", "duration": 3, "stacks": 1},
            {"type": "play_vfx", "vfx_id": "NS_Fireball_Impact", "target": "impact_point"}
        ],

        # === 协议 ===
        "msg_id_cast": 0x1001,
        "msg_id_result": 0x1002,
    },

    "HEAL": {
        # ... 类似结构，治疗类
    },
}
```

**设计要点**：
- **完整战斗公式**：`damage_coefficient`、`crit_rate` 等敏感字段只在服务端
- **效果链**：`on_cast_complete` / `on_hit` 是服务端触发的事件序列，客户端只接收通知
- **协议 ID**：`msg_id_cast` / `msg_id_result` 关联协议层
- **Python dict 格式**：bigworld 原生支持，启动时加载

### 4.3 客户端 Schema（UE DataTable + slua）

```csv
# /Game/Client/Ability/DT_Ability_ClientCache.csv
# 客户端缓存：仅显示用属性，无战斗公式
AbilityId	DisplayName	AbilityType	School	IconId	CastTime	CanMoveWhileCast	Cooldown	GCD	RangeMax	TooltipText
FIREBALL	火球术	Damage	Fire	icon_fireball	2	FALSE	8	1.5	30	向目标发射火球，造成火焰伤害
HEAL	治疗术	Heal	Holy	icon_heal	2	FALSE	6	1.5	40	治疗友方目标
MELEE_SWING	近战挥砍	Damage	Physical	icon_swing	0	TRUE	0	1.5	3	基础近战攻击
```

**对比服务端 schema，客户端缺什么**：
- ❌ `damage_base` / `damage_coefficient`（伤害公式）
- ❌ `crit_rate` / `crit_multiplier`（暴击）
- ❌ `on_cast_complete` / `on_hit`（效果链）
- ❌ `cost_coefficient`（消耗公式）
- ❌ `forbidden_states`（状态限制，服务端检查）

客户端只有：
- ✅ `DisplayName` / `IconId`（UI 显示）
- ✅ `CastTime` / `CanMoveWhileCast`（施法表现）
- ✅ `Cooldown` / `GCD`（UI 冷却环）
- ✅ `RangeMax`（瞄准辅助显示）
- ✅ `TooltipText`（鼠标提示）

**为什么这样拆**：
- **防作弊**：客户端看不到伤害公式，无法预测伤害
- **省同步**：服务端改战斗数值，客户端 schema 不用动
- **显示够用**：UI 所需的字段都在客户端 schema 里

### 4.4 slua 端的配置补充

slua 还需要一份"客户端行为配置"，不属于战斗属性但属于技能行为：

```lua
-- Script/Client/Ability/AbilityConfig.lua

-- slua 客户端行为配置：UI 反馈、预测、动画
AbilityConfig = {
    FIREBALL = {
        -- === UI 反馈 ===
        cast_bar_color = {r=255, g=100, b=0},
        cooldown_icon = "icon_cd_fire",

        -- === 客户端预测（非权威） ===
        predict_cast_flash = true,        -- 施法瞬间闪光（乐观反馈）
        predict_projectile_spawn = false, -- 不预测 projectile（等服务端确认）

        -- === 动画/特效 ===
        cast_animation = "AM_CastSpell_TwoHand",
        cast_vfx = "NS_Fireball_Cast_Hand",

        -- === 音效 ===
        cast_sound = "Cue_Fireball_Cast",
        impact_sound = "Cue_Fireball_Impact",

        -- === 输入 ===
        input_action = "IA_CastAbility_1",
        targeting_mode = "GroundLocation", -- 瞄准模式
    },
}
```

**为什么 slua 也要一份**：
- UE DataTable 不方便存"行为配置"（如颜色、动画名、音效）
- slua 配置可以热更新（Lua 不用编译），适合调表现
- 与服务端配置分离，客户端表现调整不影响服务端逻辑

### 4.5 三份 Schema 的职责对照

```
┌─────────────────────────────────────────────────────────────┐
│  服务端 ability_config.py (bigworld Python)                │
│  ─────────────────────────────                              │
│  • 战斗公式（damage/crit/cost）                             │
│  • 效果链（on_cast_complete/on_hit）                        │
│  • 状态限制（forbidden_states）                             │
│  • 协议 ID（msg_id_*）                                      │
│  ↓ 权威数据，决定游戏逻辑                                   │
└─────────────────────────────────────────────────────────────┘
                          ↕ 协议同步
┌─────────────────────────────────────────────────────────────┐
│  客户端 DT_Ability_ClientCache.csv (UE DataTable)           │
│  ─────────────────────────────                              │
│  • 显示信息（name/icon/tooltip）                            │
│  • UI 计时（cast_time/cooldown/gcd）                        │
│  • 瞄准辅助（range_max）                                    │
│  ↓ 显示数据，UI 用                                          │
└─────────────────────────────────────────────────────────────┘
                          ↕ slua 读取
┌─────────────────────────────────────────────────────────────┐
│  slua AbilityConfig.lua (Lua 配置)                          │
│  ─────────────────────────────                              │
│  • 行为配置（animation/vfx/sound）                          │
│  • 客户端预测（predict_*）                                  │
│  • UI 样式（cast_bar_color/cooldown_icon）                  │
│  • 输入映射（input_action/targeting_mode）                  │
│  ↓ 表现数据，客户端行为用                                    │
└─────────────────────────────────────────────────────────────┘
```

**三份 schema 的数据流**：
1. 服务端配置定义"技能是什么"（战斗属性）
2. 客户端 DataTable 缓存"技能显示什么"（UI 信息）
3. slua 配置定义"技能怎么表现"（动画/特效/输入）

每次新增技能，三份都要加一行/一项。skill 输出时要同时产出三份。

---

## 5. 完整 SKILL.md（改造后全文）

下面是改造后的完整 SKILL.md，把上面 7 项改动整合：

```markdown
---
name: mmorpg-heterogeneous-gamepiece-designer
description: Designs MMORPG game pieces for heterogeneous stack (UE5.7 client + slua Lua + bigworld Python server + custom protocol). Produces Lua scripts, UE Blueprint recipes, server Python logic, protocol definitions, and test checklists. Text-only, no scripts.
---

# MMORPG Heterogeneous Gamepiece Designer (Text-Only)

## What this skill does
When the user asks for an MMORPG game piece or system, produce a structured design
ready to implement across the heterogeneous stack (UE5.7 client + slua + bigworld server):

- **Client Lua logic** (slua scripts: state machines, input handling, message dispatch)
- **UE Blueprint layer** (UI binding, VFX spawning, animation triggers — thin layer only)
- **Server Python logic** (bigworld entity methods, combat resolution, state authority)
- **Network protocol** (custom message definitions, field layout, request/response pairs)
- **Data schemas** (client-side DataTable for display + server-side config tables)
- **Test checklist** (single client, bigworld + multi-client, protocol mock, weak network)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (trigger event, target, system constraints)
3) **Outputs** (Lua scripts, UE assets, Python modules, protocol msgs)
4) **Assumptions**
5) **Implementation**
   - **Layer Responsibility** (which layer owns what; refer to Templates/LayeredImplementation_Template.md)
   - **Client Lua Recipe** (slua: state machine, input, message handling)
   - **UE Blueprint Layer** (UI binding, VFX, animation — thin)
   - **Server Python Recipe** (bigworld: entity methods, combat, authority)
   - **Protocol Definition** (msg IDs, fields, request/response, reliability)
   - **Data Schemas** (client DataTable + server Python config + slua Lua config)
   - **Assets / Naming / Folders**
6) **Test Checklist** (refer to Templates/Checklist_Protocol.md)

> **参考范例**：生成前先读 `examples/fireball-spell.md`（典型法术）和
> `examples/loot-drop.md`（拾取系统），对照其分层深度和协议细节。

## Naming + folders (default)

### UE assets (client-side only)
- Root: `/Game/Client/<SystemName>/`
- Widget Blueprints: `WBP_<Thing>`
- Materials: `M_<Thing>`
- Niagara Systems: `NS_<Effect>`
- Textures: `T_<Thing>`
- DataTables (display cache): `DT_<Thing>_ClientCache`

### slua Lua scripts (client business logic)
- Root: `Script/Client/<SystemName>/`
- Main logic: `<SystemName>Logic.lua`
- State machine: `<SystemName>FSM.lua`
- Message handler: `<SystemName>MsgHandler.lua`
- Config: `<SystemName>Config.lua`

### bigworld Python (server authority)
- Root: `server/scripts/<SystemName>/`
- Entity methods: `<EntityName>_abilities.py`
- Cell logic: `<EntityName>_cell.py`
- Base logic: `<EntityName>_base.py`
- Config: `<SystemName>_config.py`

### Network protocol
- Message ID enum: `MSG_<SystemName>_<Action>`
- Request message: `Req<SystemName><Action>`
- Response message: `Ack<SystemName><Action>`
- Notify message: `Ntf<SystemName><Action>`

## Heterogeneous stack defaults (unless user says otherwise)

### Authority model
- bigworld server is authoritative for ALL combat/state decisions
- slua client only sends intent (via protocol), never resolves combat locally
- UE Blueprint layer is display-only: receives state from slua, renders it

### Performance (MMORPG 100+ concurrent)
- Max protocol messages per frame: 50 (client) / 500 (server)
- Lua GC budget: <2ms per frame
- UE tick: disabled for game logic, only for UI/VFX
- Entity culling: server sends state only for entities within 80m radius

### Protocol design
- Reliable: combat results, loot, level-up (must arrive)
- Unreliable: movement, cosmetic VFX (can drop)
- Batch: stack small messages (e.g., 10 HP deltas in one message)

### Layer separation (non-negotiable)
- ❌ Never put combat math in slua (client can be hacked)
- ❌ Never put authority logic in UE Blueprint
- ❌ Never let client directly modify server state
- ✅ Client predicts UI feedback only, server confirms via Ack
```

---

## 6. 范例：examples/fireball-spell.md

为了让你看到改造后 skill 的输出长什么样，给一个完整范例（火球术技能）：

```markdown
# Example: Fireball Spell (Heterogeneous Stack)

> 用户输入："设计一个火球术技能，向目标发射火球造成火焰伤害，
> 100 人 MMORPG，UE5.7+slua+bigworld 技术栈"

## 1) Goal
设计火球术技能：玩家选中目标施法 → 客户端发协议 → 服务端判定伤害 →
通知所有相关客户端 → 各端播放表现。

## 2) Inputs
- 玩家输入：IA_CastAbility_1（数字键 1）
- 目标：选中的敌方 entity（bigworld entity ID）
- 配置：服务端 ability_config.py 的 FIREBALL 行
- 协议：MSG_ABILITY_CAST / MSG_ABILITY_RESULT

## 3) Outputs
- slua: AbilityLogic.lua（施法逻辑）、AbilityMsgHandler.lua（消息处理）
- UE: WBP_CastBar（施法条）、NS_Fireball_Cast/Impact（特效）
- bigworld: Player_abilities.py（服务端方法）、ability_config.py（配置）
- Protocol: ReqAbilityCast / AckAbilityResult / NtfAbilityResult
- Data: DT_Ability_ClientCache.csv（客户端缓存）、AbilityConfig.lua（slua 配置）

## 4) Assumptions
- 假设 UE5.7 + slua + bigworld 已集成
- 假设 100 人同屏，80m 半径 relevancy
- 假设玩家已有 TargetComponent（选中目标）
- 假设协议层已封装 send/recv 接口
- 假设 GCD 系统已存在（本设计不实现 GCD）

> 如以上假设不成立，请明确告知，会调整设计。

## 5) Implementation

### Layer Responsibility

| Layer | Owns | Does NOT do |
|---|---|---|
| UE Blueprint | 施法条 UI、火球特效播放、动画 | 伤害计算、目标选择判定 |
| slua Lua | 输入处理、状态机、发协议、收消息分发 | 伤害计算、权威判定 |
| bigworld Python | 伤害计算、暴击判定、状态修改、广播结果 | 渲染、UI |
| Protocol | 消息格式定义、字段布局 | 业务逻辑 |

### Client Lua Recipe (slua)

**AbilityLogic.lua（施法逻辑）：**
```lua
-- 状态机：Idle → Casting → WaitingResult → Cooldown → Idle
local AbilityLogic = {}

function AbilityLogic:TryCast(abilityId, targetEntityId)
    -- 1. 状态检查
    if self.currentState ~= "Idle" then return false end
    if not TargetComponent:IsValidTarget(targetEntityId) then return false end

    -- 2. 乐观 UI 反馈（预测，非权威）
    self.currentState = "Casting"
    self.castStartTime = os.clock()
    UIManager:ShowCastBar(abilityId, self:GetCastTime(abilityId))
    AnimationManager:PlayMontage("AM_CastSpell_TwoHand")

    -- 3. 发协议请求
    local msg = Protocol.CreateReqAbilityCast({
        ability_id = abilityId,
        target_entity_id = targetEntityId,
        client_timestamp = os.clock()
    })
    Protocol.Send(msg, Reliability.Reliable)

    -- 4. 设置施法完成定时器
    TimerManager:SetTimer(self:GetCastTime(abilityId), function()
        self:OnCastComplete(abilityId)
    end)

    return true
end

function AbilityLogic:OnCastComplete(abilityId)
    self.currentState = "WaitingResult"
    -- 不本地预测伤害，等服务端 Ack
end

function AbilityLogic:OnRecvAckAbilityResult(msg)
    -- 5. 收到服务端确认
    if msg.success then
        self.currentState = "Cooldown"
        TimerManager:SetTimer(msg.cooldown, function()
            self.currentState = "Idle"
        end)
        UIManager:HideCastBar()
        UIManager:ShowCooldown(msg.ability_id, msg.cooldown)
    else
        -- 服务端拒绝（超出范围/蓝量不足等）
        self.currentState = "Idle"
        UIManager:HideCastBar()
        UIManager:ShowError(msg.fail_reason)
    end
end

function AbilityLogic:OnRecvNtfAbilityResult(msg)
    -- 6. 收到他人施法结果通知
    VFXManager:SpawnAt("NS_Fireball_Impact", msg.impact_location)
    -- 更新目标血条（通过 slua 数据绑定）
    EntityManager:UpdateEntityHealth(msg.target_entity_id, msg.new_health)
end

return AbilityLogic
```

**AbilityMsgHandler.lua（消息分发）：**
```lua
local AbilityMsgHandler = {}

function AbilityMsgHandler:Init()
    Protocol.RegisterHandler(MSG_ABILITY_RESULT_ACK, self.OnAckAbilityResult)
    Protocol.RegisterHandler(MSG_ABILITY_RESULT_NTF, self.OnNtfAbilityResult)
end

function AbilityMsgHandler:OnAckAbilityResult(msg)
    AbilityLogic:OnRecvAckAbilityResult(msg)
end

function AbilityMsgHandler:OnNtfAbilityResult(msg)
    AbilityLogic:OnRecvNtfAbilityResult(msg)
end

return AbilityMsgHandler
```

### UE Blueprint Layer (thin)

**WBP_CastBar（施法条 UI）：**
1. slua 调用 `UIBinding:ShowCastBar(abilityId, duration)`（C++ 暴露给 slua）
2. Event: `OnShowCastBar` → Set Visibility Visible
3. Update: `Progress Bar` 绑定 `CastProgress`（slua 每帧更新）
4. Set: `Icon Image` 从 DT_Ability_ClientCache 查 IconId

**NS_Fireball_Cast/Impact（特效）：**
1. slua 调用 `VFXBinding:SpawnAt(nsId, location)`
2. UE 端：Spawn NS_Fireball_Cast at Caster mesh socket "Hand_R"
3. 监听 slua 的 OnImpact 事件 → Spawn NS_Fireball_Impact at impact_location

**AM_CastSpell_TwoHand（动画）：**
1. slua 调用 `AnimBinding:PlayMontage(montageId)`
2. UE 端：Play Anim Montage，无业务逻辑

### Server Python Recipe (bigworld)

**Player_abilities.py（服务端施法逻辑）：**
```python
import bigworld
from ability_config import ABILITY_CONFIG

class PlayerEntity(BigWorld.Entity):

    def cast_ability(self, ability_id, target_entity_id, client_timestamp):
        """服务端处理客户端的施法请求（入口方法）"""
        # 1. 验证
        config = ABILITY_CONFIG.get(ability_id)
        if not config:
            self.send_ack_failure(ability_id, "invalid_ability")
            return

        if not self._can_cast(config, target_entity_id):
            return  # _can_cast 内部会发 Ack 失败

        # 2. 扣消耗
        self.mana -= self._calculate_cost(config)

        # 3. 设置冷却
        self.ability_cooldowns[ability_id] = bigworld.time() + config["cooldown_base"]

        # 4. 执行效果链
        for effect in config["on_cast_complete"]:
            self._execute_effect(effect, target_entity_id)

        # 5. 发 Ack 给施法者
        self.client.OnAckAbilityResult(
            ability_id=ability_id,
            success=True,
            cooldown=config["cooldown_base"]
        )

        # 6. 广播 Ntf 给范围内所有客户端
        self._broadcast_ability_result(ability_id, target_entity_id)

    def _can_cast(self, config, target_entity_id):
        """权威验证"""
        # 冷却检查
        if self.ability_cooldowns.get(config["icon_id"], 0) > bigworld.time():
            self.send_ack_failure(config["icon_id"], "on_cooldown")
            return False

        # 蓝量检查
        if self.mana < config["cost_base"]:
            self.send_ack_failure(config["icon_id"], "no_mana")
            return False

        # 距离检查
        target = bigworld.entities.get(target_entity_id)
        if not target:
            self.send_ack_failure(config["icon_id"], "invalid_target")
            return False

        dist = (self.position - target.position).length
        if dist > config["range_max"]:
            self.send_ack_failure(config["icon_id"], "out_of_range")
            return False

        # 视线检查
        if config["requires_los"] and not self._has_los(target):
            self.send_ack_failure(config["icon_id"], "no_los")
            return False

        # 状态检查
        for state in config["forbidden_states"]:
            if state in self.status_effects:
                self.send_ack_failure(config["icon_id"], "forbidden_state")
                return False

        return True

    def _execute_effect(self, effect, target_entity_id):
        """执行效果链"""
        if effect["type"] == "spawn_projectile":
            self._spawn_projectile(effect["projectile_id"], target_entity_id)
        elif effect["type"] == "apply_damage":
            self._apply_damage_to_target(target_entity_id, effect["formula"])
        elif effect["type"] == "apply_status":
            self._apply_status_to_target(target_entity_id, effect["status"], effect["duration"])

    def _apply_damage_to_target(self, target_id, formula):
        """伤害计算（服务端权威）"""
        target = bigworld.entities[target_id]
        config = ABILITY_CONFIG["FIREBALL"]

        # 公式：damage = base + spell_power * coefficient
        base = config["damage_base"]
        spell_power = self.spell_power
        damage = base + spell_power * config["damage_coefficient"]

        # 暴击
        import random
        if random.random() < config["crit_rate"]:
            damage *= config["crit_multiplier"]

        # 浮动
        variance = config["damage_variance"]
        damage *= (1 + random.uniform(-variance, variance))

        target.take_damage(int(damage), self.id)

    def _broadcast_ability_result(self, ability_id, target_entity_id):
        """广播给范围内所有客户端"""
        result_msg = {
            "ability_id": ability_id,
            "caster_entity_id": self.id,
            "target_entity_id": target_entity_id,
            "impact_location": self._get_impact_location(target_entity_id),
            "new_health": bigworld.entities[target_entity_id].health
        }
        # bigworld 内置：发给范围内所有 entity 的客户端
        self.cell.broadcastToNeighbors(result_msg, radius=8000)
```

### Protocol Definition

**消息定义：**
```
MSG_ABILITY_CAST = 0x1001      # Client → Server (Req)
MSG_ABILITY_RESULT_ACK = 0x1002 # Server → Client (Ack, 给施法者)
MSG_ABILITY_RESULT_NTF = 0x1003 # Server → All Clients (Ntf, 广播)

=== ReqAbilityCast (0x1001) ===
Direction: Client → Server
Reliable: Yes
Fields:
  ability_id: uint16      - 技能 ID（对应 ability_config.py 的 key）
  target_entity_id: uint32 - 目标 entity ID
  client_timestamp: uint32 - 客户端时间戳（用于延迟补偿）

=== AckAbilityResult (0x1002) ===
Direction: Server → Client (施法者)
Reliable: Yes
Fields:
  ability_id: uint16      - 技能 ID
  success: bool           - 是否施法成功
  fail_reason: uint8      - 失败原因码（0=成功, 1=冷却, 2=蓝量不足, ...）
  cooldown: float32       - 实际冷却时间（秒）

=== NtfAbilityResult (0x1003) ===
Direction: Server → All Clients (范围内)
Reliable: Yes (战斗结果必须到达)
Fields:
  ability_id: uint16
  caster_entity_id: uint32
  target_entity_id: uint32
  impact_location: vec3   - 命中点坐标（用于客户端播特效）
  new_health: int32       - 目标新血量（客户端更新血条）
```

### Data Schemas

**服务端 ability_config.py（详见第 4.2 节，此处省略完整内容）**

**客户端 DT_Ability_ClientCache.csv：**
```csv
AbilityId	DisplayName	AbilityType	School	IconId	CastTime	CanMoveWhileCast	Cooldown	GCD	RangeMax	TooltipText
FIREBALL	火球术	Damage	Fire	icon_fireball	2	FALSE	8	1.5	30	向目标发射火球，造成火焰伤害
```

**slua AbilityConfig.lua（详见第 4.4 节）**

### Assets / Naming / Folders

```
/Game/Client/Ability/                      ← UE 客户端资产
├── UI/
│   └── WBP_CastBar.uasset
├── FX/
│   ├── NS_Fireball_Cast.uasset
│   └── NS_Fireball_Impact.uasset
├── Animation/
│   └── AM_CastSpell_TwoHand.uasset
├── Data/
│   └── DT_Ability_ClientCache.uasset       ← 导入 CSV
└── Audio/
    ├── Cue_Fireball_Cast.uasset
    └── Cue_Fireball_Impact.uasset

Script/Client/Ability/                     ← slua Lua 脚本
├── AbilityLogic.lua
├── AbilityMsgHandler.lua
├── AbilityFSM.lua
└── AbilityConfig.lua

server/scripts/Ability/                    ← bigworld Python
├── Player_abilities.py
├── Player_cell.py
└── ability_config.py

protocol/ability.proto                     ← 协议定义（格式视项目而定）
```

## 6) Test Checklist

- **Single client + mock server**:
  - 按 1 键 → slua 发 ReqAbilityCast → mock 返回 Ack → UI 显示冷却
  - 施法条显示 2 秒 → 隐藏
  - mock 返回失败 → UI 显示错误提示

- **bigworld + 2 real clients**:
  - 客户端 1 施放火球 → 客户端 2 看到 NS_Fireball_Impact 特效
  - 客户端 1 的目标血量在客户端 2 同步减少
  - 服务器日志显示伤害计算和广播

- **Protocol mock (no server)**:
  - 用 mock 协议层测试 slua 状态机
  - 验证 Req → Ack → Ntf 消息序列

- **Weak network (300ms, 5% loss)**:
  - 施法延迟 300ms（等 Ack），无卡死
  - 战斗结果最终一致（Reliable 重传）
  - 特效可能延迟但不丢失（Ntf Reliable）

- **100 clients stress**:
  - 服务器帧时间 < 50ms
  - 客户端帧率 ≥ 30fps
  - 协议带宽 < 100KB/s per client

- **Reconnect**:
  - 断线 10 秒重连 → 客户端重新同步状态
  - 冷却中技能断线 → 重连后冷却状态正确

- **Security (anti-cheat)**:
  - 修改 slua 本地伤害值 → 服务器仍按 ability_config.py 计算
  - 篡改协议 target_entity_id → 服务器验证目标有效性
  - 客户端无法直接修改 entity health
```

---

## 7. 改造步骤总结：异构项目 8 步法

把全文整合成可执行的 8 步：

### Step 1：技术栈画像
填表：UE 版本 / 脚本层 / 服务端 / 协议 / 命名规范 / 性能目标。

### Step 2：Fork 原版并改名
`ue57-gamepiece-designer` → `mmorpg-heterogeneous-gamepiece-designer`（或你的项目名）。

### Step 3：改 _meta.json
slug/version/ownerId。

### Step 4：重写 description 和 What 段
按 3.1、3.2 改，产物清单按技术层组织。

### Step 5：重构 Output format 的 Implementation 段
按 3.3 改，加 Layer Responsibility 子段，删 Replication Notes，加 Protocol Definition。

### Step 6：扩展命名规范到 4 层
按 3.4 改，加 UE / slua / bigworld / protocol 四套命名。

### Step 7：替换 Multiplayer defaults 为 Heterogeneous defaults
按 3.5 改，加 Authority model / Performance / Protocol design / Layer separation 四段。

### Step 8：重构 Templates 和加范例
- 删 BlueprintRecipe_Template / Checklist_Networking / Schema_Ability_DT
- 加 LayeredImplementation_Template / Checklist_Protocol / Schema_Ability_Heterogeneous
- 加 examples/fireball-spell.md 等真实范例

### Step 9：自检 + 试用
- 9 项自检（含异构专属检查）
- 用"火球术"真实需求测试
- 检查输出是否覆盖 4 层 + 协议 + 双 schema

---

## 8. 异构项目改造的避坑指南

### 坑 1：忘记删 Replication Notes

**症状**：输出还出现"RepNotify"、"Server RPC"等 UE replication 术语。
**修复**：确认 SKILL.md 的 Output format 已把 Replication Notes 替换为 Protocol Definition。

### 坑 2：把战斗逻辑写进 slua

**症状**：Client Lua Recipe 里出现伤害计算。
**修复**：在 Heterogeneous defaults 的 Layer separation 段强化禁止规则，加反例。

### 坑 3：只给一份 Schema

**症状**：只输出 UE DataTable，没输出服务端配置和 slua 配置。
**修复**：在 Output format 的 Data Schemas 子段明确要求"3 份 schema"。

### 坑 4：协议层没有 Ack

**症状**：只有 Req 没有 Ack，客户端不知道服务器是否处理。
**修复**：在 Checklist_Protocol.md 加"Every request has a corresponding Ack"检查项。

### 坑 5：UE 蓝图写了业务逻辑

**症状**：UE Blueprint Layer 里出现状态判断或伤害计算。
**修复**：在 Layer Responsibility 表明确"UE Blueprint does NOT do combat math, state authority"。

### 坑 6：测试场景还用 PIE + Dedicated Server

**症状**：Test Checklist 写"PIE 测试"或"Dedicated Server"。
**修复**：按 3.7 重写测试场景为 7 项（含 mock server / bigworld / protocol mock / 弱网络 / 压测 / 重连 / 安全）。

### 坑 7：客户端缓存了完整战斗公式

**症状**：DT_Ability_ClientCache.csv 里有 damage_base / crit_rate 字段。
**修复**：在 Schema_Ability_Heterogeneous 模板里明确标注"客户端 schema 仅显示字段，战斗公式只在服务端"。

### 坑 8：没写反作弊检查

**症状**：Test Checklist 缺少 security test。
**修复**：加"修改 slua 本地文件 → 服务器拒绝非法请求"等测试项。

---

## 9. 与第 6 篇通用改造的差异对比

| 维度 | 第 6 篇（通用改造） | 第 7 篇（异构改造） |
|---|---|---|
| 改动幅度 | 改填充（版本/规模/命名） | 重构结构（输出格式/模板/产物清单） |
| Output format | 6 段保留，Implementation 子段可能调 | 6 段保留，Implementation 子段**重构为 7 个** |
| Templates | 改文件名和内容 | **替换为 3 个全新模板** |
| 命名规范 | 1 套（UE） | **4 套**（UE/slua/bigworld/protocol） |
| 默认值段 | Multiplayer defaults 改规模 | **替换为 Heterogeneous defaults 4 子段** |
| Schema | 1 份（UE DataTable） | **3 份**（服务端 Python / 客户端 CSV / slua Lua） |
| 测试场景 | PIE/Dedicated/Latency | **7 项**（含 mock/压测/重连/安全） |
| 范例数 | 2-3 个 | 推荐 3-5 个（每层至少 1 个） |

**核心差异**：异构项目改造不是"改填充"，而是"重构结构"。但**通用骨架**（When-Then 触发 / Safety 4 条 / 输出 6 段编号 / 占位符语法 / 可覆盖声明）**仍然全部保留**——这是 skill 工程化的根基。

---

## 10. 本篇小结

### 三个核心结论

1. **Schema 的"通用"指形式（CSV 格式 + 字段表结构），不是内容（具体字段名）**。异构项目要把内容层完全重写，甚至拆成多份。
2. **异构技术栈（UE+slua+bigworld+协议）的改造是"重构结构"**：Output format 按层拆、Templates 替换为分层模板、命名规范扩展到 4 套、Schema 拆成 3 份。
3. **层职责划分是异构项目的命脉**：Layer Responsibility 子段 + Layer separation 反例规则，是防止"逻辑写错层"的关键约束。

### 异构改造的元原则（5 条）

1. **保留通用骨架**：When-Then / Safety / 6 段编号 / 占位符 / 可覆盖声明。
2. **重构 Implementation 段**：按技术层拆子段，加 Layer Responsibility。
3. **Schema 必拆分**：服务端权威 / 客户端显示 / slua 表现，三份分离。
4. **协议层是独立产物**：Req/Ack/Ntf 三类消息 + 字段定义 + 可靠性。
5. **测试要覆盖异构**：mock server / bigworld / protocol mock / 弱网络 / 压测 / 重连 / 安全。

### 从原版到异构版的演化路径

```
原版 ue57-gamepiece-designer（UE 单体 40v40）
   ↓ 第 6 篇：通用改造（改填充）
你的 v0.1.0（改版本/规模/命名）
   ↓ 发现是异构技术栈
你的 v0.2.0（重构 Output format，加分层）
   ↓ 发现需要拆 Schema
你的 v0.3.0（3 份 Schema + 协议定义）
   ↓ 加范例 + 反作弊测试
你的 v1.0.0（异构稳定版）
```

每一步都是渐进式改造。**不要一次到位，先跑通最小闭环再迭代**。

> 📌 **另一种常见场景**：如果你的项目是 UE 原生架构，但要求"业务逻辑用 C++，
> 蓝图只做配置层"（让大模型能读懂代码、参与开发），第 7 篇的异构多语言栈改造
> 不适用。这种情况请读
> [第 8 篇：C++ 优先休闲联机游戏改造](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/08-cpp-first-casual-game-guide.md)，
> 里面有"推砖块碾压敌人"系统的完整 C++ 范例和蓝图配置层设计。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
