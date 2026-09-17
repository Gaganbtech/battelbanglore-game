// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCBattleRoyalePlayerState.h"
#include "Net/UnrealNetwork.h"

ABLCBattleRoyalePlayerState::ABLCBattleRoyalePlayerState()
{
	bReplicates = true;
	NetUpdateFrequency = 30.0f;
}

void ABLCBattleRoyalePlayerState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(ABLCBattleRoyalePlayerState, SquadId);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, PlayerStatus);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, Health);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, HelmetLevel);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, HelmetDurability);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, ArmorLevel);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, ArmorDurability);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, KillsCount);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, TotalDamageDealt);
	DOREPLIFETIME(ABLCBattleRoyalePlayerState, SurvivalTimeSeconds);
}

void ABLCBattleRoyalePlayerState::ApplyAuthoritativeDamage(float DamageAmount, bool bIsHeadshot, ABLCBattleRoyalePlayerState* DamageSource)
{
	if (PlayerStatus == EBLCPlayerStatus::Eliminated) return;

	float Mitigation = 0.0f;
	if (bIsHeadshot && HelmetLevel > 0)
	{
		const float Reductions[] = { 0.f, 0.30f, 0.40f, 0.55f };
		Mitigation = Reductions[FMath::Clamp(HelmetLevel, 0, 3)];
		HelmetDurability = FMath::Max(0.f, HelmetDurability - DamageAmount * 0.4f);
		if (HelmetDurability <= 0.f) HelmetLevel = 0;
	}
	else if (ArmorLevel > 0)
	{
		const float Reductions[] = { 0.f, 0.20f, 0.30f, 0.45f };
		Mitigation = Reductions[FMath::Clamp(ArmorLevel, 0, 3)];
		ArmorDurability = FMath::Max(0.f, ArmorDurability - DamageAmount * 0.4f);
		if (ArmorDurability <= 0.f) ArmorLevel = 0;
	}

	const float FinalDamage = FMath::Max(1.0f, DamageAmount * (1.0f - Mitigation));
	Health = FMath::Max(0.0f, Health - FinalDamage);

	if (DamageSource)
	{
		DamageSource->TotalDamageDealt += FinalDamage;
	}

	if (Health <= 0.0f)
	{
		if (PlayerStatus == EBLCPlayerStatus::Alive)
		{
			PlayerStatus = EBLCPlayerStatus::Knocked;
			Health = 100.0f; // Knocked bleed pool
		}
		else if (PlayerStatus == EBLCPlayerStatus::Knocked)
		{
			PlayerStatus = EBLCPlayerStatus::Eliminated;
			if (DamageSource)
			{
				DamageSource->KillsCount += 1;
			}
		}
	}
}

void ABLCBattleRoyalePlayerState::RevivePlayer()
{
	if (PlayerStatus == EBLCPlayerStatus::Knocked)
	{
		PlayerStatus = EBLCPlayerStatus::Alive;
		Health = 30.0f;
	}
}
