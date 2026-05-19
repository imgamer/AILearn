#pragma once

#include "CoreMinimal.h"
#include "Framework/SlateDelegates.h"
#include "Styling/SlateStyle.h"

class FBlueprintNodeBridgeStyle
{
public:
	static void Initialize();
	static void Shutdown();

	static const ISlateStyle& Get();
	static FName GetStyleSetName();

	static FLinearColor PrimaryColor;
	static FLinearColor SecondaryColor;
	static FLinearColor AccentColor;

private:
	static TUniquePtr<FSlateStyleSet> StyleSet;
	static FName StyleSetName;
};
