// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCBusRouteSubsystem.generated.h"

class ABLCDoubleDeckerBus;

USTRUCT(BlueprintType)
struct FBLCBusStopWaypoint
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Stop")
	FString StopName;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Stop")
	FVector Location = FVector::ZeroVector;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Stop")
	FRotator BayRotation = FRotator::ZeroRotator;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Stop")
	float DwellTimeSeconds = 8.0f;
};

USTRUCT(BlueprintType)
struct FBLCBusRouteDefinition
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Route")
	FString RouteNumber; // e.g. "201G"

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Route")
	FString RouteDescription; // e.g. "MAJESTIC ⇄ ELECTRONIC CITY"

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BMTC|Route")
	TArray<FBLCBusStopWaypoint> Stops;
};

/**
 * World Subsystem that manages Bengaluru Metropolitan Transport (BMTC) bus routes,
 * fleet dispatching, schedule dwells, and stop announcements.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCBusRouteSubsystem : public UWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	/** Registers a bus actor into the route management system */
	UFUNCTION(BlueprintCallable, Category = "BMTC|Subsystem")
	void RegisterBus(ABLCDoubleDeckerBus* BusActor, const FString& RouteId);

	/** Returns all registered active transit stops */
	UFUNCTION(BlueprintPure, Category = "BMTC|Subsystem")
	const TArray<FBLCBusStopWaypoint>& GetRouteStops(const FString& RouteId) const;

protected:
	UPROPERTY(EditDefaultsOnly, Category = "BMTC|Routes")
	TMap<FString, FBLCBusRouteDefinition> DefinedRoutes;

	UPROPERTY(Transient)
	TArray<ABLCDoubleDeckerBus*> ActiveDoubleDeckerFleet;
};
