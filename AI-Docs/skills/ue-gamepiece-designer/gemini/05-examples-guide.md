# 第 5 篇：examples/ 目录——何时用、如何发挥作用、怎么加

> 本篇回答三个问题：
> 1. **examples/ 目录什么时候会用？** 触发条件与加载机制
> 2. **里面的例子是如何发挥作用的？** few-shot 原理 + 与 Templates/ 的区别
> 3. **如果给 `ue57-gamepiece-designer` 添加 example，要怎么添加？** 完整实现（3 个真实范例 + SKILL.md 引用方式 + 自检清单）
>
> 本篇是初学者最容易忽略、但对 skill 输出质量影响最大的进阶主题。

---

## 5.1 examples/ 目录是什么

### 5.1.1 一句话定义

`examples/` 目录是 skill 文件夹下的可选子目录，里面存放**已填充完毕的"标杆输出"**——也就是 Claude 在理想状态下应该产出的完整回答样本。

完整目录结构演化为：

```
<skill-slug>/
├── SKILL.md              ← 行为规则（始终注入）
├── _meta.json            ← 元数据
├── Templates/            ← 待填充的骨架（按需读取）
└── examples/             ← 已填充的范例（按需读取）  ← 本篇主题
    ├── example-1.md
    ├── example-2.md
    └── example-3.md
```

### 5.1.2 与 Templates/ 的本质区别

初学者最容易把 examples/ 和 Templates/ 搞混。它们的区别是**「骨架 vs 范例」**：

| 维度 | Templates/（骨架） | examples/（范例） |
|---|---|---|
| **内容形态** | 占位符 + 结构 | 完整的、可读的回答 |
| **是否填充** | 未填充（`<占位符>`） | 已填充（具体值） |
| **作用** | 告诉 Claude "形状长这样" | 告诉 Claude "好输出长这样" |
| **类比** | 空白表格 | 已填好的样表 |
| **学习机制** | 模式约束（pattern） | few-shot 学习（示例） |
| **何时该用** | 输出结构复杂，需固定格式 | 输出质量不稳定，需标杆对齐 |

**关键认知**：Templates 管"形"，examples 管"神"。一个约束结构，一个示范质量。

### 5.1.3 一个比喻

把 skill 想象成教一个新人写设计文档：

- **SKILL.md** = 工作手册（"必须写 6 段，命名用 BP_ 前缀，多人要写 Replication"）
- **Templates/** = 空白表格（"按这个格子填，第一行写 Goal，第二行写 Inputs..."）
- **examples/** = 范例文档（"看，这是一份写得好的设计文档，照这个水平写"）

新人即使读了手册和表格，第一次写也可能跑偏——不是结构错了，是**深度、细节、措辞**没到位。这时候给一份范例，他立刻知道"哦，原来 Test Checklist 要写到这种粒度"。

Claude 也一样。SKILL.md + Templates 能保证输出**结构正确**，但不保证**质量到位**。examples 补的就是质量这一课。

---

## 5.2 examples/ 何时会被用

### 5.2.1 加载机制：按需读取，不自动注入

**重要**：examples/ **不会**像 SKILL.md 那样自动全文注入上下文。它和 Templates/ 一样是**按需读取**的。

完整的注入与读取层次：

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 0：始终注入（每次对话都占 token）                    │
│  ─────────────────────────────                              │
│  • SKILL.md 全文                                            │
│  • _meta.json 不注入（只供系统识别）                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 1：按需读取（Claude 主动读，或被 SKILL.md 引用时读） │
│  ─────────────────────────────                              │
│  • Templates/ 下的骨架文件                                  │
│  • examples/ 下的范例文件  ← 本篇主题                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2：从不注入                                          │
│  ─────────────────────────────                              │
│  • .git / README.md / 其他非约定文件                        │
└─────────────────────────────────────────────────────────────┘
```

**为什么 examples 不自动注入？**
- token 经济：3 个范例可能 3000+ tokens，全注入会挤压可用预算
- 按需读取：Claude 只在需要参考时才读，不浪费
- 可独立演进：改范例不影响行为规则

### 5.2.2 触发读取的三种场景

Claude 在以下三种情况下会读取 examples/ 下的文件：

#### 场景 1：SKILL.md 显式引用

最可靠的方式。在 SKILL.md 里写明"参考 examples/xxx.md"，Claude 生成时会主动读取。

```markdown
## Output format (always)
1) Goal
...
6) Test Checklist

> 参考范例：examples/health-potion-pickup.md 和 examples/rpg-ability-system.md
> 生成时请对照范例的深度和粒度。
```

#### 场景 2：用户输入接近某个范例的场景

Claude 发现用户需求与某个 example 高度相似，会主动读取该 example 做参照。

```
用户："帮我设计一个魔法药水拾取"
   ↓
Claude 发现 examples/health-potion-pickup.md 与需求相似
   ↓
读取该 example
   ↓
按 example 的深度和粒度生成新输出
```

#### 场景 3：输出质量不达标，Claude 自我修正

如果 Claude 第一次生成的输出"感觉不够好"（比如太简短、缺细节），它会主动找 examples/ 学习标杆，然后改进。

> ⚠️ 注意：场景 2 和场景 3 依赖 Claude 的"主动判断"，不是 100% 可靠。**最可靠的方式是场景 1：在 SKILL.md 显式引用 examples/**。

### 5.2.3 examples 如何发挥作用：few-shot 原理

examples 利用了大语言模型的 **few-shot learning（少样本学习）** 能力：

```
零样本（zero-shot）：
   只有 SKILL.md 的规则，Claude 凭理解生成
   ↓
   输出结构对，但深度/措辞/细节可能跑偏

少样本（few-shot）：
   SKILL.md 规则 + 2-3 个范例
   ↓
   Claude 从范例中学习"什么样的输出算好"
   ↓
   生成时对齐范例的深度和粒度
```

具体来说，examples 在 4 个维度上对齐输出质量：

| 维度 | 没有 examples | 有 examples |
|---|---|---|
| **深度** | 不知道写到什么粒度停 | 对照范例的细节深度 |
| **措辞** | 用词可能不规范 | 学习范例的地道表达 |
| **领域细节** | 可能漏掉领域特有考量 | 范例展示了必须覆盖的点 |
| **风格** | 每次 출력 风格可能不一致 | 风格向范例对齐 |

---

## 5.3 何时该加 examples，何时不该加

### 5.3.1 该加的 4 种情况

#### 情况 1：输出质量不稳定

症状：同一个 skill，不同对话产出质量差异大。有时详尽，有时简陋。

解法：加 2-3 个范例做标杆，让 Claude 知道"标准答案长这样"。

#### 情况 2：输出格式复杂，仅靠模板不够

症状：Templates 的骨架填出来的内容深度不够，缺"灵魂"。

解法：examples 展示"骨架填满后应该长什么样"，补 Templates 的不足。

#### 情况 3：领域有微妙规范

症状：领域里有"行话"或不成文的约定，SKILL.md 写不全。

解法：范例直接展示这些约定，比写规则更有效。

#### 情况 4：想提升 Claude 在该 skill 上的表现上限

症状：SKILL.md 已经很精确，但输出还是"差点意思"。

解法：高质量的范例能把 Claude 的表现拉高一档。

### 5.3.2 不该加的 3 种情况

#### 情况 1：SKILL.md 还没写好

如果 SKILL.md 本身粗糙，加 examples 是本末倒置。先把 SKILL.md 写精确，再考虑 examples。

#### 情况 2：输出简单

如果输出就是"几行文本"，没必要加 examples——SKILL.md 就够。

#### 情况 3：token 预算紧张

examples 占 token（即使按需读取，读取时也占）。如果对话上下文已经很挤，别加 examples。

### 5.3.3 决策流程图

```
你的 skill 输出有问题吗？
   │
   ├─ 没问题，输出质量稳定且达标
   │   → 不需要 examples
   │
   └─ 输出有问题
       │
       ├─ 问题是结构错误（缺段、乱序）
       │   → 改 SKILL.md 的 Output format，不需要 examples
       │
       ├─ 问题是命名/约定不守
       │   → 改 SKILL.md 的领域约定段，不需要 examples
       │
       └─ 问题是深度/措辞/细节不够
           → 加 examples！这正是 examples 的用武之地
```

---

## 5.4 如何为 `ue57-gamepiece-designer` 添加 examples

下面是完整的实战：给当前案例 skill 添加 3 个 examples，并修改 SKILL.md 引用它们。

### 5.4.1 添加 examples 的 5 步法

#### Step 1：确定要覆盖的典型场景

`ue57-gamepiece-designer` 处理"UE5.7 多人游戏部件设计"。选 3 个有代表性的场景：

| 范例 | 场景 | 为什么选它 |
|---|---|---|
| `health-potion-pickup.md` | 生命药水拾取（按 E 拾取，多人同步） | 最基础的多人交互，覆盖 RPC/RepNotify |
| `rpg-ability-system.md` | RPG 技能系统（火球/治疗/近战，含 DataTable） | 展示 DataTable schema 的填充 |
| `target-lock-system.md` | 目标选择锁定（Tab 切换，40v40 规模） | 展示大规模多人性能考量 |

3 个范例覆盖了"基础交互 / 数据驱动 / 大规模"三种典型场景，足够 Claude 学习。

#### Step 2：创建目录

```
ue57-gamepiece-designer/
├── SKILL.md
├── _meta.json
├── Templates/
│   ├── BlueprintRecipe_Template.md
│   ├── Checklist_Networking.md
│   └── Schema_Ability_DT.csv
└── examples/                          ← 新增
    ├── health-potion-pickup.md        ← 新增
    ├── rpg-ability-system.md          ← 新增
    └── target-lock-system.md          ← 新增
```

#### Step 3：写范例（每个范例都是一份完整的"理想输出"）

范例必须满足：
- ✅ 完整填充 6 段输出结构
- ✅ 严格遵守 SKILL.md 的命名前缀
- ✅ 体现多人网络 4 维度（Authority/Replication/Performance/Testing）
- ✅ 展示 Templates 如何被填充
- ✅ 细节深度到位（这是 examples 的核心价值）

#### Step 4：在 SKILL.md 中显式引用 examples

在 SKILL.md 的 Output format 段末尾加一句：

```markdown
## Output format (always)
1) **Goal**
...
6) **Test Checklist**

> **参考范例**：生成前先读 `examples/health-potion-pickup.md` 和
> `examples/rpg-ability-system.md`，对照其深度和粒度。
> 若用户需求接近某个范例场景，参考该范例的展开方式。
```

#### Step 5：自检

- [ ] 每个范例都完整填充了 6 段？
- [ ] 范例的命名严格遵守 SKILL.md 前缀？
- [ ] 范例的 Replication Notes 覆盖了 4 维度？
- [ ] 范例的 Test Checklist 包含 PIE/Dedicated/Latency 三场景？
- [ ] SKILL.md 显式引用了 examples？
- [ ] 范例数量在 2-4 个之间（太多占 token，太少学不到）？

### 5.4.2 范例 1：`examples/health-potion-pickup.md`

```markdown
# Example: Health Potion Pickup System

> 用户输入："帮我设计一个生命药水拾取系统，按 E 拾取，多人同步，40v40"

## 1) Goal
设计一个生命药水拾取系统：玩家走到药水附近，按 E 键拾取，恢复生命值，
支持 40v40 多人对战场景下稳定运行。

## 2) Inputs
- 玩家输入：Enhanced Input Action "IA_Interact"（E 键）
- 触发条件：玩家进入药水的交互碰撞盒
- 配置数据：DT_Consumables 表中的 HealAmount 字段
- 服务器权威：所有拾取请求由服务器裁决

## 3) Outputs
- Blueprint: `BP_Pickup_HealthPotion`（Actor 类，可放置关卡）
- Blueprint Component: `BPComp_Interaction`（可复用的交互组件）
- Blueprint Interface: `BPI_Interactable`（交互接口）
- DataTable: `DT_Consumables`（消耗品数据表）
- Enum: `E_ConsumableType`（消耗品类型枚举）

## 4) Assumptions
- 假设 UE5.7，使用 Enhanced Input（非旧版 Input）
- 假设 40v40 对战规模，单局最多 80 玩家 + ~200 药水
- 假设玩家已有 HealthComponent（不在本设计范围内）
- 假设使用 GAS（Gameplay Ability System）或自定义 ApplyHeal 函数
- 假设药水一次性消耗（非持续回复）

> 如以上假设不成立，请明确告知，会调整设计。

## 5) Implementation

### Blueprint Recipe (ordered)

**BP_Pickup_HealthPotion 的核心节点链：**

1. Event: `BeginPlay`
   → 服务器端初始化：绑定 overlap 事件，设置 `bIsAvailable = true`（replicated）
2. Component: `BPComp_Interaction` 挂到 BP_Pickup_HealthPotion
   → 内含 Sphere Collision（半径 150）+ `OnComponentBeginOverlap` 事件
3. Event: `OnComponentBeginOverlap` (Sphere)
   → Branch: `HasAuthority?` (yes 才继续)
   → 把 overlap 的 Player Pawn 存入 `PendingInteractor`（不 replicated，服务器本地）
   → 给该 Player 显示 UI 提示（通过 Client RPC）
4. Event: `OnComponentEndOverlap` (Sphere)
   → Branch: `HasAuthority?`
   → 清空 `PendingInteractor`
   → Client RPC：隐藏 UI 提示
5. Enhanced Input: `IA_Interact` 触发（在 Player Controller 中）
   → Server RPC: `Server_RequestPickup(targetActor)`
6. Server Event: `Server_RequestPickup`
   → Branch: `bIsAvailable && PendingInteractor == requester` (验证)
   → Branch: `requester.HealthComponent.CurrentHealth < MaxHealth`（防溢出）
   → 调用 `ApplyHeal(HealAmount)`（从 DT_Consumables 查表）
   → Set `bIsAvailable = false`（RepNotify，触发客户端隐藏药水）
   → Timer: 30 秒后 `Respawn`（设 `bIsAvailable = true`）
7. RepNotify: `OnRep_bIsAvailable`
   → Branch: `bIsAvailable == false`
   → Set Visibility: Mesh + Collision disabled
   → Spawn Niagara: `NS_Pickup_Vanish`（客户端本地特效）

### Replication Notes

- **Runs on**:
  - Overlap 检测：仅 Server（权威判定）
  - UI 提示：Server 触发，Client RPC 执行（仅发起交互的客户端显示）
  - 拾取裁决：Server only
  - 视觉响应（隐藏/特效）：所有 Client（通过 RepNotify）

- **RPCs**:
  - `Server_RequestPickup(targetActor)`: Client → Server（Unreliable，丢失可重发）
  - `Client_ShowPrompt(bool)`: Server → Client（指定 Player Controller，Reliable）
  - `Multicast_PlayPickupFX`: 不使用（用 RepNotify 替代，省带宽）

- **Replicated Vars**:
  - `bIsAvailable` (bool, RepNotify) — 药水是否可拾取
  - `HealAmount` (float, Replicated) — 从 DataTable 初始化，复制给客户端做 UI 显示
  - `ConsumableType` (E_ConsumableType, Replicated) — 类型，用于客户端选 UI 图标
  - `PendingInteractor` (Pawn*, 不复制) — 服务器本地变量

- **Bandwidth notes**:
  - 避免每帧同步位置（药水是静态 actor）
  - 避免同步 cosmetic 状态（粒子效果用 RepNotify 触发本地 spawn，不复制粒子本身）
  - 200 个药水 × 3 个 replicated vars × ~4 bytes = 2.4KB/帧（40v40 下可接受）
  - 设置 `NetCullDistanceSquared = 2250000`（1500 单位 = 15 米，超出不同步）

### Assets / Naming / Folders

```
/Game/Systems/HealthPotion/
├── Blueprints/
│   ├── BP_Pickup_HealthPotion.uasset
│   ├── BPComp_Interaction.uasset
│   └── BPI_Interactable.uasset
├── Data/
│   ├── DT_Consumables.uasset
│   └── ST_ConsumableData.uasset
├── Enums/
│   └── E_ConsumableType.uasset
├── FX/
│   └── NS_Pickup_Vanish.uasset
└── UI/
    └── WBP_InteractPrompt.uasset
```

## 6) Test Checklist

- **PIE（2 玩家本地测试）**:
  - 玩家 1 走近药水 → 看到"按 E 拾取"提示
  - 玩家 1 按 E → 血量增加，药水消失，特效播放
  - 玩家 1 离开 → 提示消失
  - 30 秒后药水重生

- **Dedicated Server + 2 Clients**:
  - 服务器日志显示 `Server_RequestPickup` 被调用
  - 两个客户端都看到药水消失（RepNotify 生效）
  - 两个客户端都看到拾取特效
  - 客户端 1 拾取后，客户端 2 的提示也消失

- **Simulated Latency (200ms)**:
  - 按 E 后有 200ms 延迟才看到血量增加（正常，因 Server RPC 往返）
  - 药水消失在两个客户端上一致（无 desync）
  - 拾取特效在两个客户端都播放（无遗漏）

- **Edge Cases**:
  - 两个玩家同时按 E 拾取同一药水 → 服务器先到先得，第二个玩家收到"已被拾取"提示
  - 满血玩家按 E → 拾取被拒绝，提示"血量已满"
  - 拾取瞬间药水被销毁 → 服务器端 Branch 验证 `IsValid`，无崩溃
  - 40v40 全员同时拾取不同药水 → 服务器帧时间 < 16ms（无卡顿）
```

### 5.4.3 范例 2：`examples/rpg-ability-system.md`

```markdown
# Example: RPG Ability System

> 用户输入："做一个 RPG 技能系统，含火球术、治疗术、近战挥砍，要数据驱动"

## 1) Goal
设计一个数据驱动的 RPG 技能系统：技能数据存 DataTable，三种技能（火球/治疗/近战）
共用一套执行框架，支持 40v40 多人。

## 2) Inputs
- 玩家输入：Enhanced Input Action "IA_CastAbility_1/2/3"（键 1/2/3）
- 数据源：`DT_Abilities` 表（每行一个技能配置）
- 角色状态：Mana、Health、GCD 计时器、当前正在施法的 AbilityId
- 服务器权威：所有技能效果由服务器执行

## 3) Outputs
- DataTable: `DT_Abilities`（技能数据表，参照 Templates/Schema_Ability_DT.csv）
- Struct: `ST_AbilityData`（行结构）
- Enum: `E_AbilityType`（Damage/Heal/Buff/Debuff）
- Blueprint Interface: `BPI_AbilityCaster`（技能施放接口）
- Blueprint: `BP_AbilityComponent`（技能系统组件，挂在 Player Character）
- Blueprint: `BP_Ability_Fireball`、`BP_Ability_Heal`、`BP_Ability_MeleeSwing`（具体技能）

## 4) Assumptions
- 假设 UE5.7，不使用 GAS 插件（用自定义轻量框架）
- 假设 40v40 规模，单帧最多 80 玩家 × 3 技能 = 240 并发技能请求
- 假设技能数据运行时只读（不动态修改）
- 假设技能效果分类：伤害/治疗/状态（buff/debuff）
- 假设 GCD = 1.5 秒，所有技能共享

> 如以上假设不成立，请明确告知，会调整设计。

## 5) Implementation

### Blueprint Recipe (ordered)

**BP_AbilityComponent 的核心节点链：**

1. Event: `BeginPlay`
   → 服务器端：初始化 `CurrentMana = MaxMana`（replicated）
   → 初始化 `bIsGCDActive = false`（不 replicated，服务器本地）
   → 加载 `DT_Abilities` 引用
2. Enhanced Input: `IA_CastAbility_1`（在 Player Controller 中）
   → 查表 `DT_Abilities` 得到 AbilityId（如 FIREBALL）
   → Server RPC: `Server_CastAbility(abilityId, targetLocation)`
3. Server Event: `Server_CastAbility(abilityId, targetLocation)`
   → Branch: `!bIsGCDActive`（GCD 检查）
   → Branch: `GetAbilityData(abilityId).CooldownSeconds <= CooldownTimer`（冷却检查）
   → Branch: `CurrentMana >= GetAbilityData(abilityId).CostAmount`（蓝量检查）
   → Branch: `GetAbilityData(abilityId).RequiresLOS ? HasLineOfSight(target) : true`（视线检查）
   → Set `bIsGCDActive = true`
   → Timer: `GCDSeconds` 后 `bIsGCDActive = false`
   → Set `CurrentMana -= CostAmount`（replicated，自动同步客户端）
   → Spawn `BP_Ability_<AbilityName>`（如 BP_Ability_Fireball）
   → Call: `ability.Execute(caster, targetLocation)`（通过 BPI_AbilityCaster）
4. BP_Ability_Fireball 的 Execute 实现：
   → Event: `Execute(caster, targetLocation)`（接口事件）
   → Spawn Projectile: `BP_Projectile_Fireball`（replicated）
   → Set projectile velocity 朝向 targetLocation
   → Timer: `CastTimeSeconds`（2 秒）后允许 caster 移动
5. Projectile Hit Event（在 BP_Projectile_Fireball 中）：
   → Branch: `HasAuthority`
   → Apply Damage: `ApplyRadialDamage(target, damage, radius)`（UE 内置函数）
   → Multicast: `PlayImpactFX(location)`（所有客户端播放命中特效）
   → Destroy: 销毁 projectile

### Replication Notes

- **Runs on**:
  - 技能请求：Client 发起，Server 裁决
  - 技能效果（伤害/治疗）：Server only
  - 视觉效果（projectile/特效）：Server spawn，所有 Client 通过 replication 自动看到
  - 蓝量/UI：Server 修改 `CurrentMana`（replicated），Client 自动同步

- **RPCs**:
  - `Server_CastAbility(abilityId, targetLocation)`: Client → Server（Reliable，必须送达）
  - `Multicast_PlayImpactFX(location)`: Server → All Clients（Unreliable，丢失可接受）
  - `Client_ShowCooldownUI(abilityId, duration)`: Server → Owning Client（Reliable）

- **Replicated Vars**:
  - `CurrentMana` (float, Replicated) — 客户端 UI 同步
  - `CurrentHealth` (float, Replicated) — 客户端 UI 同步
  - `ActiveCastAbilityId` (E_AbilityId, RepNotify) — 当前施法中的技能，触发客户端进度条 UI
  - `CooldownTimers` (TMap, 不复制) — 服务器本地，通过 RPC 通知客户端
  - `bIsGCDActive` (bool, 不复制) — 服务器本地，通过 RPC 通知客户端

- **Bandwidth notes**:
  - Projectile 用 `RepMovement` 自动同步位置（频率 30Hz，避免 Tick 同步）
  - 240 个并发技能 × 1 个 Multicast RPC × ~50 bytes = 12KB/帧（40v40 下可接受）
  - 设置 projectile 的 `NetCullDistanceSquared = 64000000`（8000 单位 = 80 米，超出不同步）
  - 伤害数字用 Client RPC 推送给受影响玩家，不用 Multicast（省带宽）

### Assets / Naming / Folders

```
/Game/Systems/AbilitySystem/
├── Blueprints/
│   ├── BP_AbilityComponent.uasset
│   ├── BP_Ability_Fireball.uasset
│   ├── BP_Ability_Heal.uasset
│   ├── BP_Ability_MeleeSwing.uasset
│   ├── BP_Projectile_Fireball.uasset
│   └── BPI_AbilityCaster.uasset
├── Data/
│   ├── DT_Abilities.uasset          ← 参照 Templates/Schema_Ability_DT.csv
│   └── ST_AbilityData.uasset
├── Enums/
│   ├── E_AbilityType.uasset
│   └── E_AbilityId.uasset
├── FX/
│   ├── NS_Fireball_Impact.uasset
│   └── NS_Heal_Cast.uasset
└── UI/
    ├── WBP_AbilityBar.uasset
    └── WBP_CooldownOverlay.uasset
```

### DT_Abilities 数据表（参照 Schema_Ability_DT.csv）

```
AbilityId     | DisplayName  | AbilityType | School   | RangeMin | RangeMax | GCDSeconds | CooldownSeconds | CostType | CostAmount | CastTimeSeconds | RequiresLOS | CanMoveWhileCasting | IconId          | Notes
FIREBALL      | Fireball     | Damage      | Fire     | 0        | 30       | 1.5        | 8               | Mana     | 20         | 2               | TRUE        | FALSE               | icon_fireball   | Basic ranged nuke
HEAL          | Heal         | Heal        | Holy     | 0        | 40       | 1.5        | 6               | Mana     | 25         | 2               | TRUE        | FALSE               | icon_heal       | Single target heal
MELEE_SWING   | Melee Swing  | Damage      | Physical | 0        | 3        | 1.5        | 0               | Energy   | 0          | 0               | TRUE        | TRUE                | icon_swing      | Basic melee
```

## 6) Test Checklist

- **PIE（单玩家）**:
  - 按 1 键施放火球术 → projectile 飞出，命中敌人扣血
  - 按 2 键施放治疗术 → 自身血量增加
  - 按 3 键施放近战 → 前方扇形范围敌人受伤
  - 连按 1 键 → GCD 期间拒绝施放，无蓝量消耗
  - 蓝量不足 → 拒绝施放，UI 提示"法力不足"

- **Dedicated Server + 2 Clients**:
  - 客户端 1 施放火球 → 客户端 2 看到 projectile 飞行
  - 客户端 1 的火球命中客户端 2 → 双方血量同步变化
  - 客户端 2 的血量条在客户端 1 看到同步减少
  - 客户端 1 蓝量减少，客户端 2 也能看到（replicated 生效）

- **Simulated Latency (200ms)**:
  - 按 1 键后 200ms 才看到 projectile spawn（正常，因 Server RPC 往返）
  - 命中扣血在两客户端一致（无 desync）
  - GCD 计时器准确（200ms 延迟下不漂移）

- **Edge Cases**:
  - 施法期间打断（移动/按其他键）→ 服务器取消 cast，蓝量不扣
  - 40v40 全员同时施放火球 → 服务器帧时间 < 16ms（240 个 projectile 不卡）
  - 目标超出 RangeMax → 服务器拒绝施放，提示"超出射程"
  - 视线被遮挡 → 服务器拒绝施放（RequiresLOS=TRUE 的技能）
```

### 5.4.4 范例 3：`examples/target-lock-system.md`

```markdown
# Example: Target Lock System (40v40)

> 用户输入："设计一个目标选择系统，Tab 切换锁定，40v40 规模"

## 1) Goal
设计一个目标锁定系统：按 Tab 切换最近目标，锁定后显示目标环，
支持 40v40 大规模对战，性能不退化。

## 2) Inputs
- 玩家输入：Enhanced Input Action "IA_CycleTarget"（Tab 键）
- 触发条件：玩家按下 Tab
- 数据源：场景中所有敌方 Player Character
- 服务器权威：目标选择由服务器裁决

## 3) Outputs
- Blueprint Component: `BPComp_Targeting`（目标系统组件，挂 Player Character）
- Blueprint Interface: `BPI_Targetable`（可被锁定的接口）
- Blueprint: `BP_TargetRing`（目标环视觉，replicated actor）
- Enum: `E_TargetingMode`（None / Soft / Hard）

## 4) Assumptions
- 假设 UE5.7，使用 Enhanced Input
- 假设 40v40 = 80 玩家，每人锁定 1 个目标
- 假设最大锁定距离 50 米，超出不解锁
- 假设视野内才可锁定（FRustum 检测）
- 假设目标死亡后自动解除锁定

> 如以上假设不成立，请明确告知，会调整设计。

## 5) Implementation

### Blueprint Recipe (ordered)

**BPComp_Targeting 的核心节点链：**

1. Event: `BeginPlay`
   → 服务器端：初始化 `CurrentTarget = None`（replicated, RepNotify）
   → 初始化 `TargetingMode = E_TargetingMode::None`（replicated）
2. Enhanced Input: `IA_CycleTarget`（在 Player Controller 中）
   → Server RPC: `Server_CycleTarget()`
3. Server Event: `Server_CycleTarget`
   → 调用 `FindBestTarget()`（见下）
   → Set `CurrentTarget = newTarget`（replicated, RepNotify 触发客户端 UI 更新）
   → 调用 `BP_TargetRing.SetFollowedActor(newTarget)`（目标环跟随）
4. Server Function: `FindBestTarget()`
   → Get All Actors of Class (BP_Character) → 80 个候选
   → Filter: `IsAlive && IsEnemy(Team) && Distance <= 5000 && IsInViewFrustum`
   → Sort by: `Distance ASC`（最近的优先）
   → 若 `CurrentTarget` 已存在且仍有效 → 切换到下一个（循环）
   → Return: 第一个有效目标（或 None）
5. Event: `OnRep_CurrentTarget`（客户端回调）
   → Branch: `CurrentTarget != None`
   → Spawn `BP_TargetRing`（客户端本地，不 replicated，省带宽）
   → Attach: `BP_TargetRing.AttachToComponent(CurrentTarget.Mesh)`
   → 若上一帧有目标环 → Destroy 旧的
6. Event: `TargetDied`（绑定 BPI_Targetable.OnDied）
   → Set `CurrentTarget = None`
   → Destroy 目标环

### Replication Notes

- **Runs on**:
  - 目标搜索：Server only（80 候选筛选，重计算）
  - 目标切换：Server 修改 replicated var，Client 自动同步
  - 目标环 spawn/attach：Client 本地（OnRep 触发）
  - 目标死亡监听：Server 检测，通过 replicated var 同步

- **RPCs**:
  - `Server_CycleTarget()`: Client → Server（Reliable）
  - `Client_NotifyTargetChanged(targetId)`: 不使用（用 RepNotify 替代）
  - `Multicast_PlayLockOnFX`: 不使用（每个客户端各自 spawn 目标环）

- **Replicated Vars**:
  - `CurrentTarget` (Actor*, RepNotify) — 当前锁定的目标
  - `TargetingMode` (E_TargetingMode, Replicated) — 锁定模式
  - `bIsTargetingEnabled` (bool, Replicated) — 系统是否启用

- **Bandwidth notes**:
  - **关键**：`FindBestTarget` 在服务器跑，**不同步 80 个候选给客户端**
  - 目标环用 RepNotify 触发客户端本地 spawn，**不同步目标环 actor**
  - 80 玩家 × 1 个 RepNotify × ~8 bytes (Actor*) = 640 bytes/帧（极轻）
  - **避免**：每帧同步目标位置（用 AttachToComponent 自动跟随，不复制位置）
  - **避免**：客户端自己跑 `FindBestTarget`（80 候选筛选客户端也跑会爆 CPU）

### Performance Notes（40v40 专项）

- **Tick 频率**：`FindBestTarget` 不在 Tick 跑，仅在按 Tab 时触发
  - 替代方案：若需要"自动切换到最近目标"，每 0.5 秒跑一次（用 Timer，不用 Tick）
- **Overlap 检测**：不用 Sphere Overlap 持续检测（80 玩家 × 80 候选 = 6400 检测/帧，太重）
  - 改用：距离 + 视野锥筛选（O(n) 一次遍历）
- **目标环 UI**：用 Widget Component 挂在目标身上，**不在客户端 Tick 更新位置**
  - 用 AttachToComponent 自动跟随，零 Tick 成本
- **NetCullDistance**：`BP_TargetRing` 设 `bOnlyRelevantToOwner = true`，只对锁定者可见
  - 80 玩家各自的目标环互不同步，省 80× 带宽

### Assets / Naming / Folders

```
/Game/Systems/Targeting/
├── Blueprints/
│   ├── BPComp_Targeting.uasset
│   ├── BP_TargetRing.uasset
│   └── BPI_Targetable.uasset
├── Enums/
│   └── E_TargetingMode.uasset
├── Materials/
│   └── MI_TargetRing.uasset
└── UI/
    └── WBP_TargetInfo.uasset
```

## 6) Test Checklist

- **PIE（2 玩家本地测试）**:
  - 玩家 1 按 Tab → 锁定最近的玩家 2，目标环出现
  - 玩家 1 再按 Tab → 切换到下一个目标（或解除锁定）
  - 玩家 2 走出 50 米 → 玩家 1 自动解除锁定
  - 玩家 2 死亡 → 玩家 1 自动解除锁定

- **Dedicated Server + 2 Clients**:
  - 客户端 1 按 Tab → 服务器搜索目标，设置 `CurrentTarget`
  - 客户端 1 收到 RepNotify → spawn 目标环，attach 到目标
  - 客户端 2 看不到客户端 1 的目标环（`bOnlyRelevantToOwner`）
  - 客户端 1 的目标在客户端 2 看来位置同步（目标本身是 replicated actor）

- **Simulated Latency (200ms)**:
  - 按 Tab 后 200ms 才看到目标环（正常）
  - 目标切换在两客户端一致（无 desync）
  - 目标死亡后锁定解除在两客户端一致

- **Stress Test (40v40 = 80 players)**:
  - 80 玩家同时按 Tab → 服务器帧时间 < 16ms（不卡）
  - 80 玩家各自锁定目标 → 网络带宽稳定（每帧 < 1KB）
  - 持续 10 分钟 → 内存稳定，无泄漏
  - CPU 占用：服务器 < 50%，客户端 < 30%

- **Edge Cases**:
  - 视野外无目标 → 锁定失败，UI 提示"无可用目标"
  - 目标走出视野 → 自动解除锁定（IsInViewFrustum 返回 false）
  - 隐身玩家 → 不被锁定（BPI_Targetable.IsTargetable 返回 false）
  - 同一帧 80 玩家按 Tab → 服务器排队处理，无丢失
```

### 5.4.5 修改 SKILL.md 以引用 examples

下面是修改后的 SKILL.md（在原版基础上加一处引用）：

```markdown
---
name: ue57-gamepiece-designer
description: Designs UE5.7 multiplayer-friendly game pieces (Blueprint node chains, data schemas, asset naming, and test checklists). Text-only, no scripts.
---

# UE5.7 Gamepiece Designer (Text-Only)

## What this skill does
When the user asks for a UE system or "game piece", produce a structured design that is ready to implement in Unreal Engine 5.7:
- Blueprint node chain recipes (ordered steps, node names, variables, events)
- DataTable / DataAsset schemas (field list + example rows)
- Asset / folder plan (paths + naming)
- Multiplayer sanity: server/client responsibility, replication notes
- Test checklist (PIE, dedicated server, latency, edge cases)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (what variables/configs it needs)
3) **Outputs** (what it produces)
4) **Assumptions**
5) **Implementation**
   - **Blueprint Recipe** (step-by-step; refer to Templates/BlueprintRecipe_Template.md)
   - **Replication Notes** (Server vs Client, replicated vars, RPCs; refer to Templates/Checklist_Networking.md)
   - **Assets / Naming / Folders**
6) **Test Checklist**

> **参考范例**：生成前先读 `examples/health-potion-pickup.md` 和
> `examples/rpg-ability-system.md`，对照其深度和粒度。
> 若用户需求接近某个范例场景（如目标选择/大规模多人），参考
> `examples/target-lock-system.md` 的展开方式。

## UE naming + folders (default)
- Root: `/Game/Systems/<SystemName>/`
- Blueprints: `BP_<Thing>`
- Components: `BPComp_<Thing>`
- Interfaces: `BPI_<Thing>`
- DataTables: `DT_<Thing>`
- DataAssets: `DA_<Thing>`
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`

## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**修改要点**：
- 在 Output format 段后**新增一段引用**，明确告诉 Claude 去读 examples
- 引用用 `>` 引用块包裹，与正文区分
- 区分"通用范例"（health-potion / rpg-ability）和"场景特化范例"（target-lock）

### 5.4.6 添加 examples 后的完整目录

```
ue57-gamepiece-designer/
├── SKILL.md                          ← 修改：加 examples 引用
├── _meta.json
├── Templates/
│   ├── BlueprintRecipe_Template.md
│   ├── Checklist_Networking.md
│   └── Schema_Ability_DT.csv
└── examples/                         ← 新增整个目录
    ├── health-potion-pickup.md       ← 新增（基础多人交互范例）
    ├── rpg-ability-system.md         ← 新增（数据驱动范例）
    └── target-lock-system.md         ← 新增（大规模多人范例）
```

---

## 5.5 examples 写作的进阶技巧

### 5.5.1 范例数量的权衡

| 范例数 | 优点 | 缺点 | 适用 |
|---|---|---|---|
| 1 个 | 占 token 少 | 学不到多样性 | 输出格式单一 |
| 2-3 个 | 平衡 | 中等 | **推荐**：覆盖 2-3 个典型场景 |
| 4+ 个 | 多样性强 | 占 token 多，可能干扰 | 复杂领域，多种子场景 |

**经验法则**：从 2 个开始，发现 Claude 在某类场景下输出不达标，再加第 3 个。

### 5.5.2 范例场景的选择原则

选范例场景时遵循"**3 种典型**"原则：

1. **基础场景**：覆盖最常见的需求（如 health-potion 是最基础的多人交互）
2. **数据驱动场景**：展示 DataTable/schema 的填充（如 rpg-ability-system）
3. **极端场景**：展示边界处理（如 target-lock-system 的 40v40 性能）

避免选"特化场景"——比如"赛博朋克风格 NPC 对话系统"太具体，泛化价值低。

### 5.5.3 范例的"质量标杆"原则

范例不是"凑数"，每个范例都必须是**你能写出的最好版本**。因为 Claude 会向范例对齐——范例有多好，输出就有多好。

写范例时的自检：
- [ ] 每段都有具体内容（不是占位符）
- [ ] Replication Notes 覆盖 4 维度（Runs on / RPCs / Replicated Vars / Bandwidth）
- [ ] Test Checklist 包含 PIE / Dedicated / Latency 三场景 + 至少 2 个 Edge Case
- [ ] 命名严格遵守 SKILL.md 前缀
- [ ] 资产树用 ASCII 画出来，结构清晰
- [ ] Blueprint Recipe 用编号列表，节点名加粗

### 5.5.4 范例的"反例"用法

进阶用法：在范例里加"**❌ 反例**"，告诉 Claude 不要这么写：

```markdown
### Replication Notes

- **Runs on**:
  - Overlap 检测：仅 Server
  - ❌ **不要**在 Client 跑 Overlap 检测（会导致 desync）
  - ❌ **不要**用 Multicast 同步 cosmetic 状态（用 RepNotify 替代，省带宽）

- **RPCs**:
  - `Server_RequestPickup`: Client → Server（Unreliable）
  - ❌ **不要**用 Reliable（拾取可丢失重发，Reliable 会拥堵）
```

反例比"正面规则"更有效——Claude 看到反例会主动避免类似模式。

### 5.5.5 范例与 Templates 的协同

范例应该展示"Templates 的骨架被填满后长什么样"。所以范例里要**显式呼应 Templates**：

```markdown
### DT_Abilities 数据表（参照 Schema_Ability_DT.csv）

| AbilityId | DisplayName | AbilityType | ... |
|---|---|---|---|
| FIREBALL | Fireball | Damage | ... |
```

这种呼应让 Claude 知道"Templates/Schema_Ability_DT.csv 里的字段，填出来应该是这个样子"。

---

## 5.6 添加 examples 后的效果对比

### 5.6.1 添加前 vs 添加后

| 维度 | 无 examples | 有 examples |
|---|---|---|
| **结构正确性** | ✅ 6 段齐全（SKILL.md 约束） | ✅ 6 段齐全 |
| **命名合规** | ✅ BP_/DT_ 前缀（SKILL.md 约束） | ✅ BP_/DT_ 前缀 |
| **Replication Notes 深度** | ⚠️ 可能漏维度 | ✅ 4 维度齐全（范例示范） |
| **Test Checklist 完整性** | ⚠️ 可能少 Edge Case | ✅ PIE/Dedicated/Latency + Edge Case |
| **Blueprint Recipe 粒度** | ⚠️ 可能太粗 | ✅ 编号 + 节点名 + 条件分支 |
| **资产树画法** | ⚠️ 可能用文字描述 | ✅ ASCII 树状结构 |
| **大规模多人考量** | ⚠️ 可能漏性能段 | ✅ Performance Notes 专项段 |
| **输出风格一致性** | ⚠️ 每次风格漂移 | ✅ 风格向范例对齐 |

### 5.6.2 何时能感受到 examples 的效果

加 examples 后，**新对话第一次提问**就能感受到效果。对比测试法：

```
测试 1（无 examples）：
  用户："设计一个护甲拾取系统"
  → Claude 输出（可能 Replication Notes 漏 Bandwidth 段）

测试 2（有 examples）：
  用户："设计一个护甲拾取系统"
  → Claude 先读 examples/health-potion-pickup.md
  → 输出（Replication Notes 4 维度齐全，因为范例就是这么写的）
```

如果两个测试输出差异明显，说明 examples 在发挥作用。

### 5.6.3 examples 的局限

examples 不是万能的：

- ❌ **不能修复 SKILL.md 的结构错误**：如果 SKILL.md 的 Output format 写错了，examples 救不了
- ❌ **不能让 Claude 突破能力上限**：范例有多好，输出上限就是范例水平
- ❌ **不能替代领域约定**：命名前缀等硬约束还是要在 SKILL.md 写死
- ⚠️ **占 token**：3 个范例可能 3000+ tokens，长对话会挤预算

**最佳实践**：examples 是 SKILL.md 的"质量放大器"，不是替代品。先把 SKILL.md 写精确，再用 examples 提升输出质量。

---

## 5.7 本篇小结

### 三个核心结论

1. **examples 是"已填充的范例"，与 Templates 的"待填充骨架"互补**。Templates 管"形"，examples 管"神"。
2. **examples 按需读取，不自动注入**。最可靠的方式是在 SKILL.md 显式引用。
3. **examples 通过 few-shot 学习对齐输出质量**——深度、措辞、领域细节、风格四个维度。

### 何时加 examples 的决策

```
输出有问题？
   │
   ├─ 结构错 → 改 SKILL.md
   ├─ 约定不守 → 改 SKILL.md
   └─ 深度/措辞/细节不够 → 加 examples！
```

### 添加 examples 的 5 步法

1. 确定要覆盖的 2-3 个典型场景（基础 / 数据驱动 / 极端）
2. 创建 `examples/` 目录
3. 每个范例完整填充 6 段，质量必须是"你能写的最好版本"
4. 在 SKILL.md 的 Output format 段后显式引用 examples
5. 自检：范例完整、命名合规、4 维度覆盖、SKILL.md 引用明确

### 完成后的目录结构

```
ue57-gamepiece-designer/
├── SKILL.md
├── _meta.json
├── Templates/          ← 待填充骨架
└── examples/           ← 已填充范例（本篇新增）
    ├── health-potion-pickup.md
    ├── rpg-ability-system.md
    └── target-lock-system.md
```

### 下一步

完成 examples 后，可以做 A/B 测试：同一个输入在"有 examples"和"无 examples"两种 skill 配置下跑，对比输出质量。这是验证 examples 效果的最直接方法。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
