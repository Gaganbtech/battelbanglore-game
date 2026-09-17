// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#include "Core/BLCDataLayerSubsystem.h"

void UBLCDataLayerSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    ActiveLayers.Add(TEXT("BaseCity"), true);
    ActiveLayers.Add(TEXT("TrafficInfrastructure"), true);
    ActiveLayers.Add(TEXT("CombatLoot"), true);
    ActiveLayers.Add(TEXT("NightLighting"), true);
}

void UBLCDataLayerSubsystem::SetDataLayerActive(FName LayerName, bool bActive)
{
    ActiveLayers.Add(LayerName, bActive);
    UE_LOG(LogTemp, Log, TEXT("Data Layer %s set to %s"), *LayerName.ToString(), bActive ? TEXT("ACTIVE") : TEXT("INACTIVE"));
}

bool UBLCDataLayerSubsystem::IsDataLayerActive(FName LayerName) const
{
    const bool* bActive = ActiveLayers.Find(LayerName);
    return bActive ? *bActive : false;
}
