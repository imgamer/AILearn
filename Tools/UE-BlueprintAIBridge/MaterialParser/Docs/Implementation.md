# UEMaterialPaser 实现原理

## 概述

UEMaterialPaser 是一个 Unreal Engine 5 编辑器插件，用于将材质节点序列化为人类可读的文本格式（简称"短代码"），支持跨会话复制粘贴材质节点。

## 核心功能

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| Copy As Short Code | Ctrl+Shift+C | 将选中的材质节点序列化为短代码，复制到剪贴板 |
| Paste Short Code | Ctrl+Shift+V | 从剪贴板读取短代码，重建材质节点 |

## 文件结构

```
Plugins/MaterialParser/
├── Source/MaterialParser/
│   ├── Public/
│   │   ├── MaterialParserModule.h        # 插件入口，声明 FMaterialParserModule
│   │   ├── MaterialParserCommands.h      # UI 命令定义（Copy/Paste）
│   │   └── MaterialGraphParser.h          # 解析器核心类型声明
│   └── Private/
│       ├── MaterialParserModule.cpp       # 插件主逻辑，命令注册，复制/粘贴实现
│       ├── MaterialGraphParser.cpp         # 序列化/反序列化核心
│       └── MaterialParserTests.cpp        # 单元测试
```

## 核心数据结构

### FMatNodeDef - 节点定义

```cpp
struct FMatNodeDef {
    FString NodeId;            // 节点显示名称（如 "Constant", "Texture"）
    FString ClassName;         // UE 类名（如 "MaterialExpressionConstant"）
    float   PosX, PosY;        // 节点在材质编辑器中的位置
    TMap<FString, FString> InputValues;   // 输入引脚名 -> 默认值
    TMap<FString, FString> OutputValues;  // 输出引脚（预留）
};
```

### FMatLinkDef - 连接定义

```cpp
struct FMatLinkDef {
    FString SourceNodeId;   // 源节点 ID
    FString SourcePin;      // 源引脚名（如 "Output"）
    FString TargetNodeId;   // 目标节点 ID
    FString TargetPin;      // 目标引脚名（如 "A"）
};
```

## 短代码格式

### 格式规则

```
NodeId [ClassName] [PosX, PosY]
  PinName = Value
  ...

SourceNode.PinName -> TargetNode.PinName
```

### 示例

```
Constant [MaterialExpressionConstant] [100, 200]
  R = 0.5

Texture [MaterialExpressionTextureSample] [500, 200]
  Coordinates = Multiply.Output
  Texture = /Engine/EngineResources/DefaultTexture.DefaultTexture

Multiply [MaterialExpressionMultiply] [400, 300]

Constant.Output -> Multiply.A
Constant3Vector.Output -> Multiply.B
Multiply.Output -> Texture.Coordinates
```

### 解析规则

| 行类型 | 判断条件 | 解析方式 |
|--------|----------|----------|
| 节点定义 | 包含 `[` 和 `]` | 正则匹配提取 NodeId、ClassName、[PosX, PosY] |
| 引脚赋值 | 包含 `=` | 按 `=` 分割，得到 PinName 和 Value |
| 连接定义 | 包含 `->` | 按 `->` 分割，再按 `.` 分割节点和引脚 |
| 空行/注释 | 空或 `#` 开头 | 跳过 |

## 数据流

### 复制流程 (Copy)

```
用户按下 Ctrl+Shift+C
        ↓
MaterialParserModule::CopyAsShortCode()
        ↓
FMaterialGraphParser::GenerateShortCode(SelectedNodes[])
        ↓
1. ExtractShortCodeLine() - 每个节点
   ├── GetNodeDisplayName() - 节点标题 + 去重后缀
   ├── GetNodeClassName() - UE 类名
   ├── GetNodePosition() - 位置坐标
   └── GetPinValueAsString() - 各输入引脚值
        ↓
2. ExtractConnections() - 提取所有连接
   └── 输出格式: "NodeId.Pin -> NodeId.Pin"
        ↓
FPlatformApplicationMisc::ClipboardCopy()
        ↓
显示成功通知
```

### 粘贴流程 (Paste)

```
用户按下 Ctrl+Shift+V
        ↓
MaterialParserModule::PasteShortCode()
        ↓
1. FPlatformApplicationMisc::ClipboardPaste() - 获取剪贴板内容
        ↓
2. FMaterialGraphParser::IsValidShortCode() - 验证格式有效性
        ↓
3. FMaterialGraphParser::ParseShortCode() - 逐行解析
   └── 输出: TArray<FMatNodeDef>, TArray<FMatLinkDef>
        ↓
4. Phase 1: 节点重建
   └── 对每个 FMatNodeDef:
       ├── FindMaterialExpressionClass() - 查找/加载 UE 类
       ├── FMaterialEditorUtilities::CreateNewMaterialExpression() - 创建节点
       ├── SetPinValueFromString() - 设置引脚默认值
       └── 特殊类型处理 (Constant/Texture 等)
        ↓
5. Phase 2: 连接重建
   └── 对每个 FMatLinkDef:
       ├── 查找源/目标节点
       ├── 查找对应引脚
       └── SourcePin->MakeLinkTo(TargetPin)
        ↓
6. FMaterialEditorUtilities::UpdateMaterialAfterGraphChange()
        ↓
7. NotifyGraphChanged() - 通知编辑器刷新
        ↓
显示成功通知
```

## 关键实现细节

### 类名解析 (FindMaterialExpressionClass)

支持以下内置材质表达式类型：

| ClassName | UE Class |
|-----------|----------|
| MaterialExpressionConstant | UMaterialExpressionConstant |
| MaterialExpressionConstant3Vector | UMaterialExpressionConstant3Vector |
| MaterialExpressionConstant4Vector | UMaterialExpressionConstant4Vector |
| MaterialExpressionMultiply | UMaterialExpressionMultiply |
| MaterialExpressionAdd | UMaterialExpressionAdd |
| MaterialExpressionSubtract | UMaterialExpressionSubtract |
| MaterialExpressionDivide | UMaterialExpressionDivide |
| MaterialExpressionTextureSample | UMaterialExpressionTextureSample |
| MaterialExpressionTextureCoordinate | UMaterialExpressionTextureCoordinate |

**未知类型兜底**：使用 `TObjectIterator<UClass>` 遍历所有类，查找匹配类名且继承自 `UMaterialExpression` 的类。

### 引脚值序列化 (GetPinValueAsString)

| Pin Category | 序列化方式 |
|--------------|-----------|
| PC_Float / PC_Scalar | `SanitizeFloat()` |
| PC_Vector4/3/2 / PC_LinearColor | `(R,G,B,A)` 元组格式 |
| PC_Byte / PC_Enum | 直接字符串 |
| PC_Object / PC_Texture2D | 资产路径 |

### 引脚值反序列化 (SetPinValueFromString)

根据引脚类型解析字符串并设置：
- 浮点型：`FCString::Atof()` 转换
- 向量型：解析 `(R,G,B,A)` 格式或标量广播
- 纹理型：使用 `LoadObject<UTexture2D>()` 加载资产

### 编辑器集成

**工具栏菜单**：扩展 `AssetEditor.MaterialEditor.ToolBar`，在 Settings 区域添加 "Material Parser" 下拉菜单。

**焦点检测**：`FindFocusedGraphEditor()` 通过向上遍历控件树找到当前聚焦的 `SGraphEditor`。

**命令绑定**：

```cpp
// Ctrl+Shift+C
UI_COMMAND(CopyAsShortCode, "Copy As Short Code", ...);
CommandList->MapAction(CopyAsShortCode,
    FExecuteAction::CreateLambda([] { CopyAsShortCode(); }),
    FCanExecuteAction::CreateLambda([] { return IsMaterialEditorFocused(); }));

// Ctrl+Shift+V
UI_COMMAND(PasteShortCode, "Paste Short Code", ...);
CommandList->MapAction(PasteShortCode,
    FExecuteAction::CreateLambda([] { PasteShortCode(); }),
    FCanExecuteAction::CreateLambda([] { return IsMaterialEditorFocused(); }));
```

## 与 T3D 格式的对比

| 特性 | T3D 格式 | 短代码格式 |
|------|----------|------------|
| 可读性 | 低（二进制/嵌套结构） | 高（纯文本） |
| 人类编辑 | 困难 | 简单 |
| AI 解析 | 需要解析器 | 自然语言处理友好 |
| 完整性 | 完整（包含所有属性） | 精简（仅关键属性） |
| 粘贴后需调整 | 否 | 极少 |
