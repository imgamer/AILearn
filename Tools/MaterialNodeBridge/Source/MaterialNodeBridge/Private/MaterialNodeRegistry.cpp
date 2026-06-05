#include "MaterialNodeRegistry.h"
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

TMap<FString, FMaterialNodeInfo> FMaterialNodeRegistry::NodeRegistry;
bool FMaterialNodeRegistry::bIsInitialized = false;

void FMaterialNodeRegistry::InitializeRegistry()
{
	if (bIsInitialized) return;

	NodeRegistry = {
		{TEXT("Constant"), {TEXT("Constant"), UMaterialExpressionConstant::StaticClass(), {}, {TEXT("RGB")}}},
		{TEXT("Constant2Vector"), {TEXT("Constant2Vector"), UMaterialExpressionConstant2Vector::StaticClass(), {}, {TEXT("RGB")}}},
		{TEXT("Constant3Vector"), {TEXT("Constant3Vector"), UMaterialExpressionConstant3Vector::StaticClass(), {}, {TEXT("RGB")}}},
		{TEXT("Constant4Vector"), {TEXT("Constant4Vector"), UMaterialExpressionConstant4Vector::StaticClass(), {}, {TEXT("RGBA")}}},

		{TEXT("Add"), {TEXT("Add"), UMaterialExpressionAdd::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},
		{TEXT("Subtract"), {TEXT("Subtract"), UMaterialExpressionSubtract::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},
		{TEXT("Multiply"), {TEXT("Multiply"), UMaterialExpressionMultiply::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},
		{TEXT("Divide"), {TEXT("Divide"), UMaterialExpressionDivide::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},

		{TEXT("Abs"), {TEXT("Abs"), UMaterialExpressionAbs::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Sine"), {TEXT("Sine"), UMaterialExpressionSine::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Cosine"), {TEXT("Cosine"), UMaterialExpressionCosine::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Tangent"), {TEXT("Tangent"), UMaterialExpressionTangent::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},

		{TEXT("Floor"), {TEXT("Floor"), UMaterialExpressionFloor::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Ceil"), {TEXT("Ceil"), UMaterialExpressionCeil::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Frac"), {TEXT("Frac"), UMaterialExpressionFrac::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Fmod"), {TEXT("Fmod"), UMaterialExpressionConstant::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},

		{TEXT("Max"), {TEXT("Max"), UMaterialExpressionMax::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},
		{TEXT("Min"), {TEXT("Min"), UMaterialExpressionMin::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},

		{TEXT("Clamp"), {TEXT("Clamp"), UMaterialExpressionClamp::StaticClass(), {TEXT("Input"), TEXT("Min"), TEXT("Max")}, {TEXT("Output")}}},
		{TEXT("OneMinus"), {TEXT("OneMinus"), UMaterialExpressionOneMinus::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},

		{TEXT("ComponentMask"), {TEXT("ComponentMask"), UMaterialExpressionComponentMask::StaticClass(), {TEXT("Input")}, {TEXT("Output")}}},
		{TEXT("Append"), {TEXT("Append"), UMaterialExpressionAppend::StaticClass(), {TEXT("A"), TEXT("B")}, {TEXT("Output")}}},

		{TEXT("TextureSample"), {TEXT("TextureSample"), UMaterialExpressionTextureSample::StaticClass(), {TEXT("UVs"), TEXT("TextureObject")}, {TEXT("RGB"), TEXT("R"), TEXT("G"), TEXT("B"), TEXT("A")}}},
		{TEXT("TextureObject"), {TEXT("TextureObject"), UMaterialExpressionTextureObject::StaticClass(), {}, {TEXT("RGB")}}},
		{TEXT("TextureCoordinate"), {TEXT("TextureCoordinate"), UMaterialExpressionTextureCoordinate::StaticClass(), {}, {TEXT("UV")}}},

		{TEXT("ScalarParameter"), {TEXT("ScalarParameter"), UMaterialExpressionScalarParameter::StaticClass(), {}, {TEXT("Output")}}},
		{TEXT("VectorParameter"), {TEXT("VectorParameter"), UMaterialExpressionVectorParameter::StaticClass(), {}, {TEXT("Output")}}},
		{TEXT("ColorParameter"), {TEXT("ColorParameter"), UMaterialExpressionColorParameter::StaticClass(), {}, {TEXT("Output")}}},
		{TEXT("TextureSampleParameter2D"), {TEXT("TextureSampleParameter2D"), UMaterialExpressionTextureSampleParameter2D::StaticClass(), {TEXT("UVs")}, {TEXT("RGB"), TEXT("A")}}},

		{TEXT("Fresnel"), {TEXT("Fresnel"), UMaterialExpressionFresnel::StaticClass(), {TEXT("BaseMaterialExp")}, {TEXT("Output")}}},
		{TEXT("BumpOffset"), {TEXT("BumpOffset"), UMaterialExpressionBumpOffset::StaticClass(), {TEXT("Coordinate"), TEXT("Height"), TEXT("HeightRatio")}, {TEXT("Offset")}}},
		{TEXT("Panner"), {TEXT("Panner"), UMaterialExpressionPanner::StaticClass(), {TEXT("Coordinate"), TEXT("Time")}, {TEXT("Output")}}},
		{TEXT("Rotator"), {TEXT("Rotator"), UMaterialExpressionRotator::StaticClass(), {TEXT("Coordinate"), TEXT("Time")}, {TEXT("Output")}}},
		{TEXT("Time"), {TEXT("Time"), UMaterialExpressionTime::StaticClass(), {}, {TEXT("Output")}}},

		{TEXT("If"), {TEXT("If"), UMaterialExpressionIf::StaticClass(), {TEXT("A"), TEXT("B"), TEXT("AGreaterThanB"), TEXT("AEqualsB"), TEXT("ALessThanB")}, {TEXT("Output")}}},
		{TEXT("Lerp"), {TEXT("Lerp"), UMaterialExpressionLinearInterpolate::StaticClass(), {TEXT("A"), TEXT("B"), TEXT("Alpha")}, {TEXT("Output")}}}
	};

	bIsInitialized = true;
}

const TMap<FString, FMaterialNodeInfo>& FMaterialNodeRegistry::GetNodeRegistry()
{
	if (!bIsInitialized)
	{
		InitializeRegistry();
	}
	return NodeRegistry;
}

bool FMaterialNodeRegistry::GetNodeInfo(const FString& ShortName, FMaterialNodeInfo& OutInfo)
{
	if (!bIsInitialized)
	{
		InitializeRegistry();
	}

	if (const FMaterialNodeInfo* Info = NodeRegistry.Find(ShortName))
	{
		OutInfo = *Info;
		return true;
	}
	return false;
}

UClass* FMaterialNodeRegistry::GetExpressionClass(const FString& ShortName)
{
	if (!bIsInitialized)
	{
		InitializeRegistry();
	}

	if (const FMaterialNodeInfo* Info = NodeRegistry.Find(ShortName))
	{
		return Info->ExpressionClass;
	}
	return nullptr;
}

FString FMaterialNodeRegistry::GetExpressionShortName(UMaterialExpression* Expression)
{
	if (!Expression) return TEXT("Unknown");

	FString ClassName = Expression->GetClass()->GetName();

	if (ClassName.StartsWith(TEXT("MaterialExpression")))
	{
		ClassName = ClassName.RightChop(strlen("MaterialExpression"));
	}

	for (const auto& Pair : NodeRegistry)
	{
		if (Pair.Value.ExpressionClass == Expression->GetClass())
		{
			return Pair.Key;
		}
	}

	return ClassName;
}

TArray<FString> FMaterialNodeRegistry::GetInputNames(UMaterialExpression* Expression)
{
	if (!Expression) return {};

	FString ShortName = GetExpressionShortName(Expression);

	FMaterialNodeInfo Info;
	if (GetNodeInfo(ShortName, Info))
	{
		return Info.InputNames;
	}

	if (UMaterialExpressionAdd* Add = Cast<UMaterialExpressionAdd>(Expression))
	{
		return {TEXT("A"), TEXT("B")};
	}
	if (UMaterialExpressionMultiply* Mul = Cast<UMaterialExpressionMultiply>(Expression))
	{
		return {TEXT("A"), TEXT("B")};
	}
	if (UMaterialExpressionTextureSample* Tex = Cast<UMaterialExpressionTextureSample>(Expression))
	{
		return {TEXT("UVs"), TEXT("Texture")};
	}
	if (UMaterialExpressionConstant* Const = Cast<UMaterialExpressionConstant>(Expression))
	{
		return {};
	}

	return {TEXT("Input")};
}

TArray<FString> FMaterialNodeRegistry::GetOutputNames(UMaterialExpression* Expression)
{
	if (!Expression) return {};

	FString ShortName = GetExpressionShortName(Expression);

	FMaterialNodeInfo Info;
	if (GetNodeInfo(ShortName, Info))
	{
		return Info.OutputNames;
	}

	return {TEXT("Output")};
}
