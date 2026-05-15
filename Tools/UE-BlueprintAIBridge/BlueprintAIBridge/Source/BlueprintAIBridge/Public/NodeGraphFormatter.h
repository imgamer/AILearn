#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"

class FNodeGraphFormatter
{
public:
	/**
	 * Auto-arrange the selected nodes in the graph.
	 * @param Graph The graph containing the nodes.
	 * @param SelectedNodes The list of nodes to arrange.
	 */
	static void FormatNodes(UEdGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes);

private:
	struct FNodeBounds
	{
		float Width;
		float Height;
	};
};
