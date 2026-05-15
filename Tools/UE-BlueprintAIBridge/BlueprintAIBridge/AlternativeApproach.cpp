// 方案 A 的核心思路：
// 不使用 T3D，直接使用 UE 的节点复制 API

bool FTextGraphParser::ParseAndPaste_NewApproach(const FString& ShortCode, UBlueprint* Blueprint, const TMap<FString, FString>& NodeCache, FVector2D Location, UEdGraph* InTargetGraph)
{
    if (!InTargetGraph) return false;

    UEdGraph* TargetGraph = InTargetGraph;
    bool bIsMaterialGraph = TargetGraph->GetClass()->IsChildOf(UMaterialGraph::StaticClass());

    // 解析短代码
    TArray<FNodeDefinition> Definitions;
    TArray<FLinkDefinition> Links;
    ParseShortCode(ShortCode, Definitions, Links);

    if (Definitions.Num() == 0) return false;

    FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteNodes", "Paste Nodes"));
    TargetGraph->Modify();

    // 关键：使用 Copy/Paste Buffer 机制
    // 1. 将缓存中的节点复制到剪贴板
    // 2. 从剪贴板粘贴到目标图

    // 方案 A-1: 对于蓝图
    if (!bIsMaterialGraph && Blueprint)
    {
        // 使用 UE 的节点工厂直接创建节点
        UEdGraphSchema* Schema = TargetGraph->GetSchema();

        TMap<FString, UEdGraphNode*> CreatedNodes;
        float CurrentOffset = 0.0f;

        for (const auto& Def : Definitions)
        {
            if (!NodeCache.Contains(Def.Name)) continue;

            FString NodeT3D = NodeCache[Def.Name];
            TSet<UEdGraphNode*> ImportedNodes;

            // 直接导入到目标图（不通过沙盒）
            FEdGraphUtilities::ImportNodesFromText(TargetGraph, NodeT3D, ImportedNodes);

            if (ImportedNodes.Num() > 0)
            {
                UEdGraphNode* NewNode = *ImportedNodes.CreateIterator();
                NewNode->NodePosX = Location.X + CurrentOffset;
                NewNode->NodePosY = Location.Y;
                NewNode->Modify();
                CreatedNodes.Add(Def.ID, NewNode);
                CurrentOffset += 300.0f;
            }
        }

        // 连线
        ApplyConnections(Links, CreatedNodes);

        FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(Blueprint);
        return CreatedNodes.Num() > 0;
    }

    // 方案 A-2: 对于材质 - 完全不同的方法
    if (bIsMaterialGraph)
    {
        UMaterial* Material = Cast<UMaterial>(TargetGraph->GetOuter());
        if (!Material) return false;

        // 方法1: 使用材质编辑器的原生方法
        // 创建表达式并手动设置所有属性

        for (const auto& Def : Definitions)
        {
            if (Def.Name.StartsWith(TEXT("Constant")))
            {
                // 常量节点
                UMaterialExpressionConstant* ConstExpr = NewObject<UMaterialExpressionConstant>(Material);
                ConstExpr->R = 1.0f;
                ConstExpr->G = 1.0f;
                ConstExpr->B = 1.0f;
                ConstExpr->A = 1.0f;
                Material->GetExpressionCollection().AddExpression(ConstExpr);
                // 创建节点...
            }
            else if (Def.Name.StartsWith(TEXT("TextureSample")))
            {
                // 纹理采样节点
                UMaterialExpressionTextureSample* TexExpr = NewObject<UMaterialExpressionTextureSample>(Material);
                // 设置属性...
                Material->GetExpressionCollection().AddExpression(TexExpr);
            }
            // ... 其他节点类型
        }

        Material->PostEditChange();
        Material->MarkPackageDirty();

        return true;
    }

    return false;
}
