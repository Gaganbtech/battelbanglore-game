// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "Optimization/BLCWorldPartitionSubsystem.h"

void UBLCWorldPartitionSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);

	// Setup 3x3 Sector Grid for Bengaluru Open World
	const FString SectorNames[9] = {
		TEXT("Sector_CentralCommercial"),
		TEXT("Sector_SiliconValleyTech"),
		TEXT("Sector_PeenyaIndustrial"),
		TEXT("Sector_ResidencyResidential"),
		TEXT("Sector_MajesticInterchange"),
		TEXT("Sector_UlsoorLake"),
		TEXT("Sector_WestGateTerminal"),
		TEXT("Sector_ElevatedExpressway"),
		TEXT("Sector_AirportCorridor")
	};

	for (int32 i = 0; i < 9; ++i)
	{
		FBLCCitySectorCell Cell;
		Cell.SectorID = SectorNames[i];
		Cell.SectorCenter = FVector((i % 3 - 1) * 20000.0f, (i / 3 - 1) * 20000.0f, 0.0f);
		Cell.StreamingRadius = 25000.0f; // 250m in Unreal units
		Cell.bIsLoadedInCore = true;
		SectorGrid.Add(Cell);
	}

	UE_LOG(LogTemp, Log, TEXT("UBLCWorldPartitionSubsystem Initialized with %d sectors."), SectorGrid.Num());
}

void UBLCWorldPartitionSubsystem::Deinitialize()
{
	Super::Deinitialize();
}

void UBLCWorldPartitionSubsystem::UpdateSectorStreaming(const FVector& PlayerLocation)
{
	for (FBLCCitySectorCell& Cell : SectorGrid)
	{
		const float Dist = FVector::Dist(Cell.SectorCenter, PlayerLocation);
		Cell.bIsLoadedInCore = (Dist < Cell.StreamingRadius);
	}
}
