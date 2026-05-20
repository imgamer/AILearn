#pragma once

#include "CoreMinimal.h"
#include "Styling/SlateStyle.h"

class FUEBlueprintParser57Style
{
public:
	static void Initialize();
	static void Shutdown();
	static FName GetStyleSetName();

	static const ISlateStyle& Get();
	static FLinearColor PrimaryColor;
	static FLinearColor SecondaryColor;

private:
	static TUniquePtr<class FSlateStyleSet> StyleSet;
};
