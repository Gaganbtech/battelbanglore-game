// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/EngineSubsystem.h"
#include "BLCProductionAuditCommand.generated.h"

UCLASS()
class BENGALURULASTCITY_API UBLCProductionAuditCommand : public UEngineSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    // Console Command: BLC.RunProductionAudit
    UFUNCTION(Exec)
    void RunProductionAudit();
};
