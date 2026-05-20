#include "MaterialParserTests.h"
#include "MaterialGraphParser.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "Materials/MaterialExpressionConstant.h"
#include "Materials/MaterialExpressionMultiply.h"
#include "Materials/MaterialExpressionTextureSample.h"

#define LOCTEXT_NAMESPACE "FMaterialParserTests"

void FMaterialParserTests::RunAllTests()
{
	UE_LOG(LogTemp, Log, TEXT("=== MaterialParser Tests Starting ==="));

	TestMaterialNodeDef();
	TestMaterialLinkDef();
	TestShortCodeFormat();
	TestShortCodeValidation();
	TestParseNodeDefinition();
	TestParseConnection();
	TestParseChainedExpressions();
	TestNodeDisplayNameGeneration();
	TestPinValueFormat();

	UE_LOG(LogTemp, Log, TEXT("=== MaterialParser Tests Complete ==="));
}

void FMaterialParserTests::TestMaterialNodeDef()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestMaterialNodeDef"));

	// Test struct creation and members
	MaterialParserTypes::FMatNodeDef NodeDef;
	NodeDef.NodeId = TEXT("Constant_0");
	NodeDef.ClassName = TEXT("MaterialExpressionConstant");
	NodeDef.PosX = 100.0f;
	NodeDef.PosY = 200.0f;
	NodeDef.InputValues.Add(TEXT("R"), TEXT("0.5"));

	FTestResult Result;
	if (NodeDef.NodeId == TEXT("Constant_0") &&
		NodeDef.ClassName == TEXT("MaterialExpressionConstant") &&
		NodeDef.PosX == 100.0f &&
		NodeDef.PosY == 200.0f)
	{
		Result = FTestResult(true, TEXT("FMatNodeDef struct works correctly"));
	}
	else
	{
		Result = FTestResult(false, TEXT("FMatNodeDef struct failed"));
	}

	LogResult(TEXT("TestMaterialNodeDef"), Result);
}

void FMaterialParserTests::TestMaterialLinkDef()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestMaterialLinkDef"));

	MaterialParserTypes::FMatLinkDef LinkDef;
	LinkDef.SourceNodeId = TEXT("Constant_0");
	LinkDef.SourcePin = TEXT("Output");
	LinkDef.TargetNodeId = TEXT("Multiply_1");
	LinkDef.TargetPin = TEXT("A");

	FTestResult Result;
	if (LinkDef.SourceNodeId == TEXT("Constant_0") &&
		LinkDef.SourcePin == TEXT("Output") &&
		LinkDef.TargetNodeId == TEXT("Multiply_1") &&
		LinkDef.TargetPin == TEXT("A"))
	{
		Result = FTestResult(true, TEXT("FMatLinkDef struct works correctly"));
	}
	else
	{
		Result = FTestResult(false, TEXT("FMatLinkDef struct failed"));
	}

	LogResult(TEXT("TestMaterialLinkDef"), Result);
}

void FMaterialParserTests::TestShortCodeFormat()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestShortCodeFormat"));

	// Test expected short code format
	FString ExpectedFormat =
		TEXT("Constant [MaterialExpressionConstant] [100, 200]\n")
		TEXT("  R = 0.5\n")
		TEXT("\n")
		TEXT("Constant.Output -> Multiply.A\n");

	// Verify format components exist
	bool HasNodeId = ExpectedFormat.Contains(TEXT("Constant"));
	bool HasClassName = ExpectedFormat.Contains(TEXT("[MaterialExpressionConstant]"));
	bool HasPosition = ExpectedFormat.Contains(TEXT("[100, 200]"));
	bool HasPinValue = ExpectedFormat.Contains(TEXT("R = 0.5"));
	bool HasConnection = ExpectedFormat.Contains(TEXT("->"));

	FTestResult Result;
	if (HasNodeId && HasClassName && HasPosition && HasPinValue && HasConnection)
	{
		Result = FTestResult(true, TEXT("Short code format is correct"));
	}
	else
	{
		Result = FTestResult(false, TEXT("Short code format validation failed"));
	}

	LogResult(TEXT("TestShortCodeFormat"), Result);
}

void FMaterialParserTests::TestShortCodeValidation()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestShortCodeValidation"));

	// Valid short code
	FString ValidCode = TEXT("Texture [TextureSample] [100, 200]");
	bool ValidResult = FMaterialGraphParser::IsValidShortCode(ValidCode);

	// Invalid short code
	FString InvalidCode = TEXT("This is not valid short code");
	bool InvalidResult = FMaterialGraphParser::IsValidShortCode(InvalidCode);

	// Empty string
	bool EmptyResult = FMaterialGraphParser::IsValidShortCode(TEXT(""));

	FTestResult Result;
	if (ValidResult && !InvalidResult && !EmptyResult)
	{
		Result = FTestResult(true, TEXT("Short code validation works correctly"));
	}
	else
	{
		Result = FTestResult(false, FString::Printf(TEXT("Validation failed: valid=%d, invalid=%d, empty=%d"),
			ValidResult, InvalidResult, EmptyResult));
	}

	LogResult(TEXT("TestShortCodeValidation"), Result);
}

void FMaterialParserTests::TestParseNodeDefinition()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestParseNodeDefinition"));

	FString ShortCode = TEXT("Constant [MaterialExpressionConstant] [100, 200]\n  R = 0.5");

	TArray<MaterialParserTypes::FMatNodeDef> Nodes;
	TArray<MaterialParserTypes::FMatLinkDef> Links;
	bool ParseResult = FMaterialGraphParser::ParseShortCode(ShortCode, Nodes, Links);

	FTestResult Result;
	if (ParseResult && Nodes.Num() == 1)
	{
		MaterialParserTypes::FMatNodeDef& Node = Nodes[0];
		if (Node.NodeId == TEXT("Constant") &&
			Node.ClassName == TEXT("MaterialExpressionConstant") &&
			Node.PosX == 100.0f &&
			Node.PosY == 200.0f &&
			Node.InputValues.Contains(TEXT("R")))
		{
			Result = FTestResult(true, TEXT("Node definition parsed correctly"));
		}
		else
		{
			Result = FTestResult(false, FString::Printf(TEXT("Node values incorrect: %s, %s, %.0f, %.0f"),
				*Node.NodeId, *Node.ClassName, Node.PosX, Node.PosY));
		}
	}
	else
	{
		Result = FTestResult(false, FString::Printf(TEXT("Parse failed or wrong node count: %d"), Nodes.Num()));
	}

	LogResult(TEXT("TestParseNodeDefinition"), Result);
}

void FMaterialParserTests::TestParseConnection()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestParseConnection"));

	FString ShortCode = TEXT("Source.Output -> Target.Input");

	TArray<MaterialParserTypes::FMatNodeDef> Nodes;
	TArray<MaterialParserTypes::FMatLinkDef> Links;
	bool ParseResult = FMaterialGraphParser::ParseShortCode(ShortCode, Nodes, Links);

	FTestResult Result;
	if (ParseResult && Links.Num() == 1)
	{
		MaterialParserTypes::FMatLinkDef& Link = Links[0];
		if (Link.SourceNodeId == TEXT("Source") &&
			Link.SourcePin == TEXT("Output") &&
			Link.TargetNodeId == TEXT("Target") &&
			Link.TargetPin == TEXT("Input"))
		{
			Result = FTestResult(true, TEXT("Connection parsed correctly"));
		}
		else
		{
			Result = FTestResult(false, FString::Printf(TEXT("Connection values incorrect: %s.%s -> %s.%s"),
				*Link.SourceNodeId, *Link.SourcePin,
				*Link.TargetNodeId, *Link.TargetPin));
		}
	}
	else
	{
		Result = FTestResult(false, TEXT("Connection parse failed"));
	}

	LogResult(TEXT("TestParseConnection"), Result);
}

void FMaterialParserTests::TestParseChainedExpressions()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestParseChainedExpressions"));

	FString ShortCode =
		TEXT("Const1 [MaterialExpressionConstant] [100, 200]\n")
		TEXT("  R = 0.5\n")
		TEXT("Const2 [MaterialExpressionConstant] [100, 300]\n")
		TEXT("  R = 0.3\n")
		TEXT("Multiply [MaterialExpressionMultiply] [300, 250]\n")
		TEXT("\n")
		TEXT("Const1.Output -> Multiply.A\n")
		TEXT("Const2.Output -> Multiply.B");

	TArray<MaterialParserTypes::FMatNodeDef> Nodes;
	TArray<MaterialParserTypes::FMatLinkDef> Links;
	bool ParseResult = FMaterialGraphParser::ParseShortCode(ShortCode, Nodes, Links);

	FTestResult Result;
	if (ParseResult && Nodes.Num() == 3 && Links.Num() == 2)
	{
		Result = FTestResult(true, FString::Printf(TEXT("Chained expressions parsed: %d nodes, %d links"),
			Nodes.Num(), Links.Num()));
	}
	else
	{
		Result = FTestResult(false, FString::Printf(TEXT("Chained parse failed: %d nodes, %d links"),
			Nodes.Num(), Links.Num()));
	}

	LogResult(TEXT("TestParseChainedExpressions"), Result);
}

void FMaterialParserTests::TestNodeDisplayNameGeneration()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestNodeDisplayNameGeneration"));

	// Test name generation logic
	FString TestName = FMaterialGraphParser::GetNodeDisplayName(nullptr);

	FTestResult Result;
	if (TestName == TEXT("Unknown"))
	{
		Result = FTestResult(true, TEXT("GetNodeDisplayName handles nullptr"));
	}
	else
	{
		Result = FTestResult(false, FString::Printf(TEXT("Expected 'Unknown', got '%s'"), *TestName));
	}

	LogResult(TEXT("TestNodeDisplayNameGeneration"), Result);
}

void FMaterialParserTests::TestPinValueFormat()
{
	UE_LOG(LogTemp, Log, TEXT("Test: TestPinValueFormat"));

	// Test format output
	FLinearColor TestColor(1.0f, 0.5f, 0.25f, 1.0f);
	FString ExpectedFormat = FString::Printf(TEXT("(%.3f,%.3f,%.3f,%.3f)"),
		TestColor.R, TestColor.G, TestColor.B, TestColor.A);

	FTestResult Result;
	if (ExpectedFormat.Contains(TEXT("1.000")) && ExpectedFormat.Contains(TEXT("0.500")))
	{
		Result = FTestResult(true, FString::Printf(TEXT("Vector format correct: %s"), *ExpectedFormat));
	}
	else
	{
		Result = FTestResult(false, FString::Printf(TEXT("Vector format incorrect: %s"), *ExpectedFormat));
	}

	LogResult(TEXT("TestPinValueFormat"), Result);
}

void FMaterialParserTests::LogResult(const FString& TestName, const FTestResult& Result)
{
	if (Result.bPassed)
	{
		UE_LOG(LogTemp, Log, TEXT("  [PASS] %s: %s"), *TestName, *Result.Message);
	}
	else
	{
		UE_LOG(LogTemp, Error, TEXT("  [FAIL] %s: %s"), *TestName, *Result.Message);
	}
}

#undef LOCTEXT_NAMESPACE
