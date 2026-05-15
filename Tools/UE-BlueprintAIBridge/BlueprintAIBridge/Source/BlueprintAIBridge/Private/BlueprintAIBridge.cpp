#include "BlueprintAIBridge.h"
#include "Selection.h"
#include "BlueprintEditor.h"
#include "BlueprintAIBridgeStyle.h"
#include "BlueprintAIBridgeCommands.h"
#include "LevelEditor.h"
#include "Widgets/Layout/SBox.h"
#include "Widgets/Text/STextBlock.h"
#include "ToolMenus.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "TextGraphParser.h"
#include "NodeGraphFormatter.h"
#include "Misc/MessageDialog.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "Framework/Application/SlateApplication.h"
#include "Editor.h"
#include "GraphEditor.h"
#include "EdGraph/EdGraphNode.h"
#include "HAL/PlatformApplicationMisc.h"
#include "HAL/PlatformProcess.h"
#include "HAL/PlatformFileManager.h"
#include "AssetRegistry/AssetRegistryModule.h"
#include "Modules/ModuleManager.h"
#include "Subsystems/AssetEditorSubsystem.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonReader.h"
#include "Misc/FileHelper.h"
#include "Widgets/Input/SMultiLineEditableTextBox.h"
#include "Widgets/Input/SButton.h"
#include "Widgets/Layout/SSeparator.h"
#include "Framework/MultiBox/MultiBoxBuilder.h"
#include "Internationalization/Internationalization.h"
#include "Internationalization/Culture.h"
#include "Toolkits/AssetEditorToolkit.h"
#include "GraphEditorActions.h"

static FText GetLocalizedText(const FString& En, const FString& Zh)
{
    FString Lang = FInternationalization::Get().GetCurrentCulture()->GetTwoLetterISOLanguageName();
    if (Lang == TEXT("zh"))
    {
        return FText::FromString(Zh);
    }
    return FText::FromString(En);
}

#define LOCTEXT_NAMESPACE "FBlueprintAIBridgeModule"

void FBlueprintAIBridgeModule::StartupModule()
{
	FBlueprintAIBridgeStyle::Initialize();
	FBlueprintAIBridgeStyle::ReloadTextures();

	FBlueprintAIBridgeCommands::Register();
	
	PluginCommands = MakeShareable(new FUICommandList);

    PluginCommands->MapAction(
        FBlueprintAIBridgeCommands::Get().PasteShortCode,
        FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::PasteShortCodeClicked),
        FCanExecuteAction());

    PluginCommands->MapAction(
        FBlueprintAIBridgeCommands::Get().CopyShortCode,
        FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::CopyShortCodeClicked),
        FCanExecuteAction());

    PluginCommands->MapAction(
        FBlueprintAIBridgeCommands::Get().FormatNodes,
        FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::FormatNodesClicked),
        FCanExecuteAction());

	UToolMenus::RegisterStartupCallback(FSimpleMulticastDelegate::FDelegate::CreateRaw(this, &FBlueprintAIBridgeModule::RegisterMenus));
    
    // Load cache on startup
    LoadCache();
	
	// Bind commands to existing editors
	if (GEditor)
	{
		if (UAssetEditorSubsystem* AssetEditorSubsystem = GEditor->GetEditorSubsystem<UAssetEditorSubsystem>())
		{
			AssetEditorSubsystem->OnAssetEditorOpened().AddRaw(this, &FBlueprintAIBridgeModule::OnAssetEditorOpened);
			
			TArray<IAssetEditorInstance*> Editors = AssetEditorSubsystem->GetAllOpenEditors();
			for (IAssetEditorInstance* Instance : Editors)
			{
				BindCommandsToEditor(Instance);
			}
		}
	}
}

void FBlueprintAIBridgeModule::ShutdownModule()
{
	if (GEditor)
	{
		if (UAssetEditorSubsystem* AssetEditorSubsystem = GEditor->GetEditorSubsystem<UAssetEditorSubsystem>())
		{
			AssetEditorSubsystem->OnAssetEditorOpened().RemoveAll(this);
		}
	}

	UToolMenus::UnRegisterStartupCallback(this);

	UToolMenus::UnregisterOwner(this);

	FBlueprintAIBridgeStyle::Shutdown();

	FBlueprintAIBridgeCommands::Unregister();
}

void FBlueprintAIBridgeModule::RegisterMenus()
{
	FToolMenuOwnerScoped OwnerScoped(this);

    // List of toolbars to extend
    TArray<FName> Toolbars = {
        "AssetEditor.BlueprintEditor.ToolBar",
        "AssetEditor.WidgetBlueprintEditor.ToolBar"
    };

    for (const FName& ToolbarName : Toolbars)
    {
	    UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);
	    {
		    FToolMenuSection& Section = ToolbarMenu->FindOrAddSection("Settings");
		    
            Section.AddEntry(FToolMenuEntry::InitComboButton(
                "BlueprintAIBridgeActions",
                FUIAction(),
                FOnGetContent::CreateLambda([this]()
                {
                    FMenuBuilder MenuBuilder(true, PluginCommands);
                    
                    MenuBuilder.AddMenuEntry(
                        FBlueprintAIBridgeCommands::Get().PasteShortCode, 
                        NAME_None, 
                        GetLocalizedText(TEXT("Paste Short Code"), TEXT("粘贴短代码")), 
                        GetLocalizedText(TEXT("Paste Blueprint nodes from Short Code"), TEXT("从短代码粘贴蓝图节点"))
                    );
                    
                    MenuBuilder.AddMenuEntry(
                        FBlueprintAIBridgeCommands::Get().CopyShortCode,
                        NAME_None,
                        GetLocalizedText(TEXT("Copy Short Code"), TEXT("复制为短代码")),
                        GetLocalizedText(TEXT("Copy selected nodes as Short Code"), TEXT("将选中节点复制为短代码"))
                    );

                    MenuBuilder.AddMenuEntry(
                        FBlueprintAIBridgeCommands::Get().FormatNodes,
                        NAME_None,
                        GetLocalizedText(TEXT("Format Nodes"), TEXT("整理节点")),
                        GetLocalizedText(TEXT("Auto arrange selected nodes"), TEXT("自动排列选中节点"))
                    );

                    MenuBuilder.AddMenuSeparator();

                    MenuBuilder.AddMenuEntry(
                        GetLocalizedText(TEXT("Copy AI Rules"), TEXT("复制 AI 规则")),
                        GetLocalizedText(TEXT("Copy AI generation rules to clipboard"), TEXT("复制 AI 生成规则到剪贴板")),
                        FSlateIcon(),
                        FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::CopyAIRulesClicked))
                    );
                    
                    MenuBuilder.AddMenuEntry(
                        GetLocalizedText(TEXT("Manage Templates"), TEXT("管理模板")),
                        GetLocalizedText(TEXT("Open templates folder"), TEXT("打开模板文件夹")),
                        FSlateIcon(),
                        FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::ManageTemplatesClicked))
                    );

                    MenuBuilder.AddMenuEntry(
                        GetLocalizedText(TEXT("Edit AI Rules"), TEXT("编辑 AI 规则")),
                        GetLocalizedText(TEXT("Open AI rules JSON file"), TEXT("打开 AI 规则 JSON 文件")),
                        FSlateIcon(),
                        FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintAIBridgeModule::EditAIRulesClicked))
                    );
                    
                    return MenuBuilder.MakeWidget();
                }),
                GetLocalizedText(TEXT("AI Bridge"), TEXT("AI桥梁")),
                GetLocalizedText(TEXT("AI Bridge Actions"), TEXT("AI 桥梁操作")),
                FSlateIcon(FBlueprintAIBridgeStyle::GetStyleSetName(), "BlueprintAIBridge.PluginAction")
            ));
	    }
    }
}

static bool IsBlueprintEditor(FName EditorName)
{
	return EditorName == "BlueprintEditor" || 
		   EditorName == "WidgetBlueprintEditor" || 
		   EditorName == "AnimationBlueprintEditor" ||
		   EditorName == "GameplayAbilitiesBlueprintEditor";
}

UBlueprint* FBlueprintAIBridgeModule::GetCurrentBlueprint()
{
    // Deprecated or redirect to new logic if needed.
    // Keeping for compatibility with internal helpers if any.
    // Actually, let's update it to return null if not a BP editor.
	if (GEditor)
	{
		if (UAssetEditorSubsystem* AssetEditorSubsystem = GEditor->GetEditorSubsystem<UAssetEditorSubsystem>())
		{
			TArray<IAssetEditorInstance*> Editors = AssetEditorSubsystem->GetAllOpenEditors();
			for (IAssetEditorInstance* Instance : Editors)
			{
				if (IsBlueprintEditor(Instance->GetEditorName()))
				{
					FBlueprintEditor* Editor = static_cast<FBlueprintEditor*>(Instance);
					if (Editor) return Editor->GetBlueprintObj();
				}
			}
		}
	}
	return nullptr;
}

#include "UObject/UObjectHash.h"

// Helper to get focused graph editor
static TSharedPtr<SGraphEditor> GetFocusedGraphEditor()
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

// Fallback method to get selected nodes from GEditor (Global Selection)
static TArray<UEdGraphNode*> GetSelectedNodesFromGlobalSelection()
{
    TArray<UEdGraphNode*> SelectedNodes;

    if (!GEditor) return SelectedNodes;
    USelection* Selection = GEditor->GetSelectedObjects();
    if (!Selection) return SelectedNodes;

    for (FSelectionIterator It(*Selection); It; ++It)
    {
        UObject* SelectedObj = *It;

        // Standard Graph Node (Blueprint, Widget, etc.)
        if (UEdGraphNode* Node = Cast<UEdGraphNode>(SelectedObj))
        {
            SelectedNodes.Add(Node);
        }
    }

    return SelectedNodes;
}

void FBlueprintAIBridgeModule::CopyShortCodeClicked()
{
    TArray<UEdGraphNode*> SelectedNodes;
    
    // Strategy 1: Use Slate Focus to find the active SGraphEditor (Recommended)
    TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
    
    if (GraphEditor.IsValid())
    {
        FGraphPanelSelectionSet SelectedSet = GraphEditor->GetSelectedNodes();
        for (UObject* Obj : SelectedSet)
        {
            if (UEdGraphNode* Node = Cast<UEdGraphNode>(Obj))
            {
                SelectedNodes.Add(Node);
            }
        }
    }
    
    // Strategy 2: Fallback to Global Selection (if Focus method failed or returned 0)
    if (SelectedNodes.Num() == 0)
    {
        SelectedNodes = GetSelectedNodesFromGlobalSelection();
    }

	if (SelectedNodes.Num() == 0)
	{
        FString Msg = GetLocalizedText(TEXT("No nodes selected"), TEXT("没有选中的节点")).ToString();
		FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(Msg));
		return;
	}

	FString ShortCode = FTextGraphParser::GenerateShortCode(SelectedNodes, NodeTemplateCache);
    
    // Save updated cache
    SaveCache();

	FPlatformApplicationMisc::ClipboardCopy(*ShortCode);

	FNotificationInfo Info(GetLocalizedText(TEXT("Nodes copied as Short Code (Templates cached)"), TEXT("节点已复制为短代码 (并缓存模板)")));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

void FBlueprintAIBridgeModule::PasteShortCodeClicked()
{
	FString ClipboardText;
	FPlatformApplicationMisc::ClipboardPaste(ClipboardText);

	if (ClipboardText.IsEmpty())
	{
		FMessageDialog::Open(EAppMsgType::Ok, GetLocalizedText(TEXT("Clipboard is empty"), TEXT("剪贴板为空")));
		return;
	}

    TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
    UEdGraph* TargetGraph = nullptr;
    FVector2D PasteLocation = FVector2D::ZeroVector;

    if (GraphEditor.IsValid())
    {
        TargetGraph = GraphEditor->GetCurrentGraph();
        
        // Calculate paste location
        FGeometry Geometry = GraphEditor->GetCachedGeometry();
        FVector2f ViewLocation = FVector2f::ZeroVector;
        float Zoom = 1.0f;

        GraphEditor->GetViewLocation(ViewLocation, Zoom);

        FVector2D Size = Geometry.GetLocalSize();
        
        if (Size.X > 0 && Size.Y > 0 && Zoom > 0)
        {
            PasteLocation = FVector2D(ViewLocation) + (Size / Zoom) * 0.5f;
        }
        else
        {
            PRAGMA_DISABLE_DEPRECATION_WARNINGS
            PasteLocation = FVector2D(GraphEditor->GetPasteLocation());
            PRAGMA_ENABLE_DEPRECATION_WARNINGS
        }
    }

	if (!TargetGraph)
	{
		FMessageDialog::Open(EAppMsgType::Ok, GetLocalizedText(TEXT("No active Graph found (Must focus a Graph)"), TEXT("当前没有打开的图表 (请点击图表以获取焦点)")));
		return;
	}

    // Need a Blueprint context? 
    // FTextGraphParser uses Blueprint to MarkStructurallyModified.
    // We can try to find the Blueprint from the Graph.
    UBlueprint* CurrentBlueprint = nullptr;
    UObject* GraphOuter = TargetGraph->GetOuter();
    while (GraphOuter)
    {
        if (UBlueprint* BP = Cast<UBlueprint>(GraphOuter))
        {
            CurrentBlueprint = BP;
            break;
        }
        GraphOuter = GraphOuter->GetOuter();
    }
    
	bool bSuccess = FTextGraphParser::ParseAndPaste(ClipboardText, CurrentBlueprint, NodeTemplateCache, PasteLocation, TargetGraph);

    if (bSuccess)
    {
        FNotificationInfo Info(GetLocalizedText(TEXT("Nodes pasted successfully!"), TEXT("节点粘贴成功！")));
        Info.bFireAndForget = true;
        Info.ExpireDuration = 3.0f;
        FSlateNotificationManager::Get().AddNotification(Info);
    }
    else
    {
        FNotificationInfo Info(GetLocalizedText(TEXT("Failed to parse Short Code"), TEXT("解析短代码失败")));
        Info.bFireAndForget = true;
        Info.ExpireDuration = 3.0f;
        FSlateNotificationManager::Get().AddNotification(Info);
    }
}

void FBlueprintAIBridgeModule::CopyAIRulesClicked()
{
	FString Rules = GetAIRulesContent();
	FPlatformApplicationMisc::ClipboardCopy(*Rules);

	FNotificationInfo Info(GetLocalizedText(TEXT("AI Rules copied to clipboard"), TEXT("AI 生成规则已复制到剪贴板")));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

FString GetAIRulesContent()
{
	// Load JSON file and return its content directly
	FString JsonPath = FPaths::ProjectPluginsDir() / TEXT("BlueprintAIBridge/Resources/AIRules.json");
	FString JsonContent;

	if (FFileHelper::LoadFileToString(JsonContent, *JsonPath))
	{
		return JsonContent;
	}

	// Fallback to embedded rules if JSON loading fails
	return GetEmbeddedAIRules();
}

FString GetEmbeddedAIRules()
{
	return TEXT(R"(
# 蓝图节点短代码生成规则

## 1. 核心铁律

1. **全量输出模式**
   - 无论修改多么微小，必须完整输出整个蓝图代码
   - 严禁使用省略号
   - 严禁只输出被修改的节点

2. **忠实还原**
   - 节点名与ID必须与用户提供的完全一致，保留中文或英文原样
   - 每个引脚定义必须以分号结尾
   - 输出短代码必须包含在 ```text 代码块中防止复制格式出错

3. **链接完整性**
   - 所有存在的逻辑连接必须显式写出
   - 纯函数必须通过数据流连接
   - 变更路线节点必须同时拥有输入和输出链接，不可悬空

4. **支持动态参数**
   - 部分节点类型支持通过参数动态创建，无需预先复制
   - 变更节点支持Comment参数用于说明文本

## 2. 节点定义格式

格式：节点名_唯一ID (输入引脚;) : (输出引脚;)

支持动态参数的节点类型
| 节点类型 | 节点名示例 | 支持的参数 | 说明 |
|----------|-------------|-----------|------|
| 变更节点 | 添加变更路线节点 | Comment("说明") | 转接节点 |
| Branch | Branch | Condition(值) | 条件值 |
| Sequence | 序列, Sequence | - | - |
| ForLoop | ForLoop, 循环 | FirstIndex(0) | 起始索引 |
| | | LastIndex(10) | 结束索引 |
| SwitchOnString | 开启字符串, SwitchOnString | Selection("value") | 选择值 |
| Event | EventBeginPlay, 事件开始运行 | - | - |

**特殊节点处理要求：**
- 变更路线节点：必须保留在输出中，支持动态创建和添加说明
- 其他节点：优先使用已复制的缓存，未缓存时尝试动态创建
- 隐性节点：如果逻辑中用到变量或纯函数，必须自动创建对应的Get或Function节点定义

## 3. 链接生成逻辑

生成Links部分时，必须严格执行以下两轮扫描

**第一轮：执行流扫描**
- 目标：连接所有白色执行引脚
- 对象：Event, Function, Branch, Sequence, Loop, Switch, Reroute等
- 规则：
  - Source (outExec) -> Target (inExec)
  - Sequence (Then_0) -> Target (inExec)
  - Branch (True/False) -> Target (inExec)
  - Switch (CaseName) -> Target (inExec)

**第二轮：数据流扫描 - 反向检查法**
- 目标：确保所有非纯函数节点的输入引脚都有数据来源
- 步骤：
  1. 遍历所有非纯函数节点（如Set, PrintString, Branch, CallFunction）
  2. 检查每一个输入参数引脚（如Value, InString, Condition, self）
  3. 反推数据的来源节点（Get变量节点、纯函数节点、Reroute节点）
  4. 记录链接：数据源节点 -> 目标节点(输入引脚)
- 强制规则：
  - 变量引用：使用变量时必须显式写出Get变量节点到目标节点的链接
  - Branch条件：Branch的Condition引脚必须连接到布尔数据源
  - Reroute透传：链路中存在Reroute时，必须分步写出源->Reroute和Reroute->目标，严禁跨越连接

## 4. 输出模板

```text
# --- Node Definitions ---
EventBeginPlay_1 () : (outExec;)
Branch_2 (inExec; Condition(true);) : (True; False;)
PrintString_3 (inExec; InString("Hello");) : (outExec;)
添加变更路线节点_4 (Comment("玩家引用");) : (OutputPin;)

# --- Links ---
# 执行流
EventBeginPlay_1 (outExec) -> Branch_2 (inExec)
Branch_2 (True) -> PrintString_3 (inExec)

# 数据流
VariableGet_5 (ReturnValue) -> Branch_2 (Condition)
添加变更路线节点_4 (OutputPin) -> PrintString_3 (InString)
```

## 5. 异常处理

如果用户请求中使用了未定义的节点类型（不支持动态创建且未复制），请立即停止生成，并回复：

需要以下节点才能继续，请在UE中选中它们并点击复制为短代码：
1. [节点类型名称]

复制完成后请告诉我，然后我会生成短代码。
)");
}

void FBlueprintAIBridgeModule::ManageTemplatesClicked()
{
    OpenCacheFolder();
}

void FBlueprintAIBridgeModule::EditAIRulesClicked()
{
    FString Path = FPaths::ProjectPluginsDir() / TEXT("BlueprintAIBridge/Resources/AIRules.json");

    // Ensure file exists
    IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
    if (!PlatformFile.FileExists(*Path))
    {
        FMessageDialog::Open(EAppMsgType::Ok,
            FText::FromString(TEXT("AI 规则文件不存在！\n请确保 AIRules.json 文件位于 Plugins/BlueprintAIBridge/Resources/ 目录下。")));
        return;
    }

    // Open the JSON file with default text editor
    FPlatformProcess::LaunchFileInDefaultExternalApplication(*Path);
}

void FBlueprintAIBridgeModule::SaveCache()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
    
    // Create directory if not exists
    IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
    FString Directory = FPaths::GetPath(Path);
    if (!PlatformFile.DirectoryExists(*Directory))
    {
        PlatformFile.CreateDirectoryTree(*Directory);
    }
    
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

void FBlueprintAIBridgeModule::LoadCache()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge") / TEXT("NodeTemplates.json");
    
    FString Content;
    if (FFileHelper::LoadFileToString(Content, *Path))
    {
        TSharedPtr<FJsonObject> NewRoot;
        TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Content);
        
        if (FJsonSerializer::Deserialize(Reader, NewRoot) && NewRoot.IsValid())
        {
            // Merge instead of empty
            for (auto& Elem : NewRoot->Values)
            {
                if (Elem.Value.IsValid() && Elem.Value->Type == EJson::String)
                {
                    NodeTemplateCache.Add(Elem.Key, Elem.Value->AsString());
                }
            }
        }
    }
}

void FBlueprintAIBridgeModule::OpenCacheFolder()
{
    FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintAIBridge");
    
    // Create directory if not exists, so user sees something
    IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
    if (!PlatformFile.DirectoryExists(*Path))
    {
        PlatformFile.CreateDirectoryTree(*Path);
    }
    
    FPlatformProcess::ExploreFolder(*Path);
}

void FBlueprintAIBridgeModule::BindCommandsToEditor(IAssetEditorInstance* EditorInstance)
{
	if (!EditorInstance) return;

	FName EditorName = EditorInstance->GetEditorName();

	if (IsBlueprintEditor(EditorName))
	{
		// All blueprint editors inherit from FAssetEditorToolkit
		FAssetEditorToolkit* Toolkit = static_cast<FAssetEditorToolkit*>(EditorInstance);
		if (Toolkit)
		{
			Toolkit->GetToolkitCommands()->Append(PluginCommands.ToSharedRef());
		}
	}
}

void FBlueprintAIBridgeModule::OnAssetEditorOpened(UObject* Asset)
{
	if (GEditor)
	{
		if (UAssetEditorSubsystem* AssetEditorSubsystem = GEditor->GetEditorSubsystem<UAssetEditorSubsystem>())
		{
			IAssetEditorInstance* EditorInstance = AssetEditorSubsystem->FindEditorForAsset(Asset, false);
			if (EditorInstance)
			{
				BindCommandsToEditor(EditorInstance);
			}
		}
	}
}

void FBlueprintAIBridgeModule::FormatNodesClicked()
{
    TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
    TArray<UEdGraphNode*> SelectedNodes;

    if (GraphEditor.IsValid())
    {
        FGraphPanelSelectionSet SelectedSet = GraphEditor->GetSelectedNodes();
        for (UObject* Obj : SelectedSet)
        {
            if (UEdGraphNode* Node = Cast<UEdGraphNode>(Obj))
            {
                SelectedNodes.Add(Node);
            }
        }
    }
    
    if (SelectedNodes.Num() == 0)
    {
        // Try Global Selection
        SelectedNodes = GetSelectedNodesFromGlobalSelection();
    }

    if (SelectedNodes.Num() < 2)
    {
        FString Msg = GetLocalizedText(TEXT("Please select at least 2 nodes to format."), TEXT("请至少选择2个节点进行整理。")).ToString();
        FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(Msg));
        return;
    }

    UEdGraph* Graph = SelectedNodes[0]->GetGraph();
    if (!Graph)
    {
        return;
    }

    FNodeGraphFormatter::FormatNodes(Graph, SelectedNodes);

    // Notify changes
    if (UBlueprint* BP = Cast<UBlueprint>(Graph->GetOuter()))
    {
         FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(BP);
    }
    else
    {
        Graph->NotifyGraphChanged();
    }
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FBlueprintAIBridgeModule, BlueprintAIBridge)
