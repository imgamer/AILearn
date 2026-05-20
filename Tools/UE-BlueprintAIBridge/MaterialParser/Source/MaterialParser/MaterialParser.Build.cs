using UnrealBuildTool;

public class MaterialParser : ModuleRules
{
    public MaterialParser(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.NoPCHs;

        PublicIncludePaths.AddRange(
            new string[] {
                "MaterialParser/Public"
            }
        );

        PrivateIncludePaths.AddRange(
            new string[] {
                "MaterialParser/Private"
            }
        );

        PublicDependencyModuleNames.AddRange(
            new string[]
            {
                "Core",
                "CoreUObject",
                "Engine",
                "MaterialEditor",
                "GraphEditor",
                "EditorFramework",
                "Slate",
                "SlateCore",
                "UnrealEd"
            }
        );

        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "RenderCore",
                "KismetWidgets",
                "ToolMenus",
                "Json",
                "JsonUtilities",
                "InputCore",
                "ApplicationCore"
            }
        );
    }
}
