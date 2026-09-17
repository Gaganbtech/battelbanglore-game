// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCEnterableBuilding.generated.h"

UENUM(BlueprintType)
enum class EBuildingInteriorType : uint8
{
	Warehouse UMETA(DisplayName = "Peenya Industrial Warehouse"),
	TechOffice UMETA(DisplayName = "Silicon Valley Tech Office"),
	Apartment UMETA(DisplayName = "Residency Road Living Apartment"),
	MetroHub UMETA(DisplayName = "Transit Terminal Concourse")
};

UCLASS()
class BENGALURULASTCITY_API ABLCEnterableBuilding : public AActor
{
	GENERATED_BODY()

public:
	ABLCEnterableBuilding();

protected:
	virtual void BeginPlay() override;

public:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Building")
	TObjectPtr<USceneComponent> SceneRoot;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Building")
	TObjectPtr<UStaticMeshComponent> ExteriorShellMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Building")
	TObjectPtr<UStaticMeshComponent> InteriorFloorMesh;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Building")
	EBuildingInteriorType BuildingType;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Building")
	bool bHasInteractiveDoors;

	UFUNCTION(BlueprintCallable, Category = "Building")
	void ToggleEntranceDoor(bool bOpen);

	UFUNCTION(BlueprintCallable, Category = "Building")
	void SpawnInteriorLoot();
};
