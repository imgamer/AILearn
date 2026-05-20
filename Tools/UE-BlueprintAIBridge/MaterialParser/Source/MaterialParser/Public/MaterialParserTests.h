#pragma once

#include "CoreMinimal.h"

/**
 * Test result structure
 */
struct FTestResult
{
    bool bPassed;
    FString Message;

    FTestResult() : bPassed(false), Message(TEXT("Not run")) {}
    FTestResult(bool InPassed, const FString& InMessage) : bPassed(InPassed), Message(InMessage) {}
};

/**
 * Unit tests for MaterialParser
 */
class MATERIALPARSER_API FMaterialParserTests
{
public:
    // Test data structures
    static void TestMaterialNodeDef();
    static void TestMaterialLinkDef();

    // Test short code format
    static void TestShortCodeFormat();
    static void TestShortCodeValidation();

    // Test parsing
    static void TestParseNodeDefinition();
    static void TestParseConnection();
    static void TestParseChainedExpressions();

    // Test generation
    static void TestNodeDisplayNameGeneration();

    // Test pin value extraction
    static void TestPinValueFormat();

    // Run all tests
    static void RunAllTests();

private:
    static void LogResult(const FString& TestName, const FTestResult& Result);
};
