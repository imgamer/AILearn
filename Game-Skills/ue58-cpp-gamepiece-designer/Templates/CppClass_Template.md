# C++ Class Design Template

> This template defines the structure for C++ class designs produced by the skill.
> AI assistants read this template to understand the expected output format.
> Fill in all `<...>` placeholders with system-specific content.

## Class Overview
- **Class name**: `A<Thing>` / `U<Thing>Component` / `U<Thing>Subsystem` / `U<Thing>Widget`
- **Parent class**: `<ParentName>` (e.g., AActor / UActorComponent / UGameInstanceSubsystem / UUserWidget)
- **Responsibility**: <one sentence describing what this class does>
- **Network role**: Server authoritative / Client only / Both / Client cosmetic
- **Layer**: Logic / Visual-bridge / Hybrid
- **Related visual assets**: <list BP_/ABP_/ST_/BT_/DT_ assets that use this class>

## Header File (.h)
```cpp
#pragma once

#include "CoreMinimal.h"
#include "<ParentHeader>.h"
#include "<Thing>.generated.h"

/**
 * <ClassName> - <one-line description>
 *
 * Responsibility: <what it does>
 * Network role: <Server/Client/Both>
 * Layer: <Logic/Visual-bridge/Hybrid>
 * Related assets: <BP_/ABP_/ST_/BT_/DT_ that use this>
 *
 * Visual Asset Contract: (MANDATORY if bridging to visual assets)
 *   - Asset: <asset name>
 *   - Exposed variables:
 *     - <var1> (<type>): <purpose>
 *     - <var2> (<type>): <purpose>
 *   - Expected behavior: <state machine transitions / execution order>
 */
UCLASS(<ClassFlags like Abstract/Blueprintable/ClassGroup>)
class <ClassName> : public <ParentClass>
{
    GENERATED_BODY()

public:
    <ClassName>();

    // === Replication (if networked) ===
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    // === Blueprint-callable API ===
    UFUNCTION(BlueprintCallable, Category = "<Thing>|Action")
    void <Action>(<params>);

    // === Blueprint events (implemented in BP, visual only) ===
    UFUNCTION(BlueprintImplementableEvent, Category = "<Thing>|Event")
    void On<Event>(<params>);

    // === Blueprint-native events (C++ default + BP optional override) ===
    UFUNCTION(BlueprintNativeEvent, Category = "<Thing>|Event")
    void On<State>Change();

protected:
    virtual void BeginPlay() override;

    // === Server-side RPC (client requests, server executes) ===
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_<Action>(<params>);

    // === Client-side RPC (server triggers, client plays cosmetic) ===
    UFUNCTION(Client, Reliable)
    void Client_<Notify>(<params>);

    // === Exposed properties (config layer — BP subclasses can override defaults) ===
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "<Thing>|Stats",
        meta = (ClampMin = "<min>", ClampMax = "<max>"))
    float <StatName> = <default>;

    // === Replicated properties ===
    UPROPERTY(ReplicatedUsing = OnRep_<Name>)
    <Type> <Name>;

    UFUNCTION()
    void OnRep_<Name>();

private:
    // Internal state (not exposed to BP)
    UPROPERTY(Transient)
    <Type> <PrivateVar>;

    // Non-UPROPERTY internal cache
    <Type> <CacheVar>;
};
```

## Implementation Notes (.cpp)
- **<key method 1>**: <what it does, why this approach>
- **<key method 2>**: <what it does, why this approach>
- **Replication**: <which vars replicated, RepNotify usage, relevancy>
- **Validation**: <Server_Validate checks for anti-cheat>
- **Physics** (if applicable): <force application, collision response, async physics>

## Blueprint Config Layer
- **BP subclass name**: `BP_<Variant>` (e.g., BP_Brick_Heavy, BP_Brick_Ice)
- **Default value overrides**:
  - `<Property>`: `<value>` (e.g., Mass: 300.0)
  - `<Property>`: `<value>`
- **Asset bindings**:
  - Mesh: `<asset path>` (e.g., SM_Brick_Large)
  - Material: `<asset path>`
  - VFX: `<asset path>`

## Subsystem Variant (if global service)
```cpp
/**
 * U<Thing>Subsystem - <description>
 *
 * Responsibility: <global service responsibility>
 * Network role: Server authoritative (or client-only for UI services)
 * Layer: Logic
 * Lifetime: <GameInstance/World/Player/Editor>
 */
UCLASS()
class U<Thing>Subsystem : public U<World/GameInstance>Subsystem
{
    GENERATED_BODY()

public:
    static U<Thing>Subsystem* Get(const UObject* Context);

    // API methods...
};
```

## Component Variant (if attachable)
```cpp
/**
 * U<Thing>Component - <description>
 *
 * Responsibility: <component responsibility>
 * Network role: <Server/Client/Both>
 * Layer: Logic
 * Attach to: <which Actor types>
 */
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class U<Thing>Component : public UActorComponent
{
    GENERATED_BODY()
    // ...
};
```
