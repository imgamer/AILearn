#include "MaterialTextGraphParser.h"
#include "MaterialNodeRegistry.h"
#include "MaterialExpressionFactory.h"
#include "Materials/Material.h"
#include "Materials/MaterialExpression.h"
#include "Materials/MaterialExpressionConstant.h"
#include "Materials/MaterialExpressionConstant2Vector.h"
#include "Materials/MaterialExpressionConstant3Vector.h"
#include "Materials/MaterialExpressionConstant4Vector.h"
#include "Materials/MaterialExpressionAdd.h"
#include "Materials/MaterialExpressionSubtract.h"
#include "Materials/MaterialExpressionMultiply.h"
#include "Materials/MaterialExpressionDivide.h"
#include "Materials/MaterialExpressionAbs.h"
#include "Materials/MaterialExpressionSine.h"
#include "Materials/MaterialExpressionCosine.h"
#include "Materials/MaterialExpressionTangent.h"
#include "Materials/MaterialExpressionFloor.h"
#include "Materials/MaterialExpressionCeil.h"
#include "Materials/MaterialExpressionFrac.h"
#include "Materials/MaterialExpressionMax.h"
#include "Materials/MaterialExpressionMin.h"
#include "Materials/MaterialExpressionClamp.h"
#include "Materials/MaterialExpressionOneMinus.h"
#include "Materials/MaterialExpressionComponentMask.h"
#include "Materials/MaterialExpressionAppend.h"
#include "Materials/MaterialExpressionTextureSample.h"
#include "Materials/MaterialExpressionTextureObject.h"
#include "Materials/MaterialExpressionTextureCoordinate.h"
#include "Materials/MaterialExpressionScalarParameter.h"
#include "Materials/MaterialExpressionVectorParameter.h"
#include "Materials/MaterialExpressionColorParameter.h"
#include "Materials/MaterialExpressionTextureSampleParameter2D.h"
#include "Materials/MaterialExpressionFresnel.h"
#include "Materials/MaterialExpressionBumpOffset.h"
#include "Materials/MaterialExpressionPanner.h"
#include "Materials/MaterialExpressionRotator.h"
#include "Materials/MaterialExpressionTime.h"
#include "Materials/MaterialExpressionIf.h"
#include "Materials/MaterialExpressionLinearInterpolate.h"
#include "MaterialGraph/MaterialGraph.h"
#include "MaterialGraph/MaterialGraphNode.h"
#include "ScopedTransaction.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "Kismet2/BlueprintEditorUtils.h"

DEFINE_LOG_CATEGORY_STATIC(LogMaterialTextGraphParser, Log, All);

FString FMaterialTextGraphParser::GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache)
{
	if (Nodes.Num() == 0) return FString();

	FString NodeDefs;
	FString LinkDefs;

	TMap<UEdGraphNode*, FString> NodeToID;
	TMap<UEdGraphNode*, UMaterialExpression*> NodeToExpression;

	for (int32 i = 0; i < Nodes.Num(); i++)
	{
		UEdGraphNode* Node = Nodes[i];
		if (!Node) continue;

		if (UMaterialGraphNode* GraphNode = Cast<UMaterialGraphNode>(Node))
		{
			UMaterialExpression* Expression = GraphNode->MaterialExpression;
			if (Expression)
			{
				NodeToExpression.Add(Node, Expression);

				FString BaseName = GetExpressionBaseName(Expression);
				FString ID = FString::FromInt(i + 1);
				FString UniqueName = BaseName + TEXT("_") + ID;

				NodeToID.Add(Node, UniqueName);
			}
		}
	}

	for (int32 i = 0; i < Nodes.Num(); i++)
	{
		UEdGraphNode* Node = Nodes[i];
		if (!Node) continue;

		if (!NodeToID.Contains(Node)) continue;

		FString UniqueName = NodeToID[Node];

		FString Inputs;
		FString Outputs;

		if (UMaterialExpression* Expression = NodeToExpression.FindRef(Node))
		{
			TArray<FString> InputNames = FMaterialNodeRegistry::GetInputNames(Expression);
			TArray<FString> OutputNames = FMaterialNodeRegistry::GetOutputNames(Expression);

			for (int32 j = 0; j < InputNames.Num(); j++)
			{
				FString PinName = InputNames[j];
				FString DisplayName = PinName;
				Inputs += FString::Printf(TEXT("%s; "), *DisplayName);
			}

			for (int32 j = 0; j < OutputNames.Num(); j++)
			{
				FString PinName = OutputNames[j];
				FString DisplayName = PinName;
				Outputs += FString::Printf(TEXT("%s; "), *DisplayName);
			}

			FString BaseName = GetExpressionBaseName(Expression);
			FString T3DContent = FMaterialExpressionFactory::CreateExpression(
				Expression->GetMaterial(), BaseName, TMap<FString, FString>(), FVector2D::ZeroVector
			).IsValid() ? TEXT("") : TEXT("");

			OutNodeCache.Add(UniqueName, TEXT(""));
			if (!OutNodeCache.Contains(BaseName))
			{
				OutNodeCache.Add(BaseName, TEXT(""));
			}
		}

		NodeDefs += FString::Printf(TEXT("%s (%s) : (%s)\n"), *UniqueName, *Inputs, *Outputs);
	}

	for (int32 i = 0; i < Nodes.Num(); i++)
	{
		UEdGraphNode* Node = Nodes[i];
		if (!Node) continue;

		if (!NodeToID.Contains(Node)) continue;

		FString SourceID = NodeToID[Node];

		for (UEdGraphPin* Pin : Node->Pins)
		{
			if (!Pin || Pin->Direction != EGPD_Output) continue;

			for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
			{
				if (!LinkedPin) continue;

				UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
				if (NodeToID.Contains(TargetNode))
				{
					FString TargetID = NodeToID[TargetNode];

					LinkDefs += FString::Printf(TEXT("%s (%s) -> %s (%s)\n"),
						*SourceID, *Pin->PinName.ToString(), *TargetID, *LinkedPin->PinName.ToString());
				}
			}
		}
	}

	FString Result;
	Result += TEXT("# --- Node Definitions ---\n");
	Result += NodeDefs;
	Result += TEXT("\n# --- Links ---\n");
	Result += LinkDefs;

	return Result;
}

bool FMaterialTextGraphParser::ParseAndPaste(const FString& ShortCode, UMaterial* Material, const TMap<FString, FString>& NodeCache, FVector2D Location, UMaterialGraph* InTargetGraph)
{
	if (!InTargetGraph || ShortCode.IsEmpty()) return false;
	if (!Material) return false;

	TArray<FString> Lines;
	ShortCode.ParseIntoArrayLines(Lines);

	TMap<FString, FMaterialNodeDefinition> Definitions;
	TArray<FMaterialLinkDefinition> Links;

	for (const FString& Line : Lines)
	{
		FString TrimmedLine = Line.TrimStartAndEnd();
		if (TrimmedLine.IsEmpty() || TrimmedLine.StartsWith(TEXT("#"))) continue;

		if (TrimmedLine.Contains(TEXT("->")))
		{
			FMaterialLinkDefinition Link;
			if (ParseLinkDefinition(TrimmedLine, Link))
			{
				Links.Add(Link);
			}
		}
		else
		{
			FMaterialNodeDefinition Def;
			if (ParseNodeDefinition(TrimmedLine, Def))
			{
				Definitions.Add(Def.ID, Def);
			}
		}
	}

	if (Definitions.Num() == 0)
	{
		return false;
	}

	FScopedTransaction Transaction(NSLOCTEXT("MaterialNodeBridge", "PasteNodes", "Paste Material Nodes"));
	Material->Modify();

	TMap<FString, UMaterialExpression*> CreatedExpressions;

	float CurrentOffset = 0.0f;
	for (const auto& Elem : Definitions)
	{
		FString ID = Elem.Key;
		const FMaterialNodeDefinition& Def = Elem.Value;

		FVector2D NodePos = Location + FVector2D(CurrentOffset, 0);

		UMaterialExpression* NewExpr = FMaterialExpressionFactory::CreateExpression(
			Material, Def.Name, Def.InputPins, NodePos
		);

		if (NewExpr)
		{
			CreatedExpressions.Add(ID, NewExpr);
		}

		CurrentOffset += 300.0f;
	}

	if (CreatedExpressions.Num() == 0)
	{
		return false;
	}

	for (const FMaterialLinkDefinition& Link : Links)
	{
		if (!CreatedExpressions.Contains(Link.SourceNodeID) || !CreatedExpressions.Contains(Link.TargetNodeID))
			continue;

		UMaterialExpression* SourceExpr = CreatedExpressions[Link.SourceNodeID];
		UMaterialExpression* TargetExpr = CreatedExpressions[Link.TargetNodeID];

		if (!SourceExpr || !TargetExpr) continue;

		int32 SourceOutputIndex = GetExpressionOutputIndex(SourceExpr, Link.SourcePinName);
		int32 TargetInputIndex = GetExpressionInputIndex(TargetExpr, Link.TargetPinName);

		if (SourceOutputIndex >= 0 && TargetInputIndex >= 0)
		{
			ConnectExpressions(SourceExpr, SourceOutputIndex, TargetExpr, TargetInputIndex);
		}
	}

	InTargetGraph->LinkMaterialExpressionsFromGraph();
	InTargetGraph->RebuildGraph();

	Material->PostEditChange();
	Material->MarkPackageDirty();

	return true;
}

FString FMaterialTextGraphParser::GetExpressionBaseName(UMaterialExpression* Expression)
{
	if (!Expression) return TEXT("Unknown");

	FString ClassName = Expression->GetClass()->GetName();

	if (ClassName.StartsWith(TEXT("MaterialExpression")))
	{
		ClassName = ClassName.RightChop strlen("MaterialExpression");
	}

	return ClassName;
}

FString FMaterialTextGraphParser::EscapePinValue(const FString& Value)
{
	FString Result = Value;
	Result.ReplaceInline(TEXT("\\"), TEXT("\\\\"));
	Result.ReplaceInline(TEXT("("), TEXT("\\("));
	Result.ReplaceInline(TEXT(")"), TEXT("\\)"));
	Result.ReplaceInline(TEXT(";"), TEXT("\\;"));
	Result.ReplaceInline(TEXT("\n"), TEXT("\\n"));
	Result.ReplaceInline(TEXT("\r"), TEXT("\\r"));
	Result.ReplaceInline(TEXT("\t"), TEXT("\\t"));
	return Result;
}

FString FMaterialTextGraphParser::UnescapePinValue(const FString& Value)
{
	FString Result = Value;
	Result.ReplaceInline(TEXT("\\n"), TEXT("\n"));
	Result.ReplaceInline(TEXT("\\r"), TEXT("\r"));
	Result.ReplaceInline(TEXT("\\t"), TEXT("\t"));
	Result.ReplaceInline(TEXT("\\;"), TEXT(";"));
	Result.ReplaceInline(TEXT("\\("), TEXT("("));
	Result.ReplaceInline(TEXT("\\)"), TEXT(")"));
	Result.ReplaceInline(TEXT("\\\\"), TEXT("\\"));
	return Result;
}

bool FMaterialTextGraphParser::ParseNodeDefinition(const FString& Line, FMaterialNodeDefinition& OutDef)
{
	int32 ParenIdx = Line.Find(TEXT("("));
	if (ParenIdx == INDEX_NONE) return false;

	FString NamePart = Line.Left(ParenIdx).TrimStartAndEnd();
	FString PinsPart = Line.Mid(ParenIdx);

	int32 UnderscoreIdx;
	if (NamePart.FindLastChar('_', UnderscoreIdx))
	{
		OutDef.Name = NamePart.Left(UnderscoreIdx);
		OutDef.ID = NamePart.Mid(UnderscoreIdx + 1);
	}
	else
	{
		OutDef.Name = NamePart;
		OutDef.ID = TEXT("0");
	}

	int32 ColonIdx = PinsPart.Find(TEXT(":"));
	if (ColonIdx == INDEX_NONE) return false;

	FString InputsStr = PinsPart.Left(ColonIdx).TrimStartAndEnd();
	FString OutputsStr = PinsPart.Mid(ColonIdx + 1).TrimStartAndEnd();

	auto ParsePinList = [](const FString& RawList, TMap<FString, FString>* OutMap, TArray<FString>* OutArray)
	{
		FString Content = RawList;
		if (Content.StartsWith(TEXT("("))) Content = Content.RightChop(1);
		if (Content.EndsWith(TEXT(")"))) Content = Content.LeftChop(1);

		TArray<FString> Tokens;
		Content.ParseIntoArray(Tokens, TEXT(";"), true);

		for (FString Token : Tokens)
		{
			Token = Token.TrimStartAndEnd();
			if (Token.IsEmpty()) continue;

			int32 ValStart = Token.Find(TEXT("\\("));
			if (ValStart != INDEX_NONE && Token.EndsWith(TEXT("\\)")))
			{
				FString PinName = Token.Left(ValStart).TrimStartAndEnd();
				FString PinValue = Token.Mid(ValStart + 2, Token.Len() - ValStart - 4);
				PinValue = UnescapePinValue(PinValue);
				if (OutMap) OutMap->Add(PinName, PinValue);
				if (OutArray) OutArray->Add(PinName);
			}
			else
			{
				if (OutMap) OutMap->Add(Token, TEXT(""));
				if (OutArray) OutArray->Add(Token);
			}
		}
	};

	ParsePinList(InputsStr, &OutDef.InputPins, nullptr);
	ParsePinList(OutputsStr, nullptr, &OutDef.OutputPins);

	return true;
}

bool FMaterialTextGraphParser::ParseLinkDefinition(const FString& Line, FMaterialLinkDefinition& OutLink)
{
	FString Separator = TEXT("->");
	int32 ArrowIdx = Line.Find(Separator);
	if (ArrowIdx == INDEX_NONE) return false;

	FString Left = Line.Left(ArrowIdx).TrimStartAndEnd();
	FString Right = Line.Mid(ArrowIdx + 2).TrimStartAndEnd();

	auto ParseNodePin = [](const FString& Part, FString& OutNodeID, FString& OutPin) -> bool
	{
		int32 ParenStart = Part.Find(TEXT("("));
		int32 ParenEnd = Part.Find(TEXT(")"), ESearchCase::IgnoreCase, ESearchDir::FromEnd);

		if (ParenStart != INDEX_NONE && ParenEnd != INDEX_NONE && ParenEnd > ParenStart)
		{
			FString NameID = Part.Left(ParenStart).TrimStartAndEnd();
			OutPin = Part.Mid(ParenStart + 1, ParenEnd - ParenStart - 1).TrimStartAndEnd();

			int32 UnderscoreIdx;
			if (NameID.FindLastChar('_', UnderscoreIdx))
			{
				OutNodeID = NameID.Mid(UnderscoreIdx + 1);
			}
			else
			{
				OutNodeID = NameID;
			}
			return true;
		}
		return false;
	};

	return ParseNodePin(Left, OutLink.SourceNodeID, OutLink.SourcePinName) &&
		   ParseNodePin(Right, OutLink.TargetNodeID, OutLink.TargetPinName);
}

bool FMaterialTextGraphParser::IsValidShortCode(const FString& ShortCode)
{
	if (ShortCode.IsEmpty()) return false;
	return ShortCode.Contains(TEXT("# --- Node Definitions ---")) &&
		   ShortCode.Contains(TEXT("# --- Links ---"));
}

int32 FMaterialTextGraphParser::GetExpressionInputIndex(UMaterialExpression* Expression, const FString& InputName)
{
	if (!Expression) return -1;

	TArray<FString> InputNames = FMaterialNodeRegistry::GetInputNames(Expression);
	return InputNames.IndexOfByKey(InputName);
}

int32 FMaterialTextGraphParser::GetExpressionOutputIndex(UMaterialExpression* Expression, const FString& OutputName)
{
	if (!Expression) return -1;

	TArray<FString> OutputNames = FMaterialNodeRegistry::GetOutputNames(Expression);
	return OutputNames.IndexOfByKey(OutputName);
}

bool FMaterialTextGraphParser::ConnectExpressions(
	UMaterialExpression* SourceExpr,
	int32 SourceOutputIndex,
	UMaterialExpression* TargetExpr,
	int32 TargetInputIndex
)
{
	if (!SourceExpr || !TargetExpr) return false;

	if (SourceOutputIndex == 0)
	{
		TargetExpr->ConnectExpression(&SourceExpr->GetOutputs()[0], TargetInputIndex);
		return true;
	}

	return false;
}
