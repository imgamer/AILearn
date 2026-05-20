#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"

class BLUEPRINTNODEBRIDGE_API FTextGraphParser
{
public:
	static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache);
	static bool ParseAndPaste(const FString& ShortCode, class UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location, class UEdGraph* InTargetGraph);

	static FString GetNodeBaseName(UEdGraphNode* Node);
	static FString GetPinValue(UEdGraphPin* Pin);
	static FString EscapePinValue(const FString& Value);
	static FString UnescapePinValue(const FString& Value);

	static bool ParseNodeDefinition(const FString& Line, struct FNodeDefinition& OutDef);
	static bool ParseLinkDefinition(const FString& Line, struct FLinkDefinition& OutLink);

	static bool IsValidShortCode(const FString& ShortCode);

private:
	static FString GetExecPinName(const FString& PinName, bool bIsInput);
};

struct BLUEPRINTNODEBRIDGE_API FNodeDefinition
{
	FString Name;
	FString ID;
	TMap<FString, FString> InputPins;
	TArray<FString> OutputPins;
};

struct BLUEPRINTNODEBRIDGE_API FLinkDefinition
{
	FString SourceNodeID;
	FString SourcePinName;
	FString TargetNodeID;
	FString TargetPinName;
};
