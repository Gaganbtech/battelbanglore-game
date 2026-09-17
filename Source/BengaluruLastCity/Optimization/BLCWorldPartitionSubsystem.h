// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCWorldPartitionSubsystem.generated.h"

USTRUCT(BlueprintType)
struct FBLCCitySectorCell
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Streaming")
	FString SectorID;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Streaming")
	FVector SectorCenter;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Streaming")
	float StreamingRadius;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Streaming")
	bool bIsLoadedInCore;
};

UCLASS()
class BENGALURULASTCITY_API UBLCWorldPartitionSubsystem : public UWorldSubsystem
{
	GENERATED_BODY()

public:
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	UPROPERTY(BlueprintReadOnly, Category = "World Partition")
	TArray<FBLCCitySectorCell> SectorGrid;

	UFUNCTION(BlueprintCallable, Category = "World Partition")
	void UpdateSectorStreaming(const FVector& PlayerLocation);
};
