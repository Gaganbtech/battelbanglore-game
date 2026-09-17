// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "World/BLCAdvancedMetroStation.h"

ABLCAdvancedMetroStation::ABLCAdvancedMetroStation()
{
	PrimaryActorTick.bCanEverTick = false;

	SceneRoot = CreateDefaultSubobject<USceneComponent>(TEXT("SceneRoot"));
	SetRootComponent(SceneRoot);

	ConcourseMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ConcourseMesh"));
	ConcourseMesh->SetupAttachment(RootComponent);

	PlatformNorthMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PlatformNorthMesh"));
	PlatformNorthMesh->SetupAttachment(RootComponent);

	PlatformSouthMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PlatformSouthMesh"));
	PlatformSouthMesh->SetupAttachment(RootComponent);

	StationName = TEXT("MG Road Central Interchange");
	KannadaStationName = TEXT("ಎಂ.ಜಿ. ರಸ್ತೆ ಸೆಂಟ್ರಲ್");
	TrackElevation = 1400.0f;
}

void ABLCAdvancedMetroStation::BeginPlay()
{
	Super::BeginPlay();
}

void ABLCAdvancedMetroStation::PlayArrivalAnnouncement(const FString& NextStationName)
{
	UE_LOG(LogTemp, Log, TEXT("Metro Station %s: Next Station Announcement -> %s"), *StationName, *NextStationName);
}
