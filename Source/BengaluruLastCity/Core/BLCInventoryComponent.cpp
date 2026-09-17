// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCInventoryComponent.h"
#include "Net/UnrealNetwork.h"

UBLCInventoryComponent::UBLCInventoryComponent()
{
	SetIsReplicatedByDefault(true);

	PrimaryWeaponSlot.ItemId = TEXT("ar9");
	PrimaryWeaponSlot.Quantity = 1;
	PrimaryWeaponSlot.ItemTier = 2;
}

void UBLCInventoryComponent::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(UBLCInventoryComponent, PrimaryWeaponSlot);
	DOREPLIFETIME(UBLCInventoryComponent, SecondaryWeaponSlot);
	DOREPLIFETIME(UBLCInventoryComponent, SidearmSlot);
	DOREPLIFETIME(UBLCInventoryComponent, BackpackCapacity);
	DOREPLIFETIME(UBLCInventoryComponent, BackpackItems);
}

bool UBLCInventoryComponent::EquipWeapon(const FString& WeaponId, bool bIsPrimarySlot)
{
	if (bIsPrimarySlot)
	{
		PrimaryWeaponSlot.ItemId = WeaponId;
		return true;
	}
	else
	{
		SecondaryWeaponSlot.ItemId = WeaponId;
		return true;
	}
}

bool UBLCInventoryComponent::ConsumeMedicalItem(const FString& MedId)
{
	for (int32 i = 0; i < BackpackItems.Num(); ++i)
	{
		if (BackpackItems[i].ItemId == MedId && BackpackItems[i].Quantity > 0)
		{
			BackpackItems[i].Quantity--;
			if (BackpackItems[i].Quantity <= 0)
			{
				BackpackItems.RemoveAt(i);
			}
			return true;
		}
	}
	return false;
}

int32 UBLCInventoryComponent::GetAmmoCount(const FString& Caliber) const
{
	for (const FBLCInventorySlot& Slot : BackpackItems)
	{
		if (Slot.ItemId == Caliber)
		{
			return Slot.Quantity;
		}
	}
	return 0;
}
