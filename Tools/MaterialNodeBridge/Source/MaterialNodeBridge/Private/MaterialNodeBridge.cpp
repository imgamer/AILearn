#include "MaterialNodeBridge.h"
#include "MaterialNodeBridgeCommands.h"
#include "MaterialNodeBridgeStyle.h"
#include "MaterialTextGraphParser.h"
#include "MaterialNodeRegistry.h"
#include "MaterialExpressionFactory.h"
#include "MaterialGraphFormatter.h"

#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "Materials/Material.h"
#include "MaterialGraph/MaterialGraph.h"
#include "MaterialGraph/MaterialGraphNode.h"
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
#include "Modules/ModuleManager.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonReader.h"
#include "Misc/FileHelper.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "Misc/MessageDialog.h"
#include "Editor.h"
#include "Selection.h"

#define LOCTEXT_NAMESPACE "FMaterialNodeBridgeModule"

void FMaterialNodeBridgeModule::StartupModule()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: StartupModule called"));

	FMaterialNodeBridgeStyle::Initialize();
	FMaterialNodeBridgeCommands::Register();

	FMaterialNodeRegistry::InitializeRegistry();

	PluginCommands = MakeShareable(new FUICommandList());

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().PasteShortCode,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::PasteShortCodeClicked),
		FCanExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::IsMaterialEditorFocused)
	);

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().CopyAsShortCode,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::CopyAsShortCodeClicked),
		FCanExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::IsMaterialEditorFocused)
	);

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().FormatNodes,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::FormatNodesClicked),
		FCanExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::IsMaterialEditorFocused)
	);

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().CopyAIRules,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::CopyAIRulesClicked)
	);

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().ManageTemplates,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::ManageTemplatesClicked)
	);

	PluginCommands->MapAction(
		FMaterialNodeBridgeCommands::Get().EditAIRules,
		FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::EditAIRulesClicked)
	);

	RegisterMenus();
	LoadCache();

	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: Module started successfully"));
}

void FMaterialNodeBridgeModule::ShutdownModule()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: ShutdownModule called"));

	UnregisterMenus();
	SaveCache();
	FMaterialNodeBridgeCommands::Unregister();
	FMaterialNodeBridgeStyle::Shutdown();

	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: Module shutdown complete"));
}

void FMaterialNodeBridgeModule::RegisterMenus()
{
	FToolMenuOwnerScoped OwnerScoped(this);

	TArray<FName> EditorToolbars = {
		TEXT("AssetEditor.MaterialEditor.ToolBar")
	};

	for (const FName& ToolbarName : EditorToolbars)
	{
		UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);
		if (!ToolbarMenu) continue;

		FToolMenuSection& Section = ToolbarMenu->FindOrAddSection(TEXT("Settings"));

		Section.AddEntry(FToolMenuEntry::InitComboButton(
			TEXT("MaterialNodeBridgeActions"),
			FUIAction(),
			FOnGetContent::CreateLambda([this, ToolbarName]()
			{
				FMenuBuilder MenuBuilder(true, PluginCommands);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("PasteShortCode_Label", "粘贴短代码"),
					LOCTEXT("PasteShortCode_Tip", "从短代码粘贴材质节点"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::PasteShortCodeClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("CopyShortCode_Label", "复制为短代码"),
					LOCTEXT("CopyShortCode_Tip", "将选中材质节点复制为短代码"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::CopyAsShortCodeClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("FormatNodes_Label", "整理节点"),
					LOCTEXT("FormatNodes_Tip", "自动排列选中材质节点"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::FormatNodesClicked))
				);

				MenuBuilder.AddMenuSeparator();

				MenuBuilder.AddMenuEntry(
					LOCTEXT("CopyAIRules_Label", "复制 AI 规则"),
					LOCTEXT("CopyAIRules_Tip", "复制 AI 生成规则到剪贴板"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::CopyAIRulesClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("ManageTemplates_Label", "管理模板"),
					LOCTEXT("ManageTemplates_Tip", "打开模板文件夹"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::ManageTemplatesClicked))
				);

				MenuBuilder.AddMenuEntry(
					LOCTEXT("EditAIRules_Label", "编辑 AI 规则"),
					LOCTEXT("EditAIRules_Tip", "打开 AI 规则 JSON 文件"),
					FSlateIcon(),
					FUIAction(FExecuteAction::CreateRaw(this, &FMaterialNodeBridgeModule::EditAIRulesClicked))
				);

				return MenuBuilder.MakeWidget();
			}),
			LOCTEXT("Material_Bridge", "Material Bridge"),
			LOCTEXT("Material_Bridge_Tip", "Material Bridge - Node Tools"),
			FSlateIcon()
		));
	}
}

void FMaterialNodeBridgeModule::UnregisterMenus()
{
	UToolMenus* ToolMenus = UToolMenus::Get();
	if (ToolMenus)
	{
		ToolMenus->RemoveMenu(TEXT("AssetEditor.MaterialEditor.ToolBar"));
	}
}

bool FMaterialNodeBridgeModule::IsMaterialEditorFocused() const
{
	if (!FSlateApplication::IsInitialized()) return false;

	TSharedPtr<SWindow> ActiveWindow = FSlateApplication::Get().GetActiveTopLevelWindow();
	if (!ActiveWindow.IsValid()) return false;

	FString WindowTitle = ActiveWindow->GetTitle().ToString();
	return WindowTitle.Contains(TEXT("Material")) || WindowTitle.Contains(TEXT("材质"));
}

TSharedPtr<SGraphEditor> FMaterialNodeBridgeModule::GetFocusedGraphEditor() const
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

TArray<UEdGraphNode*> FMaterialNodeBridgeModule::GetSelectedNodes() const
{
	TArray<UEdGraphNode*> SelectedNodes;

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

UMaterial* FMaterialNodeBridgeModule::GetCurrentMaterial() const
{
	UMaterialGraph* Graph = GetCurrentGraph();
	if (Graph)
	{
		return Cast<UMaterial>(Graph->GetOuter());
	}
	return nullptr;
}

UMaterialGraph* FMaterialNodeBridgeModule::GetCurrentGraph() const
{
	TSharedPtr<SGraphEditor> GraphEditor = GetFocusedGraphEditor();
	if (GraphEditor.IsValid())
	{
		return Cast<UMaterialGraph>(GraphEditor->GetCurrentGraph());
	}
	return nullptr;
}

void FMaterialNodeBridgeModule::PasteShortCodeClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: PasteShortCodeClicked"));

	FString ClipboardText;
	FPlatformApplicationMisc::ClipboardPaste(ClipboardText);

	if (ClipboardText.IsEmpty())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("ClipboardEmpty", "Clipboard is empty"));
		return;
	}

	if (!FMaterialTextGraphParser::IsValidShortCode(ClipboardText))
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("InvalidShortCode", "Clipboard does not contain valid short code"));
		return;
	}

	UMaterialGraph* TargetGraph = GetCurrentGraph();
	if (!TargetGraph)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraph", "No active Material Graph found. Please focus a Material editor."));
		return;
	}

	UMaterial* Material = GetCurrentMaterial();
	if (!Material)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoMaterial", "Could not find Material for current graph"));
		return;
	}

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

	bool bSuccess = FMaterialTextGraphParser::ParseAndPaste(ClipboardText, Material, NodeTemplateCache, PasteLocation, TargetGraph);

	FNotificationInfo Info(bSuccess ?
		LOCTEXT("PasteSuccess", "Material nodes pasted successfully!") :
		LOCTEXT("PasteFailed", "Failed to parse Short Code"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);

	SaveCache();
}

void FMaterialNodeBridgeModule::CopyAsShortCodeClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: CopyAsShortCodeClicked"));

	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();

	if (SelectedNodes.Num() == 0)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoSelection", "No nodes selected"));
		return;
	}

	FString ShortCode = FMaterialTextGraphParser::GenerateShortCode(SelectedNodes, NodeTemplateCache);

	SaveCache();

	FPlatformApplicationMisc::ClipboardCopy(*ShortCode);

	FNotificationInfo Info(LOCTEXT("CopySuccess", "Material nodes copied as Short Code (Templates cached)"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);

	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: Copied short code to clipboard (%d chars)"), ShortCode.Len());
}

void FMaterialNodeBridgeModule::FormatNodesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: FormatNodesClicked"));

	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();

	if (SelectedNodes.Num() < 2)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("SelectMore", "Please select at least 2 nodes to format."));
		return;
	}

	UMaterialGraph* Graph = GetCurrentGraph();
	if (!Graph)
	{
		return;
	}

	FMaterialGraphFormatter::FormatNodes(Graph, SelectedNodes);

	FNotificationInfo Info(LOCTEXT("FormatSuccess", "Nodes formatted successfully!"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

void FMaterialNodeBridgeModule::CopyAIRulesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: CopyAIRulesClicked"));

	FString Rules = GetAIRulesContent();
	FPlatformApplicationMisc::ClipboardCopy(*Rules);

	FNotificationInfo Info(LOCTEXT("RulesCopied", "AI Rules copied to clipboard"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);
}

void FMaterialNodeBridgeModule::ManageTemplatesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: ManageTemplatesClicked"));
	OpenCacheFolder();
}

void FMaterialNodeBridgeModule::EditAIRulesClicked()
{
	UE_LOG(LogTemp, Display, TEXT("MaterialNodeBridge: EditAIRulesClicked"));

	FString Path = FPaths::ProjectPluginsDir() / TEXT("MaterialNodeBridge/Resources/AIRules.json");

	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
	if (!PlatformFile.FileExists(*Path))
	{
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

void FMaterialNodeBridgeModule::SaveCache()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("MaterialNodeBridge") / TEXT("NodeTemplates.json");

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

void FMaterialNodeBridgeModule::LoadCache()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("MaterialNodeBridge") / TEXT("NodeTemplates.json");

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

void FMaterialNodeBridgeModule::OpenCacheFolder()
{
	FString Path = FPaths::ProjectSavedDir() / TEXT("MaterialNodeBridge");

	IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();
	if (!PlatformFile.DirectoryExists(*Path))
	{
		PlatformFile.CreateDirectoryTree(*Path);
	}

	FPlatformProcess::ExploreFolder(*Path);
}

FString FMaterialNodeBridgeModule::GetAIRulesContent() const
{
	FString JsonPath = FPaths::ProjectPluginsDir() / TEXT("MaterialNodeBridge/Resources/AIRules.json");
	FString JsonContent;

	if (FFileHelper::LoadFileToString(JsonContent, *JsonPath))
	{
		return JsonContent;
	}

	return TEXT(R"({
	"version": "1.0",
	"name": "Material Node Short Code Rules",
	"description": "Rules for generating and parsing material node short code",
	"format": {
		"node_definition": "NodeName_ID (InputPins;) : (OutputPins;)",
		"link_definition": "NodeID (OutputPin) -> NodeID (InputPin)"
	},
	"rules": {
		"pin_values": "Use \\(value\\) for pins with values, separate with semicolon",
		"escaping": {
			"(": "\\(",
			")": "\\)",
			";": "\\;"
		},
		"connections": "Use -> to indicate connection direction"
	},
	"supported_nodes": [
		"Constant",
		"Constant2Vector",
		"Constant3Vector",
		"Constant4Vector",
		"Add",
		"Subtract",
		"Multiply",
		"Divide",
		"Abs",
		"Sine",
		"Cosine",
		"Tangent",
		"Floor",
		"Ceiling",
		"Round",
		"Max",
		"Min",
		"Clamp",
		"OneMinus",
		"ComponentMask",
		"Append",
		"TextureSample",
		"TextureObject",
		"TextureCoordinate",
		"ScalarParameter",
		"VectorParameter",
		"ColorParameter",
		"TextureSampleParameter",
		"Fresnel",
		"BumpOffset",
		"Panner",
		"Rotator",
		"Time",
		"Lerp"
	]
})");
}

FString FMaterialNodeBridgeModule::GenerateShortCodeFromSelection() const
{
	TArray<UEdGraphNode*> SelectedNodes = GetSelectedNodes();
	if (SelectedNodes.Num() == 0) return FString();

	TMap<FString, FString> Cache;
	return FMaterialTextGraphParser::GenerateShortCode(SelectedNodes, Cache);
}

bool FMaterialNodeBridgeModule::PasteNodesFromText(const FString& ShortCodeText) const
{
	if (!FMaterialTextGraphParser::IsValidShortCode(ShortCodeText)) return false;

	UMaterial* Material = GetCurrentMaterial();
	UMaterialGraph* Graph = GetCurrentGraph();
	if (!Material || !Graph) return false;

	return FMaterialTextGraphParser::ParseAndPaste(ShortCodeText, Material, NodeTemplateCache, FVector2D::ZeroVector, Graph);
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FMaterialNodeBridgeModule, MaterialNodeBridge)
