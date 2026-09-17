// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCVehicleBase.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SphereComponent.h"
#include "BengaluruLastCity/Characters/BLCPlayerCharacter.h"
#include "BengaluruLastCity/Controllers/BLCPlayerController.h"

ABLCVehicleBase::ABLCVehicleBase()
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	VehicleMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("VehicleMesh"));
	RootComponent = VehicleMesh;
	VehicleMesh->SetSimulatePhysics(true);

	InteractionTrigger = CreateDefaultSubobject<USphereComponent>(TEXT("InteractionTrigger"));
	InteractionTrigger->SetupAttachment(RootComponent);
	InteractionTrigger->SetSphereRadius(250.0f);

	bHeadlightsOn = false;
}

void ABLCVehicleBase::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	PlayerInputComponent->BindAxis("MoveForward", this, &ABLCVehicleBase::Throttle);
	PlayerInputComponent->BindAxis("MoveRight", this, &ABLCVehicleBase::Steer);
	PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ABLCVehicleBase::Handbrake);
	PlayerInputComponent->BindAction("Interact", IE_Pressed, this, &ABLCVehicleBase::ExitVehicle);
}

bool ABLCVehicleBase::EnterVehicle(ABLCPlayerCharacter* EnteringPlayer)
{
	if (!EnteringPlayer || CurrentDriver != nullptr) return false;

	CurrentDriver = EnteringPlayer;
	EnteringPlayer->SetActorHiddenInGame(true);
	EnteringPlayer->SetActorEnableCollision(false);

	if (AController* DriverController = EnteringPlayer->GetController())
	{
		DriverController->Possess(this);
	}

	return true;
}

bool ABLCVehicleBase::ExitVehicle()
{
	if (!CurrentDriver) return false;

	FVector ExitLocation = GetActorLocation() + (GetActorRightVector() * -180.0f) + FVector(0, 0, 50.0f);
	CurrentDriver->SetActorLocation(ExitLocation);
	CurrentDriver->SetActorHiddenInGame(false);
	CurrentDriver->SetActorEnableCollision(true);

	if (AController* DriverController = GetController())
	{
		DriverController->Possess(CurrentDriver);
	}

	CurrentDriver = nullptr;
	return true;
}

void ABLCVehicleBase::SetHeadlightsActive(bool bActive)
{
	bHeadlightsOn = bActive;
}

void ABLCVehicleBase::Throttle(float Val)
{
	if (FMath::Abs(Val) > KINDA_SMALL_NUMBER)
	{
		AddMovementInput(GetActorForwardVector(), Val);
	}
}

void ABLCVehicleBase::Steer(float Val)
{
	if (FMath::Abs(Val) > KINDA_SMALL_NUMBER)
	{
		AddActorLocalRotation(FRotator(0, Val * TurnSpeed * GetWorld()->GetDeltaSeconds(), 0));
	}
}

void ABLCVehicleBase::Handbrake()
{
	// Handbrake logic
}
