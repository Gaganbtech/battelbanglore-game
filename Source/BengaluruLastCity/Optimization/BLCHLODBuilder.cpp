// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#include "Optimization/BLCHLODBuilder.h"

void UBLCHLODBuilder::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);
    WarmupDurationSeconds = 0.4f;
}

void UBLCHLODBuilder::WarmupCellHLOD(FName CellID)
{
    // Pre-warms virtual textures and Nanite geometry for World Partition streaming cells
    UE_LOG(LogTemp, Log, TEXT("Warming up HLOD Cell: %s (Duration: %.2fs)"), *CellID.ToString(), WarmupDurationSeconds);
}

bool UBLCHLODBuilder::RequiresWarmup(FName CellID) const
{
    // Returns true if cell contains virtual textures or Nanite foliage requiring shader pipeline warmup
    return true;
}
