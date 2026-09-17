// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCWeaponComponent.h"
#include "BLCWeaponBase.h"
#include "BengaluruLastCity/Characters/BLCPlayerCharacter.h"
#include "BengaluruLastCity/Components/BLCCameraComponent.h"

UBLCWeaponComponent::UBLCWeaponComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
	bIsFiring = false;
	bIsAiming = false;
}

void UBLCWeaponComponent::StartFire()
{
	bIsFiring = true;
	if (EquippedWeapon)
	{
		AActor* OwnerActor = GetOwner();
		if (OwnerActor)
		{
			EquippedWeapon->Fire(OwnerActor->GetActorLocation(), OwnerActor->GetActorForwardVector());
		}
	}
}

void UBLCWeaponComponent::StopFire()
{
	bIsFiring = false;
}

void UBLCWeaponComponent::StartAim()
{
	bIsAiming = true;
	if (ABLCPlayerCharacter* PlayerChar = Cast<ABLCPlayerCharacter>(GetOwner()))
	{
		if (UBLCCameraComponent* Cam = PlayerChar->GetFollowCamera())
		{
			Cam->SetTargetFOV(60.0f, 10.0f); // ADS zoom
		}
	}
}

void UBLCWeaponComponent::StopAim()
{
	bIsAiming = false;
	if (ABLCPlayerCharacter* PlayerChar = Cast<ABLCPlayerCharacter>(GetOwner()))
	{
		if (UBLCCameraComponent* Cam = PlayerChar->GetFollowCamera())
		{
			Cam->SetTargetFOV(90.0f, 8.0f);
		}
	}
}

void UBLCWeaponComponent::Reload()
{
	if (EquippedWeapon)
	{
		EquippedWeapon->Reload();
	}
}
