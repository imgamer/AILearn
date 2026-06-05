#pragma once

#include "CoreMinimal.h"

class UMaterialGraphNode;
class UMaterialGraph;

class MATERIALNODEBRIDGE_API FMaterialGraphFormatter
{
public:
	static void FormatNodes(UMaterialGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes);
	static void AutoLayoutNodes(const TArray<UEdGraphNode*>& Nodes, float HorizontalSpacing = 300.0f, float VerticalSpacing = 100.0f);

private:
	struct FNodeLayoutInfo
	{
		UEdGraphNode* Node;
		int32 Rank;
		int32 Order;
		float X;
		float Y;
		float EstimatedWidth;
		float EstimatedHeight;

		TArray<FNodeLayoutInfo*> Parents;
		TArray<FNodeLayoutInfo*> Children;

		FNodeLayoutInfo(UEdGraphNode* InNode);
		void EstimateSize();
	};

	static void BuildNodeRelationships(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes);
	static void AssignLayers(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes);
	static void CalculatePositions(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes, float StartX, float StartY, float HSpacing, float VSpacing);
	static void ApplyPositions(UMaterialGraph* Graph, const TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes);
};
