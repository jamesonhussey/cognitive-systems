/**
 * CHARACTER SIMULATION
 * 
 * The main simulation manager that updates all characters each tick.
 * 
 * KEY CONCEPT: Intention vs State
 * - Intention: What the schedule says they SHOULD be doing (e.g., "working")
 * - State: What they're ACTUALLY doing (e.g., "commuting" if walking to work)
 * 
 * The state reflects reality, not the schedule. A character who is scheduled
 * to be "working" at 9am but is still at home will show as "commuting" until
 * they actually arrive at their desk.
 */

import { get } from 'svelte/store';
import { worldState, worldCharacters } from '../WorldState.js';
import { worldMap, LOCATIONS } from '../world/WorldMap.js';
import { assignSchedulesToAll, getScheduledActivity } from './Schedule.js';
import { getState, getEnergyDelta } from './StateMachine.js';
import { findPath, getNextStep } from './Pathfinding.js';

// ============================================
// CONFIGURATION - Easy to adjust!
// ============================================

/**
 * Number of tiles a character moves per visual tick
 * With 4 visual ticks per game minute, this means:
 *   1 = 4 tiles/game minute (~10 min to cross office)
 *   2 = 8 tiles/game minute (~5 min to cross office)
 * 
 * Keep at 1 for smooth movement (1 tile per 250ms at 1x speed)
 */
const TILES_PER_TICK = 1;

// ============================================
// HELPER: Check if character is at correct location for a state
// ============================================

/**
 * States that require being at the office
 */
const OFFICE_STATES = ['working', 'break'];

/**
 * States that require being at home
 */
const HOME_STATES = ['sleeping', 'waking_up', 'morning_routine', 'leisure', 'eating'];

/**
 * Check if character is at the right location for their intended state
 */
function isAtCorrectLocation(character, intention) {
  const currentLocation = worldMap.getCharacterLocation(character.id);
  
  if (OFFICE_STATES.includes(intention)) {
    // Need to be at office
    return currentLocation !== LOCATIONS.NEIGHBORHOOD;
  }
  
  if (HOME_STATES.includes(intention)) {
    // Need to be at home (neighborhood)
    return currentLocation === LOCATIONS.NEIGHBORHOOD;
  }
  
  // Commuting and other states can happen anywhere
  return true;
}

/**
 * Check if character has arrived at their destination within the location
 */
function hasArrivedAtDestination(character) {
  const sim = character.sim;
  
  // Not moving means we're where we need to be
  if (!sim.isMoving && sim.targetX === null && sim.targetY === null) {
    return true;
  }
  
  return false;
}

// ============================================
// CHARACTER SIMULATION MANAGER
// ============================================

class CharacterSimulationManager {
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Initialize the simulation manager
   */
  initialize() {
    const characters = get(worldCharacters);
    
    // Assign schedules to all characters (batch assignment ensures security coverage)
    assignSchedulesToAll(characters);
    
    // Initialize intentions
    for (const character of characters) {
      character.sim.intention = character.sim.state || 'sleeping';
    }
    
    this.initialized = true;
    console.log('[CharacterSimulation] Initialized');
  }
  
  /**
   * Process one tick for all characters
   * Called by the main simulation loop
   * 
   * @param {object} timestamp - Current game time
   * @param {boolean} isTimeTick - True if game time just advanced (for schedule updates)
   */
  tick(timestamp, isTimeTick = true) {
    if (!this.initialized) return;
    
    const characters = get(worldCharacters);
    const { hour, minute } = timestamp;
    
    for (const character of characters) {
      this.updateCharacter(character, hour, minute, isTimeTick);
    }
    
    // Trigger reactivity
    worldState.characters.update(chars => chars);
    worldState.updateStats();
  }
  
  /**
   * Update a single character
   * 
   * @param {object} character - The character to update
   * @param {number} hour - Current game hour
   * @param {number} minute - Current game minute
   * @param {boolean} isTimeTick - True if game time just advanced (for schedule updates)
   */
  updateCharacter(character, hour, minute, isTimeTick = true) {
    const sim = character.sim;
    
    // Only update schedule/intentions when game time advances
    if (isTimeTick) {
      // 1. Get scheduled intention (what they SHOULD be doing)
      const scheduled = getScheduledActivity(sim.schedule, hour, minute);
      const newIntention = scheduled.state;
      
      // 2. Update intention if schedule changed
      if (sim.intention !== newIntention) {
        sim.intention = newIntention;
        // New intention means we need to move to the right place
        this.startMovingToIntention(character, newIntention);
      }
      
      // 3. Determine actual state based on location and movement
      this.updateActualState(character);
      
      // 4. Update needs based on actual state
      this.updateNeeds(character);
    }
    
    // Movement happens every visual tick for smooth animation
    if (sim.isMoving) {
      this.processMovement(character);
      
      // Update state after movement (in case we arrived somewhere)
      if (!isTimeTick) {
        this.updateActualState(character);
      }
    }
  }
  
  /**
   * Start moving character toward where they need to be for their intention
   */
  startMovingToIntention(character, intention) {
    const sim = character.sim;
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    // Determine destination based on intention
    if (OFFICE_STATES.includes(intention)) {
      // Need to go to office
      if (currentLocation === LOCATIONS.NEIGHBORHOOD) {
        // At home, need to go to work
        const desk = worldMap.getCharacterDesk(character.id);
        if (desk) {
          sim.targetFloor = desk.locationId;
          sim.targetX = desk.x;
          sim.targetY = desk.y;
          sim.isMoving = true;
        }
      } else if (intention === 'working') {
        // Already at office, go to desk
        const desk = worldMap.getCharacterDesk(character.id);
        if (desk) {
          if (currentLocation !== desk.locationId) {
            sim.targetFloor = desk.locationId;
          }
          sim.targetX = desk.x;
          sim.targetY = desk.y;
          sim.isMoving = true;
        }
      } else if (intention === 'break') {
        // Go to break room
        this.goToBreakRoom(character);
      }
    } else if (HOME_STATES.includes(intention)) {
      // Need to go home
      if (currentLocation !== LOCATIONS.NEIGHBORHOOD) {
        // At office, need to go home
        const home = worldMap.getCharacterHome(character.id);
        if (home) {
          sim.targetFloor = LOCATIONS.NEIGHBORHOOD;
          sim.targetX = home.bedPosition.x;
          sim.targetY = home.bedPosition.y;
          sim.isMoving = true;
        }
      } else {
        // Already at home
        const home = worldMap.getCharacterHome(character.id);
        if (home) {
          // If not at bed, go to bed (for sleeping)
          if (intention === 'sleeping' || intention === 'waking_up') {
            if (sim.x !== home.bedPosition.x || sim.y !== home.bedPosition.y) {
              sim.targetX = home.bedPosition.x;
              sim.targetY = home.bedPosition.y;
              sim.isMoving = true;
            }
          }
          // For other home states, they can be anywhere in the house
        }
      }
    }
    // 'commuting' intention is handled automatically by movement
  }
  
  /**
   * Update the character's actual state based on their location and movement
   */
  updateActualState(character) {
    const sim = character.sim;
    const intention = sim.intention;
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    // If moving between locations, state is commuting
    if (sim.targetFloor && sim.targetFloor !== currentLocation) {
      this.setCharacterState(character, 'commuting', this.getCommutingAction(character, intention));
      return;
    }
    
    // If moving within a location, state depends on intention
    if (sim.isMoving) {
      if (OFFICE_STATES.includes(intention)) {
        // Walking to desk or break room
        if (intention === 'working') {
          this.setCharacterState(character, 'walking', 'Walking to desk');
        } else if (intention === 'break') {
          this.setCharacterState(character, 'walking', 'Walking to break room');
        }
      } else if (HOME_STATES.includes(intention)) {
        // Walking within home
        if (intention === 'sleeping') {
          this.setCharacterState(character, 'walking', 'Going to bed');
        } else {
          this.setCharacterState(character, 'walking', 'Moving around house');
        }
      } else {
        this.setCharacterState(character, 'walking', 'Walking');
      }
      return;
    }
    
    // Not moving - state matches intention if at correct location
    if (isAtCorrectLocation(character, intention)) {
      // At correct location and not moving - actually doing the activity
      const actionText = this.getActivityAction(character, intention);
      this.setCharacterState(character, intention, actionText);
    } else {
      // Wrong location but not moving - need to start moving
      this.startMovingToIntention(character, intention);
    }
  }
  
  /**
   * Set character state and action (with change tracking)
   */
  setCharacterState(character, newState, action) {
    const sim = character.sim;
    
    if (sim.state !== newState) {
      sim.previousState = sim.state;
      sim.state = newState;
    }
    
    sim.currentAction = action;
  }
  
  /**
   * Get action text for commuting
   */
  getCommutingAction(character, intention) {
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    if (OFFICE_STATES.includes(intention)) {
      return 'Walking to work';
    } else if (HOME_STATES.includes(intention)) {
      if (currentLocation === LOCATIONS.NEIGHBORHOOD) {
        return 'Walking home';
      }
      return 'Heading home';
    }
    return 'Commuting';
  }
  
  /**
   * Get action text for actually doing an activity
   */
  getActivityAction(character, state) {
    const stateInfo = getState(state);
    
    switch (state) {
      case 'sleeping':
        return 'Sleeping';
      case 'waking_up':
        return 'Waking up';
      case 'morning_routine':
        return 'Getting ready';
      case 'working':
        return 'Working at desk';
      case 'break':
        return 'On break';
      case 'leisure':
        return 'Relaxing';
      case 'eating':
        return 'Eating';
      default:
        return stateInfo.name;
    }
  }
  
  /**
   * Update character needs
   */
  updateNeeds(character) {
    const sim = character.sim;
    const energyDelta = getEnergyDelta(sim.state);
    
    // Update energy
    sim.needs.energy = Math.max(0, Math.min(100, sim.needs.energy + energyDelta));
    
    // Social need increases slowly over time
    if (sim.state !== 'chatting') {
      sim.needs.social = Math.max(0, Math.min(100, sim.needs.social + 0.1));
    }
    
    // Stress based on state and energy
    if (sim.state === 'working') {
      sim.needs.stress = Math.min(100, sim.needs.stress + 0.2);
    } else if (sim.state === 'sleeping' || sim.state === 'leisure') {
      sim.needs.stress = Math.max(0, sim.needs.stress - 0.3);
    }
  }
  
  /**
   * Go to break room
   */
  goToBreakRoom(character) {
    const sim = character.sim;
    const currentLocation = worldMap.getCharacterLocation(character.id);
    const floor = worldMap.getFloor(currentLocation);
    
    if (floor) {
      const breakRooms = floor.getRoomsByType('break_room');
      if (breakRooms.length > 0) {
        const room = breakRooms[0];
        const center = room.getCenter();
        sim.targetX = center.x;
        sim.targetY = center.y;
        sim.isMoving = true;
      }
    }
  }
  
  /**
   * Get the work floor for a character
   */
  getWorkFloor(character) {
    const desk = worldMap.getCharacterDesk(character.id);
    return desk ? desk.locationId : LOCATIONS.FLOOR_2;
  }
  
  /**
   * Process character movement using A* pathfinding
   */
  processMovement(character) {
    const sim = character.sim;
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    // Handle floor changes first (via elevator or walking)
    if (sim.targetFloor && sim.targetFloor !== currentLocation) {
      const currentFloor = worldMap.getFloor(currentLocation);
      const targetFloor = worldMap.getFloor(sim.targetFloor);
      
      // Special case: Going to neighborhood from office
      if (sim.targetFloor === LOCATIONS.NEIGHBORHOOD && currentLocation !== LOCATIONS.NEIGHBORHOOD) {
        // Walk to elevator first
        if (currentFloor && currentFloor.elevatorPositions.length > 0) {
          const elevator = currentFloor.getNearestElevator(sim.x, sim.y);
          
          // Check if we're at the elevator
          if (sim.x === elevator.x && sim.y === elevator.y) {
            // Spawn at the street entrance (office_entrance spawn point)
            const spawnPoint = targetFloor?.getSpawnPoint('office_entrance');
            const spawnX = spawnPoint?.x ?? 40;
            const spawnY = spawnPoint?.y ?? 58;
            
            worldMap.moveCharacterToLocation(character.id, sim.targetFloor, spawnX, spawnY);
            sim.x = spawnX;
            sim.y = spawnY;
            sim.floor = sim.targetFloor;
            sim.targetFloor = null;
            sim.path = []; // Will recalculate path to home
          } else {
            // Path to elevator
            if (!sim.path || sim.path.length === 0) {
              sim.path = findPath(currentFloor, sim.x, sim.y, elevator.x, elevator.y);
            }
          }
        } else {
          // No elevator, just spawn at street entrance
          const spawnPoint = targetFloor?.getSpawnPoint('office_entrance');
          const spawnX = spawnPoint?.x ?? 40;
          const spawnY = spawnPoint?.y ?? 58;
          
          worldMap.moveCharacterToLocation(character.id, sim.targetFloor, spawnX, spawnY);
          sim.x = spawnX;
          sim.y = spawnY;
          sim.floor = sim.targetFloor;
          sim.targetFloor = null;
          sim.path = [];
        }
      }
      // Special case: Going from neighborhood to office
      else if (currentLocation === LOCATIONS.NEIGHBORHOOD && sim.targetFloor !== LOCATIONS.NEIGHBORHOOD) {
        // Walk to street entrance first
        const spawnPoint = currentFloor?.getSpawnPoint('office_entrance');
        const exitX = spawnPoint?.x ?? 40;
        const exitY = spawnPoint?.y ?? 58;
        
        // Check if we're at the exit point
        if (Math.abs(sim.x - exitX) <= 1 && Math.abs(sim.y - exitY) <= 1) {
          // Teleport to office elevator
          if (targetFloor && targetFloor.elevatorPositions.length > 0) {
            const elevator = targetFloor.elevatorPositions[0];
            worldMap.moveCharacterToLocation(character.id, sim.targetFloor, elevator.x, elevator.y);
            sim.x = elevator.x;
            sim.y = elevator.y;
            sim.floor = sim.targetFloor;
            sim.targetFloor = null;
            sim.path = []; // Will recalculate path to desk
          }
        } else {
          // Path to exit point
          if (!sim.path || sim.path.length === 0) {
            sim.path = findPath(currentFloor, sim.x, sim.y, exitX, exitY);
          }
        }
      }
      // Normal office floor-to-floor transition (via elevator)
      else if (currentFloor && currentFloor.elevatorPositions.length > 0) {
        const elevator = currentFloor.getNearestElevator(sim.x, sim.y);
        
        // Check if we're at the elevator
        if (sim.x === elevator.x && sim.y === elevator.y) {
          // Teleport to target floor's elevator
          let targetX = sim.targetX || 0;
          let targetY = sim.targetY || 0;
          
          if (targetFloor && targetFloor.elevatorPositions.length > 0) {
            const targetElevator = targetFloor.elevatorPositions[0];
            if (sim.targetX === null) targetX = targetElevator.x;
            if (sim.targetY === null) targetY = targetElevator.y;
          }
          
          worldMap.moveCharacterToLocation(character.id, sim.targetFloor, targetX, targetY);
          sim.x = targetX;
          sim.y = targetY;
          sim.floor = sim.targetFloor;
          sim.targetFloor = null;
          sim.path = [];
        } else {
          // Path to elevator
          if (!sim.path || sim.path.length === 0) {
            sim.path = findPath(currentFloor, sim.x, sim.y, elevator.x, elevator.y);
          }
        }
      } else {
        // No elevator on current floor, just teleport
        worldMap.moveCharacterToLocation(character.id, sim.targetFloor, sim.targetX || 0, sim.targetY || 0);
        sim.x = sim.targetX || 0;
        sim.y = sim.targetY || 0;
        sim.floor = sim.targetFloor;
        sim.targetFloor = null;
        sim.path = [];
      }
    }
    
    // Handle position movement with pathfinding
    const floor = worldMap.getFloor(worldMap.getCharacterLocation(character.id));
    if (!floor) {
      sim.isMoving = false;
      return;
    }
    
    // Generate path if needed
    if (sim.targetX !== null && sim.targetY !== null && (!sim.path || sim.path.length === 0)) {
      // Check if we're already at destination
      if (sim.x === sim.targetX && sim.y === sim.targetY) {
        sim.isMoving = false;
        sim.targetX = null;
        sim.targetY = null;
        return;
      }
      
      sim.path = findPath(floor, sim.x, sim.y, sim.targetX, sim.targetY);
      
      // If no path found, try simple movement
      if (sim.path.length === 0) {
        const nextStep = getNextStep(floor, sim.x, sim.y, sim.targetX, sim.targetY);
        if (nextStep) {
          sim.path = [nextStep];
        } else {
          // Can't reach destination - clear and stop
          sim.isMoving = false;
          sim.targetX = null;
          sim.targetY = null;
          return;
        }
      }
    }
    
    // Move along path - move multiple tiles per tick based on TILES_PER_TICK
    if (sim.path && sim.path.length > 0) {
      let stepsTaken = 0;
      
      while (stepsTaken < TILES_PER_TICK && sim.path.length > 0) {
        const nextPos = sim.path[0];
        
        // Check if position is still walkable
        if (floor.isWalkable(nextPos.x, nextPos.y)) {
          floor.placeCharacter(character.id, nextPos.x, nextPos.y);
          sim.x = nextPos.x;
          sim.y = nextPos.y;
          sim.path.shift(); // Remove the step we just took
          stepsTaken++;
        } else {
          // Path blocked, recalculate and break to try next tick
          sim.path = findPath(floor, sim.x, sim.y, sim.targetX, sim.targetY);
          break;
        }
      }
      
      // Check if we've arrived
      if (sim.x === sim.targetX && sim.y === sim.targetY) {
        sim.isMoving = false;
        sim.targetX = null;
        sim.targetY = null;
        sim.path = [];
      }
    } else if (sim.targetX === null && sim.targetY === null) {
      sim.isMoving = false;
    }
  }
}

// Singleton instance
export const characterSimulation = new CharacterSimulationManager();

export default characterSimulation;
