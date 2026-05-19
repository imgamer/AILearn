# BlueprintNodeBridge 插件测试方案与技术文档

## 1. 项目概述

BlueprintNodeBridge 是一个 Unreal Engine 5.7 编辑器插件，用于将 Blueprint 节点序列化为 AI 友好的短代码格式，以及从短代码反向粘贴节点。

### 1.1 核心功能
- **GenerateShortCode**: 将选中的 Blueprint 节点序列化为文本格式
- **ParseAndPaste**: 从文本格式解析并重建节点
- **NodeGraphFormatter**: 节点布局自动格式化

### 1.2 技术栈
- **引擎版本**: Unreal Engine 5.7.4
- **语言**: C++17
- **构建工具**: UnrealBuildTool (UBT)
- **测试框架**: 自定义单元测试框架 + UE 日志系统

---

## 2. 测试方案

### 2.1 测试文件结构

```
Plugins/BlueprintNodeBridge/Source/BlueprintNodeBridge/
├── Public/
│   └── BlueprintNodeBridgeTests.h      # 测试声明
└── Private/
    └── BlueprintNodeBridgeTests.cpp     # 测试实现
```

### 2.2 测试框架设计

采用轻量级自定义测试框架，避免 UE Automation Test 的复杂依赖：

```cpp
struct FTestResult
{
    bool bPassed;
    FString Message;
};

#define RUN_TEST(TestName) void TestName(TArray<FTestResult>& OutResults)
#define CHECK(Condition, Msg) if (!(Condition)) { ... }
#define CHECK_EQUAL(A, B, Msg) CHECK((A) == (B), Msg)
#define CHECK_TRUE(Condition, Msg) CHECK((Condition), Msg)
#define CHECK_FALSE(Condition, Msg) CHECK(!(Condition), Msg)
```

**设计理由**:
- `IMPLEMENT_SIMPLE_AUTOMATION_TEST` 宏需要 `EAutomationTestFlags::ApplicationContextMask`
- UE 5.7 中该标志不可见（编辑器模块专用）
- 自定义框架直接使用 `checkf` 断言，结果通过 `UE_LOG` 输出

### 2.3 测试用例清单

| 测试类别 | 测试用例 | 描述 |
|---------|---------|------|
| **Escape/Unescape** | TestEscapeBasic | 基础字符串转义往返 |
| | TestEscapeSpecialChars | 括号和分号转义 |
| | TestEscapeNewlines | 换行、回车、制表符转义 |
| | TestEscapeRoundtrip | 特殊字符完整往返 |
| | TestUnescapeSpecialChars | 反转义验证 |
| **ParseNodeDefinition** | TestParseNodeSimple | 简单节点解析 |
| | TestParseNodeWithValue | 带引脚值的节点 |
| | TestParseNodeNoID | 无ID节点（默认ID=0）|
| | TestParseNodeInvalid | 无效输入检测 |
| | TestParseNodeMultiplePins | 多引脚节点解析 |
| **ParseLinkDefinition** | TestParseLinkSimple | 标准链接格式 |
| | TestParseLinkSimpleForm | 带括号的简化格式 |
| | TestParseLinkInvalid | 无箭头检测 |
| **IsValidShortCode** | TestIsValidShortCodeTrue | 有效短代码验证 |
| | TestIsValidShortCodeEmpty | 空字符串检测 |
| | TestIsValidShortCodePartialNodes | 缺少链接节检测 |
| | TestIsValidShortCodePartialLinks | 缺少节点定义检测 |
| **ComplexParsing** | TestComplexShortCodeParsing | 完整短代码批量解析 |

**总计**: 18 个测试用例，35 个断言

### 2.4 测试执行方式

#### 方式一：编辑器启动时自动运行
在 `StartupModule()` 中调用：
```cpp
void FBlueprintNodeBridgeModule::StartupModule()
{
    UE_LOG(LogTemp, Display, TEXT("=== Running BlueprintNodeBridge Unit Tests ==="));
    RunAllTests();
    // ... 其他初始化代码
}
```

#### 方式二：控制台命令（待实现）
```cpp
static FAutoConsoleCommand GBtnTestCmd(
    TEXT("BNB.Test"),
    TEXT("Run BlueprintNodeBridge unit tests"),
    FConsoleCommandDelegate::CreateStatic(&RunBlueprintNodeBridgeTests)
);
```

### 2.5 测试结果输出

```
[2026.05.19-02.04.20:351][  0]LogTemp: Display: === Test Results: 35 passed, 0 failed ===
```

失败的测试会输出：
```
[2026.05.19-02.02.00:919][  0]LogTemp: Error: FAILED: Parse returns true
```

---

## 3. 核心数据结构

### 3.1 FNodeDefinition
```cpp
USTRUCT(BlueprintType)
struct FNodeDefinition
{
    UPROPERTY() FString Name;           // 节点类型名（如 Branch）
    UPROPERTY() FString ID;             // 实例ID（如 1, 2）
    UPROPERTY() TMap<FString, FString> InputPins;   // 输入引脚及默认值
    UPROPERTY() TArray<FString> OutputPins;          // 输出引脚列表
};
```

### 3.2 FLinkDefinition
```cpp
USTRUCT(BlueprintType)
struct FLinkDefinition
{
    UPROPERTY() FString SourceNodeID;   // 源节点ID
    UPROPERTY() FString SourcePinName;  // 源引脚名
    UPROPERTY() FString TargetNodeID;   // 目标节点ID
    UPROPERTY() FString TargetPinName;  // 目标引脚名
};
```

---

## 4. 短代码格式规范

### 4.1 格式示例
```text
# --- Node Definitions ---
Branch_1 (inExec; Condition\(True\)): (outExec True, outExec False)
PrintString_2 (inExec; InString\(Hello World\)): (outExec)

# --- Links ---
Branch_1 (outExec True) -> PrintString_2 (inExec)
```

### 4.2 格式规则
- **节点定义**: `{NodeType}_{ID} (InputPins): (OutputPins)`
- **引脚格式**: `PinName` 或 `PinName\(Value\)`（带默认值）
- **连接定义**: `{SourceNodeID} ({SourcePin}) -> {TargetNodeID} ({TargetPin})`
- **特殊字符转义**: `\(` `\)` `\;` `\\` `\n` `\r` `\t`

---

## 5. 编译与构建

### 5.1 编译命令
```batch
F:\unreal\UnrealEngine-5.7.4-release\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe UEParserWithMCPEditor Win64 Development -Project="G:\repository\claude\UEParserWithMCP\UEParserWithMCP.uproject"
```

### 5.2 依赖模块
```csharp
PublicDependencyModuleNames.AddRange(new string[]
{
    "Core", "CoreUObject", "Engine", "InputCore",
    "EditorFramework", "UnrealEd", "ToolMenus", "Slate",
    "SlateCore", "BlueprintGraph", "Kismet", "KismetCompiler",
    "GraphEditor", "PropertyEditor"
});
```

### 5.3 编译输出
- DLL: `Plugins\BlueprintNodeBridge\Binaries\Win64\UnrealEditor-BlueprintNodeBridge.dll`
- LIB: `Plugins\BlueprintNodeBridge\Intermediate\Build\Win64\x64\UnrealEditor\Development\BlueprintNodeBridge\`

---

## 6. 遇到的问题与解决方案

### 6.1 EAutomationTestFlags 不可见
**问题**: UE 5.7 中 `ApplicationContextMask` 和 `NormalContext` 在编辑器模块外不可见

**解决**: 放弃 Automation Test 框架，改用自定义轻量级测试框架

### 6.2 IConsoleManager.h 路径错误
**问题**: `#include "IConsoleManager.h"` 找不到文件

**解决**: 改为 `#include "HAL/IConsoleManager.h"`

### 6.3 Console Command 委托签名不匹配
**问题**: `FAutoConsoleCommandWithOutputDeviceDelegate::CreateStatic` 需要 `FOutputDevice&` 参数

**解决**: 移除 Console Command，在 StartupModule 中直接调用测试

### 6.4 测试用例格式不匹配
**问题**: `Node1 -> Node2` 无括号导致解析失败

**解决**: 改用 `Node1 (outExec) -> Node2 (inExec)` 格式

---

## 7. 后续工作

### 7.1 待实现功能
- [ ] FormatNodesClicked() - 节点布局格式化
- [ ] GenerateShortCodeFromSelection() - 从选中节点生成短代码
- [ ] PasteNodesFromText() - 从短代码粘贴节点
- [ ] BNB.Test 控制台命令

### 7.2 待补充测试
- [ ] 集成测试：完整的选择→复制→粘贴流程
- [ ] 边界测试：空选择、超大节点集
- [ ] 错误恢复：无效 T3D 数据处理

---

## 8. 参考资料

- [UE5.7 官方文档](https://docs.unrealengine.com/5.7/en-US/)
- [Unreal Engine API Reference](https://docs.unrealengine.com/5.7/en-US/API/)
- [Blueprint Automation Testing](https://docs.unrealengine.com/5.7/en-US/TestingAndOptimization/Automation/index.html)
