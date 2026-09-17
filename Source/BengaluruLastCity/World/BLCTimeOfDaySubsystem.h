// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCTimeOfDaySubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTimeOfDayChanged, float, CurrentHour);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnNightStateToggled, bool, bIsNight);

/**
 * World Subsystem managing the dynamic 24-hour day/night cycle,
 * solar trajectory, street lamp toggles, and building emissive window states.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCTimeOfDaySubsystem : public UTickableWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Tick(float DeltaTime) override;
	virtual TStatId GetStatId() const override { RETURN_QUICK_DECLARE_CYCLE_STAT(UBLCTimeOfDaySubsystem, STATGROUP_Tickables); }

	UFUNCTION(BlueprintCallable, Category = "World|Time")
	void SetTimeOfDay(float InHours);

	UFUNCTION(BlueprintPure, Category = "World|Time")
	float GetTimeOfDay() const { return CurrentTimeHours; }

	UFUNCTION(BlueprintPure, Category = "World|Time")
	bool IsNightTime() const { return bIsNight; }

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnTimeOfDayChanged OnTimeChanged;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnNightStateToggled OnNightStateToggled;

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Time")
	float DayLengthInMinutes = 24.0f; // 24 real minutes = 24 in-game hours

	UPROPERTY(VisibleAnywhere, Category = "Time")
	float CurrentTimeHours = 12.0f;

	bool bIsNight = false;
};
