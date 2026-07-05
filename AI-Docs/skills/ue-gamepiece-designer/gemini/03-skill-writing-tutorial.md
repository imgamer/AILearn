# 第 3 篇：保姆级教程——如何写一个自定义 Claude Code 技能

> 本篇把第 1、2 篇的分析提炼成**通用模板与标准步骤**，让初学者照着就能写出及格的 skill。
>
> 包含三部分：
> 1. **通用模板** — 一份可填充的 SKILL.md 骨架
> 2. **标准 7 步** — 从想清楚到发布完整流程
> 3. **避坑指南** — 初学者最容易犯的 10 个错

---

## 3.1 通用模板

下面这个模板是从 `ue57-gamepiece-designer` 提炼的"最大公约数"——任何领域的 skill 都能照着填。

### 3.1.1 SKILL.md 最小可行模板

```markdown
---
name: <skill-slug>
description: <动词> <领域> <产物清单> (Text-only, no scripts)
---

# <Skill Title> (Text-Only)

## What this skill does
When the user <触发条件>, produce a structured design ready to implement in <领域>:
- <产物 1> (<质量要求>)
- <产物 2> (<质量要求>)
- <产物 3> (<质量要求>)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (<提示>)
3) **Outputs** (<提示>)
4) **Assumptions**
5) **Implementation**
   - <子段 1> (<提示>)
   - <子段 2> (<提示>)
   - **Assets / Naming / Folders**
6) **Test Checklist**

## <领域> naming + folders (default)
- Root: `<路径>/<占位符>/`
- <类型 1>: `<前缀>_<Thing>`
- <类型 2>: `<前缀>_<Thing>`

## <领域> defaults (unless user says otherwise)
- <规则 1>
- <规则 2>
- <规则 3>
```

### 3.1.2 模板各部分的写作要点

| 部分 | 写作要点 | 反例 |
|---|---|---|
| YAML `name` | 全小写 + 连字符，与文件夹名一致 | `UE57 GamePiece Designer` |
| YAML `description` | 动词 + 领域 + 产物 + 形态四要素齐全 | "帮助用户做 UE" |
| `# 标题` | 写全名 + `(Text-Only)` 后缀 | "我的 skill" |
| `When the user...` | 用 When-Then 句式，给领域关键词 | "本 skill 用于..." |
| 产物清单 bullet | 每项是"可验证的输出物" + 括号质量要求 | "输出设计文档" |
| Safety 规则 | 全用 `Do NOT`，每条配替代行为 | "注意安全" |
| Output format | 编号 `1)` + 加粗标题 + `(always)` | "我会输出..." |
| 领域约定 | 用 `<占位符>` + `(default)` + `(unless specified)` | 写死具体值不留口子 |
| 领域默认值 | 用量化指标（如 40v40、200 粒子） | "large scale" |

### 3.1.3 完整目录结构模板

```
<skill-slug>/                     ← 文件夹名 = slug = SKILL.md 的 name
├── SKILL.md                      ← 必须，固定文件名
├── _meta.json                    ← 分发时必须
├── Templates/                    ← 推荐但非必须（待填充骨架）
│   ├── <Topic>_Template.md       ← 输出骨架模板
│   ├── Checklist_<Topic>.md      ← 检查清单模板
│   └── Schema_<Topic>_<Type>.csv ← 数据 schema 示例（如适用）
└── examples/                     ← 进阶可选（已填充范例）
    ├── example-1.md              ← 标杆输出范例 1
    ├── example-2.md              ← 标杆输出范例 2
    └── example-3.md              ← 标杆输出范例 3
```

> 💡 **关于 `examples/`**：与 Templates 的"待填充骨架"不同，examples 是**已填充完毕的标杆输出**，
> 用于通过 few-shot 学习对齐输出深度和措辞。何时该加、如何写、怎么在 SKILL.md 引用，
> 详见 [第 5 篇：examples 指南](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/05-examples-guide.md)。
> 初学者第一版 skill 可以**先不加 examples**，等发现输出质量不稳定时再加。

### 3.1.4 _meta.json 模板

```json
{
  "ownerId": "<your-owner-id>",
  "slug": "<skill-slug>",
  "version": "0.1.0",
  "publishedAt": <当前时间的 Unix 毫秒时间戳>
}
```

---

## 3.2 标准 7 步：从想清楚到发布

### Step 1：定义边界（动手前最重要的一步）

**做什么**：回答 5 个问题，确认 skill 的职责范围。

| 问题 | 必须明确回答 |
|---|---|
| 解决什么问题？ | 一句话写清 |
| 触发条件是什么？ | 列 3 个该触发的场景 + 3 个不该触发的场景 |
| 产出什么？ | 列出可验证的产物清单 |
| 不做什么？ | 明确边界外的内容 |
| 安全规则？ | 列出禁止的操作 + 替代行为 |

**为什么这一步最重要**：80% 的 skill 失败案例都败在边界没想清楚。要么太宽（误触发）、要么太窄（触发不到）、要么职责混乱（又设计又执行）。

**避坑提示**：如果一个 skill 试图解决超过 3 类问题，拆成多个 skill。

### Step 2：建目录结构

**做什么**：按 3.1.3 的模板建文件夹和文件。

```bash
mkdir -p <skill-slug>/Templates
touch <skill-slug>/SKILL.md
touch <skill-slug>/_meta.json
```

**避坑提示**：文件夹名、SKILL.md 的 name、_meta.json 的 slug **三者必须完全一致**。这是系统识别 skill 的硬约束。

### Step 3：写 SKILL.md 的 YAML 头

**做什么**：填 `name` 和 `description`。

```yaml
---
name: ue57-weapon-fx-designer
description: Designs UE5.7 weapon VFX (Niagara emitter recipes, audio config, Blueprint integration, perf checklist). Text-only, no scripts.
---
```

**写作公式**：`<动词> <领域+版本> <产物清单>. <形态>`。

- 动词：Designs / Generates / Diagnoses / Controls / Audits
- 领域+版本：UE5.7 weapon VFX / UE5.7 multiplayer save system
- 产物清单：括号里列 3-5 项核心产物
- 形态：Text-only, no scripts / Executable with MCP / etc.

**避坑提示**：description 不要写"帮助用户处理 XX 相关任务"。这种描述太宽，会被大量无关输入误触发。

### Step 4：写 What / Safety / Output format 三段

**做什么**：写 SKILL.md 的核心三段。

#### What 段

```markdown
## What this skill does
When the user asks for <触发条件>, produce a structured design ready to implement in <领域>:
- <产物 1> (<质量要求>)
- <产物 2> (<质量要求>)
- <产物 3> (<质量要求>)
- <产物 4> (<质量要求>)
- <产物 5> (<质量要求>)
```

#### Safety 段（直接抄，因为是通用的）

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.
```

如果你的 skill 需要执行操作（如 UE 自动化），需要细化 Safety，第 4 篇会讲。

#### Output format 段

```markdown
## Output format (always)
1) **Goal**
2) **Inputs** (<提示>)
3) **Outputs** (<提示>)
4) **Assumptions**
5) **Implementation**
   - <子段 1> (<提示>)
   - <子段 2> (<提示>)
   - **Assets / Naming / Folders**
6) **Test Checklist**
```

**避坑提示**：`(always)` 这个词不能省。没有它，Claude 在简单问题上会自作主张省略某段。

### Step 5：写领域约定段

**做什么**：写命名规范 + 默认技术选型。

```markdown
## <领域> naming + folders (default)
- Root: `/Game/Systems/<SystemName>/`
- Blueprints: `BP_<Thing>`
- DataTables: `DT_<Thing>`
- ...

## <领域> defaults (unless user says otherwise)
- <规则 1 with 量化指标>
- <规则 2 with 量化指标>
- ...
```

**避坑提示**：
- 用量化指标代替形容词（"40v40" 比 "large scale" 强 10 倍）
- 用 `(default)` / `(unless specified)` 声明可覆盖性
- 用 `<占位符>` 标记可替换位置

### Step 6：写模板文件

**做什么**：在 Templates/ 下放可复用的输出骨架。

- 输出主要产物有复杂结构 → 写 `<Topic>_Template.md`
- 需要检查清单 → 写 `Checklist_<Topic>.md`
- 涉及数据表 → 写 `Schema_<Topic>_<Type>.csv`

**模板写作要点**：
- 每个可替换位置用 `<尖括号占位符>`
- 占位符尽量给"提示性选项"，如 `<BeginPlay / InputAction / CustomEvent>`
- 用编号列表强调顺序敏感的内容
- 用 `(quality? yes/no)` 这种二元提示强迫 Claude 做决策

**避坑提示**：SKILL.md 要**显式引用模板**。在 Output format 段加一句"Implementation 段参照 Templates/xxx.md 的格式"。本案例没加这句是个小瑕疵，别重蹈覆辙。

### Step 7：写 _meta.json 并自检

**做什么**：填元数据，然后用自检清单验收。

```json
{
  "ownerId": "<your-owner-id>",
  "slug": "<skill-slug>",
  "version": "0.1.0",
  "publishedAt": 1773200000000
}
```

**自检清单**：

- [ ] YAML 头的 name 与文件夹名、_meta.json 的 slug 三者一致？
- [ ] description 包含动词 + 领域 + 产物 + 形态四要素？
- [ ] What 段用了 When-Then 句式？
- [ ] What 段的产物清单每项都给了括号质量要求？
- [ ] Safety 段每条都配了替代行为？
- [ ] Output format 用了编号 + 加粗 + `(always)`？
- [ ] 领域约定用了占位符 + `(default)` + 可覆盖声明？
- [ ] 领域默认值用了量化指标？
- [ ] 模板用 `<占位符>` 标记所有可替换位置？
- [ ] 模板的 Testing 段给了具体可执行场景？
- [ ] SKILL.md 显式引用了 Templates/ 下的模板？
- [ ] 没有把详细模板塞进 SKILL.md？
- [ ] （进阶）若加了 `examples/`，SKILL.md 是否显式引用了范例文件？
- [ ] （进阶）每个范例是否完整填充了 6 段且命名严格遵守前缀？

> 💡 后两项是进阶检查，不加 examples 可跳过。加 examples 的完整流程见
> [第 5 篇](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/05-examples-guide.md)。

全部勾选 = 及格的 skill，可以发布。

---

## 3.3 避坑指南：初学者最容易犯的 11 个错

下面这些错按"出现频率 + 危害程度"排序，前 3 个最致命。

### 坑 1：description 写得太宽

**症状**：skill 被无关输入误触发，或触发不到目标输入。

**反例**：
```yaml
description: 帮助用户处理虚幻引擎相关任务。
```

**正例**：
```yaml
description: Designs UE5.7 multiplayer-friendly game pieces (Blueprint node chains, data schemas, asset naming, and test checklists). Text-only, no scripts.
```

**为什么错**："虚幻引擎相关任务"包括写代码、调试、设计、资产管理……skill 会跟一堆其他 skill 抢触发，最终谁都不命中。

**修复方法**：用"动词 + 领域 + 产物 + 形态"四要素公式重写。

### 坑 2：把详细模板塞进 SKILL.md

**症状**：SKILL.md 越写越长，token 占用爆炸，多次对话后挤压可用预算。

**反例**：
```markdown
## Output format
1) Goal
2) Inputs
3) ...
5) Implementation
   - Blueprint Recipe:
     1. Event: <BeginPlay / InputAction>
     2. Node: <exact node name>
     3. Branch: <condition>
     4. Set Var: <name> (replicated? yes/no)
     5. Call: <function/interface>
   - Replication Notes:
     - Runs on: Server / Client / Both
     - RPCs: <Server_DoX>
     ...
```

**正例**：SKILL.md 只写"Implementation 段参照 Templates/BlueprintRecipe_Template.md"，详细骨架放模板文件。

**为什么错**：SKILL.md 全文注入上下文，每次对话都占 token。模板按需读取，省预算。

**修复方法**：把详细骨架抽到 Templates/，SKILL.md 只放行为规则。

### 坑 3：Safety 段只写"Do NOT"不写替代行为

**症状**：用户提需求时 Claude 不知道怎么办，要么拒绝要么绕过安全规则。

**反例**：
```markdown
## Safety
- Do NOT modify files.
- Do NOT run commands.
```

**正例**：
```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.
```

**为什么错**：光"堵"不"疏"，Claude 在用户提"帮我创建文件"时会卡住或乱来。

**修复方法**：每条 Do NOT 后面加 `If ..., respond with ...`。

### 坑 4：Output format 没用 `(always)`

**症状**：Claude 在简单问题上自作主张省略某段，输出结构不稳定。

**反例**：
```markdown
## Output format
1) Goal
2) Inputs
3) Outputs
...
```

**正例**：
```markdown
## Output format (always)
1) **Goal**
2) **Inputs** (what variables/configs it needs)
...
```

**修复方法**：加 `(always)` + 加粗标题 + 括号质量要求。

### 坑 5：领域约定用形容词不用量化指标

**症状**：Claude 在生成具体方案时没有锚点，输出质量波动大。

**反例**：
```markdown
## Performance defaults
- Avoid heavy tick logic.
- Replicate only necessary data for large scale.
```

**正例**：
```markdown
## Multiplayer defaults (unless user says otherwise)
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**修复方法**：把 "large" 换成 "40v40+"，把 "heavy" 换成具体数字。

### 坑 6：占位符没给提示性选项

**症状**：Claude 在占位符处瞎填，输出不符合预期格式。

**反例**：
```markdown
1. Event: <event>
2. Node: <node>
```

**正例**：
```markdown
1. Event: <BeginPlay / InputAction / CustomEvent>
2. Node: <exact node name> → settings: <important pin values>
```

**修复方法**：占位符改成 `<选项1 / 选项2 / 选项3>` 格式。

### 坑 7：name/slug/文件夹名不一致

**症状**：skill 加载失败，或被系统忽略。

**反例**：
```
文件夹：UE57-GamePiece-Designer/
SKILL.md: name: ue57_gamepiece_designer
_meta.json: slug: ue57-gamepiece-designer-v1
```

**正例**：三者完全一致，都是 `ue57-gamepiece-designer`。

**修复方法**：建文件夹前先定好 slug，三者统一。

### 坑 8：YAML 头格式错

**症状**：系统解析失败，skill 不被识别。

**反例**：
```markdown
name: ue57-gamepiece-designer
description: ...
---
```

（开头少了 `---`）

**正例**：
```markdown
---
name: ue57-gamepiece-designer
description: ...
---
```

**修复方法**：YAML 头必须用 `---` 包裹，开头和结尾都不能少。

### 坑 9：一个 skill 想做太多事

**症状**：skill 职责混乱，触发判定不稳定，输出质量不可控。

**反例**：一个 skill 同时做"设计 + 代码生成 + 调试 + 资产管理"。

**正例**：拆成 4 个 skill，各管一摊。

**修复方法**：一个 skill 只解决一类问题。如果你能用一句话描述 skill 的职责，就 OK；描述不出或要分几句说，就拆。

### 坑 10：不写 Test Checklist 段

**症状**：用户拿到设计后不知道怎么验证，bug 上线才发现。

**反例**：Output format 只有 5 段（Goal/Inputs/Outputs/Assumptions/Implementation），没有 Test。

**正例**：6 段齐全，Test Checklist 段给具体可执行场景（PIE / Dedicated Server / Latency）。

**修复方法**：把 Test Checklist 设为强制段，每段给 3 个具体测试场景。

### 坑 11：误用 examples 或不加引用

**症状**：加了 `examples/` 目录但输出质量没改善；或 examples 和 Templates 混淆。

**反例 1（混淆）**：把 examples 当 Templates 用，里面写 `<占位符>`。
```markdown
# examples/my-example.md
1) Goal: <one sentence>
2) Inputs: <input 1>
```

**正例 1**：examples 必须是**已填充完毕的完整范例**，没有占位符。
```markdown
# examples/my-example.md
1) Goal: 设计生命药水拾取系统，按 E 拾取，多人同步
2) Inputs: Enhanced Input Action "IA_Interact"、玩家进入碰撞盒触发
```

**反例 2（不引用）**：建了 examples/ 但 SKILL.md 没提。
```markdown
## Output format (always)
1) Goal
...
6) Test Checklist
（结尾没有引用 examples）
```

**正例 2**：在 Output format 段后显式引用 examples。
```markdown
## Output format (always)
1) Goal
...
6) Test Checklist

> **参考范例**：生成前先读 `examples/example-1.md`，对照其深度和粒度。
```

**为什么错**：
- 反例 1：examples 是 few-shot 范例，必须是完整答案。占位符让它失去了"标杆"作用。
- 反例 2：examples 不自动注入，SKILL.md 不引用 = Claude 不知道有范例可参考 = 加了等于没加。

**修复方法**：
- examples 写完整答案，不放占位符
- SKILL.md 的 Output format 段末尾用 `>` 引用块显式列出范例文件
- 详见 [第 5 篇：examples 指南](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/05-examples-guide.md)

---

## 3.4 实战范例：从零写一个 skill（10 分钟）

为了让你完整体验一次，下面用 7 步法写一个新 skill：`ue57-weapon-fx-designer`（UE5.7 武器特效设计）。

### Step 1：定义边界

| 问题 | 回答 |
|---|---|
| 解决什么问题？ | 用户要设计武器特效（开火/命中/爆炸），需要把 Niagara + Audio + Blueprint 三者整合 |
| 触发条件？ | 用户说"武器特效""开火特效""命中特效""Niagara 武器" |
| 产出什么？ | Niagara 配方 + Audio 配置 + BP 整合节点链 + 性能检查 + 测试清单 |
| 不做什么？ | 不创建 .uasset，不写 C++，不调 MCP |
| 安全规则？ | 纯文本，不执行，不改文件 |

### Step 2-7：直接给最终产物

#### 目录结构

```
ue57-weapon-fx-designer/
├── SKILL.md
├── _meta.json
└── Templates/
    ├── NiagaraEmitter_Template.md
    └── Checklist_Performance.md
```

#### SKILL.md

```markdown
---
name: ue57-weapon-fx-designer
description: Designs UE5.7 weapon VFX (Niagara emitter recipes, audio config, Blueprint integration node chains, perf checklist). Text-only, no scripts.
---

# UE5.7 Weapon FX Designer (Text-Only)

## What this skill does
When the user asks for a weapon effect (muzzle flash, impact, explosion, trail) in Unreal Engine 5.7, produce a structured design ready to implement:
- Niagara emitter recipes (modules, parameters, lifecycle)
- Audio cue config (sound classes, concurrency, attenuation)
- Blueprint integration node chain (spawn → bind → cleanup)
- Performance sanity (particle count budget, LOD, pooling)
- Test checklist (PIE, dedicated server, low-end hardware)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (trigger event, weapon type, target platform)
3) **Outputs** (Niagara system, audio cue, BP function)
4) **Assumptions**
5) **Implementation**
   - **Niagara Recipe** (emitter modules + parameters; refer to Templates/NiagaraEmitter_Template.md)
   - **Audio Config** (cue, attenuation, concurrency)
   - **Blueprint Integration** (spawn → bind → cleanup)
   - **Assets / Naming / Folders**
6) **Test Checklist** (refer to Templates/Checklist_Performance.md)

## UE naming + folders (default)
- Root: `/Game/Systems/<WeaponName>/FX/`
- Niagara Systems: `NS_<Effect>` (e.g., NS_MuzzleFlash)
- Niagara Emitters: `NE_<Effect>`
- Audio Cues: `Cue_<Sound>` (e.g., Cue_FireRifle)
- Sound Classes: `SC_<Category>` (e.g., SC_Weapon)
- Sound Attenuation: `Att_<Scope>` (e.g., Att_Range30m)
- Material Instances: `MI_<Effect>` (e.g., MI_BeamTracer)

## Performance defaults (unless user says otherwise)
- Max particles per effect: 200 (muzzle), 500 (explosion)
- Use Niagara pooling for effects spawned >5/sec
- LOD: 3 levels (close / mid / far), cull beyond 80m
- Avoid Tick in BP; use Niagara event handlers
- Audio concurrency: max 4 simultaneous of same class
```

注意第 5、6 段**显式引用了模板**——这是本案例比 `ue57-gamepiece-designer` 更严谨的地方。

#### _meta.json

```json
{
  "ownerId": "<your-owner-id>",
  "slug": "ue57-weapon-fx-designer",
  "version": "0.1.0",
  "publishedAt": 1773200000000
}
```

#### Templates/NiagaraEmitter_Template.md

```markdown
# Niagara Emitter Recipe Template

## Goal
<one sentence>

## Emitter Summary
- Name: NE_<Effect>
- Lifecycle: <OneShot / Looping / Burst>
- Max Particles: <number>
- Sim Target: <CPUSim / GPUSim>

## Modules (in stack order)
1. **Spawn**: <Spawn Burst / Spawn Rate> → <count/rate>
2. **Initialize**: <Initialize Particle> → lifetime, color, size
3. **Shape**: <Sphere / Box / Line> → <dimensions>
4. **Velocity**: <Add Velocity> → <speed/range>
5. **Color**: <Color over Life> → <gradient>
6. **Size**: <Scale over Life> → <curve>
7. **Force**: <Gravity / Drag> → <values>
8. **Render**: <Sprite / Ribbon / Mesh> → <material>

## User Parameters (exposed)
- <ParamName> (<type>) - <purpose>

## Notes
- <performance / pairing tips>
```

#### Templates/Checklist_Performance.md

```markdown
# Performance Checklist (UE VFX)

## Particle Budget
- Muzzle flash: ≤200 particles, ≤0.3s lifetime
- Explosion: ≤500 particles, ≤2s lifetime
- Tracer: ≤30 particles, ribbon, ≤0.5s lifetime

## Pooling
- Effects spawned >5/sec must use Niagara pooling
- Pool size = max concurrent instances + 20% buffer

## LOD
- LOD0 (close, <10m): full quality
- LOD1 (mid, 10-40m): halve spawn rate
- LOD2 (far, 40-80m): 1/4 spawn rate, simpler material
- Cull beyond 80m

## Audio
- Same sound class: max 4 concurrent
- Attenuation radius matches visual range
- 3D spatialization for all weapon SFX

## Testing
- PIE: visual correct, no warning in output log
- Dedicated server: effects spawn on all clients
- Low-end hardware (GTX 1060): ≥60fps with 10 weapons firing
```

### 自检

用 3.2 的 Step 7 自检清单逐项过：

- [x] name/slug/文件夹名一致（都是 `ue57-weapon-fx-designer`）
- [x] description 四要素齐全
- [x] What 用 When-Then
- [x] Safety 4 条 + 替代行为
- [x] Output format 编号 + 加粗 + `(always)`
- [x] 领域约定有占位符 + `(default)`
- [x] 性能默认值有量化指标（200/500 粒子、80m cull）
- [x] 模板用占位符 + 提示性选项
- [x] 模板 Testing 段有具体场景（PIE / Dedicated / GTX 1060）
- [x] SKILL.md 显式引用了模板
- [x] 没把详细模板塞进 SKILL.md

全部勾选 = 及格，可以发布试用。

---

## 3.5 本篇小结

### 三个核心结论

1. **写 skill 的本质是用自然语言写"约束"**。约束越精确，输出越稳定。
2. **7 步法是通用流程**：定义边界 → 建目录 → 写 YAML → 写核心三段 → 写领域约定 → 写模板 → 自检。
3. **避坑指南 11 条，前 3 个最致命**：description 太宽、模板塞进 SKILL.md、Safety 没替代行为；第 11 条专门讲 examples 的误用（详见第 5 篇）。

### 写 skill 的元原则（5 条）

1. **最小信任**：能不执行就不执行，能不改文件就不改文件。
2. **强制结构**：用编号 + 加粗 + `(always)` 把输出格式钉死。
3. **领域知识写死**：约定、默认值、量化指标都直接写进 SKILL.md。
4. **模板分离**：详细骨架放 Templates/，SKILL.md 只放行为规则。
5. **可覆盖声明**：用 `(default)` / `(unless specified)` 给用户留覆盖口子。

### 下一篇

第 4 篇 [04-ue-automation-migration.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/04-ue-automation-migration.md) 会突破"纯文本"限制，讲怎么让 skill 真的去调用 UE Python API / Web Remote Control，实现真正的虚幻引擎自动化。包含 `UE_AssetCheck` 和 `UE_LightSetup` 两个完整实战设计。
