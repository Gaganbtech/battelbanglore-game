// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCCharacterBase.h"
#include "BengaluruLastCity/Components/BLCHealthStaminaComponent.h"

ABLCCharacterBase::ABLCCharacterBase(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	HealthStaminaComp = CreateDefaultSubobject<UBLCHealthStaminaComponent>(TEXT("HealthStaminaComp"));
}

void ABLCCharacterBase::BeginPlay()
{
	Super::BeginPlay();
}
