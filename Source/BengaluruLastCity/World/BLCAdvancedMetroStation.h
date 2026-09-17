// Copyright 2026 Bengaluru: Last City. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BLCAdvancedMetroStation.generated.h"

UCLASS()
class BENGALURULASTCITY_API ABLCAdvancedMetroStation : public AActor
{
	GENERATED_BODY()

public:
	ABLCAdvancedMetroStation();

protected:
	virtual void BeginPlay() override;

public:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Metro")
	TObjectPtr<USceneComponent> SceneRoot;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Metro")
	TObjectPtr<UStaticMeshComponent> ConcourseMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Metro")
	TObjectPtr<UStaticMeshComponent> PlatformNorthMesh;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Metro")
	TObjectPtr<UStaticMeshComponent> PlatformSouthMesh;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Metro")
	FString StationName;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Metro")
	FString KannadaStationName;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Metro")
	float TrackElevation;

	UFUNCTION(BlueprintCallable, Category = "Metro")
	void PlayArrivalAnnouncement(const FString& NextStationName);
};
