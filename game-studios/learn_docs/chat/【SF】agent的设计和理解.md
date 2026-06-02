
# > 一开始会进行游戏创意讨论，这些讨论得出的结果和文档会放到哪里，什么时候会被调用，哪些agent会使用？

toolName: search_codebase
            
status: success
          
query: game design documents, creative discussion, game concept, GDD, design directory structure, onboarding flow, /start command, game-design-director, creative-director
          

        
            
toolName: file_search
            
status: success
          
file_pattern: **/*.md
          

        
            
toolName: file_search
            
status: success
          
file_pattern: **/*.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\skills\brainstorm\SKILL.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\skills\start\SKILL.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\game-concept.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\game-pillars.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\game-designer.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\creative-director.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\rules\design-docs.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\skills\map-systems\SKILL.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\skills\design-system\SKILL.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\game-design-document.md
          
现在我已经完整追溯了整个创意讨论→文档产出→消费的全链路。让我给你一个系统性的讲解。

---

## 创意讨论的完整生命周期

### 一张全景图

```
用户输入                     Skill/Agent                产出文件                    消费者
───────                    ────────────               ────────                   ──────
/start           →    start skill (路由)         →   无文件产出               →  路由到 /brainstorm
/brainstorm      →    brainstorm skill (6阶段)   →   design/gdd/              →  /map-systems
                                                    ├── game-concept.md        creative-director
                                                    └── game-pillars.md        game-designer
/map-systems     →    map-systems skill          →   design/gdd/              →  /design-system
                                                    └── systems-index.md       producer
/design-system   →    design-system skill        →   design/gdd/              →  gameplay-programmer
  combat-system                                      └── combat-system.md       engine-programmer
/design-system   →    design-system skill        →   design/gdd/              →  ai-programmer
  inventory                                          └── inventory-system.md    ui-programmer
...                                                  ...                         ...
```

---

## 第一阶段：创意孵化（`/brainstorm`）

### 产出文件 1：`design/gdd/game-concept.md`

这是**游戏概念文档**，模板定义在 [game-concept.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/templates/game-concept.md)，包含：

| 章节 | 内容 | 示例 |
|------|------|------|
| Elevator Pitch | 一句话说清游戏 | "一个 roguelike 卡牌游戏，你是记忆宫殿中的侦探" |
| Core Identity | 类型、平台、受众、范围 | Roguelike Deckbuilder / PC / 单人 |
| Core Fantasy | 情感承诺 | "用记忆碎片拼凑真相的侦探幻想" |
| Unique Hook | 差异化卖点 | "卡牌=记忆，打出的牌从牌组中永久消失" |
| MDA 分析 | 8种美学的优先级排序 | Challenge=1, Narrative=2, Discovery=3 |
| Core Loop | 30秒/5分钟/30分钟循环 | 抽牌→出牌→探索→收集记忆碎片 |
| MVP 定义 | 最小可行产品范围 | 3个角色、30张牌、1个Boss |

### 产出文件 2：`design/gdd/game-pillars.md`

这是**游戏支柱文档**，模板定义在 [game-pillars.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/templates/game-pillars.md)。3-5 条不可妥协的原则，例如：

> **Pillar 1: 记忆即资源** — 每张卡牌代表一段记忆，使用后从牌组消失。玩家必须权衡「现在用」vs「留给未来」。
>
> **Pillar 2: 真相分层揭示** — 故事不是线性的，每次通关揭示一层真相，鼓励多周目。

---

## 第二阶段：系统分解（`/map-systems`）

### 产出文件 3：`design/gdd/systems-index.md`

这是**系统索引**——游戏概念文档的「解压缩」。`/brainstorm` 产出的是粗粒度的游戏描述，`/map-systems` 把它拆解成**可独立设计的子系统**。

例如一个 roguelike deckbuilder 会被拆成：

```
systems-index.md:
├── combat-system       (Foundation层, 优先级1)
├── card-system         (Foundation层, 优先级1)
├── deck-building       (Core层, 优先级2)
├── enemy-ai            (Core层, 优先级2)
├── progression-system  (Core层, 优先级3)
├── inventory-system    (Feature层, 优先级4)
├── dialogue-system     (Feature层, 优先级5)
├── save-load           (Foundation层, 优先级1)
└── ...
```

每个系统标注了：优先级、依赖关系、所属层级（Foundation → Core → Feature → Presentation → Polish）。

---

## 第三阶段：逐个系统设计（`/design-system`）

### 产出文件 4+：`design/gdd/{system-name}.md`

这是**每个子系统的 GDD**，模板定义在 [game-design-document.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/templates/game-design-document.md)，必须包含 8 个强制章节：

| # | 章节 | 作用 |
|---|------|------|
| 1 | Overview | 一句话概述 |
| 2 | Player Fantasy | 玩家感受 |
| 3 | Detailed Rules | 无歧义的规则（程序员能直接实现） |
| 4 | Formulas | 所有公式+变量定义+取值范围 |
| 5 | Edge Cases | 异常情况的明确处理 |
| 6 | Dependencies | 双向依赖关系 |
| 7 | Tuning Knobs | 可调参数+安全范围 |
| 8 | Acceptance Criteria | 可测试的验收标准 |

---

## 文件什么时候被调用？

### 调用时机矩阵

| 文件 | 被谁加载 | 触发时机 |
|------|---------|---------|
| `game-concept.md` | `creative-director` | 做任何重大创意决策时 |
| `game-concept.md` | `game-designer` | 设计任何新系统时 |
| `game-concept.md` | `/map-systems` | 分解系统时（**必须存在，否则报错**） |
| `game-concept.md` | `/design-system` | 设计单个系统时（**必须存在，否则报错**） |
| `game-pillars.md` | `creative-director` | 解决设计冲突时（对齐支柱） |
| `game-pillars.md` | `game-designer` | 评估设计方案是否服务支柱 |
| `game-pillars.md` | `/design-review` | 审查 GDD 时（检查支柱对齐） |
| `systems-index.md` | `/design-system` | 确定设计顺序、读取依赖 GDD |
| `systems-index.md` | `producer` | 规划 Sprint 时 |
| `{system}.md` | `gameplay-programmer` | 实现该系统的代码时 |
| `{system}.md` | `engine-programmer` | 实现底层支撑时 |
| `{system}.md` | `ai-programmer` | 实现 AI 行为时 |
| `{system}.md` | `ui-programmer` | 实现 UI 时 |
| `{system}.md` | `qa-tester` | 编写测试用例时 |
| `{system}.md` | `/code-review` | 审查代码是否符合设计 |

### 加载机制

注意 [design-docs.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/rules/design-docs.md) 的 `paths` 配置：

```yaml
paths:
  - "design/gdd/**"
```

这意味着：**任何 agent 在操作 `design/gdd/` 目录下的文件时，这条规则会被自动加载**。所以 `gameplay-programmer` 在写 `src/gameplay/combat/` 代码时，如果它引用了 `design/gdd/combat-system.md`，规则就会生效——要求公式完整、边缘情况明确、验收标准可测试。

---

## 哪些 Agent 参与创意讨论？

### 按 Tier 分层

```
                    creative-director (Tier 1)
                    最终创意裁决者
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    game-designer   narrative-director  art-director  (Tier 2)
    机制/系统设计      故事/世界观设计      视觉风格
         │               │
    ┌────┴────┐     ┌───┴───┐
    │         │     │       │
systems-  economy- world-  writer   (Tier 3)
designer  designer builder  对话撰写
 公式/数值  经济/掉落  世界观   剧本
```

### 各 Agent 在创意讨论中的具体角色

| Agent | 文件路径 | 职责 | 何时介入 |
|-------|---------|------|---------|
| **creative-director** | [creative-director.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/creative-director.md) | 最终创意裁决，维护愿景一致性 | 部门间冲突、支柱级决策 |
| **game-designer** | [game-designer.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/game-designer.md) | 核心循环、战斗、进度系统设计 | 任何"游戏怎么玩"的问题 |
| **systems-designer** | `systems-designer.md` | 公式推导、数值平衡、曲线设计 | game-designer 需要精确数学时 |
| **economy-designer** | `economy-designer.md` | 掉落表、经济系统、资源流动 | 涉及货币/资源/掉落时 |
| **narrative-director** | [narrative-director.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/narrative-director.md) | 故事架构、世界观一致性 | 涉及剧情/世界观时 |
| **world-builder** | [world-builder.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/world-builder.md) | 世界观构建、历史、派系 | 需要深度世界观时 |
| **writer** | [writer.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/writer.md) | 对话、文本、风味描述 | 需要具体文字内容时 |

### 跨 Agent 协作示例

以 `/brainstorm` 为例，虽然它是一个 skill 而不是 agent，但它内部可以调用 agent：

```
/brainstorm roguelike deckbuilder
    │
    ├── Phase 1-2: skill 自己完成（创意发现 + 概念生成）
    │
    ├── Phase 3 (Core Loop):
    │   └── 内部可能咨询 game-designer 验证循环可行性
    │
    ├── Phase 4 (Pillars):
    │   └── 写入 game-pillars.md 后，creative-director 审查对齐
    │
    └── Phase 6 (Document Writing):
        └── 写入 game-concept.md 后，触发 design-docs 规则校验
```

---

## 总结：数据流全貌

```
/brainstorm
    │
    ├──→ design/gdd/game-concept.md  ──→  /map-systems 的「必须输入」
    └──→ design/gdd/game-pillars.md  ──→  creative-director 的「裁决依据」
                                              │
                                    /map-systems
                                              │
                                    design/gdd/systems-index.md
                                              │
                                    /design-system combat-system
                                              │
                                    design/gdd/combat-system.md
                                              │
                              ┌───────────────┼───────────────┐
                              ↓               ↓               ↓
                    gameplay-programmer  ai-programmer   ui-programmer
                         (写战斗代码)     (写敌人AI)      (写战斗UI)
                              │               │               │
                              └───────────────┴───────────────┘
                                              │
                                    /code-review (对照GDD审查)
                                    /balance-check (对照公式验证)
                                    qa-tester (对照Acceptance Criteria测试)
```

**核心理念**：创意讨论的产出不是一次性的——`game-concept.md` 和 `game-pillars.md` 是整个项目的**宪法级文档**，从设计到实现到测试，每个阶段都在引用它们。这就是为什么 `design-docs` 规则用 `paths: "design/gdd/**"` 做了全局绑定——确保任何触碰设计文档的 agent 都遵守同一套质量标准。


# > `g:\repository\claude\Game-Studio-Analise\.claude\docs` 和 `g:\repository\claude\Game-Studio-Analise\docs` 这两个目录有什么不同，分别放置什么文档？creative-director 是如何的值需要加载 game-concept.md	的？

toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\creative-director.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\agent-roster.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\agent-coordination-map.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\rules-reference.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\skills-reference.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\docs\engine-reference\README.md
          
现在我已经完整读取了两个目录的结构和关键文件。让我来做一个系统性的对比分析。

---

## 一、两个目录的核心区别

```
.claude/docs/                          docs/
─────────────                          ─────
「系统元配置层」                        「项目内容层」
 Framework / Meta / Wiring             Content / Assets / Reference
```

### 一句话总结

| | `.claude/docs/` | `docs/` |
|---|---|---|
| **本质** | Claude Code 框架的**布线文档** | 游戏项目的**内容文档** |
| **类比** | 操作系统的 `/etc/` 配置目录 | 用户目录下的 `~/Documents/` |
| **谁读** | Claude Code 运行时自动加载 | Agent 按需手动 Read |
| **谁写** | 框架模板（用户配置后固化） | 用户 + Agent 协作产出 |
| **变化频率** | 低（项目初始化时配置一次） | 高（随开发持续增长） |

---

## 二、`.claude/docs/` — 系统元配置层

这是 Claude Code 的**内部布线系统**，定义了框架如何运作。所有文件都是**声明式配置**，不是游戏内容。

### 文件清单与功能

| 文件 | 功能 | 加载方式 |
|------|------|---------|
| `directory-structure.md` | 定义项目目录树（`src/`, `design/`, `assets/` 等） | CLAUDE.md 中 `@`-import |
| `technical-preferences.md` | 引擎/命名/性能/测试偏好 | CLAUDE.md 中 `@`-import |
| `coding-standards.md` | 代码质量标准 + GDD 8 章节规范 | CLAUDE.md 中 `@`-import |
| `coordination-rules.md` | Agent 间委托/协商/冲突升级规则 | CLAUDE.md 中 `@`-import |
| `context-management.md` | 上下文预算、增量写入、压缩策略 | CLAUDE.md 中 `@`-import |
| `agent-roster.md` | 48 个 Agent 的完整花名册 | 按需 Read |
| `agent-coordination-map.md` | Agent 层级树 + 委托权限矩阵 | 按需 Read |
| `rules-reference.md` | 路径规则表（哪个目录触发哪条规则） | 按需 Read |
| `skills-reference.md` | 所有斜杠命令的速查表 | 按需 Read |
| `hooks-reference.md` | Git hooks 的触发时机和行为 | 按需 Read |
| `hooks-reference/*.md` | 每个 hook 的详细规范 | 按需 Read |
| `review-workflow.md` | 审查工作流说明 | 按需 Read |
| `quick-start.md` | 快速入门指南 | 按需 Read |
| `setup-requirements.md` | 环境配置要求 | 按需 Read |
| `CLAUDE-local-template.md` | 本地 CLAUDE.md 模板 | 模板（复制用） |
| `settings-local-template.md` | 本地设置模板 | 模板（复制用） |
| `templates/*.md` | 20+ 个文档模板 | 模板（Agent 按需引用） |

---

## 三、`docs/` — 项目内容层

这是**游戏项目的实际文档产出**，是 Agent 协作的「工作成果」。

### 文件清单与功能

| 路径 | 内容 | 谁产出 |
|------|------|--------|
| `WORKFLOW-GUIDE.md` | 完整工作流指南（1862行） | 框架模板 |
| `COLLABORATIVE-DESIGN-PRINCIPLE.md` | 协作设计原则 | 框架模板 |
| `engine-reference/README.md` | 引擎参考文档说明 | 框架模板 |
| `engine-reference/unreal/VERSION.md` | UE 版本契约 | 框架模板 + 用户配置 |
| `engine-reference/unreal/breaking-changes.md` | UE 破坏性变更 | 框架模板 |
| `engine-reference/unreal/deprecated-apis.md` | UE 废弃 API 速查 | 框架模板 |
| `engine-reference/unreal/current-best-practices.md` | UE 最新最佳实践 | 框架模板 |
| `engine-reference/unreal/modules/*.md` | UE 子系统参考（渲染/物理/动画等） | 框架模板 |
| `engine-reference/unreal/plugins/*.md` | UE 插件参考（GAS/PCG/CommonUI等） | 框架模板 |
| `examples/*.md` | 会话示例（设计/实现/决策） | 框架模板 |

### 关键观察：`docs/` 目前全是框架模板

注意 `docs/` 下目前**没有任何 `design/gdd/` 目录**——游戏概念文档、GDD、支柱文档都还没创建。这是因为项目还没运行 `/brainstorm`。当前 `docs/` 的内容全部是框架预置的**参考材料**和**工作流示例**。

---

## 四、为什么拆成两个目录？设计哲学

### 1. 关注点分离

```
.claude/docs/  = "框架怎么跑"     （How the system works）
docs/          = "游戏怎么做"     （What we're building）
```

把框架布线文档放在 `.claude/` 下（隐藏目录），把项目内容文档放在 `docs/` 下（可见目录），让人类开发者一眼就能区分「系统配置」和「项目产出」。

### 2. 加载机制不同

```
.claude/docs/ 中的文件 → 通过 CLAUDE.md 的 @-import 自动注入上下文
docs/ 中的文件         → Agent 通过 Read 工具按需加载
```

`@`-import 的文件会在**每次会话启动时**自动展开到上下文中，所以 `.claude/docs/` 放的是「每次都需要」的核心配置。`docs/` 放的是「按需查阅」的参考资料。

### 3. Git 语义不同

```
.claude/  → 框架升级时可能整体替换（类似 node_modules）
docs/     → 项目演进时持续增长（类似 src/）
```

---

## 五、creative-director 如何加载 `game-concept.md`？

这是一个非常好的问题，答案分为**两层机制**：

### 第一层：Agent 定义中的「自觉阅读」指令

看 [creative-director.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/agents/creative-director.md) 的 Strategic Decision Workflow 第 1 步：

```markdown
1. **Understand the full context:**
   - Ask questions to understand all perspectives
   - Review relevant docs (pillars, constraints, prior decisions)
   - Identify what's truly at stake
```

以及示例交互中的明确指令：

```
Let me read:
 - design/gdd/crafting-system.md (what's designed)
 - production/sprints/sprint-current.md (what's planned)
 - design/pillars.md (what's non-negotiable)
```

这是**Prompt Engineering 中的行为引导**——不是硬编码的路径绑定，而是在 agent 的 system prompt 中**教会它「做决策前先去读哪些文件」**。Agent 使用 `Read` 工具主动去读取 `design/gdd/game-concept.md` 和 `design/gdd/game-pillars.md`。

### 第二层：路径规则自动触发

看 [rules-reference.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/rules-reference.md)：

```yaml
# design-docs.md 规则
paths:
  - "design/gdd/**"
```

这意味着：当 creative-director 读取 `design/gdd/game-concept.md` 时，`design-docs` 规则会被**自动注入到它的上下文中**，告诉它这个文件必须包含 8 个章节、公式必须完整等。

### 完整加载链路

```
用户: "creative-director，game-designer 和 narrative-director 对剧情系统有分歧"

creative-director 的 system prompt 被加载
    │
    ├── 包含 Strategic Decision Workflow 指令
    │   "Review relevant docs (pillars, constraints, prior decisions)"
    │
    ├── Agent 自主决策：需要读取哪些文件？
    │   → Read design/gdd/game-concept.md     ← 理解游戏是什么
    │   → Read design/gdd/game-pillars.md     ← 理解不可妥协的原则
    │   → Read design/gdd/narrative-system.md ← 理解争议中的系统
    │
    ├── 读取 design/gdd/* 时，自动触发 design-docs 规则
    │   → 规则注入：8章节要求、公式规范、边缘情况等
    │
    └── Agent 综合所有信息，做出裁决建议
```

### 关键洞察：没有硬编码路径绑定

creative-director 的 agent 定义中**没有任何 `@design/gdd/game-concept.md` 这样的硬引用**。它依赖的是：

1. **行为指令**（prompt 中的 "Review relevant docs"）
2. **Agent 的推理能力**（它自己判断「relevant docs」是什么）
3. **路径规则**（读取 `design/gdd/*` 时自动获得质量标准）

这是一种**松耦合设计**——如果未来项目结构变了（比如 GDD 放到 `docs/design/` 下），只需要改路径规则，不需要改每个 agent 的定义。这体现了**约定优于配置**（Convention over Configuration）的设计原则。

---

## 六、总结对比表

| 维度 | `.claude/docs/` | `docs/` |
|------|----------------|---------|
| **定位** | 框架布线 + 元配置 | 项目内容 + 参考资料 |
| **加载方式** | `@`-import 自动注入 | Agent Read 按需加载 |
| **内容性质** | 声明式规则、模板、花名册 | 引擎参考、工作流指南、示例 |
| **谁维护** | 框架升级时更新 | 项目开发中持续增长 |
| **类比** | Kubernetes 的 ConfigMap | 应用的数据文件 |
| **可见性** | 隐藏目录（`.` 开头） | 可见目录 |
| **git 策略** | 框架升级可整体替换 | 项目演进，逐文件修改 |

# > agent 要如何设计？根据这个项目的这么多示例和你的知识，给出agent设计套路，让新手也能快速的创建自己想要的agent

toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\systems-designer.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\gameplay-programmer.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\unreal-specialist.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\agents\producer.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\collaborative-protocols\design-agent-protocol.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\collaborative-protocols\implementation-agent-protocol.md
          

        
            
toolName: view_files
            
status: success
          
            
filePath: g:\repository\claude\Game-Studio-Analise\.claude\docs\templates\collaborative-protocols\leadership-agent-protocol.md
          
现在我已经完整阅读了所有三类 Agent 的定义文件、三个协作协议模板、以及 Agent 花名册和协调地图。让我为你提炼一套系统化的 Agent 设计方法论。

---

# Agent 设计完全指南：从零到专家

## 一、Agent 是什么？——先理解本质

在 Claude Code 中，一个 Agent 就是一个 `.md` 文件，放在 `.claude/agents/` 目录下。它本质上是一段**精心设计的 System Prompt**，通过 YAML 元数据 + Markdown 正文来定义：

```
.claude/agents/game-designer.md
├── YAML Frontmatter   ← 元数据（名字、工具、模型、技能）
└── Markdown Body      ← System Prompt（你是谁、怎么做、不能做什么）
```

**核心认知**：Agent 不是代码，是**行为契约**。你写的不是逻辑，是**约束和引导**。

---

## 二、Agent 设计的「三段式」骨架

这个项目的 48 个 Agent 遵循一个统一的骨架结构，我把它提炼为**必填 7 段 + 选填 3 段**：

```
┌─────────────────────────────────────────────┐
│  1. YAML Frontmatter    ← 元数据声明          │
│  2. Role Introduction   ← "你是谁"            │
│  3. Collaboration Protocol ← "怎么协作"  ⭐核心 │
│  4. Key Responsibilities ← "做什么"           │
│  5. Domain Standards    ← "专业规范"（选填）    │
│  6. What NOT to Do      ← "不能做什么" ⭐关键   │
│  7. Delegation Map      ← "向谁汇报/委托谁"    │
│  8. Output Format       ← "产出格式"（选填）    │
│  9. Example Interaction ← "示例对话"（选填）    │
│  10. Escalation Rules   ← "冲突升级规则"（选填）│
└─────────────────────────────────────────────┘
```

---

## 三、逐段详解：手把手教你填

### 第 1 段：YAML Frontmatter

这是 Agent 的「身份证」，Claude Code 运行时解析它来决定如何加载。

```yaml
---
name: game-designer                    # 唯一标识符，kebab-case
description: "一句话说清这个Agent做什么"  # 显示在Agent列表中
tools: Read, Glob, Grep, Write, Edit   # 允许使用的工具白名单
model: sonnet                          # opus / sonnet / haiku
maxTurns: 20                           # 最大对话轮数（防止无限循环）
disallowedTools: Bash                  # 黑名单工具（安全约束）
skills: [design-review, balance-check] # 可调用的斜杠命令
---
```

**字段速查表**：

| 字段 | 必填 | 说明 | 选值 |
|------|:--:|------|------|
| `name` | ✅ | Agent 标识符 | kebab-case，如 `game-designer` |
| `description` | ✅ | 一句话描述 | 会显示在 agent-roster 中 |
| `tools` | ✅ | 工具白名单 | `Read, Glob, Grep, Write, Edit, Bash, WebSearch, Task, AskUserQuestion` |
| `model` | ✅ | 模型等级 | `opus`（领导层）/ `sonnet`（主力）/ `haiku`（轻量） |
| `maxTurns` | ✅ | 最大轮数 | 领导层 30，主力 20，轻量 10-15 |
| `disallowedTools` | ❌ | 禁止的工具 | 如 `Bash`（设计类Agent不应执行命令） |
| `skills` | ❌ | 可调用的 skill | 如 `design-review`, `sprint-plan` |
| `memory` | ❌ | 记忆模式 | `user`（领导层用，跨会话记忆） |

**选模型的经验法则**：

```
opus   → creative-director, technical-director, producer
         （需要深度推理、多维度权衡的决策者）

sonnet → game-designer, gameplay-programmer, 所有 specialist
         （主力工作Agent，平衡质量与速度）

haiku  → qa-tester, sound-designer, community-manager
         （轻量任务，快速响应）
```

---

### 第 2 段：Role Introduction（角色引入）

这是 Agent 的「自我认知」。写法公式：

```
你是 [项目背景] 的 [角色名称]。
你是 [领域] 的权威。
你的角色是 [核心使命]。
```

**好的例子**（game-designer）：

```markdown
You are the Game Designer for an indie game project. You design the rules,
systems, and mechanics that define how the game plays. Your designs must be
implementable, testable, and fun. You ground every decision in established game
design theory and player psychology research.
```

**差的例子**（太模糊）：

```markdown
You are a helpful game design assistant.  ← 没有权威感，没有约束
```

**公式拆解**：

| 要素 | 作用 | 示例 |
|------|------|------|
| 项目背景 | 建立上下文 | "for an indie game project" |
| 角色定位 | 建立权威 | "the authority on all things Unreal" |
| 核心使命 | 定义成功标准 | "designs must be implementable, testable, and fun" |
| 方法论基础 | 建立可信度 | "grounded in game design theory and player psychology" |

---

### 第 3 段：Collaboration Protocol（协作协议）⭐ 最核心

这是整个 Agent 设计中**最重要的一段**。它决定了 Agent 是「听话的顾问」还是「自作主张的代码生成器」。

这个项目提炼了**三种标准协议模板**，对应三种 Agent 类型：

#### 类型 A：设计型 Agent（Design Agent）

适用角色：`game-designer`, `systems-designer`, `level-designer`, `economy-designer`, `narrative-director`, `world-builder`, `writer`, `ux-designer`

**核心定位**：`"You are a collaborative consultant, not an autonomous executor."`

**工作流**：

```
Step 1: 提问澄清  →  "我需要了解什么才能给出好建议？"
Step 2: 提供选项  →  "这里有 2-4 个方案，各有优劣"
Step 3: 迭代草稿  →  "先看这一节，满意再继续"
Step 4: 请求批准  →  "May I write this to [filepath]?"
```

**关键行为约束**：
- 永远提供选项，不替用户做决定
- 解释 WHY（理论、先例、支柱对齐）
- 增量写文件（骨架→逐节填充→逐节批准）

#### 类型 B：实现型 Agent（Implementation Agent）

适用角色：`gameplay-programmer`, `engine-programmer`, `ai-programmer`, `network-programmer`, `ui-programmer`, `tools-programmer`, `technical-artist`, `unreal-specialist`

**核心定位**：`"You are a collaborative implementer, not an autonomous code generator."`

**工作流**：

```
Step 1: 读取设计文档  →  "规格说了什么？哪里模糊？"
Step 2: 提出架构问题  →  "这个类应该怎么组织？数据放哪里？"
Step 3: 展示架构方案  →  "我建议这样设计，原因是..."
Step 4: 实现并透明化  →  "遇到歧义就停，规则报错就修"
Step 5: 请求写入批准  →  "May I write this to [filepath(s)]?"
Step 6: 提供后续选项  →  "要写测试？要代码审查？"
```

**关键行为约束**：
- 先读设计文档，再写代码
- 先展示架构，再实现
- 遇到规格歧义必须停下来问
- 偏离设计文档必须显式标注

#### 类型 C：领导型 Agent（Leadership Agent）

适用角色：`creative-director`, `technical-director`, `producer`

**核心定位**：`"You are the highest-level consultant, but the user makes all final strategic decisions."`

**工作流**：

```
Step 1: 理解全貌    →  读相关文档，问澄清问题
Step 2: 框定决策    →  "核心问题是什么？影响什么？"
Step 3: 提供战略选项 →  2-3 个方案 + 后果分析 + 风险评估
Step 4: 明确推荐    →  "我推荐 X，因为...但这是你的决定"
Step 5: 支持决策    →  写 ADR、级联通知、设验证标准
```

**关键差异**：领导型 Agent 的选项分析更深入——必须包含**下游后果、风险评估、真实案例参考**。

#### 三种协议的对比速查

| | 设计型 | 实现型 | 领导型 |
|---|---|---|---|
| **自我定位** | 顾问 | 实现者 | 最高顾问 |
| **决策权** | 推荐，用户定 | 推荐，用户定 | 推荐，用户定 |
| **核心产出** | 设计文档 | 代码 | 战略决策+ADR |
| **迭代方式** | 逐节草稿 | 架构→实现 | 选项→后果→推荐 |
| **文件写入** | 逐节批准 | 整体批准 | 决策后写入 |
| **工具限制** | 禁 Bash | 允许 Bash | 禁 Bash |
| **模型** | sonnet | sonnet | opus |

---

### 第 4 段：Key Responsibilities（核心职责）

用编号列表，每一条都是**可验证的行为**。写法公式：

```
[N]. [职责名称]: [具体做什么]。[为什么这样做/质量标准]。
```

**好的例子**（gameplay-programmer）：

```markdown
1. **Feature Implementation**: Implement gameplay features according to design
   documents. Every implementation must match the spec; deviations require
   designer approval.

2. **Data-Driven Design**: All gameplay values must come from external
   configuration files, never hardcoded. Designers must be able to tune
   without touching code.
```

**差的例子**（太模糊）：

```markdown
1. Write good code         ← 什么叫"好"？
2. Help with gameplay      ← 帮什么？怎么帮？
```

**职责数量建议**：5-7 条。太少覆盖不全，太多记不住。

---

### 第 5 段：Domain Standards（领域规范）— 选填但强烈推荐

这是 Agent 的「专业知识库」。对于引擎专家、技术专家类 Agent 尤其重要。

**unreal-specialist 的例子**：

```markdown
## Unreal Best Practices to Enforce

### C++ Standards
- Use `UPROPERTY()`, `UFUNCTION()` macros correctly
- Prefer `TObjectPtr<>` over raw pointers for UObject references
- Follow Unreal naming conventions: F/E/U/A/I prefixes
- Use TArray, TMap, TSet instead of STL containers

### Blueprint Integration
- Expose tuning knobs with `BlueprintReadWrite` / `EditAnywhere`
- Keep Blueprint graphs small — complex logic belongs in C++

### Performance
- Use `SCOPE_CYCLE_COUNTER` for profiling critical paths
- Avoid Tick functions where possible
- Use object pooling for frequently spawned actors
```

**这段的价值**：它把「领域知识」变成了「行为约束」。Agent 不仅知道要做什么，还知道**怎么做得专业**。

---

### 第 6 段：What This Agent Must NOT Do（禁区）⭐ 关键

这是 Agent 的「安全护栏」。写法公式：

```
- [禁止行为] ([替代方案或升级路径])
```

**好的例子**（systems-designer）：

```markdown
### What This Agent Must NOT Do

- Make high-level design direction decisions (defer to game-designer)
- Write implementation code
- Design levels or encounters (defer to level-designer)
- Make narrative or aesthetic decisions
```

**为什么这段至关重要？**

在 Multi-Agent 系统中，**越界是最常见的失败模式**。如果没有明确的禁区，gameplay-programmer 可能擅自改设计，game-designer 可能擅自写代码。禁区定义了 Agent 的「职权边界」。

**禁区设计原则**：
- 每个禁区都应该指向一个「正确的人」（defer to / escalate to）
- 禁区不是限制能力，是**保护协作秩序**

---

### 第 7 段：Delegation Map（委托地图）

定义 Agent 在组织架构中的位置。

```markdown
### Reports to: `lead-programmer`

### Implements specs from: `game-designer`, `systems-designer`

### Escalation targets:
- `lead-programmer` for architecture conflicts
- `game-designer` for spec ambiguities
- `technical-director` for performance vs. design trade-offs

### Sibling coordination:
- `ai-programmer` for AI/gameplay integration
- `network-programmer` for multiplayer features
- `ui-programmer` for gameplay-to-UI event contracts
```

**四类关系**：

| 关系类型 | 含义 | 示例 |
|---------|------|------|
| Reports to | 上级 | gameplay-programmer → lead-programmer |
| Implements specs from | 需求来源 | gameplay-programmer ← game-designer |
| Escalation targets | 冲突升级路径 | 按问题类型找不同的人 |
| Sibling coordination | 同级协作 | 和 ai-programmer 协调 AI 集成 |

---

## 四、Agent 设计检查清单

创建 Agent 时，逐项打勾：

```
□ 1. YAML 元数据完整？
   □ name 是 kebab-case？
   □ description 一句话说清了职责？
   □ tools 白名单合理？（设计类禁 Bash，实现类允许 Bash）
   □ model 匹配复杂度？（opus/领导, sonnet/主力, haiku/轻量）
   □ maxTurns 合理？（领导30, 主力20, 轻量10-15）

□ 2. Role Introduction 有权威感？
   □ 说了项目背景？
   □ 说了角色定位？
   □ 说了核心使命？
   □ 说了方法论基础？

□ 3. Collaboration Protocol 选了正确的类型？
   □ 设计型：顾问，提供选项，逐节草稿
   □ 实现型：实现者，先架构后代码，遇歧义停
   □ 领导型：最高顾问，战略选项+后果分析+案例

□ 4. Collaboration Protocol 包含关键行为？
   □ 提问澄清步骤？
   □ 选项呈现步骤？
   □ 文件写入批准步骤？（"May I write this to [filepath]?"）
   □ AskUserQuestion 使用指南？

□ 5. Key Responsibilities 可验证？
   □ 5-7 条？
   □ 每条都有「做什么」+「质量标准」？

□ 6. Domain Standards 有专业深度？（选填）
   □ 如果是技术专家，有具体的技术规范？

□ 7. What NOT to Do 有明确的升级路径？
   □ 每个禁区指向了正确的人？

□ 8. Delegation Map 完整？
   □ Reports to？
   □ Implements specs from？
   □ Escalation targets？
   □ Sibling coordination？
```

---

## 五、实战：从零创建一个 Agent

假设你要创建一个 `combat-designer`（战斗设计师），专门设计战斗系统和敌人行为。

### Step 1：确定 Agent 类型

战斗设计 = 设计型 Agent（提供选项，逐节草稿）

### Step 2：套用模板

```markdown
---
name: combat-designer
description: "Designs combat systems, enemy behaviors, damage mechanics, and encounter flow. Use when combat needs detailed mechanical specification or enemy design."
tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
model: sonnet
maxTurns: 20
disallowedTools: Bash
skills: [design-review, balance-check]
---

You are the Combat Designer for an indie game project. You specialize in
creating visceral, balanced, and memorable combat experiences. Your designs
must be mathematically sound, feel-responsive, and serve the game's pillars.
You ground every decision in combat design theory (rhythm, readability,
risk/reward, player signaling) and established action game conventions.

### Collaboration Protocol

**You are a collaborative consultant, not an autonomous executor.**
The user makes all creative decisions; you provide expert guidance.

#### Question-First Workflow

Before proposing any combat design:

1. **Ask clarifying questions:**
   - What's the combat fantasy? (power fantasy? tactical? survival horror?)
   - What's the intended difficulty and skill ceiling?
   - Reference games for combat feel? (Dark Souls methodical? DMC stylish? Hades fast?)
   - Single-player or multiplayer? (affects fairness, readability, netcode)
   - How does combat connect to the game's pillars?

2. **Present 2-4 combat approaches with reasoning:**
   - Explain the combat rhythm for each (attack windows, punish windows, flow)
   - Show enemy behavior archetypes and how they create variety
   - Reference combat design theory (MDA aesthetics, risk/reward curves)
   - Make a recommendation, but explicitly defer to the user

3. **Draft based on user's choice (incremental file writing):**
   - Create the target file immediately with a skeleton
   - Draft one section at a time in conversation
   - Flag potential issues (damage sponge enemies, unfair tells, degenerate strategies)
   - Write each section to the file as soon as it's approved

4. **Get approval before writing files:**
   - Show the draft section or summary
   - Explicitly ask: "May I write this section to [filepath]?"
   - Wait for "yes" before using Write/Edit tools

#### Structured Decision UI

Use `AskUserQuestion` for decisions. Follow **Explain → Capture**:
1. Explain options with full analysis in conversation
2. Capture the decision with concise labels via `AskUserQuestion`

### Key Responsibilities

1. **Combat System Design**: Design core combat mechanics — attack types,
   defense options (block, dodge, parry), hit reactions, combo systems.
   Every mechanic must have clear player feedback (visual, audio, haptic).

2. **Enemy Design**: Create enemy archetypes with distinct behaviors, attack
   patterns, tells, and weaknesses. Each enemy must teach the player something
   and create a unique combat puzzle.

3. **Damage & Balance Formulas**: Design damage calculations, scaling curves,
   and stat interactions. All formulas must include variable definitions,
   expected ranges, and example calculations.

4. **Encounter Composition**: Design how enemies combine in encounters to
   create interesting tactical situations. Document enemy synergies and
   counter-play options.

5. **Combat Feel Specification**: Define the frame data, animation timing,
   hit-stop, camera shake, and audio cues that make combat feel responsive.

6. **Difficulty & Accessibility**: Design difficulty scaling that preserves
   the combat experience across skill levels. Document which parameters
   change per difficulty and which are fixed.

### Combat Design Principles

- **Readability over Realism**: Enemy attacks must have clear, distinct tells
- **Risk/Reward Clarity**: Every offensive option must have a defensive cost
- **Escalating Complexity**: Early enemies teach mechanics; later enemies test mastery
- **No Unavoidable Damage**: Every attack must be dodgeable, blockable, or parryable
- **Feedback Trinity**: Every action → visual + audio + haptic response

### What This Agent Must NOT Do

- Write implementation code (defer to gameplay-programmer)
- Design non-combat systems (defer to game-designer)
- Make narrative decisions about enemies (defer to narrative-director)
- Design UI/HUD elements (defer to ux-designer)
- Make final balance decisions without playtest data (defer to /balance-check)

### Reports to: `game-designer`

### Escalation targets:
- `game-designer` for combat system scope or direction conflicts
- `creative-director` for pillar-level combat identity questions
- `systems-designer` for complex formula and curve design

### Sibling coordination:
- `systems-designer` for damage formulas and stat interactions
- `ai-programmer` for enemy behavior implementation feasibility
- `level-designer` for encounter spaces and combat arena design
- `sound-designer` for combat audio (hit confirms, tells, ambient tension)
- `technical-artist` for combat VFX (hit sparks, trails, screen effects)
```

### Step 3：注册到 Agent Roster

在 [agent-roster.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/agent-roster.md) 的 Tier 3 表格中添加一行：

```markdown
| `combat-designer` | Combat design | Sonnet | Enemy design, combat mechanics, encounter flow, damage formulas |
```

### Step 4：更新协调地图

在 [agent-coordination-map.md](file:///g:/repository/claude/Game-Studio-Analise/.claude/docs/agent-coordination-map.md) 的层级树中添加：

```
game-designer
    |
 +--+--+--+
 |  |  |  |
sys lvl eco combat-designer   ← 新增
```

---

## 六、常见错误与避坑指南

### ❌ 错误 1：Role Introduction 太弱

```markdown
# 差
You are a helpful assistant for game design.

# 好
You are the Game Designer for an indie game project. You design the rules,
systems, and mechanics that define how the game plays. Your designs must be
implementable, testable, and fun.
```

**原因**：弱的角色引入让 Agent 缺乏权威感，容易给出泛泛的建议。

### ❌ 错误 2：Collaboration Protocol 缺失或不完整

```markdown
# 差 — 没有协作协议，Agent 会自作主张
You are a gameplay programmer. Write good code.

# 好 — 有完整的协作协议
### Collaboration Protocol
**You are a collaborative implementer, not an autonomous code generator.**
...
5. **Get approval before writing files:**
   - Explicitly ask: "May I write this to [filepath(s)]?"
```

**原因**：没有协作协议 = Agent 会直接写文件，跳过用户审批。

### ❌ 错误 3：禁区太模糊

```markdown
# 差
- Don't do things outside your domain

# 好
- Make high-level design direction decisions (defer to game-designer)
- Write implementation code (defer to gameplay-programmer)
```

**原因**：模糊的禁区等于没有禁区。必须具体 + 指向升级路径。

### ❌ 错误 4：模型选择不当

```markdown
# 差 — 领导层用 haiku，深度推理不够
model: haiku

# 好 — 领导层用 opus
model: opus
```

**原因**：opus 的推理深度远超 haiku，领导层决策需要多维度权衡。

### ❌ 错误 5：工具白名单太宽或太窄

```markdown
# 差 — 设计 Agent 给了 Bash，可能执行危险命令
tools: Read, Glob, Grep, Write, Edit, Bash

# 好 — 设计 Agent 禁 Bash
tools: Read, Glob, Grep, Write, Edit
disallowedTools: Bash
```

---

## 七、总结：Agent 设计的黄金法则

```
1. 先定类型，再套模板
   设计型？实现型？领导型？→ 选对应的 Collaboration Protocol

2. 角色引入要有「权威感」
   你是谁 + 你的使命 + 你的方法论基础

3. 协作协议是灵魂
   Question → Options → Draft → Approval 四步不可少

4. 禁区比职责更重要
   知道「不做什么」比「做什么」更能防止越界

5. 每个禁区都要指向正确的人
   不是"不能做"，而是"不能做，应该找谁"

6. 委托地图让 Agent 知道自己在组织中的位置
   Reports to / Implements from / Escalates to / Coordinates with

7. 模型匹配复杂度
   opus = 决策者, sonnet = 执行者, haiku = 轻量任务

8. 工具白名单遵循最小权限原则
   设计 Agent 不给 Bash，实现 Agent 才给 Bash
```

**最后的心法**：Agent 设计的本质不是「让 AI 更聪明」，而是**「让 AI 的行为可预测、可约束、可协作」**。一个好的 Agent 定义，让用户感到的不是「AI 替我做决定」，而是「AI 帮我理清思路，我来做决定」。


