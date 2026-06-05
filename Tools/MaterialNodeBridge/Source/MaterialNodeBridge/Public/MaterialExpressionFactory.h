#pragma once

#include "CoreMinimal.h"
#include "Materials/MaterialExpression.h"

class UMaterial;
class UMaterialExpression;

class MATERIALNODEBRIDGE_API FMaterialExpressionFactory
{
public:
	static UMaterialExpression* CreateExpression(
		UMaterial* Material,
		const FString& NodeName,
		const TMap<FString, FString>& PinValues,
		FVector2D Position
	);

	static void SetExpressionProperties(
		UMaterialExpression* Expression,
		const FString& NodeName,
		const TMap<FString, FString>& PinValues
	);

	static void SetConstantProperties(class UMaterialExpressionConstant* Expr, const TMap<FString, FString>& Values);
	static void SetConstant2VectorProperties(class UMaterialExpressionConstant2Vector* Expr, const TMap<FString, FString>& Values);
	static void SetConstant3VectorProperties(class UMaterialExpressionConstant3Vector* Expr, const TMap<FString, FString>& Values);
	static void SetConstant4VectorProperties(class UMaterialExpressionConstant4Vector* Expr, const TMap<FString, FString>& Values);
	static void SetScalarParameterProperties(class UMaterialExpressionScalarParameter* Expr, const TMap<FString, FString>& Values);
	static void SetVectorParameterProperties(class UMaterialExpressionVectorParameter* Expr, const TMap<FString, FString>& Values);
	static void SetColorParameterProperties(class UMaterialExpressionColorParameter* Expr, const TMap<FString, FString>& Values);
	static void SetTextureSampleProperties(class UMaterialExpressionTextureSample* Expr, const TMap<FString, FString>& Values);
	static void SetTextureObjectProperties(class UMaterialExpressionTextureObject* Expr, const TMap<FString, FString>& Values);
	static void SetTextureSampleParameterProperties(class UMaterialExpressionTextureSampleParameter* Expr, const TMap<FString, FString>& Values);
	static void SetComponentMaskProperties(class UMaterialExpressionComponentMask* Expr, const TMap<FString, FString>& Values);
	static void SetAppendProperties(class UMaterialExpressionAppend* Expr, const TMap<FString, FString>& Values);
	static void SetIfProperties(class UMaterialExpressionIf* Expr, const TMap<FString, FString>& Values);
	static void SetClampProperties(class UMaterialExpressionClamp* Expr, const TMap<FString, FString>& Values);
	static void SetLerpProperties(class UMaterialExpressionMaterialFunctionCall* Expr, const TMap<FString, FString>& Values);
};
