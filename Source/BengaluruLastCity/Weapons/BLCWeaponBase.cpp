// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCWeaponBase.h"
#include "Components/SkeletalMeshComponent.h"
#include "Net/UnrealNetwork.h"
#include "CollisionQueryParams.h"
#include "Engine/World.h"

ABLCWeaponBase::ABLCWeaponBase()
{
	bReplicates = true;

	WeaponMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("WeaponMesh"));
	RootComponent = WeaponMesh;

	CurrentClipAmmo = 30;
	ReserveAmmo = 120;
}

void ABLCWeaponBase::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(ABLCWeaponBase, CurrentClipAmmo);
	DOREPLIFETIME(ABLCWeaponBase, ReserveAmmo);
}

void ABLCWeaponBase::Fire(const FVector& MuzzleLocation, const FVector& AimDirection)
{
	if (CurrentClipAmmo <= 0) return;

	CurrentClipAmmo--;
	OnAmmoChanged.Broadcast(CurrentClipAmmo, ReserveAmmo);

	FHitResult HitResult;
	FCollisionQueryParams QueryParams;
	QueryParams.AddIgnoredActor(this);
	QueryParams.AddIgnoredActor(GetOwner());

	FVector TraceEnd = MuzzleLocation + (AimDirection * MaxRange);

	GetWorld()->LineTraceSingleByChannel(HitResult, MuzzleLocation, TraceEnd, ECC_Visibility, QueryParams);
}

void ABLCWeaponBase::Reload()
{
	if (CurrentClipAmmo >= MagazineCapacity || ReserveAmmo <= 0) return;

	int32 NeededAmmo = MagazineCapacity - CurrentClipAmmo;
	int32 AmmoToTake = FMath::Min(NeededAmmo, ReserveAmmo);

	CurrentClipAmmo += AmmoToTake;
	ReserveAmmo -= AmmoToTake;

	OnAmmoChanged.Broadcast(CurrentClipAmmo, ReserveAmmo);
}

void ABLCWeaponBase::OnRep_ClipAmmo()
{
	OnAmmoChanged.Broadcast(CurrentClipAmmo, ReserveAmmo);
}

void ABLCWeaponBase::OnRep_ReserveAmmo()
{
	OnAmmoChanged.Broadcast(CurrentClipAmmo, ReserveAmmo);
}
