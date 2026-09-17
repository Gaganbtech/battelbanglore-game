// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "BLCPlayerController.generated.h"

class UBLCMainMenuWidget;
class UBLCMapWidget;

/**
 * Player Controller for Bengaluru: Last City.
 * Manages HUD, pause menu, minimap, and world map toggling.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	ABLCPlayerController();

	virtual void BeginPlay() override;
	virtual void SetupInputComponent() override;

	/** Toggles fullscreen district map */
	UFUNCTION(BlueprintCallable, Category = "UI")
	void ToggleWorldMap();

	/** Toggles pause menu */
	UFUNCTION(BlueprintCallable, Category = "UI")
	void TogglePauseMenu();

protected:
	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> WorldMapWidgetClass;

	UPROPERTY(EditDefaultsOnly, Category = "UI")
	TSubclassOf<UUserWidget> PauseMenuWidgetClass;

	UPROPERTY()
	UUserWidget* ActiveMapWidget;

	UPROPERTY()
	UUserWidget* ActivePauseWidget;

	bool bIsMapOpen;
	bool bIsPaused;
};
