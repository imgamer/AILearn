#pragma once

#include "Modules/ModuleManager.h"

class MATERIALPARSER_API FMaterialParserModule : public IModuleInterface
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

private:
	void RegisterMenus();
	bool IsMaterialEditorFocused();
	void CopyAsShortCode();
	void PasteShortCode();

	static TSharedPtr<class FUICommandList> PluginCommands;
};
