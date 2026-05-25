---
name: gameuniverse-framework
description: Use this master skill for current-project GameUniverse / GUV / Mode Root gameplay work, from requirement analysis to concrete technical方案 and implementation planning. It combines the Root framework, anomaly/map-system design, and networked tether/transport actor design into one workflow. Trigger it when the user asks to analyze, design, review, implement, or fix a gameplay feature that must comply with the project's RootGA, GlobalState, GUVWorldSubsystem, UGameUniverseObject, GUVObject_GS/PS/CH, Manager/Rule/PS layering, PlayerExInfoTags, team/camp/relation, DebugDA, DS/editor initialization, network replication, non-invasive integration, or code-implementation norms.
description_zh: GameUniverse总玩法框架
description_en: GameUniverse framework
disable: false
agent_created: true
---

# gameuniverse-framework

## Purpose

This is the master GameUniverse skill for Boss's current project. It merges and supersedes the reusable parts of:

- `gameuniverse-root-framework`
- `gameuniverse-anomaly-design-review`
- `gameuniverse-networked-tether-actor-design`

Use it to handle the full chain:

```text
需求输入
→ Root / GUV 合规分析
→ 现有代码与配置只读定位
→ 技术方案设计与方案对比
→ 具体类、技能、配置、数据结构、流程拆分
→ 实现计划 / 可执行改动点
→ 验证、风险、回滚
→ 必要时进入代码实现
```

## When to use

Use this skill when the user asks for any GameUniverse gameplay task in `D:/Workspace/GR_ZhuYue_Main`, including but not limited to:

- 玩法需求分析、会议纪要转设计、Word/Markdown 需求文档落地。
- 新模式系统、新 Root 流程、新 Manager/Rule/PS 技能设计。
- 判断逻辑应该放在 Root State Action、GS Manager、GS Rule、PS、CH、GUVWorldSubsystem、Actor、Component、Interface 还是 Config。
- 异常/污染/区域/地图进度/事件生成/奖励/清理值/模块开关等 map-level 或 zone-level 系统。
- 运输、牵引、拖拽、绳索、护送、可移动 Loot/物资箱、净化/投递、联机 Actor 平滑与断绳同步。
- Settlement、Respawn、OB、Replay、PlayerMgr、Relation、Team、Camp、Loot、Monster、Trigger、Mission 等系统改造或接入。
- 需要同时给出“需求分析 + 技术方案 + 可落地实现路径 + 验证步骤”的任务。
- 需要审查现有方案是否符合项目 Root/GameUniverse 规范。

If the task is specifically only about anomaly or tether design, this master skill still applies; use the specialized sections below as decision branches.

## Authority and source order

Follow this priority order:

1. User's current explicit request.
2. Workspace governance:
   - `D:/Workspace/GR_ZhuYue_Main/.workbuddy/rule/rule.md`
   - `D:/Workspace/GR_ZhuYue_Main/.workbuddy/habit/habit.md`
   - `D:/Workspace/GR_ZhuYue_Main/.workbuddy/memory/memory.md`
3. Root reference:
   - `D:/Workspace/GR_ZhuYue_Main/.workbuddy/rule/references/轻分享_玩法与模式Root介绍_ extracted.md`
   - `C:/Users/llc18/Downloads/轻分享：玩法与模式Root介绍.docx`
4. This skill's bundled references:
   - @references/root-guv-core.md
   - @references/design-patterns.md
   - @references/implementation-workflow.md
   - @templates/gameuniverse-requirement-to-implementation-report.md
5. Actual project code/config evidence discovered read-only.

Do not invent project conventions when code/config evidence is available. For implementation tasks, read existing patterns first.

## Operating modes

### A. Requirement analysis only

Use when Boss wants evaluation, design review, or architecture discussion. Output a report with evidence and no file/code modifications unless explicitly requested.

### B. Technical方案

Use when Boss wants a concrete方案 but not code yet. Produce multiple options when meaningful, recommend one, and include class/config/data/flow details.

### C. Implementation planning

Use when Boss asks to implement or prepare implementation. First produce a clear implementation plan, file candidates, risk list, and validation commands/steps. For non-trivial code changes, ask for approval before editing.

### D. Implementation execution

Use only after the task is clear and approval is implied or given. Apply minimal, project-conforming changes; keep Root/GUV layering intact; run available validation.

## Core GameUniverse architecture rules

### Root is the mode process controller

```text
Mode Root Skill / RootGA
├─ Give / Activate
│  ├─ Editor: usually GameState BeginPlay gives and activates Root
│  └─ Package/DS: may be controlled by DS server protocol; inspect DSAgent.cpp, DSServerCtrl.lua, DS logs
├─ GlobalState
│  └─ Immediately runs Actions; initializes global systems and Manager GS skills
├─ Normal States
│  ├─ mode phases such as Enter / WarmUp / Fighting / Settlement
│  ├─ per-phase actions
│  └─ transition conditions: login, loading majority, timeout, gameplay condition, custom variables
└─ Config
   ├─ RootGAConfig
   ├─ SubsystemConfig
   ├─ DebugDA
   ├─ Manager Config
   └─ Rule / PS / Action Config
```

### Default ownership split

| Owner | Use for | Avoid |
|---|---|---|
| Root GlobalState Action | early system entry, Give Manager, global bootstrap | hiding detailed feature logic |
| `GUVObject_*Mgr_GS` / `UGUVObject_GS` | authoritative match/map/system state, rule orchestration, registration, reward decisions | per-player-only UI flow |
| `GUVObject_*Rule*_GS` | concrete rule variants, configurable policy, scoring/reward/respawn/settlement variants | giant manager with all policies inline |
| `GUVObject_*_PS` / `UGUVObject_PS` | per-player process, proxy, local UX, input requests, PlayerExInfoTags reactions | authoritative map/zone/match state |
| `GUVObject_*_CH` / `UGUVObject_CH` | behavior bound to current character lifetime | state that must survive pawn/character changes |
| `UGUVWorldSubsystem` / project subsystem | config, runtime registry, shared queries, relation/spatial/drop-off services, delegates, `GiveGSAbility` helpers | rule-specific business decisions that belong in rules |
| Actor / Component / Interface | world representation, collision, visual, interaction, non-invasive integration point | owning mode process or global authority |

Important exception: Player state management can be a directly given PS manager, such as `UGUVObject_GrPlayerMgr`, because it owns one player's state and avoids a monolithic GS state manager.

## Standard workflow

1. **Read and classify the input**
   - If the input is a `.docx`, extract text/tables first.
   - Identify feature type: Root-flow, player-state, relation/team/camp, anomaly/area, tether/transport, generic mode module, or code fix.
   - Record open questions only if they block correctness; otherwise make explicit assumptions.

2. **Read governance and prior conclusions**
   - Apply `.workbuddy/rule/rule.md`, `.workbuddy/habit/habit.md`, and relevant memory.
   - For gameplay work, enforce R-GAMEPLAY-ROOT rules.

3. **Do read-only code/config exploration before conclusions**
   Search for local patterns before designing or editing:
   - Root: `RootGA`, `GUVObject_Root`, mode Root folders, GlobalState Actions.
   - GUV base types: `UGUVObject_GS`, `UGUVObject_PS`, `UGUVObject_CH`, `UGameUniverseObject`, `UGUVAction`.
   - Subsystems: `GUVWorldSubsystem`, `PlayerExSubsystem`, `TeamExSubsystem`, `GUVRelationSubsystem`.
   - Lifecycle callbacks: `PostLogin`, `InitializePlayer`, `OnControllerInitPlayerState`, `OnControllerPossessPawn`, PlayerKeyNotifies.
   - Config: RootGAConfig, SubsystemConfig, DebugDA, Manager Config, Rule Config.
   - Existing feature analogs in the relevant mode.

4. **Map the requirement to ownership**
   - Is the state match/map/world/system-owned? Use GS Manager/Rule.
   - Is it one-player-owned and must survive pawn changes? Use PS or PlayerEx data.
   - Is it current-character-owned? Use CH or character component.
   - Is it a world object? Use Actor/Component with server authority and replicated state.
   - Is it a lookup/registration service? Use GUVWorldSubsystem.

5. **Design the skill topology**
   - Root GlobalState gives the top-level Manager GS unless local convention says otherwise.
   - Manager GS should be small: entry, orchestration, public API, lifecycle, registration.
   - Split variable rules into Rule GS skills.
   - Add PS skill only for player flow/proxy/presentation/input.
   - Add CH only for character lifetime.
   - Add subsystem for config, registry, shared queries, delegates, spatial indexing, relation services.

6. **Design configs and switches**
   - Common mode switches: RootGAConfig / SubsystemConfig.
   - System orchestration: Manager Config.
   - Rule-specific numbers: Rule Config.
   - Debug overrides: DebugDA.
   - Disabled system/module must not register listeners, hide actors, change collision, submit values, or affect original flow.

7. **Choose specialized branch if needed**
   - For anomaly/map-zone/event/reward systems: use the Anomaly branch.
   - For networked transport/tether/rope/drag actor systems: use the Tether branch.
   - For generic systems: use the Generic Manager/Rule/PS branch.

8. **Produce concrete技术方案**
   Always include:
   - Requirement restatement.
   - Evidence paths from docs/code/config.
   - Root state and system entry.
   - GS/PS/CH/Subsystem/Actor/Component/Interface topology.
   - Config table.
   - Runtime flow with sequence or flowchart when helpful.
   - Data structures / replicated state / event contracts.
   - Implementation steps by file/class/config.
   - Risk and verification.

9. **Implementation execution rules**
   - Prefer editing existing files over adding new files unless the architecture requires new classes/configs.
   - Keep changes minimal and aligned with existing local naming/style.
   - Do not hardcode mode relation/team/camp logic; use relation/config systems.
   - Server remains authoritative for global gameplay state, rewards, rope break, object movement authority, and final settlement.
   - Client/PS handles input, prediction, UX, and local smoothing only.
   - After code changes, run targeted compile/tests/tools when available, or provide manual validation steps if project build is unavailable.

## Specialized branch: anomaly / abnormal / map-zone systems

Use this branch when the feature is about anomaly, abnormal value, area progression, map/zone state, cleansing, event generation, reward, or module adapters.

Recommended topology:

```text
Root GlobalState
└─ Give: GUVObject_*AnomalyMgr_GS / GUVObject_*AbnormalSystemMgr_GS
   ├─ AutoGive: Rule_Stage_GS
   ├─ AutoGive: Rule_Deploy_GS
   ├─ AutoGive: Rule_Event_GS
   ├─ AutoGive: Rule_Reward_GS
   ├─ Optional Adapter_*_GS skills
   ├─ Coordinate: *Player_PS for player presentation/range scan/proxy
   └─ Use: U*AnomalySubsystem / U*AbnormalSubsystem
```

Rules:

- Map/zone/world progression is GS-authoritative, not PS.
- External modules report facts; anomaly system calculates value/reward/stage.
- Integrate non-invasively: delegates/GMP messages first, optional components second, base-class event only if necessary.
- Use optional adapter GS skills for Loot, containers, monsters, missions, triggers, key rooms, extraction, or event flows.
- For area systems, include editor/data pipeline: Spline/Volume -> baked DataAsset -> runtime spatial index/query.
- For configurable generation/reward, prefer event ID + `FInstancedStruct` / `TInstancedStruct` if the project uses StructUtils patterns.
- Generation should use queued/per-frame tasks, not one-frame mass spawn.

## Specialized branch: networked tether / transport / rope Actor systems

Use this branch when players pull, drag, tow, rope, escort, transport, purify, or drop off a networked Actor/Mesh.

Recommended topology:

```text
Root GlobalState
└─ Give: GUVObject_*TransportMgr_GS
   ├─ AutoGive: Rule_AttachDetach_GS
   ├─ AutoGive: Rule_PurifyReward_GS
   ├─ Coordinate: GUVObject_*TransportPlayer_PS
   └─ Use: U*TransportSubsystem
        └─ Runtime registry / spawn points / drop-off query / config

A*CargoActor
├─ U*MovementComponent       server authoritative kinematic movement / sweep
├─ U*RopeVisualComponent     client local rope visual reconstruction
├─ U*PurifyComponent         purification/drop-off state
└─ replicated state/snapshots
```

Implementation options to present:

| Option | Use when | Recommendation |
|---|---|---|
| Kinematic virtual rope + visual rope | first version, stable network gameplay, player 3C protection | default recommended |
| Kinematic + short-time physics on break/impact | needs better break/impact feel but stable authority | enhanced version |
| Full physics constraint/cable authority | simulation prototype or offline/non-critical object | usually not first version |
| Navigation/path-assisted following | obstacle-heavy levels where direct towing gets stuck | optional supplement |

Network/3C rules:

- Server decides attach, detach, rope break, purification, reward, final position.
- Client reconstructs rope visuals locally from endpoints, slack/tension, and state; do not replicate segment-by-segment.
- Use detach snapshot: location, rotation, velocity, reason, server time.
- Separate collision root and visual root. Smooth visual root on clients; do not let client smoothing alter authoritative collision.
- Use thresholds: small error smooth, large error fast blend, extreme error snap.
- Do not let cargo physics pull/block the player by default.
- Apply movement speed modifiers with GE/tags and always clean them up on detach/death/purify.

## Output template

Use @templates/gameuniverse-requirement-to-implementation-report.md for full reports.

Short answer format when Boss asks for a concise decision:

```text
结论：
推荐方案：
Root/GUV归属：
关键类/技能：
实现切入点：
主要风险：
验证方式：
```

## Pitfalls

- Do not skip Root phase analysis for any gameplay feature.
- Do not place global/map/zone state in PS just because players interact with it.
- Do not place per-player UI/proxy work in GS.
- Do not bypass `GUVRelationSubsystem` for enemy/friendly/team/camp decisions.
- Do not scatter configs across random skill phases without flagging maintenance risk.
- Do not make a Manager GS a giant all-rules class; split Rule GS skills.
- Do not let new systems overwrite existing Loot/container/monster/mission flows; use adapters/interfaces/delegates.
- Do not make full physics the default for networked cargo dragging unless Boss explicitly accepts latency and 3C risk.
- Do not rely only on `ReplicatedMovement` for continuously dragged cargo; add state snapshots and visual smoothing.
- Do not forget Editor vs DS initialization differences.
- Do not claim implementation is complete without validation or an explicit note explaining why validation could not run.

## Verification checklist

A final GameUniverse answer or implementation must answer:

- Which RootGA/Root state owns entry?
- Which GlobalState Action gives the Manager?
- Which GS Manager is authoritative?
- Which Rule GS skills exist and why?
- Which PS/CH skills exist and what lifecycle they follow?
- Which subsystem owns config/registry/query/delegates?
- Which Actor/Component/Interface is needed?
- Which PlayerExInfoTags, TeamExInfo, CampExInfo, and relation checks are touched?
- Where are RootGAConfig, SubsystemConfig, Manager Config, Rule Config, and DebugDA overrides?
- How is the feature disabled globally or per module without affecting old flow?
- What code/config paths support the analysis?
- What implementation files/classes/configs should change?
- How are PIE, DS, reconnect, state transition, performance, and debug cases verified?
