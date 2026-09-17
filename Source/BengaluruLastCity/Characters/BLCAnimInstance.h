// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimInstance.h"
#include "BLCAnimInstance.generated.h"

class ABLCPlayerCharacter;
class UCharacterMovementComponent;

UENUM(BlueprintType)
enum class EBLCLocomotionState : uint8
{
	Idle UMETA(DisplayName = "Idle"),
	Walk UMETA(DisplayName = "Walk"),
	FastWalk UMETA(DisplayName = "Fast Walk"),
	Jog UMETA(DisplayName = "Jog"),
	Sprint UMETA(DisplayName = "Sprint"),
	Crouch UMETA(DisplayName = "Crouch"),
	CrouchWalk UMETA(DisplayName = "Crouch Walk"),
	JumpStart UMETA(DisplayName = "Jump Start"),
	Falling UMETA(DisplayName = "Falling"),
	Landing UMETA(DisplayName = "Landing"),
	Downed UMETA(DisplayName = "Downed")
};

/**
 * Production-Quality Animation Instance for Bengaluru: Last City.
 * Powers directional blend spaces, Layered Blend Per Bone, Two-Bone IK, and aim offsets.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCAnimInstance : public UAnimInstance
{
	GENERATED_BODY()

public:
	UBLCAnimInstance();

	virtual void NativeInitializeAnimation() override;
	virtual void NativeUpdateAnimation(float DeltaSeconds) override;

protected:
	UPROPERTY(BlueprintReadOnly, Category = "References")
	TObjectPtr<ABLCPlayerCharacter> Character;

	UPROPERTY(BlueprintReadOnly, Category = "References")
	TObjectPtr<UCharacterMovementComponent> MovementComponent;

	/** Locomotion Blend Space Inputs */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	float GroundSpeed;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	float Direction;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	EBLCLocomotionState LocomotionState;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	bool bIsGrounded;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	bool bIsCrouched;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	bool bIsSprinting;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Combat")
	bool bIsAiming;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Combat")
	bool bIsFiring;

	/** Aim Offset Angles for Upper Body Follow */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Combat")
	float AimPitch;

	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Combat")
	float AimYaw;

	/** Two-Bone IK Hand Transform Sockets */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "IK")
	FTransform LeftHandIKTransform;

	/** Landing Absorption Compression Depth */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Locomotion")
	float LandCompression;
};
