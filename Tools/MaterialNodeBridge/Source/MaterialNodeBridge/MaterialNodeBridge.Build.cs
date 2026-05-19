using UnrealBuildTool;

public class MaterialNodeBridge : ModuleRules
{
	public MaterialNodeBridge(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicIncludePaths.AddRange(
			new string[] {
				"MaterialNodeBridge/Public"
			}
		);

		PrivateIncludePaths.AddRange(
			new string[] {
				"MaterialNodeBridge/Private",
			}
		);

		PublicDependencyModuleNames.AddRange(
			new string[]
			{
				"Core",
				"CoreUObject",
				"Engine",
				"InputCore",
				"EditorFramework",
				"UnrealEd",
				"ToolMenus",
				"Slate",
				"SlateCore",
				"BlueprintGraph",
				"Kismet",
				"GraphEditor",
				"PropertyEditor",
				"Json",
				"JsonUtilities",
				"MaterialEditor",
				"MaterialDomains"
			}
		);

		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"Projects",
				"ApplicationCore",
				"EditorSubsystem",
				"SourceCodeAccess"
			}
		);

		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
			}
		);
	}
}
