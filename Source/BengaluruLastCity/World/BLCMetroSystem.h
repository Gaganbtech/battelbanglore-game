// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCMetroSystem.generated.h"

class UStaticMeshComponent;
class USplineComponent;

/**
 * Modular Metro Infrastructure Actor for Bengaluru: Last City.
 * Represents elevated viaduct tracks, concrete median piers,
 * fictional "Namma Metro" inspired station concourse, platform, and train cars.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCMetroSystem : public AActor
{
	GENERATED_BODY()

public:
	ABLCMetroSystem();

	virtual void OnConstruction(const FTransform& Transform) override;

	UFUNCTION(BlueprintCallable, Category = "Metro")
	void SpawnModularPillarsAndTrack();

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	USplineComponent* TrackSpline;

	UPROPERTY(EditDefaultsOnly, Category = "Meshes")
	UStaticMesh* ConcretePillarMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Meshes")
	UStaticMesh* ViaductTrackMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Meshes")
	UStaticMesh* StationConcourseMesh;

	UPROPERTY(EditDefaultsOnly, Category = "Config")
	float PillarSpacing = 2500.0f; // 25m between pillars

	UPROPERTY(EditDefaultsOnly, Category = "Config")
	float TrackElevation = 900.0f; // 9m above street grade
};
