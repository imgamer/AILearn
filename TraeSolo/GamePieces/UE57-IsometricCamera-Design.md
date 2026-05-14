# UE5.7 假正交透视等轴测相机设计（复古推箱子）

## 1) Goal

为复古斜 45° 推箱子游戏实现**"假正交透视"等轴测相机**：使用透视相机 + 极小 FOV + 高距离 + 固定 45° 俯角，使所有砖块在视觉上大小几乎一致（保留街机手感），同时拥有 3D 立体感（消除正交投影的"纸片感"）。相机作为关卡级固定 Actor，不跟随角色移动。

**核心思路**：正交相机大小一致但无立体感（纸片），透视相机有立体感但近大远小——"假正交透视"取两者之长：极小 FOV（8°~12°）使透视畸变 < 2% 肉眼不可辨，但 3D 深度信息完整保留。

---

## 2) Inputs

| 输入项 | 类型 | 说明 |
|---|---|---|
| `IsometricFOV` | `float` | 透视 FOV，推箱子推荐 **8°~12°**；越小越接近正交，8° 几乎无透视畸变 |
| `CameraDistance` | `float` | 相机距关卡中心的距离，推荐 **3000~5000** 单位，需配合 FOV 调整使游戏区域恰好填满画面 |
| `CameraPitch` | `float` | 俯角，经典等轴测 **35.264°**（`arctan(1/√2)`），推箱子也可用 **30°~45°** 微调 |
| `CameraYaw` | `float` | 水平旋转，经典等轴测 **45°** |
| `bConstrainAspectRatio` | `bool` | 固定 `false`，关闭宽高比约束避免黑边 |

---

## 3) Outputs

- 一个放置在关卡中的 `BP_IsometricCamera`（CameraActor 蓝图），作为所有 PlayerController 的 ViewTarget
- ThirdPersonCharacter 上不再有 SpringArm / CameraBoom / FollowCamera 组件
- 所有玩家共享同一固定等轴测视角，砖块大小视觉一致，3D 立体感保留

---

## 4) Assumptions

- 项目基于 UE5.7 第三人称模板（ThirdPersonCharacter 已含 `CameraBoom` + `FollowCamera`）
- 推箱子关卡为固定尺寸的网格地图，相机需覆盖整个游戏区域
- 经典等轴测方向：**45° Yaw / 35.264° Pitch**，可根据美术风格微调
- 多人模式下，每个 PlayerController 独立设置 ViewTarget，无需网络同步相机 Transform
- 推箱子游戏不需要相机跟随或缩放，固定视角即可

---

## 5) Implementation

### 5.1 Blueprint Recipe

#### Phase A：删除原生弹簧臂与相机

> 在 `BP_ThirdPersonCharacter` 蓝图编辑器中操作

| 步骤 | 操作 | 说明 |
|---|---|---|
| A1 | 打开 `BP_ThirdPersonCharacter` | 路径 `/Game/Characters/BP_ThirdPersonCharacter` |
| A2 | Components 面板选中 `CameraBoom`（SpringArm） | 它是 FollowCamera 的父组件 |
| A3 | **Delete** 删除 `CameraBoom` | 子组件 `FollowCamera` 一并删除 |
| A4 | 确认 Components 中不再有 `CameraBoom` 和 `FollowCamera` | — |
| A5 | Event Graph 中搜索所有 `CameraBoom` / `FollowCamera` 引用 | 常见于 `Get FollowCamera` / `Get CameraBoom` 节点 |
| A6 | 删除或断开所有相关引用节点 | 避免编译报错 |
| A7 | 编译保存蓝图 | 确保无编译错误 |

#### Phase B：创建假正交透视相机蓝图

> 新建 CameraActor 蓝图

| 步骤 | 操作 | 节点/属性 | 值 |
|---|---|---|---|
| B1 | 内容浏览器 → Blueprint Class → 父类选 `CameraActor` | — | — |
| B2 | 命名为 `BP_IsometricCamera` | — | — |
| B3 | 保存到 `/Game/Systems/IsometricCamera/` | — | — |
| B4 | 打开蓝图，选中 `CameraComponent` | — | — |
| B5 | Details → Camera Settings → **Projection** | `Perspective` | 关键：不选 Orthographic |
| B6 | Details → **Field of View** | `10.0` | 推箱子推荐 8°~12°，10° 为折中值，几乎无透视畸变但有立体感 |
| B7 | Details → **Constrain Aspect Ratio** | `☐ unchecked` | 关闭宽高比约束 |
| B8 | 编译保存 | — | — |

> **"假正交"原理**：FOV 越小，透视收敛越弱。10° FOV 下，近处与远处物体的视觉大小差异 < 2%，肉眼几乎无法分辨，但侧面/顶面的 3D 深度信息仍然保留——这就是"既有立体感又保持砖块大小一致"的核心。

#### Phase C：放置相机到关卡并设置 Transform

> 在关卡编辑器中操作

| 步骤 | 操作 | 值 |
|---|---|---|
| C1 | 将 `BP_IsometricCamera` 拖入关卡 | — |
| C2 | 设置 Location | `X=-3000, Y=-3000, Z=4200`（示例：距中心约 4200 单位，配合 10° FOV 覆盖约 20×20 砖块区域） |
| C3 | 设置 Rotation | `Pitch=-35.264, Yaw=45, Roll=0` |
| C4 | 设置 Scale | `X=1, Y=1, Z=1` |
| C5 | 视口切换到相机预览确认覆盖范围 | 视口菜单 → Pilot → 选择 BP_IsometricCamera |
| C6 | 微调距离/FOV 直到游戏区域恰好填满画面 | 距离↑ 或 FOV↑ = 看到更多区域；反之亦然 |

> **推箱子调参口诀**：FOV 先定 10°，再调距离让地图刚好填满画面。如果地图大就拉远，地图小就拉近。FOV 尽量不动，只调距离。

> **等轴测角度说明**：Pitch=-35.264° 是 `arctan(1/√2)` 的精确值，配合 Yaw=45° 可获得标准等轴测投影的三轴等比缩放效果。

#### Phase D：PlayerController 设置 ViewTarget

> 在 `BP_PlayerController` 的 Event Graph 中（多人模式推荐放在 Controller 而非 Character 中）

| 步骤 | 节点链 | 说明 |
|---|---|---|
| D1 | `Event BeginPlay` | — |
| D2 | → `Get Actor of Class` → `BP_IsometricCamera` | 在关卡中查找相机 Actor |
| D3 | → `Set View Target with Blend` | 平滑切换到等轴测相机 |
| D4 | New View Target = D2 的返回值 | — |
| D5 | Blend Time = `0.0` | 推箱子推荐硬切，无需过渡 |
| D6 | Blend Function = `VTBlend_Cubic` | 可选 |

**完整节点链：**

```
Event BeginPlay
  → Get Actor of Class (BP_IsometricCamera) ──→ New View Target
  → Self (PlayerController) ──────────────────→ Target
      → Set View Target with Blend
         - New View Target: [BP_IsometricCamera ref]
         - Blend Time: 0.0
         - Blend Function: VTBlend_Cubic
```

---

### 5.2 Replication Notes

| 关注点 | 说明 |
|---|---|
| **相机 Transform** | `BP_IsometricCamera` 是关卡静态 Actor，Transform 不需要 Replicate，所有客户端从关卡加载时即获得相同位置 |
| **ViewTarget 设置** | `Set View Target with Blend` 是 Client-only 操作，**不需要 RPC**，每个客户端在 BeginPlay 时独立设置 |
| **推箱子逻辑同步** | 砖块推动逻辑由 Server 判定并 Replicate 位置，与相机改造无关 |
| **多人场景** | 每个客户端的 PlayerController 独立指向同一个 `BP_IsometricCamera` 实例，相机固定不动，不存在同步问题 |
| **潜在风险** | 如果后续需要动态移动相机（如跟随某玩家），则需在 Server 端计算相机位置并 Replicate，当前设计无需此处理 |

---

### 5.3 Assets / Naming / Folders

```
/Game/
├── Characters/
│   └── BP_ThirdPersonCharacter          ← 修改：删除 CameraBoom + FollowCamera
├── Systems/
│   └── IsometricCamera/
│       └── BP_IsometricCamera           ← 新建：CameraActor 蓝图（假正交透视）
└── Maps/
    └── SokobanMap                       ← 修改：放置 BP_IsometricCamera 实例
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
- [ ] **T2** PIE 启动后画面呈现等轴测视角，所有砖块视觉大小一致（无近大远小）
- [ ] **T3** 砖块侧面可见 3D 立体感（非纸片效果），确认使用的是 Perspective 而非 Orthographic
- [ ] **T4** 角色移动时相机**不跟随**（固定在关卡位置）
- [ ] **T5** 游戏区域恰好填满画面，无大片空白或超出视野
- [ ] **T6** 窗口缩放后画面无黑边（Constrain Aspect Ratio 已关闭）
- [ ] **T7** FOV 值在 8°~12° 范围内，近远砖块大小差异肉眼不可辨

### 多人测试（PIE 多客户端 / Dedicated Server）

- [ ] **T8** 2 人 PIE：两个客户端均显示等轴测视角
- [ ] **T9** 客户端 1 推动砖块，客户端 2 能看到砖块移动（逻辑同步正常）
- [ ] **T10** 两个客户端的相机视角完全一致（无偏移/抖动）
- [ ] **T11** Dedicated Server 模式下，客户端连接后自动切换到等轴测视角

### 边界测试

- [ ] **T12** 角色移动到关卡边缘，仍在相机可视范围内
- [ ] **T13** 角色被击杀/重生后，相机视角不重置为默认第三人称
- [ ] **T14** 多次 BeginPlay（关卡重启）后，ViewTarget 仍正确指向 `BP_IsometricCamera`
- [ ] **T15** 关卡中仅放置一个 `BP_IsometricCamera` 实例（`Get Actor of Class` 只返回第一个）
- [ ] **T16** 对比测试：切换到 Orthographic 投影确认"纸片感"，再切回 Perspective+小FOV 确认立体感恢复
