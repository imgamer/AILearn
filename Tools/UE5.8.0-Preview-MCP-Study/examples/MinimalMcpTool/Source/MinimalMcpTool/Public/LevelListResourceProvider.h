// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#pragma once

#include "CoreMinimal.h"
#include "IModelContextProtocolResourceProvider.h"

/**
 * 示例 ResourceProvider：把项目内所有 World 资产作为 MCP Resource 暴露。
 *
 * URI 协议自定义：level://<PackagePath>，例如 level:///Game/Maps/StartupMap。
 * `ReadResource` 返回该 World 的元数据文本（路径 / 资产类）作为 text resource。
 *
 * 注意：不订阅 list_changed —— 插件不支持 resources/list_changed 通知（见 docs/07）。
 */
class FLevelListResourceProvider : public IModelContextProtocolResourceProvider
{
public:
	virtual void ListResources(FModelContextProtocolResourceDescriptorList& OutDescriptors) const override;
	virtual TValueOrError<FModelContextProtocolResource, FString> ReadResource(const FString& Uri) const override;
};
