# BlueprintAIBridge - Code Wiki

> **项目描述**: 虚幻引擎编辑器插件，用于在蓝图编辑器与AI之间建立桥梁。支持将蓝图节点复制为短代码文本、将AI生成的短代码粘贴回蓝图、以及自动排列节点布局。
> **作者**: 小南并没有  
> **版本**: 1.0 (Beta)  
> **支持引擎**: Unreal Engine 5.x  
> **插件类型**: Editor-only

---

## 目录

1. [项目整体架构](#1-项目整体架构)
2. [目录结构](#2-目录结构)
3. [模块职责](#3-模块职责)
4. [核心类与函数详解](#4-核心类与函数详解)
5. [数据流与执行流](#5-数据流与执行流)
6. [依赖关系](#6-依赖关系)
7. [关键算法说明](#7-关键算法说明)
8. [项目运行与安装方式](#8-项目运行与安装方式)
9. [文件清单](#9-文件清单)

---

## 1. 项目整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BlueprintAIBridge 插件                        │
│                         (Editor 类型模块)                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  UI 命令与菜单层 │  │  短代码解析引擎  │  │  节点布局引擎   │     │
│  │                 │  │                 │  │                 │     │
│  │ • 工具栏按钮    │  │ • 生成短代码    │  │ • 执行流分层    │     │
│  │ • 下拉菜单      │  │ • 解析短代码    │  │ • 纯函数定位    │     │
│  │ • 快捷键绑定    │  │ • T3D缓存管理   │  │ • 重叠检测      │     │
│  │ • 通知系统      │  │ • GUID重新生成  │  │ • 网格对齐      │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
│           │                    │                    │              │
│  ┌────────▼────────────────────▼────────────────────▼────────┐     │
│  │              虚幻引擎编辑器核心 API 层                      │     │
│  │  (Slate / UEdGraph / BlueprintEditor / AssetRegistry)      │     │
│  └──────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.1 设计目标

- **人机协作**: 让AI能够理解并生成蓝图节点连接关系，通过文本形式交换
- **双向桥接**: 从蓝图到文本（复制），从文本到蓝图（粘贴）
- **零配置**: 安装即用，无需额外设置Python环境或外部服务
- **增量缓存**: 自动缓存已复制的节点模板（T3D格式），支持后续动态创建

### 1.2 核心技术选型

| 技术 | 用途 | 说明 |
|------|------|------|
| **T3D 文本格式** | 节点序列化 | UE原生对象导出格式，跨会话持久化 |
| **短代码(Short Code)** | 人机可读格式 | 自定义文本DSL，描述节点定义和连接关系 |
| **GUID 重新生成** | 避免节点冲突 | 粘贴时替换T3D中的所有GUID，强制创建新实例 |
| **Slate 扩展** | UI集成 | 在蓝图编辑器工具栏注入下拉菜单 |

---

## 2. 目录结构

```
UE-BlueprintAIBridge/
├── BlueprintAIBridge/
│   ├── BlueprintAIBridge.uplugin          # 插件描述文件
│   ├── Resources/
│   │   ├── AIRules.json                   # AI生成规则（中文精简版）
│   │   ├── Icon128.png                    # 插件图标
│   │   └── PlaceholderButtonIcon.svg      # 工具栏按钮图标
│   ├── Source/
│   │   └── BlueprintAIBridge/
│   │       ├── BlueprintAIBridge.Build.cs # 模块构建配置
│   │       ├── Private/
│   │       │   ├── BlueprintAIBridge.cpp          # 主模块实现
│   │       │   ├── BlueprintAIBridgeCommands.cpp  # 命令注册
│   │       │   ├── BlueprintAIBridgeStyle.cpp     # Slate样式
│   │       │   ├── NodeGraphFormatter.cpp         # 节点布局算法
│   │       │   └── TextGraphParser.cpp            # 短代码解析器
│   │       └── Public/
│   │           ├── BlueprintAIBridge.h            # 主模块头文件
│   │           ├── BlueprintAIBridgeCommands.h    # 命令声明
│   │           ├── BlueprintAIBridgeStyle.h       # 样式声明
│   │           ├── NodeGraphFormatter.h           # 布局器声明
│   │           └── TextGraphParser.h              # 解析器声明
│   ├── AlternativeApproach.cpp            # 备选方案草稿（材质图支持）
│   ├── PracticalSolution.cpp              # 简化方案草稿
│   └── MaterialImplementationPlan.md      # 材质图实现计划
├── 安装到项目.bat                         # Windows安装脚本（当前缺失）
└── CodeWiki.md                            # 本文档
```

---

## 3. 模块职责

### 3.1 功能模块划分

| 模块 | 对应文件 | 职责 |
|------|---------|------|
| **Module Core** | `BlueprintAIBridge.h/cpp` | 插件生命周期管理、菜单注册、命令绑定、剪贴板操作、AI规则管理、模板缓存读写 |
| **Command System** | `BlueprintAIBridgeCommands.h/cpp` | 定义3个核心UI命令：CopyShortCode / PasteShortCode / FormatNodes |
| **Style System** | `BlueprintAIBridgeStyle.h/cpp` | Slate样式集注册/注销、SVG图标加载、纹理重载 |
| **Text Parser** | `TextGraphParser.h/cpp` | **核心引擎**：短代码生成、短代码解析、节点T3D缓存、GUID重新生成、节点连接重建 |
| **Graph Formatter** | `NodeGraphFormatter.h/cpp` | **布局引擎**：执行流分层排序、纯函数近邻布局、AABB碰撞检测、网格对齐 |

### 3.2 各模块交互关系

```
┌─────────────────────┐
│  BlueprintAIBridge  │◄── 用户点击菜单/按钮
│   (Module Core)     │
└─────────┬───────────┘
          │ 调用
    ┌─────┴─────┐
    ▼           ▼
┌─────────┐  ┌─────────────┐
│ Commands│  │  TextGraph   │
│  System │  │   Parser     │
└─────────┘  │             │
             │ • Generate  │────► T3D Export / Cache
             │ • Parse     │────► T3D Import / GUID Regen
             │ • Connect   │────► Pin MakeLinkTo
             └──────┬──────┘
                    │ 调用
                    ▼
            ┌───────────────┐
            │ GraphFormatter│
            │               │
            │ • Layout      │
            │ • Position    │
            └───────────────┘
```

---

## 4. 核心类与函数详解

### 4.1 FBlueprintAIBridgeModule (`BlueprintAIBridge.h/cpp`)

插件主模块类，继承自 `IModuleInterface`。

#### 生命周期函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `StartupModule` | `virtual void StartupModule() override` | 初始化样式、注册命令、绑定菜单、加载缓存、监听编辑器打开事件 |
| `ShutdownModule` | `virtual void ShutdownModule() override` | 注销事件监听、卸载菜单、关闭样式、注销命令 |

#### 核心操作函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `CopyShortCodeClicked` | `void CopyShortCodeClicked()` | 复制选中节点为短代码。先尝试从聚焦的SGraphEditor获取选中节点，失败则回退到全局选择集 |
| `PasteShortCodeClicked` | `void PasteShortCodeClicked()` | 从剪贴板读取短代码，解析并在当前图表中创建节点。自动计算粘贴位置（视图中心） |
| `FormatNodesClicked` | `void FormatNodesClicked()` | 触发节点自动排列。要求至少选中2个节点 |

#### 辅助功能函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `CopyAIRulesClicked` | `void CopyAIRulesClicked()` | 将AI规则（AIRules.json）复制到剪贴板，供用户粘贴给AI |
| `ManageTemplatesClicked` | `void ManageTemplatesClicked()` | 打开模板缓存文件夹（`ProjectSaved/BlueprintAIBridge/`） |
| `EditAIRulesClicked` | `void EditAIRulesClicked()` | 用系统默认编辑器打开AIRules.json |
| `SaveCache` / `LoadCache` | `void SaveCache()` / `void LoadCache()` | 将节点模板缓存持久化为JSON（`NodeTemplates.json`） |
| `OpenCacheFolder` | `void OpenCacheFolder()` | 用资源管理器打开缓存目录 |

#### 私有辅助函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `GetCurrentBlueprint` | `UBlueprint* GetCurrentBlueprint()` | 遍历所有打开的编辑器，返回当前蓝图编辑器中的蓝图对象 |
| `GetSelectedNodes` | `TArray<UEdGraphNode*> GetSelectedNodes(...)` | 获取选中节点数组（已弃用，由局部静态函数替代） |
| `BindCommandsToEditor` | `void BindCommandsToEditor(IAssetEditorInstance*)` | 将插件命令绑定到蓝图编辑器工具包的命令列表 |
| `OnAssetEditorOpened` | `void OnAssetEditorOpened(UObject* Asset)` | 编辑器打开事件回调，自动绑定命令 |
| `RegisterMenus` | `void RegisterMenus()` | 向蓝图编辑器工具栏注册下拉菜单 |

#### 成员变量

```cpp
TSharedPtr<class FUICommandList> PluginCommands;           // 插件命令列表
TMap<FString, FString> NodeTemplateCache;                  // 节点模板缓存: 名称 -> T3D内容
```

#### 全局辅助函数

```cpp
FString GetAIRulesContent();    // 加载AIRules.json，失败时返回嵌入式规则
FString GetEmbeddedAIRules();   // 返回硬编码的AI规则（Markdown格式，中文）
```

---

### 4.2 FTextGraphParser (`TextGraphParser.h/cpp`)

**核心引擎类**，负责短代码文本格式与蓝图节点之间的双向转换。

#### 数据结构

```cpp
// 节点定义
struct FNodeDefinition {
    FString Name;                          // 节点基础名称（如 "Branch"）
    FString ID;                            // 唯一标识（如 "1"）
    TMap<FString, FString> InputPins;      // 输入引脚: 名称 -> 值
    TArray<FString> OutputPins;            // 输出引脚列表
};

// 连接定义
struct FLinkDefinition {
    FString SourceNodeID;                  // 源节点ID
    FString SourcePinName;                 // 源引脚名称
    FString TargetNodeID;                  // 目标节点ID
    FString TargetPinName;                 // 目标引脚名称
};
```

#### 核心函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `GenerateShortCode` | `static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache)` | **正向转换**：选中节点 → 短代码文本。同时填充T3D缓存 |
| `ParseAndPaste` | `static bool ParseAndPaste(const FString& ShortCode, UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location, UEdGraph* TargetGraph)` | **反向转换**：短代码文本 → 蓝图节点。重新生成GUID，重建连接 |

#### 辅助函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `GetNodeBaseName` | `static FString GetNodeBaseName(UEdGraphNode* Node)` | 提取节点基础名称。支持：CallFunction（函数名）、VariableGet/Set（变量名）、IfThenElse（Branch）、Knot（变更路线节点） |
| `GetPinValue` | `static FString GetPinValue(UEdGraphPin* Pin)` | 获取引脚的默认值。对String类型移除引号，对Enum类型返回名称 |
| `EscapePinValue` | `static FString EscapePinValue(const FString& Value)` | 转义特殊字符：`\`, `(`, `)`, `;`, `\n`, `\r`, `\t` |
| `UnescapePinValue` | `static FString UnescapePinValue(const FString& Value)` | 反转义 |
| `ParseNodeDefinition` | `static bool ParseNodeDefinition(const FString& Line, FNodeDefinition& OutDef)` | 解析单行节点定义（如 `Branch_2 (inExec; Condition(true);) : (True; False;)`） |
| `ParseLinkDefinition` | `static bool ParseLinkDefinition(const FString& Line, FLinkDefinition& OutLink)` | 解析单行连接定义（如 `Branch_2 (True) -> PrintString_3 (inExec)`） |

---

### 4.3 FNodeGraphFormatter (`NodeGraphFormatter.h/cpp`)

**布局引擎类**，对选中的蓝图节点进行自动排列。

#### 核心函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `FormatNodes` | `static void FormatNodes(UEdGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes)` | 自动排列选中节点。使用分层布局算法 |

#### 内部结构

```cpp
struct FNodeLayoutInfo {
    UEdGraphNode* Node;           // 对应引擎节点
    bool bIsDummy;                // 是否为占位节点
    bool bIsMainPath;             // 是否在主路径上
    bool bIsPureFunction;         // 是否为纯函数（无执行引脚）
    int32 Rank;                   // 拓扑层级
    int32 Order;                  // 同层排序
    int32 MainPathIndex;          // 主路径索引
    float X, Y;                   // 计算后的位置
    float EstimatedWidth;         // 估算宽度（基于标题长度）
    float EstimatedHeight;        // 估算高度（基于引脚数量）
    TArray<FNodeLayoutInfo*> Parents;        // 执行流父节点
    TArray<FNodeLayoutInfo*> Children;       // 执行流子节点
    TArray<FNodeLayoutInfo*> DataConsumers;  // 数据流消费者
};
```

#### 布局算法步骤

1. **构建关系图**：遍历所有引脚，区分执行流（`PC_Exec`）和数据流
2. **环检测与移除**：使用DFS检测并切断回环连接
3. **拓扑分层（BFS）**：从根节点出发，按执行流分配层级（Rank）
4. **识别主路径**：沿最长执行链标记主路径节点
5. **执行流节点布局**：按层级水平排列，同层节点垂直堆叠
6. **纯函数节点布局**：放置在其消费者节点的左侧，带AABB重叠检测和向上偏移
7. **网格对齐**：所有坐标对齐到16像素网格

---

### 4.4 FBlueprintAIBridgeCommands (`BlueprintAIBridgeCommands.h/cpp`)

命令定义类，继承自 `TCommands<FBlueprintAIBridgeCommands>`。

#### 命令列表

| 命令 | ID | 显示名称 | 说明 |
|------|-----|---------|------|
| `PasteShortCode` | "Paste Short Code" | 粘贴短代码 | 从剪贴板读取短代码并生成节点 |
| `CopyShortCode` | "Copy Short Code" | 复制短代码 | 将选中节点转为短代码并复制到剪贴板 |
| `FormatNodes` | "Format Nodes" | 整理节点 | 自动排列选中的节点 |

---

### 4.5 FBlueprintAIBridgeStyle (`BlueprintAIBridgeStyle.h/cpp`)

Slate样式管理类，负责插件的UI外观。

| 函数 | 签名 | 说明 |
|------|------|------|
| `Initialize` | `static void Initialize()` | 创建并注册样式集 |
| `Shutdown` | `static void Shutdown()` | 注销并释放样式集 |
| `ReloadTextures` | `static void ReloadTextures()` | 重载纹理资源 |
| `Get` | `static const ISlateStyle& Get()` | 获取当前样式 |
| `GetStyleSetName` | `static FName GetStyleSetName()` | 获取样式集名称（`"BlueprintAIBridgeStyle"`） |

---

## 5. 数据流与执行流

### 5.1 复制流程（蓝图 → 短代码）

```
用户选中节点
    │
    ▼
┌────────────────────────┐
│ CopyShortCodeClicked() │
│  - 获取SGraphEditor    │
│  - 回退到全局选择      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ GenerateShortCode()    │
│  1. 导出完整节点集T3D  │
│  2. 为每个节点生成ID   │
│  3. 缓存个体T3D模板    │
│  4. 提取引脚名称和值   │
│  5. 生成节点定义行     │
│  6. 遍历连接生成Links  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ 复制到剪贴板           │
│ SaveCache()            │
└────────────────────────┘
```

### 5.2 粘贴流程（短代码 → 蓝图）

```
用户粘贴短代码
    │
    ▼
┌────────────────────────┐
│ PasteShortCodeClicked()│
│  - 读取剪贴板文本      │
│  - 计算视图中心位置    │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ ParseAndPaste()        │
│  1. 解析为Definitions  │
│  2. 解析为Links        │
│  3. 开启Undo事务       │
│  4. 重新生成所有GUID   │
│  5. T3D导入创建新节点  │
│  6. 按Links重建连接    │
│  7. 通知蓝图结构变更   │
│  8. 选中新节点         │
└────────────────────────┘
```

### 5.3 格式化流程（节点自动排列）

```
用户选中节点并点击整理
    │
    ▼
┌────────────────────────┐
│ FormatNodesClicked()   │
│  - 获取选中节点        │
│  - 要求至少2个节点     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ FormatNodes()          │
│  1. 构建FNodeLayoutInfo│
│  2. 分离执行/数据流    │
│  3. 环检测与移除       │
│  4. BFS拓扑分层        │
│  5. 识别主路径         │
│  6. 执行节点水平布局   │
│  7. 纯函数近邻布局     │
│  8. 网格对齐           │
│  9. 应用位置           │
└────────────────────────┘
```

---

## 6. 依赖关系

### 6.1 模块依赖 (`BlueprintAIBridge.Build.cs`)

#### Public 依赖模块

| 模块 | 用途 |
|------|------|
| `Core` | UE核心功能 |
| `CoreUObject` | UObject系统 |
| `Engine` | 引擎基础类 |
| `InputCore` | 输入处理 |
| `UnrealEd` | 编辑器核心 |
| `BlueprintGraph` | 蓝图图表系统 |
| `Kismet` | 蓝图运行时 |
| `KismetCompiler` | 蓝图编译器 |
| `AssetRegistry` | 资产注册表 |
| `Slate` / `SlateCore` | UI框架 |
| `ToolMenus` | 工具菜单系统 |
| `EditorStyle` | 编辑器样式 |
| `ApplicationCore` | 应用核心 |
| `GraphEditor` | 图表编辑器 |

#### Private 依赖模块

| 模块 | 用途 |
|------|------|
| `Projects` | 项目管理 |
| `EditorFramework` | 编辑器框架 |
| `Json` / `JsonUtilities` | JSON序列化（缓存文件） |

### 6.2 插件依赖 (`BlueprintAIBridge.uplugin`)

| 插件 | 是否必需 | 说明 |
|------|---------|------|
| `PythonScriptPlugin` | 是 | 依赖Python脚本插件 |

### 6.3 内部文件依赖图

```
BlueprintAIBridge.cpp
├── BlueprintAIBridge.h
├── BlueprintAIBridgeStyle.h ──► BlueprintAIBridgeStyle.cpp
├── BlueprintAIBridgeCommands.h ──► BlueprintAIBridgeCommands.cpp
├── TextGraphParser.h ──► TextGraphParser.cpp
│   ├── EdGraph/EdGraph.h
│   ├── EdGraph/EdGraphPin.h
│   ├── K2Node_CallFunction.h
│   ├── K2Node_VariableGet.h
│   ├── K2Node_VariableSet.h
│   ├── K2Node_Event.h
│   ├── K2Node_IfThenElse.h
│   ├── K2Node_Knot.h
│   ├── EdGraphUtilities.h
│   ├── Kismet2/BlueprintEditorUtils.h
│   └── Kismet2/KismetEditorUtilities.h
└── NodeGraphFormatter.h ──► NodeGraphFormatter.cpp
    ├── EdGraph/EdGraphPin.h
    └── Framework/Notifications/NotificationManager.h
```

---

## 7. 关键算法说明

### 7.1 GUID 重新生成算法

**目的**: 当从T3D导入节点时，如果GUID已存在，UE会尝试重用已有节点。重新生成GUID确保每次粘贴都创建全新实例。

**算法**:
1. 扫描T3D文本，查找32位连续十六进制字符模式
2. 对每个匹配的GUID，生成新的 `FGuid::NewGuid()`
3. 将新GUID格式化为大写、无连字符的32位字符串
4. 原地替换旧GUID

```cpp
// 伪代码
while (找到32位hex字符串) {
    FGuid NewGuid = FGuid::NewGuid();
    FString NewGuidStr = NewGuid.ToString().Replace("-", "").ToUpper();
    替换原始文本中的GUID;
}
```

### 7.2 短代码文本格式 (Text Graph DSL)

**节点定义格式**:
```
节点名_唯一ID (输入引脚1(值); 输入引脚2;) : (输出引脚1; 输出引脚2;)
```

**连接定义格式**:
```
源节点ID (源引脚) -> 目标节点ID (目标引脚)
```

**示例**:
```text
# --- Node Definitions ---
EventBeginPlay_1 () : (outExec;)
Branch_2 (inExec; Condition(true);) : (True; False;)
PrintString_3 (inExec; InString("Hello");) : (outExec;)

# --- Links ---
EventBeginPlay_1 (outExec) -> Branch_2 (inExec)
Branch_2 (True) -> PrintString_3 (inExec)
```

### 7.3 节点布局算法

**执行流节点（有Exec引脚）**:
- 按拓扑Rank水平分层，层间距200px
- 同层多个节点垂直堆叠，间距60px
- 单层节点居中于起始Y

**纯函数节点（无Exec引脚）**:
- 放置在其主要数据消费者的左侧
- 与消费者在Y轴对齐
- 带AABB碰撞检测，重叠时向上偏移
- 最大尝试10次

**网格对齐**:
```cpp
NodePosX = RoundToInt(Pos.X / 16.0f) * 16;
NodePosY = RoundToInt(Pos.Y / 16.0f) * 16;
```

---

## 8. 项目运行与安装方式

### 8.1 环境要求

- **Unreal Engine**: 5.x 版本
- **平台**: Windows（当前预编译二进制文件为Win64）
- **构建工具**: Visual Studio 2022（如需重新编译）

### 8.2 安装步骤

#### 方式一：安装到项目（推荐）

1. 将 `BlueprintAIBridge` 文件夹复制到项目的 `Plugins/` 目录下
2. 目录结构应为：`YourProject/Plugins/BlueprintAIBridge/`
3. 启动虚幻编辑器，插件将自动加载
4. 在 **编辑 → 插件 → 其他** 中确认 `BlueprintAIBridge` 已启用

#### 方式二：安装到引擎（全局）

1. 将 `BlueprintAIBridge` 文件夹复制到引擎的插件目录：
   ```
   Engine/Plugins/Marketplace/BlueprintAIBridge/
   ```
2. 重新启动编辑器

### 8.3 使用方法

1. **复制为短代码**: 在蓝图中选中节点 → 点击工具栏 **AI桥梁** 下拉 → **复制短代码**
2. **粘贴短代码**: 点击工具栏 **AI桥梁** 下拉 → **粘贴短代码**
3. **整理节点**: 选中节点 → 点击工具栏 **AI桥梁** 下拉 → **整理节点**
4. **复制AI规则**: 点击 **复制AI规则**，将规则文本提供给AI模型

### 8.4 缓存文件位置

节点模板缓存存储于：
```
ProjectSaved/BlueprintAIBridge/NodeTemplates.json
```

---

## 9. 文件清单

| 文件路径 | 类型 | 行数 | 说明 |
|---------|------|------|------|
| `BlueprintAIBridge/BlueprintAIBridge.uplugin` | JSON | 30 | 插件描述文件 |
| `BlueprintAIBridge/Resources/AIRules.json` | JSON | 52 | AI生成规则（中文） |
| `BlueprintAIBridge/Resources/Icon128.png` | Image | - | 插件图标 |
| `BlueprintAIBridge/Resources/PlaceholderButtonIcon.svg` | SVG | - | 工具栏按钮图标 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/BlueprintAIBridge.Build.cs` | C# | 73 | 模块构建配置 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Public/BlueprintAIBridge.h` | C++ | 74 | 主模块头文件 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Private/BlueprintAIBridge.cpp` | C++ | 682 | 主模块实现 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Public/BlueprintAIBridgeCommands.h` | C++ | 24 | 命令声明 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Private/BlueprintAIBridgeCommands.cpp` | C++ | 14 | 命令注册 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Public/BlueprintAIBridgeStyle.h` | C++ | 31 | 样式声明 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Private/BlueprintAIBridgeStyle.cpp` | C++ | 60 | 样式实现 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Public/TextGraphParser.h` | C++ | 57 | 解析器声明 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Private/TextGraphParser.cpp` | C++ | 607 | 解析器实现 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Public/NodeGraphFormatter.h` | C++ | 19 | 布局器声明 |
| `BlueprintAIBridge/Source/BlueprintAIBridge/Private/NodeGraphFormatter.cpp` | C++ | 464 | 布局器实现 |
| `BlueprintAIBridge/AlternativeApproach.cpp` | C++ | 101 | 材质图支持草稿方案 |
| `BlueprintAIBridge/PracticalSolution.cpp` | C++ | 166 | 简化粘贴方案草稿 |
| `BlueprintAIBridge/MaterialImplementationPlan.md` | Markdown | - | 材质图实现计划 |

---

## 附录：特殊处理说明

### A. 执行引脚别名映射

| UE内部名称 | 短代码名称 | 说明 |
|-----------|-----------|------|
| `execute` | `inExec` | 执行输入引脚 |
| `then` | `outExec` | 执行输出引脚 |

### B. 节点基础名称提取规则

| 节点类型 | 提取来源 | 示例 |
|---------|---------|------|
| `UK2Node_CallFunction` | `GetTargetFunction()->GetName()` | `PrintString` |
| `UK2Node_VariableGet` | `VariableReference.GetMemberName()` + 前缀 | `GetPlayerHealth` |
| `UK2Node_VariableSet` | `VariableReference.GetMemberName()` + 前缀 | `SetPlayerHealth` |
| `UK2Node_IfThenElse` | 硬编码 | `Branch` |
| `UK2Node_Knot` | 硬编码 | `添加变更路线节点` |
| 其他 | `GetNodeTitle().ToString()` 去空格 | `事件开始运行` |

### C. 本地化支持

插件支持中英文双语界面，通过 `GetLocalizedText(English, Chinese)` 函数根据当前系统语言自动切换。

### D. 编辑器兼容性

支持以下蓝图编辑器类型：
- `BlueprintEditor` - 普通蓝图
- `WidgetBlueprintEditor` - 控件蓝图
- `AnimationBlueprintEditor` - 动画蓝图
- `GameplayAbilitiesBlueprintEditor` - 技能蓝图

---

*文档生成时间: 2026-05-09*  
*基于 BlueprintAIBridge v1.0 代码分析*
