// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "BLCProductionHUD.generated.h"

UCLASS()
class BENGALURULASTCITY_API ABLCProductionHUD : public AHUD
{
    GENERATED_BODY()

public:
    ABLCProductionHUD();

    virtual void DrawHUD() override;

    UFUNCTION(BlueprintCallable, Category = "BLC|HUD")
    void ToggleDeveloperTelemetry();

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BLC|HUD")
    bool bDeveloperTelemetryVisible = false; // Hidden by default for normal players
};
