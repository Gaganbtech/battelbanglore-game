// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCMetroTrainActor.generated.h"

class USplineComponent;
class UStaticMeshComponent;

UENUM(BlueprintType)
enum class EBLCTrainState : uint8
{
	CruisingTrack    UMETA(DisplayName = "Cruising On Track"),
	Decelerating     UMETA(DisplayName = "Decelerating Into Station"),
	StationDwell     UMETA(DisplayName = "Station Dwell / Doors Open"),
	Accelerating     UMETA(DisplayName = "Accelerating Out of Station")
};

/**
 * Replicated automated Namma Metro transit train actor.
 * Moves along the elevated viaduct, docks at station platforms, and allows passenger boarding.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCMetroTrainActor : public AActor
{
	GENERATED_BODY()

public:
	ABLCMetroTrainActor();

	virtual void Tick(float DeltaTime) override;

	UFUNCTION(BlueprintPure, Category = "Metro")
	EBLCTrainState GetTrainState() const { return CurrentTrainState; }

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Mesh")
	UStaticMeshComponent* LeadCoachMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Metro|Motion")
	float MaxCruiseSpeed = 80.0f; // km/h

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Metro|Motion")
	EBLCTrainState CurrentTrainState;

	float DwellTimer = 0.0f;
	float TrackProgress = 0.0f;
};
