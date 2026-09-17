// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCSafeZoneSubsystem.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FOnSafeZoneShrinkingSignature, FVector, Center, float, Radius, float, RemainingTime);

/**
 * Server-authoritative Battle Royale Safe Zone & Storm subsystem.
 * Manages zone collapse phases, storm wall visual boundary, and player damage outside the circle.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCSafeZoneSubsystem : public UTickableWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Tick(float DeltaTime) override;
	virtual TStatId GetStatId() const override { RETURN_QUICK_DECLARE_CYCLE_STAT(UBLCSafeZoneSubsystem, STATGROUP_Tickables); }

	UFUNCTION(BlueprintCallable, Category = "BattleRoyale|Zone")
	void StartMatchZoneSequence();

	UFUNCTION(BlueprintPure, Category = "BattleRoyale|Zone")
	bool IsLocationInsideSafeZone(const FVector& TestLoc) const;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnSafeZoneShrinkingSignature OnSafeZoneUpdated;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Zone")
	FVector CurrentCenter;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Zone")
	float CurrentRadius;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Zone")
	FVector TargetCenter;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Zone")
	float TargetRadius;

	UPROPERTY(EditDefaultsOnly, Category = "Zone")
	float StormDamagePerSecond = 5.0f;

	int32 CurrentRingPhase = 0;
	float PhaseTimer = 0.0f;
	bool bIsShrinking = false;
};
