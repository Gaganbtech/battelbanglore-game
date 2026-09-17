// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Camera/CameraComponent.h"
#include "BLCCameraComponent.generated.h"

class USpringArmComponent;

/**
 * Professional third-person camera component featuring shoulder offset,
 * smooth collision damping, dynamic FOV adjustments, and camera shake framework.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class BENGALURULASTCITY_API UBLCCameraComponent : public UCameraComponent
{
	GENERATED_BODY()

public:
	UBLCCameraComponent();

	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

	/** Adjusts camera distance (zoom) */
	void SetTargetArmLength(float NewLength);

	/** Sets camera shoulder offset smoothly */
	void SetShoulderOffset(const FVector& NewOffset);

	/** Triggers dynamic FOV change (e.g. for sprinting or aiming) */
	void SetTargetFOV(float InTargetFOV, float InterpSpeed = 5.0f);

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Camera Settings")
	float DefaultArmLength = 350.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Camera Settings")
	FVector DefaultShoulderOffset = FVector(0.0f, 45.0f, 65.0f);

	UPROPERTY(EditDefaultsOnly, Category = "Camera Settings")
	float SprintArmLength = 420.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Camera Settings")
	float NormalFOV = 90.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Camera Settings")
	float SprintFOV = 100.0f;

	float CurrentTargetFOV;
	float FOVInterpSpeed;
};
