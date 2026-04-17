# 第四课：智能体编排与协作机制

> ⏱️ 预计学习时间：1小时  
> 🎯 目标：掌握智能体如何实际协作、Task 工具的使用、并行执行和结果整合

---

## 🎼 什么是智能体编排？

智能体编排（Agent Orchestration）是指协调多个智能体协作完成复杂任务的过程。就像交响乐团指挥协调不同乐器演奏一样，智能体编排协调不同专业领域的智能体共同完成项目。

### 编排的核心挑战

| 挑战 | 描述 | 解决方案 |
|------|------|----------|
| **并行协调** | 多个智能体同时工作，如何确保不冲突 | 明确的任务边界和依赖管理 |
| **结果整合** | 各个智能体的输出如何合并为整体 | 统一的结果格式和整合协议 |
| **冲突解决** | 智能体之间意见不一致时如何处理 | 升级机制和裁决流程 |
| **进度跟踪** | 如何实时了解整体进度和瓶颈 | 状态报告和检查点机制 |
| **资源分配** | 如何合理分配计算资源和时间 | 优先级管理和资源调度 |

---

## 🛠️ Task 工具：编排的核心

在 Claude Code 中，Task 工具是实现智能体编排的核心机制。它允许一个智能体（调用者）创建子任务并委派给其他智能体（执行者）。

### Task 工具的基本用法

```markdown
When this skill is invoked:

1. **Delegate to designer**
   Use the Task tool to spawn game-designer subagent:
   ```
   Task: Design combat mechanic
   Subagent: game-designer
   Prompt: |
     Design a melee combat system for a Dark Souls-inspired action RPG.
     
     Requirements:
     - Stamina-based combat (light attack, heavy attack, block, dodge)
     - Weight-based movement (light/medium/heavy armor affects speed)
     - Poise system for stagger resistance
     
     Deliverables:
     1. Core mechanics document
     2. Stat formulas
     3. Balance spreadsheet
     4. Edge case analysis
   ```

2. **Wait for results**
   - Subagent returns: design doc path, balance data, formulas
   - Review the design for completeness

3. **Delegate to programmer**
   Use Task tool to spawn gameplay-programmer:
   ```
   Task: Implement combat system
   Subagent: gameplay-programmer
   Prompt: |
     Implement the combat system based on this design doc: [path]
     
     Architecture requirements:
     - Use state machine for combat states
     - Separate input handling from logic
     - Data-driven from ScriptableObjects
     
     Deliverables:
     1. CombatStateMachine.cs
     2. CombatInputHandler.cs
     3. CombatStats.cs
     4. Unit tests
   ```
```

### Task 工具的关键参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `description` | string | 是 | 任务的简短描述 |
| `subagent_type` | string | 是 | 要委派的智能体名称 |
| `prompt` | string | 是 | 给子智能体的完整指令 |
| `tools` | array | 否 | 子智能体可使用的工具 |
| `model` | string | 否 | 子智能体使用的模型 |

### Task 工具的最佳实践

1. **提供完整的上下文**
   ```markdown
   ❌ 不好的 prompt:
   "Implement the combat system"
   
   ✅ 好的 prompt:
   "Implement the combat system based on this design doc: design/combat-system.md
   
   Key requirements:
   - Stamina-based combat with light/heavy attacks
   - Poise system for stagger resistance  
   - Weight-based movement affecting speed
   
   Technical constraints:
   - Use state machine pattern
   - Separate input from logic
   - Data-driven from config files
   
   Deliverables:
   1. CombatStateMachine.cs
   2. CombatInputHandler.cs
   3. Unit tests with 80%+ coverage"
   ```

2. **明确依赖关系**
   ```markdown
   如果任务B依赖任务A的结果：
   
   1. **Execute Task A**
      - Use Task tool to spawn agent for Task A
      - Wait for results
      - Validate outputs
   
   2. **Execute Task B (depends on A)**
      - Include Task A results in prompt
      - Use Task tool to spawn agent for Task B
      - Wait for results
   ```

3. **处理并行任务**
   ```markdown
   当多个任务可以并行执行时：
   
   1. **Launch parallel tasks**
      - Task A: Use Task tool to spawn agent A (independent)
      - Task B: Use Task tool to spawn agent B (independent)
      - Task C: Use Task tool to spawn agent C (independent)
   
   2. **Wait for all completions**
      - Collect results from A, B, C
      - Check for errors or partial failures
   
   3. **Integrate results**
      - Combine outputs into unified deliverable
      - Report overall status
   ```

---

## 🔄 并行执行与串行执行

### 决策树：何时并行，何时串行

```
任务分析
    │
    ├─→ 任务之间是否有依赖？
    │       │
    │       ├─→ 是 → 串行执行（按依赖顺序）
    │       │
    │       └─→ 否 → 继续分析
    │
    ├─→ 任务是否访问共享资源？
    │       │
    │       ├─→ 是 → 需要协调机制（锁、队列等）
    │       │
    │       └─→ 否 → 继续分析
    │
    └─→ 任务是否可以并行执行？
            │
            ├─→ 是 → 并行执行（提升效率）
            │
            └─→ 否 → 串行执行
```

### 并行执行示例

```markdown
场景：实现玩家技能系统，多个领域可以并行工作

@producer 协调执行：

Phase 1: 设计阶段（阻塞）
┌─────────────────────────────────────────────────┐
│ @game-designer                                   │
│ • 设计技能机制                                   │
│ • 定义数值平衡                                   │
│ • 输出：设计文档                                  │
└─────────────────────────────────────────────────┘
                              ↓ 设计完成后
Phase 2: 并行实现阶段
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ @gameplay-       │  │ @technical-     │  │ @ai-programmer   │
│ programmer       │  │ artist          │  │ (if needed)      │
│ • 实现核心代码   │  │ • 制作技能特效  │  │ • 实现NPC AI     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              ↓ 全部完成后
Phase 3: 整合阶段
┌─────────────────────────────────────────────────┐
│ @producer（协调）                                │
│ • 整合所有输出                                   │
│ • 验证一致性                                     │
│ • 交付最终成果                                   │
└─────────────────────────────────────────────────┘
```

### 串行执行示例

```markdown
场景：代码审查流程，必须按顺序执行

@lead-programmer 执行代码审查：

Step 1: 静态分析（必须首先完成）
┌─────────────────────────────────────────────────┐
│ 自动工具                                         │
│ • 代码风格检查                                   │
│ • 语法分析                                       │
│ • 圈复杂度计算                                   │
└─────────────────────────────────────────────────┘
                              ↓ 通过后
Step 2: 架构审查
┌─────────────────────────────────────────────────┐
│ @lead-programmer                                 │
│ • 检查架构合规性                                 │
│ • 验证设计模式使用                               │
│ • 确认依赖方向正确                               │
└─────────────────────────────────────────────────┘
                              ↓ 通过后
Step 3: 详细代码审查
┌─────────────────────────────────────────────────┐
│ @gameplay-programmer（同行审查）                │
│ • 检查业务逻辑正确性                             │
│ • 验证边界条件处理                               │
│ • 确认测试覆盖充分                               │
└─────────────────────────────────────────────────┘
                              ↓ 全部通过后
Step 4: 最终批准
┌─────────────────────────────────────────────────┐
│ @lead-programmer                                 │
│ • 确认所有问题已解决                             │
│ • 批准合并到主分支                               │
│ • 更新相关文档                                   │
└─────────────────────────────────────────────────┘
```

---

## 🎭 完整示例：智能体编排实战

让我们通过一个完整的实战案例，展示智能体编排的全过程。

### 场景：实现游戏的"存档系统"

这是一个中等复杂度的任务，涉及设计、实现、测试等多个环节。

#### Phase 0: 初始请求

```
用户：@producer 我需要实现一个完整的存档系统，包括：
- 手动存档和自动存档
- 多个存档位
- 存档元数据显示（日期、游戏时长、截图）
- 跨平台兼容性（PC、主机、移动端）

请协调团队完成这个任务。
```

#### Phase 1: 分析和规划

```
@producer（智能体）收到请求，开始分析：

1. 任务复杂度评估：
   - 涉及领域：系统设计、UI/UX、平台适配、数据管理
   - 依赖关系：设计 → 实现 → 测试
   - 风险点：跨平台兼容性、数据版本管理

2. 识别需要的智能体：
   Tier 2（部门负责人）：
   - @game-designer - 设计存档系统机制
   - @lead-programmer - 架构审查和技术指导
   - @art-director - UI/UX 方向指导
   
   Tier 3（专家）：
   - @gameplay-programmer - 实现核心存档逻辑
   - @ui-programmer - 实现存档界面
   - @qa-tester - 编写测试用例

3. 制定执行计划：
   Phase 1: 设计（阻塞）
   └─ @game-designer → 存档系统设计文档
   
   Phase 2: 架构审查（阻塞）
   └─ @lead-programmer ← 审查设计文档
   
   Phase 3: 并行实现
   ├─ @gameplay-programmer → 核心存档逻辑
   ├─ @ui-programmer → 存档 UI
   └─ @qa-tester → 测试用例
   
   Phase 4: 测试和修复
   └─ @qa-tester + @gameplay-programmer
   
   Phase 5: 最终审查和交付
   └─ @lead-programmer 审查，@producer 交付
```

#### Phase 2: 执行过程

```
【Phase 1: 设计阶段】

@producer: @game-designer，请设计存档系统。

@game-designer（使用 Question-First Workflow）:
为了设计最适合的存档系统，我需要了解：
1. 目标平台的存储限制是什么？（如 Switch 有严格的存储限制）
2. 存档频率预期？（每5分钟自动存档？每次切换场景？）
3. 是否需要云存档同步？
4. 存档防作弊要求？（对于多人游戏或排行榜很重要）

@producer（代表用户回答）:
1. 主要平台：PC (Steam)、PS5、Xbox Series X、Switch
2. 自动存档：每3分钟和每次场景切换
3. 需要云存档，使用平台的原生系统（Steam Cloud、PS+等）
4. 单人游戏，不需要防作弊

@game-designer:
了解。我设计了以下方案：

【方案 A：分层存档系统】（推荐）
- 架构：元数据 + 存档数据分离
- 元数据（快速加载）：存档位ID、时间戳、截图、游戏时长、版本号
- 存档数据：完整的游戏状态（JSON/Binary）
- 优点：存档列表加载快，支持缩略图，易于版本管理
- 缺点：实现复杂度高

【方案 B：简单存档系统】
- 架构：每个存档一个完整文件
- 优点：实现简单，易于调试
- 缺点：存档列表加载慢，难以扩展

推荐方案 A，因为它更符合跨平台和大规模数据的需求。

@producer: 我选方案 A。

@game-designer:
好的，我将编写详细的设计文档。

（编写设计文档：docs/design/save-system-design.md）

【设计文档完成】
内容包括：
- 系统架构图
- 数据结构设计
- 平台适配策略
- 版本管理机制
- UI/UX 设计建议
- 性能预算和优化策略

@producer: 设计阶段完成。进入 Phase 2。


【Phase 2: 架构审查】

@producer: @lead-programmer，请审查存档系统设计文档。

@lead-programmer:
收到。我开始审查设计文档。

（审查过程）

审查结果：
✅ 架构设计合理，分层架构符合项目规范
✅ 数据结构清晰，易于序列化和版本管理
✅ 平台适配策略完整

⚠️ 建议改进：
1. 建议增加存档加密选项（即使单机游戏，防止存档损坏）
2. 建议明确存档大小限制（特别是对于 Switch）
3. 建议增加存档恢复机制（处理损坏存档）

✅ 审查通过，可以进入实现阶段。

@producer: 收到改进建议。我会将其加入需求。@game-designer 请更新设计文档。

@game-designer: 已更新设计文档，增加了加密、大小限制和恢复机制。

@producer: Phase 2 完成。进入 Phase 3。


【Phase 3: 并行实现】

@producer: 
现在启动并行实现阶段。

任务分配：
- @gameplay-programmer：实现核心存档逻辑
- @ui-programmer：实现存档 UI
- @qa-tester：编写测试用例

所有任务可以并行执行。

（使用 Task 工具并行委派任务）

【并行执行中...】

@gameplay-programmer:
开始实现核心存档逻辑。

（实现过程）

完成：
- SaveManager.cs - 存档管理器
- SaveData.cs - 存档数据结构
- SaveSerializer.cs - 序列化/反序列化
- PlatformSaveProvider.cs - 平台适配层
- 单元测试覆盖 85%

输出：src/save-system/ 目录下的所有文件

@ui-programmer:
开始实现存档 UI。

（实现过程）

完成：
- SaveSlotUI.cs - 存档位 UI
- SaveMenuController.cs - 存档菜单控制器
- SaveThumbnailGenerator.cs - 截图生成器
- 支持键盘/手柄/触摸输入

输出：src/ui/save-system/ 目录下的所有文件

@qa-tester:
开始编写测试用例。

（编写过程）

完成：
- 功能测试：50个测试用例
- 边界测试：20个测试用例
- 性能测试：10个测试用例
- 兼容性测试：15个测试用例
- 自动化测试脚本

输出：tests/save-system/ 目录下的所有文件

@producer:
Phase 3 完成。所有并行任务已完成。

进入 Phase 4。


【Phase 4: 测试和修复】

@producer:
启动测试和修复阶段。

@qa-tester，请执行测试。

@qa-tester:
开始执行测试。

（测试执行过程）

测试结果：
✅ 通过：85个测试用例
❌ 失败：10个测试用例
⚠️ 警告：5个问题

失败项：
1. 存档加载时偶尔崩溃（高优先级）
2. Switch 平台上存档大小超过限制（高优先级）
3. 自动存档时游戏卡顿（中优先级）
...

@producer:
收到测试结果。需要修复这些问题。

@gameplay-programmer，请修复这些问题。

@gameplay-programmer:
开始修复问题。

（修复过程）

修复完成：
1. ✅ 修复了存档加载崩溃问题（原因：空引用检查缺失）
2. ✅ 修复了 Switch 存档大小问题（原因：未压缩截图）
3. ✅ 修复了自动存档卡顿问题（原因：在主线程执行IO）
...

@qa-tester:
重新测试。

（重新测试）

测试结果：
✅ 所有测试通过

@producer:
Phase 4 完成。进入 Phase 5。


【Phase 5: 最终审查和交付】

@producer:
启动最终审查和交付阶段。

@lead-programmer，请进行最终代码审查。

@lead-programmer:
进行最终代码审查。

（审查过程）

审查结果：
✅ 代码质量：优秀
✅ 架构设计：符合规范
✅ 测试覆盖：85%（达到标准）
✅ 文档完整：设计文档、代码注释、API文档齐全

✅ 最终审查通过，可以交付。

@producer:
最终审查通过。

向用户报告：

【存档系统 - 交付报告】

✅ 项目完成度：100%

📋 交付物清单：
1. 设计文档 - docs/design/save-system-design.md
2. 核心代码 - src/save-system/ (12个文件)
3. UI代码 - src/ui/save-system/ (5个文件)
4. 测试用例 - tests/save-system/ (95个测试)
5. 文档 - docs/api/save-system-api.md

👥 参与的智能体：
- @producer (协调)
- @game-designer (设计)
- @lead-programmer (架构审查)
- @gameplay-programmer (核心实现)
- @ui-programmer (UI实现)
- @qa-tester (测试)

⏱️ 时间统计：
- 设计阶段：2小时
- 架构审查：1小时
- 并行实现：4小时
- 测试和修复：2小时
- 最终审查：1小时
- 总计：10小时（相比串行开发节省 40% 时间）

✨ 质量指标：
- 测试覆盖率：85%
- 代码审查通过率：100%
- 文档完整度：100%
- 性能达标：✅

🎯 项目状态：✅ 已完成，可交付
```

---

## ✅ 本课小结

### 核心知识点

1. **智能体编排的核心概念**
   - 编排 = 协调多个智能体协作完成复杂任务
   - 核心挑战：并行协调、结果整合、冲突解决、进度跟踪、资源分配

2. **Task 工具的使用**
   - 基本用法：Task 工具创建子任务并委派给子智能体
   - 关键参数：description、subagent_type、prompt、tools、model
   - 最佳实践：提供完整上下文、明确依赖关系、处理并行任务

3. **并行 vs. 串行执行**
   - 决策树：根据依赖关系、资源冲突、任务性质决定
   - 并行执行：提高效率，但需要协调机制
   - 串行执行：保证顺序，适合有依赖的任务

4. **完整的编排流程**
   - Phase 1: 分析和规划
   - Phase 2: 架构审查
   - Phase 3: 并行实现
   - Phase 4: 测试和修复
   - Phase 5: 最终审查和交付

### 关键技能

完成本课后，你应该能够：
- [ ] 使用 Task 工具委派任务给子智能体
- [ ] 设计并行执行方案，提高协作效率
- [ ] 管理任务依赖关系，确保正确执行顺序
- [ ] 整合多个智能体的输出，形成完整结果
- [ ] 跟踪进度，识别和解决瓶颈

### 下一步

➡️ **[第五课：协调规则与冲突解决 →](./A05-coordination-rules.md)**

深入学习智能体协作的规则体系，包括垂直委派、横向咨询、冲突解决等机制。

---

## 📚 参考资源

- [项目中的 Producer 智能体示例](../.claude/agents/producer.md) - 协调者模式
- [项目中的 Team-Combat Skill](../.claude/skills/team-combat/SKILL.md) - 多智能体编排示例
- [Claude Code 官方文档 - Task 工具](https://docs.anthropic.com/) - 官方指南
