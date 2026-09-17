// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "World/BLCCityLifeManagerSubsystem.h"

void UBLCCityLifeManagerSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);
	UrbanSimulationTimeHours = 8.5f; // 08:30 AM
	UE_LOG(LogTemp, Log, TEXT("UBLCCityLifeManagerSubsystem Initialized for Bengaluru Open World."));
}

void UBLCCityLifeManagerSubsystem::Deinitialize()
{
	Super::Deinitialize();
}

void UBLCCityLifeManagerSubsystem::TriggerDynamicCityEvent(const FString& EventName)
{
	UE_LOG(LogTemp, Log, TEXT("CityLifeManager: Triggered dynamic city event: %s"), *EventName);
}

void UBLCCityLifeManagerSubsystem::SetCityCrowdDensity(float DensityMultiplier)
{
	UE_LOG(LogTemp, Log, TEXT("CityLifeManager: Updated pedestrian crowd density scalar to: %.2f"), DensityMultiplier);
}
