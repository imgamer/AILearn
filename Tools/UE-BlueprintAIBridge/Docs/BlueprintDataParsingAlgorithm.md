# BlueprintAIBridge 蓝图数据解析算法技术文档

> **文档版本**: 1.0  
> **适用插件版本**: BlueprintAIBridge v1.0  
> **目标读者**: 虚幻引擎开发者、工具开发工程师  
> **核心主题**: 从 UE 蓝图二进制数据到 AI 可读文本的完整解析算法链

---

## 目录

1. [总览：五层数据变换管线](#1-总览五层数据变换管线)
2. [第一层：磁盘二进制 → 内存对象（UE 序列化引擎）](#2-第一层磁盘二进制--内存对象ue-序列化引擎)
3. [第二层：内存对象 → T3D 文本（ExportNodesToText）](#3-第二层内存对象--t3d-文本exportnodestotext)
4. [第三层：内存对象 → 短代码文本（GenerateShortCode）](#4-第三层内存对象--短代码文本generateshortcode)
5. [第四层：短代码文本 → T3D 文本（ParseAndPaste 逆向转换）](#5-第四层短代码文本--t3d-文本parseandpaste-逆向转换)
6. [第五层：T3D 文本 → 内存对象（ImportNodesFromText）](#6-第五层t3d-文本--内存对象importnodesfromtext)
7. [GUID 重新生成算法](#7-guid-重新生成算法)
8. [引脚值编解码算法](#8-引脚值编解码算法)
9. [短代码文本格式规范（Text Graph DSL）](#9-短代码文本格式规范text-graph-dsl)
10. [缓存持久化算法](#10-缓存持久化算法)
11. [完整算法复杂度分析](#11-完整算法复杂度分析)
12. [关键数据结构速查](#12-关键数据结构速查)

---

## 1. 总览：五层数据变换管线

BlueprintAIBridge 的核心本质是一条**五层数据变换管线**，将蓝图从 UE 的私有二进制格式逐步转换为人类和 AI 都能理解的文本格式，并支持逆向还原。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BlueprintAIBridge 数据变换管线                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    Layer 1     ┌──────────────┐    Layer 2    ┌─────────┐ │
│  │  .uasset    │ ─────────────► │ UEdGraphNode  │ ─────────────►│  T3D    │ │
│  │  二进制文件  │   UE反序列化   │  内存对象集    │  ExportNodes  │  文本    │ │
│  └─────────────┘               └──────┬───────┘   ToText()     └─────────┘ │
│                                       │                                   │
│                                       │ Layer 3                           │
│                                       ▼                                   │
│                                ┌──────────────┐                           │
│                                │  短代码文本    │ ◄── AI 可读写            │
│                                │  (Short Code) │                           │
│                                └──────┬───────┘                           │
│                                       │ Layer 4 (逆向)                    │
│                                       ▼                                   │
│                                ┌──────────────┐    Layer 5    ┌─────────┐ │
│                                │  T3D 文本     │ ─────────────►│ UEdGraph │ │
│                                │  (GUID已替换)  │  ImportNodes  │  新节点  │ │
│                                └──────────────┘  FromText()   └─────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**正向路径（复制）**：`二进制 → 内存对象 → 短代码文本 + T3D缓存`

**逆向路径（粘贴）**：`短代码文本 → T3D缓存查找 → GUID替换 → 导入内存对象`

---

## 2. 第一层：磁盘二进制 → 内存对象（UE 序列化引擎）

### 2.1 UAsset 文件格式

UE 的蓝图以 `.uasset` 文件存储于磁盘，这是 `UPackage` 的二进制序列化形式。一个完整的蓝图资产通常由三个文件组成：

| 文件 | 内容 |
|------|------|
| `.uasset` | 包头、名称表、导入表、导出表、元数据 |
| `.uexp` | 导出对象的序列化数据（蓝图图表、节点、引脚等） |
| `.ubulk` | 大体积数据（可选，如嵌入的纹理等） |

### 2.2 二进制文件内部结构

```
.uasset 文件布局:
┌──────────────────────────┐
│ 文件头 (FPackageFileHead) │  ← 魔数、版本号、引擎版本
├──────────────────────────┤
│ 名称表 (Name Table)       │  ← 所有 FName 字符串的索引
├──────────────────────────┤
│ 导入表 (Import Table)     │  ← 该包依赖的外部对象引用
├──────────────────────────┤
│ 导出表 (Export Table)     │  ← 包内对象的偏移量和序列化参数
├──────────────────────────┤
│ 压缩/加密标记             │
└──────────────────────────┘

.uexp 文件布局:
┌──────────────────────────┐
│ UBlueprint 序列化数据     │  ← 蓝图元数据、父类、接口等
├──────────────────────────┤
│ UEdGraph 序列化数据       │  ← 图表信息
├──────────────────────────┤
│ UEdGraphNode[] 序列化数据 │  ← 每个节点的完整属性
│  ├─ NodeGuid             │  ← 32位十六进制唯一标识
│  ├─ NodePosX / NodePosY  │  ← 节点位置
│  ├─ Pins[]               │  ← 引脚数组
│  │   ├─ PinName          │  ← 引脚名称
│  │   ├─ Direction        │  ← 输入/输出方向
│  │   ├─ PinType          │  ← 引脚类型 (Exec/String/Bool/...)
│  │   ├─ DefaultValue     │  ← 默认值
│  │   ├─ LinkedTo[]       │  ← 连接的引脚引用
│  │   └─ ...              │
│  └─ 节点特有属性          │  ← 如函数名、变量引用等
└──────────────────────────┘
```

### 2.3 反序列化过程

当 UE 编辑器打开蓝图时，反序列化引擎执行以下步骤：

```
1. 读取 .uasset 文件头
   │
   ▼
2. 加载名称表，构建 FName → 字符串 映射
   │
   ▼
3. 加载导入表，解析外部依赖（如函数库引用、类引用）
   │
   ▼
4. 加载导出表，确定每个对象的类型和存储偏移
   │
   ▼
5. 逐个反序列化导出对象:
   a. 根据 ExportTable 中的 ClassIndex 确定对象类型
   b. 调用对应类的 Serialize() 方法
   c. UEdGraphNode::Serialize() 读取:
      - NodeGuid (FGuid, 16字节二进制)
      - NodePosX, NodePosY (int32)
      - Pins 数组 (TArray<UEdGraphPin*>)
      - 节点子类特有属性
   d. UEdGraphPin::Serialize() 读取:
      - PinName (FName, 索引到名称表)
      - Direction (EGPD_Input/EGPD_Output)
      - PinType.PinCategory (FName)
      - DefaultValue (FString)
      - LinkedTo (TArray<FPinReference>)
   │
   ▼
6. 第二遍处理：解析对象间引用
   - Pin->LinkedTo 中的 FPinReference 解析为 UEdGraphPin*
   - 节点的函数引用、变量引用等解析为实际对象
```

### 2.4 内存中的对象模型

反序列化完成后，蓝图在内存中形成如下对象树：

```
UBlueprint
└── UEdGraph (事件图表/函数图表)
    ├── UEdGraphNode (EventBeginPlay)
    │   ├── UEdGraphPin [Input]  (无，事件节点无输入执行引脚)
    │   ├── UEdGraphPin [Output] "then" → UK2Node_IfThenElse的"execute"引脚
    │   └── NodeGuid = {A1B2C3D4...}
    │
    ├── UK2Node_IfThenElse (Branch)
    │   ├── UEdGraphPin [Input] "execute" ← EventBeginPlay的"then"
    │   ├── UEdGraphPin [Input] "Condition" ← 某Bool值
    │   ├── UEdGraphPin [Output] "True" → PrintString的"execute"
    │   ├── UEdGraphPin [Output] "False" → 其他节点
    │   └── NodeGuid = {E5F67890...}
    │
    └── UK2Node_CallFunction (PrintString)
        ├── UEdGraphPin [Input] "execute" ← Branch的"True"
        ├── UEdGraphPin [Input] "InString" DefaultValue="Hello"
        ├── UEdGraphPin [Output] "then"
        └── NodeGuid = {12345678...}
```

**关键观察**：此时所有数据都在内存中，以 C++ 对象的形式存在。BlueprintAIBridge 的所有操作都从这个内存模型出发，**不直接读取 .uasset 二进制文件**。

---

## 3. 第二层：内存对象 → T3D 文本（ExportNodesToText）

### 3.1 T3D 格式概述

T3D（Text 3D）是 UE 引擎内置的文本序列化格式，用于以人类可读的文本形式描述 UObject 的属性。它是 UE 编辑器复制粘贴系统的底层格式。

### 3.2 ExportNodesToText 算法

插件调用 `FEdGraphUtilities::ExportNodesToText()` 执行导出，这是 UE 引擎的内置 API：

```cpp
TSet<UObject*> CompleteNodeSet;
for (UEdGraphNode* Node : Nodes)
{
    CompleteNodeSet.Add(Node);
}
FEdGraphUtilities::ExportNodesToText(CompleteNodeSet, /*out*/ CompleteSetT3D);
```

**该函数的内部算法**：

```
ExportNodesToText(NodeSet, OutText):
│
├── 1. 收集所有节点及其依赖对象
│   ├── 遍历 NodeSet 中的每个 UEdGraphNode
│   ├── 收集节点引用的子对象（如 UK2Node_Timeline 的内部对象）
│   └── 构建完整的导出对象列表
│
├── 2. 为每个对象生成 T3D 块
│   ├── 写入 "Begin Object" 头部
│   │   ├── Class=节点类名 (如 K2Node_IfThenElse)
│   │   ├── Name=节点实例名 (如 Branch_1)
│   │   └── NodeGuid=32位十六进制GUID
│   │
│   ├── 遍历对象的所有 UPROPERTY
│   │   ├── 跳过 Transient/Duplicate 标记的属性
│   │   ├── 对每个可序列化属性调用 ExportText()
│   │   │   ├── 基本类型: 直接输出值 (int→"42", float→"3.14", bool→"True")
│   │   │   ├── FString: 输出带引号的字符串 ("Hello")
│   │   │   ├── FName: 输出名称字符串
│   │   │   ├── FStruct: 递归输出结构体字段
│   │   │   ├── TArray: 逐元素输出
│   │   │   └── UObject*: 输出对象路径引用
│   │   └── 格式: "PropertyName=Value\n"
│   │
│   └── 写入 "End Object" 尾部
│
├── 3. 序列化引脚连接信息
│   ├── 对每个节点的每个 Pin:
│   │   ├── 输出 PinName
│   │   ├── 输出 Direction (EGPD_Input/EGPD_Output)
│   │   ├── 输出 PinType (Category, SubCategory, SubCategoryObject)
│   │   ├── 输出 DefaultValue / DefaultObject
│   │   └── 输出 LinkedTo 引用列表
│   └── 连接以 (NodeName, PinName) 对的形式存储
│
└── 4. 拼接所有 T3D 块为完整字符串
```

### 3.3 T3D 输出示例

一个 Branch 节点的 T3D 输出大致如下：

```text
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="Branch_1"
   NodeGuid=A1B2C3D4E5F678901234567890ABCDEF
   NodePosX=400
   NodePosY=100
   CustomProperties Pin (PinId=11111111111111111111111111111111,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 1234567890ABCDEF1234567890ABCDEF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=22222222222222222222222222222222,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="True",AutogeneratedDefaultValue="True",LinkedTo=(K2Node_VariableGet_0 33333333333333333333333333333333,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=44444444444444444444444444444444,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node","true","True"),Direction=EGPD_Output,PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 55555555555555555555555555555555,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=66666666666666666666666666666666,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node","false","False"),Direction=EGPD_Output,PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 77777777777777777777777777777777,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
```

**关键特征**：
- T3D 是**完全自描述**的：包含节点的所有属性、所有引脚的完整定义、所有连接关系
- 每个对象和引脚都有唯一的 **GUID**（32位十六进制）
- 连接关系通过 `(NodeName PinGuid)` 对引用
- T3D 可以被 `ImportNodesFromText()` 完整还原为内存对象

### 3.4 插件的三级缓存策略

插件在导出 T3D 时采用三级缓存，以 `TMap<FString, FString>` 存储：

| 缓存键 | 示例 | 内容 | 用途 |
|--------|------|------|------|
| `__CompleteSet__` | `__CompleteSet__` | 所有选中节点的完整 T3D（一次性导出） | 保留节点间连接关系 |
| `NodeName_ID` | `Branch_2` | 单个节点的 T3D | 精确实例匹配 |
| `NodeName` | `Branch` | 同类型首个节点的 T3D | 模板级匹配（当精确匹配失败时使用） |

```cpp
// 代码位置: TextGraphParser.cpp - GenerateShortCode()

// 第一级：完整集合（保留连接关系）
FEdGraphUtilities::ExportNodesToText(CompleteNodeSet, CompleteSetT3D);
OutNodeCache.Add(TEXT("__CompleteSet__"), CompleteSetT3D);

// 第二级：个体实例
FEdGraphUtilities::ExportNodesToText(SingleNodeSet, T3DContent);
OutNodeCache.Add(UniqueName, T3DContent);  // 如 "Branch_2"

// 第三级：类型模板（仅首次遇到时缓存）
if (!OutNodeCache.Contains(BaseName))
{
    OutNodeCache.Add(BaseName, T3DContent);  // 如 "Branch"
}
```

---

## 4. 第三层：内存对象 → 短代码文本（GenerateShortCode）

这是插件的核心创新——将复杂的 T3D 格式进一步压缩为人类和 AI 都能直观理解的**短代码**格式。

### 4.1 算法总览

```
GenerateShortCode(Nodes[], OutCache):
│
├── Phase 1: 全量 T3D 导出与缓存
│   ├── ExportNodesToText(所有节点) → __CompleteSet__ 缓存
│   └── 对每个节点: ExportNodesToText(单节点) → 个体/模板缓存
│
├── Phase 2: 节点定义生成
│   ├── 对每个节点:
│   │   ├── GetNodeBaseName() → 提取节点基础名称
│   │   ├── 生成唯一 ID: BaseName_序号
│   │   ├── 遍历输入引脚 → 提取名称和默认值
│   │   ├── 遍历输出引脚 → 提取名称
│   │   ├── 执行引脚别名映射
│   │   └── 拼接节点定义行
│   └── 输出: "# --- Node Definitions ---" + 所有节点定义
│
├── Phase 3: 连接关系生成
│   ├── 对每个节点的每个输出引脚:
│   │   ├── 遍历 LinkedTo 数组
│   │   ├── 检查目标节点是否在选中集合内
│   │   ├── 执行引脚别名映射
│   │   └── 拼接连接定义行
│   └── 输出: "# --- Links ---" + 所有连接定义
│
└── Phase 4: 组装最终输出
    └── 返回: NodeDefs + "\n" + LinkDefs
```

### 4.2 节点基础名称提取算法（GetNodeBaseName）

这是将 UE 内部的节点类型系统映射为人类可读名称的关键算法：

```cpp
FString GetNodeBaseName(UEdGraphNode* Node)
{
    // 策略1: 函数调用节点 → 使用函数名
    if (UK2Node_CallFunction* CallFunc = Cast<UK2Node_CallFunction>(Node))
    {
        if (CallFunc->GetTargetFunction())
            return CallFunc->GetTargetFunction()->GetName();
            // 示例: "PrintString", "GetPlayerController"
    }

    // 策略2: 变量获取节点 → "Get" + 变量名
    else if (UK2Node_VariableGet* VarGet = Cast<UK2Node_VariableGet>(Node))
    {
        return TEXT("Get") + VarGet->VariableReference.GetMemberName().ToString();
        // 示例: "GetHealth", "GetPlayerName"
    }

    // 策略3: 变量设置节点 → "Set" + 变量名
    else if (UK2Node_VariableSet* VarSet = Cast<UK2Node_VariableSet>(Node))
    {
        return TEXT("Set") + VarSet->VariableReference.GetMemberName().ToString();
        // 示例: "SetHealth", "SetIsAlive"
    }

    // 策略4: 分支节点 → 固定名称
    else if (UK2Node_IfThenElse* Branch = Cast<UK2Node_IfThenElse>(Node))
    {
        return TEXT("Branch");
    }

    // 策略5: 路线节点(Reroute) → 中文固定名称
    else if (UK2Node_Knot* Knot = Cast<UK2Node_Knot>(Node))
    {
        return TEXT("添加变更路线节点");
    }

    // 策略6: 其他节点 → 使用菜单标题，去除空格
    else
    {
        FString Title = Node->GetNodeTitle(ENodeTitleType::MenuTitle).ToString();
        Title.ReplaceInline(TEXT(" "), TEXT(""));
        return Title;
        // 示例: "事件开始运行", "ForLoop"
    }
}
```

**类型识别优先级**：`CallFunction → VariableGet → VariableSet → IfThenElse → Knot → 通用`

### 4.3 引脚信息提取算法

#### 4.3.1 引脚遍历与分类

```cpp
for (UEdGraphPin* Pin : Node->Pins)
{
    if (Pin->Direction == EGPD_Input)
    {
        // 输入引脚处理
        FString PinName = Pin->PinName.ToString();

        // 执行引脚别名映射
        if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
        {
            if (PinName == UEdGraphSchema_K2::PN_Execute.ToString())
                PinName = TEXT("inExec");
        }

        FString Value = GetPinValue(Pin);
        if (!Value.IsEmpty())
            Inputs += PinName + "\\(" + EscapePinValue(Value) + "\\); ";
        else
            Inputs += PinName + "; ";
    }
    else  // EGPD_Output
    {
        FString PinName = Pin->PinName.ToString();

        if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
        {
            if (PinName == UEdGraphSchema_K2::PN_Then.ToString())
                PinName = TEXT("outExec");
        }

        Outputs += PinName + "; ";
    }
}
```

#### 4.3.2 引脚默认值提取算法（GetPinValue）

```cpp
FString GetPinValue(UEdGraphPin* Pin)
{
    // ─── 字符串类型 ───
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_String)
    {
        // 优先级1: DefaultValue（字面量字符串）
        FString StringValue = Pin->DefaultValue;
        if (!StringValue.IsEmpty())
        {
            StringValue.ReplaceInline(TEXT("\""), TEXT(""));  // 移除UE存储的引号
            return StringValue;
        }

        // 优先级2: DefaultObject（字符串资产引用）
        if (Pin->DefaultObject)
            return Pin->DefaultObject->GetName();

        // 优先级3: GetDefaultAsString（兜底）
        FString DefaultValue = Pin->GetDefaultAsString();
        if (!DefaultValue.IsEmpty() && DefaultValue != TEXT("(None)"))
        {
            DefaultValue.ReplaceInline(TEXT("\""), TEXT(""));
            return DefaultValue;
        }

        return TEXT("");  // 无默认值
    }

    // ─── 枚举类型 ───
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Byte
        && Pin->PinType.PinSubCategoryObject.IsValid())
    {
        FString DefaultValue = Pin->GetDefaultAsString();
        if (UEnum* Enum = Cast<UEnum>(Pin->PinType.PinSubCategoryObject.Get()))
        {
            int64 EnumValue = FCString::Strtoi64(*DefaultValue, nullptr, 10);
            return Enum->GetNameStringByValue(EnumValue);
            // 示例: 整数 1 → "Standing" (枚举名)
        }
    }

    // ─── 通用类型 ───
    FString DefaultValue = Pin->GetDefaultAsString();
    if (DefaultValue == TEXT("(None)"))
        return TEXT("");  // 空对象引用
    DefaultValue.ReplaceInline(TEXT("\""), TEXT(""));
    return DefaultValue;
    // 示例: bool → "True"/"False", float → "3.14", Rotator → "(0, 90, 0)"
}
```

**值提取策略矩阵**：

| 引脚类型 | 数据来源 | 处理方式 | 示例 |
|---------|---------|---------|------|
| PC_String | `DefaultValue` | 移除引号 | `"Hello"` → `Hello` |
| PC_Byte (Enum) | `GetDefaultAsString()` + `PinSubCategoryObject` | 整数→枚举名 | `1` → `Standing` |
| PC_Bool | `GetDefaultAsString()` | 直接输出 | `True` |
| PC_Float | `GetDefaultAsString()` | 直接输出 | `3.14` |
| PC_Struct | `GetDefaultAsString()` | 输出结构体字面量 | `(X=0,Y=90,Z=0)` |
| PC_Object | `GetDefaultAsString()` | 空则返回空 | `(None)` → `""` |

### 4.4 连接关系提取算法

```cpp
// 遍历所有节点的输出引脚
for (UEdGraphNode* Node : Nodes)
{
    FString SourceID = NodeToID[Node];  // 如 "Branch_2"

    for (UEdGraphPin* Pin : Node->Pins)
    {
        if (Pin->Direction != EGPD_Output) continue;

        for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
        {
            UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();

            // 仅记录选中集合内部的连接
            if (!NodeToID.Contains(TargetNode)) continue;

            FString TargetID = NodeToID[TargetNode];

            // 引脚名称标准化
            FString SourcePinName = Pin->PinName.ToString();
            if (SourcePinName == UEdGraphSchema_K2::PN_Then)
                SourcePinName = TEXT("outExec");

            FString TargetPinName = LinkedPin->PinName.ToString();
            if (TargetPinName == UEdGraphSchema_K2::PN_Execute)
                TargetPinName = TEXT("inExec");

            // 生成连接行
            LinkDefs += SourceID + " (" + SourcePinName + ") -> "
                      + TargetID + " (" + TargetPinName + ")\n";
        }
    }
}
```

**执行引脚别名映射表**：

| UE 内部名称 | 短代码名称 | 引脚方向 | 说明 |
|-------------|-----------|---------|------|
| `execute` | `inExec` | 输入 | 白色执行箭头（左侧） |
| `then` | `outExec` | 输出 | 白色执行箭头（右侧） |

### 4.5 完整生成示例

给定以下蓝图逻辑：`EventBeginPlay → Branch → PrintString / SetActorRotation`

**输入**：3个 `UEdGraphNode*` 内存对象

**输出**：

```text
# --- Node Definitions ---
EventBeginPlay_1 () : (outExec;)
Branch_2 (inExec; Condition(true);) : (True; False;)
PrintString_3 (inExec; InString(Hello);) : (outExec;)

# --- Links ---
EventBeginPlay_1 (outExec) -> Branch_2 (inExec)
Branch_2 (True) -> PrintString_3 (inExec)
```

**同时生成 T3D 缓存**：

```json
{
  "__CompleteSet__": "Begin Object Class=K2Node_Event ... End Object Begin Object Class=K2Node_IfThenElse ... End Object ...",
  "EventBeginPlay_1": "Begin Object Class=K2Node_Event Name=\"EventBeginPlay_0\" ... End Object",
  "EventBeginPlay": "Begin Object Class=K2Node_Event Name=\"EventBeginPlay_0\" ... End Object",
  "Branch_2": "Begin Object Class=K2Node_IfThenElse Name=\"Branch_1\" ... End Object",
  "Branch": "Begin Object Class=K2Node_IfThenElse Name=\"Branch_1\" ... End Object",
  "PrintString_3": "Begin Object Class=K2Node_CallFunction Name=\"PrintString_0\" ... End Object",
  "PrintString": "Begin Object Class=K2Node_CallFunction Name=\"PrintString_0\" ... End Object"
}
```

---

## 5. 第四层：短代码文本 → T3D 文本（ParseAndPaste 逆向转换）

### 5.1 算法总览

```
ParseAndPaste(ShortCode, Blueprint, NodeCache, Location, TargetGraph):
│
├── Phase 1: 文本解析
│   ├── 按行分割短代码
│   ├── 跳过空行和注释行(#开头)
│   ├── 含 "->" 的行 → ParseLinkDefinition() → FLinkDefinition
│   └── 其他行 → ParseNodeDefinition() → FNodeDefinition
│
├── Phase 2: 节点创建
│   ├── 开启 FScopedTransaction (支持Undo)
│   ├── 对每个 FNodeDefinition:
│   │   ├── 查找 T3D 缓存 (精确匹配 → 模板匹配)
│   │   ├── RegenerateT3DGUIDs() 替换所有GUID
│   │   ├── ImportNodesFromText() 导入节点
│   │   └── 设置节点位置 (Location + 偏移量)
│   └── 记录 CreatedNodes 映射: ID → UEdGraphNode*
│
├── Phase 3: 连接重建
│   ├── 对每个 FLinkDefinition:
│   │   ├── 查找源/目标节点
│   │   ├── 查找源/目标引脚 (含别名回退)
│   │   ├── 检查是否已连接
│   │   └── MakeLinkTo() 创建连接
│   └── 处理执行引脚别名回退
│
└── Phase 4: 后处理
    ├── MarkBlueprintAsStructurallyModified()
    ├── NotifyGraphChanged()
    └── SelectNodeSet() 选中新节点
```

### 5.2 短代码解析算法

#### 5.2.1 节点定义行解析（ParseNodeDefinition）

输入示例：`Branch_2 (inExec; Condition\(true\);) : (True; False;)`

```
ParseNodeDefinition(Line, OutDef):
│
├── 1. 分离节点名部分和引脚部分
│   ├── 找到第一个 '(' 的位置 → ParenIdx
│   ├── NamePart = Line.Left(ParenIdx) = "Branch_2"
│   └── PinsPart = Line.Mid(ParenIdx) = "(inExec; Condition(true);) : (True; False;)"
│
├── 2. 提取节点名和ID
│   ├── 从 NamePart 末尾查找最后一个 '_'
│   ├── Name = "Branch"
│   └── ID = "2"
│
├── 3. 分离输入引脚和输出引脚
│   ├── 找到 ':' 的位置 → ColonIdx
│   ├── InputsStr = "(inExec; Condition(true);)"
│   └── OutputsStr = "(True; False;)"
│
└── 4. 解析引脚列表 (ParsePinList)
    ├── 去除首尾括号
    ├── 按 ';' 分割为 Token 数组
    ├── 对每个 Token:
    │   ├── 检查是否包含转义括号 "\(" ... "\)"
    │   ├── 有值引脚: PinName = "Condition", PinValue = "true"
    │   └── 无值引脚: PinName = "inExec", PinValue = ""
    └── 结果:
        ├── InputPins = {"inExec":"", "Condition":"true"}
        └── OutputPins = ["True", "False"]
```

#### 5.2.2 连接定义行解析（ParseLinkDefinition）

输入示例：`Branch_2 (True) -> PrintString_3 (inExec)`

```
ParseLinkDefinition(Line, OutLink):
│
├── 1. 以 "->" 分割左右两侧
│   ├── Left = "Branch_2 (True)"
│   └── Right = "PrintString_3 (inExec)"
│
├── 2. 解析左侧 (ParseNodePin)
│   ├── 找到括号位置: ParenStart=8, ParenEnd=13
│   ├── NameID = "Branch_2"
│   ├── PinName = "True"
│   └── 从 NameID 提取 NodeID: 找最后一个 '_' → "2"
│
└── 3. 解析右侧 (ParseNodePin)
    ├── NameID = "PrintString_3"
    ├── PinName = "inExec"
    └── NodeID = "3"

结果: SourceNodeID="2", SourcePinName="True", TargetNodeID="3", TargetPinName="inExec"
```

### 5.3 T3D 缓存查找策略

```
对每个节点定义 (Name="Branch", ID="2"):

1. 构造精确键: "Branch_2"
   └── NodeCache.Contains("Branch_2") ?
       ├── 是 → 使用 NodeCache["Branch_2"] 的 T3D
       └── 否 ↓

2. 构造模板键: "Branch"
   └── NodeCache.Contains("Branch") ?
       ├── 是 → 使用 NodeCache["Branch"] 的 T3D
       └── 否 ↓

3. 缓存未命中
   └── 跳过该节点，输出 Warning 日志
```

---

## 6. 第五层：T3D 文本 → 内存对象（ImportNodesFromText）

### 6.1 ImportNodesFromText 算法

```cpp
FEdGraphUtilities::ImportNodesFromText(TargetGraph, ModifiedT3D, ImportedNodes);
```

**该函数的内部算法**：

```
ImportNodesFromText(Graph, T3DText, OutImportedNodes):
│
├── 1. 创建临时包 (Transient Package) 作为反序列化沙盒
│
├── 2. 解析 T3D 文本
│   ├── 查找 "Begin Object" 标记
│   ├── 提取 Class= 类名
│   ├── 提取 Name= 实例名
│   └── 提取所有 CustomProperties
│
├── 3. 对象实例化
│   ├── 根据 Class 路径加载类 (StaticLoadClass)
│   ├── 在临时包中 NewObject 创建实例
│   └── 设置对象属性:
│       ├── NodeGuid → 如果已存在则复用，否则创建新节点
│       ├── NodePosX, NodePosY
│       ├── Pins 数组重建
│       └── 节点特有属性 (函数引用、变量引用等)
│
├── 4. 将对象从临时包移动到目标图表
│   ├── Rename 到目标图表的 Outer
│   ├── 注册节点到图表的 Nodes 数组
│   └── 重建引脚连接关系
│
├── 5. 后处理
│   ├── 调用 Node->ReconstructNode() 重建节点视觉
│   ├── 解析 Pin 连接引用
│   └── 添加到 OutImportedNodes
│
└── 6. 通知图表变更
```

### 6.2 GUID 冲突问题

**核心问题**：`ImportNodesFromText` 在遇到与现有节点相同的 `NodeGuid` 时，会尝试**复用**已有节点而非创建新实例。这意味着如果用户多次粘贴同一段短代码，后续粘贴不会创建新节点。

**解决方案**：在导入前，替换 T3D 文本中的所有 GUID（详见第7节）。

---

## 7. GUID 重新生成算法

### 7.1 算法原理

在 T3D 文本中，GUID 以 32 位连续十六进制字符的形式出现（如 `A1B2C3D4E5F678901234567890ABCDEF`）。该算法扫描并替换所有此类模式。

### 7.2 详细算法

```cpp
auto RegenerateT3DGUIDs = [](const FString& OriginalT3D) -> FString
{
    FString Result = OriginalT3D;

    // 辅助函数: 判断字符是否为十六进制
    auto IsHexChar = [](TCHAR Char) -> bool
    {
        return (Char >= '0' && Char <= '9') ||
               (Char >= 'A' && Char <= 'F') ||
               (Char >= 'a' && Char <= 'f');
    };

    int32 SearchIdx = 0;
    while (true)
    {
        // 步骤1: 从 SearchIdx 开始，查找32位连续hex字符
        int32 GUIDStart = INDEX_NONE;
        for (int32 i = SearchIdx; i < Result.Len() - 32; i++)
        {
            bool bFoundGUID = true;
            for (int32 j = 0; j < 32; j++)
            {
                if (!IsHexChar(Result[i + j]))
                {
                    bFoundGUID = false;
                    break;
                }
            }

            if (bFoundGUID)
            {
                GUIDStart = i;
                break;
            }
        }

        if (GUIDStart == INDEX_NONE) break;  // 没有更多GUID

        // 步骤2: 生成新GUID
        FGuid NewGuid = FGuid::NewGuid();

        // 步骤3: 格式化为大写无连字符字符串
        FString NewGuidStr = NewGuid
            .ToString(EGuidFormats::DigitsWithHyphens)
            .Replace(TEXT("-"), TEXT(""))
            .ToUpper();
        // 示例: FGuid → "a1b2c3d4-e5f6-7890-1234-567890abcdef"
        //        → "a1b2c3d4e5f678901234567890abcdef"
        //        → "A1B2C3D4E5F678901234567890ABCDEF"

        // 步骤4: 原地替换
        Result.RemoveAt(GUIDStart, 32);
        Result.InsertAt(GUIDStart, NewGuidStr);

        // 步骤5: 移动搜索位置到替换后的位置之后
        SearchIdx = GUIDStart + 32;
    }

    return Result;
};
```

### 7.3 算法执行示例

**输入 T3D 片段**：
```text
NodeGuid=A1B2C3D4E5F678901234567890ABCDEF
```

**执行过程**：
```
第1次迭代:
  找到GUID: "A1B2C3D4E5F678901234567890ABCDEF" (位置 9-40)
  生成新GUID: FGuid::NewGuid() → "F9E8D7C6B5A432109876543210FEDCBA"
  替换后: "NodeGuid=F9E8D7C6B5A432109876543210FEDCBA"
  SearchIdx = 41

第2次迭代:
  从位置41继续搜索...
  找到下一个GUID（如PinId）...
  重复替换过程...

...直到没有更多32位hex字符串
```

### 7.4 算法注意事项

1. **误判风险**：32位连续hex字符可能出现在非GUID上下文中（如很长的数字常量）。但在 T3D 格式中，这种模式几乎只出现在 GUID 位置，误判概率极低。

2. **大小写处理**：UE 的 T3D 导出中 GUID 使用大写，替换后也保持大写，确保格式一致。

3. **性能**：每次替换都涉及字符串的 RemoveAt + InsertAt，对于大量 GUID 的长 T3D 文本，时间复杂度为 O(M × G)，其中 M 为 T3D 长度，G 为 GUID 数量。

---

## 8. 引脚值编解码算法

### 8.1 转义算法（EscapePinValue）

短代码格式使用括号 `()` 和分号 `;` 作为结构分隔符，因此引脚值中出现的这些字符必须被转义。

```cpp
FString EscapePinValue(const FString& Value)
{
    FString Result = Value;
    Result.ReplaceInline(TEXT("\\"), TEXT("\\\\"));   // \ → \\  (必须先处理)
    Result.ReplaceInline(TEXT("("),  TEXT("\\("));    // ( → \(
    Result.ReplaceInline(TEXT(")"),  TEXT("\\)"));    // ) → \)
    Result.ReplaceInline(TEXT(";"),  TEXT("\\;"));    // ; → \;
    Result.ReplaceInline(TEXT("\n"), TEXT("\\n"));    // 换行 → \n
    Result.ReplaceInline(TEXT("\r"), TEXT("\\r"));    // 回车 → \r
    Result.ReplaceInline(TEXT("\t"), TEXT("\\t"));    // 制表 → \t
    return Result;
}
```

**转义顺序至关重要**：反斜杠必须首先转义，否则后续转义产生的 `\(` 中的 `\` 会被二次转义为 `\\(`。

### 8.2 反转义算法（UnescapePinValue）

```cpp
FString UnescapePinValue(const FString& Value)
{
    FString Result = Value;
    // 反转义顺序与转义顺序相反
    Result.ReplaceInline(TEXT("\\t"), TEXT("\t"));    // \t → 制表
    Result.ReplaceInline(TEXT("\\r"), TEXT("\r"));    // \r → 回车
    Result.ReplaceInline(TEXT("\\n"), TEXT("\n"));    // \n → 换行
    Result.ReplaceInline(TEXT("\\;"), TEXT(";"));     // \; → ;
    Result.ReplaceInline(TEXT("\\("), TEXT("("));     // \( → (
    Result.ReplaceInline(TEXT("\\)"), TEXT(")"));     // \) → )
    Result.ReplaceInline(TEXT("\\\\"), TEXT("\\"));   // \\ → \  (必须最后处理)
    return Result;
}
```

### 8.3 编解码示例

| 原始值 | 转义后 | 说明 |
|--------|--------|------|
| `Hello` | `Hello` | 无特殊字符 |
| `Hello(World)` | `Hello\(World\)` | 括号转义 |
| `a;b` | `a\;b` | 分号转义 |
| `C:\Path` | `C\:\\Path` | 反斜杠和冒号 |
| `Line1\nLine2` | `Line1\\nLine2` | 先转义\，再转义换行 |

---

## 9. 短代码文本格式规范（Text Graph DSL）

### 9.1 完整语法规范

```
ShortCode ::= NodeDefsSection LinksSection

NodeDefsSection ::= "# --- Node Definitions ---" NL NodeDef*
NodeDef ::= NodeName "_" NodeID "(" InputPinList ")" ":" "(" OutputPinList ")" NL

InputPinList ::= (InputPin ("; " InputPin)*)?
InputPin ::= PinName | PinName "\\(" PinValue "\\)"
OutputPinList ::= (OutputPin ("; " OutputPin)*)?
OutputPin ::= PinName

LinksSection ::= "# --- Links ---" NL LinkDef*
LinkDef ::= NodeName "_" NodeID "(" PinName ")" "->" NodeName "_" NodeID "(" PinName ")" NL

NodeName ::= [a-zA-Z\u4e00-\u9fff][a-zA-Z0-9\u4e00-\u9fff_]*
NodeID ::= [0-9]+
PinName ::= [a-zA-Z0-9_]+
PinValue ::= [^\\)]*  (转义后的任意字符)
```

### 9.2 语义规则

1. **NodeID 唯一性**：同一批次中，NodeID 必须唯一
2. **引脚分隔**：引脚之间以 `; ` （分号+空格）分隔，最后一个引脚后也有分号
3. **值包裹**：带默认值的引脚使用 `\(` 和 `\)` 包裹值
4. **连接方向**：`->` 左侧为源（输出引脚），右侧为目标（输入引脚）
5. **注释行**：以 `#` 开头的行被解析器忽略

---

## 10. 缓存持久化算法

### 10.1 保存算法（SaveCache）

```
SaveCache():
│
├── 1. 构造文件路径
│   └── {ProjectSavedDir}/BlueprintAIBridge/NodeTemplates.json
│
├── 2. 创建目录（如不存在）
│   └── CreateDirectoryTree()
│
├── 3. JSON 序列化
│   ├── 创建 TJsonObject
│   ├── 对 NodeTemplateCache 中每个键值对:
│   │   └── RootObject->SetStringField(Key, Value)
│   │       // Key: 如 "Branch_2"
│   │       // Value: 完整的 T3D 文本字符串
│   └── TJsonSerializer::Serialize() → JsonString
│
└── 4. 写入文件
    └── FFileHelper::SaveStringToFile(JsonString, *Path)
```

### 10.2 加载算法（LoadCache）

```
LoadCache():
│
├── 1. 构造文件路径
│   └── {ProjectSavedDir}/BlueprintAIBridge/NodeTemplates.json
│
├── 2. 读取文件内容
│   └── FFileHelper::LoadFileToString(Content, *Path)
│
├── 3. JSON 反序列化
│   ├── TJsonReader::Create(Content)
│   ├── TJsonSerializer::Deserialize() → JsonObject
│   └── 验证 JsonObject 有效性
│
└── 4. 合并到内存缓存（而非替换！）
    └── 对 JsonObject 的每个键值对:
        ├── 检查值类型 == EJson::String
        └── NodeTemplateCache.Add(Key, Value)
            // Add 语义: 如键已存在则覆盖
```

**关键设计**：加载时使用**合并**而非替换策略，确保插件启动时加载的缓存不会被后续操作丢失。

### 10.3 缓存文件结构示例

```json
{
  "__CompleteSet__": "Begin Object Class=/Script/BlueprintGraph.K2Node_Event ... End Object Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse ... End Object",
  "EventBeginPlay_1": "Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name=\"K2Node_Event_0\" NodeGuid=... End Object",
  "EventBeginPlay": "Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name=\"K2Node_Event_0\" NodeGuid=... End Object",
  "Branch_2": "Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name=\"Branch_1\" NodeGuid=... End Object",
  "Branch": "Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name=\"Branch_1\" NodeGuid=... End Object"
}
```

---

## 11. 完整算法复杂度分析

### 11.1 正向转换（复制）复杂度

| 阶段 | 时间复杂度 | 说明 |
|------|-----------|------|
| 获取选中节点 | O(N) | N = 选中节点数 |
| ExportNodesToText (全量) | O(N × P) | P = 平均每节点属性数 |
| ExportNodesToText (个体×N) | O(N × P) | 每个节点单独导出 |
| 引脚信息提取 | O(N × P) | 遍历所有节点的所有引脚 |
| 连接关系提取 | O(N × P × L) | L = 平均每引脚连接数 |
| 缓存序列化 | O(C × M) | C = 缓存条目数, M = 平均T3D长度 |
| **总计** | **O(N × P × L + C × M)** | |

### 11.2 逆向转换（粘贴）复杂度

| 阶段 | 时间复杂度 | 说明 |
|------|-----------|------|
| 文本解析 | O(S) | S = 短代码字符串长度 |
| T3D 缓存查找 | O(N') | N' = 解析出的节点数 |
| GUID 重新生成 | O(N' × M × G) | M = T3D长度, G = 每T3D中GUID数 |
| ImportNodesFromText | O(N' × P) | 反序列化+对象创建 |
| 连接重建 | O(L') | L' = 连接数 |
| **总计** | **O(N' × M × G + S)** | GUID替换是性能瓶颈 |

### 11.3 空间复杂度

| 数据结构 | 空间复杂度 | 说明 |
|---------|-----------|------|
| NodeTemplateCache | O(C × M) | C = 缓存条目数, M = 平均T3D长度 |
| NodeToID 映射 | O(N) | 节点指针 → 字符串 |
| CreatedNodes 映射 | O(N') | ID → 节点指针 |
| T3D 临时字符串 | O(M) | 单个T3D副本 |

---

## 12. 关键数据结构速查

### 12.1 插件自定义结构

```cpp
// 节点定义（解析后的短代码节点）
struct FNodeDefinition
{
    FString Name;                       // "Branch"
    FString ID;                         // "2"
    TMap<FString, FString> InputPins;   // {"inExec":"", "Condition":"true"}
    TArray<FString> OutputPins;         // ["True", "False"]
};

// 连接定义（解析后的短代码连接）
struct FLinkDefinition
{
    FString SourceNodeID;               // "2"
    FString SourcePinName;              // "True"
    FString TargetNodeID;               // "3"
    FString TargetPinName;              // "inExec"
};
```

### 12.2 UE 引擎核心结构

```cpp
// 蓝图节点（内存对象）
class UEdGraphNode
{
    FGuid NodeGuid;                     // 节点唯一标识
    int32 NodePosX, NodePosY;           // 节点位置
    TArray<UEdGraphPin*> Pins;          // 引脚数组
    // ... 子类特有属性
};

// 蓝图引脚（内存对象）
class UEdGraphPin
{
    FName PinName;                      // 引脚名称
    EGraphPinDirection Direction;       // EGPD_Input / EGPD_Output
    FEdGraphPinType PinType;            // 引脚类型
    FString DefaultValue;               // 默认值（字符串类型）
    UObject* DefaultObject;             // 默认对象（对象引用类型）
    TArray<UEdGraphPin*> LinkedTo;      // 连接的引脚列表
    bool bHidden;                       // 是否隐藏
    bool bOrphanedPin;                  // 是否孤立引脚
};

// 引脚类型
struct FEdGraphPinType
{
    FName PinCategory;                  // "exec"/"bool"/"string"/"struct"/...
    FName PinSubCategory;               // 子类别
    UObject* PinSubCategoryObject;      // 子类别对象（如枚举、结构体）
};
```

### 12.3 数据变换对照表

| 数据形态 | 节点标识 | 引脚表示 | 连接表示 | 值表示 |
|---------|---------|---------|---------|--------|
| **二进制(.uasset)** | NodeGuid (16字节) | PinId + 属性二进制 | LinkedTo引用 | 类型化二进制 |
| **内存对象** | UEdGraphNode* | UEdGraphPin* | Pin->LinkedTo[] | Pin->DefaultValue |
| **T3D文本** | NodeGuid=HEX32 | CustomProperties Pin(...) | LinkedTo=(Name GUID) | Key=Value |
| **短代码文本** | Name_ID | (PinName; PinName(Value);) | ID(Pin) -> ID(Pin) | (Value) |
| **JSON缓存** | 键: Name_ID | 值: 完整T3D字符串 | 内嵌于T3D | 内嵌于T3D |

---

*文档结束*
