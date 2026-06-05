# Unreal Engine 5.8 Preview — `unreal-mcp-preview` 工具集完整参考

> 本文档汇总了 `unreal-mcp-preview` MCP 服务器在 UE 5.8 Preview 中暴露的全部 **20 个工具集 (Toolset)**，及其包含的所有工具 (Tool) 与中文用途说明。所有工具均通过 MCP 协议在 Cursor / Claude Code / Claude Desktop 等 MCP 客户端中调用，工具名形如 `mcp__unreal-mcp-preview__<toolset>_<method>`。
>
> **数据来源**：`list_toolsets` + `describe_toolset` 实时拉取（本会话中针对每个工具集独立调用，包含完整 input/output JSON Schema）。

---

## 概念与入门

### MCP 是什么？

MCP（Model Context Protocol）是一种让 AI 助手（如 Claude Code、Cursor）通过标准化协议调用外部工具的机制。`unreal-mcp-preview` 就是一个 MCP 服务器，它在 UE 编辑器内部运行，把虚幻引擎的编辑功能暴露为 AI 可调用的工具。

简单理解：**AI ↔ MCP 协议 ↔ UE 编辑器**，AI 不直接操作引擎，而是通过 MCP 工具间接完成关卡编辑、资产管理、蓝图开发等操作。

### Toolset（工具集） vs Tool（工具）

MCP 工具按**工具集**分组，每个工具集对应一个功能领域：

```
工具集 (Toolset)          工具 (Tool / Method)
─────────────────         ─────────────────────────
SceneTools          →     add_to_scene_from_asset
                          add_to_scene_from_class
                          remove_from_scene
                          find_actors
                          ...
ActorTools          →     get_actor_transform
                          set_actor_transform
                          add_component
                          ...
```

- **工具集**是一组相关工具的容器（类似"类"）
- **工具**是具体的操作方法（类似"方法"）

### 三个元工具（始终可用）

无论加载了哪些工具集，以下 3 个工具始终可见：

| 元工具 | 作用 | 何时使用 |
|---|---|---|
| `list_toolsets` | 列出所有可用工具集的名称和简介 | 想知道有哪些工具集时 |
| `describe_toolset` | 查看某个工具集的完整工具列表 + 每个工具的参数/返回值 JSON Schema | 使用工具前，先查参数格式 |
| `load_toolset` | 按需加载工具集。**加载后，其工具才可在下一轮对话中使用** | 首次使用某工具集前必须先加载 |

> **重要**：`load_toolset` 加载的工具集要在**下一轮对话**才能调用，同一轮内无法使用刚加载的工具。

### 为什么 `/mcp` 列表显示 111 个工具？

在 Claude Code 中输入 `/mcp` → 选择 `unreal-mcp-preview` → `list`，会看到约 **111 个工具**的扁平列表。这是把所有工具集的方法"打平"后逐条展示的结果：

```
3 个元工具（始终可见）
+ ~108 个已加载工具集中的具体方法
= ~111 个 MCP 工具
```

列表中的长名字如 `toolset_registry.toolsets.core.scene.SceneTools.trace_world` 就是 SceneTools 工具集中的 `trace_world` 方法——和本文档中各工具集章节里的工具一一对应。

### MCP 工具的完整调用名

在 MCP 客户端中，每个工具的全名遵循以下规则：

```
mcp__unreal-mcp-preview__<工具集路径>_<方法名>
```

例如：

| 文档中的引用 | MCP 完整工具名 |
|---|---|
| `SceneTools.find_actors` | `mcp__unreal-mcp-preview__toolset_registry_toolsets_core_scene_SceneTools_find_actors` |
| `ActorTools.set_actor_transform` | `mcp__unreal-mcp-preview__toolset_registry_toolsets_core_actor_ActorTools_set_actor_transform` |
| `AssetTools.save_assets` | `mcp__unreal-mcp-preview__toolset_registry_toolsets_core_asset_AssetTools_save_assets` |
| `BlueprintTools.create` | `mcp__unreal-mcp-preview__toolset_registry_toolsets_core_blueprint_BlueprintTools_create` |
| `MaterialTools.add_expression` | `mcp__unreal-mcp-preview__toolset_registry_toolsets_core_material_MaterialTools_add_expression` |

**特殊命名**：编辑器/会话类工具集名称不含 `toolset_registry` 前缀：

| 文档中的引用 | MCP 完整工具名 |
|---|---|
| `EditorAppToolset.GetCameraTransform` | `mcp__unreal-mcp-preview__ToolsetRegistry_EditorAppToolset_GetCameraTransform` |
| `LogsToolset.GetLogEntries` | `mcp__unreal-mcp-preview__ToolsetRegistry_LogsToolset_GetLogEntries` |
| `AgentSkillToolset.ListSkills` | `mcp__unreal-mcp-preview__ToolsetRegistry_AgentSkillToolset_ListSkills` |

> 实际使用中你不需要手动拼写完整名——AI 助手会自动解析；但如果你在 `/mcp` 列表中查找或在日志中排查，知道这个对应关系会有帮助。

### 如何阅读本文档

1. **先看「关键能力与限制」**——快速了解能做什么、不能做什么
2. **按功能领域翻到对应工具集章节**——每个章节有工具列表和中文说明
3. **需要精确参数时**——调用 `describe_toolset` 查看完整 JSON Schema
4. **不知道用哪个工具集时**——查顶部目录表，按分类定位

---

## 目录

| 分类 | 工具集 | 简介 |
|---|---|---|
| 编辑器/会话 | [EditorAppToolset](#1-editorapptoolset) | 编辑器状态、相机、内容浏览器、截图 |
| 编辑器/会话 | [LogsToolset](#2-logstoolset) | 输出日志读取与 Verbosity 控制 |
| 编辑器/会话 | [AgentSkillToolset](#3-agentskilltoolset) | 工程内 Agent Skill 资产管理 |
| 关卡/场景 | [SceneTools](#4-scenetools) | 关卡加载、Actor 摆放、Outliner、相机、世界射线 |
| 关卡/场景 | [ActorTools](#5-actortools) | Actor / 组件 / Transform / Tag 操作 |
| 关卡/场景 | [PrimitiveTools](#6-primitivetools) | 给 Actor 添加 Cube/Sphere/Cylinder/Cone |
| 通用资产 | [AssetTools](#7-assettools) | 文件夹、资产 CRUD、依赖/引用、磁盘 I/O |
| 通用资产 | [ObjectTools](#8-objecttools) | UObject/UClass 属性读写、子类搜索 |
| 蓝图 | [BlueprintTools](#9-blueprinttools) | Blueprint 资产、图表、变量、节点、事件分发器 |
| 数据资产 | [DataAssetTools](#10-dataassettools) | DataAsset 资产创建 |
| 数据资产 | [DataTableTools](#11-datatabletools) | DataTable 行/列读写、Schema 管理 |
| 数据资产 | [CurveTableTools](#12-curvetabletools) | CurveTable 行/Key 管理 |
| 数据资产 | [StringTableTools](#13-stringtabletools) | StringTable Key/Value 与本地化 |
| 材质 | [MaterialTools](#14-materialtools) | Material 图表、表达式节点、参数分组 |
| 材质 | [MaterialInstanceTools](#15-materialinstancetools) | MaterialInstanceConstant 参数覆盖 |
| 网格 | [StaticMeshTools](#16-staticmeshtools) | StaticMesh LOD/Nanite/Collision/Material |
| 网格 | [SkeletalMeshTools](#17-skeletalmeshtools) | SkeletalMesh 骨骼/Socket/Material/物理资产 |
| 纹理 | [TextureTools](#18-texturetools) | Texture 尺寸查询（仅一项） |
| AI | [BehaviorTreeTools](#19-behaviortreetools) | 行为树节点遍历（只读） |
| 编程 | [ProgrammaticToolset](#20-programmatictoolset) | 沙箱 Python 批量调用工具 |

---

## 关键能力与限制

### 可以做
- **关卡编辑**：加载/卸载关卡、放置/删除 Actor、修改 Transform/Tag/Component、移动 Outliner 文件夹、控制视口相机、截图、可见性查询、屏幕↔世界坐标转换、射线检测。
- **资产管理**：增删改查任意资产 / 文件夹、复制 / 移动 / 重命名、依赖与引用查询、source-control 状态检查、读写工程内文本文件。
- **蓝图开发**：创建/重父化 Blueprint、增删改图表节点（事件、函数、宏、Cast、Math、Branch、Loop 等数千种），声明成员变量 / 局部变量 / 事件分发器，连/断引脚，编译，绑定组件事件，Replicated/RepNotify 设置。
- **数据驱动**：DataTable / CurveTable / StringTable / DataAsset 全套增删改查（DataTable 通过 JSON 字符串批量写入）。
- **材质流水线**：完整 Material 图表构建（添加 Expression、连接 Pin、组管理、重新编译），MaterialInstanceConstant 参数（Scalar/Vector/Texture/StaticSwitch）覆盖。
- **网格资产**：StaticMesh 的 Nanite 开关、LOD 生成、凸包碰撞、材质槽；SkeletalMesh 的骨骼/Socket/形变目标/物理资产/材质查询与修改。
- **AI**：行为树**只读**遍历（节点列表、深度、子节点、装饰器、Blackboard、子树）。
- **编辑器编程**：通过 `ProgrammaticToolset.execute_tool_script` 在沙箱 Python 中批量调用上述工具，减少多轮通讯。

### ❗ 不能做（当前缺失）
- **UMG / Slate / Widget**：**没有任何 Widget Tree 构建工具**。BlueprintTools 只能操作蓝图图表（变量、函数、事件），无法添加 / 排版子控件、无法访问 `WidgetTree.construct_widget`。要做 UMG 必须在编辑器内手动拖拽，或在沙箱外通过 Editor Utility Widget / `unreal` Python API 完成（`ProgrammaticToolset` 沙箱**不允许 `import unreal`**，只允许 `json / math / datetime / copy / re` 等纯标准库模块）。
- **行为树编辑**：BehaviorTreeTools 只有 `get_*` / `list_*`，无任何 Add/Set/Remove。
- **动画蓝图、Niagara、Sequencer、Landscape、Foliage、Audio Mixer、Chaos、Control Rig、World Partition** 等专门系统暂无独立 toolset；只能通过通用的 ObjectTools 设置 UObject 属性以做有限调整。
- **C++ 类与模块**：仅可读写工程目录下的源文件（AssetTools.write_file），无重编译/热重载工具。
- **PIE / Play in Editor 控制**：未提供启动 / 停止 PIE 的工具。

---

## 1. EditorAppToolset

**职责**：查询和修改 Unreal Editor 状态（控制台变量、相机、内容浏览器、资产/Actor 选择、截图）。

| 工具 | 说明 |
|---|---|
| `CaptureAssetImage` | 截取资产缩略图；传空字符串或当前关卡路径则截取主视口画面。可选 `bShowUI` 隐藏选择框/Gizmo。 |
| `CaptureEditorImage` | 截取整个编辑器应用窗口（用户视角）。 |
| `FocusOnActors` | 将关卡视口相机对准指定 Actors（PIE 期间不可用）。 |
| `GetCameraTransform` / `SetCameraTransform` | 读取/设置主视口相机的位置与旋转。 |
| `GetContentBrowserPath` / `SetContentBrowserPath` | 读取/导航当前内容浏览器路径。 |
| `GetOpenAssets` | 当前已打开的资产编辑器列表。 |
| `GetSelectedActors` / `SelectActors` | 关卡中选中的 Actors。 |
| `GetSelectedAssets` / `SelectAssets` | 内容浏览器中选中的资产。 |
| `GetVisibleActors` | 关卡中 Bounding Box 与当前视锥相交的全部 Actors。 |
| `OpenEditorForAsset` | 打开指定资产的资产编辑器。 |
| `ScreenCoordsToWorld` | 屏幕归一化坐标 → 世界坐标射线命中点。 |
| `WorldPosToScreenCoords` | 世界坐标 → 屏幕归一化坐标。 |
| `SearchCVars` | 搜索包含指定字符串的控制台变量。 |

---

## 2. LogsToolset

**职责**：读取 Unreal 输出日志、调整 Log Category 的 Verbosity。

| 工具 | 说明 |
|---|---|
| `GetLogEntries` | 按 Category / 正则 / 数量上限读取本次会话日志条目（默认上限 1000）。 |
| `GetLogCategories` | 列出已注册的 LogCategory（可子串过滤）。 |
| `GetVerbosity` / `SetVerbosity` | 读取/设置某个 Category 的 Verbosity（NoLogging~VeryVerbose）。 |

---

## 3. AgentSkillToolset

**职责**：管理工程内的 AgentSkill 资产（用于把工具集编排为可复用技能）。

| 工具 | 说明 |
|---|---|
| `ListSkills` | 工程内所有 AgentSkill 路径 → 描述的映射。 |
| `GetSkills` | 批量获取若干 AgentSkill 的详细 instructions 与依赖 toolsets。 |
| `CreateSkill` | 新建 AgentSkill（**需用户明确允许后调用**）。 |
| `UpdateSkill` | 修改已有 AgentSkill（**需用户明确允许后调用**）。 |

---

## 4. SceneTools

**职责**：操作当前打开的关卡——加载、放置/删除 Actor、控制相机、组织 Outliner 文件夹、世界射线检测。

| 工具 | 说明 |
|---|---|
| `get_current_level` / `load_level` | 查询/加载关卡资产。 |
| `add_to_scene_from_asset` | 用资产路径（蓝图/Mesh）实例化 Actor，可指定 Transform、父级、贴地。 |
| `add_to_scene_from_class` | 用 UClass 实例化 Actor（同上）。 |
| `remove_from_scene` | 从关卡删除 Actor。 |
| `find_actors` | 按 root、glob 模式、类型、Tag 多条件搜索 Actor。 |
| `get_folders` / `get_actors_in_folder` | Outliner 文件夹列表 / 文件夹内 Actor。 |
| `set_actor_folder` | 把 Actor 移到指定 Outliner 文件夹（不存在则隐式创建）。 |
| `rename_folder` / `delete_folder` | 重命名/删除 Outliner 文件夹（保留子文件夹与 Actor）。 |
| `trace_world` | 从 start 到 end 进行射线检测，返回与首个命中点的距离。 |

---

## 5. ActorTools

**职责**：检查与修改 Actor —— Transform、Label、父子组件、Tag、组件增删。

| 工具 | 说明 |
|---|---|
| `get_actor_transform` / `set_actor_transform` | 世界空间 Transform 读写。 |
| `get_actor_bounds` | 世界空间 AABB。 |
| `get_label` / `set_label` | 编辑器内显示名。 |
| `get_tags` / `has_tag` / `add_tag` / `remove_tag` | Actor 标签操作。 |
| `get_root_component` | 取根 SceneComponent（**注意：灯光 Intensity/LightColor 等在 Component 上，不在 Actor 上**）。 |
| `get_components` | 列出 Actor 上的组件，可按类型过滤。 |
| `get_component_actor` | 由 Component 反查所属 Actor。 |
| `get_parent_component` / `set_parent_component` | 查询/修改 SceneComponent 的父级（reparent / detach）。 |
| `add_component` / `remove_component` | 给 Actor 或 Actor 蓝图增删组件。 |

---

## 6. PrimitiveTools

**职责**：往 Actor 上添加预设几何 StaticMeshComponent —— 用于快速搭建占位或基础形状。

| 工具 | 说明 |
|---|---|
| `add_cube` | 立方体（默认 100×100×100）。 |
| `add_sphere` | 球体（默认 radius=50）。 |
| `add_cylinder` | 圆柱（默认 radius=50, height=100）。 |
| `add_cone` | 圆锥（默认 radius=50, height=100）。 |

所有方法都返回 `StaticMeshComponent` 引用，并可指定相对 Transform。

---

## 7. AssetTools

**职责**：工程资产 / 文件夹的 CRUD 与磁盘 I/O。

| 工具 | 说明 |
|---|---|
| `exists` / `can_edit_asset` / `is_dirty` | 资产/文件夹是否存在、是否可编辑（源控状态）、是否有未保存修改。 |
| `create_folder` / `delete` / `move` / `duplicate` | 文件夹与资产的增删 / 改名 / 复制。 |
| `load_asset` | 把内容路径加载为 UObject 引用。 |
| `save_assets` | 保存指定路径资产；传空数组保存所有 dirty 资产。 |
| `find_assets` | 在文件夹中按名称子串 / 类型递归搜索资产。 |
| `list_folders` | 列举子文件夹。 |
| `get_dependencies` / `get_referencers` | 资产依赖图查询。 |
| `get_plugin_content_paths` | 本工程插件的内容根路径列表。 |
| `read_file` / `write_file` | 在工程目录范围内读写纯文本（含源码、配置）；不允许逃逸出工程目录。 |

---

## 8. ObjectTools

**职责**：通用 UObject / UClass 属性反射 —— 列出属性、批量读写（JSON）、子类搜索。是其他特化 toolset 无法覆盖时的兜底通道。

| 工具 | 说明 |
|---|---|
| `get_class` | 取对象的 UClass。 |
| `list_properties` | 列出对象上的可访问属性名。 |
| `get_properties` / `set_properties` | 按 camelCase 属性名批量读/写，值用 JSON 字符串表达（嵌套结构、子对象通过 class 引用实例化）。 |
| `search_subclasses` | 找 base_class 的全部子类，支持子串过滤——用于发现可用的 Actor/Component/Asset 类型。 |

> 灯光示例：要拿到 `Intensity` 必须先 `ActorTools.get_root_component(light)` 取 PointLightComponent，再 `ObjectTools.get_properties(component, ["intensity", "lightColor"])`。

---

## 9. BlueprintTools

**职责**：完整的 Blueprint 资产/图表操作 —— 资产创建、变量、函数图、事件分发器、节点增删连断、引脚值、编译、组件事件绑定、Replicated 设置。

### 资产与图表
| 工具 | 说明 |
|---|---|
| `create` | 在文件夹新建 Blueprint（指定 asset_type）。 |
| `get_parent` / `set_parent` | 读/改父类（改后需 `compile_blueprint`）。 |
| `compile_blueprint` | 完成图表修改后编译。 |
| `get_default_object` | 取 CDO（用于在编译后让 ActorTools 操作蓝图内 Actor）。 |
| `list_graphs` / `get_graph` / `get_graph_info` | 列出 / 取 / 查看图表（EventGraph、Function、Macro 等）。 |
| `add_function_graph` / `remove_function_graph` | 新增/删除函数图。 |

### 变量
| 工具 | 说明 |
|---|---|
| `list_variables` | 列成员或局部变量（传 graph 参数则为局部）。 |
| `add_variable` | 加基础类型变量：`bool/int/float/byte/string/name/text/Vector/Rotator/Transform/Vector2D/LinearColor`。 |
| `add_object_variable` | 加 UObject 引用类型变量。 |
| `add_struct_variable` | 加任意 UStruct 类型变量（包括 HitResult、GameplayTag 等引擎结构）。 |
| `remove_variable` | 删除成员/局部变量。 |
| `set_variable_instance_editable` | 是否允许实例覆盖。 |
| `get_variable_replication` / `set_variable_replication` | 复制模式（None / Replicated / RepNotify；RepNotify 会自动生成 OnRep_）。 |

### 函数 / 事件分发器参数
| 工具 | 说明 |
|---|---|
| `add_function_param` | 给函数图或事件分发器加输入/输出参数（基础类型；事件分发器不支持输出）。 |
| `add_object_function_param` | UObject 引用类型参数。 |
| `add_struct_function_param` | UStruct 类型参数。 |
| `remove_function_param` | 删除参数。 |
| `add_event_dispatcher` / `list_event_dispatchers` | 添加/列出事件分发器。 |

### 节点与连接
| 工具 | 说明 |
|---|---|
| `find_node_types` | 在指定 graph 中搜索可用节点类型（按 type_id 子串）。 |
| `find_node_categories` | 列出节点分类（用于探索可用功能）。 |
| `create_node` | 加节点：type_id 如 `Development|PrintString`、`Utilities|Operators|Add`、`Utilities|FlowControl|ForLoop`、`Default|EventDispatcherOnDamaged`。 |
| `delete_node` | 删除节点。 |
| `get_nodes` / `get_node_info` | 取图表的所有节点 / 单节点详情。 |
| `set_node_position` | 移动节点。 |
| `connect_pins` / `break_pins` | 连/断引脚（用 PinID）。 |
| `get_pin_value` / `set_pin_value` | 读/写输入引脚默认值。 |

### 组件事件与 Create Event
| 工具 | 说明 |
|---|---|
| `list_component_events` | 列出 Component 上可绑的 delegate（如 `OnComponentBeginOverlap`）。 |
| `add_component_bound_event` | 在 EventGraph 上添加 Component Bound Event 节点。 |
| `list_compatible_event_functions` | 列出 Create Event 节点可绑的函数。 |
| `get_create_event_function` / `set_create_event_function` | 读/绑 Create Event 节点的目标函数。 |

> **限制提醒**：BlueprintTools 仅操作蓝图**图表与变量**，不能操作 `UserWidget` 的 `WidgetTree`（即 UMG 的可视层级）。

---

## 10. DataAssetTools

| 工具 | 说明 |
|---|---|
| `create` | 在指定文件夹新建 DataAsset（asset_type 指明具体 UDataAsset 子类）。 |

（修改 DataAsset 字段请使用 `ObjectTools.set_properties`。）

---

## 11. DataTableTools

**职责**：DataTable 资产的 Schema 与行数据 CRUD。

| 工具 | 说明 |
|---|---|
| `search_row_structs` | 找可作为 schema 的结构（TableRowBase 子类）。 |
| `create` | 用指定结构创建 DataTable。 |
| `get_schema` | 返回列定义（JSON 字符串）。 |
| `list_rows` | 列出所有 row 名。 |
| `add_rows` / `remove_rows` / `rename_rows` | 增 / 删 / 改名（批量）。 |
| `get_rows` | 批量获取行 → JSON（camelCase 字段名）。 |
| `set_rows` | 批量更新行字段（JSON `{rowName: {field: value}}`），未指定字段保持不变。 |

---

## 12. CurveTableTools

**职责**：CurveTable（多条曲线 / 行）的 Key 编辑。

| 工具 | 说明 |
|---|---|
| `create` | 新建 CurveTable。 |
| `list_rows` | 列所有曲线行名。 |
| `add_row` | 新增一行（可指定默认采样值）。 |
| `rename_row` / `remove_row` | 改名 / 删除一行。 |
| `get_keys` / `set_keys` | 取/替换一行的全部关键帧（`{time,value}` 数组）。 |
| `add_key` | 给行追加一个关键帧。 |

---

## 13. StringTableTools

**职责**：StringTable（本地化 Source String 表）。

| 工具 | 说明 |
|---|---|
| `create` | 新建 StringTable。 |
| `get_namespace` / `get_table_id` | 命名空间 / 表 ID（由包路径派生，供文本引用与本地化使用）。 |
| `list_keys` | 列所有 Key。 |
| `get_entry` / `set_entry` / `remove_entry` | Key/Value CRUD（set 同时支持插入与更新）。 |

---

## 14. MaterialTools

**职责**：Material 资产的图表构建（添加 Expression、连接 / 断开、输出属性绑定、参数组管理、重新编译）。

| 工具 | 说明 |
|---|---|
| `create` | 新建空 Material（注意：每次新建会增加 shader 编译耗时——优先建 MaterialInstance）。 |
| `recompile` | 一组图表修改完成后调用以触发 shader 与参数缓存重建。 |
| `layout_expressions` | 自动整理图中节点排版。 |
| `get_expressions` | 列出所有表达式节点。 |
| `add_expression` | 添加表达式节点（常见：Constant、ScalarParameter、VectorParameter、TextureObjectParameter、TextureSample、Add、Multiply、StaticSwitchParameter…）。 |
| `delete_expression` | 删除节点。 |
| `get_expression_input_names` | 取节点的输入引脚名（供 connect_expressions 使用）。 |
| `connect_expressions` / `disconnect_expressions` | 连接/断开两个 Expression 节点的输入引脚。 |
| `connect_to_output` / `disconnect_from_output` | 把 Expression 接到/断开 Material 的某个输出属性（MP_BaseColor / MP_Roughness / MP_EmissiveColor 等枚举）。 |
| `list_parameter_groups` | 列出材质中实际出现过的参数组名（空字符串代表未分组）。 |
| `rename_parameter_group` / `delete_parameter_group` | 改名/删除组（参数本身不删，仅清除组归属）。 |

---

## 15. MaterialInstanceTools

**职责**：MaterialInstanceConstant 的创建与参数覆盖（无需重新编译 shader）。

| 工具 | 说明 |
|---|---|
| `create` | 由 parent Material / MaterialInstance 派生新 MIC。 |
| `set_parent` | 改父材质。 |
| `clear_parameters` | 清除所有覆盖，恢复继承。 |
| `list_parameters` | 列出父材质暴露的参数（Scalar / Vector / Texture / StaticSwitch）。 |
| `get_scalar_parameter` / `set_scalar_parameter` | Scalar 参数读写。 |
| `get_vector_parameter` / `set_vector_parameter` | Vector 参数读写（LinearColor RGBA，可 >1 用于 HDR）。 |
| `get_texture_parameter` / `set_texture_parameter` | Texture 参数读写。 |
| `get_static_switch_parameter` / `set_static_switch_parameter` | Static Switch 读写（**修改会触发 shader 重新编译**）。 |

---

## 16. StaticMeshTools

**职责**：StaticMesh 资产的几何/LOD/Nanite/碰撞/材质管理。

| 工具 | 说明 |
|---|---|
| `is_nanite_enabled` / `set_nanite_enabled` | Nanite 开关（触发 mesh 重建；高面数模型才有显著收益）。 |
| `get_lod_count` | LOD 数量。 |
| `get_lod_thresholds` / `set_lod_thresholds` | 每个 LOD 切换的 screen-size 阈值（必须严格降序）。 |
| `generate_lods` | 按三角形保留比例（0~1）批量生成 LOD。 |
| `remove_lods` | 删除所有自动生成的 LOD，仅保留 LOD 0。 |
| `get_vertex_count` / `get_triangle_count` | 指定 LOD 的顶点/三角形数。 |
| `get_bounds` | 局部空间 AABB。 |
| `get_material_slots` / `get_material` / `set_material` | 材质槽枚举与按名读写（影响所有未覆盖的实例）。 |
| `generate_convex_collisions` | 生成凸包碰撞（hull 数量越多越精确但开销越大）。 |
| `remove_collisions` | 清空所有碰撞体。 |

---

## 17. SkeletalMeshTools

**职责**：SkeletalMesh 的骨骼、Socket、Morph Target、物理资产、材质查询/修改。

### 几何/LOD
| 工具 | 说明 |
|---|---|
| `get_lod_count` / `get_vertex_count` / `get_section_count` | LOD 数量、顶点数、Section 数。 |
| `get_bounds` | 参考姿态下的本地空间 BoxSphereBounds。 |

### 骨骼/Skeleton
| 工具 | 说明 |
|---|---|
| `get_skeleton` | 取绑定的 Skeleton 资产。 |
| `get_bone_names` | 全部骨骼名（层级顺序）。 |
| `get_bone_parent` / `get_bone_children` | 骨骼父/直接子查询。 |
| `get_morph_target_names` | Morph Target / Blend Shape 名列表。 |

### Socket
| 工具 | 说明 |
|---|---|
| `get_socket_names` | 所有 Socket 名。 |
| `add_socket` / `remove_socket` / `rename_socket` | Socket 增删改名（绑定到指定 bone）。 |
| `get_socket_bone` | Socket 挂载的父骨骼名。 |
| `get_socket_transform` / `set_socket_transform` | Socket 相对父骨骼的局部 Transform。 |

### 材质 / 物理
| 工具 | 说明 |
|---|---|
| `get_material_slots` / `get_material` / `set_material` | 材质槽枚举与按名读写。 |
| `get_physics_asset` / `assign_physics_asset` | 取/换绑物理资产（必须与骨架兼容）。 |

---

## 18. TextureTools

| 工具 | 说明 |
|---|---|
| `get_size` | 返回 Texture2D 的像素尺寸（宽 / 高）。 |

> 当前仅暴露了尺寸查询；其他纹理属性（压缩、sRGB、Mip、源数据）请使用 `ObjectTools` 读写。

---

## 19. BehaviorTreeTools

**职责**：**只读**遍历 BehaviorTree。无修改 API。

| 工具 | 说明 |
|---|---|
| `get_blackboard` | 取关联的 BlackboardData。 |
| `get_root_decorators` | 根节点上的 Decorator 列表。 |
| `list_nodes` | DFS 顺序展开所有节点（含根装饰器、composite、services、各子节点装饰器）。 |
| `get_node_depth` / `get_node_depths` | 节点深度（root = 0），可单查或与 list_nodes 顺序对应批量获取。 |
| `get_children` | 取 Composite 节点（Selector / Sequence 等）的直接子节点。 |
| `get_subtree` | RunBehavior task 引用的子行为树资产。 |

---

## 20. ProgrammaticToolset

**职责**：在受限沙箱里执行 Python 脚本，脚本可调用上述任意 toolset 工具，便于一次性批量执行（减少多轮 MCP 通讯）。

| 工具 | 说明 |
|---|---|
| `get_execution_environment` | **使用前必读**：返回沙箱说明 —— 允许的模块、入口规范（必须定义 `run() -> Dict[str, Any]`）、API 调用方式。 |
| `execute_tool_script` | 执行脚本。脚本必须有 `run()` 函数返回 dict；不允许 import 非白名单模块（如 `unreal` 模块**被禁用**）；语法错误、类型错误、未捕获异常会抛出。 |

> 写脚本前还要先查目标工具的 outputSchema —— 因为脚本里要解析它们的返回值。

---

## 调用约定速查

- **路径引用**：所有 UObject 参数以 `{"refPath": "/Game/.../Asset.Asset"}` 软路径形式传入。
- **Transform**：`{"location":{x,y,z}, "rotation":{pitch,yaw,roll}, "scale":{x,y,z}}`；未填字段在新建时等同 identity，在修改时等同“保持不变”。
- **属性 JSON**：`ObjectTools.set_properties(values=...)` 接受 JSON 字符串；字段名使用 camelCase；嵌套子对象用 class 引用实例化。
- **修改后保存**：资产修改后须 `AssetTools.save_assets([path])` 才会落盘；蓝图修改后须 `BlueprintTools.compile_blueprint`。

---

## 常用参数模式

### refPath —— 资产 / 对象引用

几乎所有工具都需要传入 UE 对象引用，统一格式为 `{"refPath": "<内容路径>"}`：

```
# 蓝图资产
{"refPath": "/Game/Blueprints/BP_MyActor.BP_MyActor"}

# 材质
{"refPath": "/Game/Materials/M_Base.M_Base"}

# 关卡中的 Actor 实例（由 add_to_scene 等返回）
{"refPath": "/Game/Maps/MyMap.MyMap:PersistentLevel.PointLight_0"}

# 组件（由 get_root_component / get_components 返回）
{"refPath": "/Game/Maps/MyMap.MyMap:PersistentLevel.PointLight_0.PointLightComponent0"}
```

> 内容路径 ≠ 磁盘路径。`/Game/` 是项目 Content 文件夹的虚拟根，不是 Windows 路径。

### Transform —— 位置 / 旋转 / 缩放

```json
{
  "location": {"x": 100, "y": 200, "z": 300},
  "rotation": {"pitch": 0, "yaw": 90, "roll": 0},
  "scale": {"x": 1, "y": 1, "z": 1}
}
```

- 旋转使用**角度制**（不是弧度）
- 字段均可省略：新建时省略 = identity；修改时省略 = 保持不变

### LinearColor —— RGBA 颜色

```json
{"r": 1.0, "g": 0.0, "b": 0.0, "a": 1.0}
```

- 值范围 0~1 用于标准颜色；>1 用于 HDR / 自发光
- 这不是 0~255 的整数！UE 内部颜色统一用浮点

### PinID —— 蓝图引脚

```json
{
  "node": {"refPath": "/Game/BP_MyActor.BP_MyActor:MyFunction.MyNode_123"},
  "direction": "EGPD_Output",
  "index_id": 0
}
```

- `direction`：`"EGPD_Output"`（输出引脚）或 `"EGPD_Input"`（输入引脚）
- `index_id`：引脚在该节点上的序号（从 0 开始）

---

## 典型工作流示例

### 1. 放置一个红色灯光并聚焦

```
步骤 1: SceneTools.add_to_scene_from_class
         actor_type = PointLight, name = "RedLight", xform = {location:{x:0,y:0,z:300}}

步骤 2: ActorTools.get_root_component(redLight)
         → 得到 PointLightComponent

步骤 3: ObjectTools.set_properties(component, '{"intensity": 5000, "lightColor": {"r":1,"g":0,"b":0,"a":1}}')

步骤 4: EditorAppToolset.FocusOnActors([redLight])

步骤 5: AssetTools.save_assets([])
```

### 2. 创建带变量的蓝图并绑定组件事件

```
步骤 1: BlueprintTools.create(folder="/Game/Blueprints", asset_name="BP_Trigger", asset_type=Actor)
步骤 2: BlueprintTools.add_variable(bp, "bIsTriggered", "bool")
步骤 3: BlueprintTools.set_variable_replication(bp, "bIsTriggered", "RepNotify")
步骤 4: BlueprintTools.add_component(...) → 添加 BoxCollision
步骤 5: BlueprintTools.add_component_bound_event(component, "OnComponentBeginOverlap", eventGraph)
步骤 6: BlueprintTools.compile_blueprint(bp)
步骤 7: AssetTools.save_assets([bpPath])
```

### 3. 创建材质实例并覆盖参数

```
步骤 1: MaterialInstanceTools.create(folder="/Game/Materials/Instances", asset_name="MI_Red", parent=parentMaterial)
步骤 2: MaterialInstanceTools.set_vector_parameter(mi, "BaseColor", {r:1, g:0, b:0, a:1})
步骤 3: MaterialInstanceTools.set_scalar_parameter(mi, "Roughness", 0.3)
步骤 4: AssetTools.save_assets([miPath])
```

### 4. 用 DataTable 存储游戏配置

```
步骤 1: DataTableTools.search_row_structs("MyConfigStruct")
         → 找到可用的行结构

步骤 2: DataTableTools.create(folder="/Game/Data", asset_name="DT_GameConfig", schema=struct)
步骤 3: DataTableTools.add_rows(dt, ["Easy", "Normal", "Hard"])
步骤 4: DataTableTools.set_rows(dt, '{"Easy": {"health":100, "damage":10}, "Normal": {"health":80, "damage":20}, "Hard": {"health":50, "damage":35}}')
步骤 5: AssetTools.save_assets([dtPath])
```

### 5. 查询场景中的灯光信息

```
步骤 1: SceneTools.find_actors(tag="")  或  EditorAppToolset.GetVisibleActors
步骤 2: 对每个灯光 Actor → ActorTools.get_root_component(actor)
步骤 3: ObjectTools.get_properties(component, ["intensity", "lightColor", "attenuationRadius"])
```

> **关键**：灯光属性（Intensity、LightColor 等）在 **Component** 上，不在 Actor 上。必须先 `get_root_component` 再查属性。

---

## 常见问题 (FAQ)

**Q: 调用工具返回 "is not valid Actor for property 'actor'"**
A: 你可能在用 ActorTools 操作非 Actor 对象（如 Blueprint 资产、Widget）。ActorTools 只能操作关卡中的 Actor 实例，不能操作资产编辑器中的 Blueprint。

**Q: 调用 get_properties 拿不到灯光的 Intensity**
A: 灯光属性在组件上，不在 Actor 上。先 `ActorTools.get_root_component(actor)` 取到 PointLightComponent，再 `ObjectTools.get_properties(component, ["intensity"])`。

**Q: 为什么 load_toolset 后还是找不到工具？**
A: `load_toolset` 加载的工具要到**下一轮对话**才能使用，同一轮无法调用。

**Q: 能用 ProgrammaticToolset 导入 unreal 模块吗？**
A: 不能。沙箱只允许 `json / math / datetime / copy / re` 等标准库模块。`import unreal` 会被拒绝。

**Q: 能创建 UMG 控件 / Widget Tree 吗？**
A: 不能。当前 MCP 工具集没有任何 UMG/Widget/Slate 操作能力。BlueprintTools 只管蓝图图表，不管 Widget Tree。要做 UMG 界面需在编辑器内手动拖拽。

**Q: 修改资产后没生效？**
A: 大部分修改需要显式保存：`AssetTools.save_assets([path])`。蓝图修改后还需要先 `BlueprintTools.compile_blueprint`。材质修改后需要 `MaterialTools.recompile`。

---

*生成自 `mcp__unreal-mcp-preview__list_toolsets` + `describe_toolset` 实时结果，对应 UE 5.8 Preview 工程 `UE5.8-Preview-AIPlugins-Analise`。*
