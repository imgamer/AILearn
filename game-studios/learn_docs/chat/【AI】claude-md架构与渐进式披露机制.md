# CLAUDE.md 架构深度解析：渐进式披露与上下文管理

> **文档类型**：学习笔记与技术解析  
> **创建日期**：2025年  
> **主题**：Claude Code 项目配置系统、渐进式披露机制、Markdown 标记最佳实践  
> **相关文件**：`g:\repository\claude\Game-Studio-Analise\CLAUDE.md`

---

## 一、CLAUDE.md 的本质与作用

### 1.1 核心定位

CLAUDE.md 是 Claude Code 项目中的**入口协议文件**，它的作用类似于：

| 类比 | 说明 |
|------|------|
| 操作系统内核 | 管理资源、调度任务、提供基础服务 |
| API 文档首页 | 快速了解项目的技术栈和协作规范 |
| 团队手册 | 定义人与 AI、AI 与 AI 之间的协作规则 |

### 1.2 文件作用说明

这是一个 **Claude Code 游戏工作室代理架构配置文件**，用于指导 AI 代理系统如何协调 48 个子代理来管理独立游戏开发项目。它的主要作用包括：

1. **定义技术栈**：指定游戏引擎、编程语言、版本控制等
2. **建立协作规则**：规定代理之间的协调方式和职责分离
3. **设定工作流程**：定义用户驱动的协作协议，确保每个操作都需要用户确认
4. **规范编码标准**：统一代码风格和质量要求
5. **管理上下文**：优化信息处理和记忆管理

### 1.3 技术栈占位符机制

```markdown
## Technology Stack

- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5]
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint]
- **Build System**: [SPECIFY after choosing engine]
- **Asset Pipeline**: [SPECIFY after choosing engine]
```

**关键洞察**：`[CHOOSE: ...]` 占位符的本质是**纯文本标记**，没有特殊语法。它能被 Skill 识别和替换的原因是：

1. **Skill 读取文件内容**（纯文本匹配）
2. **Skill 使用正则表达式或字符串匹配查找模式**
3. **Skill 执行文本替换**
4. **Skill 写回修改后的内容**

### 1.4 Engine 选择后的配置更新

当用户执行 `/setup-engine unreal 5.7` 时，`setup-engine` Skill 会：

1. 读取 `CLAUDE.md` 内容
2. 找到 `[CHOOSE: ...]` 占位符
3. 替换为具体值：

```markdown
- **Engine**: Unreal Engine 5.7
- **Language**: C++ (primary), Blueprint (gameplay prototyping)
- **Build System**: Unreal Build Tool (UBT)
- **Asset Pipeline**: Unreal Content Pipeline
```

4. 创建引擎参考文档（`docs/engine-reference/unreal/VERSION.md`）
5. 更新代理配置中的版本感知部分

---

## 二、渐进式披露机制详解

### 2.1 什么是渐进式披露？

渐进式披露（Progressive Disclosure）是一种设计原则：**只在需要时显示必要的信息**，避免一次性展示所有内容造成认知负担。

### 2.2 分层架构

```
┌─────────────────────────────────────────┐
│  Layer 0: CLAUDE.md (入口协议)           │
│  - 项目概述、技术栈占位符、协作规则        │
│  - 约 500-1000 tokens                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 1: 配置文档 (.claude/docs/)       │
│  - directory-structure.md                │
│  - technical-preferences.md             │
│  - coordination-rules.md                │
│  - coding-standards.md                  │
│  - context-management.md                │
│  - 按需加载                              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 2: 代理定义 (.claude/agents/)     │
│  - 48个专业代理的配置                     │
│  - 按需实例化                            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 3: 技能实现 (.claude/skills/)     │
│  - 可复用的任务模板                       │
│  - 动态执行                              │
└─────────────────────────────────────────┘
```

### 2.3 @ 引用与惰性加载

`@` 符号的使用是实现渐进式披露的关键机制：

```markdown
## Project Structure

@.claude/docs/directory-structure.md

## Technical Preferences

@.claude/docs/technical-preferences.md
```

**工作原理**：

1. **Claude Code 启动时**：只读取 `CLAUDE.md` 内容（~500 tokens）
2. **扫描 @ 引用**：识别但不加载引用的文件
3. **需要时加载**：当用户询问或任务需要时才实际读取文件

### 2.4 渐进式披露的工作流程

#### 场景 1：项目启动

```
用户启动 Claude Code
    ↓
Claude Code 自动读取 CLAUDE.md
    ↓
加载 CLAUDE.md 内容到上下文（~500 tokens）
    ↓
扫描 @ 引用，但不加载它们
    ↓
等待用户指令

上下文状态：
┌─────────────────────────────────┐
│ CLAUDE.md (500 tokens)          │
│ ├── 技术栈占位符 [CHOOSE]         │
│ ├── @directory-structure.md     │ ← 路径已记录，未加载
│ ├── @technical-preferences.md   │ ← 路径已记录，未加载
│ └── @coordination-rules.md       │ ← 路径已记录，未加载
└─────────────────────────────────┘
```

#### 场景 2：询问目录结构

```
用户问："项目的目录结构是怎样的？"
    ↓
Claude 识别：需要 directory-structure.md
    ↓
读取 .claude/docs/directory-structure.md
    ↓
加载到上下文（~2K tokens）

上下文状态：
┌─────────────────────────────────┐
│ CLAUDE.md (500 tokens)          │
│ directory-structure.md (2K)     │ ← 新加载
│ [对话历史...]                    │
└─────────────────────────────────┘
总消耗：~2.5K tokens（很健康）
```

#### 场景 3：实施代码任务

```
用户说："写一个武器类"
Claude：
1. 加载：coding-standards.md（了解命名规范）
2. 加载：directory-structure.md（知道放哪里）
3. 生成代码
4. 保存到 src/gameplay/weapons/WeaponBase.h/cpp

上下文状态：
┌─────────────────────────────────┐
│ CLAUDE.md (500 tokens)          │
│ directory-structure.md (2K)     │
│ coding-standards.md (10K)       │ ← 新加载
│ [对话历史...]                    │
└─────────────────────────────────┘
总消耗：~12.5K tokens（正常范围）
```

### 2.5 上下文管理策略

| 策略 | 说明 |
|------|------|
| **文件即记忆** | 重要信息写入文件，不依赖对话历史 |
| **主动压缩** | 60% 使用率时主动 `/compact` |
| **惰性加载** | @引用 的文件只在需要时读取 |
| **状态文件** | `production/session-state/active.md` 记录当前状态 |

---

## 三、Markdown 标记在 AI 环境中的使用

### 3.1 @ 符号：文件引用

#### 使用场景

```markdown
## Project Structure

@.claude/docs/directory-structure.md

## Coordination Rules

@.claude/docs/coordination-rules.md
```

#### 为什么使用 @ 而不是标准链接？

| 语法 | 人类可读性 | AI 可解析性 | 惰性加载 |
|------|-----------|------------|---------|
| `@path/to/file` | ✅ 简洁 | ✅ 模式清晰 | ✅ 可实现 |
| `[文档](path/to/file.md)` | ✅ 可点击 | ⚠️ 需要解析 | ❌ 加载所有 |
| `path/to/file.md` | ⚠️ 不明确角色 | ❌ 无标记 | ❌ 无识别 |

#### 最佳实践

1. 用于引用外部文档（保持主文件简洁）
2. 用于引用配置文件（如 @引用 Agent 配置）
3. 用于引用模板（如 @引用代码模板）
4. 统一格式：`@相对路径` 或 `@绝对路径`

---

### 3.2 > 引用块：重要提示和警示

#### 使用场景

```markdown
> **警告**：删除此文件会导致数据丢失

> **注意**：引擎版本必须与构建模板匹配

> **首次使用？** 运行 `/start` 开始引导流程
```

#### 为什么使用 > 而不是普通文本？

| 特性 | `>` 引用块 | 普通文本 |
|------|-----------|---------|
| **视觉突出** | ✅ 自动缩进和边框 | ❌ 无区分 |
| **语义标记** | ✅ 表示"重要提示" | ❌ 普通段落 |
| **AI 识别** | ✅ 会特别关注 | ⚠️ 容易被忽略 |

#### 最佳实践

1. 用于警告和注意事项（`⚠️`、`❌`、`🚨`）
2. 用于首次使用引导（`> **New?**`）
3. 用于环境说明（`> **Linux only**`）
4. 用于临时状态（`> **TODO:**`）

#### 详细示例

```markdown
> **危险**：执行 `drop table` 前必须备份数据
> 此操作不可撤销

> **Note**: 需要 Node.js 18+ 版本
> 使用 `node --version` 检查当前版本

> **TODO**: 等待 API 文档更新后补充这部分
> **WIP**: 正在进行中，请勿合并
```

---

### 3.3 - 列表：结构化信息

#### 使用场景

```markdown
## 技术栈

- **Engine**: Godot 4
- **Language**: GDScript
- **Version Control**: Git
```

#### 为什么使用列表而不是段落？

| 特性 | `-` 列表 | 段落文本 |
|------|----------|---------|
| **可扫描性** | ✅ 快速浏览 | ❌ 需要阅读全文 |
| **键值对** | ✅ 自然表达 `键: 值` | ❌ 需要额外分隔符 |
| **AI 解析** | ✅ 结构化，容易提取 | ⚠️ 需要从段落中提取 |

#### 详细示例

```markdown
## 协作规则

- Agents MUST ask before writing files
- Agents MUST show drafts before approval
- Multi-file changes require explicit approval

## 技术栈

- **Engine**: Unreal Engine 5.7
- **Language**: C++ (primary), Blueprint (prototype)
- **Build System**: Unreal Build Tool
- **Target Platform**: PC, PS5, Xbox Series X|S

## 检查清单

- [ ] 完成核心系统设计
- [ ] 编写技术文档
- [ ] 实现原型
- [ ] 进行代码 Review
```

---

### 3.4 其他常用标记

#### ** 粗体：强调关键概念

```markdown
**User-driven collaboration**, not autonomous execution.

- **MUST**: 必须执行
- **SHOULD**: 强烈建议
- **MAY**: 可选
```

#### ` 代码：命令和路径

```markdown
使用 `/start` 开始引导流程
运行 `npm install` 安装依赖
配置文件位于 `config/settings.json`
```

#### ```代码块：多行代码和示例

````markdown
## 项目结构示例

```text
/
├── src/
│   ├── main.ts
│   └── utils/
├── tests/
└── docs/
```

## 代码模板

```typescript
interface Config {
  engine: string;
  version: string;
}
```
````

#### # 标题层级：内容结构

| 层级 | 用途 | 示例 |
|------|------|------|
| `# H1` | 文件标题 | `# MyGame Project` |
| `## H2` | 主要章节 | `## Technology Stack` |
| `### H3` | 子章节 | `### Build Configuration` |
| `#### H4` | 细节（慎用） | 避免过深嵌套 |

#### | 表格：结构化数据

```markdown
## 引擎对比

| 引擎 | 最佳场景 | 学习曲线 | 成本 |
|------|---------|---------|------|
| Godot 4 | 2D、小型3D | 温和 | 免费 |
| Unity | 移动、中型3D | 中等 | 免费+分成 |
| Unreal | AAA、影视级 | 陡峭 | 免费+5% |
```

#### --- 分隔线：内容分隔

```markdown
## 技术栈

- **Engine**: Godot 4

---

## 协作规则

- Agents MUST ask...
```

---

## 四、标记使用决策矩阵

| 场景 | 推荐标记 | 示例 |
|------|---------|------|
| **引用外部文档** | `@` | `@docs/guide.md` |
| **重要提示/警告** | `>` | `> **Warning**: ...` |
| **配置项（键值对）** | `-` + `**` | `- **Key**: Value` |
| **规则列表** | `-` | `- Must do X` |
| **待办检查清单** | `- [ ]` | `- [ ] Task 1` |
| **强调关键词** | `**` | `**critical**` |
| **命令和路径** | `` ` `` | `` `/start` `` |
| **多行代码** | `` ``` `` | `` ```js code ``` `` |
| **对比数据** | `\| 表格 \|` | `| A | B |` |
| **章节标题** | `#` | `## Section` |
| **主题分隔** | `---` | `---` |

---

## 五、编写 CLAUDE.md 的最佳实践

### 5.1 内容原则

| 原则 | 说明 |
|------|------|
| **简洁优先** | 控制在 500-1000 tokens（约 300-700 个汉字） |
| **分层披露** | 使用 @引用 指向详细文档 |
| **自描述** | 占位符本身说明可选值 `[CHOOSE: A / B / C]` |
| **可操作性** | 每条规则都能直接执行 |
| **一致性** | 使用统一的术语和格式 |

### 5.2 标准结构模板

```markdown
# [项目名称] -- [一句话描述]

[2-3句话描述项目目标、技术方向和核心理念]

## Technology Stack

- **引擎/框架**：[CHOOSE: 选项A / 选项B / 选项C]
- **编程语言**：[CHOOSE: 语言A / 语言B / 语言C]
- **版本控制**：Git with trunk-based development
- **构建系统**：[SPECIFY after choosing engine]
- **资产管线**：[SPECIFY after choosing engine]

## Project Structure

@.claude/docs/directory-structure.md

## Coordination Rules

@.claude/docs/coordination-rules.md

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

## Coding Standards

@.claude/docs/coding-standards.md

## Context Management

@.claude/docs/context-management.md

## First Steps

> **New project?** If the project has no engine configured and no game concept,
> run `/start` to begin the guided onboarding flow.

> **Existing project?** Run `/project-stage-detect` to assess current state.
```

### 5.3 避免的陷阱

| ❌ 错误做法 | ✅ 正确做法 |
|------------|------------|
| 把所有规则都写在 CLAUDE.md | 只放关键规则，细节用 @引用 |
| 使用模糊表述（"尽量"、"可能"） | 使用明确的 MUST/SHOULD/MAY |
| 超过 2000 tokens | 控制在 1000 tokens 以内 |
| 直接写文件路径而不是 @引用 | 使用 @路径 实现惰性加载 |
| 占位符只有 `[TODO]` | 使用自描述的 `[CHOOSE: A / B / C]` |

---

## 六、总结

### 6.1 核心概念

1. **CLAUDE.md 是入口协议**：定义项目基础配置和协作规则
2. **@ 引用实现渐进式披露**：只加载需要的文件，保持上下文精简
3. **Markdown 标记服务双重目的**：人类可读 + AI 可解析
4. **上下文窗口是稀缺资源**：需要主动管理，定期压缩

### 6.2 正确的工作流

```
启动 Claude Code
    ↓
读取 CLAUDE.md（必需）
    ↓
扫描 @ 引用（不加载）
    ↓
等待用户指令
    ↓
需要时加载相关文件
    ↓
完成任务后写入文件
    ↓
定期 /compact 释放上下文
```

### 6.3 关键要点

| 问题 | 答案 |
|------|------|
| `[CHOOSE: ...]` 如何起作用？ | 纯文本标记，被 Skill 通过文本替换更新 |
| 谁来修改文件？ | `setup-engine` Skill 读取、修改、写回 |
| @引用 如何工作？ | 惰性加载，只在需要时读取 |
| 渐进式披露？ | 只在需要时加载相关信息，通过 @引用 和 Skill 分层实现 |
| 最佳实践？ | CLAUDE.md 保持精简 (~500字)，详细信息通过 @引用 指向专门文档 |

---

## 七、延伸阅读

- [Agent 完整指南](../agents/README.md)
- [Skill 完整指南](../skills/README.md)
- [协作协议原理](../../docs/COLLABORATIVE-DESIGN-PRINCIPLE.md)
- [上下文管理策略](../../.claude/docs/context-management.md)
