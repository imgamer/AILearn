#include "UEBlueprintParser57Module.h"
#include "UEBlueprintParser57Commands.h"
#include "UEBlueprintParser57Style.h"
#include "TextGraphParser.h"
#include "NodeGraphFormatter.h"

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"
#include "HAL/IConsoleManager.h"

#include "ToolMenus.h"
#include "ToolMenuEntry.h"
#include "ToolMenuSection.h"
#include "EdGraphUtilities.h"
#include "K2Node_CallFunction.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "K2Node_IfThenElse.h"
#include "K2Node_Knot.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "ScopedTransaction.h"
#include "Framework/Commands/GenericCommands.h"
#include "Framework/Application/SlateApplication.h"
#include "HAL/PlatformApplicationMisc.h"
#include "BlueprintEditorModule.h"
#include "GraphEditor.h"
#include "SGraphEditor.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "EdGraph/EdGraphSchema.h"
#include "SBlueprintEditorToolbar.h"

#define LOCTEXT_NAMESPACE "FUEBlueprintParser57Module"

void FUEBlueprintParser57Module::StartupModule()
{
	FUEBlueprintParser57Style::Initialize();
	FUEBlueprintParser57Commands::Register();
	RegisterMenus();
}

void FUEBlueprintParser57Module::ShutdownModule()
{
	UnregisterMenus();
	FUEBlueprintParser57Commands::Unregister();
	FUEBlueprintParser57Style::Shutdown();
}

void FUEBlueprintParser57Module::RegisterMenus()
{
	UToolMenus::RegisterStartupCallback(FSimpleMulticastDelegate::FDelegate::CreateRaw(this, &FUEBlueprintParser57Module::OnGraphEditorMenuCreate));
}

void FUEBlueprintParser57Module::UnregisterMenus()
{
	UToolMenus::UnRegisterStartupCallback(this);
}

void FUEBlueprintParser57Module::OnGraphEditorMenuCreate(FMenuBuilder& MenuBuilder, TWeakPtr<FUICommandList> CommandList, TArray<UEdGraphNode*> SelectedNodes)
{
	MenuBuilder.BeginSection("BlueprintAI", LOCTEXT("BlueprintAISection", "Blueprint AI"));
	{
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().CopyAsShortCode);
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().PasteShortCode);
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().ArrangeNodes);
		MenuBuilder.AddMenuSeparator();
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().CopyAIRules);
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().ManageTemplates);
		MenuBuilder.AddMenuEntry(FUEBlueprintParser57Commands::Get().EditAIRules);
	}
	MenuBuilder.EndSection();
}

void FUEBlueprintParser57Module::CopyAsShortCode()
{
	FBlueprintEditorModule* BlueprintEditorModule = &FModuleManager::LoadModuleChecked<FBlueprintEditorModule>(TEXT("Kismet"));
	TSharedPtr<IBlueprintEditor> BlueprintEditor = BlueprintEditorModule->GetFirstEditorInstance();

	if (!BlueprintEditor.IsValid())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoBlueprintOpen", "No Blueprint editor is open."));
		return;
	}

	UEdGraph* Graph = BlueprintEditor->GetFocusedGraph();
	if (!Graph)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraphSelected", "No graph is selected."));
		return;
	}

	const FScopedTransaction Transaction(LOCTEXT("CopyAsShortCode", "Copy as Short Code"));

	TArray<UEdGraphNode*> SelectedNodes;
	Graph->GetNodesOfClass(SelectedNodes);
	SelectedNodes = SelectedNodes.FilterByPredicate([](UEdGraphNode* Node) { return Node->IsSelected(); });

	if (SelectedNodes.Num() == 0)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoNodesSelected", "No nodes selected. Please select nodes to copy."));
		return;
	}

	TMap<FString, FString> NodeCache;
	FString ShortCode = FTextGraphParser::GenerateShortCode(SelectedNodes, NodeCache);

	FPlatformApplicationMisc::ClipboardCopy(*ShortCode);

	UE_LOG(LogTemp, Log, TEXT("Short Code copied to clipboard:\n%s"), *ShortCode);
}

void FUEBlueprintParser57Module::PasteShortCode()
{
	FBlueprintEditorModule* BlueprintEditorModule = &FModuleManager::LoadModuleChecked<FBlueprintEditorModule>(TEXT("Kismet"));
	TSharedPtr<IBlueprintEditor> BlueprintEditor = BlueprintEditorModule->GetFirstEditorInstance();

	if (!BlueprintEditor.IsValid())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoBlueprintOpen", "No Blueprint editor is open."));
		return;
	}

	UEdGraph* Graph = BlueprintEditor->GetFocusedGraph();
	UBlueprint* Blueprint = BlueprintEditor->GetBlueprintObj();

	if (!Graph || !Blueprint)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraphSelected", "No graph or blueprint selected."));
		return;
	}

	FString ClipboardContent;
	FPlatformApplicationMisc::ClipboardPaste(ClipboardContent);

	if (ClipboardContent.IsEmpty())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("EmptyClipboard", "Clipboard is empty."));
		return;
	}

	const FScopedTransaction Transaction(LOCTEXT("PasteShortCode", "Paste Short Code"));

	TMap<FString, FString> NodeCache;
	bool bSuccess = FTextGraphParser::ParseAndPaste(ClipboardContent, Blueprint, NodeCache, FVector2D::ZeroVector, Graph);

	if (bSuccess)
	{
		UE_LOG(LogTemp, Log, TEXT("Short code pasted successfully"));
	}
	else
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("PasteFailed", "Failed to paste short code. Make sure the clipboard contains valid short code format."));
	}
}

void FUEBlueprintParser57Module::ArrangeNodes()
{
	FBlueprintEditorModule* BlueprintEditorModule = &FModuleManager::LoadModuleChecked<FBlueprintEditorModule>(TEXT("Kismet"));
	TSharedPtr<IBlueprintEditor> BlueprintEditor = BlueprintEditorModule->GetFirstEditorInstance();

	if (!BlueprintEditor.IsValid())
	{
		return;
	}

	UEdGraph* Graph = BlueprintEditor->GetFocusedGraph();
	if (!Graph)
	{
		return;
	}

	const FScopedTransaction Transaction(LOCTEXT("ArrangeNodes", "Arrange Nodes"));

	TArray<UEdGraphNode*> Nodes;
	Graph->GetNodesOfClass(Nodes);

	FNodeGraphFormatter::AutoArrangeNodes(Graph);

	Graph->NotifyGraphChanged();
	FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(BlueprintEditor->GetBlueprintObj());
}

void FUEBlueprintParser57Module::CopyAIRules()
{
	FString AIRulesContent = FNodeGraphFormatter::ExportNodesToJson(TArray<UEdGraphNode*>());
	FPlatformApplicationMisc::ClipboardCopy(*AIRulesContent);

	FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("AIRulesCopied", "AI Rules copied to clipboard."));
}

void FUEBlueprintParser57Module::ManageTemplates()
{
	FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("ManageTemplates", "Template management window would open here.\nThis feature allows you to manage saved node templates for quick insertion."));
}

void FUEBlueprintParser57Module::EditAIRules()
{
	FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("EditAIRules", "AI Rules editor window would open here.\nThis feature allows you to customize the AI parsing rules and behavior."));
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FUEBlueprintParser57Module, UEBlueprintParser57)
