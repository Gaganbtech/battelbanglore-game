// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCWeatherSubsystem.h"

void UBLCWeatherSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);
	ActiveWeather = EBLCWeatherState::Clear;
	CurrentRoadWetness = 0.0f;
	TargetRoadWetness = 0.0f;
}

void UBLCWeatherSubsystem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!FMath::IsNearlyEqual(CurrentRoadWetness, TargetRoadWetness, 0.01f))
	{
		CurrentRoadWetness = FMath::FInterpTo(CurrentRoadWetness, TargetRoadWetness, DeltaTime, 0.5f);
		OnRoadWetnessUpdated.Broadcast(CurrentRoadWetness);
	}
}

void UBLCWeatherSubsystem::TransitionToWeather(EBLCWeatherState NewWeather)
{
	ActiveWeather = NewWeather;
	TargetRoadWetness = (NewWeather == EBLCWeatherState::MonsoonRain) ? 1.0f : 0.0f;
	OnWeatherChanged.Broadcast(ActiveWeather);
}
