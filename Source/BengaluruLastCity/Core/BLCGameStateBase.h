// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "BLCGameTypes.h"
#include "BLCGameStateBase.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnWeatherChangedSignature, EBLCWeatherState, NewWeather);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnMatchPhaseChangedSignature, EBLCMatchPhase, NewPhase);

/**
 * Replicated GameState for Bengaluru: Last City.
 * Coordinates global world simulation, day/night time, weather, and safe-zone boundaries.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCGameStateBase : public AGameStateBase
{
	GENERATED_BODY()

public:
	ABLCGameStateBase();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	/** Called by GameMode when match phase changes */
	void OnMatchPhaseChanged(EBLCMatchPhase NewPhase);

	/** Global time of day in hours [0.0 - 24.0] */
	UPROPERTY(ReplicatedUsing = OnRep_TimeOfDayHours, BlueprintReadOnly, Category = "World|Atmosphere")
	float TimeOfDayHours;

	/** Global weather state replicated to all clients */
	UPROPERTY(ReplicatedUsing = OnRep_CurrentWeather, BlueprintReadOnly, Category = "World|Atmosphere")
	EBLCWeatherState CurrentWeather;

	/** Safe-zone center for future shrinking ring */
	UPROPERTY(Replicated, BlueprintReadOnly, Category = "BattleRoyale")
	FVector SafeZoneCenter;

	/** Safe-zone radius in centimeters */
	UPROPERTY(Replicated, BlueprintReadOnly, Category = "BattleRoyale")
	float SafeZoneRadius;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnWeatherChangedSignature OnWeatherChanged;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnMatchPhaseChangedSignature OnMatchPhaseChangedEvent;

protected:
	UFUNCTION()
	void OnRep_TimeOfDayHours();

	UFUNCTION()
	void OnRep_CurrentWeather();
};
