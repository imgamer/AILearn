// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#include "MinimalMcpToolModule.h"

#include "IModelContextProtocolModule.h"
#include "IModelContextProtocolTool.h"
#include "IModelContextProtocolResourceProvider.h"

#include "LevelListResourceProvider.h"
#include "ReportActorTransformTool.h"

#include "Modules/ModuleManager.h"
#include "Logging/LogMacros.h"

DEFINE_LOG_CATEGORY_STATIC(LogMinimalMcpTool, Log, All);

void FMinimalMcpToolModule::StartupModule()
{
	// 实例化我们要注册的 Tool / Provider。共享指针，由本 module 持有强引用，反注册时归还给 MCP module 释放即可。
	ReportTransformTool = MakeShared<FReportActorTransformTool>();
	LevelListProvider   = MakeShared<FLevelListResourceProvider>();

	RegisterAll();

	// 关键：MCP 核心层在用户跑 console 命令 ModelContextProtocol.RefreshTools 时会清空 GetTools 集合。
	// 我们必须订阅 OnRefreshTools 重新 AddTool，否则 tool 会静默消失。
	// 参见 docs/06-extension-guide.md §1.4 与 IModelContextProtocolModule.h:48-60。
	if (IModelContextProtocolModule* Module = IModelContextProtocolModule::Get())
	{
		OnRefreshToolsHandle = Module->OnRefreshTools().AddLambda([this]()
		{
			RegisterAll();
		});
	}
}

void FMinimalMcpToolModule::ShutdownModule()
{
	if (IModelContextProtocolModule* Module = IModelContextProtocolModule::Get())
	{
		Module->OnRefreshTools().Remove(OnRefreshToolsHandle);
	}
	OnRefreshToolsHandle.Reset();

	UnregisterAll();

	ReportTransformTool.Reset();
	LevelListProvider.Reset();
}

void FMinimalMcpToolModule::RegisterAll()
{
	IModelContextProtocolModule* Module = IModelContextProtocolModule::Get();
	if (!Module)
	{
		UE_LOG(LogMinimalMcpTool, Warning,
			TEXT("MinimalMcpTool: ModelContextProtocol module not loaded; skipping registration. "
			     "Check that the ModelContextProtocol plugin is enabled in this project."));
		return;
	}

	// AddTool 重名会失败并返回 false（OnRefresh 后第一次 Add 已经清空过，正常不会重名）。
	if (ReportTransformTool.IsValid())
	{
		if (!Module->AddTool(ReportTransformTool.ToSharedRef()))
		{
			UE_LOG(LogMinimalMcpTool, Warning, TEXT("AddTool(report_actor_transform) failed (name conflict?)"));
		}
	}

	if (LevelListProvider.IsValid())
	{
		Module->AddResourceProvider(LevelListProvider.ToSharedRef());
	}
}

void FMinimalMcpToolModule::UnregisterAll()
{
	if (IModelContextProtocolModule* Module = IModelContextProtocolModule::Get())
	{
		if (ReportTransformTool.IsValid())
		{
			Module->RemoveTool(ReportTransformTool.ToSharedRef());
		}
		if (LevelListProvider.IsValid())
		{
			Module->RemoveResourceProvider(LevelListProvider.ToSharedRef());
		}
	}
}

IMPLEMENT_MODULE(FMinimalMcpToolModule, MinimalMcpTool)
