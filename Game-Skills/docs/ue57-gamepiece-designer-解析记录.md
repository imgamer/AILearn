# UE5.7 Gamepiece Designer 技能解析记录
这个技能只输出设计文档，不包含实际的代码实现。这样做的好处是，帮助思考要设计的游戏部件，避免遗漏，节省心智和精力。

---

**记录时间**: 2026/04/16  
**讨论主题**: `ue57-gamepiece-designer-0.1.0` 技能的目录结构、文件作用及实际应用流程

---

## 一、技能概览

**名称**: ue57-gamepiece-designer  
**版本**: 0.1.0  
**定位**: UE5.7 多人游戏友好的游戏部件（gamepiece）设计工具  
**输出形式**: 纯文本（蓝图配方、数据架构、测试清单）

---

## 二、目录结构解析

```
.claude/skills/ue57-gamepiece-designer-0.1.0/
├── SKILL.md                           ← 核心定义文件
├── _meta.json                         ← 元数据（ID/版本/发布信息）
└── Templates/                         ← 模板文件夹
    ├── BlueprintRecipe_Template.md    ← 蓝图配方模板
    ├── Checklist_Networking.md        ← 网络检查清单
    └── Schema_Ability_DT.csv          ← DataTable结构示例
```

### 各文件详细作用

| 文件 | 类型 | 作用 |
|------|------|------|
| `SKILL.md` | 核心定义 | 定义技能触发条件、安全规则、输出格式、命名规范、多人默认规则 |
| `_meta.json` | 元数据 | 技能唯一ID、slug、版本号、发布时间戳 |
| `BlueprintRecipe_Template.md` | 模板 | 蓝图配方标准结构：Goal→Inputs→Outputs→Assumptions→Recipe→Replication→Assets→Test |
| `Checklist_Networking.md` | 模板 | 多人网络检查4维度：Authority（权威）→Replication（同步）→Performance（性能）→Testing（测试） |
| `Schema_Ability_DT.csv` | 示例 | DataTable字段定义示例，含AbilityId、DisplayName、Range、Cooldown等字段 |

---

## 三、"gamepiece" 语义解析

### 词源
**game**（游戏）+ **piece**（部件/棋子）= 可玩的游戏功能单元

### 在这个技能中的含义
指代**一个完整、可独立运作的游戏功能模块**，类似棋盘游戏中的"棋子"概念延伸到电子游戏。

### 一个 gamepiece 包含
1. **Blueprint node chains** - 蓝图节点链（实现逻辑）
2. **Data schemas** - DataTable/DataAsset 数据结构
3. **Asset naming** - 资产命名规范
4. **Test checklists** - 测试检查清单

### 示例 gamepiece
- 生命药水拾取系统
- 武器开火系统
- 背包库存系统
- 技能/法术系统

---

## 四、实战案例：生命药水拾取系统

### 用户需求
> "我要做一个生命药水，玩家走近按E拾取，恢复50生命值，多人游戏下要同步。"

### 实现流程

#### Step 1: 解析需求 → 确定结构
根据 `SKILL.md` 的输出格式要求，确定交付内容：
- Goal / Inputs / Outputs / Assumptions
- Implementation (Blueprint Recipe / Replication Notes / Assets)
- Test Checklist

#### Step 2: 设计数据架构（Data Schema）
参考 `Templates/Schema_Ability_DT.csv`，设计药水 DataTable：

```csv
ItemId,DisplayName,ItemType,HealAmount,MaxStack,UseTime,IconId,PickupSound,SpawnEffect
HP_POTION_SMALL,Small Health Potion,Consumable,50,10,1.0,icon_potion_red,pickup_potion,FX_PotionSpawn
HP_POTION_LARGE,Large Health Potion,Consumable,100,5,1.5,icon_potion_gold,pickup_potion,FX_PotionSpawn
```

**技能约束应用**：使用 `DT_` 前缀 → `DT_Consumables`

#### Step 3: 编写蓝图配方（Blueprint Recipe）
根据 `Templates/BlueprintRecipe_Template.md` 格式：

**蓝图配方：BP_Pickup_HealthPotion**

```
【组件构成】
- StaticMeshComponent: "Mesh" (药水模型)
- SphereCollision: "InteractionZone" (碰撞范围, 半径150)
- PointLight: "GlowLight" (红色发光)

【变量】
- ItemData: FConsumableData (结构体, 从DT读取)
- bIsAvailable: Bool (可拾取状态, Replicated+RepNotify)
- RespawnTimer: Float (重生计时器)

【蓝图节点链】

1. Event: BeginPlay
   └── GetDataTableRow (DT_Consumables, "HP_POTION_SMALL")
       └── Set: ItemData

2. Event: OnBeginOverlap (InteractionZone)
   └── Cast to BP_PlayerCharacter
       └── Branch: IsLocallyControlled?
           └── TRUE: AddToInteractionPrompt (显示"按E拾取")
               └── Set: CurrentInteractable (Player)

3. Event: OnEndOverlap
   └── RemoveFromInteractionPrompt
       └── Set: CurrentInteractable = None

4. InputAction: Interact (按E)
   └── Branch: CurrentInteractable == Self?
       └── Server_RequestPickup (Server RPC)
           └── Target: Self

5. Server RPC: Server_RequestPickup
   └── Branch: bIsAvailable AND IsValid(Player)?
       ├── ApplyHealing (Player, ItemData.HealAmount)
       │   └── Client_ShowHealNumber (Multicast RPC，显示飘字+50)
       ├── Set: bIsAvailable = FALSE
       ├── HideMeshAndEffects
       │   ├── SetVisibility (Mesh, False)
       │   ├── SetVisibility (GlowLight, False)
       │   └── SetCollisionEnabled (InteractionZone, NoCollision)
       └── SetTimerByFunction (Respawn, 30.0秒)
```

#### Step 4: 多人网络注意事项（Replication）
根据 `Templates/Checklist_Networking.md` 的4维度：

```markdown
## 生命药水系统的网络分析

### Authority 权威
- [x] 拾取判定（是否成功、冷却）→ **Server**
- [x] 生命值恢复应用 → **Server**
- [x] 药水状态（可用/不可用）→ **Server** 决定，**RepNotify** 同步

### Replication 同步
- [x] bIsAvailable → **Replicated + RepNotify**
  - 客户端监听变化，更新可见性/碰撞
- [x] 飘字特效 → **Multicast RPC** (Client_ShowHealNumber)
  - 所有玩家都看到谁拾取了药水

### Performance 性能
- [x] 避免Tick扫描：使用 **OnBeginOverlap** 事件驱动
- [x] 减少网络同步：只有 bIsAvailable 是 Replicated
- [x] 数据结构本地缓存：ItemData 在 BeginPlay 从DT读取

### Testing 测试
- [ ] PIE双客户端：拾取同步 + 飘字显示
- [ ] 专用服务器：无客户端-only假设
- [ ] 模拟延迟：高延迟下无重复拾取/丢失
```

#### Step 5: 资产命名与文件夹结构
根据 `SKILL.md` 的命名规范：

```
/Game/Systems/PickupSystem/
├── Blueprints/
│   ├── BP_Pickup_HealthPotion      (药水拾取物)
│   ├── BP_Pickup_ManaPotion        (法力药水变体)
│   └── BPComp_InteractionPrompt    (交互提示组件)
├── Data/
│   ├── DT_Consumables              (消耗品数据表)
│   └── ST_ConsumableData           (消耗品结构体)
├── UI/
│   ├── WBP_InteractionPrompt       (交互提示UI)
│   └── WBP_FloatingText            (飘字伤害/治疗)
├── Materials/
│   └── M_PotionGlow                (药水发光材质)
└── FX/
    ├── FX_PotionSpawn              (生成特效)
    └── FX_Pickup                   (拾取特效)
```

#### Step 6: 测试检查清单
根据 `Templates/Checklist_Networking.md` 和 `SKILL.md` 的要求：

```markdown
## 生命药水系统 - 测试检查清单

### PIE (Play In Editor) 单人
- [ ] 走近药水，显示"按E拾取"提示
- [ ] 按E后，生命值+50，药水消失
- [ ] 离开碰撞范围，提示消失
- [ ] 30秒后药水重生，可再次拾取

### PIE 多人 (2客户端)
- [ ] 客户端A拾取，客户端B看到A的飘字(+50)
- [ ] 客户端B看到药水消失
- [ ] 客户端A重生后，双方看到药水重生
- [ ] 双方同时尝试拾取，只有一个成功(服务器仲裁)

### Dedicated Server (独立服务器测试)
- [ ] 连接独立服务器，拾取功能正常
- [ ] 掉线重连后，药水状态正确同步
- [ ] 高延迟(200ms+)，无重复拾取/丢失问题

### 边界/边缘情况
- [ ] 满生命值时，不能拾取(或拾取但无效果)
- [ ] 拾取过程中死亡，无异常
- [ ] 服务器重启，药水状态持久化(如需要)
- [ ] 100个玩家同时拾取不同药水，无性能问题
```

---

## 五、技能各部分协同工作流程图

```
┌─────────────────────────────────────────────────────────────┐
│                     用户请求                                 │
│  "我要做一个生命药水拾取系统"                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  SKILL.md (核心规则)                                         │
│  • 强制6步输出格式 (Goal/Inputs/Outputs/Assumptions/Impl/Test) │
│  • 安全规则 (只输出文本，不执行命令)                          │
│  • UE命名规范 (BP_, DT_, BPI_等)                            │
│  • 多人默认规则 (Server权威，Replication)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │Blueprint│ │  Data   │ │Networking│
   │ Recipe  │ │ Schema  │ │ Checklist│
   │Template │ │Template │ │ Template │
   └────┬────┘ └────┬────┘ └────┬────┘
        │           │           │
        ▼           ▼           ▼
   蓝图节点链      DataTable      Replication
   (Event→Node)    字段设计       检查项
        │           │           │
        └───────────┴───────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   完整设计文档   │
          │ (Goal→Test全6章) │
          └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │   用户可执行    │
          │  (复制粘贴蓝图)  │
          └─────────────────┘
```

---

## 六、核心概念总结

### "gamepiece" 语义

| 维度 | 说明 |
|------|------|
| 词源 | game（游戏）+ piece（部件/棋子）|
| 含义 | 可玩的游戏功能单元，完整、可独立运作的功能模块 |
| 包含内容 | 蓝图节点链 + 数据架构 + 命名规范 + 测试清单 |
| 示例 | 生命药水、武器开火、背包系统、技能系统 |

### 技能核心价值

将模糊的**游戏设计需求** → 转化为**可直接在UE5.7中实现的技术规范**，同时强制考虑**多人网络同步**这一容易被忽略的关键点。

---

*本记录由 Claude 整理，供后续参考使用。*
