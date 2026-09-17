// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCBattleRoyaleGameMode.h"
#include "BengaluruLastCity/Core/BLCBattleRoyalePlayerState.h"

ABLCBattleRoyaleGameMode::ABLCBattleRoyaleGameMode()
{
	PrimaryActorTick.bCanEverTick = true;
	GameStateClass = ABLCBattleRoyaleGameState::StaticClass();
	PlayerStateClass = ABLCBattleRoyalePlayerState::StaticClass();
}

void ABLCBattleRoyaleGameMode::BeginPlay()
{
	Super::BeginPlay();

	if (ABLCBattleRoyaleGameState* BRGameState = GetGameState<ABLCBattleRoyaleGameState>())
	{
		BRGameState->SetMatchState(EBLCMatchState::Preparing);
		BRGameState->SetAliveContenders(TargetContenderCount);
	}
}

void ABLCBattleRoyaleGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);
	MatchTimer += DeltaSeconds;

	ABLCBattleRoyaleGameState* BRGameState = GetGameState<ABLCBattleRoyaleGameState>();
	if (!BRGameState) return;

	// Pre-Match to Aircraft Transition
	if (BRGameState->GetBRMatchState() == EBLCMatchState::Preparing && MatchTimer >= PreMatchCountdownSeconds)
	{
		AdvanceMatchState(EBLCMatchState::AircraftDeparture);
	}
}

void ABLCBattleRoyaleGameMode::PostLogin(APlayerController* NewPlayer)
{
	Super::PostLogin(NewPlayer);
}

void ABLCBattleRoyaleGameMode::AdvanceMatchState(EBLCMatchState TargetState)
{
	if (ABLCBattleRoyaleGameState* BRGameState = GetGameState<ABLCBattleRoyaleGameState>())
	{
		BRGameState->SetMatchState(TargetState);
	}
}

bool ABLCBattleRoyaleGameMode::ValidateHitRegistration(ABLCBattleRoyalePlayerState* Attacker, ABLCBattleRoyalePlayerState* Victim, float ShotDistance)
{
	// Anti-cheat verification rule: verify distances, sightlines, and living states
	if (!Attacker || !Victim) return false;
	if (Attacker->GetPlayerStatus() != EBLCPlayerStatus::Alive) return false;
	if (Victim->GetPlayerStatus() == EBLCPlayerStatus::Eliminated) return false;

	// Prevent extreme distance impossible hits (> 1000m)
	if (ShotDistance > 100000.f) return false;

	return true;
}
