// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "BLCInventoryComponent.generated.h"

USTRUCT(BlueprintType)
struct FBLCInventorySlot
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
	FString ItemId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
	int32 Quantity = 1;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
	int32 ItemTier = 1;
};

/**
 * Replicated ActorComponent managing player loadout, armor attachments, and backpack capacity.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class BENGALURULASTCITY_API UBLCInventoryComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UBLCInventoryComponent();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	/** Equips weapon into primary or secondary slot */
	UFUNCTION(BlueprintCallable, Category = "Inventory")
	bool EquipWeapon(const FString& WeaponId, bool bIsPrimarySlot);

	/** Consumes medical supply item */
	UFUNCTION(BlueprintCallable, Category = "Inventory")
	bool ConsumeMedicalItem(const FString& MedId);

	// Getters
	UFUNCTION(BlueprintPure, Category = "Inventory")
	FString GetPrimaryWeaponId() const { return PrimaryWeaponSlot.ItemId; }

	UFUNCTION(BlueprintPure, Category = "Inventory")
	FString GetSecondaryWeaponId() const { return SecondaryWeaponSlot.ItemId; }

	UFUNCTION(BlueprintPure, Category = "Inventory")
	int32 GetAmmoCount(const FString& Caliber) const;

protected:
	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Inventory|Slots")
	FBLCInventorySlot PrimaryWeaponSlot;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Inventory|Slots")
	FBLCInventorySlot SecondaryWeaponSlot;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Inventory|Slots")
	FBLCInventorySlot SidearmSlot;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Inventory|Storage")
	int32 BackpackCapacity = 200;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Inventory|Storage")
	TArray<FBLCInventorySlot> BackpackItems;
};
