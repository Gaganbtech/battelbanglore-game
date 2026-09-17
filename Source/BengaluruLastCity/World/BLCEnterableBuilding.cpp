// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "World/BLCEnterableBuilding.h"

ABLCEnterableBuilding::ABLCEnterableBuilding()
{
	PrimaryActorTick.bCanEverTick = false;

	SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
	SetRootComponent(SceneRoot);

	ExteriorShellMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ExteriorShellMesh"));
	ExteriorShellMesh->SetupAttachment(RootComponent);

	InteriorFloorMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("InteriorFloorMesh"));
	InteriorFloorMesh->SetupAttachment(RootComponent);

	BuildingType = EBuildingInteriorType::Warehouse;
	bHasInteractiveDoors = true;
}

void ABLCEnterableBuilding::BeginPlay()
{
	Super::BeginPlay();
	SpawnInteriorLoot();
}

void ABLCEnterableBuilding::ToggleEntranceDoor(bool bOpen)
{
	UE_LOG(LogTemp, Log, TEXT("Building entrance door state changed: %s"), bOpen ? TEXT("OPEN") : TEXT("CLOSED"));
}

void ABLCEnterableBuilding::SpawnInteriorLoot()
{
	UE_LOG(LogTemp, Log, TEXT("Spawning contextual interior loot for building type: %d"), (int32)BuildingType);
}
