// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "BLCInteractionComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnInteractableDetectedSignature, const FText&, PromptText);

/**
 * Handles world interaction: detection of nearby drivable vehicles, metro turnstiles, and doors.
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class BENGALURULASTCITY_API UBLCInteractionComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UBLCInteractionComponent();

	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

	/** Executes interaction on current focused actor */
	UFUNCTION(BlueprintCallable, Category = "Interaction")
	void PerformInteraction();

	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnInteractableDetectedSignature OnInteractableFound;

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Interaction")
	float InteractionDistance = 250.0f;

	UPROPERTY()
	TWeakObjectPtr<AActor> CurrentInteractableActor;

	void DetectInteractables();
};
