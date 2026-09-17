// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCCameraComponent.h"
#include "GameFramework/SpringArmComponent.h"

UBLCCameraComponent::UBLCCameraComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
	FieldOfView = NormalFOV;
	CurrentTargetFOV = NormalFOV;
	FOVInterpSpeed = 5.0f;
}

void UBLCCameraComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	if (!FMath::IsNearlyEqual(FieldOfView, CurrentTargetFOV, 0.1f))
	{
		FieldOfView = FMath::FInterpTo(FieldOfView, CurrentTargetFOV, DeltaTime, FOVInterpSpeed);
	}
}

void UBLCCameraComponent::SetTargetArmLength(float NewLength)
{
	if (USpringArmComponent* SpringArm = Cast<USpringArmComponent>(GetAttachParent()))
	{
		SpringArm->TargetArmLength = NewLength;
	}
}

void UBLCCameraComponent::SetShoulderOffset(const FVector& NewOffset)
{
	if (USpringArmComponent* SpringArm = Cast<USpringArmComponent>(GetAttachParent()))
	{
		SpringArm->SocketOffset = NewOffset;
	}
}

void UBLCCameraComponent::SetTargetFOV(float InTargetFOV, float InterpSpeed)
{
	CurrentTargetFOV = InTargetFOV;
	FOVInterpSpeed = InterpSpeed;
}
