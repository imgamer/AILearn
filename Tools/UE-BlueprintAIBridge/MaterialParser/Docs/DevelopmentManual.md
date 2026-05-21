# MaterialParser 插件开发技术手册

## 1. 项目概述

### 1.1 项目背景

MaterialParser 是为 Unreal Engine 5.7 材质编辑器开发的编辑器插件，核心功能是将选中的材质节点转换为人类可读的"短代码"格式，支持跨会话复制粘贴材质节点图。该插件参考了 `Plugins/BlueprintNodeBridge/` 的实现思路。

### 1.2 核心价值

| 痛点 | 解决方案 |
|------|----------|
| T3D 格式难以人类阅读 | 短代码格式简洁直观 |
| AI 无法有效解析材质结构 | 短代码格式易于 AI 处理 |
| 材质节点无法跨会话复制 | 支持完整的序列化/反序列化 |
| 调试材质网络困难 | 文本形式便于分析节点关系 |

### 1.3 版本信息

- **插件版本**: 1.0
- **引擎版本**: Unreal Engine 5.7
- **插件类型**: Editor 模块

---

## 2. 系统架构

### 2.1 模块结构

```
Plugins/MaterialParser/
├── MaterialParser.uplugin           # 插件清单文件
├── Source/MaterialParser/
│   ├── MaterialParser.Build.cs       # 构建配置
│   ├── Public/
│   │   ├── MaterialParserModule.h   # 插件入口，声明 FMaterialParserModule
│   │   ├── MaterialParserCommands.h  # UI 命令定义
│   │   ├── MaterialGraphParser.h     # 解析器核心类型声明
│   │   └── MaterialParserTests.h    # 测试框架
│   └── Private/
│       ├── MaterialParserModule.cpp  # 插件主逻辑
│       ├── MaterialGraphParser.cpp   # 序列化/反序列化核心
│       ├── MaterialParserPrivatePCH.h
│       └── MaterialParserTests.cpp   # 单元测试实现
```

### 2.2 依赖关系

```
MaterialParser 模块依赖
├── Core                    # 核心类型系统
├── CoreUObject            # UObject 反射系统
├── Engine                 # 游戏引擎核心
├── MaterialEditor         # 材质编辑器 API
├── GraphEditor            # 图形编辑器 API
├── EditorFramework        # 编辑器框架
├── Slate / SlateCore      # UI 框架
├── UnrealEd               # 编辑器核心功能
├── ToolMenus              # 工具菜单系统
├── Json / JsonUtilities    # JSON 序列化
└── InputCore / ApplicationCore  # 输入系统
```

### 2.3 类图

```
FMaterialParserModule (主模块类)
├── PluginCommands - TSharedPtr<FUICommandList>
├── StartupModule() - 注册命令和菜单
├── ShutdownModule() - 清理资源
├── CopyAsShortCode() - 复制选中的节点
├── PasteShortCode() - 从剪贴板粘贴节点
├── IsMaterialEditorFocused() - 检查编辑器焦点
└── RegisterMenus() - 注册工具栏菜单

FMaterialGraphParser (解析器核心)
├── GenerateShortCode() - 生成短代码
├── ParseShortCode() - 解析短代码
├── IsValidShortCode() - 验证短代码有效性
├── NodesToT3D() - 导出 T3D 格式（预留）
├── GetNodeDisplayName() - 获取节点显示名
├── GetNodeClassName() - 获取节点类名
├── GetPinValueAsString() - 引脚值序列化
├── ExtractShortCodeLine() - 提取单行短代码
└── ExtractConnections() - 提取连接信息
```

---

## 3. 设计思路与方案

### 3.1 设计原则

1. **最小化依赖**: 仅依赖 UE 编辑器模块，不侵入引擎核心
2. **人类可读**: 短代码格式优先考虑可读性，而非紧凑性
3. **可扩展**: 支持后续添加新的材质表达式类型
4. **幂等性**: 解析和重建操作均可重复执行

### 3.2 短代码格式设计

#### 格式规范

```
NodeId [ClassName] [PosX, PosY]
  PinName = Value
  PinName = OtherNode.PinName
  ...

SourceNode.PinName -> TargetNode.PinName
```

#### 设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 分隔符 | `[ ]` 和 `->` | 便于正则匹配，避免歧义 |
| 缩进 | 2空格 | 视觉层次清晰 |
| 位置格式 | `[X, Y]` | 兼容材质编辑器坐标系 |
| 引用格式 | `Node.Pin` | 明确表达节点间引用关系 |
| 向量格式 | `(R,G,B,A)` | 直观且易于解析 |

#### 示例

```
Constant [MaterialExpressionConstant] [100, 200]
  R = 0.5

Color [MaterialExpressionConstant3Vector] [100, 400]
  Constant = (1.000,0.500,0.250,1.000)

Texture [MaterialExpressionTextureSample] [500, 200]
  Texture = /Engine/EngineResources/DefaultTexture.DefaultTexture
  Coordinates = TexCoord.Output

TexCoord [MaterialExpressionTextureCoordinate] [300, 200]

Multiply [MaterialExpressionMultiply] [400, 300]

Constant.Output -> Multiply.A
Color.Output -> Multiply.B
Multiply.Output -> Texture.Coordinates
TexCoord.Output -> Texture.Coordinates
```

### 3.3 数据流设计

#### 复制流程 (Copy)

```
┌─────────────────────────────────────────────────────────────┐
│                     CopyAsShortCode                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ 获取选中节点     │
                    │ (GEditor Select)│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ GenerateShort   │
                    │    Code()       │
                    └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │ 提取节点  │    │ 提取引脚  │    │ 提取连接  │
        │ 信息     │    │ 值       │    │ 关系     │
        └──────────┘    └──────────┘    └──────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  复制到剪贴板     │
                    │ ClipboardCopy()  │
                    └─────────────────┘
```

#### 粘贴流程 (Paste)

```
┌─────────────────────────────────────────────────────────────┐
│                     PasteShortCode                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ 从剪贴板读取     │
                    │ ClipboardPaste()│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ 验证短代码格式   │
                    │ IsValidShortCode│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ 解析短代码       │
                    │ ParseShortCode()│
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        ┌──────────┐                  ┌──────────┐
        │ Phase 1  │                  │ Phase 2  │
        │ 创建节点 │                  │ 建立连接  │
        └──────────┘                  └──────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────┐
                    │ 更新材质编辑器  │
                    │ 通知图变更     │
                    └─────────────────┘
```

---

## 4. 核心功能实现

### 4.1 数据结构

#### FMatNodeDef - 节点定义

```cpp
struct FMatNodeDef
{
    FString NodeId;                    // 节点唯一标识
    FString ClassName;                 // UE 类名
    float PosX;                        // X 坐标
    float PosY;                        // Y 坐标
    TMap<FString, FString> InputValues;  // 输入引脚 -> 默认值
    TMap<FString, FString> OutputValues; // 输出引脚（预留）
};
```

#### FMatLinkDef - 连接定义

```cpp
struct FMatLinkDef
{
    FString SourceNodeId;   // 源节点 ID
    FString SourcePin;      // 源引脚名
    FString TargetNodeId;   // 目标节点 ID
    FString TargetPin;      // 目标引脚名
};
```

### 4.2 节点类型支持

| ClassName | UE 类 | 支持的属性 |
|-----------|-------|----------|
| MaterialExpressionConstant | UMaterialExpressionConstant | R (浮点值) |
| MaterialExpressionConstant3Vector | UMaterialExpressionConstant3Vector | Constant (颜色) |
| MaterialExpressionConstant4Vector | UMaterialExpressionConstant4Vector | Constant (颜色) |
| MaterialExpressionMultiply | UMaterialExpressionMultiply | - |
| MaterialExpressionAdd | UMaterialExpressionAdd | - |
| MaterialExpressionSubtract | UMaterialExpressionSubtract | - |
| MaterialExpressionDivide | UMaterialExpressionDivide | - |
| MaterialExpressionTextureSample | UMaterialExpressionTextureSample | Texture, Coordinates |
| MaterialExpressionTextureCoordinate | UMaterialExpressionTextureCoordinate | - |

**扩展机制**: `FindMaterialExpressionClass()` 函数支持动态查找未知类型。

### 4.3 引脚值序列化

| Pin Category | 序列化方式 | 示例 |
|--------------|-----------|------|
| PC_Float | 浮点字符串 | `0.500000` |
| PC_Scalar | 浮点字符串 | `1.000000` |
| PC_Vector4/3/2 | 颜色元组 | `(1.000,0.500,0.250,1.000)` |
| PC_LinearColor | 颜色元组 | `(0.500,0.300,0.100,1.000)` |
| PC_Byte | 整数字符串 | `128` |
| PC_Enum | 枚举名 | `PF_HDR` |
| PC_Object | 资产路径 | `/Engine/...` |
| PC_Texture2D | 纹理路径 | `/Game/.../MyTexture.MyTexture` |

### 4.4 编辑器集成

#### 快捷键绑定

- **Ctrl+Shift+C**: 复制为短代码
- **Ctrl+Shift+V**: 粘贴短代码

#### 工具栏菜单

扩展 `AssetEditor.MaterialEditor.ToolBar`，在 Settings 区域添加 "Material Parser" 下拉菜单。

#### 焦点检测

```cpp
// 向上遍历控件树查找 SGraphEditor
static TSharedPtr<SWidget> FindFocusedGraphEditor()
{
    TSharedPtr<SWidget> FocusedWidget = FSlateApplication::Get().GetKeyboardFocusedWidget();
    while (FocusedWidget.IsValid())
    {
        if (FocusedWidget->GetTypeAsString() == TEXT("SGraphEditor"))
            return FocusedWidget;
        FocusedWidget = FocusedWidget->GetParentWidget();
    }
    return nullptr;
}
```

---

## 5. 测试策略

### 5.1 测试框架

插件使用 UE_LOG 输出测试结果到 Output Log，无需额外的测试框架依赖。

### 5.2 测试用例

| 测试名称 | 覆盖范围 |
|----------|----------|
| TestMaterialNodeDef | FMatNodeDef 结构体创建和成员访问 |
| TestMaterialLinkDef | FMatLinkDef 结构体创建和成员访问 |
| TestShortCodeFormat | 短代码格式验证 |
| TestShortCodeValidation | IsValidShortCode() 函数 |
| TestParseNodeDefinition | 节点定义解析 |
| TestParseConnection | 连接定义解析 |
| TestParseChainedExpressions | 复杂链式表达式解析 |
| TestNodeDisplayNameGeneration | 节点名称生成逻辑 |
| TestPinValueFormat | 引脚值格式化输出 |

### 5.3 运行测试

测试在 `StartupModule()` 中自动执行：

```cpp
void FMaterialParserModule::StartupModule()
{
    // ...
    FMaterialParserTests::RunAllTests();
}
```

查看测试结果：在 UE 编辑器中打开 Output Log，筛选 `LogTemp` 类别。

---

## 6. API 参考

### 6.1 FMaterialGraphParser

#### GenerateShortCode

```cpp
static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes);
```

将节点数组转换为短代码格式字符串。

**参数**:
- `Nodes`: 要序列化的节点数组

**返回值**: 短代码格式字符串，失败时返回空字符串

**示例**:
```cpp
TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();
FString ShortCode = FMaterialGraphParser::GenerateShortCode(SelectedNodes);
```

#### ParseShortCode

```cpp
static bool ParseShortCode(
    const FString& ShortCode,
    TArray<FMatNodeDef>& OutNodes,
    TArray<FMatLinkDef>& OutLinks
);
```

解析短代码字符串为节点和连接定义。

**参数**:
- `ShortCode`: 短代码字符串
- `OutNodes`: 输出的节点定义数组
- `OutLinks`: 输出的连接定义数组

**返回值**: 解析成功返回 true

#### IsValidShortCode

```cpp
static bool IsValidShortCode(const FString& Text);
```

验证字符串是否为有效的短代码格式。

**判定条件**: 包含 `[` 和 `]` 字符

#### GetPinValueAsString

```cpp
static FString GetPinValueAsString(UEdGraphPin* Pin);
```

将引脚值序列化为字符串。

**优先级**:
1. 如果引脚已连接，返回引用格式 `Node.Pin`
2. 否则返回引脚的默认值

---

## 7. 已知限制

1. **部分节点类型**: 当前仅支持有限的材质表达式类型
2. **注释节点**: MaterialExpressionComment 不支持序列化
3. **复杂属性**: 节点的高级属性（如函数调用、静态参数开关）未支持
4. **节点组**: 不支持节点分组信息的序列化
5. **材质函数**: 嵌入的材质函数内容未展开

---

## 8. 未来工作

### 8.1 短期计划

- [ ] 支持更多材质表达式类型
- [ ] 添加节点注释的序列化
- [ ] 支持材质函数展开

### 8.2 长期计划

- [ ] JSON 格式导出选项
- [ ] AI 驱动的材质优化建议
- [ ] 与蓝图桥接插件集成
- [ ] 材质网络可视化

---

## 9. 附录

### A. 文件清单

| 文件路径 | 行数 | 说明 |
|----------|------|------|
| MaterialParser.uplugin | 24 | 插件清单 |
| MaterialParser.Build.cs | 49 | 构建配置 |
| MaterialParserModule.h | - | 模块声明 |
| MaterialParserModule.cpp | ~480 | 主逻辑实现 |
| MaterialGraphParser.h | ~60 | 解析器头文件 |
| MaterialGraphParser.cpp | ~430 | 解析器实现 |
| MaterialParserTests.h | - | 测试框架 |
| MaterialParserTests.cpp | ~300 | 测试实现 |

### B. 相关资源

- 参考实现: `Plugins/BlueprintNodeBridge/`
- UE 材质编辑器 API: `MaterialEditorUtilities.h`
- 图形节点系统: `EdGraph/EdGraphNode.h`
