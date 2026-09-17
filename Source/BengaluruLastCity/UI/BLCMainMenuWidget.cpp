// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCMainMenuWidget.h"
#include "Components/Button.h"
#include "Kismet/GameplayStatics.h"
#include "Kismet/KismetSystemLibrary.h"

void UBLCMainMenuWidget::NativeConstruct()
{
	Super::NativeConstruct();

	if (PlayButton)
	{
		PlayButton->OnClicked.AddDynamic(this, &UBLCMainMenuWidget::OnPlayClicked);
	}
	if (BattleRoyaleButton)
	{
		BattleRoyaleButton->OnClicked.AddDynamic(this, &UBLCMainMenuWidget::OnBattleRoyaleClicked);
	}
	if (SettingsButton)
	{
		SettingsButton->OnClicked.AddDynamic(this, &UBLCMainMenuWidget::OnSettingsClicked);
	}
	if (ExitButton)
	{
		ExitButton->OnClicked.AddDynamic(this, &UBLCMainMenuWidget::OnExitClicked);
	}
}

void UBLCMainMenuWidget::OnPlayClicked()
{
	UGameplayStatics::OpenLevel(this, FName("Bengaluru_City_P1"));
}

void UBLCMainMenuWidget::OnBattleRoyaleClicked()
{
	UE_LOG(LogTemp, Log, TEXT("[BLCMainMenuWidget] Battle Royale 100-player mode unlocks in Phase 2."));
}

void UBLCMainMenuWidget::OnSettingsClicked()
{
	// Open settings sub-panel
}

void UBLCMainMenuWidget::OnExitClicked()
{
	UKismetSystemLibrary::QuitGame(this, nullptr, EQuitPreference::Quit, false);
}
