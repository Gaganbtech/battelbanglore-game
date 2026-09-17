// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "BLCNPCController.generated.h"

/**
 * Basic AI Controller for Bengaluru civilian NPCs.
 * Follows sidewalk waypoints and handles pedestrian obstacle avoidance.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCNPCController : public AAIController
{
	GENERATED_BODY()

public:
	ABLCNPCController();

	virtual void OnPossess(APawn* InPawn) override;

	/** Directs NPC to a random walkable location on the sidewalk */
	void MoveToNextSidewalkWaypoint();

protected:
	FTimerHandle WaypointTimerHandle;
};
