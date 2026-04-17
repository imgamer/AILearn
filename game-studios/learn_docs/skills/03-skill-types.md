# 第三课：Skill 类型详解

> ⏱️ 预计学习时间：40分钟  
> 🎯 目标：理解四种 Skill 类型的特点，学会为不同场景选择合适的类型

---

## 🎭 四种 Skill 类型概览

根据功能和复杂度，Skill 分为四种类型：

```
┌─────────────────────────────────────────────────────────────┐
│                    SKILL 类型谱系                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  简单 ────────────────────────────────────────────> 复杂     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Type 1     │───>│  Type 2     │───>│  Type 3     │   │
│  │  单一任务    │    │  工作流      │    │  团队编排    │   │
│  └─────────────┘    └─────────────┘    └──────┬──────┘   │
│                                               │           │
│                                               v           │
│                                        ┌─────────────┐   │
│                                        │  Type 4     │   │
│                                        │  元 Skill   │   │
│                                        └─────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Type 1: 单一任务 Skill（Single-Task Skill）

### 定义
完成一个明确、原子性任务的 Skill。通常只涉及一个步骤或一个简单的操作序列。

### 特点
- ✅ 任务边界清晰，输入输出明确
- ✅ 执行路径单一，没有复杂分支
- ✅ 执行时间短，通常几秒钟到几分钟
- ✅ 不依赖外部状态或复杂上下文

### 适用场景

| 场景 | 示例 |
|------|------|
| 生成简单文档 | `/changelog` - 从 git 历史生成变更日志 |
| 执行一次性检查 | `/balance-check` - 分析平衡数据 |
| 格式化或转换 | `/localize` - 提取可翻译字符串 |
| 信息聚合 | `/project-stage-detect` - 检测项目阶段 |

### 真实示例：`/changelog`

```markdown
---
name: changelog
description: "Auto-generate changelog from git commits and sprint data"
argument-hint: "[version-number]"
user-invocable: true
allowed-tools: [Read, Bash]
---

When this skill is invoked:

1. **Read the version number** from the argument. If not provided, infer from
   `production/milestones/current.md` or use `git describe`.

2. **Collect commit history** since the last tag:
   ```bash
   git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h %s (%an)" --no-merges
   ```

3. **Categorize commits** into:
   - Features (feat:)
   - Bug Fixes (fix:)
   - Performance (perf:)
   - Refactoring (refactor:)
   - Documentation (docs:)
   - Other

4. **Generate the changelog** in this format:
   ```markdown
   # Changelog

   ## [Version] - [Date]

   ### Features
   - [Description] ([Commit Hash] by [Author])

   ### Bug Fixes
   - [Description] ([Commit Hash] by [Author])

   ### Performance
   - [Description] ([Commit Hash] by [Author])
   
   [其他分类...]
   ```

5. **Write to file**: Save to `docs/changelogs/CHANGELOG-[version].md`.

6. **Output summary**: Report number of commits categorized and file path.

### Important Constraints

- Never include merge commits in the changelog
- Skip commits with message "wip", "temp", or starting with "[skip-ci]"
- If a commit doesn't follow conventional commits format, categorize based on keywords or put in "Other"
- Always link commit hashes to the repository (if remote URL is available)
```

### 为什么这是 Type 1？

| 特征 | `/changelog` 的表现 |
|------|-------------------|
| 任务边界 | 明确：从 git 历史生成变更日志 |
| 执行路径 | 线性：收集→分类→格式化→输出 |
| 执行时间 | 几秒到几十秒 |
| 外部依赖 | 仅依赖 git 历史，无复杂状态 |

---

## Type 2: 工作流 Skill（Workflow Skill）

### 定义
封装多步骤标准化流程的 Skill，通常涉及条件判断、循环、或者需要维护状态。

### 特点
- ✅ 包含多个明确的步骤或阶段
- ✅ 可能有条件分支（if/then/else）
- ✅ 步骤之间可能有依赖关系
- ✅ 执行时间较长，可能需要几分钟到几小时
- ✅ 通常生成或修改多个文件

### 适用场景

| 场景 | 示例 |
|------|------|
| 复杂设计流程 | `/prototype` - 原型开发完整流程 |
| 规划类任务 | `/sprint-plan` - 冲刺计划制定 |
| 审查流程 | `/code-review` - 代码审查 |
| 文档生成 | `/architecture-decision` - 创建 ADR |

### 真实示例：`/prototype`（已在前文展示完整代码）

**为什么这是 Type 2？**

| 特征 | `/prototype` 的表现 |
|------|-------------------|
| 步骤数量 | 8个明确步骤，从读取到报告 |
| 条件分支 | 如果推荐是 PROCEED，则... |
| 文件操作 | 创建目录、写入多个文件 |
| 执行时间 | 1-3天工作量（分多次会话） |
| 状态维护 | 需要跟踪原型状态、测试结果 |

---

## Type 3: 团队编排 Skill（Team Orchestration Skill）

### 定义
协调多个智能体（subagent）协作完成复杂任务的 Skill，通常涉及并行执行、结果整合、阶段检查点。

### 特点
- ✅ 协调多个不同的智能体角色
- ✅ 智能体可以并行执行（独立的任务）
- ✅ 需要整合多个智能体的输出
- ✅ 有明确的阶段和检查点
- ✅ 用户决策点是关键（批准/选择/拒绝）

### 适用场景

| 场景 | 示例 |
|------|------|
| 复杂功能开发 | `/team-combat` - 战斗系统团队 |
| 跨部门协作 | `/team-ui` - UI 开发团队 |
| 端到端流程 | `/team-release` - 发布团队 |

### 真实示例：`/team-combat`（已在前文展示完整代码）

**为什么这是 Type 3？**

| 特征 | `/team-combat` 的表现 |
|------|---------------------|
| 智能体数量 | 6个不同角色 |
| 并行执行 | 第3阶段的4个智能体并行 |
| 阶段检查点 | 6个阶段，每个都有用户决策点 |
| 输出整合 | 整合设计+代码+测试+美术+音效 |
| 执行时间 | 可能跨越多个会话，数天 |

---

## Type 4: 元 Skill（Meta Skill）

### 定义
关于 Skill 本身的 Skill，用于创建、管理、分析或优化其他 Skill。

### 特点
- ✅ 操作对象是 Skill 定义本身
- ✅ 可能需要读取/写入 `.claude/skills/` 目录
- ✅ 可能涉及分析多个 Skill 的模式和关系

### 适用场景

| 场景 | 示例 |
|------|------|
| 创建新 Skill | `/skill-create` - 引导式 Skill 创建 |
| 分析 Skill 覆盖 | `/skill-analyze` - 分析现有 Skill 缺口 |
| 优化现有 Skill | `/skill-optimize` - 改进 Skill 性能 |

### 示例：`/skill-create`（概念性）

```markdown
---
name: skill-create
description: "Guide the creation of a new Skill with best practices"
user-invocable: true
allowed-tools: [Read, Write, Glob]
---

When this skill is invoked:

1. **Ask for Skill purpose**
   - What problem does this Skill solve?
   - Who will use it and when?
   - What should the output look like?

2. **Determine Skill type**
   Based on the answers, recommend:
   - Type 1 (Single-Task): Simple, atomic operation
   - Type 2 (Workflow): Multi-step process
   - Type 3 (Orchestration): Multi-agent coordination
   - Type 4 (Meta): About Skills themselves

3. **Collect Skill metadata**
   - name (kebab-case)
   - description (one sentence)
   - argument-hint (if takes arguments)
   - allowed-tools (what tools it needs)

4. **Draft the Skill structure**
   Create the basic SKILL.md structure:
   - Frontmatter with metadata
   - When block with steps
   - Constraints section

5. **Write to file**
   Save to `.claude/skills/{name}/SKILL.md`

6. **Output summary**
   - Skill created at: [path]
   - Type: [Type X]
   - Next steps: Test it with `/[name]`
```

---

## 📊 Skill 类型选择决策树

```
                    Start
                      |
                      v
            +---------------------+
            | 任务是关于 Skill    |
            | 本身的操作吗？      |
            +---------------------+
                 |           |
            YES  |           |  NO
                 v           v
            +--------+  +---------------------+
            | Type 4 |  | 需要多个智能体      |
            | 元Skill |  | 协作完成吗？        |
            +--------+  +---------------------+
                             |           |
                        YES  |           |  NO
                             v           v
                        +--------+  +---------------------+
                        | Type 3 |  | 包含多个步骤或      |
                        | 团队   |  | 条件判断吗？        |
                        | 编排   |  +---------------------+
                        +--------+         |           |
                                    YES  |           |  NO
                                         v           v
                                    +--------+  +--------+
                                    | Type 2 |  | Type 1 |
                                    | 工作流 |  | 单任务 |
                                    +--------+  +--------+
```

---

## ✅ 本课小结

### 核心知识点

1. **四种 Skill 类型**：
   - **Type 1 - 单一任务**：原子操作，快速执行
   - **Type 2 - 工作流**：多步骤流程，可能含条件分支
   - **Type 3 - 团队编排**：多智能体协作，有阶段检查点
   - **Type 4 - 元 Skill**：关于 Skill 本身的操作

2. **类型选择的关键问题**：
   - 是否涉及 Skill 本身？→ Type 4
   - 是否需要多智能体？→ Type 3
   - 是否有多步骤/条件？→ Type 2
   - 否则 → Type 1

3. **Skill 文件的核心结构**：
   - Frontmatter（YAML 元数据）
   - When 块（执行逻辑）
   - 约束与规范

### 关键技能

完成本课后，你应该能够：
- [ ] 识别给定的 Skill 属于哪种类型
- [ ] 为新任务选择合适的 Skill 类型
- [ ] 解释不同类型 Skill 的适用场景
- [ ] 列出 Skill 文件的主要组成部分

### 常见误区

❌ **误区 1**：所有复杂任务都应该用 Type 3（团队编排）  
✅ **正解**：只有当任务真正需要多个不同角色的智能体协作时才用 Type 3。单个智能体可以完成的复杂任务用 Type 2（工作流）。

❌ **误区 2**：Type 1 只能是非常简单的任务  
✅ **正解**：Type 1 可以是逻辑复杂的任务，只要它是原子的（一步完成）、没有条件分支、不需要维护状态。

❌ **误区 3**：一个 Skill 只能做一种类型的事情  
✅ **正解**：一个 Skill 可以在执行过程中调用其他 Skill，甚至不同类型的 Skill。例如，一个 Type 2 的 Skill 可以在某个步骤调用 Type 1 的 Skill。

---

## 🎯 实践练习

### 练习 1：类型识别

阅读以下 Skill 描述，判断它应该是什么类型：

1. **需求**："检查代码文件的复杂度，报告圈复杂度和行数"  
   **你的答案**：_____  
   **理由**：_____

2. **需求**："引导一个新成员完成项目入职，包括阅读文档、配置环境、运行第一个测试"  
   **你的答案**：_____  
   **理由**：_____

3. **需求**："协调设计师、程序员、美术、音效共同完成一个新的玩家技能，从设计到实现到测试"  
   **你的答案**：_____  
   **理由**：_____

4. **需求**："分析现有的 Skill 集合，找出覆盖缺口，建议需要创建的新 Skill"  
   **你的答案**：_____  
   **理由**：_____

<details>
<summary>查看答案</summary>

1. **Type 1（单一任务）** - 原子操作：读取文件→计算指标→输出报告，单一步骤完成。

2. **Type 2（工作流）** - 多步骤流程：有明确的步骤序列（阅读→配置→运行），可能含条件判断。

3. **Type 3（团队编排）** - 多智能体协作：需要设计师、程序员、美术、音效多个角色协同，有阶段检查点。

4. **Type 4（元 Skill）** - 关于 Skill 本身：分析 Skill 集合、找缺口，操作对象是 Skill 定义。

</details>

### 练习 2：设计你自己的 Skill

**场景**：你正在管理一个开源项目，经常需要感谢新贡献者。

**任务**：设计一个 Skill，自动：
1. 检测新贡献者（第一次提交 PR 的人）
2. 生成个性化的欢迎消息
3. 在 PR 中发布感谢评论

**问题**：
1. 这个 Skill 应该是什么类型？为什么？
2. 列出 Frontmatter 中应该包含的关键字段
3. 描述 When 块的主要步骤（3-5步）
4. 应该包含哪些约束或注意事项？

---

## 📖 下一步

➡️ **[第四课：创建你的第一个 Skill →](./04-your-first-skill.md)**

通过动手实践，创建一个真正可用的 Skill，从构思到实现到测试的完整流程。

---

## 📚 参考资源

- [项目中的 Type 1 示例：/balance-check](../.claude/skills/balance-check/SKILL.md)
- [项目中的 Type 2 示例：/prototype](../.claude/skills/prototype/SKILL.md)
- [项目中的 Type 3 示例：/team-combat](../.claude/skills/team-combat/SKILL.md)
- [YAML 完整规范](https://yaml.org/spec/1.2.2/)
