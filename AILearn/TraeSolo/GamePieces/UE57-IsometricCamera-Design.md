# UE5.7 固定等轴测相机改造设计

## 1) Goal

将 ThirdPersonCharacter 原生的弹簧臂跟随相机，改造为**关卡级固定等轴测 3D 透视相机**。相机不挂载在角色上，而是作为独立 Camera Actor 放置在关卡中，所有客户端共享同一视角。

---

## 2) Inputs

| 输入项 | 类型 | 说明 |
|---|---|---|
| `IsometricFOV` | `float` | 透视 FOV，推荐 10°~12°，越小越接近正交/等轴测观感 |
| `CameraLocation` | `FVector` | 关卡中相机世界坐标（如 X=-2000, Y=-2000, Z=2500） |
| `CameraRotation` | `FRotator` | 相机朝向旋转（如 Pitch=-35°, Yaw=45°, Roll=0） |
| `bConstrainAspectRatio` | `bool` | 固定为 `false`，关闭宽高比约束 |

---

## 3) Outputs

- 一个放置在关卡中的 `BP_IsometricCamera` Actor，作为所有 PlayerController 的 ViewTarget
- ThirdPersonCharacter 上不再有 SpringArm / CameraBoom / FollowCamera 组件
- 所有玩家共享同一固定等轴测视角

---

## 4) Assumptions

- 项目基于 UE5.7 第三人称模板（ThirdPersonCharacter 已含 `CameraBoom` + `FollowCamera`）
- 关卡中只有一个主相机视角（如需多视角切换，需额外扩展）
- 等轴测方向采用经典 **45° Yaw / 35.264° Pitch**（等轴测标准角），可根据美术需求微调
- 多人模式下，每个 PlayerController 独立设置 ViewTarget，无需网络同步相机 Transform

---

## 5) Implementation

### 5.1 Blueprint Recipe

#### Phase A：删除原生弹簧臂与相机

> 在 `BP_ThirdPersonCharacter` 蓝图编辑器中操作

| 步骤 | 操作 | 说明 |
|---|---|---|
| A1 | 打开 `BP_ThirdPersonCharacter` | 路径 `/Game/Characters/BP_ThirdPersonCharacter` |
| A2 | 在 Components 面板选中 `CameraBoom`（SpringArm） | 它是 FollowCamera 的父组件 |
| A3 | **Delete** 删除 `CameraBoom` | 子组件 `FollowCamera` 会一并被删除 |
| A4 | 确认 Components 中不再有 `CameraBoom` 和 `FollowCamera` | — |
| A5 | 打开 Event Graph，搜索所有对 `CameraBoom` / `FollowCamera` 的引用 | 常见于 `Get FollowCamera` / `Get CameraBoom` 节点 |
| A6 | 删除或断开所有相关引用节点 | 避免编译报错 |
| A7 | 编译保存蓝图 | 确保无编译错误 |

#### Phase B：创建等轴测相机蓝图

> 新建 Camera Actor 蓝图

| 步骤 | 操作 | 节点/属性 | 值 |
|---|---|---|---|
| B1 | 内容浏览器右键 → Blueprint Class → 搜索 `CameraActor` → 选择为父类 | — | — |
| B2 | 命名为 `BP_IsometricCamera` | — | — |
| B3 | 保存到 `/Game/Systems/IsometricCamera/` | — | — |
| B4 | 打开 `BP_IsometricCamera`，选中 `CameraComponent`（自动包含） | — | — |
| B5 | Details 面板 → Camera Settings → **Projection** | `Perspective` | 不选 Orthographic |
| B6 | Details → **Field of View** | `11.0` | 10~12° 范围，11° 为折中推荐值 |
| B7 | Details → **Constrain Aspect Ratio** | `☐ unchecked` | 关闭宽高比约束 |
| B8 | Details → **Aspect Ratio** | （灰显，忽略） | 关闭后此值不生效 |
| B9 | 编译保存 | — | — |

#### Phase C：放置相机到关卡并设置 Transform

> 在关卡编辑器中操作

| 步骤 | 操作 | 值 |
|---|---|---|
| C1 | 将 `BP_IsometricCamera` 从内容浏览器拖入关卡 | — |
| C2 | 设置 Location | `X=-2000, Y=-2000, Z=2500`（示例值，根据关卡大小调整） |
| C3 | 设置 Rotation | `Pitch=-35.264, Yaw=45, Roll=0`（经典等轴测角度） |
| C4 | 设置 Scale | `X=1, Y=1, Z=1` |
| C5 | 在视口中确认相机朝向覆盖游戏区域 | 可切换到该相机预览：视口菜单 → Pilot → 选择 BP_IsometricCamera |

> **等轴测角度说明**：Pitch=-35.264° 是 `arctan(1/√2)` 的精确值，配合 Yaw=45° 可获得标准等轴测投影的三轴等比缩放效果。FOV 越小，透视畸变越少，越接近正交投影。

#### Phase D：PlayerController 设置 ViewTarget

> 在 `BP_ThirdPersonCharacter` 或 `BP_PlayerController` 的 Event Graph 中

| 步骤 | 节点链 | 说明 |
|---|---|---|
| D1 | `Event BeginPlay` | — |
| D2 | → `Get Player Controller`（Index=0） | 获取本地 PlayerController |
| D3 | → `Set View Target with Blend` | 平滑切换到等轴测相机 |
| D4 | New View Target = `Get Actor of Class` → `BP_IsometricCamera` | 在关卡中查找相机 Actor |
| D5 | Blend Time = `0.0`（硬切）或 `1.0`（淡入） | 推荐硬切 |
| D6 | Blend Function = `VTBlend_Cubic` | 可选，影响过渡曲线 |

**完整节点链：**

```
Event BeginPlay
  → Get Actor of Class (BP_IsometricCamera) ──→ New View Target
  → Get Player Controller (0) ──────────────→ Target
      → Set View Target with Blend
         - New View Target: [BP_IsometricCamera ref]
         - Blend Time: 0.0
         - Blend Function: VTBlend_Cubic
```

> **多人模式变体**：如果每个客户端需要独立设置，将此逻辑放在 PlayerController 的 `Event BeginPlay` 中，而非 Character 中。这样每个连接的客户端都会执行一次。

---

### 5.2 Replication Notes

| 关注点 | 说明 |
|---|---|
| **相机 Transform** | `BP_IsometricCamera` 是关卡静态 Actor，Transform 不需要 Replicate。所有客户端从关卡加载时即获得相同位置。 |
| **ViewTarget 设置** | `Set View Target with Blend` 是 Client-only 操作（PlayerController 本地执行），**不需要 RPC**。每个客户端在 BeginPlay 时独立设置自己的 ViewTarget。 |
| **角色移动同步** | 角色移动仍由 CharacterMovementComponent 处理，与相机改造无关，无需修改。 |
| **多人场景** | 每个客户端的 PlayerController 独立指向同一个 `BP_IsometricCamera` 实例。由于相机固定不动，不存在同步问题。 |
| **潜在风险** | 如果后续需要动态移动相机（如跟随某玩家），则需在 Server 端计算相机位置并 Replicate，当前设计无需此处理。 |

---

### 5.3 Assets / Naming / Folders

```
/Game/
├── Characters/
│   └── BP_ThirdPersonCharacter          ← 修改：删除 CameraBoom + FollowCamera
├── Systems/
│   └── IsometricCamera/
│       └── BP_IsometricCamera           ← 新建：CameraActor 蓝图
└── Maps/
    └── ThirdPersonMap                   ← 修改：放置 BP_IsometricCamera 实例
```

| 资产 | 类型 | 操作 | 命名 |
|---|---|---|---|
| `BP_IsometricCamera` | CameraActor Blueprint | **新建** | `BP_IsometricCamera` |
| `BP_ThirdPersonCharacter` | Character Blueprint | **修改** | 删除弹簧臂+相机组件 |
| 关卡实例 | Level | **修改** | 放置相机 Actor |

---

## 6) Test Checklist

### 单人测试（PIE）

- [ ] **T1** 编译 `BP_ThirdPersonCharacter` 无报错，无残留 CameraBoom/FollowCamera 引用
- [ ] **T2** PIE 启动后，画面呈现等轴测视角（无透视畸变、三轴等比）
- [ ] **T3** 角色移动时相机**不跟随**（固定在关卡位置）
- [ ] **T4** 角色始终在画面可见区域内（检查相机位置/角度是否覆盖游戏区域）
- [ ] **T5** 窗口缩放后画面不出现黑边（Constrain Aspect Ratio 已关闭）
- [ ] **T6** FOV 值在 10°~12° 范围内，观感接近等轴测而非广角透视

### 多人测试（PIE 多客户端 / Dedicated Server）

- [ ] **T7** 2 人 PIE：两个客户端均显示等轴测视角
- [ ] **T8** 客户端 1 移动角色，客户端 2 能看到该角色移动（移动同步正常）
- [ ] **T9** 两个客户端的相机视角完全一致（无偏移/抖动）
- [ ] **T10** Dedicated Server 模式下，客户端连接后自动切换到等轴测视角

### 边界测试

- [ ] **T11** 角色移动到关卡边缘，仍在相机可视范围内
- [ ] **T12** 角色被击杀/重生后，相机视角不重置为默认第三人称
- [ ] **T13** 多次 BeginPlay（如关卡重启/无缝漫游）后，ViewTarget 仍正确指向 `BP_IsometricCamera`
- [ ] **T14** 如果关卡中意外存在多个 `BP_IsometricCamera` 实例，`Get Actor of Class` 只返回第一个——确认关卡中仅放置一个实例
