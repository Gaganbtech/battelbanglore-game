// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCSupplyDropManager.h"
#include "Components/StaticMeshComponent.h"

ABLCSupplyCrateActor::ABLCSupplyCrateActor()
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	CrateMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("CrateMesh"));
	RootComponent = CrateMesh;

	ParachuteMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ParachuteMesh"));
	ParachuteMesh->SetupAttachment(CrateMesh);
	ParachuteMesh->SetRelativeLocation(FVector(0.f, 0.f, 450.f));
}

void ABLCSupplyCrateActor::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (!bHasLanded)
	{
		FVector NewLoc = GetActorLocation() - FVector(0.f, 0.f, FallSpeed * DeltaSeconds);
		if (NewLoc.Z <= 70.f)
		{
			NewLoc.Z = 70.f;
			bHasLanded = true;
			ParachuteMesh->SetVisibility(false);
		}
		SetActorLocation(NewLoc);
	}
}

void ABLCSupplyCrateActor::OpenCrate(APawn* InteractingPawn)
{
	if (!bHasLanded || bIsOpened) return;
	bIsOpened = true;
}

ABLCSupplyDropManager::ABLCSupplyDropManager()
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;
}

void ABLCSupplyDropManager::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (HasAuthority())
	{
		DropTimer -= DeltaSeconds;
		if (DropTimer <= 0.0f)
		{
			const FVector RandomLocation = FVector(
				FMath::RandRange(-20000.f, 20000.f),
				FMath::RandRange(-20000.f, 20000.f),
				18000.f
			);
			DispatchSupplyDrop(RandomLocation);
			DropTimer = DropIntervalSeconds;
		}
	}
}

void ABLCSupplyDropManager::DispatchSupplyDrop(FVector TargetLocation)
{
	if (UWorld* World = GetWorld())
	{
		FActorSpawnParameters SpawnParams;
		World->SpawnActor<ABLCSupplyCrateActor>(ABLCSupplyCrateActor::StaticClass(), TargetLocation, FRotator::ZeroRotator, SpawnParams);
	}
}
