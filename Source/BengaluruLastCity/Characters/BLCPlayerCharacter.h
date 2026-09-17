// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "BLCCharacterBase.h"
#include "InputActionValue.h"
#include "BLCPlayerCharacter.generated.h"

class USpringArmComponent;
class UBLCCameraComponent;
class UBLCMovementComponent;
class UBLCInteractionComponent;
class UInputMappingContext;
class UInputAction;

/**
 * Main playable protagonist character for Bengaluru: Last City.
 * Features realistic locomotion blend support, responsive camera, and city interaction.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCPlayerCharacter : public ABLCCharacterBase
{
	GENERATED_BODY()

public:
	ABLCPlayerCharacter(const FObjectInitializer& ObjectInitializer);

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
	virtual void PossessedBy(AController* NewController) override;

	/** Enhanced Input Callbacks */
	void Input_Move(const FInputActionValue& Value);
	void Input_Look(const FInputActionValue& Value);
	void Input_StartSprint(const FInputActionValue& Value);
	void Input_StopSprint(const FInputActionValue& Value);
	void Input_StartCrouch(const FInputActionValue& Value);
	void Input_StopCrouch(const FInputActionValue& Value);
	void Input_Interact(const FInputActionValue& Value);
	void Input_ToggleMap(const FInputActionValue& Value);

	UFUNCTION(BlueprintPure, Category = "Camera")
	UBLCCameraComponent* GetFollowCamera() const { return FollowCamera; }

protected:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	USpringArmComponent* CameraBoom;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Camera")
	UBLCCameraComponent* FollowCamera;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
	UBLCInteractionComponent* InteractionComp;

	/** Input actions */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputMappingContext* DefaultMappingContext;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* MoveAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* LookAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* JumpAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* SprintAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* CrouchAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* InteractAction;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Input")
	UInputAction* ToggleMapAction;
};
