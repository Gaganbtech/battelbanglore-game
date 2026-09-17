// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCSafeZoneSubsystem.h"

void UBLCSafeZoneSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);

	CurrentCenter = FVector::ZeroVector;
	CurrentRadius = 250000.0f; // 2.5 km initial circle
	TargetCenter = FVector::ZeroVector;
	TargetRadius = 250000.0f;
	CurrentRingPhase = 0;
	bIsShrinking = false;
}

void UBLCSafeZoneSubsystem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (bIsShrinking)
	{
		CurrentRadius = FMath::FInterpTo(CurrentRadius, TargetRadius, DeltaTime, 0.1f);
		CurrentCenter = FMath::VInterpTo(CurrentCenter, TargetCenter, DeltaTime, 0.1f);
		OnSafeZoneUpdated.Broadcast(CurrentCenter, CurrentRadius, PhaseTimer);
	}
}

void UBLCSafeZoneSubsystem::StartMatchZoneSequence()
{
	CurrentRingPhase = 1;
	bIsShrinking = true;
	TargetRadius = 120000.0f; // Collapse to Phase 1 circle
	TargetCenter = FVector(20000.0f, -15000.0f, 0.0f); // Centered between Zone A and B
	PhaseTimer = 180.0f;
}

bool UBLCSafeZoneSubsystem::IsLocationInsideSafeZone(const FVector& TestLoc) const
{
	float Dist2D = FVector::Dist2D(TestLoc, CurrentCenter);
	return Dist2D <= CurrentRadius;
}
