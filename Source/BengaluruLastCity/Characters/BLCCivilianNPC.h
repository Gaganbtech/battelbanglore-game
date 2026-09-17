// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "BLCCharacterBase.h"
#include "BLCCivilianNPC.generated.h"

/**
 * Bengaluru civilian pedestrian AI character.
 * Wanders along sidewalks, crosses roads at pedestrian crossings, and reacts to nearby player presence.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCCivilianNPC : public ABLCCharacterBase
{
	GENERATED_BODY()

public:
	ABLCCivilianNPC(const FObjectInitializer& ObjectInitializer);

	virtual void BeginPlay() override;

	/** Called when nearby threat or fast vehicle passes */
	UFUNCTION(BlueprintCallable, Category = "AI")
	void ReactToPresence(AActor* InstigatorActor);

protected:
	UPROPERTY(EditDefaultsOnly, Category = "Civilian")
	float WalkSpeed = 160.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Civilian")
	float PanicRunSpeed = 480.0f;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Civilian")
	bool bIsPanicked = false;
};
