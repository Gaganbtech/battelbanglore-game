// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Vehicles/BLCVehicleBase.h"
#include "BLCPoliceVehicle.generated.h"

UCLASS()
class BENGALURULASTCITY_API ABLCPoliceVehicle : public ABLCVehicleBase
{
	GENERATED_BODY()

public:
	ABLCPoliceVehicle();

protected:
	virtual void BeginPlay() override;

public:
	virtual void Tick(float DeltaTime) override;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Emergency Equipment")
	bool bSirenActive;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Emergency Equipment")
	bool bLightbarStrobesActive;

	UFUNCTION(BlueprintCallable, Category = "Emergency Equipment")
	void SetEmergencyResponseMode(bool bActive);
};
