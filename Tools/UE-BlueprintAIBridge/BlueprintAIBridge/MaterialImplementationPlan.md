# Material Paste Implementation Plan
# BlueprintAIBridge Plugin - UE 5.6

## Executive Summary

**Status:** Blueprint paste is working correctly. Material paste needs implementation.

**Problem:** The current T3D import approach (`FEdGraphUtilities::ImportNodesFromText()`) works for blueprints but NOT for materials because material nodes have a dual-layer architecture.

**Solution:** Implement a separate material paste path that creates `UMaterialExpression` objects directly and manages the Material->Graph synchronization.

---

## Architecture Analysis

### Why T3D Import Failed for Materials

```
Blueprint Nodes (Single-Layer):
┌─────────────────────────┐
│   UEdGraphNode          │  ──> T3D Import Works
│   - Contains all data   │
│   - Direct pin linking  │
└─────────────────────────┘

Material Nodes (Dual-Layer):
┌─────────────────────────┐
│ UMaterialGraphNode      │  ──> Visual wrapper only
│ - Position, pins        │      T3D Import FAILS
└────────┬────────────────┘
         │
         │ wraps
         ▼
┌─────────────────────────┐
│ UMaterialExpression     │  ──> Actual data/logic
│ - R,G,B,A values        │      Must create directly
│ - Texture references    │
│ - Expression inputs     │
└─────────────────────────┘
```

### Key Differences

| Aspect | Blueprint | Material |
|--------|-----------|----------|
| Outer | UBlueprint | UMaterial |
| Data Class | UEdGraphNode | UMaterialExpression |
| Graph | UEdGraph | UMaterialGraph |
| Connection | `Pin->MakeLinkTo()` | `Expression->ConnectExpression()` |
| Paste Method | `ImportNodesFromText()` | Direct `NewObject<>()` + `RebuildGraph()` |

---

## Implementation Design

### Phase 1: Node Type Mapping System

Create a registry mapping short code names to `UMaterialExpression` classes:

```cpp
// MaterialNodeRegistry.h
struct FMaterialNodeInfo
{
    FString ShortName;
    UClass* ExpressionClass;
    int32 NumInputs;
    int32 NumOutputs;
};

TMap<FString, FMaterialNodeInfo> GMaterialNodeRegistry = {
    // Math nodes
    {TEXT("Constant"), {TEXT("Constant"), UMaterialExpressionConstant::StaticClass(), 0, 1}},
    {TEXT("Add"), {TEXT("Add"), UMaterialExpressionAdd::StaticClass(), 2, 1}},
    {TEXT("Multiply"), {TEXT("Multiply"), UMaterialExpressionMultiply::StaticClass(), 2, 1}},
    {TEXT("Divide"), {TEXT("Divide"), UMaterialExpressionDivide::StaticClass(), 2, 1}},
    {TEXT("Subtract"), {TEXT("Subtract"), UMaterialExpressionSubtract::StaticClass(), 2, 1}},
    {TEXT("Abs"), {TEXT("Abs"), UMaterialExpressionAbs::StaticClass(), 1, 1}},
    {TEXT("Sine"), {TEXT("Sine"), UMaterialExpressionSine::StaticClass(), 1, 1}},
    {TEXT("Cosine"), {TEXT("Cosine"), UMaterialExpressionCosine::StaticClass(), 1, 1}},

    // Texture nodes
    {TEXT("TextureObject"), {TEXT("TextureObject"), UMaterialExpressionTextureObject::StaticClass(), 1, 2}},
    {TEXT("TextureSample"), {TEXT("TextureSample"), UMaterialExpressionTextureSample::StaticClass(), 0, 5}},
    {TEXT("TextureCoordinate"), {TEXT("TextureCoordinate"), UMaterialExpressionTextureCoordinate::StaticClass(), 0, 2}},

    // Vector nodes
    {TEXT("MakeFloat3"), {TEXT("MakeFloat3"), UMaterialExpressionMakeFloat3::StaticClass(), 3, 1}},
    {TEXT("BreakFloat3"), {TEXT("BreakFloat3"), UMaterialExpressionBreakMaterialAttributes::StaticClass(), 1, 3}},
    {TEXT("ComponentMask"), {TEXT("ComponentMask"), UMaterialExpressionComponentMask::StaticClass(), 1, 1}},
    {TEXT("Append"), {TEXT("Append"), UMaterialExpressionAppend::StaticClass(), 2, 1}},

    // Parameter nodes
    {TEXT("ScalarParameter"), {TEXT("ScalarParameter"), UMaterialExpressionScalarParameter::StaticClass(), 0, 1}},
    {TEXT("VectorParameter"), {TEXT("VectorParameter"), UMaterialExpressionVectorParameter::StaticClass(), 0, 1}},
    {TEXT("ColorParameter"), {TEXT("ColorParameter"), UMaterialExpressionColorParameter::StaticClass(), 0, 1}},
    {TEXT("TextureParameter"), {TEXT("TextureParameter"), UMaterialExpressionTextureSampleParameter::StaticClass(), 0, 5}},

    // Utility nodes
    {TEXT("If"), {TEXT("If"), UMaterialExpressionIf::StaticClass(), 4, 1}},
    {TEXT("Clamp"), {TEXT("Clamp"), UMaterialExpressionClamp::StaticClass(), 3, 1}},
    {TEXT("Lerp"), {TEXT("Lerp"), UMaterialExpressionLinearInterpolate::StaticClass(), 3, 1}},
    {TEXT("Time"), {TEXT("Time"), UMaterialExpressionTime::StaticClass(), 0, 1}},
    {TEXT("ViewSize"), {TEXT("ViewSize"), UMaterialExpressionViewSize::StaticClass(), 0, 2}},

    // Material attributes
    {TEXT("MaterialAttributes"), {TEXT("MaterialAttributes"), UMaterialExpressionMaterialAttributeLayers::StaticClass(), 1, 1}},
};
```

### Phase 2: Material Expression Factory

```cpp
// MaterialExpressionFactory.h
class MATERIALPASTECODE_API FMaterialExpressionFactory
{
public:
    // Create expression from short code node name
    static UMaterialExpression* CreateExpression(
        UMaterial* Material,
        const FString& NodeName,
        const TMap<FString, FString>& PinValues
    );

    // Set expression properties from pin values
    static void SetExpressionProperties(
        UMaterialExpression* Expression,
        const TMap<FString, FString>& PinValues
    );

private:
    // Property setters for specific expression types
    static void SetConstantProperties(UMaterialExpressionConstant* Expr, const TMap<FString, FString>& Values);
    static void SetVectorProperties(UMaterialExpressionVectorParameter* Expr, const TMap<FString, FString>& Values);
    static void SetTextureProperties(UMaterialExpressionTextureSample* Expr, const TMap<FString, FString>& Values);
    static void SetParameterProperties(UMaterialExpressionScalarParameter* Expr, const TMap<FString, FString>& Values);
    // ... more setters
};
```

### Phase 3: Expression Connection System

Material expressions use `FExpressionInput` instead of `UEdGraphPin`:

```cpp
// MaterialConnectionManager.h
class MATERIALPASTECODE_API FMaterialConnectionManager
{
public:
    // Connect two expressions: SourceExpression -> TargetExpression[InputIndex]
    static bool ConnectExpressions(
        UMaterialExpression* SourceExpr,
        int32 SourceOutputIndex,
        UMaterialExpression* TargetExpr,
        int32 TargetInputIndex
    );

    // Parse link definition and connect
    static bool ApplyLink(
        const FLinkDefinition& Link,
        const TMap<FString, UMaterialExpression*>& CreatedExpressions
    );

private:
    // Get expression input by name
    static FExpressionInput* GetExpressionInput(UMaterialExpression* Expr, const FString& InputName);

    // Map input names to indices for different expression types
    static int32 GetInputIndex(UMaterialExpression* Expr, const FString& InputName);
    static int32 GetOutputIndex(UMaterialExpression* Expr, const FString& OutputName);
};
```

### Phase 4: Main Paste Function

```cpp
// TextGraphParser.cpp - Material-specific implementation
bool FTextGraphParser::ParseAndPaste_Material(
    const FString& ShortCode,
    UMaterial* Material,
    const TMap<FString, FString>& NodeCache,
    FVector2D Location,
    UMaterialGraph* InTargetGraph
)
{
    if (!Material || !InTargetGraph) return false;

    // Step 1: Parse short code into definitions and links
    TArray<FNodeDefinition> Definitions;
    TArray<FLinkDefinition> Links;
    if (!ParseShortCode(ShortCode, Definitions, Links)) return false;

    // Step 2: Start transaction
    FScopedTransaction Transaction(NSLOCTEXT("BlueprintAIBridge", "PasteMaterialNodes", "Paste Material Nodes"));
    Material->Modify();

    // Step 3: Create all expressions
    TMap<FString, UMaterialExpression*> CreatedExpressions;
    float CurrentOffset = 0.0f;

    for (const auto& Def : Definitions)
    {
        UMaterialExpression* NewExpr = FMaterialExpressionFactory::CreateExpression(
            Material, Def.Name, Def.InputPins
        );

        if (NewExpr)
        {
            // Set position
            NewExpr->MaterialExpressionEditorX = (int32)(Location.X + CurrentOffset);
            NewExpr->MaterialExpressionEditorY = (int32)Location.Y;

            // Add to material
            Material->Expressions.Add(NewExpr);
            Material->MaterialGraph->AddExpression(NewExpr, false);

            CreatedExpressions.Add(Def.ID, NewExpr);
            CurrentOffset += 300.0f;
        }
    }

    if (CreatedExpressions.Num() == 0) return false;

    // Step 4: Apply connections
    for (const FLinkDefinition& Link : Links)
    {
        FMaterialConnectionManager::ApplyLink(Link, CreatedExpressions);
    }

    // Step 5: Sync graph (create visual nodes)
    Material->MaterialGraph->LinkMaterialExpressionsFromGraph();
    Material->MaterialGraph->RebuildGraph();

    // Step 6: Finalize
    Material->PostEditChange();
    Material->MarkPackageDirty();

    return true;
}
```

---

## Implementation Steps

### Step 1: Create New Files

```
BlueprintAIBridge/Source/BlueprintAIBridge/Private/
├── MaterialNodeRegistry.cpp      // Node type mapping
├── MaterialExpressionFactory.cpp // Expression creation
└── MaterialConnectionManager.cpp // Connection handling
```

### Step 2: Update Headers

```cpp
// TextGraphParser.h
class FTextGraphParser
{
public:
    // Existing methods...
    static bool ParseAndPaste_Material(
        const FString& ShortCode,
        UMaterial* Material,
        const TMap<FString, FString>& NodeCache,
        FVector2D Location,
        UMaterialGraph* InTargetGraph
    );
};
```

### Step 3: Update Main Paste Function

```cpp
// TextGraphParser.cpp - ParseAndPaste()
bool FTextGraphParser::ParseAndPaste(...)
{
    if (!InTargetGraph) return false;

    bool bIsMaterialGraph = TargetGraph->GetClass()->IsChildOf<UMaterialGraph::StaticClass>();

    if (bIsMaterialGraph)
    {
        // Use new material implementation
        UMaterial* Material = Cast<UMaterial>(TargetGraph->GetOuter());
        return ParseAndPaste_Material(ShortCode, Material, NodeCache, Location, Cast<UMaterialGraph>(InTargetGraph));
    }

    // Existing blueprint implementation...
}
```

---

## Dependencies to Add

```cpp
// BlueprintAIBridge.Build.cs
PublicDependencyModuleNames.AddRange(new string[] {
    "Core", "CoreUObject", "Engine", "UnrealEd", "BlueprintGraph",
    "MaterialEditor",  // Already present
    "MaterialDomains", // May need to add
});

// Additional includes needed:
#include "Materials/MaterialExpression.h"
#include "Materials/MaterialExpressionConstant.h"
#include "Materials/MaterialExpressionAdd.h"
#include "Materials/MaterialExpressionMultiply.h"
#include "Materials/MaterialExpressionTextureSample.h"
#include "Materials/MaterialExpressionScalarParameter.h"
#include "Materials/MaterialExpressionVectorParameter.h"
#include "Materials/MaterialExpressionColorParameter.h"
#include "Materials/MaterialExpressionTextureSampleParameter.h"
#include "Materials/MaterialExpressionTextureObject.h"
#include "Materials/MaterialExpressionMakeFloat3.h"
#include "Materials/MaterialExpressionComponentMask.h"
#include "Materials/MaterialExpressionAppend.h"
#include "Materials/MaterialExpressionIf.h"
#include "Materials/MaterialExpressionClamp.h"
#include "Materials/MaterialExpressionLinearInterpolate.h"
#include "Materials/MaterialExpressionTime.h"
// ... and more
```

---

## Short Code Format for Materials

The existing short code format is compatible:

```
# --- Node Definitions ---
Constant_1 (R\\(1.0\\)) : ()
Multiply_2 (A; B) : ()
TextureSample_3 () : (RGB; A; )

# --- Links ---
Constant_1 (Result) -> Multiply_2 (A)
TextureSample_3 (RGB) -> Multiply_2 (B)
```

**Pin Name Mapping Required:**

| Expression | Input Names | Output Names |
|------------|-------------|--------------|
| Constant | - | Result |
| Add/Multiply | A, B | Result |
| TextureSample | - | RGB, A, R, G, B |
| MakeFloat3 | X, Y, Z | Result |
| ComponentMask | Input | R, G, B, A |
| ScalarParameter | - | Default Value |
| Time | - | Sine, Cosine |

---

## Testing Strategy

1. **Unit Tests:**
   - Test expression creation for each node type
   - Test property setting from pin values
   - Test expression connections

2. **Integration Tests:**
   - Paste single constant node
   - Paste connected multiply-add chain
   - Paste texture with parameter

3. **Edge Cases:**
   - Circular connections (should fail gracefully)
   - Missing node types (show error, don't crash)
   - Invalid connections (type mismatch)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Expression creation fails | Low | High | Add validation, show error dialog |
| Connections don't work | Medium | High | Test thoroughly, debug with log |
| Wrong pin names | High | Medium | Comprehensive pin name mapping |
| Material doesn't update | Low | Medium | Ensure PostEditChange() called |
| Performance issues | Low | Low | Batch operations, single RebuildGraph() |

---

## Timeline Estimate

- **Phase 1 (Registry):** 2-3 hours
- **Phase 2 (Factory):** 4-5 hours
- **Phase 3 (Connections):** 3-4 hours
- **Phase 4 (Integration):** 2-3 hours
- **Testing:** 3-4 hours

**Total:** ~14-20 hours of development

---

## Success Criteria

1. Material paste works without crashes
2. Material nodes are properly created and visible
3. Connections work between nodes
4. Material compiles correctly after paste
5. No "ghost nodes" appear
6. Undo/redo works (via transaction)

---

## Next Steps

1. Create `MaterialNodeRegistry.cpp` with full node mapping
2. Implement `FMaterialExpressionFactory` with basic node types (Constant, Add, Multiply)
3. Test basic paste functionality
4. Expand to more node types incrementally
5. Implement connection system
6. Full testing cycle
