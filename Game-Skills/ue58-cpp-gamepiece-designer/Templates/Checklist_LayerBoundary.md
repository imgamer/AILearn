# Layer Boundary Checklist

> Verify each system design respects the C++ / visual asset / hybrid boundary.
> Check all boxes that apply. Unchecked boxes indicate layer violations to fix.

## C++ Layer (logic) — verify these are in C++
- [ ] All damage calculations (formulas, multipliers, crit) in C++ methods
- [ ] All win/lose/scoring rules in C++ (GameMode or Subsystem)
- [ ] All network authority checks (HasAuthority, IsServer) in C++
- [ ] All replicated variable declarations (UPROPERTY(Replicated)) in C++
- [ ] All RPC function implementations (Server_*, Client_*) in C++
- [ ] All AI perception/detection algorithms in C++ (Tasks/Services)
- [ ] All state machine "should transition" conditions in C++
- [ ] All data structure definitions (FStruct, EEnum) in C++ headers
- [ ] All StateTree Task/Evaluator implementations in C++
- [ ] All BT Task/Service/Decorator implementations in C++
- [ ] All UI interaction logic in C++ UUserWidget subclass
- [ ] All input action handling in C++ PlayerController/Character
- [ ] All Inventory/inventory-like state mutations in C++ Component/Subsystem

## Visual Asset Layer — verify these are NOT in C++
- [ ] Animation state machines use AnimBP asset (not C++ Tick if-else)
- [ ] AI orchestration uses StateTree or BT asset (not C++ switch chains)
- [ ] Gameplay numbers (damage, cooldown, cost) in DataTable or DataAsset
- [ ] UI layout in UMG Widget Blueprint (not C++ Slate code)
- [ ] Input key bindings in Enhanced Input assets (not hardcoded keys in C++)
- [ ] Asset bindings (mesh, material, vfx) in BP_ subclass defaults
- [ ] Materials in Material assets
- [ ] Particle effects in Niagara assets
- [ ] Level layout in Level assets (not C++ arrays)

## Hybrid Layer — verify correct split
- [ ] GAS: C++ base Ability class + BP_ subclass for specific config
- [ ] GAS: UAttributeSet in C++ + GE_ DataAssets for effect values
- [ ] AnimBP: C++ AnimInstance exposes variables + AnimBP asset uses them
- [ ] StateTree: C++ tasks + ST_ asset orchestrates execution order
- [ ] Widget: C++ UUserWidget handles interaction + WBP_ asset defines layout

## Anti-pattern Check — verify NONE present
- [ ] No hardcoded damage values in C++ (move to DataTable)
- [ ] No animation state machine logic in C++ Tick (move to AnimBP)
- [ ] No AI behavior in C++ if-else chains (move to BT/StateTree)
- [ ] No input key codes in C++ (move to Enhanced Input)
- [ ] No level layout in C++ arrays (move to level asset)
- [ ] No business logic in Widget Blueprint Graph (move to C++ UUserWidget)
- [ ] No gameplay rules in Blueprint Function Library (move to Actor/Component)
- [ ] No string matching for categories (use Gameplay Tags)
- [ ] No runtime gameplay logic in Editor Utility (separate dev tools from runtime)

## Visual Asset Contract Check — verify MANDATORY contracts exist
- [ ] AnimInstance classes have "Visual Asset Contract" Doxygen section
- [ ] StateTreeTask classes have "Visual Asset Contract" Doxygen section
- [ ] BTTask/Service/Decorator classes have "Visual Asset Contract" section
- [ ] UUserWidget subclasses have "Visual Asset Contract" section (list bound widgets)
- [ ] DataTable row structs mention the DT_ asset name in comments

## AI Readability Check — verify AI can understand system from C++ alone
- [ ] Reading all .h files gives complete picture of class responsibilities
- [ ] Reading all .h files reveals all state machine transitions (via contracts)
- [ ] Reading all .h files reveals all data structures (FStruct/EEnum)
- [ ] Reading all .h files reveals all network behavior (replicated vars, RPCs)
- [ ] No need to parse .uasset files to understand gameplay logic
- [ ] Doxygen comments explain "why" for non-obvious decisions

## Edge Case Boundary Check
- [ ] Gameplay Tags: defined in DefaultGameplayTags.ini, used via FName constants
- [ ] Subsystems: global services are U<Thing>Subsystem (not BP Subsystem)
- [ ] Hot reload: frequently-tuned values in data assets, not C++
- [ ] BFL: only utility functions, no gameplay rules
- [ ] Testing: logic in C++ Automation Spec, integration in Blueprint Automation
