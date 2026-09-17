// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "Vehicles/BLCElectricBus.h"

ABLCElectricBus::ABLCElectricBus()
{
	PrimaryActorTick.bCanEverTick = true;

	BatterySOC = 95.0f;
	DischargeRatePerKm = 1.2f;
	bIsPluggedIntoFastCharger = false;
	MaxSpeedKmh = 75.0f;
}

void ABLCElectricBus::BeginPlay()
{
	Super::BeginPlay();
}

void ABLCElectricBus::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (bIsPluggedIntoFastCharger)
	{
		BatterySOC = FMath::Min(100.0f, BatterySOC + (DeltaTime * 3.5f));
	}
}

void ABLCElectricBus::StartDepotCharging()
{
	bIsPluggedIntoFastCharger = true;
	UE_LOG(LogTemp, Log, TEXT("BMTC Vajra EV Bus connected to CCS2 Fast Charger."));
}

void ABLCElectricBus::StopDepotCharging()
{
	bIsPluggedIntoFastCharger = false;
	UE_LOG(LogTemp, Log, TEXT("BMTC Vajra EV Bus disconnected from charger. Current SOC: %.1f%%"), BatterySOC);
}
