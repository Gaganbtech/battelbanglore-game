// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "BLCDataLayerSubsystem.generated.h"

UCLASS()
class BENGALURULASTCITY_API UBLCDataLayerSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    UFUNCTION(BlueprintCallable, Category = "BLC|DataLayers")
    void SetDataLayerActive(FName LayerName, bool bActive);

    UFUNCTION(BlueprintCallable, Category = "BLC|DataLayers")
    bool IsDataLayerActive(FName LayerName) const;

private:
    TMap<FName, bool> ActiveLayers;
};
