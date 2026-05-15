#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"

class FTextGraphParser
{
public:
	static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache);

	static bool ParseAndPaste(const FString& ShortCode, class UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location = FVector2D::ZeroVector, class UEdGraph* TargetGraph = nullptr);

	struct FNodeDefinition
	{
		FString Name;
		FString ID;
		TMap<FString, FString> InputPins;
		TArray<FString> OutputPins;
	};

	struct FLinkDefinition
	{
		FString SourceNodeID;
		FString SourcePinName;
		FString TargetNodeID;
		FString TargetPinName;
	};

private:
	static FString GetNodeBaseName(UEdGraphNode* Node);
	static FString GetPinValue(UEdGraphPin* Pin);
	static FString EscapePinValue(const FString& Value);
	static FString UnescapePinValue(const FString& Value);
	static bool ParseNodeDefinition(const FString& Line, FNodeDefinition& OutDef);
	static bool ParseLinkDefinition(const FString& Line, FLinkDefinition& OutLink);
};
