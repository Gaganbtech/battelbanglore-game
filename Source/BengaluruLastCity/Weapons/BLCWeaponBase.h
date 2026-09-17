// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCWeaponBase.generated.h"

class USkeletalMeshComponent;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnAmmoChangedSignature, int32, CurrentClip, int32, ReserveAmmo);

/**
 * Base weapon actor for Bengaluru: Last City.
 * Supports Assault Rifles (AR-9 Bangalore Special), pistols, ballistics, recoil, and ammo pools.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCWeaponBase : public AActor
{
	GENERATED_BODY()

public:
	ABLCWeaponBase();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	/** Fires a round */
	UFUNCTION(BlueprintCallable, Category = "Combat")
	virtual void Fire(const FVector& MuzzleLocation, const FVector& AimDirection);

	/** Reloads weapon magazine */
	UFUNCTION(BlueprintCallable, Category = "Combat")
	virtual void Reload();

	UFUNCTION(BlueprintPure, Category = "Combat")
	int32 GetCurrentClipAmmo() const { return CurrentClipAmmo; }

	UFUNCTION(BlueprintPure, Category = "Combat")
	int32 GetReserveAmmo() const { return ReserveAmmo; }

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnAmmoChangedSignature OnAmmoChanged;

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Mesh")
	USkeletalMeshComponent* WeaponMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Weapon|Stats")
	FText WeaponName;

	UPROPERTY(EditDefaultsOnly, Category = "Weapon|Stats")
	float BaseDamage = 32.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Weapon|Stats")
	float FireRate = 600.0f; // rounds per minute

	UPROPERTY(EditDefaultsOnly, Category = "Weapon|Stats")
	float MaxRange = 25000.0f; // 250m

	UPROPERTY(EditDefaultsOnly, Category = "Weapon|Stats")
	int32 MagazineCapacity = 30;

	UPROPERTY(ReplicatedUsing = OnRep_ClipAmmo, VisibleAnywhere, Category = "Weapon|Ammo")
	int32 CurrentClipAmmo;

	UPROPERTY(ReplicatedUsing = OnRep_ReserveAmmo, VisibleAnywhere, Category = "Weapon|Ammo")
	int32 ReserveAmmo;

	UFUNCTION()
	void OnRep_ClipAmmo();

	UFUNCTION()
	void OnRep_ReserveAmmo();
};
