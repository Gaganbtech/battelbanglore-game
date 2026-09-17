// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BengaluruLastCity/World/BLCBusRouteSubsystem.h"
#include "BengaluruLastCity/Vehicles/BLCDoubleDeckerBus.h"

void UBLCBusRouteSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
	Super::Initialize(Collection);

	// Setup Route 201G (Majestic ⇄ Electronic City via MG Road)
	FBLCBusRouteDefinition Route201G;
	Route201G.RouteNumber = TEXT("201G");
	Route201G.RouteDescription = TEXT("MAJESTIC ⇄ ELECTRONIC CITY");

	FBLCBusStopWaypoint Stop1;
	Stop1.StopName = TEXT("Majestic City Central Hub");
	Stop1.Location = FVector(-20000.f, 850.f, 0.f);
	Stop1.DwellTimeSeconds = 10.0f;
	Route201G.Stops.Add(Stop1);

	FBLCBusStopWaypoint Stop2;
	Stop2.StopName = TEXT("MG Road Metro Interchange");
	Stop2.Location = FVector(-7000.f, 850.f, 0.f);
	Stop2.DwellTimeSeconds = 8.0f;
	Route201G.Stops.Add(Stop2);

	FBLCBusStopWaypoint Stop3;
	Stop3.StopName = TEXT("Central Commercial Market");
	Stop3.Location = FVector(7000.f, 850.f, 0.f);
	Stop3.DwellTimeSeconds = 8.0f;
	Route201G.Stops.Add(Stop3);

	FBLCBusStopWaypoint Stop4;
	Stop4.StopName = TEXT("IT Tech Park Terminal Gate");
	Stop4.Location = FVector(20000.f, 850.f, 0.f);
	Stop4.DwellTimeSeconds = 12.0f;
	Route201G.Stops.Add(Stop4);

	DefinedRoutes.Add(TEXT("201G"), Route201G);
}

void UBLCBusRouteSubsystem::Deinitialize()
{
	ActiveDoubleDeckerFleet.Empty();
	Super::Deinitialize();
}

void UBLCBusRouteSubsystem::RegisterBus(ABLCDoubleDeckerBus* BusActor, const FString& RouteId)
{
	if (BusActor)
	{
		ActiveDoubleDeckerFleet.AddUnique(BusActor);
	}
}

const TArray<FBLCBusStopWaypoint>& UBLCBusRouteSubsystem::GetRouteStops(const FString& RouteId) const
{
	static const TArray<FBLCBusStopWaypoint> EmptyStops;
	if (const FBLCBusRouteDefinition* FoundRoute = DefinedRoutes.Find(RouteId))
	{
		return FoundRoute->Stops;
	}
	return EmptyStops;
}
