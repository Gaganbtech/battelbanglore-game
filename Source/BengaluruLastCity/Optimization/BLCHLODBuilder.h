// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCHLODBuilder.generated.h"

UCLASS()
class BENGALURULASTCITY_API UBLCHLODBuilder : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    UFUNCTION(BlueprintCallable, Category = "BLC|HLOD")
    void WarmupCellHLOD(FName CellID);

    UFUNCTION(BlueprintCallable, Category = "BLC|HLOD")
    bool RequiresWarmup(FName CellID) const;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|HLOD")
    float WarmupDurationSeconds = 0.4f;
};
