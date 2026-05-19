#include "BlueprintNodeBridgeCommands.h"
#include "BlueprintNodeBridge.h"

#define LOCTEXT_NAMESPACE "FBlueprintNodeBridgeCommands"

void FBlueprintNodeBridgeCommands::RegisterCommands()
{
	UI_COMMAND(PasteShortCode, "Paste Short Code", "Parse short code from clipboard and paste nodes into Blueprint", EUserInterfaceActionType::Button, FInputChord(EKeys::V, true, false, true, false));
	UI_COMMAND(CopyAsShortCode, "Copy as Short Code", "Copy selected Blueprint nodes as AI-friendly short code to clipboard", EUserInterfaceActionType::Button, FInputChord(EKeys::C, true, false, true, false));
	UI_COMMAND(FormatNodes, "Format Nodes", "Automatically format selected Blueprint nodes", EUserInterfaceActionType::Button, FInputChord(EKeys::L, true, false, true, false));
	UI_COMMAND(CopyAIRules, "Copy AI Rules", "Copy AI rules to clipboard", EUserInterfaceActionType::Button, FInputChord());
	UI_COMMAND(ManageTemplates, "Manage Templates", "Manage saved templates", EUserInterfaceActionType::Button, FInputChord());
	UI_COMMAND(EditAIRules, "Edit AI Rules", "Edit AI rules configuration", EUserInterfaceActionType::Button, FInputChord());
}

#undef LOCTEXT_NAMESPACE
