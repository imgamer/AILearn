#pragma once

#include "Modules/ModuleManager.h"

class FMaterialNodeBridgeModule : public IModuleInterface
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

	void PasteShortCodeClicked();
	void CopyAsShortCodeClicked();
	void FormatNodesClicked();
	void CopyAIRulesClicked();
	void ManageTemplatesClicked();
	void EditAIRulesClicked();

private:
	void RegisterMenus();
	void UnregisterMenus();

	bool IsMaterialEditorFocused() const;

	FString GenerateShortCodeFromSelection() const;
	bool PasteNodesFromText(const FString& ShortCodeText) const;

	TArray<class UEdGraphNode*> GetSelectedNodes() const;
	TSharedPtr<class SGraphEditor> GetFocusedGraphEditor() const;
	class UMaterial* GetCurrentMaterial() const;
	class UMaterialGraph* GetCurrentGraph() const;

	void SaveCache();
	void LoadCache();
	void OpenCacheFolder();
	FString GetAIRulesContent() const;

private:
	TSharedPtr<class FUICommandList> PluginCommands;
	FDelegateHandle MenuExtenderHandle;

	TMap<FString, FString> NodeTemplateCache;
};
