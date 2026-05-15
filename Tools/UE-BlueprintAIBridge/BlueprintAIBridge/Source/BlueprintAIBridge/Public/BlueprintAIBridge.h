// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Modules/ModuleManager.h"

class FToolBarBuilder;
class FMenuBuilder;
class UBlueprint;
class UEdGraphNode;

class FBlueprintAIBridgeModule : public IModuleInterface
{
public:

	/** IModuleInterface implementation */
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

	/** Copy selected blueprint nodes as Short Code */
	void CopyShortCodeClicked();

	/** Paste Short Code as blueprint nodes */
	void PasteShortCodeClicked();

	/** Auto-arrange selected nodes */
	void FormatNodesClicked();

private:
	/** Copy AI rules to clipboard */
	void CopyAIRulesClicked();

	/** Open the Template Manager UI */
	void ManageTemplatesClicked();

	/** Edit AI Rules JSON file */
	void EditAIRulesClicked();

	/** Get the node template cache */
	TMap<FString, FString>& GetNodeTemplateCache() { return NodeTemplateCache; }

	/** Save cache to default file */
	void SaveCache();

	/** Load cache from default file */
	void LoadCache();

    /** Open the folder containing the cache file */
    void OpenCacheFolder();

private:

	void RegisterMenus();

	UBlueprint* GetCurrentBlueprint();
	TArray<UEdGraphNode*> GetSelectedNodes(UBlueprint* Blueprint);

	/** Bind commands to the specified editor */
	void BindCommandsToEditor(class IAssetEditorInstance* EditorInstance);

	/** Handle new asset editor opened */
	void OnAssetEditorOpened(UObject* Asset);

private:
	TSharedPtr<class FUICommandList> PluginCommands;

    /** Cache for node T3D templates: Name -> T3D Content */
    TMap<FString, FString> NodeTemplateCache;
};

/** Helper function to get AI Rules content */
FString GetAIRulesContent();

/** Helper function to get embedded (fallback) AI Rules content */
FString GetEmbeddedAIRules();
