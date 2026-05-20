#include "BlueprintNodeBridgeStyle.h"
#include "Styling/SlateStyleRegistry.h"

FName FBlueprintNodeBridgeStyle::StyleSetName = TEXT("BlueprintNodeBridgeStyle");
TUniquePtr<FSlateStyleSet> FBlueprintNodeBridgeStyle::StyleSet;

FLinearColor FBlueprintNodeBridgeStyle::PrimaryColor = FLinearColor(0.2f, 0.4f, 0.8f, 1.0f);
FLinearColor FBlueprintNodeBridgeStyle::SecondaryColor = FLinearColor(0.8f, 0.4f, 0.2f, 1.0f);
FLinearColor FBlueprintNodeBridgeStyle::AccentColor = FLinearColor(0.2f, 0.8f, 0.4f, 1.0f);

void FBlueprintNodeBridgeStyle::Initialize()
{
	if (!StyleSet.IsValid())
	{
		StyleSet = MakeUnique<FSlateStyleSet>(StyleSetName);
		StyleSet->SetContentRoot(FPaths::EnginePluginsDir() / TEXT("BlueprintNodeBridge/Resources"));
		StyleSet->SetCoreContentRoot(FPaths::EngineContentDir() / TEXT("Slate"));

		FSlateStyleRegistry::RegisterSlateStyle(*StyleSet.Get());
	}
}

void FBlueprintNodeBridgeStyle::Shutdown()
{
	if (StyleSet.IsValid())
	{
		FSlateStyleRegistry::UnRegisterSlateStyle(*StyleSet.Get());
		StyleSet.Reset();
	}
}

const ISlateStyle& FBlueprintNodeBridgeStyle::Get()
{
	return *StyleSet.Get();
}

FName FBlueprintNodeBridgeStyle::GetStyleSetName()
{
	return StyleSetName;
}
