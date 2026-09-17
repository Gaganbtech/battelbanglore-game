// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCNPCController.h"
#include "NavigationSystem.h"

ABLCNPCController::ABLCNPCController()
{
	bWantsPlayerState = false;
}

void ABLCNPCController::OnPossess(APawn* InPawn)
{
	Super::OnPossess(InPawn);
	GetWorld()->GetTimerManager().SetTimer(WaypointTimerHandle, this, &ABLCNPCController::MoveToNextSidewalkWaypoint, 5.0f, true, 1.0f);
}

void ABLCNPCController::MoveToNextSidewalkWaypoint()
{
	APawn* ControlledPawn = GetPawn();
	if (!ControlledPawn) return;

	UNavigationSystemV1* NavSys = FNavigationSystem::GetCurrent<UNavigationSystemV1>(GetWorld());
	if (NavSys)
	{
		FNavLocation RandomPt;
		if (NavSys->GetRandomReachablePointInRadius(ControlledPawn->GetActorLocation(), 1500.0f, RandomPt))
		{
			MoveToLocation(RandomPt.Location);
		}
	}
}
