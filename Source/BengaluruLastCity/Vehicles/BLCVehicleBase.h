// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCVehicleBase.generated.h"

class UStaticMeshComponent;
class USphereComponent;
class ABLCPlayerCharacter;

/**
 * Base vehicle class for Bengaluru: Last City.
 * Supports auto-rickshaws, city buses, sedans, and Phase 2 supercars.
 * Features enter/exit interaction, headlight toggles, and multiplayer readiness.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCVehicleBase : public APawn
{
	GENERATED_BODY()

public:
	ABLCVehicleBase();

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	/** Player enters vehicle as driver */
	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	bool EnterVehicle(ABLCPlayerCharacter* EnteringPlayer);

	/** Player exits vehicle */
	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	bool ExitVehicle();

	/** Toggles headlights */
	UFUNCTION(BlueprintCallable, Category = "Vehicle")
	void SetHeadlightsActive(bool bActive);

	/** Vehicle input */
	void Throttle(float Val);
	void Steer(float Val);
	void Handbrake();

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Mesh")
	UStaticMeshComponent* VehicleMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Interaction")
	USphereComponent* InteractionTrigger;

	UPROPERTY(EditDefaultsOnly, Category = "Vehicle")
	float MaxForwardSpeed = 120.0f; // km/h

	UPROPERTY(EditDefaultsOnly, Category = "Vehicle")
	float AccelerationRate = 45.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Vehicle")
	float TurnSpeed = 65.0f;

	UPROPERTY()
	ABLCPlayerCharacter* CurrentDriver;

	bool bHeadlightsOn;
};
