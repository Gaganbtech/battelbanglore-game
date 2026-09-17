// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCMovementComponent.generated.h"

/**
 * Custom character movement component supporting walking, running, sprinting, crouching,
 * and future vehicle/metro transitions.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCMovementComponent : public UCharacterMovementComponent
{
	GENERATED_BODY()

public:
	UBLCMovementComponent();

	virtual void UpdateCharacterStateBeforeMovement(float DeltaSeconds) override;
	virtual float GetMaxSpeed() const override;

	/** Sets sprinting state */
	void SetSprinting(bool bNewSprint);

	/** Sets crouch state */
	void SetWantsToCrouch(bool bNewCrouch);

	UFUNCTION(BlueprintPure, Category = "Movement")
	EBLCLocomotionState GetCurrentLocomotionState() const { return CurrentLocomotionState; }

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Speeds")
	float WalkSpeed = 300.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Speeds")
	float RunSpeed = 600.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Speeds")
	float SprintSpeed = 950.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Speeds")
	float CrouchMovementSpeed = 220.0f;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Movement")
	EBLCLocomotionState CurrentLocomotionState;

	UPROPERTY(BlueprintReadOnly, Category = "Movement")
	bool bWantsToSprint;
};
