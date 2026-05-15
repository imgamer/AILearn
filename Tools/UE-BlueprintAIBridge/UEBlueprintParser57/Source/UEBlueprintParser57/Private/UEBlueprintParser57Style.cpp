#include "UEBlueprintParser57Style.h"
#include "Framework/Application/SlateStyleRegistry.h"
#include "Styling/SlateStyleMacros.h"
#include "Styling/CoreStyle.h"

FName FUEBlueprintParser57Style::StyleSetName(TEXT("UEBlueprintParser57"));
TUniquePtr<FSlateStyleSet> FUEBlueprintParser57Style::StyleSet;
FLinearColor FUEBlueprintParser57Style::PrimaryColor = FLinearColor(0.3f, 0.6f, 1.0f, 1.0f);
FLinearColor FUEBlueprintParser57Style::SecondaryColor = FLinearColor(0.8f, 0.8f, 0.2f, 1.0f);

void FUEBlueprintParser57Style::Initialize()
{
	if (!StyleSet.IsValid())
	{
		StyleSet = MakeUnique<FSlateStyleSet>(StyleSetName);
		StyleSet->SetContentRoot(FPaths::EngineContentDir() / TEXT("Slate"));
		StyleSet->SetCoreContentRoot(FPaths::EngineContentDir() / TEXT("Slate"));

		StyleSet->Set("UEBlueprintParser57.Action", new FSlateColorBrush(FLinearColor(0.2f, 0.5f, 0.9f, 1.0f)));

		FSlateStyleRegistry::RegisterSlateStyle(*StyleSet.Get());
	}
}

void FUEBlueprintParser57Style::Shutdown()
{
	if (StyleSet.IsValid())
	{
		FSlateStyleRegistry::UnRegisterSlateStyle(*StyleSet.Get());
		StyleSet.Reset();
	}
}

FName FUEBlueprintParser57Style::GetStyleSetName()
{
	return StyleSetName;
}

const ISlateStyle& FUEBlueprintParser57Style::Get()
{
	return *StyleSet.Get();
}
