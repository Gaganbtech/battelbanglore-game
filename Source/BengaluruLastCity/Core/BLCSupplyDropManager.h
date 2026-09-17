// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCSupplyDropManager.generated.h"

/**
 * Server-Authoritative Airdrop Supply Crate Actor.
 * Drops from cargo plane with parachute and emits crimson smoke beacon flare on touchdown.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCSupplyCrateActor : public AActor
{
	GENERATED_BODY()

public:
	ABLCSupplyCrateActor();

	virtual void Tick(float DeltaSeconds) override;

	UFUNCTION(BlueprintCallable, Category = "SupplyDrop")
	void OpenCrate(APawn* InteractingPawn);

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UStaticMeshComponent* CrateMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UStaticMeshComponent* ParachuteMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Motion")
	float FallSpeed = 850.f; // cm/s

	bool bHasLanded = false;
	bool bIsOpened = false;
};

/**
 * Subsystem that manages high-value airdrop event scheduling across Bengaluru.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCSupplyDropManager : public AActor
{
	GENERATED_BODY()

public:
	ABLCSupplyDropManager();

	virtual void Tick(float DeltaSeconds) override;

	/** Dispatches a new supply drop at designated coordinates */
	UFUNCTION(BlueprintCallable, Category = "SupplyDrop")
	void DispatchSupplyDrop(FVector TargetLocation);

protected:
	UPROPERTY(EditDefaultsOnly, Category = "SupplyDrop|Timing")
	float DropIntervalSeconds = 90.0f;

	float DropTimer = 45.0f;
};
