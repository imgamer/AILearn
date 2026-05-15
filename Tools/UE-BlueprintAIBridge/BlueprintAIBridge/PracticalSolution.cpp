// ============================================================
// BlueprintAIBridge - 简化务实方案
// ============================================================
// 核心思路：
// 1. 蓝图：使用 T3D 直接导入（已证明可行）
// 2. 材质：暂时禁用，或使用 UE 原生的复制粘贴命令
// ============================================================

bool FTextGraphParser::ParseAndPaste_Practical(const FString& ShortCode, UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location, UEdGraph* InTargetGraph)
{
    if (!InTargetGraph) return false;

    UEdGraph* TargetGraph = InTargetGraph;
    bool bIsMaterialGraph = TargetGraph->GetClass()->IsChildOf(UMaterialGraph::StaticClass());

    // ============ 材质图：暂时不支持 ============
    if (bIsMaterialGraph)
    {
        FMessageDialog::Open(
            EAppMsgType::Ok,
            FText::FromString(TEXT("Material Editor paste is not supported yet.\n\n")
                TEXT("Please use UE's native Copy/Paste (Ctrl+C/Ctrl+V) for material nodes.\n\n")
                TEXT("This plugin currently supports Blueprint graphs only."))
        );
        return false;
    }

    // ============ 蓝图图：简单直接的 T3D 导入 ============
    if (!Blueprint)
    {
        FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(TEXT("Could not find Blueprint for this graph.")));
        return false;
    }

    // 解析短代码
    TArray<FNodeDefinition> Definitions;
    TArray<FLinkDefinition> Links;

    TArray<FString> Lines;
    ShortCode.ParseIntoArrayLines(Lines);

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
        FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(TEXT("No valid node definitions found in Short Code.")));
        return false;
    }

    // 创建事务
    FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteNodes", "Paste Nodes"));
    TargetGraph->Modify();

    TMap<FString, UEdGraphNode*> CreatedNodes;
    float CurrentOffset = 0.0f;

    // 直接导入每个节点
    for (const auto& Def : Definitions)
    {
        if (!NodeCache.Contains(Def.Name))
        {
            UE_LOG(LogTextGraphParser, Warning, TEXT("Node template not found: %s"), *Def.Name);
            continue;
        }

        FString NodeT3D = NodeCache[Def.Name];
        TSet<UEdGraphNode*> ImportedNodes;

        // 核心：直接导入到目标图
        FEdGraphUtilities::ImportNodesFromText(TargetGraph, NodeT3D, ImportedNodes);

        if (ImportedNodes.Num() > 0)
        {
            UEdGraphNode* NewNode = *ImportedNodes.CreateIterator();
            if (NewNode)
            {
                // 设置位置
                NewNode->NodePosX = (int32)(Location.X + CurrentOffset);
                NewNode->NodePosY = (int32)Location.Y;
                NewNode->Modify();

                CreatedNodes.Add(Def.ID, NewNode);
                CurrentOffset += 250.0f;  // 节点间距
            }
        }
    }

    if (CreatedNodes.Num() == 0)
    {
        FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(TEXT("Failed to import any nodes from Short Code.")));
        return false;
    }

    // 应用连线
    for (const FLinkDefinition& Link : Links)
    {
        if (!CreatedNodes.Contains(Link.SourceNodeID) || !CreatedNodes.Contains(Link.TargetNodeID))
            continue;

        UEdGraphNode* SourceNode = CreatedNodes[Link.SourceNodeID];
        UEdGraphNode* TargetNode = CreatedNodes[Link.TargetNodeID];

        if (!SourceNode || !TargetNode) continue;

        UEdGraphPin* SourcePin = SourceNode->FindPin(FName(*Link.SourcePinName));
        UEdGraphPin* TargetPin = TargetNode->FindPin(FName(*Link.TargetPinName));

        // 处理特殊的引脚名称
        if (!SourcePin && Link.SourcePinName == TEXT("outExec"))
            SourcePin = SourceNode->FindPin(UEdGraphSchema_K2::PN_Then);
        if (!TargetPin && Link.TargetPinName == TEXT("inExec"))
            TargetPin = TargetNode->FindPin(UEdGraphSchema_K2::PN_Execute);

        if (SourcePin && TargetPin)
        {
            // 断开现有连接
            if (TargetPin->LinkedTo.Num() > 0)
            {
                TargetPin->BreakAllPinLinks();
            }
            SourcePin->MakeLinkTo(TargetPin);
        }
    }

    // 通知修改
    FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(Blueprint);
    TargetGraph->NotifyGraphChanged();

    // 选中新节点
    if (CreatedNodes.Num() > 0)
    {
        TSet<const UEdGraphNode*> NodesToSelect;
        for (const auto& Pair : CreatedNodes)
        {
            NodesToSelect.Add(Pair.Value);
        }
        TargetGraph->SelectNodeSet(NodesToSelect);
    }

    FNotificationInfo Info(FText::FromString(TEXT("Pasted ") + FText::AsNumber(CreatedNodes.Num()) + TEXT(" nodes successfully")));
    Info.ExpireDuration = 3.0f;
    FSlateNotificationManager::Get().AddNotification(Info);

    return true;
}
