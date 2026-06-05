# MaterialNodeBridge 规格说明书

## 1. 目的

BlueprintNodeBridge 插件实现了蓝图节点的 T3D 和短代码格式转换，但材质节点具有双层架构（UMaterialGraphNode 包装 UMaterialExpression），无法直接复用蓝图节点的粘贴逻辑。本插件将实现材质节点的 T3D 和短代码格式转换功能。

## 2. 主要功能

### 2.1 复制材质节点为短代码
- 选中材质编辑器中的节点，点击菜单"复制为短代码"
- 生成可读性强的短代码文本，复制到剪贴板
- 同时缓存 T3D 模板供粘贴使用

### 2.2 从短代码粘贴材质节点
- 从剪贴板读取短代码
- 解析节点定义和连接关系
- 直接创建 UMaterialExpression 对象并重建连接

### 2.3 材质节点自动布局
- 复用 BlueprintNodeBridge 的节点布局算法
- 支持材质节点的层级式排列

## 3. 技术架构

### 3.1 目录结构

```
MaterialNodeBridge/
├── MaterialNodeBridge.uplugin
├── Source/
│   └── MaterialNodeBridge/
│       ├── MaterialNodeBridge.Build.cs
│       ├── Public/
│       │   ├── MaterialNodeBridge.h              # 模块主类
│       │   ├── MaterialNodeBridgeCommands.h      # 命令定义
│       │   ├── MaterialNodeBridgeStyle.h         # 样式
│       │   ├── MaterialTextGraphParser.h          # 材质短代码解析器
│       │   ├── MaterialExpressionFactory.h       # 表达式工厂
│       │   ├── MaterialNodeRegistry.h             # 节点类型注册表
│       │   └── MaterialGraphFormatter.h           # 布局格式化器
│       └── Private/
│           ├── MaterialNodeBridge.cpp
│           ├── MaterialNodeBridgeCommands.cpp
│           ├── MaterialNodeBridgeStyle.cpp
│           ├── MaterialTextGraphParser.cpp
│           ├── MaterialExpressionFactory.cpp
│           ├── MaterialNodeRegistry.cpp
│           └── MaterialGraphFormatter.cpp
└── Resources/
    └── AIRules.json                               # AI 生成规则
```

### 3.2 核心类设计

#### FMaterialTextGraphParser
材质节点专用的短代码解析器，提供以下功能：
- `GenerateShortCode()`: 生成材质节点的短代码表示
- `ParseAndPaste()`: 解析短代码并创建材质表达式
- `GetExpressionInputName()`: 获取表达式输入引脚名称
- `GetExpressionOutputName()`: 获取表达式输出引脚名称

#### FMaterialExpressionFactory
材质表达式工厂，负责：
- 根据节点类型创建对应的 UMaterialExpression 对象
- 设置表达式的属性值（常量值、向量参数等）
- 管理表达式的生命周期

#### FMaterialNodeRegistry
节点类型注册表，映射短代码节点名称到 UMaterialExpression 类：
```cpp
TMap<FString, FMaterialNodeInfo> NodeRegistry = {
    {"Constant", {UMaterialExpressionConstant::StaticClass(), {"R","G","B","A"}, {"Output"}}},
    {"Add", {UMaterialExpressionAdd::StaticClass(), {"A","B"}, {"Output"}}},
    {"Multiply", {UMaterialExpressionMultiply::StaticClass(), {"A","B"}, {"Output"}}},
    {"TextureSample", {UMaterialExpressionTextureSample::StaticClass(), {}, {"RGB","R","G","B","A"}}},
    // ... 更多节点类型
};
```

#### FMaterialGraphFormatter
材质节点布局格式化器，复用蓝图节点的层级布局算法。

### 3.3 短代码格式

材质节点短代码采用与蓝图节点相同的格式规范：

```
# --- Node Definitions ---
Constant_1 (R\\(1.0\\); G\\(0.5\\); B\\(0.0\\);) : (Output;)
Multiply_2 (A; B;) : (Output;)
TextureSample_3 (T\\(TextureObject\\);) : (RGB; R; G; B; A;)

# --- Links ---
Constant_1 (Output) -> Multiply_2 (A)
Multiply_2 (Output) -> TextureSample_3 (T)
```

### 3.4 材质表达式与蓝图的差异

| 方面 | 蓝图节点 | 材质表达式 |
|------|----------|------------|
| 数据类 | UEdGraphNode | UMaterialExpression |
| 图包装 | UEdGraph | UMaterialGraph |
| 引脚连接 | Pin->MakeLinkTo() | ExpressionInput->Connect() |
| 位置属性 | NodePosX/NodePosY | MaterialExpressionEditorX/Y |
| 粘贴方法 | ImportNodesFromText() | NewObject<>() + RebuildGraph() |

## 4. 依赖模块

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "CoreUObject",
    "Engine",
    "UnrealEd",
    "BlueprintGraph",
    "MaterialEditor",      // 材质编辑器支持
    "MaterialDomains",     // 材质域支持
    "ToolMenus",
    "Slate",
    "SlateCore",
    "GraphEditor",
    "Json",
    "JsonUtilities"
});
```

## 5. 菜单集成

在材质编辑器工具栏添加下拉菜单：
- "复制为短代码" - 复制选中材质节点
- "粘贴短代码" - 从剪贴板粘贴材质节点
- "整理节点" - 自动排列选中节点
- "复制 AI 规则" - 复制 AI 生成规则
- "管理模板" - 打开模板文件夹
- "编辑 AI 规则" - 编辑 AI 规则 JSON

## 6. 节点类型支持

### 6.1 数学运算节点
- Constant（常量）
- Add（加法）
- Subtract（减法）
- Multiply（乘法）
- Divide（除法）
- Abs（绝对值）
- Sine/Cosine/Tangent（三角函数）
- Floor/Ceiling/Round（取整）
- Max/Min（最大/最小）
- Clamp（范围限制）
- OneMinus（一减）

### 6.2 向量操作节点
- Constant2Vector（常量2向量）
- Constant3Vector/Constant4Vector
- ComponentMask（分量蒙版）
- Append（追加向量）
- BreakFloat3/BreakFloat4
- MakeFloat3/MakeFloat4

### 6.3 纹理采样节点
- TextureSample（纹理采样）
- TextureObject（纹理对象）
- TextureCoordinate（纹理坐标）
- TextureSampleParameter2D

### 6.4 参数节点
- ScalarParameter（标量参数）
- VectorParameter（向量参数）
- ColorParameter（颜色参数）
- StaticBool/StaticSwitch

### 6.5 材质属性节点
- Fresnel
- BumpOffset
- Panner
- Rotator
- Time
- uv

## 7. 缓存系统

### 7.1 内存缓存
```cpp
TMap<FString, FString> NodeTemplateCache;  // Key: 节点类型, Value: T3D 模板
```

### 7.2 磁盘持久化
- 路径: `Saved/MaterialNodeBridge/NodeTemplates.json`
- 格式: JSON
- 生命周期: 随编辑器进程自动加载/保存

## 8. 错误处理

- 无效短代码格式: 显示错误提示对话框
- 未知节点类型: 跳过该节点并记录日志
- 类型不匹配连接: 跳过连接并记录警告
- 材质编译失败: 提示用户手动检查

## 9. 性能考虑

- 批量创建表达式后统一调用 `RebuildGraph()`
- 使用 `FScopedTransaction` 支持撤销/重做
- 延迟缓存保存，避免频繁磁盘写入
