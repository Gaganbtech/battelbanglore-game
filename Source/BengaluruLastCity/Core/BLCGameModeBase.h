// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "BLCGameTypes.h"
#include "BLCGameModeBase.generated.h"

class ABLCPlayerCharacter;
class ABLCPlayerController;

/**
 * Phase 1 foundational GameMode for Bengaluru: Last City.
 * Prepared for 100-player Battle Royale lifecycle in Phase 2+.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCGameModeBase : public AGameModeBase
{
	GENERATED_BODY()

public:
	ABLCGameModeBase();

	virtual void BeginPlay() override;
	virtual void RestartPlayer(AController* NewPlayer) override;

	/** Spawns player at designated city neighborhood or drop zone */
	UFUNCTION(BlueprintCallable, Category = "Spawn")
	virtual AActor* ChoosePlayerStart_Implementation(AController* Player) override;

	/** Sets match phase (Warmup, InProgress, PostMatch) */
	UFUNCTION(BlueprintCallable, Category = "Match")
	void SetMatchPhase(EBLCMatchPhase NewPhase);

	/** Returns current match phase */
	UFUNCTION(BlueprintPure, Category = "Match")
	EBLCMatchPhase GetMatchPhase() const { return CurrentMatchPhase; }

protected:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Match")
	EBLCMatchPhase CurrentMatchPhase;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "City")
	bool bSpawnCivilianPopulation;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "City")
	int32 MaxCivilians;
};
