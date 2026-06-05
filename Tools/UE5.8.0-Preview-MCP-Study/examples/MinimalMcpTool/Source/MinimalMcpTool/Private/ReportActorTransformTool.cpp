// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#include "ReportActorTransformTool.h"

#include "EngineUtils.h"
#include "Editor.h"
#include "Engine/World.h"
#include "GameFramework/Actor.h"

#include "Dom/JsonObject.h"
#include "JsonDomBuilder.h"
#include "ModelContextProtocolToolResults.h"

FString FReportActorTransformTool::GetDescription() const
{
	return TEXT(
		"Find an actor by its label in the active editor world and return its world transform "
		"(location / rotation / scale). Use when the user asks where something is in the level.");
}

TSharedPtr<FJsonObject> FReportActorTransformTool::GetInputJsonSchema() const
{
	FJsonDomBuilder::FObject LabelProperty;
	LabelProperty.Set(TEXT("type"), TEXT("string"));
	LabelProperty.Set(TEXT("description"), TEXT("Actor label as shown in the World Outliner. Case insensitive."));

	FJsonDomBuilder::FObject Properties;
	Properties.Set(TEXT("actor_label"), LabelProperty);

	FJsonDomBuilder::FArray Required;
	Required.Add(TEXT("actor_label"));

	FJsonDomBuilder::FObject Schema;
	Schema.Set(TEXT("type"), TEXT("object"));
	Schema.Set(TEXT("properties"), Properties);
	Schema.Set(TEXT("required"), Required);
	return Schema.AsJsonObject().ToSharedPtr();
}

FModelContextProtocolToolResult FReportActorTransformTool::Run(const TSharedPtr<FJsonObject>& Params)
{
	using namespace UE::ModelContextProtocol;

	if (!Params.IsValid())
	{
		return MakeErrorResult(TEXT("Missing params object"));
	}

	FString Label;
	if (!Params->TryGetStringField(TEXT("actor_label"), Label) || Label.IsEmpty())
	{
		return MakeErrorResult(TEXT("Missing or empty 'actor_label' string parameter"));
	}

	UWorld* World = GEditor ? GEditor->GetEditorWorldContext().World() : nullptr;
	if (!World)
	{
		return MakeErrorResult(TEXT("No active editor world (open a level first)"));
	}

	for (TActorIterator<AActor> It(World); It; ++It)
	{
		if (!It->GetActorLabel().Equals(Label, ESearchCase::IgnoreCase))
		{
			continue;
		}

		const FTransform T = It->GetActorTransform();
		const FString Body = FString::Printf(
			TEXT("Location=%s\nRotation=%s\nScale=%s\nClass=%s"),
			*T.GetLocation().ToString(),
			*T.GetRotation().Rotator().ToString(),
			*T.GetScale3D().ToString(),
			*It->GetClass()->GetName());
		return MakeTextResult(Body);
	}

	return MakeErrorResult(FString::Printf(TEXT("Actor '%s' not found in current editor world"), *Label));
}
