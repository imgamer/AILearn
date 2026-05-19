#pragma once

#include "CoreMinimal.h"
#include "Framework/Commands/Commands.h"

class FMaterialNodeBridgeCommands : public TCommands<FMaterialNodeBridgeCommands>
{
public:
	FMaterialNodeBridgeCommands()
		: TCommands<FMaterialNodeBridgeCommands>(
			TEXT("MaterialNodeBridge"),
			NSLOCTEXT("Contexts", "MaterialNodeBridge", "MaterialNodeBridge Plugin"),
			NAME_None,
			FMaterialNodeBridgeStyle::GetStyleSetName())
	{
	}

	virtual void RegisterCommands() override;

public:
	TSharedPtr<FUICommandInfo> PasteShortCode;
	TSharedPtr<FUICommandInfo> CopyAsShortCode;
	TSharedPtr<FUICommandInfo> FormatNodes;
	TSharedPtr<FUICommandInfo> CopyAIRules;
	TSharedPtr<FUICommandInfo> ManageTemplates;
	TSharedPtr<FUICommandInfo> EditAIRules;
};
