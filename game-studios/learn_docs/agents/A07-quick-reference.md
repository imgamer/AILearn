# 智能体开发快速参考

> 一页纸速查，供日常开发参考

---

## 📁 智能体文件位置

```
.claude/agents/{agent-name}.md

示例：
.claude/agents/game-designer.md
.claude/agents/code-reviewer.md
```

**命名规范：**
- 文件名：`kebab-case`（小写，短横线连接）
- 扩展名：`.md`（Markdown 格式）
- 名称应该清晰反映角色

---

## 📝 最小智能体模板

```markdown
---
name: agent-name
description: "What this agent does in one sentence"
tools: Read, Write
model: sonnet
---

You are the [Role Name]. [Brief role description].

### Collaboration Protocol

**You are a [consultant/implementer/reviewer/etc.], not an autonomous [executor/creator/etc.].**
The user makes decisions; you provide [guidance/implementation/reviews/etc.].

#### [Workflow Name]

1. **Step 1**: Do something
2. **Step 2**: Do something else
3. **Step 3**: Complete the task

### Key Responsibilities

1. **Responsibility 1**: Description
2. **Responsibility 2**: Description

### Constraints & Limitations

- Must NOT do X
- Must ALWAYS do Y
- Never do Z

### Delegation Map

**Reports to**: `@parent-agent`
**Collaborates with**: `@peer-agent-1`, `@peer-agent-2`
**Escalates to**: `@escalation-agent`
```

---

## ⚙️ Frontmatter 字段速查

### 必需字段

| 字段 | 类型 | 示例 |
|------|------|------|
| `name` | string | `code-reviewer` |
| `description` | string | `"Performs code reviews..."` |
| `tools` | array | `Read, Write, Glob` |

### 常用可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | string | 默认 | `opus`/`sonnet`/`haiku` |
| `maxTurns` | number | 无限制 | 最大对话轮数 |
| `skills` | array | - | 可调用的 Skill |

### 模型选择速查

| 层级 | 角色 | 模型 | 原因 |
|------|------|------|------|
| Tier 1 | 领导层 | `opus` | 需要最强推理和创造力 |
| Tier 2 | 部门负责人 | `sonnet` | 平衡推理和效率 |
| Tier 3 | 专家层 | `sonnet`/`haiku` | 专注执行效率 |

---

## 🎭 协作协议模式速查

### 模式 1：顾问模式（Consultant）- Tier 1/2

```markdown
**You are a collaborative consultant, not an autonomous executor.**
The user makes all creative/strategic decisions; you provide expert guidance.

#### Question-First Workflow

1. **Ask clarifying questions**
2. **Present 2-4 options with reasoning**
3. **Draft based on user's choice**
4. **Get approval before writing**
```

### 模式 2：实现者模式（Implementer）- Tier 3

```markdown
**You are a collaborative implementer, not an autonomous code generator.**
The user approves all architectural decisions and file changes.

#### Implementation Workflow

1. **Read the design/spec**
2. **Ask architecture questions**
3. **Propose architecture**
4. **Implement with transparency**
5. **Get approval before writing files**
```

### 模式 3：协调者模式（Coordinator）- Producer

```markdown
**You are a project coordinator, not a task executor.**
Your role is to orchestrate other agents, track progress, and ensure alignment.

#### Coordination Workflow

1. **Understand the request**
2. **Identify required agents**
3. **Delegate tasks (parallel where possible)**
4. **Track progress**
5. **Integrate results**
6. **Report status**
```

### 模式 4：审查者模式（Reviewer）- QA/Lead

```markdown
**You are a quality reviewer, not a creator.**
Your role is to evaluate work against standards and identify issues.

#### Review Workflow

1. **Understand the standards**
2. **Review the work systematically**
3. **Identify issues (categorize by severity)**
4. **Provide specific, actionable feedback**
5. **Verify fixes**
```

---

## 🛠️ Task 工具速查

### 基本语法

```markdown
Use the Task tool to spawn {subagent} subagent:

Task: {task-description}
Subagent: {subagent-name}
Prompt: |
  {detailed-instructions}
  
  Context:
  - {context-item-1}
  - {context-item-2}
  
  Requirements:
  1. {requirement-1}
  2. {requirement-2}
  
  Deliverables:
  - {deliverable-1}
  - {deliverable-2}
```

### 并行委派

```markdown
Launch parallel tasks:

Task 1:
  Subagent: agent-a
  Prompt: ...

Task 2:
  Subagent: agent-b
  Prompt: ...

Task 3:
  Subagent: agent-c
  Prompt: ...

Wait for all completions, then integrate results.
```

### 串行委派（带依赖）

```markdown
Step 1: Task A (independent)
  Subagent: agent-a
  Prompt: ...

Result A: [capture output]

Step 2: Task B (depends on A)
  Subagent: agent-b
  Prompt: |
    ...
    Use this from Task A: {Result A}
    ...

Result B: [capture output]

Step 3: Task C (depends on B)
  ...
```

---

## ✅ 快速检查清单

### 创建智能体前

- [ ] 明确了智能体的角色和职责
- [ ] 确定了智能体类型（Tier 1/2/3）
- [ ] 选择了合适的协作协议模式
- [ ] 确定了父级智能体（reports to）

### 编写智能体定义时

- [ ] 文件名使用 `kebab-case`
- [ ] 文件位于 `.claude/agents/{name}.md`
- [ ] Frontmatter 包含必需的字段（name, description, tools）
- [ ] 选择了合适的模型（Tier 1=opus, Tier 2/3=sonnet/haiku）
- [ ] 角色定义清晰明确
- [ ] 协作协议完整（工作流程、思维模式）
- [ ] 关键职责具体可执行
- [ ] 约束和限制明确
- [ ] 委派关系完整（reports to, collaborates with, escalates to）

### 测试智能体时

- [ ] 文件可以被 Claude Code 识别
- [ ] `@agent-name` 可以正常激活
- [ ] 简单任务测试通过
- [ ] 复杂任务测试通过
- [ ] 边界情况处理正确

---

## 📚 参考资源

- [项目中的 Game Designer 智能体](../.claude/agents/game-designer.md) - 完整 Tier 2 示例
- [项目中的 Producer 智能体](../.claude/agents/producer.md) - 协调者模式示例
- [YAML 语法速查](https://quickref.me/yaml)
- [Markdown 语法指南](https://www.markdownguide.org/)

---

**保存这个页面，随时查阅！** 📌
