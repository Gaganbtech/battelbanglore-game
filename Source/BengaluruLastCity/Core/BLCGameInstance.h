// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "BLCGameInstance.generated.h"

USTRUCT(BlueprintType)
struct FBLCGameSettings
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Graphics")
	int32 OverallQualityPreset = 3; // 0=Low, 1=Med, 2=High, 3=Ultra

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Graphics")
	bool bEnableRayTracingLumen = false;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Graphics")
	bool bEnableMotionBlur = true;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio")
	float MasterVolume = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Audio")
	float AmbienceVolume = 0.85f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Controls")
	float MouseSensitivity = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Camera")
	float FieldOfView = 90.0f;
};

/**
 * Persistent GameInstance for Bengaluru: Last City
 */
UCLASS()
class BENGALURULASTCITY_API UBLCGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	virtual void Init() override;

	UFUNCTION(BlueprintCallable, Category = "Settings")
	void SaveUserSettings(const FBLCGameSettings& NewSettings);

	UFUNCTION(BlueprintPure, Category = "Settings")
	const FBLCGameSettings& GetUserSettings() const { return UserSettings; }

	UFUNCTION(BlueprintCallable, Category = "Settings")
	void ApplyGraphicsQuality(int32 PresetLevel);

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Settings")
	FBLCGameSettings UserSettings;
};
