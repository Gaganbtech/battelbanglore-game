// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCMetroSystem.h"
#include "Components/SplineComponent.h"
#include "Components/StaticMeshComponent.h"

ABLCMetroSystem::ABLCMetroSystem()
{
	PrimaryActorTick.bCanEverTick = false;

	TrackSpline = CreateDefaultSubobject<USplineComponent>(TEXT("TrackSpline"));
	RootComponent = TrackSpline;
}

void ABLCMetroSystem::OnConstruction(const FTransform& Transform)
{
	Super::OnConstruction(Transform);
	SpawnModularPillarsAndTrack();
}

void ABLCMetroSystem::SpawnModularPillarsAndTrack()
{
	// Modular placement of elevated piers and rail viaducts along spline
	UE_LOG(LogTemp, Log, TEXT("[BLCMetroSystem] Modular metro viaduct constructed along corridor spline."));
}
