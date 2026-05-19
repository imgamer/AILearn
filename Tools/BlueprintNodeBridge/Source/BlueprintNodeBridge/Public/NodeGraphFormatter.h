#pragma once

#include "CoreMinimal.h"

class UEdGraphNode;
class UEdGraph;

class BLUEPRINTNODEBRIDGE_API FNodeGraphFormatter
{
public:
	// Format selected nodes with smart layout algorithm
	static void FormatNodes(UEdGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes);

	// Legacy API
	static void AutoLayoutNodes(const TArray<UEdGraphNode*>& Nodes, float HorizontalSpacing = 300.0f, float VerticalSpacing = 100.0f);

private:
	static TArray<UEdGraphPin*> GetInputExecPins(UEdGraphNode* Node);
	static TArray<UEdGraphPin*> GetOutputExecPins(UEdGraphNode* Node);
};
