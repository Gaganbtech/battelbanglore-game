// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "BLCBattleRoyaleGameState.h"
#include "BLCBattleRoyaleGameMode.generated.h"

class ABLCBattleRoyalePlayerState;

/**
 * Server-Authoritative Battle Royale GameMode for Bengaluru: Last City.
 * Manages 100-player lifecycle, safe zone phases, supply drop timings, and victory determination.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCBattleRoyaleGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	ABLCBattleRoyaleGameMode();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;
	virtual void PostLogin(APlayerController* NewPlayer) override;

	/** Advances match lifecycle to next state */
	UFUNCTION(BlueprintCallable, Category = "Match|Flow")
	void AdvanceMatchState(EBLCMatchState TargetState);

	/** Server-authoritative hit validation */
	UFUNCTION(BlueprintCallable, Category = "Combat|Security")
	bool ValidateHitRegistration(ABLCBattleRoyalePlayerState* Attacker, ABLCBattleRoyalePlayerState* Victim, float ShotDistance);

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Match|Config")
	int32 TargetContenderCount = 100;

	UPROPERTY(EditDefaultsOnly, Category = "Match|Config")
	float PreMatchCountdownSeconds = 30.0f;

	float MatchTimer = 0.0f;
	float ZoneTickTimer = 0.0f;
};
