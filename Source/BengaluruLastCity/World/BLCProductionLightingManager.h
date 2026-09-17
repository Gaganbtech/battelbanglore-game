// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "Engine/DirectionalLight.h"
#include "Components/SkyLightComponent.h"
#include "Components/ExponentialHeightFogComponent.h"
#include "BLCProductionLightingManager.generated.h"

UENUM(BlueprintType)
enum class EBLCTimePreset : uint8
{
    Day UMETA(DisplayName = "Day (5600K)"),
    Sunset UMETA(DisplayName = "Sunset (3200K Golden Hour)"),
    Night UMETA(DisplayName = "Night (20000K Cool Starlight)")
};

UCLASS()
class BENGALURULASTCITY_API UBLCProductionLightingManager : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    UFUNCTION(BlueprintCallable, Category = "BLC|Lighting")
    void SetTimePreset(EBLCTimePreset Preset);

    UFUNCTION(BlueprintCallable, Category = "BLC|Lighting")
    void SetOvercast(float OvercastAmount);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|Lighting")
    float ExposureCompensation = 1.12f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|Lighting")
    float DynamicSunCascadeDistance = 7500.0f; // 75m tight cascade for 60 FPS

private:
    EBLCTimePreset CurrentPreset = EBLCTimePreset::Day;
    float CurrentOvercast = 0.0f;
};
