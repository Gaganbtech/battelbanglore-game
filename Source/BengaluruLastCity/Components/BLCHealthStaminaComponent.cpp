// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCHealthStaminaComponent.h"
#include "Net/UnrealNetwork.h"

UBLCHealthStaminaComponent::UBLCHealthStaminaComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
	SetIsReplicatedByDefault(true);

	MaxHealth = 100.0f;
	Health = 100.0f;
	MaxStamina = 100.0f;
	Stamina = 100.0f;
	StaminaRegenRate = 18.0f;
	StaminaDrainRateSprint = 15.0f;
}

void UBLCHealthStaminaComponent::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(UBLCHealthStaminaComponent, Health);
	DOREPLIFETIME(UBLCHealthStaminaComponent, Stamina);
}

void UBLCHealthStaminaComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	if (Stamina < MaxStamina)
	{
		Stamina = FMath::Clamp(Stamina + (StaminaRegenRate * DeltaTime), 0.0f, MaxStamina);
		OnStaminaChanged.Broadcast(Stamina, MaxStamina);
	}
}

void UBLCHealthStaminaComponent::TakeDamage(float DamageAmount)
{
	Health = FMath::Clamp(Health - DamageAmount, 0.0f, MaxHealth);
	OnHealthChanged.Broadcast(Health, MaxHealth);
}

bool UBLCHealthStaminaComponent::ConsumeStamina(float Amount)
{
	if (Stamina >= Amount)
	{
		Stamina = FMath::Clamp(Stamina - Amount, 0.0f, MaxStamina);
		OnStaminaChanged.Broadcast(Stamina, MaxStamina);
		return true;
	}
	return false;
}

void UBLCHealthStaminaComponent::OnRep_Health()
{
	OnHealthChanged.Broadcast(Health, MaxHealth);
}

void UBLCHealthStaminaComponent::OnRep_Stamina()
{
	OnStaminaChanged.Broadcast(Stamina, MaxStamina);
}
