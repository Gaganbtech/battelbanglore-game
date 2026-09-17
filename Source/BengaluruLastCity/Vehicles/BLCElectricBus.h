// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Vehicles/BLCVehicleBase.h"
#include "BLCElectricBus.generated.h"

UCLASS()
class BENGALURULASTCITY_API ABLCElectricBus : public ABLCVehicleBase
{
	GENERATED_BODY()

public:
	ABLCElectricBus();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Electric Propulsion")
	float BatterySOC; // 0.0 to 100.0%

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Electric Propulsion")
	float DischargeRatePerKm;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Electric Propulsion")
	bool bIsPluggedIntoFastCharger;

	UFUNCTION(BlueprintCallable, Category = "Electric Propulsion")
	void StartDepotCharging();

	UFUNCTION(BlueprintCallable, Category = "Electric Propulsion")
	void StopDepotCharging();
};
