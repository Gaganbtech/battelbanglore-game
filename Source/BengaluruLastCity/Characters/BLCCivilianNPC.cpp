// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCCivilianNPC.h"
#include "GameFramework/CharacterMovementComponent.h"

ABLCCivilianNPC::ABLCCivilianNPC(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	bUseControllerRotationYaw = false;
	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;
}

void ABLCCivilianNPC::BeginPlay()
{
	Super::BeginPlay();
}

void ABLCCivilianNPC::ReactToPresence(AActor* InstigatorActor)
{
	bIsPanicked = true;
	GetCharacterMovement()->MaxWalkSpeed = PanicRunSpeed;
}
