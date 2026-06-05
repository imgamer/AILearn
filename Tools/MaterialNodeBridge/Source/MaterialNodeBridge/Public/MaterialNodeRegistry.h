#pragma once

#include "CoreMinimal.h"
#include "Materials/MaterialExpression.h"

class UMaterial;
class UMaterialExpression;

struct FMaterialNodeInfo
{
	FString ShortName;
	UClass* ExpressionClass;
	TArray<FString> InputNames;
	TArray<FString> OutputNames;
};

class MATERIALNODEBRIDGE_API FMaterialNodeRegistry
{
public:
	static const TMap<FString, FMaterialNodeInfo>& GetNodeRegistry();

	static bool GetNodeInfo(const FString& ShortName, FMaterialNodeInfo& OutInfo);
	static UClass* GetExpressionClass(const FString& ShortName);

	static FString GetExpressionShortName(UMaterialExpression* Expression);
	static TArray<FString> GetInputNames(UMaterialExpression* Expression);
	static TArray<FString> GetOutputNames(UMaterialExpression* Expression);

	static void InitializeRegistry();

private:
	static TMap<FString, FMaterialNodeInfo> NodeRegistry;
	static bool bIsInitialized;
};
