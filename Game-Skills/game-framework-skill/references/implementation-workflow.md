# GameUniverse Implementation Workflow

Use this reference when the task moves from analysis/design into concrete implementation.

## 1. Pre-implementation checklist

Before editing code/config:

1. Confirm the feature owner:
   - RootGA / mode.
   - GS Manager.
   - Rule GS skills.
   - PS / CH skills.
   - Subsystem.
   - Actors/components/interfaces.
2. Confirm config ownership:
   - RootGAConfig.
   - SubsystemConfig.
   - Manager Config.
   - Rule Config.
   - DebugDA.
3. Confirm authority:
   - What server owns.
   - What client/PS may request.
   - What is replicated.
   - What is visual-only.
4. Confirm integration style:
   - delegate / GMP;
   - optional component;
   - interface;
   - small base event;
   - direct modification only when unavoidable.
5. Confirm disabled behavior:
   - system disabled;
   - module disabled;
   - DebugDA disables an Action;
   - legacy flow unaffected.

## 2. Read-only exploration targets

Search first, then edit. Useful patterns:

```text
RootGA
GUVObject_Root
GlobalState
RootGAConfig
DebugDA
UGameUniverseObject
UGUVObject_GS
UGUVObject_PS
UGUVObject_CH
UGUVAction
AutoGiveAbility
PlayerKeyNotifies
PostLogin
InitializePlayer
OnControllerInitPlayerState
OnControllerPossessPawn
PlayerExInfoTags
GUVRelationSubsystem
GUVWorldSubsystem
```

For anomaly systems, also search:

```text
Abnormal
Anomaly
AreaDataAsset
InstancedStruct
TInstancedStruct
GMP
Loot
Container
Monster
Mission
Trigger
```

For tether/transport systems, also search:

```text
Cable
Constraint
ReplicatedMovement
OnRep
MovementComponent
Smooth
Physics
Sweep
Trace
Attach
Detach
Purify
Transport
Cargo
```

## 3. Implementation plan shape

A concrete plan should be organized by layer:

```text
1. Root / Config
   - add Manager GiveAbility in GlobalState
   - add SubsystemConfig / ManagerConfig / RuleConfig / DebugDA entries
2. GS Manager
   - lifecycle, public API, registration, orchestration
3. GS Rules
   - split variants and policy calculations
4. PS / CH skills
   - player request, proxy, local presentation, tag reactions
5. Subsystem
   - config lookup, runtime registry, shared query, delegates
6. Actors / Components / Interfaces
   - world runtime object, collision, visual, interaction, event reporting
7. Replication / network
   - replicated state, OnRep, snapshots, RPC boundaries, client smoothing
8. Validation
   - editor flow, DS flow, reconnect, disable switches, performance
```

## 4. Code-change principles

- Prefer existing local patterns and naming.
- Keep GS authoritative and PS presentational/request-driven.
- Keep Manager thin; split concrete policy into Rules.
- Keep subsystem service-like; do not hide rule decisions inside it.
- Keep actor/components focused on world behavior and representation.
- Do not hardcode mode-specific relation/team/camp logic.
- Use interfaces/components/delegates for non-invasive integration.
- Do not silently change existing gameplay behavior when the new system is disabled.
- Add logs/debug hooks where they match existing project style.

## 5. Network implementation principles

- Server writes replicated gameplay state.
- Owning client sends intent via controlled request path.
- Simulated clients play visual smoothing and OnRep reactions.
- Use deterministic snapshots for one-shot events like detach, break, purification completion, reward spawn.
- For moving Actor systems, do not rely on raw `ReplicatedMovement` alone if continuous local visual quality matters.
- Separate collision authority from visual smoothing.

## 6. Validation checklist

After implementation, verify:

- Root GlobalState gives Manager exactly once in the intended flow.
- Manager activates and AutoGives configured Rules.
- Configs load from intended RootGAConfig/SubsystemConfig/RuleConfig.
- DebugDA can shorten/disable flow without code change.
- Player initialization and tags are correct after PostLogin/reconnect.
- Relation/team/camp checks match mode config.
- Disabled whole system and disabled module are no-op.
- DS and editor initialization behave consistently or documented differences are intentional.
- Network clients receive correct replicated state and visual smoothing does not affect authority.
- Existing flows such as Loot, monster, mission, settlement, respawn, OB/replay are not broken.
