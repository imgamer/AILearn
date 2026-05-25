# Root / GUV Core Reference

This reference is the distilled core of the project GameUniverse framework. It is based on the Root sharing document, workspace rules, and the previous `gameuniverse-root-framework` skill.

## 1. Root is a skill and controls mode progress

Root is not just a config file. Root is the mode's core skill for controlling game progress.

### Give / Activate

- Editor flow: Root is usually given and activated when GameState BeginPlay runs.
- Package / DS flow: DS initialization may be controlled by server protocol logic. If behavior differs from editor, trace DS logs plus `DSAgent.cpp` and `DSServerCtrl.lua`.

### GlobalState

GlobalState runs Actions immediately after activation. Put early system bootstrap here:

- statistics systems;
- common mode systems;
- Manager GS skills;
- initial global state setup.

### Normal States

Normal states define:

- which phases the mode has;
- what each phase does;
- transition conditions between phases;
- timeout, login, loading-majority, or gameplay condition gates.

Example reasoning pattern:

```text
Enter default 120s
  OR condition: one player entered DS
  OR condition: most players loaded
  OR condition: state duration exceeded
→ WarmUp
  OR condition: most players loaded
  OR condition: WarmUp duration exceeded
→ Fighting
```

## 2. Key GameUniverse types

| Type | Responsibility |
|---|---|
| `GUVWorldSubsystem` | mode/system subsystem; config aggregation, runtime registry, helper queries, delegates, sometimes direct `GiveGSAbility` helpers |
| `UGameUniverseObject` | common base for GameUniverse objects; dynamic config reading and project conveniences |
| `GUVObject_GS` | GameState/global-side skill; supports AutoGiveAbility; default base for Manager and Rule skills |
| `GUVObject_PS` | PlayerState/player-side skill; listens to PlayerExInfoTags; owns per-player process/proxy/presentation |
| `GUVObject_CH` | Character-side skill; use only for current character lifetime |
| `UGUVAction` / GameUniverseAction | reusable action logic with project lifecycle callbacks |
| `PlayerKeyNotifies` | lifecycle callback extension points such as PostLogin, OnControllerInitPlayerState, OnControllerPossessPawn, spectator target changes |

## 3. Player, team, camp, relation

Player initialization highlighted by the Root sharing doc:

```text
PostLogin
└─ InitializePlayer()
   ├─ initialize PlayerState
   ├─ initialize PlayerExInfo
   ├─ initialize TeamExInfo / CampExInfo if relevant
   └─ relation checks through GUVRelationSubsystem
```

Important data:

- `PlayerExInfo`: player extended data.
- `PlayerExInfoTags`: critical tags used by state management, settlement, respawn, and other systems.
- `TeamExInfo`: team extended data.
- `CampExInfo`: camp/faction extended data.
- `GUVRelationSubsystem`: common relation system; enemy/friendly logic can vary by mode.

Design rule: never hardcode enemy/friendly/team/camp decisions in a feature when the relation subsystem or mode relation config should own them.

## 4. Standard system initialization chain

```text
Root GlobalState
└─ GiveAbility: System Manager GS skill
   ├─ AutoGiveAbility: Rule GS skill A
   ├─ AutoGiveAbility: Rule GS skill B
   ├─ Optional: adapter GS skills
   └─ Give / coordinate PS skills for player process or presentation
```

Examples:

- Settlement manager gives settlement rules such as player/team/game rules.
- Respawn manager gives gene/parachute respawn rules.
- Settlement/respawn can give PS flow/proxy skills for player presentation.
- Player state management is special: `UGUVObject_GrPlayerMgr` can be directly given as a PS manager for each player.

## 5. Configuration placement

| Config | Preferred location |
|---|---|
| Common mode/module switches | RootGAConfig / SubsystemConfig |
| Subsystem-specific setup | SubsystemConfig |
| Manager-level orchestration | Manager Config |
| Rule values | Rule Config |
| Temporary debug override | DebugDA |

If older feature flags are scattered inside concrete skill states or rule configs, call it out as a maintenance risk.

## 6. Debug workflow

1. Find the target Root directory.
2. Open the target mode Root folder.
3. Use Default GameMode unless local evidence says otherwise.
4. Switch RootGA to the target mode Root.
5. Use DebugDA to shorten phases, disable actions, or switch clean/full flows.
6. Run game and reproduce the flow.
7. Break on skill base classes, `UGameUniverseObject`, `GUVObject_GS/PS`, `UGUVAction`, Manager Give/Activate, AutoGiveAbility, PlayerKeyNotifies, and subsystem delegates.
8. For DS-only issues, compare editor log vs DS log and trace `DSAgent.cpp` / `DSServerCtrl.lua`.

## 7. Lyra comparison rule

Lyra relies more on Experience, GameFeature, ModularGameplay, GamePhaseAbility, and GamePhaseSubsystem. In this project, the primary mode-management model is RootGA + Config + Actions + GUV skills. Do not copy Lyra's Experience model unless there is a concrete reason and toolchain support.
