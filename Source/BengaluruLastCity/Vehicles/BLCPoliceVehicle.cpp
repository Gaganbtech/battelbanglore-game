// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#include "Vehicles/BLCPoliceVehicle.h"

ABLCPoliceVehicle::ABLCPoliceVehicle()
{
	PrimaryActorTick.bCanEverTick = true;

	bSirenActive = false;
	bLightbarStrobesActive = false;
	MaxSpeedKmh = 145.0f;
}

void ABLCPoliceVehicle::BeginPlay()
{
	Super::BeginPlay();
}

void ABLCPoliceVehicle::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void ABLCPoliceVehicle::SetEmergencyResponseMode(bool bActive)
{
	bSirenActive = bActive;
	bLightbarStrobesActive = bActive;
	UE_LOG(LogTemp, Log, TEXT("BCP Police Interceptor Emergency Strobe & Siren: %s"), bActive ? TEXT("ACTIVE") : TEXT("STANDBY"));
}
