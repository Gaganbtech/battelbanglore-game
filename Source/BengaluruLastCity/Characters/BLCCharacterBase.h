// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCCharacterBase.generated.h"

class UBLCHealthStaminaComponent;

/**
 * Base character class for Bengaluru: Last City.
 * Shared by both playable hero characters and AI civilians.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCCharacterBase : public ACharacter
{
	GENERATED_BODY()

public:
	ABLCCharacterBase(const FObjectInitializer& ObjectInitializer);

	virtual void BeginPlay() override;

	UFUNCTION(BlueprintPure, Category = "Stats")
	UBLCHealthStaminaComponent* GetHealthStaminaComponent() const { return HealthStaminaComp; }

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UBLCHealthStaminaComponent* HealthStaminaComp;
};
