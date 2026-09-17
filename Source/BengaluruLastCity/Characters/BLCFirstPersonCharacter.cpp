// Copyright 2026 Bengaluru: Last City. All Rights Reserved.

#include "Characters/BLCFirstPersonCharacter.h"

ABLCFirstPersonCharacter::ABLCFirstPersonCharacter()
{
    bIsFirstPerson = true;

    FirstPersonCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
    FirstPersonCamera->SetupAttachment(RootComponent);
    FirstPersonCamera->SetRelativeLocation(FVector(0.0f, 0.0f, 162.0f)); // Human eye height
    FirstPersonCamera->bUsePawnControlRotation = true;

    FirstPersonMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("FirstPersonMesh"));
    FirstPersonMesh->SetupAttachment(FirstPersonCamera);
    FirstPersonMesh->SetOnlyOwnerSee(true);
    FirstPersonMesh->bCastDynamicShadow = false;
    FirstPersonMesh->CastShadow = false;
}

void ABLCFirstPersonCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void ABLCFirstPersonCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    PlayerInputComponent->BindAction("TogglePerspective", IE_Pressed, this, &ABLCFirstPersonCharacter::TogglePerspective);
}

void ABLCFirstPersonCharacter::TogglePerspective()
{
    bIsFirstPerson = !bIsFirstPerson;
    if (FirstPersonMesh)
    {
        FirstPersonMesh->SetVisibility(bIsFirstPerson);
    }
}

void ABLCFirstPersonCharacter::SetAimDownSights(bool bAiming)
{
    if (FirstPersonCamera)
    {
        FirstPersonCamera->SetFieldOfView(bAiming ? ADSFov : HipfireFov);
    }
}
