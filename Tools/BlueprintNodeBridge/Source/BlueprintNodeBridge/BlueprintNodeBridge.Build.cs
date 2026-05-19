// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class BlueprintNodeBridge : ModuleRules
{
	public BlueprintNodeBridge(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicIncludePaths.AddRange(
			new string[] {
				"BlueprintNodeBridge/Public"
			}
		);

		PrivateIncludePaths.AddRange(
			new string[] {
				"BlueprintNodeBridge/Private",
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
				"KismetCompiler",
				"GraphEditor",
				"PropertyEditor",
				"Json",
				"JsonUtilities"
			}
		);

		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"Projects",
				"ApplicationCore",
				"EditorSubsystem",
				"UnrealEdMessages",
				"KismetWidgets",
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
