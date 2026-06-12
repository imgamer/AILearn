# Unreal Engine 5.7 动画系统架构与执行流分析

> 基于 `Engine/Source/Runtime/Engine/Classes/Animation/` 源码分析  
> 引擎版本: UE 5.7.4

---

## 目录

1. [整体架构](#1-整体架构)
2. [资产继承体系](#2-资产继承体系)
3. [核心类详解](#3-核心类详解)
4. [执行流的六阶段模型](#4-执行流的六阶段模型)
5. [动画节点体系](#5-动画节点体系)
6. [状态机系统](#6-状态机系统)
7. [Montage 系统](#7-montage-系统)
8. [惯性混合与 Dead Blending](#8-惯性混合与-dead-blending)
9. [链接动画图与动画层](#9-链接动画图与动画层)
10. [Cached Pose 系统](#10-cached-pose-系统)
11. [同步系统](#11-同步系统)
12. [曲线系统](#12-曲线系统)
13. [多线程与 URO](#13-多线程与-uro)
14. [LOD 系统](#14-lod-系统)
15. [消息系统与节点间通信](#15-消息系统与节点间通信)
16. [通知系统](#16-通知系统)
17. [完整执行流时序图](#17-完整执行流时序图)
18. [设计精髓总结](#18-设计精髓总结)

---

## 1. 整体架构

动画系统采用 **AnimGraph（动画图） + Proxy 代理模式** 的分层架构：

```
┌──────────────────────────────────────────────────────────┐
│  USkeletalMeshComponent (骨骼网格组件)                     │
│    └─ UAnimInstance (动画实例，挂载在组件上)                │
│         └─ FAnimInstanceProxy (动画代理，线程安全的执行核心) │
│              └─ FAnimNode_Root → AnimGraph (节点树)       │
│                   ├─ FAnimNode_StateMachine               │
│                   ├─ FAnimNode_SequencePlayer              │
│                   ├─ FAnimNode_Inertialization             │
│                   ├─ FAnimNode_LinkedAnimGraph             │
│                   └─ ... (更多节点类型)                     │
└──────────────────────────────────────────────────────────┘
```

**设计意图**：`FAnimInstanceProxy` 将动画执行从 `UObject` 派生类 `UAnimInstance` 中解耦。`UAnimInstance` 是 `UObject`，只能在游戏线程操作；而 `FAnimInstanceProxy` 是纯 C++ 结构体，可安全地在工作线程上运行，实现多线程动画更新。

---

## 2. 资产继承体系

动画资产（可播放并求值产生姿态的数据对象）的继承链：

```
UObject
  └─ UAnimationAsset (AnimationAsset.h)
       ├─ UAnimSequenceBase (AnimSequenceBase.h)        ← 单一动画片段
       │    ├─ UAnimCompositeBase (AnimCompositeBase.h) ← 组合动画片段
       │    │    ├─ UAnimComposite
       │    │    └─ UAnimMontage (AnimMontage.h)        ← 蒙太奇
       │    └─ UAnimSequence (AnimSequence.h)           ← 骨骼动画序列
       ├─ UBlendSpace (BlendSpace.h)                    ← 混合空间
       │    ├─ UBlendSpace1D
       │    └─ UAimOffsetBlendSpace
       └─ UPoseAsset (PoseAsset.h)                      ← 姿态资产
```

**关键类型说明**：

| 资产 | 文件 | 说明 |
|------|------|------|
| `UAnimationAsset` | `AnimationAsset.h` | 所有动画资产的抽象基类 |
| `UAnimSequenceBase` | `AnimSequenceBase.h` | 含 Notify 数组和曲线数据 |
| `UAnimSequence` | `AnimSequence.h` | 完整骨骼动画，含压缩轨道数据 |
| `UAnimCompositeBase` | `AnimCompositeBase.h` | 由 `FAnimTrack`（多个 `FAnimSegment`）组成 |
| `UAnimMontage` | `AnimMontage.h` | 支持 Section、Slot、BranchingPoint |
| `UBlendSpace` | `BlendSpace.h` | 基于参数的动画混合空间 |

---

## 3. 核心类详解

### 3.1 UAnimInstance (`AnimInstance.h`)

动画实例，是动画蓝图的运行时基类。挂载在 `USkeletalMeshComponent` 上。

**核心职责**：
- 管理 Montage 生命周期（播放/停止/暂停/跳转）
- 管理动画通知队列 (`NotifyQueue`)
- 提供蓝图事件入口 (`BlueprintInitializeAnimation`, `BlueprintUpdateAnimation`, `BlueprintPostEvaluateAnimation`)
- 管理 RootMotion 提取
- 管理曲线数据
- 管理 LinkedAnimGraph / LinkedAnimLayer 子实例

**关键成员**：

```cpp
// AnimInstance.h:352
UCLASS(transient, Blueprintable, Within=SkeletalMeshComponent)
class UAnimInstance : public UObject
{
    USkeleton* CurrentSkeleton;                          // 当前骨骼
    ERootMotionMode::Type RootMotionMode;                // RootMotion 模式
    uint8 bUseMultiThreadedAnimationUpdate : 1;          // 是否允许并行更新
    TArray<FAnimMontageInstance*> MontageInstances;      // 活跃的 Montage 实例
    FAnimNotifyQueue NotifyQueue;                        // 动画通知队列
    mutable FAnimInstanceProxy* AnimInstanceProxy;       // 执行代理
    TMap<FName, float> AnimationCurves[...];             // 动画曲线
    FRootMotionMovementParams ExtractedRootMotion;       // 提取的 RootMotion
};
```

**六大生命周期入口**（`AnimInstance.h:1334-1339`）：

```cpp
InitializeAnimation()     → 初始化
UpdateAnimation()         → 每帧更新（可并行）
ParallelUpdateAnimation() → 工作线程更新
PostUpdateAnimation()     → 更新后处理
ParallelEvaluateAnimation() → 工作线程评估
PostEvaluateAnimation()   → 评估后处理
UninitializeAnimation()   → 反初始化
```

### 3.2 FAnimInstanceProxy (`AnimInstanceProxy.h`)

**线程安全的执行核心**。这是一个纯 C++ 结构体（非 UObject），可在工作线程上操作。

**核心成员**：

```cpp
// AnimInstanceProxy.h:143
struct FAnimInstanceProxy
{
    // 变换数据
    FTransform ComponentTransform;         // 组件世界变换
    FTransform ComponentRelativeTransform; // 组件相对变换
    FTransform ActorTransform;             // Actor 变换

    // 动画图
    FAnimNode_Base* RootNode;             // 动画图根节点
    IAnimClassInterface* AnimClassInterface; // 编译后的类元数据

    // 同步
    UE::Anim::FAnimSync Sync;             // 动画同步系统

    // 双缓冲权重
    TArray<float> MachineWeightArrays[2]; // 状态机权重（双缓冲）
    TArray<float> StateWeightArrays[2];   // 状态权重（双缓冲）
    TArray<FMontageActiveSlotTracker> SlotWeightTracker[2]; // Slot 权重

    // 遍历计数器（防止重复处理）
    FGraphTraversalCounter InitializationCounter;
    FGraphTraversalCounter CachedBonesCounter;
    FGraphTraversalCounter UpdateCounter;
    FGraphTraversalCounter EvaluationCounter;

    // Montage
    TArray<FMontageEvaluationState> MontageEvaluationData;

    // 其他
    FBoneContainer* RequiredBones;         // 当前 LOD 所需的骨骼
    FRootMotionMovementParams ExtractedRootMotion;
    FAnimNotifyQueue NotifyQueue;
};
```

**核心方法**：

| 方法 | 说明 |
|------|------|
| `Initialize()` | 初始化 RootNode、SavedPose队列、状态缓冲 |
| `PreUpdate()` | 游戏线程预更新：复制Transform、处理LOD、Montage权重 |
| `UpdateAnimation()` | 执行 Update 遍历 + Tick 同步组 |
| `UpdateAnimationNode()` | 从 RootNode 开始递归 Update |
| `EvaluateAnimation()` | 从 RootNode 开始递归 Evaluate |
| `CacheBones()` | 骨骼缓存刷新 |
| `PostUpdate()` / `PostEvaluate()` | 后处理 |

### 3.3 IAnimClassInterface (`AnimClassInterface.h`)

AnimBlueprint 编译生成的 `UAnimBlueprintGeneratedClass` 实现的接口，提供编译后的元数据：

- `GetAnimNodeProperties()` — 所有动画节点属性
- `GetBakedStateMachines()` — 烘焙后的状态机定义
- `GetAnimBlueprintFunctions()` — 动画图函数定义
- `GetSyncGroupNames()` — 同步组名称
- `GetOrderedSavedPoseNodeIndicesMap()` — SavedPose 节点索引

### 3.4 UAnimBlueprintGeneratedClass (`AnimBlueprintGeneratedClass.h`)

```cpp
// AnimBlueprintGeneratedClass.h:365
class UAnimBlueprintGeneratedClass : public UBlueprintGeneratedClass,
                                     public IAnimClassInterface
{
    TArray<FBakedAnimationStateMachine> BakedStateMachines;  // 烘焙状态机
    USkeleton* TargetSkeleton;                               // 目标骨骼
    TArray<FAnimNotifyEvent> AnimNotifies;                    // 通知列表
    TArray<FAnimBlueprintFunction> AnimBlueprintFunctions;    // 函数定义
    TArray<FStructProperty*> AnimNodeProperties;             // 节点属性列表
    TArray<FStructProperty*> LinkedAnimGraphNodeProperties;  // 链接图节点
    TArray<FStructProperty*> LinkedAnimLayerNodeProperties;  // 链接层节点
    TArray<FStructProperty*> PreUpdateNodeProperties;        // 需 PreUpdate 的节点
    TArray<FStructProperty*> DynamicResetNodeProperties;     // 需 DynamicReset 的节点
    TArray<FStructProperty*> StateMachineNodeProperties;     // 状态机节点
    TArray<FStructProperty*> InitializationNodeProperties;   // 需额外初始化的节点
    TArray<FAnimNodeData> AnimNodeData;                      // 常量/折叠数据
};
```

### 3.5 FAnimationBaseContext 及其派生类 (`AnimNodeBase.h`, `AnimExecutionContext.h`)

上下文对象在图的遍历过程中传递，携带执行环境信息：

```
FAnimationBaseContext                    ← 基类：持有 AnimInstanceProxy、SharedContext
  ├─ FAnimationInitializeContext         ← 初始化阶段
  ├─ FAnimationCacheBonesContext         ← 骨骼缓存阶段
  ├─ FAnimationUpdateContext             ← 更新阶段（权重、DeltaTime、RootMotion）
  ├─ FPoseContext                        ← 局部空间评估（Pose + Curve + Attributes）
  └─ FComponentSpacePoseContext          ← 组件空间评估
```

**FAnimationUpdateContext 的核心能力**（`AnimNodeBase.h:353`）：

```cpp
FractionalWeight(WeightMultiplier)            // 缩放子节点权重
FractionalWeightAndRootMotion(w, rw)          // 独立控制 RootMotion 权重
FractionalWeightAndTime(w, t)                 // 缩放时间流逝
AsInactive()                                  // 标记分支为 blend-out 状态
GetFinalBlendWeight()                         // 获取当前累积权重
GetDeltaTime()                                // 获取当前 DeltaTime
GetMessage<T>() / FindMessage<T>()            // 从 MessageStack 获取消息
```

### 3.6 FPoseLink / FComponentSpacePoseLink (`AnimNodeBase.h:749-842`)

节点间的**姿态链接**，构成图的"边"。封装了链接节点的指针和遍历逻辑：

```cpp
struct FPoseLinkBase {
    FAnimNode_Base* LinkedNode;   // 非序列化的节点指针（运行时链接）
    int32 LinkID;                 // 序列化的链接 ID

    void Initialize(Context);     // 递归初始化下游
    void CacheBones(Context);     // 递归缓存骨骼
    void Update(Context);         // 递归更新下游
};

struct FPoseLink : FPoseLinkBase {
    void Evaluate(FPoseContext&);  // 递归评估（局部空间）
};

struct FComponentSpacePoseLink : FPoseLinkBase {
    void EvaluateComponentSpace(FComponentSpacePoseContext&); // 组件空间
};
```

### 3.7 FAnimationUpdateSharedContext (`AnimNodeBase.h:130`)

Update 阶段的持久共享状态：

```cpp
struct FAnimationUpdateSharedContext {
    UE::Anim::FMessageStack MessageStack;   // 作用域消息栈
    // （已弃用的 FAnimNodeTracker 已被 MessageStack 取代）
};
```

---

## 4. 执行流的六阶段模型

### 阶段 1: Initialize（初始化）

**入口**：`UAnimInstance::InitializeAnimation()`

```
UAnimInstance::InitializeAnimation(bInDeferRootNodeInitialization)
  ├─ NativeInitializeAnimation()             // C++ 重载点
  ├─ BlueprintInitializeAnimation()           // 蓝图事件
  ├─ FAnimInstanceProxy::InitializeRootNode() // 初始化代理
  │    ├─ 从 AnimClassInterface 获取 RootNode 指针
  │    ├─ 构建 SavedPoseQueueMap
  │    ├─ 初始化状态机权重缓冲（双缓冲）
  │    ├─ 检查蓝图错误状态
  │    ├─ ReinitializeSlotNodes()
  │    └─ 复制 ComponentTransform
  ├─ InitializeGroupedLayers()               // 初始化链接层
  └─ (若未延迟) 递归 Initialize_AnyThread
```

**延迟初始化**：若 `bInDeferRootNodeInitialization = true`，则根节点的 `Initialize_AnyThread` 推迟到首次 `UpdateAnimation()` 时执行。

### 阶段 2: PreUpdate（更新前，游戏线程）

**入口**：`UAnimInstance::PreUpdateAnimation(DeltaSeconds)`

```
UAnimInstance::PreUpdateAnimation(DeltaSeconds)
  └─ FAnimInstanceProxy::PreUpdate(InAnimInstance, DeltaSeconds)
       ├─ 复制 ComponentTransform / ActorTransform
       ├─ 处理 LOD 变化 → OnPreUpdateLODChanged()
       │    └─ 重新启用/禁用 GameThreadPreUpdateNodes
       ├─ 执行 PreUpdate 节点（HasPreUpdate() == true 的节点）
       ├─ 更新 Montage 权重 → Montage_UpdateWeight()
       ├─ 处理 SlotGroup 惯性混合请求
       ├─ 推进 Montage 时间 → Montage_Advance()
       └─ 刷新 Montage 评估数据 → UpdateMontageEvaluationData()
```

### 阶段 3: Update（更新，可并行）

**入口**：`FAnimInstanceProxy::UpdateAnimation()`

```cpp
// AnimInstanceProxy.cpp:1222
void FAnimInstanceProxy::UpdateAnimation()
{
    FAnimationUpdateSharedContext SharedContext;
    FAnimationUpdateContext Context(this, CurrentDeltaSeconds, &SharedContext);
    UpdateAnimation_WithRoot(Context, RootNode, NAME_AnimGraph);
    Sync.TickAssetPlayerInstances(*this, CurrentDeltaSeconds);  // 统一Tick同步组
}
```

**图遍历流程**（`UpdateAnimationNode_WithRoot`，`AnimInstanceProxy.cpp:126`）：

```
1. UpdateCounter.Increment()                      // 递增更新计数（防重复）
2. InitialUpdate 函数调用                          // 节点首次变为 Relevant
3. BecomeRelevant 函数调用                        // 节点变为 Relevant
4. Update 函数调用                                 // 蓝图 Update 事件
5. InRootNode->Update_AnyThread(Context)           // C++ 虚函数，递归遍历子节点
6. PostGraphUpdate (SavedPose 队列)               // 缓存姿态后处理
```

**权重传播模型**：每个节点在 `Update_AnyThread` 中调用其 `FPoseLink::Update()`，将带有衰减权重的 `FAnimationUpdateContext` 传递给下游节点，形成深度优先遍历。权重在每一层按比例衰减。

### 阶段 4: PostUpdate（更新后，游戏线程）

**入口**：`UAnimInstance::PostUpdateAnimation()`

```
UAnimInstance::PostUpdateAnimation()
  ├─ TriggerQueuedMontageEvents()
  │    ├─ MontageBlendingOut 事件
  │    ├─ MontageBlendedIn 事件
  │    ├─ MontageEnded 事件
  │    └─ MontageSectionChanged 事件
  ├─ TriggerAnimNotifies(DeltaSeconds)
  │    ├─ 触发队列中的 AnimNotify
  │    ├─ 更新 ActiveAnimNotifyState（Begin/End）
  │    └─ 触发 MontageNotify（Begin/End）
  └─ Montage 事件多播委托
```

### 阶段 5: Evaluate（评估，可并行）

**入口**：`FAnimInstanceProxy::EvaluateAnimation(Output)`

```
FAnimInstanceProxy::EvaluateAnimation(FPoseContext& Output)
  └─ EvaluateAnimation_WithRoot(Output, RootNode)
       ├─ 检查 Evaluate() 虚函数是否被重载（自定义评估）
       └─ EvaluateAnimationNode(Output)
            └─ RootNode->Evaluate_AnyThread(Output)
                 └─ Result.Evaluate(Output)
                      └─ ... (深度优先递归，逐节点生成姿态)
```

**两种评估空间**：

| 链接类型 | 上下文 | 用途 |
|----------|--------|------|
| `FPoseLink` | `FPoseContext` (局部空间) | 大多数节点，骨骼局部变换 |
| `FComponentSpacePoseLink` | `FComponentSpacePoseContext` (组件空间) | IK、骨骼控制等 |

**FPoseContext 的内容**：

```cpp
// AnimNodeBase.h:478
struct FPoseContext : public FAnimationBaseContext
{
    FCompactPose   Pose;              // 紧凑骨骼姿态
    FBlendedCurve  Curve;             // 混合曲线
    FStackAttributeContainer CustomAttributes; // 自定义属性
};
```

### 阶段 6: PostEvaluate（评估后，游戏线程）

**入口**：`UAnimInstance::PostEvaluateAnimation()`

```
UAnimInstance::PostEvaluateAnimation()
  ├─ NativePostEvaluateAnimation()
  ├─ BlueprintPostEvaluateAnimation()
  └─ UpdateCurvesPostEvaluation()  // 推送曲线到材质/MorphTarget
```

---

## 5. 动画节点体系

### 5.1 节点基类 FAnimNode_Base (`AnimNodeBase.h:852`)

所有动画节点的根基类。定义了动画节点必须或可选实现的接口：

```cpp
struct FAnimNode_Base
{
    // === 必须实现的接口（图遍历的核心） ===
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context);
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context);
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context);
    virtual void Evaluate_AnyThread(FPoseContext& Output);          // 局部空间
    virtual void EvaluateComponentSpace_AnyThread(FComponentSpacePoseContext& Output); // 组件空间

    // === 可选重载的接口 ===
    virtual bool CanUpdateInWorkerThread() const;      // 是否支持工作线程更新
    virtual bool HasPreUpdate() const;                  // 是否需要游戏线程预更新
    virtual void PreUpdate(const UAnimInstance*);       // 游戏线程预更新
    virtual bool NeedsDynamicReset() const;             // 是否需要动态重置
    virtual void ResetDynamics(ETeleportType);          // 动态重置（传送等）
    virtual bool NeedsOnInitializeAnimInstance() const; // 是否需要额外初始化

    // === 节点数据访问 ===
    GET_ANIM_NODE_DATA(Type, Identifier)               // 获取常量/折叠数据
    GET_INSTANCE_ANIM_NODE_DATA_PTR(Type, Identifier)  // 获取实例数据指针
};
```

### 5.2 节点分类

#### 资产播放节点

```
FAnimNode_Base
  └─ FAnimNode_AssetPlayerRelevancyBase  ← "Relevant Anim" 查询接口
       └─ FAnimNode_AssetPlayerBase       ← 资产播放基类（Update 是 final）
            └─ FAnimNode_SequencePlayerBase ← 序列播放器基类
                 ├─ FAnimNode_SequencePlayer          ← 常量折叠版
                 └─ FAnimNode_SequencePlayer_Standalone ← 独立版
```

`FAnimNode_AssetPlayerBase` 的核心（`AnimNode_AssetPlayerBase.h`）：

- `InternalTimeAccumulator` — 内部累计时间，驱动动画进度
- `BlendWeight` — 当前混合权重
- `DeltaTimeRecord` — 上一帧的时间记录
- `CreateTickRecordForNode()` — 创建 TickRecord 提交到同步系统
- `Update_AnyThread` 是 **final**，子类必须实现 `UpdateAssetPlayer()`

#### 控制流节点

| 节点 | 文件 | 功能 |
|------|------|------|
| `FAnimNode_Root` | `AnimNode_Root.h` | 动画图根节点（汇点），最终姿态输出 |
| `FAnimNode_StateMachine` | `AnimNode_StateMachine.h` | 状态机，动画系统的核心控制流 |
| `FAnimNode_SaveCachedPose` | `AnimNode_SaveCachedPose.h` | 缓存姿态，供多处复用 |
| `FAnimNode_UseCachedPose` | `AnimNode_UseCachedPose.h` | 使用已缓存的姿态 |
| `FAnimNode_TransitionPoseEvaluator` | `AnimNode_TransitionPoseEvaluator.h` | 状态机过渡期间的姿态评估 |
| `FAnimNode_TransitionResult` | `AnimNode_TransitionResult.h` | 过渡结果节点 |

#### 混合节点

| 节点 | 文件 | 功能 |
|------|------|------|
| `FAnimNode_Inertialization` | `AnimNode_Inertialization.h` | 惯性混合（GDC 2018） |
| `FAnimNode_DeadBlending` | `AnimNode_DeadBlending.h` | Dead Blending 混合 |
| `FAnimNode_ApplyMeshSpaceAdditive` | `AnimNode_ApplyMeshSpaceAdditive.h` | MeshSpace 叠加混合 |

#### 链接节点

| 节点 | 文件 | 功能 |
|------|------|------|
| `FAnimNode_LinkedAnimGraph` | `AnimNode_LinkedAnimGraph.h` | 动态链接到另一个 AnimInstance |
| `FAnimNode_LinkedAnimLayer` | `AnimNode_LinkedAnimLayer.h` | 动画层链接（继承自 LinkedAnimGraph） |
| `FAnimNode_LinkedInputPose` | `AnimNode_LinkedInputPose.h` | 链接图的输入姿态节点 |
| `FAnimNode_CustomProperty` | `AnimNode_CustomProperty.h` | 自定义属性传递节点（基类） |

---

## 6. 状态机系统

### 6.1 编译时数据结构

状态机在编译时被"烘焙"为不可变的数据结构（`AnimStateMachineTypes.h`）：

```
FBakedAnimationStateMachine              ← 一个完整状态机
  ├─ MachineName: FName                 ← 状态机名称
  ├─ InitialState: int32                ← 初始状态索引
  ├─ States: TArray<FBakedAnimationState>
  │    ├─ StateName: FName
  │    ├─ StateRootNodeIndex: int32     ← 状态的子图根节点
  │    ├─ PlayerNodeIndices: TArray     ← 状态内的 AssetPlayer 索引
  │    ├─ LayerNodeIndices: TArray      ← 状态内的 Layer 节点索引
  │    ├─ Transitions: TArray<FBakedStateExitTransition>
  │    │    ├─ TransitionIndex: int32
  │    │    ├─ CanTakeDelegateIndex     ← 过渡条件函数
  │    │    ├─ bAutomaticRemainingTimeRule ← 基于剩余时间的自动过渡
  │    │    └─ PoseEvaluatorLinks       ← 过渡姿态评估器
  │    ├─ bAlwaysResetOnEntry: bool
  │    ├─ bIsAConduit: bool             ← 是否为 Conduit（自动过渡的状态）
  │    ├─ StartNotify / EndNotify / FullyBlendedNotify
  │    └─ EntryRuleNodeIndex
  └─ Transitions: TArray<FAnimationTransitionBetweenStates>
       ├─ PreviousState / NextState
       ├─ CrossfadeDuration: float
       ├─ BlendMode: EAlphaBlendOption
       ├─ LogicType: TLT_StandardBlend | TLT_Inertialization | TLT_Custom
       ├─ CustomCurve: UCurveFloat*
       ├─ BlendProfile: UBlendProfile*
       └─ bAllowInertializationForSelfTransitions
```

### 6.2 运行时状态机 FAnimNode_StateMachine (`AnimNode_StateMachine.h`)

```cpp
struct FAnimNode_StateMachine : public FAnimNode_Base
{
    int32 StateMachineIndexInClass;              // 在 BakedStateMachines 中的索引
    int32 MaxTransitionsPerFrame;                // 每帧最大过渡数（默认 3）
    int32 MaxTransitionsRequests;                // 缓冲的最大过渡请求数
    bool bSkipFirstUpdateTransition;             // 首次更新时是否跳过过渡
    bool bReinitializeOnBecomingRelevant;        // 变为 Relevant 时重新初始化

    // 运行时状态
    int32 CurrentState;                          // 当前状态索引
    float ElapsedTime;                           // 当前状态已用时间
    TArray<FAnimationActiveTransitionEntry> ActiveTransitionArray; // 活动过渡
    TArray<FPoseLink> StatePoseLinks;            // 每个状态的子图链接
    TArray<FTransitionEvent> QueuedTransitionEvents; // 排队的过渡请求
};
```

### 6.3 状态机 Update 流程

```
Update_AnyThread(Context)
  ├─ 若首次更新或重新变为 Relevant → 设置初始状态
  ├─ 若当前状态是 Conduit → 自动查找有效过渡
  ├─ 查找有效过渡 → FindValidTransition()
  │    ├─ 遍历当前状态的 FBakedStateExitTransition 列表
  │    ├─ 检查 CanTakeDelegate（过渡条件）
  │    ├─ 检查 bAutomaticRemainingTimeRule（剩余时间）
  │    └─ 检查过渡请求队列匹配
  ├─ 若找到有效过渡 → TransitionToState()
  │    ├─ 创建 FAnimationActiveTransitionEntry
  │    ├─ 设置 Blend（标准/Custom/Inertialization）
  │    └─ 触发状态进入/退出通知
  ├─ 更新活动过渡 → UpdateTransitionStates()
  │    ├─ 更新 Blend Alpha
  │    ├─ 检查过渡是否完成
  │    └─ 过渡完成时切换 CurrentState
  ├─ 更新当前状态子图 → UpdateState(CurrentState, Context)
  └─ 清理过期过渡请求
```

### 6.4 过渡类型

```cpp
// AnimStateMachineTypes.h:44
enum ETransitionLogicType {
    TLT_StandardBlend,   // 标准混合：源和目标状态同时更新，之间插值
    TLT_Inertialization, // 惯性混合：一次只有一个状态活跃，用外推平滑过渡
    TLT_Custom           // 自定义混合图：用户定义过渡曲线
};
```

### 6.5 过渡请求系统

支持事件驱动的过渡触发：

```cpp
// 从蓝图中请求过渡
RequestTransitionEvent(EventName, Timeout, QueueMode, OverwriteMode);

// 在过渡规则中查询
QueryTransitionEvent(MachineIndex, TransitionIndex, EventName);
QueryAndMarkTransitionEvent(MachineIndex, TransitionIndex, EventName); // 消费模式
```

`FTransitionEvent` 支持三种队列模式（`ETransitionRequestQueueMode`）：

- `Shared` — 一个过渡消费后其他过渡不再处理
- `Unique` — 每个过渡独立处理

三种覆写模式（`ETransitionRequestOverwriteMode`）：

- `Append` — 总是添加
- `Ignore` — 同名已存在则忽略
- `Overwrite` — 同名已存在则覆写

---

## 7. Montage 系统

### 7.1 Montage 资产结构

```
UAnimMontage (AnimMontage.h)
  ├─ CompositeSections: TArray<FCompositeSection>
  │    ├─ SectionName: FName
  │    └─ NextSectionName: FName    ← 形成 Section 链
  ├─ SlotAnimTracks: TArray<FSlotAnimationTrack>
  │    └─ AnimTrack: FAnimTrack
  │         └─ AnimSegments: TArray<FAnimSegment>
  ├─ BranchingPoints: TArray<FBranchingPoint>
  ├─ BlendIn: FAlphaBlendArgs
  ├─ BlendOut: FAlphaBlendArgs
  └─ BlendOutTriggerTime: float
```

### 7.2 Montage 生命周期管理

`UAnimInstance` 管理 Montage 的完整生命周期：

```cpp
// 播放
Montage_Play(Montage, PlayRate, ReturnValueType, StartTime, bStopAll)
Montage_PlayWithBlendIn(Montage, BlendIn, ...)
Montage_PlayWithBlendSettings(Montage, BlendSettings, ...)

// 控制
Montage_Stop(BlendOutTime, Montage)
Montage_Pause(Montage)
Montage_Resume(Montage)
Montage_JumpToSection(SectionName, Montage)
Montage_SetNextSection(SectionNameToChange, NextSection)

// 查询
Montage_IsActive(Montage)
Montage_IsPlaying(Montage)
Montage_GetCurrentSection(Montage)
Montage_GetPosition(Montage)
```

### 7.3 Montage 评估状态

`FMontageEvaluationState`（`AnimMontageEvaluationState.h`）是从 `UAnimInstance` 复制到 `FAnimInstanceProxy` 的轻量级结构，用于线程安全的评估：

```cpp
struct FMontageEvaluationState {
    UAnimMontage* Montage;          // Montage 资产
    FAlphaBlend BlendInfo;          // 混合信息
    const UBlendProfile* ActiveBlendProfile; // 活动 BlendProfile
    float MontagePosition;          // 当前位置
    FDeltaTimeRecord DeltaTimeRecord; // 上帧时间和 Delta
    bool bIsPlaying;                // 是否正在播放
    bool bIsActive;                 // 是否活跃（未停止）
};
```

### 7.4 Montage 委托

```cpp
OnMontageStarted         // Montage 开始
OnMontageBlendingOut     // Montage 开始 BlendOut
OnMontageBlendedIn       // Montage BlendIn 完成
OnMontageEnded           // Montage 结束（中断或完成）
OnMontageSectionChanged  // Section 切换
OnAllMontageInstancesEnded // 所有 Montage 实例结束
```

### 7.5 Slot 节点权重追踪

`FMontageActiveSlotTracker` 记录每个 Slot 节点的权重和相关性：

```cpp
struct FMontageActiveSlotTracker {
    float MontageLocalWeight;           // Montage 本地权重
    float NodeGlobalWeight;             // 节点全局权重
    bool bIsRelevantThisTick;           // 当前帧是否相关
    bool bWasRelevantOnPreviousTick;    // 上一帧是否相关
};
```

---

## 8. 惯性混合与 Dead Blending

### 8.1 惯性混合 (Inertialization) (`AnimNode_Inertialization.h`)

实现 GDC 2018 中 David Bollo 提出的 "Inertialization: High-Performance Animation Transitions" 技术。

**三态状态机**：

```
Inactive ──(收到请求)──→ Pending ──(下一帧)──→ Active ──(时间到)──→ Inactive
```

**工作原理**：

1. **Pending**：收到惯性混合请求，准备捕获姿态快照
2. **Active**：
   - 计算当前姿态与上一帧姿态之间的差异（位移/旋转/缩放的速度和方向）
   - 每帧将差异衰减后应用到输出姿态
   - `ApplyTo()` 将外推的姿态差异叠加到新动画的姿态上
3. 当 `ElapsedTime >= MaxDuration`，回到 Inactive

**存储的差异数据**：

```cpp
// 每骨骼差异
TArray<FVector3f> BoneTranslationDiffDirection;   // 位移方向
TArray<float>      BoneTranslationDiffMagnitude;   // 位移大小
TArray<float>      BoneTranslationDiffSpeed;       // 位移速度
TArray<FVector3f> BoneRotationDiffAxis;            // 旋转轴
TArray<float>      BoneRotationDiffAngle;          // 旋转角度
TArray<float>      BoneRotationDiffSpeed;          // 旋转速度
TArray<FVector3f> BoneScaleDiffAxis;               // 缩放轴
TArray<float>      BoneScaleDiffMagnitude;         // 缩放大小
TArray<float>      BoneScaleDiffSpeed;             // 缩放速度

// 曲线差异
TBaseBlendedCurve<..., FInertializationCurveDiffElement> CurveDiffs;
```

**请求机制**：

```cpp
// 直接调用
RequestInertialization(Duration, BlendProfile);

// 通过 IInertializationRequester 消息（从下游节点向上游请求）
// Slot 节点也可以通过 Montage 的惯性混合设置自动请求
```

**Deficit 追踪**：`InertializationDeficit` 用于追踪"姿态融化"问题——当惯性混合请求频繁发生时，通过 Deficit 机制减少混合的强度以避免姿态退化。

### 8.2 Dead Blending (`AnimNode_DeadBlending.h`)

Dead Blending 是惯性混合的替代方案（参考 https://theorangeduck.com/page/dead-blending）：

- 在过渡点对源动画进行**外推**（基于速度）
- 对外推结果应用**指数衰减**（通过 HalfLife 参数控制）
- 在外推动画和新动画之间执行标准 CrossFade

```cpp
struct FAnimNode_DeadBlending : public FAnimNode_Base
{
    FPoseLink Source;

    // 控制参数
    float ExtrapolationHalfLife;     // 外推半衰期（近似平均值）
    float ExtrapolationHalfLifeMin;  // 最小半衰期
    float ExtrapolationHalfLifeMax;  // 最大半衰期
};
```

### 8.3 两种技术的选择

| | Inertialization | Dead Blending |
|---|---|---|
| 原理 | 捕获姿态差异并衰减 | 外推动画并 CrossFade |
| 过渡期间 | 只评估目标状态 | 评估两个状态 |
| 性能 | 更轻量 | 需评估两个状态 |
| 适用场景 | 通用过渡 | 需要更多控制的过渡 |

状态机过渡可直接指定使用哪种逻辑类型（`ETransitionLogicType`）。

---

## 9. 链接动画图与动画层

### 9.1 FAnimNode_LinkedAnimGraph (`AnimNode_LinkedAnimGraph.h`)

动态链接到另一个 `UAnimInstance` 子类：

```cpp
struct FAnimNode_LinkedAnimGraph : public FAnimNode_CustomProperty
{
    TSubclassOf<UAnimInstance> InstanceClass;  // 链接的 AnimInstance 类型
    TArray<FPoseLink> InputPoses;              // 传递给子图的输入姿态
    TArray<FName> InputPoseNames;              // 输入姿态名称
    FAnimNode_Base* LinkedRoot;                // 链接图的根节点
    bool bReceiveNotifiesFromLinkedInstances;  // 是否接收链接实例的通知
    bool bPropagateNotifiesToLinkedInstances;  // 是否向链接实例传播通知
};
```

**核心操作**：

```cpp
SetAnimClass(InClass)        // 运行时切换链接的 AnimInstance 类型
DynamicLink(OwningInstance)  // 建立姿态链接
DynamicUnlink(OwningInstance) // 断开姿态链接
ReinitializeLinkedAnimInstance() // 重新初始化链接实例
```

**属性传播**：通过 `FAnimNode_CustomProperty` 的 `SourceProperties → DestProperties` 机制，将调用方 AnimInstance 的属性值复制到目标实例。

### 9.2 FAnimNode_LinkedAnimLayer (`AnimNode_LinkedAnimLayer.h`)

继承自 `FAnimNode_LinkedAnimGraph`，专门用于动画层：

```cpp
struct FAnimNode_LinkedAnimLayer : public FAnimNode_LinkedAnimGraph
{
    TSubclassOf<UAnimLayerInterface> Interface;  // 层接口类型
    FName Layer;                                  // 层名称
};
```

**层分组机制**：

- 同一 Group 的层节点**共享同一个链接实例**（状态共享）
- `NAME_None` 组的层节点各自拥有独立的链接实例
- 通过 `LinkAnimClassLayers(InClass)` 批量设置层的实现类

### 9.3 FAnimNode_LinkedInputPose (`AnimNode_LinkedInputPose.h`)

作为链接图的输入节点：

```cpp
struct FAnimNode_LinkedInputPose : public FAnimNode_Base
{
    FName Name;          // 输入名称
    FName Graph;         // 所属图名称
    FPoseLink InputPose; // 输入姿态链接

    // 当非动态链接时，使用缓存数据
    FCompactHeapPose CachedInputPose;
    FBlendedHeapCurve CachedInputCurve;
    FHeapAttributeContainer CachedAttributes;

    void DynamicLink(FAnimInstanceProxy*, FPoseLinkBase*, int32);  // 动态链接
    void DynamicUnlink();                                          // 断开链接
};
```

---

## 10. Cached Pose 系统

### 10.1 FAnimNode_SaveCachedPose (`AnimNode_SaveCachedPose.h`)

缓存一个姿态分支的计算结果，供多处复用：

```cpp
struct FAnimNode_SaveCachedPose : public FAnimNode_Base
{
    FPoseLink Pose;          // 要缓存的姿态分支
    FName CachePoseName;     // 缓存名称（编译器设置）
    float GlobalWeight;      // 全局权重

    // 多个 UseCachedPose 节点可能引用同一个 SaveCachedPose
    // 每个引用产生一个 CachedUpdateContext
    TArray<FCachedUpdateContext> CachedUpdateContexts;
};
```

**关键机制**：`PostGraphUpdate()` 在主图 Update 完成后执行。在多个引用中，只有权重最大的那一个会实际执行 Update，其他引用共享结果。

**跳过的 Update 通知**：当某个引用的 Update 被跳过时，通过 `FCachedPoseSkippedUpdateHandler` 消息通知，使得惯性混合等节点可以正确处理。

### 10.2 FAnimNode_UseCachedPose (`AnimNode_UseCachedPose.h`)

引用已缓存的姿态：

```cpp
struct FAnimNode_UseCachedPose : public FAnimNode_Base
{
    FPoseLink LinkToCachingNode;  // 链接到 SaveCachedPose 节点
    FName CachePoseName;          // 缓存名称（编译器设置）
};
```

**工作原理**：

- `Update_AnyThread`：将当前 Context 注册到对应的 `SaveCachedPose` 节点
- `Evaluate_AnyThread`：直接返回 `SaveCachedPose` 已计算的姿态

---

## 11. 同步系统

### 11.1 FAnimSync

`FAnimInstanceProxy` 持有 `UE::Anim::FAnimSync Sync` 成员。资产播放节点通过 `CreateTickRecordForNode()` 提交 `FAnimTickRecord` 到同步系统。

**同步方式**（`EAnimSyncMethod`）：

| 方式 | 说明 |
|------|------|
| `DoNotSync` | 不同步，独立播放 |
| `SyncWithLeader` | 跟随组内的 Leader |
| `MarkerBased` | 基于标记（Marker）同步 |

**同步组角色**（`EAnimGroupRole`）：

| 角色 | 说明 |
|------|------|
| `CanBeLeader` | 可以成为 Leader |
| `AlwaysFollower` | 始终跟随 |
| `AlwaysLeader` | 始终主导 |
| `TransitionFollower` | 过渡期间跟随 |

### 11.2 TickRecord 机制

所有资产播放器不直接 Tick 动画资产，而是创建 TickRecord 提交给同步系统。在 `UpdateAnimation()` 末尾统一 Tick：

```cpp
Sync.TickAssetPlayerInstances(*this, CurrentDeltaSeconds);
```

这样做的好处：同步系统可以在 Tick 之前协调所有播放器的同步关系（如 Marker 对齐）。

---

## 12. 曲线系统

### 12.1 曲线类型

```cpp
enum class EAnimCurveType : uint8
{
    AttributeCurve,   // 属性曲线（通用）
    MaterialCurve,    // 材质曲线
    MorphTargetCurve, // MorphTarget 曲线
    MaxAnimCurveType
};
```

### 12.2 曲线容器

| 类型 | 说明 |
|------|------|
| `FBlendedCurve` | 基于 `FBoneContainer` 的混合曲线 |
| `FBlendedHeapCurve` | 堆分配的混合曲线（不依赖 BoneContainer） |
| `TBaseBlendedCurve<Allocator, ElementType>` | 模板化的混合曲线基类 |

### 12.3 曲线数据流

```
动画资产（UAnimSequence/UBlendSpace）的曲线数据
  → 在 Evaluate 阶段被提取到 FBlendedCurve
  → 在 PostEvaluate 阶段推送到组件
       ├─ MorphTarget 权重 → SkeletalMeshComponent
       └─ Material 参数 → 材质实例
```

### 12.4 曲线压缩

支持多种压缩编码：

- `AnimCurveCompressionCodec_CompressedRichCurve` — 压缩富曲线
- `AnimCurveCompressionCodec_UniformIndexable` — 均匀可索引
- `AnimCurveCompressionCodec_UniformlySampled` — 均匀采样

---

## 13. 多线程与 URO

### 13.1 多线程动画更新

```cpp
// AnimInstance.h:376
uint8 bUseMultiThreadedAnimationUpdate : 1;
```

**节点级线程安全声明**：

- `CanUpdateInWorkerThread()` — 返回 true 则该节点可在线程池执行（默认 true）
- `HasPreUpdate()` — 返回 true 则 `PreUpdate()` 在游戏线程执行，收集非线程安全数据
- 如果图中**任一节点**返回 `CanUpdateInWorkerThread() == false`，则**所有节点**都在游戏线程更新

**Proxy 的线程安全设计**：

- `FAnimInstanceProxy` 是纯 C++ 结构体，无 UObject 线程限制
- `GetProxyOnGameThread<T>()` — 游戏线程访问（阻塞等待并行任务完成）
- `GetProxyOnAnyThread<T>()` — 任意线程访问
- 双缓冲权重数组确保读写分离

### 13.2 URO (Update Rate Optimization)

`FAnimInstanceProxy` 中记录 URO 跳过的帧数：

```cpp
int16 NumUroSkippedFrames_Update;
int16 NumUroSkippedFrames_Eval;
```

当 URO 跳过帧时：
- Update 可能仍执行（保持状态更新）
- Evaluate 可能被跳过（使用插值结果）
- `OnUROSkipTickAnimation()` 在跳过时回调
- `OnUROPreInterpolation_AnyThread()` 在插值前回调

---

## 14. LOD 系统

### 14.1 LOD 级别

```cpp
// AnimInstance.h:1431
virtual int32 GetLODLevel() const;
```

默认从 `SkeletalMeshComponent` 的 `PredictedLODLevel` 获取。

### 14.2 节点级 LOD 控制

```cpp
// AnimNodeBase.h:1041
virtual int32 GetLODThreshold() const { return INDEX_NONE; }
bool IsLODEnabled(FAnimInstanceProxy* AnimInstanceProxy);
```

- 返回 `INDEX_NONE` 表示在所有 LOD 都启用
- 返回具体值表示仅在 `CurrentLOD <= Threshold` 时启用
- `IsLODEnabled()` 在节点内部用于判断是否应执行

### 14.3 LOD 切换处理

```
OnPreUpdateLODChanged(PreviousLODIndex, NewLODIndex)
  ├─ 检查哪些 PreUpdate 节点需要启用/禁用
  ├─ 将禁用的节点移到 LODDisabledGameThreadPreUpdateNodes
  └─ 触发 CacheBones（因为 RequiredBones 可能改变）
```

### 14.4 FBoneContainer

`FAnimInstanceProxy::RequiredBones` 是 `TSharedPtr<FBoneContainer>`，由当前 LOD 决定包含哪些骨骼。LOD 切换时 `RecalcRequiredBones()` 重建此容器。

---

## 15. 消息系统与节点间通信

### 15.1 FMessageStack

`FAnimationUpdateSharedContext::MessageStack`（`AnimNodeBase.h:144`）提供节点间的作用域消息传递，是替代旧 `FAnimNodeTracker` 的现代方案。

### 15.2 消息类型

| 消息接口 | 用途 |
|----------|------|
| `IGraphMessage` | 消息基类 |
| `IInertializationRequester` | 惯性混合请求 |
| `FCachedPoseSkippedUpdateHandler` | 缓存姿态跳过更新的通知 |

### 15.3 使用方式

```cpp
// 发布消息（在 Update 中，使用 Scoped 消息自动管理生命周期）
{
    UE::Anim::TScopedGraphMessage<MyMessageType> ScopedMessage(Context);
    ScopedMessage->SetData(...);
    // 下游节点可以获取此消息
    DownstreamPoseLink.Update(Context);
}

// 订阅消息（在下游节点中）
auto* Message = Context.GetMessage<MyMessageType>();
auto* Message = Context.FindMessage<MyMessageType>([](auto& Msg) { return Msg.SomeCondition; });
```

---

## 16. 通知系统

### 16.1 通知类型

| 类型 | 文件 | 说明 |
|------|------|------|
| `UAnimNotify` | `AnimNotify.h` | 一次性通知（瞬时触发） |
| `UAnimNotifyState` | `AnimNotifyState.h` | 持续通知（有 Begin/End） |
| `PlayMontageNotify` | 动态多播 | Montage 内的通知 |

### 16.2 通知处理流程

```
UpdateAnimation()
  └─ 资产播放器 Tick → 检测通知时间窗口
       └─ 将通知加入 FAnimNotifyQueue

PostUpdateAnimation()
  └─ TriggerAnimNotifies(DeltaSeconds)
       ├─ 处理队列中的 AnimNotify → 触发一次
       ├─ 更新 ActiveAnimNotifyState
       │    ├─ 新进入窗口的 → NotifyBegin
       │    ├─ 仍在窗口中的 → NotifyTick
       │    └─ 离开窗口的 → NotifyEnd
       └─ 触发 MontageNotify Begin/End
```

### 16.3 通知过滤

通知可以通过以下方式过滤：

- **LOD 阈值**：高 LOD 下可能跳过通知
- **Slot 相关性**：`IsSlotNodeRelevantForNotifies(SlotName)` 检查
- **实例权重**：`AddAnimNotifies(NewNotifies, InstanceWeight)` 中的权重过滤
- **链接实例传播**：`bReceiveNotifiesFromLinkedInstances` / `bPropagateNotifiesToLinkedInstances`

---

## 17. 完整执行流时序图

```
每帧 GameThread:

  ┌─ USkeletalMeshComponent::TickComponent()
  │
  ├─ UAnimInstance::UpdateAnimation(DeltaSeconds, bNeedsValidRootMotion)
  │
  │   ├─ [1] PreUpdateAnimation(DeltaSeconds)            ← GameThread
  │   │    ├─ PreUpdateLinkedInstances(DeltaSeconds)
  │   │    ├─ FAnimInstanceProxy::PreUpdate()
  │   │    │    ├─ 复制 ComponentTransform, ActorTransform
  │   │    │    ├─ OnPreUpdateLODChanged() — 处理LOD切换
  │   │    │    ├─ 执行 GameThreadPreUpdateNodes 的 PreUpdate()
  │   │    │    ├─ Montage_UpdateWeight(DeltaSeconds)
  │   │    │    ├─ 处理 SlotGroup 惯性混合请求
  │   │    │    ├─ Montage_Advance(DeltaSeconds)
  │   │    │    └─ UpdateMontageEvaluationData()
  │   │    └─ UpdateMontageSyncGroup()
  │   │
  │   ├─ [2] ParallelUpdateAnimation() 或 立即执行        ← WorkerThread 或 GameThread
  │   │    └─ FAnimInstanceProxy::UpdateAnimation()
  │   │         ├─ 创建 FAnimationUpdateSharedContext
  │   │         ├─ UpdateAnimationNode_WithRoot(Context, RootNode)
  │   │         │    ├─ UpdateCounter.Increment()
  │   │         │    ├─ InitialUpdate 函数调用
  │   │         │    ├─ BecomeRelevant 函数调用
  │   │         │    ├─ Update 函数调用
  │   │         │    ├─ RootNode->Update_AnyThread(Context)
  │   │         │    │    └─ Result.Update(Context)
  │   │         │    │         └─ ... (深度优先递归遍历整棵节点树)
  │   │         │    │              ├─ 权重逐层衰减
  │   │         │    │              ├─ DeltaTime 可被缩放
  │   │         │    │              └─ 消息沿 MessageStack 传递
  │   │         │    └─ PostGraphUpdate (SavedPose 队列)
  │   │         └─ Sync.TickAssetPlayerInstances()  ← 统一Tick同步组
  │   │
  │   └─ [3] PostUpdateAnimation()                       ← GameThread
  │        ├─ TriggerQueuedMontageEvents()
  │        │    ├─ MontageBlendingOut 事件
  │        │    ├─ MontageBlendedIn 事件
  │        │    ├─ MontageEnded 事件
  │        │    └─ MontageSectionChanged 事件
  │        └─ TriggerAnimNotifies(DeltaSeconds)
  │             ├─ 触发队列中的一次性 AnimNotify
  │             ├─ 更新 ActiveAnimNotifyState (Begin/Tick/End)
  │             └─ 触发 MontageNotify Begin/End
  │
  ├─ (当需要姿态结果时)
  │
  ├─ [4] PreEvaluateAnimation()                          ← GameThread
  │
  ├─ [5] ParallelEvaluateAnimation(bForceRefPose, Mesh, OutData) ← WorkerThread
  │    └─ FAnimInstanceProxy::EvaluateAnimation(Output)
  │         └─ EvaluateAnimation_WithRoot(Output, RootNode)
  │              └─ EvaluateAnimationNode(Output)
  │                   └─ RootNode->Evaluate_AnyThread(Output)
  │                        └─ Result.Evaluate(Output)
  │                             └─ ... (深度优先递归评估)
  │                                  ├─ 局部空间节点: Evaluate_AnyThread(FPoseContext)
  │                                  └─ 组件空间节点: EvaluateComponentSpace_AnyThread(...)
  │
  └─ [6] PostEvaluateAnimation()                         ← GameThread
       ├─ NativePostEvaluateAnimation()
       ├─ BlueprintPostEvaluateAnimation()
       └─ UpdateCurvesPostEvaluation()
            ├─ 推送 MorphTarget 权重
            └─ 推送 Material 参数
```

---

## 18. 设计精髓总结

### 18.1 Proxy 模式实现线程安全

`FAnimInstanceProxy` 将动画执行从 `UObject` 中解耦。`UAnimInstance` 处理游戏线程逻辑（Montage、Notify、蓝图事件），`FAnimInstanceProxy` 处理可并行的计算密集任务（Update、Evaluate）。两者之间的数据通过 `PreUpdate()` 和 `PostUpdate()` 同步。

### 18.2 Context 传播模型

`FAnimationUpdateContext` 携带 DeltaTime、累积权重、消息栈，在图的深度优先遍历中逐级传递和衰减。每个节点可以：
- 衰减子节点的权重（`FractionalWeight`）
- 独立控制 RootMotion 权重
- 缩放子节点的时间流逝
- 标记分支为 inactive

### 18.3 双缓冲设计

以下数据采用双缓冲（`[0]` 和 `[1]`），读写分离：
- `StateWeightArrays[2]` — 状态权重
- `MachineWeightArrays[2]` — 状态机权重
- `SlotWeightTracker[2]` — Slot 权重追踪
- 通过 `BufferWriteIndex` 和 `GetBufferReadIndex()` 切换

### 18.4 FPoseLink 间接链接

节点不直接持有子节点指针，而是通过 `FPoseLink` 间接链接。蓝图编译器可以在编译时重组图结构，节点只需关心输入输出。运行时通过 `LinkID` 重新建立指针链接。

### 18.5 分离 Update 和 Evaluate

- **Update**：处理状态更新、权重计算、过渡逻辑、Montage 推进
- **Evaluate**：纯粹的姿态生成（从动画资产采样并混合）

这种分离使得：
- 多线程调度更灵活（Update 和 Evaluate 可在不同线程执行）
- 支持 URO（可以 Update 但不 Evaluate，使用插值）
- 状态机可以在 Update 中切换状态而不影响当帧的 Evaluate

### 18.6 消息栈通信

`FMessageStack` 提供解耦的节点间通信方式（替代旧的 `FAnimNodeTracker`）。使用 RAII 作用域消息，自动管理生命周期。下游节点通过类型查询获取上游发布的消息。

### 18.7 资产与运行时分离

- **烘焙（Bake）**：状态机在编译时被"烘焙"为 `FBakedAnimationStateMachine` 等不可变数据结构
- **常量折叠（Constant Folding）**：`FAnimNode_SequencePlayer` 支持将不变属性折叠到稀疏类数据中，减少实例内存
- **AnimNodeData**：节点常量数据通过 `FAnimNodeData` 系统管理，支持稀疏类数据覆盖

### 18.8 模块化节点设计

所有节点继承自 `FAnimNode_Base`，通过虚函数接口参与图的遍历。新节点只需实现：
- `Update_AnyThread` — 更新逻辑
- `Evaluate_AnyThread` 或 `EvaluateComponentSpace_AnyThread` — 评估逻辑
- 可选：`HasPreUpdate/PreUpdate`、`NeedsDynamicReset/ResetDynamics` 等

节点通过 `FPoseLink` 连接，形成有向无环图（DAG）。`FPoseLink` 的 `Update/Evaluate` 调用自动处理递归遍历。
