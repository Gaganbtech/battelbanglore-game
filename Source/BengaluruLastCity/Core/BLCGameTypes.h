// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameplayTagContainer.h"
#include "BLCGameTypes.generated.h"

/**
 * World zone identifier within Bengaluru metropolitan region
 */
UENUM(BlueprintType)
enum class EBLCZoneType : uint8
{
	ZoneA_CentralUrban       UMETA(DisplayName = "Zone A - Central Urban District"),
	ZoneB_ITBusinessDistrict UMETA(DisplayName = "Zone B - IT / Tech Corridor"),
	ZoneC_Residential        UMETA(DisplayName = "Zone C - Residential District"),
	ZoneD_Industrial         UMETA(DisplayName = "Zone D - Industrial District"),
	ZoneE_MetroCorridor      UMETA(DisplayName = "Zone E - Elevated Metro Corridor"),
	ZoneF_FlyoverHighway     UMETA(DisplayName = "Zone F - Elevated Flyover / Expressway"),
	ZoneG_SuburbanLake       UMETA(DisplayName = "Zone G - Suburban Lake Area")
};

/**
 * Weather state enum
 */
UENUM(BlueprintType)
enum class EBLCWeatherState : uint8
{
	Clear        UMETA(DisplayName = "Clear / Sunny"),
	Cloudy       UMETA(DisplayName = "Cloudy / Overcast"),
	MonsoonRain  UMETA(DisplayName = "Monsoon Rain")
};

/**
 * Player Locomotion state
 */
UENUM(BlueprintType)
enum class EBLCLocomotionState : uint8
{
	Idle         UMETA(DisplayName = "Idle"),
	Walking      UMETA(DisplayName = "Walking"),
	Running      UMETA(DisplayName = "Running"),
	Sprinting    UMETA(DisplayName = "Sprinting"),
	Crouching    UMETA(DisplayName = "Crouching"),
	InAir        UMETA(DisplayName = "In Air"),
	InVehicle    UMETA(DisplayName = "In Vehicle")
};

/**
 * Future Battle Royale match lifecycle
 */
UENUM(BlueprintType)
enum class EBLCMatchPhase : uint8
{
	WarmupLobby       UMETA(DisplayName = "Warmup / Gathering Phase"),
	AirdropFlight     UMETA(DisplayName = "Sky Drop Phase"),
	EarlyLooting      UMETA(DisplayName = "Early Scavenge Phase"),
	CircleShrinking   UMETA(DisplayName = "Safe Zone Collapse"),
	EndgameFight      UMETA(DisplayName = "Final Survival Ring"),
	MatchCompleted    UMETA(DisplayName = "Match Completed")
};

/**
 * Zone metadata descriptor struct
 */
USTRUCT(BlueprintType)
struct FBLCZoneDefinition
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	EBLCZoneType ZoneType = EBLCZoneType::ZoneA_CentralUrban;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	FText DisplayName;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	FGameplayTag ZoneTag;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	FVector CenterLocation = FVector::ZeroVector;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	float Radius = 35000.f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Zone")
	int32 ExpectedLootTier = 2;
};
