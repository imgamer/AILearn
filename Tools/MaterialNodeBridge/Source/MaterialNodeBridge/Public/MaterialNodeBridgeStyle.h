#pragma once

#include "CoreMinimal.h"
#include "Styling/SlateStyle.h"

class FMaterialNodeBridgeStyle
{
public:
	static void Initialize();
	static void Shutdown();
	static const ISlateStyle& Get();

	static FName GetStyleSetName();

private:
	static TSharedRef<FSlateStyleSet> Create();

private:
	static TSharedPtr<FSlateStyleSet> StyleInstance;
};
