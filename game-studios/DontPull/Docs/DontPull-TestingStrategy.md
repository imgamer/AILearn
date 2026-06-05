# Don't Pull — 测试方案与策略

> 基于游戏策划文档、3D策划文档、UE5技术分析文档和400条用户故事
> 按5个开发里程碑阶段组织，覆盖单元测试、集成测试、功能测试

---

## 目录

1. [测试总览与原则](#1-测试总览与原则)
2. [里程碑1：核心可玩原型](#2-里程碑1核心可玩原型)
3. [里程碑2：完整单关体验](#3-里程碑2完整单关体验)
4. [里程碑3：完整游戏流程](#4-里程碑3完整游戏流程)
5. [里程碑4：打磨与优化](#5-里程碑4打磨与优化)
6. [里程碑5：发布品质](#6-里程碑5发布品质)
7. [附录：测试基础设施](#7-附录测试基础设施)

---

## 1. 测试总览与原则

### 1.1 需要测试 vs 不需要测试

#### 必须自动化测试（游戏逻辑，确定性结果）

| 类别 | 内容 | 原因 |
|------|------|------|
| 网格系统 | GridToWorld/WorldToGrid/IsWalkable/45°旋转映射 | 纯数学计算，输入输出明确 |
| 碰撞矩阵 | 所有实体对的碰撞结果 | 离散规则，可穷举验证 |
| 方块行为 | 推/滑/碎/爆炸逻辑，4种类型的差异化行为 | 核心玩法，规则明确 |
| 心形拼合检测 | 横向/纵向3连检测算法 | 算法逻辑，可穷举边界 |
| 计分系统 | 所有得分事件的分值计算 | 数值计算，输入输出明确 |
| 生命/奖命系统 | 水果累计、奖命阈值递增 | 数值逻辑，公式可验证 |
| 掉率系统 | 道具掉落权重随机 | 统计验证（大量采样） |
| 关卡随机选择 | 无重复随机、课程切换 | 算法逻辑 |
| 状态机转换 | 玩家/敌人状态合法转换 | 有限状态机，可穷举 |
| 敌人AI决策 | 追踪概率、方向选择、喷火判定 | 规则化AI，可验证 |
| 计时器逻辑 | 倒计时、狂暴触发、道具过期 | 时间相关逻辑 |
| 输入映射 | 屏幕方向→格子方向转换 | 纯映射，可验证 |

#### 不需要自动化测试（纯视觉/听觉/主观体验）

| 类别 | 内容 | 替代方案 |
|------|------|----------|
| 3D模型外观 | 角色/敌人/方块/道具模型是否好看 | QA手动视觉验收 |
| Niagara特效 | 粒子效果审美质量 | QA手动视觉验收 + 美术审核 |
| 材质效果 | 发光/闪烁/脉冲是否满意 | QA手动视觉验收 + 美术审核 |
| 动画流畅度 | AnimBP Blend是否自然 | QA手动体验 + 动画师审核 |
| Camera Shake | 震动幅度是否合适 | QA手动体验 + 设计调参 |
| 音效/MetaSound | 声音是否好听 | QA手动听觉验收 + 音频师审核 |
| BGM切换 | 音乐过渡是否自然 | QA手动听觉验收 |
| UI布局美观度 | Widget设计是否好看 | QA手动视觉验收 + UI设计师审核 |
| 光照效果 | Lumen/烘焙光是否满意 | QA手动视觉验收 + 光照师审核 |
| 操作手感 | "手感"是否好 | 内部Playtest + 玩家测试 |

#### 需要功能性测试但不全自动化

| 类别 | 测试方式 | 说明 |
|------|----------|------|
| HUD数据绑定 | UE5 Functional Test + 手动验证 | 数据正确性可自动化，布局需手动 |
| UI流程 | UE5 Functional Test | Widget切换流程可自动化 |
| 关卡加载 | UE5 Functional Test | 程序化生成结果可自动化对比 |
| 3D占用体替换 | 手动验证 | 占位体→正式模型的等价性 |
| 双人本地同屏 | 手动测试 | 需要2个物理输入设备 |
| 网络复制 | UE5 Network Test | 需启动专用服务器 |

### 1.2 测试工具选择

| 测试类型 | UE5 工具 | 适用场景 |
|----------|----------|----------|
| C++ 单元测试 | `IMPLEMENT_SIMPLE_AUTOMATION_TEST` | 纯逻辑函数测试 |
| 复杂单元测试 | `IMPLEMENT_COMPLEX_AUTOMATION_TEST` | 需要参数化的测试 |
| 功能测试 | `AFunctionalTest` + `FunctionalTest` 蓝图 | 关卡/GameMode级别测试 |
| 渲染测试 | `FAutomationScreenshotTest` | 截图对比（美术资产变更检测） |
| 性能测试 | Unreal Insights + Gauntlet | 帧率/内存/DrawCall |
| AI测试 | Gameplay Debugger + Functional Test | BehaviorTree执行验证 |
| 网络测试 | Dedicated Server + 2 Clients | Replication正确性 |
| 数据验证 | `UDataValidation` / Editor Utility | DataTable/DataAsset格式校验 |

### 1.3 各里程碑测试工作量分布

| 里程碑 | 单元测试数 | 集成测试数 | 手动测试项 | 总用户故事覆盖 |
|--------|:----------:|:----------:|:----------:|:--------------:|
| M1 核心原型 | ~45 | ~12 | 8 | US-001~055, 056~074 |
| M2 单关体验 | ~35 | ~18 | 12 | US-075~269 |
| M3 完整流程 | ~15 | ~20 | 16 | US-270~384 |
| M4 打磨优化 | ~5 | ~8 | 20 | US-385~400 |
| M5 发布品质 | 0 | ~5 | 30 | 全量回归 |

---

## 2. 里程碑1：核心可玩原型

> **验收标准**：等轴测视角下，玩家可以移动、推方块、方块碾压敌人、敌人追踪玩家
> **覆盖用户故事**：US-001~055 (P0基础移动+状态), US-056~074 (P0推方块交互-普通箱子)
> **涉及系统**：网格系统 + 实体基类 + 碰撞检测 + 玩家移动 + 普通箱子推/滑/碎 + 史莱姆基础AI + 等轴测相机 + 输入映射

### 2.1 单元测试

#### 2.1.1 网格系统 (UGridManagerComponent) — 10个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-GRID-001 | GridToWorld 基本映射 | (0,0), CellSize=100 | FVector(0, 0, 0) | — |
| UT-GRID-002 | GridToWorld 45°旋转映射 | (1,0), CellSize=100 | FVector(~70.7, ~70.7, 0) | — |
| UT-GRID-003 | GridToWorld→WorldToGrid 往返一致性 | 随机GridPos (1000次) | original == roundtrip | — |
| UT-GRID-004 | WorldToGrid→GridToWorld 往返一致性 | 随机WorldPos (1000次) | 误差 < 0.01 UE单位 | — |
| UT-GRID-005 | IsWalkable 空地返回true | Cell=FLOOR, 无实体占据 | true | US-001~004 |
| UT-GRID-006 | IsWalkable 墙壁返回false | Cell=WALL | false | US-011 |
| UT-GRID-007 | IsWalkable 边界外返回false | (-1, 0), (0, -1), (width, 0) | false | US-012 |
| UT-GRID-008 | IsWalkable 被实体占据返回false | Cell=FLOOR, 有方块占据 | false | US-014 |
| UT-GRID-009 | GetCellType 索引正确 | 给定GridWidth=15, (3,2) | Cells[2*15+3] 正确 | — |
| UT-GRID-010 | SetCellType 修改后查询正确 | Set MANHOLE→Get | MANHOLE | — |

#### 2.1.2 实体基类 + 格子移动 (UGridMovementComponent) — 8个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-MOVE-001 | TryMove 空地成功 | 玩家(5,5), Direction=UP | GridPos=(5,4), bIsMoving=true | US-001 |
| UT-MOVE-002 | TryMove 墙壁阻挡 | 玩家(5,5), 目标格WALL | GridPos不变, bIsMoving=false | US-011 |
| UT-MOVE-003 | TryMove 边界阻挡 | 玩家(0,0), Direction=LEFT | GridPos不变 | US-012 |
| UT-MOVE-004 | TryMove 移动中拒绝新输入 | bIsMoving=true时TryMove | 本次输入被忽略 | US-006 |
| UT-MOVE-005 | 移动动画完成后bIsMoving恢复 | MoveProgress=1.0, Tick | bIsMoving=false, OnMoved回调触发 | US-009 |
| UT-MOVE-006 | 逻辑坐标瞬间更新 | TryMove返回后立即查GridPos | GridPos已更新为目标格 | US-009 |
| UT-MOVE-007 | 移动间隔限制 | 连续两次TryMove间隔<8帧 | 第二次被拒绝 | US-010 |
| UT-MOVE-008 | 移动间隔限制恢复 | 等待8帧后再TryMove | 成功移动 | US-010 |

#### 2.1.3 碰撞系统 — 12个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-COL-001 | 玩家→墙壁碰撞 | Player尝试移动到Wall格 | 阻挡 | US-011 |
| UT-COL-002 | 玩家→空地碰撞 | Player尝试移动到FLOOR | 移动成功 | US-001 |
| UT-COL-003 | 玩家→方块碰撞 | Player面向Block按方向键 | 触发推块逻辑 | US-056 |
| UT-COL-004 | 玩家→敌人碰撞(正常) | Player移动到Enemy格, Normal状态 | Player进入DEAD | US-023, US-042 |
| UT-COL-005 | 玩家→道具碰撞 | Player移动到Item格 | 触发拾取 | US-025 |
| UT-COL-006 | 方块→墙壁碰撞(NORMAL) | NORMAL方块滑动到Wall | 方块被压碎 | US-064 |
| UT-COL-007 | 方块→方块碰撞(NORMAL) | NORMAL方块滑动到另一个Block | 前方方块被压碎 | US-065 |
| UT-COL-008 | 方块→敌人碰撞 | 方块滑动到Enemy格 | 敌人被碾压 | US-067 |
| UT-COL-009 | 滚石→敌人碰撞 | Boulder移动到Enemy格 | 敌人被碾压 | US-156 |
| UT-COL-010 | 滚石→玩家碰撞(正常) | Boulder移动到Player格 | Player死亡 | US-043, US-169 |
| UT-COL-011 | 滚石→方块碰撞 | Boulder移动到Block格 | 方块被压碎 | US-175 |
| UT-COL-012 | 玩家→井盖碰撞 | Player移动到MANHOLE格 | 移动成功, 井盖被标记封堵 | US-163, US-164 |

#### 2.1.4 普通箱子行为 (NORMAL Block) — 7个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-BLK-001 | 推普通箱子 空地滑动 | Push(5,5)方向右, 目标格空地 | 方块滑到(6,5), 玩家到(5,5) | US-063 |
| UT-BLK-002 | 推普通箱子 碰墙压碎 | Push到Wall前 | 方块Destroy, 玩家到方块原位 | US-064 |
| UT-BLK-003 | 推普通箱子 碾压1只敌人 | 滑动路径上有1个Enemy | Enemy死亡, 计分100 | US-067, US-068 |
| UT-BLK-004 | 推普通箱子 碾压2只敌人 | 滑动路径上有2个Enemy | 2个Enemy死亡, 计分200 | US-069 |
| UT-BLK-005 | 推普通箱子 碾压3只敌人 | 滑动路径上有3个Enemy | 3个Enemy死亡, 计分300 | US-070 |
| UT-BLK-006 | 推普通箱子 碾压4只敌人 | 滑动路径上有4个Enemy | 4个Enemy死亡, 计分500 | US-071 |
| UT-BLK-007 | 推普通箱子 滑动速度 | 滑动经过3格 | 每格6帧, 总18帧 | US-103 |

#### 2.1.5 史莱姆AI — 5个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-AI-001 | 史莱姆追踪概率60% | 1000次移动决策 | 追踪次数≈600±3σ | US-117 |
| UT-AI-002 | 史莱姆随机概率40% | 1000次移动决策 | 随机次数≈400±3σ | US-117 |
| UT-AI-003 | 史莱姆选择最接近玩家的方向 | Player在(7,5), Slime在(5,5) | 优选RIGHT | — |
| UT-AI-004 | 史莱姆不可行走方向排除 | 所有可行走方向被排除 | 原地不动 | — |
| UT-AI-005 | 史莱姆移动间隔 正常20帧 | 连续移动 | 每20帧移动一格 | — |

#### 2.1.6 输入方向映射（3D等轴测）— 3个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-INPUT-001 | 屏幕上→GridUp映射 | W键按下 | 角色向GridY-1移动 | US-001 |
| UT-INPUT-002 | 摇杆4方向量化 | 左摇杆45°(右上) | 量化为UP | — |
| UT-INPUT-003 | 摇杆死区 | 左摇杆幅度5% | 无移动触发 | — |

### 2.2 集成测试

| 测试ID | 测试名称 | 测试场景 | 验证点 | 覆盖故事 |
|--------|----------|----------|--------|----------|
| IT-M1-001 | 玩家移动全流程 | 加载测试关卡, 玩家在出生点 | 4方向移动均正确, 墙壁阻挡, 边界阻挡 | US-001~014 |
| IT-M1-002 | 推块→碾压→得分完整链路 | 玩家推NORMAL方块, 路径上有2只史莱姆 | 方块滑动, 史莱姆死亡动画, 得分200, 方块最终碰墙压碎 | US-056~074 |
| IT-M1-003 | 敌人追踪玩家 | 加载测试关卡, 史莱姆生成后 | 史莱姆向玩家移动, 玩家可躲避 | US-117 |
| IT-M1-004 | 玩家→敌人受伤死亡 | 玩家移动到史莱姆所在格 | 播放死亡动画, lives--, 2秒重生 | US-042, US-049, US-051 |
| IT-M1-005 | 玩家→井盖封堵 | 玩家移动到井盖上 | 井盖状态变为BLOCKED, 不再生成敌人 | US-163~165 |
| IT-M1-006 | 方块连杀计分 | 一次推动碾压3只敌人 | 计分300, 显示"×3"飘字 | US-070 |
| IT-M1-007 | 方块滑动→碰墙链 | 方块前2格空、第3格墙 | 方块滑2格→碰墙压碎 | US-064, US-103 |
| IT-M1-008 | 玩家死亡→重生→无敌帧 | 被杀后等待2秒 | 重生、闪烁2秒、无敌帧期间不受伤害 | US-026~031, US-042~055 |
| IT-M1-009 | 等轴测视角输入 | 按W测试屏幕上方移动 | 角色沿屏幕上方移动（世界斜对角） | US-001 |
| IT-M1-010 | 多人同时输入(双人基础) | 2个PlayerController, 1P和2P各自移动 | 各自独立移动, 不冲突 | US-015~016 |

### 2.3 不需要测试的项

- 3D占位体（灰色方块/胶囊）的外观 — 仅确认碰撞盒尺寸正确
- 地板/墙壁程序化生成的美观度 — 仅确认网格坐标映射正确
- 临时音效（如有）的质量

### 2.4 里程碑1验收检查清单

| 检查项 | 验证方法 |
|--------|----------|
| 所有单元测试通过 | `Session Frontend > Automation > Run M1 Tests` |
| 所有集成测试通过 | `Functional Test > Run All M1` |
| 手动验证：玩家可4方向移动 | QA手动 |
| 手动验证：推方块视觉流畅 | QA手动 |
| 手动验证：敌人追踪AI行为合理 | QA手动 |
| 手动验证：等轴测视角方向感正确 | QA手动 |
| 手动验证：无崩溃 | 1小时压力测试 |

---

## 3. 里程碑2：完整单关体验

> **验收标准**：可以完整玩一关，从开始到过关。所有占位体替换为正式3D模型。
> **覆盖用户故事**：US-032~041 (无敌), US-075~109 (推所有方块), US-110~157 (与敌人交互), US-158~180 (地形/井盖/滚石), US-181~205 (心形拼合), US-206~246 (道具计分), US-247~269 (生命/奖命)
> **涉及系统**：4种方块全部实现 + 恐龙AI + 喷火 + 井盖生成 + 滚石 + 心形拼合 + 道具系统 + 生命系统 + 3D模型/AnimBP/材质替换

### 3.1 单元测试

#### 3.1.1 四种方块差异化行为 — 10个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-BLK-008 | 心形碰墙停止不碎 | HEART方块推到Wall | 方块在Wall前停止, 不Destroy | US-076 |
| UT-BLK-009 | 心形碰方块停止不碎 | HEART方块推到另一个Block | 方块停止, 不Destroy | US-077 |
| UT-BLK-010 | 心形互推双方停止 | HEART互相推到对方 | 两个都停止 | US-078 |
| UT-BLK-011 | 炸弹碰墙爆炸 | BOMB方块推到Wall | 方块Destroy, 3×3爆炸触发 | US-085 |
| UT-BLK-012 | 炸弹爆炸范围3×3 | BOMB爆炸, 3×3内有3只敌人 | 3只全部进入STUNNED(3s) | US-087 |
| UT-BLK-013 | 炸弹爆炸不伤玩家 | BOMB爆炸, 玩家在3×3内 | 玩家不受伤害 | US-088 |
| UT-BLK-014 | 炸弹爆炸不毁方块 | BOMB爆炸, 3×3内有普通方块 | 方块不受影响 | US-089 |
| UT-BLK-015 | 五角星推时掉落道具 | STAR方块被推动 | 推动位置生成1个道具 | US-097 |
| UT-BLK-016 | 五角星碎时掉落道具 | STAR方块碰墙压碎 | 碎裂位置生成1个道具 | US-098 |
| UT-BLK-017 | 五角星掉落随机 | 1000次掉落 | 各道具分布≈权重比例±3σ | US-099, US-225~230 |

#### 3.1.2 心形拼合检测 — 8个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-HC-001 | 横向三心连行检测 | 3心在(3,5)(4,5)(5,5) | 触发拼合 | US-181 |
| UT-HC-002 | 纵向三心连行检测 | 3心在(3,5)(3,6)(3,7) | 触发拼合 | US-182 |
| UT-HC-003 | 三心不连续不触发 | 3心在(3,5)(5,5)(7,5) | 不触发 | US-183 |
| UT-HC-004 | 三心不同行不同列不触发 | 3心在(3,3)(5,5)(7,3) | 不触发 | US-183 |
| UT-HC-005 | 仅2心不触发 | 仅2心相邻 | 不触发 | — |
| UT-HC-006 | 三心无序排列检测 | 心在(5,5)(3,5)(4,5) 无序输入 | 触发（排序后连续） | US-187 |
| UT-HC-007 | 移动后立即检测(+边界) | 心推到墙边停止(与另一心相邻) | 墙边停止时也检测 | US-185 |
| UT-HC-008 | 心形拼合保留原位 | 拼合触发后 | 3个心仍在原位 | US-188 |

#### 3.1.3 恐龙AI — 6个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-AI-006 | 恐龙追踪概率80% | 1000次移动决策 | 追踪≈800±3σ | US-126 |
| UT-AI-007 | 恐龙喷火条件满足 | 同行Player距离3格 | CanFireAtPlayer=true | US-127 |
| UT-AI-008 | 恐龙喷火条件不满足(距离>4) | 同行Player距离5格 | CanFireAtPlayer=false | US-127 |
| UT-AI-009 | 恐龙喷火条件不满足(不同行列) | 不同行不同列 | CanFireAtPlayer=false | US-127 |
| UT-AI-010 | 恐龙喷火冷却正常 | 喷火后立即再次喷火 | 第二次被拒绝(3s冷却) | US-131 |
| UT-AI-011 | 火焰占据格子不可通行 | 火焰Actor生成在格子 | IsWalkable返回false | US-129 |

#### 3.1.4 狂暴机制 — 4个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-RAGE-001 | 时间触发狂暴 | StageTimer > RageTriggerTime | 全场敌人IsRaging=true | US-145 |
| UT-RAGE-002 | 敌人数触发狂暴 | RemainingEnemies < Total×30% | 全场敌人IsRaging=true | US-146 |
| UT-RAGE-003 | 狂暴速度翻倍 | Jelly移动间隔20帧→10帧 | Normal:20帧, Raging:10帧 | US-148 |
| UT-RAGE-004 | 狂暴追踪概率提升 | 60%→90% (Jelly), 80%→90% (Dragon) | 1000次≈90%追踪 | US-149 |

#### 3.1.5 道具掉落系统 — 3个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-ITEM-001 | 权重随机分布验证 | 10000次RollRandomItem | 各道具比例≈权重/总权重±1% | US-225~230 |
| UT-ITEM-002 | 道具存在时间过期消失 | 苹果SetLifeSpan=8s, 等待9s | 道具Destroy | US-217 |
| UT-ITEM-003 | 道具过期前闪烁 | 苹果寿命剩余2s | 进入闪烁状态 | US-209 |

#### 3.1.6 计分系统 — 4个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-SCORE-001 | 连杀计分×1/×2/×3/×5 | crushCount=1/2/3/4 | 100/200/300/500 | US-235~238 |
| UT-SCORE-002 | 心形拼合计分 | OnHeartCombined | score += 5000 | US-239 |
| UT-SCORE-003 | 时间奖励计分 | timeLimit=30, stageTimer=12 | bonus = 1800 | US-242 |
| UT-SCORE-004 | 超时时间奖励为0 | stageTimer > timeLimit | bonus = 0 | US-243 |

#### 3.1.7 生命/奖命系统 — 5个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-LIFE-001 | 初始3条命 | 游戏开始 | lives=3 | US-247 |
| UT-LIFE-002 | 第1次奖命10水果 | fruitCount=9→10 | lives+1, nextLifeAt=15 | US-252, US-253 |
| UT-LIFE-003 | 第2次奖命25水果 | fruitCount=24→25 | lives+1, nextLifeAt=45 | US-254 |
| UT-LIFE-004 | 第3次奖命45水果 | fruitCount=44→45 | lives+1, nextLifeAt=70 | US-255 |
| UT-LIFE-005 | 死亡扣命生命归零GG | lives=1, 死亡 | lives=0, GameOver触发 | US-250, US-251 |

### 3.2 集成测试

| 测试ID | 测试名称 | 测试场景 | 验证点 | 覆盖故事 |
|--------|----------|----------|--------|----------|
| IT-M2-001 | 单关完整流程 | 加载Stage1, 从开始到过关 | 井盖生成→敌人AI→推方块杀敌→全部消灭→过关动画→结算 | US-270~287 |
| IT-M2-002 | 心形拼合完整链路 | 3心分别推到(3,5)(4,5)(5,5) | 检测触发→5000分→无敌10s→水果雨→敌人晕眩→BGM切换 | US-181~205 |
| IT-M2-003 | 炸弹爆炸晕眩链路 | 推BOMB到3只敌人中心碰墙 | 爆炸→3×3敌人晕眩→方块推碾晕眩敌人→得分 | US-084~093, US-136~140 |
| IT-M2-004 | 恐龙喷火完整链路 | 恐龙与玩家同行距离3 | 喷火动画→3格火焰→玩家走入火焰→死亡 | US-127~131 |
| IT-M2-005 | 滚石完整链路 | 加载含滚石关卡 | 滚石沿Spline循环→碾压路径敌人→碾压路径方块→碾压玩家 | US-169~176 |
| IT-M2-006 | 道具掉落+拾取链路 | 推STAR箱子碰墙 | 箱子碎→道具弹出→玩家移动到道具格→得分+水果计数+1 | US-094~101, US-206~218 |
| IT-M2-007 | 大振拾取链路 | 玩家拾取POWER_SHAKE | 全屏震动→全场敌人晕眩5s→不影响井盖生成 | US-219~223 |
| IT-M2-008 | 狂暴触发链路 | 等待RageTriggerTime | 所有敌人变红→跟踪概率提升→速度翻倍→仍可被方块碾压 | US-145~151 |
| IT-M2-009 | 奖命触发链路 | 累计收集10个水果 | 1UP音效→1UP飘字→lives+1→nextLifeAt=15 | US-252~259 |
| IT-M2-010 | Game Over链路 | lives=1, 被敌人杀死 | 死亡→lives=0→GAMEOVER画面→10秒投币/返回标题 | US-247~269 |
| IT-M2-011 | 滚石向内变种 | 加载hasBoulderInward关卡 | 滚石每隔N秒脱离外周→向中心直线滚动→到对面外周回归 | US-177 |
| IT-M2-012 | 四种方块差异化验证 | 含NORMAL/HEART/BOMB/STAR的关卡 | 各自碰墙/碰块/碾压行为符合设计表 | US-063~109 |

### 3.3 不需要测试的项

- 3D模型的审美质量 — 艺术总监验收
- AnimBP Blend自然度 — 动画师验收
- 材质视觉效果 — 美术验收
- Niagara粒子审美 — 特效师验收

### 3.4 里程碑2验收检查清单

| 检查项 | 验证方法 |
|--------|----------|
| 所有M1+M2单元测试通过 | Automation |
| 所有M1+M2集成测试通过 | Functional Test |
| 手动验证：单关从开始到过关完整可玩 | QA |
| 手动验证：心形拼合效果达到设计预期 | QA + 设计 |
| 手动验证：所有3D模型正确显示无穿透 | QA |
| 手动验证：所有动画播放无卡顿 | QA |

---

## 4. 里程碑3：完整游戏流程

> **验收标准**：可以完整通关（32关），双人可玩。视觉效果接近发布品质。
> **覆盖用户故事**：US-270~303 (关卡流程), US-304~324 (双人模式), US-325~372 (UI/表现), US-373~384 (角色外观)
> **涉及系统**：32关数据 + 关卡随机选择 + 课程切换 + 双人模式 + HUD + 过场 + 音效 + 全部Niagara + CameraShake + 3D飘字 + 状态管理

### 4.1 单元测试

#### 4.1.1 关卡随机选择 — 3个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-STAGE-001 | 无重复随机选择 | Beginner 16关, 连续选16次 | 16关各出现1次 | US-300, US-301 |
| UT-STAGE-002 | 关卡池耗尽重新洗牌 | 16关全通过后再选 | 新一轮随机, 仍在16关中 | US-300 |
| UT-STAGE-003 | Professional课程关卡ID | 第17关开始 | StageID∈[17,32], 难度参数正确 | US-296, US-297 |

#### 4.1.2 双人模式 — 5个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-MP-001 | 玩家间阻挡 | 1P移动到2P所在格 | 1P不移动 | US-310 |
| UT-MP-002 | 方块不碾压队友 | 1P推方块碾过2P所在路径 | 2P不受伤害 | US-311 |
| UT-MP-003 | 双人井盖封堵 | 1P站在井盖, 2P受益 | 井盖被封堵, 双方都受益 | US-312, US-313 |
| UT-MP-004 | 双人独立生命 | 1P死亡 | 2P不受影响, 2P生命不变 | US-307 |
| UT-MP-005 | 双人独立得分 | 2P拾取水果 | 仅2P加分, 仅2P水果计数+1 | US-308, US-316, US-317 |

#### 4.1.3 心形拼合双人 — 3个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-MP-HC-001 | 拼合后双方无敌 | 拼心触发 | 1P和2P都进入INVINCIBLE | US-322 |
| UT-MP-HC-002 | 水果雨双方可捡 | 拼心触发水果雨 | 双方都可以拾取 | US-323 |
| UT-MP-HC-003 | 大振全场生效不论谁捡 | 2P捡大振 | 全场敌人晕眩 | US-324 |

#### 4.1.4 状态机转换 — 4个测试

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-STATE-001 | NORMAL→INVINCIBLE | 心形拼合触发 | State=INVINCIBLE, timer=10s | US-032 |
| UT-STATE-002 | INVINCIBLE→NORMAL | invincibleTimer到期 | State=NORMAL, 光效消失 | US-040, US-041 |
| UT-STATE-003 | NORMAL→DEAD(接触敌人) | Normal碰到Enemy | State=DEAD, lives-- | US-042 |
| UT-STATE-004 | DEAD→RESPAWNING→NORMAL | 死亡后2秒 | State=RESPAWNING→DAMAGED(2s)→NORMAL | US-051, US-052 |

### 4.2 集成测试

| 测试ID | 测试名称 | 测试场景 | 验证点 | 覆盖故事 |
|--------|----------|----------|--------|----------|
| IT-M3-001 | 16关连续通关 | Beginner Course完整通关 | 关卡随机无重复, 分数累计, 16关后ALL ROUND CLEAR | US-294, US-300~303 |
| IT-M3-002 | 课程切换 | 第16关通关 | ALL ROUND CLEAR→PROFESSIONAL COURSE START→加载Stage 17 | US-294~299 |
| IT-M3-003 | 32关完整通关 | 全程通关 | 32关后ALL ROUND CLEAR→制作人员名单 | US-298, US-299 |
| IT-M3-004 | 双人同屏完整关卡 | 2人在同一关卡 | 独立移动/推块/拾取, 互不阻挡, 合作消灭敌人 | US-304~324 |
| IT-M3-005 | HUD数据实时更新 | 游戏中得分、杀敌、计时变化 | HUD所有字段实时正确显示 | US-325~331 |
| IT-M3-006 | 过关结算界面 | 过关触发 | 显示得分/时间奖励/水果数/总分 | US-283~287 |
| IT-M3-007 | Intermission过场 | 第2关/第4关通关后 | 播放过场, 首次不可跳过, 后续可跳过 | US-289~293 |
| IT-M3-008 | GameOver→街机续币 | lives=0, 等待8秒投币 | Continue→从当前关开始, lives=3 | US-266~269 |
| IT-M3-009 | Continue不重置关卡 | 街机Continue | 从当前关卡重新开始而非Stage 1 | US-267 |
| IT-M3-010 | 得分飘字3D显示 | 任何得分事件 | WidgetComponent在3D空间正确显示, 1秒后消失 | US-246 |
| IT-M3-011 | CameraShake触发 | 炸弹/大振/心形拼合/滚石碾压 | 震动参数正确, 不叠加冲突 | US-334, US-347 |

### 4.3 需要手动测试但可辅助脚本的项

| 测试项 | 测试方法 | 覆盖 |
|--------|----------|------|
| 32关全部可通关 | 自动通关机器人(Dummy AI完整体验流程) + 手动抽检 | 全关卡 |
| 双人模式全流程 | 2人QA手动 | US-304~324 |
| 所有音效触发 | 对照音效清单逐一触发 | US-350~367 |
| BGM切换正确 | 对照BGM表逐场景验证 | US-368~372 |
| UI所有Widget流程 | 操作覆盖所有Widget | US-325~349 |

### 4.4 不需要测试的项

- Niagara特效审美 — 美术验收
- UMG Widget布局美观度 — UI设计师验收
- BGM/音效混音质量 — 音频师验收
- Intermission过场动画内容 — 导演验收

### 4.5 里程碑3验收检查清单

| 检查项 | 验证方法 |
|--------|----------|
| 所有M1+M2+M3单元测试通过 | Automation |
| 所有M1+M2+M3集成测试通过 | Functional Test |
| 手动验证：32关完整通关无卡关 | QA |
| 手动验证：双人同屏完整可玩 | QA |
| 手动验证：所有UI流程正确 | QA |
| 手动验证：所有音效触发正确 | QA + 音频师 |
| 手动验证：所有特效无缺失 | QA + 特效师 |

---

## 5. 里程碑4：打磨与优化

> **验收标准**：可游玩演示版。难度合理，特效完善。
> **覆盖用户故事**：US-385~400 (特殊边界情况)
> **涉及系统**：特效完善 + 难度调优 + 性能优化 + Bug修复 + 边界情况

### 5.1 单元测试 — 边界情况

| 测试ID | 测试名称 | 输入 | 预期输出 | 覆盖故事 |
|--------|----------|------|----------|----------|
| UT-EDGE-001 | 全地图方块全碎后行为 | NORMAL方块全碎 | 游戏仍可继续(用心形/滚石/井盖) | US-385, US-386 |
| UT-EDGE-002 | 所有井盖被封堵 | 2玩家各踩一个井盖, 还有更多 | 未封堵的继续生成 | US-164~168 |
| UT-EDGE-003 | 道具超量生成 | 水果雨期间所有空地已满 | 不再生成, 不崩溃 | US-232 |
| UT-EDGE-004 | 心形在滚石路径上 | 心形在BORDER_PATH上 | 滚石碾过心形, 心形被压碎 | US-081, US-175 |
| UT-EDGE-005 | 拼心后立即再拼心 | 无敌期间再次拼心 | 无敌计时器重置为10s(不叠加) | US-188, US-203 |

### 5.2 集成测试

| 测试ID | 测试名称 | 测试场景 | 验证点 |
|--------|----------|----------|--------|
| IT-M4-001 | 快速连续推块压力 | 快速连续推5个方块 | 不崩溃, 动画不重叠, 逻辑正确 |
| IT-M4-002 | 大量敌人同屏 | 井盖全开, 12+敌人同屏 | AI性能正常, 无卡顿, 无逻辑错误 |
| IT-M4-003 | 全屏图模式 | 加载isFullMap关卡 | 无外周路径, 无滚石, 敌人密度正常 |
| IT-M4-004 | 道具闪烁后消失 | 大量道具自然过期 | 闪烁2s→消失, 无残留 |
| IT-M4-005 | 双人同时推块不同方块 | 1P和2P同时各推一个方块 | 分别独立处理, 无冲突 |

### 5.3 手动测试 — 边界情况验证

| 测试项 | 场景 |
|--------|------|
| 无方块可推时如何生存 | 心形箱子不可摧是关键策略验证 |
| 滚石向内变种图 | 验证滚石向中心滚动的路径正确 |
| 全屏图无滚石 | 验证高敌人密度下的难度 |
| 长时间游玩 | 1小时+连续测试, 无内存泄漏 |

### 5.4 不需要测试的项

- 数值平衡调优 — 设计迭代, 非一次性测试
- Bug修复 — 按Bug单逐一验证, 非预先规划测试

---

## 6. 里程碑5：发布品质

> **验收标准**：60FPS稳定运行，无重大Bug，烘焙光照完成。
> **涉及系统**：烘焙光照 + ISM优化 + AI Tick优化 + 关卡流式加载 + 全量回归

### 6.1 性能测试（Unreal Insights + Gauntlet）

| 测试ID | 测试名称 | 目标 | 工具 |
|--------|----------|------|------|
| PERF-001 | 60FPS稳定 | 正常游戏60FPS, 1% Low > 50FPS | Unreal Insights |
| PERF-002 | DrawCall上限 | 静态场景 < 50 DrawCall (ISM优化后) | GPU Visualizer |
| PERF-003 | 内存峰值 | < 2GB (含32关数据流式加载) | Memory Profiler |
| PERF-004 | 加载时间 | 关卡加载 < 1秒 (Level Streaming) | Unreal Insights |
| PERF-005 | AI Tick开销 | 12敌人同屏, AI Tick < 1ms | Unreal Insights |
| PERF-006 | Niagara粒子数上限 | 同屏粒子 < 500个 | Niagara Perf |

### 6.2 回归测试

所有 M1~M4 的单元测试和集成测试全量回归。

### 6.3 手动测试 — 全量QA

| 测试项 | 说明 |
|--------|------|
| 32关×2课程完整通关 | 每种模式各通关至少1次 |
| 双人模式完整32关 | 2人合作完整通关 |
| 所有死因覆盖 | 被史莱姆/恐龙/火/滚石/大振后杀死 |
| 所有道具拾取覆盖 | 5种水果+大振 全拾取 |
| 所有音效触发 | 对照18类音效清单逐一触发 |
| 所有UI流程 | 标题→选关→游戏中→过关→Intermission→课程切换→结算→Game Over→Continue |
| 异常操作测试 | 快速按键、同时多键、Alt+Tab、窗口缩放 |

### 6.4 里程碑5验收检查清单

| 检查项 | 验证方法 |
|--------|----------|
| 性能测试全部达标 | Unreal Insights/Gauntlet |
| 全量单元+集成测试回归通过 | Automation |
| 手动QA完整测试报告 | QA |
| 无已知Critical/Blocker Bug | Bug追踪 |
| 烘焙光照完成 | 编辑器验证 |

---

## 7. 附录：测试基础设施

### 7.1 UE5 Automation Test 示例代码

```cpp
// 网格系统单元测试示例
IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FGridToWorldTest,
    "DontPull.Grid.GridToWorld_Basic",
    EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::ProductFilter
)

bool FGridToWorldTest::RunTest(const FString& Parameters)
{
    UGridManagerComponent* Grid = NewObject<UGridManagerComponent>();
    Grid->GridWidth = 15;
    Grid->GridHeight = 13;
    Grid->CellSize = 100.0f;
    Grid->bUseIsometricRotation = true;

    FVector WorldPos = Grid->GridToWorld(0, 0);
    TestEqual("GridToWorld(0,0) X", WorldPos.X, 0.0f, 0.01f);
    TestEqual("GridToWorld(0,0) Y", WorldPos.Y, 0.0f, 0.01f);

    FVector WorldPos2 = Grid->GridToWorld(1, 0);
    float ExpectedX = 100.0f * 0.707f; // CellSize * cos(45°)
    float ExpectedY = 100.0f * 0.707f;
    TestEqual("GridToWorld(1,0) X", WorldPos2.X, ExpectedX, 0.01f);
    TestEqual("GridToWorld(1,0) Y", WorldPos2.Y, ExpectedY, 0.01f);

    return true;
}

// 往返一致性测试（参数化）
IMPLEMENT_COMPLEX_AUTOMATION_TEST(
    FGridRoundtripTest,
    "DontPull.Grid.RoundtripConsistency",
    EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::ProductFilter
)

void FGridRoundtripTest::GetTests(TArray<FString>& OutBeautifiedNames,
    TArray<FString>& OutTestCommands) const
{
    for (int32 i = 0; i < 1000; i++)
    {
        OutBeautifiedNames.Add(FString::Printf(TEXT("Roundtrip #%d"), i));
        OutTestCommands.Add(FString::Printf(TEXT("%d"), i));
    }
}

bool FGridRoundtripTest::RunTest(const FString& Parameters)
{
    FRandomStream Rand(FCString::Atoi(*Parameters));

    int32 GX = Rand.RandRange(0, 14);
    int32 GY = Rand.RandRange(0, 12);

    FVector WorldPos = Grid->GridToWorld(GX, GY);
    FIntPoint GridPos = Grid->WorldToGrid(WorldPos);

    TestEqual("Roundtrip X", GridPos.X, GX);
    TestEqual("Roundtrip Y", GridPos.Y, GY);
    return true;
}
```

### 7.2 UE5 Functional Test 示例

```cpp
// 蓝图 Functional Test：推方块→碾压→得分
// AFuncTest_PushBlockCrushEnemy

UCLASS()
class AFuncTest_PushBlockCrushEnemy : public AFunctionalTest
{
    // 测试流程：
    // 1. Start: 在StageGenerator中加载预设布局(敌方在方块前方)
    // 2. Prepare: 等待生成完毕
    // 3. Tick: 发送方向输入推方块
    // 4. Assert: 方块滑动到目标位
    // 5. Assert: 敌人被消灭(IsActive=false)
    // 6. Assert: 得分增加100 (单杀)
    // 7. Finish: 标记测试完成
};
```

### 7.3 测试目录结构

```text
/Source/DontPull/
├── Tests/
│   ├── Grid/
│   │   ├── GridToWorldTests.cpp
│   │   ├── WorldToGridTests.cpp
│   │   ├── WalkableTests.cpp
│   │   └── RoundtripTests.cpp
│   ├── Movement/
│   │   ├── GridMovementTests.cpp
│   │   └── DirectionMappingTests.cpp
│   ├── Collision/
│   │   ├── CollisionMatrixTests.cpp
│   │   └── BlockCrushTests.cpp
│   ├── Blocks/
│   │   ├── NormalBlockTests.cpp
│   │   ├── HeartBlockTests.cpp
│   │   ├── BombBlockTests.cpp
│   │   └── StarBlockTests.cpp
│   ├── AI/
│   │   ├── SlimeAITests.cpp
│   │   ├── DragonAITests.cpp
│   │   ├── RageTests.cpp
│   │   └── StunTests.cpp
│   ├── HeartCombine/
│   │   └── HeartCombineDetectionTests.cpp
│   ├── Items/
│   │   ├── DropTableTests.cpp
│   │   └── PickupTests.cpp
│   ├── Score/
│   │   └── ScoreCalculationTests.cpp
│   ├── Life/
│   │   └── LifeSystemTests.cpp
│   ├── Multiplayer/
│   │   └── TwoPlayerInteractionTests.cpp
│   └── Stages/
│       ├── StageRandomSelectionTests.cpp
│       └── StageClearConditionTests.cpp
│
/Content/Tests/
├── FunctionalTests/
│   ├── FT_M1_PlayerMovement.uasset
│   ├── FT_M1_PushBlockCrushEnemy.uasset
│   ├── FT_M1_EnemyChasePlayer.uasset
│   ├── FT_M2_FullStageFlow.uasset
│   ├── FT_M2_HeartCombineFullChain.uasset
│   ├── FT_M2_BombExplosionStun.uasset
│   ├── FT_M2_DragonFireBreath.uasset
│   ├── FT_M2_BoulderCycle.uasset
│   ├── FT_M2_ItemDropAndPickup.uasset
│   ├── FT_M2_PowerShake.uasset
│   ├── FT_M2_RageTrigger.uasset
│   ├── FT_M2_ExtraLife.uasset
│   ├── FT_M2_GameOver.uasset
│   ├── FT_M3_CourseComplete.uasset
│   ├── FT_M3_TwoPlayerStage.uasset
│   ├── FT_M3_HUDDataBinding.uasset
│   ├── FT_M3_StageResultUI.uasset
│   ├── FT_M3_Intermission.uasset
│   └── FT_M4_BoundaryCases.uasset
│
└── TestMaps/
    ├── TestMap_Grid.uasset
    ├── TestMap_Blocks.uasset
    ├── TestMap_FullStage.uasset
    ├── TestMap_AllBlockTypes.uasset
    ├── TestMap_HeartCombine.uasset
    ├── TestMap_Boulder.uasset
    ├── TestMap_FullMap.uasset
    └── TestMap_TwoPlayer.uasset
```

### 7.4 DataTable/DataAsset 数据验证

```cpp
// Editor Utility 验证关卡数据完整性
UCLASS()
class UStageDataValidator : public UEditorValidatorBase
{
    // 验证项：
    // 1. 每个StageDataRow的CellMapString尺寸与GridWidth×GridHeight匹配
    // 2. 所有BlockSpawn坐标在网格范围内且目标格为FLOOR
    // 3. 所有ManholeSpawn坐标在网格范围内且目标格为FLOOR
    // 4. 心形箱子数=3 (每关)
    // 5. 1P/2P出生点存在且不重叠
    // 6. 棋子类型编码只使用合法字符(. # M B 1 2)
    // 7. BoulderCount在1~4范围内
    // 8. RageTriggerTime >= 0 且 TimeLimit >= 0
};
```

### 7.5 CI/CD 集成建议

| 阶段 | 触发条件 | 执行内容 |
|------|----------|----------|
| Pre-commit | 本地提交前 | M1单元测试 (C++ only, < 5秒) |
| PR Pipeline | 创建PR | 所有单元测试 + 数据验证 |
| Nightly Build | 每日凌晨 | 全量单元测试 + 所有集成测试 + 性能测试 |
| Release Build | 发布前 | 全量测试 + 32关自动化通关 + Gauntlet性能报告 |

### 7.6 测试数据总结

| 里程碑 | 自动化单元测试 | 自动化集成测试 | 手动测试项 | 总覆盖用户故事 |
|--------|:--------------:|:--------------:|:----------:|:--------------:|
| M1 核心原型 | 45 | 10 | 6 | ~130条 (P0) |
| M2 单关体验 | 35 | 12 | 8 | ~170条 (P0-P2) |
| M3 完整流程 | 15 | 11 | 12 | ~115条 (P2-P3) |
| M4 打磨优化 | 5 | 5 | 8 | ~16条 (P4) |
| M5 发布品质 | 0 | 5 (性能) | 30 | 全量回归 |
| **合计** | **~100** | **~43** | **~64** | **400条** |


# Don't Pull — 测试策略与系统分析文档

> 基于 Capcom 1991年街机《三个奇迹》第三作《Don't Pull》UE5.7 3D重制版
> 覆盖系统分析、风险评估、测试用例矩阵、自动化框架与执行策略
> 配套文档：[GDD](file:///workspace/game-studios/DontPull/Docs/DontPull-GameDesignDocument.md) | [3D GDD](file:///workspace/game-studios/DontPull/Docs/DontPull-3D-GameDesignDocument.md) | [UE5技术分析](file:///workspace/game-studios/DontPull/Docs/DontPull-UE5-TechnicalAnalysis.md) | [User Stories](file:///workspace/game-studios/DontPull/Docs/DontPull-UserStories.md)

---

## 测试总览

| 测试层级 | 覆盖范围 | 工具/方法 | 优先级 |
|----------|----------|-----------|--------|
| 系统分析 | 子系统架构/依赖关系/数据流 | 架构图 + 文档分析 | — |
| 风险评估 | 缺陷预测/优先级排序 | 风险矩阵 + 根因分析 | P0 |
| 单元测试 | 核心逻辑类（GridManager/碰撞/计分） | C++ Functional Test / Gauntlet | P0 |
| 集成测试 | 子系统交互（推块→碰撞判定→计分） | C++ Integration Test | P0 |
| 功能测试 | 用户故事验证（US-001~US-400） | 手动测试 + Automation Spec | P0 |
| 边界测试 | 异常/极端/竞态条件 | 手动 + 自动化 | P1 |
| 性能测试 | 帧率/内存/批量渲染 | Unreal Insights / ProfileGPU | P1 |
| 双人测试 | 本地双人模式 | 双手柄手动测试 | P2 |
| 回归测试 | 每次迭代后 | 自动化测试套件 | P0 |

---

## 一、系统架构分析

### 1.1 领域分层

```
┌─────────────────────────────────────────────────────────┐
│                    表现层（Presentation）                  │
│  UMG HUD / Niagara特效 / AnimBP / MetaSound / 3D Widget │
├─────────────────────────────────────────────────────────┤
│                  游戏逻辑层（Game Logic）                  │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────────┐  │
│  │ Grid    │ │ Player   │ │ Block  │ │ Enemy       │  │
│  │ Manager │ │ System   │ │ System │ │ AI System   │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └──────┬──────┘  │
│       └───────────┴────────────┴─────────────┘         │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────────┐     │
│  │Collision│ │ Score    │ │ Heart Merge / Item    │     │
│  │ System  │ │ System   │ │ Power-Up System      │     │
│  └─────────┘ └──────────┘ └──────────────────────┘     │
├─────────────────────────────────────────────────────────┤
│                   数据层（Data Layer）                    │
│  DataTable / DataAsset / SaveGame / JSON Level Data     │
└─────────────────────────────────────────────────────────┘
```

### 1.2 子系统依赖关系

```
GridManager ──→ CollisionSystem ──→ PlayerSystem
     │                                    │
     ├──→ BlockSystem ←──────────────────┘
     │         │
     │         ├──→ ScoreSystem
     │         ├──→ ItemSystem
     │         └──→ HeartMergeSystem
     │
     ├──→ EnemyAISystem ←─── ItemSystem (大振晕眩)
     │         │
     │         └──→ ScoreSystem
     │
     ├──→ BoulderSystem ──→ CollisionSystem
     │
     └──→ ManholeSystem ──→ EnemyAISystem (生成)
```

### 1.3 核心数据流

```
玩家输入 → [EnhancedInput] →
  PlayerController → GridMovementComponent →
    GridManager(格子检测) → CollisionSystem(碰撞判定) →
      ├─ 空地 → 移动实体 → 更新逻辑坐标 → 插值动画
      ├─ 方块 → PushBlock(方向检测) → BlockSystem →
      │         ├─ 滑动 → 持续碰撞检测 → 碾压/撞墙/停止
      │         └─ 炸弹 → 3×3晕眩特效
      ├─ 敌人 → 受伤判定 → PlayerStateMachine → 死亡/无敌
      ├─ 道具 → ItemPickup → ScoreUpdate → HUD刷新
      └─ 井盖 → ManholeBlock → EnemySpawnStop
```

---

## 二、核心链路清单

### 2.1 玩法核心链路（P0 — 发布阻断）

| 链路ID | 链路名称 | 端到端流程 | 涉及子系统 | 覆盖US数 |
|--------|----------|-----------|-----------|---------|
| CL-01 | **玩家移动链路** | 输入→Grid检测→碰撞判定→坐标更新→动画播放 | EnhancedInput, GridManager, CollisionSystem, Entity | US-001~020 (20条) |
| CL-02 | **推块→碾压→计分链路** | 推块方向判定→Block滑动→碰撞检测→敌人碾压→Score更新 | GridManager, BlockSystem, CollisionSystem, ScoreSystem | US-056~109, US-235~238 (58条) |
| CL-03 | **玩家受伤→死亡→重生链路** | 碰撞敌人→状态切换→死亡动画→扣命→复活→无敌帧恢复 | PlayerStateMachine, CollisionSystem, LifeSystem | US-042~055 (14条) |
| CL-04 | **敌人AI追踪→攻击链路** | AI决策→方向选择→移动→喷火/追踪→碰撞→伤害 | EnemyAISystem, BehaviorTree, GridManager, CollisionSystem | US-110~157 (48条) |

### 2.2 玩法进阶链路（P1~P2）

| 链路ID | 链路名称 | 端到端流程 | 涉及子系统 | 覆盖US数 |
|--------|----------|-----------|-----------|---------|
| CL-05 | **心形拼合→无敌→水果雨链路** | 3心到位→拼合检测→无敌触发→水果雨生成→奖励结束 | BlockSystem(Heart), HeartMergeSystem, PlayerStateMachine, ItemSystem | US-181~205 (25条) |
| CL-06 | **炸弹爆炸→晕眩→碾压链路** | 炸弹撞墙→爆炸→3×3晕眩→推块碾压晕眩敌 | BlockSystem(Bomb), EnemyAISystem(Stun) | US-084~092 (9条) |
| CL-07 | **五角星→掉落→拾取→计分链路** | 星箱推动→道具掉落→走到道具格→拾取→加分+概率系统 | BlockSystem(Star), ItemSystem, ScoreSystem | US-094~101, US-206~246 (49条) |
| CL-08 | **奖命→累积→1UP链路** | 拾取水果→计数→阈值→奖命→HUD刷新 | ItemSystem, LifeSystem, ScoreSystem | US-247~269 (23条) |
| CL-09 | **关卡流程链路** | 关卡加载→开始等待→敌人出怪→计时→灭敌→结算→下一关 | LevelSystem, EnemyAISystem, ScoreSystem | US-270~303 (34条) |

### 2.3 边缘与特殊链路（P3）

| 链路ID | 链路名称 | 端到端流程 | 涉及子系统 | 覆盖US数 |
|--------|----------|-----------|-----------|---------|
| CL-10 | **滚石碾压链路** | 滚石沿外周移动→路径碰撞→碾压/压碎→Score更新 | BoulderSystem, CollisionSystem, ScoreSystem | US-169~178 (10条) |
| CL-11 | **井盖封堵链路** | 玩家踩井盖→封堵→停止出怪→离开→恢复出怪 | ManholeSystem, EnemyAISystem | US-163~168 (6条) |
| CL-12 | **敌人狂暴触发链路** | 时间阈值/敌人数不足→狂暴→加速+高追踪→击杀 | EnemyAISystem(Rage), TimerSystem | US-145~151 (7条) |
| CL-13 | **双人协作链路** | 两人同屏→独立输入→分生命/得分→不重叠→一人死不结束 | MultiplayerSystem, PlayerStateMachine | US-304~324 (21条) |
| CL-14 | **课程切换链路** | 16关通关→ALL ROUND CLEAR→PROFESSIONAL→再16关→真通关 | LevelSystem, CourseSystem | US-294~303 (10条) |

---

## 三、风险区域分析

### 3.1 风险矩阵

| 风险ID | 风险区域 | 风险描述 | 影响范围 | 发生概率 | 影响程度 | 风险等级 |
|--------|---------|---------|---------|---------|---------|---------|
| R-01 | **格子移动与输入映射** | 等轴测45°视角下屏幕方向→格子方向映射错误，导致玩家操作方向感混乱 | 整个PlayerSystem | 中 | 致命 | **P0** |
| R-02 | **碰撞判定竞态条件** | 多实体同一帧移动到同一格，碰撞判定顺序导致不一致结果 | CollisionSystem, BlockSystem | 中 | 高 | **P0** |
| R-03 | **推块滑动连锁碰撞** | 推块滑动过程中多个敌人/方块在路径上，碾压判定顺序和计分累加错误 | BlockSystem, ScoreSystem | 高 | 高 | **P0** |
| R-04 | **状态机状态泄漏** | 玩家状态切换异常（如死亡中还能推块，无敌帧被覆盖） | PlayerStateMachine | 低 | 高 | **P1** |
| R-05 | **心形拼合边界检测** | 3心在非标准排列（L形/中间隔障碍）时误判为拼合，或边缘情况漏判 | HeartMergeSystem | 中 | 高 | **P1** |
| R-06 | **AI追踪死锁** | 敌人和玩家在狭窄通道中互相堵住，AI持续尝试无效移动导致性能下降 | EnemyAISystem | 中 | 中 | **P1** |
| R-07 | **狂暴+无敌状态叠加** | 玩家无敌期间敌人狂暴，敌人攻击状态与玩家无敌状态叠加时的行为冲突 | PlayerStateMachine, EnemyAISystem | 低 | 中 | **P1** |
| R-08 | **水果雨生成位置冲突** | 大量水果（15~25个）在小地图空地不足时生成在实体上或墙内 | ItemSystem, GridManager | 中 | 中 | **P2** |
| R-09 | **双人同帧操作冲突** | 两人同时在井盖上/推同一块心形/同时死亡等并发场景 | MultiplayerSystem | 中 | 中 | **P2** |
| R-10 | **性能退化** | 大量敌人+特效+ISM渲染在低配机器上帧率崩溃 | 全系统 | 低 | 高 | **P1** |
| R-11 | **计分整数溢出** | 长时间游玩得分超过int32最大值 | ScoreSystem | 极低 | 中 | **P2** |
| R-12 | **UI与逻辑数据不一致** | HUD显示的分数/生命/水果数与后台实际值不同步 | UISystem, ScoreSystem, LifeSystem | 低 | 高 | **P1** |

### 3.2 高风险区域详解

#### R-01：等轴测方向映射（最高风险）

```
问题：3D等轴测视角下，屏幕4方向不等同于格子4方向
方案选型：3D-GDD 方案A（旋转网格45°）

关键风险点：
  1. 网格旋转45°后，GridToWorld映射公式是否正确
  2. 实体碰撞判定是否仍使用逻辑网格坐标而非世界坐标
  3. 45°旋转后"正交"推块手感是否与2D原版一致
  4. 双人模式下方向映射是否一致

测试建议：
  - 每个屏幕方向手动验证 → 世界方向 → 格子方向 → 实际移动
  - 测量玩家"直觉正确率"（找非项目人员测试）
  - 4方向+斜向输入都不应产生非预期移动
```

#### R-02/R-03：碰撞判定顺序（核心风险）

```
问题：格子对齐移动中，多个实体同一逻辑帧竞争同格
典型场景：
  1. 推块碾压多个敌人：块滑动、路径上3个敌人、1个道具→碾压判定顺序
  2. 滚石碾压+方块压碎+敌人死亡→计分事件顺序
  3. 玩家推块+敌人同时走向玩家→谁先判定

固定优先级（来自GDD 1.4.1）：
  墙 > 方块 > 敌人 > 道具 > 玩家

测试建议：
  - 设计多实体同帧碰撞矩阵表
  - 自动化测试每个碰撞组合
  - 特殊测试：3个以上实体在同一直线上被碾压
```

#### R-06：AI寻路死锁

```
问题：格子寻路中，敌人可能反复尝试无效方向
高风险场景：
  1. 玩家和敌人在狭窄走廊两端对峙 → 敌对墙空挥
  2. 多个敌人挤在单格入口 → 互相拥堵
  3. 敌人追踪路径被方块封死 → AI无反应

UE方案中的风险：
  - BehaviorTree + EQS 在高密度敌人时的性能
  - 自定义格子AI在拥堵时的fallback行为

测试建议：
  - 构建"死胡同"地图测试AI行为
  - 大量敌人（10+）在狭小空间测试拥堵
  - 验证EQS/自定义AI没有性能退化
```

---

## 四、测试重心建议

### 4.1 按子系统测试投入分配

```
Grid System:        ████████████████░░░░  15%  (基础，必须稳)
Collision System:   ████████████████████  20%  (核心，最多bug)
Block System:       ██████████████████░░  18%  (4种方块 × N种碰撞)
Enemy AI System:    ██████████████░░░░░░  14%  (AI状态机 + 概率)
Player State:       ████████████░░░░░░░░  12%  (5种状态切换)
Item/Score:         ████████░░░░░░░░░░░░   8%  (逻辑简单但组合多)
UI/HUD:             █████░░░░░░░░░░░░░░░   5%  (数据同步)
Performance:        ████████░░░░░░░░░░░░   8%  (3D渲染性能)
```

### 4.2 第一优先级测试目标（发布阻断）

| 优先级 | 测试目标 | 风险关联 | 验证方式 |
|--------|---------|---------|---------|
| P0 | **玩家移动在等轴测视角下方向正确** | R-01 | 每个方向手动验证10次 |
| P0 | **推块→碾压→计分全链路正确** | R-02, R-03 | 32个碰撞矩阵组合自动化测试 |
| P0 | **4种方块行为完全符合规则** | R-02 | 每种方块10种碰撞场景 |
| P0 | **玩家状态切换100%正确** | R-04 | 状态机全路径覆盖 |
| P0 | **敌人AI追踪/攻击基础行为** | R-06 | 史莱姆+恐龙各20个场景 |
| P0 | **井盖→生成→封堵→恢复** | — | 手动验证5个场景 |

### 4.3 第二优先级测试目标

| 优先级 | 测试目标 | 风险关联 | 验证方式 |
|--------|---------|---------|---------|
| P1 | **心形拼合边界检测（L形/被挡/滑动中）** | R-05 | 12种排列组合 |
| P1 | **狂暴触发→加速→杀玩家** | R-07 | 狂暴前后对比测试 |
| P1 | **炸弹爆炸+晕眩→碾压** | R-03 | 5种爆炸覆盖场景 |
| P1 | **UI数据实时同步** | R-12 | 自动化数据比对 |
| P1 | **低配设备性能达标** | R-10 | 性能基准测试 |
| P1 | **水果雨生成不冲突** | R-08 | 10次小地图验证 |

### 4.4 第三优先级测试目标

| 优先级 | 测试目标 | 风险关联 | 验证方式 |
|--------|---------|---------|---------|
| P2 | **双人模式并发操作** | R-09 | 20个双人协作场景 |
| P2 | **关卡流程完整链路** | — | Beginner+Professional全流程 |
| P2 | **计分+奖命满边界** | R-11 | 长时间挂机测试 |
| P2 | **32关地图数据完整性** | — | 自动化数据校验 |
| P2 | **全400条US验收** | — | 每条US手动或自动验证 |

### 4.5 特殊测试场景建议

```
一、并发场景（同一帧多个事件）
  ├─ 推块 + 敌人走向玩家 + 滚石经过 → 碰撞判定优先级
  ├─ 炸弹爆炸 + 心形拼合同时触发 → 状态叠加
  ├─ 双人同时推同一块心形 → 冲突处理
  └─ 玩家死亡 + 另一玩家找井盖 → 独立处理

二、时间敏感场景
  ├─ 受伤无敌帧最后0.1秒碰敌 → 是否受伤
  ├─ 无敌状态最后0.1秒碰敌 → 敌人是否死
  ├─ 道具消失前0.1秒拾取 → 能否捡到
  └─ 狂暴和拼心同帧触发 → 谁优先

三、数值边界
  ├─ 计分 int32 最大值 (2,147,483,647)
  ├─ 生命数累积到极高值（奖命>50）
  ├─ 场上同时存在最大实体数（敌人+方块+水果+玩家）
  └─ 小地图(11×11) vs 大地图(17×15) 极端对比
```

---

## 五、单元测试（Unit Tests）

### 5.1 网格系统（GridManager）

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-GRID-001 | 获取格子类型 | 3×3网格，中心为WALL | `GetCell(1,1)` | 返回 WALL | — |
| UT-GRID-002 | 获取格子类型越界 | 3×3网格 | `GetCell(5,5)` | 断言/返回错误 | — |
| UT-GRID-003 | 设置格子类型 | 3×3网格 | `SetCell(0,0, WALL)` | Cells[0] == WALL | — |
| UT-GRID-004 | 空地可通行 | 空地格子 | `isWalkable(0,0)` | true | US-158 |
| UT-GRID-005 | 墙壁不可通行 | 墙壁格子 | `isWalkable(1,1)` | false | US-011 |
| UT-GRID-006 | 被占据格子不可通行 | 有空地但occupied | `isWalkable(0,0)` | false | US-013 |
| UT-GRID-007 | 可推入判定-空地无实体 | 空地无实体 | `isPushable(0,0)` | true | — |
| UT-GRID-008 | 可推入判定-有实体 | 空地但occupied | `isPushable(0,0)` | false | — |
| UT-GRID-009 | 可推入判定-墙壁 | 墙壁格子 | `isPushable(1,1)` | false | — |
| UT-GRID-010 | 可推入判定-边界外 | 网格边界外 | `isPushable(-1,0)` | false | — |
| UT-GRID-011 | WorldToGrid 转换 | 100单位格，位置(150, 50) | `worldToGrid((150,50))` | (1, 0) | — |
| UT-GRID-012 | GridToWorld 转换 | 100单位格，坐标(1, 0) | `gridToWorld((1,0))` | (100, 0) | — |
| UT-GRID-013 | 网格初始化所有格为FLOOR | 新建4×4网格 | 构造函数 | 16格全部为FLOOR | — |
| UT-GRID-014 | 边界墙设置正确 | 5×5网格带边界 | 构造后检查 | 边缘为WALL，内部为FLOOR | — |
| UT-GRID-015 | 3D GridToWorld 等轴测旋转 | 旋转45°的网格 | `gridToWorld((0,1))` | 等轴测校正后的FVector | 3D-GDD-1.1 |

### 5.2 实体基类与移动

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-ENT-001 | 实体初始坐标 | 新建实体 | 构造函数 | gridX/gridY 为指定值 | — |
| UT-ENT-002 | 向上移动一格 | 实体在(1,1) | `moveTo(UP)` | gridY变为0，移动动画启动 | US-001 |
| UT-ENT-003 | 向下移动一格 | 实体在(1,1) | `moveTo(DOWN)` | gridY变为2，移动动画启动 | US-002 |
| UT-ENT-004 | 向左移动一格 | 实体在(1,1) | `moveTo(LEFT)` | gridX变为0，移动动画启动 | US-003 |
| UT-ENT-005 | 向右移动一格 | 实体在(1,1) | `moveTo(RIGHT)` | gridX变为2，移动动画启动 | US-004 |
| UT-ENT-006 | 移动动画进度 | 移动中 | tick 0.05s | moveProgress ≈ 0.5 | US-007 |
| UT-ENT-007 | 移动完成回调 | 移动动画结束 | tick至完成 | `onMoved`被调用 | — |
| UT-ENT-008 | 移动期间不可再移动 | 移动中 | 再次`moveTo` | 返回false | — |

### 5.3 碰撞系统

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-COL-001 | 玩家→墙壁阻挡 | 玩家面对墙壁 | 玩家向墙壁移动 | 不移动，返回阻挡 | US-011/US-160 |
| UT-COL-002 | 玩家→空地通行 | 玩家面对空地 | 玩家向空地移动 | 移动到空地 | US-001~004 |
| UT-COL-003 | 玩家→方块触发推块 | 玩家面对方块 | 玩家向方块移动 | 触发推块逻辑 | US-056 |
| UT-COL-004 | 玩家→敌人受伤 | 正常状态碰敌人 | 玩家走入敌人格 | 玩家死亡 | US-023 |
| UT-COL-005 | 玩家→道具拾取 | 面前有道具 | 玩家走入道具格 | 拾取道具 | US-206 |
| UT-COL-006 | 方块→墙壁压碎 | 方块被推向墙壁 | 方块碰墙 | 普通/炸弹/星星压碎 | US-064 |
| UT-COL-007 | 方块→墙壁停止（心形） | 心形被推向墙壁 | 心形碰墙 | 停止，不压碎 | US-076 |
| UT-COL-008 | 方块→敌人碾压 | 方块滑动路上有敌人 | 方块碰敌人 | 敌人被碾压消灭 | US-067 |
| UT-COL-009 | 滚石→玩家死亡 | 滚石碰到玩家 | 滚石过玩家格 | 玩家死亡 | US-169 |
| UT-COL-010 | 滚石→方块压碎 | 滚石碰到方块 | 滚石过方块格 | 方块被压碎 | US-175 |
| UT-COL-011 | 滚石→敌人碾压 | 滚石碰到敌人 | 滚石过敌人格 | 敌人被碾压消灭 | US-156 |
| UT-COL-012 | 无敌玩家→敌人消灭 | 无敌状态碰敌人 | 玩家走入敌人格 | 敌人死亡，玩家无事 | US-034 |
| UT-COL-013 | 受伤无敌帧→敌人无效 | 受伤无敌帧碰敌人 | 玩家走入敌人格 | 不受伤害 | US-028 |

### 5.4 推方块系统

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-BLK-001 | 推普通箱子滑动一格 | 玩家推普通箱 | 推块操作 | 箱子滑动一格 | US-063 |
| UT-BLK-002 | 推普通箱子持续滑动 | 前方无障碍 | 推块操作 | 箱子滑到撞墙/物为止 | US-102 |
| UT-BLK-003 | 推普通箱子撞墙压碎 | 箱子前方是墙 | 推块操作 | 箱子压碎消失 | US-064 |
| UT-BLK-004 | 推普通箱子撞方块压碎 | 箱子前方有方块 | 推块操作 | 前方方块被压碎 | US-065 |
| UT-BLK-005 | 推心形箱子滑动 | 玩家推心形箱 | 推块操作 | 心形滑动 | US-075 |
| UT-BLK-006 | 推心形箱子撞墙停止 | 心形前方是墙 | 推块操作 | 心形停止，不压碎 | US-076 |
| UT-BLK-007 | 推心形箱子撞方块停止 | 心形前方有方块 | 推块操作 | 心形停止 | US-077 |
| UT-BLK-008 | 推炸弹箱子爆炸3×3晕眩 | 炸弹撞墙 | 推块操作 | 3×3内敌人晕眩3秒 | US-085~087 |
| UT-BLK-009 | 推炸弹箱子不伤玩家 | 玩家在3×3内 | 推块操作 | 玩家不受伤害 | US-088 |
| UT-BLK-010 | 推五角星箱子掉落道具 | 推五角星箱 | 推块操作 | 掉落随机道具 | US-097 |
| UT-BLK-011 | 推五角星箱子压碎掉落 | 五角星撞墙 | 推块操作 | 压碎+掉落道具 | US-098 |
| UT-BLK-012 | 推两个相连方块前方压碎 | 两方块相连 | 推块操作 | 前方方块压碎 | US-104 |
| UT-BLK-013 | 推方块滑动速度6帧/格 | 推方块 | tick计时 | 每6帧移动一格 | US-103 |
| UT-BLK-014 | 心形不可被摧毁 | 心形碰撞任何障碍 | 各种碰撞 | 心形不消失 | US-076~077 |

### 5.5 计分系统

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-SCR-001 | 碾压1只敌人得100分 | 推箱碾压1敌 | 碾压事件 | 得分+100 | US-068 |
| UT-SCR-002 | 碾压2只敌人得200分 | 推箱碾压2敌 | 碾压事件 | 得分+200 | US-069 |
| UT-SCR-003 | 碾压3只敌人得300分 | 推箱碾压3敌 | 碾压事件 | 得分+300 | US-070 |
| UT-SCR-004 | 碾压4+只敌人得500分 | 推箱碾压4敌 | 碾压事件 | 得分+500 | US-071 |
| UT-SCR-005 | 拼心得5000分 | 拼合成功 | 拼合事件 | 得分+5000 | US-189 |
| UT-SCR-006 | 滚石碾压得100分/只 | 滚石碾压1敌 | 碾压事件 | 得分+100 | US-174 |
| UT-SCR-007 | 无敌碰触消灭得100分/只 | 无敌碰触1敌 | 消灭事件 | 得分+100 | US-241 |
| UT-SCR-008 | 拾取苹果+100分 | 拾取苹果 | 拾取事件 | 得分+100 | US-211 |
| UT-SCR-009 | 拾取梨+200分 | 拾取梨 | 拾取事件 | 得分+200 | US-212 |
| UT-SCR-010 | 拾取樱桃+300分 | 拾取樱桃 | 拾取事件 | 得分+300 | US-213 |
| UT-SCR-011 | 拾取蛋糕+500分 | 拾取蛋糕 | 拾取事件 | 得分+500 | US-214 |
| UT-SCR-012 | 时间奖励=剩余时间×100 | 通关剩余30s | 通关结算 | 时间奖励+3000 | US-242 |
| UT-SCR-013 | 超时时间奖励为0 | 超时通关 | 通关结算 | 时间奖励+0 | US-243 |

### 5.6 玩家状态管理

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-PLY-001 | 初始状态为NORMAL | 游戏开始 | 检查状态 | CurrentState == NORMAL | US-021 |
| UT-PLY-002 | 正常状态碰敌→死亡 | NORMAL + 碰敌 | 碰撞检测 | 进入DEAD状态 | US-023 |
| UT-PLY-003 | 重生后进入受伤无敌帧 | 死亡+有命 | 重生 | 进入DAMAGED状态2秒 | US-026 |
| UT-PLY-004 | 受伤无敌帧闪烁表现 | DAMAGED | tick | 角色闪烁 | US-027 |
| UT-PLY-005 | 受伤无敌帧碰敌不受伤 | DAMAGED + 碰敌 | 碰撞检测 | 不受伤 | US-028 |
| UT-PLY-006 | 受伤无敌帧2秒后恢复 | DAMAGED | 等待2秒 | 恢复NORMAL | US-031 |
| UT-PLY-007 | 拼心后进入INVINCIBLE | 拼合成功 | 状态检测 | 进入INVINCIBLE状态10秒 | US-032 |
| UT-PLY-008 | 无敌状态碰敌敌人死 | INVINCIBLE + 碰敌 | 碰撞检测 | 敌人死亡 | US-034 |
| UT-PLY-009 | 无敌状态无视滚石 | INVINCIBLE + 滚石 | 碰撞检测 | 不受伤害 | US-035 |
| UT-PLY-010 | 无敌10秒后恢复NORMAL | INVINCIBLE | 等待10秒 | 恢复NORMAL | US-040 |
| UT-PLY-011 | 死亡扣除1条命 | 死亡 | 检测lives | lives -= 1 | US-049 |
| UT-PLY-012 | 生命为0时GameOver | lives=0 + 死亡 | 死亡流程 | Game Over | US-251 |
| UT-PLY-013 | 复活后2秒无敌帧 | 有命复活 | 重生 | 2秒DAMAGED | US-052 |

### 5.7 心形拼合判定

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-HRT-001 | 3心横向相邻触发拼合 | 3心x轴连续 | 停止检测 | 拼合成功 | US-181 |
| UT-HRT-002 | 3心纵向相邻触发拼合 | 3心y轴连续 | 停止检测 | 拼合成功 | US-182 |
| UT-HRT-003 | 2心不触发拼合 | 仅2心相邻 | 停止检测 | 不触发 | — |
| UT-HRT-004 | 4心不触发拼合（3心连线才触发） | 4心L形排列 | 停止检测 | 不触发 | — |
| UT-HRT-005 | 心形被挡时也检测 | 心形停在前方 | 停止检测 | 拼合成功 | US-186 |
| UT-HRT-006 | 拼合后心形保留 | 拼合成功后 | 检查 | 心形仍在原位 | US-188 |
| UT-HRT-007 | 心形滑动中不检测 | 心形正在滑动 | 检测 | 不触发 | US-184 |

### 5.8 道具系统

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-ITM-001 | 走入道具格自动拾取 | 道具在面前 | 玩家走入 | 道具消失，分数增加 | US-206 |
| UT-ITM-002 | 道具8秒后闪烁消失 | 水果生成 | 等待8秒 | 闪烁2秒后消失 | US-209 |
| UT-ITM-003 | 大振6秒后消失 | 大振道具 | 等待6秒 | 消失 | US-222 |
| UT-ITM-004 | 大振全场晕眩5秒 | 拾取大振 | 使用 | 全场敌人晕眩5秒 | US-219 |
| UT-ITM-005 | 五角星道具掉落概率 | 推五角星箱100次 | 统计 | 符合概率分布 | US-225~230 |
| UT-ITM-006 | 敌人碾压低概率掉水果 | 碾压敌人 | 概率检测 | 低概率生成水果 | US-233 |
| UT-ITM-007 | 水果雨生成15~25个 | 拼心成功 | 检测 | 场景空地出现15~25水果 | US-191 |
| UT-ITM-008 | 水果雨水果不会被卡在墙里 | 拼心成功 | 检测 | 水果只在空地生成 | US-232 |

### 5.9 奖命系统

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-LIF-001 | 开始3条命 | 游戏开始 | 检查 | lives == 3 | US-247 |
| UT-LIF-002 | 10水果奖1命 | 累计10水果 | 计数检测 | 奖命+1，下次需15 | US-252~253 |
| UT-LIF-003 | 15水果再奖1命 | 累计15水果 | 计数检测 | 奖命+1，下次需20 | US-254 |
| UT-LIF-004 | 20水果再奖1命 | 累计20水果 | 计数检测 | 奖命+1，下次需25 | US-255 |
| UT-LIF-005 | 生命无上限 | 多次奖命累积 | 检测 | life可以>9 | US-248 |

### 5.10 敌人AI

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-AI-001 | 史莱姆60%追踪 | 史莱姆AI | 100次决策统计 | 追踪≈60次 | US-117 |
| UT-AI-002 | 恐龙80%追踪 | 恐龙AI | 100次决策统计 | 追踪≈80次 | US-126 |
| UT-AI-003 | 恐龙同行/列且≤4格喷火 | 恐龙与玩家同行且距3 | 检测 | 触发喷火 | US-127 |
| UT-AI-004 | 恐龙喷火3格持续1.5秒 | 恐龙喷火 | 检测 | 3格火焰，持续1.5秒 | US-128 |
| UT-AI-005 | 恐龙喷火冷却3秒 | 喷火后 | 检测 | 3秒内不能再次喷火 | US-131 |
| UT-AI-006 | 狂暴移动速度翻倍 | 敌人狂暴 | 检测 | 移动间隔减半 | US-118/US-132 |
| UT-AI-007 | 狂暴追踪概率90% | 敌人狂暴 | 100次决策统计 | 追踪≈90次 | US-119/US-133 |
| UT-AI-008 | 狂暴恐龙冷却1.5秒 | 狂暴恐龙喷火 | 检测 | 冷却缩短为1.5秒 | US-132 |
| UT-AI-009 | 晕眩敌人不移动 | 敌人被晕眩 | tick检测 | 原地不动 | US-137 |
| UT-AI-010 | 晕眩3秒后恢复 | 敌晕眩 | 等待3秒 | 恢复行动 | US-138 |
| UT-AI-011 | 井盖定时生成敌人 | 井盖激活 | 等待 | 按间隔生成敌人 | US-152 |
| UT-AI-012 | 井盖被踩封堵 | 玩家站井盖 | 检测 | 停止生成 | US-164 |
| UT-AI-013 | 井盖离开后恢复 | 玩家离开井盖 | 检测 | 恢复生成 | US-165 |

### 5.11 双人模式

| 测试ID | 测试场景 | 前置条件 | 输入 | 预期结果 | 关联US |
|--------|----------|----------|------|----------|--------|
| UT-MP-001 | 双人不能重叠 | 两玩家相邻 | 一人走向另一人 | 被阻挡不移动 | US-310 |
| UT-MP-002 | 方块不碾压队友 | 推块路上有队友 | 推块 | 方块越过队友或无伤害 | US-311 |
| UT-MP-003 | 心形拼合双人都无敌 | 双人模式拼心 | 检测双方状态 | 两人都进入无敌 | US-322 |
| UT-MP-004 | 大振对全场敌人生效 | 双人拾取大振 | 检测 | 全场敌人晕眩 | US-324 |
| UT-MP-005 | 一人死亡另一人继续 | 2P死亡 | 检测 | 1P继续游戏 | US-318 |
| UT-MP-006 | 两人都死才GameOver | 双人死亡 | 检测 | GameOver | US-320 |

---

## 六、集成测试（Integration Tests）

| 测试ID | 测试场景 | 流程步骤 | 预期结果 | 关联US |
|--------|----------|----------|----------|--------|
| IT-001 | 完整推块→滑动→碾压→计分 | ①玩家推块→②块滑向敌人→③块碰敌人→④敌人消灭→⑤计分 | 流程全部正确，得分增加 | US-067~068 |
| IT-002 | 完整推块→滑动→撞墙→压碎 | ①推块→②块滑向墙→③块碰墙→④块压碎→⑤消失 | 块消失，无残留 | US-064 |
| IT-003 | 完整拼心→无敌→杀敌→结束 | ①3心到位→②拼合→③无敌状态→④碰敌→⑤敌消失→⑥无敌结束 | 全流程正确 | US-032~041 |
| IT-004 | 完整死亡→重生→无敌帧→恢复 | ①碰敌→②死亡→③减命→④重生→⑤无敌帧→⑥恢复 | 全流程正确 | US-042~055 |
| IT-005 | 炸弹推块→撞墙→3×3晕眩→碾压 | ①推炸弹→②撞墙→③爆炸→④敌人晕眩→⑤推块碾压 | 晕眩敌被碾压 | US-084~092 |
| IT-006 | 五角星推块→掉落→拾取→计分 | ①推星箱→②掉落道具→③拾取→④加分数 | 全流程正确 | US-094~101 |
| IT-007 | 狂暴触发→加速→追踪→击杀 | ①时间到→②狂暴→③加速→④追踪→⑤碰玩家→⑥玩家死 | 全流程正确 | US-145~151 |
| IT-008 | 关卡开始→计时→敌人生成→通关 | ①关卡加载→②2秒准备→③出怪→④计时→⑤灭敌→⑥过关 | 全流程正确 | US-270~288 |
| IT-009 | 双人协作封井盖 | ①1P站井盖A→②2P站井盖B→③两端都不出怪 | 双井盖被封堵 | US-312~313 |

---

## 七、功能测试（Functional Tests / US验证）

### 7.1 P0 核心功能（按开发优先级）

| 功能模块 | 用户故事范围 | 测试方式 | 通过标准 |
|----------|-------------|----------|----------|
| 基础移动 | US-001~020 | 手动操作验证 | 4方向移动正确，斜向不可，阻挡正常 |
| 推方块 | US-056~109 | 手动操作验证 | 4种方块推/碎/爆/掉行为正确 |
| 玩家状态 | US-021~031, US-042~055 | 手动+自动 | 状态切换正确，无敌帧生效 |
| 与敌人交互 | US-110~157 | 手动验证 | 碰撞/死亡/碾压/AI行为正确 |
| 与地形交互 | US-158~180 | 手动验证 | 墙壁/井盖/滚石交互正确 |

### 7.2 P1~P3 功能测试

| 功能模块 | 用户故事范围 | 测试方式 | 通过标准 |
|----------|-------------|----------|----------|
| 心形拼合 | US-181~205 | 手动+自动 | 拼合条件/奖励正确 |
| 道具拾取 | US-206~246 | 手动验证 | 拾取/计分/概率正确 |
| 生命系统 | US-247~269 | 手动验证 | 加减命/奖命/GameOver正确 |
| 关卡流程 | US-270~303 | 手动验证 | 开始/通关/切课程正确 |
| 双人模式 | US-304~324 | 双人手柄 | 合作/竞争/独立状态正确 |
| UI反馈 | US-325~372 | 目视验证 | HUD/特效/音效/BGM正确 |
| 角色动画 | US-373~384 | 目视验证 | 行走/推块/死亡动画正确 |

---

## 八、边界测试（Edge Cases）

| 测试ID | 测试场景 | 前置条件 | 操作 | 预期结果 |
|--------|----------|----------|------|----------|
| EC-001 | 地图边角推块 | 方块在地图边缘 | 推向边界外 | 方块被墙阻挡，不越界 |
| EC-002 | 全屏推块围绕 | 全屏图无边界 | 推向滚石路径 | 块被滚石压碎 |
| EC-003 | 同时推两个相邻方块 | 两方块相邻 | 推其中之一 | 前方块被压碎 |
| EC-004 | 所有井盖同时被踩 | 多人+多井盖 | 全部踩住 | 全不出怪 |
| EC-005 | 极限计分（大数字） | 999999分 | 继续得分 | 计分不溢出 |
| EC-006 | 极限生命（大量奖命） | 奖命>10 | 连续奖命 | 生命正确累积，HUD正确显示 |
| EC-007 | 水果雨填满所有空地 | 小地图拼心 | 水果雨 | 所有空地生成水果 |
| EC-008 | 炸弹在玩家身边爆炸 | 玩家在3×3内 | 推炸弹 | 玩家不受伤 |
| EC-009 | 狂暴前瞬间拼心 | 即将狂暴 | 拼心 | 拼心正常触发，无敌中敌人不狂暴 |
| EC-010 | 同时两个玩家死亡 | 双人 | 同时碰敌 | 分别处理，都判断GameOver |
| EC-011 | 15×15大图性能 | 大地图32关 | 持续游玩 | 帧率稳定60FPS |
| EC-012 | 快速连续按键 | 疯狂按键 | 高频输入 | 不卡输入，每帧最多移动一格 |
| EC-013 | 网络抖动（双人） | 双人模式 | 模拟延迟 | 本地双人不受影响 |
| EC-014 | 大量敌人同时呈现 | 井盖全开+不杀敌 | 等待 | 敌人数有上限/性能不降 |
| EC-015 | 心形被滚石碾压 | 心形在滚石路径 | 滚石经过 | 心形被滚石压碎（唯一例外） |

---

## 九、性能测试（Performance Tests）

| 测试ID | 测试场景 | 测量指标 | 目标值 | 工具 |
|--------|----------|----------|--------|------|
| PT-001 | 32关地图快速切换 | 关卡加载时间 | <2秒 | Unreal Insights |
| PT-002 | 大量敌人同屏（30+） | 帧率 | ≥55 FPS | Stat FPS |
| PT-003 | 大量特效同屏（爆炸+水果雨） | 帧率 | ≥50 FPS | GPU Profiler |
| PT-004 | ISM批量渲染地板/墙壁 | DrawCall数 | ≤50 | RenderDoc |
| PT-005 | 内存占用 | 峰值内存 | ≤2GB | MemReport |
| PT-006 | 长时间游玩（1小时） | 内存增长 | 无明显泄露 | LLM |
| PT-007 | 双人模式渲染 | 帧率 | ≥55 FPS | Stat FPS |
| PT-008 | 快速推块+碾压连锁 | 逻辑帧耗时 | <8ms | Stat Game |

---

## 十、自动化测试框架建议

### 10.1 UE自动化测试方案

```
/Content/Test/
├── Functional/
│   ├── M_GridTests.*          ← 网格测试Map
│   └── M_BlockTests.*         ← 方块测试Map
├── CppFunctionalTests/
│   ├── FT_GridManager.cpp     ← 网格单元测试
│   ├── FT_Collision.cpp       ← 碰撞测试
│   ├── FT_BlockSystem.cpp     ← 方块系统测试
│   ├── FT_ScoreSystem.cpp     ← 计分测试
│   ├── FT_PlayerStates.cpp    ← 状态测试
│   ├── FT_HeartMerge.cpp      ← 拼合测试
│   └── FT_EnemyAI.cpp         ← AI测试
└── Automation/
    ├── GameplayAutomation.cpp ← 流程自动化
    └── PerformanceTests.cpp   ← 性能测试
```

### 10.2 测试优先级执行顺序

```
第一轮（每次提交必跑，<5分钟）
├── UT-GRID-001~015  网格系统
├── UT-ENT-001~008   实体移动
├── UT-COL-001~013   碰撞系统
├── UT-BLK-001~014   推方块系统
└── UT-SCR-001~013   计分系统

第二轮（每日运行，<15分钟）
├── UT-PLY-001~013   玩家状态
├── UT-HRT-001~007   心形拼合
├── UT-ITM-001~008   道具系统
├── UT-LIF-001~005   奖命系统
├── UT-AI-001~013    敌人AI
└── IT-001~009       集成测试

第三轮（迭代前运行，<30分钟）
├── EC-001~015       边界测试
├── PT-001~008       性能测试
├── UT-MP-001~006    双人测试
└── 全量US手动验证
```

---

## 十一、测试分级与执行策略

### 11.1 测试金字塔（按反馈速度）

```
         ╱╲
        ╱  ╲         手动探索测试（2~4小时/迭代）
       ╱    ╲
      ╱ P0   ╲      自动化功能测试（15~20分钟）
     ╱ 核心   ╲
    ╱  链路   ╲
   ╱──────────╲
  ╱ 单元测试    ╲    C++ 单元测试 + UE Automation（3~5分钟）
 ╱──────────────╲
╱ 数据完整性校验  ╲    关卡数据/配置校验（<1分钟）
```

### 11.2 测试左移建议

```
需求阶段：
  ├─ 每条US标注验收标准和测试用例编号
  └─ 高风险区域（如等轴测映射）提前做原型验证

开发阶段：
  ├─ GridManager/碰撞/计分等纯逻辑 → TDD 先行
  ├─ 每次提交自动运行 P0 单元测试
  └─ UI/表现类集成到每日构建测试

提测阶段：
  ├─ 全自动测试套件（P0+P1）通过才允许提测
  ├─ 人工测试聚焦于 边界场景 + 手感验证
  └─ 性能测试作为Gating项（不达标不发布）
```

### 11.3 测试协作分工

| 角色 | 测试职责 | 产出物 |
|------|---------|--------|
| **开发工程师** | 单元测试、接口测试、自测 | 自动化测试用例、自测报告 |
| **QA工程师** | 功能测试、边界测试、性能测试、双人测试 | 测试报告、缺陷清单 |
| **产品经理** | US验收测试、手感评估 | 验收报告 |
| **TA/技术美术** | 视觉特效、3D美术资源状态测试 | 美术资源验收报告 |

---

## 十二、测试环境需求

| 环境 | 规格 | 用途 |
|------|------|------|
| 开发机 | UE5.7 Editor + VS2022 | 自动化测试运行 |
| 性能测试机 | 最低配置PC（i5/GTX1060/16GB） | 性能基准测试 |
| 双人测试 | 2个手柄（Xbox/PS5） | 双人模式测试 |
| 持续集成 | Jenkins/GitHub Actions | 每次PR自动跑第一轮测试 |

---

## 十三、测试报告模板

每次迭代测试后产出以下报告：

```
## 测试报告 v{version}

### 测试范围
- 单元测试：{通过/失败}/{总数}
- 集成测试：{通过/失败}/{总数}
- 边界测试：{通过/失败}/{总数}
- 性能测试：{通过/失败}/{总数}

### 关键问题
- P0缺陷：{数量}（{列表}）
- P1缺陷：{数量}
- P2缺陷：{数量}

### 性能数据
- 平均帧率：{FPS}
- 加载时间：{s}
- 峰值内存：{MB}

### 结论
{通过/需要修复后重测}
```

---

## 附录：核心指标速查

| 指标 | 数据 | 说明 |
|------|------|------|
| 总用户故事 | 400 条 | P0: 99条 / P1: 81条 / P2: 109条 / P3: 95条 / P4: 16条 |
| 核心链路 | 14 条 | P0: 4条 / P1~P2: 5条 / P3: 5条 |
| 风险区域 | 12 个 | P0: 3个 / P1: 5个 / P2: 3个 |
| 方块类型 | 4 种 | 普通 / 心形 / 炸弹 / 五角星 |
| 敌人类型 | 3 种 | 史莱姆 / 小恐龙 / (狂暴变种) |
| 玩家状态 | 5 种 | NORMAL / INVINCIBLE / DAMAGED / DEAD / RESPAWNING |
| 关卡总数 | 32 关 | Beginner 16 + Professional 16 |
| 格子尺寸 | 100 UE单位 | 3D空间1m²/格，等轴测旋转45° |
| 目标帧率 | 60 FPS | 固定逻辑步进1/60s |
