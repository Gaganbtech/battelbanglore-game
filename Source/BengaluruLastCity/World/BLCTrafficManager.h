// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCTrafficManager.generated.h"

class ABLCVehicleBase;

USTRUCT(BlueprintType)
struct FBLCTrafficNode
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Traffic")
	FVector Location;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Traffic")
	float SpeedLimit = 50.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Traffic")
	bool bIsIntersection = false;
};

/**
 * Traffic Manager Actor for Bengaluru: Last City.
 * Controls road-bound vehicle spawning (Auto-rickshaws, BMTC buses, cars),
 * traffic signal cycles, and collision buffer spacing.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCTrafficManager : public AActor
{
	GENERATED_BODY()

public:
	ABLCTrafficManager();

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;

	UFUNCTION(BlueprintCallable, Category = "Traffic")
	void SpawnAmbientTraffic(int32 TargetCount);

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Traffic Classes")
	TSubclassOf<ABLCVehicleBase> AutoRickshawClass;

	UPROPERTY(EditDefaultsOnly, Category = "Traffic Classes")
	TSubclassOf<ABLCVehicleBase> CityBusClass;

	UPROPERTY(EditDefaultsOnly, Category = "Traffic Classes")
	TSubclassOf<ABLCVehicleBase> CivilianSedanClass;

	UPROPERTY(EditInstanceOnly, Category = "Traffic Waypoints")
	TArray<FBLCTrafficNode> CityRouteNodes;

	UPROPERTY(EditDefaultsOnly, Category = "Traffic Config")
	int32 MaxActiveVehicles = 40;

	UPROPERTY()
	TArray<ABLCVehicleBase*> ActiveVehicles;
};
