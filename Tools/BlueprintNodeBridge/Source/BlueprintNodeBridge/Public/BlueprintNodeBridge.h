#pragma once

#include "Modules/ModuleManager.h"
#include "GraphEditor.h"

class FBlueprintNodeBridgeModule : public IModuleInterface
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

	// Menu action handlers
	void PasteShortCodeClicked();
	void CopyAsShortCodeClicked();
	void FormatNodesClicked();
	void CopyAIRulesClicked();
	void ManageTemplatesClicked();
	void EditAIRulesClicked();

private:
	void RegisterMenus();
	void UnregisterMenus();

	bool IsBlueprintEditorFocused() const;

	FString GenerateShortCodeFromSelection() const;
	bool PasteNodesFromText(const FString& ShortCodeText) const;

	// Helper methods
	TArray<UEdGraphNode*> GetSelectedNodes() const;
	TSharedPtr<SGraphEditor> GetFocusedGraphEditor() const;
	UBlueprint* GetCurrentBlueprint() const;
	UEdGraph* GetCurrentGraph() const;

	// Cache management
	void SaveCache();
	void LoadCache();
	void OpenCacheFolder();
	FString GetAIRulesContent() const;

private:
	TSharedPtr<class FUICommandList> PluginCommands;
	FDelegateHandle MenuExtenderHandle;

	// Node template cache: NodeType -> T3D Content
	TMap<FString, FString> NodeTemplateCache;
};
