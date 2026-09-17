// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCPlayerController.h"
#include "Blueprint/UserWidget.h"

ABLCPlayerController::ABLCPlayerController()
{
	bIsMapOpen = false;
	bIsPaused = false;
}

void ABLCPlayerController::BeginPlay()
{
	Super::BeginPlay();

	// Set default input mode for game
	FInputModeGameOnly InputMode;
	SetInputMode(InputMode);
	bShowMouseCursor = false;
}

void ABLCPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();

	InputComponent->BindAction("PauseMenu", IE_Pressed, this, &ABLCPlayerController::TogglePauseMenu);
}

void ABLCPlayerController::ToggleWorldMap()
{
	if (bIsMapOpen)
	{
		if (ActiveMapWidget)
		{
			ActiveMapWidget->RemoveFromParent();
		}
		bIsMapOpen = false;
		bShowMouseCursor = false;
		FInputModeGameOnly InputMode;
		SetInputMode(InputMode);
	}
	else
	{
		if (WorldMapWidgetClass)
		{
			ActiveMapWidget = CreateWidget<UUserWidget>(this, WorldMapWidgetClass);
			if (ActiveMapWidget)
			{
				ActiveMapWidget->AddToViewport(10);
			}
		}
		bIsMapOpen = true;
		bShowMouseCursor = true;
		FInputModeGameAndUI InputMode;
		SetInputMode(InputMode);
	}
}

void ABLCPlayerController::TogglePauseMenu()
{
	if (bIsPaused)
	{
		if (ActivePauseWidget)
		{
			ActivePauseWidget->RemoveFromParent();
		}
		bIsPaused = false;
		SetPause(false);
		bShowMouseCursor = false;
		FInputModeGameOnly InputMode;
		SetInputMode(InputMode);
	}
	else
	{
		if (PauseMenuWidgetClass)
		{
			ActivePauseWidget = CreateWidget<UUserWidget>(this, PauseMenuWidgetClass);
			if (ActivePauseWidget)
			{
				ActivePauseWidget->AddToViewport(20);
			}
		}
		bIsPaused = true;
		SetPause(true);
		bShowMouseCursor = true;
		FInputModeGameAndUI InputMode;
		SetInputMode(InputMode);
	}
}
