# CLAUDE.md 编写教程

## 概述

`CLAUDE.md` 是Claude Code项目的根配置文件，用于向AI助手传递项目上下文、约定和工作流程。本教程基于 Claude-Code-Game-Studios 项目的最佳实践，总结编写 `CLAUDE.md` 的范式和技巧。

---

## 一、CLAUDE.md的本质

### 1.1 定位与作用

`CLAUDE.md` 是Claude Code的**上下文引导文件**，它在每次会话开始时自动加载，为AI提供：

```
项目是什么 → 放在哪里工作 → 如何正确工作 → 遇到问题找谁
```

### 1.2 分层配置策略

Claude-Code-Game-Studios采用**多层级CLAUDE.md配置**：

```
项目根目录/
├── CLAUDE.md              # 全局配置（主入口）
├── design/
│   └── CLAUDE.md          # 设计目录规范
├── src/
│   └── CLAUDE.md          # 代码目录规范
├── docs/
│   └── CLAUDE.md          # 文档目录规范
└── CCGS Skill Testing Framework/
    └── CLAUDE.md          # 子框架配置
```

**设计原理**：
- 根目录 `CLAUDE.md`：全局上下文和主工作流程
- 子目录 `CLAUDE.md`：特定领域的约定和验证规则
- AI进入子目录时自动加载对应的 `CLAUDE.md`，获得更具体的指导

---

## 二、根目录 CLAUDE.md 编写范式

### 2.1 标准结构

根据分析，根目录 `CLAUDE.md` 应包含以下章节：

```markdown
# [项目名称] — [项目一句话描述]

[项目详细描述，说明团队规模和核心价值主张]

## Technology Stack

- **领域1**: [具体技术栈]
- **领域2**: [具体技术栈]
- ...

> **提示**: [重要的项目范围说明]

## Project Structure

@[相关结构文档路径]

## 核心规范

@[规范文档路径]

## 协作协议

**核心原则描述**

- 规则1
- 规则2
- ...

## 其他规范

@[其他规范文档路径]
```

### 2.2 章节说明

#### 标题（必选）

```markdown
# Claude Code Game Studios — 游戏工作室Agent架构
```

**格式**：`# [项目名称] — [一句话描述]`

**要点**：
- 名称清晰可识别
- 一句话说明项目性质和规模
- 让AI在10秒内理解"这是什么项目"

#### 简介段落（必选）

```markdown
通过49个协调的Claude Code子Agent管理独立游戏开发。
每个Agent负责特定领域，强制执行关注点分离和质量保证。
```

**格式**：2-3句话的项目概述

**要点**：
- 说明项目是**什么**
- 说明项目的**规模**（几个人/几个Agent/几个子系统）
- 说明核心**设计原则**

#### Technology Stack（必选）

```markdown
## Technology Stack

- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5]
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint]
- **Version Control**: Git with trunk-based development
- **Build System**: [SPECIFY after choosing engine]
- **Asset Pipeline**: [SPECIFY after choosing engine]
```

**格式**：技术领域 → 具体技术/待选技术

**要点**：
- 列出项目中使用的**所有技术栈**
- 如果技术待定，使用 `[CHOOSE: 选项A / 选项B]` 格式
- 如果技术待确认，使用 `[SPECIFY after X]` 格式
- 帮助AI在写代码前确认技术选择

#### 提示框（可选但推荐）

```markdown
> **Note**: Engine-specialist agents exist for Godot, Unity, and Unreal with
> dedicated sub-specialists. Use the set matching your engine.
```

**格式**：`> **标签**: [内容]`

**要点**：
- 使用 `>` 引用块格式
- 用粗体标签突出重要信息
- 放置需要用户注意的重要说明

#### Project Structure（必选）

```markdown
## Project Structure

@.claude/docs/directory-structure.md
```

**格式**：`@[文档路径]`

**要点**：
- 使用 `@` 语法引用其他文档
- 引用项目结构文档
- AI会自动加载引用的文档获取详细信息

#### 核心规范引用（必选）

```markdown
## Coordination Rules

@.claude/docs/coordination-rules.md

## Coding Standards

@.claude/docs/coding-standards.md

## Context Management

@.claude/docs/context-management.md
```

**格式**：规范类型 → @文档路径

**要点**：
- 按优先级列出核心规范
- 使用 `@` 引用而不是内联完整内容
- 保持主文档简洁，具体规范在子文档中

#### 协作协议（必选）

```markdown
## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.
```

**格式**：
1. 核心原则（粗体）
2. 核心工作流
3. 具体规则列表
4. 详细文档引用

**要点**：
- 用**粗体**突出核心原则
- 用 `->` 或 `->` 表示工作流程
- 用列表说明具体规则
- 用 `See X for details` 提供深入阅读

#### 首次会话提示（可选）

```markdown
> **First session?** If the project has no engine configured and no game concept,
> run `/start` to begin the guided onboarding flow.
```

**格式**：条件 → 建议动作

**要点**：
- 针对特定场景（新用户/首次会话）提供指导
- 使用条件判断（`If...`）
- 提供明确的命令或动作

---

## 三、子目录 CLAUDE.md 编写范式

### 3.1 标准结构

```markdown
# [目录名称]

[目录用途说明]

## [领域1规范]

- 规范1
- 规范2

## [领域2规范]

- 规范1
- 规范2
```

### 3.2 示例分析

#### design/CLAUDE.md

```markdown
# Design Directory

When authoring or editing files in this directory, follow these standards.

## GDD Files (`design/gdd/`)

Every GDD must include all **8 required sections** in this order:
1. Overview — one-paragraph summary
2. Player Fantasy — intended feeling and experience
3. Detailed Rules — unambiguous mechanics
4. Formulas — all math defined with variables
5. Edge Cases — unusual situations handled
6. Dependencies — other systems listed
7. Tuning Knobs — configurable values identified
8. Acceptance Criteria — testable success conditions

**File naming:** `[system-slug].md` (e.g. `movement-system.md`)

**Systems index:** `design/gdd/systems-index.md`
```

**编写要点**：
- 第一段说明"这是什么目录"
- 用 `##` 区分不同文件类型的规范
- 用 `**粗体**` 强调关键术语
- 用代码格式（`` `code` ``）表示文件路径和名称
- 用列表说明具体要求

#### src/CLAUDE.md

```markdown
# Source Directory

When writing or editing game code in this directory, follow these standards.

## Engine Version Warning

The LLM's training data predates the pinned engine version.
**Always check `docs/engine-reference/` before using any engine API.**

## Coding Standards

- All public APIs require doc comments
- Gameplay values must be **data-driven**
- Prefer dependency injection over singletons for testability
- Every new system needs a corresponding ADR

## Tests

Tests live in `tests/` — not in `src/`.
```

**编写要点**：
- 将最重要的规范（如警告）放在最前面
- 按优先级排列规范章节
- 提供具体的文件位置规范

---

## 四、协作协议编写

### 4.1 核心原则

```markdown
**User-driven collaboration, not autonomous execution.**
```

**原则要点**：
- 用**粗体**开头，直接说明核心立场
- 对立陈述（协作 vs 自主执行）帮助理解
- 简洁有力，一句话说明"不能做什么"

### 4.2 标准工作流

```markdown
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**
```

**工作流要点**：
- 用 `->` 或 `->` 连接步骤
- 全大写字母突出关键步骤
- 5步以内保持清晰

### 4.3 具体规则

```markdown
- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction
```

**规则要点**：
- 用列表格式
- 用 **MUST** / **MUST NOT** 表示强制规则
- 用引号包裹具体命令示例
- 用 `[filepath]` 表示变量占位

### 4.4 详细文档引用

```markdown
See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.
```

**引用要点**：
- 用 `See X for Y` 格式
- 提供完整文档路径
- 说明文档内容类型（protocol/examples）

---

## 五、引用语法

### 5.1 @引用语法

```markdown
@.claude/docs/directory-structure.md
```

**说明**：
- `@` 符号告诉Claude Code加载引用的文档
- 使用相对路径
- 引用文档的内容会被自动加载到上下文中

### 5.2 引用最佳实践

```
应该引用：
✓ @.claude/docs/directory-structure.md
✓ @docs/engine-reference/godot/VERSION.md
✓ See `.claude/docs/coordination-rules.md`

应该内联：
✓ 核心原则（一句话）
✓ 最重要的工作流
✓ 关键警告
```

**原则**：
- 详细规范使用 `@` 引用
- 核心原则和关键规则内联在主文档中
- 保持主文档在200行以内

---

## 六、CLAUDE.md 检查清单

### 6.1 必填项

- [ ] 项目名称和一句话描述
- [ ] 技术栈列表
- [ ] 项目结构引用
- [ ] 核心规范引用
- [ ] 协作协议（核心原则 + 工作流 + 具体规则）

### 6.2 建议项

- [ ] 首次会话提示
- [ ] 技术警告（如LLM知识截止日期）
- [ ] 子目录CLAUDE.md（如果项目规模较大）
- [ ] 详细文档引用

### 6.3 格式检查

- [ ] 使用 `#` 作为主标题
- [ ] 使用 `##` 作为章节标题
- [ ] 核心原则使用 **粗体**
- [ ] 文件路径使用 `` `code` `` 格式
- [ ] 重要提示使用 `> **Note**:` 格式
- [ ] 使用 `@` 引用外部文档

---

## 七、示例模板

```markdown
# [项目名称] — [一句话描述]

[2-3句项目描述，说明项目性质、规模和核心价值]

## Technology Stack

- **领域1**: [具体技术]
- **领域2**: [具体技术]
- **版本控制**: [VCS系统]
- **构建工具**: [构建工具]

> **Note**: [重要的项目范围或限制说明]

## Project Structure

@[项目结构文档路径]

## 核心规范

@[核心规范文档路径]

## 协作协议

**核心原则描述（用粗体）**
每个任务遵循：**步骤1 -> 步骤2 -> 步骤3**

- 规则1
- 规则2
- 规则3

详见 `docs/PROTOCOL.md` 获取完整协议和示例。

> **First session?** [如果是新项目，提供入职指导]

## Coding Standards

@[编码规范文档路径]

## Context Management

@[上下文管理文档路径]
```

---

## 八、常见反模式

### ❌ 过度冗长

```markdown
# Bad Example
## Project Overview
This is a game development project that uses Claude Code to manage
the development process. The project consists of multiple agents
that work together to create a high-quality game...

# Good Example
# [项目名称] — 游戏工作室Agent架构
通过49个协调的Claude Code子Agent管理独立游戏开发。
```

### ❌ 缺乏结构

```markdown
# Bad Example
Here are some things to know about this project.
First, we use Unity. Second, we follow a collaborative workflow.
Also, the coding standards say you should write tests.

# Good Example
## Technology Stack
- **Engine**: Unity 2023.x

## Collaboration Protocol
**User-driven collaboration, not autonomous execution.**

## Coding Standards
- Write tests for all new features
```

### ❌ 缺少核心规范引用

```markdown
# Bad Example
We follow good coding practices and collaborative workflows.
See our extensive documentation for details.

# Good Example
## Technical Preferences
@.claude/docs/technical-preferences.md

## Coordination Rules
@.claude/docs/coordination-rules.md
```

---

## 九、项目特定示例

### 9.1 简单项目

```markdown
# My Game — 2D Platformer

A solo developer 2D platformer built with Godot 4.

## Technology Stack
- **Engine**: Godot 4.2
- **Language**: GDScript
- **Version Control**: Git

## Project Structure
@docs/structure.md

## Collaboration Protocol
This is a solo project. Run `/start` to begin.
```

### 9.2 中等规模项目

```markdown
# Team Game — Multiplayer RPG

A team-developed multiplayer RPG using Unity.

## Technology Stack
- **Engine**: Unity 2023.x
- **Language**: C#
- **Networking**: Mirror
- **Version Control**: Git + GitFlow

> **Team**: 4 developers, 1 artist, 1 designer

## Project Structure
@docs/structure.md

## Coordination Rules
@.claude/docs/coordination-rules.md

## Collaboration Protocol
**User-driven collaboration, not autonomous execution.**
See `docs/PROTOCOL.md` for details.
```

### 9.3 复杂多Agent项目

```markdown
# Claude Code Studios — Enterprise Agent System

Large-scale multi-agent system managing game development through
50+ coordinated Claude Code subagents with hierarchical oversight.

## Technology Stack
- **Agents**: 49 specialized agents
- **Orchestration**: Team skills with gate checkpoints
- **Version Control**: Git trunk-based development

## Project Structure
@.claude/docs/directory-structure.md

## Agent Hierarchy
@.claude/docs/agent-roster.md

## Coordination Rules
@.claude/docs/coordination-rules.md

## Collaboration Protocol
**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol.

> **First session?** Run `/start` to begin the guided onboarding flow.

## Coding Standards
@.claude/docs/coding-standards.md

## Context Management
@.claude/docs/context-management.md

## Gate System
@.claude/docs/director-gates.md
```

---

*本教程基于 Claude-Code-Game-Studios 项目分析生成*
*版本：e375f | 生成日期：2026-05-25*
