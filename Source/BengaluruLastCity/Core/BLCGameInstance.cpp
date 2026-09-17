// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCGameInstance.h"
#include "GameFramework/GameUserSettings.h"

void UBLCGameInstance::Init()
{
	Super::Init();
	UE_LOG(LogTemp, Log, TEXT("[BLCGameInstance] Initialized with persistent user configuration."));
}

void UBLCGameInstance::SaveUserSettings(const FBLCGameSettings& NewSettings)
{
	UserSettings = NewSettings;
	ApplyGraphicsQuality(UserSettings.OverallQualityPreset);
}

void UBLCGameInstance::ApplyGraphicsQuality(int32 PresetLevel)
{
	if (UGameUserSettings* ScalabilitySettings = UGameUserSettings::GetGameUserSettings())
	{
		ScalabilitySettings->SetOverallScalabilityLevel(PresetLevel);
		ScalabilitySettings->ApplySettings(false);
	}
}
