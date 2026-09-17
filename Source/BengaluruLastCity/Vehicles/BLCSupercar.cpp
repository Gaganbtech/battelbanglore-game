// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCSupercar.h"

ABLCSupercar::ABLCSupercar()
{
	MaxForwardSpeed = SupercarTopSpeed;
	AccelerationRate = 85.0f;
	TurnSpeed = 80.0f;
	CurrentNitroFuel = MaxNitroDuration;
	bIsNitroActive = false;
}

void ABLCSupercar::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	PlayerInputComponent->BindAction("Sprint", IE_Pressed, this, &ABLCSupercar::ActivateNitro);
	PlayerInputComponent->BindAction("Sprint", IE_Released, this, &ABLCSupercar::DeactivateNitro);
}

void ABLCSupercar::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (bIsNitroActive && CurrentNitroFuel > 0.0f)
	{
		CurrentNitroFuel = FMath::Clamp(CurrentNitroFuel - DeltaTime, 0.0f, MaxNitroDuration);
		if (CurrentNitroFuel <= 0.0f)
		{
			DeactivateNitro();
		}
	}
	else if (!bIsNitroActive && CurrentNitroFuel < MaxNitroDuration)
	{
		CurrentNitroFuel = FMath::Clamp(CurrentNitroFuel + (NitroRechargeRate * DeltaTime), 0.0f, MaxNitroDuration);
	}
}

void ABLCSupercar::ActivateNitro()
{
	if (CurrentNitroFuel > 0.5f)
	{
		bIsNitroActive = true;
		AccelerationRate = 125.0f;
		MaxForwardSpeed = SupercarTopSpeed * NitroBoostMultiplier;
	}
}

void ABLCSupercar::DeactivateNitro()
{
	bIsNitroActive = false;
	AccelerationRate = 85.0f;
	MaxForwardSpeed = SupercarTopSpeed;
}
