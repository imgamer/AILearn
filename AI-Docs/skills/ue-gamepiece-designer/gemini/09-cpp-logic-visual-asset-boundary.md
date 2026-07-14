# 第 9 篇：C++ 逻辑层与引擎可视化资产层的边界（UE5.8 通用架构）

> 本篇是第 8 篇的进阶。第 8 篇讲了"C++ 优先 + 蓝图配置层"在一个具体玩法（推砖块）上的应用。
> 本篇回答更通用的问题：**UE5.8 项目里，哪些东西应该写进 C++？哪些应该保留为引擎可视化资产？**
>
> 核心命题：
> - **C++ 承载全部业务逻辑**——AI 大模型只读 C++ 源码即可理解项目
> - **蓝图仅作可视化配置层**——只配置参数、绑定资产、做预制体变体
> - **不强行 C++ 化**——动画状态机、StateTree、Behavior Tree、DataTable 等引擎原生机制继续用，
>   强行 C++ 化会丢失引擎能力
>
> 难点在于**边界判断**：什么该 C++ 化，什么不该？本篇给出明确准则和 8 个补充的边界情况。

---

## 1. 项目画像与升级要点

### 1.1 项目速览

```
┌────────────────────────────────────────────────────────────┐
│  UE 版本：5.8                                              │
│  架构目标：C++ 承载全部业务逻辑                            │
│  蓝图角色：仅作可视化配置层                                │
│  引擎可视化资产：完整保留（AnimBP/StateTree/BT/DataTable） │
│  AI 协作目标：大模型只读 C++ 源码即可理解项目              │
│              无需解析二进制 .uasset                        │
└────────────────────────────────────────────────────────────┘
```

### 1.2 与第 8 篇的关系

| 维度 | 第 8 篇（推砖块案例） | 第 9 篇（通用架构） |
|---|---|---|
| 范围 | 单个玩法系统 | 通用架构原则 |
| 焦点 | C++ 优先的物理玩法 | C++ 与可视化资产的边界 |
| 独创 | Physics Notes 段 | **接口文档机制**（见第 6 章） |
| 适用 | 推砖块类游戏 | 任何 UE5.8 项目 |

第 8 篇是"怎么做"，本篇是"哪些做、哪些不做"。

### 1.3 UE5.8 的相关变化（影响本架构）

相比 5.7，5.8 在以下方面影响 C++/可视化资产边界：

| 特性 | 5.7 状态 | 5.8 状态 | 对本架构的影响 |
|---|---|---|---|
| StateTree | 已有，持续增强 | 稳定 + 重构事件 | AI 决策树推荐用 StateTree，不写 C++ 状态机 |
| Mass Entity | 实验 | 稳定可用 | 大量实体逻辑可考虑 C++ + Mass，但门槛高 |
| Gameplay Ability System | 稳定 | 微调 | GAS 的 Ability 可继续用蓝图配置，逻辑在 C++ |
| Common UI | 增强 | 进一步完善 | UI 逻辑 C++，UI 布局蓝图 |
| Enhanced Input | 稳定 | 微调 | 输入配置继续用 Input Action/Mapping Context 资产 |
| C++ Hot Reload | 受限 | 改善 | C++ 修改可更快生效，但仍不如蓝图热更 |

**核心趋势**：5.8 继续推动"数据驱动 + 可视化编排"，但核心逻辑仍以 C++ 为权威。本架构与 5.8 的设计哲学一致。

---

## 2. 核心架构原则：三层清晰边界

### 2.1 三层架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│  Layer A: C++ 逻辑层（AI 大模型读写的核心）                         │
│  ─────────────────────────                                            │
│  • 游戏玩法逻辑（伤害计算、规则判定、状态变化）                     │
│  • 系统架构（GameMode/GameState/PlayerController 核心方法）          │
│  • 自定义组件逻辑（ActorComponent 的 Tick 和方法）                   │
│  • 数据结构定义（FStruct、EEnum）                                    │
│  • 网络逻辑（RPC、Replication、Authority 判定）                      │
│  • 核心算法（匹配、寻路查询、伤害公式）                              │
│  • 与可视化资产的"桥接接口"（C++ 调用资产提供的入口）                │
│  ↓ 这是 AI 大模型唯一需要读懂的层                                    │
└─────────────────────────────────────────────────────────────────────┘
                                ↑ 通过 UPROPERTY/UFUNCTION 桥接
┌─────────────────────────────────────────────────────────────────────┐
│  Layer B: 引擎可视化资产层（保留引擎能力，AI 不解析内容）            │
│  ─────────────────────────                                            │
│  • 动画状态机（AnimBP + State Machine）                              │
│  • StateTree（AI 决策状态机）                                        │
│  • Behavior Tree（行为树，AI 行为编排）                              │
│  • DataTable / DataAsset（数据配置）                                 │
│  • 蓝图预制体（BP_ 子类，配置默认值和资产绑定）                      │
│  • Material / Niagara（视觉表现）                                    │
│  • Enhanced Input（输入配置资产）                                    │
│  • Gameplay Tags（标签配置）                                         │
│  ↓ 这些资产 AI 大模型不需要读具体内容，只需读 C++ 里的接口契约      │
└─────────────────────────────────────────────────────────────────────┘
                                ↑ 通过接口文档机制（见第 6 章）
┌─────────────────────────────────────────────────────────────────────┐
│  Layer C: 纯美术/关卡层（设计师工作区，AI 完全不涉及）               │
│  ─────────────────────────                                            │
│  • Static Mesh、Texture、Skeleton                                    │
│  • 关卡布局、Lighting、PostProcess                                   │
│  • Sound Cue、Audio                                                  │
│  ↓ 这些是二进制资产，AI 不读，也读不懂                               │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心原则：分层不混层

```
判断准则（一句话）：
  是"如何做"的决策？    → C++（Layer A）
  是"是什么"的数据？    → DataTable/DataAsset（Layer B）
  是"看起来怎样"？      → Material/Niagara/关卡（Layer C）
  是"什么时候做什么"？  → StateTree/BT（Layer B，但 action 必须调 C++）
```

**关键洞察**：StateTree 和 BT 是"编排层"，不是"逻辑层"。它们的 Task/Transition 调用的底层 Action 必须是 C++ 实现，但编排本身（什么条件切什么状态）保留在可视化资产里。

### 2.3 反模式：强行 C++ 化会丢失什么

用户已经指出"强行 C++ 化会丢失引擎能力"。具体丢失什么：

| 强行 C++ 化 | 丢失的能力 |
|---|---|
| 用 C++ 写动画状态机 | 失去 AnimBP 的状态预览、调试可视化、混合配置 |
| 用 C++ 写 BT | 失得 BT 编辑器的节点拖拽、运行时调试、装饰器复用 |
| 用 C++ 硬编码数据 | 失去 DataTable 的 CSV 导入导出、热重载、策划自助编辑 |
| 用 C++ 写 UI 布局 | 失去 UMG 的可视化布局、预览、设计师自助调整 |
| 用 C++ 硬编码 Input | 失去 Enhanced Input 的运行时重映射、玩家自定义按键 |

**教训**：C++ 化的目标是"逻辑可读"，不是"全 C++"。强行 C++ 化反而让项目失去 UE 的核心价值（数据驱动 + 可视化编辑）。

---

## 3. 边界判断准则：什么该 C++ 化，什么不该

### 3.1 决策矩阵

| 内容 | 该 C++ 化吗？ | 理由 |
|---|---|---|
| 伤害计算公式 | ✅ 必须 | 逻辑，AI 需理解 |
| 玩家移动输入处理 | ✅ 必须 | 逻辑，含网络判定 |
| 网络同步逻辑 | ✅ 必须 | 逻辑，UE 核心机制 |
| GameMode 规则 | ✅ 必须 | 逻辑，权威规则 |
| 自定义组件 Tick | ✅ 必须 | 逻辑，每帧行为 |
| AI 决策的"判断"（视野检测、距离判定） | ✅ 必须 | 逻辑，但调用方是 StateTree Task |
| AI 决策的"编排"（什么条件切什么状态） | ❌ 不该 | 编排，用 StateTree |
| 角色动画状态切换 | ❌ 不该 | 编排，用 AnimBP |
| 敌人行为序列 | ❌ 不该 | 编排，用 BT |
| 技能数值（伤害值、冷却时间） | ❌ 不该 | 数据，用 DataTable |
| 角色属性（血量上限、移动速度） | ❌ 不该 | 数据，用 DataAsset |
| 输入按键映射 | ❌ 不该 | 配置，用 Enhanced Input |
| UI 布局 | ❌ 不该 | 表现，用 UMG |
| 材质/特效 | ❌ 不该 | 表现，用 Material/Niagara |
| 蓝图预制体（BP_ 子类） | ❌ 不该 | 配置，蓝图配置 C++ 默认值 |

### 3.2 三类编排资产的处理方式

**动画状态机（AnimBP）**：
- C++ 定义：`UAnimInstance` 子类，暴露 `bIsMoving`、`Speed`、`bIsAttacking` 等变量（UPROPERTY）
- AnimBP 资产：用这些变量驱动 State Machine 状态切换
- 边界：C++ 提供"状态依据"，AnimBP 负责"状态切换和混合"

**StateTree**：
- C++ 定义：StateTree Task 的 C++ 实现（每个 Task 是一个 `UStateTreeTask` 子类）
- StateTree 资产：编排 Task 的执行顺序和条件切换
- 边界：C++ 提供"做什么"，StateTree 负责"什么时候做"

**Behavior Tree**：
- C++ 定义：BT Task/Service/Decorator 的 C++ 实现
- BT 资产：编排节点树
- 边界：同 StateTree

### 3.3 GAS（Gameplay Ability System）的边界

GAS 是 UE 内置的能力系统，本架构下的处理：

| GAS 组件 | 该 C++ 还是蓝图？ |
|---|---|
| UAttributeSet（属性集） | ✅ C++（逻辑，定义属性和响应规则） |
| UGameplayEffect（效果） | ❌ DataAsset/蓝图（配置，定义数值修改） |
| UGameplayAbility（能力） | C++ 定义基类 + 蓝图配置具体能力 |
| UGameplayCue（视觉提示） | ❌ 蓝图（表现，触发特效） |
| Gameplay Tag | ❌ 数据资产（配置） |

**原则**：GAS 的"框架和规则"用 C++，"具体能力和效果"用蓝图/DataAsset 配置。

---

## 4. skill 改造的 8 大改动

### 4.1 改动 1：description 重写

**改造后**：
```yaml
description: Designs UE5.8 game pieces with strict layer separation: all gameplay logic in C++, Blueprint as config layer only, engine visual assets (AnimBP/StateTree/BT/DataTable) preserved. Produces C++ class designs, visual asset interface contracts, DataTable schemas, replication notes, and test checklists. AI-readable: C++ source is the single source of truth, no .uasset parsing needed.
```

**关键差异**（与第 8 篇相比）：
- "C++ first" → "strict layer separation"（强调边界，不只是优先）
- 明确"engine visual assets preserved"
- "AI-readable: C++ source is the single source of truth"（独创表述）

### 4.2 改动 2：What 段产物清单

```markdown
## What this skill does
When the user asks for a UE system or game piece, produce a structured design
with strict layer separation (UE5.8):

- **C++ class design** (logic layer: header files, UPROPERTY/UFUNCTION exposure, replication)
- **Visual asset interface contracts** (which assets needed, what variables/tasks C++ exposes to them)
- **DataTable / DataAsset schemas** (gameplay data, CSV format)
- **Replication notes** (server authority, replicated vars, RPCs)
- **Layer boundary checklist** (what stays C++, what goes to visual assets)
- **Test checklist** (PIE, dedicated server, layer isolation tests)
```

**新增产物**：`Visual asset interface contracts` 和 `Layer boundary checklist`，这是本架构独有的。

### 4.3 改动 3：Output format 重构

```markdown
## Output format (always)
1) **Goal**
2) **Inputs**
3) **Outputs** (C++ classes, visual assets needed, DataTables)
4) **Assumptions**
5) **Implementation**
   - **C++ Class Design** (logic layer; refer to Templates/CppClass_Template.md)
   - **Visual Asset Interface Contracts** (AnimBP vars, StateTree tasks, BT nodes — what C++ exposes)
   - **Blueprint Config Layer** (BP_ subclasses, default values, asset bindings)
   - **DataTable Schemas** (data layer)
   - **Replication Notes** (server authority, replicated vars, RPCs)
   - **Layer Boundary Checklist** (what is C++ vs visual asset; refer to Templates/Checklist_LayerBoundary.md)
   - **Assets / Naming / Folders**
6) **Test Checklist** (including layer isolation tests)
```

**两个关键新增子段**：
- `Visual Asset Interface Contracts`：描述 C++ 暴露给可视化资产的接口
- `Layer Boundary Checklist`：明确哪些进 C++，哪些进可视化资产

### 4.4 改动 4：命名规范扩展为三层

```markdown
## Naming + folders (default)

### C++ classes (logic layer)
- Actor: `A<Thing>` (ABrick, AEnemyCharacter)
- Component: `U<Thing>Component` (UPushComponent)
- Struct: `F<Thing>` (FBrickStats)
- Enum: `E<Thing>` (EBrickType)
- Interface: `I<Thing>` (IPushable)
- Subsystem: `U<Thing>Subsystem` (UInventorySubsystem)  ← 5.8 推荐
- StateTree Task: `U<Thing>StateTask` (UPatrolStateTask)
- BT Task: `U<Thing>BTTask` (UBTTask_Attack)
- AnimInstance: `U<Thing>AnimInstance` (UCharacterAnimInstance)

### Visual assets (config + orchestration layer)
- BP subclasses of C++: `BP_<Thing>` (BP_Brick_Heavy)
- AnimBP: `ABP_<Character>` (ABP_Player)
- StateTree: `ST_<System>` (ST_EnemyAI)
- Behavior Tree: `BT_<System>` (BT_EnemyBehavior)
- DataTable: `DT_<Thing>` (DT_BrickStats)
- DataAsset: `DA_<Thing>` (DA_EnemyConfig)
- Input Action: `IA_<Action>` (IA_Interact)
- Input Mapping Context: `IMC_<Context>` (IMC_Default)
- Gameplay Tag: `Tag.<Category>.<Name>` (Tag.Brick.Type.Heavy)

### Pure art assets (layer C)
- Mesh: `SM_<Thing>` / `SK_<Thing>`
- Material: `M_<Thing>`
- Niagara: `NS_<Effect>`
- Texture: `T_<Thing>`
```

**新增**：StateTree/BT Task/AnimInstance 的 C++ 命名，以及可视化资产（AnimBP/StateTree/BT/Input）的命名规范。

### 4.5 改动 5：替换 defaults 段为 Layer Separation Rules

```markdown
## Layer separation rules (non-negotiable)

### What MUST be in C++ (logic layer)
- All gameplay rule decisions (damage, win/lose, scoring)
- All network authority logic (replication, RPC, validation)
- All state machine "conditions" (is X allowed to do Y)
- All data structure definitions (FStruct, EEnum)
- All algorithms (pathfinding queries, AI perception checks)
- All property/variable declarations (UPROPERTY)
- Visual asset Task/Service/Decorator implementations (the C++ side of StateTree/BT)

### What MUST stay as visual assets (engine native, do NOT C++-ify)
- Animation state machines → use AnimBP (lose visual debugging if C++-ified)
- AI decision orchestration → use StateTree or BT
- Gameplay data → use DataTable / DataAsset
- UI layout → use UMG Widget Blueprint
- Input mapping → use Enhanced Input assets
- Asset bindings and variant configs → use BP_ subclasses
- Materials, Niagara, particles → use native asset types

### What is hybrid (C++ defines, asset configures)
- GAS Abilities: C++ base class, BP_ subclass for specific ability
- GAS Effects: C++ framework, DataAsset for specific effect values
- AnimBP: C++ AnimInstance exposes variables, AnimBP asset uses them

### Anti-patterns (explicitly forbidden)
- ❌ Hardcoding damage values in C++ (use DataTable)
- ❌ Implementing animation state machine in C++ Tick (use AnimBP)
- ❌ Writing AI behavior tree logic in C++ if-else (use BT asset)
- ❌ Putting input key bindings in C++ (use Enhanced Input assets)
- ❌ Storing level layout in C++ arrays (use level assets)
```

**这是本架构的核心约束段**。用"必须 / 必须 / 混合 / 反模式"四类规则明确边界。

### 4.6 改动 6：Templates 重构

新增两个本架构独有的模板：

#### `Templates/VisualAssetInterface_Template.md`

```markdown
# Visual Asset Interface Contract Template

> 这个模板定义 C++ 暴露给可视化资产的"接口契约"
> AI 大模型读这份契约就能理解资产的作用，无需解析 .uasset

## AnimBP Interface
- **C++ class**: `U<Character>AnimInstance`
- **Exposed variables** (UPROPERTY(BlueprintReadWrite)):
  - `bIsMoving` (bool) — set by C++ when speed > threshold
  - `Speed` (float) — current movement speed
  - `bIsAttacking` (bool) — set true on attack start, false on attack end
  - `bIsInAir` (bool) — set by C++ movement component
- **State machine expects**:
  - Idle ↔ Moving (transition: bIsMoving)
  - Any → Attacking (transition: bIsAttacking)
  - Attacking → Idle (transition: attack montage finished)

## StateTree Interface
- **C++ tasks** (UStateTreeTask subclasses):
  - `U<Name>StateTask_Patrol` — moves to random patrol point
  - `U<Name>StateTask_Chase` — moves to target actor
  - `U<Name>StateTask_Attack` — performs attack, returns success/fail
- **C++ evaluators** (UStateTreeEvaluator):
  - `U<Name>StateEvaluator_HasTarget` — returns bool
- **StateTree asset** (`ST_<System>`): orchestrates these tasks
  - States: Patrol → Chase → Attack → Cooldown → Patrol
  - Conditions: uses evaluator outputs

## BT Interface (if using BT instead of StateTree)
- **C++ tasks**: `UBTTask_<Action>` (e.g., UBTTask_Attack)
- **C++ services**: `UBTService_<Monitor>` (e.g., UBTService_DetectEnemy)
- **C++ decorators**: `UBTDecorator_<Condition>` (e.g., UBTDecorator_HasTarget)
- **BT asset**: orchestrates these nodes

## DataTable Schema
- **C++ struct**: `F<Thing>Stats` (UPROPERTY(BlueprintType))
- **DataTable asset**: `DT_<Thing>` imports CSV with this struct
- **C++ access**: `DataTableManager::GetRow<F<Thing>Stats>(RowName)`

## GAS Interface (if applicable)
- **C++ AttributeSet**: `U<Character>AttributeSet` (defines attributes)
- **C++ Ability base**: `U<Name>AbilityBase` (base class with logic)
- **BP Ability subclasses**: `GA_<Specific>` (configure specific ability)
- **DataAsset Effects**: `GE_<Effect>` (configure effect values)
```

#### `Templates/Checklist_LayerBoundary.md`

```markdown
# Layer Boundary Checklist

## C++ Layer (logic) — verify these are in C++
- [ ] All damage calculations
- [ ] All win/lose/scoring rules
- [ ] All network authority checks
- [ ] All replicated variable declarations
- [ ] All RPC function implementations
- [ ] All AI perception/detection algorithms
- [ ] All state machine "should transition" conditions
- [ ] All data structure definitions (FStruct/EEnum)
- [ ] All StateTree/BT Task/Service/Decorator implementations

## Visual Asset Layer — verify these are NOT in C++
- [ ] Animation state machines → AnimBP asset
- [ ] AI orchestration → StateTree or BT asset
- [ ] Gameplay numbers → DataTable or DataAsset
- [ ] UI layout → UMG Widget Blueprint
- [ ] Input bindings → Enhanced Input assets
- [ ] Asset bindings → BP_ subclass defaults
- [ ] Materials → Material assets
- [ ] Particle effects → Niagara assets

## Hybrid Layer — verify correct split
- [ ] GAS: C++ base + BP/DataAsset config
- [ ] AnimBP: C++ AnimInstance + AnimBP asset
- [ ] StateTree: C++ tasks + ST asset orchestration

## Anti-pattern Check — verify none present
- [ ] No hardcoded damage values in C++ (move to DataTable)
- [ ] No animation state machine in C++ Tick (move to AnimBP)
- [ ] No AI behavior in C++ if-else chains (move to BT/StateTree)
- [ ] No input key codes in C++ (move to Enhanced Input)
- [ ] No level layout in C++ arrays (move to level asset)
```

### 4.7 改动 7：C++ 代码规范强化（针对 AI 可读）

```markdown
## C++ code conventions (for AI readability, enhanced for UE5.8)

### File organization
- One class per file (header + cpp pair)
- File name = class name without prefix (Brick.h, not ABrick.h)
- Public headers in Public/, private in Private/
- Subsystems preferred for global services (UE5.8 pattern)

### Header documentation (MANDATORY)
- Each class has Doxygen-style comment with:
  - Responsibility (one sentence)
  - Network role (Server/Client/Both)
  - Layer (Logic/Visual-bridge/Hybrid)
  - Related visual assets (which AnimBP/ST/BT uses this class)

Example:
```cpp
/**
 * ABrick - 可被玩家推动的物理砖块
 *
 * Responsibility: 承载物理模拟、计算碾压伤害、同步状态到客户端
 * Network role: Server authoritative (position/damage), Client visual only
 * Layer: Logic (all gameplay logic here)
 * Related assets: BP_Brick_* (config variants), ABP_Brick (anim, if animated)
 *                 DT_BrickStats (data table for stats)
 */
```

### Interface exposure discipline
- All gameplay-relevant properties use UPROPERTY with EditAnywhere or BlueprintReadOnly
- All gameplay-relevant functions use UFUNCTION(BlueprintCallable) or BlueprintNativeEvent
- Visual-only callbacks use BlueprintImplementableEvent
- Group properties by Category = "<System>|<Subgroup>"

### AI readability rules
- Function names self-documenting (no abbreviations)
- Single function < 50 lines (split if longer)
- Use UE smart pointers (TWeakObjectPtr, TSubclassOf, TObjectPtr)
- Prefer composition over inheritance (≤3 layers deep)
- Comment "why" not "what" for non-obvious decisions
- Use Gameplay Tags for categorization instead of string matching
```

### 4.8 改动 8：examples 用通用系统

加 `examples/inventory-system.md`（物品系统，涵盖 C++ + DataTable + UI 边界），第 8 章给出。

---

## 5. 完整 SKILL.md（改造后全文）

```markdown
---
name: ue58-cpp-logic-gamepiece-designer
description: Designs UE5.8 game pieces with strict layer separation: all gameplay logic in C++, Blueprint as config layer only, engine visual assets (AnimBP/StateTree/BT/DataTable) preserved. Produces C++ class designs, visual asset interface contracts, DataTable schemas, replication notes, and test checklists. AI-readable: C++ source is the single source of truth, no .uasset parsing needed.
---

# UE5.8 C++-Logic Gamepiece Designer (Strict Layer Separation, Text-Only)

## What this skill does
When the user asks for a UE system or game piece, produce a structured design
with strict layer separation (UE5.8):

- **C++ class design** (logic layer: header files, UPROPERTY/UFUNCTION exposure, replication)
- **Visual asset interface contracts** (which assets needed, what variables/tasks C++ exposes to them)
- **DataTable / DataAsset schemas** (gameplay data, CSV format)
- **Replication notes** (server authority, replicated vars, RPCs)
- **Layer boundary checklist** (what stays C++, what goes to visual assets)
- **Test checklist** (PIE, dedicated server, layer isolation tests)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs**
3) **Outputs** (C++ classes, visual assets needed, DataTables)
4) **Assumptions**
5) **Implementation**
   - **C++ Class Design** (logic layer; refer to Templates/CppClass_Template.md)
   - **Visual Asset Interface Contracts** (AnimBP vars, StateTree tasks, BT nodes — what C++ exposes; refer to Templates/VisualAssetInterface_Template.md)
   - **Blueprint Config Layer** (BP_ subclasses, default values, asset bindings)
   - **DataTable Schemas** (data layer)
   - **Replication Notes** (server authority, replicated vars, RPCs)
   - **Layer Boundary Checklist** (what is C++ vs visual asset; refer to Templates/Checklist_LayerBoundary.md)
   - **Assets / Naming / Folders**
6) **Test Checklist** (including layer isolation tests)

> **参考范例**：生成前先读 `examples/inventory-system.md`（物品系统，涵盖三层边界）
> 和 `examples/ability-system.md`（GAS 技能，覆盖混合层）。

## Naming + folders (default)

### C++ classes (logic layer)
- Actor: `A<Thing>` (ABrick, AEnemyCharacter)
- Component: `U<Thing>Component` (UPushComponent)
- Struct: `F<Thing>` (FBrickStats)
- Enum: `E<Thing>` (EBrickType)
- Interface: `I<Thing>` (IPushable)
- Subsystem: `U<Thing>Subsystem` (UInventorySubsystem)
- StateTree Task: `U<Thing>StateTask` (UPatrolStateTask)
- BT Task: `U<Thing>BTTask` (UBTTask_Attack)
- AnimInstance: `U<Thing>AnimInstance` (UCharacterAnimInstance)

### Visual assets (config + orchestration layer)
- BP subclasses of C++: `BP_<Thing>` (BP_Brick_Heavy)
- AnimBP: `ABP_<Character>` (ABP_Player)
- StateTree: `ST_<System>` (ST_EnemyAI)
- Behavior Tree: `BT_<System>` (BT_EnemyBehavior)
- DataTable: `DT_<Thing>` (DT_BrickStats)
- DataAsset: `DA_<Thing>` (DA_EnemyConfig)
- Input Action: `IA_<Action>` (IA_Interact)
- Input Mapping Context: `IMC_<Context>` (IMC_Default)
- Gameplay Tag: `Tag.<Category>.<Name>` (Tag.Brick.Type.Heavy)

### Pure art assets (layer C)
- Mesh: `SM_<Thing>` / `SK_<Thing>`
- Material: `M_<Thing>`
- Niagara: `NS_<Effect>`
- Texture: `T_<Thing>`

## Layer separation rules (non-negotiable)

### What MUST be in C++ (logic layer)
- All gameplay rule decisions (damage, win/lose, scoring)
- All network authority logic (replication, RPC, validation)
- All state machine "conditions" (is X allowed to do Y)
- All data structure definitions (FStruct, EEnum)
- All algorithms (pathfinding queries, AI perception checks)
- All property/variable declarations (UPROPERTY)
- Visual asset Task/Service/Decorator implementations (the C++ side of StateTree/BT)

### What MUST stay as visual assets (engine native, do NOT C++-ify)
- Animation state machines → use AnimBP (lose visual debugging if C++-ified)
- AI decision orchestration → use StateTree or BT
- Gameplay data → use DataTable / DataAsset
- UI layout → use UMG Widget Blueprint
- Input mapping → use Enhanced Input assets
- Asset bindings and variant configs → use BP_ subclasses
- Materials, Niagara, particles → use native asset types

### What is hybrid (C++ defines, asset configures)
- GAS Abilities: C++ base class, BP_ subclass for specific ability
- GAS Effects: C++ framework, DataAsset for specific effect values
- AnimBP: C++ AnimInstance exposes variables, AnimBP asset uses them

### Anti-patterns (explicitly forbidden)
- ❌ Hardcoding damage values in C++ (use DataTable)
- ❌ Implementing animation state machine in C++ Tick (use AnimBP)
- ❌ Writing AI behavior tree logic in C++ if-else (use BT asset)
- ❌ Putting input key bindings in C++ (use Enhanced Input assets)
- ❌ Storing level layout in C++ arrays (use level assets)

## C++ code conventions (for AI readability, UE5.8)
- One class per file (header + cpp pair), file name = class name without prefix
- Each class has Doxygen header comment: Responsibility / Network role / Layer / Related assets
- All gameplay-relevant properties: UPROPERTY with Category
- All gameplay-relevant functions: UFUNCTION(BlueprintCallable) or BlueprintNativeEvent
- Visual-only callbacks: BlueprintImplementableEvent
- Function names self-documenting, single function < 50 lines
- Use UE smart pointers (TWeakObjectPtr, TSubclassOf, TObjectPtr)
- Prefer composition over inheritance (≤3 layers deep)
- Comment "why" not "what" for non-obvious decisions
- Use Gameplay Tags for categorization (not string matching)
- Subsystems preferred for global services (UE5.8 pattern)
```

---

## 6. 接口文档机制：让 AI 只读 C++ 就理解项目

### 6.1 核心问题

用户的目标："AI 大模型只需读 C++ 源码即可理解项目，无需解析二进制 .uasset"。

但项目里有 AnimBP、StateTree、BT 等可视化资产，它们承载了"什么时候做什么"的编排逻辑。AI 不读这些资产，怎么理解编排？

### 6.2 解决方案：接口契约文档

**核心思路**：C++ 源码里**自带**对可视化资产的"接口契约"声明。AI 读 C++ 就能理解资产的作用。

具体做法：在 C++ 头文件的 Doxygen 注释里写出"该类暴露给哪种资产、暴露了哪些变量/Task"。

**示例**（C++ AnimInstance 头文件）：
```cpp
/**
 * UCharacterAnimInstance - 玩家角色动画实例
 *
 * Responsibility: 为 AnimBP 提供动画状态依据变量
 * Network role: Client only (AnimBP 不复制)
 * Layer: Visual-bridge (C++ 暴露变量，AnimBP 资产编排状态机)
 *
 * Visual Asset Contract:
 *   - Asset: ABP_Player (Anim Blueprint)
 *   - Exposed variables (driving State Machine):
 *     - bIsMoving (bool): true when Speed > 5.0
 *     - Speed (float): current movement speed
 *     - bIsInAir (bool): true when character not on ground
 *     - bIsAttacking (bool): true during attack montage
 *     - AttackType (EAttackType): current attack type enum
 *   - Expected State Machine:
 *     - Idle ↔ Moving (transition: bIsMoving)
 *     - Idle/Moving → Jump (transition: bIsInAir)
 *     - Any → Attacking (transition: bIsAttacking)
 *     - Attacking → Idle (transition: montage finished)
 */
UCLASS()
class UCharacterAnimInstance : public UAnimInstance
{
    GENERATED_BODY()

public:
    virtual void NativeUpdateAnimation(float DeltaSeconds) override;

    // === Variables exposed to AnimBP State Machine ===
    UPROPERTY(BlueprintReadOnly, Category = "Movement")
    bool bIsMoving = false;

    UPROPERTY(BlueprintReadOnly, Category = "Movement")
    float Speed = 0.0f;

    UPROPERTY(BlueprintReadOnly, Category = "Movement")
    bool bIsInAir = false;

    UPROPERTY(BlueprintReadOnly, Category = "Combat")
    bool bIsAttacking = false;

    UPROPERTY(BlueprintReadOnly, Category = "Combat")
    EAttackType AttackType = EAttackType::None;

private:
    UPROPERTY(Transient)
    ACharacter* OwningCharacter = nullptr;
};
```

**AI 读这个头文件就能知道**：
- 这个角色有 Idle/Moving/Jump/Attacking 四个动画状态
- 状态切换依据是哪些变量
- 变量如何被设置（虽然具体逻辑在 .cpp，但 AI 知道意图）
- AnimBP 资产叫 ABP_Player，会用这些变量

**AI 不需要读 AnimBP 的 .uasset**，因为接口契约已经在 C++ 头文件里完整声明。

### 6.3 StateTree 的接口契约

```cpp
/**
 * UPatrolStateTask - 巡逻状态任务
 *
 * Responsibility: 在巡逻点之间移动
 * Layer: Visual-bridge (C++ 实现，被 StateTree 资产编排)
 *
 * Visual Asset Contract:
 *   - Asset: ST_EnemyAI (StateTree)
 *   - Used in State: Patrol
 *   - Transition out: Task returns Success → switch to Idle state
 *   - Inputs from StateTree:
 *     - PatrolPoints (TArray<AActor*>): set by ST_Evaluator_PatrolPoints
 *   - Outputs to StateTree:
 *     - CurrentPointIndex (int32): which point we're moving to
 */
UCLASS()
class UPatrolStateTask : public UStateTreeTask
{
    GENERATED_BODY()

public:
    virtual EStateTreeRunStatus EnterState(FStateTreeExecutionContext& Context,
                                            const FStateTreeActiveState& PreviousState) override;
    virtual EStateTreeRunStatus Tick(FStateTreeExecutionContext& Context,
                                      const float DeltaTime) override;
    virtual void ExitState(FStateTreeExecutionContext& Context,
                            const FStateTreeActiveState& NextState) override;

protected:
    // 输入：巡逻点列表（由 StateTree Evaluator 设置）
    UPROPERTY(EditAnywhere, Category = "Patrol")
    TArray<AActor*> PatrolPoints;

    // 输出：当前目标点索引
    UPROPERTY(VisibleAnywhere, Category = "Patrol")
    int32 CurrentPointIndex = 0;
};
```

### 6.4 接口契约的元规则

skill 要在 `C++ code conventions` 段强制要求：

```
Mandatory for classes bridging to visual assets:
- Doxygen comment must include "Visual Asset Contract" section
- List asset name(s) that use this class
- List all exposed variables/tasks with purpose
- For StateTree/BT: describe expected state transitions or node structure
- For AnimBP: describe state machine transitions
- For DataTable: describe which C++ struct is the row type
```

**为什么这有效**：
- AI 读 C++ 头文件 = 读完项目所有"逻辑 + 编排契约"
- 不需要反编译 .uasset（AI 也读不了二进制）
- 资产变了，契约要更新（自然语言约束），保持文档与资产同步
- 接口契约也是给设计师的"资产使用说明"，一举两得

---

## 7. 补充：8 个容易遗漏的边界情况

这是本篇独有的内容，用户要求"补充没想到的情况"。这些是实践中容易踩坑的边界。

### 7.1 边界 1：Gameplay Tags 的归属

**问题**：Gameplay Tags 是配置资产，但用在 C++ 逻辑里（如 `ActorHasTag("Enemy")`）。算 C++ 还是资产？

**准则**：
- Tag 的**定义**（哪些 Tag 存在）→ DefaultGameplayTags.ini（配置）
- Tag 的**使用**（C++ 里查询/比较 Tag）→ C++
- Tag 的**应用**（哪些 Actor/Ability 带 Tag）→ 蓝图配置或 DataTable

**反模式**：在 C++ 里硬编码 Tag 字符串字面量散落各处。

**正确做法**：在 C++ 里定义 `FName` 常量集中管理：
```cpp
// TagDefinitions.h
namespace FGameTags
{
    static const FName Enemy = "Enemy";
    static const FName Player = "Player";
    static const FName Brick = "Brick";
    static const FName Pushable = "Pushable";
}
```

### 7.2 边界 2：Editor Utility Widget / Tool

**问题**：编辑器工具脚本（Editor Utility Widget、Asset Action）是蓝图，要不要 C++ 化？

**准则**：
- **运行时游戏逻辑** → 必须 C++
- **编辑器工具脚本**（开发期辅助）→ 可以蓝图，因为不影响 AI 理解运行时项目

**反模式**：把运行时游戏逻辑混进 Editor Utility。

### 7.3 边界 3：C++ 不能热更，蓝图能

**问题**：移动端 / 主机项目需要 Pak 热更，C++ 不能热更但蓝图可以。怎么办？

**准则**：
- 核心稳定逻辑 → C++（不能热更，需发版）
- 经常调整的数值和配置 → DataTable/DataAsset（可热更）
- 表现层调整 → 蓝图（可热更）
- **重要的逻辑修复**：用蓝图函数重写 C++ 的 BlueprintNativeEvent 作为应急补丁

**反模式**：把需要热修的逻辑写死在 C++ 里，发版成本高。

### 7.4 边界 4：GameInstance Subsystem 的使用

**问题**：UE5.8 推荐用 Subsystem 模式做全局服务（如 UInventorySubsystem）。这算 C++ 还是配置？

**准则**：
- Subsystem 的**实现**（属性、方法、Tick） → 必须 C++
- Subsystem 的**配置**（初始化参数） → C++ 构造函数默认值 + 蓝图子类覆盖（如果需要）

**反模式**：用蓝图 Subsystem 类承载运行时逻辑。

### 7.5 边界 5：UMG Widget 的逻辑边界

**问题**：UMG Widget Blueprint 里有 Graph，可以写蓝图逻辑。怎么划分？

**准则**：
- UI **逻辑**（点击按钮触发什么、数据如何更新、状态切换） → C++（UUserWidget 子类）
- UI **布局**（控件位置、样式、绑定） → Widget Blueprint 资产
- UI **数据绑定** → C++ 暴露 UPROPERTY，Widget Blueprint 在设计师面板绑定

**反模式**：在 Widget Blueprint 的 Graph 里写网络请求、伤害计算等业务逻辑。

### 7.6 边界 6：C++ Blueprint Function Library 的范围

**问题**：Blueprint Function Library（静态函数库）是 C++ 写的，但给蓝图调用。怎么用？

**准则**：
- 用作蓝图调 C++ 的**桥接**：把 C++ 算法暴露给蓝图配置层调用
- **不要**承载游戏玩法规则（规则应该在 Actor/Component 里）
- **不要**用 BFL 绕过架构分层（如 BFL 直接修改 GameState）

**正确用法**：
```cpp
// 数学工具、查询工具、辅助函数
UCLASS()
class UGameplayHelpers : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

    UFUNCTION(BlueprintCallable, Category = "GameplayHelpers")
    static float CalculateDistance(AActor* A, AActor* B);

    UFUNCTION(BlueprintCallable, Category = "GameplayHelpers")
    static TArray<AActor*> GetActorsInRadius(FVector Center, float Radius);
};
```

### 7.7 边界 7：测试代码的归属

**问题**：测试用 C++ 单元测试还是蓝图自动化测试？

**准则**：
- **逻辑测试**（伤害计算、规则判定） → C++ 单元测试（Automation Spec）
- **集成测试**（PIE 多人、网络同步） → 蓝图 Automation Test 或 Automation Tool
- **UI 测试** → 蓝图或 Selenium-like 框架

**反模式**：只用蓝图测试，无法覆盖纯 C++ 算法。

### 7.8 边界 8：C++ 代码生成与 .generated.h

**问题**：UE 的 UHT（UnrealHeaderTool）会基于 UCLASS/UPROPERTY 生成代码。这影响 AI 阅读？

**准则**：
- AI **不需要读** .generated.h 和生成代码
- AI 只读 .h 和 .cpp 的人写部分
- 头文件里的 UCLASS/UPROPERTY 宏是 AI 的"接口线索"
- 在 Doxygen 注释里说明哪些是 UHT 处理的，AI 会忽略生成代码

**实践**：在 README 或 skill 里写明 "AI 阅读 Source/Public/ 和 Source/Private/ 下的 .h 和 .cpp，忽略 generated.h 和 Intermediate/"。

---

## 8. 完整范例：examples/inventory-system.md

```markdown
# Example: Inventory System (Strict Layer Separation)

> 用户输入："设计一个背包系统，UE5.8，C++ 承载逻辑，引擎资产保留"

## 1) Goal
设计背包系统：玩家拾取物品 → 进入背包 → UI 显示 → 可使用/丢弃/排序。
三层严格分离：C++ 逻辑、DataTable 数据、UMG 表现。

## 2) Inputs
- 玩家输入：Enhanced Input Action "IA_ToggleInventory"（按 I 键）
- 数据：DT_Items 物品表
- 网络约束：服务器权威（防刷物品）

## 3) Outputs
- C++ 类：UInventorySubsystem、UInventoryComponent、AInventoryItem、UInventoryWidget（UUserWidget 子类）
- C++ 结构：FItemData、EItemRarity
- 可视化资产：ABP_无（背包无动画）、WBP_Inventory（UI 布局）、DT_Items（数据）
- 输入资产：IA_ToggleInventory、IMC_Default

## 4) Assumptions
- UE5.8，使用 Subsystem 模式
- 单人游戏（如需多人，加 replication 配置）
- Enhanced Input 已配置

## 5) Implementation

### C++ Class Design

#### ItemData.h（数据结构）
```cpp
#pragma once

#include "CoreMinimal.h"
#include "ItemData.generated.h"

UENUM(BlueprintType)
enum class EItemRarity : uint8
{
    Common,
    Rare,
    Epic,
    Legendary
};

/**
 * FItemData - 物品数据行结构（DataTable 用）
 *
 * Responsibility: 定义物品的静态数据
 * Layer: Data (DataTable 行类型，由 C++ 定义，DT_Items 资产填充数据)
 * Related assets: DT_Items (DataTable)
 */
USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    FName ItemId;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    FText DisplayName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    EItemRarity Rarity = EItemRarity::Common;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    int32 MaxStack = 99;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    TSoftObjectPtr<UTexture2D> Icon;  // 软引用，避免一直加载

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    FText Description;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    int32 Value = 0;  // 售价
};
```

#### InventoryComponent.h
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "InventoryComponent.generated.h"

class UInventorySubsystem;
struct FItemData;

/**
 * UInventoryComponent - 背包组件（挂在 PlayerCharacter 上）
 *
 * Responsibility: 管理玩家背包的物品列表、增删改查
 * Network role: Server authoritative (all mutations go through server RPC)
 * Layer: Logic (all inventory logic here, no Blueprint logic)
 * Related assets: DT_Items (queries item data), WBP_Inventory (displays state)
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class UInventoryComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UInventoryComponent();

    // === Blueprint API (called by input handlers) ===

    /** 添加物品到背包，返回实际添加数量 */
    UFUNCTION(BlueprintCallable, Category = "Inventory")
    int32 AddItem(FName ItemId, int32 Count = 1);

    /** 移除物品 */
    UFUNCTION(BlueprintCallable, Category = "Inventory")
    bool RemoveItem(FName ItemId, int32 Count = 1);

    /** 使用物品 */
    UFUNCTION(BlueprintCallable, Category = "Inventory")
    bool UseItem(FName ItemId);

    /** 获取背包所有槽位（供 UI 读取） */
    UFUNCTION(BlueprintCallable, Category = "Inventory|Query")
    TArray<FName> GetAllItemIds() const;

    UFUNCTION(BlueprintCallable, Category = "Inventory|Query")
    int32 GetItemCount(FName ItemId) const;

    // === Events for UI (BlueprintImplementableEvent, BP binds to refresh UI) ===

    /** 背包内容变化时触发（UI 监听此事件刷新） */
    UFUNCTION(BlueprintImplementableEvent, Category = "Inventory|Event")
    void OnInventoryChanged();

protected:
    virtual void BeginPlay() override;

    // === Internal state (server-only) ===
    UPROPERTY(Replicated)
    TMap<FName, int32> Items;  // ItemId → Count

    // === Server-side logic ===
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_AddItem(FName ItemId, int32 Count);

    UFUNCTION(Server, Reliable, WithValidation)
    void Server_RemoveItem(FName ItemId, int32 Count);

    UFUNCTION(Server, Reliable, WithValidation)
    void Server_UseItem(FName ItemId);

    // 实际使用物品的逻辑（C++，根据 ItemId 查 DataTable 决定效果）
    bool ExecuteItemEffect(FName ItemId);

private:
    UPROPERTY()
    UInventorySubsystem* Subsystem;  // 缓存 Subsystem 引用
};
```

#### InventoryWidget.h（UI 逻辑 C++ 化）
```cpp
#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "InventoryWidget.generated.h"

class UInventoryComponent;
class UWrapBox;

/**
 * UInventoryWidget - 背包 UI 逻辑层（UUserWidget 子类）
 *
 * Responsibility: 处理 UI 交互逻辑（点击、拖拽、刷新），不处理业务规则
 * Network role: Client only
 * Layer: Logic (UI logic here in C++; layout in WBP_Inventory asset)
 * Related assets: WBP_Inventory (Widget Blueprint, layout only)
 *
 * Visual Asset Contract:
 *   - Asset: WBP_Inventory (Widget Blueprint)
 *   - Exposed properties (bound in designer):
 *     - ItemsWrapBox (UWrapBox*): 容器，C++ 动态添加子控件
 *   - Expected UI structure:
 *     - Root → Canvas Panel
 *       → Title Text
 *       → Close Button (OnClick bound to CloseInventory)
 *       → ItemsWrapBox (UPROPERTY binding)
 *       → Detail Panel (selected item info)
 */
UCLASS()
class UInventoryWidget : public UUserWidget
{
    GENERATED_BODY()

public:
    /** 初始化背包 UI，绑定组件 */
    void InitializeInventory(UInventoryComponent* InInventoryComp);

protected:
    virtual void NativeConstruct() override;

    // === UI 交互逻辑（C++，不写业务规则） ===

    /** 刷新背包显示（监听 OnInventoryChanged 触发） */
    UFUNCTION()
    void RefreshInventory();

    /** 点击物品槽，显示详情 */
    UFUNCTION()
    void OnItemClicked(FName ItemId);

    /** 关闭背包（绑定到 WBP 的 Close 按钮） */
    UFUNCTION(BlueprintCallable, Category = "Inventory|UI")
    void CloseInventory();

    // === Bound to WBP designer (UPROPERTY Binding) ===
    UPROPERTY(meta = (BindWidget))
    UWrapBox* ItemsWrapBox;

private:
    UPROPERTY()
    UInventoryComponent* InventoryComp = nullptr;

    // 创建物品槽子控件（C++ 工厂方法）
    class UItemSlotWidget* CreateItemSlot(FName ItemId, int32 Count);
};
```

### Visual Asset Interface Contracts

#### DataTable Contract
- **C++ struct**: `FItemData`（见 ItemData.h）
- **DataTable asset**: `DT_Items`
- **CSV format**:
```csv
ItemId,DisplayName,Rarity,MaxStack,Icon,Description,Value
ITEM_POTION_HP,生命药水,Common,99,T_Icon_Potion_HP,恢复 50 点生命,10
ITEM_POTION_MP,法力药水,Common,99,T_Icon_Potion_MP,恢复 30 点法力,15
ITEM_SWORD_IRON,铁剑,Rare,1,T_Icon_Sword_Iron,普通铁质长剑,100
```
- **C++ access**: `Subsystem->GetItemData(ItemId)` 返回 `FItemData*`

#### Widget Blueprint Contract
- **C++ class**: `UInventoryWidget`
- **Asset**: `WBP_Inventory`
- **Bound widgets**:
  - `ItemsWrapBox` (UWrapBox*) — 容器，C++ 动态填充子项
- **Buttons**:
  - Close Button → OnClick 绑定 `CloseInventory()`（C++ 函数）

#### Enhanced Input Contract
- **Input Action**: `IA_ToggleInventory`（按 I 键）
- **Input Mapping Context**: `IMC_Default`（包含 IA_ToggleInventory）
- **C++ binding**: PlayerCharacter 在 SetupPlayerInputComponent 里绑定 IA_ToggleInventory → 调用 `ToggleInventory()`

### Blueprint Config Layer
- 无 BP_ 子类需求（背包系统无变体）
- 如有不同角色不同容量上限，可加 BP_InventoryComponent_Extended 调整默认值

### DataTable Schemas
见上方 CSV 示例。

### Replication Notes
- **Runs on**:
  - Items map: Server authoritative, replicated to owning client
  - AddItem/RemoveItem: Client sends Server RPC, server validates and modifies
  - UseItem: Client sends Server RPC, server executes effect
- **RPCs**:
  - Server_AddItem / Server_RemoveItem / Server_UseItem: Client → Server (Reliable)
  - OnInventoryChanged: BlueprintImplementableEvent, server triggers, client listens
- **Replicated Vars**:
  - Items (TMap<FName, int32>): Replicated to owning client only (not broadcast)
- **Bandwidth**: single player inventory, minimal traffic

### Layer Boundary Checklist

#### C++ Layer (verify in C++)
- [x] 物品增删改查逻辑
- [x] 使用物品的效果判定
- [x] 背包容量上限检查
- [x] 网络同步（RPC、Replication）
- [x] UI 交互逻辑（点击、刷新）
- [x] DataTable 查询封装

#### Visual Asset Layer (verify NOT in C++)
- [x] 物品数值（攻击力、回复量） → DT_Items
- [x] UI 布局 → WBP_Inventory
- [x] 物品图标 → 软引用资产
- [x] 输入按键 → IA_ToggleInventory / IMC_Default

#### Anti-pattern Check
- [x] 没有在 C++ 硬编码物品数值（用 DT_Items）
- [x] 没有在 Widget Blueprint 的 Graph 写业务逻辑（UI 逻辑在 UInventoryWidget C++）
- [x] 没有在 C++ 里 if-else 判断物品类型（用 DataTable 数据驱动）

### Assets / Naming / Folders

```
Source/Inventory/                       ← C++ 源码
├── Public/
│   ├── InventoryComponent.h
│   ├── InventorySubsystem.h
│   ├── InventoryWidget.h
│   ├── InventoryItem.h
│   └── Data/
│       └── ItemData.h                  ← FItemData 结构
└── Private/
    ├── InventoryComponent.cpp
    ├── InventorySubsystem.cpp
    ├── InventoryWidget.cpp
    └── InventoryItem.cpp

/Game/Blueprints/Inventory/             ← 蓝图配置
└── WBP_Inventory.uasset                ← UI 布局（无 Graph 逻辑）

/Game/Data/                             ← 数据
└── DT_Items.uasset                     ← 物品表

/Game/Input/                            ← 输入配置
├── IA_ToggleInventory.uasset
└── IMC_Default.uasset

/Game/UI/                               ← UI 美术
├── Icons/
│   ├── T_Icon_Potion_HP.uasset
│   ├── T_Icon_Potion_MP.uasset
│   └── T_Icon_Sword_Iron.uasset
└── Fonts/
```

## 6) Test Checklist

- **PIE**:
  - 按 I 键打开/关闭背包
  - 拾取物品 → 背包显示更新
  - 点击物品 → 显示详情
  - 使用药水 → 数量减少，血量增加

- **Layer Isolation Tests**:
  - 删除 WBP_Inventory 资产 → C++ 编译通过（UI 逻辑独立）
  - 删除 DT_Items → C++ 编译通过（运行时报错合理）
  - 修改 DT_Items 数值 → 无需重新编译 C++，运行时生效
  - 修改 WBP_Inventory 布局 → 无需重新编译 C++，运行时生效

- **AI Readability Test**:
  - AI 读 InventoryComponent.h 能理解背包的所有操作
  - AI 读 InventoryWidget.h 能理解 UI 交互流程
  - AI 读 ItemData.h 能理解物品数据结构
  - AI 不读 WBP_Inventory 的 .uasset 也能复现 UI 设计（依据接口契约）

- **Anti-cheat (if multiplayer)**:
  - 客户端无法直接修改 Items map
  - 客户端篡改 AddItem 的 Count → Server_Validate 拦截
```

---

## 9. 改造步骤总结：UE5.8 严格分层项目 8 步法

1. **项目画像**：UE5.8 / C++ 全逻辑 / 引擎可视化资产保留 / AI 可读为目标
2. **Fork 改名**：`ue58-cpp-logic-gamepiece-designer`
3. **改 _meta.json**：slug/version/ownerId
4. **重写 description**：强调"strict layer separation"和"AI-readable"
5. **重构 Output format**：加 `Visual Asset Interface Contracts` 和 `Layer Boundary Checklist` 子段
6. **扩展命名规范**：加 StateTree Task / BT Task / AnimInstance / Subsystem 的 C++ 命名 + 可视化资产命名
7. **替换 defaults 段**：用 `Layer separation rules`（必须 C++ / 必须资产 / 混合 / 反模式四类）
8. **新增两个模板**：VisualAssetInterface_Template + Checklist_LayerBoundary
9. **强化 C++ 代码规范**：加 Doxygen "Visual Asset Contract" 段要求
10. **加 examples**：inventory-system.md（覆盖三层）+ ability-system.md（覆盖 GAS 混合层）
11. **自检 + 试用**：含"AI 可读性测试"和"分层隔离测试"

---

## 10. 与第 6/7/8 篇的差异对比

| 维度 | 第 6 篇 | 第 7 篇 | 第 8 篇 | 第 9 篇 |
|---|---|---|---|---|
| 范围 | 通用改造 | 异构多语言栈 | 单一玩法（推砖块） | **通用架构原则** |
| 焦点 | 改填充 | 多 Schema | C++ 优先物理 | **C++/可视化资产边界** |
| 独创段 | Performance | Layer Responsibility | Physics Notes | **Visual Asset Interface Contract** |
| 引擎资产 | 改默认值 | 删 Replication | 保留 | **明确保留 + 边界** |
| AI 协作 | 间接 | 间接 | 直接读 C++ | **只读 C++（接口契约机制）** |
| 反面教训 | 漏改默认值 | 逻辑写错层 | 蓝图写逻辑 | **强行 C++ 化丢失引擎能力** |

**第 9 篇的独特价值**：
- 提出"接口契约文档"机制，解决"AI 不读 .uasset 也能理解项目"的难题
- 明确"什么不 C++ 化"的边界（动画状态机、StateTree、BT、DataTable）
- 补充 8 个容易遗漏的边界情况（Tag/Editor Tool/热更/Subsystem/UMG/BFL/测试/UHT）
- 适用于任何 UE5.8 项目，不限定玩法

---

## 11. 本篇小结

### 三个核心结论

1. **C++ 逻辑层 + 引擎可视化资产层 + 美术层的严格边界**是 UE5.8 项目的最佳架构。C++ 化的目标是"逻辑可读"，不是"全 C++"。强行 C++ 化会丢失 AnimBP/StateTree/BT/DataTable 的可视化能力。
2. **接口契约机制**是让"AI 只读 C++ 就理解项目"的关键。C++ 头文件的 Doxygen 注释里写出"该类暴露给哪种资产、暴露了什么"，AI 不需要解析 .uasset 就能理解编排。
3. **三类规则**约束边界：必须 C++ / 必须资产 / 混合（C++ 定义框架 + 资产配置具体）。配反模式清单防止回流。

### 严格分层改造的元原则（5 条）

1. **逻辑进 C++，配置/表现进资产**：判断准则是"如何做" vs "是什么/看起来怎样"。
2. **编排资产保留**：StateTree/BT 是编排层，其 Task 必须是 C++，但编排本身保留可视化。
3. **接口契约文档化**：C++ 头文件 Doxygen 注释列出对可视化资产的暴露接口。
4. **不强行 C++ 化**：动画状态机、UI 布局、输入映射、数据表都保留引擎资产。
5. **AI 可读性是检验标准**：测试时验证"AI 只读 C++ 能否复现项目设计"。

### 四种改造的选型决策

```
你的项目是？
   │
   ├─ UE 单体，标准蓝图开发
   │   → 第 6 篇通用改造
   │
   ├─ 异构技术栈（多语言/多服务端/自定义协议）
   │   → 第 7 篇异构改造
   │
   ├─ UE 原生但 C++ 优先（具体玩法，如推砖块）
   │   → 第 8 篇 C++ 优先改造
   │
   └─ UE5.8，C++ 全逻辑 + 引擎资产保留 + AI 可读
       → 第 9 篇严格分层改造（本篇）
```

### 从原版到严格分层版的演化路径

```
原版 ue57-gamepiece-designer（蓝图中心，40v40）
   ↓ 第 6 篇：改填充（版本/规模/命名）
你的 v0.1.0（UE5.8，规模调整）
   ↓ 决定 C++ 承载全逻辑
你的 v0.2.0（产物改 C++ + 引擎资产保留）
   ↓ 加接口契约机制
你的 v0.3.0（Visual Asset Interface Contract 段）
   ↓ 加分层边界检查清单
你的 v0.4.0（Layer Boundary Checklist）
   ↓ 补充 8 个边界情况
你的 v0.5.0（边界规则完善）
   ↓ 加范例（inventory/ability）
你的 v1.0.0（UE5.8 严格分层稳定版）
```

每一步都是渐进式改造。**完成比完美更重要**。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
