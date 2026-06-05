#include "MaterialExpressionFactory.h"
#include "MaterialNodeRegistry.h"
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

UMaterialExpression* FMaterialExpressionFactory::CreateExpression(
	UMaterial* Material,
	const FString& NodeName,
	const TMap<FString, FString>& PinValues,
	FVector2D Position
)
{
	if (!Material) return nullptr;

	UClass* ExpressionClass = FMaterialNodeRegistry::GetExpressionClass(NodeName);
	if (!ExpressionClass)
	{
		UE_LOG(LogTemp, Warning, TEXT("FMaterialExpressionFactory: Unknown node type %s"), *NodeName);
		return nullptr;
	}

	UMaterialExpression* NewExpression = NewObject<UMaterialExpression>(
		Material,
		ExpressionClass,
		NAME_None,
		RF_Transactional
	);

	if (NewExpression)
	{
		NewExpression->MaterialExpressionEditorX = (int32)Position.X;
		NewExpression->MaterialExpressionEditorY = (int32)Position.Y;

		Material->Expressions.Add(NewExpression);

		SetExpressionProperties(NewExpression, NodeName, PinValues);
	}

	return NewExpression;
}

void FMaterialExpressionFactory::SetExpressionProperties(
	UMaterialExpression* Expression,
	const FString& NodeName,
	const TMap<FString, FString>& PinValues
)
{
	if (!Expression) return;

	if (UMaterialExpressionConstant* Const = Cast<UMaterialExpressionConstant>(Expression))
	{
		SetConstantProperties(Const, PinValues);
	}
	else if (UMaterialExpressionConstant2Vector* Const2 = Cast<UMaterialExpressionConstant2Vector>(Expression))
	{
		SetConstant2VectorProperties(Const2, PinValues);
	}
	else if (UMaterialExpressionConstant3Vector* Const3 = Cast<UMaterialExpressionConstant3Vector>(Expression))
	{
		SetConstant3VectorProperties(Const3, PinValues);
	}
	else if (UMaterialExpressionConstant4Vector* Const4 = Cast<UMaterialExpressionConstant4Vector>(Expression))
	{
		SetConstant4VectorProperties(Const4, PinValues);
	}
	else if (UMaterialExpressionScalarParameter* ScalarParam = Cast<UMaterialExpressionScalarParameter>(Expression))
	{
		SetScalarParameterProperties(ScalarParam, PinValues);
	}
	else if (UMaterialExpressionVectorParameter* VectorParam = Cast<UMaterialExpressionVectorParameter>(Expression))
	{
		SetVectorParameterProperties(VectorParam, PinValues);
	}
	else if (UMaterialExpressionColorParameter* ColorParam = Cast<UMaterialExpressionColorParameter>(Expression))
	{
		SetColorParameterProperties(ColorParam, PinValues);
	}
	else if (UMaterialExpressionTextureSample* TexSample = Cast<UMaterialExpressionTextureSample>(Expression))
	{
		SetTextureSampleProperties(TexSample, PinValues);
	}
	else if (UMaterialExpressionTextureObject* TexObj = Cast<UMaterialExpressionTextureObject>(Expression))
	{
		SetTextureObjectProperties(TexObj, PinValues);
	}
	else if (UMaterialExpressionTextureSampleParameter2D* TexParam = Cast<UMaterialExpressionTextureSampleParameter2D>(Expression))
	{
		SetTextureSampleParameterProperties(TexParam, PinValues);
	}
	else if (UMaterialExpressionComponentMask* Mask = Cast<UMaterialExpressionComponentMask>(Expression))
	{
		SetComponentMaskProperties(Mask, PinValues);
	}
	else if (UMaterialExpressionAppend* Append = Cast<UMaterialExpressionAppend>(Expression))
	{
		SetAppendProperties(Append, PinValues);
	}
	else if (UMaterialExpressionIf* If = Cast<UMaterialExpressionIf>(Expression))
	{
		SetIfProperties(If, PinValues);
	}
	else if (UMaterialExpressionClamp* Clamp = Cast<UMaterialExpressionClamp>(Expression))
	{
		SetClampProperties(Clamp, PinValues);
	}
	else if (UMaterialExpressionLinearInterpolate* Lerp = Cast<UMaterialExpressionLinearInterpolate>(Expression))
	{
		SetLerpProperties(Lerp, PinValues);
	}
}

void FMaterialExpressionFactory::SetConstantProperties(UMaterialExpressionConstant* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* R = Values.Find(TEXT("R")))
	{
		Expr->R = FCString::Atof(*(*R));
	}
	else if (const FString* Value = Values.Find(TEXT("Value")))
	{
		Expr->R = FCString::Atof(*(*Value));
	}
}

void FMaterialExpressionFactory::SetConstant2VectorProperties(UMaterialExpressionConstant2Vector* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* R = Values.Find(TEXT("R")))
	{
		Expr->R = FCString::Atof(*(*R));
	}
	if (const FString* G = Values.Find(TEXT("G")))
	{
		Expr->G = FCString::Atof(*(*G));
	}
}

void FMaterialExpressionFactory::SetConstant3VectorProperties(UMaterialExpressionConstant3Vector* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* R = Values.Find(TEXT("R")))
	{
		Expr->R = FCString::Atof(*(*R));
	}
	if (const FString* G = Values.Find(TEXT("G")))
	{
		Expr->G = FCString::Atof(*(*G));
	}
	if (const FString* B = Values.Find(TEXT("B")))
	{
		Expr->B = FCString::Atof(*(*B));
	}
}

void FMaterialExpressionFactory::SetConstant4VectorProperties(UMaterialExpressionConstant4Vector* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* R = Values.Find(TEXT("R")))
	{
		Expr->R = FCString::Atof(*(*R));
	}
	if (const FString* G = Values.Find(TEXT("G")))
	{
		Expr->G = FCString::Atof(*(*G));
	}
	if (const FString* B = Values.Find(TEXT("B")))
	{
		Expr->B = FCString::Atof(*(*B));
	}
	if (const FString* A = Values.Find(TEXT("A")))
	{
		Expr->A = FCString::Atof(*(*A));
	}
}

void FMaterialExpressionFactory::SetScalarParameterProperties(UMaterialExpressionScalarParameter* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* Name = Values.Find(TEXT("Name")))
	{
		Expr->ParameterName = FName(*(*Name));
	}
	if (const FString* Value = Values.Find(TEXT("Value")))
	{
		Expr->DefaultValue = FCString::Atof(*(*Value));
	}
}

void FMaterialExpressionFactory::SetVectorParameterProperties(UMaterialExpressionVectorParameter* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* Name = Values.Find(TEXT("Name")))
	{
		Expr->ParameterName = FName(*(*Name));
	}

	FLinearColor DefaultColor(1.0f, 1.0f, 1.0f, 1.0f);
	if (const FString* R = Values.Find(TEXT("R")))
	{
		DefaultColor.R = FCString::Atof(*(*R));
	}
	if (const FString* G = Values.Find(TEXT("G")))
	{
		DefaultColor.G = FCString::Atof(*(*G));
	}
	if (const FString* B = Values.Find(TEXT("B")))
	{
		DefaultColor.B = FCString::Atof(*(*B));
	}
	if (const FString* A = Values.Find(TEXT("A")))
	{
		DefaultColor.A = FCString::Atof(*(*A));
	}
	Expr->DefaultValue = DefaultColor;
}

void FMaterialExpressionFactory::SetColorParameterProperties(UMaterialExpressionColorParameter* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* Name = Values.Find(TEXT("Name")))
	{
		Expr->ParameterName = FName(*(*Name));
	}

	FLinearColor DefaultColor(1.0f, 1.0f, 1.0f, 1.0f);
	if (const FString* R = Values.Find(TEXT("R")))
	{
		DefaultColor.R = FCString::Atof(*(*R));
	}
	if (const FString* G = Values.Find(TEXT("G")))
	{
		DefaultColor.G = FCString::Atof(*(*G));
	}
	if (const FString* B = Values.Find(TEXT("B")))
	{
		DefaultColor.B = FCString::Atof(*(*B));
	}
	if (const FString* A = Values.Find(TEXT("A")))
	{
		DefaultColor.A = FCString::Atof(*(*A));
	}
	Expr->DefaultValue = DefaultColor;
}

void FMaterialExpressionFactory::SetTextureSampleProperties(UMaterialExpressionTextureSample* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;
}

void FMaterialExpressionFactory::SetTextureObjectProperties(UMaterialExpressionTextureObject* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;
}

void FMaterialExpressionFactory::SetTextureSampleParameterProperties(UMaterialExpressionTextureSampleParameter2D* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	if (const FString* Name = Values.Find(TEXT("Name")))
	{
		Expr->ParameterName = FName(*(*Name));
	}
}

void FMaterialExpressionFactory::SetComponentMaskProperties(UMaterialExpressionComponentMask* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	Expr->R = false;
	Expr->G = false;
	Expr->B = false;
	Expr->A = false;

	if (Values.Contains(TEXT("R")))
	{
		Expr->R = true;
	}
	if (Values.Contains(TEXT("G")))
	{
		Expr->G = true;
	}
	if (Values.Contains(TEXT("B")))
	{
		Expr->B = true;
	}
	if (Values.Contains(TEXT("A")))
	{
		Expr->A = true;
	}
}

void FMaterialExpressionFactory::SetAppendProperties(UMaterialExpressionAppend* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;
}

void FMaterialExpressionFactory::SetIfProperties(UMaterialExpressionIf* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;
}

void FMaterialExpressionFactory::SetClampProperties(UMaterialExpressionClamp* Expr, const TMap<FString, FString>& Values)
{
	if (!Expr) return;

	Expr->MinDefault = 0.0f;
	Expr->MaxDefault = 1.0f;

	if (const FString* Min = Values.Find(TEXT("Min")))
	{
		Expr->MinDefault = FCString::Atof(*(*Min));
	}
	if (const FString* Max = Values.Find(TEXT("Max")))
	{
		Expr->MaxDefault = FCString::Atof(*(*Max));
	}
}

void FMaterialExpressionFactory::SetLerpProperties(UMaterialExpressionMaterialFunctionCall* Expr, const TMap<FString, FString>& Values)
{
}
