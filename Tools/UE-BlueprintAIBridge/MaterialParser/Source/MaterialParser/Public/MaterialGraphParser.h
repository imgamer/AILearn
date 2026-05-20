#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"

namespace MaterialParserTypes
{
	struct FMatNodeDef
	{
		FString NodeId;
		FString ClassName;
		float PosX;
		float PosY;
		TMap<FString, FString> InputValues;
		TMap<FString, FString> OutputValues;

		FMatNodeDef() : PosX(0), PosY(0) {}
	};

	struct FMatLinkDef
	{
		FString SourceNodeId;
		FString SourcePin;
		FString TargetNodeId;
		FString TargetPin;

		FMatLinkDef() {}
	};
}

class MATERIALPARSER_API FMaterialGraphParser
{
public:
	static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes);

	static bool ParseShortCode(const FString& ShortCode,
		TArray<MaterialParserTypes::FMatNodeDef>& OutNodes,
		TArray<MaterialParserTypes::FMatLinkDef>& OutLinks);

	static bool IsValidShortCode(const FString& Text);

	static FString NodesToT3D(const TArray<UEdGraphNode*>& Nodes);

	static FString GetNodeDisplayName(UEdGraphNode* Node);

	static FString GetNodeClassName(UEdGraphNode* Node);

	static FString GetPinValueAsString(UEdGraphPin* Pin);

	static FVector2D GetNodePosition(UEdGraphNode* Node);

private:
	static FString ExtractShortCodeLine(UEdGraphNode* Node);
	static void ExtractConnections(const TArray<UEdGraphNode*>& Nodes, TArray<FString>& OutConnections);
};
