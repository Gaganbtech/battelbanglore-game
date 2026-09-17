// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "BLCBattleRoyalePlayerState.generated.h"

UENUM(BlueprintType)
enum class EBLCPlayerStatus : uint8
{
	Alive        UMETA(DisplayName = "Alive & Active"),
	Knocked      UMETA(DisplayName = "Knocked / Bleeding Out"),
	Eliminated   UMETA(DisplayName = "Eliminated / Spectating")
};

/**
 * Replicated 100-player scalable Battle Royale PlayerState for Bengaluru: Last City.
 * Tracks vital stats, armor durability, squad ID, kills, and damage dealt.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCBattleRoyalePlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	ABLCBattleRoyalePlayerState();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	/** Applies authoritative damage and checks for knock / elimination */
	UFUNCTION(BlueprintCallable, Category = "PlayerState|Damage")
	void ApplyAuthoritativeDamage(float DamageAmount, bool bIsHeadshot, ABLCBattleRoyalePlayerState* DamageSource = nullptr);

	/** Revives a knocked player */
	UFUNCTION(BlueprintCallable, Category = "PlayerState|Revive")
	void RevivePlayer();

	// Getters
	UFUNCTION(BlueprintPure, Category = "PlayerState|Stats")
	int32 GetSquadId() const { return SquadId; }

	UFUNCTION(BlueprintPure, Category = "PlayerState|Stats")
	int32 GetKills() const { return KillsCount; }

	UFUNCTION(BlueprintPure, Category = "PlayerState|Stats")
	float GetDamageDealt() const { return TotalDamageDealt; }

	UFUNCTION(BlueprintPure, Category = "PlayerState|Stats")
	EBLCPlayerStatus GetPlayerStatus() const { return PlayerStatus; }

protected:
	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Squad")
	int32 SquadId = 1;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Status")
	EBLCPlayerStatus PlayerStatus = EBLCPlayerStatus::Alive;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Health")
	float Health = 100.0f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Armor")
	int32 HelmetLevel = 0; // 0, 1, 2, 3

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Armor")
	float HelmetDurability = 100.0f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Armor")
	int32 ArmorLevel = 0; // 0, 1, 2, 3

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Armor")
	float ArmorDurability = 100.0f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Score")
	int32 KillsCount = 0;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Score")
	float TotalDamageDealt = 0.0f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "PlayerState|Score")
	float SurvivalTimeSeconds = 0.0f;
};
