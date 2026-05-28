# 竞技场PvP系统详细需求文档

> 文档编号：S14
> 模块：竞技场PvP系统（Arena PvP System）
> 版本：v1.0 | 日期：2026-05-28
> 状态：可开发

---

## 1. 系统概述

### 1.1 核心定位

异步PvP系统。玩家设置防守编队，攻击方挑战由AI控制的防守方小队。核心游戏是多小队大地图战斗，PvP需简化为自动战斗，保留编队策略深度。

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| 异步对战 | 攻击方挑战AI控制的防守编队，无需双方同时在线 |
| 编队策略 > 操作 | 3v3小队制，战前编队和站位是核心策略 |
| 快速战斗 | 简化地图、自动战斗、支持2倍速/跳过 |
| 段位驱动 | 赛季制段位系统，驱动长期追求 |

### 1.3 关键参数总览

| 参数 | 值 | 备注 |
|------|----|------|
| 竞技场地图 | 10×8 | 小型地图，适配3v3 |
| 每方小队数 | 3 | 攻方选3队 vs 守方3队 |
| 匹配分数范围 | ±200 | 可配置 |
| 每次刷新对手数 | 5 | 可配置 |
| 每日免费挑战次数 | 5 | 重置时间5:00 |
| 额外挑战费用 | 50钻/次 | 可配置 |
| 胜利积分 | +30 | 可配置 |
| 失败积分 | -20（不低于0） | 可配置 |
| 赛季时长 | 6周 | 可配置 |
| 防守AI模式 | EliteAI | 复用战斗系统AI |

---

## 2. 数据结构定义（C# class）

### 2.1 ArenaPlayer — 竞技场玩家数据

```csharp
public class ArenaPlayer
{
    public string PlayerId;                         // 玩家唯一ID
    public int RankScore;                           // 当前段位积分（≥0）
    public int HighestRankScore;                    // 本赛季最高积分（用于结算奖励）
    public int SeasonId;                            // 当前赛季ID
    public ArenaDefenseSetup DefenseSetup;          // 防守编队设置
    public List<ArenaBattleRecord> AttackHistory;   // 攻击历史（最近50条）
    public List<ArenaBattleRecord> DefenseHistory;  // 防守历史（最近50条）
    public int DailyChallengeCount;                 // 今日已挑战次数
    public int DailyFreeChallengesRemaining;        // 今日剩余免费次数
    public long LastChallengeResetTime;             // 上次挑战次数重置时间（Unix时间戳）
    public List<string> OpponentList;               // 当前匹配的对手PlayerId列表
    public long OpponentRefreshTime;                // 对手列表上次刷新时间
    public int TotalWins;                           // 总胜利次数
    public int TotalLosses;                         // 总失败次数
    public int SeasonWins;                          // 本赛季胜利次数
    public int SeasonLosses;                        // 本赛季失败次数
    public int ArenaCoinBalance;                    // 竞技场币余额
}
```

### 2.2 ArenaBattleRecord — 战斗记录

```csharp
public class ArenaBattleRecord
{
    public string BattleId;                         // 战斗唯一ID（GUID）
    public string AttackerId;                       // 攻击方PlayerId
    public string DefenderId;                       // 防守方PlayerId
    public ArenaBattleResult Result;                // 战斗结果
    public int RankChange;                          // 积分变化（正=增加，负=减少）
    public int AttackerScoreBefore;                 // 攻击方战前积分
    public int DefenderScoreBefore;                 // 防守方战前积分
    public int AttackerRankBefore;                  // 攻击方战前段位ID
    public int DefenderRankBefore;                  // 防守方战前段位ID
    public long Timestamp;                          // 战斗时间（Unix时间戳）
    public int BattleDurationSeconds;               // 战斗持续时长（秒）
    public string ReplayData;                       // 战斗回放数据（JSON序列化）
}
```

```csharp
public enum ArenaBattleResult
{
    AttackerWin = 1,                                // 攻击方胜利
    DefenderWin = 2,                                // 防守方胜利
    Draw = 3                                        // 平局（超时，攻方不得分）
}
```

### 2.3 ArenaSeason — 赛季数据

```csharp
public class ArenaSeason
{
    public int SeasonId;                            // 赛季唯一ID
    public long StartDate;                          // 赛季开始时间（Unix时间戳）
    public long EndDate;                            // 赛季结束时间（Unix时间戳）
    public string SeasonName;                       // 赛季名称（如"第一赛季·黎明"）
    public string RankRewardsJson;                  // 段位奖励配置JSON
    public string TopRewardsJson;                   // 排名奖励配置JSON
    public int Status;                              // 赛季状态（0=未开始, 1=进行中, 2=结算中, 3=已结束）
    public long SettlementTime;                     // 结算时间
}
```

### 2.4 ArenaDefenseSetup — 防守编队

```csharp
public class ArenaDefenseSetup
{
    public List<int> SquadIds;                      // 防守小队ID列表（固定3个）
    public List<ArenaFormationData> FormationData;  // 每支小队的阵型数据
    public List<ArenaPlacementPosition> PlacementPositions; // 小队初始站位
    public long LastSetupTime;                      // 上次设置时间
    public bool IsSetupValid;                       // 编队是否有效（小队未删除/未变更）
}
```

```csharp
public class ArenaFormationData
{
    public int SquadId;                             // 小队ID
    public int FormationId;                         // 阵型ID（关联阵型系统）
    public List<int> UnitSlotAssignments;           // 单位槽位分配
}
```

```csharp
public class ArenaPlacementPosition
{
    public int SquadIndex;                          // 小队索引（0/1/2）
    public int DeployZoneId;                        // 部署区域ID（1=左区, 2=中区, 3=右区）
    public int PosX;                                // 地图X坐标
    public int PosY;                                // 地图Y坐标
}
```

---

## 3. 配置表定义

### 3.1 TB_ArenaRank — 段位配置

| 字段 | 类型 | 说明 |
|------|------|------|
| rank_id | int | 段位ID（唯一） |
| name | string | 段位名称（如"青铜III"） |
| tier | int | 大段位（0=青铜, 1=白银, 2=黄金, 3=铂金, 4=钻石, 5=大师） |
| sub_tier | int | 小段位（3=III, 2=II, 1=I） |
| min_score | int | 最低积分 |
| max_score | int | 最高积分（-1表示无上限） |
| icon | string | 段位图标资源路径 |
| reward_id | int | 赛季结算奖励ID（关联TB_ArenaReward） |

**段位配置数据：**

| rank_id | name | tier | sub_tier | min_score | max_score |
|---------|------|------|----------|-----------|-----------|
| 100 | 青铜III | 0 | 3 | 0 | 299 |
| 101 | 青铜II | 0 | 2 | 300 | 599 |
| 102 | 青铜I | 0 | 1 | 600 | 999 |
| 200 | 白银III | 1 | 3 | 1000 | 1199 |
| 201 | 白银II | 1 | 2 | 1200 | 1399 |
| 202 | 白银I | 1 | 1 | 1400 | 1499 |
| 300 | 黄金III | 2 | 3 | 1500 | 1699 |
| 301 | 黄金II | 2 | 2 | 1700 | 1899 |
| 302 | 黄金I | 2 | 1 | 1900 | 1999 |
| 400 | 铂金III | 3 | 3 | 2000 | 2199 |
| 401 | 铂金II | 3 | 2 | 2200 | 2399 |
| 402 | 铂金I | 3 | 1 | 2400 | 2499 |
| 500 | 钻石III | 4 | 3 | 2500 | 2699 |
| 501 | 钻石II | 4 | 2 | 2700 | 2899 |
| 502 | 钻石I | 4 | 1 | 2900 | 2999 |
| 600 | 大师 | 5 | 0 | 3000 | -1 |

### 3.2 TB_ArenaSeason — 赛季配置

| 字段 | 类型 | 说明 |
|------|------|------|
| season_id | int | 赛季ID |
| season_name | string | 赛季名称 |
| start_date | string | 开始日期（yyyy-MM-dd） |
| end_date | string | 结束日期 |
| duration_days | int | 赛季天数（42=6周） |
| settlement_delay_hours | int | 结算延迟小时数（24） |
| rank_reward_ids_json | string | 各段位奖励ID列表JSON |
| top_reward_ids_json | string | 排名奖励ID列表JSON |
| top_reward_ranks | string | 排名奖励名次（如"1,2,3,4-10,11-50"） |

### 3.3 TB_ArenaReward — 奖励配置

| 字段 | 类型 | 说明 |
|------|------|------|
| reward_id | int | 奖励ID |
| reward_name | string | 奖励名称 |
| reward_type | int | 奖励类型（1=段位结算, 2=排名结算, 3=每日结算） |
| rank_id | int | 关联段位ID（0=不限） |
| rank_min | int | 最低排名（0=不限） |
| rank_max | int | 最高排名（0=不限） |
| items_json | string | 奖励物品JSON（格式：[{"item_id":1001,"count":100},{"item_id":2001,"count":50}]） |

**段位结算奖励示例：**

| reward_id | reward_name | reward_type | rank_id | items_json |
|-----------|-------------|-------------|---------|------------|
| 3001 | 青铜结算 | 1 | 100 | [{"item_id":9001,"count":200},{"item_id":1001,"count":50}] |
| 3002 | 白银结算 | 1 | 200 | [{"item_id":9001,"count":400},{"item_id":1001,"count":100}] |
| 3003 | 黄金结算 | 1 | 300 | [{"item_id":9001,"count":600},{"item_id":1001,"count":150}] |
| 3004 | 铂金结算 | 1 | 400 | [{"item_id":9001,"count":800},{"item_id":1001,"count":200}] |
| 3005 | 钻石结算 | 1 | 500 | [{"item_id":9001,"count":1200},{"item_id":1001,"count":300}] |
| 3006 | 大师结算 | 1 | 600 | [{"item_id":9001,"count":2000},{"item_id":1001,"count":500},{"item_id":7001,"count":1}] |

> item_id: 9001=竞技场币, 1001=钻石, 7001=专属皮肤

---

## 4. 段位系统

### 4.1 段位划分

```
积分区间        大段位    小段位
  0 -  299     青铜      III
300 -  599     青铜      II
600 -  999     青铜      I
1000 - 1199    白银      III
1200 - 1399    白银      II
1400 - 1499    白银      I
1500 - 1699    黄金      III
1700 - 1899    黄金      II
1900 - 1999    黄金      I
2000 - 2199    铂金      III
2200 - 2399    铂金      II
2400 - 2499    铂金      I
2500 - 2699    钻石      III
2700 - 2899    钻石      II
2900 - 2999    钻石      I
3000+          大师      —
```

### 4.2 积分计算

```csharp
public int CalculateRankScoreChange(ArenaBattleResult result, int currentScore)
{
    int change;
    switch (result)
    {
        case ArenaBattleResult.AttackerWin:
            change = 30;
            break;
        case ArenaBattleResult.DefenderWin:
            change = -20;
            break;
        case ArenaBattleResult.Draw:
            change = -5;
            break;
        default:
            change = 0;
            break;
    }

    int newScore = currentScore + change;
    if (newScore < 0) newScore = 0;
    return newScore;
}
```

### 4.3 段位查询

```csharp
public int GetRankId(int score)
{
    var ranks = ConfigManager.Instance.GetAll<TB_ArenaRank>();
    foreach (var rank in ranks)
    {
        if (score >= rank.min_score && (rank.max_score == -1 || score <= rank.max_score))
        {
            return rank.rank_id;
        }
    }
    return 100;
}
```

### 4.4 段位保护

- 首次进入新大段位时，获得3场保护（3场内失败不扣分）
- 保护次数存储在ArenaPlayer中（新增字段 `int DemotionProtectionCount`）
- 每个赛季每个大段位仅触发一次保护

---

## 5. 匹配规则

### 5.1 匹配算法

```csharp
public List<ArenaPlayer> MatchOpponents(ArenaPlayer attacker, int count = 5)
{
    int minScore = attacker.RankScore - 200;
    int maxScore = attacker.RankScore + 200;

    var candidates = ArenaService.Instance.GetPlayersInScoreRange(minScore, maxScore, attacker.PlayerId);

    candidates.Sort((a, b) =>
    {
        int scoreDiffA = Math.Abs(a.RankScore - attacker.RankScore);
        int scoreDiffB = Math.Abs(b.RankScore - attacker.RankScore);
        return scoreDiffA.CompareTo(scoreDiffB);
    });

    return candidates.Take(count).ToList();
}
```

### 5.2 匹配规则明细

| 规则 | 说明 |
|------|------|
| 分数范围 | 攻击方积分 ±200 |
| 优先级 | 按分数差从小到大排序 |
| 排除自身 | 不匹配自己 |
| 排除无防守编队 | 对手必须已设置防守编队 |
| 段位优先 | 同大段位内优先匹配 |
| 在线优先 | 7天内活跃玩家优先 |
| 不重复 | 同一批对手列表中不出现重复玩家 |

### 5.3 对手列表刷新

- 每次刷新生成5个对手
- 手动刷新：免费刷新间隔10分钟，否则消耗10竞技场币
- 自动刷新：每日5:00重置时自动刷新
- 刷新后旧列表清空，生成新列表

```csharp
public bool CanFreeRefresh(ArenaPlayer player)
{
    long now = TimeUtil.GetCurrentUnixTimestamp();
    long elapsed = now - player.OpponentRefreshTime;
    return elapsed >= 600;
}
```

### 5.4 挑战次数

| 类型 | 次数 | 说明 |
|------|------|------|
| 每日免费 | 5 | 每日5:00重置 |
| 额外购买 | 无上限 | 50钻/次 |
| 挑战间隔 | 0 | 无冷却 |

```csharp
public bool CanChallenge(ArenaPlayer player)
{
    if (player.DailyFreeChallengesRemaining > 0) return true;
    return CurrencyService.Instance.GetDiamondBalance(player.PlayerId) >= 50;
}

public void ConsumeChallenge(ArenaPlayer player)
{
    if (player.DailyFreeChallengesRemaining > 0)
    {
        player.DailyFreeChallengesRemaining--;
    }
    else
    {
        CurrencyService.Instance.SpendDiamond(player.PlayerId, 50);
    }
    player.DailyChallengeCount++;
}
```

---

## 6. 战斗模式

### 6.1 战斗规则

| 参数 | 值 | 说明 |
|------|----|------|
| 地图尺寸 | 10×8 | 比主线地图小 |
| 每方小队数 | 3 | 攻方3队 vs 守方3队 |
| 战斗模式 | 自动 | 双方均由AI控制 |
| 回合上限 | 20 | 超时算平局 |
| 速度选项 | 1x / 2x / 跳过 | - |

### 6.2 竞技场地图设计

```
  0 1 2 3 4 5 6 7 8 9
0 □ □ □ □ □ □ □ □ □ □
1 □ □ □ □ □ □ □ □ □ □
2 □ □ □ □ □ □ □ □ □ □
3 □ □ □ ■ □ □ ■ □ □ □    ← 障碍物
4 □ □ □ ■ □ □ ■ □ □ □    ← 障碍物
5 □ □ □ □ □ □ □ □ □ □
6 □ □ □ □ □ □ □ □ □ □
7 □ □ □ □ □ □ □ □ □ □

攻方部署区：Y=0~1（3个区域：左X=0~2, 中X=3~6, 右X=7~9）
守方部署区：Y=6~7（3个区域：左X=0~2, 中X=3~6, 右X=7~9）
障碍物：(3,3)(3,4)(6,3)(6,4)
```

### 6.3 战斗流程

```
ArenaBattle(attacker, defender):
  ┌─────────────────────────────────────────────┐
  │ Step 1: 战斗初始化                            │
  │   - 加载竞技场地图                             │
  │   - 攻方小队部署到攻方部署区                    │
  │   - 守方小队部署到守方部署区（使用防守编队站位） │
  │   - 初始化BattleContext                       │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ Step 2: 自动战斗循环                          │
  │   for turn = 1 to 20:                        │
  │     - 攻方AI执行（使用攻击方优先级设定）        │
  │     - 守方AI执行（EliteAI模式）               │
  │     - 检查胜负条件                            │
  │     - 如果一方全灭 → 结束                     │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ Step 3: 战斗结算                              │
  │   - 判定胜负                                  │
  │   - 计算积分变化                              │
  │   - 更新双方ArenaPlayer数据                   │
  │   - 生成ArenaBattleRecord                    │
  │   - 发放战斗奖励（胜方竞技场币×20）            │
  └─────────────────────────────────────────────┘
```

### 6.4 攻击方优先级设定

攻击方可设置3支小队的攻击目标优先级：

```csharp
public enum ArenaTargetPriority
{
    Nearest = 0,                                    // 攻击最近敌人
    Weakest = 1,                                    // 攻击血量最低
    Leader = 2,                                     // 优先攻击队长所在小队
    Ranged = 3,                                     // 优先攻击远程小队
    Strongest = 4                                   // 优先攻击战力最高小队
}
```

每支小队可独立设置优先级，在挑战前配置。默认为Nearest。

### 6.5 胜负条件

| 条件 | 结果 |
|------|------|
| 防守方3队全灭 | 攻击方胜利 |
| 攻击方3队全灭 | 防守方胜利 |
| 达到20回合上限 | 平局（攻方不得分，守方不扣分） |

### 6.6 战斗速度控制

```csharp
public class ArenaBattleSpeed
{
    public const float NormalSpeed = 1.0f;
    public const float DoubleSpeed = 2.0f;
    public const float SkipSpeed = 10.0f;           // 跳过模式，瞬间结算

    public static float GetCurrentSpeed(ArenaBattleSpeedMode mode)
    {
        return mode switch
        {
            ArenaBattleSpeedMode.Normal => NormalSpeed,
            ArenaBattleSpeedMode.Double => DoubleSpeed,
            ArenaBattleSpeedMode.Skip => SkipSpeed,
            _ => NormalSpeed
        };
    }
}

public enum ArenaBattleSpeedMode
{
    Normal = 0,
    Double = 1,
    Skip = 2
}
```

---

## 7. 防守编队

### 7.1 编队规则

| 规则 | 说明 |
|------|------|
| 小队数量 | 固定3支 |
| 小队来源 | 从玩家已有小队中选择 |
| 阵型设置 | 每支小队可独立设置阵型 |
| 站位设置 | 每支小队分配到1个部署区域 |
| 部署区域 | 左区/中区/右区，每区最多1支小队 |
| 保存限制 | 3支小队必须全部设置才能保存 |
| 修改限制 | 被攻击中不可修改 |

### 7.2 防守AI — EliteAI模式

复用战斗系统的EliteAI（AIType=3），行为规则：

| 行为 | 说明 |
|------|------|
| 目标选择 | 优先攻击威胁最高的敌方小队 |
| 移动策略 | 根据小队类型选择最优位置（远程保持距离，近战主动接近） |
| 技能使用 | 优先使用克制目标的技能 |
| 集火倾向 | 多支小队优先集火同一目标 |
| 保护队长 | 队长受威胁时优先防御 |

### 7.3 防守编队保存流程

```
SaveDefenseSetup(player, setup):
  ┌─────────────────────────────────────────────┐
  │ Step 1: 校验                                 │
  │   - squad_ids.Count == 3                     │
  │   - 每个squad_id有效且属于该玩家              │
  │   - placement_positions包含3个不同deploy_zone │
  │   - 每支小队阵型有效                          │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ Step 2: 保存                                 │
  │   - 序列化ArenaDefenseSetup                  │
  │   - 更新ArenaPlayer.DefenseSetup             │
  │   - 设置IsSetupValid = true                  │
  │   - 记录LastSetupTime                        │
  └─────────────────────────────────────────────┘
```

---

## 8. 赛季奖励

### 8.1 赛季周期

```
赛季周期：6周（42天）
  ┌──────────────────────────────────────────────────┐
  │ 第1-41天：正常赛季                                 │
  │ 第42天：赛季结算日（22:00停止匹配，开始结算）       │
  │ 第42天22:00 ~ 第43天10:00：结算期（不可匹配）      │
  │ 第43天10:00：新赛季开始                            │
  └──────────────────────────────────────────────────┘
```

### 8.2 赛季结算规则

- 按本赛季最高段位发放奖励（HighestRankScore）
- 结算时积分软重置：新赛季初始积分 = (上赛季积分 - 1000) × 0.5，最低0
- 排名奖励：全服前1/3/10/50名额外奖励

### 8.3 积分软重置

```csharp
public int CalculateResetScore(int lastSeasonScore)
{
    int baseScore = (int)((lastSeasonScore - 1000) * 0.5);
    return Math.Max(0, baseScore);
}
```

| 上赛季积分 | 新赛季初始积分 |
|-----------|--------------|
| 0 | 0 |
| 500 | 0 |
| 1000 | 0 |
| 1500 | 250 |
| 2000 | 500 |
| 2500 | 750 |
| 3000 | 1000 |

### 8.4 奖励发放

- 赛季结算时自动发放到邮件
- 邮件标题："赛季结算奖励 - {赛季名}"
- 邮件内容："您在{赛季名}中达到{段位名}，获得以下奖励："
- 奖励有效期：30天

---

## 9. 竞技场商店

### 9.1 商店配置表 TB_ArenaShop

| 字段 | 类型 | 说明 |
|------|------|------|
| shop_id | int | 商品ID |
| item_id | int | 物品ID |
| item_count | int | 物品数量 |
| cost_coin | int | 竞技场币价格 |
| stock_limit | int | 购买上限（0=无限） |
| refresh_type | int | 刷新类型（0=不刷新, 1=每日, 2=每周, 3=每月） |
| required_rank_id | int | 需求段位ID（0=不限） |

### 9.2 商品列表

| shop_id | 商品 | 价格(竞技场币) | 限购 | 需求段位 |
|---------|------|--------------|------|---------|
| 1 | SSR碎片自选×1 | 500 | 每周2个 | 黄金I+ |
| 2 | SSR随机碎片×1 | 200 | 每周5个 | 白银I+ |
| 3 | SR碎片自选×1 | 100 | 每周10个 | 不限 |
| 4 | 橙神器碎片×1 | 800 | 每月1个 | 铂金III+ |
| 5 | 金神器碎片×1 | 300 | 每月3个 | 黄金III+ |
| 6 | 高级经验书×5 | 150 | 每周5组 | 不限 |
| 7 | 金币×10000 | 100 | 每日3个 | 不限 |
| 8 | 强化石×10 | 200 | 每周5组 | 不限 |
| 9 | 转职凭证×1 | 500 | 每月2个 | 铂金I+ |
| 10 | 大师专属头像框 | 2000 | 赛季1个 | 大师 |

### 9.3 商店刷新

- 每日商品：每日5:00刷新
- 每周商品：每周一5:00刷新
- 每月商品：每月1日5:00刷新
- 赛季商品：新赛季开始时刷新

---

## 10. 边界条件与测试用例

### TC-01: 积分下限保护

- **前置条件**: 玩家积分为10
- **操作**: 挑战失败
- **预期结果**: 积分变为0，不会出现负数
- **验证**: `Assert.AreEqual(0, player.RankScore)`

### TC-02: 大师段位无上限

- **前置条件**: 玩家积分2999，胜利
- **操作**: 积分+30 → 3029
- **预期结果**: 段位变为大师，积分无上限
- **验证**: `Assert.AreEqual(600, GetRankId(3029))`

### TC-03: 段位保护触发

- **前置条件**: 玩家首次从白银升入黄金（积分1500），保护次数3
- **操作**: 连续3场失败
- **预期结果**: 3场失败不扣分，保护次数归零，第4场失败正常扣分
- **验证**: `Assert.AreEqual(0, player.DemotionProtectionCount); Assert.AreEqual(1500, player.RankScore)`

### TC-04: 匹配无对手

- **前置条件**: 玩家积分3000+，±200范围内无其他玩家
- **操作**: 刷新对手列表
- **预期结果**: 扩大搜索范围至±400，返回可匹配的对手；若仍无，返回模拟AI对手（系统预设编队）
- **验证**: `Assert.IsTrue(opponents.Count > 0)`

### TC-05: 防守编队未设置

- **前置条件**: 新玩家未设置防守编队
- **操作**: 其他玩家匹配到该玩家
- **预期结果**: 该玩家不出现在匹配池中，不会被匹配
- **验证**: `Assert.IsFalse(candidates.Contains(player))`

### TC-06: 挑战次数耗尽后购买

- **前置条件**: 免费次数0，钻石余额100
- **操作**: 购买1次挑战
- **预期结果**: 钻石-50，挑战次数+1
- **验证**: `Assert.AreEqual(50, diamondBalance); Assert.AreEqual(1, challengesRemaining)`

### TC-07: 钻石不足购买挑战

- **前置条件**: 免费次数0，钻石余额30
- **操作**: 尝试购买挑战
- **预期结果**: 提示钻石不足，不允许挑战
- **验证**: `Assert.IsFalse(CanChallenge(player))`

### TC-08: 战斗超时平局

- **前置条件**: 双方实力接近
- **操作**: 战斗达到20回合仍未分胜负
- **预期结果**: 判定为平局，攻方积分-5，守方积分不变
- **验证**: `Assert.AreEqual(ArenaBattleResult.Draw, record.Result); Assert.AreEqual(-5, record.RankChange)`

### TC-09: 赛季结算时正在战斗

- **前置条件**: 赛季结束前1分钟开始挑战
- **操作**: 战斗跨过结算时间
- **预期结果**: 战斗正常结算，积分变化计入当前赛季；结算以战斗开始时的积分为准
- **验证**: `Assert.IsTrue(record.Timestamp < season.EndDate)`

### TC-10: 竞技场商店限购

- **前置条件**: SSR碎片自选每周限购2个，已购买2个
- **操作**: 尝试再次购买
- **预期结果**: 提示已达购买上限，不允许购买
- **验证**: `Assert.IsFalse(ShopService.Instance.CanBuy(playerId, shopId: 1))`

### TC-11: 防守编队中小队被删除

- **前置条件**: 防守编队包含小队ID=5
- **操作**: 玩家删除小队ID=5
- **预期结果**: 防守编队标记为IsSetupValid=false，该玩家暂不出现在匹配池，提示重新设置
- **验证**: `Assert.IsFalse(player.DefenseSetup.IsSetupValid)`

### TC-12: 每日挑战次数重置

- **前置条件**: 玩家已用完5次免费挑战，当前时间4:50
- **操作**: 等待至5:00
- **预期结果**: 免费挑战次数重置为5
- **验证**: `Assert.AreEqual(5, player.DailyFreeChallengesRemaining)`

---

## 附录A: 接口定义

### A.1 竞技场服务接口

```csharp
public interface IArenaService
{
    ArenaPlayer GetArenaPlayer(string playerId);
    List<ArenaPlayer> RefreshOpponents(string playerId);
    ArenaBattleRecord StartBattle(string attackerId, string defenderId, List<ArenaTargetPriority> priorities);
    ArenaBattleRecord GetBattleRecord(string battleId);
    List<ArenaBattleRecord> GetAttackHistory(string playerId, int count = 20);
    List<ArenaBattleRecord> GetDefenseHistory(string playerId, int count = 20);
    void SaveDefenseSetup(string playerId, ArenaDefenseSetup setup);
    ArenaDefenseSetup GetDefenseSetup(string playerId);
    int GetRankId(int score);
    string GetRankName(int rankId);
    void SetBattleSpeed(ArenaBattleSpeedMode mode);
    void BuyExtraChallenge(string playerId);
    void ClaimSeasonReward(string playerId, int seasonId);
    List<TB_ArenaShop> GetShopItems(string playerId);
    bool BuyShopItem(string playerId, int shopId, int count = 1);
}
```

### A.2 事件定义

```csharp
public static class ArenaEvents
{
    public static readonly string OnBattleStart = "Arena.BattleStart";
    public static readonly string OnBattleEnd = "Arena.BattleEnd";
    public static readonly string OnRankUp = "Arena.RankUp";
    public static readonly string OnRankDown = "Arena.RankDown";
    public static readonly string OnSeasonStart = "Arena.SeasonStart";
    public static readonly string OnSeasonEnd = "Arena.SeasonEnd";
    public static readonly string OnSeasonRewardClaimed = "Arena.SeasonRewardClaimed";
    public static readonly string OnOpponentRefreshed = "Arena.OpponentRefreshed";
    public static readonly string OnDefenseSetupChanged = "Arena.DefenseSetupChanged";
}
```

---

## 附录B: 竞技场币获取途径

| 途径 | 数量 | 说明 |
|------|------|------|
| 挑战胜利 | +20 | 每场 |
| 挑战失败 | +5 | 安慰奖 |
| 每日首胜 | +50 | 每日首次胜利 |
| 赛季结算 | 按段位 | 见段位奖励表 |
| 排名奖励 | 按排名 | 前50名额外奖励 |
