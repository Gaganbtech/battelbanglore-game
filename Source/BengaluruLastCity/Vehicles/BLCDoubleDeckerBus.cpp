// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/Vehicles/BLCDoubleDeckerBus.h"
#include "Components/BoxComponent.h"
#include "Components/AudioComponent.h"
#include "Sound/SoundCue.h"

ABLCDoubleDeckerBus::ABLCDoubleDeckerBus()
{
	PrimaryActorTick.bCanEverTick = true;

	// Lower Deck Mesh
	LowerDeckMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("LowerDeckMesh"));
	LowerDeckMesh->SetupAttachment(RootComponent);

	// Upper Deck Mesh
	UpperDeckMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("UpperDeckMesh"));
	UpperDeckMesh->SetupAttachment(LowerDeckMesh);
	UpperDeckMesh->SetRelativeLocation(FVector(0.f, 0.f, 190.f));

	// Lower Deck Collision & Passenger Carry Volume (12.8m x 2.85m x 1.9m)
	LowerDeckVolume = CreateDefaultSubobject<UBoxComponent>(TEXT("LowerDeckVolume"));
	LowerDeckVolume->SetupAttachment(LowerDeckMesh);
	LowerDeckVolume->SetBoxExtent(FVector(600.f, 135.f, 95.f));
	LowerDeckVolume->SetRelativeLocation(FVector(0.f, 0.f, 105.f));

	// Upper Deck Collision & Passenger Carry Volume
	UpperDeckVolume = CreateDefaultSubobject<UBoxComponent>(TEXT("UpperDeckVolume"));
	UpperDeckVolume->SetupAttachment(UpperDeckMesh);
	UpperDeckVolume->SetBoxExtent(FVector(600.f, 135.f, 95.f));
	UpperDeckVolume->SetRelativeLocation(FVector(0.f, 0.f, 105.f));

	// Interior Staircase Volume (Rear-Left)
	StaircaseVolume = CreateDefaultSubobject<UBoxComponent>(TEXT("StaircaseVolume"));
	StaircaseVolume->SetupAttachment(LowerDeckMesh);
	StaircaseVolume->SetBoxExtent(FVector(90.f, 60.f, 140.f));
	StaircaseVolume->SetRelativeLocation(FVector(-450.f, 75.f, 150.f));

	// Audio Components
	AirBrakeAudio = CreateDefaultSubobject<UAudioComponent>(TEXT("AirBrakeAudio"));
	AirBrakeAudio->SetupAttachment(RootComponent);
	AirBrakeAudio->bAutoActivate = false;

	DoorChimeAudio = CreateDefaultSubobject<UAudioComponent>(TEXT("DoorChimeAudio"));
	DoorChimeAudio->SetupAttachment(RootComponent);
	DoorChimeAudio->bAutoActivate = false;
}

void ABLCDoubleDeckerBus::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// Animate pneumatic bi-fold doors based on state
	const float TargetDoorRatio = (BusState == EBLCBusState::DockedAtStop) ? 1.0f : 0.0f;
	DoorOpenRatio = FMath::FInterpTo(DoorOpenRatio, TargetDoorRatio, DeltaTime, 3.0f);
}

EBLCBusDeck ABLCDoubleDeckerBus::GetPassengerDeck(const AActor* PassengerActor) const
{
	if (!PassengerActor) return EBLCBusDeck::GroundCurb;

	if (UpperDeckVolume && UpperDeckVolume->IsOverlappingActor(PassengerActor))
	{
		return EBLCBusDeck::UpperDeck;
	}
	if (LowerDeckVolume && LowerDeckVolume->IsOverlappingActor(PassengerActor))
	{
		return EBLCBusDeck::LowerDeck;
	}
	return EBLCBusDeck::GroundCurb;
}

void ABLCDoubleDeckerBus::TraverseInteriorStairs(APawn* PassengerPawn)
{
	if (!PassengerPawn) return;

	const EBLCBusDeck CurrentDeck = GetPassengerDeck(PassengerPawn);
	if (CurrentDeck == EBLCBusDeck::LowerDeck)
	{
		// Teleport up staircase landing
		const FVector TargetLocation = UpperDeckMesh->GetComponentLocation() + FVector(350.f, 0.f, 20.f);
		PassengerPawn->SetActorLocation(TargetLocation);
	}
	else if (CurrentDeck == EBLCBusDeck::UpperDeck)
	{
		// Teleport down to lower deck aisle
		const FVector TargetLocation = LowerDeckMesh->GetComponentLocation() + FVector(-100.f, 0.f, 20.f);
		PassengerPawn->SetActorLocation(TargetLocation);
	}
}

bool ABLCDoubleDeckerBus::BoardPassenger(APawn* PassengerPawn, EBLCBusDeck TargetDeck)
{
	if (!PassengerPawn) return false;

	FVector BoardLocation;
	if (TargetDeck == EBLCBusDeck::UpperDeck)
	{
		BoardLocation = UpperDeckMesh->GetComponentLocation() + FVector(350.f, 0.f, 25.f);
	}
	else
	{
		BoardLocation = LowerDeckMesh->GetComponentLocation() + FVector(0.f, 0.f, 25.f);
	}

	PassengerPawn->SetActorLocation(BoardLocation);
	BoardedPassengers.AddUnique(PassengerPawn);

	if (DoorChimeAudio && DoorChimeSoundCue)
	{
		DoorChimeAudio->SetSound(DoorChimeSoundCue);
		DoorChimeAudio->Play();
	}

	return true;
}

void ABLCDoubleDeckerBus::AlightPassenger(APawn* PassengerPawn)
{
	if (!PassengerPawn) return;

	// Place passenger safely on curb to the left of the boarding door
	const FVector CurbOffset = GetActorRightVector() * 280.f;
	const FVector CurbLocation = GetActorLocation() + CurbOffset;

	PassengerPawn->SetActorLocation(CurbLocation);
	BoardedPassengers.Remove(PassengerPawn);

	if (AirBrakeAudio && AirBrakeSoundCue)
	{
		AirBrakeAudio->SetSound(AirBrakeSoundCue);
		AirBrakeAudio->Play();
	}
}
