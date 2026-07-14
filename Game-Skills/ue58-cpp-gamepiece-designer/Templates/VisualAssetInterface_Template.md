# Visual Asset Interface Contract Template

> This template defines the "interface contract" between C++ classes and visual assets.
> AI assistants read this contract to understand orchestration WITHOUT parsing .uasset files.
> Fill in all `<...>` placeholders. Remove sections that don't apply.

## AnimBP Interface (if system has animated characters)

- **C++ class**: `U<Character>AnimInstance`
- **Asset name**: `ABP_<Character>` (Anim Blueprint)
- **Exposed variables** (UPROPERTY(BlueprintReadOnly), set by C++ in NativeUpdateAnimation):
  | Variable | Type | Purpose | Set when |
  |---|---|---|---|
  | `<bIsMoving>` | bool | <drives Idle↔Moving transition> | <Speed > threshold> |
  | `<Speed>` | float | <current movement speed> | <every NativeUpdateAnimation tick> |
  | `<bIsInAir>` | bool | <drives Jump state> | <character not on ground> |
  | `<bIsAttacking>` | bool | <drives Attacking state> | <attack started, cleared on end> |

- **Expected State Machine structure**:
  - States: Idle, Moving, Jumping, Attacking, Dead
  - Transitions:
    - Idle → Moving: `<bIsMoving == true>`
    - Moving → Idle: `<bIsMoving == false>`
    - Any → Attacking: `<bIsAttacking == true>`
    - Attacking → Idle: `<attack montage finished>`
    - Any → Dead: `<bIsDead == true>`

- **Anim Notifies** (C++ responds to, defined in AnimBP):
  - `AnimNotify_<Event>`: <what C++ does when this notify fires>

## StateTree Interface (if system has AI decision-making)

- **C++ tasks** (UStateTreeTask subclasses, logic in C++):
  | Task class | Purpose | Returns |
  |---|---|---|
  | `U<Name>StateTask_Patrol` | <move to random patrol point> | Success/Fail/Running |
  | `U<Name>StateTask_Chase` | <move to target actor> | Success/Fail/Running |
  | `U<Name>StateTask_Attack` | <perform attack on target> | Success/Fail |

- **C++ evaluators** (UStateTreeEvaluator subclasses, provide data):
  | Evaluator class | Output | Purpose |
  |---|---|---|
  | `U<Name>StateEvaluator_HasTarget` | bool (HasTarget) | <true if AI has valid target> |
  | `U<Name>StateEvaluator_Health` | float (HealthPct) | <current health percentage> |

- **StateTree asset** (`ST_<System>`): orchestrates these tasks
  - States: Patrol → Chase → Attack → Cooldown → Patrol
  - Conditions (using evaluator outputs):
    - Patrol → Chase: `HasTarget == true`
    - Chase → Attack: `distance to target < attack_range`
    - Attack → Cooldown: `task returns Success`
    - Cooldown → Patrol: `timer elapsed`

- **Inputs** (set by StateTree, read by C++ tasks):
  - `<PatrolPoints>` (TArray<AActor*>): set by evaluator, read by patrol task

- **Outputs** (set by C++ tasks, read by StateTree conditions):
  - `<CurrentPointIndex>` (int32): which patrol point we're at

## BT Interface (if using Behavior Tree instead of StateTree)

- **C++ tasks** (`UBTTask_<Action>` subclasses):
  | Task class | Purpose | Node name in BT |
  |---|---|---|
  | `UBTTask_<Action>` | <what it does> | <display name> |

- **C++ services** (`UBTService_<Monitor>` subclasses):
  | Service class | Tick interval | Purpose |
  |---|---|---|
  | `UBTService_DetectEnemy` | 0.5s | <update Blackboard TargetEnemy key> |

- **C++ decorators** (`UBTDecorator_<Condition>` subclasses):
  | Decorator class | Condition | Purpose |
  |---|---|---|
  | `UBTDecorator_HasTarget` | <TargetEnemy is set> | <gate attack branch> |

- **BT asset** (`BT_<System>`): orchestrates these nodes
- **Blackboard asset** (`BB_<System>`): keys used
  | Key | Type | Set by | Read by |
  |---|---|---|---|
  | `TargetEnemy` | Object (Actor) | UBTService_DetectEnemy | UBTTask_Attack, UBTDecorator_HasTarget |

## DataTable Interface (if system has data-driven config)

- **C++ struct**: `F<Thing>Stats` (UPROPERTY(BlueprintType))
- **DataTable asset**: `DT_<Thing>`
- **CSV format** (first row = field names):
  ```
  <Field1>,<Field2>,<Field3>,...
  <value>,<value>,<value>,...
  ```
- **C++ access pattern**:
  ```cpp
  // Query via subsystem or helper
  const F<Thing>Stats* Stats = DT_<Thing>->FindRow<F<Thing>Stats>(RowName, "");
  ```

## DataAsset Interface (if system uses DataAsset config)

- **C++ class**: `U<Thing>Config` (UDataAsset subclass, UCLASS(BlueprintType))
- **DataAsset instances**: `DA_<Variant>` (e.g., DA_EnemyConfig_Easy)
- **Exposed properties** (UPROPERTY(EditAnywhere)):
  - `<Property1>` (<type>): <purpose>
  - `<Property2>` (<type>): <purpose>

## GAS Interface (if using Gameplay Ability System)

- **C++ AttributeSet**: `U<Character>AttributeSet`
  - Attributes: <list UPROPERTY(BlueprintReadOnly) attributes and clamps>

- **C++ Ability base class**: `U<Name>AbilityBase` (UGameplayAbility subclass)
  - Logic in C++ (ActivationBlocked, PreActivate, ActivateAbility, EndAbility)
  - BP subclass `GA_<Specific>` configures: Input binding, Cooldown GE, Cost GE

- **DataAsset Effects**: `GE_<Effect>` (UGameplayEffect blueprint/DataAsset)
  - Configures: magnitude, duration, modifiers (NO logic, just numbers)

- **Gameplay Tags** (defined in DefaultGameplayTags.ini):
  | Tag | Purpose |
  |---|---|
  | `Tag.<Category>.<Name>` | <what it marks> |

## Enhanced Input Interface (if system has player input)

- **Input Action assets**: `IA_<Action>` (e.g., IA_Interact, IA_Attack)
- **Input Mapping Context**: `IMC_<Context>` (e.g., IMC_Default)
- **C++ binding** (in PlayerController or Character SetupPlayerInputComponent):
  ```cpp
  EnhancedInputComponent->BindAction(IA_Interact, ETriggerEvent::Started, this, &AMyCharacter::OnInteract);
  ```
- **Expected mappings** (in IMC_ asset):
  | Input Action | Key | Modifier |
  |---|---|---|
  | `IA_Interact` | E | none |
  | `IA_Attack` | Left Mouse Button | none |

## Widget Interface (if system has UI)

- **C++ class**: `U<Thing>Widget` (UUserWidget subclass)
- **Widget asset**: `WBP_<Thing>` (Widget Blueprint, layout only)
- **Bound widgets** (UPROPERTY(meta=(BindWidget))):
  | Property | Widget type | Purpose |
  |---|---|---|
  | `<ItemsWrapBox>` | UWrapBox* | <container for dynamic children> |
  | `<CloseButton>` | UButton* | <bound to CloseInventory()> |

- **C++ functions** (bound to widget events):
  - `<CloseInventory>()`: bound to CloseButton OnClick
  - `<RefreshInventory>()`: called when inventory data changes

- **Expected WBP structure**:
  - Root → Canvas Panel
    → Title Text
    → Close Button
    → <ItemsWrapBox> (UPROPERTY binding)
    → Detail Panel
