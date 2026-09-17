// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCInteractionComponent.h"
#include "GameFramework/Character.h"
#include "CollisionQueryParams.h"
#include "Engine/World.h"

UBLCInteractionComponent::UBLCInteractionComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
}

void UBLCInteractionComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
	DetectInteractables();
}

void UBLCInteractionComponent::DetectInteractables()
{
	AActor* OwnerActor = GetOwner();
	if (!OwnerActor) return;

	FVector StartLoc = OwnerActor->GetActorLocation();
	FVector ForwardVec = OwnerActor->GetActorForwardVector();
	FVector EndLoc = StartLoc + (ForwardVec * InteractionDistance);

	FHitResult HitResult;
	FCollisionQueryParams QueryParams;
	QueryParams.AddIgnoredActor(OwnerActor);

	bool bHit = GetWorld()->SweepSingleByChannel(
		HitResult,
		StartLoc,
		EndLoc,
		FQuat::Identity,
		ECC_Visibility,
		FCollisionShape::MakeSphere(60.0f),
		QueryParams
	);

	if (bHit && HitResult.GetActor())
	{
		CurrentInteractableActor = HitResult.GetActor();
		OnInteractableFound.Broadcast(FText::FromString(TEXT("Press [E] to Interact")));
	}
	else
	{
		CurrentInteractableActor = nullptr;
		OnInteractableFound.Broadcast(FText::GetEmpty());
	}
}

void UBLCInteractionComponent::PerformInteraction()
{
	if (CurrentInteractableActor.IsValid())
	{
		UE_LOG(LogTemp, Log, TEXT("[BLCInteractionComponent] Interacted with: %s"), *CurrentInteractableActor->GetName());
	}
}
