// Copyright Example. Provided as illustrative material for analysing UE 5.8 ModelContextProtocol plugin.

#include "LevelListResourceProvider.h"

#include "AssetRegistry/AssetRegistryModule.h"
#include "AssetRegistry/IAssetRegistry.h"
#include "Engine/World.h"

#include "ModelContextProtocolResources.h"

namespace
{
	const TCHAR* LevelUriScheme = TEXT("level://");

	FString MakeUri(const FString& PackageName)
	{
		// 形如 level:///Game/Maps/StartupMap
		return FString::Printf(TEXT("%s%s"), LevelUriScheme, *PackageName);
	}

	bool TryParseUri(const FString& Uri, FString& OutPackageName)
	{
		if (!Uri.StartsWith(LevelUriScheme))
		{
			return false;
		}
		OutPackageName = Uri.RightChop(FCString::Strlen(LevelUriScheme));
		return !OutPackageName.IsEmpty();
	}
}

void FLevelListResourceProvider::ListResources(FModelContextProtocolResourceDescriptorList& OutDescriptors) const
{
	const FAssetRegistryModule& AssetRegistryModule =
		FModuleManager::LoadModuleChecked<FAssetRegistryModule>(TEXT("AssetRegistry"));
	IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();

	TArray<FAssetData> WorldAssets;
	AssetRegistry.GetAssetsByClass(UWorld::StaticClass()->GetClassPathName(), WorldAssets);

	for (const FAssetData& Asset : WorldAssets)
	{
		const FString PackageName = Asset.PackageName.ToString();
		const FString Uri  = MakeUri(PackageName);
		const FString Name = Asset.AssetName.ToString();
		const FString Description = FString::Printf(TEXT("World asset at %s"), *PackageName);

		// FModelContextProtocolResourceDescriptor 构造签名：
		//   (Uri, Name, Title, Description, MimeType) -- 全部 TOptional<FString>
		// 见 ModelContextProtocolResources.h:19
		FModelContextProtocolResourceDescriptor Descriptor(
			Uri,
			TOptional<FString>(Name),
			TOptional<FString>(),
			TOptional<FString>(Description),
			TOptional<FString>(FString(TEXT("text/plain"))));

		OutDescriptors.Add(Descriptor, this->AsShared());
	}
}

TValueOrError<FModelContextProtocolResource, FString> FLevelListResourceProvider::ReadResource(const FString& Uri) const
{
	FString PackageName;
	if (!TryParseUri(Uri, PackageName))
	{
		return MakeError(FString::Printf(TEXT("Unsupported URI scheme: %s"), *Uri));
	}

	const FAssetRegistryModule& AssetRegistryModule =
		FModuleManager::LoadModuleChecked<FAssetRegistryModule>(TEXT("AssetRegistry"));
	IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();

	TArray<FAssetData> Found;
	AssetRegistry.GetAssetsByPackageName(FName(*PackageName), Found);
	if (Found.IsEmpty())
	{
		return MakeError(FString::Printf(TEXT("No asset for package %s"), *PackageName));
	}

	const FAssetData& Asset = Found[0];
	FString Body = FString::Printf(
		TEXT("PackageName=%s\nAssetName=%s\nAssetClass=%s\nObjectPath=%s"),
		*Asset.PackageName.ToString(),
		*Asset.AssetName.ToString(),
		*Asset.AssetClassPath.ToString(),
		*Asset.GetObjectPathString());

	// FModelContextProtocolResource 文本构造签名（ModelContextProtocolResources.h:32）：
	//   (Uri, FString&& TextContent, Name?, Title?, MimeType?)
	FModelContextProtocolResource Resource(
		Uri,
		MoveTemp(Body),
		TOptional<FString>(Asset.AssetName.ToString()),
		TOptional<FString>(),
		TOptional<FString>(FString(TEXT("text/plain"))));

	return MakeValue(MoveTemp(Resource));
}
