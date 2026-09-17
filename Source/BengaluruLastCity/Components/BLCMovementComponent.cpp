// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCMovementComponent.h"
#include "GameFramework/Character.h"

UBLCMovementComponent::UBLCMovementComponent()
{
	MaxWalkSpeed = RunSpeed;
	MaxWalkSpeedCrouched = CrouchMovementSpeed;
	MaxAcceleration = 2400.0f;
	BrakingDecelerationWalking = 2000.0f;
	GroundFriction = 8.0f;
	JumpZVelocity = 520.0f;
	AirControl = 0.25f;

	CurrentLocomotionState = EBLCLocomotionState::Idle;
	bWantsToSprint = false;
	NavAgentProps.bCanCrouch = true;
}

void UBLCMovementComponent::UpdateCharacterStateBeforeMovement(float DeltaSeconds)
{
	Super::UpdateCharacterStateBeforeMovement(DeltaSeconds);

	if (IsFalling())
	{
		CurrentLocomotionState = EBLCLocomotionState::InAir;
	}
	else if (IsCrouching())
	{
		CurrentLocomotionState = EBLCLocomotionState::Crouching;
	}
	else if (Velocity.SizeSquared() < 100.0f)
	{
		CurrentLocomotionState = EBLCLocomotionState::Idle;
	}
	else if (bWantsToSprint && Velocity.Size() > WalkSpeed)
	{
		CurrentLocomotionState = EBLCLocomotionState::Sprinting;
	}
	else if (Velocity.Size() > WalkSpeed)
	{
		CurrentLocomotionState = EBLCLocomotionState::Running;
	}
	else
	{
		CurrentLocomotionState = EBLCLocomotionState::Walking;
	}
}

float UBLCMovementComponent::GetMaxSpeed() const
{
	if (IsCrouching())
	{
		return CrouchMovementSpeed;
	}

	if (bWantsToSprint)
	{
		return SprintSpeed;
	}

	return RunSpeed;
}

void UBLCMovementComponent::SetSprinting(bool bNewSprint)
{
	bWantsToSprint = bNewSprint;
}

void UBLCMovementComponent::SetWantsToCrouch(bool bNewCrouch)
{
	bWantsToCrouch = bNewCrouch;
}
