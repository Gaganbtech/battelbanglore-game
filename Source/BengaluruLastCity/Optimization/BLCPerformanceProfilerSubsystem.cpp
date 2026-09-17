// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "Optimization/BLCPerformanceProfilerSubsystem.h"

void UBLCPerformanceProfilerSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);
	CurrentFPS = 60.0f;
	FrameTimeMs = 16.67f;
	OnePercentLowFPS = 58.5f;
	ActiveDrawCalls = 185;
	ActiveQualityPreset = EQualityPresetLevel::High;

	UE_LOG(LogTemp, Log, TEXT("UBLCPerformanceProfilerSubsystem Initialized for 60 FPS Target."));
}

void UBLCPerformanceProfilerSubsystem::Deinitialize()
{
	Super::Deinitialize();
}

void UBLCPerformanceProfilerSubsystem::ApplyScalabilityPreset(EQualityPresetLevel NewLevel)
{
	ActiveQualityPreset = NewLevel;
	UE_LOG(LogTemp, Log, TEXT("Applied Scalability Preset Level: %d"), (int32)NewLevel);
}

void UBLCPerformanceProfilerSubsystem::RecordFrameTime(float DeltaSeconds)
{
	if (DeltaSeconds > 0.0f)
	{
		FrameTimeMs = DeltaSeconds * 1000.0f;
		CurrentFPS = 1.0f / DeltaSeconds;
	}
}
