// Copyright Bengaluru: Last City. All Rights Reserved.

#include "BLCPlayerCharacter.h"
#include "GameFramework/SpringArmComponent.h"
#include "BengaluruLastCity/Components/BLCCameraComponent.h"
#include "BengaluruLastCity/Components/BLCMovementComponent.h"
#include "BengaluruLastCity/Components/BLCHealthStaminaComponent.h"
#include "BengaluruLastCity/Components/BLCInteractionComponent.h"
#include "BengaluruLastCity/Controllers/BLCPlayerController.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"

ABLCPlayerCharacter::ABLCPlayerCharacter(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer.SetDefaultSubobjectClass<UBLCMovementComponent>(ACharacter::CharacterMovementComponentName))
{
	bUseControllerRotationPitch = false;
	bUseControllerRotationYaw = false;
	bUseControllerRotationRoll = false;

	// Configure character movement
	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->RotationRate = FRotator(0.0f, 540.0f, 0.0f);

	// Create Camera Boom
	CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
	CameraBoom->SetupAttachment(RootComponent);
	CameraBoom->TargetArmLength = 350.0f;
	CameraBoom->bUsePawnControlRotation = true;
	CameraBoom->bEnableCameraLag = true;
	CameraBoom->CameraLagSpeed = 12.0f;
	CameraBoom->SocketOffset = FVector(0.0f, 45.0f, 65.0f);

	// Create Follow Camera
	FollowCamera = CreateDefaultSubobject<UBLCCameraComponent>(TEXT("FollowCamera"));
	FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
	FollowCamera->bUsePawnControlRotation = false;

	// Create Interaction Component
	InteractionComp = CreateDefaultSubobject<UBLCInteractionComponent>(TEXT("InteractionComp"));
}

void ABLCPlayerCharacter::PossessedBy(AController* NewController)
{
	Super::PossessedBy(NewController);

	if (APlayerController* PC = Cast<APlayerController>(NewController))
	{
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PC->GetLocalPlayer()))
		{
			if (DefaultMappingContext)
			{
				Subsystem->AddMappingContext(DefaultMappingContext, 0);
			}
		}
	}
}

void ABLCPlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	if (UEnhancedInputComponent* EnhancedInputComponent = Cast<UEnhancedInputComponent>(PlayerInputComponent))
	{
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &ABLCPlayerCharacter::Input_Move);
		EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &ABLCPlayerCharacter::Input_Look);
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Started, this, &ACharacter::Jump);
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Completed, this, &ACharacter::StopJumping);
		EnhancedInputComponent->BindAction(SprintAction, ETriggerEvent::Started, this, &ABLCPlayerCharacter::Input_StartSprint);
		EnhancedInputComponent->BindAction(SprintAction, ETriggerEvent::Completed, this, &ABLCPlayerCharacter::Input_StopSprint);
		EnhancedInputComponent->BindAction(CrouchAction, ETriggerEvent::Started, this, &ABLCPlayerCharacter::Input_StartCrouch);
		EnhancedInputComponent->BindAction(CrouchAction, ETriggerEvent::Completed, this, &ABLCPlayerCharacter::Input_StopCrouch);
		EnhancedInputComponent->BindAction(InteractAction, ETriggerEvent::Started, this, &ABLCPlayerCharacter::Input_Interact);
		EnhancedInputComponent->BindAction(ToggleMapAction, ETriggerEvent::Started, this, &ABLCPlayerCharacter::Input_ToggleMap);
	}
}

void ABLCPlayerCharacter::Input_Move(const FInputActionValue& Value)
{
	FVector2D MovementVector = Value.Get<FVector2D>();

	if (Controller != nullptr)
	{
		const FRotator Rotation = Controller->GetControlRotation();
		const FRotator YawRotation(0, Rotation.Yaw, 0);

		const FVector ForwardDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
		const FVector RightDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);

		AddMovementInput(ForwardDirection, MovementVector.Y);
		AddMovementInput(RightDirection, MovementVector.X);
	}
}

void ABLCPlayerCharacter::Input_Look(const FInputActionValue& Value)
{
	FVector2D LookAxisVector = Value.Get<FVector2D>();

	if (Controller != nullptr)
	{
		AddControllerYawInput(LookAxisVector.X);
		AddControllerPitchInput(LookAxisVector.Y);
	}
}

void ABLCPlayerCharacter::Input_StartSprint(const FInputActionValue& Value)
{
	if (UBLCMovementComponent* BLCComp = Cast<UBLCMovementComponent>(GetCharacterMovement()))
	{
		BLCComp->SetSprinting(true);
		if (FollowCamera)
		{
			FollowCamera->SetTargetFOV(100.0f, 6.0f);
		}
	}
}

void ABLCPlayerCharacter::Input_StopSprint(const FInputActionValue& Value)
{
	if (UBLCMovementComponent* BLCComp = Cast<UBLCMovementComponent>(GetCharacterMovement()))
	{
		BLCComp->SetSprinting(false);
		if (FollowCamera)
		{
			FollowCamera->SetTargetFOV(90.0f, 6.0f);
		}
	}
}

void ABLCPlayerCharacter::Input_StartCrouch(const FInputActionValue& Value)
{
	Crouch();
}

void ABLCPlayerCharacter::Input_StopCrouch(const FInputActionValue& Value)
{
	UnCrouch();
}

void ABLCPlayerCharacter::Input_Interact(const FInputActionValue& Value)
{
	if (InteractionComp)
	{
		InteractionComp->PerformInteraction();
	}
}

void ABLCPlayerCharacter::Input_ToggleMap(const FInputActionValue& Value)
{
	if (ABLCPlayerController* PC = Cast<ABLCPlayerController>(GetController()))
	{
		PC->ToggleWorldMap();
	}
}
