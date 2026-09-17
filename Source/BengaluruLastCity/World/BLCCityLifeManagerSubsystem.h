// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCCityLifeManagerSubsystem.generated.h"

UCLASS()
class BENGALURULASTCITY_API UBLCCityLifeManagerSubsystem : public UWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	UPROPERTY(BlueprintReadOnly, Category = "City Simulation")
	float UrbanSimulationTimeHours;

	UFUNCTION(BlueprintCallable, Category = "City Simulation")
	void TriggerDynamicCityEvent(const FString& EventName);

	UFUNCTION(BlueprintCallable, Category = "City Simulation")
	void SetCityCrowdDensity(float DensityMultiplier);
};
