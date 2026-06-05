// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleInterface.h"

struct IModelContextProtocolTool;
struct IModelContextProtocolResourceProvider;

class FMinimalMcpToolModule : public IModuleInterface
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;

private:
	/** 安装我们注册过的 Tool / Provider。在 StartupModule 与 OnRefreshTools 触发时都会调一次。 */
	void RegisterAll();

	/** 把上一次注册过的引用还回 module。ShutdownModule 调用。 */
	void UnregisterAll();

	TSharedPtr<IModelContextProtocolTool>             ReportTransformTool;
	TSharedPtr<IModelContextProtocolResourceProvider> LevelListProvider;

	FDelegateHandle OnRefreshToolsHandle;
};
