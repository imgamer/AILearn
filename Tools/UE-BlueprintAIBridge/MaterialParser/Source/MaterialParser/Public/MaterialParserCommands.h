#pragma once

#include "CoreMinimal.h"
#include "Framework/Commands/Commands.h"
#include "Styling/AppStyle.h"

class FMaterialParserCommands : public TCommands<FMaterialParserCommands>
{
public:
	FMaterialParserCommands()
		: TCommands<FMaterialParserCommands>(
			TEXT("MaterialParser"),
			NSLOCTEXT("Contexts", "MaterialParser", "Material Parser"),
			NAME_None,
			FAppStyle::Get().GetStyleSetName())
	{
	}

	TSharedPtr<FUICommandInfo> CopyAsShortCode;
	TSharedPtr<FUICommandInfo> PasteShortCode;

	virtual void RegisterCommands() override;
};
