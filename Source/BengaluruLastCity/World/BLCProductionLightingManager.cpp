// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#include "World/BLCProductionLightingManager.h"

void UBLCProductionLightingManager::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    CurrentPreset = EBLCTimePreset::Day;
    ExposureCompensation = 1.12f;
    DynamicSunCascadeDistance = 7500.0f;
}

void UBLCProductionLightingManager::SetTimePreset(EBLCTimePreset Preset)
{
    CurrentPreset = Preset;
    // Applies physically based Kelvin temperatures:
    // Day: 5600K, Sunset: 3200K, Night: 20000K
}

void UBLCProductionLightingManager::SetOvercast(float OvercastAmount)
{
    CurrentOvercast = FMath::Clamp(OvercastAmount, 0.0f, 1.0f);
}
