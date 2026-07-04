# 从 ue57-gamepiece-designer 学写 Claude Code 技能（虚幻引擎篇）

> 本文以仓库内 `Game-Skills/gamepiece-designer/ue57-gamepiece-designer/` 这个真实技能为唯一案例，逐文件、逐段落拆解它的设计与实现，目标是让一个**从未写过 Claude Code Skill 的初学者**，在读完本文后能够：
> 1. 理解 Claude Code Skill 到底是什么、怎么被加载和触发；
> 2. 看懂 `ue57-gamepiece-designer` 这个 UE5.7 技能每一行在做什么、为什么这么写；
> 3. 仿照它，独立写出自己的第一个虚幻引擎技能。
>
> 阅读建议：先通读第 1、2 章建立概念 → 再对照源文件读第 3、4、5 章的逐行解析 → 最后用第 7、8 章动手实战。

---

## 目录

1. [Claude Code Skill 是什么（写给完全没接触过的人）](#1-claude-code-skill-是什么写给完全没接触过的人)
2. [技能的加载机制与文件结构](#2-技能的加载机制与文件结构)
3. [案例总览：ue57-gamepiece-designer 的全貌](#3-案例总览ue57-gamepiece-designer-的全貌)
4. [SKILL.md 逐节深度解析（核心）](#4-skillmd-逐节深度解析核心)
5. [\_meta.json 与 Templates/ 模板层解析](#5-_metajson-与-templates-模板层解析)
6. [设计哲学：为什么它要这样设计](#6-设计哲学为什么它要这样设计)
7. [实战：从零写一个 UE Skill（手把手）](#7-实战从零写一个-ue-skill手把手)
8. [虚幻引擎技能的领域知识要点](#8-虚幻引擎技能的领域知识要点)
9. [调试、测试与迭代](#9-调试测试与迭代)
10. [学习路径与下一步](#10-学习路径与下一步)

---

## 1. Claude Code Skill 是什么（写给完全没接触过的人）

### 1.1 一句话定义

Claude Code Skill 是一份**结构化的 Markdown 指令文件**，它告诉 Claude（即 AI 助手）：**在某个特定场景下，应该按什么规则、用什么格式、输出什么样的结果**。

注意三个关键词：
- **结构化**：不是随便写一段话，而是有约定俗成的章节（YAML 头、What / Safety / Output format 等）。
- **指令文件**：它本身不是代码，不会"运行"，只是被 Claude 读取后作为"工作守则"。
- **特定场景**：一个 skill 只解决一类问题，靠 `description` 字段告诉系统何时该启用它。

### 1.2 Skill 与 Prompt 的区别

| 维度 | 普通提示词（Prompt） | Claude Code Skill |
|---|---|---|
| 形态 | 一次性对话输入 | 持久化文件，可复用、可版本化 |
| 触发 | 用户手动输入 | 系统根据 `description` 自动匹配场景 |
| 结构 | 自由文本 | YAML frontmatter + 固定章节 |
| 共享 | 复制粘贴 | 文件夹分发，支持 `_meta.json` 版本管理 |
| 协作 | 难以审查 | 走 Git，可 review、可回滚 |

一句话：**Skill 是"被工程化、被持久化、可分发的提示词"**。

### 1.3 Skill 在 Claude Code 体系中的位置

Claude Code 生态里有几种扩展机制，初学者很容易混淆，这里统一对比：

```
┌──────────────────────────────────────────────────────────┐
│  Claude Code（IDE/CLI 中的 AI 助手）                      │
├──────────────────────────────────────────────────────────┤
│  扩展机制 1：CLAUDE.md          项目级"长期记忆"           │
│  扩展机制 2：Subagents          子代理，独立上下文执行任务  │
│  扩展机制 3：Skills  ← 本文焦点 可复用的"专项工作守则"      │
│  扩展机制 4：MCP Servers        外部工具/数据源连接器       │
│  扩展机制 5：Hooks              事件触发的脚本钩子          │
└──────────────────────────────────────────────────────────┘
```

Skill 的定位很明确：**它不是子代理（不独立运行），不是 MCP（不调用外部工具），不是 Hook（不响应事件），而是一份"当用户问到 X 时，请按 Y 这套规则回答"的守则**。它最接近"专业 SOP（标准作业程序）"。

### 1.4 为什么 UE 开发需要 Skill

虚幻引擎领域的 AI 协作有几个痛点，Skill 恰好能解决：

1. **UE 知识面太广**：蓝图、C++、GAS、Niagara、Behavior Tree、Replication……一个 AI 不可能"默认精通"所有子领域。Skill 可以把某个子领域（如"多人 gamepiece 设计"）的规范固化下来。
2. **UE 有强约定**：命名前缀（`BP_`、`DT_`、`BPI_`）、文件夹结构、网络权威模型，这些约定 AI 容易写错或写漏。Skill 直接把约定写死，每次输出都遵守。
3. **多人游戏容易踩坑**：客户端预测、服务器权威、RPC 类型选择，初学者极易在"能跑就行"的单人版本里埋雷。Skill 强制每个设计都过一遍网络检查清单。
4. **设计阶段需要"思考脚手架"**：很多 UE 任务在动手前需要先把 Goal / Inputs / Outputs / Assumptions / Test 想清楚，Skill 强制这个结构，避免"直接写代码、写到一半发现需求没搞清"。

`ue57-gamepiece-designer` 这个 skill 就是把这四件事用一份文件 + 三个模板做完。

---

## 2. 技能的加载机制与文件结构

### 2.1 Skill 放在哪里

Claude Code 约定的 skill 存放位置（不同宿主略有差异，但思路一致）：

```
<项目根>/.claude/skills/<skill-name>-<semver>/
└── ...
```

或本文案例所在的位置（仓库内集中管理）：

```
Game-Skills/
└── gamepiece-designer/
    └── ue57-gamepiece-designer/     ← 注意：文件夹名 = slug
        ├── SKILL.md
        ├── _meta.json
        └── Templates/
```

两种放法都可以，关键是：**文件夹名要与 `_meta.json` 里的 `slug` 一致**，且文件夹内必须有 `SKILL.md`（注意是大写，文件名固定）。

### 2.2 一个 skill 由哪些文件组成

最小可行 skill 只需要一个文件：

```
my-skill/
└── SKILL.md        ← 唯一必须的文件
```

进阶版会加上：

```
my-skill/
├── SKILL.md        ← 核心：行为规则与输出契约
├── _meta.json      ← 元数据：slug / version / 发布信息（分发/版本管理用）
├── Templates/      ← 可选：复用模板（输出格式样本、检查清单、数据 schema）
│   ├── output-template.md
│   └── schema.csv
└── examples/       ← 可选：few-shot 示例（教 Claude "好输出长什么样"）
    └── good-output.md
```

`ue57-gamepiece-designer` 用了 `SKILL.md` + `_meta.json` + `Templates/` 三件套，没有 `examples/`，是一个**中等复杂度**的 skill，刚好适合学习。

### 2.3 加载与触发流程

理解这条流程线，你才知道每个文件为什么这么写：

```
   ① 用户在对话里说："帮我设计一个生命药水拾取系统"
                            │
                            ▼
   ② 宿主（IDE/CLI）扫描所有 skill 的 SKILL.md
      读取 YAML 头里的 name + description
                            │
                            ▼
   ③ 用 description 做语义匹配，判断是否该启用本 skill
      description = "Designs UE5.7 multiplayer-friendly game pieces..."
      → 命中（用户在说 UE 游戏部件设计）
                            │
                            ▼
   ④ 把 SKILL.md 全文注入 Claude 的系统上下文
      （Templates/ 不会自动注入，由 SKILL.md 文本"指代"）
                            │
                            ▼
   ⑤ Claude 按 SKILL.md 里的 "Output format" 章节生成回答
      回答中如需引用模板，Claude 会按模板结构组织内容
                            │
                            ▼
   ⑥ 用户拿到结构化设计文档，自己复制到 UE 里实现
```

关键认知：
- **`description` 是"门牌号"**，决定 skill 是否被选中。写得太宽泛会误触发，太窄会触发不到。
- **`SKILL.md` 正文是"工作守则"**，被整体注入上下文，所以越精炼越好，冗余会挤占 token 预算。
- **`Templates/` 是"参考图纸"**，不自动注入，靠 SKILL.md 里"按 Templates/xxx 的格式输出"这类指令让 Claude 去读取（或宿主在需要时才载入）。

> 实践提示：在本仓库的环境中，skill 文件夹放在 `Game-Skills/...` 下，由 Trae IDE 的 Skill 机制发现并暴露给模型。其他环境（如原生 Claude Code CLI）的发现路径以对应工具文档为准，但"文件夹 + SKILL.md + _meta.json"的结构是通用的。

---

## 3. 案例总览：ue57-gamepiece-designer 的全貌

### 3.1 目录与文件清单

```
Game-Skills/gamepiece-designer/ue57-gamepiece-designer/
├── SKILL.md                          ← 核心定义（46 行，非常精炼）
├── _meta.json                        ← 元数据（5 行）
└── Templates/
    ├── BlueprintRecipe_Template.md   ← 蓝图配方模板（38 行）
    ├── Checklist_Networking.md       ← 多人网络检查清单（18 行）
    └── Schema_Ability_DT.csv         ← DataTable 字段示例（4 行数据）
```

整个 skill 总共不到 150 行，却能稳定产出结构化的 UE5.7 游戏部件设计。**精炼是它的第一个设计特征**。

### 3.2 三层架构

可以把这个 skill 理解为三层：

| 层 | 文件 | 职责 | 类比 |
|---|---|---|---|
| **核心定义层** | `SKILL.md` | 定行为规则、输出契约、安全边界、领域约定 | 公司的"工作手册" |
| **元数据层** | `_meta.json` | 定身份（slug / version / 发布时间） | 工牌 |
| **模板工具层** | `Templates/*` | 提供可复用的输出骨架 | 工作手册附带的"空白表格" |

三层各司其职：
- 核心定义层**约束行为**（必须做什么、不能做什么）；
- 元数据层**支撑分发**（系统靠它识别、版本化、去重）；
- 模板工具层**降低输出方差**（每次都按同一张骨架产出，不会东一榔头西一棒）。

### 3.3 这个 skill 不做什么（同样重要）

读 skill 不仅要看它写了什么，还要看它**刻意不写什么**：

- ❌ 不写 C++ 实现代码（只写蓝图配方级别的"节点链描述"）
- ❌ 不创建/修改任何文件（纯文本输出）
- ❌ 不调用 MCP 工具操作 UE 编辑器（不像有些 skill 会真的去 spawn actor）
- ❌ 不做性能 profiling、不做崩溃诊断（那是别的 skill 的活）

这种"职责收窄"是写好 skill 的关键——**一个 skill 只做一件事，做到可靠**。它把"真正动手实现"留给了用户，自己只负责"把设计想清楚"。这点会在第 6 章展开。

---

## 4. SKILL.md 逐节深度解析（核心）

`SKILL.md` 是整个 skill 的灵魂。下面按它的实际章节顺序，逐段拆解**做了什么 / 怎么做 / 为什么**。

### 4.0 文件原文速览

为方便对照，先把原文件结构列出来（行号对应 `SKILL.md`）：

```
 1  ---
 2  name: ue57-gamepiece-designer
 3  description: Designs UE5.7 multiplayer-friendly game pieces (...)
 4  ---
 5  
 6  # UE5.7 Gamepiece Designer (Text-Only)
 7  
 8  ## What this skill does
 9  ...
16  
17  ## Non-negotiable rules (Safety)
18  ...
21  
22  ## Output format (always)
23  ...
31  
32  ## UE naming + folders (default)
33  ...
40  
41  ## Multiplayer defaults (unless user says otherwise)
42  ...
46  ## (文件结束)
```

5 个章节，干净利落。下面逐节深入。

---

### 4.1 YAML Frontmatter（第 1–4 行）

```yaml
---
name: ue57-gamepiece-designer
description: Designs UE5.7 multiplayer-friendly game pieces (Blueprint node chains, data schemas, asset naming, and test checklists). Text-only, no scripts.
---
```

**做了什么**：用 YAML 头声明 skill 的 `name` 和 `description`。

**怎么做**：
- `name` 与文件夹名 / `_meta.json` 的 `slug` 保持一致：`ue57-gamepiece-designer`。三者一致是硬约定，不一致会导致加载失败或匹配错乱。
- `description` 用一句话写清三件事：**领域（UE5.7 multiplayer）+ 产物（Blueprint chains / data schemas / naming / test checklists）+ 形态（Text-only, no scripts）**。

**为什么**：
- `name` 是系统引用 skill 的 ID，必须稳定、唯一、可读。
- `description` 是**触发匹配的唯一依据**。系统不会读正文来判断要不要启用 skill，只看 description。所以这句话要：
  - **够具体**：写明"UE5.7 多人 gamepiece"，而不是"UE 设计"——后者太宽，会跟其他 UE skill 抢触发；
  - **够完整**：把产出物列出来，让匹配更准（用户说"帮我设计 DataTable 字段"也能命中，因为 description 里写了 data schemas）；
  - **声明形态**：`Text-only, no scripts` 一方面是给用户看（预期管理），另一方面也是给 Claude 自己看的（自我约束）。

> ⚠️ 初学者最常犯的错：把 description 写成"帮助用户做 UE 相关的事"。这种描述**几乎一定会被系统判定为不匹配或匹配过宽**。正确写法是"动词 + 领域 + 产物 + 边界"四要素齐全。

---

### 4.2 "What this skill does"（第 8–14 行）

```markdown
## What this skill does
When the user asks for a UE system or "game piece", produce a structured design that is ready to implement in Unreal Engine 5.7:
- Blueprint node chain recipes (ordered steps, node names, variables, events)
- DataTable / DataAsset schemas (field list + example rows)
- Asset / folder plan (paths + naming)
- Multiplayer sanity: server/client responsibility, replication notes
- Test checklist (PIE, dedicated server, latency, edge cases)
```

**做了什么**：用一句话 + 五个 bullet，定义"触发条件"和"产出清单"。

**怎么做**：
- 触发条件用 `When the user..., produce...` 句式（**When-Then 模式**），这是 skill 写作的标准范式，Claude 对这个句式最敏感。
- 5 个 bullet 对应 5 种产物，**每一个都是可验证的输出物**（不是抽象描述）。比如不写"网络相关说明"，而写"server/client responsibility, replication notes"——后者可以直接检查有没有写。
- 限定版本：`Unreal Engine 5.7`。这避免 Claude 用 5.0/5.1 的旧 API 输出。

**为什么**：
- **When-Then 让触发判定稳定**：模型在内部把这条规则当作"if 用户在问 UE gamepiece → then 走这套流程"。
- **产物清单 = 输出契约**：用户拿到回答后可以逐条对账——"蓝图配方有吗？数据 schema 有吗？网络检查有吗？测试清单有吗？"少一条就是 skill 没执行到位。这种"可对账"的特性让 skill 输出可被质量检验。
- **限定 UE 版本**：UE 各版本 API 差异大（如 5.7 的 MPC/GAS 与 5.3 有别），写死版本避免模型自由发挥到过时 API。

> 💡 写作技巧：bullet 项尽量用"名词 + 括号补充"的结构，如 `Blueprint node chain recipes (ordered steps, node names, variables, events)`。括号里是"质量要求"，告诉 Claude 这个产物要做到什么粒度。

---

### 4.3 "Non-negotiable rules (Safety)"（第 17–21 行）

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.
```

**做了什么**：列出 4 条**不可协商的安全红线**。

**怎么做**：
- 全部用 `Do NOT ...` / `If ... respond with ...` 的祈使句，**没有商量的余地**。
- 每条针对一种具体风险，不是泛泛说"注意安全"。
- 第 4 条尤其精彩：它预判了"用户会要求生成文件"这个常见场景，并给出了**替代行为**——不创建文件，但给出可粘贴的内容。这是"堵 + 疏"结合：堵住危险操作，疏导到安全操作。

**为什么**：
- **Skill 的安全规则是"硬约束"**，Claude 在生成回答时会优先遵守这些规则，即使后续用户输入试图绕过（如"请直接帮我创建文件"），也会被这 4 条挡住。
- **纯文本 skill 的价值就在于此**：UE 项目里的 `.uasset`、`Source/` 文件一旦被 AI 直接改写，后果不可控（编译失败、资产损坏、Git 冲突）。这个 skill 选择只产出"可粘贴的文本"，把"动手"的决策权完全留给用户。这是一种**最小信任原则**的设计。
- **第 4 条的精妙**：很多 skill 只写"Do NOT modify files"，结果用户问"那帮我生成一个文件吧"时 Claude 不知道怎么办。这条规则消除了歧义，保证用户体验不因安全规则而受损。

> ⚠️ 初学者常见错误：安全规则写得太少或太抽象。比如只写"注意安全"。正确做法是**穷举你能想到的危险操作**，每条配一个"替代行为"。

**4 条规则对应的风险矩阵**：

| 规则 | 防的风险 | 替代行为 |
|---|---|---|
| 不跑终端命令 | AI 执行 `rm`/`build`/`git push` 等破坏性命令 | 只输出文本说明 |
| 不让用户下载/运行脚本 | 用户被诱导运行恶意脚本 | 完全不涉及脚本 |
| 不改文件 | UE 项目文件被破坏 | 只输出文本 |
| 用户要文件时 | 直接拒绝会让用户体验差 | 给出可粘贴的文件内容 |

---

### 4.4 "Output format (always)"（第 22–31 行）

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

**做了什么**：定义**强制的 6 段输出结构**，每段标题加粗，部分段带括号说明。

**怎么做**：
- 用编号列表 `1) ... 6)`，**编号让结构不可逃**——Claude 必须按 1→6 顺序输出，不会跳段。
- 每段用 `**加粗标题**`，让输出在 Markdown 渲染后层次分明。
- 关键段加括号说明，如 `Inputs (what variables/configs it needs)`——告诉 Claude 这段要写"变量/配置"，而不是泛泛的"输入"。
- 第 5 段 `Implementation` 内嵌 3 个子段（Blueprint Recipe / Replication Notes / Assets），这是**层次化输出**，避免把所有实现细节堆在一个平面。

**为什么**：
- **强制结构 = 可预期性**：用户每次拿到回答，都能在同样的位置找到 Goal、找到 Replication Notes、找到 Test Checklist。这种可预期性是 skill 的核心价值——它把"AI 回答"变成了"格式化文档"。
- **6 段对应"设计思考的完整链条"**：
  1. Goal：要解决什么问题？
  2. Inputs：需要什么前提？
  3. Outputs：交付什么？
  4. Assumptions：做了哪些假设？（这一步最容易省略，但最关键——它强迫把"没说清的需求"显性化）
  5. Implementation：怎么做？（含蓝图、网络、资产三视角）
  6. Test Checklist：怎么验？
  这套链条来自软件工程的"需求→设计→实现→验证"经典流程，**不是 UE 特有，但被这个 skill 借用得很到位**。
- **`(always)` 这个词很关键**：它告诉 Claude "任何时候都不能省略这些段"。没有这个词，Claude 在用户问简单问题时可能会"自作主张"省略某段。

> 💡 写作技巧：用编号列表 + 加粗标题 + 括号补充，这三件套是"输出格式"章节的黄金组合。括号补充尤其重要——它把每段的"质量标准"写明了，让 Claude 知道"写到什么程度算合格"。

**6 段结构的对照表**：

| 段号 | 标题 | 回答的问题 | 没有它会怎样 |
|---|---|---|---|
| 1 | Goal | 解决什么问题？ | 跑偏，做错东西 |
| 2 | Inputs | 需要什么前提？ | 漏配置，半路发现缺数据 |
| 3 | Outputs | 交付什么？ | 用户预期错位 |
| 4 | Assumptions | 假设了什么？ | 隐藏需求导致返工 |
| 5 | Implementation | 怎么做？ | 没有可执行方案 |
| 6 | Test Checklist | 怎么验？ | 上线才发现 bug |

---

### 4.5 "UE naming + folders (default)"（第 33–40 行）

```markdown
## UE naming + folders (default)
- Root: `/Game/Systems/<SystemName>/`
- Blueprints: `BP_<Thing>`
- Components: `BPComp_<Thing>`
- Interfaces: `BPI_<Thing>`
- DataTables: `DT_<Thing>`
- DataAssets: `DA_<Thing>`
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`
```

**做了什么**：把 UE 项目的命名前缀和文件夹根路径**写死成默认规则**。

**怎么做**：
- 7 条规则，每条一行，格式统一：`类型: 前缀_<Thing>`。
- 用反引号包裹前缀，强调"这是字面量，不要改"。
- Root 路径用 `<SystemName>` 占位符，告诉 Claude "按系统名替换"。

**为什么**：
- **UE 有官方命名约定，但 AI 不会自动遵守**。如果不写死，Claude 可能输出 `Blueprint_Pickup`、`MyPickupBP`、`PickupBlueprint` 等各种乱七八糟的命名。一旦命名不统一，UE 项目里资产搜索、批量操作、蓝图引用都会变难。
- **前缀系统是 UE 资产管理的基石**：在 UE 编辑器的内容浏览器里，前缀就是"类型标识"。`BP_` 一看就知道是 Blueprint，`DT_` 一看就知道是 DataTable。这套前缀来自 Epic 官方推荐（见 [Asset Naming Conventions](https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects)），skill 直接采纳。
- **`(default)` 这个词很重要**：它表示"如果用户没说别的，就用这套"。给 Claude 留了"用户覆盖"的口子——用户可以说"我们项目用 `BPickup_` 前缀"，Claude 就该切换。这是"默认值 + 可覆盖"的工程设计。

> ⚠️ 写领域约定时的两个要点：① 用 `<占位符>` 标记可替换部分；② 用 `(default)` / `(unless specified)` 这类词声明可覆盖性。否则 skill 会变得太僵化。

---

### 4.6 "Multiplayer defaults"（第 41–46 行）

```markdown
## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**做了什么**：定义 4 条多人游戏的**默认技术选型**。

**怎么做**：
- 每条一句，**只讲原则，不讲实现细节**（实现细节交给输出格式的 Replication Notes 段）。
- 每条都是"决策方向"，不是"具体代码"。

**为什么**：
- **多人游戏是 UE 最容易踩坑的领域**。一个单人能跑的设计，放到 40v40 服务器上可能直接卡死或 desync。这 4 条把最关键的决策方向钉死：
  - 第 1 条：**服务器权威**——防止客户端作弊、防止状态不一致。这是 UE 多人的金科玉律。
  - 第 2 条：**客户端只发意图**——客户端不直接改状态，只发"我想做 X"的 RPC，由服务器裁决。这避免"客户端各自改各自的状态"导致的 desync。
  - 第 3 条：**只同步必要的**——40v40 是个明确的规模目标，意思是"别把每个 tick 都同步，别把 cosmetic 状态也 replicate"。这条直接对应带宽预算。
  - 第 4 条：**事件驱动优先于 tick**——UE 的 tick 是性能杀手，40v40 下每个 actor 都 tick 会爆 CPU。这条把"用 event/interface"定为默认。
- **`40v40+ scale` 是个非常具体的目标**：写"large scale"太模糊，写"40v40"让 Claude 有量化参照。这种"具体数字"比"形容词"有效得多。
- **`(unless user says otherwise)`**：再次声明可覆盖性——单机游戏用户可以说"这是单机的，不需要多人"，Claude 就该跳过这些规则。

> 💡 写"默认技术选型"时，尽量用**可量化的指标**（如 40v40、100 players、200ms latency）代替形容词（如 large、big、high）。量化指标让 Claude 在生成具体方案时有锚点。

---

### 4.7 SKILL.md 的小结：写作公式

把上面 6 节总结成一个可复用的写作公式：

```
SKILL.md = YAML 头（name + description）
         + What this skill does（When-Then + 产物清单）
         + Non-negotiable rules（Do NOT + 替代行为）
         + Output format（编号 + 加粗标题 + 括号质量要求）
         + 领域约定 1（命名/路径，带占位符和 (default)）
         + 领域约定 2（技术选型，带量化指标和可覆盖声明）
```

初学者照着这个公式填，就能写出一个及格的 skill。第 7 章会给一个完整的实战范例。

---

## 5. _meta.json 与 Templates/ 模板层解析

### 5.1 `_meta.json`：身份与版本

```json
{
  "ownerId": "kn7en1t4pyth0eh213e2nq38n181sqj6",
  "slug": "ue57-gamepiece-designer",
  "version": "0.1.0",
  "publishedAt": 1771974908734
}
```

**做了什么**：4 个字段声明 skill 的身份。

**字段逐个解析**：

| 字段 | 含义 | 作用 |
|---|---|---|
| `ownerId` | 所有者 ID（一串乱码） | 防止他人冒名发布同 slug 的 skill；分发平台的归属凭证 |
| `slug` | URL 友好的标识符 | 系统内部引用 skill 的 key，必须与文件夹名、SKILL.md 的 `name` 三者一致 |
| `version` | 语义化版本号 | 版本管理、向后兼容判断、升级提示 |
| `publishedAt` | 发布时间戳（Unix 毫秒） | 排序、版本先后判断、过期检测 |

**为什么**：
- **slug 比 name 更"法制化"**：`name` 是给人看的，`slug` 是给系统看的。slug 必须全小写、连字符分隔、不含特殊字符。`ue57-gamepiece-designer` 符合这些规则。
- **version 用 semver**：`0.1.0` 表示"还在开发期，API 不稳定"。当 skill 演进时：
  - patch（0.1.0→0.1.1）：修错别字、调描述；
  - minor（0.1.0→0.2.0）：加新规则、新模板；
  - major（0.x→1.0.0）：稳定发布，承诺向后兼容。
- **publishedAt 用毫秒时间戳**：`1771974908734` 对应 2026 年某时。时间戳比日期字符串更便于排序和比较。
- **ownerId 防冒名**：在分发平台（如 skill marketplace）上，同一个 slug 只能由 ownerId 持有者发布更新。

> ⚠️ 初学者常忽略 `_meta.json`，但只要你想把 skill 分发给别人、做版本管理，这个文件就必不可少。本地自用可以省略，但建议养成写的习惯。

---

### 5.2 Templates/ 的设计意图

整个 `Templates/` 文件夹的设计意图可以一句话概括：**把"输出长什么样"从 SKILL.md 里抽出来，变成可独立维护的"图纸"**。

为什么不直接写进 SKILL.md？三个理由：

1. **SKILL.md 要精简**：正文越短，注入上下文的 token 越少，留给对话的空间越多。模板是"详细骨架"，必然较长，塞进 SKILL.md 会挤占预算。
2. **模板可独立演进**：改模板不需要动 SKILL.md 的行为规则，版本管理更清晰。
3. **模板可被多个 skill 复用**：比如 `Checklist_Networking.md` 这种网络检查清单，未来写"UE 武器系统 skill""UE 载具 skill"都能直接复用。

下面逐个看三个模板。

---

### 5.3 `BlueprintRecipe_Template.md`：蓝图配方模板

```markdown
# Blueprint Recipe Template

## Goal
<one sentence>

## Inputs
- <input 1>
- <input 2>

## Outputs
- <output 1>

## Assumptions
- <assumption>

## Blueprint Recipe (ordered)
1. Event: <BeginPlay / InputAction / CustomEvent>
2. Node: <exact node name> → settings: <important pin values>
3. Branch: <condition>
4. Set Var: <name> (replicated? yes/no)
5. Call: <function/interface>

## Replication Notes
- Runs on: Server / Client / Both
- RPCs: <Server_DoX>, <Client_DoY>
- Replicated Vars: <VarName> (RepNotify? yes/no)
- Bandwidth notes: <what to avoid>

## Assets / Folders
- /Game/Systems/<SystemName>/
- BP_<Thing>
- BPI_<Thing>
- DT_<Thing>

## Test Checklist
- PIE: <expected>
- Dedicated server: <expected>
- With 100 players: <perf notes>
```

**做了什么**：提供"蓝图配方"的标准骨架，是 SKILL.md 输出格式第 5 段 `Implementation → Blueprint Recipe` 的细化版。

**怎么做**：
- 用 `<尖括号占位符>` 标记所有可替换位置，如 `<one sentence>`、`<input 1>`。
- 每段都给"该写什么"的提示，如 `Event: <BeginPlay / InputAction / CustomEvent>`——告诉 Claude "Event 这一行可以从这三种里选"。
- `Blueprint Recipe (ordered)` 段用编号列表，强调"顺序敏感"——蓝图节点链是有执行顺序的，必须按序写。
- `Replication Notes` 段每行一个维度（Runs on / RPCs / Replicated Vars / Bandwidth），覆盖多人游戏的 4 个关键问题。

**为什么**：
- **蓝图节点链是 UE 最难"用文字表达"的部分**——它本质上是个图，但 skill 是纯文本。这个模板用"编号 + Event/Node/Branch/Set Var/Call"的动词序列，把图降维成有序步骤，让纯文本也能描述蓝图逻辑。
- **`<占位符>` 是模板的灵魂**：它告诉 Claude "这里要填具体值，但格式是这样"。没有占位符，Claude 可能输出空白或乱写；有占位符，Claude 会按形状填空。
- **`(replicated? yes/no)` 这种二元提示**：强迫 Claude 对每个变量做"是否复制"的决策，避免遗漏网络同步考虑。
- **`Test Checklist` 段固定 3 个测试场景**：PIE（编辑器内运行）、Dedicated server、100 players。这覆盖了"开发期→上线前→压测"三个阶段，是 UE 多人游戏的最低测试门槛。

> 💡 模板写作技巧：每个占位符都给"提示性选项"，如 `<BeginPlay / InputAction / CustomEvent>`，比单纯写 `<event>` 强 10 倍——它既限制了选项范围，又教育了不懂的初学者。

---

### 5.4 `Checklist_Networking.md`：多人网络检查清单

```markdown
# Networking Checklist (UE Multiplayer)

## Authority
- Server is authoritative for health, damage, targeting state, cooldowns.
- Client only requests actions; server validates range/LOS/team rules.

## Replication
- Replicate target selection as an Actor reference or NetId, not every tick.
- Use RepNotify to update UI/target ring on clients.

## Performance
- Avoid Tick for targeting scans; prefer timed checks or event-driven updates.
- Keep overlap/trace frequency bounded (e.g., on Tab press, or every X ms max).

## Testing
- PIE with 2 clients: target selection syncs + ring updates.
- Dedicated server: no client-only assumptions.
- Simulated latency: no desync on target changes.
```

**做了什么**：定义多人网络的 4 维度检查清单（Authority / Replication / Performance / Testing）。

**怎么做**：
- 4 个章节对应多人游戏的 4 个核心问题，每章 2 条具体规则。
- 每条规则都是"动作 + 原因/替代方案"结构，如 `Avoid Tick for targeting scans; prefer timed checks or event-driven updates`——前半句说别做什么，后半句说该做什么。
- Testing 段给出**具体可执行的测试场景**，如 "PIE with 2 clients: target selection syncs + ring updates"——不是泛泛说"测试网络"，而是"开 2 个客户端，验证目标选择同步和环显示"。

**为什么**：
- **4 维度覆盖了多人游戏的所有关键决策**：
  - Authority（权威）：谁说了算？
  - Replication（复制）：什么数据要同步、怎么同步？
  - Performance（性能）：怎么不卡？
  - Testing（测试）：怎么验证以上都对？
  这套分类来自 UE 多人游戏工程的实战经验，**比"想到什么写什么"的清单更系统**。
- **示例聚焦"targeting（目标选择）"**：这个 skill 似乎是为"目标选择/技能瞄准"这类系统量身定制的（Authority 里提到 targeting state，Replication 里提到 target selection，Performance 里提到 targeting scans）。这说明 skill 作者有具体场景，**模板不是凭空抽象，而是从实战中提炼的**。
- **"Server is authoritative for health, damage, targeting state, cooldowns"** 这条把 4 个最常被作弊的字段列出来，是 UE 多人游戏的"反作弊最低标准"。

> 💡 写检查清单的技巧：① 按维度分组，别堆成一个大列表；② 每条规则配"替代方案"（do X; prefer Y）；③ 测试场景要具体到"几个客户端、测什么"。

---

### 5.5 `Schema_Ability_DT.csv`：DataTable 字段示例

```csv
AbilityId	DisplayName	AbilityType	School	RangeMin	RangeMax	GCDSeconds	CooldownSeconds	CostType	CostAmount	CastTimeSeconds	RequiresLOS	CanMoveWhileCasting	IconId	Notes
FIREBALL	Fireball	Damage	Fire	0	30	1.5	8	Mana	20	2	TRUE	FALSE	icon_fireball	Basic ranged nuke
HEAL	Heal	Heal	Holy	0	40	1.5	6	Mana	25	2	TRUE	FALSE	icon_heal	Single target heal
MELEE_SWING	Melee Swing	Damage	Physical	0	3	1.5	0	Energy	0	0	TRUE	TRUE	icon_swing	Basic melee
```

**做了什么**：用 CSV 格式给一个"技能 DataTable"的字段定义 + 3 行示例数据。

**怎么做**：
- 第一行是字段名（14 个字段），覆盖一个 RPG 技能所需的全部维度：标识、显示、类型、范围、冷却、消耗、施法、限制、UI、备注。
- 后 3 行是不同类型的技能示例：远程伤害（Fireball）、治疗（Heal）、近战（Melee Swing）。
- 用 Tab 分隔（标准 CSV 的一种），可直接导入 UE DataTable。

**为什么**：
- **CSV 是 UE DataTable 的原生格式**：UE 编辑器支持"导入 CSV 到 DataTable"，所以这个模板不仅是给 Claude 看的"示例"，更是**用户可以直接导入 UE 的成品**。这是"模板即交付物"的设计。
- **3 行示例覆盖 3 种技能形态**：远程/治疗/近战，让 Claude 看到"同样一张表怎么承载不同类型的技能"。这比抽象描述"字段 AbilityType 可以是 Damage/Heal/..."有效得多。
- **字段命名遵循 UE 约定**：`AbilityId`（不是 `id`）、`DisplayName`（不是 `name`）、`GCDSeconds`（带单位）——这些命名习惯让生成的 DataTable 在 UE 里读起来"地道"。
- **`RequiresLOS` / `CanMoveWhileCasting` 用 TRUE/FALSE**：UE DataTable 的 bool 字段标准写法，避免 yes/no/1/0 的混乱。

> 💡 设计 schema 模板的技巧：① 字段名用 PascalCase（UE 风格）；② bool 用 TRUE/FALSE 全大写；③ 数值字段带单位（如 `GCDSeconds`）；④ 至少给 3 行覆盖不同形态的示例数据。

**14 个字段的含义对照**：

| 字段 | 含义 | 示例值 |
|---|---|---|
| AbilityId | 技能唯一标识 | FIREBALL |
| DisplayName | UI 显示名 | Fireball |
| AbilityType | 类型（Damage/Heal/...） | Damage |
| School | 派系（Fire/Holy/Physical） | Fire |
| RangeMin/Max | 射程范围 | 0 / 30 |
| GCDSeconds | 公共冷却 | 1.5 |
| CooldownSeconds | 自身冷却 | 8 |
| CostType/CostAmount | 消耗类型与量 | Mana / 20 |
| CastTimeSeconds | 施法时间 | 2 |
| RequiresLOS | 是否要视线 | TRUE |
| CanMoveWhileCasting | 施法时能否移动 | FALSE |
| IconId | 图标 ID | icon_fireball |
| Notes | 备注 | Basic ranged nuke |

---

### 5.6 Templates/ 与 SKILL.md 的协同关系

最后用一张图把三层协同讲清楚：

```
┌──────────────────────────────────────────────────────────────┐
│  SKILL.md（核心定义层）                                       │
│  ─────────────────────────────                               │
│  • What this skill does    → 触发条件 + 产物清单             │
│  • Non-negotiable rules    → 安全红线                        │
│  • Output format (6 段)    → 输出骨架（编号 1-6）            │
│  • UE naming + folders     → 命名前缀                        │
│  • Multiplayer defaults    → 网络技术选型                    │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ SKILL.md 第 5 段 "Implementation" 说：
                            │ "按 BlueprintRecipe_Template 的格式输出"
                            │ "Replication 部分参照 Checklist_Networking"
                            │ "DataTable 用 Schema_Ability_DT 的 schema"
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  Templates/（模板工具层）                                     │
│  ─────────────────────────────                               │
│  • BlueprintRecipe_Template.md → 蓝图配方的具体骨架          │
│  • Checklist_Networking.md     → 网络检查的 4 维度清单       │
│  • Schema_Ability_DT.csv       → DataTable 的字段定义        │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ Claude 按这些模板组织最终输出
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  最终输出（用户拿到的设计文档）                               │
│  ─────────────────────────────                               │
│  1. Goal                                                     │
│  2. Inputs                                                   │
│  3. Outputs                                                  │
│  4. Assumptions                                              │
│  5. Implementation                                           │
│     - Blueprint Recipe（按模板 1 的骨架）                    │
│     - Replication Notes（按模板 2 的 4 维度）                │
│     - Assets / Naming（按 SKILL.md 的命名前缀）              │
│  6. Test Checklist（按模板 2 的 Testing 段）                 │
└──────────────────────────────────────────────────────────────┘
```

注意：SKILL.md 正文里其实**没有显式写"参照 Templates/xxx"**——这是这个 skill 的一个小瑕疵。更好的写法是在 Output format 段加一句"Implementation 部分参照 Templates/ 下的模板"。第 7 章的实战会演示这种更严谨的写法。

---

## 6. 设计哲学：为什么它要这样设计

读懂"是什么"和"怎么做"之后，最重要的是理解"为什么"。这一章把 `ue57-gamepiece-designer` 背后的设计哲学拆开，因为这些哲学是**写任何 skill 都通用的**。

### 6.1 为什么"纯文本，不执行"

这是这个 skill 最根本的选择，体现在：
- description 写 `Text-only, no scripts`
- Safety 段 4 条全是不执行
- 模板都是文本骨架，没有可执行代码

**理由**：
1. **可审计**：纯文本输出可以被用户逐行读、逐行改，再粘贴进 UE。AI 直接执行则黑盒，错了不知道错在哪。
2. **可回滚**：文本不改文件，用户不满意可以丢掉重生成。AI 改了文件，回滚要靠 Git。
3. **跨环境**：纯文本在任何 Claude 宿主（IDE/CLI/Web）都能用。如果 skill 依赖执行命令，换环境就废了。
4. **最小信任**：UE 项目资产破坏的代价极高（一个 `.uasset` 损坏可能让整个关卡打不开），不值得让 AI 直接动手。

**适用场景**：设计、规划、文档类 skill 适合纯文本。实施类 skill（如"自动修复 lint"）才需要执行权限，且必须有更严格的安全规则。

### 6.2 为什么"强制输出格式"

Output format 用编号 1)–6) 加 `(always)`，没有商量的余地。

**理由**：
1. **可对账**：用户拿到输出能逐段检查，少一段就是没达标。这种"质检能力"让 skill 输出可被验收。
2. **降低方差**：没有强制格式时，同一个问题问两次，Claude 可能输出完全不同的结构。强制格式让输出稳定。
3. **教育用户**：6 段结构本身就是"设计思考的完整链条"，用户看多了也会养成"先 Goal → 再 Inputs → ... → 最后 Test"的习惯。
4. **便于下游处理**：如果以后想做"把 skill 输出自动转成 UE 蓝图描述文件"，固定格式是前提。

**反例**：如果输出格式写"我会输出设计文档"，Claude 可能这次输出 3 段、下次输出 8 段，用户无法预期。

### 6.3 为什么用"模板 + 引用"而不是"全写进 SKILL.md"

**理由**：
1. **token 经济**：SKILL.md 全文注入上下文，越短越好。模板按需读取，不挤占预算。
2. **单一职责**：SKILL.md 管"行为规则"，Templates/ 管"输出形状"，各管各的。
3. **可复用**：网络检查清单、DataTable schema 这种模板，未来写别的 UE skill 能直接抄。
4. **可演进**：改模板不影响行为规则，版本管理清晰。

### 6.4 为什么"领域知识直接写死"

UE 命名前缀、网络权威模型、40v40 规模目标，都直接写在 SKILL.md 里，而不是"让 Claude 自己判断"。

**理由**：
1. **AI 不会自动遵守领域约定**：UE 的 `BP_`/`DT_`/`BPI_` 前缀是 Epic 推荐，但 Claude 不会"默认知道"，必须显式写。
2. **写死比"提示"可靠**：如果写"建议使用 UE 命名约定"，Claude 可能不遵守；写"Blueprints: `BP_<Thing>`"，Claude 几乎一定会遵守。
3. **降低用户纠正成本**：不写死的话，用户每次都要在对话里说"用 BP_ 前缀"，烦死人。

### 6.5 为什么"用占位符 + 默认值 + 可覆盖声明"

领域约定都用 `<占位符>`、`(default)`、`(unless user says otherwise)` 这套组合。

**理由**：
1. **占位符标可替换**：`<SystemName>` 告诉 Claude "这里填用户系统的名字"。
2. **默认值兜底**：用户没说时用默认，避免 Claude 瞎猜。
3. **可覆盖声明留口子**：用户可以说"我们项目用 `BPI_` 改成 `IFace_`"，Claude 就该切换。这是"约定大于配置，但配置可覆盖"的工程思想。

### 6.6 为什么"职责收窄"

这个 skill 只做"设计"，不做"实现"。

**理由**：
1. **一个 skill 只做一件事，才好测试**：如果又设计又实现又测试，出问题不知道是哪一环。
2. **设计是"想清楚"，实现是"做出来"**：前者纯文本就够，后者要碰文件。两者混在一起会让 skill 复杂度爆炸。
3. **用户痛点是"设计阶段缺脚手架"**：UE 项目里"动手实现"的工具链很成熟（蓝图编辑器、C++ IDE），但"设计阶段想清楚"的工具几乎没有。这个 skill 补的就是这个缺口。

### 6.7 哲学小结：5 条写 skill 的元原则

把上面 6 节提炼成 5 条元原则，写任何 skill 都适用：

1. **最小信任**：能不执行就不执行，能不改文件就不改文件。
2. **强制结构**：用编号 + 加粗 + `(always)` 把输出格式钉死。
3. **领域知识写死**：约定、默认值、量化指标都直接写进 SKILL.md。
4. **模板分离**：详细骨架放 Templates/，SKILL.md 只放行为规则。
5. **可覆盖声明**：用 `(default)` / `(unless specified)` 给用户留覆盖口子。

---

## 7. 实战：从零写一个 UE Skill（手把手）

理论够了，下面动手。我们仿照 `ue57-gamepiece-designer`，写一个**新 skill**：`ue57-weapon-fx-designer`——专门设计 UE5.7 武器特效（Niagara + 音效 + 蓝图整合）。

### 7.1 Step 1：确定 skill 的边界

动手前先问自己 5 个问题（这一步对应 SKILL.md 的设计思考）：

| 问题 | 回答 |
|---|---|
| 解决什么问题？ | 用户要做一个武器特效（开火、命中、爆炸），需要把 Niagara / Audio / Blueprint 三者整合 |
| 触发条件是什么？ | 用户说"武器特效""开火特效""命中特效""Niagara 武器"等 |
| 产出什么？ | Niagara emitter 配方 + Audio 配置 + Blueprint 整合节点链 + 测试清单 |
| 不做什么？ | 不创建 .uasset，不写 C++，不调 MCP |
| 安全规则？ | 纯文本，不执行，不改文件 |

### 7.2 Step 2：建文件夹结构

```
.claude/skills/ue57-weapon-fx-designer-0.1.0/
├── SKILL.md
├── _meta.json
└── Templates/
    ├── NiagaraEmitter_Template.md
    └── Checklist_Performance.md
```

### 7.3 Step 3：写 SKILL.md

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
   - **Niagara Recipe** (emitter modules + parameters)
   - **Audio Config** (cue, attenuation, concurrency)
   - **Blueprint Integration** (spawn → bind → cleanup)
   - **Assets / Naming / Folders**
6) **Test Checklist**

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

逐项对照 `ue57-gamepiece-designer`：
- ✅ YAML 头：name + description（四要素齐全：领域 + 产物 + 边界 + 形态）
- ✅ What this skill does：When-Then + 5 个产物 bullet
- ✅ Safety：4 条硬规则（直接抄，因为是通用的）
- ✅ Output format：6 段编号 + 加粗 + 括号说明（Implementation 段细化成 4 个子段，对应武器特效的 4 个产物）
- ✅ 命名约定：用 UE 标准前缀（NS_ / NE_ / Cue_ / SC_ / Att_ / MI_）
- ✅ 性能默认值：量化指标（200 粒子、80m cull、4 并发）

### 7.4 Step 4：写 _meta.json

```json
{
  "ownerId": "<your-owner-id>",
  "slug": "ue57-weapon-fx-designer",
  "version": "0.1.0",
  "publishedAt": 1773200000000
}
```

### 7.5 Step 5：写模板

`Templates/NiagaraEmitter_Template.md`：

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

`Templates/Checklist_Performance.md`：

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

### 7.6 Step 6：自检

写完后用这张清单自检（这套清单适用于任何 UE skill）：

- [ ] YAML 头的 name 与文件夹名、_meta.json 的 slug 三者一致？
- [ ] description 包含领域 + 产物 + 边界 + 形态四要素？
- [ ] What this skill does 用了 When-Then 句式？
- [ ] Safety 段每条都配了替代行为？
- [ ] Output format 用了编号 + 加粗 + `(always)`？
- [ ] 领域约定用了占位符 + `(default)` + 可覆盖声明？
- [ ] 模板用 `<占位符>` 标记所有可替换位置？
- [ ] 模板的 Testing 段给了具体可执行场景？
- [ ] 没有把详细模板塞进 SKILL.md？

全部勾选 = 及格的 skill。

### 7.7 Step 7：试用与迭代

把 skill 放进技能目录后，用一个真实需求试一遍：

> 用户："帮我做一个突击步枪的开火特效，要有枪口火光、弹道拖尾、命中火花。"

预期输出应该包含：
1. Goal：3 种特效整合的开火视觉
2. Inputs：武器类型、目标平台、是否多人
3. Outputs：NS_MuzzleFlash、NS_Tracer、NS_ImpactSpark、Cue_FireRifle、BP 函数 FireVFX
4. Assumptions：假设用 Niagara（不是 Cascade）、假设是 FPS 视角
5. Implementation：4 个子段（Niagara / Audio / BP / Assets）
6. Test Checklist：PIE / 专用服务器 / 低配硬件

如果输出缺段或质量不达标，回 SKILL.md 加约束。这个"试用→改→再试用"的循环就是 skill 的迭代过程。

---

## 8. 虚幻引擎技能的领域知识要点

写 UE skill 跟写通用 skill 最大的区别，在于**领域知识的厚度**。这一章列出写 UE skill 必须掌握的领域知识要点，方便你写自己的 skill 时查阅。

### 8.1 命名前缀速查（UE 官方约定）

| 前缀 | 资产类型 | 示例 |
|---|---|---|
| `BP_` | Blueprint（Actor 类） | BP_Pickup |
| `BPComp_` | Blueprint Component | BPComp_Interaction |
| `BPI_` | Blueprint Interface | BPI_Interactable |
| `BPD_` | Blueprint Data-Only | BPD_EnemyStats |
| `DT_` | DataTable | DT_Weapons |
| `DA_` | DataAsset | DA_WeaponConfig |
| `ST_` | Struct（一般也直接用前缀 `F` 在 C++ 里） | ST_WeaponData |
| `E_` | Enum | E_AbilityType |
| `WBP_` | Widget Blueprint | WBP_HUD |
| `M_` | Material | M_Beam |
| `MI_` | Material Instance | MI_BeamRed |
| `T_` | Texture | T_PotionIcon |
| `NS_` | Niagara System | NS_MuzzleFlash |
| `NE_` | Niagara Emitter | NE_Spark |
| `Cue_` | Audio Cue | Cue_FireRifle |
| `SC_` | Sound Class | SC_Weapon |
| `Att_` | Sound Attenuation | Att_Range30m |
| `L_` / `LVL_` | Level / Map | L_Arena01 |

> 💡 写 UE skill 时，把你这个领域用到的资产前缀全列在 SKILL.md 的"naming + folders"段，比让 Claude 自由发挥靠谱 10 倍。

### 8.2 多人游戏核心概念（写多人 skill 必备）

| 概念 | 一句话理解 | skill 里怎么用 |
|---|---|---|
| **Server Authority** | 服务器说了算，客户端只能请求 | 写进 Safety/Defaults，禁止客户端直接改状态 |
| **RPC 类型** | Server RPC（客户端→服务器）、Client RPC（服务器→特定客户端）、Multicast（服务器→所有客户端） | 在 Replication Notes 段强制写出每条 RPC 的类型 |
| **RepNotify** | 变量复制时触发客户端回调 | 在 Blueprint Recipe 段对每个 replicated 变量标注 `RepNotify? yes/no` |
| **NetMode** | Standalone / Listen Server / Dedicated Server / Client | 在 Test Checklist 段要求测多种 NetMode |
| **Relevancy** | 服务器只把"相关"的 actor 同步给客户端（距离/可见性） | 在 Performance 段提醒设置 relevancy |
| **NetCullDistanceSquared** | 超过此距离不同步 | 写进 Performance 段 |
| **bAlwaysRelevant** | 强制始终同步（玩家自身） | 在特殊场景提一下 |

### 8.3 性能基线（写性能检查清单用）

| 场景 | 基线指标 |
|---|---|
| 大型多人（40v40+） | Tick 频率 ≤30Hz，replicated vars ≤20/actor |
| 特效 | 单 effect ≤500 粒子，pooling 阈值 5次/秒 |
| 音频 | 同 sound class ≤4 并发，attenuation 匹配视觉范围 |
| UI | Widget ≤50 个同时显示，避免 Tick 重绘 |
| 内存 | 单 asset ≤10MB（大于则异步加载） |
| 网络 | 单帧 RPC ≤10 个，避免 Reliable 泛滥 |

### 8.4 测试场景三件套

每个 UE skill 的 Test Checklist 至少包含这三个场景：

1. **PIE（Play In Editor）**：编辑器内运行，快速验证逻辑。
2. **Dedicated Server + 2 Clients**：验证多人同步、服务器权威。
3. **Simulated Latency（200ms+）**：验证高延迟下不 desync。

进阶可以加：
4. **Low-end Hardware**：验证性能基线。
5. **Stress Test（100 players / 1000 actors）**：验证规模上限。

### 8.5 UE 版本敏感性

UE 各版本 API 差异大，写 skill 时**必须钉死版本**：

- UE 5.7 的 Niagara 模块名与 5.3 不同；
- UE 5.7 的 GAS（Gameplay Ability System）API 有调整；
- UE 5.7 的 MPC（Material Parameter Collection）用法有别；
- UE 5.0/5.1 的部分 API 已 deprecated。

所以在 description 和 What this skill does 里都要写明 `Unreal Engine 5.7`。如果未来要支持多版本，建议拆成多个 skill（`ue57-xxx` / `ue58-xxx`），而不是在一个 skill 里写"如果是 5.7 则...如果是 5.8 则..."。

---

## 9. 调试、测试与迭代

写完 skill 不等于能用，必须调试。这一章给一套调试流程。

### 9.1 常见 bug 与排查

| 症状 | 可能原因 | 排查方法 |
|---|---|---|
| Skill 没被触发 | description 太宽或太窄 | 把 description 改得更具体，加领域关键词 |
| 输出缺段 | Output format 没用 `(always)`，或编号格式不对 | 加 `(always)`，确认用 `1)` 不是 `1.` |
| 命名前缀不遵守 | 命名约定没写死，只写"建议" | 改成 `Blueprints: BP_<Thing>` 这种字面量声明 |
| 输出过长/过短 | 模板占位符没给"提示性选项" | 占位符改成 `<BeginPlay/InputAction/CustomEvent>` |
| 安全规则被绕过 | Safety 段没配替代行为 | 每条 Do NOT 后面加 `If ..., respond with ...` |
| 模板没被使用 | SKILL.md 没显式引用 Templates/ | 在 Output format 段写"参照 Templates/xxx" |

### 9.2 A/B 测试法

改 skill 时，用同一个测试输入跑两版，对比输出：

```
测试输入："做一个生命药水，按 E 拾取，多人同步"
  ↓
v0.1.0 输出 → 评分（结构完整性 / 命名合规 / 网络覆盖 / 测试覆盖）
v0.2.0 输出 → 评分
  ↓
取分数高的版本
```

评分维度建议：
- 结构完整性：6 段是否齐全？（每段 1 分，满分 6）
- 命名合规：所有命名是否符合前缀约定？（违反 1 处扣 1 分）
- 网络覆盖：Replication Notes 是否覆盖 4 维度？（每维度 1 分，满分 4）
- 测试覆盖：Test Checklist 是否包含 PIE / Dedicated / Latency 三场景？（每场景 1 分，满分 3）

### 9.3 版本迭代节奏

建议遵循 semver：

- **patch（0.1.0 → 0.1.1）**：修错别字、调描述措辞、补占位符提示。不改变行为。
- **minor（0.1.0 → 0.2.0）**：加新规则、新模板段、新领域约定。向后兼容。
- **major（0.x → 1.0.0）**：改输出格式、改安全规则、改命名约定。不向后兼容，需要用户重新适配。

每次升级更新 `_meta.json` 的 `version` 和 `publishedAt`。

### 9.4 用户反馈循环

skill 上线后，收集两类反馈：
- **"没触发"**：用户说了相关需求但 skill 没启用 → 加 description 关键词。
- **"输出不对"**：skill 启用了但输出质量差 → 加 SKILL.md 约束或模板占位符。

建议在 skill 仓库放一个 `FEEDBACK.md`，记录每次反馈和对应的修改。

---

## 10. 学习路径与下一步

### 10.1 你现在应该掌握的

读完本文并照着第 7 章实战后，你应该能：

1. ✅ 解释 Claude Code Skill 是什么、与 Prompt/Subagent/MCP 的区别
2. ✅ 看懂 `ue57-gamepiece-designer` 的每个文件、每段章节
3. ✅ 写出一个及格的 UE skill（YAML 头 + 6 段结构 + 模板 + 元数据）
4. ✅ 用领域知识（命名前缀、多人概念、性能基线）填充 skill 内容
5. ✅ 调试 skill 的常见问题

### 10.2 下一步学习建议

**横向扩展**（写更多 UE skill）：
- `ue57-ability-system-designer`：基于 GAS 的技能系统设计
- `ue57-ai-behavior-designer`：Behavior Tree + Behavior Task 设计
- `ue57-ui-hud-designer`：UMG HUD 设计
- `ue57-level-flow-designer`：关卡流程与 Sublevel 设计

**纵向深化**（让 skill 更强）：
- 给 skill 加 `examples/` 目录，放 2-3 个"标杆输出"做 few-shot
- 让 skill 支持调用 MCP 工具（如真的去 UE 里 spawn actor）——但这需要更严格的安全规则
- 把 skill 接入 CI（每次改 skill 跑一组回归测试输入，对比输出）

**交叉学习**（看别的 skill 怎么写）：
- 仓库内 `Game-Skills/game-framework-skill/`：另一种 UE skill 风格
- 仓库内 `game-studios/Claude-Code-Game-Studios-e375f/.claude/skills/`：大量非 UE skill 范例（adopt / bug-triage / code-review 等），可以学习通用 skill 写法

### 10.3 检查清单：写新 skill 前问自己

- [ ] 这个 skill 解决的问题，是不是"一类问题"而不是"一个问题"？（太具体就该用 Prompt 而不是 skill）
- [ ] 这个 skill 的边界清晰吗？（输入是什么、输出是什么、不做什么）
- [ ] 这个 skill 跟已有 skill 有重叠吗？（重叠就该合并或拆分）
- [ ] 我能列出至少 3 个"触发场景"和 3 个"不该触发的场景"吗？
- [ ] 我能写出 6 段输出格式的标准答案吗？（写不出就别指望 Claude 写得出）
- [ ] 安全规则配了替代行为吗？
- [ ] 领域约定有量化指标吗？（40v40、200 粒子、80m cull）
- [ ] 模板的占位符都给了提示性选项吗？

全部勾选 = 可以动手写了。

---

## 附录 A：ue57-gamepiece-designer 完整源文件索引

为方便对照学习，列出案例 skill 的所有源文件路径（仓库内）：

- [SKILL.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) — 核心定义文件
- [_meta.json](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/_meta.json) — 元数据
- [Templates/BlueprintRecipe_Template.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/BlueprintRecipe_Template.md) — 蓝图配方模板
- [Templates/Checklist_Networking.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/Checklist_Networking.md) — 网络检查清单
- [Templates/Schema_Ability_DT.csv](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/Schema_Ability_DT.csv) — DataTable schema 示例

相关参考文档（仓库内已有的同类资料）：

- [UE_Skill_Writing_Tutorial.md](file:///workspace/Game-Skills/gamepiece-designer/docs/UE_Skill_Writing_Tutorial.md) — 通用的 UE skill 编写教程（覆盖多种 skill 类型）
- [ue57-gamepiece-designer-解析记录.md](file:///workspace/Game-Skills/gamepiece-designer/docs/ue57-gamepiece-designer-解析记录.md) — 侧重实战案例的解析
- [ue57-save-system-designer-0.1.0/skill.md](file:///workspace/Game-Skills/gamepiece-designer/docs/ue57-save-system-designer-0.1.0/skill.md) — 仿写示例 skill

## 附录 B：SKILL.md 最小可行模板

```markdown
---
name: <skill-slug>
description: <动词> <领域> <产物> (Text-only, no scripts)
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
```

照这个最小模板填，10 分钟就能写出第一个 skill。

---

**本文结束。** 动手写你的第一个 UE skill 吧——记住：**先让 skill 能用，再让它好用**。完成比完美更重要。
