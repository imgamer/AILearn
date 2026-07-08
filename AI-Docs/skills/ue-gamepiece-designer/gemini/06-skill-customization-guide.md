# 第 6 篇：把 ue57-gamepiece-designer 改造成适合自己项目的技能

> 本篇回答一个最实际的问题：**`ue57-gamepiece-designer` 是为"UE5.7 多人 40v40 对战"设计的，
> 我的项目流程跟它不一样（可能是单机 / 手游 / MMORPG / 5v5 MOBA），怎么把它改造成适合自己的 skill？**
>
> 包含四部分：
> 1. **为什么需要改造** — 技术原理：skill 的"通用性 vs 项目特异性"权衡
> 2. **改造方案总览** — 5 个维度的改造决策矩阵
> 3. **按步骤的执行计划** — 7 步法 + 每步的"为什么"和"怎么做"
> 4. **常见改造场景案例 + 避坑指南**
>
> 阅读建议：先读第 1 章建立认知，再带着自己的项目情况对照第 2、3 章逐步改造。

---

## 1. 为什么需要改造：技术原理

### 1.1 一句话回答

因为 `ue57-gamepiece-designer` 的默认值（UE5.7 / 多人 / 40v40 / 服务器权威）是它的**作者**为某个具体项目类型做的选择，**不是 UE 的普适真理**。你的项目流程不同，默认值就该不同。

### 1.2 skill 的"通用性 vs 项目特异性"权衡

理解改造的本质，先要看清 skill 内容的两种性质：

```
SKILL.md 的内容
   │
   ├── 通用部分（不需要改）
   │   • 触发句式（When-Then）
   │   • 安全规则（Do NOT + 替代行为）
   │   • 输出 6 段结构（Goal/Inputs/Outputs/Assumptions/Implementation/Test）
   │   • 占位符语法（<尖括号>）
   │   • 可覆盖声明语法（(default) / (unless specified)）
   │   ↓ 这些是 skill 工程化的"骨架"，跨项目通用
   │
   └── 项目特异部分（需要改）
       • 具体的命名前缀（BP_/DT_/NS_ 等）
       • 多人模型默认值（40v40、Server 权威）
       • 性能基线（200 粒子、80m cull）
       • UE 版本（5.7）
       • 资产根路径（/Game/Systems/）
       • 测试场景（Dedicated Server + 2 Clients）
       ↓ 这些是作者为某个项目类型做的"填充"
```

**改造的本质**：保留通用骨架，替换项目特异的填充。这个区分是改造的指导原则——改错地方（动了骨架）会让 skill 失去稳定性，不改该改的地方（保留别人的填充）会让 skill 不贴合你的项目。

### 1.3 为什么不能"直接用"

直接用原版 skill 在不匹配的项目里会出现 3 类问题：

| 问题 | 表现 | 后果 |
|---|---|---|
| **默认值不匹配** | 单机游戏用 40v40 默认值，输出全是 Replication Notes | 输出臃肿、无关内容多 |
| **命名前缀不匹配** | 你项目用 `BPI_` 但原版用 `IFace_`，或反之 | Claude 按原版输出，与你项目冲突 |
| **测试场景不匹配** | 手游项目要测"低端机帧率"，原版测"Dedicated Server" | 测试清单用不上 |

这 3 类问题都不是"skill 坏了"，而是"skill 不合身"。改造就是让它合身。

### 1.4 改造的技术原理：约束替换

skill 的工作机制是"用自然语言约束 Claude 的输出"（见第 2 篇）。改造就是**替换约束**：

```
原版约束                          改造后约束
─────────                        ─────────
"40v40+ scale"          →        "10v10 MOBA"
"Server authoritative"  →        "Single-player, no replication"
"BP_<Thing>"            →        "BPickup_<Thing>"（你项目的前缀）
"UE 5.7"                →        "UE 5.4"
"/Game/Systems/"        →        "/Game/Content/Gameplay/"
```

约束替换后，Claude 生成的输出会自动贴合新约束。**这就是改造的全部魔法**——没有代码逻辑，只是文本约束的替换。

### 1.5 改造 vs 重写：为什么选改造

初学者常问："既然要改这么多，不如从头写一个？"

| 维度 | 改造 | 重写 |
|---|---|---|
| 工作量 | 低（改 20-30% 内容） | 高（从零写 100%） |
| 风险 | 低（保留经过验证的骨架） | 高（可能写错结构） |
| 学习收益 | 高（对照原版理解每处改动） | 中（没有参照物） |
| 适用 | 项目流程与原版有 60%+ 重叠 | 项目领域完全不同 |

**结论**：只要你的项目还是"UE + 游戏部件设计"这个大领域，**改造比重写更优**。只有当你的领域完全不同（比如想做"UE 关卡流水线 skill"或"UE 材质节点 skill"）时，才考虑重写。

---

## 2. 改造方案总览：5 个维度的决策矩阵

改造不是"乱改一通"，而是按 5 个维度逐一决策。下面这张矩阵帮你快速判断每个维度该不该改、怎么改。

### 2.1 改造维度决策矩阵

| 维度 | 原版默认值 | 该改吗？ | 改造方式 | 影响范围 |
|---|---|---|---|---|
| **① UE 版本** | UE 5.7 | 看你项目版本 | 改 description + What 段 | API 名称、节点名 |
| **② 多人模型** | 多人 40v40 服务器权威 | 看你项目类型 | 改 Multiplayer defaults 段 + 可能简化 Replication Notes | 输出结构、测试场景 |
| **③ 命名前缀** | BP_/DT_/BPI_/NS_ 等 | 看你项目规范 | 改 UE naming 段 | 所有产物的命名 |
| **④ 资产路径** | /Game/Systems/<SystemName>/ | 看你项目结构 | 改 UE naming 段的 Root | 资产树画法 |
| **⑤ 性能基线** | 200 粒子、80m cull | 看你项目目标平台 | 改 Multiplayer defaults / Performance 段 | 测试清单、优化建议 |

下面逐一展开。

### 2.2 维度 ①：UE 版本

**原版**：`UE 5.7`（写在 description 和 What 段）

**该改吗**：
- 你项目用 UE 5.7 → **不改**
- 你项目用 UE 5.4/5.5/5.6 → **改**（API 有差异）
- 你项目用 UE 4.27 → **必改**（API 差异巨大）

**怎么改**：
```yaml
# 原 description
description: Designs UE5.7 multiplayer-friendly game pieces ...

# 改造后（假设你用 UE 5.5）
description: Designs UE5.5 multiplayer-friendly game pieces ...
```

```markdown
# 原 What 段
... ready to implement in Unreal Engine 5.7:

# 改造后
... ready to implement in Unreal Engine 5.5:
```

**为什么**：UE 各版本 API 差异大（5.7 的 Niagara 模块名、GAS API、MPC 用法与 5.4 不同）。写死版本能让 Claude 用对应版本的 API，避免输出过时或超前的节点名。

### 2.3 维度 ②：多人模型（最关键的改造维度）

**原版**：
```markdown
## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic
```

**该改吗**：这是最需要按项目类型改造的维度。

| 项目类型 | 该改吗 | 改成什么 |
|---|---|---|
| 单机游戏 | **必改** | 删掉多人段，输出格式简化 Replication Notes |
| 5v5 MOBA | 改 | 40v40 → 5v5，性能基线放宽 |
| 10v10 / 16v16 | 改 | 40v40 → 你的规模 |
| MMORPG（百人同屏） | 改 | 40v40 → 100+，加带宽预算段 |
| 手游（弱网络） | 改 | 加"高延迟容忍"规则 |
| 原版的 40v40 对战 | **不改** | — |

**怎么改**（以单机游戏为例）：

```markdown
# 删除原 Multiplayer defaults 段，替换为：

## Game type defaults (unless user says otherwise)
- Single-player game, no networking
- No RPC / Replication needed
- All logic runs on the single game thread
- Prefer Events/Interfaces over tick-heavy logic
- Save game integration required (use USaveGame)
```

同时改 Output format 段，把 Replication Notes 子段删掉或改成"Save Game Notes"：

```markdown
## Output format (always)
1) **Goal**
2) **Inputs**
3) **Outputs**
4) **Assumptions**
5) **Implementation**
   - **Blueprint Recipe** (step-by-step)
   - **Save Game Notes** (what to persist, save format, load flow)  ← 替换 Replication Notes
   - **Assets / Naming / Folders**
6) **Test Checklist**
```

**为什么**：单机游戏硬塞 Replication Notes 会让输出臃肿且无关。替换成"Save Game Notes"才是单机游戏的真痛点。**输出格式要跟着项目类型走**，不是死守 6 段原文。

### 2.4 维度 ③：命名前缀

**原版**：
```markdown
- Blueprints: `BP_<Thing>`
- Components: `BPComp_<Thing>`
- Interfaces: `BPI_<Thing>`
- DataTables: `DT_<Thing>`
- DataAssets: `DA_<Thing>`
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`
```

**该改吗**：
- 你项目用 Epic 官方前缀（BP_/DT_/BPI_） → **不改**
- 你项目有自定义前缀 → **改**
- 你项目没规范 → **不改**（用原版的，反正比你瞎定强）

**怎么改**（假设你项目用 `BPickup_` / `IFace_` / `Tbl_`）：

```markdown
## UE naming + folders (default)
- Root: `/Game/Content/Gameplay/<SystemName>/`
- Blueprints: `BPickup_<Thing>`        ← 改
- Components: `BPickupComp_<Thing>`    ← 改
- Interfaces: `IFace_<Thing>`          ← 改
- DataTables: `Tbl_<Thing>`            ← 改
- DataAssets: `DA_<Thing>`             ← 保留
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`  ← 保留
```

**为什么**：命名前缀是 UE 资产管理的基石。Claude 按你项目的前缀输出，你才能直接复制粘贴用，不用再手工改命名。

### 2.5 维度 ④：资产路径

**原版**：`Root: /Game/Systems/<SystemName>/`

**该改吗**：
- 你项目用 `/Game/Systems/` → **不改**
- 你项目用别的结构（如 `/Game/Content/Gameplay/`） → **改**

**怎么改**：
```markdown
- Root: `/Game/Content/Gameplay/<SystemName>/`
```

**为什么**：路径不对会让 Claude 输出的资产树跟你项目结构对不上，复制粘贴后还要手工挪。改对路径能让输出"开箱即用"。

### 2.6 维度 ⑤：性能基线

**原版**（隐含在 Multiplayer defaults 里）：
- 40v40+ scale
- Prefer Events/Interfaces over tick-heavy logic

**该改吗**：
- 同样规模的对战游戏 → **不改**
- 手游 / MMO / 单机 → **改**

**怎么改**（手游为例）：

```markdown
## Performance defaults (unless user says otherwise)
- Target: mobile (iOS A12 / Android mid-range)
- Max actors per frame: 50
- Max particles per effect: 100 (mobile budget)
- Avoid Tick; use Timer with 0.1s interval minimum
- Texture max: 1024x1024 (mobile)
- Draw calls budget: <2000 per frame
- LOD: 3 levels required for all meshes
```

**为什么**：手游的性能预算跟 PC 40v40 完全不同。写死量化指标能让 Claude 在生成方案时主动考虑这些限制（比如主动加 LOD、主动控制粒子数）。

### 2.7 改造决策速查表

把上面 5 个维度浓缩成一张速查表，改造时对着打勾：

```
□ 维度 ① UE 版本：我项目用 ___ → 改 description + What 段的版本号
□ 维度 ② 多人模型：我项目是 ___ → 改 Multiplayer defaults 段（必要时改 Output format 的 Replication 子段）
□ 维度 ③ 命名前缀：我项目用 ___ → 改 UE naming 段的前缀
□ 维度 ④ 资产路径：我项目根路径是 ___ → 改 UE naming 段的 Root
□ 维度 ⑤ 性能基线：我项目目标平台是 ___ → 改性能段，加量化指标
```

5 项打完勾 = 改造方案定稿。

---

## 3. 按步骤的执行计划：7 步法

下面是完整的 7 步改造流程。每步都讲"做什么 / 怎么做 / 为什么"。

### Step 1：项目流程画像（动手前最重要的一步）

**做什么**：用 10 分钟回答 8 个问题，把你项目的流程画清楚。

**怎么做**：填这张表（示例用"5v5 MOBA 手游"项目）：

| 问题 | 你的回答（示例） |
|---|---|
| UE 版本？ | UE 5.5 |
| 项目类型？ | 5v5 MOBA |
| 平台？ | 移动端（iOS + Android） |
| 网络模型？ | 服务器权威，5v5 |
| 命名前缀？ | BP_/DT_/BPI_（用 Epic 官方） |
| 资产根路径？ | `/Game/Content/Gameplay/` |
| 性能预算？ | 30fps 最低，draw call <2000 |
| 测试场景？ | PIE / Dedicated Server 5v5 / 弱网络（300ms） |

**为什么**：没有这张画像，改造就是盲改。这一步逼你想清楚项目的关键约束，后面所有改动都基于这张表。**80% 的改造失败都败在画像没画清楚**。

### Step 2：Fork 原版 skill 到你的目录

**做什么**：复制原版 skill 文件夹，改名。

**怎么做**：

```bash
# 假设原版在
cp -r Game-Skills/gamepiece-designer/ue57-gamepiece-designer \
      Game-Skills/gamepiece-designer/my-moba-gamepiece-designer
```

改名规则：`<你的项目简称>-gamepiece-designer`。比如：
- MOBA 项目 → `moba-gamepiece-designer`
- 单机 RPG → `singleplayer-rpg-gamepiece-designer`
- 手游 → `mobile-gamepiece-designer`

**为什么**：
- **Fork 不修改原版**：原版是参考样本，改坏了自己还有原版对照。直接改原版会丢失参照物。
- **改名 = 改 slug**：slug 必须与你的项目相关，避免与原版冲突（两个 skill 都叫 `ue57-gamepiece-designer` 会触发混乱）。
- **保留 "gamepiece-designer" 后缀**：表明这是 gamepiece 类 skill，便于将来发现和分类。

### Step 3：改 `_meta.json` 的 slug 和 version

**做什么**：更新元数据。

**怎么做**：

```json
{
  "ownerId": "<your-owner-id>",
  "slug": "my-moba-gamepiece-designer",        ← 改成你的 slug
  "version": "0.1.0",                          ← 从 0.1.0 开始（你的第一版）
  "publishedAt": 1773600000000                 ← 当前时间戳
}
```

**为什么**：
- **slug 与文件夹名、SKILL.md 的 name 三者必须一致**（第 1 篇讲过的硬约束）。
- **version 从 0.1.0 重新开始**：这是你的第一版，与原版的 0.1.0 没有版本继承关系（你是 fork，不是原版的升级）。
- **ownerId 换成你的**：表明你是这个改造版的维护者。

### Step 4：改 SKILL.md（核心改造）

**做什么**：按第 2 章的 5 个维度逐一改 SKILL.md。

**怎么做**：按顺序改 5 个地方：

#### 改动 1：YAML 头的 name 和 description

```yaml
---
name: my-moba-gamepiece-designer                          ← 改
description: Designs UE5.5 MOBA 5v5 game pieces (Blueprint chains, data schemas, asset naming, mobile perf checklist). Text-only, no scripts.
                                                          ← 改：版本、项目类型、规模、平台
---
```

#### 改动 2：标题和 What 段

```markdown
# MOBA Gamepiece Designer (Text-Only)                     ← 改标题

## What this skill does
When the user asks for a UE system or "game piece", produce a structured design that is ready to implement in Unreal Engine 5.5:    ← 改版本
- Blueprint node chain recipes (ordered steps, node names, variables, events)
- DataTable / DataAsset schemas (field list + example rows)
- Asset / folder plan (paths + naming)
- Multiplayer sanity: server/client responsibility, replication notes (5v5 scale)  ← 改规模
- Performance checklist (mobile budget, draw calls, LOD)                          ← 改性能维度
- Test checklist (PIE, dedicated server 5v5, weak network 300ms)                  ← 改测试场景
```

#### 改动 3：UE naming 段（按 Step 1 的画像改）

```markdown
## UE naming + folders (default)
- Root: `/Game/Content/Gameplay/<SystemName>/`             ← 改路径
- Blueprints: `BP_<Thing>`                                 ← 保留（用 Epic 官方）
- Components: `BPComp_<Thing>`
- Interfaces: `BPI_<Thing>`
- DataTables: `DT_<Thing>`
- DataAssets: `DA_<Thing>`
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`
```

#### 改动 4：Multiplayer defaults 段（按项目类型改）

```markdown
## Multiplayer defaults (unless user says otherwise)
- Authoritative actions happen on the Server
- Client sends intent (RPC) when needed
- Replicate only what's necessary for 5v5 scale             ← 改规模
- Max 10 players per match (5v5)
- Tick rate: server 30Hz, client 60Hz
- Prefer Events/Interfaces over tick-heavy logic
```

#### 改动 5：（可选）新增 Performance defaults 段

```markdown
## Performance defaults (unless user says otherwise)        ← 新增段
- Target: mobile (iOS A12 / Android mid-range)
- Frame rate: 30fps minimum, 60fps target
- Draw calls budget: <2000 per frame
- Max particles per effect: 100 (mobile budget)
- Texture max: 1024x1024
- LOD: 3 levels required for all meshes
- Avoid Tick; use Timer with 0.1s interval minimum
```

**为什么**：
- **5 处改动按依赖顺序**：YAML 头 → What 段 → naming → multiplayer → performance。先改身份（name/description），再改触发条件（What），最后改填充内容（naming/multiplayer/performance）。
- **保留 `(default)` 和 `(unless user says otherwise)`**：这些可覆盖声明是骨架的一部分，**不要改**。它们让你在用户提特殊需求时仍能切换。
- **改动用 diff 思维**：每改一处，问自己"这处是骨架还是填充"。骨架不动，填充才改。

### Step 5：改 Templates（按你的输出格式调整）

**做什么**：如果改了 Output format 的子段（比如单机项目把 Replication Notes 换成 Save Game Notes），对应的 Templates 也要改。

**怎么做**：

- **保留不变的模板**：`BlueprintRecipe_Template.md`、`Schema_Ability_DT.csv`（结构通用）
- **改 `Checklist_Networking.md`**：改成你项目的测试维度

例如单机项目把 `Checklist_Networking.md` 改成 `Checklist_SaveGame.md`：

```markdown
# Save Game Checklist (Single-Player)

## Persistence
- All player progress saved to USaveGame
- Save format: binary (or JSON for debugging)
- Save trigger: auto-save on checkpoint + manual save on menu

## Save Data
- Player stats (health, level, inventory)
- World state (completed quests, opened chests)
- Settings (audio, graphics, controls)

## Testing
- New game → save → load: state restored correctly
- Save during combat → load: no broken state
- Corrupt save file: graceful error handling
- Multiple save slots: no cross-contamination
```

**为什么**：
- **Templates 跟着 Output format 走**：Output format 改了子段，Templates 必须同步改，否则 Claude 引用模板时会找不到对应文件。
- **文件名也要改**：`Checklist_Networking.md` 改成 `Checklist_SaveGame.md`，让文件名反映内容。
- **保留通用模板**：蓝图配方骨架、DataTable schema 这两个跨项目通用，不要动。

### Step 6：加 examples（可选，推荐第二步迭代时加）

**做什么**：等你用改造版 skill 跑了几次，发现输出深度不够时，再加 examples。

**怎么做**：参考第 5 篇的 5 步法。重点是**范例必须用你项目的真实场景**，不能直接抄原版的 examples。

例如 MOBA 项目写 3 个范例：
- `examples/moba-ability-cast.md`（5v5 技能施放，含服务器裁决）
- `examples/moba-ward-vision.md`（眼位视野系统，含客户端可见性同步）
- `examples/moba-minion-ai.md`（小兵 AI，含 30 个体性能优化）

**为什么**：
- **第一步不加 examples**：先把 SKILL.md 和 Templates 改对，验证基础结构没问题。
- **第二步加 examples**：用着发现输出不够好时，用 examples 提升质量。这是渐进式改造的思路。
- **范例要用项目真实场景**：原版的 health-potion / rpg-ability / target-lock 是为 40v40 写的，你 5v5 MOBA 用不上，必须重写。

### Step 7：自检与试用

**做什么**：用自检清单验收，然后跑一个真实需求测试。

**自检清单**（在原版基础上加 5 项改造检查）：

- [ ] 文件夹名 = _meta.json.slug = SKILL.md 的 name？（三者一致）
- [ ] description 改成了你项目的版本/类型/规模/平台？
- [ ] What 段的 UE 版本与项目一致？
- [ ] UE naming 段的前缀和路径与项目一致？
- [ ] Multiplayer defaults 段的规模与项目一致？
- [ ] （如改了 Output format 子段）Templates 同步改了？
- [ ] （如加了 Performance 段）性能基线是量化指标？
- [ ] 保留了所有 `(default)` 和 `(unless specified)` 可覆盖声明？
- [ ] 没有动触发句式（When-Then）、安全规则、输出 6 段结构这些骨架？

**试用**：用一个真实需求测试，比如：

> 用户："帮我设计一个 MOBA 技能：闪现，瞬移 400 单位，冷却 300 秒，5v5"

预期输出：
1. Goal：闪现技能设计
2. Inputs：玩家输入、冷却配置、5v5 服务器
3. Outputs：BP_Ability_Flash、DT_Abilities 行、RPC
4. Assumptions：UE5.5、5v5、移动端
5. Implementation：
   - Blueprint Recipe（节点链）
   - Replication Notes（Server 权威 + Client RPC）
   - Performance Notes（移动端预算）
   - Assets / Naming（用你的前缀和路径）
6. Test Checklist（PIE / Dedicated 5v5 / 弱网络 300ms）

如果输出贴合你的项目，改造成功。如果还残留 40v40 / UE5.7 之类的原版默认值，回 SKILL.md 检查漏改的地方。

**为什么**：
- **自检清单新增 5 项**专门检查改造的 5 个维度是否改对。
- **试用是验证改造效果的唯一方法**：理论上改对了不等于实际输出对，必须跑一次真实需求看输出。
- **检查残留默认值**：最常见的问题是漏改某处，导致输出里还出现"40v40"或"UE5.7"。

---

## 4. 技术原理深挖

这一章讲改造中几个容易踩坑的技术原理，初学者理解了这些，改造就不会跑偏。

### 4.1 为什么改 description 要谨慎

**原理**：description 是 skill 的"门牌号"，决定触发匹配。改 description 等于改门牌号。

**该改的部分**：
- 版本号（UE5.7 → UE5.5）
- 项目类型（multiplayer → MOBA 5v5）
- 规模（40v40 → 5v5）
- 平台（如加 mobile）

**不该改的部分**：
- 核心动词（Designs）
- 产物清单（Blueprint chains / data schemas / asset naming / test checklist）
- 形态声明（Text-only, no scripts）

**为什么**：动词和产物清单是触发匹配的核心关键词。改了它们可能导致 skill 触发不到，或被无关输入误触发。版本/类型/规模/平台是"修饰词"，改它们不影响核心匹配。

### 4.2 为什么占位符要保留

**原理**：`<占位符>` 是 Templates 的灵魂，告诉 Claude "这里要填具体值"。

**该改的占位符**：
- `<SystemName>` → 保留（这是通用占位符）
- `<Thing>` → 保留（这是通用占位符）

**不该改的**：
- 不要把占位符改成具体值（如 `<SystemName>` 改成 `Combat`）——这会让模板只能用于一个系统
- 不要删除占位符——这会让 Claude 不知道哪里该填

**为什么**：占位符是"模板可复用性"的来源。改死具体值会让模板变成一次性的，失去复用价值。

### 4.3 为什么可覆盖声明要保留

**原理**：`(default)` 和 `(unless user says otherwise)` 是"默认值 + 可覆盖"机制。

**该改的**：
- 默认值本身（40v40 → 5v5）

**不该改的**：
- `(default)` 这个词
- `(unless user says otherwise)` 这个词

**为什么**：这两个声明让 skill 在用户提特殊需求时仍能切换。比如你改成 5v5 默认，但用户说"这是 3v3 模式"，Claude 会因为 `(unless specified)` 自动切换到 3v3。删掉这个声明，skill 就僵化了。

### 4.4 版本管理与 slug 的关系

**原理**：slug 是 skill 的"身份证号"，version 是"版本号"。两者独立。

**Fork 时的规则**：
- **slug 必须改**（如 `ue57-gamepiece-designer` → `my-moba-gamepiece-designer`）：因为你是新 skill，不是原版的升级。
- **version 从 0.1.0 重新开始**：你的第一版，与原版无版本继承关系。

**在原 skill 上迭代时的规则**（你是原版维护者）：
- **slug 不改**：还是同一个 skill
- **version 升级**：0.1.0 → 0.2.0（加新规则）/ 1.0.0（稳定发布）

**为什么**：fork 和 iterate 是两种不同的版本管理场景。fork 是"分家"，slug 要改；iterate 是"升级"，slug 不改。混淆会导致 skill 管理混乱。

### 4.5 改造的"最小改动原则"

**原理**：能不改就不改，改一处够用就不要改两处。

**应用**：
- 命名前缀如果项目用 Epic 官方的（BP_/DT_），就**不改** UE naming 段
- 资产路径如果项目用 `/Game/Systems/`，就**不改** Root
- 性能基线如果项目没特殊要求，就**不加** Performance 段

**为什么**：
- **每处改动都是维护成本**：改得越多，将来原版更新时同步越难。
- **原版经过验证**：原版的默认值是作者实战提炼的，比你拍脑袋定的靠谱。
- **最小改动 = 最大兼容**：改动少，原版升级时你容易合并新特性。

---

## 5. 常见改造场景案例

这一章给 4 个典型项目的改造案例，对照着看更直观。

### 5.1 案例 A：单机 RPG

**项目画像**：UE5.5 / 单机 / PC / 无网络 / 用 Epic 命名 / `/Game/Gameplay/`

**关键改动**：
- description：`UE5.7 multiplayer` → `UE5.5 single-player`
- What 段：删 `Multiplayer sanity` bullet，加 `Save game integration` bullet
- Output format：`Replication Notes` 子段 → `Save Game Notes` 子段
- Multiplayer defaults 段：整段删除，替换为 `Game type defaults` 段（单机、无 RPC）
- Templates：`Checklist_Networking.md` → `Checklist_SaveGame.md`
- 加 `examples/singleplayer-quest.md`

**输出特征**：无 Replication 段，多 Save Game 段，测试场景是"新游戏→存档→读档"。

### 5.2 案例 B：5v5 MOBA 手游

**项目画像**：UE5.5 / 5v5 / 移动端 / 服务器权威 / Epic 命名 / `/Game/Content/Gameplay/`

**关键改动**：
- description：`UE5.7 multiplayer 40v40` → `UE5.5 MOBA 5v5 mobile`
- Multiplayer defaults：`40v40+ scale` → `5v5 scale`，加 `Tick rate: server 30Hz`
- 新增 `Performance defaults` 段（移动端预算）
- Test Checklist：加 `弱网络 300ms` 测试场景
- 加 `examples/moba-ability-cast.md`

**输出特征**：保留 Replication 段但规模改 5v5，多 Performance 段，测试含弱网络。

### 5.3 案例 C：MMORPG（百人同屏）

**项目画像**：UE5.7 / MMO / PC / 服务器权威 / 100+ 玩家同屏 / 自定义命名

**关键改动**：
- description：`40v40` → `MMORPG 100+ concurrent`
- Multiplayer defaults：`40v40+` → `100+ concurrent`，加 `Network relevancy required`、`Max replicated vars per actor: 10`
- 新增 `Bandwidth budget` 段（每帧 < 50KB）
- UE naming：前缀改成项目的自定义前缀
- Test Checklist：加 `100 人压测` 场景
- 加 `examples/mmo-aoe-spell.md`（百人 AOE 法术）

**输出特征**：Replication 段加重，多 Bandwidth 段，测试含大规模压测。

### 5.4 案例 D：单人 VR 游戏

**项目画像**：UE5.7 / 单人 / VR（Quest 3）/ 无网络 / Epic 命名

**关键改动**：
- description：`UE5.7 multiplayer` → `UE5.7 VR single-player (Quest 3)`
- What 段：加 `VR interaction (motion controller, grab)` bullet
- Output format：`Replication Notes` → `VR Interaction Notes`（抓取/手势/舒适度）
- Multiplayer defaults：删除，替换为 `VR defaults`（72fps、抗锯齿、运动舒适度）
- Performance：加 `VR performance budget`（每眼渲染、帧率 72Hz）
- Test Checklist：加 `VR 舒适度测试`（运动病、视角突变）
- 加 `examples/vr-grab-interaction.md`

**输出特征**：无 Replication，多 VR Interaction 段，测试含舒适度。

---

## 6. 避坑指南：改造中最容易犯的 8 个错

### 坑 1：动了骨架

**症状**：改了 When-Then 句式、安全规则、或 6 段输出结构，skill 触发或输出不稳定。

**修复**：回滚骨架部分。骨架（触发句式 / Safety / Output format 编号结构）是 skill 工程化的核心，不要动。只改填充内容。

### 坑 2：漏改某处默认值

**症状**：改造后输出里还残留"40v40"或"UE5.7"。

**修复**：全局搜索原版的关键词（40v40 / UE5.7 / multiplayer / Server authoritative），逐一确认是否需要改。漏改是最常见问题。

### 坑 3：slug 没改导致冲突

**症状**：两个 skill 都叫 `ue57-gamepiece-designer`，触发混乱。

**修复**：fork 时立刻改 slug、文件夹名、_meta.json.slug，三者统一。

### 坑 4：description 改得太宽

**症状**：改完后 skill 被无关输入误触发。

**修复**：description 保留"动词 + 产物 + 形态"，只改"领域修饰词"。不要把 `Designs UE game pieces` 改成 `Helps with UE`。

### 坑 5：删了可覆盖声明

**症状**：skill 变僵化，用户提特殊需求时不切换。

**修复**：保留所有 `(default)` 和 `(unless user says otherwise)`。只改默认值本身，不改声明语法。

### 坑 6：改了 Templates 但没改 SKILL.md 引用

**症状**：把 `Checklist_Networking.md` 改名成 `Checklist_SaveGame.md`，但 SKILL.md 还引用旧名，Claude 找不到文件。

**修复**：改文件名时同步改 SKILL.md 里的引用路径。

### 坑 7：改太多导致难以合并原版更新

**症状**：原版升级到 0.2.0 加了新特性，你想合并但改动太多无法 diff。

**修复**：遵循"最小改动原则"。能不改就不改，改一处够用就不要改两处。

### 坑 8：没试用就发布

**症状**：理论上改对了，实际输出还是不对。

**修复**：改完必须跑一个真实需求测试（Step 7）。理论不能代替验证。

---

## 7. 改造检查清单（一页纸版）

把整篇文档浓缩成一页纸的检查清单，改造时打印出来对着打勾：

```
□ Step 1：项目画像（8 个问题填完）
   □ UE 版本  □ 项目类型  □ 平台  □ 网络模型
   □ 命名前缀  □ 资产路径  □ 性能预算  □ 测试场景

□ Step 2：Fork 并改名
   □ 复制原版文件夹
   □ 改名为 <项目简称>-gamepiece-designer

□ Step 3：改 _meta.json
   □ slug 与文件夹名一致
   □ version 从 0.1.0 开始
   □ ownerId 换成你的

□ Step 4：改 SKILL.md（5 处）
   □ YAML 头（name + description）
   □ 标题 + What 段（版本/类型/规模/平台）
   □ UE naming 段（前缀 + 路径）
   □ Multiplayer defaults 段（规模/网络模型）
   □ （可选）新增 Performance defaults 段

□ Step 5：改 Templates（如改了 Output format 子段）
   □ 同步改文件名
   □ 同步改 SKILL.md 引用路径

□ Step 6：（可选）加 examples
   □ 用项目真实场景写 2-3 个范例

□ Step 7：自检 + 试用
   □ 9 项自检清单全过
   □ 跑一个真实需求测试
   □ 检查输出无残留原版默认值
```

打完所有勾 = 改造完成。

---

## 8. 本篇小结

### 三个核心结论

1. **改造的本质是"约束替换"**：保留通用骨架（When-Then / Safety / 6 段结构 / 占位符语法），替换项目特异填充（版本 / 规模 / 命名 / 路径 / 性能基线）。
2. **5 个改造维度**：UE 版本、多人模型、命名前缀、资产路径、性能基线。每个维度都该基于项目画像决策，不盲改。
3. **7 步法是通用流程**：画像 → Fork → 改 meta → 改 SKILL.md → 改 Templates → 加 examples → 自检试用。

### 改造的元原则（5 条）

1. **Fork 不修改原版**：保留参照物，改坏了自己还有原版对照。
2. **骨架不动填充动**：触发句式 / Safety / 6 段结构是骨架；版本 / 规模 / 命名是填充。
3. **最小改动原则**：能不改就不改，改一处够用就不要改两处。
4. **保留可覆盖声明**：`(default)` 和 `(unless specified)` 是骨架的一部分，不要删。
5. **改完必须试用**：理论不能代替验证，跑一个真实需求看输出。

### 从原版到你的版本的演化路径

```
原版 ue57-gamepiece-designer（40v40 UE5.7）
   ↓ Fork + 改 slug
你的 v0.1.0（基础改造：改版本/规模/命名）
   ↓ 试用发现输出深度不够
你的 v0.2.0（加 examples：项目真实场景范例）
   ↓ 试用发现性能考量不够
你的 v0.3.0（加 Performance defaults 段）
   ↓ 稳定使用
你的 v1.0.0（首个稳定版）
```

每一步都是渐进式改造，不要一次到位。**完成比完美更重要**。

### 下一步

改造完成后，可以：
- 横向扩展：为不同项目类型维护多个 fork（MOBA 版 / 单机版 / VR 版）
- 纵向深化：参考第 4 篇，让 skill 输出可执行的 Python 脚本，真正落地 UE 自动化
- 反哺原版：如果你的改造有通用价值（比如更细的性能基线），可以提 PR 给原版

> ⚠️ **如果你的项目是异构技术栈**（例如 UE 只做客户端、嵌入 slua 脚本层、
> bigworld 服务端、自定义网络协议），第 6 篇的"改填充"思路不够用——
> 需要**重构输出结构**。这种情况请接着读
> [第 7 篇：异构项目改造实战](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/07-heterogeneous-project-guide.md)，
> 里面有针对 UE+slua+bigworld 技术栈的完整改造步骤和双 Schema 设计。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
