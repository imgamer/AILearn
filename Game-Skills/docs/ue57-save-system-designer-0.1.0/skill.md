# UE5.7 Multiplayer Save System Designer
这是分析 ue57-gamepiece-designer skill，参考生成的 save system skill 设计

## What this skill does
When the user requests a save/load system for Unreal Engine 5.7, especially for multiplayer games, provide a complete, implementation-ready design including:
- Save game architecture (single-player vs multiplayer considerations)
- Data serialization strategy (SaveGame objects, JSON, binary)
- Multiplayer synchronization approach (host-authoritative, distributed)
- Steam/EOS integration notes (if applicable)
- Async I/O and performance optimization
- Migration/versioning strategy for save data

## Non-negotiable rules (Safety)
- Do NOT execute any terminal commands or file operations
- Do NOT provide executable scripts or batch files
- Do NOT modify project files directly
- Provide ONLY text-based specifications the user can manually implement
- Include warnings about data loss risks and backup recommendations

## Output format (always)

### 1. **System Overview**
   - Single-player vs Multiplayer architecture decision
   - Save data types (player progress, world state, settings)
   - Platform considerations (PC, Console, Mobile)

### 2. **Data Architecture**
   - USaveGame subclass structure
   - Data structure hierarchy (nested structs, arrays, maps)
   - Serialization method selection
   - Data versioning strategy

### 3. **Implementation Details**
   - **Single-Player Flow**
     - Save creation and loading
     - Auto-save strategy
     - Slot management
   
   - **Multiplayer Flow** (if applicable)
     - Host-authoritative save/load
     - Client data synchronization
     - Mid-game join/leave handling
     - World state replication

### 4. **Blueprint Recipe**
   - Step-by-step node chains
   - Function organization (SaveGame, LoadGame, DeleteSave)
   - Event dispatchers for completion/failure

### 5. **C++ Implementation** (optional)
   - Header declarations
   - Key function implementations
   - Async I/O using AsyncTask

### 6. **Assets & Naming**
   - Folder structure
   - Asset naming convention
   - DataTable structures (if applicable)

### 7. **Testing Checklist**
   - Functional tests (save/load cycle)
   - Edge cases (corrupted save, disk full)
   - Multiplayer tests (host migration, desync)
   - Platform-specific tests

### 8. **Migration & Versioning**
   - Save data version numbering
   - Backward compatibility strategy
   - Save data upgrade paths

## Save System Naming Conventions

### SaveGame Classes
- Base save: `USaveGame` (engine)
- Project base: `U[ProjectPrefix]SaveGameBase`
- Specific saves: `U[Type]SaveGame` (e.g., `UPlayerProgressSaveGame`)

### Save Slots
- Auto-save: `AutoSave_[SlotIndex]`
- Manual save: `Manual_[PlayerName]_[Timestamp]`
- Checkpoint: `Checkpoint_[LevelName]_[Index]`

### Folder Structure
```
/Game/SaveSystem/
├── Blueprints/
│   ├── BPI_SaveLoadable.uasset
│   ├── BP_SaveGameManager.uasset
│   └── BP_Checkpoint.uasset
├── Data/
│   ├── DT_SaveMetadata.uasset
│   └── ST_SaveGameData.uasset
└── SaveGames/
    └── (runtime created .sav files)
```

## Multiplayer Save Considerations

### Host-Authoritative Model
```
[Client] Request Save
    ↓ RPC
[Server] Validate & Generate Save Data
    ↓ Save to Disk
[Server] Broadcast Save Success
    ↓ RPC
[Clients] Update UI
```

### Distributed Model (Co-op)
- Each client saves their own player data
- Host saves world state separately
- On load, merge player data with world state

### Critical Multiplayer Rules
1. **Never trust client save data** - always validate on server
2. **Save world state separately from player data** - allows mid-game join
3. **Handle host migration** - designate new host, transfer save authority
4. **Consider async I/O** - don't block game thread during save

## Common Save Data Structures

### Player Progress
```cpp
USTRUCT()
struct FPlayerProgressData {
    GENERATED_BODY()
    
    UPROPERTY() FString PlayerID;
    UPROPERTY() int32 PlayerLevel;
    UPROPERTY() float TotalPlayTime;
    UPROPERTY() TArray<FString> UnlockedLevels;
    UPROPERTY() TMap<FName, int32> InventoryItems;
    UPROPERTY() FDateTime LastSaveTime;
};
```

### World State
```cpp
USTRUCT()
struct FWorldStateData {
    GENERATED_BODY()
    
    UPROPERTY() FString LevelName;
    UPROPERTY() FTransform PlayerTransform;
    UPROPERTY() TArray<FObjectStateData> ObjectStates;
    UPROPERTY() TArray<FAIStateData> AIStates;
    UPROPERTY() int64 RandomSeed; // For deterministic replay
};
```

## Performance Guidelines

### Async Save/Load
```cpp
// Use AsyncTask for non-blocking I/O
AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this, SaveData]() {
    UGameplayStatics::SaveGameToSlot(SaveData, SlotName, UserIndex);
    
    AsyncTask(ENamedThreads::GameThread, [this]() {
        OnSaveComplete.Broadcast(true);
    });
});
```

### Save Data Size Optimization
- Use `UPROPERTY(SaveGame)` only on necessary fields
- Compress large arrays (use run-length encoding for sparse data)
- Consider using binary serialization for complex data
- Implement dirty flag - only save changed data

### Memory Management
- Clear save game objects after loading to free memory
- Use object pooling for frequent save operations
- Monitor save file sizes - warn if exceeding 10MB
