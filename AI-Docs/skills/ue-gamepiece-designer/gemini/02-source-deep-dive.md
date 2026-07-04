# 第 2 篇：技术细节与源码拆解（How）

> 本篇逐一拆解 `ue57-gamepiece-designer` 的源码实现细节。四个维度：
> 1. **参数解析与意图识别** — 用户的自然语言怎么被"翻译"成结构化输入
> 2. **工具/API 交互** — skill 怎么和外部环境打交道（答案是"几乎不打交道"，但有其设计原因）
> 3. **错误处理与边界防御** — 源码做了哪些容错（重点是 Safety 段 + 占位符 + 默认值三重防御）
> 4. **状态管理与上下文保持** — 单次执行 vs 多轮对话

---

## 2.1 参数解析与意图识别

### 2.1.1 传统代码 vs Skill 的"参数解析"

写惯了传统函数的开发者会期待这样的签名：

```python
def design_gamepiece(name: str, multiplayer: bool, scale: int = 40) -> DesignDoc:
    ...
```

然后期待 skill 里有某种"参数解析器"把用户输入映射到这些参数。

**但 skill 没有这种东西**。Claude Code Skill 的"参数解析"完全靠**自然语言理解 + 结构化输出约束**完成。它的工作流是：

```
用户自然语言输入
       │
       ▼
Claude 的语言理解能力（不是代码逻辑）
       │
       ▼
对照 SKILL.md 的 "What this skill does" 段
判断是否属于本 skill 的职责
       │
       ▼
对照 "Output format" 段的 6 段结构
把用户需求"装进" Goal/Inputs/Outputs/Assumptions 这 4 段
       │
       ▼
生成结构化输出
```

### 2.1.2 案例源码的"意图识别"机制

看 [SKILL.md:8-14](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) 的 What 段：

```markdown
## What this skill does
When the user asks for a UE system or "game piece", produce a structured design that is ready to implement in Unreal Engine 5.7:
- Blueprint node chain recipes (ordered steps, node names, variables, events)
- DataTable / DataAsset schemas (field list + example rows)
- Asset / folder plan (paths + naming)
- Multiplayer sanity: server/client responsibility, replication notes
- Test checklist (PIE, dedicated server, latency, edge cases)
```

这段做了三件事：

| 行 | 做了什么 | 怎么做 | 为什么 |
|---|---|---|---|
| `When the user asks for...` | 定义触发条件 | 用 When-Then 句式 | Claude 对这个句式最敏感，触发判定稳定 |
| `UE system or "game piece"` | 给出领域关键词 | 双关键词（正式 + 口语） | 用户可能说"UE 系统"也可能说"游戏部件"，都该命中 |
| 5 个 bullet | 列出产物清单 | 每项是"可验证的输出物" | 用户能逐项对账，少一项就是 skill 没执行到位 |

### 2.1.3 "参数"如何从自然语言中浮现

以用户输入"帮我设计一个生命药水拾取系统，按 E 拾取，多人同步"为例，看 Claude 怎么把它解析成 6 段输出：

| Output format 段 | Claude 从用户输入中"提取"的内容 | 对应源码约束 |
|---|---|---|
| 1) Goal | "设计生命药水拾取系统" | Output format 第 1 段要求 |
| 2) Inputs | "玩家按键 E / 多人游戏环境" | Output format 第 2 段要求 `(what variables/configs it needs)` |
| 3) Outputs | "蓝图 BP_Pickup_HealthPotion / 数据表 DT_Consumables / 网络同步逻辑" | Output format 第 3 段要求 |
| 4) Assumptions | "假设 UE5.7 / 假设 40v40 规模 / 假设按 E 是 Enhanced Input" | Output format 第 4 段要求（无显式约束，靠 Claude 推断） |
| 5) Implementation | "蓝图节点链 + Replication Notes + 资产命名" | Output format 第 5 段要求 + UE naming 段约束命名 |
| 6) Test Checklist | "PIE / Dedicated Server / 模拟延迟" | Output format 第 6 段要求 + Multiplayer defaults 段约束测试维度 |

注意：**整个"参数解析"过程没有一行代码**。它完全靠 Claude 的语言理解能力 + SKILL.md 的结构约束完成。

### 2.1.4 参数缺失/模糊的处理

用户输入经常不完整，比如：

> 用户："帮我做个药水"

这里缺了：拾取方式（按 E？走过去自动拾取？）、是否多人、规模（10 人？100 人？）、UE 版本。

Claude 怎么处理？看 [SKILL.md:41-46](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) 的 Multiplayer defaults 段：

```markdown
## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**关键机制**：`(unless user says otherwise)` + `40v40+ scale`。

- 用户没说多人规模 → Claude 用默认值 `40v40+`
- 用户没说是否多人 → Claude 默认按多人设计（因为 skill 是 "multiplayer-friendly"）
- 用户没说拾取方式 → Claude 在 Assumptions 段写"假设按 E 拾取"，并提示"如需其他方式请告知"

**为什么这样设计？**
- **默认值兜底**：避免 Claude 瞎猜或卡住不输出。
- **声明可覆盖**：用户后续可以覆盖默认值，比如"这是单机游戏，跳过多人"。
- **量化指标锚定**：`40v40+` 给 Claude 一个具体的规模参照，比"large scale"靠谱。

### 2.1.5 小结：参数解析的"三件套"

| 机制 | 源码位置 | 作用 |
|---|---|---|
| **When-Then 触发** | SKILL.md:9 | 识别意图，决定是否启用 skill |
| **产物清单** | SKILL.md:10-14 | 把模糊需求"装进"5 类产物 |
| **默认值 + 可覆盖** | SKILL.md:41-46 | 处理参数缺失，避免卡住 |

---

## 2.2 工具/API 交互

### 2.2.1 这个 skill 不调用任何 API

**重要结论**：`ue57-gamepiece-designer` 是**纯文本型 skill**，源码中没有任何 API 调用、没有 shell 命令、没有 HTTP 请求、没有文件 I/O。

证据在 [SKILL.md:17-21](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md)：

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.
```

这 4 条规则**显式禁止**了所有外部交互：

| 规则 | 禁止的交互类型 |
|---|---|
| 不跑终端命令 | 禁止 shell / subprocess / exec |
| 不让用户下载运行脚本 | 禁止生成可执行代码 |
| 不改文件 | 禁止文件 I/O（写 .uasset / .cpp / .py） |
| 用户要文件时给内容 | 禁止直接创建文件，但允许输出可粘贴文本 |

### 2.2.2 为什么禁止所有交互

这是 skill 工程化的一个**核心设计决策**，理由有四：

#### 理由 1：可审计性

```
纯文本输出 → 用户逐行读 → 满意就复制粘贴 → 不满意丢掉重生成
   ↑ 这条链路每一步都可审计

AI 直接执行 → 改了文件 / 跑了命令 → 错了不知道错在哪
   ↑ 黑盒，出错只能靠 Git 回滚
```

UE 项目资产破坏的代价极高（一个 `.uasset` 损坏可能让整个关卡打不开），不值得让 AI 直接动手。

#### 理由 2：跨环境兼容

```
纯文本 skill → 在任何 Claude 宿主都能用
   • Claude Code CLI（Linux/Mac/Windows）
   • Trae IDE
   • Web 对话
   • API 调用

依赖执行的 skill → 换环境就废
   • 假设有 bash → Windows 没有
   • 假设有 UE Python → 用户没装
   • 假设有 MCP → 宿主不支持
```

#### 理由 3：最小信任原则

```
信任程度：纯文本 < 创建文件 < 执行命令 < 修改系统
   ↑                                          ↑
  最安全                                   最危险

这个 skill 选择"最安全"档位，因为它的任务是"设计"而非"实施"。
```

#### 理由 4：用户痛点定位

UE 开发里"动手实现"的工具链很成熟（蓝图编辑器、C++ IDE、Python Scripting），但"设计阶段想清楚"的工具几乎没有。这个 skill 补的就是这个缺口——**它不需要动手，只需要动脑**。

### 2.2.3 模板文件的"间接交互"

虽然 skill 不直接调用 API，但它通过**模板文件**间接和环境交互。看 [Templates/Schema_Ability_DT.csv](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/Schema_Ability_DT.csv)：

```csv
AbilityId	DisplayName	AbilityType	School	RangeMin	RangeMax	GCDSeconds	CooldownSeconds	CostType	CostAmount	CastTimeSeconds	RequiresLOS	CanMoveWhileCasting	IconId	Notes
FIREBALL	Fireball	Damage	Fire	0	30	1.5	8	Mana	20	2	TRUE	FALSE	icon_fireball	Basic ranged nuke
HEAL	Heal	Heal	Holy	0	40	1.5	6	Mana	25	2	TRUE	FALSE	icon_heal	Single target heal
MELEE_SWING	Melee Swing	Damage	Physical	0	3	1.5	0	Energy	0	0	TRUE	TRUE	icon_swing	Basic melee
```

这个 CSV 是**用户可直接导入 UE 的成品**。UE 编辑器支持"导入 CSV 到 DataTable"，所以 Claude 生成的 DataTable 设计不只是一段文字，而是**用户可以一键导入的真实数据**。

这是一种"模板即交付物"的设计：

```
传统 skill 输出：文字描述 → 用户照着手工建表
   ↓
本 skill 输出：CSV 内容 → 用户复制保存为 .csv → UE 编辑器导入 → DataTable 自动生成
```

虽然 skill 本身不调用 UE API，但它产出的内容**天然兼容 UE 的导入机制**。这是"零执行"和"高可用"的平衡点。

### 2.2.4 与其他 skill 类型的对比

| Skill 类型 | 是否调用 API | 典型交互 | 案例 |
|---|---|---|---|
| **设计型**（本案例） | ❌ 不调用 | 只输出文本 | ue57-gamepiece-designer |
| **代码生成型** | ❌ 不调用 | 输出可粘贴代码 | ue5-bp-code-generator |
| **诊断型** | ❌ 不调用 | 输出诊断步骤 | ue5-crash-diagnoser |
| **MCP 集成型** | ✅ 调用 MCP 工具 | 真的 spawn actor / 改资产 | ue5-mcp-controller |
| **Hook 触发型** | ✅ 跑 shell | 文件改动后跑命令 | pre-commit hooks |

**关键认知**：本案例的"零交互"不是 skill 机制的局限，而是**主动选择**。第 4 篇会讲怎么突破这个限制，让 skill 真的去调用 UE Python API。

---

## 2.3 错误处理与边界防御

### 2.3.1 三重防御体系

这个 skill 没有传统代码的 try-catch，但它有一套**"三重防御"**机制，覆盖了大部分错误场景：

```
┌─────────────────────────────────────────────────┐
│  第 1 重：Safety 段（行为边界）                  │
│  禁止危险操作，从源头杜绝执行类错误              │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  第 2 重：占位符 + 默认值（输入边界）            │
│  参数缺失时用默认值兜底，避免卡住或瞎猜         │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  第 3 重：Output format 强制结构（输出边界）     │
│  输出必须 6 段齐全，少一段就是没达标            │
└─────────────────────────────────────────────────┘
```

### 2.3.2 第 1 重：Safety 段的行为边界

[SKILL.md:17-21](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) 的 4 条规则，每条都针对一种具体风险，且配了**替代行为**：

| 规则 | 防的风险 | 替代行为（疏导） |
|---|---|---|
| `Do NOT run terminal commands` | AI 执行 `rm` / `git push --force` 等破坏性命令 | 只输出文本说明 |
| `Do NOT instruct user to download/run scripts` | 用户被诱导运行恶意脚本 | 完全不涉及脚本 |
| `Do NOT modify files. Output text only.` | UE 项目文件被破坏 | 只输出文本 |
| `If user asks for files, respond with file *contents*` | 直接拒绝会让用户体验差 | 给出可粘贴的文件内容 |

**关键设计：堵 + 疏结合**。光"堵"（禁止）会让 Claude 在用户提需求时不知道怎么办；"疏"（替代行为）让 Claude 知道"虽然不能直接做，但可以这样近似满足"。

### 2.3.3 第 2 重：占位符 + 默认值的输入边界

参数缺失是 skill 最常见的"错误"。本案例用两个机制兜底：

#### 机制 1：占位符标记可替换位置

看 [Templates/BlueprintRecipe_Template.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/BlueprintRecipe_Template.md)：

```markdown
## Blueprint Recipe (ordered)
1. Event: <BeginPlay / InputAction / CustomEvent>
2. Node: <exact node name> → settings: <important pin values>
3. Branch: <condition>
4. Set Var: <name> (replicated? yes/no)
5. Call: <function/interface>
```

每个 `<尖括号>` 都是占位符，告诉 Claude "这里要填具体值"。占位符分两类：

| 占位符类型 | 示例 | 作用 |
|---|---|---|
| **开放型** | `<exact node name>` | Claude 自由填，但格式固定 |
| **枚举型** | `<BeginPlay / InputAction / CustomEvent>` | 限定选项，Claude 必须从这几个里选 |

枚举型占位符是**最强的输入约束**——它把"自由填空"变成"选择题"，大幅降低 Claude 写错的可能性。

#### 机制 2：默认值 + 可覆盖声明

[SKILL.md:33-46](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) 的两段领域约定：

```markdown
## UE naming + folders (default)
- Root: `/Game/Systems/<SystemName>/`
- Blueprints: `BP_<Thing>`
...

## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Replicate only what's necessary for 40v40+ scale
...
```

两段都用了 `(default)` 和 `(unless user says otherwise)` 声明可覆盖性。这处理了"用户没说"的场景：

```
用户没说命名前缀  → 用 BP_/DT_/BPI_ 默认值
用户没说多人规模  → 用 40v40+ 默认值
用户没说是否多人  → 默认按多人设计
```

### 2.3.4 第 3 重：Output format 强制结构的输出边界

[SKILL.md:22-31](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md)：

```markdown
## Output format (always)
1) **Goal**
2) **Inputs** (what variables/configs it needs)
3) **Outputs** (what it produces)
4) **Assumptions**
5) **Implementation**
   - **Blueprint Recipe** (step-by-step)
   - **Replication Notes** (Server vs Client, replicated vars, RPCs)
   - **Assets / Naming / Folders**
6) **Test Checklist**
```

`(always)` 这个词是关键——它告诉 Claude "任何时候都不能省略这些段"。这处理了"输出不完整"的错误：

```
没有 (always) → Claude 在简单问题上可能省略某段
   "做个简单药水" → 只输出 Goal + Implementation，跳过 Test

有 (always) → Claude 必须输出全部 6 段
   "做个简单药水" → 仍输出 6 段，但每段内容可以简化
```

编号 `1)` `2)` 也是约束——它让 Claude 必须按顺序输出，不能跳段或乱序。

### 2.3.5 边界场景的处理案例

假设用户提出几个边界需求，看 skill 怎么应对：

#### 场景 1：用户要求直接创建文件

> 用户："帮我在 UE 项目里创建 BP_Pickup 蓝图"

**skill 应对**（按 Safety 第 4 条）：
- ❌ 不直接创建文件
- ✅ 输出"蓝图配方的完整内容"，用户可复制后自己在 UE 里创建

#### 场景 2：用户要求单机设计

> 用户："这是单机游戏，不需要多人"

**skill 应对**（按 Multiplayer defaults 的 `unless user says otherwise`）：
- 跳过 Replication Notes 段，或在该段写"N/A - 单机游戏"
- Test Checklist 仍保留 PIE 测试，但跳过 Dedicated Server 和 Latency 测试

#### 场景 3：用户给的需求模糊

> 用户："做个药水"

**skill 应对**（按 Assumptions 段 + 默认值）：
- Goal: 设计药水系统
- Assumptions: 假设是恢复生命值的药水 / 假设按 E 拾取 / 假设多人 40v40
- 在 Assumptions 段末尾提示："如需调整这些假设，请明确告知"

#### 场景 4：用户问的领域不匹配

> 用户："帮我写一段 UE C++ 类代码"

**skill 应对**（按 What 段的触发条件）：
- skill 不该被触发（因为 description 是 "game piece design" 而非 "code generation"）
- 即使误触发，Claude 会发现需求超出 skill 职责，回退到通用回答

### 2.3.6 这个 skill 没处理的边界

诚实地说，这个 skill 也有一些边界没覆盖：

| 未覆盖的边界 | 表现 | 改进方向 |
|---|---|---|
| UE 版本不匹配 | 用户用 UE 5.3，但 skill 写死 5.7 | 加 `If user uses older UE version, note API differences` |
| 性能基线未量化 | "40v40+" 是规模，但没给 tick 预算 | 加 `Max tick budget: 10ms total` |
| 资产冲突检测 | 不知道用户项目里是否已有同名资产 | 加 `Warn if asset name might collide` |
| 模板未显式引用 | SKILL.md 没写 "参照 Templates/xxx" | 加 `Implementation 段参照 Templates/BlueprintRecipe_Template.md` |

这些是 skill 迭代到 0.2.0 / 0.3.0 时该补的洞。

---

## 2.4 状态管理与上下文保持

### 2.4.1 结论：单次执行，无状态

**重要结论**：`ue57-gamepiece-designer` 是**无状态的单次执行 skill**。

证据：
- 源码里没有任何"记住上次设计"的逻辑
- 没有会话 ID / 状态文件 / 数据库
- Safety 段明确禁止改文件，连状态持久化都做不到
- Output format 要求每次都从头输出完整 6 段

### 2.4.2 为什么不做状态管理

#### 理由 1：skill 机制本身无状态

Claude Code Skill 的执行模型是"注入指令 → 生成回答 → 退出"。skill 文件本身**不会跨对话保留状态**。状态只能存在两个地方：

```
状态存储位置 1：宿主的对话历史
   ↓
   Claude 在多轮对话里能"记住"上文
   ↓
   但这是宿主的能力，不是 skill 的能力

状态存储位置 2：外部文件 / 数据库
   ↓
   skill 需要"写文件"才能持久化
   ↓
   但 Safety 段禁止改文件
```

所以这个 skill **设计上就是无状态**——它依赖宿主的对话历史来处理多轮交互。

#### 理由 2：设计任务天然适合无状态

设计阶段的任务通常是"一次性输出完整方案"。不像调试或长流程任务需要分步推进，设计可以一次产出完整文档。无状态反而更简单可靠。

#### 理由 3：无状态 = 可重现

```
有状态 skill：
   用户第一次问 → 输出 A，存了状态 X
   用户第二次问 → 基于 X 输出 B
   ↑ 输出依赖隐式状态，难重现、难调试

无状态 skill：
   用户第一次问 → 输出 A
   用户第二次问 → 还是输出 A（除非用户输入变了）
   ↑ 输出只依赖输入，可重现、可测试
```

### 2.4.3 多轮对话怎么处理

虽然 skill 无状态，但用户和 Claude 的对话是多轮的。比如：

```
第 1 轮：用户 "帮我设计生命药水拾取系统"
        Claude 输出完整 6 段设计

第 2 轮：用户 "把拾取方式改成走过去自动拾取"
        Claude 基于第 1 轮的设计，只输出修改部分

第 3 轮：用户 "加个冷却时间 30 秒"
        Claude 在第 2 轮基础上再改
```

这种多轮交互靠**宿主的对话历史**维持上下文，不是 skill 自己管的。skill 的角色是**在第 1 轮给出结构化输出**，后续轮次由 Claude 的对话能力接管。

### 2.4.4 如果需要状态管理怎么办

如果你的 skill 确实需要状态（比如"自动检查 UE 项目里所有资产命名"需要遍历文件），有两个方案：

#### 方案 A：突破 Safety 限制，允许写文件

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.（保留）
- Do NOT modify .uasset files.（细化）
- CAN write state to .claude/skill-state/<skill-name>.json（新增许可）
- If user asks for files, respond with file *contents*.（保留）
```

但这种突破要**极度谨慎**——一旦允许写文件，就要自己处理文件锁、并发、回滚等问题。

#### 方案 B：用 MCP Server 做有状态后端

把状态管理交给一个独立的 MCP Server，skill 只负责"指导 Claude 调用 MCP 工具"。这是更工程化的方案，第 4 篇会展开。

### 2.4.5 小结：状态管理的决策树

```
你的 skill 需要状态吗？
   │
   ├─ 否 → 像 ue57-gamepiece-designer 一样，纯无状态，靠宿主对话历史
   │
   └─ 是 → 需要突破 Safety 限制
            │
            ├─ 状态简单（少量配置）→ 允许写 JSON 状态文件
            │
            └─ 状态复杂（数据库/会话）→ 用 MCP Server 做后端
```

---

## 2.5 本篇小结

### 四个维度的核心结论

| 维度 | 结论 | 源码依据 |
|---|---|---|
| **参数解析** | 靠 When-Then 触发 + 产物清单 + 默认值三件套，无代码逻辑 | SKILL.md:8-14 + 41-46 |
| **工具交互** | 零交互，纯文本输出；通过 CSV 模板间接兼容 UE 导入 | SKILL.md:17-21 + Templates/Schema_Ability_DT.csv |
| **错误处理** | 三重防御：Safety 行为边界 + 占位符输入边界 + Output format 输出边界 | SKILL.md 全文 + Templates/* |
| **状态管理** | 无状态单次执行，多轮交互靠宿主对话历史 | 源码无任何状态逻辑 |

### 一个核心洞察

这个 skill 的"工程化"不体现在代码复杂度上（它根本没有代码），而体现在**对 Claude 行为的精确约束**上：

- 用 When-Then 锁定触发条件
- 用 `(always)` 锁定输出结构
- 用 `(default)` + `(unless specified)` 锁定默认值
- 用 `<占位符>` 锁定填写位置
- 用 `Do NOT` + 替代行为锁定安全边界

**写 skill 的本质，是用自然语言写"约束"**。约束越精确，输出越稳定。

### 下一篇

第 3 篇 [03-skill-writing-tutorial.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/03-skill-writing-tutorial.md) 会把这套"约束写法"提炼成通用模板，并给出标准写作步骤和避坑指南。
