// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Framework/Commands/Commands.h"
#include "BlueprintAIBridgeStyle.h"

class FBlueprintAIBridgeCommands : public TCommands<FBlueprintAIBridgeCommands>
{
public:

	FBlueprintAIBridgeCommands()
		: TCommands<FBlueprintAIBridgeCommands>(TEXT("BlueprintAIBridge"), NSLOCTEXT("Contexts", "BlueprintAIBridge", "BlueprintAIBridge Plugin"), NAME_None, FBlueprintAIBridgeStyle::GetStyleSetName())
	{
	}

	// TCommands<> interface
	virtual void RegisterCommands() override;

public:
    TSharedPtr< FUICommandInfo > PasteShortCode;
    TSharedPtr< FUICommandInfo > CopyShortCode;
    TSharedPtr< FUICommandInfo > FormatNodes;
};