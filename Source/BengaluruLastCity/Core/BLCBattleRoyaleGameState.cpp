// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCBattleRoyaleGameState.h"
#include "Net/UnrealNetwork.h"

ABLCBattleRoyaleGameState::ABLCBattleRoyaleGameState()
{
	bReplicates = true;
	NetUpdateFrequency = 20.0f;
}

void ABLCBattleRoyaleGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(ABLCBattleRoyaleGameState, CurrentBRState);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, AliveContenders);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, SafeZoneCenter);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, SafeZoneRadius);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, TargetZoneCenter);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, TargetZoneRadius);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, ZonePhaseIndex);
	DOREPLIFETIME(ABLCBattleRoyaleGameState, MatchDurationSeconds);
}

void ABLCBattleRoyaleGameState::SetMatchState(EBLCMatchState NewState)
{
	if (HasAuthority())
	{
		CurrentBRState = NewState;
	}
}

void ABLCBattleRoyaleGameState::SetAliveContenders(int32 NewCount)
{
	if (HasAuthority())
	{
		AliveContenders = FMath::Max(1, NewCount);
	}
}

void ABLCBattleRoyaleGameState::UpdateZoneParameters(FVector CurrentCenter, float CurrentRadius, FVector TargetCenter, float TargetRadius, int32 Phase)
{
	if (HasAuthority())
	{
		SafeZoneCenter = CurrentCenter;
		SafeZoneRadius = CurrentRadius;
		TargetZoneCenter = TargetCenter;
		TargetZoneRadius = TargetRadius;
		ZonePhaseIndex = Phase;
	}
}
