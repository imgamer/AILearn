#include "MaterialParserModule.h"
#include "UObject/UObjectIterator.h"
#include "MaterialParserCommands.h"
#include "MaterialGraphParser.h"
#include "MaterialParserTests.h"
#include "Framework/Commands/UICommandList.h"
#include "Framework/Commands/UICommandInfo.h"
#include "ToolMenus.h"
#include "EdGraphUtilities.h"
#include "ScopedTransaction.h"
#include "Editor.h"
#include "HAL/PlatformApplicationMisc.h"
#include "Framework/Application/SlateApplication.h"
#include "Widgets/SWidget.h"
#include "Selection.h"
#include "MaterialEditorUtilities.h"
#include "Materials/MaterialExpression.h"
#include "Materials/MaterialExpressionConstant.h"
#include "Materials/MaterialExpressionConstant3Vector.h"
#include "Materials/MaterialExpressionConstant4Vector.h"
#include "Materials/MaterialExpressionMultiply.h"
#include "Materials/MaterialExpressionAdd.h"
#include "Materials/MaterialExpressionSubtract.h"
#include "Materials/MaterialExpressionDivide.h"
#include "Materials/MaterialExpressionTextureSample.h"
#include "Materials/MaterialExpressionTextureCoordinate.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraph.h"
#include "Framework/Notifications/NotificationManager.h"
#include "Widgets/Notifications/SNotificationList.h"
#include "Misc/MessageDialog.h"
#include "GraphEditor.h"
#include "Engine/Texture2D.h"

#define LOCTEXT_NAMESPACE "FMaterialParserModule"

void FMaterialParserCommands::RegisterCommands()
{
	UI_COMMAND(CopyAsShortCode, "Copy as Short Code", "Copy selected material nodes as short code", EUserInterfaceActionType::Button, FInputChord(EModifierKey::Control | EModifierKey::Shift, EKeys::C));
	UI_COMMAND(PasteShortCode, "Paste Short Code", "Paste material nodes from short code", EUserInterfaceActionType::Button, FInputChord(EModifierKey::Control | EModifierKey::Shift, EKeys::V));
}

TSharedPtr<FUICommandList> FMaterialParserModule::PluginCommands;

void FMaterialParserModule::StartupModule()
{
	UE_LOG(LogTemp, Log, TEXT("MaterialParser: StartupModule"));
	FMaterialParserCommands::Register();

	PluginCommands = MakeShared<FUICommandList>();

	// Map commands
	PluginCommands->MapAction(
		FMaterialParserCommands::Get().CopyAsShortCode,
		FExecuteAction::CreateLambda([this]() { CopyAsShortCode(); }),
		FCanExecuteAction::CreateLambda([this]() { return IsMaterialEditorFocused(); })
	);

	PluginCommands->MapAction(
		FMaterialParserCommands::Get().PasteShortCode,
		FExecuteAction::CreateLambda([this]() { PasteShortCode(); }),
		FCanExecuteAction::CreateLambda([this]() { return IsMaterialEditorFocused(); })
	);

	// Register toolbar menus
	RegisterMenus();

	// Run tests
	FMaterialParserTests::RunAllTests();
}

void FMaterialParserModule::ShutdownModule()
{
	UE_LOG(LogTemp, Log, TEXT("MaterialParser: ShutdownModule"));
	FMaterialParserCommands::Unregister();
	PluginCommands.Reset();
}

void FMaterialParserModule::RegisterMenus()
{
	// Extend the Material Editor toolbar
	TArray<FName> EditorToolbars = {
		"AssetEditor.MaterialEditor.ToolBar"
	};

	FToolMenuOwnerScoped OwnerScoped(this);

	for (const FName& ToolbarName : EditorToolbars)
	{
		// Create menu under Settings section
		UToolMenu* ToolbarMenu = UToolMenus::Get()->ExtendMenu(ToolbarName);

		// Find or create Settings section
		FToolMenuSection& Section = ToolbarMenu->FindOrAddSection("Settings");

		// Add dropdown menu with our commands
		Section.AddEntry(FToolMenuEntry::InitComboButton(
			TEXT("MaterialParserActions"),
			FUIAction(),
			FOnGetContent::CreateLambda([]()
			{
				FMenuBuilder MenuBuilder(true, PluginCommands);
				MenuBuilder.BeginSection(TEXT("MaterialParser"), LOCTEXT("MaterialParser", "Material Parser"));
				MenuBuilder.AddMenuEntry(FMaterialParserCommands::Get().CopyAsShortCode);
				MenuBuilder.AddMenuEntry(FMaterialParserCommands::Get().PasteShortCode);
				MenuBuilder.EndSection();
				return MenuBuilder.MakeWidget();
			}),
			LOCTEXT("MaterialParser_Label", "Material Parser"),
			LOCTEXT("MaterialParser_Tooltip", "Material Parser Tools"),
			FSlateIcon(FAppStyle::GetAppStyleSetName(), "Icons.Copy"),
			true,
			TEXT("MaterialParserActions")
		));
	}
}

// Helper function to find focused graph editor widget
static TSharedPtr<SWidget> FindFocusedGraphEditor()
{
	TSharedPtr<SWidget> FocusedWidget = FSlateApplication::Get().GetKeyboardFocusedWidget();

	while (FocusedWidget.IsValid())
	{
		if (FocusedWidget->GetTypeAsString() == TEXT("SGraphEditor"))
		{
			return FocusedWidget;
		}
		FocusedWidget = FocusedWidget->GetParentWidget();
	}

	return nullptr;
}

bool FMaterialParserModule::IsMaterialEditorFocused()
{
	// Check if a graph editor is focused
	TSharedPtr<SWidget> GraphEditor = FindFocusedGraphEditor();
	return GraphEditor.IsValid();
}

void FMaterialParserModule::CopyAsShortCode()
{
	UE_LOG(LogTemp, Log, TEXT("MaterialParser: CopyAsShortCode"));

	TSharedPtr<SWidget> GraphEditorWidget = FindFocusedGraphEditor();
	if (!GraphEditorWidget.IsValid())
	{
		UE_LOG(LogTemp, Warning, TEXT("MaterialParser: No graph editor found"));
		return;
	}

	// Get selected nodes from the graph editor
	TArray<UEdGraphNode*> Nodes;

	// Try to get selected nodes via GEditor selection
	if (GEditor)
	{
		USelection* Selection = GEditor->GetSelectedObjects();
		if (Selection)
		{
			for (int32 Idx = 0; Idx < Selection->Num(); ++Idx)
			{
				if (UObject* Obj = Selection->GetSelectedObject(Idx))
				{
					if (UEdGraphNode* Node = Cast<UEdGraphNode>(Obj))
					{
						Nodes.Add(Node);
					}
				}
			}
		}
	}

	if (Nodes.IsEmpty())
	{
		UE_LOG(LogTemp, Warning, TEXT("MaterialParser: No nodes selected"));
		return;
	}

	// Generate short code
	FString ShortCode = FMaterialGraphParser::GenerateShortCode(Nodes);

	if (ShortCode.IsEmpty())
	{
		UE_LOG(LogTemp, Warning, TEXT("MaterialParser: Failed to generate short code"));
		return;
	}

	// Copy to clipboard
	FPlatformApplicationMisc::ClipboardCopy(*ShortCode);

	UE_LOG(LogTemp, Log, TEXT("MaterialParser: Copied short code to clipboard:\n%s"), *ShortCode);
}

// Helper: Find class by name for material expressions
static UClass* FindMaterialExpressionClass(const FString& ClassName)
{
	if (ClassName == TEXT("MaterialExpressionConstant"))
		return UMaterialExpressionConstant::StaticClass();
	if (ClassName == TEXT("MaterialExpressionConstant3Vector"))
		return UMaterialExpressionConstant3Vector::StaticClass();
	if (ClassName == TEXT("MaterialExpressionConstant4Vector"))
		return UMaterialExpressionConstant4Vector::StaticClass();
	if (ClassName == TEXT("MaterialExpressionMultiply"))
		return UMaterialExpressionMultiply::StaticClass();
	if (ClassName == TEXT("MaterialExpressionAdd"))
		return UMaterialExpressionAdd::StaticClass();
	if (ClassName == TEXT("MaterialExpressionSubtract"))
		return UMaterialExpressionSubtract::StaticClass();
	if (ClassName == TEXT("MaterialExpressionDivide"))
		return UMaterialExpressionDivide::StaticClass();
	if (ClassName == TEXT("MaterialExpressionTextureSample"))
		return UMaterialExpressionTextureSample::StaticClass();
	if (ClassName == TEXT("MaterialExpressionTextureCoordinate"))
		return UMaterialExpressionTextureCoordinate::StaticClass();

	// Fallback: try to find by name
	for (TObjectIterator<UClass> It; It; ++It)
	{
		if ((*It)->IsChildOf(UMaterialExpression::StaticClass()) && (*It)->GetName() == ClassName)
		{
			return *It;
		}
	}
	return nullptr;
}

// Helper: Set pin value from string
static void SetPinValueFromString(UEdGraphPin* Pin, const FString& Value)
{
	if (!Pin || Value.IsEmpty())
		return;

	FString Category = Pin->PinType.PinCategory.ToString();

	if (Category == TEXT("PC_Float") || Category == TEXT("PC_Scalar"))
	{
		float FloatVal = FCString::Atof(*Value);
		Pin->DefaultValue = FString::SanitizeFloat(FloatVal);
	}
	else if (Category == TEXT("PC_Vector4") || Category == TEXT("PC_Vector3") ||
		Category == TEXT("PC_Vector2") || Category == TEXT("PC_LinearColor"))
	{
		if (Value.StartsWith(TEXT("(")))
		{
			Pin->DefaultValue = Value;
		}
		else
		{
			float FloatVal = FCString::Atof(*Value);
			Pin->DefaultValue = FString::Printf(TEXT("(%.3f,%.3f,%.3f,%.3f)"), FloatVal, FloatVal, FloatVal, FloatVal);
		}
	}
	else if (Category == TEXT("PC_Byte") || Category == TEXT("PC_Enum"))
	{
		Pin->DefaultValue = Value;
	}
}

// Helper: Get node class name from material expression
static FString GetNodeClassName(UMaterialExpression* Expr)
{
	if (!Expr)
		return TEXT("Unknown");
	return Expr->GetClass()->GetName();
}

void FMaterialParserModule::PasteShortCode()
{
	UE_LOG(LogTemp, Log, TEXT("MaterialParser: PasteShortCode"));

	TSharedPtr<SWidget> GraphEditorWidget = FindFocusedGraphEditor();
	if (!GraphEditorWidget.IsValid())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraphEditor", "No Material Editor found. Please open a Material Editor."));
		return;
	}

	// Read from clipboard
	FString ClipboardText;
	FPlatformApplicationMisc::ClipboardPaste(ClipboardText);

	// Validate format
	if (!FMaterialGraphParser::IsValidShortCode(ClipboardText))
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("InvalidShortCode", "Clipboard does not contain valid Material Short Code."));
		return;
	}

	// Parse short code
	TArray<MaterialParserTypes::FMatNodeDef> NodeDefs;
	TArray<MaterialParserTypes::FMatLinkDef> LinkDefs;

	if (!FMaterialGraphParser::ParseShortCode(ClipboardText, NodeDefs, LinkDefs))
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("ParseFailed", "Failed to parse Short Code."));
		return;
	}

	UE_LOG(LogTemp, Log, TEXT("MaterialParser: Parsed %d nodes and %d links"), NodeDefs.Num(), LinkDefs.Num());

	if (NodeDefs.IsEmpty())
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoNodes", "No nodes found in Short Code."));
		return;
	}

	// Get the target graph from the focused graph editor
	TSharedPtr<SGraphEditor> GraphEditor = StaticCastSharedPtr<SGraphEditor>(GraphEditorWidget);
	UEdGraph* TargetGraph = GraphEditor.IsValid() ? GraphEditor->GetCurrentGraph() : nullptr;

	if (!TargetGraph)
	{
		FMessageDialog::Open(EAppMsgType::Ok, LOCTEXT("NoGraph", "Could not find active Graph. Please focus a Material Editor."));
		return;
	}

	// Begin transaction for undo/redo
	const FScopedTransaction Transaction(NSLOCTEXT("MaterialParser", "PasteNodes", "Paste Material Nodes"));

	TargetGraph->Modify();

	// Map from parsed NodeId to created expression
	TMap<FString, UMaterialExpression*> CreatedExpressions;

	// Step 1: Create all nodes
	for (const MaterialParserTypes::FMatNodeDef& NodeDef : NodeDefs)
	{
		UClass* ExpressionClass = FindMaterialExpressionClass(NodeDef.ClassName);

		if (!ExpressionClass)
		{
			UE_LOG(LogTemp, Warning, TEXT("MaterialParser: Unknown expression class: %s"), *NodeDef.ClassName);
			continue;
		}

		FVector2D NodePos(NodeDef.PosX, NodeDef.PosY);

		// Use FMaterialEditorUtilities to create the expression
		UMaterialExpression* NewExpression = FMaterialEditorUtilities::CreateNewMaterialExpression(
			TargetGraph,
			ExpressionClass,
			NodePos,
			false,  // bAutoSelect - don't select during creation
			true    // bAutoAssignResource
		);

		if (NewExpression)
		{
			CreatedExpressions.Add(NodeDef.NodeId, NewExpression);
			UE_LOG(LogTemp, Log, TEXT("MaterialParser: Created node %s of type %s at [%.0f, %.0f]"),
				*NodeDef.NodeId, *NodeDef.ClassName, NodeDef.PosX, NodeDef.PosY);

			// Set input pin values
			for (const auto& PinPair : NodeDef.InputValues)
			{
				FName PinName(*PinPair.Key);
				UEdGraphPin* Pin = NewExpression->GraphNode ? NewExpression->GraphNode->FindPin(PinName) : nullptr;

				if (Pin)
				{
					SetPinValueFromString(Pin, PinPair.Value);
					UE_LOG(LogTemp, Log, TEXT("  Set pin %s = %s"), *PinPair.Key, *PinPair.Value);
				}
			}

			// Handle special cases for common expression types
			if (UMaterialExpressionConstant* Const = Cast<UMaterialExpressionConstant>(NewExpression))
			{
				if (NodeDef.InputValues.Contains(TEXT("R")))
				{
					Const->R = FCString::Atof(*NodeDef.InputValues[TEXT("R")]);
				}
			}
			else if (UMaterialExpressionConstant3Vector* Const3 = Cast<UMaterialExpressionConstant3Vector>(NewExpression))
			{
				if (NodeDef.InputValues.Contains(TEXT("Constant")))
				{
					FLinearColor Color;
					Color.InitFromString(NodeDef.InputValues[TEXT("Constant")]);
					Const3->Constant = Color;
				}
			}
			else if (UMaterialExpressionConstant4Vector* Const4 = Cast<UMaterialExpressionConstant4Vector>(NewExpression))
			{
				if (NodeDef.InputValues.Contains(TEXT("Constant")))
				{
					FLinearColor Color;
					Color.InitFromString(NodeDef.InputValues[TEXT("Constant")]);
					Const4->Constant = Color;
				}
			}
			else if (UMaterialExpressionTextureSample* TextureSample = Cast<UMaterialExpressionTextureSample>(NewExpression))
			{
				if (NodeDef.InputValues.Contains(TEXT("Texture")))
				{
					FString TexturePath = NodeDef.InputValues[TEXT("Texture")];
					if (!TexturePath.IsEmpty() && TexturePath != TEXT("None"))
					{
						// Try to load the texture
						UTexture2D* Texture = LoadObject<UTexture2D>(nullptr, *TexturePath);
						if (Texture)
						{
							TextureSample->Texture = Texture;
						}
					}
				}
			}
		}
		else
		{
			UE_LOG(LogTemp, Warning, TEXT("MaterialParser: Failed to create node %s of type %s"),
				*NodeDef.NodeId, *NodeDef.ClassName);
		}
	}

	// Step 2: Create connections
	for (const MaterialParserTypes::FMatLinkDef& Link : LinkDefs)
	{
		UMaterialExpression** SourceExpr = CreatedExpressions.Find(Link.SourceNodeId);
		UMaterialExpression** TargetExpr = CreatedExpressions.Find(Link.TargetNodeId);

		if (!SourceExpr || !TargetExpr)
		{
			UE_LOG(LogTemp, Warning, TEXT("MaterialParser: Could not find nodes for link: %s -> %s"),
				*Link.SourceNodeId, *Link.TargetNodeId);
			continue;
		}

		UEdGraphPin* SourcePin = (*SourceExpr)->GraphNode ? (*SourceExpr)->GraphNode->FindPin(Link.SourcePin) : nullptr;
		UEdGraphPin* TargetPin = (*TargetExpr)->GraphNode ? (*TargetExpr)->GraphNode->FindPin(Link.TargetPin) : nullptr;

		if (!SourcePin || !TargetPin)
		{
			UE_LOG(LogTemp, Warning, TEXT("MaterialParser: Could not find pins for link: %s.%s -> %s.%s"),
				*Link.SourceNodeId, *Link.SourcePin, *Link.TargetNodeId, *Link.TargetPin);
			continue;
		}

		// Check if already connected
		bool bAlreadyConnected = false;
		for (UEdGraphPin* LinkedPin : TargetPin->LinkedTo)
		{
			if (LinkedPin == SourcePin)
			{
				bAlreadyConnected = true;
				break;
			}
		}

		if (!bAlreadyConnected)
		{
			SourcePin->Modify();
			TargetPin->Modify();
			SourcePin->MakeLinkTo(TargetPin);
			UE_LOG(LogTemp, Log, TEXT("MaterialParser: Connected %s.%s -> %s.%s"),
				*Link.SourceNodeId, *Link.SourcePin, *Link.TargetNodeId, *Link.TargetPin);
		}
	}

	// Update the material
	FMaterialEditorUtilities::UpdateMaterialAfterGraphChange(TargetGraph);
	FMaterialEditorUtilities::MarkMaterialDirty(TargetGraph);

	// Notify graph changed
	TargetGraph->NotifyGraphChanged();

	// Show success notification
	FNotificationInfo Info(LOCTEXT("PasteSuccess", "Material nodes pasted successfully!"));
	Info.bFireAndForget = true;
	Info.ExpireDuration = 3.0f;
	FSlateNotificationManager::Get().AddNotification(Info);

	UE_LOG(LogTemp, Log, TEXT("MaterialParser: Paste complete. Created %d nodes."), CreatedExpressions.Num());
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FMaterialParserModule, MaterialParser)
