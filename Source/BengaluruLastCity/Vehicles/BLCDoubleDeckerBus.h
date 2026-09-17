// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "BengaluruLastCity/Vehicles/BLCVehicleBase.h"
#include "BLCDoubleDeckerBus.generated.h"

class UBoxComponent;
class UAudioComponent;
class USoundCue;

UENUM(BlueprintType)
enum class EBLCBusDeck : uint8
{
	GroundCurb       UMETA(DisplayName = "Outside On Curb"),
	LowerDeck        UMETA(DisplayName = "Lower Deck Interior"),
	UpperDeck        UMETA(DisplayName = "Upper Deck Panoramic Vista")
};

UENUM(BlueprintType)
enum class EBLCBusState : uint8
{
	Cruising         UMETA(DisplayName = "Cruising On Route"),
	SlowingForStop   UMETA(DisplayName = "Decelerating Into Bay"),
	DockedAtStop     UMETA(DisplayName = "Docked / Doors Open"),
	Departing        UMETA(DisplayName = "Accelerating Out of Bay")
};

/**
 * Flagship BMTC-style Double-Decker Transit Bus ("BMT SkyCruiser")
 * Features two passenger decks, interior spiral staircase, pneumatic bi-fold doors,
 * and panoramic front viewing glass for battle royale gameplay.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCDoubleDeckerBus : public ABLCVehicleBase
{
	GENERATED_BODY()

public:
	ABLCDoubleDeckerBus();

	virtual void Tick(float DeltaTime) override;

	/** Checks if an actor is currently inside the lower or upper deck */
	UFUNCTION(BlueprintPure, Category = "BMTC|Transit")
	EBLCBusDeck GetPassengerDeck(const AActor* PassengerActor) const;

	/** Moves a boarded passenger up or down via the interior staircase */
	UFUNCTION(BlueprintCallable, Category = "BMTC|Transit")
	void TraverseInteriorStairs(APawn* PassengerPawn);

	/** Boarding entry point from sidewalk curb */
	UFUNCTION(BlueprintCallable, Category = "BMTC|Transit")
	bool BoardPassenger(APawn* PassengerPawn, EBLCBusDeck TargetDeck = EBLCBusDeck::LowerDeck);

	/** Alights a passenger safely to the curb */
	UFUNCTION(BlueprintCallable, Category = "BMTC|Transit")
	void AlightPassenger(APawn* PassengerPawn);

	/** Returns the bus destination sign text (e.g. "201G: MAJESTIC ⇄ ELECTRONIC CITY") */
	UFUNCTION(BlueprintPure, Category = "BMTC|Display")
	FText GetDestinationRouteText() const { return DestinationText; }

protected:
	/** Lower Deck Passenger Carriage Mesh */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Components")
	UStaticMeshComponent* LowerDeckMesh;

	/** Upper Deck Panoramic Carriage Mesh */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Components")
	UStaticMeshComponent* UpperDeckMesh;

	/** Lower Deck Floor Collision and Carrying Trigger */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Collision")
	UBoxComponent* LowerDeckVolume;

	/** Upper Deck Floor Collision and Carrying Trigger */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Collision")
	UBoxComponent* UpperDeckVolume;

	/** Interior Staircase Trigger Volume (Rear-Left) */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Collision")
	UBoxComponent* StaircaseVolume;

	/** Pneumatic Air Brake Audio Component */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Audio")
	UAudioComponent* AirBrakeAudio;

	/** Electronic Bus Stop Chime Audio Component */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Audio")
	UAudioComponent* DoorChimeAudio;

	UPROPERTY(EditDefaultsOnly, Category = "BMTC|Audio")
	USoundCue* AirBrakeSoundCue;

	UPROPERTY(EditDefaultsOnly, Category = "BMTC|Audio")
	USoundCue* DoorChimeSoundCue;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "BMTC|Route")
	FText DestinationText = FText::FromString(TEXT("201G: MAJESTIC ⇄ ELECTRONIC CITY"));

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|State")
	EBLCBusState BusState = EBLCBusState::Cruising;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "BMTC|Doors")
	float DoorOpenRatio = 0.0f;

	/** Passenger tracking */
	UPROPERTY(Transient)
	TArray<APawn*> BoardedPassengers;
};
