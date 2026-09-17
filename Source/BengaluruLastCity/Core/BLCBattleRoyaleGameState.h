// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "BLCBattleRoyaleGameState.generated.h"

UENUM(BlueprintType)
enum class EBLCMatchState : uint8
{
	WaitingForPlayers   UMETA(DisplayName = "Waiting For Players / Matchmaking"),
	Preparing           UMETA(DisplayName = "Pre-Match Staging Lobby"),
	AircraftDeparture   UMETA(DisplayName = "Aircraft In Flight"),
	DropPhase           UMETA(DisplayName = "Freefall & Parachute Drop"),
	ActiveMatch         UMETA(DisplayName = "Active Battle Royale Match"),
	FinalZone           UMETA(DisplayName = "Final Survival Circle"),
	MatchEnding         UMETA(DisplayName = "Match Ending Sequence"),
	MatchComplete       UMETA(DisplayName = "Match Completed / Results")
};

/**
 * Replicated global match state for Bengaluru: Last City Battle Royale.
 * Replicates active player count, safe zone circles, and flight trajectories.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCBattleRoyaleGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	ABLCBattleRoyaleGameState();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	// Setters (Server Only)
	void SetMatchState(EBLCMatchState NewState);
	void SetAliveContenders(int32 NewCount);
	void UpdateZoneParameters(FVector CurrentCenter, float CurrentRadius, FVector TargetCenter, float TargetRadius, int32 Phase);

	// Getters
	UFUNCTION(BlueprintPure, Category = "Match|State")
	EBLCMatchState GetBRMatchState() const { return CurrentBRState; }

	UFUNCTION(BlueprintPure, Category = "Match|Contenders")
	int32 GetAliveContenders() const { return AliveContenders; }

	UFUNCTION(BlueprintPure, Category = "Match|Zone")
	FVector GetCurrentZoneCenter() const { return SafeZoneCenter; }

	UFUNCTION(BlueprintPure, Category = "Match|Zone")
	float GetCurrentZoneRadius() const { return SafeZoneRadius; }

protected:
	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|State")
	EBLCMatchState CurrentBRState = EBLCMatchState::WaitingForPlayers;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Contenders")
	int32 AliveContenders = 100;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Zone")
	FVector SafeZoneCenter = FVector::ZeroVector;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Zone")
	float SafeZoneRadius = 38000.f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Zone")
	FVector TargetZoneCenter = FVector::ZeroVector;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Zone")
	float TargetZoneRadius = 38000.f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Zone")
	int32 ZonePhaseIndex = 0;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match|Time")
	float MatchDurationSeconds = 0.0f;
};
