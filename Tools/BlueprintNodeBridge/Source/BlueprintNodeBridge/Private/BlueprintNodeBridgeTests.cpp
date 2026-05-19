#pragma once

#include "BlueprintNodeBridgeTests.h"

// Escape/Unescape Tests
RUN_TEST(TestEscapeBasic)
{
	FString Original = TEXT("Hello World");
	FString Escaped = FTextGraphParser::EscapePinValue(Original);
	FString Unescaped = FTextGraphParser::UnescapePinValue(Escaped);
	CHECK_EQUAL(Unescaped, Original, TEXT("Basic escape/unescape roundtrip"));
}

RUN_TEST(TestEscapeSpecialChars)
{
	FString Original = TEXT("Value (123); Test");
	FString Escaped = FTextGraphParser::EscapePinValue(Original);
	CHECK_TRUE(Escaped.Contains(TEXT("\\(")), TEXT("Contains escaped open paren"));
	CHECK_TRUE(Escaped.Contains(TEXT("\\)")), TEXT("Contains escaped close paren"));
	CHECK_TRUE(Escaped.Contains(TEXT("\\;")), TEXT("Contains escaped semicolon"));
}

RUN_TEST(TestEscapeNewlines)
{
	FString Original = TEXT("Line1\nLine2\rTab\tEnd");
	FString Escaped = FTextGraphParser::EscapePinValue(Original);
	CHECK_TRUE(Escaped.Contains(TEXT("\\n")), TEXT("Contains escaped newline"));
	CHECK_TRUE(Escaped.Contains(TEXT("\\r")), TEXT("Contains escaped carriage return"));
	CHECK_TRUE(Escaped.Contains(TEXT("\\t")), TEXT("Contains escaped tab"));
}

RUN_TEST(TestEscapeRoundtrip)
{
	FString Original = TEXT("Test (value); with\\backslash\nand\ttabs");
	FString Escaped = FTextGraphParser::EscapePinValue(Original);
	FString Unescaped = FTextGraphParser::UnescapePinValue(Escaped);
	CHECK_EQUAL(Unescaped, Original, TEXT("Special char roundtrip"));
}

RUN_TEST(TestUnescapeSpecialChars)
{
	FString Escaped = TEXT("Value\\(123\\); Test\\\\backslash");
	FString Unescaped = FTextGraphParser::UnescapePinValue(Escaped);
	CHECK_EQUAL(Unescaped, TEXT("Value(123); Test\\backslash"), TEXT("Unescape special chars"));
}

// Parse Node Definition Tests
RUN_TEST(TestParseNodeSimple)
{
	FString Line = TEXT("Branch_1 (inExec; Condition\\(True\\)): (outExec)");
	FNodeDefinition Def;
	bool bResult = FTextGraphParser::ParseNodeDefinition(Line, Def);
	CHECK_TRUE(bResult, TEXT("ParseNodeDefinition returns true"));
	CHECK_EQUAL(Def.Name, TEXT("Branch"), TEXT("Node name is Branch"));
	CHECK_EQUAL(Def.ID, TEXT("1"), TEXT("Node ID is 1"));
}

RUN_TEST(TestParseNodeWithValue)
{
	FString Line = TEXT("SetHealth_2 (inExec; NewValue\\(100\\)): (outExec)");
	FNodeDefinition Def;
	bool bResult = FTextGraphParser::ParseNodeDefinition(Line, Def);
	CHECK_TRUE(bResult, TEXT("ParseNodeDefinition returns true"));
	CHECK_EQUAL(Def.Name, TEXT("SetHealth"), TEXT("Node name is SetHealth"));
	FString* Value = Def.InputPins.Find(TEXT("NewValue"));
	CHECK_TRUE(Value != nullptr, TEXT("Has NewValue pin"));
	if (Value)
	{
		CHECK_EQUAL(*Value, TEXT("100"), TEXT("NewValue value is 100"));
	}
}

RUN_TEST(TestParseNodeNoID)
{
	FString Line = TEXT("Branch (inExec): (outExec)");
	FNodeDefinition Def;
	bool bResult = FTextGraphParser::ParseNodeDefinition(Line, Def);
	CHECK_TRUE(bResult, TEXT("ParseNodeDefinition returns true"));
	CHECK_EQUAL(Def.ID, TEXT("0"), TEXT("Default ID is 0"));
}

RUN_TEST(TestParseNodeInvalid)
{
	FString Line = TEXT("Not a valid node definition");
	FNodeDefinition Def;
	bool bResult = FTextGraphParser::ParseNodeDefinition(Line, Def);
	CHECK_FALSE(bResult, TEXT("Invalid line returns false"));
}

RUN_TEST(TestParseNodeMultiplePins)
{
	FString Line = TEXT("PrintString_3 (inExec; InString\\(Hello World\\); Print to Screen\\(True\\)): (outExec)");
	FNodeDefinition Def;
	bool bResult = FTextGraphParser::ParseNodeDefinition(Line, Def);
	CHECK_TRUE(bResult, TEXT("Parse returns true"));
	FString* InString = Def.InputPins.Find(TEXT("InString"));
	CHECK_TRUE(InString != nullptr, TEXT("Has InString pin"));
	if (InString)
	{
		CHECK_EQUAL(*InString, TEXT("Hello World"), TEXT("InString value"));
	}
}

// Parse Link Definition Tests
RUN_TEST(TestParseLinkSimple)
{
	FString Line = TEXT("Branch_1 (outExec True) -> Branch_2 (inExec)");
	FLinkDefinition Link;
	bool bResult = FTextGraphParser::ParseLinkDefinition(Line, Link);
	CHECK_TRUE(bResult, TEXT("ParseLinkDefinition returns true"));
	CHECK_EQUAL(Link.SourceNodeID, TEXT("1"), TEXT("Source node ID is 1"));
	CHECK_EQUAL(Link.TargetNodeID, TEXT("2"), TEXT("Target node ID is 2"));
}

RUN_TEST(TestParseLinkSimpleForm)
{
	FString Line = TEXT("Node1 (outExec) -> Node2 (inExec)");
	FLinkDefinition Link;
	bool bResult = FTextGraphParser::ParseLinkDefinition(Line, Link);
	CHECK_TRUE(bResult, TEXT("Parse returns true"));
	CHECK_EQUAL(Link.SourceNodeID, TEXT("Node1"), TEXT("Source node ID"));
	CHECK_EQUAL(Link.TargetNodeID, TEXT("Node2"), TEXT("Target node ID"));
}

RUN_TEST(TestParseLinkInvalid)
{
	FString Line = TEXT("Node1 Node2");
	FLinkDefinition Link;
	bool bResult = FTextGraphParser::ParseLinkDefinition(Line, Link);
	CHECK_FALSE(bResult, TEXT("No arrow returns false"));
}

// IsValidShortCode Tests
RUN_TEST(TestIsValidShortCodeTrue)
{
	FString ValidCode = TEXT("# --- Node Definitions ---\nBranch_1: ()\n# --- Links ---\n");
	CHECK_TRUE(FTextGraphParser::IsValidShortCode(ValidCode), TEXT("Valid short code returns true"));
}

RUN_TEST(TestIsValidShortCodeEmpty)
{
	FString Empty = TEXT("");
	CHECK_FALSE(FTextGraphParser::IsValidShortCode(Empty), TEXT("Empty returns false"));
}

RUN_TEST(TestIsValidShortCodePartialNodes)
{
	FString OnlyNodes = TEXT("# --- Node Definitions ---\nBranch_1: ()");
	CHECK_FALSE(FTextGraphParser::IsValidShortCode(OnlyNodes), TEXT("Missing links returns false"));
}

RUN_TEST(TestIsValidShortCodePartialLinks)
{
	FString OnlyLinks = TEXT("# --- Links ---\nNode1 -> Node2");
	CHECK_FALSE(FTextGraphParser::IsValidShortCode(OnlyLinks), TEXT("Missing node defs returns false"));
}

// Complex Short Code Test
RUN_TEST(TestComplexShortCodeParsing)
{
	FString ShortCode = TEXT("# --- Node Definitions ---\nBranch_1 (inExec): (outExec True, outExec False)\nPrintString_2 (inExec; InString\\(Hello\\)): (outExec)\n# --- Links ---\nBranch_1 (outExec True) -> PrintString_2 (inExec)");

	TArray<FString> Lines;
	ShortCode.ParseIntoArrayLines(Lines);

	int32 NodeCount = 0;
	int32 LinkCount = 0;

	for (const FString& Line : Lines)
	{
		FString Trimmed = Line.TrimStartAndEnd();
		if (Trimmed.IsEmpty() || Trimmed.StartsWith(TEXT("#"))) continue;

		if (Trimmed.Contains(TEXT("->")))
		{
			FLinkDefinition Link;
			if (FTextGraphParser::ParseLinkDefinition(Trimmed, Link))
			{
				LinkCount++;
			}
		}
		else
		{
			FNodeDefinition Def;
			if (FTextGraphParser::ParseNodeDefinition(Trimmed, Def))
			{
				NodeCount++;
			}
		}
	}

	CHECK_EQUAL(NodeCount, 2, TEXT("Should parse 2 nodes"));
	CHECK_EQUAL(LinkCount, 1, TEXT("Should parse 1 link"));
}

// Main test runner
void RunAllTests()
{
	TArray<FTestResult> Results;

	// Run all tests
	TestEscapeBasic(Results);
	TestEscapeSpecialChars(Results);
	TestEscapeNewlines(Results);
	TestEscapeRoundtrip(Results);
	TestUnescapeSpecialChars(Results);

	TestParseNodeSimple(Results);
	TestParseNodeWithValue(Results);
	TestParseNodeNoID(Results);
	TestParseNodeInvalid(Results);
	TestParseNodeMultiplePins(Results);

	TestParseLinkSimple(Results);
	TestParseLinkSimpleForm(Results);
	TestParseLinkInvalid(Results);

	TestIsValidShortCodeTrue(Results);
	TestIsValidShortCodeEmpty(Results);
	TestIsValidShortCodePartialNodes(Results);
	TestIsValidShortCodePartialLinks(Results);

	TestComplexShortCodeParsing(Results);

	// Print results
	int32 Passed = 0;
	int32 Failed = 0;
	for (const FTestResult& Result : Results)
	{
		if (Result.bPassed)
		{
			Passed++;
		}
		else
		{
			Failed++;
			UE_LOG(LogTemp, Error, TEXT("FAILED: %s"), *Result.Message);
		}
	}

	UE_LOG(LogTemp, Display, TEXT("=== Test Results: %d passed, %d failed ==="), Passed, Failed);
}
