// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "BLCHUD.generated.h"

class UUserWidget;

/**
 * Primary in-game HUD actor for Bengaluru: Last City.
 * Creates and displays player health, stamina, compass, minimap, and active objective.
 */
UCLASS()
class BENGALURULASTCITY_API ABLCHUD : public AHUD
{
	GENERATED_BODY()

public:
	virtual void BeginPlay() override;

	UFUNCTION(BlueprintCallable, Category = "HUD")
	void ShowHUD();

	UFUNCTION(BlueprintCallable, Category = "HUD")
	void HideHUD();

protected:
	UPROPERTY(EditDefaultsOnly, Category = "HUD Classes")
	TSubclassOf<UUserWidget> PlayerHUDWidgetClass;

	UPROPERTY()
	UUserWidget* ActivePlayerHUDWidget;
};
