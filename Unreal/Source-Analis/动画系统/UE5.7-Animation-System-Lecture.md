# UE5.7 动画系统深度解析 —— 团队内部技术分享

> **目标受众**：游戏逻辑/引擎程序员，有 UE 使用经验但未深入动画系统源码  
> **时长建议**：2.5-3 小时（含 Q&A），或拆分为 3 次 1 小时的系列分享  
> **配套文档**：`UE5.7-Animation-System-Architecture.md`

---

## 讲座大纲总览

```
第一幕：地基 —— 核心架构与数据模型（45 分钟）
  1.1 问题引入：一个动画请求的生命周期
  1.2 架构全景：AnimInstance → Proxy → AnimGraph 三层模型
  1.3 资产体系：从 UAnimationAsset 到 UAnimMontage
  1.4 源码导读：关键文件索引

第二幕：引擎 —— 六阶段执行流（60 分钟）
  2.1 六阶段模型概述
  2.2 Initialize：节点树的构建
  2.3 Update：权重传播与状态更新
  2.4 Evaluate：姿态生成
  2.5 PostUpdate/PostEvaluate：通知与曲线
  2.6 多线程：Proxy 模式如何实现并行

第三幕：精粹 —— 核心子系统深度剖析（60 分钟）
  3.1 状态机：动画系统的"CPU"
  3.2 Montage：Slot、Section、事件
  3.3 Inertialization/Dead Blending：无抖动过渡的秘密
  3.4 Cached Pose & Linked Anim Graph
  3.5 同步系统与曲线系统
```

---

# 第一幕：地基 —— 核心架构与数据模型

---

## 1.1 问题引入：一个动画请求的生命周期

### 从简单问题出发

> 我在蓝图中调用 `Play Montage`，到角色屏幕上看到动画，中间发生了什么？

```
蓝图调用 Montage_Play()
  → UAnimInstance 创建 FAnimMontageInstance
  → PreUpdate 阶段更新 Montage 权重
  → Update 阶段 AnimGraph 遍历，Slot 节点处理 Montage 评估
  → Evaluate 阶段从 AnimSequence 采样骨骼数据
  → PostEvaluate 阶段推送曲线到渲染
  → 下一帧 SkeletalMeshComponent 渲染更新后的骨骼
```

### 这节课要回答的核心问题

| 问题 | 答案所在 |
|------|----------|
| 动画蓝图中的节点图是如何被执行的？ | 第二幕：六阶段执行流 |
| 状态机如何决定切换到哪个状态？ | 第三幕 3.1：状态机 |
| Montage 和普通动画播放有什么区别？ | 第三幕 3.2：Montage |
| 为什么动画过渡不会抖动？ | 第三幕 3.3：Inertialization |
| 动画更新为什么能多线程？ | 第二幕 2.6：多线程 |
| Linked Anim Graph 和 Anim Layer 是什么？ | 第三幕 3.4 |

---

## 1.2 架构全景

### 三层模型

```
┌───────────────────────────────────────────────┐
│ 第 1 层: USkeletalMeshComponent               │
│   骨骼网格组件，最终渲染的载体                   │
│   ┌─────────────────────────────────────────┐ │
│   │ 第 2 层: UAnimInstance (UObject)         │ │
│   │   动画蓝图运行时，管理 Montage/Notify/曲线  │ │
│   │   只能在 GameThread 操作                  │ │
│   │   ┌───────────────────────────────────┐  │ │
│   │   │ 第 3 层: FAnimInstanceProxy       │  │ │
│   │   │   纯 C++ 结构体，线程安全          │  │ │
│   │   │   持有 AnimGraph 的根节点          │  │ │
│   │   │   执行 Update/Evaluate 遍历       │  │ │
│   │   └───────────────────────────────────┘  │ │
│   └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### 为什么需要 Proxy 层？

**源码证据**（`AnimInstance.h:1753`）：

```cpp
// Proxy 对象，外部 API 不应直接访问，它作为工作线程上的"草稿纸"使用
mutable FAnimInstanceProxy* AnimInstanceProxy;
```

**设计动机**：
- `UAnimInstance` 是 `UObject` 派生类，受 GC 管理，有线程亲和性
- `FAnimInstanceProxy` 是纯 `USTRUCT`，无 GC 依赖，可在工作线程安全操作
- 游戏线程操作 `UAnimInstance`，工作线程操作 `FAnimInstanceProxy`
- 两者通过 `PreUpdate()` / `PostUpdate()` 同步数据

### 关键类关系速查表

| 类/结构体 | 文件路径 | 一句话职责 |
|-----------|----------|-----------|
| `UAnimInstance` | `AnimInstance.h` | 动画实例，蓝图父类 |
| `FAnimInstanceProxy` | `AnimInstanceProxy.h` | 线程安全的执行引擎 |
| `FAnimNode_Base` | `AnimNodeBase.h` | 所有动画节点的基类 |
| `FPoseLink` | `AnimNodeBase.h:818` | 节点间的"边" |
| `IAnimClassInterface` | `AnimClassInterface.h` | 编译后类的元数据接口 |
| `UAnimBlueprintGeneratedClass` | `AnimBlueprintGeneratedClass.h` | 编译后的实际类 |

---

## 1.3 资产体系

### 继承链全景

```
UObject
  └─ UAnimationAsset                     ← 所有动画资产的抽象基类
       ├─ UAnimSequenceBase              ← 含 Notify、曲线数据
       │    ├─ UAnimCompositeBase        ← 由 FAnimTrack (FAnimSegment 数组) 组成
       │    │    ├─ UAnimComposite
       │    │    └─ UAnimMontage         ← Slot + Section + BranchingPoint
       │    └─ UAnimSequence             ← 完整骨骼动画，含压缩轨道
       ├─ UBlendSpace                    ← 基于参数的多动画混合
       │    ├─ UBlendSpace1D
       │    └─ UAimOffsetBlendSpace
       └─ UPoseAsset                     ← 姿态快照
```

### 重点资产详解

#### UAnimSequence —— 骨骼动画的"原料"

```
UAnimSequence
  ├─ 骨骼轨道数据（压缩后）
  │    └─ 每骨骼每帧的 Transform（Translation/Rotation/Scale）
  ├─ 曲线数据（Float Curves）
  ├─ Notify 轨道（在哪些时间点触发什么事件）
  └─ 元数据（帧率、长度、压缩设置、Additive 设置等）
```

#### UBlendSpace —— "根据参数混合多个动画"

```
BlendSpace1D（一维混合空间）
  参数: Speed (0 ~ 600)
  ├─ Speed=0   → Idle 动画 (权重 1.0)
  ├─ Speed=150 → Walk 动画 (权重 1.0)
  ├─ Speed=300 → Jog 动画  (权重 1.0)
  └─ Speed=200 → Walk (0.5) + Jog (0.5)   ← 三角剖分混合

BlendSpace（二维混合空间）
  参数: Speed(0~600) × Direction(-180~180)
  通过三角剖分找到包围输入参数的 3 个样本点，按重心坐标混合
```

#### UAnimMontage —— 动画的"剧本"

```
UAnimMontage
  ├─ CompositeSections（Section 列表）
  │    Section "Start" → Section "Loop" → Section "End"
  ├─ SlotAnimTracks（按 Slot 组织的动画轨道）
  │    Slot "DefaultSlot":
  │      AnimTrack:
  │        AnimSegment[0]: AnimSequence "Attack", StartPos=0, EndPos=1.5
  │        AnimSegment[1]: AnimSequence "Attack", StartPos=1.5, EndPos=3.0
  ├─ BlendIn / BlendOut 设置
  └─ BranchingPoints（分支点通知）
```

### 一个 Montage 的结构示意图

```
Section: "Start"          Section: "Loop"           Section: "End"
|----0.0s----0.5s----|----0.5s----2.5s----|----2.5s----3.0s----|
     Attack_Start         Attack_Loop           Attack_End

BranchingPoint at 1.5s: "CanChainNextAttack"
```

---

## 1.4 源码导读：关键文件索引

### 头文件（Classes/Animation/）

| 优先级 | 文件 | 内容 |
|--------|------|------|
| ★★★ | `AnimNodeBase.h` | `FAnimNode_Base`, `FPoseLink`, `FAnimationUpdateContext`, `FPoseContext` |
| ★★★ | `AnimInstance.h` | `UAnimInstance` 完整声明 |
| ★★★ | `AnimInstanceProxy.h` | `FAnimInstanceProxy` 完整声明 |
| ★★★ | `AnimNode_StateMachine.h` | 状态机节点 |
| ★★☆ | `AnimNode_AssetPlayerBase.h` | 资产播放节点基类 |
| ★★☆ | `AnimNode_SequencePlayer.h` | 序列播放节点 |
| ★★☆ | `AnimMontage.h` | Montage 资产 |
| ★★☆ | `AnimStateMachineTypes.h` | 烘焙状态机数据结构 |
| ★★☆ | `AnimBlueprintGeneratedClass.h` | 编译后的类 |
| ★★☆ | `AnimNode_Inertialization.h` | 惯性混合 |
| ★★☆ | `AnimNode_LinkedAnimGraph.h` | 链接动画图 |
| ★★☆ | `AnimNode_LinkedAnimLayer.h` | 动画层 |
| ★☆☆ | `AnimNode_SaveCachedPose.h` | 缓存姿态 |
| ★☆☆ | `AnimNode_UseCachedPose.h` | 使用缓存姿态 |
| ★☆☆ | `AnimNode_Root.h` | 根节点 |
| ★☆☆ | `AnimNode_DeadBlending.h` | Dead Blending |
| ★☆☆ | `AnimMontageEvaluationState.h` | Montage 评估状态 |
| ★☆☆ | `AnimCompositeBase.h` | 组合动画基类（FAnimTrack/FAnimSegment） |

### 实现文件（Private/Animation/）

| 文件 | 内容 |
|------|------|
| `AnimInstanceProxy.cpp` | `UpdateAnimation()`, `EvaluateAnimation()`, `UpdateAnimationNode_WithRoot()` 等核心实现 |

---

# 第二幕：引擎 —— 六阶段执行流

---

## 2.1 六阶段模型概述

**源码中的官方注释**（`AnimInstance.h:1334-1339`）：

```cpp
// Animation phase trigger
// start with initialize
// update happens in every tick. Can happen in parallel with others if conditions are right.
// evaluate happens when condition is met
// post eval happens after evaluation is done
// uninitialize happens when owner is unregistered
```

### 一张图看懂六个阶段

```
帧开始
  │
  ├─ [GameThread]  Phase 1: Initialize（首次/重新初始化时）
  │
  ├─ [GameThread]  Phase 2: PreUpdate
  │   ├─ 复制 Transform
  │   ├─ 处理 LOD 变化
  │   ├─ 执行 PreUpdate 节点
  │   └─ 更新 Montage 权重和位置
  │
  ├─ [WorkerThread] Phase 3: Update
  │   ├─ 递归遍历 AnimGraph
  │   ├─ 权重传播和状态更新
  │   └─ Tick 资产播放器（同步组）
  │
  ├─ [GameThread]  Phase 4: PostUpdate
  │   ├─ 触发 Montage 事件
  │   └─ 触发动画通知
  │
  ├─ [WorkerThread] Phase 5: Evaluate
  │   └─ 递归遍历 AnimGraph，生成最终姿态
  │
  └─ [GameThread]  Phase 6: PostEvaluate
      ├─ 蓝图 PostEvaluate 事件
      └─ 推送曲线到渲染
```

### 线程模型总览

```
GameThread                          WorkerThread
    │                                    │
    ├─ PreUpdate ────────────────────────│
    │   (准备数据，复制到 Proxy)           │
    │                                    │
    ├─ 提交任务 ─────────────────────→    ├─ Update
    │                                    │   (权重计算，状态更新)
    │                                    │
    │   (继续其他工作)                     │
    │                                    │
    ├─ PostUpdate ←──────────────────────│
    │   (处理通知和事件)                    │
    │                                    │
    ├─ 提交任务 ─────────────────────→    ├─ Evaluate
    │                                    │   (姿态生成)
    │                                    │
    ├─ PostEvaluate ←────────────────────│
    │   (推送曲线到渲染)                    │
```

---

## 2.2 Phase 1: Initialize —— 节点树的构建

### 调用链

```
UAnimInstance::InitializeAnimation(bInDeferRootNodeInitialization)
  ├─ NativeInitializeAnimation()              ← C++ 重载：初始化自定义数据
  ├─ BlueprintInitializeAnimation()           ← 蓝图事件
  ├─ FAnimInstanceProxy::InitializeRootNode()
  │    ├─ 从 AnimClassInterface 获取 RootNode 指针
  │    │    RootNode = AnimBlueprintFunctions[0].OutputPoseNodeProperty
  │    │              → ContainerPtrToValuePtr<FAnimNode_Root>(AnimInstance)
  │    ├─ 构建 SavedPoseQueueMap
  │    │    OrderSavedPoseIndicesMap → 按层组织 SaveCachedPose 节点
  │    ├─ 初始化状态机双缓冲
  │    │    StateWeightArrays[0/1].AddZeroed(NumStates)
  │    │    MachineWeightArrays[0/1].AddZeroed(NumMachines)
  │    ├─ 检查蓝图是否有编译错误
  │    └─ ReinitializeSlotNodes()
  ├─ InitializeGroupedLayers()
  │    └─ 初始化 LinkedAnimLayer 的分组
  └─ (若未延迟) RootNode->Initialize_AnyThread(Context)
       └─ Result.Initialize(Context)
            └─ ... (递归初始化整棵节点树)
```

### 延迟初始化

```cpp
// AnimInstance.h:1341
InitializeAnimation(bool bInDeferRootNodeInitialization = false);
```

当 `bInDeferRootNodeInitialization = true` 时，根节点的 `Initialize_AnyThread` 推迟到首次 `UpdateAnimation()` 时执行。这样做的原因：
- 初始化可能依赖 SkeletalMeshComponent 的某些状态
- 延迟到 Update 时可以确保所有依赖都已就绪

### 节点数据系统

每个节点通过 `FAnimNodeData` 系统获取其常量数据：

```cpp
// 节点内部获取折叠数据
GET_ANIM_NODE_DATA(Type, Identifier)
// 展开为: GetData<Type>(静态缓存的 FNodeDataId)

// 获取实例数据（可变）
GET_INSTANCE_ANIM_NODE_DATA_PTR(Type, Identifier)
// 返回 nullptr 如果数据不是实例级可变的
```

**常量折叠**：编译时不变的属性被折叠到稀疏类数据中，多个实例共享，节省内存。这就是 `FAnimNode_SequencePlayer`（常量折叠版）和 `FAnimNode_SequencePlayer_Standalone`（独立版）的区别。

---

## 2.3 Phase 3: Update —— 权重传播与状态更新

### Update 的核心代码

```cpp
// AnimInstanceProxy.cpp:1222
void FAnimInstanceProxy::UpdateAnimation()
{
    FAnimationUpdateSharedContext SharedContext;
    FAnimationUpdateContext Context(this, CurrentDeltaSeconds, &SharedContext);
    UpdateAnimation_WithRoot(Context, RootNode, NAME_AnimGraph);
    Sync.TickAssetPlayerInstances(*this, CurrentDeltaSeconds);  // 统一Tick
}

// AnimInstanceProxy.cpp:126
void FAnimInstanceProxy::UpdateAnimationNode_WithRoot(
    const FAnimationUpdateContext& InContext,
    FAnimNode_Base* InRootNode, FName InLayerName)
{
    UpdateCounter.Increment();                        // 防重复遍历
    FNodeFunctionCaller::InitialUpdate(Context, *InRootNode);   // 首次变为 Relevant
    FNodeFunctionCaller::BecomeRelevant(Context, *InRootNode);  // 变为 Relevant
    FNodeFunctionCaller::Update(Context, *InRootNode);          // 蓝图 Update
    InRootNode->Update_AnyThread(InContext);          // C++ Update，递归遍历子节点

    // 处理缓存的姿态
    for(FAnimNode_SaveCachedPose* PoseNode : *SavedPoseQueue)
        PoseNode->PostGraphUpdate();
}
```

### 权重传播机制 —— 这是理解 Update 的核心

每个节点在 `Update_AnyThread` 中调用子链接的 `Update()` 时，可以衰减权重：

```cpp
// 示例：一个 Blend 节点
void FAnimNode_MyBlend::Update_AnyThread(const FAnimationUpdateContext& Context)
{
    // 分支 A 获得 30% 权重
    PoseA.Update(Context.FractionalWeight(0.3f));

    // 分支 B 获得 70% 权重
    PoseB.Update(Context.FractionalWeight(0.7f));
}
```

**权重衰减链**：

```
Root (1.0)
  → StateMachine (1.0)
      → BlendNode (1.0)
          → Branch A (0.3 × 1.0 = 0.3)  ← 最终权重 30%
          → Branch B (0.7 × 1.0 = 0.7)  ← 最终权重 70%
```

### FAnimationUpdateContext 的工厂方法

```cpp
FractionalWeight(0.5)                    // 权重 × 0.5
FractionalWeightAndRootMotion(0.5, 0.0)  // 权重 × 0.5，RootMotion 权重 × 0.0
FractionalWeightAndTime(0.5, 0.5)        // 权重 × 0.5，DeltaTime × 0.5
AsInactive()                              // 标记为 blend-out（不影响权重但影响行为）
```

### Update 中的节点职责分工

| 节点类型 | Update 中做什么 |
|----------|----------------|
| Asset Player | 创建 TickRecord，提交给同步系统 |
| State Machine | 检查过渡条件，切换状态，更新 Blend Alpha |
| Blend Node | 计算各分支权重，传播到子节点 |
| Inertialization | 检查请求队列，管理状态转换 |
| Linked Anim Graph | 将 Context 转发到链接的 AnimInstance |

---

## 2.4 Phase 5: Evaluate —— 姿态生成

### Evaluate 的核心代码

```cpp
// AnimInstanceProxy.cpp:1397
void FAnimInstanceProxy::EvaluateAnimation(FPoseContext& Output)
{
    EvaluateAnimation_WithRoot(Output, RootNode);
}

void FAnimInstanceProxy::EvaluateAnimationNode(FPoseContext& Output)
{
    EvaluationCounter.Increment();
    RootNode->Evaluate_AnyThread(Output);
}
```

### 两种评估空间

```
局部空间 (Local Space)                  组件空间 (Component Space)
────────────────────────                ──────────────────────────
FPoseLink::Evaluate(FPoseContext&)      FComponentSpacePoseLink::EvaluateComponentSpace(...)
每个骨骼相对父骨骼的变换                  每个骨骼相对组件原点的变换
大多数节点在此工作                        IK、骨骼控制、LookAt 等节点在此工作
```

### Evaluate 和 Update 的分离是关键设计

```
Update 阶段：                    Evaluate 阶段：
  "接下来要播什么？"                "现在姿势是什么？"
  "权重怎么分配？"                  "每根骨骼的 Transform 是什么？"
  "该切换状态了吗？"                "曲线值是什么？"
  只改状态，不生成姿态              只生成姿态，不改状态
```

**分离的好处**：
- Update 和 Evaluate 可以在不同线程执行
- 支持 URO：频繁 Update，降低 Evaluate 频率，中间帧用插值
- 状态机在 Update 中切换状态不影响当帧的 Evaluate

### 评估时 FPoseContext 的传递

```
RootNode->Evaluate_AnyThread(Output)
  // Output 初始为参考姿态
  Result.Evaluate(Output)
    // 被下游节点覆写
    SequencePlayer->Evaluate_AnyThread(Output)
      // 从 UAnimSequence 采样骨骼数据，写入 Output.Pose
      // 采样曲线数据，写入 Output.Curve
    BlendNode->Evaluate_AnyThread(Output)
      // 分别评估两个分支，然后按权重混合
      // Output.Pose = Pose_A * Weight_A + Pose_B * Weight_B
```

---

## 2.5 Phase 4 & 6: PostUpdate & PostEvaluate

### PostUpdate —— 通知触发

```cpp
UAnimInstance::PostUpdateAnimation()
  ├─ TriggerQueuedMontageEvents()
  │    ├─ MontageBlendingOut  → OnMontageBlendingOut 委托
  │    ├─ MontageBlendedIn    → OnMontageBlendedIn 委托
  │    ├─ MontageEnded        → OnMontageEnded 委托
  │    └─ MontageSectionChanged → OnMontageSectionChanged 委托
  └─ TriggerAnimNotifies(DeltaSeconds)
       ├─ 处理一次性 AnimNotify
       ├─ 更新 ActiveAnimNotifyState (Begin/Tick/End)
       └─ 触发 PlayMontageNotify (Begin/End)
```

### PostEvaluate —— 曲线推送

```
PostEvaluateAnimation()
  ├─ NativePostEvaluateAnimation()
  ├─ BlueprintPostEvaluateAnimation()
  └─ UpdateCurvesPostEvaluation()
       ├─ 推送 MorphTarget 权重 → SkeletalMeshComponent
       └─ 推送 Material 参数 → 材质实例
```

---

## 2.6 多线程：Proxy 模式如何实现并行

### 线程安全的三层保障

**第 1 层：节点声明**

```cpp
// 节点声明自己是否可以工作线程更新
virtual bool CanUpdateInWorkerThread() const { return true; }  // 默认可以
// 如果任何节点返回 false，整个图在 GameThread 更新

// 节点声明自己是否需要游戏线程预处理
virtual bool HasPreUpdate() const { return false; }
virtual void PreUpdate(const UAnimInstance*) {}  // 在 GameThread 执行
```

**第 2 层：Proxy 的双缓冲**

```cpp
// 所有权重数组都双缓冲
TArray<float> StateWeightArrays[2];    // [0] 写入, [1] 读取
TArray<float> MachineWeightArrays[2];
TArray<FMontageActiveSlotTracker> SlotWeightTracker[2];

int32 BufferWriteIndex;
int32 GetBufferReadIndex() const { return 1 - BufferWriteIndex; }
void FlipBufferWriteIndex() { BufferWriteIndex = GetBufferReadIndex(); }
```

**第 3 层：遍历计数器防重入**

```cpp
FGraphTraversalCounter UpdateCounter;
// 每次遍历递增，如果节点记录的 Counter 与当前相同，跳过
if (UpdateCounter.HasEverBeenUpdated())
    return; // 已处理过
UpdateCounter.Increment();
```

### 线程安全访问 Proxy

```cpp
// GameThread 访问（阻塞等待并行任务完成）
GetProxyOnGameThread<T>()

// 任意线程访问（如果当前在 GameThread 则等待任务）
GetProxyOnAnyThread<T>()
```

---

# 第三幕：精粹 —— 核心子系统深度剖析

---

## 3.1 状态机：动画系统的"CPU"

### 状态机在 AnimGraph 中的位置

```
Root
  └─ StateMachine (Locomotion)
       ├─ State "Idle"
       │    └─ SequencePlayer(Idle_Anim)
       ├─ State "Walk"
       │    └─ BlendSpace(Locomotion, Speed, Direction)
       ├─ State "Jump"
       │    └─ SequencePlayer(Jump_Start) → SequencePlayer(Jump_Loop)
       └─ Transitions:
            Idle → Walk:  Speed > 0
            Walk → Idle:  Speed == 0
            Any  → Jump:  bIsJumping == true
```

### 编译时 vs 运行时

```
编译时（AnimBlueprint 编译）:
  UAnimGraphNode_StateMachine (编辑器节点)
    → 烘焙为 FBakedAnimationStateMachine (不可变数据)
        ├─ FBakedAnimationState[] (所有状态的定义)
        └─ FAnimationTransitionBetweenStates[] (所有过渡的定义)

运行时（每帧 Update）:
  FAnimNode_StateMachine (运行时节点)
    → 引用 FBakedAnimationStateMachine
    → 维护 CurrentState, ElapsedTime, ActiveTransitionArray
```

### 状态机 Update 的完整流程

```
FAnimNode_StateMachine::Update_AnyThread(Context)
  │
  ├─ Step 1: 处理"变为 Relevant"逻辑
  │    if (bFirstUpdate || (bReinitializeOnBecomingRelevant && 之前不Relevant))
  │        SetState(Context, InitialState)
  │        if (bSkipFirstUpdateTransition)
  │            return  ← 跳过第一帧的过渡检查
  │
  ├─ Step 2: 如果是 Conduit 状态，自动找过渡
  │    if (IsAConduitState(CurrentState))
  │        FindValidTransition() → 自动过渡
  │
  ├─ Step 3: 检查当前状态的过渡规则
  │    for (Transition in CurrentState.Transitions)  // 已按优先级排序
  │        if (CanTakeDelegate 返回 true)
  │        || (bAutomaticRemainingTimeRule && 剩余时间 < 阈值)
  │        || (过渡请求队列中有匹配事件)
  │            → 找到有效过渡!
  │
  ├─ Step 4: 执行过渡
  │    TransitionToState(Context, TransitionInfo)
  │    ├─ 创建 FAnimationActiveTransitionEntry
  │    ├─ 根据 LogicType 设置混合方式
  │    │    TLT_StandardBlend: 同时更新源和目标，Blend Alpha
  │    │    TLT_Inertialization: 只更新目标，通过惯性混合平滑
  │    │    TLT_Custom: 使用自定义混合图
  │    └─ 触发 StartNotify/EndNotify
  │
  ├─ Step 5: 更新活动过渡
  │    for (ActiveTransition in ActiveTransitionArray)
  │        UpdateTransitionStates(Context, ActiveTransition)
  │        ├─ 更新 Blend Alpha
  │        ├─ 检查过渡是否完成
  │        └─ 完成时切换 CurrentState
  │
  ├─ Step 6: 更新当前状态
  │    UpdateState(CurrentState, Context)
  │    └─ StatePoseLinks[CurrentState].Update(Context)
  │
  └─ Step 7: 清理
       ConsumeMarkedTransitionEvents()  // 标记消费的过渡事件
       // 移除过期的过渡请求
```

### 三种过渡逻辑类型的可视化

```
TLT_StandardBlend（标准混合）:
  State A ████████████░░░░░░░░░░░░  (权重 1.0 → 0.0)
  State B ░░░░░░░░░░░░████████████  (权重 0.0 → 1.0)
            ← CrossfadeDuration →

TLT_Inertialization（惯性混合）:
  State A ████████████              (突然切断)
  State B               ██████████  (立即开始)
            ← 惯性混合平滑过渡 →

TLT_Custom（自定义混合）:
  由用户定义的混合图控制过渡曲线和行为
```

### Conduit 状态

Conduit 是一种特殊的"通道"状态，不包含动画，只包含过渡规则：

```
Entry → Conduit(检查条件) → State A (条件为 true)
                          → State B (条件为 false)
```

Conduit 在同一帧内自动完成过渡，不会停留在 Conduit 状态本身。

### 过渡请求系统

```cpp
// 蓝图中调用：请求过渡
RequestTransitionEvent("Jump", 1.0, Shared, Overwrite);

// 过渡规则中：检查是否有请求
QueryTransitionEvent(MachineIndex, TransitionIndex, "Jump");    // 只读
QueryAndMarkTransitionEvent(MachineIndex, TransitionIndex, "Jump"); // 消费
```

**三种队列模式**：

| 模式 | 行为 |
|------|------|
| `Shared` | 一个过渡消费后，标记为已消费（其他过渡不再处理） |
| `Unique` | 每个过渡独立检查 |

**三种覆写模式**：

| 模式 | 行为 |
|------|------|
| `Append` | 总是添加新请求 |
| `Ignore` | 同名请求已存在则忽略 |
| `Overwrite` | 同名请求已存在则覆盖 |

---

## 3.2 Montage：Slot、Section、事件

### Montage 不是什么

> Montage **不是**一个单独的动画节点。它是通过 **Slot 节点** 注入到 AnimGraph 中的。

### Montage 如何注入 AnimGraph

```
AnimGraph:
  Root
    └─ ... (状态机)
         └─ Slot "DefaultSlot"    ← Slot 节点在这里
              ├─ 输入: 状态机的输出姿态
              └─ 输出: 混合了 Montage 的姿态

当 Montage_Play(AttackMontage) 被调用:
  → 创建 FAnimMontageInstance
  → Montage 被分配到 "DefaultSlot"
  → 下一帧 Update，Slot 节点检测到 Montage 数据
  → Evaluate 时，Slot 节点将 Montage 动画混合到输入姿态上
```

### Slot 节点的混合

```
Slot 节点输出 = Lerp(SourcePose, MontagePose, MontageWeight)

当 Montage 正在 BlendIn:  MontageWeight: 0.0 → 1.0
当 Montage 完全播放:        MontageWeight: 1.0
当 Montage 正在 BlendOut:  MontageWeight: 1.0 → 0.0
```

### Montage 的 Section 跳转

```
Montage 结构:
  Section "Start" ──→ Section "Loop" ──→ Section "Loop" (循环)
                                    └──→ Section "End"

运行时:
  Montage_JumpToSection("End") → 当前 Section 结束后跳转到 "End"
  Montage_SetNextSection("Loop", "End") → 将 Loop 的下一 Section 改为 End
```

### Montage 事件系统

```cpp
// 所有委托
OnMontageStarted         // BlendIn 开始时
OnMontageBlendingOut     // BlendOut 开始时
OnMontageBlendedIn       // BlendIn 完成时
OnMontageEnded           // Montage 完全停止时
OnMontageSectionChanged  // Section 切换时
OnAllMontageInstancesEnded // 所有 Montage 停止时
```

### BranchingPoint（分支点）

BranchingPoint 是 Montage 中的特殊标记，在 Tick 到该时间点时触发事件：

```
Montage "Attack":
  0.0s ───────────── 0.5s ───────────── 1.0s
                          ↑
                    BranchingPoint: "CanChainNextCombo"
                    在此时间点检查是否输入了下一个连击
```

### Montage 与 SyncGroup

Montage 可以与其他动画资产同步：

```cpp
// 让 Montage 跟随另一个 AnimInstance 中的 Montage
MontageSync_Follow(MyMontage, OtherAnimInstance, OtherMontage);
MontageSync_StopFollowing(MyMontage);
```

---

## 3.3 Inertialization & Dead Blending：无抖动过渡的秘密

### 问题：为什么普通混合会有抖动？

```
普通 Crossfade:
  Anim A (走路)  ████████░░░░░░░░
  Anim B (跑步)  ░░░░░░░░████████
  
问题：走路和跑步的脚部位置在混合中间点可能穿透地面
     因为两个动画的骨骼位置被简单地线性插值
```

### Inertialization 的工作原理

```
Inertialization:
  Anim A (走路)  ████████           ← 突然切断
  Anim B (跑步)           █████████ ← 立即开始
                  ↑
           捕获 Anim A 的姿态差异
           对差异应用衰减，叠加到 Anim B 上
           几帧后衰减到 0，完全过渡到 Anim B
```

**源码中的核心数据结构**（`AnimNode_Inertialization.h`）：

```cpp
// 每骨骼存储差异的方向和速度
TArray<FVector3f> BoneTranslationDiffDirection;  // 位移差异的方向
TArray<float>      BoneTranslationDiffMagnitude;  // 位移差异的大小
TArray<float>      BoneTranslationDiffSpeed;      // 位移差异的速度

TArray<FVector3f> BoneRotationDiffAxis;           // 旋转差异的轴
TArray<float>      BoneRotationDiffAngle;          // 旋转差异的角度
TArray<float>      BoneRotationDiffSpeed;          // 旋转差异的速度
```

**三态状态机**：

```
Inactive ──(收到请求)──→ Pending ──(下一帧)──→ Active ──(时间到)──→ Inactive

Inactive: 什么都不做
Pending:  捕获当前姿态的快照（PrevPoseSnapshot/CurrPoseSnapshot）
Active:   每帧计算差异并衰减应用
          ApplyTo(Pose, Curves, Attributes) 将衰减后的差异叠加到新姿态
```

**Deficit 机制**：

当惯性混合请求频繁发生时（例如状态机快速切换），`InertializationDeficit` 会累积，减少后续混合的强度，防止姿态"融化"。

### Dead Blending 的工作原理

Dead Blending 是另一种思路（参考 https://theorangeduck.com/page/dead-blending）：

```
Dead Blending:
  1. 捕获 Anim A 在过渡点的速度（每骨骼）
  2. 用速度外推 Anim A 的姿态（"如果 A 继续播放会是什么姿态"）
  3. 对外推结果应用指数衰减（半衰期控制）
  4. 在外推动画和 Anim B 之间做标准 CrossFade

参数:
  ExtrapolationHalfLife:     衰减半衰期（默认值）
  ExtrapolationHalfLifeMin:  最小半衰期
  ExtrapolationHalfLifeMax:  最大半衰期
  自动根据速度方向与差异方向的关系调整衰减率
```

### 如何选择？

| | Inertialization | Dead Blending |
|---|---|---|
| 过渡期间活跃状态 | 只评估目标 | 评估两个 |
| 性能开销 | 较低 | 较高 |
| 效果 | 速度快但可能"飘" | 更可预测 |
| GDC 参考 | GDC 2018 "Inertialization" | "Dead Blending" 博客 |

### 如何触发惯性混合？

```cpp
// 方式 1: Montage 设置 BlendMode = Inertialization
Montage->BlendIn.SetBlendMode(EMontageBlendMode::Inertialization);

// 方式 2: 状态机过渡设置为 TLT_Inertialization

// 方式 3: 蓝图中调用
RequestSlotGroupInertialization(SlotGroupName, Duration, BlendProfile);

// 方式 4: 节点通过消息系统请求
// IInertializationRequester 消息从下游向上游传播
```

---

## 3.4 Cached Pose & Linked Anim Graph

### Cached Pose —— 一次计算，多处使用

```
SaveCachedPose "FullBody"
  └─ (复杂的混合树，计算量很大)

UseCachedPose "FullBody" (位置 A)  ← 直接获取缓存结果
UseCachedPose "FullBody" (位置 B)  ← 直接获取缓存结果
UseCachedPose "FullBody" (位置 C)  ← 直接获取缓存结果
```

**关键优化**：多个 `UseCachedPose` 引用同一个 `SaveCachedPose` 时，只有权重最大的那一个会实际执行 Update，其他共享结果。

**跳过的 Update 通知**：当某路 Update 被跳过时，通过 `FCachedPoseSkippedUpdateHandler` 消息通知惯性混合等需要感知此信息的节点。

### Linked Anim Graph —— 动画蓝图复用

```
MainAnimBP
  ├─ StateMachine (Locomotion)
  └─ LinkedAnimGraph → "UpperBodyAnimBP"
       ├─ InputPose: 传入下半身姿态
       └─ 独立的上半身动画逻辑

UpperBodyAnimBP
  ├─ LinkedInputPose "BasePose"  ← 接收传入的姿态
  ├─ StateMachine (UpperBody)
  └─ ... (叠加层混合)
```

**属性传播**：

```cpp
// MainAnimBP 中的变量自动复制到 LinkedAnimGraph 的实例
// 通过 FAnimNode_CustomProperty::PropagateInputProperties()
// SourceProperties (MainAnimBP) → DestProperties (LinkedInstance)
```

### Anim Layer —— 运行时替换动画逻辑

```cpp
// 基础层：使用默认动画
LinkAnimClassLayers(BaseAnimLayerClass);

// 持枪状态：切换到持枪层
LinkAnimClassLayers(HoldingWeaponAnimLayerClass);

// 受伤状态：切换到受伤层
LinkAnimClassLayers(InjuredAnimLayerClass);
```

**层分组**：同一 Group 的层共享同一个链接实例（状态保持），不同 Group 的层各自独立。

---

## 3.5 同步系统与曲线系统

### 同步系统

**核心问题**：如何让多个动画资产保持同步（例如：左脚动画和右脚动画的节奏一致）？

**解决方案**：

```
同步组 "FootstepSync":
  Leader:   AnimSequence "Walk_Body"     (主导节奏)
  Follower: AnimSequence "Walk_LeftFoot"  (跟随 Body 的进度)
  Follower: AnimSequence "Walk_RightFoot" (跟随 Body 的进度)
```

**同步方式**：

| 方式 | 说明 |
|------|------|
| `DoNotSync` | 独立播放，各管各的 |
| `SyncWithLeader` | 跟随 Leader 的归一化时间 |
| `MarkerBased` | 基于同步标记对齐（更精确） |

**TickRecord 机制**：

资产播放节点不直接 Tick 动画，而是创建 TickRecord 提交给同步系统：

```cpp
// 在 UpdateAssetPlayer 中
CreateTickRecordForNode(Context, Sequence, bLooping, PlayRate, bIsEvaluator);
// → 创建 FAnimTickRecord，提交到 FAnimSync

// 在 UpdateAnimation 末尾统一 Tick
Sync.TickAssetPlayerInstances(*this, CurrentDeltaSeconds);
```

### 曲线系统

**曲线类型**：

| 类型 | 用途 |
|------|------|
| AttributeCurve | 通用动画曲线（可以被蓝图读取） |
| MaterialCurve | 驱动材质参数 |
| MorphTargetCurve | 驱动 MorphTarget（面部表情等） |

**曲线数据流**：

```
动画资产 (UAnimSequence/UBlendSpace)
  → Evaluate 阶段: 采样曲线值 → FBlendedCurve
  → PostEvaluate 阶段: 推送到组件
      ├─ MorphTarget 权重 → SkeletalMeshComponent::ActiveMorphTargets
      └─ Material 参数 → MaterialInstance::SetScalarParameterValue
```

**曲线压缩**：支持多种压缩方式以优化内存：
- `CompressedRichCurve` — 压缩但保留关键帧
- `UniformIndexable` — 均匀间距，可快速索引
- `UniformlySampled` — 均匀采样，最节省内存

---

# 附录 A: 实战案例走读

## 案例 1: 追踪一次 Montage_Play 的完整调用链

```
用户代码: AnimInstance->Montage_Play(AttackMontage, 1.0f)
  │
  ├─ UAnimInstance::Montage_PlayInternal(Montage, BlendSettings, ...)
  │    ├─ 创建/获取 FAnimMontageInstance
  │    ├─ 设置 BlendIn (FAlphaBlend)
  │    ├─ 如果 bStopAllMontages → 停止其他 Montage
  │    ├─ 触发 OnMontageStarted 委托
  │    └─ 返回 Montage 长度
  │
  ├─ [下一帧] PreUpdate:
  │    ├─ Montage_UpdateWeight(DeltaSeconds)
  │    │    └─ 更新 FAlphaBlend，计算当前 Blend 权重
  │    ├─ Montage_Advance(DeltaSeconds)
  │    │    └─ 推进 MontagePosition
  │    └─ UpdateMontageEvaluationData()
  │         └─ 创建 FMontageEvaluationState，复制到 Proxy
  │
  ├─ [同一帧] Update:
  │    └─ AnimGraph 遍历到 Slot 节点
  │         └─ Slot 节点检测到 MontageEvaluationData
  │              └─ 创建 Montage 的 TickRecord
  │
  ├─ [同一帧] Evaluate:
  │    └─ Slot 节点评估
  │         └─ SlotEvaluatePose()
  │              └─ 从 Montage 的 AnimSegment 采样动画数据
  │                   └─ UAnimSequence::GetAnimationPose()
  │                        └─ 解压骨骼轨道 → FCompactPose
  │              └─ Lerp(SourcePose, MontagePose, MontageWeight)
  │
  ├─ [同一帧] PostUpdate:
  │    └─ TriggerAnimNotifies()
  │         └─ 检查 Montage 中的 Notify 时间窗口
  │              └─ 触发符合条件的 AnimNotify
  │
  └─ [Montage 结束时]
       ├─ BlendOut 开始 → OnMontageBlendingOut
       └─ BlendOut 结束 → OnMontageEnded
```

## 案例 2: 追踪状态机的一次状态切换

```
初始: CurrentState = "Idle"

Update_AnyThread 被调用:
  │
  ├─ 获取当前状态信息
  │    StateInfo = MachineDescription->States[CurrentState]  // "Idle"
  │
  ├─ 检查过渡规则（按优先级）
  │    for (Transition in StateInfo.Transitions)
  │    {
  │        // Transition[0]: Idle → Walk, 条件: Speed > 0
  │        CanTakeDelegate 返回 true? → 检查 Speed 值
  │        → Speed = 150 > 0 → true!
  │        → 找到有效过渡
  │    }
  │
  ├─ TransitionToState(Context, TransitionInfo)
  │    ├─ PreviousState = "Idle" (索引 0)
  │    ├─ NextState = "Walk" (索引 1)
  │    ├─ 创建 FAnimationActiveTransitionEntry
  │    │    ├─ BlendOption = CubicInOut
  │    │    ├─ CrossfadeDuration = 0.2s
  │    │    └─ LogicType = TLT_StandardBlend
  │    ├─ 触发 "Idle" 的 EndNotify
  │    └─ 触发 "Walk" 的 StartNotify
  │
  ├─ 更新活动过渡
  │    UpdateTransitionStates(Context, ActiveTransition)
  │    ├─ 更新 Blend Alpha: 0.0 → ... → 1.0 (经过 CrossfadeDuration)
  │    ├─ 分别 Update 两个状态的子图
  │    │    StatePoseLinks["Idle"].Update(Context.FractionalWeight(1.0 - Alpha))
  │    │    StatePoseLinks["Walk"].Update(Context.FractionalWeight(Alpha))
  │    └─ Alpha >= 1.0 → 过渡完成
  │         ├─ CurrentState = "Walk"
  │         ├─ ElapsedTime = 0
  │         └─ 移除过渡条目
  │
  └─ 更新当前状态（如果还有活跃过渡则更新过渡中的两个状态）
```

---

# 附录 B: 常见面试/考察问题

| 问题 | 要点 |
|------|------|
| AnimInstance 和 AnimInstanceProxy 的区别？ | UObject vs USTRUCT，GameThread vs WorkerThread，Montage/Notify 管理 vs 图遍历执行 |
| FPoseLink 的作用？ | 节点间的间接链接，编译时可重组，运行时通过 LinkID 重连 |
| Update 和 Evaluate 为什么分离？ | 多线程调度灵活，支持 URO，状态切换不影响当前帧评估 |
| Inertialization vs Dead Blending？ | 前者捕获差异并衰减，后者外推并 CrossFade；前者更快，后者更可控 |
| Cached Pose 的优化原理？ | 多个引用共享一次计算结果，只有最大权重路径执行 Update |
| Montage 如何注入 AnimGraph？ | 通过 Slot 节点，在 Evaluate 时混合 Montage 姿态到输入姿态上 |
| 状态机过渡的三种逻辑类型？ | StandardBlend（同时更新两边）、Inertialization（只更新目标）、Custom（自定义图） |
| 为什么用双缓冲？ | Update/Evaluate 可能在不同线程执行，双缓冲确保读写不冲突 |

---

# 附录 C: 进一步阅读

### 引擎源码中值得深入阅读的部分

1. `FAnimInstanceProxy::UpdateAnimationNode_WithRoot()` — Update 遍历的核心
2. `FAnimNode_StateMachine::FindValidTransition()` — 状态机过渡选择
3. `FAnimNode_Inertialization::InitFrom()` 和 `ApplyTo()` — 惯性混合的数学实现
4. `FAnimNode_SaveCachedPose::PostGraphUpdate()` — 缓存姿态的后处理
5. `FAnimNode_LinkedAnimGraph::DynamicLink()` — 链接图的建立过程

### 外部参考资料

- GDC 2018: "Inertialization: High-Performance Animation Transitions" — David Bollo
- "Dead Blending" — https://theorangeduck.com/page/dead-blending
- UE5 官方文档: Animation Blueprints, State Machines, Montages
