#include "NodeGraphFormatter.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "EdGraph/EdGraphSchema.h"
#include "EdGraphUtilities.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Json.h"
#include "JsonUtilities/JsonUtilities.h"
#include "HAL/IFileManager.h"
#include "Misc/FileHelper.h"

TMap<FString, FString> FNodeGraphFormatter::CachedTemplates;
FString FNodeGraphFormatter::TemplatesCachePath;

void FNodeGraphFormatter::FormatNodePositions(TArray<UEdGraphNode*>& Nodes, float GridSize)
{
	if (Nodes.Num() == 0) return;

	float MinX = FLT_MAX;
	float MinY = FLT_MAX;
	float MaxX = -FLT_MAX;
	float MaxY = -FLT_MAX;

	for (UEdGraphNode* Node : Nodes)
	{
		if (Node)
		{
			MinX = FMath::Min(MinX, (float)Node->NodePosX);
			MinY = FMath::Min(MinY, (float)Node->NodePosY);
			MaxX = FMath::Max(MaxX, (float)Node->NodePosX + Node->NodeWidth);
			MaxY = FMath::Max(MaxY, (float)Node->NodePosY + Node->NodeHeight);
		}
	}

	float ContentWidth = MaxX - MinX;
	float ContentHeight = MaxY - MinY;

	float ScaledGridSize = GridSize * 0.5f;

	for (UEdGraphNode* Node : Nodes)
	{
		if (Node)
		{
			float RelX = ((float)Node->NodePosX - MinX) / FMath::Max(1.0f, ContentWidth);
			float RelY = ((float)Node->NodePosY - MinY) / FMath::Max(1.0f, ContentHeight);

			Node->NodePosX = FMath::RoundToInt(RelX * ScaledGridSize) * 2;
			Node->NodePosY = FMath::RoundToInt(RelY * ScaledGridSize) * 2;
			Node->Modify();
		}
	}
}

void FNodeGraphFormatter::AutoArrangeNodes(UEdGraph* Graph)
{
	if (!Graph) return;

	TArray<UEdGraphNode*> AllNodes;
	Graph->GetNodesOfClass(AllNodes);

	if (AllNodes.Num() == 0) return;

	TMap<UEdGraphNode*, TArray<UEdGraphNode*>> Adjacency;
	TMap<UEdGraphNode*, int32> InDegree;

	for (UEdGraphNode* Node : AllNodes)
	{
		Adjacency.Add(Node, TArray<UEdGraphNode*>());
		InDegree.Add(Node, 0);
	}

	for (UEdGraphNode* Node : AllNodes)
	{
		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (Pin->Direction == EGPD_Input)
			{
				for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
				{
					UEdGraphNode* SourceNode = LinkedPin->GetOwningNode();
					if (Adjacency.Contains(SourceNode))
					{
						Adjacency[SourceNode].Add(Node);
						InDegree[Node]++;
					}
				}
			}
		}
	}

	TArray<UEdGraphNode*> Queue;
	TArray<TArray<UEdGraphNode*>> Levels;

	for (UEdGraphNode* Node : AllNodes)
	{
		if (InDegree[Node] == 0)
		{
			Queue.Add(Node);
		}
	}

	while (Queue.Num() > 0)
	{
		TArray<UEdGraphNode*> CurrentLevel;
		TArray<UEdGraphNode*> NextQueue;

		for (UEdGraphNode* Node : Queue)
		{
			CurrentLevel.Add(Node);
			for (UEdGraphNode* Neighbor : Adjacency[Node])
			{
				InDegree[Neighbor]--;
				if (InDegree[Neighbor] == 0)
				{
					NextQueue.Add(Neighbor);
				}
			}
		}

		if (CurrentLevel.Num() > 0)
		{
			Levels.Add(CurrentLevel);
		}

		Queue = NextQueue;
	}

	float GridSize = 300.0f;
	float YOffset = 0.0f;

	for (int32 LevelIdx = 0; LevelIdx < Levels.Num(); LevelIdx++)
	{
		TArray<UEdGraphNode*>& Level = Levels[LevelIdx];
		float XOffset = 0.0f;

		for (int32 NodeIdx = 0; NodeIdx < Level.Num(); NodeIdx++)
		{
			UEdGraphNode* Node = Level[NodeIdx];
			Node->NodePosX = FMath::RoundToInt(XOffset);
			Node->NodePosY = FMath::RoundToInt(YOffset);
			Node->Modify();

			XOffset += GridSize;
		}

		YOffset += GridSize;
	}

	for (UEdGraphNode* Node : AllNodes)
	{
		bool bFoundInLevels = false;
		for (const TArray<UEdGraphNode*>& Level : Levels)
		{
			if (Level.Contains(Node))
			{
				bFoundInLevels = true;
				break;
			}
		}

		if (!bFoundInLevels)
		{
			Node->NodePosX = FMath::RoundToInt(YOffset);
			Node->NodePosY = FMath::RoundToInt(GridSize);
			Node->Modify();
		}
	}
}

FString FNodeGraphFormatter::ExportNodesToJson(const TArray<UEdGraphNode*>& Nodes)
{
	TArray<TSharedPtr<FJsonValue>> NodeArray;

	for (UEdGraphNode* Node : Nodes)
	{
		if (!Node) continue;

		TSharedPtr<FJsonObject> NodeObject = MakeShared<FJsonObject>();

		NodeObject->SetStringField("Type", Node->GetClass()->GetName());
		NodeObject->SetStringField("Title", Node->GetNodeTitle(ENodeTitleType::MenuTitle).ToString());
		NodeObject->SetNumberField("PosX", Node->NodePosX);
		NodeObject->SetNumberField("PosY", Node->NodePosY);

		TArray<TSharedPtr<FJsonValue>> PinArray;

		for (UEdGraphPin* Pin : Node->Pins)
		{
			TSharedPtr<FJsonObject> PinObject = MakeShared<FJsonObject>();

			PinObject->SetStringField("Name", Pin->PinName.ToString());
			PinObject->SetStringField("Direction", Pin->Direction == EGPD_Input ? "Input" : "Output");
			PinObject->SetStringField("Category", Pin->PinType.PinCategory.ToString());
			PinObject->SetStringField("DefaultValue", Pin->DefaultValue);

			PinArray.Add(MakeShared<FJsonValueObject>(PinObject));
		}

		NodeObject->SetArrayField("Pins", PinArray);
		NodeArray.Add(MakeShared<FJsonValueObject>(NodeObject));
	}

	TSharedPtr<FJsonObject> RootObject = MakeShared<FJsonObject>();
	RootObject->SetArrayField("Nodes", NodeArray);
	RootObject->SetNumberField("Count", Nodes.Num());

	FString OutputString;
	TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&OutputString);
	FJsonSerializer::Serialize(RootObject, Writer);

	return OutputString;
}

bool FNodeGraphFormatter::ImportNodesFromJson(const FString& JsonString, UEdGraph* TargetGraph, TSet<UEdGraphNode*>& OutNewNodes)
{
	if (JsonString.IsEmpty() || !TargetGraph) return false;

	TSharedPtr<FJsonObject> RootObject;
	TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(JsonString);

	if (!FJsonSerializer::Deserialize(Reader, RootObject) || !RootObject.IsValid())
	{
		return false;
	}

	const TArray<TSharedPtr<FJsonValue>>* NodesArray;
	if (!RootObject->TryGetArrayField("Nodes", NodesArray))
	{
		return false;
	}

	OutNewNodes.Empty();

	for (const TSharedPtr<FJsonValue>& NodeValue : *NodesArray)
	{
		TSharedPtr<FJsonObject> NodeObject = NodeValue->AsObject();
		if (!NodeObject.IsValid()) continue;
	}

	return true;
}

bool FNodeGraphFormatter::ExportAIRulesToFile(const FString& FilePath)
{
	if (CachedTemplates.Num() == 0)
	{
		GetNodeTemplates();
	}

	FString JsonOutput;
	TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&JsonOutput);

	Writer->WriteObjectStart();
	Writer->WriteArrayStart("Templates");

	for (const auto& Pair : CachedTemplates)
	{
		Writer->WriteObjectStart();
		Writer->WriteIdentifierPrefix("Template");
		Writer->WriteValue("Name", Pair.Key);
		Writer->WriteValue("T3D", Pair.Value);
		Writer->WriteObjectEnd();
	}

	Writer->WriteArrayEnd();
	Writer->WriteObjectEnd();

	Writer->Close();

	return FFileHelper::SaveStringToFile(JsonOutput, *FilePath);
}

bool FNodeGraphFormatter::ImportAIRulesFromFile(const FString& FilePath)
{
	if (!FPaths::FileExists(FilePath)) return false;

	FString FileContent;
	if (!FFileHelper::LoadFileToString(FileContent)) return false;

	TSharedPtr<FJsonObject> RootObject;
	TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(FileContent);

	if (!FJsonSerializer::Deserialize(Reader, RootObject) || !RootObject.IsValid())
	{
		return false;
	}

	const TArray<TSharedPtr<FJsonValue>>* TemplatesArray;
	if (!RootObject->TryGetArrayField("Templates", TemplatesArray))
	{
		return false;
	}

	CachedTemplates.Empty();

	for (const TSharedPtr<FJsonValue>& TemplateValue : *TemplatesArray)
	{
		TSharedPtr<FJsonObject> TemplateObject = TemplateValue->AsObject();
		if (!TemplateObject.IsValid()) continue;

		FString Name;
		FString T3D;

		if (TemplateObject->TryGetStringField("Name", Name) && TemplateObject->TryGetStringField("T3D", T3D))
		{
			CachedTemplates.Add(Name, T3D);
		}
	}

	return true;
}

TMap<FString, FString> FNodeGraphFormatter::GetNodeTemplates()
{
	if (CachedTemplates.Num() > 0)
	{
		return CachedTemplates;
	}

	if (TemplatesCachePath.IsEmpty())
	{
		TemplatesCachePath = FPaths::ProjectSavedDir() / TEXT("BlueprintParserTemplates") / TEXT("NodeTemplates.json");
	}

	if (FPaths::FileExists(TemplatesCachePath))
	{
		ImportAIRulesFromFile(TemplatesCachePath);
	}

	return CachedTemplates;
}

void FNodeGraphFormatter::SaveNodeTemplate(const FString& TemplateName, const FString& NodeT3D)
{
	CachedTemplates.Add(TemplateName, NodeT3D);

	FString Dir = FPaths::GetPath(TemplatesCachePath);
	if (!FPaths::DirectoryExists(Dir))
	{
		IFileManager::Get().MakeDirectory(*Dir, true);
	}

	ExportAIRulesToFile(TemplatesCachePath);
}

bool FNodeGraphFormatter::DeleteNodeTemplate(const FString& TemplateName)
{
	if (!CachedTemplates.Contains(TemplateName))
	{
		return false;
	}

	CachedTemplates.Remove(TemplateName);

	if (CachedTemplates.Num() > 0)
	{
		ExportAIRulesToFile(TemplatesCachePath);
	}
	else
	{
		if (FPaths::FileExists(TemplatesCachePath))
		{
			IFileManager::Get().Delete(*TemplatesCachePath);
		}
	}

	return true;
}
