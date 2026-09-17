// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCBengaluruRoadActor.generated.h"

UENUM(BlueprintType)
enum class ERoadConditionType : uint8
{
	GoodArterial UMETA(DisplayName = "Good Arterial Road"),
	WeatheredPatched UMETA(DisplayName = "Weathered with Bitumen Patches"),
	DamagedPotholes UMETA(DisplayName = "Damaged with 3D Potholes"),
	ConstructionZone UMETA(DisplayName = "BBMP Roadwork Construction"),
	MonsoonFlooded UMETA(DisplayName = "Monsoon Waterlogging Stretch")
};

UCLASS()
class BENGALURULASTCITY_API ABLCBengaluruRoadActor : public AActor
{
	GENERATED_BODY()

public:
	ABLCBengaluruRoadActor();

protected:
	virtual void BeginPlay() override;

public:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Road")
	TObjectPtr<USceneComponent> SceneRoot;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Road")
	TObjectPtr<UStaticMeshComponent> RoadMesh;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Road Condition")
	ERoadConditionType RoadCondition;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Road Condition")
	bool bHasIndianSpeedBreakers;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Road Condition")
	bool bHasStormDrainageGrates;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Road Condition")
	bool bHasInterlockingPaverFootpath;
};
