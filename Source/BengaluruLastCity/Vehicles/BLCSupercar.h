// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "BengaluruLastCity/Vehicles/BLCVehicleBase.h"
#include "BLCSupercar.generated.h"

class UNiagaraComponent;
class UAudioComponent;

/**
 * High-performance supercar class for Bengaluru: Last City (Phase 2).
 * Features nitro boost, drift mechanics, dynamic exhaust flame VFX, and custom engine acoustics.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCSupercar : public ABLCVehicleBase
{
	GENERATED_BODY()

public:
	ABLCSupercar();

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
	virtual void Tick(float DeltaTime) override;

	/** Activates nitrous oxide boost */
	UFUNCTION(BlueprintCallable, Category = "Supercar")
	void ActivateNitro();

	/** Deactivates nitrous oxide boost */
	UFUNCTION(BlueprintCallable, Category = "Supercar")
	void DeactivateNitro();

	/** Returns current nitro fuel percentage [0.0 - 1.0] */
	UFUNCTION(BlueprintPure, Category = "Supercar")
	float GetNitroPercent() const { return MaxNitroDuration > 0.f ? CurrentNitroFuel / MaxNitroDuration : 0.f; }

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Supercar|Performance")
	float SupercarTopSpeed = 240.0f; // km/h

	UPROPERTY(EditDefaultsOnly, Category = "Supercar|Performance")
	float NitroBoostMultiplier = 1.45f;

	UPROPERTY(EditDefaultsOnly, Category = "Supercar|Performance")
	float MaxNitroDuration = 8.0f; // seconds of continuous boost

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Supercar|Performance")
	float CurrentNitroFuel;

	UPROPERTY(EditDefaultsOnly, Category = "Supercar|Performance")
	float NitroRechargeRate = 0.5f;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Supercar|Effects")
	UNiagaraComponent* LeftExhaustFlameVFX;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Supercar|Effects")
	UNiagaraComponent* RightExhaustFlameVFX;

	bool bIsNitroActive;
};
