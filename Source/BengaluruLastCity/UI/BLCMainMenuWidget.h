// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "BLCMainMenuWidget.generated.h"

class UButton;
class UWidgetSwitcher;

/**
 * Main Menu UI for Bengaluru: Last City.
 * Options: Play, Battle Royale (Phase 2 preview), Story (Phase 2), Garage (Phase 2), Settings, Exit.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCMainMenuWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	virtual void NativeConstruct() override;

	UFUNCTION(BlueprintCallable, Category = "Menu")
	void OnPlayClicked();

	UFUNCTION(BlueprintCallable, Category = "Menu")
	void OnBattleRoyaleClicked();

	UFUNCTION(BlueprintCallable, Category = "Menu")
	void OnSettingsClicked();

	UFUNCTION(BlueprintCallable, Category = "Menu")
	void OnExitClicked();

protected:
	UPROPERTY(meta = (BindWidgetOptional))
	UButton* PlayButton;

	UPROPERTY(meta = (BindWidgetOptional))
	UButton* BattleRoyaleButton;

	UPROPERTY(meta = (BindWidgetOptional))
	UButton* SettingsButton;

	UPROPERTY(meta = (BindWidgetOptional))
	UButton* ExitButton;
};
