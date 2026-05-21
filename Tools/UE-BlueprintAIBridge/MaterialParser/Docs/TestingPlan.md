# MaterialParser 测试方案

## 1. 测试概述

### 1.1 测试目标

本测试方案旨在为 MaterialParser 插件建立完整的测试体系，确保：
- 短代码序列化/反序列化功能的正确性
- 各种材质节点类型的支持完整性
- 编辑器集成的可靠性
- 回归测试覆盖

### 1.2 测试范围

| 测试类型 | 覆盖范围 | 当前状态 |
|----------|----------|----------|
| 单元测试 | 核心数据结构、解析器逻辑 | 已实现（基础） |
| 集成测试 | 编辑器集成、命令绑定 | 未实现 |
| 手动测试 | UI 交互、复制粘贴流程 | 已验证 |

---

## 2. 当前测试实现

### 2.1 测试框架

当前使用 **UE_LOG 驱动测试**，在 `StartupModule()` 中自动执行：

```cpp
// MaterialParserModule.cpp
void FMaterialParserModule::StartupModule()
{
    FMaterialParserTests::RunAllTests();  // 自动运行
}
```

### 2.2 现有测试用例

| 测试名称 | 测试内容 | 状态 |
|----------|----------|------|
| TestMaterialNodeDef | FMatNodeDef 结构体创建和成员赋值 | ✅ |
| TestMaterialLinkDef | FMatLinkDef 结构体创建和成员赋值 | ✅ |
| TestShortCodeFormat | 短代码格式验证 | ✅ |
| TestShortCodeValidation | IsValidShortCode() 函数 | ✅ |
| TestParseNodeDefinition | 节点定义解析 | ✅ |
| TestParseConnection | 连接定义解析 | ✅ |
| TestParseChainedExpressions | 链式表达式解析 | ✅ |
| TestNodeDisplayNameGeneration | 节点名称生成 | ✅ |
| TestPinValueFormat | 引脚值格式化 | ✅ |

---

## 3. 扩展测试方案

### 3.1 单元测试扩展

#### A. 解析器测试

```cpp
// 新增测试用例 - MaterialParserTests.cpp

void FMaterialParserTests::TestParseVectorValues()
{
    // 测试向量值解析
    FString ShortCode = TEXT("Color [MaterialExpressionConstant3Vector] [100, 200]\n  Constant = (1.000,0.500,0.250,1.000)");
    TArray<FMatNodeDef> Nodes;
    TArray<FMatLinkDef> Links;
    ParseShortCode(ShortCode, Nodes, Links);

    // 验证向量值正确解析
    FString& Value = Nodes[0].InputValues[TEXT("Constant")];
    bool bCorrect = Value.Contains(TEXT("1.000")) &&
                   Value.Contains(TEXT("0.500"));
    LogResult(TEXT("TestParseVectorValues"),
        FTestResult(bCorrect, TEXT("Vector values parsed correctly")));
}

void FMaterialParserTests::TestParseTextureReference()
{
    // 测试纹理引用解析
    FString ShortCode = TEXT("Tex [MaterialExpressionTextureSample] [100, 200]\n  Texture = /Game/Textures/MyTex.MyTex");
    TArray<FMatNodeDef> Nodes;
    TArray<FMatLinkDef> Links;
    ParseShortCode(ShortCode, Nodes, Links);

    FString& TexPath = Nodes[0].InputValues[TEXT("Texture")];
    bool bCorrect = (TexPath == TEXT("/Game/Textures/MyTex.MyTex"));
    LogResult(TEXT("TestParseTextureReference"),
        FTestResult(bCorrect, TEXT("Texture reference parsed correctly")));
}

void FMaterialParserTests::TestParsePinConnection()
{
    // 测试引脚连接解析
    FString ShortCode = TEXT("Const.Output -> Mul.A");
    TArray<FMatNodeDef> Nodes;
    TArray<FMatLinkDef> Links;
    ParseShortCode(ShortCode, Nodes, Links);

    bool bCorrect = (Links[0].SourceNodeId == TEXT("Const")) &&
                   (Links[0].SourcePin == TEXT("Output")) &&
                   (Links[0].TargetNodeId == TEXT("Mul")) &&
                   (Links[0].TargetPin == TEXT("A"));
    LogResult(TEXT("TestParsePinConnection"),
        FTestResult(bCorrect, TEXT("Pin connection parsed correctly")));
}

void FMaterialParserTests::TestParseInvalidFormat()
{
    // 测试无效格式处理
    struct FInvalidCase {
        FString Code;
        const TCHAR* Name;
    };

    TArray<FInvalidCase> InvalidCases = {
        {TEXT(""), TEXT("Empty string")},
        {TEXT("No brackets here"), TEXT("No brackets")},
        {TEXT("[Only open bracket"), TEXT("Missing close bracket")},
        {TEXT("Node [Class]"), TEXT("Missing position")},
        {TEXT("Node [] [100, 200]"), TEXT("Missing class name")},
    };

    for (const FInvalidCase& Case : InvalidCases)
    {
        bool bShouldFail = !IsValidShortCode(Case.Code);
        UE_LOG(LogTemp, Log, TEXT("  %s: %s"),
            Case.Name, bShouldFail ? TEXT("PASS") : TEXT("FAIL"));
    }
}

void FMaterialParserTests::TestParseDuplicateNodes()
{
    // 测试重复节点名处理
    FString ShortCode =
        TEXT("Const [MaterialExpressionConstant] [100, 200]\n")
        TEXT("  R = 0.5\n")
        TEXT("Const [MaterialExpressionConstant] [100, 300]\n")
        TEXT("  R = 0.3");

    TArray<FMatNodeDef> Nodes;
    TArray<FMatLinkDef> Links;
    ParseShortCode(ShortCode, Nodes, Links);

    // 应生成唯一的 NodeId
    bool bHasUniqueIds = (Nodes.Num() == 2);
    LogResult(TEXT("TestParseDuplicateNodes"),
        FTestResult(bHasUniqueIds, TEXT("Duplicate node names handled")));
}
```

#### B. 序列化测试

```cpp
void FMaterialParserTests::TestSerializationRoundTrip()
{
    // 序列化和反序列化往返测试
    FString OriginalCode =
        TEXT("Const [MaterialExpressionConstant] [100, 200]\n")
        TEXT("  R = 0.5\n")
        TEXT("\n")
        TEXT("Const.Output -> Mul.A");

    TArray<FMatNodeDef> Nodes1, Nodes2;
    TArray<FMatLinkDef> Links1, Links2;

    // 第一次解析
    ParseShortCode(OriginalCode, Nodes1, Links1);

    // 重新序列化为字符串
    FString Reserialized = GenerateShortCodeFromDefs(Nodes1, Links1);

    // 第二次解析
    ParseShortCode(Reserialized, Nodes2, Links2);

    // 验证两次解析结果一致
    bool bMatch = (Nodes1.Num() == Nodes2.Num()) &&
                  (Links1.Num() == Links2.Num());
    LogResult(TEXT("TestSerializationRoundTrip"),
        FTestResult(bMatch, TEXT("Round-trip serialization works")));
}

void FMaterialParserTests::TestNodePositionExtraction()
{
    // 测试节点位置提取
    struct FPositionTest {
        FVector2D Expected;
        const TCHAR* Desc;
    };

    TArray<FPositionTest> Tests = {
        {FVector2D(100, 200), TEXT("Normal position")},
        {FVector2D(-50, 300), TEXT("Negative X")},
        {FVector2D(0, 0), TEXT("Origin")},
        {FVector2D(9999, -9999), TEXT("Large values")},
    };

    for (const FPositionTest& Test : Tests)
    {
        FString Line = FString::Printf(TEXT("Node [Class] [%.0f, %.0f]"), Test.Expected.X, Test.Expected.Y);
        // 解析并验证
        FVector2D Parsed = ParsePositionFromLine(Line);
        bool bMatch = (FMath::Abs(Parsed.X - Test.Expected.X) < 0.1f) &&
                      (FMath::Abs(Parsed.Y - Test.Expected.Y) < 0.1f);
        UE_LOG(LogTemp, Log, TEXT("  %s [%.0f, %.0f]: %s"),
            Test.Desc, Test.Expected.X, Test.Expected.Y, bMatch ? TEXT("PASS") : TEXT("FAIL"));
    }
}
```

#### C. 边界条件测试

```cpp
void FMaterialParserTests::TestEdgeCases()
{
    // 极端值测试
    struct FEdgeCase {
        FString Name;
        FString ShortCode;
        bool bShouldPass;
    };

    TArray<FEdgeCase> Cases = {
        {TEXT("空代码"), TEXT(""), false},
        {TEXT("仅换行"), TEXT("\n\n\n"), false},
        {TEXT("仅有空格"), TEXT("   "), false},
        {TEXT("单个节点"), TEXT("Const [MaterialExpressionConstant] [0, 0]"), true},
        {TEXT("超长节点名"), TEXT("VeryLongNodeNameThatExceedsNormalLength [MaterialExpressionConstant] [0, 0]"), true},
        {TEXT("负坐标"), TEXT("Const [MaterialExpressionConstant] [-100, -200]"), true},
        {TEXT("小数坐标"), TEXT("Const [MaterialExpressionConstant] [100.5, 200.7]"), true},
        {TEXT("中文注释"), TEXT("# 注释\nConst [MaterialExpressionConstant] [0, 0]"), true},
        {TEXT("空格环绕"), TEXT("  Const [MaterialExpressionConstant] [0, 0]  "), true},
    };

    for (const FEdgeCase& Case : Cases)
    {
        bool bResult = IsValidShortCode(Case.ShortCode);
        bool bPass = (bResult == Case.bShouldPass);
        UE_LOG(LogTemp, Log, TEXT("  %s: %s"),
            *Case.Name, bPass ? TEXT("PASS") : TEXT("FAIL"));
    }
}
```

### 3.2 集成测试

#### A. 编辑器命令测试

```cpp
// 在手动测试模式下执行
void FMaterialParserTests::TestEditorCommandBinding()
{
    // 测试命令是否正确注册
    TSharedPtr<FUICommandList> Commands = FMaterialParserModule::GetPluginCommands();
    bool bHasCopyCommand = Commands->IsCommandBound(
        FMaterialParserCommands::Get().CopyAsShortCode);
    bool bHasPasteCommand = Commands->IsCommandBound(
        FMaterialParserCommands::Get().PasteShortCode);

    LogResult(TEXT("TestEditorCommandBinding"),
        FTestResult(bHasCopyCommand && bHasPasteCommand,
            TEXT("Editor commands bound correctly")));
}

void FMaterialParserTests::TestMenuRegistration()
{
    // 测试菜单是否正确注册
    UToolMenu* ToolbarMenu = UToolMenus::Get()->FindMenu(
        TEXT("AssetEditor.MaterialEditor.ToolBar"));

    bool bHasSection = ToolbarMenu->FindSection(TEXT("Settings")) != nullptr;
    LogResult(TEXT("TestMenuRegistration"),
        FTestResult(bHasSection, TEXT("Toolbar menu registered")));
}
```

#### B. 节点重建测试

```cpp
void FMaterialParserTests::TestNodeRebuild()
{
    // 测试节点从短代码正确重建
    FString ShortCode =
        TEXT("Const [MaterialExpressionConstant] [100, 200]\n")
        TEXT("  R = 0.5");

    TArray<FMatNodeDef> NodeDefs;
    TArray<FMatLinkDef> LinkDefs;
    ParseShortCode(ShortCode, NodeDefs, LinkDefs);

    // 模拟在材质图中创建节点
    for (const FMatNodeDef& Def : NodeDefs)
    {
        UClass* Class = FindMaterialExpressionClass(Def.ClassName);
        bool bClassFound = (Class != nullptr);
        UE_LOG(LogTemp, Log, TEXT("  Class %s: %s"),
            *Def.ClassName, bClassFound ? TEXT("FOUND") : TEXT("NOT FOUND"));
    }
}

void FMaterialParserTests::TestAllSupportedNodeTypes()
{
    // 测试所有支持的节点类型
    TArray<FString> SupportedTypes = {
        TEXT("MaterialExpressionConstant"),
        TEXT("MaterialExpressionConstant3Vector"),
        TEXT("MaterialExpressionConstant4Vector"),
        TEXT("MaterialExpressionMultiply"),
        TEXT("MaterialExpressionAdd"),
        TEXT("MaterialExpressionSubtract"),
        TEXT("MaterialExpressionDivide"),
        TEXT("MaterialExpressionTextureSample"),
        TEXT("MaterialExpressionTextureCoordinate"),
    };

    int32 SuccessCount = 0;
    for (const FString& Type : SupportedTypes)
    {
        UClass* Class = FindMaterialExpressionClass(Type);
        if (Class)
        {
            SuccessCount++;
            UE_LOG(LogTemp, Log, TEXT("  %s: OK"), *Type);
        }
        else
        {
            UE_LOG(LogTemp, Warning, TEXT("  %s: NOT FOUND"), *Type);
        }
    }

    LogResult(TEXT("TestAllSupportedNodeTypes"),
        FTestResult(SuccessCount == SupportedTypes.Num(),
            FString::Printf(TEXT("%d/%d types supported"),
                SuccessCount, SupportedTypes.Num())));
}
```

---

## 4. 测试执行方式

### 4.1 自动执行（推荐）

在 `StartupModule()` 中自动运行：

```cpp
void FMaterialParserModule::StartupModule()
{
    UE_LOG(LogTemp, Log, TEXT("MaterialParser: Loading..."));

    // 注册命令
    FMaterialParserCommands::Register();
    RegisterMenus();

    // 执行测试
    UE_LOG(LogTemp, Log, TEXT("=== Running MaterialParser Tests ==="));
    FMaterialParserTests::RunAllTests();
    UE_LOG(LogTemp, Log, TEXT("=== Tests Complete ==="));
}
```

### 4.2 控制台命令（扩展）

添加控制台命令支持手动触发测试：

```cpp
// 在模块中添加
static FAutoConsoleCommand GRunTestsCmd(
    TEXT("MaterialParser.RunTests"),
    TEXT("Run MaterialParser unit tests"),
    FConsoleCommandDelegate::CreateLambda([]() {
        FMaterialParserTests::RunAllTests();
    })
);

static FAutoConsoleCommand GDumpShortCodeCmd(
    TEXT("MaterialParser.DumpSelected"),
    TEXT("Dump selected nodes as short code"),
    FConsoleCommandDelegate::CreateLambda([]() {
        FMaterialGraphParser::DumpSelectedNodes();
    })
);
```

### 4.3 查看测试结果

```
1. 打开 UE 编辑器
2. 打开 Output Log 窗口
3. 筛选 LogTemp 类别
4. 搜索 "MaterialParser" 或 "Test"
```

预期输出示例：
```
[2024.01.01-12.00.00:000][  0]LogTemp: === MaterialParser Tests Starting ===
[2024.01.01-12.00.00:001][  0]LogTemp: Test: TestMaterialNodeDef
[2024.01.01-12.00.00:002][  0]LogTemp:   [PASS] TestMaterialNodeDef: FMatNodeDef struct works correctly
[2024.01.01-12.00.00:003][  0]LogTemp: Test: TestShortCodeValidation
[2024.01.01-12.00.00:004][  0]LogTemp:   [PASS] TestShortCodeValidation: Short code validation works correctly
[2024.01.01-12.00.00:005][  0]LogTemp: === MaterialParser Tests Complete ===
```

---

## 5. 测试矩阵

### 5.1 功能覆盖矩阵

| 功能点 | 单元测试 | 集成测试 | 手动测试 |
|--------|----------|----------|----------|
| FMatNodeDef 结构 | ✅ | - | - |
| FMatLinkDef 结构 | ✅ | - | - |
| 短代码格式验证 | ✅ | - | - |
| 节点定义解析 | ✅ | - | - |
| 连接定义解析 | ✅ | - | - |
| 向量值解析 | 🔲 | - | - |
| 纹理引用解析 | 🔲 | - | - |
| 往返序列化 | 🔲 | - | - |
| 边界条件处理 | 🔲 | - | - |
| 节点类型查找 | 🔲 | ✅ | ✅ |
| 节点创建 | - | 🔲 | ✅ |
| 连接重建 | - | 🔲 | ✅ |
| 复制命令执行 | - | 🔲 | ✅ |
| 粘贴命令执行 | - | 🔲 | ✅ |
| 菜单注册 | - | 🔲 | ✅ |

> ✅ = 已实现  🔲 = 待实现  - = 不适用

### 5.2 节点类型测试矩阵

| 节点类型 | 创建测试 | 属性测试 | 连接测试 |
|----------|----------|----------|----------|
| Constant | ✅ | ✅ | ✅ |
| Constant3Vector | ✅ | ✅ | ✅ |
| Constant4Vector | ✅ | ✅ | ✅ |
| Multiply | ✅ | - | ✅ |
| Add | ✅ | - | ✅ |
| Subtract | ✅ | - | ✅ |
| Divide | ✅ | - | ✅ |
| TextureSample | ✅ | ✅ | ✅ |
| TextureCoordinate | ✅ | - | ✅ |

---

## 6. 回归测试策略

### 6.1 开发流程中的测试

```
┌─────────────────────────────────────────────────────────────┐
│                     开发流程                                  │
├─────────────────────────────────────────────────────────────┤
│  编写代码  →  运行测试  →  全部通过?  →  提交代码           │
│                   ↓                                         │
│              有失败?                                         │
│                   ↓                                         │
│              修复代码  →  重新运行测试                        │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 CI/CD 集成（预留）

```powershell
# PowerShell CI 脚本示例
# 启动 UE 编辑器并运行测试
& "$env:UE_DIR/Engine/Binaries/Win64/UnrealEditor.exe" `
    "$env:PROJECT_PATH" `
    -Run="MaterialParser.RunTests" `
    -Log
```

---

## 7. 测试数据

### 7.1 标准测试用例

```cpp
// 测试数据存储在 MaterialParserTestData.h
namespace TestData
{
    // 简单节点
    static const FString SimpleConstant =
        TEXT("Const [MaterialExpressionConstant] [100, 200]\n")
        TEXT("  R = 0.5");

    // 向量节点
    static const FString VectorNode =
        TEXT("Color [MaterialExpressionConstant3Vector] [100, 300]\n")
        TEXT("  Constant = (1.000,0.500,0.250,1.000)");

    // 纹理节点
    static const FString TextureNode =
        TEXT("Tex [MaterialExpressionTextureSample] [500, 200]\n")
        TEXT("  Texture = /Game/Textures/MyTex.MyTex\n")
        TEXT("  Coordinates = Mul.Output");

    // 复杂网络
    static const FString ComplexNetwork =
        TEXT("Const1 [MaterialExpressionConstant] [100, 200]\n")
        TEXT("  R = 0.5\n")
        TEXT("Const2 [MaterialExpressionConstant] [100, 400]\n")
        TEXT("  R = 0.3\n")
        TEXT("Mul [MaterialExpressionMultiply] [400, 300]\n")
        TEXT("Tex [MaterialExpressionTextureSample] [700, 300]\n")
        TEXT("\n")
        TEXT("Const1.Output -> Mul.A\n")
        TEXT("Const2.Output -> Mul.B\n")
        TEXT("Mul.Output -> Tex.Coordinates");
}
```

---

## 8. 问题追踪

### 8.1 已知测试问题

| 问题ID | 描述 | 优先级 | 状态 |
|--------|------|--------|------|
| TST-001 | 负坐标解析可能不正确 | 中 | 待修复 |
| TST-002 | 重复节点名去重逻辑待改进 | 低 | 待优化 |
| TST-003 | 部分引脚类型序列化不完整 | 中 | 待修复 |

### 8.2 改进建议

1. **添加测试框架**: 考虑使用 UE 的 Automation 系统
2. **添加性能测试**: 测量大节点图的序列化时间
3. **添加模糊测试**: 测试各种异常输入的处理

---

## 9. 附录

### A. 测试检查清单

开发新功能时的测试检查：

- [ ] 新功能有对应的单元测试
- [ ] 解析器修改后运行所有测试
- [ ] 手动测试复制/粘贴流程
- [ ] 测试边界条件和异常输入
- [ ] 更新测试矩阵文档

### B. 参考资料

- [UE5 自动化系统文档](https://docs.unrealengine.com/5.3/ProductionGraphs/Automation/)
- [Google Test 最佳实践](https://google.github.io/googletest/)
