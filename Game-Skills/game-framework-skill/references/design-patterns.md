# GameUniverse Design Patterns

This reference merges the anomaly/map-system and networked tether/transport patterns into reusable branches for `gameuniverse-framework`.

## 1. Generic Manager / Rule / PS pattern

Use for most mode systems.

```text
Root GlobalState
└─ GiveAbility: GUVObject_*Mgr_GS
   ├─ AutoGiveAbility: GUVObject_*RuleA_GS
   ├─ AutoGiveAbility: GUVObject_*RuleB_GS
   ├─ Optional: GUVObject_*Adapter_GS
   └─ Coordinate: GUVObject_*Player_PS
```

Responsibilities:

- Manager GS: authoritative entry, public API, lifecycle, registration, rule orchestration.
- Rule GS: concrete policy variants and configurable logic.
- Player PS: per-player flow, UI, local proxy, request forwarding, PlayerExInfoTags reactions.
- Subsystem: config, runtime registry, lookup, query, delegate, relation/spatial services.
- Actor/Component: runtime world object, collision, visual, interaction.

## 2. Anomaly / abnormal / area systems

Use when the system owns map/zone progression, abnormal value, cleansing, generated content, rewards, or module adapters.

### Recommended topology

```text
Root GlobalState
└─ GUVObject_*AbnormalSystemMgr_GS
   ├─ Rule_Stage_GS
   ├─ Rule_Deploy_GS
   ├─ Rule_Event_GS
   ├─ Rule_Reward_GS
   ├─ Adapter_Loot_GS
   ├─ Adapter_Container_GS
   ├─ Adapter_Monster_GS
   ├─ Adapter_Mission_GS
   └─ GUVObject_*AbnormalSystemPlayer_PS

U*AbnormalSubsystem
├─ config and area DataAsset lookup
├─ runtime source registry
├─ area spatial index
├─ range scan/query API
└─ module delegate/GMP subscriptions
```

### Design rules

- Map/zone/system state is GS authoritative.
- PS skill is only player presentation, range-scan request/proxy, UI, or local feedback.
- External modules should report facts, not decide abnormal value.
- Abnormal value should be calculated by the abnormal system using area, type, map, difficulty, object config, and runtime modifiers.
- Disabled whole system or disabled module must be no-op: no listener registration, no hidden actors, no collision changes, no value submission.

### Non-invasive integration order

1. Listen to existing delegates or GMP messages.
2. Add optional component to existing actors/blueprints.
3. Add a small event/delegate to a common base class only if no event exists.
4. Avoid rewriting existing Loot/container/monster/mission flow controllers.

### Data pipeline

- Editor authoring: Spline or Volume.
- Bake output: `U*AreaDataAsset` with bounds, polygon, candidate points, area rules, generation event IDs, reward event IDs, scan rules, debug data.
- Runtime: subsystem loads DataAssets, builds spatial index, handles queries.
- Generation/reward: event ID + typed config. Prefer `FInstancedStruct` or `TInstancedStruct` when project patterns support it.
- Performance: queue generation tasks; do not spawn or reward everything in one frame.

## 3. Networked tether / transport / rope Actor systems

Use when a player pulls, drags, tethers, escorts, transports, purifies, or drops off an Actor/Mesh.

### Recommended topology

```text
Root GlobalState
└─ GUVObject_*CargoTransportMgr_GS
   ├─ Rule_AttachDetach_GS
   ├─ Rule_MovementLimit_GS
   ├─ Rule_PurifyReward_GS
   └─ GUVObject_*CargoTransportPlayer_PS

U*CargoTransportSubsystem
├─ config
├─ spawn point lookup
├─ purification/drop-off volume query
├─ runtime registry
└─ helper functions

A*CargoBoxActor
├─ U*CargoMovementComponent
├─ U*CargoRopeVisualComponent
├─ U*CargoPurifyComponent
└─ replicated state and detach snapshots
```

### Option comparison

| Option | Strength | Risk | Recommendation |
|---|---|---|---|
| Kinematic virtual rope + local visual rope | stable, predictable, low network risk, protects 3C | less physically rich | default first version |
| Kinematic + short-time physics after break/impact | better feel while retaining authority | extra state transitions | enhanced version |
| Full physics constraint/cable authority | authentic physical look | latency, jitter, correction, 3C disruption | not first version |
| Navigation/path-assisted follow | avoids obstacle-heavy stuck cases | may feel less like rope | optional supplement |

### Movement and obstacle rules

Define all of these explicitly:

- max rope length;
- slack and tension threshold;
- cargo movement sweep;
- rope line-of-sight trace;
- max height delta;
- stuck detection over several frames;
- player death/down/teleport detach;
- purification/drop-off condition;
- detach reason enum.

### Network rules

- Server owns attach, detach, movement authority, rope break, purification, reward.
- Replicate concise state and snapshots, not rope particles or cable segment positions.
- Detach snapshot should include location, rotation, velocity, detach reason, server time.
- Clients reconstruct rope visual locally from endpoints and state.
- Separate collision root from visual root. Smooth visual root; never let visual smoothing alter server collision.
- Correction policy: small error smooth, large error fast blend, extreme error snap.
- Player 3C protection: cargo should not physically pull/block player by default; movement modifiers must be cleaned on detach/death/purify.

## 4. Implementation naming guidance

Prefer names that expose ownership and role:

- `GUVObject_<Feature>Mgr_GS`
- `GUVObject_<Feature>Rule_<Variant>_GS`
- `GUVObject_<Feature>Player_PS`
- `U<Feature>Subsystem`
- `A<Feature>Actor`
- `U<Feature>MovementComponent`
- `U<Feature>VisualComponent`
- `U<Feature>PurifyComponent`
- `I<Feature>Interface`

If Boss or existing code provides a naming convention, preserve it.
