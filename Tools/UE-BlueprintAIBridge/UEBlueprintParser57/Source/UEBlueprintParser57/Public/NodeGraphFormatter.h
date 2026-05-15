#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"

class FNodeGraphFormatter
{
public:
	static void FormatNodePositions(TArray<UEdGraphNode*>& Nodes, float GridSize = 50.0f);
	static void AutoArrangeNodes(class UEdGraph* Graph);

	static FString ExportNodesToJson(const TArray<UEdGraphNode*>& Nodes);
	static bool ImportNodesFromJson(const FString& JsonString, class UEdGraph* TargetGraph, TSet<UEdGraphNode*>& OutNewNodes);

	static bool ExportAIRulesToFile(const FString& FilePath);
	static bool ImportAIRulesFromFile(const FString& FilePath);

	static TMap<FString, FString> GetNodeTemplates();
	static void SaveNodeTemplate(const FString& TemplateName, const FString& NodeT3D);
	static bool DeleteNodeTemplate(const FString& TemplateName);

private:
	static TMap<FString, FString> CachedTemplates;
	static FString TemplatesCachePath;
};
