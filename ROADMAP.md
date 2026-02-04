# Verity Systems - Development Roadmap

## Phase 1: Character Generation System ✓
- [x] Define character schema (traits, personality, job role, relationships)
- [x] Define extensible file system schema (data-driven, supports new file types)
- [x] Core file categories: identity, memories, relationships, behavioral, system
- [x] Priorities file (behavioral) - ordered list driving character actions
- [x] Build procedural name generator
- [x] Build trait/personality generator
- [x] Build relationship generator (connections between coworkers)
- [x] Build memory/backstory generator
- [x] Build priorities generator (based on traits, relationships)
- [x] Generate complete file system from character data
- [x] Define fixed roles (Supervisor, HR, Player) with procedural details

### Phase 1.5: Generation Improvements ✓
- [x] Add Company Disposition system (True Believer → Suspicious spectrum)
- [x] Expand self-image variety (trait-linked, disposition-affected)
- [x] Add personal/life memories (childhood, family, life events)
- [x] Add trait-linked memory templates (paranoid → betrayal, etc.)
- [x] Implement Phantom Characters (for backstory references)
- [x] Remove contradictory memory types (colleague gone → uses phantom now)
- [x] Disposition affects mood/stress baselines
- [x] Relationship Events system (paired relationships with reciprocity)
- [x] Configurable reciprocity rates per relationship type
- [x] Coordinated trust levels for mutual relationships
- [x] Paired memory generation for significant relationships
- [x] One-sided relationships (unrequited love, one-way friendships, grudges)

## Phase 2: Simulation Core
- [ ] Create simulation tick system (real-time, configurable speed)
- [ ] Define office layout (3-4 floors + living quarters, rooms, pathfinding grid)
- [ ] Character state machine (Working, Break, Chatting, Sleeping, Anxious, etc.)
- [ ] Basic movement/pathfinding between locations
- [ ] Mood system (affected by traits, events, relationships)
- [ ] Need system (social, rest/fatigue, productivity pressure)
- [ ] Sleep cycle system (schedules, fatigue, dormitory use)
- [ ] Priority-driven behavior (characters act on highest priority when possible)
- [ ] Character-to-character interactions
- [ ] Relationship changes from interactions

## Phase 3: Office View App
- [ ] ASCII renderer for office floors
- [ ] Floor switching (navigation between floors)
- [ ] Character symbols with movement animation
- [ ] Click-to-inspect character details
- [ ] Character status panel (mood, activity, thoughts)
- [ ] Real-time updates synced with simulation

## Phase 4: Edit System
- [ ] Structured file format (editable fields, locked fields)
- [ ] `edit` command with interactive menu
- [ ] Field options per file type (relationships, beliefs, etc.)
- [ ] Template-based note/content regeneration
- [ ] Modification logging to system files
- [ ] Changes propagate to simulation (mood, behavior shifts)

## Phase 5: Task Systems
- [ ] Job Board app (external cases)
- [ ] Case objectives and completion detection
- [ ] Internal ticket system (workers submit requests)
- [ ] Random event triggers (relationship conflicts, trauma, etc.)
- [ ] Task rewards (currency)

## Phase 6: Feedback Systems
- [ ] Email responses from completed cases
- [ ] Behavioral changes visible in office simulation
- [ ] News feed app (for external/global cases)
- [ ] Statistics dashboard (internal metrics)

## Phase 7: Economy & Progression
- [ ] Store app (command upgrades, cosmetics)
- [ ] Clearance levels (gates access to workers, features)
- [ ] Dual currency (work credits, cosmetic tokens)

## Phase 8: Executive Layer (Later)
- [ ] Executive characters (not in office, send directives)
- [ ] Global metrics (Political Stability, Dissent, etc.)
- [ ] High-stakes cases affecting world state
- [ ] Threshold events (revolution, crackdowns, etc.)
- [ ] Multiple ending conditions

## Phase 9: External World (Later)
- [ ] External relationships (family, friends outside work)
- [ ] Phantom character expansion (ex-employees, family members)
- [ ] External character file systems (for tasks involving non-employees)
- [ ] Romantic history / personal life depth

---

## Current Priority Order
1. Phase 1 → Phase 2 → Phase 3 (get the simulation visible)
2. Phase 4 (make edits work)
3. Phase 5 → Phase 6 (gameplay loop complete)
4. Phase 7 → Phase 8 (polish and depth)

## Technical Notes
- Simulation runs continuously while game is open
- All characters have full file systems (procedurally generated)
- Fixed roles, procedural identities
- Small office: ~5-8 workers per floor, 3-4 floors + living quarters
- No pausing (initially)
- File system schema is data-driven (easy to add new file types later)
- Priorities file directly influences character behavior in simulation
- Dormitory/living quarters attached to office for sleep cycles
