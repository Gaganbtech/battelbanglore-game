// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCWeatherSubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnWeatherTypeChanged, EBLCWeatherState, NewWeather);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnRoadWetnessUpdated, float, WetnessIntensity);

/**
 * World Subsystem managing atmospheric weather:
 * Sunny/Clear, Overcast/Cloudy, and Monsoon Rain with road surface wetness.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCWeatherSubsystem : public UTickableWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Tick(float DeltaTime) override;
	virtual TStatId GetStatId() const override { RETURN_QUICK_DECLARE_CYCLE_STAT(UBLCWeatherSubsystem, STATGROUP_Tickables); }

	UFUNCTION(BlueprintCallable, Category = "World|Weather")
	void TransitionToWeather(EBLCWeatherState NewWeather);

	UFUNCTION(BlueprintPure, Category = "World|Weather")
	EBLCWeatherState GetCurrentWeather() const { return ActiveWeather; }

	UFUNCTION(BlueprintPure, Category = "World|Weather")
	float GetRoadWetness() const { return CurrentRoadWetness; }

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnWeatherTypeChanged OnWeatherChanged;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnRoadWetnessUpdated OnRoadWetnessUpdated;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Weather")
	EBLCWeatherState ActiveWeather = EBLCWeatherState::Clear;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Weather")
	float CurrentRoadWetness = 0.0f;

	float TargetRoadWetness = 0.0f;
};
