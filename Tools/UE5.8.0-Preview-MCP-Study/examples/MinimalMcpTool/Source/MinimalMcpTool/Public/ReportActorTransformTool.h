// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#pragma once

#include "CoreMinimal.h"
#include "IModelContextProtocolTool.h"

/**
 * 示例 Tool：根据 actor label 查找当前 editor world 内的 actor，返回其世界变换。
 *
 * 这是个**同步** tool —— 通过覆盖 Run 完成。基类的 RunAsync 默认会代理到 Run。
 * 之所以演示同步版本，是因为它把所有要点（参数 schema、错误返回、文本结果）暴露得最清楚。
 *
 * Schema 约束：参数 { "actor_label": string } 必填。
 */
class FReportActorTransformTool : public IModelContextProtocolTool
{
public:
	virtual FString GetName() const override { return TEXT("report_actor_transform"); }
	virtual FString GetDescription() const override;

	virtual TSharedPtr<FJsonObject>          GetInputJsonSchema() const override;
	virtual FModelContextProtocolToolResult  Run(const TSharedPtr<FJsonObject>& Params) override;
};
