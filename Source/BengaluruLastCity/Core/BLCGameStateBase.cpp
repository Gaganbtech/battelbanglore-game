// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCGameStateBase.h"
#include "Net/UnrealNetwork.h"

ABLCGameStateBase::ABLCGameStateBase()
{
	bReplicates = true;
	TimeOfDayHours = 12.0f; // Start at midday
	CurrentWeather = EBLCWeatherState::Clear;
	SafeZoneCenter = FVector::ZeroVector;
	SafeZoneRadius = 150000.f; // 1.5 km initial radius
}

void ABLCGameStateBase::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	DOREPLIFETIME(ABLCGameStateBase, TimeOfDayHours);
	DOREPLIFETIME(ABLCGameStateBase, CurrentWeather);
	DOREPLIFETIME(ABLCGameStateBase, SafeZoneCenter);
	DOREPLIFETIME(ABLCGameStateBase, SafeZoneRadius);
}

void ABLCGameStateBase::OnMatchPhaseChanged(EBLCMatchPhase NewPhase)
{
	OnMatchPhaseChangedEvent.Broadcast(NewPhase);
}

void ABLCGameStateBase::OnRep_TimeOfDayHours()
{
	// Clients adjust local sky and directional light
}

void ABLCGameStateBase::OnRep_CurrentWeather()
{
	OnWeatherChanged.Broadcast(CurrentWeather);
}
