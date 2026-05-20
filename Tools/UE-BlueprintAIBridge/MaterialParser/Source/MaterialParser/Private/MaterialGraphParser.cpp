#include "MaterialGraphParser.h"
#include "Materials/MaterialExpression.h"
#include "Materials/MaterialExpressionConstant.h"
#include "Materials/MaterialExpressionConstant3Vector.h"
#include "Materials/MaterialExpressionConstant4Vector.h"
#include "Materials/MaterialExpressionTextureSample.h"
#include "Materials/MaterialExpressionMultiply.h"
#include "Materials/MaterialExpressionAdd.h"
#include "Materials/MaterialExpressionSubtract.h"
#include "Materials/MaterialExpressionDivide.h"
#include "Materials/MaterialExpressionOneMinus.h"
#include "Materials/MaterialExpressionComponentMask.h"
#include "Materials/MaterialExpressionAppendVector.h"
#include "Materials/MaterialExpressionTextureCoordinate.h"
#include "Materials/MaterialExpressionComment.h"
#include "Materials/MaterialExpressionFresnel.h"
#include "Materials/MaterialExpressionPower.h"
#include "Materials/MaterialExpressionLinearInterpolate.h"
#include "EdGraphUtilities.h"
#include "EdGraph/EdGraphPin.h"

#define LOCTEXT_NAMESPACE "FMaterialGraphParser"

FString FMaterialGraphParser::GenerateShortCode(const TArray<UEdGraphNode*>& Nodes)
{
	if (Nodes.IsEmpty())
	{
		return TEXT("");
	}

	FString Result;

	// Generate node definitions
	for (UEdGraphNode* Node : Nodes)
	{
		Result += ExtractShortCodeLine(Node);
		Result += TEXT("\n");
	}

	// Generate connections
	TArray<FString> Connections;
	ExtractConnections(Nodes, Connections);

	if (!Connections.IsEmpty())
	{
		Result += TEXT("\n");
		for (const FString& Conn : Connections)
		{
			Result += Conn;
			Result += TEXT("\n");
		}
	}

	return Result;
}

FString FMaterialGraphParser::ExtractShortCodeLine(UEdGraphNode* Node)
{
	if (!Node)
	{
		return TEXT("");
	}

	FString NodeId = GetNodeDisplayName(Node);
	FString ClassName = GetNodeClassName(Node);
	FVector2D Pos = GetNodePosition(Node);

	FString Line = FString::Printf(TEXT("%s [%s] [%.0f, %.0f]"),
		*NodeId, *ClassName, Pos.X, Pos.Y);

	// Extract input pin values
	for (UEdGraphPin* Pin : Node->GetAllPins())
	{
		if (Pin && Pin->Direction == EGPD_Input)
		{
			FString Value = GetPinValueAsString(Pin);
			if (!Value.IsEmpty())
			{
				FString PinNameStr = Pin->PinName.ToString();
				Line += FString::Printf(TEXT("\n  %s = %s"), *PinNameStr, *Value);
			}
		}
	}

	return Line;
}

void FMaterialGraphParser::ExtractConnections(const TArray<UEdGraphNode*>& Nodes, TArray<FString>& OutConnections)
{
	// Build node ID map
	TMap<UEdGraphNode*, FString> NodeIdMap;
	for (UEdGraphNode* Node : Nodes)
	{
		NodeIdMap.Add(Node, GetNodeDisplayName(Node));
	}

	// Find all connections
	for (UEdGraphNode* Node : Nodes)
	{
		for (UEdGraphPin* Pin : Node->GetAllPins())
		{
			if (Pin && Pin->Direction == EGPD_Output)
			{
				for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
				{
					if (LinkedPin)
					{
						UEdGraphNode* SourceNode = Pin->GetOwningNode();
						UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();

						FString* SourceId = NodeIdMap.Find(SourceNode);
						FString* TargetId = NodeIdMap.Find(TargetNode);

						if (SourceId && TargetId)
						{
							FString PinNameStr = Pin->PinName.ToString();
							FString LinkedPinNameStr = LinkedPin->PinName.ToString();
							FString ConnLine = FString::Printf(TEXT("%s.%s -> %s.%s"),
								**SourceId, *PinNameStr,
								**TargetId, *LinkedPinNameStr);
							OutConnections.Add(ConnLine);
						}
					}
				}
			}
		}
	}
}

FString FMaterialGraphParser::GetNodeDisplayName(UEdGraphNode* Node)
{
	if (!Node)
	{
		return TEXT("Unknown");
	}

	FString Name = Node->GetNodeTitle(ENodeTitleType::ListView).ToString();
	Name = Name.Replace(TEXT(" "), TEXT(""));
	Name = Name.Replace(TEXT("'"), TEXT(""));

	// Handle numbered duplicates (e.g., "TextureSample_2")
	if (Name.IsEmpty())
	{
		Name = TEXT("Node");
	}

	// Add index suffix for uniqueness if needed
	static TMap<FString, int32> NameCounts;
	int32& Count = NameCounts.FindOrAdd(Name);
	FString Result = (Count == 0) ? Name : FString::Printf(TEXT("%s_%d"), *Name, Count);
	Count++;

	return Result;
}

FString FMaterialGraphParser::GetNodeClassName(UEdGraphNode* Node)
{
	if (!Node)
	{
		return TEXT("Unknown");
	}

	return Node->GetClass()->GetName();
}

FVector2D FMaterialGraphParser::GetNodePosition(UEdGraphNode* Node)
{
	if (!Node)
	{
		return FVector2D::Zero();
	}

	return Node->NodePosX >= 0 ? FVector2D(Node->NodePosX, Node->NodePosY) : FVector2D::Zero();
}

FString FMaterialGraphParser::GetPinValueAsString(UEdGraphPin* Pin)
{
	if (!Pin)
	{
		return TEXT("");
	}

	// If connected, return reference to source
	if (!Pin->LinkedTo.IsEmpty())
	{
		UEdGraphPin* SourcePin = Pin->LinkedTo[0];
		if (SourcePin)
		{
			UEdGraphNode* SourceNode = SourcePin->GetOwningNode();
			FString SourcePinName = SourcePin->PinName.ToString();
			return FString::Printf(TEXT("%s.%s"), *GetNodeDisplayName(SourceNode), *SourcePinName);
		}
	}

	// Get default value as string
	FString DefaultStr = Pin->GetDefaultAsString();
	if (DefaultStr.IsEmpty())
	{
		return TEXT("");
	}

	// Extract default value based on pin category
	FString Category = Pin->PinType.PinCategory.ToString();

	if (Category == TEXT("PC_Float") || Category == TEXT("PC_Scalar"))
	{
		float FloatVal = FCString::Atof(*DefaultStr);
		return FString::SanitizeFloat(FloatVal);
	}
	else if (Category == TEXT("PC_Vector4") || Category == TEXT("PC_Vector3") ||
		Category == TEXT("PC_Vector2") || Category == TEXT("PC_LinearColor"))
	{
		FLinearColor Color;
		if (DefaultStr.StartsWith(TEXT("(")))
		{
			Color.InitFromString(DefaultStr);
			return FString::Printf(TEXT("(%.3f,%.3f,%.3f,%.3f)"), Color.R, Color.G, Color.B, Color.A);
		}
	}
	else if (Category == TEXT("PC_Byte") || Category == TEXT("PC_Enum") || Category == TEXT("PC_String"))
	{
		return DefaultStr;
	}
	else if (Category == TEXT("PC_Object") || Category == TEXT("PC_Texture2D"))
	{
		// Handle texture references
		if (!DefaultStr.IsEmpty() && DefaultStr != TEXT("None"))
		{
			// Extract asset path from T3D format
			if (DefaultStr.Contains(TEXT("'")))
			{
				int32 Start = DefaultStr.Find(TEXT("'")) + 1;
				int32 End = DefaultStr.Find(TEXT("'"), ESearchCase::CaseSensitive, ESearchDir::FromStart, Start);
				if (End > Start)
				{
					return DefaultStr.Mid(Start, End - Start);
				}
			}
			return DefaultStr;
		}
	}

	return DefaultStr;
}

bool FMaterialGraphParser::IsValidShortCode(const FString& Text)
{
	if (Text.IsEmpty())
	{
		return false;
	}

	// Check for material short code markers
	if (Text.Contains(TEXT("[")) && Text.Contains(TEXT("]")))
	{
		return true;
	}

	return false;
}

// Helper function to split string
static void SplitString(const FString& Source, const FString& Delimiter, FString& LeftPart, FString& RightPart)
{
	int32 DelimPos = Source.Find(Delimiter);
	if (DelimPos >= 0)
	{
		LeftPart = Source.Left(DelimPos);
		RightPart = Source.Mid(DelimPos + Delimiter.Len());
	}
	else
	{
		LeftPart = Source;
		RightPart = TEXT("");
	}
}

bool FMaterialGraphParser::ParseShortCode(const FString& ShortCode,
	TArray<MaterialParserTypes::FMatNodeDef>& OutNodes,
	TArray<MaterialParserTypes::FMatLinkDef>& OutLinks)
{
	OutNodes.Empty();
	OutLinks.Empty();

	if (!IsValidShortCode(ShortCode))
	{
		return false;
	}

	TArray<FString> Lines;
	ShortCode.ParseIntoArray(Lines, TEXT("\n"), true);

	MaterialParserTypes::FMatNodeDef* CurrentNode = nullptr;

	for (const FString& Line : Lines)
	{
		FString TrimmedLine = Line.TrimStartAndEnd();

		if (TrimmedLine.IsEmpty())
		{
			continue;
		}

		// Skip comment lines
		if (TrimmedLine.StartsWith(TEXT("#")))
		{
			continue;
		}

		// Check for connection line
		if (TrimmedLine.Contains(TEXT("->")))
		{
			MaterialParserTypes::FMatLinkDef Link;
			FString ConnStr = TrimmedLine;
			FString SourcePart, TargetPart;
			SplitString(ConnStr, TEXT("->"), SourcePart, TargetPart);

			if (!SourcePart.IsEmpty() && !TargetPart.IsEmpty())
			{
				Link.SourceNodeId = SourcePart.TrimStartAndEnd();
				Link.TargetNodeId = TargetPart.TrimStartAndEnd();

				// Parse pin names
				if (Link.SourceNodeId.Contains(TEXT(".")))
				{
					FString NodePart, PinPart;
					SplitString(Link.SourceNodeId, TEXT("."), NodePart, PinPart);
					Link.SourceNodeId = NodePart.TrimStartAndEnd();
					Link.SourcePin = PinPart.TrimStartAndEnd();
				}

				if (Link.TargetNodeId.Contains(TEXT(".")))
				{
					FString NodePart, PinPart;
					SplitString(Link.TargetNodeId, TEXT("."), NodePart, PinPart);
					Link.TargetNodeId = NodePart.TrimStartAndEnd();
					Link.TargetPin = PinPart.TrimStartAndEnd();
				}

				OutLinks.Add(Link);
			}
			continue;
		}

		// Check for node definition line
		if (TrimmedLine.Contains(TEXT("[")) && TrimmedLine.Contains(TEXT("]")))
		{
			MaterialParserTypes::FMatNodeDef NodeDef;

			// Parse format: "NodeName [ClassName] [X, Y]"
			FString NodeId, Rest;
			SplitString(TrimmedLine, TEXT("["), NodeId, Rest);

			if (!NodeId.IsEmpty() && !Rest.IsEmpty())
			{
				NodeId = NodeId.TrimStartAndEnd();
				NodeDef.NodeId = NodeId;

				// Extract class name
				FString ClassName, PositionPart;
				SplitString(Rest, TEXT("]"), ClassName, PositionPart);

				if (!ClassName.IsEmpty())
				{
					NodeDef.ClassName = ClassName.TrimStartAndEnd();

					// Extract position [X, Y]
					if (PositionPart.Contains(TEXT("[")))
					{
						FString PosStr;
						SplitString(PositionPart, TEXT("["), PosStr, PosStr);

						// Remove trailing ]
						PosStr = PosStr.Replace(TEXT("]"), TEXT(""));

						TArray<FString> PosParts;
						PosStr.ParseIntoArray(PosParts, TEXT(","), true);
						if (PosParts.Num() >= 2)
						{
							NodeDef.PosX = FCString::Atof(*PosParts[0].TrimStartAndEnd());
							NodeDef.PosY = FCString::Atof(*PosParts[1].TrimStartAndEnd());
						}
					}
				}

				OutNodes.Add(NodeDef);
				CurrentNode = &OutNodes.Last();
			}
		}
		else if (CurrentNode && TrimmedLine.Contains(TEXT("=")))
		{
			// Parse pin value line
			FString PinName, PinValue;
			SplitString(TrimmedLine, TEXT("="), PinName, PinValue);

			if (!PinName.IsEmpty() && !PinValue.IsEmpty())
			{
				PinName = PinName.TrimStartAndEnd();
				PinValue = PinValue.TrimStartAndEnd();
				CurrentNode->InputValues.Add(PinName, PinValue);
			}
		}
		else
		{
			// End of current node
			CurrentNode = nullptr;
		}
	}

	return true;
}

FString FMaterialGraphParser::NodesToT3D(const TArray<UEdGraphNode*>& Nodes)
{
	if (Nodes.IsEmpty())
	{
		return TEXT("");
	}

	FString T3DOutput;
	TSet<UObject*> NodeSet;
	for (UEdGraphNode* Node : Nodes)
	{
		NodeSet.Add(Node);
	}
	FEdGraphUtilities::ExportNodesToText(NodeSet, T3DOutput);
	return T3DOutput;
}

#undef LOCTEXT_NAMESPACE
