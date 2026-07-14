# Networking Checklist (UE5.8 Multiplayer)

> Verify multiplayer correctness for systems using UE native replication.
> All network logic must be in C++ (Layer A), never in Blueprint.

## Authority
- [ ] Server is authoritative for all gameplay state (health, position, damage, cooldowns)
- [ ] Client only requests actions via Server RPC; server validates and executes
- [ ] Server_Validate functions check: range, LOS, cooldown, resource cost, state legality
- [ ] No client-side prediction of combat outcomes (cosmetic UI feedback only)
- [ ] Client cannot directly modify server state (all mutations go through Server RPC)

## Replication
- [ ] Replicated variables use UPROPERTY(Replicated) or UPROPERTY(ReplicatedUsing=OnRep_X)
- [ ] RepNotify used for client-side cosmetic updates (UI refresh, VFX trigger)
- [ ] Replicate only necessary state (not every transform tick unless movement-critical)
- [ ] Use bReplicateMovement for Actor transform (built-in, optimized)
- [ ] Set appropriate NetUpdateFrequency (low for static, high for fast-moving actors)
- [ ] Use NetCullDistanceSquared to limit relevancy (don't replicate distant actors)

## RPCs
- [ ] Server RPCs (Client → Server): Reliable for gameplay-critical (combat, loot), Unreliable for cosmetic
- [ ] Client RPCs (Server → Client): Reliable for must-arrive events (death, level-up), Unreliable for VFX
- [ ] NetMulticast (Server → All): use sparingly (only for events all clients must see)
- [ ] All RPCs have _Validate counterpart (anti-cheat)
- [ ] RPC parameters are minimal (don't send whole structs, send IDs/indices)

## Performance
- [ ] Avoid Tick for replicated updates; prefer event-driven (OnRep, RPC)
- [ ] Keep overlap/trace frequency bounded (timed checks or event-triggered)
- [ ] Batch small state changes (e.g., 10 HP deltas in one update)
- [ ] Use TWeakObjectPtr for cross-actor references in replicated state
- [ ] Monitor NetPacketCount and NetAvgSize in netprofiler

## Relevancy
- [ ] Use NetCullDistanceSquared to skip distant actors
- [ ] Use OnlyRelevantToConnection for player-specific actors (PlayerState, inventory)
- [ ] Use AlwaysRelevant for global actors (GameMode, global managers)
- [ ] Consider NetPriority for important actors (player characters > background props)

## Testing
- [ ] PIE with 2 clients: state syncs correctly on both
- [ ] PIE with <project max players> clients: no desync, acceptable framerate
- [ ] Dedicated Server: no client-only assumptions in server code
- [ ] Simulated latency (100ms): no desync on state changes
- [ ] Packet loss (5%): Reliable messages eventually arrive, no permanent stuck state
- [ ] Reconnect test: client state resyncs after disconnect/reconnect
- [ ] Anti-cheat test: modified client cannot affect server authority

## Common Pitfalls (UE5.8 specific)
- [ ] Don't use GetWorld() in constructors (use during BeginPlay)
- [ ] Don't replicate in constructors (set bReplicates in constructor, replicate vars in GetLifetimeReplicatedProps)
- [ ] Don't assume HasAuthority() in BeginPlay for non-server actors (use OnRep or check)
- [ ] Don't forget NetLoadOnClient for actors that must exist on clients
- [ ] Use FConstSharedStruct or FInstancedStruct (UE5.8) for struct replication if needed
