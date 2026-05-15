#include "TextGraphParser.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphPin.h"
#include "EdGraph/EdGraphSchema.h"
#include "K2Node_CallFunction.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "K2Node_Event.h"
#include "K2Node_IfThenElse.h"
#include "K2Node_Knot.h"
#include "EdGraphUtilities.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "ScopedTransaction.h"
#include "Misc/Guid.h"
#include "Framework/Commands/GenericCommands.h"
#include "Framework/Application/SlateApplication.h"
#include "HAL/PlatformApplicationMisc.h"
#include "Editor/UnrealEd/Public/UnrealEdGlobals.h"
#include "Editor/UnrealEd/Public/Editor.h"

#include "UObject/Package.h"
#include "UObject/UObjectGlobals.h"
#include "Kismet2/CompilerResultsLog.h"
#include "Misc/MessageDialog.h"

DEFINE_LOG_CATEGORY_STATIC(LogTextGraphParser, Log, All);

FString FTextGraphParser::GenerateShortCode(const TArray<UEdGraphNode*>& Nodes, TMap<FString, FString>& OutNodeCache)
{
    FString NodeDefs;
    FString LinkDefs;

    TMap<UEdGraphNode*, FString> NodeToID;

    // First, export ALL nodes together as a complete set to preserve connections
    FString CompleteSetT3D;
    TSet<UObject*> CompleteNodeSet;
    for (UEdGraphNode* Node : Nodes)
    {
        if (Node) CompleteNodeSet.Add(Node);
    }
    FEdGraphUtilities::ExportNodesToText(CompleteNodeSet, CompleteSetT3D);

    for (int32 i = 0; i < Nodes.Num(); i++)
    {
        UEdGraphNode* Node = Nodes[i];
        if (!Node) continue;

        FString BaseName = GetNodeBaseName(Node);
        FString ID = FString::FromInt(i + 1);
        FString UniqueName = BaseName + TEXT("_") + ID;

        NodeToID.Add(Node, UniqueName);

        // Cache the complete set T3D for the first node (used for paste operations)
        // This ensures all nodes are pasted together with their connections intact
        if (i == 0 && !CompleteSetT3D.IsEmpty())
        {
            OutNodeCache.Add(TEXT("__CompleteSet__"), CompleteSetT3D);
        }

        // Cache individual T3D for each node (for reference)
        {
            FString T3DContent;
            TSet<UObject*> NodeSet;
            NodeSet.Add(Node);
            FEdGraphUtilities::ExportNodesToText(NodeSet, T3DContent);
            OutNodeCache.Add(UniqueName, T3DContent);
        }

        // Also cache a template by BaseName for new node creation (without parameters)
        if (!OutNodeCache.Contains(BaseName))
        {
            FString T3DContent;
            TSet<UObject*> NodeSet;
            NodeSet.Add(Node);
            FEdGraphUtilities::ExportNodesToText(NodeSet, T3DContent);
            OutNodeCache.Add(BaseName, T3DContent);
        }

        FString Inputs;
        FString Outputs;

        for (UEdGraphPin* Pin : Node->Pins)
        {
            if (Pin->Direction == EGPD_Input)
            {
                FString PinName = Pin->PinName.ToString();
                if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
                {
                    if (PinName == UEdGraphSchema_K2::PN_Execute.ToString()) PinName = TEXT("inExec");
                }

                FString Value = GetPinValue(Pin);
                if (!Value.IsEmpty())
                {
                    Inputs += FString::Printf(TEXT("%s\\(%s\\); "), *PinName, *EscapePinValue(Value));
                }
                else
                {
                    Inputs += FString::Printf(TEXT("%s; "), *PinName);
                }
            }
            else
            {
                FString PinName = Pin->PinName.ToString();
                if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
                {
                    if (PinName == UEdGraphSchema_K2::PN_Then.ToString()) PinName = TEXT("outExec");
                }
                Outputs += FString::Printf(TEXT("%s; "), *PinName);
            }
        }

        NodeDefs += FString::Printf(TEXT("%s (%s) : (%s)\n"), *UniqueName, *Inputs, *Outputs);
    }

    for (UEdGraphNode* Node : Nodes)
    {
        if (!Node) continue;

        FString SourceID = NodeToID[Node];

        for (UEdGraphPin* Pin : Node->Pins)
        {
            if (Pin->Direction == EGPD_Output)
            {
                for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
                {
                    UEdGraphNode* TargetNode = LinkedPin->GetOwningNode();
                    if (NodeToID.Contains(TargetNode))
                    {
                        FString TargetID = NodeToID[TargetNode];
                        FString SourcePinName = Pin->PinName.ToString();
                        if (SourcePinName == UEdGraphSchema_K2::PN_Then) SourcePinName = TEXT("outExec");

                        FString TargetPinName = LinkedPin->PinName.ToString();
                        if (TargetPinName == UEdGraphSchema_K2::PN_Execute) TargetPinName = TEXT("inExec");

                        LinkDefs += FString::Printf(TEXT("%s (%s) -> %s (%s)\n"),
                            *SourceID, *SourcePinName, *TargetID, *TargetPinName);
                    }
                }
            }
        }
    }

    FString Result;
    Result += TEXT("# --- Node Definitions ---\n");
    Result += NodeDefs;
    Result += TEXT("\n# --- Links ---\n");
    Result += LinkDefs;

    return Result;
}

bool FTextGraphParser::ParseAndPaste(const FString& ShortCode, UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location, UEdGraph* InTargetGraph)
{
    if (!InTargetGraph) return false;

    // Blueprint graphs: Parse and paste
    if (!Blueprint)
    {
        return false;
    }

    // Parse Short Code
    TArray<FString> Lines;
    ShortCode.ParseIntoArrayLines(Lines);

    TMap<FString, FNodeDefinition> Definitions;
    TArray<FLinkDefinition> Links;

    for (const FString& Line : Lines)
    {
        FString TrimmedLine = Line.TrimStartAndEnd();
        if (TrimmedLine.IsEmpty() || TrimmedLine.StartsWith(TEXT("#"))) continue;

        if (TrimmedLine.Contains(TEXT("->")))
        {
            FLinkDefinition Link;
            if (ParseLinkDefinition(TrimmedLine, Link))
            {
                Links.Add(Link);
            }
        }
        else
        {
            FNodeDefinition Def;
            if (ParseNodeDefinition(TrimmedLine, Def))
            {
                Definitions.Add(Def.ID, Def);
            }
        }
    }

    if (Definitions.Num() == 0)
    {
        return false;
    }

    // Start transaction
    FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteNodes", "Paste Nodes"));
    InTargetGraph->Modify();

    TMap<FString, UEdGraphNode*> CreatedNodes;

    // Helper function to replace all GUIDs in T3D text with new unique ones
    // This forces UE to create new nodes instead of reusing existing ones
    auto RegenerateT3DGUIDs = [](const FString& OriginalT3D) -> FString
    {
        FString Result = OriginalT3D;

        // Helper function to check if a character is a valid hex digit
        auto IsHexChar = [](TCHAR Char) -> bool
        {
            return (Char >= TEXT('0') && Char <= TEXT('9')) ||
                   (Char >= TEXT('A') && Char <= TEXT('F')) ||
                   (Char >= TEXT('a') && Char <= TEXT('f'));
        };

        // Find all GUID-like patterns (32 consecutive hex characters) and replace them
        int32 SearchIdx = 0;
        while (true)
        {
            // Look for GUID pattern (32 consecutive hex characters)
            int32 GUIDStart = INDEX_NONE;
            for (int32 i = SearchIdx; i < Result.Len() - 32; i++)
            {
                bool bFoundGUID = true;
                for (int32 j = 0; j < 32; j++)
                {
                    TCHAR Char = Result[i + j];
                    if (!IsHexChar(Char))
                    {
                        bFoundGUID = false;
                        break;
                    }
                }

                if (bFoundGUID)
                {
                    GUIDStart = i;
                    break;
                }
            }

            if (GUIDStart == INDEX_NONE)
            {
                break; // No more GUIDs found
            }

            // Generate a new GUID
            FGuid NewGuid = FGuid::NewGuid();

            // Replace the old GUID with the new one (uppercase, no hyphens)
            FString NewGuidStr = NewGuid.ToString(EGuidFormats::DigitsWithHyphens).Replace(TEXT("-"), TEXT("")).ToUpper();

            Result.RemoveAt(GUIDStart, 32);
            Result.InsertAt(GUIDStart, NewGuidStr);

            // Move search index past this GUID
            SearchIdx = GUIDStart + 32;
        }

        return Result;
    };

    // Create nodes individually, regenerating GUIDs to force new node creation
    float CurrentOffset = 0.0f;
    for (const auto& Elem : Definitions)
    {
        FString ID = Elem.Key;
        const FNodeDefinition& Def = Elem.Value;

        FVector2D NodePos = Location + FVector2D(CurrentOffset, 0);

        // Try to find cached node data
        FString UniqueKey = Def.Name + TEXT("_") + ID;
        FString NodeT3D;

        if (NodeCache.Contains(UniqueKey))
        {
            NodeT3D = NodeCache[UniqueKey];
        }
        else if (NodeCache.Contains(Def.Name))
        {
            NodeT3D = NodeCache[Def.Name];
        }

        if (!NodeT3D.IsEmpty())
        {
            // Regenerate all GUIDs in the T3D to force creation of new nodes
            FString ModifiedT3D = RegenerateT3DGUIDs(NodeT3D);

            TSet<UEdGraphNode*> ImportedNodes;
            FEdGraphUtilities::ImportNodesFromText(InTargetGraph, ModifiedT3D, ImportedNodes);

            if (ImportedNodes.Num() > 0)
            {
                UEdGraphNode* NewNode = *ImportedNodes.CreateIterator();

                if (NewNode)
                {
                    // Position the new node
                    NewNode->NodePosX = FMath::RoundToInt(NodePos.X);
                    NewNode->NodePosY = FMath::RoundToInt(NodePos.Y);
                    NewNode->Modify();

                    CreatedNodes.Add(ID, NewNode);
                }
            }
        }

        CurrentOffset += 250.0f;
    }

    if (CreatedNodes.Num() == 0)
    {
        return false;
    }

    // Reconnect links based on the short code definitions
    for (const FLinkDefinition& Link : Links)
    {
        if (!CreatedNodes.Contains(Link.SourceNodeID) || !CreatedNodes.Contains(Link.TargetNodeID))
            continue;

        UEdGraphNode* SourceNode = CreatedNodes[Link.SourceNodeID];
        UEdGraphNode* TargetNode = CreatedNodes[Link.TargetNodeID];

        if (!SourceNode || !TargetNode) continue;

        UEdGraphPin* SourcePin = SourceNode->FindPin(FName(*Link.SourcePinName));
        UEdGraphPin* TargetPin = TargetNode->FindPin(FName(*Link.TargetPinName));

        if (!SourcePin && Link.SourcePinName == TEXT("outExec"))
            SourcePin = SourceNode->FindPin(UEdGraphSchema_K2::PN_Then);

        if (!TargetPin && Link.TargetPinName == TEXT("inExec"))
            TargetPin = TargetNode->FindPin(UEdGraphSchema_K2::PN_Execute);

        if (SourcePin && TargetPin)
        {
            // Check if this connection already exists
            bool bAlreadyConnected = false;
            for (UEdGraphPin* LinkedPin : TargetPin->LinkedTo)
            {
                if (LinkedPin == SourcePin)
                {
                    bAlreadyConnected = true;
                    break;
                }
            }

            // Only create connection if it doesn't already exist
            if (!bAlreadyConnected)
            {
                SourcePin->MakeLinkTo(TargetPin);
            }
        }
    }

    // Notify blueprint of changes
    FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(Blueprint);
    InTargetGraph->NotifyGraphChanged();

    // Select the newly created nodes
    if (CreatedNodes.Num() > 0)
    {
        TSet<const UEdGraphNode*> NodesToSelect;
        for (const auto& Pair : CreatedNodes)
        {
            NodesToSelect.Add(Pair.Value);
        }
        InTargetGraph->SelectNodeSet(NodesToSelect);
    }

    return true;
}

FString FTextGraphParser::GetNodeBaseName(UEdGraphNode* Node)
{
    if (UK2Node_CallFunction* CallFunc = Cast<UK2Node_CallFunction>(Node))
    {
        if (CallFunc->GetTargetFunction())
        {
            return CallFunc->GetTargetFunction()->GetName();
        }
    }
    else if (UK2Node_VariableGet* VarGet = Cast<UK2Node_VariableGet>(Node))
    {
        return TEXT("Get") + VarGet->VariableReference.GetMemberName().ToString();
    }
    else if (UK2Node_VariableSet* VarSet = Cast<UK2Node_VariableSet>(Node))
    {
        return TEXT("Set") + VarSet->VariableReference.GetMemberName().ToString();
    }
    else if (UK2Node_IfThenElse* Branch = Cast<UK2Node_IfThenElse>(Node))
    {
        return TEXT("Branch");
    }
    else if (UK2Node_Knot* Knot = Cast<UK2Node_Knot>(Node))
    {
        // Reroute node - use consistent naming without ellipsis
        return TEXT("添加变更路线节点");
    }

    FString Title = Node->GetNodeTitle(ENodeTitleType::MenuTitle).ToString();
    Title.ReplaceInline(TEXT(" "), TEXT(""));
    return Title;
}

FString FTextGraphParser::GetPinValue(UEdGraphPin* Pin)
{
    if (!Pin) return TEXT("");

    // For string pins, get the literal string value directly
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_String)
    {
        // First try the DefaultValue directly (for literal string inputs)
        FString StringValue = Pin->DefaultValue;
        if (!StringValue.IsEmpty())
        {
            // UE stores string values with quotes, remove them if present
            StringValue.ReplaceInline(TEXT("\""), TEXT(""));
            return StringValue;
        }

        // Try DefaultObject for string assets
        if (Pin->DefaultObject)
        {
            return Pin->DefaultObject->GetName();
        }

        // If still empty, try GetDefaultAsString
        FString DefaultValue = Pin->GetDefaultAsString();
        if (!DefaultValue.IsEmpty() && DefaultValue != TEXT("(None)"))
        {
            DefaultValue.ReplaceInline(TEXT("\""), TEXT(""));
            return DefaultValue;
        }

        return TEXT("");
    }

    // For enum pins, get the enum value name
    if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Byte && Pin->PinType.PinSubCategoryObject.IsValid())
    {
        FString DefaultValue = Pin->GetDefaultAsString();
        if (UEnum* Enum = Cast<UEnum>(Pin->PinType.PinSubCategoryObject.Get()))
        {
            int64 EnumValue = FCString::Strtoi64(*DefaultValue, nullptr, 10);
            return Enum->GetNameStringByValue(EnumValue);
        }
    }

    // For other types, use GetDefaultAsString
    FString DefaultValue = Pin->GetDefaultAsString();

    // Remove "(None)" for object pins that aren't set
    if (DefaultValue == TEXT("(None)"))
    {
        return TEXT("");
    }

    // Remove quotes from string values
    DefaultValue.ReplaceInline(TEXT("\""), TEXT(""));

    return DefaultValue;
}

FString FTextGraphParser::EscapePinValue(const FString& Value)
{
    FString Result = Value;
    // Escape backslashes first
    Result.ReplaceInline(TEXT("\\"), TEXT("\\\\"));
    // Escape parentheses
    Result.ReplaceInline(TEXT("("), TEXT("\\("));
    Result.ReplaceInline(TEXT(")"), TEXT("\\)"));
    // Escape semicolons
    Result.ReplaceInline(TEXT(";"), TEXT("\\;"));
    // Escape newlines and tabs
    Result.ReplaceInline(TEXT("\n"), TEXT("\\n"));
    Result.ReplaceInline(TEXT("\r"), TEXT("\\r"));
    Result.ReplaceInline(TEXT("\t"), TEXT("\\t"));
    return Result;
}

FString FTextGraphParser::UnescapePinValue(const FString& Value)
{
    FString Result = Value;
    // Unescape in reverse order of escape
    Result.ReplaceInline(TEXT("\\n"), TEXT("\n"));
    Result.ReplaceInline(TEXT("\\r"), TEXT("\r"));
    Result.ReplaceInline(TEXT("\\t"), TEXT("\t"));
    Result.ReplaceInline(TEXT("\\;"), TEXT(";"));
    Result.ReplaceInline(TEXT("\\("), TEXT("("));
    Result.ReplaceInline(TEXT("\\)"), TEXT(")"));
    Result.ReplaceInline(TEXT("\\\\"), TEXT("\\"));
    return Result;
}

bool FTextGraphParser::ParseNodeDefinition(const FString& Line, FNodeDefinition& OutDef)
{
    int32 ParenIdx = Line.Find(TEXT("("));
    if (ParenIdx == INDEX_NONE) return false;

    FString NamePart = Line.Left(ParenIdx).TrimStartAndEnd();
    FString PinsPart = Line.Mid(ParenIdx);

    int32 UnderscoreIdx;
    if (NamePart.FindLastChar('_', UnderscoreIdx))
    {
        OutDef.Name = NamePart.Left(UnderscoreIdx);
        OutDef.ID = NamePart.Mid(UnderscoreIdx + 1);
    }
    else
    {
        OutDef.Name = NamePart;
        OutDef.ID = TEXT("0");
    }

    int32 ColonIdx = PinsPart.Find(TEXT(":"));
    if (ColonIdx == INDEX_NONE) return false;

    FString InputsStr = PinsPart.Left(ColonIdx).TrimStartAndEnd();
    FString OutputsStr = PinsPart.Mid(ColonIdx + 1).TrimStartAndEnd();

    auto ParsePinList = [](const FString& RawList, TMap<FString, FString>* OutMap, TArray<FString>* OutArray)
    {
        FString Content = RawList;
        if (Content.StartsWith(TEXT("("))) Content = Content.RightChop(1);
        if (Content.EndsWith(TEXT(")"))) Content = Content.LeftChop(1);

        TArray<FString> Tokens;
        Content.ParseIntoArray(Tokens, TEXT(";"), true);

        for (FString Token : Tokens)
        {
            Token = Token.TrimStartAndEnd();
            if (Token.IsEmpty()) continue;

            int32 ValStart = Token.Find(TEXT("\\("));
            if (ValStart != INDEX_NONE && Token.EndsWith(TEXT("\\)")))
            {
                FString PinName = Token.Left(ValStart).TrimStartAndEnd();
                FString PinValue = Token.Mid(ValStart + 2, Token.Len() - ValStart - 4);
                if (OutMap) OutMap->Add(PinName, PinValue);
                if (OutArray) OutArray->Add(PinName);
            }
            else
            {
                if (OutMap) OutMap->Add(Token, TEXT(""));
                if (OutArray) OutArray->Add(Token);
            }
        }
    };

    ParsePinList(InputsStr, &OutDef.InputPins, nullptr);
    ParsePinList(OutputsStr, nullptr, &OutDef.OutputPins);

    return true;
}

bool FTextGraphParser::ParseLinkDefinition(const FString& Line, FLinkDefinition& OutLink)
{
    FString Separator = TEXT("->");
    int32 ArrowIdx = Line.Find(Separator);
    if (ArrowIdx == INDEX_NONE) return false;

    FString Left = Line.Left(ArrowIdx).TrimStartAndEnd();
    FString Right = Line.Mid(ArrowIdx + 2).TrimStartAndEnd();

    auto ParseNodePin = [&OutLink](const FString& Part, FString& OutNodeID, FString& OutPin) -> bool
    {
        int32 ParenStart = Part.Find(TEXT("("));
        int32 ParenEnd = Part.Find(TEXT(")"), ESearchCase::IgnoreCase, ESearchDir::FromEnd);

        if (ParenStart != INDEX_NONE && ParenEnd != INDEX_NONE && ParenEnd > ParenStart)
        {
            FString NameID = Part.Left(ParenStart).TrimStartAndEnd();
            OutPin = Part.Mid(ParenStart + 1, ParenEnd - ParenStart - 1).TrimStartAndEnd();

            int32 UnderscoreIdx;
            if (NameID.FindLastChar('_', UnderscoreIdx))
            {
                OutNodeID = NameID.Mid(UnderscoreIdx + 1);
            }
            else
            {
                OutNodeID = NameID;
            }
            return true;
        }
        return false;
    };

    if (ParseNodePin(Left, OutLink.SourceNodeID, OutLink.SourcePinName) &&
        ParseNodePin(Right, OutLink.TargetNodeID, OutLink.TargetPinName))
    {
        return true;
    }

    return false;
}
