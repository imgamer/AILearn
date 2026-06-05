// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

using UnrealBuildTool;

public class MinimalMcpTool : ModuleRules
{
	public MinimalMcpTool(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicDependencyModuleNames.AddRange(new string[]
		{
			"Core",
			"CoreUObject",
			"Engine",
			"Json",
			"JsonUtilities",
			// 来自 Epic ModelContextProtocol 插件的核心模块。Public API 暴露 IModelContextProtocolModule / IModelContextProtocolTool / IModelContextProtocolResourceProvider。
			"ModelContextProtocol",
		});

		PrivateDependencyModuleNames.AddRange(new string[]
		{
			// AssetRegistry 用来枚举关卡 asset。
			"AssetRegistry",
			// UnrealEd 提供 GEditor / Editor world 入口；仅 Editor target 加载。
			"UnrealEd",
		});
	}
}
