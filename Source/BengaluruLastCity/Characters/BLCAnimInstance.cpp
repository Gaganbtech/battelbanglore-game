// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCAnimInstance.h"
#include "BLCPlayerCharacter.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Kismet/KismetMathLibrary.h"

UBLCAnimInstance::UBLCAnimInstance()
	: GroundSpeed(0.0f)
	, Direction(0.0f)
	, LocomotionState(EBLCLocomotionState::Idle)
	, bIsGrounded(true)
	, bIsCrouched(false)
	, bIsSprinting(false)
	, bIsAiming(false)
	, bIsFiring(false)
	, AimPitch(0.0f)
	, AimYaw(0.0f)
	, LandCompression(0.0f)
{
}

void UBLCAnimInstance::NativeInitializeAnimation()
{
	Super::NativeInitializeAnimation();

	Character = Cast<ABLCPlayerCharacter>(TryGetPawnOwner());
	if (Character)
	{
		MovementComponent = Character->GetCharacterMovement();
	}
}

void UBLCAnimInstance::NativeUpdateAnimation(float DeltaSeconds)
{
	Super::NativeUpdateAnimation(DeltaSeconds);

	if (!Character || !MovementComponent)
	{
		Character = Cast<ABLCPlayerCharacter>(TryGetPawnOwner());
		if (Character)
		{
			MovementComponent = Character->GetCharacterMovement();
		}
		return;
	}

	// 1. Calculate Velocity & Direction
	const FVector Velocity = Character->GetVelocity();
	GroundSpeed = Velocity.Size2D();
	Direction = CalculateDirection(Velocity, Character->GetActorRotation());

	// 2. Grounded & Movement States
	bIsGrounded = MovementComponent->IsMovingOnGround();
	bIsCrouched = MovementComponent->IsCrouching();

	// 3. Determine Locomotion State
	if (!bIsGrounded)
	{
		LocomotionState = (Velocity.Z < -100.0f) ? EBLCLocomotionState::Falling : EBLCLocomotionState::JumpStart;
	}
	else if (bIsCrouched)
	{
		LocomotionState = (GroundSpeed > 10.0f) ? EBLCLocomotionState::CrouchWalk : EBLCLocomotionState::Crouch;
	}
	else if (GroundSpeed > 650.0f)
	{
		LocomotionState = EBLCLocomotionState::Sprint;
		bIsSprinting = true;
	}
	else if (GroundSpeed > 350.0f)
	{
		LocomotionState = EBLCLocomotionState::Jog;
		bIsSprinting = false;
	}
	else if (GroundSpeed > 20.0f)
	{
		LocomotionState = EBLCLocomotionState::Walk;
		bIsSprinting = false;
	}
	else
	{
		LocomotionState = EBLCLocomotionState::Idle;
		bIsSprinting = false;
	}

	// 4. Calculate Aim Offsets relative to Control Rotation
	const FRotator ControlRotation = Character->GetControlRotation();
	const FRotator ActorRotation = Character->GetActorRotation();
	const FRotator DeltaRot = UKismetMathLibrary::NormalizedDeltaRotator(ControlRotation, ActorRotation);

	AimPitch = DeltaRot.Pitch;
	AimYaw = DeltaRot.Yaw;

	// 5. Landing compression spring decay
	LandCompression = FMath::FInterpTo(LandCompression, 0.0f, DeltaSeconds, 12.0f);
}
