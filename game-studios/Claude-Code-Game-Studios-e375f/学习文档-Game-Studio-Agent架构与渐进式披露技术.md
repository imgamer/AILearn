# Claude Code Game Studios — Agent编排与渐进式披露技术学习文档

## 文档概述

本学习文档系统分析 [Claude-Code-Game-Studios](https://github.com/claude-code/Claude-Code-Game-Studios) 项目中的agent编排架构和渐进式披露技术。该项目展示了如何通过49个协调的Claude Code子agent管理独立游戏开发，实现关注点分离和质量保证。

**核心价值**：本项目采用"用户驱动协作"而非"自主执行"的模式，通过多层级agent体系、分层门控审查、渐进式文档生成等技术，在保持上下文高效管理的同时，实现了复杂的游戏开发工作流协调。

---

## 第一部分：Agent系统架构

### 1.1 三层Agent等级体系

项目采用严格的三层agent等级体系，每个层级承担不同的决策复杂度：

#### Tier 1 — 领导Agent（Opus模型）

| Agent | 职责域 | 使用场景 |
|-------|--------|----------|
| `creative-director` | 创意愿景 | 重大创意决策、支柱冲突、基调/方向 |
| `technical-director` | 技术愿景 | 架构决策、技术栈选择、性能策略 |
| `producer` | 生产管理 | Sprint规划、里程碑跟踪、风险管理、跨部门协调 |

**设计原理**：Tier 1 agent使用最高级模型（Opus），处理需要跨系统综合分析的高风险决策。这些agent不直接实现功能，而是提供战略分析和最终决策权威。

#### Tier 2 — 部门主管Agent（Sonnet模型）

| Agent | 职责域 | 使用场景 |
|-------|--------|----------|
| `game-designer` | 游戏设计 | 机制、系统、进度、经济、平衡 |
| `lead-programmer` | 代码架构 | 系统设计、代码审查、API设计、重构 |
| `art-director` | 视觉方向 | 风格指南、美术圣经、资源标准、UI方向 |
| `qa-lead` | 质量保证 | 测试策略、缺陷分类、发布就绪、回归规划 |

**设计原理**：Tier 2 agent处理特定领域的复杂决策，具备中等复杂度的综合能力。使用Sonnet模型在成本和性能间取得平衡。

#### Tier 3 — 专家Agent（Sonnet/Haiku模型）

包含45个专业agent，覆盖：
- **编程专家**：`gameplay-programmer`、`engine-programmer`、`ai-programmer`、`network-programmer`、`tools-programmer`、`ui-programmer`
- **设计专家**：`systems-designer`、`level-designer`、`economy-designer`、`ux-designer`
- **内容专家**：`writer`、`world-builder`、`sound-designer`
- **质量专家**：`qa-tester`、`performance-analyst`、`security-engineer`、`accessibility-specialist`
- **运维专家**：`devops-engineer`、`analytics-engineer`、`community-manager`

**模型选择策略**：

| 模型 | 使用场景 |
|------|----------|
| Haiku | 只读状态检查、格式化、简单查询 |
| Sonnet | 实现、设计编写、单系统分析 |
| Opus | 多文档综合、高风险阶段门禁裁决、跨系统整体审查 |

### 1.2 Agent委托层级图

```
                           [Human Developer]
                                 |
                 +---------------+---------------+
                 |               |               |
         creative-director  technical-director  producer
                 |               |               |
        +--------+--------+     |        (coordinates all)
        |        |        |     |
  game-designer art-dir  narr-dir  lead-programmer  qa-lead  audio-dir
        |        |        |         |                |        |
     +--+--+     |     +--+--+  +--+--+--+--+--+   |        |
     |  |  |     |     |     |  |  |  |  |  |  |   |        |
    sys lvl eco  ta   wrt  wrld gp ep  ai net tl ui qa-t    snd
```

**委托规则示例**：

```markdown
| From | Can Delegate To |
|------|----------------|
| creative-director | game-designer, art-director, audio-director, narrative-director |
| lead-programmer | gameplay-programmer, engine-programmer, ai-programmer, network-programmer, tools-programmer, ui-programmer |
| game-designer | systems-designer, level-designer, economy-designer |
```

**冲突升级路径**：

| 场景 | 升级至 |
|------|--------|
| 两个设计师对机制意见不一致 | game-designer |
| 游戏设计vs叙事冲突 | creative-director |
| 游戏设计vs技术可行性 | producer（协调）→ creative-director + technical-director |
| 代码架构分歧 | technical-director |
| 跨系统代码冲突 | lead-programmer → technical-director |

---

## 第二部分：渐进式披露技术（Progressive Disclosure）

渐进式披露是本项目管理复杂性的核心策略，通过"分阶段揭示"来控制上下文开销同时保持决策质量。

### 2.1 文档渐进式生成

#### 分节文件写入模式

对于多章节文档（设计文档、架构文档、叙事条目），采用增量写入：

```
1. Agent立即创建带骨架的文件（所有章节标题，空内容体）
2. 在对话中逐节讨论和起草
3. 每节获批后立即写入文件
4. 每节后更新 `production/session-state/active.md`
5. 写入章节后，之前关于该节的讨论可以安全压缩
```

**上下文效益**：完整设计文档会话可能累积30-50k tokens对话历史。增量写入将实时上下文保持在~3-5k tokens（仅当前章节讨论），因为已完成章节已持久化到磁盘。

#### 会话状态文件

维护 `production/session-state/active.md` 作为动态检查点：

```markdown
<!-- STATUS -->
Epic: Combat System
Feature: Melee Combat
Task: Implement hitbox detection
<!-- /STATUS -->
```

**字段定义**：
- **Epic**：当前史诗
- **Feature**：当前特性
- **Task**：当前任务
- 所有字段可选——仅包含适用的
- 状态行脚本解析并显示为面包屑：`Combat System > Melee Combat > Hitboxes`

### 2.2 上下文预算管理

根据任务类型分配上下文预算：

| 任务类型 | 上下文预算 |
|----------|------------|
| 轻量级（读/审） | ~3k tokens |
| 中量级（实现特性） | ~8k tokens |
| 重量级（多系统重构） | ~15k tokens |

### 2.3 主动压缩策略

```markdown
## 主动压缩
- 在~60-70%上下文使用率时主动压缩，不要在达到限制时才反应性压缩
- 使用 `/clear` 处理不相关任务，或在2+次修正失败后
- **自然压缩点**：章节写入文件后、提交后、任务完成后、开始新主题前
- **聚焦压缩**：`/compact Focus on [current task]`
```

### 2.4 压缩指令

上下文压缩时保留以下内容：

```markdown
## 压缩后保留项
- 指向 `production/session-state/active.md` 的引用（读取以恢复状态）
- 本会话修改的文件列表及其用途
- 做出的架构决策及其理由
- 活跃Sprint任务及其当前状态
- Agent调用及其结果（成功/失败/阻塞）
- 测试结果（通过/失败计数、具体失败）
- 未解决的阻塞或等待用户输入的问题
- 当前任务及所处步骤
- 当前文档的哪些章节已写入文件vs仍在进行中
```

---

## 第三部分：Agent协调与编排机制

### 3.1 协作协议

#### 核心原则：用户驱动协作

```
Agent = 专家顾问
User = 创意总监（最终决策者）

Agent：
- 提问澄清问题
- 研究并呈现选项
- 解释权衡和理由
- 起草提案供审查
- 等待用户批准后再写入

User：
- 做出所有创意和战略决策
- 批准或拒绝agent建议
- 指导设计愿景
- 签署前不写入文件
```

#### 标准工作流：Question → Options → Decision → Draft → Approval

```
1. AGENT提问
   Agent："为了设计制作系统，我需要了解：
           - 配方应该通过实验发现还是从NPC学习？
           - 失败的代价应该有多严厉？
           - 实验是否应该有资源成本？"

2. USER提供上下文
   User："配方通过实验发现。失败应消耗材料但给予部分经验。
         我们主要面向探索者。"

3. AGENT呈现带理由的选项
   Agent："基于您的目标，这里有三种方法：
           **选项A：完全随机发现**
           - 机制：尝试任意组合，随机成功概率
           - ✅ 最大探索奖励
           - ❌ 缺乏技巧表达可能显得任意
           ...（更多选项分析）"

4. USER决策
   User："选项C感觉对。设置X=5次失败解锁提示。"

5. AGENT根据决策起草
   Agent："好的。以下是核心机制草案：
           ### 核心循环
           ...（逐节起草，每节审批后写入文件）"

10. 写入文件前最终审批
    Agent："完整GDD草案已完成。包含：
            ✓ 概述 ✓ 玩家幻想 ✓ 详细规则 ✓ 公式
            ✓ 边界情况 ✓ 依赖 ✓ 调优旋钮 ✓ 验收标准
            可以写入 design/gdd/crafting-system.md 吗？"
    User："可以。" ← 仅此时写入文件
```

### 3.2 团队技能编排

团队技能（如 `/team-combat`、`/team-qa`）编排多个agent通过结构化管道。

#### `/team-combat` 管道示例

```
### Phase 1: 设计
委托 game-designer：
- 创建或更新设计文档

### Phase 2: 架构
委托 gameplay-programmer（+ ai-programmer如涉及AI）：
- 审查设计文档
- 设计代码架构
- 确定与现有系统的集成点
- 输出：架构草图含文件列表和接口定义

然后委托主引擎专家验证架构

### Phase 3: 实现（并行）
并行委托：
- gameplay-programmer：实现核心战斗机制代码
- ai-programmer：实现AI行为（如果特性涉及NPC反应）
- technical-artist：创建VFX和着色器效果
- sound-designer：定义音频事件列表和混音笔记

### Phase 4: 集成
- 连接游戏代码、AI、VFX和音频
- 确保所有调优旋钮已暴露且数据驱动
- 验证特性与现有战斗系统配合

### Phase 5: 验证
委托 qa-tester：
- 从验收标准编写测试用例
- 测试所有记录在案的边界情况
- 验证性能影响在预算内

### Phase 6: 签收
- 收集所有团队成员结果
- 报告特性状态：COMPLETE / NEEDS WORK / BLOCKED
- 列出任何待解决问题及其负责人
```

### 3.3 并行任务协议

当编排技能生成多个独立agent时：

```
1. 在等待任何结果前发出所有独立Task调用
2. 在进入后续阶段前收集所有结果
3. 如果任何agent阻塞，立即暴露——不要静默跳过
4. 如果某些agent完成而其他阻塞，始终生成部分报告
```

### 3.4 错误恢复协议

```markdown
## 错误恢复协议

如果任何生成的agent返回BLOCKED、错误或无法完成：

1. **立即暴露**：在进入依赖阶段前向用户报告"[AgentName]: BLOCKED — [原因]"
2. **评估依赖**：检查被阻塞agent的输出是否为后续阶段所需
3. **通过AskUserQuestion提供选项**：
   - 跳过此agent并在最终报告中记录缺口
   - 用更窄范围重试
   - 在此停止并先解决阻塞
4. **始终生成部分报告**——不要因为一个agent阻塞而丢弃已完成的工作
```

---

## 第四部分：Skills技能系统

### 4.1 技能分类

项目包含60+个技能，按功能分为几类：

#### 创作技能

| 技能 | 描述 |
|------|------|
| `/brainstorm` | 引导式游戏概念构思——从零想法到结构化游戏概念文档 |
| `/quick-design` | 快速设计文档——为简单/独立系统创建单节GDD |
| `/design-system` | 系统化GDD创作——引导式逐节GDD写作 |
| `/prototype` | 快速原型——扔掉式概念构建验证核心想法 |

#### 架构技能

| 技能 | 描述 |
|------|------|
| `/create-architecture` | 创建主架构蓝图和所需ADR列表 |
| `/architecture-decision` | 记录单个架构决策为ADR |
| `/architecture-review` | 从GDD和ADR引导TR注册表和需求追溯矩阵 |

#### 团队编排技能

| 技能 | 描述 |
|------|------|
| `/team-combat` | 编排战斗团队：协调game-designer、gameplay-programmer、ai-programmer等 |
| `/team-qa` | 编排QA团队：通过完整测试周期 |
| `/team-narrative` | 编排叙事团队：编写对话、叙事、世界构建 |
| `/team-ui` | 编排UI团队：设计、实现、测试UI系统 |

#### 评审技能

| 技能 | 描述 |
|------|------|
| `/design-review` | 评审游戏设计文档的完整性、内部一致性、可实现性 |
| `/code-review` | 对指定文件执行架构和代码质量评审 |
| `/architecture-review` | 从架构角度评审系统分解 |
| `/gate-check` | 在阶段转换时验证项目状态 |

#### 管道技能

| 技能 | 描述 |
|------|------|
| `/create-epics` | 将设计分解为史诗（epics） |
| `/create-stories` | 将史诗分解为可实现的用户故事 |
| `/sprint-plan` | 规划Sprint，分配故事和容量 |
| `/milestone-review` | 在里程碑检查点评估进度 |

### 4.2 技能定义结构

```yaml
---
name: skill-name
description: "技能的一行描述"
argument-hint: "[参数提示]"
user-invocable: true
allowed-tools: [Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion]
model: sonnet
---
```

### 4.3 `/brainstorm` 技能详解

`/brainstorm` 是项目的核心引导式构思技能，展示完整的渐进式披露实现：

#### 阶段结构

```
Phase 1: 创意发现
  ↓ （用户回答问题）
Phase 2: 概念生成
  ↓ （用户选择概念）
Phase 3: 核心循环设计
  ↓ （用户确认循环）
Phase 4: 支柱与边界
  ↓ （CD-PILLARS门禁 + AD-CONCEPT-VISUAL门禁）
Phase 5: 玩家类型验证
  ↓ （自动分析）
Phase 6: 范围与可行性
  ↓ （TD-FEASIBILITY门禁 + PR-SCOPE门禁）
Phase 7: 文档生成
```

#### 决策点使用AskUserQuestion

在每个阶段转换时，使用 `AskUserQuestion` 呈现agent的提案作为可选选项：

```python
AskUserQuestion(
  prompt: "哪个概念与您产生共鸣？您可以选一个、组合元素，或要求新方向。",
  options: [
    "Concept 1 — [Title]",
    "Concept 2 — [Title]",
    "Concept 3 — [Title]",
    "Combine elements across concepts",
    "Generate fresh directions"
  ]
)
```

#### 渐进式门禁

```
Review模式检查——在生成CD-PILLARS和AD-CONCEPT-VISUAL前应用：
- solo → 跳过两者。记录："CD-PILLARS跳过——Solo模式。"
- lean → 跳过两者（不是PHASE-GATE）。记录："CD-PILLARS跳过——Lean模式。"
- full → 正常生成。
```

---

## 第五部分：门禁（Gate）系统

### 5.1 门禁架构

门禁是跨工作流所有阶段的标准化审查点，确保每个阶段的输出符合下一阶段的要求。

#### 审查模式

| 模式 | 执行内容 | 适用场景 |
|------|----------|----------|
| `full` | 所有门禁活跃——每步工作流都被审查 | 团队、学习用户 |
| `lean` | 仅PHASE-GATE（`/gate-check`）——跳过逐技能门禁 | **默认**——独立开发者和小型团队 |
| `solo` | 任何地方都不生成director门禁 | Game jam、原型、最大速度 |

#### 模式检查模式

```markdown
在生成门禁前应用模式检查：
1. 如果技能用`--review [mode]`调用，使用该模式
2. 否则读取 production/review-mode.txt
3. 否则默认为lean

应用解析的模式：
- solo → 跳过所有门禁。记录："[GATE-ID]跳过——Solo模式"
- lean → 跳过除非是PHASE-GATE（CD-PHASE-GATE等）
- full → 正常生成
```

### 5.2 标准门禁列表

#### Tier 1 — Creative Director门禁

| 门禁ID | 触发点 | 裁决 |
|--------|--------|------|
| CD-PILLARS | 支柱定义后 | APPROVE / CONCERNS / REJECT |
| CD-GDD-ALIGN | 系统GDD创作后 | APPROVE / CONCERNS / REJECT |
| CD-SYSTEMS | 系统分解后 | APPROVE / CONCERNS / REJECT |
| CD-NARRATIVE | 叙事内容创作后 | APPROVE / CONCERNS / REJECT |
| CD-PHASE-GATE | 阶段转换时 | READY / CONCERNS / NOT READY |

#### Tier 1 — Technical Director门禁

| 门禁ID | 触发点 | 裁决 |
|--------|--------|------|
| TD-SYSTEM-BOUNDARY | 系统分解后GDD创作前 | APPROVE / CONCERNS / REJECT |
| TD-FEASIBILITY | 识别最大技术风险后 | VIABLE / CONCERNS / HIGH RISK |
| TD-ARCHITECTURE | 主架构文档起草后 | APPROVE / CONCERNS / REJECT |
| TD-PHASE-GATE | 阶段转换时 | READY / CONCERNS / NOT READY |

#### Tier 1 — Producer门禁

| 门禁ID | 触发点 | 裁决 |
|--------|--------|------|
| PR-SCOPE | 范围层定义后 | REALISTIC / OPTIMISTIC / UNREALISTIC |
| PR-SPRINT | Sprint计划定稿前 | REALISTIC / CONCERNS / UNREALISTIC |
| PR-MILESTONE | 里程碑评审时 | ON TRACK / AT RISK / OFF TRACK |
| PR-PHASE-GATE | 阶段转换时 | READY / CONCERNS / NOT READY |

### 5.3 裁决格式

所有门禁返回三种裁决之一：

```markdown
## 标准裁决格式

[GATE-ID]: REALISTIC
```

| 裁决 | 含义 | 默认动作 |
|------|------|----------|
| **APPROVE / READY / REALISTIC** | 无问题。继续。 | 继续工作流 |
| **CONCERNS [列表]** | 存在问题但非阻塞。 | 通过AskUserQuestion呈现给用户 |
| **REJECT / NOT READY / UNREALISTIC [阻塞]** | 存在阻塞问题。 | 暴露阻塞，不写入文件或推进阶段直到解决 |

### 5.4 并行门禁协议

当工作流在同一检查点需要多个director时：

```markdown
## 并行门禁协议

并行生成（发出所有Task调用后再等任何结果）：
1. creative-director  → gate CD-PHASE-GATE
2. technical-director → gate TD-PHASE-GATE
3. producer           → gate PR-PHASE-GATE
4. art-director       → gate AD-PHASE-GATE

收集所有四个裁决，然后应用升级规则：
- 任何NOT READY / REJECT → 整体裁决最低FAIL
- 任何CONCERNS → 整体裁决最低CONCERNS
- 全部READY / APPROVE → 有资格PASS（仍需通过artifact检查）
```

---

## 第六部分：模板系统

### 6.1 模板分类

项目包含40+个标准化模板，涵盖游戏开发全生命周期：

#### 设计模板

| 模板 | 用途 |
|------|------|
| `game-concept.md` | 游戏概念文档 |
| `game-design-document.md` | 完整系统GDD |
| `technical-design-document.md` | 技术设计文档 |
| `level-design-document.md` | 关卡设计文档 |
| `game-pillars.md` | 游戏支柱定义 |

#### 架构模板

| 模板 | 用途 |
|------|------|
| `architecture-decision-record.md` | 架构决策记录（ADR） |
| `architecture-doc-from-code.md` | 从代码逆向生成架构文档 |
| `design-doc-from-implementation.md` | 从实现生成设计文档 |

#### 生产模板

| 模板 | 用途 |
|------|------|
| `sprint-plan.md` | Sprint计划 |
| `prototype-report.md` | 原型报告 |
| `milestone-definition.md` | 里程碑定义 |
| `vertical-slice-report.md` | 垂直切片报告 |

### 6.2 GDD模板结构

```markdown
# [机制/系统名称]

> **Status**: Draft | In Review | Approved | Implemented
> **Author**: [Agent or person]
> **Last Updated**: [Date]
> **Implements Pillar**: [Which game pillar this supports]

## Summary
[2-3句话：系统是什么，为玩家做什么，为什么存在]

> **Quick reference** — Layer: `[Foundation | Core | Feature | Presentation]`

## Overview
[向不了解项目的人解释此机制的一段话]

## Player Fantasy
[玩家参与此机制时应该感受到什么]

## Detailed Design
### Core Rules
[精确、无歧义的规则]
### States and Transitions
[状态表]
### Interactions with Other Systems
[与其他系统的交互]

## Formulas
[每个数学公式，含变量定义和范围]

## Edge Cases
[边界情况表]

## Dependencies
[依赖表]

## Tuning Knobs
[调优旋钮表]

## Visual/Audio Requirements
[视觉和音频需求表]

## Game Feel
### Feel Reference
### Input Responsiveness
### Animation Feel Targets
### Impact Moments
### Weight and Responsiveness Profile

## Acceptance Criteria
[可测试的验收条件]

## Open Questions
[待解决问题表]
```

---

## 第七部分：Hooks系统

### 7.1 Hooks配置

项目通过 `.claude/settings.json` 配置了全面的hooks系统：

```json
{
  "hooks": {
    "SessionStart": [
      { "type": "command", "command": "bash .claude/hooks/session-start.sh" },
      { "type": "command", "command": "bash .claude/hooks/detect-gaps.sh" }
    ],
    "PreToolUse": [
      { "type": "command", "command": "bash .claude/hooks/validate-commit.sh" },
      { "type": "command", "command": "bash .claude/hooks/validate-push.sh" }
    ],
    "PostToolUse": [
      { "type": "command", "command": "bash .claude/hooks/validate-assets.sh" },
      { "type": "command", "command": "bash .claude/hooks/validate-skill-change.sh" }
    ],
    "PreCompact": [
      { "type": "command", "command": "bash .claude/hooks/pre-compact.sh" }
    ],
    "PostCompact": [
      { "type": "command", "command": "bash .claude/hooks/post-compact.sh" }
    ],
    "SubagentStart": [
      { "type": "command", "command": "bash .claude/hooks/log-agent.sh" }
    ],
    "SubagentStop": [
      { "type": "command", "command": "bash .claude/hooks/log-agent-stop.sh" }
    ]
  }
}
```

### 7.2 会话启动Hook

`session-start.sh` 在每次会话开始时运行：

```bash
# 显示项目上下文
echo "Branch: $BRANCH"
echo "Recent commits:"
echo "Active sprint: ..."

# 检测并预览活动会话状态
if [ -f "production/session-state/active.md" ]; then
    echo "=== ACTIVE SESSION STATE DETECTED ==="
    echo "Quick summary (last 20 lines):"
    tail -20 "$STATE_FILE"
fi
```

### 7.3 压缩前Hook

`pre-compact.sh` 在上下文压缩前运行：

```bash
echo "=== SESSION STATE BEFORE COMPACTION ==="

# 显示活动会话状态文件
echo "## Active Session State (from $STATE_FILE)"

# 显示修改的文件
echo "## Files Modified (git working tree)"
git diff --name-only
git ls-files --others --exclude-standard

# 显示WIP设计文档
echo "## Design Docs — Work In Progress"
grep -n -E "TODO|WIP|PLACEHOLDER|\[TO BE|\[TBD\]" design/gdd/*.md
```

---

## 第八部分：设计洞察与最佳实践

### 8.1 Agent编排核心原则

1. **垂直委托**：领导agent委托给部门主管，部门主管委托给专家。复杂决策不跳过层级。

2. **水平协商**：同层agent可以相互协商，但不能在自身领域外做约束性决策。

3. **变更传播**：当设计变更影响多个领域时，`producer` agent协调传播。

4. **跨域变更禁止**：agent不得修改其指定目录外的文件，除非有明确委托。

### 8.2 渐进式披露最佳实践

1. **文件优先状态**：对话是短暂的（会被压缩或丢失），文件在磁盘上持久化。文件是记忆，不是对话。

2. **增量文件写入**：多节文档逐节创建和写入，而非在对话中积累。

3. **主动压缩**：在~60-70%上下文使用率时压缩，而非达到限制时才反应性压缩。

4. **上下文预算**：根据任务类型分配适当预算，轻量级3k、中量级8k、重量级15k。

### 8.3 协作设计最佳实践

1. **提问优先**：在提出任何解决方案前，先提问澄清而非假设。

2. **呈现选项**：展示2-4个选项，每个都有详细pros/cons分析。

3. **用户决策**：即使有推荐，也要明确"这是您的决定"。

4. **显式审批**：在写入文件前明确问"可以写入XXX吗？"并等待"是"。

5. **结构化决策UI**：使用 `AskUserQuestion` 工具呈现决策而非纯文本。

### 8.4 Subagent vs Agent Teams

项目区分两种多agent模式：

| 模式 | 适用场景 |
|------|----------|
| **Subagents** | 当前会话内通过`Task`生成。工作在单会话中共享权限上下文，顺序或并行运行。 |
| **Agent Teams** | 多个独立Claude Code会话同时运行，通过共享任务列表协调。需要 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`。 |

**选择指南**：
- 使用subagents：任务输出是另一任务的输入（顺序）
- 使用subagents：任务适合单会话上下文
- 使用agent teams：工作横跨多个不接触相同文件的子系统
- 使用agent teams：每个工作流需要>30分钟并受益于真正并行

### 8.5 反模式

```markdown
## 需要避免的反模式

1. **绕过层级**：专家agent不应在无协商情况下做属于其主管的决策

2. **跨域实现**：agent不应修改其指定区域外的文件

3. **隐式决策**：所有决策必须文档化。口头协议无书面记录会导致矛盾

4. **单体任务**：分配给agent的每个任务应在1-3天内完成。更大的必须先分解

5. **假设实现**：规格不明确时，实现者必须问规格制定者而非猜测。错误猜测比提问代价更高
```

---

## 第九部分：实施建议

### 9.1 迁移到新项目

若要将此架构迁移到新项目：

1. **从Tier 1开始**：配置 `creative-director`、`technical-director`、`producer` 三个领导agent

2. **按需扩展**：初期只添加需要的Tier 3专家，随项目复杂度增加再扩展

3. **建立审查节奏**：设置 `/gate-check` 在每个阶段转换时运行

4. **维护会话状态**：始终使用 `production/session-state/active.md` 跟踪进度

### 9.2 自定义建议

1. **调整模型分配**：根据任务复杂度调整Haiku/Sonnet/Opus分配

2. **扩展技能库**：添加项目特定的专业技能

3. **定制门禁**：添加项目特定的门禁类型

4. **调整审查模式**：根据团队规模和经验调整full/lean/solo使用频率

---

## 附录：关键文件索引

| 文件 | 用途 |
|------|------|
| `.claude/CLAUDE.md` | 主配置文件 |
| `.claude/docs/agent-roster.md` | Agent名单和描述 |
| `.claude/docs/agent-coordination-map.md` | 委托规则和工作流模式 |
| `.claude/docs/coordination-rules.md` | Agent协调规则 |
| `.claude/docs/context-management.md` | 上下文管理策略 |
| `.claude/docs/director-gates.md` | 门禁定义和裁决格式 |
| `.claude/settings.json` | Hooks配置 |
| `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` | 协作协议详细说明 |
| `.claude/agents/*.md` | 各agent定义 |
| `.claude/skills/*/SKILL.md` | 技能定义 |

---

*本文档基于 Claude-Code-Game-Studios 项目分析生成*
*版本：e375f | 分析日期：2026-05-25*
