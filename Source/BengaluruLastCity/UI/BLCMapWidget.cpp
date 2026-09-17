// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCMapWidget.h"
#include "Components/Image.h"
#include "Components/TextBlock.h"

void UBLCMapWidget::NativeTick(const FGeometry& MyGeometry, float InDeltaTime)
{
	Super::NativeTick(MyGeometry, InDeltaTime);
}

void UBLCMapWidget::UpdatePlayerGPSMarker(const FVector& WorldLocation, float HeadingYaw)
{
	if (PlayerIcon)
	{
		PlayerIcon->SetRenderTransformAngle(HeadingYaw);
	}
}

void UBLCMapWidget::SetSafeZoneRing(const FVector& Center, float Radius)
{
	// Scale and position safe zone circle overlay
}
