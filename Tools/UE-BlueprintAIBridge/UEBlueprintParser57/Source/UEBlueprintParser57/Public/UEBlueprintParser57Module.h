#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class FToolMenuContext;
class UToolMenu;

class FUEBlueprintParser57Module : public IModuleInterface
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

	void RegisterMenus();
	void UnregisterMenus();

	void CopyAsShortCode();
	void PasteShortCode();
	void ArrangeNodes();
	void CopyAIRules();
	void ManageTemplates();
	void EditAIRules();

private:
	void OnGraphEditorMenuCreate(FMenuBuilder& MenuBuilder, TWeakPtr<FUICommandList> CommandList, TArray<UEdGraphNode*> SelectedNodes);
};
