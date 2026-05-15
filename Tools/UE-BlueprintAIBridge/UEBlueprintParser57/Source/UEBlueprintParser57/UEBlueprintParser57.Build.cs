using UnrealBuildTool;

public class UEBlueprintParser57 : ModuleRules
{
	public UEBlueprintParser57(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicIncludePaths.AddRange(
			new string[] {
			});

		PrivateIncludePaths.AddRange(
			new string[] {
			});

		PublicDependencyModuleNames.AddRange(
			new string[]
			{
				"Core",
				"CoreUObject",
				"Engine",
				"InputCore",
				"EditorStyle",
				"ToolMenus",
				"BlueprintGraph",
				"Kismet",
				"UnrealEd",
				"GraphEditor",
				"Slate",
				"SlateCore",
				"Json",
				"JsonUtilities"
			});

		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
			});

		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
			});
	}
}
