// Copyright Bengaluru: Last City. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "BengaluruLastCity/Core/BLCGameTypes.h"
#include "BLCMapWidget.generated.h"

class UImage;
class UTextBlock;

/**
 * World Map and Minimap widget for Bengaluru: Last City.
 * Displays player GPS location, 7 district boundaries, metro line, and future BR safe zone.
 */
UCLASS()
class BENGALURULASTCITY_API UBLCMapWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;

	UFUNCTION(BlueprintCallable, Category = "Map")
	void UpdatePlayerGPSMarker(const FVector& WorldLocation, float HeadingYaw);

	UFUNCTION(BlueprintCallable, Category = "Map")
	void SetSafeZoneRing(const FVector& Center, float Radius);

protected:
	UPROPERTY(meta = (BindWidgetOptional))
	UImage* MapBackground;

	UPROPERTY(meta = (BindWidgetOptional))
	UImage* PlayerIcon;

	UPROPERTY(meta = (BindWidgetOptional))
	UTextBlock* CurrentDistrictText;
};
