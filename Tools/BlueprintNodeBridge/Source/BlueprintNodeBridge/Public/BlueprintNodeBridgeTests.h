#pragma once

#include "CoreMinimal.h"
#include "TextGraphParser.h"
#include "NodeGraphFormatter.h"

struct FTestResult
{
	bool bPassed;
	FString Message;

	FTestResult(bool InPassed, const TCHAR* InMsg) : bPassed(InPassed), Message(InMsg) {}
};

#define RUN_TEST(TestName) void TestName(TArray<FTestResult>& OutResults)
#define CHECK(Condition, Msg) if (!(Condition)) { OutResults.Add(FTestResult(false, Msg)); return; } OutResults.Add(FTestResult(true, Msg))
#define CHECK_EQUAL(A, B, Msg) CHECK((A) == (B), Msg)
#define CHECK_TRUE(Condition, Msg) CHECK((Condition), Msg)
#define CHECK_FALSE(Condition, Msg) CHECK(!(Condition), Msg)

RUN_TEST(TestEscapeBasic);
RUN_TEST(TestEscapeSpecialChars);
RUN_TEST(TestEscapeNewlines);
RUN_TEST(TestEscapeRoundtrip);
RUN_TEST(TestUnescapeSpecialChars);

RUN_TEST(TestParseNodeSimple);
RUN_TEST(TestParseNodeWithValue);
RUN_TEST(TestParseNodeNoID);
RUN_TEST(TestParseNodeInvalid);
RUN_TEST(TestParseNodeMultiplePins);

RUN_TEST(TestParseLinkSimple);
RUN_TEST(TestParseLinkSimpleForm);
RUN_TEST(TestParseLinkInvalid);

RUN_TEST(TestIsValidShortCodeTrue);
RUN_TEST(TestIsValidShortCodeEmpty);
RUN_TEST(TestIsValidShortCodePartialNodes);
RUN_TEST(TestIsValidShortCodePartialLinks);

RUN_TEST(TestComplexShortCodeParsing);

void RunAllTests();
