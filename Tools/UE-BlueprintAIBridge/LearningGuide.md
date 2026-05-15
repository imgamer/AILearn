# 从 BlueprintAIBridge 学习虚幻引擎 C++ 插件开发

> **适用对象**: 虚幻引擎 C++ 新手  
> **学习前提**: 具备 C++ 基础语法知识，了解基本的面向对象编程  
> **学习目标**: 理解 BlueprintAIBridge 插件背后的虚幻引擎技术，逐步掌握编辑器插件开发能力  
> **建议方式**: 按阶段顺序学习，每阶段配合实际代码阅读和实践

---

## 学习路径总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    学习路线图（建议6-8周）                        │
├─────────────────────────────────────────────────────────────────┤
│  第1周   │  第2周   │  第3周   │  第4周   │  第5周   │  第6周  │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│ 阶段1   │  阶段2  │  阶段3  │  阶段4  │  阶段5  │   阶段6     │
│ 插件与  │ UObject │ Slate   │ EdGraph │ 文件与  │ 高级主题    │
│ 模块系统│ 核心系统│ UI框架  │ 图表系统│ 序列化  │ 项目整合    │
├─────────┴─────────┴─────────┴─────────┴─────────┴─────────────┤
│  配套实践：修改插件功能 → 添加新按钮 → 实现自定义节点解析        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 阶段 1：插件与模块系统

> **时间建议**: 3-4 天  
> **对应文件**: `BlueprintAIBridge.uplugin`, `BlueprintAIBridge.Build.cs`, `BlueprintAIBridge.h/cpp`

### 1.1 什么是虚幻引擎插件？

**概念**: 插件是虚幻引擎的"功能扩展包"。引擎本身由大量模块组成，插件可以在不修改引擎源码的情况下添加新功能。

**类比理解**: 就像浏览器的扩展程序（Chrome Extension），或者 Minecraft 的模组。

**BlueprintAIBridge 的定位**:
- 这是一个 **Editor 类型** 的插件——只在编辑器中存在，打包游戏时不会包含
- 功能：在蓝图编辑器中添加工具栏按钮，实现人机之间的节点代码交换

### 1.2 插件描述文件 (.uplugin)

打开 `BlueprintAIBridge.uplugin`：

```json
{
    "FileVersion": 3,
    "Version": 1,
    "VersionName": "1.0",
    "FriendlyName": "BlueprintAIBridge",
    "Description": "蓝图与ai沟通的桥梁",
    "Category": "Other",
    "CanContainContent": false,
    "IsBetaVersion": true,
    "Modules": [
        {
            "Name": "BlueprintAIBridge",
            "Type": "Editor",
            "LoadingPhase": "Default"
        }
    ],
    "Plugins": [
        {
            "Name": "PythonScriptPlugin",
            "Enabled": true
        }
    ]
}
```

**逐字段学习**:

| 字段 | 含义 | 学习要点 |
|------|------|---------|
| `FileVersion` | 文件格式版本 | 保持为 3，这是 UE5 的标准 |
| `Version` / `VersionName` | 插件版本号 | 语义化版本控制，便于用户识别更新 |
| `FriendlyName` | 显示名称 | 在插件浏览器中看到的名字 |
| `Description` | 描述 | 简要说明插件功能 |
| `Category` | 分类 | `"Other"` 表示其他，也可以是 `"Editor"`、`"Gameplay"` 等 |
| `CanContainContent` | 是否包含内容 | false = 纯代码插件；true = 可包含蓝图、材质等资产 |
| `IsBetaVersion` | 是否Beta版本 | true 会在插件名后显示 "(Beta)" 标签 |
| `Modules` | 模块列表 | 一个插件可以包含多个模块，每个模块是一个独立的编译单元 |
| `Modules.Type` | 模块类型 | `"Editor"` = 仅编辑器；`"Runtime"` = 运行时也可用；`"Developer"` = 开发时 |
| `Modules.LoadingPhase` | 加载时机 | `"Default"` 正常加载；`"PostEngineInit"` 引擎初始化后；`"PreDefault"` 默认之前 |
| `Plugins` | 依赖插件 | 声明此插件依赖的其他插件 |

**实践练习**:
1. 修改 `FriendlyName` 为你自己的名字，重启编辑器查看变化
2. 将 `IsBetaVersion` 改为 `false`，观察插件名称变化

### 1.3 模块构建配置 (.Build.cs)

打开 `BlueprintAIBridge.Build.cs`：

```csharp
public class BlueprintAIBridge : ModuleRules
{
    public BlueprintAIBridge(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
        
        // 编译警告控制
        bEnableUndefinedIdentifierWarnings = false;
        bWarningsAsErrors = false;

        // 公共依赖（其他模块也能看到）
        PublicDependencyModuleNames.AddRange(
            new string[]
            {
                "Core",
                "CoreUObject",
                "Engine",
                "InputCore",
                "UnrealEd",
                "BlueprintGraph",
                // ... 更多模块
            }
        );

        // 私有依赖（只有本模块使用）
        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "Projects",
                "Json",
                "JsonUtilities",
            }
        );
    }
}
```

**核心概念**:

**什么是模块 (Module)**？
- 模块是虚幻引擎代码组织的基本单位
- 每个模块编译为一个 `.dll`（Windows）或 `.dylib`（Mac）文件
- 模块之间通过声明依赖关系来共享代码

**Public vs Private 依赖的区别**:

```
如果模块A Public 依赖模块B：
    模块A 可以使用模块B 的代码
    依赖模块A 的其他模块 也可以使用模块B 的代码

如果模块A Private 依赖模块B：
    模块A 可以使用模块B 的代码
    依赖模块A 的其他模块 不能使用模块B 的代码
```

**BlueprintAIBridge 的关键依赖模块**:

| 模块 | 用途 | 为什么需要 |
|------|------|-----------|
| `Core` | 最基础的功能 | 字符串、数组、映射等基础类型 |
| `CoreUObject` | UObject 系统 | 虚幻的反射和垃圾回收系统 |
| `Engine` | 引擎核心 | 蓝图、资产等核心类 |
| `UnrealEd` | 编辑器 | 访问编辑器功能 |
| `BlueprintGraph` | 蓝图图表 | 蓝图节点的数据结构 |
| `Kismet` / `KismetCompiler` | 蓝图系统 | 蓝图编译和运行时 |
| `Slate` / `SlateCore` | UI框架 | 创建编辑器界面 |
| `ToolMenus` | 菜单系统 | 向工具栏添加按钮 |
| `Json` / `JsonUtilities` | JSON处理 | 读写缓存文件 |

**实践练习**:
1. 尝试添加一个新的 Private 依赖模块 `"Projects"`
2. 尝试注释掉一个依赖模块，观察编译错误，理解为什么需要它

### 1.4 插件模块生命周期

打开 `BlueprintAIBridge.h`：

```cpp
class FBlueprintAIBridgeModule : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;
    // ...
};
```

**核心概念**:

`IModuleInterface` 是虚幻引擎所有模块必须实现的接口。它定义了模块的"生命周期钩子"。

想象模块就像一个手机App：
- `StartupModule()` = App 启动时执行的初始化（创建界面、加载数据、注册服务）
- `ShutdownModule()` = App 关闭时执行的清理（保存数据、释放资源、注销服务）

**本插件的启动流程** (`StartupModule`)：

```
1. FBlueprintAIBridgeStyle::Initialize()       ← 加载图标和样式
2. FBlueprintAIBridgeCommands::Register()      ← 注册命令（Copy/Paste/Format）
3. 创建 PluginCommands 命令列表
4. 将命令映射到具体的函数
5. UToolMenus::RegisterStartupCallback()       ← 注册菜单回调
6. LoadCache()                                  ← 加载节点模板缓存
7. 监听编辑器打开事件，自动绑定命令
```

**本插件的关闭流程** (`ShutdownModule`)：

```
1. 移除编辑器打开事件的监听
2. UToolMenus::UnRegisterStartupCallback()     ← 注销菜单
3. FBlueprintAIBridgeStyle::Shutdown()         ← 释放样式资源
4. FBlueprintAIBridgeCommands::Unregister()    ← 注销命令
```

**实践练习**:
在 `StartupModule()` 和 `ShutdownModule()` 中添加日志输出：

```cpp
#include "Logging/LogMacros.h"

void FBlueprintAIBridgeModule::StartupModule()
{
    UE_LOG(LogTemp, Log, TEXT("BlueprintAIBridge 模块已启动！"));
    // ... 原有代码
}

void FBlueprintAIBridgeModule::ShutdownModule()
{
    UE_LOG(LogTemp, Log, TEXT("BlueprintAIBridge 模块已关闭！"));
    // ... 原有代码
}
```

重新编译后，在编辑器的 **窗口 → 开发者工具 → 输出日志** 中查看输出。

---

## 阶段 2：UObject 核心系统

> **时间建议**: 4-5 天  
> **对应文件**: 贯穿所有代码，重点关注 `TextGraphParser.cpp`

### 2.1 什么是 UObject？

**概念**: `UObject` 是虚幻引擎所有"引擎对象"的基类。它是虚幻最核心的设计之一。

**类比理解**: 就像 Java 中所有类都继承 `Object`，虚幻中大量类都继承 `UObject`。

**UObject 提供的能力**:

| 能力 | 说明 | 本插件中的应用 |
|------|------|--------------|
| **反射 (Reflection)** | 运行时可以查询类的属性和方法 | 获取节点的引脚信息、节点类型 |
| **垃圾回收 (GC)** | 自动内存管理，不需要手动 delete | 所有创建的节点自动管理生命周期 |
| **序列化** | 自动保存/加载对象到磁盘 | T3D 格式导出节点 |
| **编辑器集成** | 在编辑器中显示属性面板 | 蓝图编辑器中的节点显示 |

**关键宏**: `UCLASS()`, `UFUNCTION()`, `UPROPERTY()`

这些宏告诉虚幻的"反射系统"：这个类/函数/属性需要在运行时可访问。

**本插件中遇到的 UObject 相关类**:

```cpp
UObject              // 所有引擎对象的基类
├── UEdGraphNode     // 图表节点（蓝图中的每个节点都是这个）
├── UEdGraph         // 图表（蓝图的逻辑图）
├── UBlueprint       // 蓝图资产
├── UK2Node_*        // 各种蓝图节点类型（Kismet 2 节点）
│   ├── UK2Node_CallFunction    // 函数调用节点
│   ├── UK2Node_VariableGet     // 获取变量节点
│   ├── UK2Node_VariableSet     // 设置变量节点
│   ├── UK2Node_IfThenElse      // Branch 分支节点
│   └── UK2Node_Knot            // 变更路线（Reroute）节点
```

### 2.2 类型识别与类型转换

**概念**: 在运行时确定对象的具体类型，并安全地转换类型。

打开 `TextGraphParser.cpp` 中的 `GetNodeBaseName` 函数：

```cpp
FString FTextGraphParser::GetNodeBaseName(UEdGraphNode* Node)
{
    // Cast<T>() - 安全类型转换，失败返回 nullptr
    if (UK2Node_CallFunction* CallFunc = Cast<UK2Node_CallFunction>(Node))
    {
        if (CallFunc->GetTargetFunction())
        {
            return CallFunc->GetTargetFunction()->GetName();
        }
    }
    else if (UK2Node_VariableGet* VarGet = Cast<UK2Node_VariableGet>(Node))
    {
        return TEXT("Get") + VarGet->VariableReference.GetMemberName().ToString();
    }
    // ... 更多类型检查
}
```

**三种类型转换方式对比**:

| 方式 | 语法 | 特点 | 适用场景 |
|------|------|------|---------|
| `Cast<T>()` | `Cast<UK2Node_CallFunction>(Node)` | 安全转换，失败返回 nullptr | UObject 继承体系（推荐） |
| `StaticCast<T>()` | `StaticCast<UK2Node_CallFunction*>(Node)` | 编译期检查，运行期无开销 | 已知类型一定正确 |
| `dynamic_cast` | `dynamic_cast<UK2Node_CallFunction*>(Node)` | C++ 标准方式 | 一般不用于 UObject |

**学习要点**:
- `Cast<T>()` 只能用于 UObject 继承体系（因为有反射信息）
- 如果 `Node` 不是 `UK2Node_CallFunction` 类型，`Cast` 会返回 `nullptr`
- 这是虚幻引擎的"多态"实现方式之一

**实践练习**:
在 `GetNodeBaseName` 函数中添加对新类型的支持，例如 `UK2Node_DynamicCast`：

```cpp
else if (UK2Node_DynamicCast* CastNode = Cast<UK2Node_DynamicCast>(Node))
{
    return TEXT("CastTo") + CastNode->TargetType->GetName();
}
```

### 2.3 FName、FString、FText —— 三种字符串类型

这是虚幻引擎中最容易让新手困惑的概念之一。

**三种字符串的区别**:

| 类型 | 特点 | 用途 | 示例 |
|------|------|------|------|
| `FName` | 全局唯一、大小写不敏感、哈希存储 | 标识符、名称引用 | `FName("InExec")` |
| `FString` | 可变、支持修改、UTF-16 编码 | 通用字符串处理 | `FString(TEXT("Hello"))` |
| `FText` | 支持本地化、不可直接比较 | 显示给用户看的文本 | `FText::FromString("你好")` |

**在本插件中的使用场景**:

```cpp
// FName - 用于引脚名称、节点标识（不区分大小写，查找快）
UEdGraphPin* Pin = Node->FindPin(FName(*Link.SourcePinName));

// FString - 用于文本拼接、文件读写
FString ShortCode = FTextGraphParser::GenerateShortCode(Nodes, Cache);

// FText - 用于UI显示、通知消息
FNotificationInfo Info(GetLocalizedText(TEXT("Nodes copied"), TEXT("节点已复制")));
```

**转换方法**:

```cpp
FString  → FName:   FName MyName(*MyString);
FName    → FString: FString MyString = MyName.ToString();
FString  → FText:   FText MyText = FText::FromString(MyString);
FText    → FString: FString MyString = MyText.ToString();
```

**学习要点**:
- 如果字符串用于"查找"或"比较"，优先用 `FName`（性能更好）
- 如果要显示给用户，用 `FText`（支持翻译）
- 如果只是临时处理，用 `FString`

### 2.4 TMap 和 TArray —— 虚幻的容器

**TArray** —— 动态数组（类似 `std::vector`）:

```cpp
TArray<UEdGraphNode*> SelectedNodes;     // 声明
SelectedNodes.Add(Node);                  // 添加元素
SelectedNodes.Num();                      // 获取数量
for (UEdGraphNode* Node : SelectedNodes)  // 范围循环
{
    // 处理每个节点
}
```

**TMap** —— 映射表（类似 `std::unordered_map`）:

```cpp
// 节点模板缓存：名称 -> T3D内容
TMap<FString, FString> NodeTemplateCache;

NodeTemplateCache.Add(TEXT("Branch"), T3DContent);  // 添加
if (NodeTemplateCache.Contains(TEXT("Branch")))      // 检查存在
{
    FString Content = NodeTemplateCache[TEXT("Branch")];  // 获取值
}
```

**本插件中的应用**:

```cpp
// 节点ID映射：UEdGraphNode* -> FString ID
TMap<UEdGraphNode*, FString> NodeToID;

// 创建的节点映射：ID -> UEdGraphNode*
TMap<FString, UEdGraphNode*> CreatedNodes;

// 输入引脚映射：名称 -> 值
TMap<FString, FString> InputPins;
```

**实践练习**:
创建一个简单的缓存系统：

```cpp
// 声明一个缓存最近10个复制节点的映射
TMap<FString, FString> RecentNodesCache;

// 在复制节点时添加到缓存
RecentNodesCache.Add(NodeName, ShortCode);

// 限制缓存大小
if (RecentNodesCache.Num() > 10)
{
    // 移除最早的条目
    auto It = RecentNodesCache.CreateIterator();
    It.RemoveCurrent();
}
```

---

## 阶段 3：编辑器扩展与 Slate UI

> **时间建议**: 5-6 天  
> **对应文件**: `BlueprintAIBridgeStyle.h/cpp`, `BlueprintAIBridgeCommands.h/cpp`, `BlueprintAIBridge.cpp` (菜单注册部分)

### 3.1 Slate 是什么？

**概念**: Slate 是虚幻引擎自研的跨平台 UI 框架。编辑器中的所有界面（属性面板、工具栏、菜单）都是用 Slate 构建的。

**为什么不直接用 Windows/Mac 原生UI？**
- 跨平台一致性（Windows、Mac、Linux 显示一致）
- 深度集成引擎功能（可以直接显示3D预览、材质等）
- 响应式布局（类似网页的 Flexbox）

**Slate 的核心概念**:

| 概念 | 说明 | 类比 |
|------|------|------|
| `SWidget` | 所有UI元素的基类 | HTML 的 DOM 元素 |
| `SCompoundWidget` | 可包含子元素的控件 | HTML 的 `<div>` |
| `SButton` | 按钮 | HTML 的 `<button>` |
| `STextBlock` | 文本标签 | HTML 的 `<span>` |
| `SBox` | 容器，可设置尺寸 | HTML 的 `<div style="width:...">` |

**Slate 的特殊语法**: 使用 `.` 链式调用设置属性

```cpp
SNew(STextBlock)
    .Text(FText::FromString("Hello"))
    .ColorAndOpacity(FLinearColor::Red)
    .Font(FSlateFontInfo("Roboto", 12))
```

### 3.2 样式系统 (FBlueprintAIBridgeStyle)

打开 `BlueprintAIBridgeStyle.h/cpp`：

```cpp
class FBlueprintAIBridgeStyle
{
public:
    static void Initialize();        // 注册样式
    static void Shutdown();          // 注销样式
    static FName GetStyleSetName();  // 获取样式名称

private:
    static TSharedRef<FSlateStyleSet> Create();
    static TSharedPtr<FSlateStyleSet> StyleInstance;
};
```

**核心概念**:

`FSlateStyleSet` 是一组 UI 资源（图标、颜色、字体）的集合。它让这些资源可以通过名称引用。

```cpp
TSharedRef<FSlateStyleSet> Style = MakeShareable(new FSlateStyleSet("BlueprintAIBridgeStyle"));
Style->SetContentRoot(IPluginManager::Get().FindPlugin("BlueprintAIBridge")->GetBaseDir() / TEXT("Resources"));

// 注册一个图标资源
Style->Set("BlueprintAIBridge.PluginAction", 
    new IMAGE_BRUSH_SVG(TEXT("PlaceholderButtonIcon"), Icon20x20));
```

**`TSharedPtr` / `TSharedRef` —— 智能指针**:

虚幻引擎使用自己的智能指针系统（类似 C++11 的 `std::shared_ptr`）：

| 类型 | 说明 |
|------|------|
| `TSharedPtr<T>` | 可能为空的共享指针 |
| `TSharedRef<T>` | 一定不为空的共享指针（引用） |
| `MakeShareable()` | 创建共享指针 |

**为什么用智能指针？**
- 自动内存管理（不用手动 delete）
- 引用计数（多个地方使用时不会提前释放）

### 3.3 命令系统 (FBlueprintAIBridgeCommands)

打开 `BlueprintAIBridgeCommands.h/cpp`：

```cpp
class FBlueprintAIBridgeCommands : public TCommands<FBlueprintAIBridgeCommands>
{
public:
    virtual void RegisterCommands() override;

    TSharedPtr<FUICommandInfo> PasteShortCode;
    TSharedPtr<FUICommandInfo> CopyShortCode;
    TSharedPtr<FUICommandInfo> FormatNodes;
};
```

**核心概念**:

`TCommands` 是虚幻的命令定义系统。它的作用是：
1. 定义"什么可以做"（命令列表）
2. 每个命令有唯一的ID、显示名称、描述
3. 命令可以绑定到快捷键、菜单项、工具栏按钮

```cpp
void FBlueprintAIBridgeCommands::RegisterCommands()
{
    UI_COMMAND(PasteShortCode, "Paste Short Code", 
        "Paste Blueprint nodes from Short Code", 
        EUserInterfaceActionType::Button, 
        FInputChord());  // 快捷键，空表示没有默认快捷键
}
```

### 3.4 菜单注册与工具栏扩展

打开 `BlueprintAIBridge.cpp` 的 `RegisterMenus()` 函数：

```cpp
void FBlueprintAIBridgeModule::RegisterMenus()
{
    FToolMenuOwnerScoped OwnerScoped(this);

    // 要扩展的工具栏列表
    TArray<FName> Toolbars = {
        "AssetEditor.BlueprintEditor.ToolBar",
        "AssetEditor.WidgetBlueprintEditor.ToolBar"
    };

    for (const FName& ToolbarName : Toolbars)
    {
        // 扩展现有菜单
        UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);
        {
            FToolMenuSection& Section = ToolbarMenu->FindOrAddSection("Settings");
            
            // 添加下拉按钮
            Section.AddEntry(FToolMenuEntry::InitComboButton(
                "BlueprintAIBridgeActions",           // 唯一ID
                FUIAction(),                           // 默认动作
                FOnGetContent::CreateLambda([this]()   // 下拉内容
                {
                    FMenuBuilder MenuBuilder(true, PluginCommands);
                    
                    MenuBuilder.AddMenuEntry(
                        FBlueprintAIBridgeCommands::Get().PasteShortCode,
                        NAME_None,
                        GetLocalizedText(TEXT("Paste Short Code"), TEXT("粘贴短代码")),
                        GetLocalizedText(TEXT("Paste Blueprint nodes from Short Code"), TEXT("从短代码粘贴蓝图节点"))
                    );
                    // ... 更多菜单项
                    
                    return MenuBuilder.MakeWidget();
                }),
                GetLocalizedText(TEXT("AI Bridge"), TEXT("AI桥梁")),  // 按钮文本
                GetLocalizedText(TEXT("AI Bridge Actions"), TEXT("AI 桥梁操作")),  // 提示文本
                FSlateIcon(FBlueprintAIBridgeStyle::GetStyleSetName(), "BlueprintAIBridge.PluginAction")
            ));
        }
    }
}
```

**核心概念逐步拆解**:

**Step 1 - 菜单所有者**
```cpp
FToolMenuOwnerScoped OwnerScoped(this);
```
告诉虚幻：这个菜单由我来管理，我关闭时要自动清理。

**Step 2 - 扩展菜单**
```cpp
UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);
```
虚幻使用字符串名称来标识每个菜单。蓝图编辑器的工具栏叫 `"AssetEditor.BlueprintEditor.ToolBar"`。

**Step 3 - Lambda 表达式**
```cpp
FOnGetContent::CreateLambda([this]() { ... })
```
Lambda 是"内联函数"。当用户点击下拉按钮时，虚幻会调用这个函数来生成下拉内容。

**Step 4 - 本地化文本**
```cpp
static FText GetLocalizedText(const FString& En, const FString& Zh)
{
    FString Lang = FInternationalization::Get().GetCurrentCulture()->GetTwoLetterISOLanguageName();
    if (Lang == TEXT("zh"))
    {
        return FText::FromString(Zh);
    }
    return FText::FromString(En);
}
```
根据系统语言返回对应文本。`FInternationalization` 是虚幻的国际化系统。

**实践练习**:
在菜单中添加一个新按钮：

```cpp
// 在 BlueprintAIBridgeCommands.h 中添加新命令
TSharedPtr<FUICommandInfo> ClearCache;

// 在 RegisterCommands() 中注册
UI_COMMAND(ClearCache, "Clear Cache", "Clear node template cache", 
    EUserInterfaceActionType::Button, FInputChord());

// 在 RegisterMenus() 的 Lambda 中添加菜单项
MenuBuilder.AddMenuEntry(
    GetLocalizedText(TEXT("Clear Cache"), TEXT("清除缓存")),
    GetLocalizedText(TEXT("Clear all cached node templates"), TEXT("清除所有缓存的节点模板")),
    FSlateIcon(),
    FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::ClearCacheClicked))
);

// 实现处理函数
void FBlueprintAIBridgeModule::ClearCacheClicked()
{
    NodeTemplateCache.Empty();
    SaveCache();
    FNotificationInfo Info(FText::FromString(TEXT("Cache cleared!")));
    FSlateNotificationManager::Get().AddNotification(Info);
}
```

### 3.5 通知系统

在多个函数中看到这种模式：

```cpp
FNotificationInfo Info(GetLocalizedText(TEXT("Nodes copied"), TEXT("节点已复制")));
Info.bFireAndForget = true;    // 自动消失
Info.ExpireDuration = 3.0f;    // 3秒后消失
FSlateNotificationManager::Get().AddNotification(Info);
```

这是虚幻编辑器右下角弹出通知的实现方式。

### 3.6 消息对话框

```cpp
FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(TEXT("没有选中的节点")));
```

`EAppMsgType` 可选值：
- `Ok` - 只有确定按钮
- `OkCancel` - 确定和取消
- `YesNo` - 是和否
- `YesNoCancel` - 是、否、取消

---

## 阶段 4：蓝图图表系统 (EdGraph)

> **时间建议**: 5-7 天  
> **对应文件**: `TextGraphParser.h/cpp`, `NodeGraphFormatter.h/cpp`

### 4.1 EdGraph 架构概览

**核心类关系**:

```
UBlueprint                      ← 蓝图资产（你在内容浏览器中看到的）
├── UEdGraph (Event Graph)      ← 事件图表（放置节点的画布）
│   ├── UEdGraphNode            ← 节点（每个蓝图方块）
│   │   ├── UEdGraphPin         ← 引脚（节点的输入/输出端口）
│   │   └── UEdGraphPin::LinkedTo ← 连接（引脚之间的连线）
│   └── UEdGraphSchema          ← 图表规则（什么可以连什么）
```

**类比理解**:
- `UBlueprint` = 一个电路设计图纸文件
- `UEdGraph` = 图纸上的某一块电路板
- `UEdGraphNode` = 电路板上的元器件（电阻、电容、芯片）
- `UEdGraphPin` = 元器件的引脚/焊盘
- `LinkedTo` = 引脚之间的导线

### 4.2 节点 (UEdGraphNode)

**关键属性**:

```cpp
class UEdGraphNode : public UObject
{
    FVector2D NodePosX, NodePosY;    // 节点在图表中的位置
    TArray<UEdGraphPin*> Pins;        // 节点的所有引脚
    
    virtual FText GetNodeTitle(...) const;  // 获取节点标题
    UEdGraph* GetGraph();             // 获取所属图表
};
```

**本插件中获取节点信息的方式**:

```cpp
// 获取节点标题
FString Title = Node->GetNodeTitle(ENodeTitleType::MenuTitle).ToString();

// 获取节点所在图表
UEdGraph* Graph = Node->GetGraph();

// 获取节点的所有引脚
for (UEdGraphPin* Pin : Node->Pins)
{
    // 处理每个引脚
}
```

### 4.3 引脚 (UEdGraphPin)

**关键属性**:

```cpp
class UEdGraphPin
{
    FName PinName;                    // 引脚名称（如 "Execute", "Then", "Condition"）
    EEdGraphPinDirection Direction;   // 方向：输入(EGPD_Input) 或 输出(EGPD_Output)
    FEdGraphPinType PinType;          // 类型（执行、布尔、整数、字符串等）
    FString DefaultValue;             // 默认值（如 "true", "Hello"）
    TArray<UEdGraphPin*> LinkedTo;    // 连接到的其他引脚
    UObject* DefaultObject;           // 默认对象引用
};
```

**引脚类型 (FEdGraphPinType)**:

```cpp
struct FEdGraphPinType
{
    FName PinCategory;        // 主要类型：Exec, Boolean, Byte, Int, Float, String, Object, Struct...
    FName PinSubCategory;     // 子类型
    TWeakObjectPtr<UObject> PinSubCategoryObject;  // 对于 Enum、Struct、Class 等，指向具体类型
    EPinContainerType ContainerType;  // 是否是 Array、Set、Map
};
```

**本插件中对引脚的处理**:

```cpp
for (UEdGraphPin* Pin : Node->Pins)
{
    // 判断方向
    if (Pin->Direction == EGPD_Input)
    {
        // 输入引脚
    }
    else
    {
        // 输出引脚
    }

    // 判断类型
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
    {
        // 执行引脚（白色箭头）
    }
    else if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_String)
    {
        // 字符串引脚（红色）
    }

    // 获取连接
    for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
    {
        UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
        // 目标节点...
    }
}
```

**执行引脚的特殊名称**:

```cpp
// UE 内置的执行引脚名称
UEdGraphSchema_K2::PN_Execute  // "execute" - 执行输入
UEdGraphSchema_K2::PN_Then     // "then" - 执行输出

// 本插件中的别名映射
"execute" → "inExec"
"then" → "outExec"
```

**实践练习**:
编写一个函数，统计一个节点的所有连接数量：

```cpp
int32 CountTotalConnections(UEdGraphNode* Node)
{
    int32 Count = 0;
    for (UEdGraphPin* Pin : Node->Pins)
    {
        Count += Pin->LinkedTo.Num();
    }
    return Count;
}
```

### 4.4 T3D 格式 —— 节点的文本表示

**概念**: T3D（Textual Data Description）是虚幻引擎的对象导出格式。它用纯文本描述一个 UObject 的所有属性。

**为什么用 T3D？**
- 纯文本，易于生成和解析
- 包含完整对象信息（包括 GUID、属性值等）
- UE 原生支持导入/导出

**导出节点的代码**:

```cpp
FString T3DContent;
TSet<UObject*> NodeSet;
NodeSet.Add(Node);
FEdGraphUtilities::ExportNodesToText(NodeSet, T3DContent);
// T3DContent 现在包含节点的文本描述
```

**导入节点的代码**:

```cpp
TSet<UEdGraphNode*> ImportedNodes;
FEdGraphUtilities::ImportNodesFromText(TargetGraph, T3DContent, ImportedNodes);
// ImportedNodes 包含导入的节点
```

**T3D 内容示例** (简化):

```
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0"
   FunctionReference=(MemberName="PrintString",...)
   NodePosX=400
   NodePosY=200
   NodeGuid=1234567890ABCDEF1234567890ABCDEF
   CustomProperties Pin (PinId=...,PinName="execute",...)
   CustomProperties Pin (PinId=...,PinName="then",...)
   CustomProperties Pin (PinId=...,PinName="InString",DefaultValue="Hello",...)
End Object
```

### 4.5 GUID 重新生成算法

**为什么要重新生成 GUID？**

每个 UObject 有一个唯一的 `NodeGuid`。如果直接导入 T3D：
- 如果 GUID 已存在 → UE 会认为"这个节点已经存在"，可能更新旧节点而不是创建新节点
- 我们需要**强制创建全新的节点实例**

**本插件的实现** (`TextGraphParser.cpp`):

```cpp
auto RegenerateT3DGUIDs = [](const FString& OriginalT3D) -> FString
{
    FString Result = OriginalT3D;

    // 查找32位连续十六进制字符
    int32 SearchIdx = 0;
    while (true)
    {
        int32 GUIDStart = INDEX_NONE;
        for (int32 i = SearchIdx; i < Result.Len() - 32; i++)
        {
            bool bFoundGUID = true;
            for (int32 j = 0; j < 32; j++)
            {
                TCHAR Char = Result[i + j];
                if (!IsHexChar(Char))  // 不是十六进制字符
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

        if (GUIDStart == INDEX_NONE) break;

        // 生成新GUID
        FGuid NewGuid = FGuid::NewGuid();
        FString NewGuidStr = NewGuid.ToString(EGuidFormats::DigitsWithHyphens)
            .Replace(TEXT("-"), TEXT("")).ToUpper();

        // 替换
        Result.RemoveAt(GUIDStart, 32);
        Result.InsertAt(GUIDStart, NewGuidStr);
        SearchIdx = GUIDStart + 32;
    }
    return Result;
};
```

**学习要点**:
- `FGuid::NewGuid()` 生成全局唯一标识符
- T3D 中的 GUID 是32位大写十六进制字符串
- 替换后，UE 会将导入的对象视为全新的

### 4.6 节点连接 (MakeLinkTo)

**创建连接的方式**:

```cpp
// SourcePin 连接到 TargetPin
SourcePin->MakeLinkTo(TargetPin);

// 断开连接
TargetPin->BreakAllPinLinks();  // 断开所有连接
SourcePin->BreakLinkTo(TargetPin);  // 断开特定连接
```

**本插件中的连接重建**:

```cpp
for (const FLinkDefinition& Link : Links)
{
    UEdGraphNode* SourceNode = CreatedNodes[Link.SourceNodeID];
    UEdGraphNode* TargetNode = CreatedNodes[Link.TargetNodeID];

    // 查找引脚
    UEdGraphPin* SourcePin = SourceNode->FindPin(FName(*Link.SourcePinName));
    UEdGraphPin* TargetPin = TargetNode->FindPin(FName(*Link.TargetPinName));

    // 处理别名
    if (!SourcePin && Link.SourcePinName == TEXT("outExec"))
        SourcePin = SourceNode->FindPin(UEdGraphSchema_K2::PN_Then);
    if (!TargetPin && Link.TargetPinName == TEXT("inExec"))
        TargetPin = TargetNode->FindPin(UEdGraphSchema_K2::PN_Execute);

    // 创建连接
    if (SourcePin && TargetPin)
    {
        // 检查是否已连接（避免重复连接）
        bool bAlreadyConnected = false;
        for (UEdGraphPin* LinkedPin : TargetPin->LinkedTo)
        {
            if (LinkedPin == SourcePin)
            {
                bAlreadyConnected = true;
                break;
            }
        }
        if (!bAlreadyConnected)
        {
            SourcePin->MakeLinkTo(TargetPin);
        }
    }
}
```

### 4.7 节点布局算法

打开 `NodeGraphFormatter.cpp`。

**目标**: 给定一组选中的节点，自动计算它们的位置，让连线清晰、布局美观。

**算法步骤**:

**Step 1 - 构建关系图**
```cpp
// 遍历所有节点的引脚
for (UEdGraphPin* Pin : Node->Pins)
{
    if (Pin->Direction == EGPD_Output)
    {
        for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
        {
            UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
            bool bIsExec = (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec);
            
            if (bIsExec)
            {
                // 执行流决定父子关系
                Info->Children.Add(TargetInfo);
                TargetInfo->Parents.Add(Info.Get());
            }
            else
            {
                // 数据流记录消费者
                Info->DataConsumers.Add(TargetInfo);
            }
        }
    }
}
```

**Step 2 - 环检测（DFS）**
```cpp
// 使用深度优先搜索检测循环引用
TSet<FNodeLayoutInfo*> Visited;
TSet<FNodeLayoutInfo*> RecursionStack;

function VisitNode(Node):
    Visited.Add(Node)
    RecursionStack.Add(Node)
    
    for Child in Node.Children:
        if RecursionStack.Contains(Child):
            // 发现回环！切断连接
            Node.Children.Remove(Child)
            Child.Parents.Remove(Node)
        else if !Visited.Contains(Child):
            VisitNode(Child)
    
    RecursionStack.Remove(Node)
```

**Step 3 - 拓扑分层（BFS）**
```cpp
// 从根节点出发，按层级分配 Rank
RootNode->Rank = 0;
Queue.Add(RootNode);

while Queue not empty:
    Current = Queue.Pop()
    for Child in Current.Children:
        if Child.Rank < 0:  // 未访问
            Child.Rank = Current.Rank + 1
            Queue.Add(Child)
```

**Step 4 - 纯函数特殊处理**
```cpp
// 纯函数没有执行引脚，放在数据消费者的左侧
float PureX = ConsumerPos.X - PureNode->EstimatedWidth - HorizontalSpacing;
float PureY = ConsumerPos.Y;

// AABB 碰撞检测
while (与已有节点重叠):
    PureY -= (PureNode->EstimatedHeight + VerticalSpacing);
```

**实践练习**:
修改布局算法，让纯函数节点显示在消费者的**上方**而不是左侧：

```cpp
// 原代码：放在左侧
float PureX = ConsumerPos.X - PureNode->EstimatedWidth - HorizontalSpacing;
float PureY = ConsumerPos.Y;

// 修改后：放在上方
float PureX = ConsumerPos.X;
float PureY = ConsumerPos.Y - PureNode->EstimatedHeight - VerticalSpacing;
```

---

## 阶段 5：文件与序列化系统

> **时间建议**: 3-4 天  
> **对应文件**: `BlueprintAIBridge.cpp` (SaveCache/LoadCache), `AIRules.json`

### 5.1 文件路径系统 (FPaths)

虚幻提供了一套跨平台的路径管理工具：

```cpp
FPaths::ProjectPluginsDir()     // 项目插件目录
FPaths::ProjectSavedDir()       // 项目Saved目录（可写入的临时数据）
FPaths::ProjectDir()            // 项目根目录
FPaths::EngineDir()             // 引擎目录
FPaths::GetPath(FullPath)       // 从完整路径提取目录部分
```

**本插件中的路径使用**:

```cpp
// AI规则文件路径
FString JsonPath = FPaths::ProjectPluginsDir() / TEXT("BlueprintAIBridge/Resources/AIRules.json");

// 缓存文件路径
FString CachePath = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
```

**注意**: 虚幻的路径分隔符使用 `/`，即使在 Windows 上也是如此（内部会自动处理）。

### 5.2 文件读写 (FFileHelper)

```cpp
// 读取文件到字符串
FString Content;
bool bSuccess = FFileHelper::LoadFileToString(Content, *FilePath);

// 保存字符串到文件
FFileHelper::SaveStringToFile(Content, *FilePath);
```

### 5.3 JSON 序列化

虚幻内置了 JSON 解析和生成功能：

**生成 JSON**:
```cpp
FString JsonString;
TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&JsonString);
TSharedPtr<FJsonObject> RootObject = MakeShareable(new FJsonObject);

// 添加键值对
RootObject->SetStringField(TEXT("Key"), TEXT("Value"));
RootObject->SetNumberField(TEXT("Count"), 42);

// 序列化
FJsonSerializer::Serialize(RootObject.ToSharedRef(), Writer);
// JsonString 现在包含 {"Key":"Value","Count":42}
```

**解析 JSON**:
```cpp
FString Content; // 从文件读取的JSON字符串
TSharedPtr<FJsonObject> RootObject;
TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Content);

if (FJsonSerializer::Deserialize(Reader, RootObject) && RootObject.IsValid())
{
    // 读取字段
    FString Value;
    if (RootObject->TryGetStringField(TEXT("Key"), Value))
    {
        // Value = "Value"
    }
    
    // 遍历所有字段
    for (auto& Elem : RootObject->Values)
    {
        FString FieldName = Elem.Key;
        TSharedPtr<FJsonValue> FieldValue = Elem.Value;
        
        if (FieldValue->Type == EJson::String)
        {
            FString StrValue = FieldValue->AsString();
        }
    }
}
```

**本插件中的缓存存储**:

```cpp
// 保存缓存
void FBlueprintAIBridgeModule::SaveCache()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
    
    FString JsonString;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&JsonString);
    TSharedPtr<FJsonObject> RootObject = MakeShareable(new FJsonObject);
    
    for (auto& Elem : NodeTemplateCache)
    {
        RootObject->SetStringField(Elem.Key, Elem.Value);
    }
    
    FJsonSerializer::Serialize(RootObject.ToSharedRef(), Writer);
    FFileHelper::SaveStringToFile(JsonString, *Path);
}

// 加载缓存
void FBlueprintAIBridgeModule::LoadCache()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
    FString Content;
    
    if (FFileHelper::LoadFileToString(Content, *Path))
    {
        TSharedPtr<FJsonObject> RootObject;
        TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Content);
        
        if (FJsonSerializer::Deserialize(Reader, RootObject) && RootObject.IsValid())
        {
            for (auto& Elem : RootObject->Values)
            {
                if (Elem.Value.IsValid() && Elem.Value->Type == EJson::String)
                {
                    NodeTemplateCache.Add(Elem.Key, Elem.Value->AsString());
                }
            }
        }
    }
}
```

### 5.4 平台文件系统 (IPlatformFile)

```cpp
IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();

// 检查文件/目录是否存在
bool bExists = PlatformFile.FileExists(*Path);
bool bDirExists = PlatformFile.DirectoryExists(*Path);

// 创建目录
PlatformFile.CreateDirectoryTree(*DirectoryPath);

// 打开文件夹（用系统资源管理器）
FPlatformProcess::ExploreFolder(*Path);

// 用默认程序打开文件
FPlatformProcess::LaunchFileInDefaultExternalApplication(*Path);
```

### 5.5 剪贴板操作

```cpp
// 复制到剪贴板
FPlatformApplicationMisc::ClipboardCopy(*Text);

// 从剪贴板粘贴
FString ClipboardText;
FPlatformApplicationMisc::ClipboardPaste(ClipboardText);
```

这是跨平台的剪贴板操作，在 Windows、Mac、Linux 上都可用。

---

## 阶段 6：高级主题与项目整合

> **时间建议**: 4-5 天  
> **对应文件**: 所有文件

### 6.1 Undo/Redo 系统 (事务)

虚幻编辑器支持完整的撤销/重做功能，通过"事务 (Transaction)"实现：

```cpp
#include "ScopedTransaction.h"

// 开始一个事务
FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteNodes", "Paste Nodes"));

// 标记对象被修改（这样撤销系统知道要记录它的状态）
Graph->Modify();
Node->Modify();

// 执行修改操作...
// 创建节点、移动节点、连接引脚等

// Transaction 对象销毁时自动提交事务
// 用户现在可以按 Ctrl+Z 撤销这些操作
```

**工作原理**:
1. `FScopedTransaction` 构造函数 → 开始记录
2. `Modify()` → 记录对象修改前的状态
3. 执行操作 → 修改对象
4. `FScopedTransaction` 析构函数 → 提交事务
5. 用户按 Ctrl+Z → 恢复到 `Modify()` 时的状态

**本插件中的使用**:

```cpp
// TextGraphParser.cpp 中的粘贴操作
FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteNodes", "Paste Nodes"));
InTargetGraph->Modify();
// ... 创建节点 ...
// ... 连接引脚 ...

// NodeGraphFormatter.cpp 中的整理操作
FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "FormatNodes", "Format Nodes"));
Graph->Modify();
// ... 移动节点 ...
```

### 6.2 蓝图结构变更通知

当修改了蓝图的结构（添加/删除节点、改变连接）后，需要通知蓝图系统：

```cpp
#include "Kismet2/BlueprintEditorUtils.h"

// 标记蓝图结构已变更（会导致重新编译蓝图）
FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(Blueprint);

// 通知图表有变更（更新UI显示）
Graph->NotifyGraphChanged();
```

**两者的区别**:
- `MarkBlueprintAsStructurallyModified` = "这个蓝图需要重新编译"
- `NotifyGraphChanged` = "这个图表的视觉显示需要更新"

### 6.3 编辑器事件系统

本插件使用了虚幻的委托 (Delegate) 系统来监听编辑器事件：

```cpp
// 监听资产编辑器打开事件
AssetEditorSubsystem->OnAssetEditorOpened().AddRaw(
    this, 
    &FBlueprintAIBridgeModule::OnAssetEditorOpened
);

// 回调函数
void FBlueprintAIBridgeModule::OnAssetEditorOpened(UObject* Asset)
{
    // 新编辑器打开了，绑定我们的命令
    IAssetEditorInstance* EditorInstance = AssetEditorSubsystem->FindEditorForAsset(Asset, false);
    if (EditorInstance)
    {
        BindCommandsToEditor(EditorInstance);
    }
}
```

**委托的类型**:

| 委托类型 | 说明 | 本插件中使用 |
|---------|------|-------------|
| `FSimpleMulticastDelegate` | 多播委托（多个监听者） | 菜单注册回调 |
| `TBaseDelegate` | 单播委托（一个监听者） | 命令执行回调 |
| `AddRaw` | 添加原始指针监听 | 编辑器事件 |
| `CreateLambda` | Lambda 表达式 | 菜单内容生成 |

### 6.4 获取当前编辑器状态

```cpp
// 获取全局编辑器对象
if (GEditor)
{
    // 获取资产编辑器子系统
    UAssetEditorSubsystem* AssetEditorSubsystem = 
        GEditor->GetEditorSubsystem<UAssetEditorSubsystem>();
    
    // 获取所有打开的编辑器
    TArray<IAssetEditorInstance*> Editors = AssetEditorSubsystem->GetAllOpenEditors();
    
    // 检查编辑器类型
    FName EditorName = Instance->GetEditorName();
    // "BlueprintEditor" - 蓝图编辑器
    // "WidgetBlueprintEditor" - 控件蓝图编辑器
    // "AnimationBlueprintEditor" - 动画蓝图编辑器
}
```

### 6.5 Slate 焦点系统

获取当前键盘焦点的 UI 元素：

```cpp
#include "Framework/Application/SlateApplication.h"

// 获取当前有键盘焦点的控件
TSharedPtr<SWidget> FocusedWidget = FSlateApplication::Get().GetKeyboardFocusedWidget();

// 向上遍历父级，找到 SGraphEditor
while (FocusedWidget.IsValid())
{
    if (FocusedWidget->GetTypeAsString() == "SGraphEditor")
    {
        return StaticCastSharedPtr<SGraphEditor>(FocusedWidget);
    }
    FocusedWidget = FocusedWidget->GetParentWidget();
}
```

这是获取"当前用户在操作哪个图表"的可靠方式。

### 6.6 综合实践项目

现在你已经掌握了所有知识点，尝试完成以下练习：

#### 练习 1：添加节点数量统计功能

在菜单中添加一个新按钮，点击后显示当前蓝图中节点的数量。

**提示**:
```cpp
void FBlueprintAIBridgeModule::CountNodesClicked()
{
    UBlueprint* BP = GetCurrentBlueprint();
    if (!BP) return;
    
    int32 TotalNodes = 0;
    for (UEdGraph* Graph : BP->UbergraphPages)
    {
        TotalNodes += Graph->Nodes.Num();
    }
    
    FString Msg = FString::Printf(TEXT("蓝图 %s 共有 %d 个节点"), 
        *BP->GetName(), TotalNodes);
    FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(Msg));
}
```

#### 练习 2：导出节点为图片

实现一个功能，将选中的节点导出为 PNG 图片（使用虚幻的截图功能）。

**提示**: 研究 `FSlateApplication::Get().TakeScreenshot()` 或 `FWidgetRenderer`。

#### 练习 3：节点搜索功能

实现一个功能，在蓝图中搜索包含特定文本的节点，并自动选中它们。

**提示**:
```cpp
void SearchNodes(const FString& SearchText)
{
    TSet<const UEdGraphNode*> NodesToSelect;
    
    for (UEdGraphNode* Node : Graph->Nodes)
    {
        FString Title = Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString();
        if (Title.Contains(SearchText))
        {
            NodesToSelect.Add(Node);
        }
    }
    
    Graph->SelectNodeSet(NodesToSelect);
}
```

#### 练习 4：自定义短代码格式

修改 `GenerateShortCode`，让输出的格式更符合你的需求。例如：
- 添加节点注释（Comment）信息
- 添加节点颜色信息
- 使用不同的分隔符

#### 练习 5：批量重命名变量

实现一个功能，批量重命名蓝图中所有引用某个变量的 Get/Set 节点。

---

## 附录：常见错误与解决方案

### 编译错误

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Cannot open include file` | 缺少模块依赖 | 在 `.Build.cs` 中添加对应模块 |
| `Unresolved external symbol` | 链接不到函数实现 | 检查是否缺少模块依赖或实现文件 |
| `Module not found` | 插件未正确加载 | 检查 `.uplugin` 文件格式 |

### 运行时错误

| 错误现象 | 原因 | 解决方案 |
|---------|------|---------|
| 按钮不显示 | 菜单名称错误 | 检查 `ToolbarName` 是否正确 |
| 节点粘贴失败 | T3D格式不匹配 | 检查GUID是否正确重新生成 |
| 连接不生效 | 引脚名称不匹配 | 检查 `FindPin` 的名称参数 |
| 撤销崩溃 | 没有调用Modify | 在修改对象前调用 `Modify()` |

---

## 推荐学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| [虚幻官方文档](https://docs.unrealengine.com/) | 文档 | 最权威的技术参考 |
| [Unreal Slackers Discord](https://unrealslackers.org/) | 社区 | 活跃的开发者社区 |
| [Tom Looman 的 UE C++ 教程](https://www.tomlooman.com/) | 教程 | 优秀的进阶教程 |
| 虚幻引擎源码 | 源码 | 最好的学习材料就是源码本身 |

---

## 学习检查清单

完成以下检查清单，表示你已经掌握了本插件涉及的技术：

- [ ] 能解释 `.uplugin` 和 `.Build.cs` 的作用
- [ ] 能创建一个最简单的编辑器插件
- [ ] 能理解 `UObject`、`AActor`、`UEdGraphNode` 的继承关系
- [ ] 能使用 `Cast<T>()` 进行类型转换
- [ ] 能区分 `FName`、`FString`、`FText` 的用途
- [ ] 能在蓝图中注册一个工具栏按钮
- [ ] 能遍历节点的引脚并获取连接信息
- [ ] 能理解 T3D 格式的基本结构
- [ ] 能实现简单的 JSON 读写
- [ ] 能为操作添加 Undo/Redo 支持
- [ ] 能使用 Slate 创建一个简单的 UI 界面

---

*学习文档生成时间: 2026-05-09*  
*基于 BlueprintAIBridge v1.0 代码分析*
