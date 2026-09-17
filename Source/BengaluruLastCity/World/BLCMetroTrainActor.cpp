// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCMetroTrainActor.h"
#include "Components/StaticMeshComponent.h"

ABLCMetroTrainActor::ABLCMetroTrainActor()
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	LeadCoachMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("LeadCoachMesh"));
	RootComponent = LeadCoachMesh;

	CurrentTrainState = EBLCTrainState::CruisingTrack;
}

void ABLCMetroTrainActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	// Train spline advancement and station dwell logic
}
