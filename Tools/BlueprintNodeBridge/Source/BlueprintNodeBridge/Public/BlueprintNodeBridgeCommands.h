#pragma once

#include "CoreMinimal.h"
#include "Framework/Commands/Commands.h"

class FBlueprintNodeBridgeCommands : public TCommands<FBlueprintNodeBridgeCommands>
{
public:
	FBlueprintNodeBridgeCommands()
		: TCommands<FBlueprintNodeBridgeCommands>(
			TEXT("BlueprintNodeBridge"),
			NSLOCTEXT("Contexts", "BlueprintNodeBridge", "AI Bridge"),
			NAME_None,
			FAppStyle::Get().GetStyleSetName())
	{
	}

	TSharedPtr<FUICommandInfo> PasteShortCode;
	TSharedPtr<FUICommandInfo> CopyAsShortCode;
	TSharedPtr<FUICommandInfo> FormatNodes;
	TSharedPtr<FUICommandInfo> CopyAIRules;
	TSharedPtr<FUICommandInfo> ManageTemplates;
	TSharedPtr<FUICommandInfo> EditAIRules;

	virtual void RegisterCommands() override;
};
