// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "BLCPerformanceProfilerSubsystem.generated.h"

UENUM(BlueprintType)
enum class EQualityPresetLevel : uint8
{
	Low UMETA(DisplayName = "Low"),
	Medium UMETA(DisplayName = "Medium"),
	High UMETA(DisplayName = "High"),
	Ultra UMETA(DisplayName = "Ultra"),
	Cinematic UMETA(DisplayName = "Cinematic")
};

UCLASS()
class BENGALURULASTCITY_API UBLCPerformanceProfilerSubsystem : public UGameInstanceSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	UPROPERTY(BlueprintReadOnly, Category = "Performance Telemetry")
	float CurrentFPS;

	UPROPERTY(BlueprintReadOnly, Category = "Performance Telemetry")
	float FrameTimeMs;

	UPROPERTY(BlueprintReadOnly, Category = "Performance Telemetry")
	float OnePercentLowFPS;

	UPROPERTY(BlueprintReadOnly, Category = "Performance Telemetry")
	int32 ActiveDrawCalls;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scalability")
	EQualityPresetLevel ActiveQualityPreset;

	UFUNCTION(BlueprintCallable, Category = "Scalability")
	void ApplyScalabilityPreset(EQualityPresetLevel NewLevel);

	UFUNCTION(BlueprintCallable, Category = "Performance Telemetry")
	void RecordFrameTime(float DeltaSeconds);
};
