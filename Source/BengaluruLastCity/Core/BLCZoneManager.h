// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCZoneManager.generated.h"

USTRUCT(BlueprintType)
struct FBLCZonePhaseConfig
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	int32 PhaseNumber = 1;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	float Radius = 32000.f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	float WaitTimeSeconds = 120.f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	float ShrinkTimeSeconds = 70.f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	float StormDamagePerSecond = 2.0f;
};

/**
 * Replicated Safe Zone Manager actor for Bengaluru: Last City.
 * Controls 6-phase collapsing storm wall cylinder and environmental damage.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCZoneManager : public AActor
{
	GENERATED_BODY()

public:
	ABLCZoneManager();

	virtual void Tick(float DeltaSeconds) override;

	/** Starts zone progression when active match begins */
	UFUNCTION(BlueprintCallable, Category = "Zone|Control")
	void StartZoneProgression();

	/** Checks if a world location is outside the current safe ring */
	UFUNCTION(BlueprintPure, Category = "Zone|Query")
	bool IsLocationInStorm(const FVector& WorldLocation) const;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UStaticMeshComponent* StormWallMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Zone|Phases")
	TArray<FBLCZonePhaseConfig> ZonePhases;

	int32 CurrentPhaseIndex = 0;
	float CurrentRadius = 38000.f;
	float TargetRadius = 32000.f;
	FVector CurrentCenter = FVector::ZeroVector;
	FVector TargetCenter = FVector::ZeroVector;
	float PhaseTimer = 0.0f;
	bool bIsShrinking = false;
	bool bIsZoneActive = false;
};
