#include "MaterialNodeBridgeCommands.h"
#include "MaterialNodeBridgeStyle.h"
#include "Framework/Commands/Commands.h"
#include "Internationalization/Internationalization.h"
#include "Styling/SlateStyleRegistry.h"

#define LOCTEXT_NAMESPACE "FMaterialNodeBridgeCommands"

void FMaterialNodeBridgeCommands::RegisterCommands()
{
	UI_COMMAND(PasteShortCode, "Paste Short Code", "Paste nodes from short code", EUserInterfaceActionType::Button, FInputGesture());
	UI_COMMAND(CopyAsShortCode, "Copy As Short Code", "Copy selected nodes as short code", EUserInterfaceActionType::Button, FInputGesture());
	UI_COMMAND(FormatNodes, "Format Nodes", "Auto-layout selected nodes", EUserInterfaceActionType::Button, FInputGesture());
	UI_COMMAND(CopyAIRules, "Copy AI Rules", "Copy AI generation rules to clipboard", EUserInterfaceActionType::Button, FInputGesture());
	UI_COMMAND(ManageTemplates, "Manage Templates", "Open template folder", EUserInterfaceActionType::Button, FInputGesture());
	UI_COMMAND(EditAIRules, "Edit AI Rules", "Edit AI rules JSON file", EUserInterfaceActionType::Button, FInputGesture());
}

#undef LOCTEXT_NAMESPACE
