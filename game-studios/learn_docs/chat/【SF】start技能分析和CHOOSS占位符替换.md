
# start技能分析，CHOOSS占位符的替换

> ## 1 `g:\repository\claude\Game-Studio-Analise\.claude\skills\start\SKILL.md` 分析这个 /start 技能的作用，先翻译成中文，再解析技能的功能，并通过这个技能来学习SKill是如何编写的，设计思路是什么，这里的编写技巧是什么

我来详细分析这个 `/start` 技能。让我先读取完整的文件内容。
        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\skills\start\SKILL.md
          
这是一个非常棒的 Skill 编写示例！让我为你完整分析这个 `/start` 技能：

---

## 一、中文翻译

### 头部元数据

```yaml
---
name: start                                    # 技能名称，用户通过 /start 调用
description: "首次引导 — 询问用户当前状态，然后引导到正确的工作流。不做任何假设。"
argument-hint: "[无参数]"                       # 提示用户不需要参数
user-invocable: true                           # 允许用户直接调用
allowed-tools: Read, Glob, Grep, AskUserQuestion # 限制可用的工具
---
```

### 核心内容翻译

这是一份**引导式入职（Guided Onboarding）**技能，是新用户的入口点。

**工作流：**

1. **静默检测项目状态** - 在提问前，先检查：
   - 引擎是否已配置（`.claude/docs/technical-preferences.md`）
   - 游戏概念是否存在（`design/gdd/game-concept.md`）
   - 源代码是否存在（搜索 `src/` 下的各种代码文件）
   - 原型是否存在（检查 `prototypes/` 子目录）
   - 设计文档数量
   - 生产工件（检查 `production/sprints/` 或 `production/milestones/`）

2. **询问用户当前状态** - 给用户4个选项：
   - **A) 还没有想法** — 完全没有游戏概念，想探索
   - **B) 模糊的想法** — 只有大概的主题/感觉/类型，但不够具体
   - **C) 清晰的概念** — 知道核心玩法和类型，但还没整理成文档
   - **D) 已有工作** — 已经有设计文档、原型、代码或大量规划

3. **根据答案路由** - 为每种情况提供不同的引导路径
4. **确认后再继续** - 询问用户想从哪一步开始
5. **交接** - 让用户自己决定下一步

---

## 二、技能功能解析

这个 `/start` 技能的核心功能是：

| 功能 | 说明 |
|------|------|
| **状态感知** | 在提问前先检查项目当前状态（引擎、概念、代码、文档等） |
| **分层引导** | 将用户分为4种状态（从无想法到已有工作），每种状态有不同的引导路径 |
| **个性化推荐** | 根据用户的答案和项目状态，推荐最适合的下一步 |
| **渐进式披露** | 先了解用户，再推荐，不一次性展示所有功能 |

---

## 三、设计思路分析

### 1. **用户中心设计**
```
核心理念：不做假设，先问后动
- 不假设用户有游戏想法
- 不假设用户有技术背景
- 不假设用户想做什么
- 先了解用户状态，再提供建议
```

### 2. **静默检测策略**
- 在提问前**静默**收集信息
- 这些信息**不直接展示**给用户
- 用于**验证**用户的自我评估
- 用于**定制**后续推荐

### 3. **分层路由设计**
```
用户状态树：
├── A: 无想法 → 创意探索 → /brainstorm
├── B: 模糊想法 → 细化概念 → /brainstorm [hint]
├── C: 清晰概念 → 形式化或直接进入 → /brainstorm 或 /setup-engine
└── D: 已有工作 → 状态检测 → /project-stage-detect
```

### 4. **协作式协议**
明确的设计原则：
1. **先问** — 不假设用户状态或意图
2. **展示选项** — 提供清晰路径，不强制
3. **用户决定** — 他们选择方向
4. **不自动执行** — 推荐下一步，不自动运行
5. **适应** — 如果不符合模板，倾听并调整

---

## 四、编写技巧总结

### 1. **头部元数据的设计技巧**

```yaml
---
name: start                          # 简短、可读的命令名
description: "..."                   # 一句话清晰描述作用
argument-hint: "[no arguments]"      # 降低用户困惑
user-invocable: true                  # 明确是否可用户调用
allowed-tools: [Read, Glob, ...]      # 最小权限原则
---
```

**技巧点：**
- `description` 要包含**价值主张**（"asks where you are, then guides you..."）
- `argument-hint` 帮助用户知道如何调用
- `allowed-tools` 使用**最小权限原则**，只给需要的工具

---

### 2. **文档结构的设计技巧**

```
# 标题（一句话描述）

## 工作流（核心流程）
### 步骤名（具体动作）
1. 具体指令
2. 具体指令

### 下一步...
```

**技巧点：**
- **层级清晰**：工作流 → 步骤 → 具体动作
- **动词开头**："Detect"、"Ask"、"Route" 让指令明确
- **编号列表**：步骤有明确顺序时使用编号

---

### 3. **指令编写的技巧**

#### 技巧 A：条件指令（If/Then）
```markdown
#### If A: No idea yet

The user needs creative exploration before anything else. Engine choice,
technical setup — all of that comes later.

1. Acknowledge that starting from zero is completely fine
2. Briefly explain what `/brainstorm` does (guided ideation using professional
   frameworks — MDA, player psychology, verb-first design)
3. Recommend running `/brainstorm open` as the next step
4. Show the recommended path:
   ...
```

**要点：**
- 条件标题清晰：`If [条件]: [结果]`
- 先说明**为什么**这样处理（用户需要...）
- 再给出**具体步骤**（1、2、3）
- 使用**相对路径**引用其他技能

#### 技巧 B：引用其他技能
```markdown
- `/brainstorm` — discover your game concept
- `/setup-engine` — configure the engine (brainstorm will recommend one)
```

**要点：**
- 使用反引号包裹技能名：`` `/skill-name` ``
- 破折号后加简短说明
- 括号内可添加额外说明

#### 技巧 C：输出模板
```markdown
> **Welcome to Claude Code Game Studios!**
>
> Before I suggest anything, I'd like to understand where you're starting from.
> Where are you at with your game idea right now?
>
> **A) No idea yet** — I don't have a game concept at all...
```

**要点：**
- 使用引用块 `>` 表示需要输出的内容
- 使用 `**粗体**` 突出选项
- 保持格式清晰易读

---

### 4. **边界情况处理的技巧**

```markdown
## Edge Cases

- **User picks D but project is empty**: Gently redirect — "It looks like the
  project is a fresh template with no artifacts yet. Would Path A or B be a
  better fit?"
- **User picks A but project has code**: Mention what you found — "I noticed
  there's already code in `src/`..."
```

**要点：**
- 专门的 **Edge Cases** 章节
- 格式：`[条件]: [处理方式]`
- 使用破折号引出具体的回复示例

---

### 5. **设计原则文档化的技巧**

```markdown
## Collaborative Protocol

This skill follows the collaborative design principle:

1. **Ask first** — never assume the user's state or intent
2. **Present options** — give clear paths, not mandates
3. **User decides** — they pick the direction
4. **No auto-execution** — recommend the next skill, don't run it without asking
5. **Adapt** — if the user's situation doesn't fit a template, listen and adjust
```

**要点：**
- 单独的 **协议/原则** 章节
- 编号列表 + **粗体关键词** + 破折号解释
- 这些原则指导整个技能的行为

---

## 五、总结：编写优秀 Skill 的要点

| 维度 | 关键要点 |
|------|----------|
| **元数据** | 描述清晰、权限最小、用户友好 |
| **结构** | 层级清晰、流程导向、步骤明确 |
| **指令** | 动词开头、条件清晰、引用明确 |
| **输出** | 模板化、格式化、易读性强 |
| **边界** | 考虑异常、给出具体处理 |
| **原则** | 文档化设计哲学、指导行为 |

这个 `/start` 技能是一个**极佳的学习范本**，它展示了如何：
1. **设计用户旅程** — 从状态检测到分层引导
2. **编写可执行的文档** — 清晰的指令让 AI 知道具体做什么
3. **平衡结构化和灵活性** — 有清晰的流程，但能适应不同情况

> ## 2 分析一下 `g:\repository\claude\Game-Studio-Analise\.claude\skills\setup-engine\SKILL.md` setup-engine，先翻译成中文，再讲解Skill编写技巧；这么长的Skill文本，大模型会丢失关键点吗，能可靠执行吗

我来详细分析这个 `setup-engine` 技能，然后回答你关于长文本执行的关键问题。

---

## 一、中文翻译

### 头部元数据

```yaml
---
name: setup-engine                                    # 技能名称
description: "配置项目的游戏引擎和版本。在 CLAUDE.md 中固定引擎版本，检测知识缺口，当版本超出 LLM 训练数据时通过网络搜索填充引擎参考文档。"
argument-hint: "[引擎 版本] 或无参数进入引导模式"
user-invocable: true                                  # 用户可直接调用
allowed-tools: Read, Glob, Grep, Write, Edit, WebSearch, WebFetch, Task
---
```

### 执行流程

#### 第1步：解析参数

三种调用模式：
- **完整指定**：`/setup-engine godot 4.6` — 引擎和版本都提供
- **仅引擎**：`/setup-engine unity` — 提供引擎，版本会查询
- **无参数**：`/setup-engine` — 完全引导模式（引擎推荐 + 版本）

---

#### 第2步：引导模式（无参数时）

如果未指定引擎，运行交互式引擎选择流程：

**检查现有游戏概念**
- 读取 `design/gdd/game-concept.md`（如果存在）— 提取类型、规模、目标平台、美术风格、团队规模，以及 `/brainstorm` 的引擎推荐
- 如果没有概念，告知用户：
  > "未找到游戏概念。建议先运行 `/brainstorm` 来发现你想做什么 —— 它也会推荐引擎。或者告诉我你的游戏，我可以帮你选择。"

**如果用户想在没有概念的情况下选择，询问：**
1. **什么类型的游戏？**（2D、3D，还是两者都有？）
2. **目标平台？**（PC、手机、主机、网页？）
3. **团队规模和经验？**（单人新手、单人老手、小团队？）
4. **强烈的语言偏好？**（GDScript、C#、C++、可视化脚本？）
5. **引擎授权预算？**（仅免费，还是商业授权也可以？）

**生成推荐**

使用以下决策矩阵：

| 因素 | Godot 4 | Unity | Unreal Engine 5 |
|------|---------|-------|-----------------|
| **最适合** | 2D游戏、小型3D、单人/小团队 | 移动端、中等规模3D、跨平台 | AAA 3D、照片级真实、大团队 |
| **语言** | GDScript（+ C#、C++扩展） | C# | C++ / 蓝图 |
| **成本** | 免费，MIT协议 | 收入阈值以下免费 | 收入阈值以下免费，5%版税 |
| **学习曲线** | 平缓 | 中等 | 陡峭 |
| **2D支持** | 优秀（原生） | 良好（但3D优先引擎） | 可行但不理想 |
| **3D质量上限** | 良好（快速改进） | 非常好 | 业界最佳 |
| **Web导出** | 是（原生） | 是（有限） | 否 |
| **主机导出** | 通过第三方 | 是（需授权） | 是 |
| **开源** | 是 | 否 | 源码可用 |

呈现前1-2个推荐，并附上与用户答案相关的推理。
让用户选择 —— 从不强制推荐。

---

#### 第3步：查询当前版本

引擎选择后：

- 如果提供了版本，使用它
- 如果没有提供版本，使用 WebSearch 查找最新稳定版本：
  - 搜索：`"[引擎] 最新稳定版本 [当前年份]"`
  - 向用户确认："最新稳定的[引擎]是[版本]。使用这个？"

---

#### 第4步：更新 CLAUDE.md 技术栈

读取 `CLAUDE.md` 并更新技术栈部分。将 `[CHOOSE]` 占位符替换为实际值：

**Godot：**
```markdown
- **引擎**: Godot [版本]
- **语言**: GDScript（主要），通过 GDExtension 使用 C++（性能关键）
- **构建系统**: SCons（引擎），Godot 导出模板
- **资源管线**: Godot 导入系统 + 自定义资源管线
```

**Unity：**
```markdown
- **引擎**: Unity [版本]
- **语言**: C#
- **构建系统**: Unity 构建管线
- **资源管线**: Unity 资源导入管线 + Addressables
```

**Unreal：**
```markdown
- **引擎**: Unreal Engine [版本]
- **语言**: C++（主要），蓝图（玩法原型）
- **构建系统**: Unreal 构建工具（UBT）
- **资源管线**: Unreal 内容管线
```

---

#### 第5步：填充技术偏好

更新 `CLAUDE.md` 后，创建或更新 `.claude/docs/technical-preferences.md`，填入引擎相关的默认值。先读取现有模板，然后填写：

### 引擎与语言部分
- 从第4步的引擎选择填充

### 命名规范（引擎默认值）

**Godot（GDScript）：**
- 类：PascalCase（如 `PlayerController`）
- 变量/函数：snake_case（如 `move_speed`）
- 信号：snake_case 过去式（如 `health_changed`）
- 文件：与类匹配的 snake_case（如 `player_controller.gd`）
- 场景：与根节点匹配的 PascalCase（如 `PlayerController.tscn`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_HEALTH`）

**Unity（C#）：**
- 类：PascalCase（如 `PlayerController`）
- 公共字段/属性：PascalCase（如 `MoveSpeed`）
- 私有字段：_camelCase（如 `_moveSpeed`）
- 方法：PascalCase（如 `TakeDamage()`）
- 文件：与类匹配的 PascalCase（如 `PlayerController.cs`）
- 常量：PascalCase 或 UPPER_SNAKE_CASE

**Unreal（C++）：**
- 类：带前缀的 PascalCase（`A` Actor，`U` UObject，`F` 结构体）
- 变量：PascalCase（如 `MoveSpeed`）
- 函数：PascalCase（如 `TakeDamage()`）
- 布尔值：`b` 前缀（如 `bIsAlive`）
- 文件：不带前缀的类名（如 `PlayerController.h`）

### 剩余部分
- 性能预算：保留 `[TO BE CONFIGURED]` 并添加建议：
  > "典型目标：60fps / 16.6ms 帧预算。现在设置这些吗？"
- 测试：建议引擎适当的框架（Godot 用 GUT，Unity 用 NUnit 等）
- 禁止模式 / 允许库：保留占位符

### 协作步骤
将填好的偏好呈现给用户：
> "这里是 [引擎] 的默认技术偏好。想自定义任何这些，还是保存默认？"

等待批准后再写入文件。

---

#### 第6步：确定知识缺口

检查引擎版本是否可能超出 LLM 的训练数据。

**已知近似覆盖范围**（随模型变化更新）：
- LLM 知识截止：**2025年5月**
- Godot：训练数据可能覆盖到 ~4.3
- Unity：训练数据可能覆盖到 ~2023.x / 早期 6000.x
- Unreal：训练数据可能覆盖到 ~5.3 / 早期 5.4

将用户选择的版本与这些基线比较：

- **在训练数据内** → `低风险` — 参考文档可选但推荐
- **接近边缘** → `中风险` — 推荐参考文档
- **超出训练数据** → `高风险` — 参考文档必需

告知用户他们属于哪个类别以及原因。

---

#### 第7步：填充引擎参考文档

### 如果在训练数据内（低风险）：

创建最小化 `docs/engine-reference/<engine>/VERSION.md`：

```markdown
# [引擎] — 版本参考

| 字段 | 值 |
|-------|-------|
| **引擎版本** | [版本] |
| **项目固定日期** | [今日日期] |
| **LLM 知识截止** | 2025年5月 |
| **风险等级** | 低风险 — 版本在 LLM 训练数据内 |

## 注意

此引擎版本在 LLM 的训练数据内。引擎参考
文档是可选的，但以后可以添加，如果 agents 建议错误的 API。

运行 `/setup-engine refresh` 随时填充完整参考文档。
```

不要创建 breaking-changes.md、deprecated-apis.md 等 —— 它们会
增加上下文成本而价值最小。

### 如果超出训练数据（中或高风险）：

通过网络搜索创建完整参考文档集：

1. **搜索官方迁移/升级指南**：
   - `"[引擎] [旧版本] 到 [新版本] 迁移指南"`
   - `"[引擎] [版本] 破坏性变更"`
   - `"[引擎] [版本] 变更日志"`
   - `"[引擎] [版本] 已弃用 API"`

2. **从官方文档获取并提取**：
   - 从训练截止版本到当前版本的每个版本之间的破坏性变更
   - 带有替代方案的已弃用 API
   - 新功能和最佳实践

3. **创建完整参考目录**：
   ```
   docs/engine-reference/<引擎>/
   ├── VERSION.md              # 版本固定 + 知识缺口分析
   ├── breaking-changes.md     # 逐版本破坏性变更
   ├── deprecated-apis.md      # "不要用 X → 用 Y" 表格
   ├── current-best-practices.md  # 训练截止以来的新实践
   └── modules/                # 按子系统参考（按需创建）
   ```

4. **使用网络搜索的真实数据填充每个文件**，遵循
   现有参考文档建立的格式。每个文件必须有
   "最后验证：[日期]" 页眉。

5. **对于模块文件**：只为发生重大变更的子系统创建模块。
   不要创建空或最小的模块文件。

---

#### 第8步：更新 CLAUDE.md 导入

更新 "引擎版本参考" 下的 `@` 导入，指向正确的引擎：

```markdown
## 引擎版本参考

@docs/engine-reference/<引擎>/VERSION.md
```

如果之前的导入指向不同的引擎（例如，从 Godot 切换到 Unity），更新它。

---

#### 第9步：更新 Agent 指令

对于所选引擎的 specialist agents，验证它们是否有
"版本意识"部分。如果没有，按照现有 Godot specialist agents 中的模式添加一个。

该部分应指示 agent：
1. 读取 `docs/engine-reference/<引擎>/VERSION.md`
2. 在建议代码前检查已弃用 API
3. 检查相关版本转换的破坏性变更
4. 使用 WebSearch 验证不确定的 API

---

#### 第10步：刷新子命令

如果以 `/setup-engine refresh` 调用：

1. 读取现有 `docs/engine-reference/<引擎>/VERSION.md` 获取
   当前引擎和版本
2. 使用 WebSearch 检查：
   - 上次验证以来的新引擎发布
   - 更新的迁移指南
   - 新弃用的 API
3. 用新发现更新所有参考文档
4. 更新所有修改文件的"最后验证"日期
5. 报告变更内容

---

#### 第11步：输出摘要

设置完成后，输出：

```
引擎设置完成
=====================
引擎:          [名称] [版本]
知识风险:      [低/中/高]
参考文档:      [已创建/跳过]
CLAUDE.md:     [已更新]
技术偏好:      [已创建/更新]
Agent 配置:    [已验证]

下一步:
1. 查看 docs/engine-reference/<引擎>/VERSION.md
2. [如果从 /brainstorm 来] 运行 /map-systems 将你的概念分解为单个系统
3. [如果从 /brainstorm 来] 运行 /design-system 编写逐系统 GDD（引导式，逐节）
4. [如果从 /brainstorm 来] 运行 /prototype [核心机制] 测试核心循环
5. [如果从头开始] 运行 /brainstorm 发现你的游戏概念
6. 创建你的第一个里程碑：/sprint-plan new
```

---

## 防护栏

- 永远不要猜测引擎版本 —— 总是通过网络搜索或用户确认验证
- 永远不要覆盖现有参考文档而不询问 —— 追加或更新
- 如果参考文档已存在不同引擎，在替换前询问
- 在进行 CLAUDE.md 编辑前总是向用户展示你要更改的内容
- 如果网络搜索返回模糊结果，向用户展示并让他们决定
```

---

## 二、核心功能解析

| 功能模块 | 说明 |
|---------|------|
| **参数解析** | 支持3种模式：完整指定、仅引擎、完全引导 |
| **智能推荐** | 基于游戏概念（如果存在）推荐引擎，或使用决策矩阵 |
| **版本管理** | 自动查询最新版本，考虑LLM知识缺口 |
| **文档更新** | 更新CLAUDE.md、技术偏好、引擎参考文档 |
| **知识缺口检测** | 判断引擎版本是否超出LLM训练数据，决定是否创建详细参考文档 |
| **Agent配置** | 更新专业Agent的指令，确保版本意识 |
| **刷新子命令** | 支持 `/setup-engine refresh` 更新现有配置 |

---

## 三、设计思路分析

### 1. **渐进式配置**
```
引导模式（无参数）
    ↓
基于游戏概念智能推荐（如果存在）
    ↓
决策矩阵辅助选择（如果需要）
    ↓
自动查询版本
    ↓
更新所有相关文档
```

### 2. **知识缺口意识**
这是关键设计创新：
- **LOW RISK**: 版本在训练数据内 → 最小化文档（节省上下文）
- **HIGH RISK**: 版本超出训练数据 → 完整参考文档（确保准确性）

### 3. **协作式确认**
- 在写入文件前询问用户
- 展示要更改的内容
- 让用户选择是否自定义

---

## 四、编写技巧总结

### 技巧1：清晰的结构层次

```markdown
## 1. 步骤名（动词开头）

### 子步骤（条件或详细说明）

1. 具体动作
2. 具体动作

### 另一个子步骤
...
```

### 技巧2：条件分支的清晰表达

```markdown
### 如果在训练数据内（低风险）：

创建最小化文档...

### 如果超出训练数据（中或高风险）：

创建完整参考文档集...
```

### 技巧3：模板化的输出

```markdown
输出具体的模板内容：
```markdown
# [引擎] — 版本参考

| 字段 | 值 |
|-------|-------|
| **引擎版本** | [版本] |
...
```
```

### 技巧4：决策矩阵

使用表格清晰展示不同选项的对比，帮助用户（和AI）做出决策。

---

## 五、关键问题解答：长文本执行可靠性

你提出了一个非常重要的问题：

> "这么长的Skill文本，大模型会丢失关键点吗，能可靠执行吗？"

### 答案：**设计得当的长Skill是可以可靠执行的，但有条件和技巧**

#### 1. **为什么这个Skill能可靠执行？**

| 设计特点 | 如何防止关键点丢失 |
|---------|------------------|
| **清晰的编号结构** | 11个主要步骤，每个都有明确编号，LLM可以按顺序执行 |
| **条件分支清晰** | "If/Then"结构明确，LLM知道在什么情况下走哪条分支 |
| **明确的动作指令** | 每个步骤都有动词开头的具体动作（Read、Create、Update等） |
| **模板化内容** | 需要生成的内容有明确模板，LLM只需填充变量 |
| **输出格式明确** | 告诉LLM最终要输出什么格式的内容 |

#### 2. **长Skill的设计原则（防止关键点丢失）**

```
✅ 好的设计：
├── 清晰的层次结构（编号、缩进、分隔）
├── 每个步骤单一职责（一个步骤做一件事）
├── 明确的进入/退出条件
├── 具体的动作指令（动词开头）
└── 模板化的输出格式

❌ 避免的设计：
├── 过长的段落（>5行没有换行）
├── 模糊的描述（"根据需要处理"）
├── 深层嵌套（>3层条件）
├── 混合多个动作在一个步骤
└── 不明确的输出格式
```

#### 3. **实际执行时的可靠性机制**

| 机制 | 说明 |
|------|------|
| **分步执行** | LLM一次执行一个主要步骤（如第4步），完成后再进入下一步 |
| **状态保持** | 关键变量（选择的引擎、版本等）在执行过程中保持 |
| **条件检查** | 每个条件分支都有明确的判断标准 |
| **用户确认点** | 关键操作前要求用户确认（协作式设计） |

#### 4. **潜在的丢失风险点及缓解**

| 风险点 | 可能性 | 缓解措施 |
|--------|--------|---------|
| 跳过某个步骤 | 低 | 清晰的编号和检查点 |
| 条件判断错误 | 中 | 明确的条件描述和默认值 |
| 模板填充错误 | 低 | 明确的变量名和格式 |
| 长文本中的细节丢失 | 中 | 使用表格、列表、代码块等结构化格式 |
| 多步骤后的状态混乱 | 低 | 每个步骤自包含，减少状态依赖 |

---

## 六、结论

这个 `setup-engine` 技能是一个**设计精良的长文本Skill示例**，它展示了如何编写能被大模型可靠执行的复杂指令：

1. **结构化是关键** — 清晰的编号、层次、条件分支
2. **单一职责** — 每个步骤只做一件事
3. **明确的动作** — 动词开头，具体可执行
4. **模板化** — 减少自由发挥，提高一致性
5. **协作确认** — 关键操作前让用户确认

**只要遵循这些设计原则，即使是300+行的Skill也能被可靠执行。** 大模型不会"丢失关键点"，因为关键点是**结构化的、可定位的、可检查的**。

