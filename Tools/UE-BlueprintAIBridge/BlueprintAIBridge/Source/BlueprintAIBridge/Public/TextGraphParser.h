#pragma once

#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"

class FTextGraphParser
{
public:
    /**
     * Generate Short Code from selected nodes and populate the T3D cache.
     * @param Nodes Selected nodes to process.
     * @param OutNodeCache Map to store the mapping from NodeName (ShortCode base name) to T3D content.
     * @return The generated Short Code string (Text Graph format).
     */
    static FString GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache);

    /**
     * Parse Short Code and paste nodes into the Blueprint.
     * @param ShortCode The Text Graph string.
     * @param Blueprint The target Blueprint.
     * @param NodeCache Map containing cached T3D content for nodes.
     * @param Location The location to paste the nodes (if Zero, will try to find a safe spot).
     * @param TargetGraph The specific graph to paste into (optional).
     * @return True if nodes were successfully prepared in Clipboard, False otherwise.
     */
    static bool ParseAndPaste(const FString& ShortCode, class UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location = FVector2D::ZeroVector, class UEdGraph* TargetGraph = nullptr);

    // Structs for node parsing
    struct FNodeDefinition
    {
        FString Name;
        FString ID;
        TMap<FString, FString> InputPins; // Name -> Value (if any)
        TArray<FString> OutputPins;
    };

    struct FLinkDefinition
    {
        FString SourceNodeID;
        FString SourcePinName;
        FString TargetNodeID;
        FString TargetPinName;
    };

private:

    static FString GetNodeBaseName(UEdGraphNode* Node);
    static FString GetPinValue(UEdGraphPin* Pin);
    static FString EscapePinValue(const FString& Value);
    static FString UnescapePinValue(const FString& Value);

    // Helper to parse a single node definition line
    static bool ParseNodeDefinition(const FString& Line, FNodeDefinition& OutDef);

    // Helper to parse a single link line
    static bool ParseLinkDefinition(const FString& Line, FLinkDefinition& OutLink);
};
