# 快速参考手册

> 一页纸速查，供日常开发参考

---

## 📁 Skill 文件结构

```
.claude/skills/{skill-name}/
└── SKILL.md
```

**命名规范：**
- 目录名：`kebab-case`（小写，短横线连接）
- 文件名：必须是 `SKILL.md`（大写）

---

## 📝 最小 Skill 模板

```markdown
---
name: my-skill
description: "What this skill does in one sentence"
user-invocable: true
allowed-tools: [Read, Write]
---

When this skill is invoked:

1. **Step one**
   Do something here.

2. **Step two**
   Do something else here.

3. **Output result**
   Provide the final output to user.
```

---

## ⚙️ Frontmatter 字段速查

### 必需字段

| 字段 | 类型 | 示例 |
|------|------|------|
| `name` | string | `my-skill` |
| `description` | string | `"Does something useful"` |

### 常用可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `user-invocable` | boolean | `true` | 用户能否用 `/` 调用 |
| `argument-hint` | string | - | 参数提示，如 `"[file-path]"` |
| `allowed-tools` | array | 全部 | 允许的工具列表 |
| `model` | string | 默认 | 使用的 Claude 模型 |
| `maxTurns` | number | 无限制 | 最大对话轮数 |
| `skills` | array | - | 可调用的其他 Skill |

### 完整示例

```yaml
---
name: my-skill
description: "Does something useful"
argument-hint: "[required-arg] [optional-arg]"
user-invocable: true
allowed-tools: [Read, Write, Glob, Grep, Bash]
model: sonnet
maxTurns: 30
skills: [other-skill, another-skill]
---
```

---

## 🛠️ 工具权限

### 可用工具列表

| 工具 | 用途 | 示例 |
|------|------|------|
| `Read` | 读取文件 | `Read file_path: "/path/to/file"` |
| `Write` | 写入文件 | `Write file_path: "/path/to/file"` |
| `Edit` | 编辑文件 | `Edit file_path: "/path/to/file"` |
| `Glob` | 文件匹配 | `Glob pattern: "**/*.py"` |
| `Grep` | 文本搜索 | `Grep pattern: "function_name"` |
| `Bash` | 执行命令 | `Bash command: "git status"` |
| `Task` | 创建任务 | `Task description: "Do something"` |
| `AskUserQuestion` | 询问用户 | `AskUserQuestion question: "Choose:"` |
| `TodoWrite` | 管理待办 | `TodoWrite todos: [...]` |

### 如何选择工具

**最小权限原则：** 只申请实际需要的工具

| 如果你的 Skill 需要... | 申请这些工具 |
|------------------------|-------------|
| 只读取文件 | `Read` |
| 读取和写入文件 | `Read, Write` |
| 查找文件 | `Read, Glob` |
| 搜索代码 | `Read, Glob, Grep` |
| 修改现有文件 | `Read, Edit` |
| 执行命令 | `Read, Bash` |
| 创建子任务 | `Read, Task` |
| 与用户交互 | `Read, AskUserQuestion` |

---

## 🔄 When 块结构速查

### 基本结构

```markdown
When this skill is invoked:

1. **Step name**
   Detailed instructions here.
   Can span multiple lines.

2. **Next step**
   More instructions.
   
   With sub-items:
   - Do this
   - Then do that

3. **Final step**
   Complete the task.
```

### 条件分支

```markdown
3. **Handle different cases**
   Check the input value:
   - If value is "A":
     - Do action for A
     - Then do secondary action
   - If value is "B":
     - Do action for B
   - Otherwise:
     - Report error and exit
```

### 循环处理

```markdown
4. **Process each item**
   For each file in the list:
   - Read the file
   - Extract needed information
   - Add to results collection
   - Report progress: "Processed X/Y files"
```

### 检查清单

```markdown
5. **Validate output**
   Verify the result:
   - [ ] All required fields present
   - [ ] Data format is correct
   - [ ] No syntax errors
   - [ ] Follows naming conventions
```

---

## ✅ 约束部分模板

```markdown
### Important Constraints

- [约束1：绝对禁止的行为]
- [约束2：必须遵循的规则]
- [约束3：性能或质量要求]
- [约束4：安全或安全考虑]
```

### 常见约束示例

**代码生成类 Skill：**
```markdown
### Important Constraints

- Never generate code with hardcoded secrets or credentials
- Always include appropriate error handling
- Follow the project's established naming conventions
- Include XML/docstring comments for all public APIs
- Generated code must pass the project's linting rules
```

**文档生成类 Skill：**
```markdown
### Important Constraints

- Never overwrite existing documents without backup
- Use templates when available
- Include version and date in generated documents
- Follow the project's documentation style guide
```

**数据处理类 Skill：**
```markdown
### Important Constraints

- Never modify source data files directly
- Always validate input data format
- Handle encoding issues gracefully
- Log all errors with sufficient context
- Ensure output is deterministic
```

---

## 🎨 完整示例：/hello-world Skill

```markdown
---
name: hello-world
description: "A simple example Skill that greets the user and creates a sample file"
argument-hint: "[name]"
user-invocable: true
allowed-tools: [Read, Write, AskUserQuestion]
---

When this skill is invoked:

1. **Parse the name argument**
   - If name is provided: Use it
   - If not provided: Ask "What's your name?"

2. **Create a greeting message**
   - Format: "Hello, [Name]! Welcome to Claude Code Skills!"

3. **Create a sample file**
   - File path: `greetings/hello-[name].md`
   - Content:
     ```markdown
     # Greeting for [Name]
     
     Generated on: [Date]
     Message: [Greeting message]
     
     ---
     
     This file was created by the `/hello-world` Skill.
     ```

4. **Output to user**
   - Show the greeting message
   - Report file creation: "Created: greetings/hello-[name].md"
   - Offer next steps:
     - "Run again with different name?"
     - "Try `/help` to see all Skills"

### Important Constraints

- Never overwrite existing greeting files without user confirmation
- Sanitize the name input (remove special characters for filename)
- Keep file paths within the project directory
- Include timestamp in generated files for uniqueness
```

---

## ✅ 快速检查清单

在提交你的 Skill 之前，检查以下项目：

### 文件和位置
- [ ] 文件名为 `SKILL.md`（大写）
- [ ] 位于 `.claude/skills/{skill-name}/` 目录
- [ ] 目录名使用 `kebab-case`

### Frontmatter
- [ ] 包含 `name` 字段
- [ ] 包含 `description` 字段
- [ ] 如果用户可调用，设置 `user-invocable: true`
- [ ] 申请了必要的 `allowed-tools`
- [ ] YAML 语法正确（使用在线验证工具检查）

### When 块
- [ ] 以 "When this skill is invoked:" 开头
- [ ] 步骤编号清晰（1, 2, 3...）
- [ ] 每个步骤有明确的名称（粗体）
- [ ] 指令具体、可执行
- [ ] 处理了主要的分支情况（if/else）

### 约束部分
- [ ] 包含 "Important Constraints" 部分
- [ ] 至少列出了 3-5 条关键约束
- [ ] 约束涵盖了安全、质量、使用限制等方面

### 测试
- [ ] 文件可以被 Claude Code 识别
- [ ] `/skill-name` 可以正常触发
- [ ] 主要功能路径测试通过
- [ ] 边界情况处理正确

---

## 📖 下一步

- **[创建第一个 Skill →](./04-your-first-skill.md)** - 实践教程
- **[Skill 工作坊 →](./05-skill-workshop.md)** - 进阶设计模式
- **[最佳实践 →](./08-best-practices.md)** - 专家级技巧

---

## 🔗 快速参考卡片

### YAML 特殊字符转义

| 字符 | 转义方式 | 示例 |
|------|----------|------|
| `"` | `\"` | `"Say \"Hello\""` |
| `'` | `''` | `'It''s working'` |
| `:` | 引号包裹 | `"key: value"` |
| `[` `]` | 引号包裹 | `"[optional]"` |
| 多行字符串 | `|` 或 `>` | 见下方 |

**多行字符串：**
```yaml
description: |
  This is a multi-line
  description that preserves
  line breaks.

context: >
  This is a long single line
  that will be wrapped but
  treated as one paragraph.
```

### 常用 Markdown 语法

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
`行内代码`

- 无序列表项
- 另一个项
  - 嵌套项

1. 有序列表
2. 第二项

[链接文本](URL)

> 引用文本

| 表格 | 表头 |
|------|------|
| 数据 | 数据 |

```语言
代码块
```

---

水平分隔线
```

---

**保存这个页面，随时查阅！** 📌
