# 虚幻引擎动画系统源码解析与执行流分析

> 基于 `Engine/Source/Runtime/Engine/Classes/Animation` 目录源码的深度分析

---

## 目录

- [1. 整体架构概览](#1-整体架构概览)
- [2. 核心类详解](#2-核心类详解)
  - [2.1 FAnimNode_Base — 动画节点基类](#21-fanimnode_base--动画节点基类)
  - [2.2 上下文体系](#22-上下文体系)
  - [2.3 FPoseLink — 节点连接管道](#23-fposelink--节点连接管道)
  - [2.4 FAnimNode_Root — 动画树根节点](#24-fanimnode_root--动画树根节点)
  - [2.5 UAnimInstance — 动画实例](#25-uaniminstance--动画实例)
  - [2.6 FAnimInstanceProxy — 动画代理](#26-faniminstanceproxy--动画代理)
  - [2.7 UAnimBlueprintGeneratedClass — 编译产物](#27-uanimblueprintgeneratedclass--编译产物)
  - [2.8 IAnimClassInterface — 动画类接口](#28-ianimclassinterface--动画类接口)
- [3. 动画节点子系统](#3-动画节点子系统)
  - [3.1 资产播放器体系](#31-资产播放器体系)
  - [3.2 状态机](#32-状态机)
  - [3.3 混合空间](#33-混合空间)
  - [3.4 蒙太奇系统](#34-蒙太奇系统)
  - [3.5 通知系统](#35-通知系统)
  - [3.6 惯性化节点](#36-惯性化节点)
  - [3.7 缓存姿态节点](#37-缓存姿态节点)
  - [3.8 链接动画图与动画层](#38-链接动画图与动画层)
- [4. 完整帧执行流](#4-完整帧执行流)
  - [4.1 初始化阶段](#41-初始化阶段)
  - [4.2 更新阶段](#42-更新阶段)
  - [4.3 求值阶段](#43-求值阶段)
  - [4.4 后处理阶段](#44-后处理阶段)
  - [4.5 反初始化阶段](#45-反初始化阶段)
- [5. 关键数据流](#5-关键数据流)
- [6. 线程模型](#6-线程模型)
- [7. 关键设计模式](#7-关键设计模式)
- [8. 源码文件索引](#8-源码文件索引)

---

## 1. 整体架构概览

虚幻引擎动画系统采用 **代理模式 + 节点图** 架构，核心分为以下层次：

```
┌──────────────────────────────────────────────────────┐
│           USkeletalMeshComponent                     │  骨骼网格组件（驱动入口）
├──────────────────────────────────────────────────────┤
│              UAnimInstance                           │  动画实例（游戏线程侧）
├──────────────────────────────────────────────────────┤
│           FAnimInstanceProxy                         │  动画代理（可工作线程侧）
├──────────────────────────────────────────────────────┤
│         FAnimNode_Root (动画树根节点)                  │
│              ↓ FPoseLink                             │
│    ┌─────────────────────────────────┐               │
│    │     动画节点图 (Anim Graph)      │               │  动画节点树
│    │  StateMachine / BlendSpace      │               │
│    │  SequencePlayer / Montage Slot  │               │
│    │  Inertialization / CachedPose   │               │
│    └─────────────────────────────────┘               │
├──────────────────────────────────────────────────────┤
│      UAnimBlueprintGeneratedClass                    │  编译产物（节点属性/状态机烘焙数据）
└──────────────────────────────────────────────────────┘
```

**核心设计理念**：

- **节点图求值模型**：动画蓝图编译为一棵由 `FAnimNode_Base` 派生节点组成的树，运行时从 Root 节点递归遍历
- **游戏线程/工作线程分离**：`UAnimInstance` 负责游戏线程逻辑（蒙太奇控制、通知分发），`FAnimInstanceProxy` 负责节点图更新和求值（可在工作线程执行）
- **五阶段生命周期**：Initialize → CacheBones → Update → Evaluate → PostUpdate

---

## 2. 核心类详解

### 2.1 FAnimNode_Base — 动画节点基类

**源码位置**：`Animation/AnimNodeBase.h`

这是所有运行时动画节点的基类，定义了动画树的五阶段生命周期接口：

```cpp
USTRUCT()
struct FAnimNode_Base
{
    // 五阶段生命周期方法（均可在工作线程调用）
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context);
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context);
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context);
    virtual void Evaluate_AnyThread(FPoseContext& Output);
    virtual void EvaluateComponentSpace_AnyThread(FComponentSpacePoseContext& Output);

    // 调试
    virtual void GatherDebugData(FNodeDebugData& DebugData);

    // 线程控制
    virtual bool CanUpdateInWorkerThread() const { return true; }
    virtual bool HasPreUpdate() const { return false; }
    virtual void PreUpdate(const UAnimInstance* InAnimInstance) {}

    // 动态重置（传送/时间跳跃）
    virtual bool NeedsDynamicReset() const { return false; }
    virtual void ResetDynamics(ETeleportType InTeleportType);

    // 编译后回调
    virtual void PostCompile(const USkeleton* InSkeleton) {}

    // 节点数据访问
    int32 GetNodeIndex() const;
    const IAnimClassInterface* GetAnimClassInterface() const;

protected:
    // 常量/折叠数据访问（通过 GET_ANIM_NODE_DATA 宏使用）
    template<typename DataType>
    const DataType& GetData(UE::Anim::FNodeDataId InId, const UObject* InObject = nullptr) const;

    // 实例/可变数据访问（通过 GET_INSTANCE_ANIM_NODE_DATA_PTR 宏使用）
    template<typename DataType>
    DataType* GetInstanceDataPtr(UE::Anim::FNodeDataId InId, UObject* InObject = nullptr);

    const FAnimNodeData* NodeData = nullptr;  // 节点常量/折叠数据引用
};
```

**关键设计要点**：

| 特性 | 说明 |
|------|------|
| `_AnyThread` 后缀 | 表示这些方法可在工作线程上执行，必须保证线程安全 |
| `CanUpdateInWorkerThread()` | 若任一节点返回 false，则整棵树在游戏线程更新 |
| `HasPreUpdate()` / `PreUpdate()` | 在工作线程 Update 前于游戏线程收集非线程安全数据 |
| `NeedsDynamicReset()` / `ResetDynamics()` | 处理传送、时间跳跃等需要重置模拟状态的情况 |
| `NodeData` | 指向编译期折叠的常量数据，减少实例内存开销 |

### 2.2 上下文体系

**源码位置**：`Animation/AnimNodeBase.h` (L158-L631)

上下文对象在节点树遍历时传递，携带当前阶段的必要信息：

```
FAnimationBaseContext (基类)
  │
  ├── FAnimInstanceProxy* AnimInstanceProxy    // 动画代理指针
  ├── FAnimationUpdateSharedContext* SharedContext  // 共享上下文（消息栈）
  ├── int32 CurrentNodeId                      // 当前节点ID
  ├── int32 PreviousNodeId                     // 前一节点ID
  └── bool bIsActive                           // 当前分支是否活跃
      │
      ├── FAnimationInitializeContext          // Initialize 阶段
      ├── FAnimationCacheBonesContext          // CacheBones 阶段
      │
      ├── FAnimationUpdateContext              // Update 阶段
      │   ├── float CurrentWeight             // 当前混合权重
      │   ├── float RootMotionWeightModifier  // 根运动权重修正
      │   └── float DeltaTime                 // 帧间隔时间
      │
      ├── FPoseContext                         // Evaluate 阶段（局部空间）
      │   ├── FCompactPose Pose               // 骨骼姿态
      │   ├── FBlendedCurve Curve             // 动画曲线
      │   └── FStackAttributeContainer CustomAttributes  // 自定义属性
      │
      └── FComponentSpacePoseContext          // Evaluate 阶段（组件空间）
          ├── FCSPose<FCompactPose> Pose      // 组件空间姿态
          ├── FBlendedCurve Curve
          └── FStackAttributeContainer CustomAttributes
```

**FAnimationUpdateContext 的权重传播机制**：

```cpp
// 混合节点在调用子节点时，通过 FractionalWeight 修改权重上下文
FAnimationUpdateContext ChildContext = Context.FractionalWeight(BlendWeight);
// ChildContext.CurrentWeight = Context.CurrentWeight * BlendWeight

// 同时可修改时间缩放（用于混合中的时间控制）
FAnimationUpdateContext ChildContext = Context.FractionalWeightAndTime(Weight, TimeScale);
// ChildContext.DeltaTime = Context.DeltaTime * TimeScale
```

**FAnimationUpdateSharedContext**：

```cpp
struct FAnimationUpdateSharedContext
{
    UE::Anim::FMessageStack MessageStack;  // 消息栈，用于节点间通信
    // 例如：惯性化请求通过消息栈从子节点传递到 Inertialization 节点
};
```

**FAnimExecutionContext**：

源码位置：`Animation/AnimExecutionContext.h`

这是将内部上下文暴露给蓝图函数库的包装层，支持在蓝图中访问动画上下文：

```cpp
USTRUCT(BlueprintType)
struct FAnimExecutionContext
{
    // 内部数据，弱引用
    struct FData
    {
        FAnimationBaseContext* Context;
        EContextType ContextType;  // None/Base/Initialize/Update/Pose/ComponentSpacePose
    };

    TWeakPtr<FData> Data;

    // 类型转换
    template<typename OtherContextType>
    static OtherContextType ConvertToType(const FAnimExecutionContext& InContext, ...);
};

// 派生的蓝图可见上下文类型
struct FAnimInitializationContext : public FAnimExecutionContext { ... };
struct FAnimUpdateContext : public FAnimExecutionContext { ... };
struct FAnimPoseContext : public FAnimExecutionContext { ... };
struct FAnimComponentSpacePoseContext : public FAnimExecutionContext { ... };
```

### 2.3 FPoseLink — 节点连接管道

**源码位置**：`Animation/AnimNodeBase.h` (L748-L843)

`FPoseLink` 和 `FComponentSpacePoseLink` 是动画节点之间的连接管道，它们在编译期通过 `LinkID` 标识连接关系，运行时解析为实际节点指针：

```cpp
USTRUCT(BlueprintInternalUseOnly)
struct FPoseLinkBase
{
protected:
    FAnimNode_Base* LinkedNode;   // 运行时节点指针（非序列化）
public:
    int32 LinkID;                 // 编译期序列化的链接ID
    int32 SourceLinkID;           // 编辑器调试用

    // 生命周期转发
    void Initialize(const FAnimationInitializeContext& Context);
    void CacheBones(const FAnimationCacheBonesContext& Context);
    void Update(const FAnimationUpdateContext& Context);
    void GatherDebugData(FNodeDebugData& DebugData);

    // 链接管理
    void AttemptRelink(const FAnimationBaseContext& Context);
    void SetLinkNode(FAnimNode_Base* NewLinkNode);
    void SetDynamicLinkNode(FPoseLinkBase* InPoseLink);
};

// 局部空间 Pose 连接
struct FPoseLink : public FPoseLinkBase
{
    void Evaluate(FPoseContext& Output);
};

// 组件空间 Pose 连接
struct FComponentSpacePoseLink : public FPoseLinkBase
{
    void EvaluateComponentSpace(FComponentSpacePoseContext& Output);
};
```

**连接解析过程**：

1. 编译期：AnimBlueprint 编译器为每个节点连接分配 `LinkID`
2. 运行时初始化：`AttemptRelink()` 通过 `IAnimClassInterface::GetAnimNodeProperties()` 将 `LinkID` 解析为 `LinkedNode` 指针
3. 遍历时：调用 `FPoseLink::Evaluate()` 会转发到 `LinkedNode->Evaluate_AnyThread()`

### 2.4 FAnimNode_Root — 动画树根节点

**源码位置**：`Animation/AnimNode_Root.h`

```cpp
USTRUCT(BlueprintInternalUseOnly)
struct FAnimNode_Root : public FAnimNode_Base
{
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category=Links)
    FPoseLink Result;   // 连接到动画图的最终输出

#if WITH_EDITORONLY_DATA
    FName Name;         // 根节点名称（标识图输出）
    FName LayerGroup;   // 层组名称（用于 Linked Anim Layer）
#endif

    // 生命周期实现
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context) override;
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context) override;
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context) override;
    virtual void Evaluate_AnyThread(FPoseContext& Output) override;
};
```

根节点是动画树的**汇点（Sink）**，Update/Evaluate 从 Root 开始，通过 `Result` 递归遍历整棵树。每个动画图有一个 Root 节点，其 `Name` 标识图的输出名称，`LayerGroup` 用于链接动画层的分组。

### 2.5 UAnimInstance — 动画实例

**源码位置**：`Animation/AnimInstance.h`

`UAnimInstance` 是动画系统的游戏线程侧管理器，核心职责包括生命周期管理、蒙太奇控制、通知分发、根运动提取等：

```cpp
UCLASS(transient, Blueprintable, Within=SkeletalMeshComponent)
class UAnimInstance : public UObject
{
    // ===== 生命周期 =====
    void InitializeAnimation(bool bInDeferRootNodeInitialization = false);
    void UpdateAnimation(float DeltaSeconds, bool bNeedsValidRootMotion, EUpdateAnimationFlag UpdateFlag);
    void PostUpdateAnimation();
    void PreEvaluateAnimation();
    void ParallelEvaluateAnimation(bool bForceRefPose, const USkeletalMesh* InSkeletalMesh, FParallelEvaluationData& OutAnimationPoseData);
    void PostEvaluateAnimation();
    void UninitializeAnimation();

    // ===== 原生重写点 =====
    virtual void NativeInitializeAnimation();
    virtual void NativeUpdateAnimation(float DeltaSeconds);
    virtual void NativeThreadSafeUpdateAnimation(float DeltaSeconds);
    virtual void NativePostEvaluateAnimation();
    virtual void NativeUninitializeAnimation();
    virtual void NativeBeginPlay();

    // ===== 蓝图事件 =====
    // BlueprintInitializeAnimation()
    // BlueprintUpdateAnimation(float DeltaTimeX)
    // BlueprintPostEvaluateAnimation()
    // BlueprintBeginPlay()
    // BlueprintThreadSafeUpdateAnimation(float DeltaTime)

    // ===== 蒙太奇系统 =====
    float Montage_Play(UAnimMontage* MontageToPlay, float InPlayRate = 1.f, ...);
    void Montage_Stop(float InBlendOutTime, const UAnimMontage* Montage = NULL);
    void Montage_Pause(const UAnimMontage* Montage = NULL);
    void Montage_Resume(const UAnimMontage* Montage);
    void Montage_JumpToSection(FName SectionName, const UAnimMontage* Montage = NULL);
    void Montage_SetNextSection(FName SectionNameToChange, FName NextSection, ...);
    void Montage_SetPlayRate(const UAnimMontage* Montage, float NewPlayRate);
    bool Montage_IsActive(const UAnimMontage* Montage) const;
    bool Montage_IsPlaying(const UAnimMontage* Montage) const;
    FName Montage_GetCurrentSection(const UAnimMontage* Montage = NULL) const;
    float Montage_GetPosition(const UAnimMontage* Montage) const;

    // ===== 蒙太奇委托 =====
    FOnMontageBlendingOutStartedMCDelegate OnMontageBlendingOut;
    FOnMontageBlendedInEndedMCDelegate OnMontageBlendedIn;
    FOnMontageStartedMCDelegate OnMontageStarted;
    FOnMontageEndedMCDelegate OnMontageEnded;
    FOnMontageSectionChangedMCDelegate OnMontageSectionChanged;

    // ===== 链接动画图/层 =====
    void LinkAnimGraphByTag(FName InTag, TSubclassOf<UAnimInstance> InClass);
    void LinkAnimClassLayers(TSubclassOf<UAnimInstance> InClass);
    UAnimInstance* GetLinkedAnimGraphInstanceByTag(FName InTag) const;
    UAnimInstance* GetLinkedAnimLayerInstanceByGroup(FName InGroup) const;

    // ===== 通知系统 =====
    FAnimNotifyQueue NotifyQueue;
    TArray<FAnimNotifyEvent> ActiveAnimNotifyState;
    void TriggerAnimNotifies(float DeltaSeconds);
    void DispatchQueuedAnimEvents();

    // ===== 根运动 =====
    FRootMotionMovementParams ConsumeExtractedRootMotion(float Alpha);
    void QueueRootMotionBlend(const FTransform& RootTransform, const FName& SlotName, float Weight);

    // ===== 动画曲线 =====
    float GetCurveValue(FName CurveName) const;
    void OverrideCurveValue(FName CurveName, float Value);
    void SetMorphTarget(FName MorphTargetName, float Value);

    // ===== 状态机查询 =====
    FName GetCurrentStateName(int32 MachineIndex);
    float GetInstanceAssetPlayerLength(int32 AssetPlayerIndex);
    float GetInstanceAssetPlayerTime(int32 AssetPlayerIndex);
    float GetInstanceStateWeight(int32 MachineIndex, int32 StateIndex);

    // ===== 同步组 =====
    bool GetTimeToClosestMarker(FName SyncGroup, FName MarkerName, float& OutMarkerTime) const;
    FMarkerSyncAnimPosition GetSyncGroupPosition(FName InSyncGroupName) const;

    // ===== 转换请求 =====
    bool RequestTransitionEvent(const FName EventName, const double RequestTimeout, ...);
    void ClearTransitionEvents(const FName EventName);

    // ===== 代理对象 =====
    mutable FAnimInstanceProxy* AnimInstanceProxy;

    // ===== 蒙太奇实例 =====
    TArray<FAnimMontageInstance*> MontageInstances;
    TMap<UAnimMontage*, FAnimMontageInstance*> ActiveMontagesMap;

    // ===== 配置 =====
    TEnumAsByte<ERootMotionMode::Type> RootMotionMode;
    uint8 bUseMultiThreadedAnimationUpdate : 1;
    uint8 bReceiveNotifiesFromLinkedInstances : 1;
    uint8 bPropagateNotifiesToLinkedInstances : 1;
};
```

**根运动模式**（`ERootMotionMode`）：

| 模式 | 说明 |
|------|------|
| `NoRootMotionExtraction` | 不提取根运动，保留在动画中 |
| `IgnoreRootMotion` | 提取但不应用根运动 |
| `RootMotionFromEverything` | 从所有动画提取根运动（不适合多人游戏） |
| `RootMotionFromMontagesOnly` | 仅从蒙太奇提取根运动（适合多人游戏） |

### 2.6 FAnimInstanceProxy — 动画代理

**源码位置**：`Public/Animation/AnimInstanceProxy.h`

`FAnimInstanceProxy` 是动画系统的工作线程侧执行器，持有动画树的运行时状态，负责节点图的更新和求值：

```cpp
struct FAnimInstanceProxy
{
    // ===== 生命周期 =====
    virtual void Initialize(UAnimInstance* InAnimInstance);
    virtual void Uninitialize(UAnimInstance* InAnimInstance);
    virtual void PreUpdate(UAnimInstance* InAnimInstance, float DeltaSeconds);
    virtual void PostUpdate(UAnimInstance* InAnimInstance) const;
    virtual void PreEvaluateAnimation(UAnimInstance* InAnimInstance);
    virtual void PostEvaluate(UAnimInstance* InAnimInstance);

    // ===== 更新 =====
    virtual void Update(float DeltaSeconds) {}  // 扩展点
    virtual void UpdateAnimationNode(const FAnimationUpdateContext& InContext);
    virtual void UpdateAnimationNode_WithRoot(const FAnimationUpdateContext& InContext,
                                               FAnimNode_Base* InRootNode, FName InLayerName);
    void UpdateAnimation();
    void UpdateAnimation_WithRoot(const FAnimationUpdateContext& InContext,
                                   FAnimNode_Base* InRootNode, FName InLayerName);

    // ===== 求值 =====
    virtual bool Evaluate(FPoseContext& Output) { return false; }  // 扩展点
    virtual bool Evaluate_WithRoot(FPoseContext& Output, FAnimNode_Base* InRootNode);
    void EvaluateAnimation(FPoseContext& Output);
    void EvaluateAnimationNode(FPoseContext& Output);
    void EvaluateAnimationNode_WithRoot(FPoseContext& Output, FAnimNode_Base* InRootNode);

    // ===== 骨骼缓存 =====
    virtual void CacheBones();
    virtual void CacheBones_WithRoot(FAnimNode_Base* InRootNode);

    // ===== 对象管理 =====
    virtual void InitializeObjects(UAnimInstance* InAnimInstance);
    virtual void ClearObjects();

    // ===== Slot 节点 =====
    void ReinitializeSlotNodes();
    void ClearSlotNodeWeights();
    float GetSlotNodeGlobalWeight(const FName& SlotNodeName) const;
    float GetSlotMontageGlobalWeight(const FName& SlotNodeName) const;

    // ===== 同步组 =====
    int32 GetSyncGroupIndexFromName(FName SyncGroupName) const;
    bool GetTimeToClosestMarker(FName SyncGroup, FName MarkerName, float& OutMarkerTime) const;

    // ===== 骨骼容器 =====
    void RecalcRequiredBones(USkeletalMeshComponent* Component, UObject* Asset);
    void RecalcRequiredCurves(const UE::Anim::FCurveFilterSettings& CurveFilterSettings);

    // ===== 核心数据 =====
    FAnimNode_Root* RootNode;                    // 动画树根节点
    const FBakedAnimationStateMachine* MachineDescription;  // 状态机描述
    FBoneContainer RequiredBones;                // 所需骨骼容器
    FAnimSync Sync;                              // 同步组管理
    FGraphTraversalCounter UpdateCounter;        // 更新计数器
};
```

### 2.7 UAnimBlueprintGeneratedClass — 编译产物

**源码位置**：`Animation/AnimBlueprintGeneratedClass.h`

动画蓝图编译后生成的类，同时实现 `IAnimClassInterface` 接口，包含所有编译期确定的动画图结构信息：

```cpp
class UAnimBlueprintGeneratedClass : public UBlueprintGeneratedClass, public IAnimClassInterface
{
    // ===== 烘焙数据 =====
    UPROPERTY()
    TArray<FBakedAnimationStateMachine> BakedStateMachines;  // 烘焙的状态机

    UPROPERTY(AssetRegistrySearchable)
    USkeleton* TargetSkeleton;  // 目标骨架

    UPROPERTY()
    TArray<FAnimNotifyEvent> AnimNotifies;  // 动画通知列表

    UPROPERTY()
    TArray<FName> SyncGroupNames;  // 同步组名称

    // ===== 节点属性数组 =====
    TArray<FStructProperty*> AnimNodeProperties;              // 所有动画节点
    TArray<FStructProperty*> LinkedAnimGraphNodeProperties;   // 链接动画图节点
    TArray<FStructProperty*> LinkedAnimLayerNodeProperties;   // 链接动画层节点
    TArray<FStructProperty*> PreUpdateNodeProperties;         // 需要 PreUpdate 的节点
    TArray<FStructProperty*> DynamicResetNodeProperties;      // 需要动态重置的节点
    TArray<FStructProperty*> StateMachineNodeProperties;      // 状态机节点
    TArray<FStructProperty*> InitializationNodeProperties;    // 需要初始化的节点

    // ===== 缓存姿态 =====
    UPROPERTY()
    TMap<FName, FCachedPoseIndices> OrderedSavedPoseIndicesMap;  // 缓存姿态更新顺序

    // ===== 动画蓝图函数 =====
    TArray<FAnimBlueprintFunction> AnimBlueprintFunctions;

    // ===== 资产播放器信息 =====
    UPROPERTY()
    TMap<FName, FGraphAssetPlayerInformation> GraphAssetPlayerInformation;

    // ===== 图混合选项 =====
    UPROPERTY()
    TMap<FName, FAnimGraphBlendOptions> GraphBlendOptions;

    // ===== 节点数据（常量折叠） =====
    UPROPERTY()
    TArray<FAnimNodeData> AnimNodeData;  // 每个节点的常量/折叠数据

    UPROPERTY()
    TMap<TObjectPtr<const UScriptStruct>, FAnimNodeStructData> NodeTypeMap;

    // ===== IAnimClassInterface 实现 =====
    virtual const TArray<FBakedAnimationStateMachine>& GetBakedStateMachines() const override;
    virtual USkeleton* GetTargetSkeleton() const override;
    virtual const TArray<FAnimNotifyEvent>& GetAnimNotifies() const override;
    virtual const TArray<FStructProperty*>& GetAnimNodeProperties() const override;
    // ... 其他接口方法
};
```

**常量折叠机制**：

`AnimNodeData` 数组存储每个节点的常量/折叠数据。编译器分析哪些节点属性在所有实例中保持不变，将其折叠到类的稀疏数据（Sparse Class Data）中，而非每个实例都保存一份。运行时通过 `GET_ANIM_NODE_DATA` 宏访问：

```cpp
// 在动画节点中访问折叠数据
const float PlayRate = GET_ANIM_NODE_DATA(float, PlayRate);

// 访问实例级可变数据
float* MutablePlayRate = GET_INSTANCE_ANIM_NODE_DATA_PTR(float, PlayRate);
```

### 2.8 IAnimClassInterface — 动画类接口

**源码位置**：`Animation/AnimClassInterface.h`

`IAnimClassInterface` 是访问动画蓝图编译信息的统一接口，`UAnimBlueprintGeneratedClass` 实现了此接口：

```cpp
class IAnimClassInterface
{
    // ===== 烘焙数据访问 =====
    virtual const TArray<FBakedAnimationStateMachine>& GetBakedStateMachines() const = 0;
    virtual const TArray<FAnimNotifyEvent>& GetAnimNotifies() const = 0;
    virtual USkeleton* GetTargetSkeleton() const = 0;
    virtual const TArray<FName>& GetSyncGroupNames() const = 0;

    // ===== 节点属性访问 =====
    virtual const TArray<FStructProperty*>& GetAnimNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetLinkedAnimGraphNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetLinkedAnimLayerNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetPreUpdateNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetDynamicResetNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetStateMachineNodeProperties() const = 0;
    virtual const TArray<FStructProperty*>& GetInitializationNodeProperties() const = 0;

    // ===== 函数与缓存 =====
    virtual const TArray<FAnimBlueprintFunction>& GetAnimBlueprintFunctions() const = 0;
    virtual const TMap<FName, FCachedPoseIndices>& GetOrderedSavedPoseNodeIndicesMap() const = 0;
    virtual const TMap<FName, FGraphAssetPlayerInformation>& GetGraphAssetPlayerInformation() const = 0;
    virtual const TMap<FName, FAnimGraphBlendOptions>& GetGraphBlendOptions() const = 0;

    // ===== 子系统 =====
    virtual void ForEachSubsystem(TFunctionRef<EAnimSubsystemEnumeration(const FAnimSubsystemContext&)> InFunction) const = 0;
    virtual void ForEachSubsystem(UObject* InObject, TFunctionRef<EAnimSubsystemEnumeration(const FAnimSubsystemInstanceContext&)> InFunction) const = 0;
    virtual const FAnimSubsystem* FindSubsystem(UScriptStruct* InSubsystemType) const = 0;

    // ===== 数据访问 =====
    virtual const void* GetConstantNodeValueRaw(int32 InIndex) const = 0;
    virtual const void* GetMutableNodeValueRaw(int32 InIndex, const UObject* InObject) const = 0;

    // ===== 工具方法 =====
    static IAnimClassInterface* GetFromClass(UClass* InClass);
    static const IAnimClassInterface* GetFromClass(const UClass* InClass);
    const IAnimClassInterface* GetRootClass() const;  // 获取根类（处理子类覆盖）
};
```

**FAnimBlueprintFunction** 描述动画蓝图的函数入口/出口：

```cpp
USTRUCT()
struct FAnimBlueprintFunction
{
    FName Name;                          // 函数名
    FName Group;                         // 所属组
    int32 OutputPoseNodeIndex;           // 输出节点索引
    TArray<FName> InputPoseNames;        // 输入 Pose 名称
    TArray<int32> InputPoseNodeIndices;  // 输入节点索引
    FStructProperty* OutputPoseNodeProperty;   // 输出节点属性
    TArray<FStructProperty*> InputPoseNodeProperties;  // 输入节点属性
    TArray<FInputPropertyData> InputPropertyData;  // 输入属性
    bool bImplemented;                   // 是否已实现
};
```

---

## 3. 动画节点子系统

### 3.1 资产播放器体系

**继承链**：

```
FAnimNode_Base
  └── FAnimNode_AssetPlayerRelevancyBase
        └── FAnimNode_AssetPlayerBase
              └── FAnimNode_SequencePlayerBase
                    ├── FAnimNode_SequencePlayer          (支持常量折叠)
                    └── FAnimNode_SequencePlayer_Standalone (独立实例)
```

**FAnimNode_AssetPlayerBase**（`Animation/AnimNode_AssetPlayerBase.h`）：

```cpp
struct FAnimNode_AssetPlayerBase : public FAnimNode_AssetPlayerRelevancyBase
{
    // Update 被标记为 final，确保始终处理 BlendWeight 缓存
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context) final override;

    // 子类实现此方法而非直接重写 Update
    virtual void UpdateAssetPlayer(const FAnimationUpdateContext& Context) {};

    // 创建 TickRecord（注册到 Proxy 的时间推进系统）
    void CreateTickRecordForNode(const FAnimationUpdateContext& Context,
                                  UAnimSequenceBase* Sequence,
                                  bool bLooping, float PlayRate, bool bIsEvaluator);

    // 同步组接口
    virtual FName GetGroupName() const { return NAME_None; }
    virtual EAnimGroupRole::Type GetGroupRole() const { return EAnimGroupRole::CanBeLeader; }
    virtual EAnimSyncMethod GetGroupMethod() const { return EAnimSyncMethod::DoNotSync; }

protected:
    FMarkerTickRecord MarkerTickRecord;  // 标记同步数据
    float BlendWeight = 0.0f;            // 缓存的混合权重
    float InternalTimeAccumulator = 0.0f; // 内部时间累加器
    FDeltaTimeRecord DeltaTimeRecord;     // 帧间隔记录
    bool bHasBeenFullWeight = false;      // 是否曾经达到全权重
};
```

**FAnimNode_SequencePlayer**（`Animation/AnimNode_SequencePlayer.h`）：

```cpp
struct FAnimNode_SequencePlayer : public FAnimNode_SequencePlayerBase
{
    // 核心属性
    TObjectPtr<UAnimSequenceBase> Sequence;  // 播放的动画序列

    // 播放控制（WITH_EDITORONLY_DATA 标记的属性可被常量折叠）
    float PlayRateBasis;                     // 播放率基准
    float PlayRate;                          // 播放率
    FInputScaleBiasClampConstants PlayRateScaleBiasClampConstants;  // 播放率缩放/偏移/钳制
    float StartPosition;                     // 起始位置
    bool bLoopAnimation;                     // 是否循环

    // 同步设置
    FName GroupName;                         // 同步组名
    EAnimGroupRole::Type GroupRole;          // 同步组角色
    EAnimSyncMethod Method;                  // 同步方法
    bool bOverridePositionWhenJoiningSyncGroupAsLeader;  // 作为领导者加入时是否覆盖位置

    // 相关性
    bool bIgnoreForRelevancyTest;            // 是否忽略相关性测试
};
```

**TickRecord 批处理机制**：

SequencePlayer 不直接推进时间，而是通过 `CreateTickRecordForNode()` 注册 `FAnimTickRecord` 到 `FAnimInstanceProxy`。Proxy 统一处理所有 TickRecord 的时间推进，这样可以：

1. 支持同步组：同组内的资产播放器按 Leader 的时间推进
2. 避免重复计算：多个节点引用同一资产时只推进一次
3. 处理标记同步：基于动画标记的精确同步

### 3.2 状态机

**源码位置**：`Animation/AnimNode_StateMachine.h`

```cpp
struct FAnimNode_StateMachine : public FAnimNode_Base
{
    // ===== 配置 =====
    int32 StateMachineIndexInClass;  // 在 BakedStateMachines 中的索引
    int32 MaxTransitionsPerFrame;    // 每帧最大转换数（默认3）
    int32 MaxTransitionsRequests;    // 最大缓冲转换请求数（默认32）
    bool bSkipFirstUpdateTransition; // 首次更新是否跳过转换
    bool bReinitializeOnBecomingRelevant;  // 重新变为相关时是否重新初始化
    bool bCreateNotifyMetaData;      // 是否创建通知元数据
    bool bAllowConduitEntryStates;   // 是否允许管道作为入口状态

    // ===== 运行时状态 =====
    int32 CurrentState;              // 当前状态索引
    float ElapsedTime;               // 当前状态已用时间
    const FBakedAnimationStateMachine* PRIVATE_MachineDescription;  // 状态机描述

    // ===== 转换系统 =====
    TArray<FAnimationActiveTransitionEntry> ActiveTransitionArray;  // 活跃转换栈
    TArray<FPoseLink> StatePoseLinks;      // 各状态的 Pose 连接
    TArray<int32> StatesUpdated;           // 本帧已更新的状态（防止重复更新）
    TArray<FTransitionEvent> QueuedTransitionEvents;  // 排队的转换请求

    // ===== 委托 =====
    TArray<FOnGraphStateChanged> OnGraphStatesEntered;  // 状态进入委托
    TArray<FOnGraphStateChanged> OnGraphStatesExited;   // 状态退出委托

    // ===== 核心方法 =====
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context) override;
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context) override;
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context) override;
    virtual void Evaluate_AnyThread(FPoseContext& Output) override;

    // 状态查询
    int32 GetCurrentState() const { return CurrentState; }
    float GetCurrentStateElapsedTime() const { return ElapsedTime; }
    FName GetCurrentStateName() const;
    float GetStateWeight(int32 StateIndex) const;

    // 状态转换
    void SetState(const FAnimationBaseContext& Context, int32 NewStateIndex, bool bAllowReEntry);
    void TransitionToState(const FAnimationUpdateContext& Context,
                           const FAnimationTransitionBetweenStates& TransitionInfo, ...);

    // 转换请求
    bool RequestTransitionEvent(const FTransitionEvent& InTransitionEvent);
    void ClearTransitionEvents(const FName EventName);
    bool QueryTransitionEvent(const int32 TransitionIndex, const FName EventName) const;
    bool QueryAndMarkTransitionEvent(const int32 TransitionIndex, const FName EventName);

protected:
    bool FindValidTransition(const FAnimationUpdateContext& Context,
                             const FBakedAnimationState& StateInfo,
                             FAnimationPotentialTransition& OutPotentialTransition,
                             TArray<int32, TInlineAllocator<4>>& OutVisitedStateIndices);

    void UpdateState(int32 StateIndex, const FAnimationUpdateContext& Context);
    const FPoseContext& EvaluateState(int32 StateIndex, const FPoseContext& Context);

    void EvaluateTransitionStandardBlend(FPoseContext& Output,
                                          FAnimationActiveTransitionEntry& Transition,
                                          bool bIntermediatePoseIsValid);
    void EvaluateTransitionCustomBlend(FPoseContext& Output,
                                        FAnimationActiveTransitionEntry& Transition,
                                        bool bIntermediatePoseIsValid);
};
```

**状态转换流程**：

```
Update_AnyThread()
  │
  ├── bFirstUpdate?
  │   └── 初始化到 Entry 状态，尝试执行初始转换
  │
  ├── FindValidTransition()
  │   ├── 遍历当前状态的所有转换规则
  │   ├── 评估转换条件
  │   │   ├── 自动绑定的转换规则（Blueprint/C++）
  │   │   ├── 排队的转换请求（RequestTransitionEvent）
  │   │   └── 管道（Conduit）状态递归检查
  │   └── 返回 FAnimationPotentialTransition（目标状态 + 混合时间）
  │
  ├── TransitionToState()
  │   ├── 创建 FAnimationActiveTransitionEntry
  │   │   ├── NextState / PreviousState
  │   │   ├── CrossfadeDuration / Alpha
  │   │   ├── BlendProfile / BlendOption
  │   │   └── CustomTransitionGraph
  │   ├── 触发状态退出/进入委托
  │   └── 添加到 ActiveTransitionArray
  │
  ├── UpdateTransitionStates()
  │   └── 更新转换中的源/目标状态
  │
  └── UpdateState(CurrentState)
      └── 更新当前状态的子图
```

**转换求值**：

```
Evaluate_AnyThread()
  │
  ├── 无活跃转换
  │   └── EvaluateState(CurrentState) → 直接输出当前状态 Pose
  │
  ├── 标准混合转换
  │   └── EvaluateTransitionStandardBlend()
  │       ├── EvaluateState(PreviousState) → PreviousPose
  │       ├── EvaluateState(NextState) → NextPose
  │       └── 按 Alpha 混合: Output = Lerp(PreviousPose, NextPose, Alpha)
  │
  └── 自定义混合转换
      └── EvaluateTransitionCustomBlend()
          └── 执行自定义转换图
```

**FAnimationActiveTransitionEntry** 关键字段：

```cpp
struct FAnimationActiveTransitionEntry
{
    float ElapsedTime;           // 转换已用时间
    float Alpha;                 // 转换 Alpha（0=源状态，1=目标状态）
    float CrossfadeDuration;     // 混合总时长
    int32 NextState;             // 目标状态
    int32 PreviousState;         // 源状态
    FPoseLink CustomTransitionGraph;  // 自定义转换图
    FAlphaBlend Blend;           // 混合曲线对象
    TObjectPtr<UBlendProfile> BlendProfile;  // 逐骨骼混合配置
    EAlphaBlendOption BlendOption;  // 混合曲线类型
    bool bActive;                // 是否活跃
};
```

### 3.3 混合空间

**源码位置**：`Animation/BlendSpace.h`

```cpp
class UBlendSpace : public UAnimationAsset, public IInterpolationIndexProvider
{
    // ===== 参数定义 =====
    FBlendParameter BlendParameters[3];  // 最多3个轴的混合参数
    FInterpolationParameter InterpolationParam[3];  // 输入平滑参数

    // ===== 采样数据 =====
    TArray<FBlendSample> SampleData;     // 采样点（动画 + 参数值）
    TArray<FEditorElement> GridSamples;  // 网格采样
    FBlendSpaceData BlendSpaceData;      // 运行时三角剖分/分段数据

    // ===== 混合控制 =====
    float TargetWeightInterpolationSpeedPerSec;  // 采样权重插值速度
    bool bTargetWeightInterpolationEaseInOut;    // 是否使用缓入缓出
    bool bAllowMeshSpaceBlending;                // 是否允许网格空间混合
    EBlendSpacePerBoneBlendMode PerBoneBlendMode;  // 逐骨骼混合模式
    TArray<FPerBoneInterpolation> PerBoneBlendValues;  // 逐骨骼混合值

    // ===== 动画设置 =====
    bool bLoop;                        // 是否循环
    bool bAllowMarkerBasedSync;        // 是否允许标记同步
    ENotifyTriggerMode::Type NotifyTriggerMode;  // 通知触发模式
    EBlendSpaceAxis AxisToScaleAnimation;  // 缩放动画速度的轴

    // ===== 核心方法 =====
    bool GetSamplesFromBlendInput(const FVector& BlendInput,
                                   TArray<FBlendSampleData>& OutSampleDataList,
                                   int32& InOutCachedTriangulationIndex,
                                   bool bCombineAnimations) const;
    bool UpdateBlendSamples(const FVector& InBlendSpacePosition, float InDeltaTime,
                             TArray<FBlendSampleData>& InOutSampleDataCache,
                             int32& InOutCachedTriangulationIndex) const;
    void GetAnimationPose(TArray<FBlendSampleData>& BlendSampleDataCache,
                           const FAnimExtractContext& ExtractionContext,
                           FAnimationPoseData& OutAnimationPoseData) const;
    FVector FilterInput(FBlendFilter* Filter, const FVector& BlendInput, float DeltaTime) const;
};
```

**BlendSpace 运行时求值流程**：

```
1. 输入参数处理
   ├── GetClampedAndWrappedBlendInput()  // 钳制/包裹输入
   └── FilterInput()  // 平滑滤波

2. 采样权重计算
   ├── GetSamplesFromBlendInput()
   │   ├── 1D: GetSamples1D() → 线性分段插值
   │   └── 2D: GetSamples2D() → 三角剖分插值
   └── 返回 FBlendSampleData[] (采样索引 + 权重)

3. 采样权重平滑
   └── UpdateBlendSamples()
       └── InterpolateWeightOfSampleData()  // 逐帧插值权重

4. 动画提取与混合
   └── GetAnimationPose()
       ├── 对每个采样提取动画 Pose
       ├── 按权重混合所有 Pose
       └── 可选：逐骨骼混合（使用 BlendProfile）
```

**FBlendSampleData** 结构：

```cpp
struct FBlendSampleData
{
    int32 SampleIndex;     // 采样索引
    float SampleWeight;    // 采样权重
    float Time;            // 当前时间位置
    float PreviousTime;    // 前一帧时间
    float PlayRate;        // 播放率
};
```

### 3.4 蒙太奇系统

**源码位置**：`Animation/AnimMontage.h`

蒙太奇是动画系统与游戏逻辑交互的核心桥梁，支持多段动画组合、Section 跳转、Slot 注入等。

**UAnimMontage** 资产结构：

```cpp
class UAnimMontage : public UAnimCompositeBase
{
    // ===== 混合设置 =====
    EMontageBlendMode BlendModeIn;   // 混入模式（Standard/Inertialization）
    EMontageBlendMode BlendModeOut;  // 混出模式
    FAlphaBlend BlendIn;             // 混入参数
    FAlphaBlend BlendOut;            // 混出参数
    float BlendOutTriggerTime;       // 混出触发时间
    bool bEnableAutoBlendOut;        // 是否自动混出
    TObjectPtr<UBlendProfile> BlendProfileIn;   // 混入混合配置
    TObjectPtr<UBlendProfile> BlendProfileOut;  // 混出混合配置

    // ===== Section 系统 =====
    TArray<FCompositeSection> CompositeSections;  // 组合段
    // 每个段: SectionName, NextSectionName, MetaData

    // ===== Slot 系统 =====
    TArray<FSlotAnimationTrack> SlotAnimTracks;  // Slot 动画轨道
    // 每个轨道: SlotName, AnimTrack

    // ===== 同步 =====
    FName SyncGroup;        // 同步组名
    int32 SyncSlotIndex;    // 同步 Slot 索引
    FMarkerSyncData MarkerData;  // 标记同步数据

    // ===== 分支点 =====
    TArray<FBranchingPointMarker> BranchingPointMarkers;  // 分支点标记
    TArray<int32> BranchingPointStateNotifyIndices;       // 分支点状态通知索引

    // ===== 时间拉伸 =====
    FTimeStretchCurve TimeStretchCurve;  // 时间拉伸曲线
    FName TimeStretchCurveName;          // 时间拉伸曲线名
};
```

**FAnimMontageInstance** 运行时实例：

```cpp
struct FAnimMontageInstance
{
    // ===== 核心状态 =====
    TObjectPtr<UAnimMontage> Montage;  // 蒙太奇资产引用
    bool bPlaying;                     // 是否正在播放
    float Position;                    // 当前播放位置
    float PlayRate;                    // 播放率
    FAlphaBlend Blend;                 // 混合状态
    float PreviousWeight;              // 前一帧权重
    float NotifyWeight;                // 通知权重

    // ===== 委托 =====
    FOnMontageEnded OnMontageEnded;
    FOnMontageBlendingOutStarted OnMontageBlendingOutStarted;
    FOnMontageBlendedInEnded OnMontageBlendedInEnded;
    FOnMontageSectionChanged OnMontageSectionChanged;

    // ===== 同步 =====
    FName SyncGroupName;               // 同步组名
    FMarkerTickRecord MarkerTickRecord;  // 标记 Tick 记录
    TArray<FPassedMarker> MarkersPassedThisTick;  // 本帧经过的标记

    // ===== 子步进器 =====
    FMontageSubStepper MontageSubStepper;  // 子步进器

    // ===== 根运动 =====
    int32 DisableRootMotionCount;      // 禁用根运动计数

    // ===== 蒙太奇间同步 =====
    TArray<FAnimMontageInstance*> MontageSyncFollowers;  // 跟随者
    FAnimMontageInstance* MontageSyncLeader;             // 领导者

    // ===== 核心方法 =====
    void Play(float InPlayRate = 1.f);
    void Play(float InPlayRate, const FMontageBlendSettings& BlendInSettings);
    void Stop(const FMontageBlendSettings& BlendOutSettings, bool bInterrupt = true);
    void Pause();
    void Advance(float DeltaTime, FRootMotionMovementParams* OutRootMotionParams, bool bBlendRootMotion);
    void UpdateWeight(float DeltaTime);
    FName GetCurrentSection() const;
    bool JumpToSectionName(FName const& SectionName, bool bEndOfSection = false);
    bool SetNextSectionName(FName const& SectionName, FName const& NewNextSectionName);
};
```

**蒙太奇每帧更新流程**：

```
1. UpdateWeight(DeltaTime)
   └── Blend.Update(DeltaTime)  // 更新 FAlphaBlend 的当前值

2. Advance(DeltaTime, OutRootMotionParams, bBlendRootMotion)
   ├── FMontageSubStepper 子步进
   │   ├── 在 Section 边界停止
   │   ├── 处理 NextSection 跳转/循环
   │   ├── 检查 BranchingPointMarker
   │   └── 处理 TimeStretchCurve
   ├── HandleEvents()
   │   ├── UpdateActiveStateBranchingPoints()  // 更新活跃状态通知
   │   └── BranchingPointEventHandler()        // 处理分支点事件
   └── 提取根运动
```

**蒙太奇与 Slot 节点的交互**：

蒙太奇通过 Slot 系统将动画数据注入到动画图中。Slot 节点在动画图中占位，当蒙太奇播放时，Slot 节点输出蒙太奇的动画数据；当没有蒙太奇播放时，Slot 节点输出其 Source 输入的动画数据。

### 3.5 通知系统

**源码位置**：`Animation/AnimNotifies/AnimNotify.h`, `Animation/AnimNotifies/AnimNotifyState.h`

```cpp
// 即时通知
class UAnimNotify : public UObject
{
    virtual void Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                        const FAnimNotifyEventReference& EventReference);
    virtual void BranchingPointNotify(FBranchingPointNotifyPayload& BranchingPointPayload);

    // 蓝图实现
    UFUNCTION(BlueprintImplementableEvent)
    bool Received_Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                          const FAnimNotifyEventReference& EventReference) const;

    bool bIsNativeBranchingPoint;  // 是否为原生分支点
};

// 持续通知（有时间范围）
class UAnimNotifyState : public UObject
{
    virtual void NotifyBegin(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                              float TotalDuration, const FAnimNotifyEventReference& EventReference);
    virtual void NotifyTick(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                             float FrameDeltaTime, const FAnimNotifyEventReference& EventReference);
    virtual void NotifyEnd(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation,
                            const FAnimNotifyEventReference& EventReference);
};
```

**通知触发流程**：

```
UAnimInstance::PostUpdateAnimation()
  └── TriggerAnimNotifies(DeltaSeconds)
      ├── 遍历 NotifyQueue 中的通知
      ├── UAnimNotify::Notify()
      │   └── Received_Notify()  // 蓝图事件
      ├── UAnimNotifyState::NotifyBegin()
      ├── UAnimNotifyState::NotifyTick()
      └── UAnimNotifyState::NotifyEnd()

UAnimInstance::DispatchQueuedAnimEvents()
  └── TriggerQueuedMontageEvents()
      ├── TriggerMontageBlendingOutEvent()
      ├── TriggerMontageBlendedInEvent()
      ├── TriggerMontageEndedEvent()
      └── TriggerMontageSectionChangedEvent()
```

**分支点（BranchingPoint）**：

标记为 BranchingPoint 的通知在蒙太奇 Advance 过程中精确触发，而非在 PostUpdate 中统一触发。这确保了通知在正确的时间点执行，即使在单帧内跨越了通知时间点。

### 3.6 惯性化节点

**源码位置**：`Animation/AnimNode_Inertialization.h`

惯性化是 UE 的高性能动画过渡技术（GDC 2018），替代传统的 Crossfade 混合：

```cpp
struct FAnimNode_Inertialization : public FAnimNode_Base
{
    FPoseLink Source;  // 源 Pose 输入

    // 配置
    TObjectPtr<UBlendProfile> DefaultBlendProfile;  // 默认混合配置
    TArray<FName> FilteredCurves;                   // 过滤的曲线（不惯性化）
    TArray<FBoneReference> FilteredBones;           // 过滤的骨骼（不惯性化）
    bool bResetOnBecomingRelevant;                  // 重新变为相关时重置
    bool bForwardRequestsThroughSkippedCachedPoseNodes;  // 转发请求到跳过的缓存节点
    FName Tag;                                       // 标签

    // 核心方法
    void RequestInertialization(float Duration, const UBlendProfile* BlendProfile);
    void RequestInertialization(const FInertializationRequest& InertializationRequest);

    // 生命周期
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context) override;
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context) override;
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context) override;
    virtual void Evaluate_AnyThread(FPoseContext& Output) override;

private:
    // 状态
    EInertializationState InertializationState;  // Inactive/Pending/Active
    float InertializationElapsedTime;            // 已过时间
    float InertializationDuration;               // 总持续时间
    float InertializationMaxDuration;            // 最大持续时间
    float InertializationDeficit;                // 亏损追踪

    // Pose 快照
    FInertializationSparsePose PrevPoseSnapshot;  // 前一帧快照
    FInertializationSparsePose CurrPoseSnapshot;  // 当前帧快照

    // 差值数据
    TArray<int32> BoneIndices;
    TArray<FVector3f> BoneTranslationDiffDirection;
    TArray<float> BoneTranslationDiffMagnitude;
    TArray<float> BoneTranslationDiffSpeed;
    TArray<FVector3f> BoneRotationDiffAxis;
    TArray<float> BoneRotationDiffAngle;
    TArray<float> BoneRotationDiffSpeed;
    // ... 缩放差值、根运动差值、曲线差值

    // 逐骨骼持续时间
    TCustomBoneIndexArray<float, FSkeletonPoseBoneIndex> InertializationDurationPerBone;

    // 请求队列
    TArray<FInertializationRequest> RequestQueue;
};
```

**惯性化状态机**：

```
Inactive ──[RequestInertialization]──→ Pending ──[Evaluate]──→ Active ──[elapsed >= duration]──→ Inactive
                                         │                        │
                                   捕获 Pose 差值           应用衰减的 Pose 差值
```

**惯性化工作原理**：

1. **Pending 阶段**（转换发生时）：
   - 捕获当前 Pose 和前两帧 Pose 快照
   - 计算差值：`InitFrom(Pose, Curves, Attributes, ComponentTransform, PrevPose1, PrevPose2)`
   - 差值包括：平移方向/大小/速度、旋转轴/角度/速度、缩放轴/大小/速度
   - 切换到 Active 状态

2. **Active 阶段**（每帧求值时）：
   - 正常求值子图得到目标 Pose
   - 应用衰减的差值：`ApplyTo(Pose, Curves, Attributes)`
   - 衰减公式：差值随时间衰减到零，使用类似 Spring Damper 的曲线
   - 当 `ElapsedTime >= MaxDuration` 时，Deactivate

**关键优势**：不需要同时求值源和目标两个 Pose，只需求值目标 Pose 然后叠加衰减的差值，性能开销显著低于 Crossfade。

**请求接口**（通过消息栈传递）：

```cpp
namespace UE::Anim
{
    class IInertializationRequester : public IGraphMessage
    {
        virtual void RequestInertialization(float InRequestedDuration,
                                             const UBlendProfile* InBlendProfile = nullptr) = 0;
    };
}
```

子节点在 Update 阶段通过 `Context.GetMessage<IInertializationRequester>()` 获取请求接口，调用 `RequestInertialization()` 发起惯性化请求。

### 3.7 缓存姿态节点

**源码位置**：`Animation/AnimNode_SaveCachedPose.h`

```cpp
struct FAnimNode_SaveCachedPose : public FAnimNode_Base
{
    FPoseLink Pose;              // 输入 Pose
    FName CachePoseName;         // 缓存名称（编译器设置）
    float GlobalWeight;          // 全局权重

    // 计数器（用于检测是否需要重新求值）
    FGraphTraversalCounter InitializationCounter;
    FGraphTraversalCounter CachedBonesCounter;
    FGraphTraversalCounter UpdateCounter;
    FGraphTraversalCounter EvaluationCounter;

    // 缓存的更新上下文
    struct FCachedUpdateContext
    {
        FAnimationUpdateContext Context;
        TSharedPtr<FAnimationUpdateSharedContext> SharedContext;
    };
    TArray<FCachedUpdateContext> CachedUpdateContexts;

    // 生命周期
    virtual void Initialize_AnyThread(const FAnimationInitializeContext& Context) override;
    virtual void CacheBones_AnyThread(const FAnimationCacheBonesContext& Context) override;
    virtual void Update_AnyThread(const FAnimationUpdateContext& Context) override;
    virtual void Evaluate_AnyThread(FPoseContext& Output) override;

    void PostGraphUpdate();  // 图更新后调用
};
```

**缓存机制**：

- `SaveCachedPose` 节点在动画图中可以被多个 `UseCachedPose` 节点引用
- 只有权重最大的引用会触发子图的 Update/Evaluate，其他引用直接使用缓存结果
- `CachedUpdateContexts` 数组保存所有引用的更新上下文，在 `PostGraphUpdate()` 中统一处理
- 编译器通过 `OrderedSavedPoseIndicesMap` 确保缓存节点在使用前完成更新

### 3.8 链接动画图与动画层

**源码位置**：`Animation/AnimNode_LinkedAnimGraph.h`, `Animation/AnimNode_LinkedAnimLayer.h`

```cpp
// 链接动画图：动态链接到另一个动画蓝图实例
struct FAnimNode_LinkedAnimGraph : public FAnimNode_Base
{
    FPoseLink InputPose;   // 输入 Pose（传递给子图的 LinkedInputPose 节点）
    // 运行时动态设置链接的动画蓝图类
};

// 链接动画层：按 Layer Group 链接到动画层
struct FAnimNode_LinkedAnimLayer : public FAnimNode_Base
{
    FPoseLink InputPose;
    // 通过 LinkAnimClassLayers() 设置层覆盖
};
```

**链接动画层的工作方式**：

1. 主动画蓝图包含 `LinkedAnimLayer` 节点，每个节点有一个 `LayerGroup`
2. 调用 `LinkAnimClassLayers(InClass)` 时，为每个层节点创建一个 `InClass` 的实例
3. 同一 `LayerGroup` 的层节点共享同一个实例
4. 层实例的 `LinkedInputPose` 节点连接到主图的对应输出

---

## 4. 完整帧执行流

### 4.1 初始化阶段

**触发时机**：动画实例首次创建、SkeletalMeshComponent 注册、动画蓝图重新实例化

```
UAnimInstance::InitializeAnimation(bInDeferRootNodeInitialization)
  │
  ├── NativeInitializeAnimation()                    // C++ 原生初始化
  ├── BlueprintInitializeAnimation()                 // 蓝图初始化事件
  │
  ├── FAnimInstanceProxy::Initialize(AnimInstance)
  │   ├── 设置 RootNode（从 AnimBlueprintGeneratedClass 获取）
  │   ├── 遍历 InitializationNodeProperties
  │   │   └── node->Initialize_AnyThread(InitContext)
  │   ├── RootNode->Initialize_AnyThread(InitContext)
  │   │   └── Result.Initialize(InitContext)         // 递归初始化子节点
  │   │       └── LinkedNode->Initialize_AnyThread(InitContext)
  │   │           └── ... 递归到叶子节点
  │   └── 初始化同步组
  │
  ├── NativeBeginPlay()                              // BeginPlay 事件
  ├── BlueprintBeginPlay()
  └── NativeLinkedAnimationLayersInitialized()       // 链接层初始化完成
      └── BlueprintLinkedAnimationLayersInitialized()
```

### 4.2 更新阶段

**触发时机**：每帧 Tick

```
UAnimInstance::UpdateAnimation(DeltaSeconds, bNeedsValidRootMotion, UpdateFlag)
  │
  ├── [判断是否需要立即更新 vs 并行更新]
  │   └── NeedsImmediateUpdate(DeltaSeconds, bNeedsValidRootMotion)
  │       ├── 根运动模式需要立即更新
  │       ├── 有节点不能在工作线程更新
  │       └── 强制并行更新标志
  │
  ├── PreUpdateAnimation(DeltaSeconds)               // 游戏线程
  │   ├── FAnimInstanceProxy::PreUpdate(AnimInstance, DeltaSeconds)
  │   │   ├── InitializeObjects()                    // 初始化 UObject 引用
  │   │   ├── 遍历 PreUpdateNodeProperties
  │   │   │   └── node->PreUpdate(AnimInstance)      // 收集非线程安全数据
  │   │   └── OnPreUpdateLODChanged()                // LOD 变化处理
  │   └── PreUpdateLinkedInstances(DeltaSeconds)
  │
  ├── Montage_UpdateWeight(DeltaSeconds)             // 更新蒙太奇权重
  │   └── 遍历 MontageInstances
  │       └── FAnimMontageInstance::UpdateWeight()
  │
  ├── Montage_Advance(DeltaSeconds)                  // 推进蒙太奇时间
  │   └── 遍历 MontageInstances
  │       └── FAnimMontageInstance::Advance()
  │
  ├── NativeUpdateAnimation(DeltaSeconds)            // C++ 原生更新
  ├── BlueprintUpdateAnimation(DeltaSeconds)         // 蓝图更新事件
  │
  ├── [并行或同步] FAnimInstanceProxy::UpdateAnimation()
  │   ├── Update(DeltaSeconds)                       // 虚函数扩展点
  │   │   └── NativeThreadSafeUpdateAnimation()      // 线程安全更新
  │   │       └── BlueprintThreadSafeUpdateAnimation()
  │   │
  │   └── UpdateAnimationNode(UpdateContext)
  │       └── RootNode->Update_AnyThread(UpdateContext)
  │           └── Result.Update(UpdateContext)       // 递归更新子节点
  │               └── LinkedNode->Update_AnyThread(UpdateContext)
  │                   ├── FAnimNode_StateMachine::Update
  │                   │   ├── FindValidTransition()
  │                   │   ├── TransitionToState()
  │                   │   └── UpdateState()
  │                   ├── FAnimNode_AssetPlayerBase::Update [final]
  │                   │   ├── 缓存 BlendWeight
  │                   │   └── UpdateAssetPlayer()
  │                   │       └── CreateTickRecordForNode()
  │                   ├── FAnimNode_Inertialization::Update
  │                   │   └── 处理 RequestQueue
  │                   └── FAnimNode_SaveCachedPose::Update
  │                       └── 缓存更新上下文
  │
  └── UpdateMontageEvaluationData()                  // 更新蒙太奇求值数据
```

### 4.3 求值阶段

**触发时机**：每帧 Update 后，根据 URO (Update Rate Optimizer) 可能跳过

```
UAnimInstance::PreEvaluateAnimation()                 // 游戏线程
  └── FAnimInstanceProxy::PreEvaluateAnimation(AnimInstance)

UAnimInstance::ParallelEvaluateAnimation(bForceRefPose, InSkeletalMesh, OutAnimationPoseData)
  │                                                   // 工作线程
  ├── FAnimInstanceProxy::EvaluateAnimation(Output)
  │   ├── Evaluate(Output)                           // 虚函数扩展点（默认返回 false）
  │   └── EvaluateAnimationNode(Output)
  │       └── RootNode->Evaluate_AnyThread(Output)
  │           └── Result.Evaluate(Output)            // 递归求值子节点
  │               └── LinkedNode->Evaluate_AnyThread(Output)
  │                   ├── FAnimNode_SequencePlayer::Evaluate
  │                   │   └── 从 UAnimSequenceBase 提取骨骼 Pose
  │                   ├── FAnimNode_StateMachine::Evaluate
  │                   │   ├── EvaluateState(CurrentState)
  │                   │   └── EvaluateTransitionStandardBlend/CustomBlend
  │                   ├── FAnimNode_Inertialization::Evaluate
  │                   │   ├── [Pending] InitFrom() → 捕获差值
  │                   │   └── [Active] ApplyTo() → 应用衰减差值
  │                   ├── FAnimNode_SaveCachedPose::Evaluate
  │                   │   └── 返回缓存的 Pose
  │                   └── 其他节点...
  │
  └── 输出: FCompactPose + FBlendedCurve + FStackAttributeContainer
```

### 4.4 后处理阶段

```
UAnimInstance::PostUpdateAnimation()                  // 游戏线程
  │
  ├── TriggerAnimNotifies(DeltaSeconds)               // 触发动画通知
  │   ├── 遍历 NotifyQueue
  │   ├── UAnimNotify::Notify()
  │   ├── UAnimNotifyState::NotifyBegin/Tick/End()
  │   └── HandleNotify()                              // 自定义处理
  │
  ├── DispatchQueuedAnimEvents()                      // 分发排队事件
  │   └── TriggerQueuedMontageEvents()
  │       ├── TriggerMontageBlendingOutEvent()
  │       ├── TriggerMontageBlendedInEvent()
  │       ├── TriggerMontageEndedEvent()
  │       └── TriggerMontageSectionChangedEvent()
  │
  ├── FAnimInstanceProxy::PostUpdate(AnimInstance)    // 代理后处理
  │   └── ClearObjects()                              // 清理 UObject 引用
  │
  └── UpdateCurvesToComponents()                      // 更新曲线到组件
      └── 更新材质参数、变形目标等

UAnimInstance::PostEvaluateAnimation()                 // 求值后处理
  │
  ├── FAnimInstanceProxy::PostEvaluate(AnimInstance)
  ├── NativePostEvaluateAnimation()
  ├── BlueprintPostEvaluateAnimation()
  └── UpdateCurvesPostEvaluation()
```

### 4.5 反初始化阶段

```
UAnimInstance::UninitializeAnimation()
  ├── NativeUninitializeAnimation()
  ├── 停止所有蒙太奇
  ├── 清理 MontageInstances
  ├── FAnimInstanceProxy::Uninitialize(AnimInstance)
  │   └── RootNode 和所有节点的清理
  └── 标记 bUninitialized = true
```

---

## 5. 关键数据流

### 5.1 动画数据提取流

```
UAnimSequenceBase (动画资产)
  │
  │  GetAnimationPose(OutPoseData, ExtractionContext)
  │
  ├── UAnimSequence
  │   └── 从压缩数据解压骨骼变换
  │       ├── AnimBoneCompressionCodec 解压骨骼
  │       └── AnimCurveCompressionCodec 解压曲线
  │
  ├── UBlendSpace
  │   ├── GetSamplesFromBlendInput() → 计算采样权重
  │   ├── UpdateBlendSamples() → 平滑权重
  │   └── 对每个采样提取 Pose 并混合
  │
  └── UAnimMontage
      └── TickAssetPlayer() → 推进时间并提取 Pose
```

### 5.2 Pose 混合流

```
FCompactPose (局部空间骨骼变换)
  │
  ├── FAnimationRuntime::Blend()          // 标准线性混合
  ├── FAnimationRuntime::BlendWithRoot()  // 带根运动混合
  ├── FAnimationRuntime::BlendPosesTogether()  // 多 Pose 混合
  ├── LayeredBlendPerBone                 // 逐骨骼分层混合
  │   ├── 按分支定义混合不同骨骼
  │   └── 支持 BlendProfile 逐骨骼混合
  └── FAnimationRuntime::ConvertPose()    // 空间转换
      ├── Local → Component Space
      └── Component → Local Space
```

### 5.3 完整数据流图

```
┌──────────────────────────────────────────────────────────────────┐
│                        动画资产层                                 │
│  UAnimSequence / UBlendSpace / UAnimMontage / UPoseAsset        │
└────────────────────────────┬─────────────────────────────────────┘
                             │ GetAnimationPose()
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      动画节点图求值                               │
│                                                                  │
│  FAnimNode_SequencePlayer ──→ FCompactPose (局部空间)            │
│          │                                                       │
│          ▼                                                       │
│  FAnimNode_StateMachine ──→ 混合当前/目标状态 Pose               │
│          │                                                       │
│          ▼                                                       │
│  FAnimNode_Blend / LayeredBlendPerBone ──→ 混合多个 Pose         │
│          │                                                       │
│          ▼                                                       │
│  FAnimNode_SkeletalControl (IK等) ──→ 修改骨骼变换               │
│          │                                                       │
│          ▼                                                       │
│  FAnimNode_Inertialization ──→ 叠加惯性化差值                    │
│          │                                                       │
│          ▼                                                       │
│  FAnimNode_Root ──→ 最终输出 Pose                                │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
               FCompactPose + FBlendedCurve + Attributes
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     USkeletalMeshComponent  根运动提取     动画曲线
     → 渲染骨骼网格          → 角色移动     → 材质/变形目标
```

---

## 6. 线程模型

### 6.1 多线程动画更新

```
┌─────────────────────────────────────────────────────────────┐
│                     游戏线程 (Game Thread)                    │
│                                                             │
│  UAnimInstance::UpdateAnimation()                           │
│    ├── PreUpdateAnimation()                                 │
│    │   └── FAnimInstanceProxy::PreUpdate()                  │
│    │       └── node->PreUpdate()  // 收集非线程安全数据      │
│    ├── Montage_UpdateWeight()                               │
│    ├── Montage_Advance()                                    │
│    ├── NativeUpdateAnimation()                              │
│    └── BlueprintUpdateAnimation()                           │
│                                                             │
│  UAnimInstance::PostUpdateAnimation()                       │
│    ├── TriggerAnimNotifies()                                │
│    └── DispatchQueuedAnimEvents()                           │
├─────────────────────────────────────────────────────────────┤
│                     工作线程 (Worker Thread)                  │
│                                                             │
│  FAnimInstanceProxy::UpdateAnimation()                      │
│    └── RootNode->Update_AnyThread()  // 递归更新整棵树       │
│                                                             │
│  FAnimInstanceProxy::EvaluateAnimation()                    │
│    └── RootNode->Evaluate_AnyThread()  // 递归求值整棵树     │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 线程安全保证

| 操作 | 线程 | 说明 |
|------|------|------|
| `PreUpdate()` | 游戏线程 | 收集非线程安全数据（如 UObject 引用） |
| `Update_AnyThread()` | 工作线程 | 更新节点状态、权重、时间 |
| `Evaluate_AnyThread()` | 工作线程 | 求值骨骼 Pose |
| `PostUpdate()` | 游戏线程 | 分发通知、处理委托 |
| 蒙太奇控制 | 游戏线程 | Play/Stop/JumpToSection |
| 通知触发 | 游戏线程 | Notify/NotifyBegin/NotifyEnd |

### 6.3 UObject 引用管理

`FAnimInstanceProxy` 在 `PreUpdate()` 时通过 `InitializeObjects()` 拷贝 UObject 引用到工作线程可访问的位置，在 `ClearObjects()`（PostUpdate 后）清理这些引用，确保 UObject 不会被工作线程在非安全时机访问。

---

## 7. 关键设计模式

### 7.1 代理模式

`UAnimInstance` 与 `FAnimInstanceProxy` 分离，实现游戏线程和工作线程的解耦：

- `UAnimInstance`：管理蒙太奇、通知、蓝图事件等游戏线程逻辑
- `FAnimInstanceProxy`：管理节点图更新、求值等可并行逻辑

### 7.2 递归遍历模式

通过 `FPoseLink` 实现从 Root 到叶子的递归遍历，每个节点在 Update/Evaluate 时递归调用其输入连接：

```cpp
void FAnimNode_Root::Update_AnyThread(const FAnimationUpdateContext& Context)
{
    Result.Update(Context);  // 递归调用 LinkedNode->Update_AnyThread()
}
```

### 7.3 权重传播模式

`FAnimationUpdateContext` 携带 CurrentWeight，混合节点通过 `FractionalWeight()` 修改子节点的权重上下文：

```cpp
void FAnimNode_Blend::Update_AnyThread(const FAnimationUpdateContext& Context)
{
    // 子节点 A 获得完整权重
    A.Update(Context);
    // 子节点 B 获得 BlendWeight 修正的权重
    B.Update(Context.FractionalWeight(BlendWeight));
}
```

### 7.4 TickRecord 批处理模式

所有 AssetPlayer 注册 TickRecord 到 Proxy，由 Proxy 统一推进时间，支持同步组和标记同步：

```cpp
void FAnimNode_AssetPlayerBase::Update_AnyThread(const FAnimationUpdateContext& Context)
{
    // 不直接推进时间，而是注册 TickRecord
    CreateTickRecordForNode(Context, Sequence, bLooping, PlayRate, bIsEvaluator);
}
```

### 7.5 消息栈模式

`UE::Anim::FMessageStack` 替代了旧的祖先追踪器，用于节点间通信。子节点通过消息栈向祖先节点发送请求：

```cpp
// 惯性化请求：子节点向 Inertialization 节点发送请求
IInertializationRequester* Requester = Context.GetMessage<IInertializationRequester>();
if (Requester)
{
    Requester->RequestInertialization(Duration, BlendProfile);
}
```

### 7.6 常量折叠模式

`UAnimBlueprintGeneratedClass` 将不变的节点属性折叠到 Sparse Class Data，减少实例内存开销：

- 编译期分析哪些属性在所有实例中保持不变
- 不变属性存储在 `AnimNodeData` 中（类级数据）
- 可变属性存储在 `FAnimBlueprintMutableData` 中（实例级数据）
- 运行时通过 `GET_ANIM_NODE_DATA` / `GET_INSTANCE_ANIM_NODE_DATA_PTR` 宏访问

### 7.7 双缓冲模式

同步组使用双缓冲机制，避免读写冲突：

```cpp
int32 GetBufferReadIndex() const { return 1 - BufferWriteIndex; }
int32 GetBufferWriteIndex() const { return BufferWriteIndex; }
```

---

## 8. 源码文件索引

| 文件 | 说明 |
|------|------|
| `AnimNodeBase.h` | 动画节点基类、上下文体系、PoseLink |
| `AnimNode_Root.h` | 动画树根节点 |
| `AnimExecutionContext.h` | 蓝图可访问的执行上下文 |
| `AnimInstance.h` | 动画实例（游戏线程侧） |
| `AnimBlueprintGeneratedClass.h` | 动画蓝图编译产物 |
| `AnimClassInterface.h` | 动画类接口 |
| `AnimNode_SequencePlayer.h` | 序列播放器节点 |
| `AnimNode_AssetPlayerBase.h` | 资产播放器基类 |
| `AnimNode_StateMachine.h` | 状态机节点 |
| `AnimNode_Inertialization.h` | 惯性化节点 |
| `AnimNode_SaveCachedPose.h` | 缓存姿态节点 |
| `AnimNode_LinkedAnimGraph.h` | 链接动画图节点 |
| `AnimNode_LinkedAnimLayer.h` | 链接动画层节点 |
| `AnimMontage.h` | 蒙太奇资产与运行时实例 |
| `AnimNotifies/AnimNotify.h` | 即时通知 |
| `AnimNotifies/AnimNotifyState.h` | 持续通知 |
| `BlendSpace.h` | 混合空间 |
| `BlendSpace1D.h` | 一维混合空间 |
| `AnimSequence.h` | 动画序列资产 |
| `AnimSequenceBase.h` | 动画序列基类 |
| `AnimationAsset.h` | 动画资产基类 |
| `AnimEnums.h` | 动画枚举定义 |
| `AnimStateMachineTypes.h` | 状态机类型定义 |
| `Skeleton.h` | 骨架资产 |
| `AnimationPoseData.h` | 动画 Pose 数据结构 |
| `AnimBlueprint.h` | 动画蓝图 |
| `AnimSingleNodeInstance.h` | 单节点动画实例 |
| `AnimBoneCompressionCodec.h` | 骨骼压缩编解码器 |
| `AnimCurveCompressionCodec.h` | 曲线压缩编解码器 |
| `InputScaleBias.h` | 输入缩放偏移 |
| `BlendProfile.h` | 混合配置 |
| `MirrorDataTable.h` | 镜像数据表 |
| `MorphTarget.h` | 变形目标 |
| `PoseAsset.h` | Pose 资产 |
| `SmartName.h` | 智能名称 |
| `AnimInertializationRequest.h` | 惯性化请求 |
| `AnimSlotEvaluationPose.h` | Slot 求值 Pose |
| `AnimMetaData.h` | 动画元数据 |
| `AnimLayerInterface.h` | 动画层接口 |
| `AnimLinkableElement.h` | 可链接元素 |
| `AnimBank.h` | 动画库 |
| `AnimSet.h` | 动画集 |
| `AnimCompress.h` | 动画压缩基类 |
| `AnimData/` | 动画数据模型目录 |

---

> 本文档基于虚幻引擎源码 `Engine/Source/Runtime/Engine/Classes/Animation` 目录下的头文件分析编写，涵盖了动画系统的核心架构、执行流程和关键子系统。
