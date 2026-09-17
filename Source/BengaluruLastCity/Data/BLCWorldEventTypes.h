// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameplayTagContainer.h"
#include "BLCWorldEventTypes.generated.h"

/**
 * Dynamic City and Battle Royale Event definition
 */
USTRUCT(BlueprintType)
struct FBLCWorldEventDefinition
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Event")
	FName EventID;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Event")
	FGameplayTag EventTag;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Event")
	FVector TriggerLocation = FVector::ZeroVector;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Event")
	float DurationSeconds = 120.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Event")
	bool bIsGlobalBroadcast = true;
};
