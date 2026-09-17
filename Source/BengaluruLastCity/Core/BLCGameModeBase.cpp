// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCGameModeBase.h"
#include "BLCGameStateBase.h"
#include "BengaluruLastCity/Controllers/BLCPlayerController.h"
#include "BengaluruLastCity/Characters/BLCPlayerCharacter.h"
#include "BengaluruLastCity/UI/BLCHUD.h"
#include "UObject/ConstructorHelpers.h"
#include "Kismet/GameplayStatics.h"

ABLCGameModeBase::ABLCGameModeBase()
{
	DefaultPawnClass = ABLCPlayerCharacter::StaticClass();
	PlayerControllerClass = ABLCPlayerController::StaticClass();
	GameStateClass = ABLCGameStateBase::StaticClass();
	HUDClass = ABLCHUD::StaticClass();

	CurrentMatchPhase = EBLCMatchPhase::WarmupLobby;
	bSpawnCivilianPopulation = true;
	MaxCivilians = 120;
}

void ABLCGameModeBase::BeginPlay()
{
	Super::BeginPlay();

	UE_LOG(LogTemp, Log, TEXT("[BengaluruLastCity] GameMode initialized. Phase 1 Prototype Active."));
}

void ABLCGameModeBase::RestartPlayer(AController* NewPlayer)
{
	Super::RestartPlayer(NewPlayer);
}

AActor* ABLCGameModeBase::ChoosePlayerStart_Implementation(AController* Player)
{
	return Super::ChoosePlayerStart_Implementation(Player);
}

void ABLCGameModeBase::SetMatchPhase(EBLCMatchPhase NewPhase)
{
	if (CurrentMatchPhase != NewPhase)
	{
		CurrentMatchPhase = NewPhase;
		if (ABLCGameStateBase* BLCGS = GetGameState<ABLCGameStateBase>())
		{
			BLCGS->OnMatchPhaseChanged(NewPhase);
		}
	}
}
