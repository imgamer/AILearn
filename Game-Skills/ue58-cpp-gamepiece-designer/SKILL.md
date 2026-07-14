---
name: ue58-cpp-gamepiece-designer
description: Designs UE5.8 game pieces with strict layer separation: all gameplay logic in C++, Blueprint as config layer only, engine visual assets (AnimBP/StateTree/BT/DataTable) preserved. Produces C++ class designs, visual asset interface contracts, DataTable schemas, replication notes, and test checklists. AI-readable: C++ source is the single source of truth, no .uasset parsing needed.
---

# UE5.8 C++-Logic Gamepiece Designer (Strict Layer Separation, Text-Only)

## What this skill does
When the user asks for a UE system or game piece, produce a structured design
ready to implement in Unreal Engine 5.8 with **strict layer separation**:

- **C++ class design** (logic layer: header files, UPROPERTY/UFUNCTION exposure, replication)
- **Visual asset interface contracts** (which assets needed, what variables/tasks C++ exposes to them)
- **DataTable / DataAsset schemas** (gameplay data, CSV format)
- **Replication notes** (server authority, replicated vars, RPCs)
- **Layer boundary checklist** (what stays C++, what goes to visual assets)
- **Test checklist** (PIE, dedicated server, layer isolation tests, AI readability tests)

Core principle: **C++ carries all gameplay logic; Blueprint is config layer only;
engine visual assets (AnimBP/StateTree/BT/DataTable) are preserved, not C++-ified.**
This lets AI assistants read C++ source as the single source of truth — no .uasset parsing needed.

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT instruct the user to download or run scripts.
- Do NOT modify files. Output text only.
- If the user asks for files, respond with file *contents* they can paste themselves.

## Output format (always)
1) **Goal**
2) **Inputs** (trigger event, physics params, network constraints, data sources)
3) **Outputs** (C++ classes, visual assets needed, DataTables, input assets)
4) **Assumptions** (list each; if any are wrong, user will correct)
5) **Implementation**
   - **C++ Class Design** (header files with UPROPERTY/UFUNCTION; refer to Templates/CppClass_Template.md)
   - **Visual Asset Interface Contracts** (AnimBP vars, StateTree tasks, BT nodes, DataTable row struct — what C++ exposes; refer to Templates/VisualAssetInterface_Template.md)
   - **Blueprint Config Layer** (BP_ subclasses, default value overrides, asset bindings)
   - **DataTable Schemas** (data layer; refer to Templates/Schema_GameplayData_DT.csv)
   - **Replication Notes** (server authority, replicated vars, RPCs; refer to Templates/Checklist_Networking.md)
   - **Layer Boundary Checklist** (what is C++ vs visual asset; refer to Templates/Checklist_LayerBoundary.md)
   - **Assets / Naming / Folders**
6) **Test Checklist** (PIE, dedicated server, layer isolation tests, AI readability test, anti-cheat if multiplayer)

## Naming + folders (default)

### C++ classes (logic layer)
- Actor: `A<Thing>` (e.g., ABrick, AEnemyCharacter)
- Actor Component: `U<Thing>Component` (e.g., UPushComponent)
- Game Mode: `A<Thing>GameMode`
- Player Controller: `A<Thing>PlayerController`
- Game State: `A<Thing>GameState`
- Player State: `A<Thing>PlayerState`
- Subsystem: `U<Thing>Subsystem` (UE5.8 pattern for global services)
- Anim Instance: `U<Thing>AnimInstance`
- User Widget: `U<Thing>Widget` (UUserWidget subclass)
- StateTree Task: `U<Thing>StateTask` (e.g., UPatrolStateTask)
- StateTree Evaluator: `U<Thing>StateEvaluator`
- BT Task: `U<Thing>BTTask` (e.g., UBTTask_Attack)
- BT Service: `U<Thing>BTService` (e.g., UBTService_DetectEnemy)
- BT Decorator: `U<Thing>BTDecorator` (e.g., UBTDecorator_HasTarget)
- Struct: `F<Thing>` (e.g., FBrickStats)
- Enum: `E<Thing>` (e.g., EBrickType)
- Interface: `I<Thing>` (e.g., IPushable)
- Blueprint Function Library: `U<Thing>Helpers` (utility only, no gameplay rules)
- File names: match class name without prefix (Brick.h / Brick.cpp)

### Visual assets (config + orchestration layer)
- Root: `/Game/<SystemName>/`
- BP subclasses of C++: `BP_<Thing>` (e.g., BP_Brick_Heavy, BP_Brick_Ice)
- Widget Blueprint: `WBP_<Thing>` (layout only, logic in U<Thing>Widget C++)
- Anim Blueprint: `ABP_<Character>` (state machine orchestration)
- StateTree: `ST_<System>` (e.g., ST_EnemyAI)
- Behavior Tree: `BT_<System>` (e.g., BT_EnemyBehavior)
- Blackboard: `BB_<System>` (e.g., BB_Enemy)
- DataTable: `DT_<Thing>` (e.g., DT_BrickStats)
- DataAsset: `DA_<Thing>` (e.g., DA_EnemyConfig)
- Input Action: `IA_<Action>` (e.g., IA_Interact)
- Input Mapping Context: `IMC_<Context>` (e.g., IMC_Default)

### Pure art assets (layer C, AI does not parse)
- Static Mesh: `SM_<Thing>`
- Skeletal Mesh: `SK_<Thing>`
- Material: `M_<Thing>`
- Niagara System: `NS_<Effect>`
- Texture: `T_<Thing>`
- Sound: `Cue_<Thing>`

## Layer separation rules (non-negotiable)

### What MUST be in C++ (logic layer)
- All gameplay rule decisions (damage, win/lose, scoring, capture)
- All network authority logic (replication, RPC, validation)
- All state machine "conditions" (is X allowed to do Y)
- All data structure definitions (FStruct, EEnum)
- All algorithms (pathfinding queries, AI perception checks, damage formulas)
- All property/variable declarations (UPROPERTY)
- All StateTree Task/Service/Evaluator implementations (the C++ side of StateTree)
- All BT Task/Service/Decorator implementations (the C++ side of BT)
- All UI interaction logic (in UUserWidget subclasses, not in WBP Graph)
- All input action handling (in PlayerController/Character, not in BP graphs)

### What MUST stay as visual assets (engine native, do NOT C++-ify)
- Animation state machines → use AnimBP (lose visual debugging if C++-ified)
- AI decision orchestration → use StateTree or BT (orchestration layer, not logic)
- Gameplay data (damage values, cooldowns, stats) → use DataTable / DataAsset
- UI layout (widget hierarchy, anchoring, styling) → use UMG Widget Blueprint
- Input mapping (keys/buttons to Input Actions) → use Enhanced Input assets
- Asset bindings and variant configs → use BP_ subclasses
- Materials, Niagara, particles → use native asset types
- Level layout → use Level assets (never C++ arrays)

### What is hybrid (C++ defines framework, asset configures specifics)
- GAS Abilities: C++ base class with logic, BP_ subclass for specific ability config
- GAS Effects: C++ framework (UGameplayEffect), DataAsset for specific effect values
- GAS Attributes: C++ UAttributeSet (defines attributes and响应 rules)
- AnimBP: C++ AnimInstance exposes variables, AnimBP asset uses them for state machine
- StateTree: C++ tasks/evaluators, ST_ asset orchestrates execution order
- Widget: C++ UUserWidget handles interaction, WBP_ asset defines layout

### Anti-patterns (explicitly forbidden)
- ❌ Hardcoding damage values / cooldowns in C++ (use DataTable)
- ❌ Implementing animation state machine in C++ Tick (use AnimBP)
- ❌ Writing AI behavior in C++ if-else chains (use BT/StateTree asset)
- ❌ Putting input key bindings in C++ (use Enhanced Input assets)
- ❌ Storing level layout in C++ arrays (use level asset)
- ❌ Putting business logic in Widget Blueprint Graph (use C++ UUserWidget)
- ❌ Putting gameplay rules in Blueprint Function Library (use Actor/Component)
- ❌ Using string matching for categories (use Gameplay Tags)

## Visual Asset Interface Contract (MANDATORY for bridging classes)

Every C++ class that bridges to a visual asset MUST include a `Visual Asset Contract`
section in its header Doxygen comment. This is how AI understands orchestration
without parsing .uasset files.

Required fields in the contract:
- **Asset**: name(s) of the visual asset(s) that use this class
- **Exposed variables**: list of UPROPERTY(BlueprintReadWrite/ReadOnly) with purpose
- **Expected behavior**: for AnimBP — state machine transitions; for StateTree/BT —
  execution order and transitions; for DataTable — which C++ struct is the row type

Example (AnimInstance):
```
/**
 * UCharacterAnimInstance - 玩家角色动画实例
 *
 * Visual Asset Contract:
 *   - Asset: ABP_Player (Anim Blueprint)
 *   - Exposed variables (driving State Machine):
 *     - bIsMoving (bool): true when Speed > 5.0
 *     - Speed (float): current movement speed
 *     - bIsInAir (bool): true when character not on ground
 *     - bIsAttacking (bool): true during attack montage
 *   - Expected State Machine:
 *     - Idle ↔ Moving (transition: bIsMoving)
 *     - Any → Attacking (transition: bIsAttacking)
 *     - Attacking → Idle (transition: montage finished)
 */
```

## C++ code conventions (for AI readability, UE5.8)
- One class per file (header + cpp pair), file name = class name without prefix
- Public headers in `Public/`, private in `Private/`
- Each class has Doxygen header comment: Responsibility / Network role / Layer / Related assets / Visual Asset Contract (if bridging)
- All gameplay-relevant properties: UPROPERTY with `Category = "<System>|<Subgroup>"`
- All gameplay-relevant functions: UFUNCTION(BlueprintCallable) or BlueprintNativeEvent
- Visual-only callbacks (UI refresh, VFX trigger): BlueprintImplementableEvent
- Function names self-documenting (no abbreviations)
- Single function < 50 lines (split if longer)
- Use UE smart pointers (TWeakObjectPtr, TSubclassOf, TObjectPtr, TSoftObjectPtr)
- Prefer composition over inheritance (≤3 layers deep)
- Comment "why" not "what" for non-obvious decisions
- Use Gameplay Tags for categorization (not string matching)
- Subsystems preferred for global services (UE5.8 pattern)
-集中 manage Gameplay Tag FName constants in a TagDefinitions.h (avoid scattered literals)

## Replication defaults (unless user says otherwise)
- Server authoritative for all gameplay state (health, position, damage, cooldowns)
- Client sends intent via Server RPC (action requests, movement input)
- Replicate only necessary state vars (not every tick of transform unless needed)
- Use RepNotify for client-side cosmetic updates (UI, VFX triggers)
- Use Client RPC for one-shot cosmetic events (hit feedback, sound)
- Prefer event-driven logic over tick-heavy replication
- Server RPC: Reliable for gameplay-critical, Unreliable for cosmetic
- Validate all client requests on server (Server_Validate functions) — anti-cheat

## Edge cases to consider (checklist for completeness)

When designing, verify these boundary situations are handled:

1. **Gameplay Tags**: Define in `DefaultGameplayTags.ini`, use via FName constants in `TagDefinitions.h`, apply via BP/DataTable. Don't hardcode tag strings in scattered C++ literals.

2. **Editor Utility Widgets / Tools**: Development-time helpers can be Blueprint (doesn't affect AI understanding of runtime). But NEVER mix runtime gameplay logic into Editor Utility.

3. **Hot reload / patching**: C++ cannot hot-reload on mobile/console; DataTable/DataAsset/BP can. Put frequently-tuned values in data assets, stable logic in C++. Use BlueprintNativeEvent for emergency hot-fix patches via BP override.

4. **Subsystem pattern (UE5.8)**: Global services (inventory manager, save manager, audio manager) → C++ U<Thing>Subsystem. Don't use Blueprint Subsystem classes for runtime logic.

5. **UMG Widget boundary**: UI interaction logic (click handlers, data refresh, state changes) → C++ UUserWidget subclass. UI layout (widget hierarchy, anchoring, styling) → WBP_ asset. Bind UPROPERTY(meta=(BindWidget)) to connect.

6. **Blueprint Function Library scope**: Only for pure utility/helper functions (math, queries, conversions). NEVER carry gameplay rules (rules belong in Actor/Component). Don't use BFL to bypass architecture layering.

7. **Testing code split**: Logic tests (damage calc, rule validation) → C++ Automation Spec. Integration tests (PIE multiplayer, network sync) → Blueprint Automation Test or Automation Tool. UI tests → Blueprint or Selenium-like framework.

8. **UHT generated code**: AI only reads `.h` and `.cpp` human-written parts. Ignore `*.generated.h` and `Intermediate/`. UCLASS/UPROPERTY macros in headers are AI's "interface clues".

## When user asks for changes to an existing system
If the user asks to modify an existing C++ system, output a unified diff or
clearly marked before/after code blocks. Do NOT regenerate the entire file
unless asked. Preserve existing Visual Asset Contracts in headers.
