// Copyright Epic Games, Inc. All Rights Reserved.

#include "BlueprintAIBridgeCommands.h"

#define LOCTEXT_NAMESPACE "FBlueprintAIBridgeModule"

void FBlueprintAIBridgeCommands::RegisterCommands()
{
    UI_COMMAND(PasteShortCode, "Paste Short Code", "Paste Blueprint nodes from Short Code", EUserInterfaceActionType::Button, FInputChord());
    UI_COMMAND(CopyShortCode, "Copy Short Code", "Copy selected nodes as Short Code", EUserInterfaceActionType::Button, FInputChord());
    UI_COMMAND(FormatNodes, "Format Nodes", "Auto arrange selected nodes", EUserInterfaceActionType::Button, FInputChord());
}

#undef LOCTEXT_NAMESPACE
