#include "UEBlueprintParser57Commands.h"
#include "ToolMenus.h"
#include "BlueprintEditorModule.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"

#define LOCTEXT_NAMESPACE "FUEBlueprintParser57Commands"

void FUEBlueprintParser57Commands::RegisterCommands()
{
	UI_COMMAND(CopyAsShortCode, "Copy as Short Code", "Copy selected nodes as AI-friendly short code text", EUserInterfaceActionType::Button, FInputChord(EKeys::C, true, true, false, false));
	UI_COMMAND(PasteShortCode, "Paste Short Code", "Paste and reconstruct nodes from short code text", EUserInterfaceActionType::Button, FInputChord(EKeys::V, true, true, false, false));
	UI_COMMAND(ArrangeNodes, "Arrange Nodes", "Auto-arrange selected nodes for better readability", EUserInterfaceActionType::Button, FInputChord(EKeys::L, true, true, false, false));
	UI_COMMAND(CopyAIRules, "Copy AI Rules", "Copy current AI parsing rules to clipboard", EUserInterfaceActionType::Button, FInputChord());
	UI_COMMAND(ManageTemplates, "Manage Templates", "Open template management window", EUserInterfaceActionType::Button, FInputChord());
	UI_COMMAND(EditAIRules, "Edit AI Rules", "Open AI rules editor", EUserInterfaceActionType::Button, FInputChord());
}

#undef LOCTEXT_NAMESPACE
