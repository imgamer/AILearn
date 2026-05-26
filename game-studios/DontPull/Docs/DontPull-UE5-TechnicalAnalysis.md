# Don't Pull 虚幻引擎3D重制 — 技术分析文档

> 基于 UE5.7，将 Capcom 1991年街机《Don't Pull》以3D方式复刻
> 分析每个游戏系统对应的UE引擎功能、推荐方案与替代方案

---

## 文档总览

| 章节 | 内容 | 关键词 |
|------|------|--------|
| 第1章 | 项目架构与引擎配置 | 模块/目录/Build.cs |
| 第2章 | 网格系统与关卡构建 | GridManager/ISM/DataTable |
| 第3章 | 相机与视角 | 假正交透视/等轴测 |
| 第4章 | 玩家系统 | Character/格子移动/EnhancedInput |
| 第5章 | 方块系统 | Actor/Interface/Timeline |
| 第6章 | 敌人AI系统 | BehaviorTree/EQS/喷火 |
| 第7章 | 碰撞与物理 | 格子碰撞/碰撞通道 |
| 第8章 | 心形拼合与Gameplay标签 | GAS/Tag/Effect |
| 第9章 | 道具与奖励系统 | DataAsset/SpawnActor |
| 第10章 | 特效与视觉表现 | Niagara/材质/AnimBP |
| 第11章 | 音频系统 | MetaSound/3D空间音 |
| 第12章 | UI系统 | UMG/HUD/Widget |
| 第13章 | 多人模式：本地双人→网络联机 | EOS/Iris/预测/延迟补偿/反作弊 |
| 第14章 | 数据驱动与配置 | DataTable/DataAsset |
| 第15章 | 性能与优化 | ISM/LOD/烘焙光照 |

---

# 第1章 项目架构与引擎配置

## 1.1 推荐项目模板

| 选项 | 说明 | 推荐 |
|------|------|------|
| 空白项目（Blank） | 最轻量，无预置内容 | ✅ 推荐 |
| 第三人称模板 | 含 Character/Camera/AnimBP | 可选起步 |
| 2D侧滚模板 | Paper2D，不适合3D | ❌ |
| 俯视角模板 | 无官方模板 | — |

**推荐方案**：空白项目起步，按需引入模块。避免第三人称模板中不需要的 SpringArm/FollowCamera 等组件。

## 1.2 必需引擎模块

| 模块 | 用途 | 是否默认启用 |
|------|------|:------------:|
| Core / CoreUObject | 基础框架 | 是 |
| Engine | 引擎核心 | 是 |
| InputCore | 输入系统 | 是 |
| EnhancedInput | 增强输入系统 | 需手动启用 |
| NavigationSystem | NavMesh 导航 | 是 |
| AIModule | 行为树/EQS | 需手动启用 |
| Niagara | 粒子特效 | 需手动启用 |
| UMG | UI 系统 | 是 |
| GameplayTasks | AI任务系统 | 需手动启用 |
| GameplayAbilities | GAS 能力系统 | 需手动启用插件 |
| MetaSound | 新音频系统 | 需手动启用 |
| DeveloperSettings | 开发配置 | 是 |
| DataValidation | 数据校验 | 推荐启用 |

## 1.3 Build.cs 配置要点

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core", "CoreUObject", "Engine", "InputCore",
    "EnhancedInput", "NavigationSystem", "AIModule",
    "Niagara", "UMG", "GameplayTasks", "Slate", "SlateCore"
});

// GAS 需在 .uplugin 或 Build.cs 中启用
PrivateDependencyModuleNames.AddRange(new string[] {
    "GameplayAbilities", "GameplayTags", "GameplayTasks"
});
```

## 1.4 项目目录结构

```text
/Content/
├── Characters/
│   ├── Don/                     ← 1P兔子
│   │   ├── Mesh/
│   │   ├── AnimBP/
│   │   └── Materials/
│   └── Pull/                    ← 2P松鼠
│       ├── Mesh/
│       ├── AnimBP/
│       └── Materials/
├── Blocks/
│   ├── Normal/
│   ├── Heart/
│   ├── Bomb/
│   └── Star/
├── Enemies/
│   ├── Jelly/
│   └── Dragon/
├── Items/
│   ├── Fruits/
│   └── PowerShake/
├── Environment/
│   ├── Walls/
│   ├── Floor/
│   ├── Manhole/
│   └── Boulder/
├── VFX/
│   ├── NiagaraSystems/
│   └── Materials/
├── Audio/
│   ├── SFX/
│   ├── BGM/
│   └── MetaSounds/
├── UI/
│   ├── Widgets/
│   └── Textures/
├── Systems/
│   ├── Grid/
│   ├── Camera/
│   └── AI/
├── Data/
│   ├── DataTables/
│   └── DataAssets/
└── Maps/
    ├── Beginner/
    └── Professional/
```

---

# 第2章 网格系统与关卡构建

## 2.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 网格管理器 | C++ `UGridManagerComponent` | 自定义Subsystem或ActorComponent |
| 格子类型 | `UEnum` + DataTable | 数据驱动配置 |
| 地图数据 | `UDataTable` / JSON | 关卡数据序列化 |
| 墙壁/地板 | Static Mesh + Instanced Static Mesh | 批量渲染优化 |
| 井盖 | Blueprint Actor + 交互接口 | 可封堵的生成点 |
| 外周路径 | Spline Component | 滚石路径定义 |

## 2.2 网格系统实现方案

### 方案A：自定义GridManager（✅ 推荐）

```cpp
UCLASS()
class UGridManagerComponent : public UActorComponent
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere)
    int32 GridWidth = 15;

    UPROPERTY(EditAnywhere)
    int32 GridHeight = 13;

    UPROPERTY(EditAnywhere)
    float CellSize = 100.0f;

    UPROPERTY()
    TArray<ECellType> Cells;  // 一维数组，index = y * Width + x

    ECellType GetCellType(int32 X, int32 Y) const;
    bool IsWalkable(int32 X, int32 Y) const;
    FVector GridToWorld(int32 X, int32 Y) const;
    FIntPoint WorldToGrid(FVector WorldPos) const;
};
```

**优势**：完全控制格子逻辑，与UE物理系统解耦，适合格子对齐移动

### 方案B：基于NavMesh的网格

- 利用UE NavMesh标记可行走区域
- ❌ 不推荐：NavMesh是连续空间导航，不适合格子对齐逻辑

### 方案C：Tilemap（Paper2D）

- UE的2D Tilemap系统
- ❌ 不推荐：本项目是3D重制

## 2.3 关卡构建方案

### 方案A：程序化生成（✅ 推荐）

```cpp
UCLASS()
class AStageGenerator : public AActor
{
    UPROPERTY(EditAnywhere)
    UDataTable* StageDataTable;

    void GenerateStage(int32 StageID);

    UPROPERTY()
    UInstancedStaticMeshComponent* FloorMeshes;

    UPROPERTY()
    UInstancedStaticMeshComponent* WallMeshes;
};
```

**优势**：
- 32关数据全部外置为DataTable，不硬编码
- InstancedStaticMesh 批量渲染，性能优秀
- 关卡热重载：修改DataTable后重新Generate即可

### 方案B：手动摆放

- 每关手动在编辑器中搭建
- ❌ 不推荐：32关工作量巨大，不可维护

### 方案C：子关卡（Level Streaming）

- 每关一个子Level，运行时动态加载
- 可选方案，适合大型关卡

## 2.4 关键UE组件

| 组件 | 用途 |
|------|------|
| `UInstancedStaticMeshComponent` | 批量渲染地板/墙壁，单DrawCall |
| `UChildActorComponent` | 动态生成方块/井盖Actor |
| `USplineComponent` | 定义滚石外周路径 |
| `UBoxComponent` | 格子碰撞触发器（辅助用） |
| `UDataTable` | 关卡数据存储 |
| `UDataAsset` | 关卡配置资产 |

---

# 第3章 相机与视角

## 3.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 固定等轴测视角 | CameraActor + Perspective | 假正交透视 |
| 多人共享视角 | PlayerController ViewTarget | 每个PC指向同一相机 |
| 关卡切换 | Set View Target with Blend | 关卡过渡动画 |

## 3.2 假正交透视相机方案

> 已有详细设计文档：[UE57-IsometricCamera-Design.md](file:///workspace/TraeSolo/GamePieces/UE57-IsometricCamera-Design.md)

**核心原理**：透视相机 + 极小FOV（8°~12°）+ 高距离 + 固定45°俯角

| 参数 | 值 | 说明 |
|------|----|------|
| Projection | Perspective | 不用Orthographic |
| FOV | 10° | 近乎正交但有3D立体感 |
| Camera Distance | 3000~5000 | 配合FOV覆盖游戏区域 |
| Pitch | -35.264° | 标准等轴测角 `arctan(1/√2)` |
| Yaw | 45° | 标准等轴测角 |
| Constrain Aspect Ratio | false | 避免黑边 |

### UE实现要点

```text
BP_IsometricCamera（CameraActor蓝图）
  CameraComponent属性设置：
  - Projection = Perspective
  - FOV = 10.0
  - Constrain Aspect Ratio = unchecked

PlayerController BeginPlay中设置ViewTarget：
  Event BeginPlay
    → Get Actor of Class (BP_IsometricCamera)
    → Set View Target with Blend (BlendTime=0.0)
```

**为什么不用Orthographic**：正交投影虽然大小完全一致，但3D物体侧面无透视缩放，看起来像"纸片"，缺乏3D立体感。极小FOV透视保留了<2%的畸变（肉眼不可辨），但侧面/顶面有完整的3D深度信息。

## 3.3 相机系统UE组件

| 组件 | 用途 |
|------|------|
| `ACameraActor` | 固定相机Actor |
| `UCameraComponent` | 相机参数配置 |
| `APlayerController::SetViewTarget` | 切换视角 |
| `Set View Target with Blend` | 平滑过渡 |

---

# 第4章 玩家系统

## 4.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 玩家角色 | `ACharacter` / `APawn` | 角色基类 |
| 格子移动 | 自定义移动组件 | 不用UE内置CharacterMovement |
| 输入处理 | Enhanced Input System | 新输入系统 |
| 玩家状态 | 自定义State枚举 / GAS | 状态管理 |
| 受伤无敌帧 | Timeline / Timer | 闪烁+无敌计时 |
| 无敌状态 | GAS GameplayTag | 状态标记 |
| 重生 | PlayerStart + GameMode | 出生点管理 |

## 4.2 角色基类选择

### 方案A：ACharacter（✅ 推荐）

```cpp
UCLASS()
class ADontPullCharacter : public ACharacter
{
    // 不使用CharacterMovementComponent的内置移动
    // 重写移动逻辑为格子对齐移动
    // 保留SkeletalMeshComponent用于3D角色动画
};
```

**优势**：有SkeletalMesh、AnimBP支持，GameMode识别Character类

### 方案B：APawn + 自定义组件

- 更轻量，但需要手动添加Mesh组件
- 适合不需要CharacterMovement的场景

### 方案C：纯Actor

- 最轻量，但缺少Pawn/Controller体系
- ❌ 不推荐：无法接收输入

## 4.3 格子移动实现

**关键问题**：UE的CharacterMovementComponent是连续空间移动，Don't Pull需要格子对齐移动。

### 方案A：禁用CMM，自定义格子移动（✅ 推荐）

```cpp
UCLASS()
class UGridMovementComponent : public UActorComponent
{
    FIntPoint TargetGridPos;       // 目标格子坐标
    float MoveProgress = 0.0f;     // 移动动画进度
    float MoveDuration = 0.1f;     // 移动动画时长
    bool bIsMoving = false;        // 是否正在移动中

    void TryMove(EDirection Direction);
    void TickMovement(float DeltaTime);
};
```

**流程**：
1. 输入触发 → 检查目标格子可行性
2. 更新逻辑坐标（瞬间）
3. 启动插值动画（0.1秒）
4. 动画完成 → 触发onMoved回调

### 方案B：使用CMM + Snap

- 利用CharacterMovement移动，每帧Snap到最近格子
- ❌ 不推荐：移动手感差，与格子逻辑冲突

## 4.4 Enhanced Input System

```cpp
// IMC_DontPull（Input Mapping Context）
// + IA_MoveUp    → W / Up Arrow / Left Stick Up
// + IA_MoveDown  → S / Down Arrow / Left Stick Down
// + IA_MoveLeft  → A / Left Arrow / Left Stick Left
// + IA_MoveRight → D / Right Arrow / Left Stick Right
// + IA_Push      → Space / Face Button South (A)

void ADontPullPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    UEnhancedInputComponent* EIC = Cast<UEnhancedInputComponent>(InputComponent);
    EIC->BindAction(MoveUpAction, ETriggerEvent::Started, this, &ThisClass::OnMoveUp);
}
```

**为什么用Enhanced Input**：
- 支持多设备（键鼠/手柄/触屏）统一映射
- 支持Input Trigger条件（如按住/双击）
- 运行时可切换Mapping Context
- UE5.7标准，旧Input System已弃用

## 4.5 玩家状态管理

### 方案A：简单枚举 + Timer（✅ 推荐初期）

```cpp
UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Normal,
    Invincible,
    Damaged,
    Dead,
    Respawning,
};

// 在Character中：
UPROPERTY()
EPlayerState CurrentState = EPlayerState::Normal;

FTimerHandle InvincibleTimerHandle;
void OnInvincibleTimerExpired();
```

### 方案B：GAS GameplayTag（推荐后期/复杂状态）

```text
Gameplay Tags:
  State.Player.Normal
  State.Player.Invincible
  State.Player.Damaged
  State.Player.Dead
  State.Player.Respawning

优势：
  - 状态间互斥自动管理
  - 与GameplayEffect联动（无敌时自动阻止伤害Effect）
  - 蓝图可查询标签
  - 网络复制内置
```

---

# 第5章 方块系统

## 5.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 方块基类 | `AActor` + 自定义组件 | 方块Actor |
| 推块交互 | Interface / Component | 玩家→方块交互 |
| 方块滑动 | Timeline / Tick插值 | 格子间平滑移动 |
| 方块压碎 | Destroy + Niagara | 碎裂特效 |
| 炸弹爆炸 | SphereOverlap + GameplayEffect | 范围晕眩 |
| 五角星掉落 | SpawnActor | 道具生成 |
| 心形拼合 | 事件系统 | 三心检测 |

## 5.2 方块Actor架构

```cpp
UCLASS()
class ABlock : public AActor
{
    UPROPERTY(VisibleAnywhere)
    UStaticMeshComponent* BlockMesh;

    UPROPERTY(EditAnywhere)
    EBlockType BlockType = EBlockType::Normal;

    UPROPERTY()
    bool bIsSliding = false;

    UPROPERTY()
    EDirection SlideDirection;

    UPROPERTY()
    FIntPoint GridPos;

    void OnPushed(EDirection Direction, ADontPullCharacter* Pusher);
    void OnCrushed();
    void OnHitWall();
    void OnHitBlock(ABlock* OtherBlock);
    void OnHitEnemy(AEnemy* Enemy);
    void SlideTick(float DeltaTime);
};
```

## 5.3 方块交互接口

```cpp
UINTERFACE(Blueprintable)
class UPushableInterface : public UInterface
{
    GENERATED_BODY()
};

class IPushableInterface
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    bool TryPush(EDirection Direction, APawn* Pusher);

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    void OnCrushed();
};
```

**为什么用Interface**：方块、心形箱子、炸弹箱子都实现同一接口，玩家推块代码统一调用`TryPush`，不需要类型判断。

## 5.4 方块滑动动画

### 方案A：Timeline（✅ 推荐）

```cpp
// 在ABlock中：
UPROPERTY()
UTimelineComponent* SlideTimeline;

UFUNCTION()
void SlideTimelineUpdate(float Value);  // Value: 0.0 → 1.0

void ABlock::SlideTimelineUpdate(float Value)
{
    FVector StartPos = GridToWorld(SlideStartPos);
    FVector EndPos = GridToWorld(SlideTargetPos);
    SetActorLocation(FMath::Lerp(StartPos, EndPos, Value));
}
```

**优势**：Timeline曲线可编辑，可加缓动

### 方案B：Tick插值

- 在Tick中手动Lerp
- 更灵活但需手动管理

## 5.5 炸弹爆炸实现

```cpp
void ABlock::OnCrushed_Bomb()
{
    // 1. 播放爆炸特效
    UNiagaraFunctionLibrary::SpawnSystemAtLocation(
        GetWorld(), ExplosionVFX, GetActorLocation());

    // 2. 检测3×3范围内的敌人
    TArray<FOverlapResult> Overlaps;
    FCollisionShape Sphere = FCollisionShape::MakeSphere(CellSize * 1.5f);
    GetWorld()->OverlapMultiByChannel(
        Overlaps, GetActorLocation(), FQuat::Identity,
        ECC_Pawn, Sphere);

    for (auto& Overlap : Overlaps)
    {
        AEnemy* Enemy = Cast<AEnemy>(Overlap.GetActor());
        if (Enemy)
        {
            Enemy->Stun(3.0f);
        }
    }

    // 3. 屏幕震动
    if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
    {
        PC->ClientStartCameraShake(UExplosionShake::StaticClass());
    }

    // 4. 销毁自身
    Destroy();
}
```

---

# 第6章 敌人AI系统

## 6.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 敌人基类 | `ACharacter` / `AAIController` | AI角色 |
| 追踪行为 | Behavior Tree + Blackboard | 决策树 |
| 路径移动 | EQS / 自定义格子移动 | 寻路 |
| 喷火攻击 | Behavior Tree Task | 恐龙专用 |
| 狂暴状态 | Blackboard Key / GAS Tag | 状态切换 |
| 晕眩状态 | Behavior Tree Decorator | 条件中断 |
| 井盖生成 | Manhole Actor + Timer | 生成管理 |

## 6.2 AI架构

### 推荐方案：Behavior Tree + Blackboard + EQS

```text
AIController
├── Behavior Tree (BT_Enemy)
│   ├── Selector: 行为选择
│   │   ├── Sequence: 晕眩中
│   │   │   └── Decorator: BlackboardCondition(IsStunned == true)
│   │   │       └── Task: Wait (原地不动)
│   │   ├── Sequence: 攻击(恐龙专用)
│   │   │   └── Decorator: BlackboardCondition(CanFireBreath == true)
│   │   │       └── Task: FireBreath
│   │   └── Sequence: 追踪
│   │       ├── Task: MoveToPlayer (EQS或格子移动)
│   │       └── Task: UpdateChaseTarget
│   └── Service: UpdateTargetPlayer (每0.5s更新追踪目标)
└── Blackboard
    ├── TargetPlayer (Object)
    ├── IsStunned (Bool)
    ├── IsRaging (Bool)
    ├── CanFireBreath (Bool)
    └── MoveDirection (Enum)
```

### Behavior Tree详解

**史莱姆BT**：

```text
Root → Selector
├── [IsStunned?] → Wait
├── [IsRaging?] → Sequence
│   ├── ChasePlayer (90%追踪)
│   └── RandomMove (10%随机)
└── Sequence
    ├── ChasePlayer (60%追踪)
    └── RandomMove (40%随机)
```

**恐龙BT**：

```text
Root → Selector
├── [IsStunned?] → Wait
├── [CanFireBreath?] → FireBreath
├── [IsRaging?] → Sequence
│   ├── ChasePlayer (90%追踪)
│   └── RandomMove (10%随机)
└── Sequence
    ├── ChasePlayer (80%追踪)
    └── RandomMove (20%随机)
```

## 6.3 EQS（环境查询系统）

用于敌人选择移动方向：

```text
EQS_Query_EnemyMoveDirection
  查询敌人周围4个方向的格子，评分选择最优方向
  评分因子：
  1. 距离玩家的曼哈顿距离（越近越好）
  2. 格子是否可行走（不可行走=0分）
  3. 格子是否有方块/敌人（有=0分）
```

**为什么用EQS**：
- 可视化编辑查询逻辑
- 支持权重/过滤/测试
- 运行时动态评估
- 比硬编码if-else更灵活

### 替代方案：自定义格子AI

```cpp
void AEnemy::ChooseMoveDirection()
{
    FIntPoint PlayerPos = TargetPlayer->GetGridPos();
    FIntPoint MyPos = GetGridPos();

    TArray<EDirection> PreferredDirs;
    int32 DX = PlayerPos.X - MyPos.X;
    int32 DY = PlayerPos.Y - MyPos.Y;

    float ChaseProb = bIsRaging ? 0.9f : ChaseProbability;
    if (FMath::FRand() < ChaseProb)
    {
        // 选择使距离最短的方向
    }
    else
    {
        // 随机方向
    }
}
```

## 6.4 恐龙喷火实现

```cpp
// BTTask_FireBreath
EBTNodeResult::Type UBTTask_FireBreath::ExecuteTask(
    UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory)
{
    AEnemy_Dragon* Dragon = Cast<AEnemy_Dragon>(
        OwnerComp.GetAIOwner()->GetPawn());

    if (Dragon && Dragon->CanFireAtPlayer())
    {
        Dragon->FireBreath();
        return EBTNodeResult::Succeeded;
    }
    return EBTNodeResult::Failed;
}

// AEnemy_Dragon::FireBreath()
void AEnemy_Dragon::FireBreath()
{
    // 1. 播放喷火动画
    PlayAnimMontage(FireBreathMontage);

    // 2. 在前方3格生成火焰Actor
    FIntPoint Dir = GetDirectionToPlayer();
    for (int32 i = 1; i <= 3; i++)
    {
        FIntPoint FirePos = GetGridPos() + Dir * i;
        if (GridManager->GetCellType(FirePos) == ECellType::Wall)
            break;
        SpawnFireAt(FirePos);
    }

    // 3. 设置冷却
    FireBreathCooldown = bIsRaging ? 1.5f : 3.0f;
}
```

### 火焰Actor

```cpp
UCLASS()
class AFireBreath : public AActor
{
    UPROPERTY(VisibleAnywhere)
    UBoxComponent* DamageBox;

    UPROPERTY(VisibleAnywhere)
    UNiagaraComponent* FireVFX;

    float Lifespan = 1.5f;

    void BeginPlay() override
    {
        SetLifeSpan(Lifespan);
    }
};
```

## 6.5 狂暴机制

### 方案A：Blackboard Key

```cpp
void AStageManager::CheckRageCondition()
{
    if (StageTimer > RageConfig.TriggerTime ||
        RemainingEnemies < TotalEnemies * 0.3f)
    {
        for (AEnemy* Enemy : ActiveEnemies)
        {
            Enemy->SetRaging(true);
            // Blackboard: IsRaging = true
        }
    }
}
```

### 方案B：GAS GameplayTag

```text
应用狂暴GameplayEffect
  Tag: State.Enemy.Raging
  Effect: 修改移动速度Attribute × 2.0
  Effect: 修改追踪概率（通过Tag查询）
```

---

# 第7章 碰撞与物理

## 7.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 格子碰撞 | 自定义逻辑 | 不依赖UE物理碰撞 |
| 玩家-敌人碰撞 | Overlap检测 | 触发伤害 |
| 方块-敌人碰撞 | 格子坐标判断 | 碾压判定 |
| 滚石碰撞 | Spline移动 + 格子判定 | 路径碰撞 |
| 火焰碰撞 | BoxComponent Overlap | 伤害触发 |

## 7.2 碰撞策略

**核心原则**：Don't Pull是格子对齐游戏，**碰撞判定基于格子坐标而非UE物理引擎**。

### 为什么不用UE物理碰撞

| UE物理碰撞 | 问题 |
|-----------|------|
| Sphere/Box Collision | 连续空间检测，不适合格子对齐 |
| CharacterMovementComponent | 内置碰撞响应与格子逻辑冲突 |
| Physics Simulation | 不需要物理模拟 |

### 推荐方案：格子坐标碰撞 + UE碰撞辅助

```cpp
// 核心碰撞：格子坐标判断
bool UGridManager::CheckCollision(FIntPoint Pos) const
{
    ECellType CellType = GetCellType(Pos);
    if (CellType == ECellType::Wall) return true;

    if (GetEntityAt(Pos) != nullptr) return true;

    return false;
}

// 辅助碰撞：UE Overlap用于视觉效果
// 如：玩家走进敌人范围时触发受伤
// 使用BoxComponent的OnComponentBeginOverlap
```

## 7.3 碰撞通道配置

```ini
; 自定义碰撞通道（DefaultEngine.ini）
[/Script/Engine.CollisionProfile]
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel1, Name="Player")
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel2, Name="Enemy")
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel3, Name="Block")
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel4, Name="Item")
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel5, Name="Boulder")
+DefaultChannelResponses=(Channel=ECC_GameTraceChannel6, Name="Fire")
```

**用途**：
- Player通道：敌人检测玩家位置
- Block通道：方块碾压检测
- Fire通道：火焰伤害检测
- Item通道：道具拾取检测

---

# 第8章 心形拼合与Gameplay标签

## 8.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 心形拼合检测 | 自定义事件系统 | 移动后检测 |
| 无敌状态 | GAS GameplayTag + GameplayEffect | 状态+效果 |
| 水果雨 | SpawnActor批量生成 | 道具雨 |
| 敌人晕眩 | GAS GameplayEffect | 范围效果 |
| BGM切换 | Audio Volume / Blueprint | 音乐切换 |

## 8.2 GAS集成方案

### 是否使用GAS？

| 维度 | 不用GAS | 用GAS |
|------|---------|-------|
| 复杂度 | 低，Timer+枚举即可 | 高，需学习曲线 |
| 状态管理 | 手动管理 | Tag自动管理 |
| 网络复制 | 需手动Replicate | 内置Replication |
| 扩展性 | 差 | 优秀 |
| 调试 | 无专用工具 | Gameplay Debugger |

**推荐**：初期用简单方案（Timer+枚举），后期如需复杂状态交互再迁移到GAS。

### GAS实现心形拼合

```text
Gameplay Tags:
  State.Player.Invincible       ← 无敌状态
  State.Enemy.Stunned           ← 晕眩状态
  State.Enemy.Raging            ← 狂暴状态
  Effect.HeartCombined          ← 心形拼合效果

Gameplay Effect: GE_HeartCombined
  - Duration: 10秒
  - Granted Tags: State.Player.Invincible
  - Modifiers: 无属性修改（纯Tag）

Gameplay Effect: GE_EnemyStun
  - Duration: 3秒（炸弹）/ 10秒（心形拼合）
  - Granted Tags: State.Enemy.Stunned
```

## 8.3 心形拼合检测

```cpp
void AStageManager::CheckHeartCombination()
{
    TArray<ABlock*> HeartBlocks;
    // 收集所有心形箱子

    if (HeartBlocks.Num() < 3) return;

    // 检查横向排列
    HeartBlocks.Sort([](const ABlock& A, const ABlock& B)
        { return A.GetGridPos().X < B.GetGridPos().X; });

    if (HeartBlocks[0]->GetGridPos().Y == HeartBlocks[1]->GetGridPos().Y &&
        HeartBlocks[1]->GetGridPos().Y == HeartBlocks[2]->GetGridPos().Y)
    {
        int32 X0 = HeartBlocks[0]->GetGridPos().X;
        int32 X1 = HeartBlocks[1]->GetGridPos().X;
        int32 X2 = HeartBlocks[2]->GetGridPos().X;
        if (X1 - X0 == 1 && X2 - X1 == 1)
        {
            OnHeartCombined();
            return;
        }
    }

    // 同理检查纵向...
}
```

---

# 第9章 道具与奖励系统

## 9.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 道具基类 | `AActor` + Overlap | 拾取触发 |
| 道具掉落 | DataTable权重随机 | 掉落表 |
| 水果雨 | Timer批量SpawnActor | 分批生成 |
| 计分 | 自定义ScoreManager | 得分管理 |
| 奖命 | 自定义LifeSystem | 生命管理 |
| 道具超时 | SetLifeSpan | 自动销毁 |

## 9.2 道具掉落表实现

```cpp
USTRUCT(BlueprintType)
struct FItemDropEntry
{
    UPROPERTY(EditAnywhere)
    EItemType ItemType = EItemType::Apple;

    UPROPERTY(EditAnywhere)
    int32 Weight = 30;

    UPROPERTY(EditAnywhere)
    int32 ScoreValue = 100;
};

UCLASS()
class UItemDropTable : public UDataAsset
{
    UPROPERTY(EditAnywhere)
    TArray<FItemDropEntry> DropEntries;

    EItemType RollRandomItem() const;
};
```

**为什么用DataAsset**：掉落权重可在编辑器中可视化调整，不需要改代码。

---

# 第10章 特效与视觉表现

## 10.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 方块压碎 | Niagara System | 碎片粒子 |
| 炸弹爆炸 | Niagara System | 爆炸特效 |
| 火焰 | Niagara System | 火焰粒子 |
| 心形拼合 | Niagara + PostProcess | 全屏闪光 |
| 无敌光环 | Material + Niagara | 发光效果 |
| 水果弹出 | Niagara | 弹出动画 |
| 晕眩星星 | Niagara / Widget3D | 头顶星星 |
| 狂暴变身 | Material Parameter | 变红/闪烁 |
| 屏幕震动 | CameraShakeBase | 画面抖动 |
| 得分飘字 | WidgetComponent | 3D飘字 |
| 角色动画 | AnimBP + State Machine | 动画状态机 |
| 3D立体感 | Lumen GI / Shadow | 全局光照 |

## 10.2 Niagara特效清单

| 特效名 | 类型 | 说明 |
|--------|------|------|
| NS_BlockCrush | GPU粒子 | 方块碎片飞散 |
| NS_BombExplosion | GPU粒子 | 3×3爆炸波 |
| NS_FireBreath | GPU粒子 | 恐龙喷火 |
| NS_HeartCombine | GPU粒子 | 心形闪光+扩散 |
| NS_InvincibleAura | CPU粒子 | 角色光环 |
| NS_ItemSpawn | CPU粒子 | 道具弹出 |
| NS_StunStars | CPU粒子 | 晕眩星星 |
| NS_EnemyDeath | GPU粒子 | 敌人扁平化/消散 |
| NS_BoulderTrail | CPU粒子 | 滚石轨迹 |
| NS_ManholeOpen | CPU粒子 | 井盖打开烟尘 |
| NS_FruitRain | CPU粒子 | 水果雨背景 |
| NS_1UP | CPU粒子 | 奖命特效 |

## 10.3 材质系统

| 材质 | 技术 | 说明 |
|------|------|------|
| M_Block_Normal | Base Material | 普通箱子木纹 |
| M_Block_Heart | Emissive + Pulse | 心形发光脉冲 |
| M_Block_Bomb | Emissive + Flicker | 炸弹闪烁 |
| M_Block_Star | Emissive + Sparkle | 五角星闪烁 |
| M_Enemy_Rage | Color Parameter | 狂暴变红（动态参数） |
| M_Player_Invincible | Fresnel + Emissive | 无敌光环 |
| M_Player_Damaged | Opacity Pulse | 受伤闪烁 |
| M_Fire | Subsurface + Distortion | 火焰材质 |
| M_Floor | WorldAlignedTexture | 地板自动对齐 |
| M_Wall | ParallaxOcclusion | 墙壁凹凸 |

### 动态材质参数示例

```cpp
void AEnemy::UpdateRageMaterial()
{
    if (bIsRaging)
    {
        float Pulse = FMath::Sin(GetWorld()->GetTimeSeconds() * 8.0f) * 0.5f + 0.5f;
        MeshComp->SetScalarParameterValueOnMaterials(FName("RageIntensity"), Pulse);
    }
    else
    {
        MeshComp->SetScalarParameterValueOnMaterials(FName("RageIntensity"), 0.0f);
    }
}
```

## 10.4 Camera Shake

```cpp
UCLASS()
class UExplosionShake : public UCameraShakeBase
{
    // 炸弹/大振的屏幕震动
    // OscillationDuration: 0.3s
    // OscillationBlendInTime: 0.05s
    // OscillationBlendOutTime: 0.15s
    // RotOscillation: Pitch=1.0, Yaw=1.0, Roll=0.5
    // LocOscillation: X=2.0, Y=2.0, Z=1.0
};
```

## 10.5 动画系统

### AnimBP状态机

```text
ABP_Player
  StateMachine: Locomotion
  ├── Idle
  ├── Walk (4方向Blend Space)
  ├── Push (推块动画)
  ├── Damaged (受伤)
  ├── Dead (死亡)
  └── Dance (过关跳舞)

ABP_Jelly
  StateMachine: JellyAI
  ├── Idle
  ├── Jump (跳跃移动)
  ├── Stunned (晕眩)
  ├── Raging (狂暴)
  └── Death (扁平化)

ABP_Dragon
  StateMachine: DragonAI
  ├── Idle
  ├── Walk (4方向)
  ├── FireBreath (喷火)
  ├── Stunned (晕眩)
  ├── Raging (狂暴)
  └── Death (扁平化)
```

### Blend Space

```text
BS_PlayerWalk
  横轴: Direction (-180 ~ 180)
  纵轴: Speed (0 ~ 300)
  动画样本: Walk_Fwd, Walk_Back, Walk_Left, Walk_Right
```

---

# 第11章 音频系统

## 11.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 音效播放 | MetaSound / SoundCue | 音效系统 |
| BGM | MetaSound + Audio Volume | 背景音乐 |
| 3D空间音 | Spatialization | 3D音效定位 |
| 音效变调 | MetaSound RandomPitch | 避免重复感 |
| BGM切换 | Audio Volume / Blueprint | 心形拼合换曲 |

## 11.2 MetaSound vs SoundCue

| 维度 | MetaSound | SoundCue |
|------|-----------|----------|
| UE5.7推荐 | ✅ 是 | 旧系统 |
| 可编程性 | 节点图编程 | 有限 |
| 性能 | 更优 | 一般 |
| 随机化 | 内置节点 | 需手动 |
| 学习曲线 | 较陡 | 简单 |

**推荐**：MetaSound，UE5.7标准音频系统

## 11.3 音效架构

```text
/Content/Audio/
├── MetaSounds/
│   ├── MS_BGM_Main.uasset          ← 主BGM
│   ├── MS_BGM_HeartCombine.uasset  ← 心形拼合BGM
│   ├── MS_BGM_Intermission.uasset  ← 过场BGM
│   ├── MS_BGM_Title.uasset         ← 标题BGM
│   └── SFX/
│       ├── MS_SFX_PlayerMove.uasset
│       ├── MS_SFX_PushBlock.uasset
│       ├── MS_SFX_BlockCrush.uasset
│       ├── MS_SFX_BlockSlide.uasset
│       ├── MS_SFX_Explosion.uasset
│       ├── MS_SFX_HeartCombine.uasset
│       ├── MS_SFX_EnemySpawn.uasset
│       ├── MS_SFX_EnemyDeath.uasset
│       ├── MS_SFX_EnemyRage.uasset
│       ├── MS_SFX_EnemyStun.uasset
│       ├── MS_SFX_FireBreath.uasset
│       ├── MS_SFX_ItemPickup.uasset
│       ├── MS_SFX_PowerShake.uasset
│       ├── MS_SFX_1UP.uasset
│       ├── MS_SFX_StageClear.uasset
│       └── MS_SFX_GameOver.uasset
└── Waves/
    └── (原始音频文件)
```

---

# 第12章 UI系统

## 12.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| HUD | UMG Widget | 界面系统 |
| 生命显示 | UMG Image (心形) | 图标 |
| 得分显示 | UMG Text | 数字 |
| 时间显示 | UMG Text | 倒计时 |
| 水果计数 | UMG Text | 计数器 |
| 敌人计数 | UMG Text | 进度 |
| 关卡标题 | UMG Widget + Animation | 过渡动画 |
| 结算界面 | UMG Widget | 过关结算 |
| Game Over | UMG Widget | 结束画面 |
| 得分飘字 | WidgetComponent (3D) | 世界空间飘字 |

## 12.2 UMG Widget架构

```text
WBP_HUD
├── CanvasPanel
│   ├── HorizontalBox (1P Info)
│   │   ├── Image (Heart1)
│   │   ├── Image (Heart2)
│   │   ├── Image (Heart3)
│   │   ├── Text (Score)
│   │   ├── Text (Time)
│   │   └── Text (FruitCount)
│   ├── HorizontalBox (2P Info)
│   │   └── (同上)
│   ├── Text (StageNumber) ← 左下
│   └── Text (EnemyCount) ← 右下

WBP_StageIntro        ← "STAGE X" 过渡
WBP_StageResult       ← 过关结算
WBP_Intermission      ← 过场动画
WBP_GameOver          ← Game Over
WBP_AllRoundClear     ← "ALL ROUND CLEAR"
WBP_ProfessionalStart ← "PROFESSIONAL COURSE START!"
WBP_TitleScreen       ← 标题画面
```

## 12.3 HUD绑定

```cpp
void ADontPullPlayerController::BeginPlay()
{
    Super::BeginPlay();
    if (IsLocalController())
    {
        HUDWidget = CreateWidget<UWBP_HUD>(this, HUDWidgetClass);
        HUDWidget->AddToViewport();
    }
}

// 数据绑定方式：
// 方案A：Polling（在Tick中更新Widget数据）
// 方案B：Delegate（数据变化时广播通知Widget）
// ✅ 推荐方案B，性能更好
```

---

# 第13章 多人模式：本地双人 → 网络联机

> 本章从本地双人扩展到完整的网络联机方案，覆盖 UE5.7 全部网络功能栈。
> 架构原则：**单机优先 → 本地双人 → 网络联机**，每层可独立运行，不强制依赖上层。

## 13.1 多人模式总览

| 模式 | 玩家数 | 网络拓扑 | 适用场景 |
|------|--------|----------|----------|
| 单机 | 1P | 无网络 | 离线游玩 |
| 本地双人 | 1P+2P | 同一进程 | 沙发合作 |
| 联机双人 | 1P+2P | Client-Server | 远程合作 |
| 联机对战 | 2~4P | Client-Server | 竞速/对抗 |

## 13.2 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 本地双人 | SharedScreen + 2×PlayerController | 同屏合作 |
| 独立输入 | EnhancedInput + IMC切换 | 各自输入映射 |
| 独立生命/得分 | PlayerState Replicated | 各自状态 |
| 网络会话 | Online Subsystem + EOS | 创建/搜索/加入 |
| 匹配系统 | EOS Lobbies / Session | 房间/匹配 |
| 网络同步 | Iris Replication / 传统Replication | 状态复制 |
| 服务器权威 | GameMode (Server-only) | 逻辑判定 |
| 客户端预测 | Client-Side Prediction | 移动平滑 |
| 延迟补偿 | Server-Side Rewind | 碰撞回溯 |
| 语音聊天 | EOS Voice Chat | 实时语音 |
| 反作弊 | Server Authority + 校验 | 防篡改 |
| 专用服务器 | Dedicated Server | 生产部署 |
| P2P中继 | EOS P2P / NAT穿透 | 跨网络连接 |
| 好友系统 | EOS Friends / Presence | 社交功能 |
| 跨平台 | EOS Crossplay | PC/主机/移动互通 |

---

## 13.3 本地双人方案

### 方案A：同屏共享（✅ 推荐）

```text
GameMode配置：
  AGameModeBase::bUseSeamlessTravel = true;
  2个PlayerController共享同一个BP_IsometricCamera
  不分屏，同屏显示两个角色
```

**优势**：符合原版街机体验，一个屏幕两个角色

### 方案B：分屏

- 每个玩家独立相机
- ❌ 不推荐：等轴测视角分屏体验差

### 本地双人输入映射

```cpp
// 1P: 键鼠 / 手柄1
// IMC_DontPull_P1: WASD + Space

// 2P: 手柄2
// IMC_DontPull_P2: Left Stick + Face Button South

void ADontPullPlayerController::BeginPlay()
{
    Super::BeginPlay();
    if (UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer()))
    {
        int32 PlayerIndex = GetLocalPlayer()->GetControllerId();
        if (PlayerIndex == 0)
            Subsystem->AddMappingContext(IMC_DontPull_P1, 0);
        else
            Subsystem->AddMappingContext(IMC_DontPull_P2, 0);
    }
}
```

---

## 13.4 网络架构设计

### 13.4.1 服务器-客户端模型

```
┌─────────────────────────────────────────────────────┐
│                  Dedicated Server                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  GameMode (Authority)                         │  │
│  │  ├─ GridManager (格子逻辑权威)                │  │
│  │  ├─ StageManager (关卡流程权威)               │  │
│  │  ├─ ScoreManager (计分权威)                   │  │
│  │  ├─ EnemyAISystem (AI权威)                    │  │
│  │  └─ CollisionSystem (碰撞判定权威)            │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  GameState (Replicated to All)                │  │
│  │  ├─ StageID / Timer / EnemyCount             │  │
│  │  └─ HeartMergeState / RageState              │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────┘
                           │ Replication
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Client 1 │ │ Client 2 │ │ Client N │
        │ PlayerCtrl│ │ PlayerCtrl│ │ Spectator│
        │ PlayerSt │ │ PlayerSt │ │          │
        │ Predict  │ │ Predict  │ │          │
        │ Render   │ │ Render   │ │ Render   │
        └──────────┘ └──────────┘ └──────────┘
```

### 13.4.2 权威划分

| 逻辑 | 权威方 | 说明 |
|------|--------|------|
| 格子移动可行性 | Server | GridManager只在Server计算 |
| 推块判定 | Server | 碰撞优先级由Server裁决 |
| 方块滑动/压碎 | Server | Server计算路径，客户端播放动画 |
| 敌人AI决策 | Server | BehaviorTree只在Server运行 |
| 碾压判定 | Server | 碰撞结果由Server广播 |
| 心形拼合检测 | Server | 3心排列由Server判定 |
| 计分/奖命 | Server | ScoreManager只在Server |
| 关卡流程/计时 | Server | StageManager只在Server |
| 道具拾取 | Server | Server判定拾取有效性 |
| 玩家移动输入 | Client → Server | Client预测，Server校验 |
| 视觉/音效表现 | Client | 各客户端独立渲染 |
| UI显示 | Client | 各客户端独立更新 |

### 13.4.3 GameMode / GameState / PlayerState 设计

```cpp
UCLASS()
class ADontPullGameMode : public AGameModeBase
{
    // 仅在Server存在
    UPROPERTY()
    UGridManagerComponent* GridManager;

    UPROPERTY()
    UStageManagerComponent* StageManager;

    void OnPlayerPushBlock(ADontPullCharacter* Player, EDirection Dir);
    void OnBlockSlideComplete(ABlock* Block);
    void CheckHeartCombination();
    void CheckStageClear();
};

UCLASS()
class ADontPullGameState : public AGameStateBase
{
    UPROPERTY(Replicated)
    int32 CurrentStageID;

    UPROPERTY(Replicated)
    float StageTimer;

    UPROPERTY(Replicated)
    int32 RemainingEnemies;

    UPROPERTY(Replicated)
    bool bIsRageMode;

    UPROPERTY(Replicated)
    bool bIsHeartCombined;
};

UCLASS()
class ADontPullPlayerState : public APlayerState
{
    UPROPERTY(Replicated)
    int32 Score;

    UPROPERTY(Replicated)
    int32 Lives;

    UPROPERTY(Replicated)
    int32 FruitCount;

    UPROPERTY(Replicated)
    EPlayerState CurrentState;
};
```

---

## 13.5 网络复制策略

### 13.5.1 复制方式选型

| 数据类型 | 复制方式 | 频率 | 带宽 | 说明 |
|----------|----------|------|------|------|
| 玩家格子坐标 | ReplicatedUsing(OnRep) | 变化时 | 低 | 格子坐标是整数，极省带宽 |
| 玩家移动动画 | 客户端本地预测 | — | 0 | 基于预测位置本地播放 |
| 方块格子坐标 | ReplicatedUsing(OnRep) | 变化时 | 低 | Server权威 |
| 方块滑动动画 | 客户端本地插值 | — | 0 | 收到起止坐标后本地插值 |
| 敌人格子坐标 | ReplicatedUsing(OnRep) | 变化时 | 低 | AI在Server运行 |
| 敌人状态(晕眩/狂暴) | Replicated | 变化时 | 极低 | 布尔值/枚举 |
| 生命/得分/水果数 | PlayerState Replicated | 变化时 | 极低 | 整数 |
| 心形拼合触发 | Multicast RPC | 事件时 | 一次 | 全员播放特效 |
| 炸弹爆炸 | Multicast RPC | 事件时 | 一次 | 全员播放特效+晕眩 |
| 推块请求 | Server RPC | 玩家操作 | 低 | 客户端→服务器 |
| 道具拾取 | Server RPC | 玩家操作 | 低 | 服务器判定 |
| 格子类型变化 | Replicated | 变化时 | 低 | 墙/地板/井盖 |
| 计时器 | GameState Replicated | 1次/秒 | 极低 | 服务器计时 |

### 13.5.2 关键Replication代码

```cpp
// 方块位置由服务器权威
UPROPERTY(ReplicatedUsing = OnRep_GridPos)
FIntPoint GridPos;

UFUNCTION()
void OnRep_GridPos()
{
    // 客户端收到新坐标后，启动本地插值动画
    StartSlideAnimation(PreviousGridPos, GridPos);
}

void ABlock::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(ABlock, GridPos);
    DOREPLIFETIME(ABlock, BlockType);
    DOREPLIFETIME(ABlock, bIsSliding);
}

// 推块由服务器判定
UFUNCTION(Server, Reliable, WithValidation)
void Server_RequestPush(EDirection Direction);

bool ADontPullCharacter::Server_RequestPush_Validate(
    EDirection Direction)
{
    return Direction >= EDirection::Up && Direction <= EDirection::Right;
}

void ADontPullCharacter::Server_RequestPush_Implementation(
    EDirection Direction)
{
    if (CurrentState != EPlayerState::Normal &&
        CurrentState != EPlayerState::Invincible)
        return;

    FIntPoint TargetPos = GetGridPos() + DirectionToOffset(Direction);
    ABlock* Block = GridManager->GetBlockAt(TargetPos);
    if (Block && Block->TryPush(Direction, this))
    {
        // 推块成功，移动玩家到方块原位置
        SetGridPos(TargetPos);
    }
}

// 心形拼合全员广播
UFUNCTION(NetMulticast, Reliable)
void Multicast_OnHeartCombined(const TArray<FIntPoint>& HeartPositions);

// 炸弹爆炸全员广播
UFUNCTION(NetMulticast, Unreliable)
void Multicast_OnBombExploded(FIntPoint Center, TArray<FIntPoint> StunPositions);
```

### 13.5.3 格子游戏的带宽优势

```
Don't Pull 网络优势分析：
  - 格子坐标 = 2个int8（x, y），每个坐标1字节
  - 传统3D位置 = 3个float（x, y, z），每个12字节
  - 带宽节省：2字节 vs 12字节，节省83%
  - 15×13地图最大坐标(14,12)，int8足够
  - 方向 = 1个uint8（0~3），1字节
  - 状态 = 1个uint8（枚举），1字节

单帧全量同步估算（2人+10敌+5方块）：
  - 玩家坐标：2人 × 2字节 = 4字节
  - 方块坐标：5块 × 3字节 = 15字节
  - 敌人坐标+状态：10敌 × 3字节 = 30字节
  - GameState：~10字节
  - 合计：~59字节/帧 @ 60fps = ~3.5KB/s
  - 极低带宽需求，适合移动网络
```

---

## 13.6 Iris 复制系统（UE5.7 下一代）

### 13.6.1 Iris vs 传统Replication

| 维度 | 传统Replication | Iris（UE5.7 Beta） |
|------|----------------|---------------------|
| 架构 | FastArraySerializer + DOREPLIFETIME | 实体化复制 + SubObject |
| 增量同步 | FastArray需手动MarkItemDirty | 自动增量检测 |
| 带宽优化 | ReplicationGraph（可选） | 内置CullDistance + 分级 |
| 大世界支持 | 需手动分Stream | 原生支持多Server |
| 调试 | NetProfiler | Iris Inspector |
| 稳定性 | 生产就绪 | Beta（5.7），Fortnite已验证 |
| 适用场景 | 中小型项目 | 大型/高并发项目 |

### 13.6.2 Don't Pull 是否使用Iris？

| 评估维度 | 结论 |
|----------|------|
| 玩家数 | 2~4人，规模小 |
| 同步实体 | <50个，规模小 |
| 带宽需求 | 极低（格子坐标） |
| Iris收益 | 低（项目规模不触发Iris优势） |
| Iris风险 | Beta状态，API可能变动 |
| **推荐** | **初期用传统Replication，预留Iris迁移接口** |

### 13.6.3 Iris迁移预留

```cpp
// 抽象复制接口，便于未来迁移到Iris
UINTERFACE(Blueprintable)
class UReplicableGridEntity : public UInterface
{
    GENERATED_BODY()
};

class IReplicableGridEntity
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    FIntPoint GetReplicatedGridPos() const;

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable)
    uint8 GetReplicatedState() const;
};

// 未来迁移到Iris时，只需替换复制层实现
// 业务逻辑（格子移动/碰撞/计分）不需要改动
```

### 13.6.4 Iris启用配置（预留）

```ini
; DefaultEngine.ini — 预留Iris配置
[SystemSettings]
net.Iris.UseIrisReplication=0          ; 初期关闭
net.SubObjects.DefaultUseSubObjectReplicationList=1

; 未来启用时改为：
; net.Iris.UseIrisReplication=1
```

```csharp
// Build.cs — 预留Iris模块
// 初期不启用，迁移时取消注释
// SetupIrisSupport(Target);
```

---

## 13.7 客户端预测与服务器校正

### 13.7.1 为什么格子游戏也需要预测

```
问题：网络延迟导致操作反馈延迟
  - 100ms RTT下，玩家按"上"后100ms才看到角色移动
  - 格子移动本身只需100ms动画，延迟占比高达50%
  - 玩家感知：操作"粘滞"，手感差

方案：客户端预测 + 服务器校正
  - 客户端立即执行移动（预测）
  - 同时发送Server RPC
  - 服务器校验后确认或回滚
  - 格子游戏优势：回滚代价极小（只需回到上一个格子）
```

### 13.7.2 预测实现

```cpp
UCLASS()
class ADontPullCharacter : public ACharacter
{
    UPROPERTY(ReplicatedUsing = OnRep_ServerGridPos)
    FIntPoint ServerGridPos;

    FIntPoint PredictedGridPos;
    int32 PredictionID = 0;

    void TryMove(EDirection Direction)
    {
        FIntPoint TargetPos = PredictedGridPos + DirectionToOffset(Direction);

        if (!GridManager->IsWalkable(TargetPos))
            return;

        // 1. 客户端立即预测移动
        PredictedGridPos = TargetPos;
        PredictionID++;
        StartMoveAnimation(PredictedGridPos, TargetPos);

        // 2. 发送到服务器
        Server_RequestMove(Direction, PredictionID);
    }

    UFUNCTION(Server, Reliable, WithValidation)
    void Server_RequestMove(EDirection Direction, int32 InPredictionID);

    UFUNCTION()
    void OnRep_ServerGridPos()
    {
        // 3. 服务器校正
        if (ServerGridPos != PredictedGridPos)
        {
            // 服务器否决了移动，回滚到服务器位置
            PredictedGridPos = ServerGridPos;
            SnapToGrid(ServerGridPos);
        }
        // 如果一致，预测正确，无需额外操作
    }
};

void ADontPullCharacter::Server_RequestMove_Implementation(
    EDirection Direction, int32 InPredictionID)
{
    FIntPoint TargetPos = GetGridPos() + DirectionToOffset(Direction);

    if (!GridManager->IsWalkable(TargetPos))
        return;

    if (CurrentState == EPlayerState::Dead)
        return;

    SetGridPos(TargetPos);
    ServerGridPos = TargetPos;
}
```

### 13.7.3 方块滑动的客户端预测

```cpp
// 推块预测：客户端预测推块成功，立即播放推块+滑动动画
// 服务器校验：如果推块被否决（如另一玩家同时推），回滚

void ADontPullCharacter::TryPush(EDirection Direction)
{
    FIntPoint BlockPos = PredictedGridPos + DirectionToOffset(Direction);
    ABlock* Block = GetBlockAt(BlockPos);

    if (!Block) return;

    // 客户端预测推块成功
    PredictedGridPos = BlockPos;
    Block->ClientPredictSlide(Direction);

    Server_RequestPush(Direction, PredictionID++);
}

// 服务器校正
UFUNCTION()
void OnRep_ServerBlockStates()
{
    // 比对服务器方块状态与本地预测
    // 不一致时回滚方块位置
    for (auto& ServerBlock : ServerBlockStates)
    {
        ABlock* LocalBlock = GetBlockAt(ServerBlock.GridPos);
        if (LocalBlock && LocalBlock->GetGridPos() != ServerBlock.GridPos)
        {
            LocalBlock->SnapToGrid(ServerBlock.GridPos);
        }
    }
}
```

---

## 13.8 延迟补偿

### 13.8.1 格子游戏的延迟补偿优势

```
传统FPS延迟补偿：
  - 需要回溯玩家位置到射击时刻
  - 需要保存历史碰撞体快照
  - 复杂度高，计算量大

Don't Pull延迟补偿：
  - 格子坐标是离散的，回溯只需恢复整数坐标
  - 不需要连续位置插值
  - 历史快照只需保存 (帧号, 格子坐标) 对
  - 计算量极小
```

### 13.8.2 服务器端回溯（Server-Side Rewind）

```cpp
// 服务器保存每个实体的格子坐标历史
struct FGridSnapshot
{
    int32 Frame;
    TMap<AActor*, FIntPoint> EntityPositions;
};

class AStageManager
{
    TArray<FGridSnapshot> Snapshots;
    static constexpr int32 MaxSnapshotFrames = 300; // 5秒@60fps

    void SaveSnapshot()
    {
        FGridSnapshot& Snap = Snapshots.Emplace_GetRef();
        Snap.Frame = GetWorld()->GetFrameNumber();
        for (AActor* Entity : AllEntities)
        {
            Snap.EntityPositions.Add(Entity, Entity->GetGridPos());
        }
        if (Snapshots.Num() > MaxSnapshotFrames)
            Snapshots.RemoveAt(0);
    }

    FIntPoint GetEntityPosAtFrame(AActor* Entity, int32 Frame)
    {
        for (int32 i = Snapshots.Num() - 1; i >= 0; i--)
        {
            if (Snapshots[i].Frame <= Frame)
            {
                if (FIntPoint* Pos = Snapshots[i].EntityPositions.Find(Entity))
                    return *Pos;
            }
        }
        return Entity->GetGridPos();
    }
};

// 延迟补偿碰撞判定
void ADontPullGameMode::OnPlayerPushBlock(
    ADontPullCharacter* Player, EDirection Dir, float ClientTimestamp)
{
    // 计算客户端操作时的服务器帧号
    float ServerTime = GetWorld()->GetTimeSeconds();
    float Ping = ServerTime - ClientTimestamp;
    int32 TargetFrame = GetWorld()->GetFrameNumber() - FMath::RoundToInt(Ping * 60.0f);

    // 回溯到客户端操作时刻的位置
    FIntPoint PlayerPosAtTime = StageManager->GetEntityPosAtFrame(Player, TargetFrame);
    FIntPoint BlockPosAtTime = PlayerPosAtTime + DirectionToOffset(Dir);

    ABlock* Block = GridManager->GetBlockAt(BlockPosAtTime);
    if (Block && Block->CanPushInDirection(Dir))
    {
        // 补偿后判定有效，执行推块
        Block->TryPush(Dir, Player);
    }
    // 否则：客户端预测错误，OnRep校正会自动回滚
}
```

---

## 13.9 网络化AI

### 13.9.1 AI执行架构

```
┌─────────────────────────────────────────┐
│            Dedicated Server              │
│  ┌─────────────────────────────────────┐│
│  │ Enemy AI (Server-Only)              ││
│  │ ├─ BehaviorTree 全部在Server运行    ││
│  │ ├─ EQS查询在Server执行             ││
│  │ ├─ 移动决策在Server计算            ││
│  │ └─ 喷火/狂暴在Server触发           ││
│  └─────────────────────────────────────┘│
│           │ Replicated                   │
│           ▼                              │
│  敌人格子坐标 + 状态 → 广播给所有Client  │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
   ┌──────────┐        ┌──────────┐
   │ Client 1 │        │ Client 2 │
   │ 敌人插值 │        │ 敌人插值 │
   │ 动画播放 │        │ 动画播放 │
   └──────────┘        └──────────┘
```

### 13.9.2 敌人网络复制

```cpp
UCLASS()
class AEnemy : public ACharacter
{
    UPROPERTY(ReplicatedUsing = OnRep_EnemyGridPos)
    FIntPoint GridPos;

    UPROPERTY(ReplicatedUsing = OnRep_EnemyState)
    EEnemyState EnemyState;

    UPROPERTY(Replicated)
    bool bIsRaging;

    UPROPERTY(Replicated)
    bool bIsStunned;

    UFUNCTION()
    void OnRep_EnemyGridPos()
    {
        // 客户端收到新坐标，播放移动动画
        StartMoveAnimation(PreviousGridPos, GridPos);
    }

    UFUNCTION()
    void OnRep_EnemyState()
    {
        // 客户端收到状态变化，播放对应动画
        switch (EnemyState)
        {
        case EEnemyState::Stunned:
            PlayStunAnimation();
            break;
        case EEnemyState::Raging:
            PlayRageAnimation();
            break;
        case EEnemyState::Dead:
            PlayDeathAnimation();
            break;
        }
    }
};

// 恐龙喷火：Server触发，Multicast广播特效
UFUNCTION(NetMulticast, Unreliable)
void Multicast_FireBreath(FIntPoint StartPos, FIntPoint Direction, int32 Range);
```

### 13.9.3 AI在Listen Server vs Dedicated Server

| 场景 | Listen Server | Dedicated Server |
|------|--------------|------------------|
| AI运行位置 | Host客户端 | 服务器进程 |
| Host延迟 | 0ms | 取决于网络 |
| AI性能 | 与Host共享帧预算 | 独立帧预算 |
| 推荐场景 | 开发测试 | 生产部署 |

---

## 13.10 Online Subsystem 与 EOS 集成

### 13.10.1 Online Subsystem 架构

```
┌─────────────────────────────────────────────┐
│              Game Code                       │
│  (调用统一接口，不关心底层实现)               │
├─────────────────────────────────────────────┤
│          Online Subsystem (OSS)              │
│  IOnlineSession / IOnlineIdentity / ...     │
├──────────┬──────────┬───────────────────────┤
│ OSS EOS  │ OSS NULL │ OSS Steam / Others    │
│ (跨平台) │ (开发用) │ (平台特定)            │
├──────────┴──────────┴───────────────────────┤
│       Epic Online Services (EOS) SDK        │
│  Auth / Sessions / P2P / Voice / Lobbies    │
└─────────────────────────────────────────────┘
```

### 13.10.2 EOS 功能与 Don't Pull 对应

| EOS 服务 | Don't Pull 用途 | 优先级 |
|----------|----------------|:------:|
| EOS Auth | 玩家身份认证（OAuth2.0 / 设备ID） | P0 |
| EOS Sessions | 创建/搜索/加入游戏房间 | P0 |
| EOS Lobbies | 大厅系统（比Session更灵活） | P0 |
| EOS P2P | NAT穿透 + 中继通信 | P0 |
| EOS Voice | 实时语音聊天 | P1 |
| EOS Friends | 好友列表 + 邀请 | P1 |
| EOS Presence | 在线状态（游戏中/大厅/离线） | P2 |
| EOS Stats | 排行榜（最高分/最快通关） | P2 |
| EOS Achievements | 成就系统 | P2 |
| EOS Leaderboards | 排行榜 | P2 |
| EOS TitleStorage | 云存档 | P3 |
| EOS Mods | MOD支持 | P3 |

### 13.10.3 会话管理实现

```cpp
UCLASS()
class UDontPullOnlineSubsystem : public UGameInstanceSubsystem
{
public:
    UFUNCTION(BlueprintCallable)
    void CreateSession(int32 MaxPlayers = 2, bool bIsLan = false);

    UFUNCTION(BlueprintCallable)
    void FindSessions(int32 MaxResults = 10, bool bIsLan = false);

    UFUNCTION(BlueprintCallable)
    void JoinSession(const FBlueprintSessionResult& SessionResult);

    UFUNCTION(BlueprintCallable)
    void DestroySession();

    UPROPERTY(BlueprintAssignable)
    FOnCreateSessionComplete OnCreateSessionComplete;

    UPROPERTY(BlueprintAssignable)
    FOnFindSessionsComplete OnFindSessionsComplete;

    UPROPERTY(BlueprintAssignable)
    FOnJoinSessionComplete OnJoinSessionComplete;

private:
    void OnCreateSessionComplete_Internal(FName SessionName, bool bWasSuccessful);
    void OnFindSessionsComplete_Internal(bool bWasSuccessful);
    void OnJoinSessionComplete_Internal(FName SessionName, EOnJoinSessionCompleteResult::Type Result);

    FOnlineSessionSearch* SessionSearch;
};

void UDontPullOnlineSubsystem::CreateSession(int32 MaxPlayers, bool bIsLan)
{
    IOnlineSubsystem* OnlineSub = IOnlineSubsystem::Get();
    if (!OnlineSub) return;

    IOnlineSessionPtr Sessions = OnlineSub->GetSessionInterface();
    if (!Sessions.IsValid()) return;

    FOnlineSessionSettings Settings;
    Settings.NumPublicConnections = MaxPlayers;
    Settings.bShouldAdvertise = true;
    Settings.bIsLANMatch = bIsLan;
    Settings.bUsesPresence = true;
    Settings.bAllowJoinViaPresence = true;

    // 自定义属性：关卡/难度
    Settings.Set(FName("StageID"), 1, EOnlineDataAdvertisementType::ViaOnlineService);
    Settings.Set(FName("GameMode"), FString("Coop"), EOnlineDataAdvertisementType::ViaOnlineService);

    Sessions->CreateSession(0, NAME_GameSession, Settings);
}
```

### 13.10.4 EOS 插件配置

```ini
; DefaultEngine.ini
[OnlineSubsystem]
DefaultPlatformService=EOS

[OnlineSubsystemEOS]
bEnabled=true
ProductId=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SandboxId=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
DeploymentId=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ClientId=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ClientSecret=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

; EncryptionKey需在EOS DevPortal生成
EncryptionKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

; P2P中继
bUseP2P=true
bUseP2PRelay=true

; 语音
bUseVoiceChat=true
```

### 13.10.5 Build.cs 模块依赖

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core", "CoreUObject", "Engine", "InputCore",
    "EnhancedInput", "NavigationSystem", "AIModule",
    "Niagara", "UMG", "GameplayTasks", "Slate", "SlateCore",
    "OnlineSubsystem", "OnlineSubsystemUtils"   // 新增
});

PrivateDependencyModuleNames.AddRange(new string[] {
    "GameplayAbilities", "GameplayTags", "GameplayTasks",
    "OnlineSubsystemEOS", "EOSVoiceChat",            // 新增
    "OnlineServicesEOSGS"                             // 新增
});
```

---

## 13.11 语音聊天

### 13.11.1 EOS Voice Chat

```cpp
// 初始化语音聊天
void UDontPullOnlineSubsystem::InitVoiceChat()
{
    UEOSVoiceChatUser* VoiceChatUser = UEOSVoiceChatUser::Get();
    if (VoiceChatUser)
    {
        VoiceChatUser->OnVoiceChatConnected.AddDynamic(
            this, &ThisClass::OnVoiceChatConnected);
        VoiceChatUser->Connect();
    }
}

// 加入房间时自动加入语音频道
void UDontPullOnlineSubsystem::OnJoinSessionComplete_Internal(
    FName SessionName, EOnJoinSessionCompleteResult::Type Result)
{
    if (Result == EOnJoinSessionCompleteResult::Success)
    {
        // 加入EOS语音频道
        UEOSVoiceChatUser* VoiceChatUser = UEOSVoiceChatUser::Get();
        if (VoiceChatUser && VoiceChatUser->IsConnected())
        {
            VoiceChatUser->JoinChannel(
                SessionName.ToString(),
                EVoiceChatChannelType::NonPositional,
                EVoiceChatChannel2dPositionality::None);
        }
    }
}
```

### 13.11.2 3D空间音 vs 非空间音

| 模式 | 说明 | 推荐 |
|------|------|------|
| 非空间音（NonPositional） | 全房间听到，不区分位置 | ✅ Don't Pull推荐 |
| 3D空间音（Positional） | 根据角色3D位置衰减音量 | 可选（等轴测视角效果有限） |

**推荐非空间音**：Don't Pull 是等轴测俯视角，地图小（15×13格），两人距离近，空间音区分意义不大。

---

## 13.12 反作弊设计

### 13.12.1 服务器权威即反作弊

```
Don't Pull 反作弊核心原则：
  所有影响游戏结果的操作都在服务器执行

客户端只能：
  ├─ 发送输入指令（移动/推块方向）
  ├─ 渲染画面
  ├─ 播放音效
  └─ 显示UI

客户端不能：
  ├─ 修改得分（Score在Server的PlayerState）
  ├─ 修改生命（Lives在Server的PlayerState）
  ├─ 修改敌人位置（AI在Server运行）
  ├─ 修改方块位置（Block GridPos由Server Replicated）
  ├─ 修改计时器（Timer在Server的GameState）
  └─ 伪造拾取（拾取判定在Server）
```

### 13.12.2 输入校验

```cpp
void ADontPullGameMode::OnPlayerMoveRequest(
    ADontPullCharacter* Player, EDirection Dir, int32 PredictionID)
{
    // 1. 方向合法性
    if (Dir < EDirection::Up || Dir > EDirection::Right) return;

    // 2. 移动频率限制（防加速器）
    float CurrentTime = GetWorld()->GetTimeSeconds();
    float LastMoveTime = PlayerMoveTimestamps.FindRef(Player, -1.0f);
    float MinMoveInterval = 0.1f; // 格子移动最短间隔
    if (CurrentTime - LastMoveTime < MinMoveInterval * 0.8f)
    {
        // 移动过快，可能是加速器
        return;
    }
    PlayerMoveTimestamps.Add(Player, CurrentTime);

    // 3. 位置合法性（防瞬移）
    FIntPoint TargetPos = Player->GetGridPos() + DirectionToOffset(Dir);
    float MaxGridDistance = 1; // 一次只能移动1格
    if (FMath::Abs(TargetPos.X - Player->GetGridPos().X) > MaxGridDistance ||
        FMath::Abs(TargetPos.Y - Player->GetGridPos().Y) > MaxGridDistance)
    {
        return;
    }

    // 4. 执行移动
    Player->SetGridPos(TargetPos);
}
```

### 13.12.3 反作弊检查清单

| 作弊类型 | 防御措施 | 实现位置 |
|----------|----------|----------|
| 速度修改 | 移动频率限制 | GameMode |
| 瞬移 | 格子距离校验 | GameMode |
| 无敌修改 | 状态在Server | PlayerState |
| 分数修改 | 分数在Server | PlayerState |
| 方块穿墙 | 碰撞在Server | GridManager |
| 敌人位置修改 | AI在Server | EnemyAISystem |
| 道具复制 | 拾取在Server | ItemSystem |
| 计时器修改 | 计时在Server | GameState |

---

## 13.13 专用服务器部署

### 13.13.1 Dedicated Server vs Listen Server

| 维度 | Listen Server | Dedicated Server |
|------|--------------|------------------|
| 主机 | 某个玩家同时当服务器 | 独立服务器进程 |
| 延迟 | Host 0ms，其他玩家高 | 所有玩家平等 |
| 稳定性 | Host断线则房间消失 | 服务器常驻 |
| 反作弊 | Host可作弊 | 服务器权威 |
| 成本 | 免费 | 需要服务器费用 |
| 适用 | 开发测试/好友联机 | 生产环境 |

### 13.13.2 推荐方案：分阶段

```
阶段1（开发期）：Listen Server
  - 开发/测试用
  - 不需要额外服务器成本
  - 快速迭代

阶段2（上线初期）：EOS P2P + Listen Server
  - 好友联机模式
  - EOS P2P中继解决NAT穿透
  - 无需Dedicated Server

阶段3（规模化）：Dedicated Server + EOS Sessions
  - 匹配模式
  - 云端部署Dedicated Server
  - EOS Sessions管理房间生命周期
```

### 13.13.3 Dedicated Server 构建

```bash
# 构建专用服务器
# 1. 在Build.cs中添加Server目标
# 2. 使用UE编辑器构建
#    或者命令行：
#    UE5Editor-Cmd.exe DontPull.uproject -run=cook -targetplatform=WinServer
#    UE5Editor-Cmd.exe DontPull.uproject -build -targetplatform=WinServer -serverconfig=Development

# 3. 运行
#    DontPullServer.exe DontPull -log -NOSTEAM
```

### 13.13.4 云端部署方案

| 方案 | 说明 | 成本 | 适用 |
|------|------|------|------|
| EOS Hosting | Epic官方托管 | 按用量 | 小规模 |
| AWS GameLift | AWS游戏托管 | 按实例 | 中规模 |
| Azure PlayFab | 微软游戏托管 | 按实例 | 中规模 |
| 自建K8s | 自建容器集群 | 固定+弹性 | 大规模 |
| 混合方案 | EOS Sessions + 自建Server | 混合 | ✅ 推荐 |

---

## 13.14 跨平台联机

### 13.14.1 EOS Crossplay

```
EOS Crossplay 架构：
  ┌──────────────────────────────────┐
  │         EOS 账号系统              │
  │    (Epic Account Service)        │
  ├──────────┬──────────┬────────────┤
  │  PC      │  主机     │  移动端    │
  │  Steam   │  PSN     │  iOS      │
  │  EGS     │  XboxLive│  Android  │
  │  Win/Mac │  Switch  │           │
  └──────────┴──────────┴────────────┘
       │          │          │
       └──────────┼──────────┘
                  ▼
         EOS P2P 中继网络
                  │
                  ▼
         Dedicated Server
```

### 13.14.2 跨平台注意事项

| 注意点 | 说明 | 解决方案 |
|--------|------|----------|
| 输入差异 | 手柄/键鼠/触屏 | EnhancedInput多设备映射 |
| 性能差异 | 主机/PC/移动端 | 可调画质+固定逻辑帧率 |
| 审核差异 | 各平台审核要求 | 功能开关+平台宏 |
| 语音差异 | 各平台语音SDK | EOS Voice统一接口 |
| 支付差异 | 各平台支付规则 | 仅外观付费，不影响玩法 |

---

## 13.15 网络调试工具

### 13.15.1 UE内置网络调试

| 工具 | 用途 | 命令/方式 |
|------|------|-----------|
| NetProfiler | 网络性能分析 | `stat net` / `netprofile` |
| Network Emulation | 模拟延迟/丢包 | Project Settings → Net Emulation |
| Session Node | 蓝图调试Session | 蓝图断点 |
| Replication Graph | 可视化复制关系 | `net.RepGraph=1` |
| Gameplay Debugger | AI/网络状态调试 | `'` 键（撇号） |
| Iris Inspector | Iris复制检查器 | `iris.Debug=1`（启用Iris后） |

### 13.15.2 网络模拟配置

```ini
; DefaultEngine.ini — 开发期网络模拟
[/Script/Engine.NetworkEmulation]
; 模拟100ms延迟
MinLatency=100
MaxLatency=100
; 模拟1%丢包
MinPacketLoss=0.01
MaxPacketLoss=0.01
; 模拟偶尔的突发延迟
MinJitter=0
MaxJitter=50
```

### 13.15.3 测试流程

```
1. 单机测试 → 确保逻辑正确
2. PIE双窗口 → 测试本地双人
3. Net Emulation 100ms → 测试延迟下预测/校正
4. Net Emulation 200ms+丢包 → 测试极端网络
5. 独立Dedicated Server → 测试真实部署
6. 跨网络测试 → 不同地区/运营商
7. 压力测试 → 长时间运行，检查内存泄漏
```

---

## 13.16 网络联机开发路线图

```
Phase 1: 基础网络化（2~3周）
├─ GameMode/GameState/PlayerState 网络化
├─ 基础Replication（格子坐标/状态/得分）
├─ Server RPC（移动/推块/拾取）
├─ Multicast RPC（特效/拼合/爆炸）
└─ PIE双窗口测试

Phase 2: 客户端预测（1~2周）
├─ 移动预测 + 服务器校正
├─ 推块预测 + 回滚
├─ 方块滑动客户端插值
└─ 延迟模拟测试

Phase 3: EOS集成（2~3周）
├─ EOS SDK接入 + 认证
├─ Session创建/搜索/加入
├─ P2P中继连接
├─ 好友列表 + 邀请
└─ 语音聊天

Phase 4: 专用服务器（1~2周）
├─ Dedicated Server构建
├─ 云端部署
├─ Session与Server集成
└─ 自动匹配

Phase 5: 优化与安全（1~2周）
├─ 带宽优化（条件复制/频率控制）
├─ 输入校验 + 反作弊
├─ 延迟补偿
├─ 断线重连
└─ 跨平台测试
```

---

## 13.17 网络联机风险与挑战

| 风险ID | 风险描述 | 影响 | 缓解措施 |
|--------|---------|------|----------|
| NR-01 | 高延迟下推块判定不一致 | 玩家推块被否决，体验差 | 客户端预测+延迟补偿 |
| NR-02 | 两玩家同时推同一方块 | 冲突，结果不确定 | Server串行化处理，先到先得 |
| NR-03 | 方块滑动中客户端与服务端位置不同步 | 视觉抖动 | 客户端插值+OnRep校正 |
| NR-04 | 敌人AI移动在客户端看起来卡顿 | 敌人瞬移 | 客户端平滑插值+预测动画 |
| NR-05 | 断线重连后状态丢失 | 玩家丢失进度 | GameState快照+重连恢复 |
| NR-06 | EOS服务不可用 | 无法联机 | 降级为本地双人/LAN模式 |
| NR-07 | NAT穿透失败 | 部分玩家无法连接 | EOS P2P中继兜底 |
| NR-08 | 语音聊天延迟/质量差 | 沟通体验差 | 非空间音+EOS Voice优化 |

---

# 第14章 数据驱动与配置

## 14.1 UE功能映射

| Don't Pull系统 | UE功能 | 说明 |
|----------------|--------|------|
| 关卡数据 | `UDataTable` | 32关数据 |
| 方块配置 | `UDataAsset` | 方块参数 |
| 敌人配置 | `UDataAsset` | AI参数 |
| 掉落表 | `UDataAsset` | 权重配置 |
| 难度参数 | `UDataTable` | 难度曲线 |

## 14.2 DataTable设计

### 关卡数据表

```cpp
USTRUCT(BlueprintType)
struct FStageDataRow : public FTableRowBase
{
    UPROPERTY(EditAnywhere) int32 StageID = 0;
    UPROPERTY(EditAnywhere) FString StageName;
    UPROPERTY(EditAnywhere) int32 GridWidth = 15;
    UPROPERTY(EditAnywhere) int32 GridHeight = 13;
    UPROPERTY(EditAnywhere) FString CellMapString;       // "#..#M.#..." 格式
    UPROPERTY(EditAnywhere) TArray<FString> BlockSpawns; // "H,3,5" 格式
    UPROPERTY(EditAnywhere) TArray<FString> ManholeSpawns; // "M,2,3,JELLY,JELLY,DRAGON"
    UPROPERTY(EditAnywhere) int32 BoulderCount = 1;
    UPROPERTY(EditAnywhere) float RageTriggerTime = 30.0f;
    UPROPERTY(EditAnywhere) float TimeLimit = 30.0f;
    UPROPERTY(EditAnywhere) bool bHasBoulderInward = false;
    UPROPERTY(EditAnywhere) bool bIsFullMap = false;
};
```

### 方块配置表

```cpp
USTRUCT(BlueprintType)
struct FBlockConfigRow : public FTableRowBase
{
    UPROPERTY(EditAnywhere) EBlockType BlockType;
    UPROPERTY(EditAnywhere) bool bCanBePushed = true;
    UPROPERTY(EditAnywhere) bool bCrushOnWall = true;
    UPROPERTY(EditAnywhere) bool bCrushOnBlock = true;
    UPROPERTY(EditAnywhere) bool bCrushEnemy = true;
    UPROPERTY(EditAnywhere) bool bDestroyable = true;
    UPROPERTY(EditAnywhere) FString SpecialEffect; // "None"/"HeartCombine"/"Explosion"/"DropItem"
};
```

---

# 第15章 性能与优化

## 15.1 UE功能映射

| 优化项 | UE功能 | 说明 |
|--------|--------|------|
| 地板/墙壁批量渲染 | InstancedStaticMesh | 单DrawCall |
| 远处物体简化 | LOD | 层级细节 |
| 视野外剔除 | Frustum Culling | 自动剔除 |
| 光照优化 | Lumen / Baked GI | 全局光照 |
| 阴影优化 | Virtual Shadow Map | 阴影质量 |
| 动画优化 | Animation Budget Allocator | 动画预算 |
| AI优化 | AI LOD / Tick间隔 | 远处AI降频 |
| 内存优化 | Asset Manager / Chunk | 按需加载 |

## 15.2 关键优化点

### 15.2.1 InstancedStaticMesh

```text
地板和墙壁使用ISM批量渲染
  32关共约500+个地板格子 + 100+个墙壁格子
  不用ISM = 600+ DrawCall
  用ISM = 2 DrawCall（地板1个 + 墙壁1个）
```

```cpp
UPROPERTY()
UInstancedStaticMeshComponent* FloorISM;

void AStageGenerator::GenerateFloor()
{
    for (int32 y = 0; y < GridHeight; y++)
    {
        for (int32 x = 0; x < GridWidth; x++)
        {
            if (GetCellType(x, y) == ECellType::Floor)
            {
                FTransform Transform(
                    FRotator::ZeroRotator,
                    GridManager->GridToWorld(x, y),
                    FVector::OneVector);
                FloorISM->AddInstance(Transform);
            }
        }
    }
}
```

### 15.2.2 AI Tick优化

```cpp
void AEnemy::Tick(float DeltaTime)
{
    float DistToPlayer = GetDistanceToPlayer();
    if (DistToPlayer > 2000.0f)
    {
        // 远处：每0.5秒Tick一次
        AccumulatedTime += DeltaTime;
        if (AccumulatedTime < 0.5f) return;
        DeltaTime = AccumulatedTime;
        AccumulatedTime = 0.0f;
    }
    Super::Tick(DeltaTime);
}
```

### 15.2.3 关卡流式加载

```cpp
// 32关不需要全部常驻内存
// 使用Level Streaming按需加载当前关卡
FLatentActionInfo LatentInfo;
UGameplayStatics::LoadStreamLevel(GetWorld(), NextLevelName, true, false, LatentInfo);
UGameplayStatics::UnloadStreamLevel(GetWorld(), CurrentLevelName, LatentInfo, false);
```

### 15.2.4 光照方案

| 方案 | 说明 | 推荐 |
|------|------|------|
| Lumen Dynamic GI | 实时全局光照 | ✅ 开发期使用 |
| Baked Lighting + Lightmass | 烘焙光照 | ✅ 发布期使用 |
| Precomputed Visibility | 预计算可见性 | ✅ 固定相机场景 |

**说明**：等轴测固定相机场景非常适合烘焙光照，因为相机位置不变，可以完全预计算。

---

# 附录A UE功能与Don't Pull系统完整映射表

| Don't Pull系统 | UE功能 | 具体组件/类 | 优先级 |
|----------------|--------|-------------|:------:|
| 网格管理 | 自定义Component | UGridManagerComponent | P0 |
| 格子移动 | 自定义Component | UGridMovementComponent | P0 |
| 碰撞检测 | 格子坐标判断 | 自定义逻辑 | P0 |
| 玩家角色 | ACharacter | ADontPullCharacter | P0 |
| 输入系统 | Enhanced Input | UInputAction + UInputMappingContext | P0 |
| 方块Actor | AActor + Interface | ABlock + IPushableInterface | P0 |
| 方块滑动 | Timeline | UTimelineComponent | P0 |
| 方块压碎 | Destroy + Niagara | — | P1 |
| 敌人AI | Behavior Tree | UBehaviorTree + UBlackboardComponent | P1 |
| 敌人寻路 | EQS | UEnvQuery | P1 |
| 恐龙喷火 | BTTask + Actor | UBTTask_FireBreath + AFireBreath | P1 |
| 狂暴状态 | Blackboard Key / GAS | FBlackboardKeySelector / GameplayTag | P2 |
| 晕眩状态 | Blackboard Key / GAS | — | P2 |
| 心形拼合 | 自定义检测 + 事件 | — | P2 |
| 无敌状态 | GAS / Timer | GameplayEffect / FTimerHandle | P2 |
| 道具生成 | SpawnActor | — | P2 |
| 掉落表 | DataAsset | UItemDropTable | P2 |
| 计分 | 自定义Manager | AScoreManager | P2 |
| 生命系统 | 自定义Component | ULifeSystemComponent | P2 |
| 相机 | CameraActor | BP_IsometricCamera | P0 |
| 滚石 | Spline + Actor | ABoulder + USplineComponent | P1 |
| 井盖 | Actor + Timer | AManhole | P1 |
| 关卡数据 | DataTable | FStageDataRow | P1 |
| 方块配置 | DataTable | FBlockConfigRow | P1 |
| 爆炸特效 | Niagara | NS_BombExplosion | P2 |
| 火焰特效 | Niagara | NS_FireBreath | P2 |
| 心形特效 | Niagara + PostProcess | NS_HeartCombine | P2 |
| 屏幕震动 | CameraShakeBase | UExplosionShake | P2 |
| 角色动画 | AnimBP + BlendSpace | ABP_Player + BS_PlayerWalk | P1 |
| 敌人动画 | AnimBP | ABP_Jelly / ABP_Dragon | P1 |
| 音效 | MetaSound | MS_SFX_* | P3 |
| BGM | MetaSound | MS_BGM_* | P3 |
| HUD | UMG Widget | WBP_HUD | P3 |
| 结算界面 | UMG Widget | WBP_StageResult | P3 |
| 双人模式 | Local Multiplayer | 2× PlayerController | P3 |
| 网络复制 | Replication | DOREPLIFETIME / OnRep | P0(联机) |
| 客户端预测 | Client-Side Prediction | PredictionID + OnRep校正 | P0(联机) |
| 延迟补偿 | Server-Side Rewind | FGridSnapshot | P1(联机) |
| 网络化AI | Server-Only AI | BehaviorTree (Server) | P0(联机) |
| 在线会话 | Online Subsystem EOS | IOnlineSession | P0(联机) |
| P2P中继 | EOS P2P | NAT穿透 | P0(联机) |
| 语音聊天 | EOS Voice Chat | NonPositional | P1(联机) |
| 反作弊 | Server Authority | GameMode校验 | P0(联机) |
| 专用服务器 | Dedicated Server | 独立Server构建 | P1(联机) |
| 跨平台 | EOS Crossplay | Epic Account Service | P2(联机) |
| Iris复制 | Iris (Beta) | 预留迁移接口 | P3(联机) |
| 地板/墙壁 | InstancedStaticMesh | UInstancedStaticMeshComponent | P1 |
| 关卡加载 | Level Streaming | LoadStreamLevel | P3 |
| 光照 | Lumen / Baked | — | P3 |
| 材质 | Material + Dynamic | M_* | P2 |

---

# 附录B 推荐第三方插件

| 插件 | 用途 | 是否免费 |
|------|------|:--------:|
| Gameplay Ability System | 状态/效果管理 | 引擎内置 |
| Enhanced Input | 增强输入 | 引擎内置 |
| Niagara | 粒子特效 | 引擎内置 |
| MetaSound | 音频系统 | 引擎内置 |
| UMG | UI系统 | 引擎内置 |
| Behavior Tree | AI系统 | 引擎内置 |
| EQS | 环境查询 | 引擎内置 |
| Online Subsystem EOS | 跨平台联机 | 引擎内置 |
| EOS Voice Chat | 语音聊天 | 引擎内置 |
| Iris Networking | 下一代复制 | 引擎内置(Beta) |
| Paper2D | 2D贴图参考（不用于3D） | 引擎内置 |
| Animation Budget Allocator | 动画性能优化 | 引擎内置 |
| Asset Manager | 资源管理 | 引擎内置 |

**说明**：Don't Pull的3D重制完全可以仅使用UE5.7内置功能完成，无需第三方付费插件。联机功能使用EOS（免费），无需Steamworks等付费中间件。

---

# 附录C 开发环境与工具链

| 工具 | 用途 |
|------|------|
| UE5.7 Editor | 主开发环境 |
| Visual Studio 2022 / Rider | C++ IDE |
| Blender / Maya | 3D模型制作 |
| Substance Painter | 材质贴图 |
| FMOD / Wwise（可选） | 高级音频（MetaSound够用则不需要） |
| Perforce / Git | 版本控制 |
| Unreal Insights | 性能分析 |
| Gameplay Debugger | AI调试 |
| Niagara Debugger | 特效调试 |
| Blueprint Debugger | 蓝图调试 |
