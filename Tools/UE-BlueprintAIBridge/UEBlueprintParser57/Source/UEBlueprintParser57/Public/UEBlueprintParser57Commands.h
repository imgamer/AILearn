#pragma once

#include "CoreMinimal.h"
#include "Framework/Commands/UICommandInfo.h"

class FUEBlueprintParser57Commands : public TCommands<FUEBlueprintParser57Commands>
{
public:
	FUEBlueprintParser57Commands()
		: TCommands<FUEBlueprintParser57Commands>(
			TEXT("UEBlueprintParser57"),
			NSLOCTEXT("Contexts", "UEBlueprintParser57", "UEBlueprintParser57 Plugin"),
			NAME_None,
			FAppStyle::Get().GetStyleSetName())
	{}

	virtual void RegisterCommands() override;

public:
	TSharedPtr<FUICommandInfo> CopyAsShortCode;
	TSharedPtr<FUICommandInfo> PasteShortCode;
	TSharedPtr<FUICommandInfo> ArrangeNodes;
	TSharedPtr<FUICommandInfo> CopyAIRules;
	TSharedPtr<FUICommandInfo> ManageTemplates;
	TSharedPtr<FUICommandInfo> EditAIRules;
};
