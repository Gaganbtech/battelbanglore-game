// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCHUD.h"
#include "Blueprint/UserWidget.h"

void ABLCHUD::BeginPlay()
{
	Super::BeginPlay();
	ShowHUD();
}

void ABLCHUD::ShowHUD()
{
	if (!ActivePlayerHUDWidget && PlayerHUDWidgetClass)
	{
		ActivePlayerHUDWidget = CreateWidget<UUserWidget>(GetOwningPlayerController(), PlayerHUDWidgetClass);
		if (ActivePlayerHUDWidget)
		{
			ActivePlayerHUDWidget->AddToViewport(5);
		}
	}
}

void ABLCHUD::HideHUD()
{
	if (ActivePlayerHUDWidget)
	{
		ActivePlayerHUDWidget->RemoveFromParent();
		ActivePlayerHUDWidget = nullptr;
	}
}
