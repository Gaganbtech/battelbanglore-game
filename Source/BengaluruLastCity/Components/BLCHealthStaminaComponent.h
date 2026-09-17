// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "BLCHealthStaminaComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnStatChangedSignature, float, CurrentVal, float, MaxVal);

/**
 * Replicated health and stamina component for player and future enemies.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class BENGALURULASTCITY_API UBLCHealthStaminaComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UBLCHealthStaminaComponent();

	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	/** Applies damage to health */
	UFUNCTION(BlueprintCallable, Category = "Combat")
	void TakeDamage(float DamageAmount);

	/** Consumes stamina during sprint or jump */
	UFUNCTION(BlueprintCallable, Category = "Stats")
	bool ConsumeStamina(float Amount);

	UFUNCTION(BlueprintPure, Category = "Stats")
	float GetHealthPercent() const { return MaxHealth > 0.f ? Health / MaxHealth : 0.f; }

	UFUNCTION(BlueprintPure, Category = "Stats")
	float GetStaminaPercent() const { return MaxStamina > 0.f ? Stamina / MaxStamina : 0.f; }

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnStatChangedSignature OnHealthChanged;

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnStatChangedSignature OnStaminaChanged;

protected:
	UPROPERTY(ReplicatedUsing = OnRep_Health, EditDefaultsOnly, Category = "Stats")
	float Health;

	UPROPERTY(EditDefaultsOnly, Category = "Stats")
	float MaxHealth;

	UPROPERTY(ReplicatedUsing = OnRep_Stamina, EditDefaultsOnly, Category = "Stats")
	float Stamina;

	UPROPERTY(EditDefaultsOnly, Category = "Stats")
	float MaxStamina;

	UPROPERTY(EditDefaultsOnly, Category = "Stats")
	float StaminaRegenRate;

	UPROPERTY(EditDefaultsOnly, Category = "Stats")
	float StaminaDrainRateSprint;

	UFUNCTION()
	void OnRep_Health();

	UFUNCTION()
	void OnRep_Stamina();
};
