// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "BLCMissionManagerSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FBLCOpenWorldMission
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	FString MissionID;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	FString Title;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	FVector TargetLocation;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	int32 RewardCredits;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	int32 RewardTokens;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mission")
	bool bIsCompleted;
};

UCLASS()
class BENGALURULASTCITY_API UBLCMissionManagerSubsystem : public UGameInstanceSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	UPROPERTY(BlueprintReadOnly, Category = "Missions")
	TArray<FBLCOpenWorldMission> AvailableMissions;

	UFUNCTION(BlueprintCallable, Category = "Missions")
	bool StartMission(const FString& MissionID);

	UFUNCTION(BlueprintCallable, Category = "Missions")
	void CompleteMission(const FString& MissionID);
};
