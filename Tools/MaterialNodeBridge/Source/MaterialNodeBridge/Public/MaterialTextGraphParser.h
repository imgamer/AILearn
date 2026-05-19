#pragma once

#include "CoreMinimal.h"
#include "Materials/MaterialExpression.h"

class UMaterialExpression;

struct MATERIALNODEBRIDGE_API FMaterialNodeDefinition
{
	FString Name;
	FString ID;
	TMap<FString, FString> InputPins;
	TArray<FString> OutputPins;
};

struct MATERIALNODEBRIDGE_API FMaterialLinkDefinition
{
	FString SourceNodeID;
	FString SourcePinName;
	FString TargetNodeID;
	FString TargetPinName;
};

class MATERIALNODEBRIDGE_API FMaterialTextGraphParser
{
public:
	static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache);
	static bool ParseAndPaste(const FString& ShortCode, class UMaterial* Material, const TMap<FString, FString>& NodeCache, FVector2D Location, class UMaterialGraph* InTargetGraph);

	static FString GetExpressionBaseName(UMaterialExpression* Expression);
	static FString GetExpressionInputName(int32 InputIndex);
	static FString GetExpressionOutputName(int32 OutputIndex);

	static FString EscapePinValue(const FString& Value);
	static FString UnescapePinValue(const FString& Value);

	static bool ParseNodeDefinition(const FString& Line, FMaterialNodeDefinition& OutDef);
	static bool ParseLinkDefinition(const FString& Line, FMaterialLinkDefinition& OutLink);

	static bool IsValidShortCode(const FString& ShortCode);

	static int32 GetExpressionInputIndex(UMaterialExpression* Expression, const FString& InputName);
	static int32 GetExpressionOutputIndex(UMaterialExpression* Expression, const FString& OutputName);

	static bool ConnectExpressions(
		UMaterialExpression* SourceExpr,
		int32 SourceOutputIndex,
		UMaterialExpression* TargetExpr,
		int32 TargetInputIndex
	);
};
