#include "NodeGraphFormatter.h"
#include "EdGraph/EdGraphPin.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "ScopedTransaction.h"

// Helper struct for node layout
struct FNodeLayoutInfo
{
	UEdGraphNode* Node;
	bool bIsDummy;
	bool bIsMainPath;
	bool bIsPureFunction;
	int32 Rank;
	int32 Order;
	int32 MainPathIndex;
	float X;
	float Y;
	float EstimatedWidth;
	float EstimatedHeight;

	TArray<FNodeLayoutInfo*> Parents;
	TArray<FNodeLayoutInfo*> Children;
	TArray<FNodeLayoutInfo*> DataConsumers;

	FNodeLayoutInfo(UEdGraphNode* InNode)
		: Node(InNode)
		, bIsDummy(InNode == nullptr)
		, bIsMainPath(false)
		, bIsPureFunction(false)
		, Rank(0)
		, Order(0)
		, MainPathIndex(-1)
		, X(0)
		, Y(0)
		, EstimatedWidth(200.f)
		, EstimatedHeight(100.f)
	{
		EstimateSize();
		DetermineIfPureFunction();
	}

	void DetermineIfPureFunction()
	{
		if (bIsDummy || !Node) return;

		bool bHasExecInput = false;
		bool bHasExecOutput = false;

		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (Pin->bHidden || Pin->bOrphanedPin) continue;

			if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
			{
				if (Pin->Direction == EGPD_Input) bHasExecInput = true;
				else bHasExecOutput = true;
			}
		}

		bIsPureFunction = !bHasExecInput && !bHasExecOutput;
	}

	void EstimateSize()
	{
		if (bIsDummy)
		{
			EstimatedWidth = 10.0f;
			EstimatedHeight = 10.0f;
			return;
		}

		if (!Node) return;

		FString Title = Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString();
		float TitleWidth = Title.Len() * 9.0f;
		EstimatedWidth = FMath::Max(150.0f, 120.0f + TitleWidth);

		int32 InputCount = 0;
		int32 OutputCount = 0;
		int32 ExecCount = 0;

		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (Pin->bHidden || Pin->bOrphanedPin) continue;

			if (Pin->Direction == EGPD_Input)
			{
				InputCount++;
				if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec) ExecCount++;
			}
			else
			{
				OutputCount++;
			}
		}

		float HeaderHeight = ExecCount > 0 ? 45.0f : 35.0f;
		float PinHeight = FMath::Max(InputCount, OutputCount) * 24.0f;
		EstimatedHeight = HeaderHeight + PinHeight + 20.0f;

		if (EstimatedWidth < 140.0f) EstimatedWidth = 140.0f;
		if (EstimatedHeight < 70.0f) EstimatedHeight = 70.0f;
	}
};

void FNodeGraphFormatter::FormatNodes(UEdGraph* Graph, const TArray<UEdGraphNode*>& SelectedNodes)
{
	if (SelectedNodes.Num() < 2)
	{
		return;
	}

	FScopedTransaction Transaction(NSLOCTEXT("BlueprintNodeBridge", "FormatNodes", "Format Nodes"));

	const float HorizontalSpacing = 200.0f;
	const float VerticalSpacing = 60.0f;

	TMap<UEdGraphNode*, TSharedPtr<FNodeLayoutInfo>> NodeMap;
	TArray<TSharedPtr<FNodeLayoutInfo>> LayoutNodes;

	for (UEdGraphNode* Node : SelectedNodes)
	{
		TSharedPtr<FNodeLayoutInfo> Info = MakeShared<FNodeLayoutInfo>(Node);
		NodeMap.Add(Node, Info);
		LayoutNodes.Add(Info);
	}

	// Build relationships
	for (auto& Pair : NodeMap)
	{
		UEdGraphNode* Node = Pair.Key;
		TSharedPtr<FNodeLayoutInfo> Info = Pair.Value;

		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (Pin->Direction == EGPD_Output)
			{
				for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
				{
					UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
					if (TSharedPtr<FNodeLayoutInfo>* TargetInfoPtr = NodeMap.Find(TargetNode))
					{
						bool bIsExecConnection = (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec);

						if (bIsExecConnection)
						{
							Info->Children.AddUnique(TargetInfoPtr->Get());
							(*TargetInfoPtr)->Parents.AddUnique(Info.Get());
						}
						else
						{
							Info->DataConsumers.AddUnique(TargetInfoPtr->Get());
						}
					}
				}
			}
		}
	}

	// Cycle removal
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

	// Find root node
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

	// Layer assignment (BFS from root)
	for (auto& Info : LayoutNodes) Info->Rank = -1;

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

	// Calculate starting position
	float StartX = FLT_MAX;
	float StartY = FLT_MAX;
	for (UEdGraphNode* Node : SelectedNodes)
	{
		if (Node->NodePosX < StartX) StartX = Node->NodePosX;
		if (Node->NodePosY < StartY) StartY = Node->NodePosY;
	}
	if (StartX == FLT_MAX) StartX = 0;
	if (StartY == FLT_MAX) StartY = 0;

	// Position storage
	TMap<FNodeLayoutInfo*, FVector2D> NodePositions;

	// Layout exec-flow nodes
	TMap<int32, TArray<FNodeLayoutInfo*>> ExecLayers;
	TArray<FNodeLayoutInfo*> PureNodes;

	for (auto& Info : LayoutNodes)
	{
		if (Info->bIsPureFunction)
		{
			PureNodes.Add(Info.Get());
		}
		else
		{
			ExecLayers.FindOrAdd(Info->Rank).Add(Info.Get());
		}
	}

	float CurrentX = StartX;
	TMap<int32, float> LayerXPositions;

	// Calculate X positions
	for (int32 r = 0; r <= MaxRank; r++)
	{
		if (!ExecLayers.Contains(r)) continue;

		float MaxWidth = 0;
		for (FNodeLayoutInfo* Node : ExecLayers[r])
		{
			if (Node->EstimatedWidth > MaxWidth)
				MaxWidth = Node->EstimatedWidth;
		}

		LayerXPositions.Add(r, CurrentX);
		CurrentX += MaxWidth + HorizontalSpacing;
	}

	// Place exec nodes
	for (int32 r = 0; r <= MaxRank; r++)
	{
		if (!ExecLayers.Contains(r)) continue;

		float LayerX = LayerXPositions[r];
		TArray<FNodeLayoutInfo*>& Layer = ExecLayers[r];

		if (Layer.Num() == 1)
		{
			NodePositions.Add(Layer[0], FVector2D(LayerX, StartY));
		}
		else
		{
			float CurY = StartY;
			for (FNodeLayoutInfo* Node : Layer)
			{
				NodePositions.Add(Node, FVector2D(LayerX, CurY));
				CurY += Node->EstimatedHeight + VerticalSpacing;
			}
		}
	}

	// Place pure functions near consumers
	TSet<FNodeLayoutInfo*> PlacedPureNodes;

	for (FNodeLayoutInfo* PureNode : PureNodes)
	{
		if (PlacedPureNodes.Contains(PureNode)) continue;

		FNodeLayoutInfo* PrimaryConsumer = nullptr;
		FVector2D ConsumerPos(ForceInit);

		for (FNodeLayoutInfo* Consumer : PureNode->DataConsumers)
		{
			if (NodePositions.Contains(Consumer))
			{
				PrimaryConsumer = Consumer;
				ConsumerPos = NodePositions[Consumer];
				break;
			}
		}

		if (!PrimaryConsumer)
		{
			NodePositions.Add(PureNode, FVector2D(StartX - PureNode->EstimatedWidth - HorizontalSpacing, StartY));
			PlacedPureNodes.Add(PureNode);
			continue;
		}

		float PureX = ConsumerPos.X - PureNode->EstimatedWidth - HorizontalSpacing;
		float PureY = ConsumerPos.Y;

		// Check for overlap
		bool bOverlaps = true;
		int32 Attempts = 0;
		while (bOverlaps && Attempts < 10)
		{
			bOverlaps = false;

			for (auto& Pair : NodePositions)
			{
				FVector2D OtherPos = Pair.Value;
				if (PureX < OtherPos.X + Pair.Key->EstimatedWidth + VerticalSpacing &&
					PureX + PureNode->EstimatedWidth > OtherPos.X - VerticalSpacing &&
					PureY < OtherPos.Y + Pair.Key->EstimatedHeight + VerticalSpacing &&
					PureY + PureNode->EstimatedHeight > OtherPos.Y - VerticalSpacing)
				{
					bOverlaps = true;
					PureY -= (PureNode->EstimatedHeight + VerticalSpacing);
					break;
				}
			}
			Attempts++;
		}

		NodePositions.Add(PureNode, FVector2D(PureX, PureY));
		PlacedPureNodes.Add(PureNode);
	}

	// Apply positions
	Graph->Modify();
	for (auto& Info : LayoutNodes)
	{
		if (Info->bIsDummy || !Info->Node) continue;

		Info->Node->Modify();

		FVector2D Pos = NodePositions[Info.Get()];

		Info->Node->NodePosX = FMath::RoundToInt(Pos.X / 16.0f) * 16;
		Info->Node->NodePosY = FMath::RoundToInt(Pos.Y / 16.0f) * 16;
	}

	Graph->NotifyGraphChanged();
}

void FNodeGraphFormatter::AutoLayoutNodes(const TArray<UEdGraphNode*>& Nodes, float HorizontalSpacing, float VerticalSpacing)
{
	if (Nodes.Num() == 0) return;

	UEdGraph* Graph = Nodes[0]->GetGraph();
	if (!Graph) return;

	FormatNodes(Graph, Nodes);
}

TArray<UEdGraphPin*> FNodeGraphFormatter::GetInputExecPins(UEdGraphNode* Node)
{
	TArray<UEdGraphPin*> Result;
	if (!Node) return Result;

	for (UEdGraphPin* Pin : Node->Pins)
	{
		if (Pin && Pin->Direction == EGPD_Input && Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
		{
			Result.Add(Pin);
		}
	}
	return Result;
}

TArray<UEdGraphPin*> FNodeGraphFormatter::GetOutputExecPins(UEdGraphNode* Node)
{
	TArray<UEdGraphPin*> Result;
	if (!Node) return Result;

	for (UEdGraphPin* Pin : Node->Pins)
	{
		if (Pin && Pin->Direction == EGPD_Output && Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
		{
			Result.Add(Pin);
		}
	}
	return Result;
}
