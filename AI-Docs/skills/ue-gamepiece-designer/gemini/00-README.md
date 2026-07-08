# Claude Code Skill 源码级拆解 → 虚幻引擎自动化迁移

> 本系列文档以仓库内 `Game-Skills/gamepiece-designer/ue57-gamepiece-designer/` 这个**真实可运行**的 Claude Code Skill 为唯一解剖样本，做一次完整的源码级拆解，并最终把这套模式迁移到虚幻引擎自动化场景。
>
> 目标读者：**有工程基础但首次接触 Claude Code Skill 的开发者**。语言通俗、技术细节严谨，所有结论都对照源文件行号，可在阅读时打开源文件同步对照。
>
> 学习路径：1 → 2 → 3 → 4 → 5 → 6，每篇自包含但层层递进。
> - 第 1-3 篇是基础（架构 / 源码 / 写作教程），必读
> - 第 4 篇是 UE 自动化迁移实战
> - 第 5、6 篇是进阶主题（examples / 改造指南），可在掌握前 4 篇后按需阅读
> - **想直接改造 skill 用到自己项目**：可跳读第 6 篇，但建议先看第 1、3 篇建立概念

---

## 案例 Skill 速览

被分析的 skill 叫 `ue57-gamepiece-designer`，作用是：**当用户提出 UE5.7 多人游戏部件设计需求时，输出一份结构化、可直接落地的纯文本设计方案**（蓝图配方 / 数据表 schema / 命名规范 / 网络检查清单）。

它的源文件结构（完整且最小）：

```
Game-Skills/gamepiece-designer/ue57-gamepiece-designer/
├── SKILL.md                          ← 核心定义（行为守则 + 输出契约）
├── _meta.json                        ← 元数据（slug / version / 发布信息）
└── Templates/                        ← 模板工具层
    ├── BlueprintRecipe_Template.md   ← 蓝图配方骨架
    ├── Checklist_Networking.md       ← 多人网络 4 维度检查清单
    └── Schema_Ability_DT.csv         ← DataTable 字段示例（可直接导入 UE）
```

> **注**：当前案例**没有** `examples/` 目录。第 5 篇会讲这个目录何时该加、
> 如何发挥作用，并给出为案例 skill 添加 3 个完整范例的实现方案。

整个 skill 总共不到 150 行，但麻雀虽小五脏俱全——它是学习 skill 工程化的**最佳样本**：足够小到能逐行读完，足够完整到能覆盖 skill 设计的所有关键决策。

---

## 文档地图

| # | 文件 | 主题 | 核心问题 |
|---|---|---|---|
| 0 | `00-README.md` | 导览 | 你正在看 |
| 1 | [01-core-architecture.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/01-core-architecture.md) | 核心设计架构（Why & What） | 解决什么问题？生命周期？目录为何这样设计？ |
| 2 | [02-source-deep-dive.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/02-source-deep-dive.md) | 技术细节与源码拆解（How） | 参数解析 / 工具交互 / 错误处理 / 状态管理 |
| 3 | [03-skill-writing-tutorial.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/03-skill-writing-tutorial.md) | 保姆级教程：写一个标准 Claude Code Skill | 通用模板 + 标准步骤 + 避坑指南 |
| 4 | [04-ue-automation-migration.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/04-ue-automation-migration.md) | 实战迁移：虚幻引擎自动化技能 | 桥接 unreal Python / Web Remote Control，附 UE_AssetCheck / UE_LightSetup 完整设计 |
| 5 | [05-examples-guide.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/05-examples-guide.md) | examples/ 目录：何时用、如何发挥作用、怎么加 | few-shot 机制 + 与 Templates 区别 + 为案例 skill 添加 3 个完整范例 |
| 6 | [06-skill-customization-guide.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/06-skill-customization-guide.md) | 改造指南：把 skill 改造成适合自己项目流程 | 5 维度决策矩阵 + 7 步法 + 4 个项目类型案例 + 8 条避坑 |

---

## 阅读约定

1. **行号引用格式**：`SKILL.md:8-14` 表示 SKILL.md 文件第 8–14 行。
2. **源文件可点击**：所有引用源文件的位置都用 markdown 链接包裹，可点击跳转。
3. **是什么 / 怎么做 / 为什么**：每个关键点都按这三维度拆解，便于结构化记忆。
4. **伪代码块**：第 4 篇涉及 UE Python 自动化，所有伪代码均可直接复制改造（替换路径/类名即可）。

---

## 学习前的认知校准

在开始前，先纠正几个初学者最常见的误解：

| 误解 | 真相 |
|---|---|
| Skill 是一段可执行代码 | ❌ Skill 是一份**结构化 Markdown 指令**，本身不"运行" |
| Skill 调用 API 来完成任务 | ❌ Skill 只指导 Claude 怎么回答；调不调 API 取决于 SKILL.md 是否授权 |
| Skill 文件越多越强 | ❌ skill 强不强看 SKILL.md 的精度，文件多反而增加 token 负担 |
| 写 skill 必须会 Python/C++ | ❌ 写 skill 只需会写 Markdown；要让 skill 真的执行 UE 操作才需要 Python（见第 4 篇） |
| `description` 是给人看的说明 | ❌ `description` 是给系统做**触发匹配**的关键字段，决定 skill 是否被启用 |
| `examples/` 和 `Templates/` 是一回事 | ❌ Templates 是**待填充骨架**（占位符），examples 是**已填充范例**（标杆输出）。详见第 5 篇 |
| `examples/` 会自动注入上下文 | ❌ examples 按需读取，不自动注入。最可靠的方式是 SKILL.md 显式引用（详见第 5 篇） |

校准完毕后，从 [01-core-architecture.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/01-core-architecture.md) 开始阅读。
