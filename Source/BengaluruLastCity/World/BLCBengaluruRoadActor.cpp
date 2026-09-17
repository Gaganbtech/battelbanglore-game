// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "World/BLCBengaluruRoadActor.h"

ABLCBengaluruRoadActor::ABLCBengaluruRoadActor()
{
	PrimaryActorTick.bCanEverTick = false;

	SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
	SetRootComponent(SceneRoot);

	RoadMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("RoadMesh"));
	RoadMesh->SetupAttachment(RootComponent);

	RoadCondition = ERoadConditionType::GoodArterial;
	bHasIndianSpeedBreakers = false;
	bHasStormDrainageGrates = true;
	bHasInterlockingPaverFootpath = true;
}

void ABLCBengaluruRoadActor::BeginPlay()
{
	Super::BeginPlay();
	UE_LOG(LogTemp, Log, TEXT("ABLCBengaluruRoadActor initialized with condition type: %d"), (int32)RoadCondition);
}
