// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Core/BLCZoneManager.h"
#include "Components/StaticMeshComponent.h"

ABLCZoneManager::ABLCZoneManager()
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	StormWallMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StormWallMesh"));
	RootComponent = StormWallMesh;

	// Populate standard 6 Battle Royale phases
	FBLCZonePhaseConfig P1; P1.PhaseNumber = 1; P1.Radius = 32000.f; P1.WaitTimeSeconds = 120.f; P1.ShrinkTimeSeconds = 70.f; P1.StormDamagePerSecond = 2.0f;
	FBLCZonePhaseConfig P2; P2.PhaseNumber = 2; P2.Radius = 21000.f; P2.WaitTimeSeconds = 90.f;  P2.ShrinkTimeSeconds = 55.f; P2.StormDamagePerSecond = 3.0f;
	FBLCZonePhaseConfig P3; P3.PhaseNumber = 3; P3.Radius = 12000.f; P3.WaitTimeSeconds = 75.f;  P3.ShrinkTimeSeconds = 45.f; P3.StormDamagePerSecond = 5.0f;
	FBLCZonePhaseConfig P4; P4.PhaseNumber = 4; P4.Radius = 6500.f;  P4.WaitTimeSeconds = 60.f;  P4.ShrinkTimeSeconds = 35.f; P4.StormDamagePerSecond = 8.0f;
	FBLCZonePhaseConfig P5; P5.PhaseNumber = 5; P5.Radius = 3000.f;  P5.WaitTimeSeconds = 45.f;  P5.ShrinkTimeSeconds = 25.f; P5.StormDamagePerSecond = 14.0f;
	FBLCZonePhaseConfig P6; P6.PhaseNumber = 6; P6.Radius = 0.f;     P6.WaitTimeSeconds = 20.f;  P6.ShrinkTimeSeconds = 20.f; P6.StormDamagePerSecond = 22.0f;

	ZonePhases.Add(P1); ZonePhases.Add(P2); ZonePhases.Add(P3);
	ZonePhases.Add(P4); ZonePhases.Add(P5); ZonePhases.Add(P6);
}

void ABLCZoneManager::StartZoneProgression()
{
	if (!HasAuthority()) return;

	bIsZoneActive = true;
	CurrentPhaseIndex = 0;
	if (ZonePhases.Num() > 0)
	{
		PhaseTimer = ZonePhases[0].WaitTimeSeconds;
		TargetRadius = ZonePhases[0].Radius;
	}
}

void ABLCZoneManager::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);
	if (!bIsZoneActive || !HasAuthority()) return;

	PhaseTimer -= DeltaSeconds;

	if (!bIsShrinking)
	{
		if (PhaseTimer <= 0.0f)
		{
			bIsShrinking = true;
			if (CurrentPhaseIndex < ZonePhases.Num())
			{
				PhaseTimer = ZonePhases[CurrentPhaseIndex].ShrinkTimeSeconds;
			}
		}
	}
	else
	{
		const float Alpha = FMath::Clamp(DeltaSeconds / (ZonePhases[CurrentPhaseIndex].ShrinkTimeSeconds + 0.001f), 0.f, 1.f);
		CurrentRadius = FMath::FInterpTo(CurrentRadius, TargetRadius, DeltaSeconds, 0.5f);

		if (PhaseTimer <= 0.0f)
		{
			CurrentRadius = TargetRadius;
			CurrentPhaseIndex++;
			bIsShrinking = false;
			if (CurrentPhaseIndex < ZonePhases.Num())
			{
				PhaseTimer = ZonePhases[CurrentPhaseIndex].WaitTimeSeconds;
				TargetRadius = ZonePhases[CurrentPhaseIndex].Radius;
			}
			else
			{
				bIsZoneActive = false;
			}
		}
	}

	SetActorScale3D(FVector(CurrentRadius / 100.f, CurrentRadius / 100.f, 100.f));
}

bool ABLCZoneManager::IsLocationInStorm(const FVector& WorldLocation) const
{
	const float Dist2D = FVector::Dist2D(WorldLocation, CurrentCenter);
	return Dist2D > CurrentRadius;
}
