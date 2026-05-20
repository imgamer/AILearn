#include "BlueprintNodeBridge.h"
#include "BlueprintNodeBridgeCommands.h"
#include "BlueprintNodeBridgeStyle.h"
#include "BlueprintNodeBridgeTests.h"
#include "NodeGraphFormatter.h"
#include "TextGraphParser.h"

#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "EdGraph/EdGraphSchema.h"
#include "EdGraphUtilities.h"
#include "K2Node_CallFunction.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "K2Node_IfThenElse.h"
#include "K2Node_Knot.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "ToolMenus.h"
#include "ToolMenuContext.h"
#include "ToolMenuEntry.h"
#include "ToolMenuSection.h"
#include "Framework/Application/SlateApplication.h"
#include "Framework/Commands/UICommandList.h"
#include "Framework/Commands/UICommandInfo.h"
#include "HAL/PlatformApplicationMisc.h"
#include "HAL/PlatformProcess.h"
#include "HAL/PlatformFileManager.h"
#include "ScopedTransaction.h"
#include "UObject/UObjectIterator.h"
#include "Modules/ModuleManager.h"
#include "Subsystems/AssetEditorSubsystem.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonReader.h"
#include "Misc/FileHelper.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "Misc/MessageDialog.h"
#include "Editor.h"
#include "Editor/EditorEngine.h"
#include "Selection.h"
#include "BlueprintEditorModule.h"

#define LOCTEXT_NAMESPACE "FBlueprintNodeBridgeModule"

void FBlueprintNodeBridgeModule::StartupModule()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: StartupModule called"));

	FBlueprintNodeBridgeStyle::Initialize();
	FBlueprintNodeBridgeCommands::Register();

	PluginCommands = MakeShareable(new FUICommandList());

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().PasteShortCode,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::PasteShortCodeClicked),
		FCanExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::IsBlueprintEditorFocused)
	);

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().CopyAsShortCode,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::CopyAsShortCodeClicked),
		FCanExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::IsBlueprintEditorFocused)
	);

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().FormatNodes,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::FormatNodesClicked),
		FCanExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::IsBlueprintEditorFocused)
	);

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().CopyAIRules,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::CopyAIRulesClicked)
	);

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().ManageTemplates,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::ManageTemplatesClicked)
	);

	PluginCommands->MapAction(
		FBlueprintNodeBridgeCommands::Get().EditAIRules,
		FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::EditAIRulesClicked)
	);

	RegisterMenus();

	// Load cache on startup
	LoadCache();

	// Run unit tests
	UE_LOG(LogTemp, Display, TEXT("=== Running BlueprintNodeBridge Unit Tests ==="));
	RunAllTests();

	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: Module started successfully"));
}

void FBlueprintNodeBridgeModule::ShutdownModule()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: ShutdownModule called"));

	UnregisterMenus();
	SaveCache();
	FBlueprintNodeBridgeCommands::Unregister();
	FBlueprintNodeBridgeStyle::Shutdown();

	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: Module shutdown complete"));
}

void FBlueprintNodeBridgeModule::RegisterMenus()
{
	FToolMenuOwnerScoped OwnerScoped(this);

	// Extend multiple editor toolbars
	TArray<FName> EditorToolbars = {
		TEXT("AssetEditor.BlueprintEditor.ToolBar"),
		TEXT("AssetEditor.WidgetBlueprintEditor.ToolBar"),
		TEXT("AssetEditor.AnimationBlueprintEditor.ToolBar"),
		TEXT("AssetEditor.MaterialEditor.ToolBar"),
		TEXT("AssetEditor.NiagaraScriptEditor.ToolBar")
	};

	for (const FName& ToolbarName : EditorToolbars)
	{
		UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);
		if (!ToolbarMenu) continue;

		FToolMenuSection& Section = ToolbarMenu->FindOrAddSection(TEXT("Settings"));

		Section.AddEntry(FToolMenuEntry::InitComboButton(
			TEXT("BlueprintNodeBridgeActions"),
			FUIAction(),
			FOnGetContent::CreateLambda([this, ToolbarName]()
			{
				FMenuBuilder MenuBuilder(true, PluginCommands);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("PasteShortCode_Label", "粘贴短代码"),
					LOCTEXT("PasteShortCode_Tip", "从短代码粘贴节点"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::PasteShortCodeClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("CopyShortCode_Label", "复制为短代码"),
					LOCTEXT("CopyShortCode_Tip", "将选中节点复制为短代码"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::CopyAsShortCodeClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("FormatNodes_Label", "整理节点"),
					LOCTEXT("FormatNodes_Tip", "自动排列选中节点"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::FormatNodesClicked))
				);

				MenuBuilder.AddMenuSeparator();

				MenuBuilder.AddMenuEntry(
					LOCTEXT("CopyAIRules_Label", "复制 AI 规则"),
					LOCTEXT("CopyAIRules_Tip", "复制 AI 生成规则到剪贴板"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::CopyAIRulesClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("ManageTemplates_Label", "管理模板"),
					LOCTEXT("ManageTemplates_Tip", "打开模板文件夹"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::ManageTemplatesClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("EditAIRules_Label", "编辑 AI 规则"),
					LOCTEXT("EditAIRules_Tip", "打开 AI 规则 JSON 文件"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FBlueprintNodeBridgeModule::EditAIRulesClicked))
				);

				return MenuBuilder.MakeWidget();
			}),
			LOCTEXT("AI_Bridge", "AI Bridge"),
			LOCTEXT("AI_Bridge_Tip", "AI Bridge - Node Tools"),
			FSlateIcon()
		));
	}
}

void FBlueprintNodeBridgeModule::UnregisterMenus()
{
	UToolMenus* ToolMenus = UToolMenus::Get();
	if (ToolMenus)
	{
		ToolMenus->RemoveMenu(TEXT("AssetEditor.BlueprintEditor.ToolBar"));
	}
}

bool FBlueprintNodeBridgeModule::IsBlueprintEditorFocused() const
{
	if (!FSlateApplication::IsInitialized()) return false;

	TSharedPtr<SWindow> ActiveWindow = FSlateApplication::Get().GetActiveTopLevelWindow();
	if (!ActiveWindow.IsValid()) return false;

	FString WindowTitle = ActiveWindow->GetTitle().ToString();
	return WindowTitle.Contains(TEXT("Blueprint")) || WindowTitle.Contains(TEXT("Kismet"));
}

// ============================================================================
// Helper Methods
// ============================================================================

TSharedPtr<SGraphEditor> FBlueprintNodeBridgeModule::GetFocusedGraphEditor() const
{
	TSharedPtr<SWidget> FocusedWidget = FSlateApplication::Get().GetKeyboardFocusedWidget();

	while (FocusedWidget.IsValid())
	{
		if (FocusedWidget->GetTypeAsString() == TEXT("SGraphEditor"))
		{
			return StaticCastSharedPtr<SGraphEditor>(FocusedWidget);
		}
		FocusedWidget = FocusedWidget->GetParentWidget();
	}

	return nullptr;
}

TArray<UEdGraphNode*> FBlueprintNodeBridgeModule::GetSelectedNodes() const
{
	TArray<UEdGraphNode*> SelectedNodes;

	// Strategy 1: Get from focused GraphEditor
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

	// Strategy 2: Fallback to Global Selection
	if (SelectedNodes.Num() == 0 && GEditor)
	{
		USelection* Selection = GEditor->GetSelectedObjects();
		if (Selection)
		{
			for (int32 Idx = 0; Idx < Selection->Num(); ++Idx)
			{
				if (UObject* Obj = Selection->GetSelectedObject(Idx))
				{
					if (UEdGraphNode* Node = Cast<UEdGraphNode>(Obj))
					{
						SelectedNodes.Add(Node);
					}
				}
			}
		}
	}

	return SelectedNodes;
}

UBlueprint* FBlueprintNodeBridgeModule::GetCurrentBlueprint() const
{
	if (!GEditor) return nullptr;

	UEdGraph* Graph = GetCurrentGraph();
	if (Graph)
	{
		UObject* GraphOuter = Graph->GetOuter();
		while (GraphOuter)
		{
			if (UBlueprint* BP = Cast<UBlueprint>(GraphOuter))
			{
				return BP;
			}
			GraphOuter = GraphOuter->GetOuter();
		}
	}

	return nullptr;
}

UEdGraph* FBlueprintNodeBridgeModule::GetCurrentGraph() const
{
	TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
	if (GraphEditor.IsValid())
	{
		return GraphEditor->GetCurrentGraph();
	}
	return nullptr;
}

// ============================================================================
// Menu Action Handlers
// ============================================================================

void FBlueprintNodeBridgeModule::PasteShortCodeClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: PasteShortCodeClicked"));

	FString ClipboardText;
	FPlatformApplicationMisc::ClipboardPaste(ClipboardText);

	if (ClipboardText.IsEmpty())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("ClipboardEmpty", "Clipboard is empty"));
		return;
	}

	if (!FTextGraphParser::IsValidShortCode(ClipboardText))
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("InvalidShortCode", "Clipboard does not contain valid short code"));
		return;
	}

	UEdGraph* TargetGraph = GetCurrentGraph();
	if (!TargetGraph)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraph", "No active Graph found. Please focus a Graph editor."));
		return;
	}

	// Find Blueprint from graph
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

	if (!CurrentBlueprint)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoBlueprint", "Could not find Blueprint for current graph"));
		return;
	}

	// Calculate paste location (center of viewport)
	FVector2D PasteLocation = FVector2D::ZeroVector;
	TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
	if (GraphEditor.IsValid())
	{
		FGeometry Geometry = GraphEditor->GetCachedGeometry();
		FVector2f ViewLocation = FVector2f::ZeroVector;
		float Zoom = 1.0f;
		GraphEditor->GetViewLocation(ViewLocation, Zoom);

		FVector2D Size = Geometry.GetLocalSize();
		if (Size.X > 0 && Size.Y > 0 && Zoom > 0)
		{
			PasteLocation = FVector2D(ViewLocation) + (Size / Zoom) * 0.5f;
		}
	}

	bool bSuccess = FTextGraphParser::ParseAndPaste(ClipboardText, CurrentBlueprint, NodeTemplateCache, PasteLocation, TargetGraph);

	FNotificationInfo Info(bSuccess ?
		LOCTEXT("PasteSuccess", "Nodes pasted successfully!") :
		LOCTEXT("PasteFailed", "Failed to parse Short Code"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);

	// Save updated cache
	SaveCache();
}

void FBlueprintNodeBridgeModule::CopyAsShortCodeClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: CopyAsShortCodeClicked"));

	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();

	if (SelectedNodes.Num() == 0)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoSelection", "No nodes selected"));
		return;
	}

	FString ShortCode = FTextGraphParser::GenerateShortCode(SelectedNodes, NodeTemplateCache);

	// Save updated cache
	SaveCache();

	FPlatformApplicationMisc::ClipboardCopy(*ShortCode);

	FNotificationInfo Info(LOCTEXT("CopySuccess", "Nodes copied as Short Code (Templates cached)"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);

	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: Copied short code to clipboard (%d chars)"), ShortCode.Len());
}

void FBlueprintNodeBridgeModule::FormatNodesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: FormatNodesClicked"));

	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();

	if (SelectedNodes.Num() < 2)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("SelectMore", "Please select at least 2 nodes to format."));
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

	FNotificationInfo Info(LOCTEXT("FormatSuccess", "Nodes formatted successfully!"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

void FBlueprintNodeBridgeModule::CopyAIRulesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: CopyAIRulesClicked"));

	FString Rules = GetAIRulesContent();
	FPlatformApplicationMisc::ClipboardCopy(*Rules);

	FNotificationInfo Info(LOCTEXT("RulesCopied", "AI Rules copied to clipboard"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

void FBlueprintNodeBridgeModule::ManageTemplatesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: ManageTemplatesClicked"));
	OpenCacheFolder();
}

void FBlueprintNodeBridgeModule::EditAIRulesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("BlueprintNodeBridge: EditAIRulesClicked"));

	FString Path = FPaths::ProjectPluginsDir() / TEXT("BlueprintNodeBridge/Resources/AIRules.json");

	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
	if (!PlatformFile.FileExists(*Path))
	{
		// Create default file
		FString Directory = FPaths::GetPath(Path);
		if (!PlatformFile.DirectoryExists(*Directory))
		{
			PlatformFile.CreateDirectoryTree(*Directory);
		}

		FString DefaultRules = GetAIRulesContent();
		FFileHelper::SaveStringToFile(DefaultRules, *Path);
	}

	FPlatformProcess::LaunchFileInDefaultExternalApplication(*Path);
}

// ============================================================================
// Cache Management
// ============================================================================

void FBlueprintNodeBridgeModule::SaveCache()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintNodeBridge") / TEXT("NodeTemplates.json");

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

void FBlueprintNodeBridgeModule::LoadCache()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintNodeBridge") / TEXT("NodeTemplates.json");

	FString Content;
	if (FFileHelper::LoadFileToString(Content, *Path))
	{
		TSharedPtr<FJsonObject> NewRoot;
		TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Content);

		if (FJsonSerializer::Deserialize(Reader, NewRoot) && NewRoot.IsValid())
		{
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

void FBlueprintNodeBridgeModule::OpenCacheFolder()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("BlueprintNodeBridge");

	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
	if (!PlatformFile.DirectoryExists(*Path))
	{
		PlatformFile.CreateDirectoryTree(*Path);
	}

	FPlatformProcess::ExploreFolder(*Path);
}

FString FBlueprintNodeBridgeModule::GetAIRulesContent() const
{
	FString JsonPath = FPaths::ProjectPluginsDir() / TEXT("BlueprintNodeBridge/Resources/AIRules.json");
	FString JsonContent;

	if (FFileHelper::LoadFileToString(JsonContent, *JsonPath))
	{
		return JsonContent;
	}

	// Embedded fallback rules
	return TEXT(R"(
# Blueprint Short Code Generation Rules

## 1. Core Rules

1. **Full Output Mode**
   - Always output the complete Blueprint code
   - Never use ellipsis
   - Never output only modified nodes

2. **Faithful Reproduction**
   - Node names and IDs must match exactly
   - Each pin definition must end with semicolon
   - Output short code must be in ```text code block

3. **Connection Completeness**
   - All logical connections must be explicitly written
   - Pure functions must use data flow connections
   - Branch nodes must have both input and output connections

## 2. Node Definition Format

Format: NodeName_UniqueID (InputPins;) : (OutputPins;)

Example:
```
Branch_1 (inExec; Condition\(true\);) : (outExec True; outExec False;)
PrintString_2 (inExec; InString\("Hello"\);) : (outExec;)
```

## 3. Special Characters

- Escape parentheses: \(
- Escape close paren: \)
- Escape semicolon: \;
- Escape backslash: \\
- Escape newline: \n
)");
}

FString FBlueprintNodeBridgeModule::GenerateShortCodeFromSelection() const
{
	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();
	if (SelectedNodes.Num() == 0) return FString();

	TMap<FString, FString> Cache;
	return FTextGraphParser::GenerateShortCode(SelectedNodes, Cache);
}

bool FBlueprintNodeBridgeModule::PasteNodesFromText(const FString& ShortCodeText) const
{
	if (!FTextGraphParser::IsValidShortCode(ShortCodeText)) return false;

	UBlueprint* Blueprint = GetCurrentBlueprint();
	UEdGraph* Graph = GetCurrentGraph();
	if (!Blueprint || !Graph) return false;

	return FTextGraphParser::ParseAndPaste(ShortCodeText, Blueprint, NodeTemplateCache, FVector2D::ZeroVector, Graph);
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FBlueprintNodeBridgeModule, BlueprintNodeBridge)
