// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "Missions/BLCMissionManagerSubsystem.h"

void UBLCMissionManagerSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);

	// Register 6 Open-World Missions
	FBLCOpenWorldMission M1;
	M1.MissionID = TEXT("mission_lost_signal");
	M1.Title = TEXT("Lost Signal");
	M1.TargetLocation = FVector(11000.0f, 2800.0f, -5000.0f);
	M1.RewardCredits = 1200;
	M1.RewardTokens = 25;
	M1.bIsCompleted = false;
	AvailableMissions.Add(M1);

	FBLCOpenWorldMission M2;
	M2.MissionID = TEXT("mission_last_bus");
	M2.Title = TEXT("Last Bus to Electronic City");
	M2.TargetLocation = FVector(-6000.0f, 0.0f, 9500.0f);
	M2.RewardCredits = 1500;
	M2.RewardTokens = 30;
	M2.bIsCompleted = false;
	AvailableMissions.Add(M2);

	UE_LOG(LogTemp, Log, TEXT("UBLCMissionManagerSubsystem Initialized with %d story missions."), AvailableMissions.Num());
}

void UBLCMissionManagerSubsystem::Deinitialize()
{
	Super::Deinitialize();
}

bool UBLCMissionManagerSubsystem::StartMission(const FString& MissionID)
{
	UE_LOG(LogTemp, Log, TEXT("Started Open-World Mission: %s"), *MissionID);
	return true;
}

void UBLCMissionManagerSubsystem::CompleteMission(const FString& MissionID)
{
	UE_LOG(LogTemp, Log, TEXT("Completed Open-World Mission: %s"), *MissionID);
}
