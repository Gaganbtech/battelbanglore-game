// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "BLCWeaponComponent.generated.h"

class ABLCWeaponBase;

/**
 * Player combat component managing equipped weapons, ADS aiming, recoil, and fire commands.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class BENGALURULASTCITY_API UBLCWeaponComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UBLCWeaponComponent();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void StartFire();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void StopFire();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void StartAim();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void StopAim();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void Reload();

	UFUNCTION(BlueprintPure, Category = "Combat")
	bool IsAiming() const { return bIsAiming; }

	UFUNCTION(BlueprintPure, Category = "Combat")
	ABLCWeaponBase* GetEquippedWeapon() const { return EquippedWeapon; }

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Combat")
	TSubclassOf<ABLCWeaponBase> DefaultWeaponClass;

	UPROPERTY()
	ABLCWeaponBase* EquippedWeapon;

	bool bIsFiring;
	bool bIsAiming;
};
