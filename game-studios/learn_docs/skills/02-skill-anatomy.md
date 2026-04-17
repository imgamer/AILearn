# 第二课：Skill 文件结构解剖

> ⏱️ 预计学习时间：45分钟  
> 🎯 目标：深入理解 Skill 文件的每个部分，掌握编写规范

---

## 📁 Skill 文件位置

在 Claude Code Game Studios 项目中，所有 Skill 都位于：

```
.claude/skills/
├── prototype/
│   └── SKILL.md          ← Skill 定义文件
├── code-review/
│   └── SKILL.md
├── sprint-plan/
│   └── SKILL.md
└── ... (37个 Skill 目录)
```

**命名规范：**
- 目录名：使用 kebab-case（短横线连接的小写字母）
- 文件名：必须是 `SKILL.md`
- 路径格式：`.claude/skills/{skill-name}/SKILL.md`

---

## 🏗️ Skill 文件结构总览

一个完整的 Skill 文件包含以下部分：

```markdown
---
[Frontmatter YAML - 元数据配置]
---

[When 块 - 触发条件与执行逻辑]

[详细步骤说明]

[约束与规范]
```

让我们逐一解剖每个部分。

---

## 第一部分：Frontmatter（YAML 元数据）

Frontmatter 位于文件开头，用 `---` 包裹，包含 Skill 的配置信息。

### 完整示例

```yaml
---
name: prototype                                    # 技能名称（必需）
description: "Rapid prototyping workflow..."    # 描述（必需）
argument-hint: "[concept-description]"            # 参数提示（可选）
user-invocable: true                              # 用户是否可调用（可选，默认 true）
allowed-tools: [Read, Glob, Grep, Write, Edit]    # 允许使用的工具（可选）
model: sonnet                                     # 使用的模型（可选）
maxTurns: 20                                      # 最大对话轮数（可选）
disallowedTools: [Bash]                           # 禁止使用的工具（可选）
skills: [design-review, balance-check]            # 可调用的其他技能（可选）
context: |                                        # 额外上下文（可选）
  !ls production/sprints/ 2>/dev/null
---
```

### 字段详解

#### 必需字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `name` | string | Skill 的唯一标识符 | `prototype` |
| `description` | string | 简短描述 Skill 的功能 | `"Rapid prototyping workflow..."` |

#### 可选字段

**调用相关**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `user-invocable` | boolean | `true` | 用户是否可通过 `/` 调用 |
| `argument-hint` | string | - | 参数提示，显示在 `/` 补全中 |

**工具相关**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `allowed-tools` | array | 全部 | 允许使用的工具列表 |
| `disallowedTools` | array | - | 禁止使用的工具列表 |

**模型相关**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | string | 默认 | 使用的 Claude 模型 |
| `maxTurns` | number | - | 最大对话轮数限制 |

**高级**

| 字段 | 类型 | 说明 |
|------|------|------|
| `skills` | array | 可调用的其他 Skill |
| `context` | string | 额外的上下文信息 |

---

## 第二部分：When 块（执行逻辑）

When 块定义了 Skill 被触发时应该做什么。这是 Skill 的核心逻辑部分。

### 基本结构

```markdown
When this skill is invoked:

1. **[步骤名称]**
   [具体的执行指令]

2. **[步骤名称]**
   [具体的执行指令]
   
   [子步骤或条件]
   - 如果是 X：做 Y
   - 如果是 Z：做 W

3. **[步骤名称]**
   [执行指令]
```

### 完整示例：/prototype Skill

```markdown
When this skill is invoked:

1. **Read the concept description** from the argument. Identify the core
   question this prototype must answer. If the concept is vague, state the
   question explicitly before proceeding.

2. **Read CLAUDE.md** for project context and the current tech stack. Understand
   what engine, language, and frameworks are in use so the prototype is built
   with compatible tooling.

3. **Create a prototype plan**: Define in 3-5 bullet points what the minimum
   viable prototype looks like. What is the core question? What is the absolute
   minimum code needed to answer it? What can be skipped?

4. **Create the prototype directory**: `prototypes/[concept-name]/` where
   `[concept-name]` is a short, kebab-case identifier derived from the concept.

5. **Implement the prototype** in the isolated directory. Every file must begin
   with:
   ```
   // PROTOTYPE - NOT FOR PRODUCTION
   // Question: [Core question being tested]
   // Date: [Current date]
   ```
   Standards are intentionally relaxed:
   - Hardcode values freely
   - Use placeholder assets
   - Skip error handling
   - Use the simplest approach that works
   - Copy code rather than importing from production

6. **Test the concept**: Run the prototype. Observe behavior. Collect any
   measurable data (frame times, interaction counts, feel assessments).

7. **Generate the Prototype Report** and save it to
   `prototypes/[concept-name]/REPORT.md`:

[报告模板...]

8. **Output a summary** to the user with: the core question, the result, and
   the recommendation. Link to the full report at
   `prototypes/[concept-name]/REPORT.md`.
```

---

## 第三部分：约束与规范（Constraints）

在 When 块的末尾，通常包含约束条件和重要规范。

### 示例：/prototype 的约束

```markdown
### Important Constraints

- Prototype code must NEVER import from production source files
- Production code must NEVER import from prototype directories
- If the recommendation is PROCEED, the production implementation must be
  written from scratch -- prototype code is not refactored into production
- Total prototype effort should be timeboxed to 1-3 days equivalent of work
- If the prototype scope starts growing, stop and reassess whether the
  question can be simplified
```

---

## 📝 完整 Skill 文件示例

```markdown
---
name: code-review
description: "Performs an architectural and quality code review on a specified file or set of files."
argument-hint: "[path-to-file-or-directory]"
user-invocable: true
allowed-tools: [Read, Glob, Grep, Bash]
---

When this skill is invoked:

1. **Read the target file(s)** in full.

2. **Read the CLAUDE.md** for project coding standards.

3. **Identify the system category** and apply category-specific standards.

4. **Evaluate against coding standards**:
   - [ ] Public methods have doc comments
   - [ ] Cyclomatic complexity under 10
   - [ ] No method exceeds 40 lines
   - [ ] ...

5. **Check architectural compliance**:
   - [ ] Correct dependency direction
   - [ ] No circular dependencies
   - [ ] ...

6. **Output the review** in this format:
   ```
   ## Code Review: [File Name]
   
   ### Standards Compliance: [X/6 passing]
   ...
   ```

### Important Constraints

- Focus on architectural issues, not style preferences
- Always provide constructive suggestions, not just criticism
- Flag security concerns immediately
- Highlight positive observations, not just problems
```

---

## ✅ 本课小结

### 核心知识点

1. **文件位置**：`.claude/skills/{skill-name}/SKILL.md`
2. **三个主要部分**：
   - Frontmatter（YAML 元数据）
   - When 块（执行逻辑）
   - 约束（重要规范）
3. **关键字段**：`name`, `description`, `user-invocable`, `allowed-tools`
4. **执行步骤**：编号列表，清晰的指令，条件分支

### 常见错误

| 错误 | 正确做法 |
|------|----------|
| 文件名不是 `SKILL.md` | 必须严格使用 `SKILL.md` |
| 缺少 Frontmatter 分隔符 `---` | 开头和结尾都要有 `---` |
| 步骤描述模糊 | 使用具体、可执行的指令 |
| 没有约束部分 | 重要的限制和警告要明确写出 |

### 自我检测

在继续下一课之前，确认你能：
- [ ] 说出 Skill 文件的三个主要部分
- [ ] 解释 `user-invocable: true` 的作用
- [ ] 写出一个基本的 Frontmatter
- [ ] 描述 When 块的基本结构

### 下一步

➡️ **[第三课：Skill 类型详解 →](./03-skill-types.md)**

深入学习四种 Skill 类型的特点和适用场景，学会为不同任务选择合适的 Skill 类型。

---

## 📚 参考资源

- [完整 Skill 示例：/prototype](../.claude/skills/prototype/SKILL.md)
- [完整 Skill 示例：/code-review](../.claude/skills/code-review/SKILL.md)
- [完整 Skill 示例：/sprint-plan](../.claude/skills/sprint-plan/SKILL.md)
- [YAML 语法参考](https://yaml.org/spec/)
