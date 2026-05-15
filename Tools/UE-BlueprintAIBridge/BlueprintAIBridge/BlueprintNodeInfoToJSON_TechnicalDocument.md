# BlueprintAIBridge 插件技术文档：蓝图节点信息获取与JSON转换机制

## 一、概述

BlueprintAIBridge 是虚幻引擎5（Unreal Engine 5）的编辑器插件，核心功能是将蓝图图表中选中的节点转换为可读的短代码格式，支持与 AI 系统进行交互。该插件采用文本图（Text Graph）表示法，而非直接的 JSON 格式，但底层通过 JSON 进行数据持久化。本文档详细剖析插件如何从蓝图图表中获取节点信息，并逐步解释数据提取、转换和存储的完整算法流程。

## 二、核心组件架构

插件由三个核心模块组成，各模块职责明确，协同完成节点信息的获取与转换工作。

### 2.1 模块职责划分

**主插件模块（BlueprintAIBridge）** 负责用户交互层，作为插件入口点处理菜单命令、响应用户操作、获取焦点窗口中的选中节点，并协调各子模块的工作。该模块维护节点模板缓存（NodeTemplateCache），将已导出的节点 T3D 表示持久化存储。

**文本图解析器（TextGraphParser）** 是核心转换引擎，负责将 UEdGraphNode 对象转换为人类可读的短代码字符串，同时支持反向解析——将短代码还原为可执行的蓝图节点。该模块包含节点定义解析、链接解析、引脚值提取等关键功能。

**节点图格式化器（NodeGraphFormatter）** 专注于节点布局算法，当用户选择整理节点功能时，该模块自动计算最优节点排列位置。与信息获取无直接关联，但在节点操作流程中提供辅助功能。

### 2.2 数据流总体架构

数据流向遵循以下路径：用户选中节点 → 主模块获取节点引用 → 传递给 TextGraphParser → 遍历节点提取信息 → 生成短代码 → 缓存 T3D 模板 → 复制到系统剪贴板。整个过程中，短代码作为中间表示层，JSON 仅用于模板持久化存储。

## 三、节点信息获取机制

### 3.1 获取选中节点的策略

插件采用双策略机制获取用户选中的蓝图节点，确保在各种编辑器状态下都能正确识别目标节点。

**策略一：Slate 焦点图编辑器优先**（推荐方案）。主模块通过 `GetFocusedGraphEditor()` 函数实现此策略。首先调用 `FSlateApplication::Get().GetKeyboardFocusedWidget()` 获取当前键盘焦点窗口，然后沿窗口层级向上遍历，查找类型为"SGraphEditor"的组件。找到图编辑器后，调用 `GraphEditor->GetSelectedNodes()` 获取当前选中节点集合。这种方式依赖于用户的交互焦点，能够准确获取用户正在操作图表中的选中节点。

**策略二：全局选择回退方案**。当焦点方案未能获取到节点时，插件回退到全局选择器。通过 `GEditor->GetSelectedObjects()` 获取编辑器级别的选择对象集，遍历其中所有 UEdGraphNode 类型的对象。全局选择器作为兜底方案，确保在焦点窗口并非蓝图编辑器时仍能工作。

```cpp
TSharedPtr<SGraphEditor> GetFocusedGraphEditor()
{
    TSharedPtr<SWidget> FocusedWidget = FSlateApplication::Get().GetKeyboardFocusedWidget();
    
    while (FocusedWidget.IsValid())
    {
        if (FocusedWidget->GetTypeAsString() == "SGraphEditor")
        {
            return StaticCastSharedPtr<SGraphEditor>(FocusedWidget);
        }
        FocusedWidget = FocusedWidget->GetParentWidget();
    }
    
    return nullptr;
}
```

### 3.2 节点类型识别

获取到 UEdGraphNode 对象后，插件需要识别具体节点类型以生成准确的节点名称。TextGraphParser 模块通过类型安全转换（Cast）实现节点类型识别，根据不同节点类型采用不同的命名策略。

**函数调用节点（UK2Node_CallFunction）** 的命名直接取自调用的函数对象。调用 `GetTargetFunction()->GetName()` 获取函数名，例如调用 `PrintString` 函数则节点名为"PrintString"。这种命名方式保持了与函数库的对应关系，便于 AI 理解代码意图。

**变量获取节点（UK2Node_VariableGet）** 的命名格式为"Get"加上变量成员名称。通过 `VariableReference.GetMemberName().ToString()` 获取变量名，若变量名为"Health"，则节点名为"GetHealth"。这种前缀约定符合蓝图规范，增强了可读性。

**变量设置节点（UK2Node_VariableSet）** 采用相同的命名逻辑，前缀为"Set"，例如"SetHealth"表示设置健康值。

**分支节点（UK2Node_IfThenElse）** 统一命名为"Branch"，这是蓝图内置的条件控制节点，无需额外参数识别。

**路线节点（UK2Node_Knot）** 命名为"添加变更路线节点"，用于表示连线转接点，维持逻辑连接的完整性。

**其他节点** 则回退到通用方案，调用 `Node->GetNodeTitle(ENodeTitleType::MenuTitle)` 获取节点标题，移除空格后作为节点名。

### 3.3 引脚信息提取

每个蓝图节点包含多个引脚（Pin），插件遍历 `Node->Pins` 数组提取每个引脚的详细信息。引脚信息包括引脚方向、类型、名称和默认值。

**引脚方向** 通过 `Pin->Direction` 属性判断，枚举值 EGPD_Input 表示输入引脚，EGPD_Output 表示输出引脚。输入引脚进入节点定义左侧括号，输出引脚进入右侧括号。

**引脚类型** 通过 `Pin->PinType.PinCategory` 识别。执行引脚（PC_Exec）具有特殊处理逻辑，Execute 引脚标准化为"inExec"，Then 引脚标准化为"outExec"。其他类型引脚保持原始名称。

**默认值提取** 通过 `GetPinValue()` 函数实现。该函数针对不同引脚类型采用差异化策略。对于字符串引脚（PC_String），优先使用 `DefaultValue` 属性，并移除 UE 存储时添加的引号。对于字节型枚举引脚，通过 `PinSubCategoryObject` 获取枚举对象，将整数值转换为枚举名称。对于对象引用引脚，若值为"(None)"则返回空字符串，避免无效引用。

```cpp
FString FTextGraphParser::GetPinValue(UEdGraphPin* Pin)
{
    if (!Pin) return TEXT("");
    
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_String)
    {
        FString StringValue = Pin->DefaultValue;
        if (!StringValue.IsEmpty())
        {
            StringValue.ReplaceInline(TEXT("\""), TEXT(""));
            return StringValue;
        }
        // ... 其他字符串处理逻辑
    }
    
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Byte && Pin->PinType.PinSubCategoryObject.IsValid())
    {
        FString DefaultValue = Pin->GetDefaultAsString();
        if (UEnum* Enum = Cast<UEnum>(Pin->PinType.PinSubCategoryObject.Get()))
        {
            int64 EnumValue = FCString::Strtoi64(*DefaultValue, nullptr, 10);
            return Enum->GetNameStringByValue(EnumValue);
        }
    }
    
    // 通用处理：使用 GetDefaultAsString
    FString DefaultValue = Pin->GetDefaultAsString();
    if (DefaultValue == TEXT("(None)")) return TEXT("");
    DefaultValue.ReplaceInline(TEXT("\""), TEXT(""));
    return DefaultValue;
}
```

### 3.4 连接关系提取

节点之间的连接关系是蓝图逻辑的核心表示。插件遍历每个节点的输出引脚，追踪其 `LinkedTo` 数组，记录所有连接信息。

对于每个输出引脚，遍历 `Pin->LinkedTo` 数组中的每个链接引脚。通过 `LinkedPin->GetOwningNode()` 获取目标节点，验证目标节点是否在选中的节点集合内（避免引用外部节点）。对于执行连接（PC_Exec），标准化引脚名称后记录链接。

```cpp
for (UEdGraphPin* Pin : Node->Pins)
{
    if (Pin->Direction == EGPD_Output)
    {
        for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
        {
            UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
            if (NodeToID.Contains(TargetNode))
            {
                FString SourcePinName = Pin->PinName.ToString();
                FString TargetPinName = LinkedPin->PinName.ToString();
                
                // 标准化执行引脚名称
                if (SourcePinName == UEdGraphSchema_K2::PN_Then) 
                    SourcePinName = TEXT("outExec");
                if (TargetPinName == UEdGraphSchema_K2::PN_Execute) 
                    TargetPinName = TEXT("inExec");
                
                // 记录链接
                LinkDefs += FString::Printf(TEXT("%s (%s) -> %s (%s)\n"),
                    *SourceID, *SourcePinName, *TargetID, *TargetPinName);
            }
        }
    }
}
```

## 四、T3D 模板导出与缓存

### 4.1 T3D 格式简介

T3D（Text 3D）是虚幻引擎的文本化资产格式，全称为 Unreal Text 3D。该格式以文本方式描述 UPROPERTY 属性，能够被 UE 编辑器导入和导出。插件利用 T3D 格式进行节点的完整序列化和反序列化，确保节点的所有属性（包括自定义属性）都能被保留。

### 4.2 T3D 导出流程

插件通过 `FEdGraphUtilities::ExportNodesToText()` 函数执行 T3D 导出。导出操作针对整个选中节点集合一次性执行，而非逐个导出，以保证连接关系能够被完整保留。

**全量集合导出**：首先创建包含所有选中节点的 T3D 字符串，使用 `FEdGraphUtilities::ExportNodesToText(CompleteNodeSet, CompleteSetT3D)` 生成完整的连接信息。这份完整集存储在缓存键"__CompleteSet__"下，用于粘贴操作时保持节点间的连接。

**个体节点导出**：为每个节点单独生成 T3D 字符串，存储在缓存键为"节点名_序号"的条目下。个体 T3D 用于模板匹配，当短代码解析时需要查找对应的节点模板。

**基础模板提取**：首次遇到某类型的节点时，提取其基础模板（仅节点名，无序号后缀），用于在缓存未命中时尝试动态创建节点。

```cpp
// 全量导出：保持连接关系
TSet<UObject*> CompleteNodeSet;
for (UEdGraphNode* Node : Nodes) CompleteNodeSet.Add(Node);
FEdGraphUtilities::ExportNodesToText(CompleteNodeSet, CompleteSetT3D);

// 存储完整集合 T3D
if (!CompleteSetT3D.IsEmpty())
{
    OutNodeCache.Add(TEXT("__CompleteSet__"), CompleteSetT3D);
}

// 存储个体节点 T3D
FString UniqueName = BaseName + TEXT("_") + ID;
TSet<UObject*> NodeSet;
NodeSet.Add(Node);
FEdGraphUtilities::ExportNodesToText(NodeSet, T3DContent);
OutNodeCache.Add(UniqueName, T3DContent);

// 存储基础模板
if (!OutNodeCache.Contains(BaseName))
{
    OutNodeCache.Add(BaseName, T3DContent);
}
```

### 4.3 模板缓存管理

插件维护 `NodeTemplateCache` 成员变量，类型为 `TMap<FString, FString>`，键为节点名称标识符，值为 T3D 格式的节点模板数据。

**缓存持久化**：通过 `SaveCache()` 和 `LoadCache()` 函数管理缓存的读写。存储位置为 `{ProjectSavedDir}/BlueprintAIBridge/NodeTemplates.json`。序列化采用 UE 的 JSON API，将整个 TMap 转换为 JSON 对象，每个键值对对应一个模板条目。

```cpp
void FBlueprintAIBridgeModule::SaveCache()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
    
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&JsonString);
    TSharedPtr<FJsonObject> RootObject = MakeShareable(new FJsonObject);
    for (auto& Elem : NodeTemplateCache)
    {
        RootObject->SetStringField(Elem.Key, Elem.Value);
    }
    FJsonSerializer::Serialize(RootObject.ToSharedRef(), Writer);
    FFileHelper::SaveStringToFile(JsonString, *Path);
}
```

## 五、短代码生成算法

### 5.1 文本图格式设计

插件采用自定义的文本图（Text Graph）格式，而非直接生成 JSON。这种设计有几个优势：文本格式便于人类阅读和编辑，在 AI 对话中可直接复制粘贴，格式简洁减少了 token 消耗。

**节点定义行格式**：`节点名_唯一ID (输入引脚定义) : (输出引脚定义)`

输入引脚定义中，带默认值的引脚使用 `\()` 包裹值，例如 `inExec; Condition\(true\);`。无默认值的引脚仅列出名称，以分号分隔。

**链接定义行格式**：`源节点ID (源引脚) -> 目标节点ID (目标引脚)`

链接行明确指定连接的源节点、源引脚、目标节点和目标引脚，确保解析时能够准确还原连接关系。

### 5.2 节点 ID 生成算法

节点 ID 采用序号分配策略，从1开始递增。格式为"节点名_序号"，序号保证在同一批次处理中的唯一性。

```cpp
FString ID = FString::FromInt(i + 1);
FString UniqueName = BaseName + TEXT("_") + ID;
```

例如第一批次的三个节点可能生成：PrintString_1、Branch_2、SetHealth_3。

### 5.3 完整生成算法步骤

短代码生成遵循以下精确步骤，保证输出的完整性和一致性。

**步骤一：初始化数据结构**。创建空字符串 `NodeDefs` 用于存储节点定义，创建 `NodeDefs` 用于存储链接定义，创建 `NodeToID` 映射用于节点对象到 ID 字符串的转换。

**步骤二：全量节点 T3D 导出**。将所有选中节点加入集合，调用 `FEdGraphUtilities::ExportNodesToText()` 生成完整 T3D，存入缓存键"__CompleteSet__"。这一步骤确保连接关系被完整保留。

**步骤三：遍历节点生成定义**。对每个非空节点执行以下操作。首先获取节点基础名称，然后生成唯一 ID 并记录映射关系。接着缓存完整集合 T3D（对首个节点）和个体节点 T3D。若该节点类型尚未缓存，则存储基础模板。

随后遍历节点的所有引脚，对输入引脚提取名称和默认值，格式化为带或不带值的引脚定义字符串。对输出引脚提取名称，格式化为输出引脚定义字符串。最后拼接节点定义行：`节点名_序号 (输入定义) : (输出定义)`。

**步骤四：遍历节点生成链接**。再次遍历每个节点，对每个输出引脚，检查其 `LinkedTo` 数组中的每个链接引脚。若目标节点在 `NodeToID` 映射中，则标准化引脚名称（特别是执行引脚），拼接链接定义行。

**步骤五：组装最终输出**。在头部添加注释行"# --- Node Definitions ---"，拼接所有节点定义，添加空行和注释行"# --- Links ---"，拼接所有链接定义。

## 六、短代码解析与节点还原

### 6.1 解析算法概述

粘贴操作将短代码反向转换为蓝图节点。解析过程分为三个阶段：短代码解析、节点创建、连接重建。

### 6.2 短代码解析阶段

解析器首先将短代码按行分割，遍历每一行。跳过空行和以"#"开头的注释行。检测行是否包含"->"符号以区分节点定义和链接定义。

对于节点定义行，调用 `ParseNodeDefinition()` 解析。该函数首先查找第一个括号位置以分离节点名部分，然后查找下划线位置以提取节点名和 ID。查找冒号位置以分离输入引脚部分和输出引脚部分。最后调用 `ParsePinList()` 辅助函数解析引脚列表，该函数以分号为分隔符拆分字符串，识别带默认值的引脚（包含"\("和"\)"）。

对于链接定义行，调用 `ParseLinkDefinition()` 解析。该函数以"->"为分隔符拆分左右两侧，分别解析源节点-源引脚和目标节点-目标引脚。解析函数查找括号位置提取引脚名称，查找下划线位置提取节点 ID。

### 6.3 节点创建阶段

解析完成后，遍历所有节点定义创建蓝图节点。

**T3D 模板查找**：按照优先级查找 T3D 模板。首先查找"节点名_ID"的精确匹配，然后查找"节点名"的基础模板匹配。若均未命中，则该节点创建失败（除非是支持动态创建的节点类型）。

**GUID 重生**：找到 T3D 模板后，需要强制 UE 创建新节点而非复用现有节点。通过 `RegenerateT3DGUIDs()` 辅助函数实现，该函数查找 T3D 中所有32位十六进制字符的 GUID 模式，为每个 GUID 生成新的 FGuid，替换原文中的旧 GUID。

**节点导入**：使用 `FEdGraphUtilities::ImportNodesFromText()` 导入节点到目标图表。新节点的位置设置为起始位置加上当前偏移量（每个节点间隔250像素）。

### 6.4 连接重建阶段

节点创建完成后，遍历所有链接定义重建连接。

查找源节点和目标节点，获取对应的 UEdGraphPin 对象。若引脚名称为"outExec"但找不到对应引脚，则尝试查找 PN_Then 引脚。若引脚名称为"inExec"但找不到对应引脚，则尝试查找 PN_Execute 引脚。

检查目标引脚是否已有源连接，避免重复连接。使用 `MakeLinkTo()` 方法创建连接。

最后调用 `FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified()` 通知蓝图系统结构已变更。

## 七、数据结构详解

### 7.1 核心数据结构

插件定义了两个关键的结构体用于短代码解析。

**FNodeDefinition** 结构体存储解析后的节点定义，包含节点名称（Name）、节点序号（ID）、输入引脚映射（InputPins，键为引脚名，值为默认值字符串）、输出引脚数组（OutputPins）。

**FLinkDefinition** 结构体存储解析后的链接定义，包含源节点 ID（SourceNodeID）、源引脚名称（SourcePinName）、目标节点 ID（TargetNodeID）、目标引脚名称（TargetPinName）。

### 7.2 节点布局信息结构

NodeGraphFormatter 模块定义 FNodeLayoutInfo 结构体用于布局计算，包含节点指针（Node）、是否为占位节点（bIsDummy）、是否在主路径上（bIsMainPath）、是否纯函数节点（bIsPureFunction）、层级序号（Rank）、顺序号（Order）、主路径索引（MainPathIndex）、X坐标（X）、Y坐标（Y）、估算宽度（EstimatedWidth）、估算高度（EstimatedHeight）、父节点数组（Parents）、子节点数组（Children）、数据消费者数组（DataConsumers）。

## 八、算法复杂度分析

### 8.1 时间复杂度

节点信息获取的时间复杂度为 **O(N × P + L)**，其中 N 为节点数量，P 为平均每节点引脚数，L 为连接总数。遍历节点和引脚是线性操作，连接遍历的总和不超过实际连接数。

短代码生成为 **O(N × P + L)**，与信息获取相同量级，需要遍历所有节点、引脚和连接。

解析与还原的时间复杂度为 **O(N' + L')**，其中 N' 为解析出的节点数，L' 为链接数。GUID 替换操作在 T3D 字符串上执行，若 T3D 长度为 M，则复杂度为 **O(M × G)**，G 为 GUID 数量。

### 8.2 空间复杂度

内存占用主要包括节点缓存（O(N × M)，N 为节点类型数，M 为平均 T3D 长度）和解析中间结果（O(N' + L')）。T3D 模板是主要的内存消耗点。

## 九、技术要点总结

BlueprintAIBridge 插件的核心技术创新在于将复杂的蓝图图表转换为简洁的文本表示，同时通过 T3D 模板缓存确保节点属性的完整保留。关键技术点包括：双策略节点获取保证交互准确性、类型安全的节点识别机制、执行流与数据流的分离处理、T3D 格式的精确序列化和 GUID 重生技术。

整个系统设计体现了分层架构思想：用户交互层负责节点选择，文本解析层负责格式转换，持久化层负责模板缓存。模块间职责清晰，接口明确，便于扩展和维护。
