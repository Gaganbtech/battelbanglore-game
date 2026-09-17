// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCTimeOfDaySubsystem.h"
#include "Engine/World.h"

void UBLCTimeOfDaySubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);
	CurrentTimeHours = 12.0f; // High noon start
	bIsNight = false;
}

void UBLCTimeOfDaySubsystem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Advance time
	const float RealSecondsInADay = DayLengthInMinutes * 60.0f;
	const float HoursPerSecond = 24.0f / RealSecondsInADay;

	CurrentTimeHours += HoursPerSecond * DeltaTime;
	if (CurrentTimeHours >= 24.0f)
	{
		CurrentTimeHours -= 24.0f;
	}

	OnTimeChanged.Broadcast(CurrentTimeHours);

	bool bNightNow = (CurrentTimeHours < 6.0f || CurrentTimeHours >= 18.5f);
	if (bNightNow != bIsNight)
	{
		bIsNight = bNightNow;
		OnNightStateToggled.Broadcast(bIsNight);
	}
}

void UBLCTimeOfDaySubsystem::SetTimeOfDay(float InHours)
{
	CurrentTimeHours = FMath::Fmod(InHours, 24.0f);
	bIsNight = (CurrentTimeHours < 6.0f || CurrentTimeHours >= 18.5f);
	OnTimeChanged.Broadcast(CurrentTimeHours);
	OnNightStateToggled.Broadcast(bIsNight);
}
