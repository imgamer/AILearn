# Unreal MCP 工具集 AI 提示词测试方案

## 说明

本文档为 Unreal MCP Preview 插件的每个工具提供一句自然语言提示词（Prompt），通过 AI 对话触发对应工具调用，用于验证所有 MCP 工具的可达性和正确性。

生成本文档的提示词：写一个测试方案文档，用来测试ureal mcp每个工具调用，这些mcp工具是要通过AI来使用的，给每个工具提供一句提示词来触发，不要遗漏。

## 测试环境

- Unreal Engine 5.8 Preview 编辑器已启动并连接 MCP
- 已加载测试关卡，Content Browser 可正常访问

---

## 一、EditorAppToolset（编辑器应用工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 1.1 | `GetSelectedActors` | 告诉我当前关卡中选中了哪些 Actor |
| 1.2 | `GetSelectedAssets` | 列出 Content Browser 中当前选中的资源 |
| 1.3 | `GetOpenAssets` | 有哪些资源编辑器窗口当前是打开状态？ |
| 1.4 | `GetVisibleActors` | 当前视口中能看到哪些 Actor？ |
| 1.5 | `GetCameraTransform` | 获取当前视口摄像机的位置和旋转 |
| 1.6 | `GetContentBrowserPath` | 当前 Content Browser 在哪个目录？ |
| 1.7 | `SelectActors` | 帮我选中场景中所有名称包含 "Wall" 的 Actor |
| 1.8 | `SelectAssets` | 在 Content Browser 中选中 /Game/Test/ 下的所有资源 |
| 1.9 | `SetCameraTransform` | 把视口摄像机移动到 (0, 0, 500) 并朝下看 |
| 1.10 | `SetContentBrowserPath` | 把 Content Browser 导航到 /Game/Meshes/ |
| 1.11 | `FocusOnActors` | 让编辑器摄像机聚焦到当前选中的 Actor |
| 1.12 | `CaptureEditorImage` | 截一张编辑器全窗口的截图 |
| 1.13 | `CaptureAssetImage` | 截一张当前视口的截图 |
| 1.14 | `CaptureAssetImage` | 给 /Game/Test/SM_TestCube 生成缩略图 |
| 1.15 | `ScreenCoordsToWorld` | 视口正中心 (0.5, 0.5) 对应的世界坐标是什么？ |
| 1.16 | `WorldPosToScreenCoords` | 世界坐标 (100, 200, 50) 在屏幕上的位置是哪里？ |
| 1.17 | `SearchCVars` | 搜索所有以 "r.Shadow" 开头的控制台变量 |
| 1.18 | `OpenEditorForAsset` | 打开 /Game/Test/BP_TestActor 的编辑器 |
| 1.19 | `OpenEditorForAsset` | 尝试打开 /Game/DoesNotExist 看看会怎样报错 |

---

## 二、LogsToolset（日志工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 2.1 | `GetLogCategories` | 列出 UE 引擎当前注册的所有日志类别 |
| 2.2 | `GetLogCategories` | 找出名称中包含 "Blueprint" 的日志类别 |
| 2.3 | `GetVerbosity` | LogTemp 当前的日志详细级别是什么？ |
| 2.4 | `GetVerbosity` | 查询一个不存在的日志类别 "LogFake" 的级别 |
| 2.5 | `SetVerbosity` | 把 LogTemp 的日志级别设为 Verbose |
| 2.6 | `SetVerbosity` | 把 LogTemp 的日志级别降为 Warning |
| 2.7 | `SetVerbosity` | 尝试把 LogTemp 设为 "InvalidLevel" 看报什么错 |
| 2.8 | `GetLogEntries` | 给我看最近 50 条引擎日志 |
| 2.9 | `GetLogEntries` | 只看 LogTemp 类别最近的日志 |
| 2.10 | `GetLogEntries` | 在日志中搜索所有包含 "Error" 的条目 |

---

## 三、AgentSkillToolset（代理技能工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 3.1 | `ListSkills` | 列出项目中所有已注册的 AgentSkill |
| 3.2 | `GetSkills` | 查看 /Game/Skills/MySkill 的详细配置信息 |
| 3.3 | `GetSkills` | 获取一个不存在路径 /Game/Fake/FakeSkill 的详情 |
| 3.4 | `CreateSkill` | 在 /Game/Test/ 下创建一个名为 TestSkill 的 AgentSkill |
| 3.5 | `UpdateSkill` | 修改 TestSkill 的描述和配置信息 |
| 3.6 | `UpdateSkill` | 尝试更新一个不存在的 Skill 路径 |

---

## 四、BehaviorTreeTools（行为树工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 4.1 | `get_blackboard` | 查看 /Game/AI/BT_Enemy 行为树关联了哪个黑板 |
| 4.2 | `list_nodes` | 把 BT_Enemy 行为树的所有节点按树序遍历列出来 |
| 4.3 | `get_node_depths` | 获取 BT_Enemy 行为树每个节点的深度 |
| 4.4 | `get_node_depth` | BT_Enemy 行为树第 3 个节点在第几层？ |
| 4.5 | `get_node_depth` | BT_Enemy 中索引为 999 的节点深度是多少？ |
| 4.6 | `get_root_decorators` | BT_Enemy 根节点有哪些装饰器？ |
| 4.7 | `get_children` | 列出 BT_Enemy 根复合节点的所有子节点 |
| 4.8 | `get_subtree` | 查看这个 RunBehavior 任务节点引用的是哪个子树 |
| 4.9 | `get_subtree` | 对一个非 RunBehavior 节点调用 get_subtree 看报什么错 |
| 4.10 | `get_children` | 对一个叶子任务节点调用 get_children 看返回什么 |

---

## 五、ActorTools（Actor 工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 5.1 | `get_actor_transform` | 获取场景中 "BP_TestActor_1" 的世界空间 Transform |
| 5.2 | `get_actor_bounds` | "BP_TestActor_1" 的包围盒有多大？ |
| 5.3 | `get_label` | 这个 Actor 在编辑器里叫什么名字？ |
| 5.4 | `get_tags` | "BP_TestActor_1" 上面有哪些标签？ |
| 5.5 | `get_root_component` | "BP_TestActor_1" 的根组件是什么？ |
| 5.6 | `get_root_component` | 查一下这个没有根组件的 Actor 返回什么 |
| 5.7 | `get_components` | 列出 "BP_TestActor_1" 上所有的组件 |
| 5.8 | `get_components` | "BP_TestActor_1" 上有哪些 StaticMeshComponent？ |
| 5.9 | `get_component_actor` | 这个 StaticMeshComponent 属于哪个 Actor？ |
| 5.10 | `get_parent_component` | 这个 SceneComponent 的父组件是哪个？ |
| 5.11 | `get_parent_component` | 这个根组件的父组件是谁？（应为 None） |
| 5.12 | `set_actor_transform` | 把 "BP_TestActor_1" 移动到世界坐标 (500, 0, 100) |
| 5.13 | `set_actor_transform` | 把 "BP_TestActor_1" 绕 Z 轴旋转 45 度 |
| 5.14 | `set_actor_transform` | 把 "BP_TestActor_1" 的缩放设为 (2, 2, 2) |
| 5.15 | `set_label` | 把 "BP_TestActor_1" 改名为 "MyRenamedActor" |
| 5.16 | `add_tag` | 给 "MyRenamedActor" 打上 "QuestItem" 标签 |
| 5.17 | `has_tag` | "MyRenamedActor" 有没有 "QuestItem" 标签？ |
| 5.18 | `has_tag` | "MyRenamedActor" 有没有 "Enemy" 标签？ |
| 5.19 | `remove_tag` | 把 "MyRenamedActor" 上的 "QuestItem" 标签去掉 |
| 5.20 | `add_component` | 给 "MyRenamedActor" 添加一个 PointLightComponent |
| 5.21 | `remove_component` | 把刚才添加的 PointLightComponent 移除 |
| 5.22 | `set_parent_component` | 把这个 SceneComponent 挂到另一个组件下面 |
| 5.23 | `set_parent_component` | 把这个组件从父组件上分离（设为根级组件） |

---

## 六、AssetTools（资源工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 6.1 | `exists` | 检查 /Game/Test/SM_TestCube 这个资源是否存在 |
| 6.2 | `exists` | /Game/Fake/NotReal 路径下有没有东西？ |
| 6.3 | `find_assets` | 搜索 /Game/ 下名称包含 "Cube" 的资源 |
| 6.4 | `find_assets` | 在 /Game/Test/ 下只搜 StaticMesh 类型，不递归 |
| 6.5 | `find_assets` | 在 /Game/Test/ 及其子目录下找出所有 "Wall" 资源 |
| 6.6 | `list_folders` | 列出 /Game/ 下的直接子文件夹 |
| 6.7 | `list_folders` | 递归列出 /Game/Test/ 下所有子文件夹 |
| 6.8 | `load_asset` | 加载 /Game/Test/SM_TestCube 这个资源 |
| 6.9 | `load_asset` | 尝试加载 /Game/NoSuchAsset 看报什么错 |
| 6.10 | `get_dependencies` | SM_TestCube 依赖了哪些其他资源？ |
| 6.11 | `get_referencers` | 有哪些资源引用了 SM_TestCube？ |
| 6.12 | `can_edit_asset` | SM_TestCube 当前可以编辑吗？ |
| 6.13 | `is_dirty` | SM_TestCube 有没有未保存的修改？ |
| 6.14 | `is_dirty` | 检查一个刚保存的资源是否为脏 |
| 6.15 | `create_folder` | 在 /Game/ 下创建一个名为 "MCP_Test" 的文件夹 |
| 6.16 | `create_folder` | 再次创建 /Game/MCP_Test（应该幂等成功） |
| 6.17 | `duplicate` | 把 SM_TestCube 复制一份到 /Game/MCP_Test/SM_TestCube_Copy |
| 6.18 | `move` | 把 SM_TestCube_Copy 移动到 /Game/MCP_Test/Sub/SM_Moved |
| 6.19 | `delete` | 删除 /Game/MCP_Test/Sub/SM_Moved |
| 6.20 | `save_assets` | 保存 SM_TestCube 的修改 |
| 6.21 | `save_assets` | 保存当前所有未保存的资源 |
| 6.22 | `read_file` | 读取项目目录下的 Config/DefaultEngine.ini 文件内容 |
| 6.23 | `read_file` | 尝试读取 C:/Windows/System32 下的文件（应拒绝） |
| 6.24 | `read_file` | 读取一个不存在的文件路径 |
| 6.25 | `write_file` | 在项目 Source 目录下写一个测试用的 .txt 文件 |
| 6.26 | `write_file` | 尝试往项目目录外写文件（应拒绝） |
| 6.27 | `get_plugin_content_paths` | 列出所有项目本地插件的 Content 根路径 |

---

## 七、BlueprintTools（蓝图工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 7.1 | `create` | 在 /Game/Test/ 创建一个名为 BP_Test 的 Actor Blueprint |
| 7.2 | `create` | 在 /Game/Test/ 创建一个继承自 GameModeBase 的 Blueprint |
| 7.3 | `get_parent` | BP_Test 的父类是什么？ |
| 7.4 | `set_parent` | 把 BP_Test 的父类改为 Pawn |
| 7.5 | `get_default_object` | 获取 BP_Test 的 Class Default Object |
| 7.6 | `list_graphs` | 列出 BP_Test 中所有的图（Graphs） |
| 7.7 | `get_graph` | 获取 BP_Test 的 EventGraph |
| 7.8 | `get_graph` | 尝试获取 BP_Test 中一个不存在的图 |
| 7.9 | `add_function_graph` | 在 BP_Test 中创建一个名为 "DoSomething" 的函数 |
| 7.10 | `remove_function_graph` | 把 BP_Test 中的 "DoSomething" 函数删掉 |
| 7.11 | `add_event_dispatcher` | 在 BP_Test 中添加一个名为 "OnHealthChanged" 的事件分发器 |
| 7.12 | `list_event_dispatchers` | BP_Test 有哪些事件分发器？ |
| 7.13 | `add_variable` | 在 BP_Test 中添加一个 bool 类型的成员变量 "bIsAlive" |
| 7.14 | `add_variable` | 依次添加 int "Health"、float "Speed"、string "Name" 变量 |
| 7.15 | `add_object_variable` | 添加一个 Actor 类型的对象引用变量 "TargetActor" |
| 7.16 | `add_struct_variable` | 添加一个 GameplayTag 类型的结构体变量 "MyTag" |
| 7.17 | `add_variable` | 在 "DoSomething" 函数中添加一个局部变量 "TempIndex" |
| 7.18 | `list_variables` | 列出 BP_Test 的所有成员变量 |
| 7.19 | `list_variables` | 列出 "DoSomething" 函数的所有局部变量 |
| 7.20 | `set_variable_instance_editable` | 把 "Health" 设为可在实例上编辑 |
| 7.21 | `set_variable_replication` | 把 "Health" 设为 Replicated |
| 7.22 | `set_variable_replication` | 把 "bIsAlive" 设为 RepNotify |
| 7.23 | `get_variable_replication` | 查看 "Health" 当前的复制模式 |
| 7.24 | `remove_variable` | 删除 BP_Test 中的 "TempValue" 成员变量 |
| 7.25 | `remove_variable` | 删除 "DoSomething" 函数中的 "TempIndex" 局部变量 |
| 7.26 | `add_function_param` | 给 "DoSomething" 添加一个 int 类型输入参数 "Amount" |
| 7.27 | `add_function_param` | 给 "DoSomething" 添加一个 bool 类型的输出参数 "bSuccess" |
| 7.28 | `add_object_function_param` | 给 "DoSomething" 添加一个 Actor 引用输入参数 "Instigator" |
| 7.29 | `add_struct_function_param` | 给 "DoSomething" 添加一个 HitResult 结构体输入参数 |
| 7.30 | `remove_function_param` | 从 "DoSomething" 中移除 "Amount" 输入参数 |
| 7.31 | `get_nodes` | 列出 BP_Test 的 EventGraph 中所有节点 |
| 7.32 | `get_graph_info` | 查看 BP_Test EventGraph 的详细节点信息 |
| 7.33 | `get_node_info` | 查看 EventGraph 中第一个节点的详细信息 |
| 7.34 | `create_node` | 在 EventGraph 中添加一个 PrintString 节点，位置 (200, 0) |
| 7.35 | `create_node` | 在 EventGraph 中添加一个 ForLoop 节点 |
| 7.36 | `delete_node` | 删除刚才添加的 PrintString 节点 |
| 7.37 | `set_node_position` | 把 ForLoop 节点移到 (400, 200) |
| 7.38 | `connect_pins` | 把 BeginPlay 的执行输出连到 PrintString 的执行输入 |
| 7.39 | `break_pins` | 断开这两个节点之间的连接 |
| 7.40 | `set_pin_value` | 把 PrintString 的 InString 引脚设为 "Hello from MCP" |
| 7.41 | `set_pin_value` | 把某个 int 引脚的默认值设为 42 |
| 7.42 | `set_pin_value` | 把某个 name 引脚的默认值设为 "MyName" |
| 7.43 | `set_pin_value` | 把对象引用引脚的默认值设为 /Game/Test/BP_TestTarget |
| 7.44 | `get_pin_value` | 读取 PrintString 的 InString 引脚当前值 |
| 7.45 | `find_node_categories` | 在 EventGraph 中搜索包含 "FlowControl" 的节点类别 |
| 7.46 | `find_node_types` | 搜索 EventGraph 中所有与 "Print" 相关的节点类型 |
| 7.47 | `list_component_events` | 查看 BP_Test 根组件上可以绑定哪些事件 |
| 7.48 | `add_component_bound_event` | 给根组件绑定 OnComponentBeginOverlap 事件 |
| 7.49 | `list_compatible_event_functions` | 这个 CreateEvent 节点可以绑定哪些函数？ |
| 7.50 | `set_create_event_function` | 把 CreateEvent 节点绑定到 "DoSomething" 函数 |
| 7.51 | `get_create_event_function` | 查看这个 CreateEvent 节点当前绑定的是哪个函数 |
| 7.52 | `compile_blueprint` | 编译 BP_Test Blueprint |

---

## 八、CurveTableTools（曲线表工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 8.1 | `create` | 在 /Game/Test/ 创建一个名为 CT_Test 的 CurveTable |
| 8.2 | `add_row` | 给 CT_Test 添加一行 "DamageCurve"，默认值 1.0 |
| 8.3 | `add_row` | 给 CT_Test 再添加一行 "SpeedCurve"，不设默认值 |
| 8.4 | `list_rows` | 列出 CT_Test 曲线表中的所有行 |
| 8.5 | `add_key` | 给 CT_Test 的 DamageCurve 在 time=0 处添加 value=10 |
| 8.6 | `add_key` | 给 DamageCurve 依次添加 time=1/value=20, time=2/value=30 |
| 8.7 | `get_keys` | 查看 CT_Test 中 DamageCurve 行所有关键帧 |
| 8.8 | `set_keys` | 用 [(0,100), (5,0)] 替换 DamageCurve 的全部关键帧 |
| 8.9 | `rename_row` | 把 DamageCurve 改名为 "DamageScaleCurve" |
| 8.10 | `remove_row` | 删除 CT_Test 中的 SpeedCurve 行 |

---

## 九、DataAssetTools（数据资源工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 9.1 | `create` | 在 /Game/Test/ 创建一个 UDataAsset 类型的资源 DA_Test |
| 9.2 | `create` | 尝试用不存在的类型创建一个 DataAsset 看报什么错 |

---

## 十、DataTableTools（数据表工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 10.1 | `search_row_structs` | 搜索所有可用的 DataTable Row 结构体 |
| 10.2 | `search_row_structs` | 搜索名称包含 "Damage" 的 Row 结构体 |
| 10.3 | `create` | 用找到的 Row 结构体在 /Game/Test/ 创建 DT_Test |
| 10.4 | `get_schema` | 查看 DT_Test 的列结构（schema） |
| 10.5 | `add_rows` | 给 DT_Test 添加两行 "Row_A" 和 "Row_B" |
| 10.6 | `list_rows` | 列出 DT_Test 的所有行名 |
| 10.7 | `get_rows` | 读取 DT_Test 中 Row_A 和 Row_B 的数据 |
| 10.8 | `set_rows` | 更新 Row_A 的列值 |
| 10.9 | `rename_rows` | 把 Row_A 改名为 "Row_Alpha" |
| 10.10 | `remove_rows` | 删除 DT_Test 中的 Row_B |
| 10.11 | `set_rows` | 只更新 Row_Alpha 的部分列，其他列保持不变 |

---

## 十一、MaterialTools（材质工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 11.1 | `create` | 在 /Game/Test/ 创建一个名为 M_Test 的材质 |
| 11.2 | `get_expressions` | 查看 M_Test 材质图中所有表达式节点 |
| 11.3 | `add_expression` | 给 M_Test 添加一个 Constant 表达式，值设为 0.5 |
| 11.4 | `add_expression` | 添加一个名为 "Roughness" 的 ScalarParameter |
| 11.5 | `add_expression` | 添加一个名为 "TintColor" 的 VectorParameter |
| 11.6 | `add_expression` | 添加一个 TextureSample 表达式节点 |
| 11.7 | `add_expression` | 添加一个 Multiply 表达式节点 |
| 11.8 | `add_expression` | 添加一个 Add 节点，放在坐标 (300, 0) |
| 11.9 | `delete_expression` | 删除 M_Test 中的 Constant 表达式 |
| 11.10 | `get_expression_input_names` | 查看 Multiply 节点有哪些输入引脚 |
| 11.11 | `connect_expressions` | 把 TextureSample 的 RGB 输出连到 Multiply 的 A 输入 |
| 11.12 | `connect_expressions` | 把 Constant 的输出连到 Multiply 的 B 输入 |
| 11.13 | `disconnect_expressions` | 断开 Multiply 节点的 B 输入 |
| 11.14 | `connect_to_output` | 把 Multiply 的输出连到材质的 BaseColor |
| 11.15 | `disconnect_from_output` | 断开材质 BaseColor 的连接 |
| 11.16 | `list_parameter_groups` | 查看 M_Test 中有哪些参数组 |
| 11.17 | `rename_parameter_group` | 把参数组 "" 改名为 "Surface" |
| 11.18 | `delete_parameter_group` | 删除 "Surface" 参数组（参数本身保留） |
| 11.19 | `layout_expressions` | 自动排列 M_Test 的所有表达式节点 |
| 11.20 | `recompile` | 重新编译 M_Test 材质 |
| 11.21 | `connect_to_output` | 尝试把 Constant 连到 WorldPositionOffset 看看兼容性 |

---

## 十二、MaterialInstanceTools（材质实例工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 12.1 | `create` | 基于 M_Test 在 /Game/Test/ 创建 MI_Test 材质实例 |
| 12.2 | `set_parent` | 把 MI_Test 的父材质改为另一个材质 |
| 12.3 | `list_parameters` | 列出 MI_Test 中所有可覆写的参数 |
| 12.4 | `get_scalar_parameter` | 查看 MI_Test 中 "Roughness" 参数的当前值 |
| 12.5 | `set_scalar_parameter` | 把 MI_Test 的 "Roughness" 设为 0.8 |
| 12.6 | `get_vector_parameter` | 查看 MI_Test 中 "TintColor" 的 RGBA 值 |
| 12.7 | `set_vector_parameter` | 把 MI_Test 的 "TintColor" 设为红色 (1, 0, 0, 1) |
| 12.8 | `get_texture_parameter` | 查看 MI_Test 的 "BaseTexture" 当前设置了什么贴图 |
| 12.9 | `set_texture_parameter` | 把 MI_Test 的 "BaseTexture" 设为 /Game/Textures/T_Brick |
| 12.10 | `get_static_switch_parameter` | 查看 MI_Test 的 "UseNormalMap" 静态开关状态 |
| 12.11 | `set_static_switch_parameter` | 把 MI_Test 的 "UseNormalMap" 静态开关打开 |
| 12.12 | `clear_parameters` | 清除 MI_Test 的所有参数覆写，恢复父材质默认值 |

---

## 十三、ObjectTools（对象工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 13.1 | `get_class` | 查看 BP_Test 的 CDO 是什么类 |
| 13.2 | `search_subclasses` | 搜索所有名称含 "StaticMesh" 的 Actor 子类 |
| 13.3 | `search_subclasses` | 列出 Actor 的所有子类 |
| 13.4 | `list_properties` | 列出 BP_Test CDO 上所有属性名 |
| 13.5 | `get_properties` | 读取 BP_Test CDO 的 "bCanBeDamaged" 和 "AutoPossessAI" 属性 |
| 13.6 | `get_properties` | 查询 BP_Test CDO 上不存在的属性 "FakeProperty" |
| 13.7 | `set_properties` | 把 BP_Test CDO 的 "bCanBeDamaged" 设为 true |
| 13.8 | `set_properties` | 同时设置 BP_Test CDO 的多个属性值 |
| 13.9 | `set_properties` | 尝试设置一个只读属性，观察报错 |

---

## 十四、PrimitiveTools（基础几何体工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 14.1 | `add_cube` | 给当前选中的 Actor 添加一个默认尺寸的 Cube 组件 |
| 14.2 | `add_cube` | 给这个 Actor 添加一个 200x100x50 的 Cube，放在本地 (0, 0, 25) |
| 14.3 | `add_sphere` | 给这个 Actor 添加一个默认半径的球体组件 |
| 14.4 | `add_sphere` | 添加一个半径为 100 的球体，命名为 "BigSphere" |
| 14.5 | `add_cylinder` | 给这个 Actor 添加一个默认尺寸的圆柱体组件 |
| 14.6 | `add_cylinder` | 添加一个半径 30、高度 200 的圆柱体 |
| 14.7 | `add_cone` | 给这个 Actor 添加一个默认尺寸的圆锥体组件 |
| 14.8 | `add_cone` | 添加一个半径 50、高度 150 的圆锥体，旋转 90 度 |
| 14.9 | `add_cube` | 添加一个 Cube 并指定它相对父组件的 local_transform |

---

## 十五、SceneTools（场景工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 15.1 | `get_current_level` | 当前加载的是哪个关卡？ |
| 15.2 | `load_level` | 加载 /Game/Maps/TestLevel 关卡 |
| 15.3 | `load_level` | 尝试加载不存在的 /Game/Maps/FakeLevel |
| 15.4 | `find_actors` | 搜索场景中所有 Actor |
| 15.5 | `find_actors` | 找出场景中所有 StaticMeshActor |
| 15.6 | `find_actors` | 找出所有带有 "Enemy" 标签的 Actor |
| 15.7 | `find_actors` | 搜索名称匹配 "Wall*" 模式的所有 Actor |
| 15.8 | `find_actors` | 只在这个 Actor 的子层级中搜索 "Light*" |
| 15.9 | `add_to_scene_from_class` | 在场景中创建一个 PointLight Actor 放在 (0, 0, 300) |
| 15.10 | `add_to_scene_from_class` | 创建一个 StaticMeshActor 作为某个 Actor 的子对象 |
| 15.11 | `add_to_scene_from_class` | 在 (500, 500, 0) 创建一个 Actor 并自动对齐地面 |
| 15.12 | `add_to_scene_from_asset` | 在场景中放置一个 BP_Test 的实例，放在 (200, 0, 0) |
| 15.13 | `add_to_scene_from_asset` | 从 BP_Test 创建实例并挂到指定父 Actor 下面 |
| 15.14 | `remove_from_scene` | 删除场景中刚才创建的 PointLight |
| 15.15 | `get_folders` | 列出 Outliner 中所有的文件夹 |
| 15.16 | `set_actor_folder` | 把选中的 Actor 放到 "Lighting/Ambient" 文件夹 |
| 15.17 | `set_actor_folder` | 把这个 Actor 移到 Outliner 根级别（清除文件夹） |
| 15.18 | `get_actors_in_folder` | 列出 "Lighting" 文件夹中所有的 Actor |
| 15.19 | `get_actors_in_folder` | 递归列出 "Lighting" 及其子文件夹中所有 Actor |
| 15.20 | `rename_folder` | 把 "Lighting" 文件夹改名为 "Lights" |
| 15.21 | `delete_folder` | 删除 "Lights/Ambient" 文件夹 |
| 15.22 | `trace_world` | 从 (0, 0, 1000) 向下做一条射线检测看打到了什么 |
| 15.23 | `trace_world` | 从 (0, 0, 10000) 向正上方做射线检测（应无命中） |

---

## 十六、SkeletalMeshTools（骨骼网格工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 16.1 | `get_bounds` | 查看 SK_Mannequin 骨骼网格的包围盒和包围球 |
| 16.2 | `get_skeleton` | SK_Mannequin 关联了哪个骨架资源？ |
| 16.3 | `get_lod_count` | SK_Mannequin 有几个 LOD？ |
| 16.4 | `get_vertex_count` | SK_Mannequin 的 LOD0 有多少顶点？ |
| 16.5 | `get_vertex_count` | SK_Mannequin 的 LOD1 有多少顶点？ |
| 16.6 | `get_section_count` | SK_Mannequin 的 LOD0 有几个 Section？ |
| 16.7 | `get_bone_names` | 列出 SK_Mannequin 的所有骨骼名称 |
| 16.8 | `get_bone_parent` | "hand_r" 骨骼的父骨骼是哪根？ |
| 16.9 | `get_bone_children` | "spine_01" 骨骼的直接子骨骼有哪些？ |
| 16.10 | `get_bone_children` | "hand_r" 骨骼有子骨骼吗？（叶节点应为空） |
| 16.11 | `get_material_slots` | SK_Mannequin 有哪些材质插槽？ |
| 16.12 | `get_material` | 查看 SK_Mannequin 第一个材质插槽用了什么材质 |
| 16.13 | `set_material` | 把 SK_Mannequin 的 body 插槽材质换成 M_Test |
| 16.14 | `get_physics_asset` | SK_Mannequin 设置了什么物理资源？ |
| 16.15 | `assign_physics_asset` | 给 SK_Mannequin 分配 /Game/Test/PA_Test 物理资源 |
| 16.16 | `get_morph_target_names` | SK_Mannequin 有哪些 Morph Target？ |
| 16.17 | `get_socket_names` | 列出 SK_Mannequin 上所有的 Socket |
| 16.18 | `add_socket` | 在 SK_Mannequin 的 "hand_r" 骨骼上添加 "WeaponSocket" |
| 16.19 | `get_socket_bone` | "WeaponSocket" 是挂在哪根骨骼上的？ |
| 16.20 | `get_socket_transform` | 查看 "WeaponSocket" 相对父骨骼的本地 Transform |
| 16.21 | `set_socket_transform` | 把 "WeaponSocket" 的本地位置设为 (10, 0, 5)，旋转 90 度 |
| 16.22 | `rename_socket` | 把 "WeaponSocket" 改名为 "RightHandSocket" |
| 16.23 | `remove_socket` | 删除 "RightHandSocket" |

---

## 十七、StaticMeshTools（静态网格工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 17.1 | `get_lod_count` | SM_TestCube 有几个 LOD？ |
| 17.2 | `get_vertex_count` | SM_TestCube LOD0 有多少顶点？ |
| 17.3 | `get_triangle_count` | SM_TestCube LOD0 有多少三角形？ |
| 17.4 | `get_bounds` | 查看 SM_TestCube 的本地空间包围盒 |
| 17.5 | `get_material_slots` | SM_TestCube 有哪些材质插槽？ |
| 17.6 | `get_material` | SM_TestCube 第一个材质插槽用了什么材质？ |
| 17.7 | `set_material` | 把 SM_TestCube 的材质换成 M_Test |
| 17.8 | `get_lod_thresholds` | 查看 SM_TestCube 各 LOD 的屏幕尺寸阈值 |
| 17.9 | `set_lod_thresholds` | 把 SM_TestCube 的 LOD 阈值设为 [1.0, 0.5, 0.25] |
| 17.10 | `set_lod_thresholds` | 尝试设置非降序的阈值 [0.5, 1.0, 0.25] 看报错 |
| 17.11 | `generate_lods` | 给 SM_TestCube 自动生成 LOD，保留率 [0.5, 0.25] |
| 17.12 | `remove_lods` | 移除 SM_TestCube 所有自动生成的 LOD，只留 LOD0 |
| 17.13 | `is_nanite_enabled` | SM_TestCube 启用了 Nanite 吗？ |
| 17.14 | `set_nanite_enabled` | 给 SM_TestCube 开启 Nanite |
| 17.15 | `generate_convex_collisions` | 给 SM_TestCube 自动生成凸包碰撞 |
| 17.16 | `generate_convex_collisions` | 用 8 个 hull、每个最多 32 顶点生成碰撞 |
| 17.17 | `remove_collisions` | 清除 SM_TestCube 的所有碰撞形状 |

---

## 十八、StringTableTools（字符串表工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 18.1 | `create` | 在 /Game/Test/ 创建一个名为 ST_Localization 的 StringTable |
| 18.2 | `get_namespace` | 查看 ST_Localization 的命名空间 |
| 18.3 | `get_table_id` | 查看 ST_Localization 的表格 ID |
| 18.4 | `set_entry` | 在 ST_Localization 中添加 key="Greeting" value="Hello World" |
| 18.5 | `set_entry` | 把 ST_Localization 的 "Greeting" 值改为 "你好世界" |
| 18.6 | `get_entry` | 查询 ST_Localization 中 "Greeting" 对应的字符串 |
| 18.7 | `get_entry` | 查询 ST_Localization 中不存在的 key "MissingKey" |
| 18.8 | `list_keys` | 列出 ST_Localization 中的所有 key |
| 18.9 | `remove_entry` | 删除 ST_Localization 中的 "Greeting" 条目 |

---

## 十九、TextureTools（纹理工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 19.1 | `get_size` | 查看 /Game/Textures/T_Brick 纹理的分辨率是多少 |
| 19.2 | `get_size` | 尝试查询一个非 Texture2D 对象的尺寸 |

---

## 二十、ProgrammaticToolset（编程工具集）

| # | 工具名称 | 触发提示词 |
|---|---------|-----------|
| 20.1 | `get_execution_environment` | 获取 MCP 编程脚本的执行环境信息 |
| 20.2 | `execute_tool_script` | 用 Python 脚本调用多个工具，查询当前场景所有 Actor 的名字和位置 |
| 20.3 | `execute_tool_script` | 用脚本批量创建 5 个 Cube Actor 并排列成一行 |
| 20.4 | `execute_tool_script` | 用脚本查询所有名称含 "Wall" 的 Actor，如果超过 10 个就只输出前 10 个 |
| 20.5 | `execute_tool_script` | 执行一段有语法错误的 Python 脚本看报什么错 |
| 20.6 | `execute_tool_script` | 在脚本中尝试 import os 看是否被拦截 |
| 20.7 | `execute_tool_script` | 执行一段没有定义 run() 函数的脚本 |
| 20.8 | `execute_tool_script` | 让 run() 返回一个字符串而不是 dict |

---

## 异常与边界测试

| 测试类别 | 触发提示词示例 |
|----------|---------------|
| 无效资源路径 | 加载 /Game/NonExistent/Asset 并观察报错 |
| 无效对象引用 | 对这个已删除的 Actor 执行 get_actor_transform |
| 空参数 | 用空字符串作为 name 参数创建一个 Blueprint |
| 类型不匹配 | 尝试把字符串 "abc" 传给一个需要 Actor 引用的参数 |
| 并发调用 | 同时搜索所有子目录并列出所有 Actor |
| PIE 模式限制 | 启动 PIE 后尝试打开 Blueprint 编辑器 |
| 大量操作 | 循环创建 50 个文件夹再逐个删除 |

---

## 测试执行顺序

| Phase | 内容 | 工具集 |
|-------|------|--------|
| 1 | 只读查询 | AssetTools(查), EditorAppToolset(get*), ObjectTools(查), TextureTools, LogsToolset, BehaviorTreeTools |
| 2 | 资源 CRUD | AssetTools(写), StringTableTools, CurveTableTools, DataTableTools, DataAssetTools, MaterialTools(create), MaterialInstanceTools(create) |
| 3 | 场景操作 | SceneTools, ActorTools, PrimitiveTools |
| 4 | Blueprint | BlueprintTools（全部） |
| 5 | 材质图 | MaterialTools（表达式/连接/编译） |
| 6 | 网格与编程 | StaticMeshTools, SkeletalMeshTools, ProgrammaticToolset |
| 7 | 清理 | AssetTools(delete), SceneTools(remove_from_scene) |
| 8 | 异常 | 所有异常与边界场景 |

---

## 测试记录模板

| 字段 | 内容 |
|------|------|
| 编号 | （对应文档编号） |
| 日期 | YYYY-MM-DD |
| 工具 | （工具名称） |
| 提示词 | （使用的提示词） |
| 结果 | 通过 / 失败 / 阻塞 |
| 实际输出 | |
| 备注 | |

---

**版本**: v2.0 | **日期**: 2026-06-05 | **工具集**: 20 | **提示词**: ~200 条
