# 第 8 篇：C++ 优先的休闲联机游戏改造案例（推砖块碾压敌人）

> 本篇是一个具体案例：**不超过 10 人联机的休闲动作游戏，核心玩法是推动砖块碾压敌人**。
> 技术约束很特别——**UE5.7 原生架构，但业务逻辑尽量用 C++ 实现，蓝图只作为配置层**。
>
> 这个约束的目的不是性能，而是**让大模型能参与开发、读懂代码**。
>
> 本篇回答：
> 1. 为什么"C++ 优先 + 蓝图配置层"这种架构适合大模型协作
> 2. 这种架构下 skill 该怎么改造（与第 6、7 篇的差异）
> 3. "推砖块碾压敌人"系统的完整范例
>
> 阅读建议：先读第 1 章理解架构动机，再对照第 3-5 章看改造方案，最后用第 6 章范例验证理解。

---

## 1. 项目画像与架构动机

### 1.1 项目速览

```
┌────────────────────────────────────────────────────────────┐
│  游戏类型：休闲动作游戏                                    │
│  玩法：推动砖块碾压敌人                                    │
│  联机规模：≤10 人（小规模）                                │
│  技术栈：UE5.7 原生（C++ + Blueprint）                    │
│  架构策略：C++ 优先，蓝图只做配置层                        │
│  目标：让大模型参与开发，能读懂代码                        │
└────────────────────────────────────────────────────────────┘
```

### 1.2 "推砖块碾压敌人"玩法拆解

为了让改造方案有具体载体，先拆解这个玩法：

| 玩法要素 | 说明 |
|---|---|
| 砖块 | 可被玩家推动的物理方块，有质量、摩擦力、伤害判定 |
| 推动机制 | 玩家靠近砖块按交互键 → 砖块获得速度 → 物理模拟移动 |
| 碾压判定 | 砖块移动中碰撞敌人 → 按速度计算伤害 → 敌人受伤/死亡 |
| 多人交互 | 多个玩家可同时推同一砖块（合力） |
| 关卡设计 | 砖块 + 敌人 + 障碍物的组合，玩家协作清场 |

### 1.3 为什么"C++ 优先 + 蓝图配置层"

这是这个案例最关键的架构决策，必须先讲清楚动机。

#### 动机 1：大模型读 C++ 比读蓝图强

```
蓝图（Blueprint）：
  • 视觉脚本，节点+连线
  • 大模型只能通过文本描述理解（"节点 A 连到节点 B"）
  • 读懂一个复杂蓝图需要大量文字转译，信息损失大
  • 改蓝图 = 在编辑器里拖节点，大模型无法直接操作

C++ 代码：
  • 纯文本，结构化
  • 大模型原生能读、能写、能改
  • 类继承、函数调用、变量关系都明文可见
  • 改 C++ = 改文本，大模型可直接生成代码
```

**结论**：把业务逻辑放 C++，大模型能真正"参与开发"——读懂、生成、修改。放蓝图里，大模型只能"看图说话"。

#### 动机 2：蓝图作为配置层的好处

虽然逻辑在 C++，但蓝图不是没用——它做"配置层"：

| 蓝图做什么 | 举例 |
|---|---|
| 暴露 C++ 类的可调参数 | 调砖块质量、摩擦力、伤害系数 |
| 配置视觉资源 | 绑定 Mesh、特效、音效 |
| 子类化做变体 | BP_Brick_Heavy（重砖块）、BP_Brick_Ice（冰砖块） |
| 数据驱动 | 蓝图默认值作为"预制体"配置 |

这种分工让**设计师调蓝图（配置层）、程序员写 C++（逻辑层）、大模型读改 C++（参与开发）**，三者职责清晰。

#### 动机 3：10 人小规模可以用 UE 原生 replication

```
大规模（100+）：需要自定义协议、 relevancy 优化（第 7 篇场景）
小规模（≤10）：UE 原生 replication 完全够用
  • 10 个 actor × 几个 replicated vars = 几百字节/帧
  • 不需要自定义协议层
  • 不需要 bigworld 这种专门服务端
```

**结论**：这种小规模项目，网络层不用改，**保留原版 skill 的 Replication Notes 段**即可，只改规模数字。

### 1.4 与原版 skill 的冲突点

| 原版假设 | 本项目实际 | 冲突程度 |
|---|---|---|
| 蓝图是主逻辑层 | C++ 是主逻辑层，蓝图只配置 | 🔴 严重冲突 |
| Blueprint node chain recipes | 应该是 C++ class design | 🔴 严重冲突 |
| 40v40 规模 | ≤10 人 | 🟡 中度冲突（改数字） |
| UE5.7 | UE5.7 | ✅ 不冲突 |
| Replication Notes | 保留（10 人用 UE 原生 replication） | ✅ 不冲突 |
| 命名 BP_/DT_/BPI_ | 需要加 C++ 类前缀规范 | 🟡 中度冲突 |

**核心冲突**：原版产出的"蓝图节点链"在这种架构里没用——逻辑在 C++，skill 应该产出"C++ 类设计 + 蓝图配置规范"。

---

## 2. 架构原理：C++ 优先的代码组织

### 2.1 三层代码结构

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: C++ 逻辑层（大模型读写的主战场）                  │
│  ─────────────────────────                                   │
│  • 游戏逻辑类（推砖块、伤害计算、状态机）                   │
│  • 用 UE 宏暴露关键属性到蓝图（UPROPERTY/EditAnywhere）     │
│  • 用 UE 宏暴露关键函数到蓝图（UFUNCTION/BlueprintCallable）│
│  • 服务器权威判定、replication 配置                          │
└─────────────────────────────────────────────────────────────┘
                          ↑ 暴露
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: 蓝图配置层（设计师调参数）                        │
│  ─────────────────────────                                   │
│  • BP_Brick（继承 C++ ABrick 类）                            │
│  • 在蓝图默认值里调 Mass、Friction、DamageMultiplier         │
│  • 绑定 Mesh、Material、VFX、Audio                           │
│  • 做变体：BP_Brick_Heavy、BP_Brick_Ice                      │
└─────────────────────────────────────────────────────────────┘
                          ↑ 引用
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: 数据配置层（策划填表）                            │
│  ─────────────────────────                                   │
│  • DT_BrickStats（砖块数值表）                               │
│  • DT_EnemyStats（敌人数值表）                               │
│  • 关卡里放置 BP_Brick 实例                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 C++ 暴露给蓝图的关键宏

这是"C++ 优先 + 蓝图配置"架构的核心技术点。大模型必须理解这些宏：

```cpp
// UPROPERTY — 暴露属性到蓝图编辑器
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick")
float Mass = 100.0f;  // 设计师可在蓝图默认值里改

// UFUNCTION — 暴露函数给蓝图调用
UFUNCTION(BlueprintCallable, Category = "Brick")
void Push(FVector Direction, float Force);

// UFUNCTION — 蓝图可重写（C++ 写默认逻辑，蓝图可覆盖）
UFUNCTION(BlueprintImplementableEvent)
void OnCrushedEnemy(AActor* Enemy);

// UFUNCTION — C++ 调蓝图实现的函数（反向回调）
UFUNCTION(BlueprintNativeEvent)
void OnBrickStopped();
```

**4 种暴露模式的区别**：

| 宏 | 含义 | 谁实现 | 典型用途 |
|---|---|---|---|
| `EditAnywhere` | 属性可在编辑器改 | C++ 默认值 + 蓝图覆盖 | Mass、Damage 等参数 |
| `BlueprintReadWrite` | 属性蓝图可读写 | C++ 持有，蓝图访问 | 运行时状态 |
| `BlueprintCallable` | 函数蓝图可调用 | C++ 实现 | Push()、TakeDamage() |
| `BlueprintImplementableEvent` | 函数蓝图实现 | 蓝图实现 | OnCrushedEnemy（视觉响应） |
| `BlueprintNativeEvent` | 函数 C++ 有默认实现，蓝图可覆盖 | C++ 默认 + 蓝图可选覆盖 | OnBrickStopped |

**为什么这套宏对大模型友好**：
- 属性和函数的"可见性"在头文件里明文标注，大模型一读就知道哪些是给蓝图用的
- 不需要看蓝图编辑器截图，光读 .h 文件就能理解类的接口
- 改参数 = 改 UPROPERTY 的默认值；改逻辑 = 改 UFUNCTION 的实现，都是纯文本操作

### 2.3 让大模型参与开发的设计原则

skill 要把以下原则写进约束，确保 C++ 代码对大模型友好：

```markdown
## C++ code conventions (for AI readability)
- 每个类写清晰的头文件注释（职责、用法、网络行为）
- 公开接口用 UPROPERTY/UFUNCTION 宏明确暴露
- 私有实现放 .cpp，头文件保持精简
- 复杂逻辑拆成小函数（单函数 < 50 行）
- 用 UE 的 TWeakObjectPtr / TSubclassOf 等类型安全指针
- 避免深层继承（≤3 层），优先用组合
- 关键算法加注释说明"为什么这么做"
```

**为什么这些原则重要**：
- 大模型读代码靠"模式识别"，清晰的头文件 + 小函数 + 注释让模式更明显
- UE 的智能指针类型在文本里自解释，比裸指针安全且易读
- 组合优于继承，让大模型不用追踪长长的继承链

---

## 3. 改造方案：7 大改动

下面按改动顺序逐一讲"做什么 / 怎么做 / 为什么"。

### 3.1 改动 1：description 重写

**原版**：
```yaml
description: Designs UE5.7 multiplayer-friendly game pieces (Blueprint node chains, data schemas, asset naming, and test checklists). Text-only, no scripts.
```

**改造后**：
```yaml
description: Designs UE5.7 casual action game pieces (≤10 players, push-brick mechanics) with C++-first architecture. Produces C++ class designs, Blueprint config specs, DataTable schemas, replication notes, and test checklists. Text-only, outputs C++ code for AI collaboration.
```

**为什么**：
- 明确"休闲动作游戏 + 推砖块玩法 + ≤10 人"
- 强调"C++-first architecture"
- 产物从"Blueprint node chains"改为"C++ class designs + Blueprint config specs"
- 末尾加"outputs C++ code for AI collaboration"，声明设计目标

### 3.2 改动 2：What 段产物清单重写

**原版 5 个产物**（蓝图中心）→ **改造后 6 个产物**（C++ 中心）：

```markdown
## What this skill does
When the user asks for a UE system or game piece in this casual action game
(≤10 players, push-brick mechanics), produce a structured design ready to
implement with C++-first architecture:

- **C++ class design** (header files: class hierarchy, UPROPERTY/UFUNCTION exposure, replication config)
- **Blueprint config layer** (which C++ properties to expose, BP subclasses for variants)
- **DataTable schemas** (gameplay stats tables, CSV format)
- **Replication notes** (≤10 players, UE native replication, server authority)
- **AI-readable code conventions** (comments, file organization, naming for LLM collaboration)
- **Test checklist** (PIE 2P, dedicated server 10P, physics edge cases, latency)
```

**为什么**：
- **C++ class design 排第一**：这是主产物，大模型读写的核心
- **Blueprint config layer 排第二**：明确蓝图只是配置，不是逻辑
- **新增"AI-readable code conventions"**：把"让大模型能读"作为显式产物
- **Replication notes 保留**：10 人小规模用 UE 原生 replication，不删段只改规模

### 3.3 改动 3：Output format 重构 Implementation 段

**原版**：
```markdown
5) **Implementation**
   - **Blueprint Recipe** (step-by-step)
   - **Replication Notes** (Server vs Client, replicated vars, RPCs)
   - **Assets / Naming / Folders**
```

**改造后**：
```markdown
5) **Implementation**
   - **C++ Class Design** (header files with UPROPERTY/UFUNCTION; refer to Templates/CppClass_Template.md)
   - **Blueprint Config Layer** (exposed properties, BP subclasses, default values)
   - **Replication Notes** (≤10 players, UE native, server authority, replicated vars)
   - **Physics Notes** (for push-brick: mass, friction, collision response, force application)
   - **Assets / Naming / Folders**
6) **Test Checklist**
```

**为什么**：
- **C++ Class Design 替代 Blueprint Recipe**：主产物从蓝图节点链变成 C++ 头文件
- **保留 Blueprint Config Layer 子段**：蓝图还有用，但只做配置
- **新增 Physics Notes 子段**：推砖块玩法强依赖物理，必须单独段写物理参数
- **Replication Notes 保留但规模改 ≤10**：小规模用 UE 原生网络

### 3.4 改动 4：命名规范扩展为 C++ + 蓝图双层

**原版**只有 UE 资产命名。改造后要加 C++ 类命名规范（UE 宏前缀）。

**改造后**：
```markdown
## Naming + folders (default)

### C++ classes (logic layer)
- Actor classes: `A<Thing>` (e.g., ABrick, AEnemyCharacter)
- Actor Component: `U<Thing>Component` (e.g., UPushComponent)
- Game Instance: `U<Thing>GameInstance`
- Game Mode: `A<Thing>GameMode`
- Player Controller: `A<Thing>PlayerController`
- Structs: `F<Thing>` (e.g., FBrickStats)
- Enums: `E<Thing>` (e.g., EBrickType)
- Interfaces: `I<Thing>` (e.g., IPushable)
- File names: match class name (Brick.h / Brick.cpp)

### Blueprint assets (config layer only)
- Root: `/Game/Blueprints/<SystemName>/`
- BP subclasses of C++: `BP_<Thing>` (e.g., BP_Brick_Heavy, BP_Brick_Ice)
- Widget Blueprints: `WBP_<Thing>`
- DataTables: `DT_<Thing>`
- Materials: `M_<Thing>`
- Niagara Systems: `NS_<Effect>`
```

**为什么**：
- **C++ 类前缀严格遵循 UE 宏规范**（A/U/F/E/I），大模型读 .h 时靠这些前缀识别类型
- **蓝图前缀保留 BP_**，但加注释"config layer only"，强调不做逻辑
- **文件名 = 类名**：Brick.h 对应 ABrick 类，大模型找文件不用猜

### 3.5 改动 5：Multiplayer defaults 改规模 + 加物理规则

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
## Multiplayer + Physics defaults (unless user says otherwise)

### Network (≤10 players, UE native replication)
- Server authoritative for all gameplay state (brick position, enemy health, push forces)
- Client sends intent via Server RPC (push request, movement input)
- Replicate brick transform (RepMovement) and key state vars
- Use Client RPC for cosmetic feedback (VFX, audio)
- 10 players × ~5 replicated actors each = ~50 actors, well within UE native capacity

### Physics (push-brick mechanics)
- Brick uses UStaticMeshComponent with SimulatePhysics enabled
- Mass: 50-500 (tunable per BP subclass)
- Push force applied via UPrimitiveComponent::AddForce
- Collision response: Brick→Enemy = Overlap (trigger crush event)
- Damage = ImpactVelocity × Mass × DamageMultiplier (server calculates)
- Use Async physics scene for server authority (UE5.7 Chaos physics)

### C++ architecture (non-negotiable)
- ❌ Never implement gameplay logic in Blueprint Event Graph
- ❌ Never put damage calculation in Blueprint
- ✅ All gameplay logic in C++ classes
- ✅ Blueprint only sets default values and binds assets
- ✅ Expose tunable params via UPROPERTY(EditAnywhere)
```

**为什么**：
- **Network 段改 40v40 → ≤10**：小规模用 UE 原生 replication，保留这段
- **新增 Physics 段**：推砖块玩法强依赖物理，必须写物理参数和伤害公式
- **新增 C++ architecture 段**：用反例规则强制"C++ 优先，蓝图配置"，这是本项目的核心约束

### 3.6 改动 6：Templates 重构

原版的 `BlueprintRecipe_Template.md` 在 C++ 优先架构里没用——要换成 C++ 类模板。

#### 替换：`Templates/CppClass_Template.md`（替代 BlueprintRecipe_Template.md）

```markdown
# C++ Class Design Template

## Class Overview
- **Class name**: `A<Thing>` / `U<Thing>Component`
- **Parent class**: `<ParentName>` (e.g., AActor / UActorComponent)
- **Responsibility**: <one sentence>
- **Network role**: Server authoritative / Client cosmetic / Both

## Header File (.h)
```cpp
#pragma once

#include "CoreMinimal.h"
#include "<ParentHeader>.h"
#include "<Thing>.generated.h"

UCLASS(<config like Abstract/Blueprintable>)
class A<Thing> : public A<ParentClass>
{
    GENERATED_BODY()

public:
    A<Thing>();

    // === Replication ===
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    // === Blueprint-callable API ===
    UFUNCTION(BlueprintCallable, Category = "<Thing>")
    void <Action>(<params>);

    // === Blueprint events (implemented in BP) ===
    UFUNCTION(BlueprintImplementableEvent, Category = "<Thing>")
    void On<Event>(<params>);

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;  // if needed

    // === Server-side logic ===
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_<Action>(<params>);

    // === Client-side RPC ===
    UFUNCTION(Client, Reliable)
    void Client_<Notify>(<params>);

    // === Exposed properties (config layer) ===
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "<Thing>|Stats")
    float <StatName> = <default>;

    // === Replicated properties ===
    UPROPERTY(ReplicatedUsing = OnRep_<Name>)
    <Type> <Name>;

    UFUNCTION()
    void OnRep_<Name>();

private:
    // Internal state (not exposed)
    <Type> <PrivateVar>;
};
```

## Implementation Notes (.cpp)
- <key method 1>: <what it does, why>
- <key method 2>: <what it does, why>
- Replication: which vars replicated, RepNotify usage
- Physics: if applicable, force application details

## Blueprint Config Layer
- BP subclass name: `BP_<Variant>`
- Default value overrides:
  - <Property>: <value>
- Asset bindings:
  - Mesh: <asset path>
  - Material: <asset path>
```

#### 保留：`Templates/Checklist_Networking.md`（改规模）

把 `40v40` 改成 `≤10 players`，其他 4 维度（Authority/Replication/Performance/Testing）保留。

#### 新增：`Templates/Checklist_Physics.md`

```markdown
# Physics Checklist (Push-Brick Mechanics)

## Physics Setup
- [ ] Brick has UStaticMeshComponent with SimulatePhysics = true
- [ ] Brick Mass set (50-500 range)
- [ ] Collision response configured: Brick→Enemy = Overlap
- [ ] Brick→Player = Block (player can't walk through)
- [ ] Brick→Wall = Block (can't push through walls)

## Force Application
- [ ] Push force applied via AddForce (not SetLocation)
- [ ] Force direction = player facing direction
- [ ] Force magnitude scales with player push strength
- [ ] Multiple players push = forces stack (server sums)

## Damage Calculation (server-side)
- [ ] Damage = ImpactVelocity × Mass × DamageMultiplier
- [ ] Only apply damage when velocity > MinCrushThreshold
- [ ] Server validates collision events (anti-cheat)
- [ ] Damage type set correctly (DT_Crush)

## Edge Cases
- [ ] Brick stuck against wall: velocity = 0, no damage
- [ ] Two bricks collide: physics resolves, no double damage
- [ ] Enemy pushed into brick: no damage (only brick→enemy)
- [ ] Brick falls off level: destroyed + respawn timer
- [ ] Brick stationary on enemy: continuous damage? (design decision)

## Testing
- [ ] PIE: push brick into enemy, verify damage
- [ ] Multi-client: both clients see brick move + enemy die
- [ ] Latency: brick position syncs within 100ms
- [ ] Stress: 10 players pushing 10 bricks, server frame < 16ms
```

### 3.7 改动 7：examples 范例用推砖块场景

加 `examples/push-brick-system.md`，完整范例见第 6 章。

---

## 4. 完整 SKILL.md（改造后全文）

```markdown
---
name: casual-action-cpp-gamepiece-designer
description: Designs UE5.7 casual action game pieces (≤10 players, push-brick mechanics) with C++-first architecture. Produces C++ class designs, Blueprint config specs, DataTable schemas, replication notes, and test checklists. Text-only, outputs C++ code for AI collaboration.
---

# Casual Action Gamepiece Designer (C++-First, Text-Only)

## What this skill does
When the user asks for a UE system or game piece in this casual action game
(≤10 players, push-brick mechanics), produce a structured design ready to
implement with C++-first architecture:

- **C++ class design** (header files: class hierarchy, UPROPERTY/UFUNCTION exposure, replication config)
- **Blueprint config layer** (which C++ properties to expose, BP subclasses for variants)
- **DataTable schemas** (gameplay stats tables, CSV format)
- **Replication notes** (≤10 players, UE native replication, server authority)
- **AI-readable code conventions** (comments, file organization, naming for LLM collaboration)
- **Test checklist** (PIE 2P, dedicated server 10P, physics edge cases, latency)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (trigger event, physics params, network constraints)
3) **Outputs** (C++ classes, BP subclasses, DataTables, assets)
4) **Assumptions**
5) **Implementation**
   - **C++ Class Design** (header files with UPROPERTY/UFUNCTION; refer to Templates/CppClass_Template.md)
   - **Blueprint Config Layer** (exposed properties, BP subclasses, default values)
   - **Replication Notes** (≤10 players, UE native, server authority, replicated vars)
   - **Physics Notes** (mass, friction, collision, force, damage formula)
   - **Assets / Naming / Folders**
6) **Test Checklist** (refer to Templates/Checklist_Networking.md and Templates/Checklist_Physics.md)

> **参考范例**：生成前先读 `examples/push-brick-system.md`（推砖块系统），
> 对照其 C++ 头文件粒度和物理参数深度。

## Naming + folders (default)

### C++ classes (logic layer)
- Actor classes: `A<Thing>` (e.g., ABrick, AEnemyCharacter)
- Actor Component: `U<Thing>Component` (e.g., UPushComponent)
- Game Mode: `A<Thing>GameMode`
- Player Controller: `A<Thing>PlayerController`
- Structs: `F<Thing>` (e.g., FBrickStats)
- Enums: `E<Thing>` (e.g., EBrickType)
- Interfaces: `I<Thing>` (e.g., IPushable)
- File names: match class name (Brick.h / Brick.cpp)

### Blueprint assets (config layer only)
- Root: `/Game/Blueprints/<SystemName>/`
- BP subclasses of C++: `BP_<Thing>` (e.g., BP_Brick_Heavy, BP_Brick_Ice)
- Widget Blueprints: `WBP_<Thing>`
- DataTables: `DT_<Thing>`
- Materials: `M_<Thing>`
- Niagara Systems: `NS_<Effect>`

## Multiplayer + Physics defaults (unless user says otherwise)

### Network (≤10 players, UE native replication)
- Server authoritative for all gameplay state (brick position, enemy health, push forces)
- Client sends intent via Server RPC (push request, movement input)
- Replicate brick transform (RepMovement) and key state vars
- Use Client RPC for cosmetic feedback (VFX, audio)
- 10 players × ~5 replicated actors each = ~50 actors, well within UE native capacity

### Physics (push-brick mechanics)
- Brick uses UStaticMeshComponent with SimulatePhysics enabled
- Mass: 50-500 (tunable per BP subclass)
- Push force applied via UPrimitiveComponent::AddForce
- Collision response: Brick→Enemy = Overlap (trigger crush event)
- Damage = ImpactVelocity × Mass × DamageMultiplier (server calculates)
- Use Async physics scene for server authority (UE5.7 Chaos physics)

### C++ architecture (non-negotiable)
- ❌ Never implement gameplay logic in Blueprint Event Graph
- ❌ Never put damage calculation in Blueprint
- ✅ All gameplay logic in C++ classes
- ✅ Blueprint only sets default values and binds assets
- ✅ Expose tunable params via UPROPERTY(EditAnywhere)

## C++ code conventions (for AI readability)
- Each class has clear header comment (responsibility, usage, network behavior)
- Public interface explicitly exposed via UPROPERTY/UFUNCTION macros
- Private implementation in .cpp, keep headers lean
- Split complex logic into small functions (single function < 50 lines)
- Use UE type-safe pointers (TWeakObjectPtr / TSubclassOf)
- Avoid deep inheritance (≤3 layers), prefer composition
- Key algorithms commented with "why this approach"
```

---

## 5. 让大模型参与开发的设计考虑

这一章单独讲，因为这是本项目 skill 区别于其他改造案例的核心目标。

### 5.1 "可被大模型读写"的 C++ 代码长什么样

**反例**（大模型难读）：
```cpp
// Brick.h（无注释、宏乱用、命名模糊）
class ABrick : public AActor {
    UPROPERTY() float x = 1.0f;
    UPROPERTY() float y = 2.0f;
    void DoSomething();
    void HandleIt(int a, int b);
};
```

**正例**（大模型易读）：
```cpp
// Brick.h
/**
 * ABrick - 可被玩家推动的物理砖块
 *
 * 职责：承载物理模拟、计算碾压伤害、同步状态到客户端
 * 网络角色：服务器权威（位置/速度/伤害判定），客户端只做视觉
 * 配合蓝图：BP_Brick_* 子类配置 Mass/Mesh/DamageMultiplier
 */
UCLASS(Blueprintable)
class ABrick : public AActor
{
    GENERATED_BODY()

public:
    ABrick();

    // 玩家调用推动砖块（BlueprintCallable 让蓝图按键事件能触发）
    UFUNCTION(BlueprintCallable, Category = "Brick|Action")
    void RequestPush(FVector Direction, float Force);

protected:
    // 服务器处理推动请求（客户端发 RPC，服务器执行物理）
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_Push(FVector Direction, float Force);

    // === 可配置属性（蓝图子类可改默认值） ===
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick|Stats",
        meta = (ClampMin = "50.0", ClampMax = "500.0"))
    float Mass = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick|Stats")
    float DamageMultiplier = 1.0f;

private:
    UPROPERTY(VisibleAnywhere)
    UStaticMeshComponent* MeshComp;
};
```

**差异点**：
- 头文件注释说明"职责 / 网络角色 / 蓝图配合方式"
- 函数名自解释（`RequestPush` 而非 `DoSomething`）
- 参数名清晰（`Direction, Force` 而非 `a, b`）
- UPROPERTY 带 `meta = (ClampMin, ClampMax)` 限制范围
- 分类用 `Category = "Brick|Stats"` 组织

### 5.2 skill 如何强制输出可读代码

在 SKILL.md 的 `C++ code conventions` 段写死这些规则。Claude 生成 C++ 头文件时会遵守：
- 必写头文件注释（职责/网络角色/蓝图配合）
- 函数名自解释
- UPROPERTY 带 meta 约束
- Category 组织属性

这是 skill 约束 C++ 代码质量的方式——**不是靠 lint 工具，靠自然语言规则**。

### 5.3 大模型参与的 3 个工作流

这种架构下，大模型可以参与：

#### 工作流 1：读懂现有系统

```
用户：把 ABrick 类的推砖逻辑讲给我听
Claude：（读 Brick.h + Brick.cpp）→ 用自然语言解释
```

skill 约束 C++ 代码可读，让大模型读得准。

#### 工作流 2：生成新系统

```
用户：加一个"冰砖块"，推动后会留下冰面，敌人踩上去会滑倒
Claude：（用本 skill）→ 输出 AIceBrick 类的 C++ 设计 + BP_Brick_Ice 配置
```

skill 输出的 C++ 头文件可直接复制到项目里。

#### 工作流 3：修改现有系统

```
用户：把砖块的最大质量从 500 改成 800，并加一个"超重砖块"变体
Claude：→ 给出 ABrick.h 的修改 diff + BP_Brick_SuperHeavy 的配置
```

因为逻辑在 C++，修改 = 改文本，大模型直接生成 diff。

---

## 6. 完整范例：examples/push-brick-system.md

```markdown
# Example: Push Brick Crush System

> 用户输入："设计推砖块碾压敌人系统，10 人联机，C++ 优先架构"

## 1) Goal
设计推砖块系统：玩家靠近砖块按 E → 施加力推动砖块 → 砖块物理移动 →
碰撞敌人时按速度计算伤害 → 敌人受伤/死亡。支持 10 人联机，C++ 实现逻辑，
蓝图只配置砖块变体。

## 2) Inputs
- 玩家输入：Enhanced Input Action "IA_Interact"（E 键）
- 触发条件：玩家在砖块交互范围内（Sphere Overlap）
- 物理参数：Mass、DamageMultiplier（蓝图可配）
- 服务器权威：推动请求和伤害判定都在服务器

## 3) Outputs
- C++ 类：ABrick、UPushComponent、AEnemyCharacter
- C++ 接口：IPushable
- C++ 结构：FBrickCrushResult
- 蓝图配置：BP_Brick_Standard、BP_Brick_Heavy、BP_Brick_Ice
- DataTable：DT_BrickStats
- 关卡资产：M_Brick_*、NS_Crush_Impact

## 4) Assumptions
- 假设 UE5.7，使用 Chaos 物理引擎
- 假设 Enhanced Input 已配置
- 假设 ≤10 人联机，用 UE 原生 replication
- 假设玩家 Character 已有交互组件基础
- 假设敌人 AEnemyCharacter 已有 HealthComponent

> 如以上假设不成立，请明确告知，会调整设计。

## 5) Implementation

### C++ Class Design

#### IPushable.h（接口）
```cpp
// IPushable - 可被推动的物体接口
UINTERFACE(BlueprintType)
class UPushable : public UInterface { GENERATED_BODY() };

class IPushable
{
    GENERATED_BODY()
public:
    // 请求推动（客户端调用，转发到服务器）
    UFUNCTION(BlueprintNativeEvent, Category = "Push")
    void RequestPush(AActor* Pusher, FVector Direction, float Force);
};
```

#### Brick.h（核心类）
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Interfaces/Pushable.h"
#include "Brick.generated.h"

class UStaticMeshComponent;
class UCapsuleComponent;

/**
 * ABrick - 可被玩家推动的物理砖块
 *
 * 职责：承载物理模拟、计算碾压伤害、同步状态到客户端
 * 网络角色：服务器权威（位置/速度/伤害），客户端只做视觉
 * 蓝图配合：BP_Brick_* 子类配置 Mass/Mesh/DamageMultiplier
 */
UCLASS(Blueprintable)
class ABrick : public AActor, public IPushable
{
    GENERATED_BODY()

public:
    ABrick();

    // === IPushable 实现 ===
    virtual void RequestPush_Implementation(AActor* Pusher, FVector Direction, float Force) override;

    // === Blueprint 可调用 ===
    UFUNCTION(BlueprintCallable, Category = "Brick|Query")
    float GetCurrentSpeed() const;

    // === Replication ===
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
    virtual void BeginPlay() override;

    // 服务器处理推动（客户端发 RPC）
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_Push(AActor* Pusher, FVector Direction, float Force);

    // 服务器碰撞伤害判定
    UFUNCTION()
    void OnHit(UPrimitiveComponent* HitComp, AActor* OtherActor,
               UPrimitiveComponent* OtherComp, FVector NormalImpulse,
               const FHitResult& Hit);

    // 计算碾压伤害（服务器调用）
    float CalculateCrushDamage(float ImpactVelocity) const;

    // 蓝图实现的事件（视觉响应）
    UFUNCTION(BlueprintImplementableEvent, Category = "Brick|Event")
    void OnCrushedEnemy(AActor* Enemy, float Damage);

    // === 可配置属性（蓝图子类可改默认值） ===
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick|Stats",
        meta = (ClampMin = "50.0", ClampMax = "500.0"))
    float Mass = 100.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick|Stats")
    float DamageMultiplier = 1.0f;

    // 低于此速度不造成伤害（防止轻微碰撞）
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Brick|Stats")
    float MinCrushVelocity = 200.0f;

    // === 复制属性 ===
    UPROPERTY(ReplicatedUsing = OnRep_CrushCount)
    int32 CrushCount = 0;

    UFUNCTION()
    void OnRep_CrushCount();

private:
    // 网格组件（物理模拟）
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components",
        meta = (AllowPrivateAccess = "true"))
    UStaticMeshComponent* MeshComp;

    // 交互检测范围
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components",
        meta = (AllowPrivateAccess = "true"))
    USphereComponent* InteractionSphere;
};
```

#### Brick.cpp（关键实现）
```cpp
#include "Brick.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SphereComponent.h"
#include "Engine/Engine.h"
#include "Net/UnrealNetwork.h"

ABrick::ABrick()
{
    PrimaryActorTick.bCanEverTick = false;  // 物理驱动，不需要 Tick

    bReplicates = true;
    bReplicateMovement = true;  // 自动同步位置/速度

    MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComp"));
    MeshComp->SetSimulatePhysics(true);
    MeshComp->SetMassOverrideInKg(NAME_None, Mass);
    MeshComp->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);
    RootComponent = MeshComp;

    InteractionSphere = CreateDefaultSubobject<USphereComponent>(TEXT("InteractionSphere"));
    InteractionSphere->SetupAttachment(MeshComp);
    InteractionSphere->SetSphereRadius(150.0f);
    InteractionSphere->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
}

void ABrick::BeginPlay()
{
    Super::BeginPlay();

    if (HasAuthority())
    {
        // 服务器绑定碰撞事件（权威判定）
        MeshComp->OnComponentHit.AddDynamic(this, &ABrick::OnHit);
    }
}

// 客户端调用 → 转发到服务器
void ABrick::RequestPush_Implementation(AActor* Pusher, FVector Direction, float Force)
{
    Server_Push(Pusher, Direction, Force);
}

bool ABrick::Server_Push_Validate(AActor* Pusher, FVector Direction, float Force)
{
    // 验证：推动者有效、方向归一化、力度在合理范围
    return Pusher != nullptr && Direction.IsNormalized() && Force > 0.0f && Force <= 10000.0f;
}

void ABrick::Server_Push_Implementation(AActor* Pusher, FVector Direction, float Force)
{
    // 服务器施加力（物理模拟在服务器跑，自动复制到客户端）
    MeshComp->AddForce(Direction * Force, NAME_None, true);
}

void ABrick::OnHit(UPrimitiveComponent* HitComp, AActor* OtherActor,
                   UPrimitiveComponent* OtherComp, FVector NormalImpulse,
                   const FHitResult& Hit)
{
    if (!HasAuthority()) return;

    // 检查碰撞对象是否是敌人
    if (!OtherActor || !OtherActor->ActorHasTag("Enemy")) return;

    // 计算冲击速度
    float ImpactVelocity = NormalImpulse.Size() / Mass;

    // 低于阈值不造成伤害
    if (ImpactVelocity < MinCrushVelocity) return;

    // 计算伤害
    float Damage = CalculateCrushDamage(ImpactVelocity);

    // 应用伤害
    FDamageEvent DamageEvent;
    OtherActor->TakeDamage(Damage, DamageEvent, GetInstigatorController(), this);

    // 增加碾压计数（会复制到客户端）
    CrushCount++;

    // 触发蓝图事件（视觉响应）
    OnCrushedEnemy(OtherActor, Damage);
}

float ABrick::CalculateCrushDamage(float ImpactVelocity) const
{
    // 公式：速度 × 质量 × 伤害系数
    return ImpactVelocity * Mass * DamageMultiplier * 0.01f;
}

void ABrick::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    DOREPLIFETIME(ABrick, CrushCount);
}

void ABrick::OnRep_CrushCount()
{
    // 客户端收到碾压计数变化 → 可触发 UI 更新或音效
    // 具体表现由蓝图实现
}

float ABrick::GetCurrentSpeed() const
{
    return MeshComp->GetPhysicsLinearVelocity().Size();
}
```

### Blueprint Config Layer

**BP_Brick_Standard（标准砖块）：**
- Parent class: ABrick
- Mesh: SM_Brick_Standard
- Material: M_Brick_Standard
- Mass: 100.0
- DamageMultiplier: 1.0
- MinCrushVelocity: 200.0

**BP_Brick_Heavy（重砖块）：**
- Mass: 300.0
- DamageMultiplier: 1.5
- MinCrushVelocity: 100.0（更容易造成伤害）
- Mesh: SM_Brick_Large

**BP_Brick_Ice（冰砖块）：**
- Mass: 80.0
- DamageMultiplier: 0.8
- MinCrushVelocity: 250.0
- Material: M_Brick_Ice（低摩擦）
- 物理材质：PM_Ice（摩擦系数 0.1）

### Replication Notes

- **Runs on**:
  - 物理模拟：服务器跑（Chaos Async），位置自动复制
  - 推动请求：客户端发 Server RPC，服务器施加力
  - 碰撞伤害：仅服务器判定（HasAuthority 检查）
  - 视觉响应：OnCrushedEnemy 在服务器触发，蓝图实现表现

- **RPCs**:
  - `Server_Push`: Client → Server（Reliable，推动必须送达）
  - `OnCrushedEnemy`: 不走 RPC，是 BlueprintImplementableEvent，服务器调用
  - 无 Client RPC（用 RepNotify 替代）

- **Replicated Vars**:
  - `CrushCount` (int32, RepNotify) — 碾压次数，客户端 UI 显示
  - 位置/速度：bReplicateMovement = true 自动同步
  - `Mass/DamageMultiplier`：不复制（运行时不变，蓝图默认值）

- **Bandwidth notes**:
  - 10 人 × 10 砖块 × RepMovement（~30 bytes/帧）= 3KB/帧（极轻）
  - 碰撞事件不复制（只服务器处理）
  - 设置 NetUpdateFrequency = 30Hz（够用）

### Physics Notes

- **物理设置**：
  - MeshComp 设 SimulatePhysics = true
  - Mass 在构造函数用 SetMassOverrideInKg 设置
  - 物理材质影响摩擦力（冰砖块用低摩擦 PM_Ice）

- **力应用**：
  - 用 AddForce（不是 SetLocation，让物理引擎处理）
  - 力的方向 = 玩家朝向
  - 多人推动：服务器累加每个玩家的力

- **碰撞响应**：
  - Brick → Enemy：Overlap（触发伤害事件，用 OnHit）
  - Brick → Player：Block（玩家不能穿过砖块）
  - Brick → Wall：Block（不能推穿墙）
  - Brick → Brick：Block（物理互推）

- **伤害公式**：
  - Damage = ImpactVelocity × Mass × DamageMultiplier × 0.01
  - 低于 MinCrushVelocity 不造成伤害
  - 服务器计算，客户端只显示结果

### Assets / Naming / Folders

```
Source/Gameplay/                       ← C++ 源码
├── Public/
│   ├── Brick.h
│   ├── PushComponent.h
│   ├── Interfaces/
│   │   └── Pushable.h
│   └── Data/
│       └── BrickStats.h               ← FBrickStats 结构
├── Private/
│   ├── Brick.cpp
│   └── PushComponent.cpp
└── Game.Build.cs

/Game/Blueprints/PushBrick/            ← 蓝图配置
├── BP_Brick_Standard.uasset
├── BP_Brick_Heavy.uasset
├── BP_Brick_Ice.uasset
└── WBP_BrickHealth.uasset             ← 砖块耐久 UI

/Game/Data/                            ← 数据表
└── DT_BrickStats.uasset

/Game/Assets/                          ← 美术资产
├── Meshes/
│   ├── SM_Brick_Standard.uasset
│   └── SM_Brick_Large.uasset
├── Materials/
│   ├── M_Brick_Standard.uasset
│   └── M_Brick_Ice.uasset
├── PhysicalMaterials/
│   └── PM_Ice.uasset
└── FX/
    └── NS_Crush_Impact.uasset
```

## 6) Test Checklist

- **PIE 2 玩家**:
  - 玩家 1 推砖块 → 砖块移动 → 撞敌人 → 敌人受伤
  - 玩家 2 看到砖块移动和敌人受伤（同步）
  - 两个玩家同时推 → 砖块合力移动

- **Dedicated Server 10P**:
  - 10 玩家各自推砖块，无卡顿
  - 服务器帧时间 < 16ms
  - 所有客户端看到一致的物理结果

- **Physics edge cases**:
  - 砖块推到墙边：停止移动，无穿墙
  - 两砖块相撞：物理互推，无重叠
  - 砖块掉出关卡：销毁 + 重生计时器
  - 静止砖块压敌人：无伤害（速度 < MinCrushVelocity）

- **Latency (100ms)**:
  - 推动有 100ms 延迟（正常，等 Server RPC）
  - 砖块位置最终一致（RepMovement 同步）
  - 伤害判定无 desync（服务器权威）

- **Anti-cheat**:
  - 客户端篡改 Mass → 服务器按蓝图默认值算
  - 客户端篡改推动力 → Server_Push_Validate 拦截（Force > 10000 拒绝）
  - 客户端不能直接造成伤害（TakeDamage 只在服务器调用）
```

---

## 7. 改造步骤总结：C++ 优先项目 7 步法

1. **项目画像**：UE5.7 / ≤10 人 / 推砖块玩法 / C++ 优先
2. **Fork 改名**：`casual-action-cpp-gamepiece-designer`
3. **改 _meta.json**：slug/version/ownerId
4. **重写 description + What 段**：强调 C++-first + 玩法类型
5. **重构 Output format**：Blueprint Recipe → C++ Class Design + Blueprint Config Layer + Physics Notes
6. **扩展命名规范**：加 C++ 类前缀（A/U/F/E/I）+ 蓝图标注"config layer only"
7. **替换 Multiplayer defaults**：改 ≤10 人 + 加 Physics 段 + 加 C++ architecture 反例规则
8. **重构 Templates**：BlueprintRecipe → CppClass_Template + 新增 Checklist_Physics
9. **加 examples**：push-brick-system.md（含完整 C++ 头文件和实现）
10. **自检 + 试用**：检查 C++ 代码可读性 + 物理参数完整性

---

## 8. 与第 6、7 篇的差异对比

| 维度 | 第 6 篇（通用改造） | 第 7 篇（异构栈） | 第 8 篇（C++ 优先） |
|---|---|---|---|
| 技术栈 | UE 单体 | UE+slua+bigworld+协议 | UE 原生（C++ 为主） |
| 改动幅度 | 改填充 | 重构结构 | **重构产物类型** |
| 主产物 | 蓝图节点链 | Lua/Python/协议 | **C++ 头文件** |
| 蓝图角色 | 主逻辑层 | UE 表现层 | **配置层** |
| 网络层 | UE replication | 自定义协议 | UE replication（保留） |
| Schema | 1 份 | 3 份 | 1 份（保留） |
| 新增段 | Performance（可选） | Layer Responsibility / Protocol | **Physics / C++ architecture** |
| 大模型参与 | 间接（输出文档） | 间接（输出多语言代码） | **直接（C++ 可读可改）** |

**核心差异**：第 8 篇的改造焦点是**产物类型从蓝图变成 C++ 代码**，目的是让大模型能直接参与开发。这是三种改造里对"大模型协作"最友好的架构。

---

## 9. 本篇小结

### 三个核心结论

1. **"C++ 优先 + 蓝图配置层"是为了让大模型能读代码**：蓝图是视觉脚本，大模型读不懂；C++ 是纯文本，大模型原生能读写改。
2. **改造焦点是产物类型**：把 Blueprint Recipe 换成 C++ Class Design，加 Blueprint Config Layer 和 Physics Notes 段。
3. **保留 UE 原生 replication**：≤10 人小规模不需要自定义协议，UE 原生网络够用，省掉第 7 篇那套复杂改造。

### C++ 优先改造的元原则（5 条）

1. **逻辑全在 C++**：用 UPROPERTY/UFUNCTION 暴露给蓝图，蓝图只配置不改逻辑。
2. **蓝图标注"config layer only"**：命名规范里明确，避免逻辑回流蓝图。
3. **代码对 AI 友好**：头文件注释、自解释命名、小函数、UE 智能指针。
4. **物理单独成段**：玩法强依赖物理时，Physics Notes 是必填段。
5. **保留 replication**：小规模用 UE 原生网络，不重复造轮子。

### 三种改造的选型决策

```
你的项目是？
   │
   ├─ UE 单体，标准蓝图开发
   │   → 第 6 篇通用改造（改版本/规模/命名）
   │
   ├─ 异构技术栈（多语言/多服务端/自定义协议）
   │   → 第 7 篇异构改造（重构结构 + 多 Schema）
   │
   └─ UE 原生但 C++ 优先（让大模型参与开发）
       → 第 8 篇 C++ 优先改造（产物改 C++ + 物理段）
```

### 从原版到 C++ 优先版的演化路径

```
原版 ue57-gamepiece-designer（蓝图中心，40v40）
   ↓ 第 6 篇：改填充（规模/版本）
你的 v0.1.0（≤10 人，UE5.7）
   ↓ 发现要 C++ 优先架构
你的 v0.2.0（产物改 C++ + Physics 段）
   ↓ 加 AI 友好代码规范
你的 v0.3.0（C++ code conventions 段）
   ↓ 加范例（push-brick-system）
你的 v1.0.0（C++ 优先稳定版）
```

**完成比完美更重要**。先跑通最小系统，再迭代代码规范和范例。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
