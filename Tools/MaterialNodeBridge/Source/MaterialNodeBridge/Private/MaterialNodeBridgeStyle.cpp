#include "MaterialNodeBridgeStyle.h"
#include "Styling/SlateStyleRegistry.h"
#include "Styling/SlateStyle.h"
#include "Interfaces/IMainFrameModule.h"

FName FMaterialNodeBridgeStyle::GetStyleSetName()
{
	static FName StyleSetName(TEXT("MaterialNodeBridgeStyle"));
	return StyleSetName;
}

TSharedPtr<FSlateStyleSet> FMaterialNodeBridgeStyle::StyleInstance = nullptr;

void FMaterialNodeBridgeStyle::Initialize()
{
	if (!StyleInstance.IsValid())
	{
		StyleInstance = Create();
		FSlateStyleRegistry::RegisterSlateStyle(*StyleInstance);
	}
}

void FMaterialNodeBridgeStyle::Shutdown()
{
	if (StyleInstance.IsValid())
	{
		FSlateStyleRegistry::UnRegisterSlateStyle(*StyleInstance);
		StyleInstance.Reset();
	}
}

const ISlateStyle& FMaterialNodeBridgeStyle::Get()
{
	return *StyleInstance;
}

TSharedRef<FSlateStyleSet> FMaterialNodeBridgeStyle::Create()
{
	TSharedRef<FSlateStyleSet> Style = MakeShareable(new FSlateStyleSet(GetStyleSetName()));

	Style->SetContentRoot(FPaths::EngineContentDir() / TEXT("Editor/Slate"));
	Style->SetCoreContentRoot(FPaths::EngineContentDir() / TEXT("Slate"));

	return Style;
}
