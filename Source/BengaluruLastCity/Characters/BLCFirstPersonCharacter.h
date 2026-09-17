// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Characters/BLCPlayerCharacter.h"
#include "Camera/CameraComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "BLCFirstPersonCharacter.generated.h"

UCLASS()
class BENGALURULASTCITY_API ABLCFirstPersonCharacter : public ABLCPlayerCharacter
{
    GENERATED_BODY()

public:
    ABLCFirstPersonCharacter();

    virtual void Tick(float DeltaTime) override;
    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

    UFUNCTION(BlueprintCallable, Category = "BLC|Camera")
    void TogglePerspective();

    UFUNCTION(BlueprintCallable, Category = "BLC|Aim")
    void SetAimDownSights(bool bAiming);

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BLC|Mesh")
    USkeletalMeshComponent* FirstPersonMesh;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BLC|Camera")
    UCameraComponent* FirstPersonCamera;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|Camera")
    bool bIsFirstPerson = true;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|Aim")
    float ADSFov = 50.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "BLC|Aim")
    float HipfireFov = 75.0f;
};
