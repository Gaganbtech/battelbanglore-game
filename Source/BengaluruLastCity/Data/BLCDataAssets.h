// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCDataAssets.generated.h"

/**
 * Primary Data Asset for Bengaluru city districts & landmarks
 */
UCLASS(BlueprintType)
class BENGALURULASTCITY_API UBLCDistrictDataAsset : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "District")
	TArray<FBLCZoneDefinition> Districts;
};

/**
 * Vehicle specifications data asset for Phase 1 vehicles and Phase 2 supercars
 */
UCLASS(BlueprintType)
class BENGALURULASTCITY_API UBLCVehicleDataAsset : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	FText VehicleModelName;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	float TopSpeedKmh = 140.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	float AccelerationFactor = 1.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	float HandlingTightness = 1.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Vehicle")
	int32 PassengerCapacity = 4;
};
