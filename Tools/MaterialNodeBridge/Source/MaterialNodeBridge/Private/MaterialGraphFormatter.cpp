#include "MaterialGraphFormatter.h"
#include "Materials/Material.h"
#include "MaterialGraph/MaterialGraph.h"
#include "MaterialGraph/MaterialGraphNode.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "ScopedTransaction.h"

FMaterialGraphFormatter::FNodeLayoutInfo::FNodeLayoutInfo(UEdGraphNode* InNode)
	: Node(InNode)
	, Rank(0)
	, Order(0)
	, X(0)
	, Y(0)
	, EstimatedWidth(200.f)
	, EstimatedHeight(120.f)
{
	EstimateSize();
}

void FMaterialGraphFormatter::FNodeLayoutInfo::EstimateSize()
{
	if (!Node) return;

	FString Title = Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString();
	float TitleWidth = Title.Len() * 9.0f;
	EstimatedWidth = FMath::Max(150.0f, 120.0f + TitleWidth);

	int32 InputCount = 0;
	int32 OutputCount = 0;

	for (UEdGraphPin* Pin : Node->Pins)
	{
		if (Pin->bHidden || Pin->bOrphanedPin) continue;

		if (Pin->Direction == EGPD_Input)
		{
			InputCount++;
		}
		else
		{
			OutputCount++;
		}
	}

	float HeaderHeight = 40.0f;
	float PinHeight = FMath::Max(InputCount, OutputCount) * 24.0f;
	EstimatedHeight = HeaderHeight + PinHeight + 20.0f;

	if (EstimatedWidth < 140.0f) EstimatedWidth = 140.0f;
	if (EstimatedHeight < 70.0f) EstimatedHeight = 70.0f;
}

void FMaterialGraphFormatter::FormatNodes(UMaterialGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes)
{
	if (SelectedNodes.Num() < 2)
	{
		return;
	}

	FScopedTransaction Transaction(NSLOCTEXT("MaterialNodeBridge", "FormatNodes", "Format Nodes"));

	const float HorizontalSpacing = 300.0f;
	const float VerticalSpacing = 100.0f;

	TMap<UEdGraphNode*, TSharedPtr<FNodeLayoutInfo>> NodeMap;
	TArray<TSharedPtr<FNodeLayoutInfo>> LayoutNodes;

	for (UEdGraphNode* Node : SelectedNodes)
	{
		TSharedPtr<FNodeLayoutInfo> Info = MakeShared<FNodeLayoutInfo>(Node);
		NodeMap.Add(Node, Info);
		LayoutNodes.Add(Info);
	}

	BuildNodeRelationships(LayoutNodes);

	TSet<FNodeLayoutInfo*> Visited;
	TSet<FNodeLayoutInfo*> RecursionStack;

	TFunction<void(FNodeLayoutInfo*)> VisitNode;
	VisitNode = [&](FNodeLayoutInfo* U)
	{
		Visited.Add(U);
		RecursionStack.Add(U);

		TArray<FNodeLayoutInfo*> CurrentChildren = U->Children;
		for (FNodeLayoutInfo* V : CurrentChildren)
		{
			if (RecursionStack.Contains(V))
			{
				U->Children.Remove(V);
				V->Parents.Remove(U);
			}
			else if (!Visited.Contains(V))
			{
				VisitNode(V);
			}
		}

		RecursionStack.Remove(U);
	};

	for (auto& Info : LayoutNodes)
	{
		if (!Visited.Contains(Info.Get()))
		{
			VisitNode(Info.Get());
		}
	}

	FNodeLayoutInfo* RootNode = nullptr;
	for (auto& Info : LayoutNodes)
	{
		if (Info->Parents.Num() == 0)
		{
			RootNode = Info.Get();
			break;
		}
	}

	if (!RootNode && NodeMap.Contains(SelectedNodes[0]))
	{
		RootNode = NodeMap[SelectedNodes[0]].Get();
	}

	if (!RootNode) return;

	AssignLayers(LayoutNodes);

	float StartX = FLT_MAX;
	float StartY = FLT_MAX;
	for (UEdGraphNode* Node : SelectedNodes)
	{
		if (UMaterialGraphNode* GraphNode = Cast<UMaterialGraphNode>(Node))
		{
			if (UMaterialExpression* Expr = GraphNode->MaterialExpression)
			{
				if (Expr->MaterialExpressionEditorX < StartX) StartX = Expr->MaterialExpressionEditorX;
				if (Expr->MaterialExpressionEditorY < StartY) StartY = Expr->MaterialExpressionEditorY;
			}
		}
	}
	if (StartX == FLT_MAX) StartX = 0;
	if (StartY == FLT_MAX) StartY = 0;

	CalculatePositions(LayoutNodes, StartX, StartY, HorizontalSpacing, VerticalSpacing);
	ApplyPositions(Graph, LayoutNodes);
}

void FMaterialGraphFormatter::AutoLayoutNodes(const TArray<UEdGraphNode*>& Nodes, float HorizontalSpacing, float VerticalSpacing)
{
	if (Nodes.Num() == 0) return;

	UMaterialGraph* Graph = nullptr;
	for (UEdGraphNode* Node : Nodes)
	{
		if (UMaterialGraphNode* GraphNode = Cast<UMaterialGraphNode>(Node))
		{
			Graph = Cast<UMaterialGraph>(GraphNode->GetGraph());
			break;
		}
	}

	if (!Graph) return;

	FormatNodes(Graph, Nodes);
}

void FMaterialGraphFormatter::BuildNodeRelationships(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes)
{
	for (auto& Pair : LayoutNodes)
	{
		UEdGraphNode* Node = Pair->Node;
		if (!Node) continue;

		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (Pin->Direction == EGPD_Output)
			{
				for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
				{
					UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
					for (auto& TargetPair : LayoutNodes)
					{
						if (TargetPair->Node == TargetNode)
						{
							Pair->Children.AddUnique(TargetPair.Get());
							TargetPair->Parents.AddUnique(Pair.Get());
							break;
						}
					}
				}
			}
		}
	}
}

void FMaterialGraphFormatter::AssignLayers(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes)
{
	for (auto& Info : LayoutNodes) Info->Rank = -1;

	FNodeLayoutInfo* RootNode = nullptr;
	for (auto& Info : LayoutNodes)
	{
		if (Info->Parents.Num() == 0)
		{
			RootNode = Info.Get();
			break;
		}
	}

	if (!RootNode) return;

	TArray<FNodeLayoutInfo*> Queue;
	RootNode->Rank = 0;
	Queue.Add(RootNode);

	int32 MaxRank = 0;
	while (Queue.Num() > 0)
	{
		FNodeLayoutInfo* Current = Queue[0];
		Queue.RemoveAt(0);

		for (FNodeLayoutInfo* Child : Current->Children)
		{
			if (Child->Rank < 0)
			{
				Child->Rank = Current->Rank + 1;
				Queue.Add(Child);
				if (Child->Rank > MaxRank) MaxRank = Child->Rank;
			}
		}
	}

	for (auto& Info : LayoutNodes)
	{
		if (Info->Rank < 0) Info->Rank = 0;
	}
}

void FMaterialGraphFormatter::CalculatePositions(TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes, float StartX, float StartY, float HSpacing, float VSpacing)
{
	TMap<int32, TArray<FNodeLayoutInfo*>> Layers;

	for (auto& Info : LayoutNodes)
	{
		Layers.FindOrAdd(Info->Rank).Add(Info.Get());
	}

	int32 MaxRank = 0;
	for (auto& Pair : Layers)
	{
		if (Pair.Key > MaxRank) MaxRank = Pair.Key;
	}

	float CurrentX = StartX;

	for (int32 r = 0; r <= MaxRank; r++)
	{
		if (!Layers.Contains(r)) continue;

		float MaxWidth = 0;
		for (FNodeLayoutInfo* Node : Layers[r])
		{
			if (Node->EstimatedWidth > MaxWidth)
				MaxWidth = Node->EstimatedWidth;
		}

		float LayerX = CurrentX;
		TArray<FNodeLayoutInfo*>& Layer = Layers[r];

		if (Layer.Num() == 1)
		{
			Layer[0]->X = LayerX;
			Layer[0]->Y = StartY;
		}
		else
		{
			float CurY = StartY;
			for (FNodeLayoutInfo* Node : Layer)
			{
				Node->X = LayerX;
				Node->Y = CurY;
				CurY += Node->EstimatedHeight + VSpacing;
			}
		}

		CurrentX += MaxWidth + HSpacing;
	}
}

void FMaterialGraphFormatter::ApplyPositions(UMaterialGraph* Graph, const TArray<TSharedPtr<FNodeLayoutInfo>>& LayoutNodes)
{
	if (!Graph) return;

	Graph->Modify();

	for (auto& Info : LayoutNodes)
	{
		if (!Info->Node) continue;

		if (UMaterialGraphNode* GraphNode = Cast<UMaterialGraphNode>(Info->Node))
		{
			if (UMaterialExpression* Expression = GraphNode->MaterialExpression)
			{
				Expression->MaterialExpressionEditorX = FMath::RoundToInt(Info->X / 16.0f) * 16;
				Expression->MaterialExpressionEditorY = FMath::RoundToInt(Info->Y / 16.0f) * 16;
				Expression->MarkPackageDirty();
			}
		}
	}

	Graph->RebuildGraph();
	Graph->NotifyGraphChanged();
}
