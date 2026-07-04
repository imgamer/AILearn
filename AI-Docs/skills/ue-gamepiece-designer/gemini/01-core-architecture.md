# 第 1 篇：核心设计架构（Why & What）

> 本篇回答三个问题：
> 1. **这个 Skill 解决了什么问题？** 它的核心痛点和使用场景
> 2. **整体生命周期与流程：** 用户输入 `@技能` 后，从指令到执行，内部经历了什么
> 3. **技术选型与规范：** 用了哪些核心文件？为什么目录结构长这样

---

## 1.1 这个 Skill 解决了什么问题

### 1.1.1 痛点诊断

虚幻引擎（UE）开发中有一个常被忽视但代价高昂的环节——**"动手前想清楚"**。在 AI 协作场景下，这个痛点被放大成 4 个具体症状：

| 症状 | 表现 | 后果 |
|---|---|---|
| **设计缺结构** | 用户对 AI 说"帮我做个药水拾取"，AI 直接吐一段蓝图代码 | 缺数据 schema、缺网络考虑、缺测试方案，半路返工 |
| **领域约定不守** | AI 自由发挥命名，输出 `Blueprint_Pickup` 而不是 `BP_Pickup` | UE 项目资产命名混乱，后续批量操作困难 |
| **多人网络被忽略** | AI 默认按单人游戏设计，不写 RPC/Replication | 上了 40v40 服务器直接 desync 或卡顿 |
| **AI 越界执行** | AI 直接修改 `.uasset` 文件或跑命令 | 资产损坏、Git 冲突、不可回滚 |

### 1.1.2 Skill 的解决方案

`ue57-gamepiece-designer` 用**一份指令 + 三个模板**精准解决这 4 个痛点：

```
痛点 1（设计缺结构）  ─┐
                       ├──→ SKILL.md 的 "Output format (always)" 段
                       │    强制 6 段输出（Goal/Inputs/Outputs/Assumptions/Implementation/Test）
                       │
痛点 2（领域约定不守）─┼──→ SKILL.md 的 "UE naming + folders" 段
                       │    把 BP_/DT_/BPI_ 等前缀写死成默认规则
                       │
痛点 3（多人被忽略）  ─┼──→ SKILL.md 的 "Multiplayer defaults" 段
                       │    + Templates/Checklist_Networking.md
                       │    强制每个设计过 Authority/Replication/Performance/Testing 4 维度
                       │
痛点 4（AI 越界）     ─┘──→ SKILL.md 的 "Non-negotiable rules" 段
                            4 条硬规则禁止执行命令/改文件/生成脚本
```

**核心价值主张**：把"模糊的设计需求"转化为"可直接在 UE5.7 中落地的结构化技术规范"，同时把"多人网络"和"UE 命名约定"这两个最容易遗漏的点**强制嵌入每次输出**。

### 1.1.3 使用场景

适合用这个 skill 的场景：

- ✅ "帮我设计一个生命药水拾取系统，按 E 拾取，多人同步"
- ✅ "做一个 RPG 技能系统，含火球术、治疗术、近战挥砍"
- ✅ "设计一个目标选择系统，Tab 切换锁定"

不适合的场景：

- ❌ "帮我写一个 UE C++ 类的代码" → 该用代码生成型 skill
- ❌ "我的 UE 崩溃了，log 里报 GC 错误" → 该用诊断型 skill
- ❌ "帮我在 UE 里 spawn 一个 Cube" → 该用 MCP 集成型 skill（真的执行操作）

**关键认知**：这个 skill 是**设计型**而非**执行型**。它只产出"可粘贴的文本设计文档"，不真的碰 UE 项目。这种"职责收窄"是它可靠性的来源——也是初学者写 skill 时最容易忽略的设计决策。

---

## 1.2 整体生命周期与流程

### 1.2.1 从用户输入到输出的完整调用链

下面这张图展示用户在 Claude Code 中提到本 skill 时，系统内部经历的完整流程。注意：**skill 本身不"执行"，它只是被注入到 Claude 的上下文中作为工作守则**。

```
┌────────────────────────────────────────────────────────────────────┐
│  ① 用户在对话中输入                                                 │
│  "帮我设计一个生命药水拾取系统，按 E 拾取，多人同步"               │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ② 宿主（Claude Code / IDE / CLI）扫描已注册的 skill 列表          │
│  扫描范围：                                                       │
│    • 项目级：.claude/skills/<name>-<semver>/                       │
│    • 仓库级：Game-Skills/.../ue57-gamepiece-designer/              │
│  对每个 skill 读取：                                              │
│    • SKILL.md 的 YAML 头（name + description）                    │
│    • _meta.json 的 slug / version                                 │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ③ 触发匹配（语义路由）                                            │
│  把用户输入与每个 skill 的 description 做语义相似度匹配            │
│                                                                   │
│  本 skill 的 description：                                        │
│  "Designs UE5.7 multiplayer-friendly game pieces (Blueprint node   │
│   chains, data schemas, asset naming, and test checklists).       │
│   Text-only, no scripts."                                         │
│                                                                   │
│  匹配关键词命中：UE / multiplayer / game piece / 蓝图 / 拾取       │
│  → 判定：启用本 skill                                             │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ④ 上下文注入                                                     │
│  把 SKILL.md 全文塞进 Claude 的系统上下文（system prompt 区）      │
│  注意：                                                            │
│    • SKILL.md 全文注入（约 46 行，~600 tokens）                   │
│    • Templates/ 不会自动注入（按需读取，节省 token）              │
│    • _meta.json 不注入（只供系统识别用）                          │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ⑤ Claude 按 SKILL.md 的"工作守则"生成回答                        │
│  依据：                                                           │
│    • What this skill does → 确定要产出 5 类内容                   │
│    • Non-negotiable rules → 不执行命令/不改文件                   │
│    • Output format (always) → 强制 6 段结构                      │
│    • UE naming + folders → 用 BP_/DT_/BPI_ 前缀                   │
│    • Multiplayer defaults → Server 权威 + RPC 模型                │
│                                                                   │
│  如需细化某段（如 Blueprint Recipe），Claude 会读取对应模板：     │
│    • Templates/BlueprintRecipe_Template.md                        │
│    • Templates/Checklist_Networking.md                            │
│    • Templates/Schema_Ability_DT.csv                              │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ⑥ 输出结构化设计文档                                             │
│  1) Goal                                                          │
│  2) Inputs                                                        │
│  3) Outputs                                                       │
│  4) Assumptions                                                   │
│  5) Implementation                                                │
│     - Blueprint Recipe（按模板骨架）                             │
│     - Replication Notes（按网络 4 维度）                          │
│     - Assets / Naming / Folders                                   │
│  6) Test Checklist                                                │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│  ⑦ 用户拿到文本设计，自己复制粘贴到 UE 实现                       │
│  • DataTable CSV 可直接导入 UE                                    │
│  • 蓝图配方可照着在蓝图编辑器搭节点                                │
│  • 命名规范可对照资产浏览器检查                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 1.2.2 关键认知：Skill 是"被注入的守则"，不是"被调用的函数"

这是初学者最大的认知障碍。很多人以为 skill 像函数一样被"调用执行"——**完全不是**。

对照传统编程的概念：

| 维度 | 传统函数 | Claude Code Skill |
|---|---|---|
| 形态 | 可执行代码 | Markdown 指令文件 |
| 触发 | 显式调用 `func()` | 语义匹配 description |
| 执行 | CPU 跑代码 | Claude 按指令生成回答 |
| 输入 | 参数列表 | 用户的自然语言 |
| 输出 | 返回值 | Claude 生成的文本 |
| 副作用 | 可控（按代码逻辑） | 取决于 Claude 是否遵守规则 |

所以 skill 的"工程化"本质是：**把"想让 Claude 怎么回答"这件事，用结构化、可版本化、可分发的 Markdown 写出来**。

### 1.2.3 触发匹配的细节

第 ③ 步的"语义路由"是 skill 系统最神秘的部分。它的工作方式：

1. **不是关键词精确匹配**：用户说"做个药水"也能命中 description 里有 "game pieces" 的 skill，靠的是语义相似度。
2. **不是正则匹配**：用户说"help me design a pickup"（英文）和"帮我设计药水"（中文）应该命中同一个 skill。
3. **依赖宿主实现**：不同宿主（Claude Code CLI / Trae IDE / 其他）的匹配算法可能不同，但都基于 description。

这带来一个**重要推论**：description 写得好不好，直接决定 skill 能不能被正确触发。这是第 3 篇"避坑指南"的重点。

### 1.2.4 模板的按需读取

第 ⑤ 步提到"Templates/ 不自动注入"。这是 skill 工程化的关键设计：

```
SKILL.md（始终注入，约 600 tokens）
   │
   ├── 引用 Templates/BlueprintRecipe_Template.md（按需读取，约 400 tokens）
   ├── 引用 Templates/Checklist_Networking.md（按需读取，约 200 tokens）
   └── 引用 Templates/Schema_Ability_DT.csv（按需读取，约 150 tokens）
```

**为什么这样设计？**
- **token 经济**：如果全部注入，约 1350 tokens 占用系统上下文。多次对话后挤压可用预算。
- **按需读取**：Claude 在生成 Implementation 段时才需要蓝图模板，生成 Test 段时才需要网络清单。前置阶段不需要这些信息。
- **可独立演进**：改模板不动 SKILL.md，版本管理清晰。

> ⚠️ **本案例的一个小瑕疵**：SKILL.md 正文里其实**没有显式写"参照 Templates/xxx"**。Claude 是靠训练习惯猜的——它看到 "Blueprint Recipe" 这个词，会去 Templates/ 找同名文件。更严谨的写法是在 Output format 段加一句 "Implementation 段参照 Templates/ 下的模板"。第 3 篇会演示这种更严谨的写法。

---

## 1.3 技术选型与规范

### 1.3.1 核心文件清单与职责

| 文件 | 行数 | 类型 | 职责 | 必需性 |
|---|---|---|---|---|
| [SKILL.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/SKILL.md) | 46 | Markdown | 行为守则 + 输出契约 + 领域约定 | ✅ 必须 |
| [_meta.json](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/_meta.json) | 5 | JSON | 元数据（slug/version/owner/发布时间） | ⚠️ 分发时必须 |
| [Templates/BlueprintRecipe_Template.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/BlueprintRecipe_Template.md) | 38 | Markdown | 蓝图配方骨架 | ⭕ 可选但推荐 |
| [Templates/Checklist_Networking.md](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/Checklist_Networking.md) | 18 | Markdown | 网络检查 4 维度清单 | ⭕ 可选但推荐 |
| [Templates/Schema_Ability_DT.csv](file:///workspace/Game-Skills/gamepiece-designer/ue57-gamepiece-designer/Templates/Schema_Ability_DT.csv) | 4 | CSV | DataTable 字段示例 | ⭕ 可选但推荐 |

### 1.3.2 SKILL.md 的章节规范

`SKILL.md` 不是随便写的 Markdown，它有约定的章节结构。本案例的章节顺序与作用：

```
SKILL.md
├── YAML Frontmatter        ← 必须在文件最顶部，--- 包裹
│   ├── name                ← skill 唯一标识，与文件夹名/_meta.json.slug 一致
│   └── description         ← 触发匹配的唯一依据
│
├── # 标题                   ← H1，写 skill 全名
│
├── ## What this skill does ← 触发条件 + 产物清单（When-Then 句式）
│
├── ## Non-negotiable rules ← 安全红线（Do NOT + 替代行为）
│
├── ## Output format        ← 输出契约（编号 1-N + 加粗标题 + (always)）
│
├── ## UE naming + folders  ← 领域约定 1（命名前缀，带占位符 + (default)）
│
└── ## Multiplayer defaults ← 领域约定 2（技术选型，带量化指标 + (unless specified)）
```

**为什么是这个顺序？**
- **YAML 在最前**：系统解析时第一眼就能拿到 name/description，不用扫全文。
- **What 在 Safety 前**：先告诉 Claude "做什么"，再告诉它"不能做什么"——先正向后反向。
- **Output format 在领域约定前**：先把"输出长什么样"定下来，再补"领域细节怎么填"。这是从骨架到血肉的逻辑。
- **领域约定在最后**：这些是"填充内容时的细节规则"，Claude 在生成具体段落时才需要查。

### 1.3.3 _meta.json 的字段规范

```json
{
  "ownerId": "kn7en1t4pyth0eh213e2nq38n181sqj6",
  "slug": "ue57-gamepiece-designer",
  "version": "0.1.0",
  "publishedAt": 1771974908734
}
```

| 字段 | 含义 | 约束 | 作用 |
|---|---|---|---|
| `ownerId` | 所有者 ID | 字符串，不可改 | 分发平台归属凭证，防冒名 |
| `slug` | URL 友好标识 | 小写 + 连字符，与文件夹名 + SKILL.md 的 name 一致 | 系统内部引用 key |
| `version` | 语义化版本 | `MAJOR.MINOR.PATCH` | 版本管理与兼容性判断 |
| `publishedAt` | 发布时间 | Unix 毫秒时间戳 | 排序与版本先后判断 |

**三者一致性原则**：`文件夹名` = `_meta.json.slug` = `SKILL.md 的 name`。三者必须完全一致，否则系统识别失败。本案例都是 `ue57-gamepiece-designer`。

### 1.3.4 Templates/ 的命名规范

本案例的模板文件命名遵循一套隐含规则：

| 文件名 | 类型前缀 | 内容 |
|---|---|---|
| `BlueprintRecipe_Template.md` | `<Topic>_Template` | 通用骨架模板 |
| `Checklist_Networking.md` | `Checklist_<Topic>` | 检查清单 |
| `Schema_Ability_DT.csv` | `Schema_<Topic>_<AssetType>` | 数据 schema |

**为什么这样命名？**
- **`_Template` 后缀**：明确这是"待填充的骨架"，区别于"已填充的示例"。
- **`Checklist_` 前缀**：明确这是"检查清单"类内容，Claude 能从文件名猜到用途。
- **`Schema_` 前缀 + `_DT` 后缀**：明确这是 DataTable 的 schema，`DT` 与 SKILL.md 里的命名前缀呼应。

这种命名让 Claude 在按需读取时**光看文件名就能猜到内容类型**，降低误读风险。

### 1.3.5 目录结构为何这样设计

完整的目录结构：

```
ue57-gamepiece-designer/        ← 文件夹名 = slug
├── SKILL.md                    ← 入口文件（必须叫这个名字）
├── _meta.json                  ← 元数据（必须叫这个名字）
└── Templates/                  ← 模板目录（命名自由，但 Templates/ 是约定俗成）
```

**设计理由**：

1. **扁平优先**：只有一级子目录（Templates/）。不搞 `docs/`、`rules/`、`schemas/` 多级分类——文件少时扁平更易读。
2. **入口固定**：`SKILL.md` 是宿主识别 skill 的入口，文件名不能改。这就像 `package.json` 之于 npm 包、`Cargo.toml` 之于 Rust crate——**约定的入口点**。
3. **Templates/ 集中可复用资产**：把所有"可复用的输出骨架"放在一个目录，方便 Claude 一次扫描全部，也方便人维护。
4. **无 examples/ 目录**：本案例没有放"标杆输出示例"。这是 skill 工程化的一个进阶选项——加 examples 能让 Claude 学到"好输出长什么样"（few-shot），但会占 token。本案例选择精简，靠 SKILL.md 的精度保证输出质量。

### 1.3.6 与其他扩展机制的对比

为加深理解，对比 Claude Code 生态的其他扩展机制：

| 机制 | 形态 | 触发 | 执行 | 适用 |
|---|---|---|---|---|
| **Skill**（本文） | Markdown 指令 | 语义匹配 description | Claude 按指令生成文本 | 标准化输出、领域知识固化 |
| **Subagent** | 独立代理配置 | 显式调度 | 独立上下文执行任务 | 长任务、隔离上下文 |
| **MCP Server** | 可执行进程 | 工具调用 | 真的执行外部操作 | 调用数据库/API/编辑器 |
| **Hook** | Shell 脚本 | 事件触发 | 跑 shell 命令 | 自动化流程钩子 |
| **CLAUDE.md** | 项目级 Markdown | 始终生效 | 作为长期上下文 | 项目规范、团队约定 |

**关键认知**：本案例的 skill 是**纯指令型**，不依赖 MCP/Hook 执行任何操作。它的所有"执行力"都来自 Claude 遵守 SKILL.md 的指令生成文本。这种"零执行"设计让它在任何宿主都能用，但也意味着它**不能真的修改 UE 项目**——这是第 4 篇要解决的"迁移到 UE 自动化"问题的起点。

---

## 1.4 本篇小结

### 三个核心结论

1. **Skill 是"被注入的守则"，不是"被调用的函数"**。它本身不执行，只指导 Claude 怎么回答。
2. **触发匹配靠 description**。description 写得好不好决定 skill 能否被正确启用，这是 skill 工程化的第一道关卡。
3. **目录结构遵循"入口固定 + 模板分离"原则**。SKILL.md 是唯一入口，Templates/ 是按需读取的可复用资产，_meta.json 支撑分发与版本管理。

### 这套设计解决了什么

- **设计缺结构** → Output format 强制 6 段
- **领域约定不守** → UE naming 写死前缀
- **多人网络被忽略** → Multiplayer defaults + Checklist_Networking
- **AI 越界执行** → Non-negotiable rules 4 条硬规则

### 下一篇

第 1 篇讲了"是什么"和"为什么"。第 2 篇 [02-source-deep-dive.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/02-source-deep-dive.md) 会逐行拆解源码，回答"怎么做"——参数怎么解析、错误怎么处理、状态怎么管理。
