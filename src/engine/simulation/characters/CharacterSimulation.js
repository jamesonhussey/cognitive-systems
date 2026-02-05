/**
 * CHARACTER SIMULATION
 * 
 * The main simulation manager that updates all characters each tick.
 * Responsibilities:
 * - Update character states based on schedules
 * - Process movement
 * - Handle needs (energy, social, stress)
 * - Trigger state transitions
 */

import { get } from 'svelte/store';
import { worldState, worldCharacters } from '../WorldState.js';
import { worldMap, LOCATIONS } from '../world/WorldMap.js';
import { getScheduleForCharacter, getScheduledActivity } from './Schedule.js';
import { getState, getEnergyDelta, stateAllowsMovement, getStateLocation } from './StateMachine.js';
import { findPath, getNextStep } from './Pathfinding.js';

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
    
    // Assign schedules to all characters
    for (const character of characters) {
      character.sim.schedule = getScheduleForCharacter(character);
    }
    
    this.initialized = true;
    console.log('[CharacterSimulation] Initialized');
  }
  
  /**
   * Process one tick for all characters
   * Called by the main simulation loop
   */
  tick(timestamp) {
    if (!this.initialized) return;
    
    const characters = get(worldCharacters);
    const { hour, minute } = timestamp;
    
    for (const character of characters) {
      this.updateCharacter(character, hour, minute);
    }
    
    // Trigger reactivity
    worldState.characters.update(chars => chars);
    worldState.updateStats();
  }
  
  /**
   * Update a single character
   */
  updateCharacter(character, hour, minute) {
    const sim = character.sim;
    
    // 1. Check schedule for what we should be doing
    const scheduled = getScheduledActivity(sim.schedule, hour, minute);
    
    // 2. Handle state transitions
    if (sim.state !== scheduled.state) {
      this.transitionToState(character, scheduled.state, scheduled.action);
    }
    
    // 3. Process current state
    this.processState(character);
    
    // 4. Process movement if needed
    if (sim.isMoving) {
      this.processMovement(character);
    }
    
    // 5. Update needs
    this.updateNeeds(character);
  }
  
  /**
   * Transition character to a new state
   */
  transitionToState(character, newState, action) {
    const sim = character.sim;
    const oldState = sim.state;
    
    // Store previous state
    sim.previousState = oldState;
    sim.state = newState;
    sim.currentAction = action || getState(newState).name;
    
    // Handle state-specific entry logic
    switch (newState) {
      case 'commuting':
        this.startCommute(character);
        break;
        
      case 'working':
        this.goToDesk(character);
        break;
        
      case 'break':
        this.goToBreakRoom(character);
        break;
        
      case 'sleeping':
      case 'waking_up':
      case 'morning_routine':
      case 'leisure':
      case 'eating':
        this.goHome(character);
        break;
    }
  }
  
  /**
   * Process current state tick
   */
  processState(character) {
    const sim = character.sim;
    const state = getState(sim.state);
    
    // Nothing specific to do for most states
    // (Movement and needs are handled separately)
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
   * Start commuting to/from work
   */
  startCommute(character) {
    const sim = character.sim;
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    // Determine destination
    if (currentLocation === LOCATIONS.NEIGHBORHOOD) {
      // Going to work
      sim.targetFloor = this.getWorkFloor(character);
      sim.currentAction = 'Walking to work';
    } else {
      // Going home
      sim.targetFloor = LOCATIONS.NEIGHBORHOOD;
      sim.currentAction = 'Walking home';
    }
    
    sim.isMoving = true;
  }
  
  /**
   * Go to desk
   */
  goToDesk(character) {
    const sim = character.sim;
    const desk = worldMap.getCharacterDesk(character.id);
    
    if (desk) {
      const currentLocation = worldMap.getCharacterLocation(character.id);
      
      if (currentLocation !== desk.locationId) {
        // Need to change floors first
        sim.targetFloor = desk.locationId;
        sim.isMoving = true;
      }
      
      sim.targetX = desk.x;
      sim.targetY = desk.y;
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
   * Go home
   */
  goHome(character) {
    const sim = character.sim;
    const home = worldMap.getCharacterHome(character.id);
    const currentLocation = worldMap.getCharacterLocation(character.id);
    
    if (home && currentLocation !== LOCATIONS.NEIGHBORHOOD) {
      sim.targetFloor = LOCATIONS.NEIGHBORHOOD;
      sim.targetX = home.bedPosition.x;
      sim.targetY = home.bedPosition.y;
      sim.isMoving = true;
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
            sim.targetFloor = null;
            sim.path = []; // Will recalculate path to home
            
            // Keep targetX/Y pointing to home so we'll walk there
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
          // Can't reach destination
          sim.isMoving = false;
          sim.targetX = null;
          sim.targetY = null;
          return;
        }
      }
    }
    
    // Move along path
    if (sim.path && sim.path.length > 0) {
      const nextPos = sim.path[0];
      
      // Check if position is still walkable
      if (floor.isWalkable(nextPos.x, nextPos.y)) {
        floor.placeCharacter(character.id, nextPos.x, nextPos.y);
        sim.x = nextPos.x;
        sim.y = nextPos.y;
        sim.path.shift(); // Remove the step we just took
      } else {
        // Path blocked, recalculate
        sim.path = findPath(floor, sim.x, sim.y, sim.targetX, sim.targetY);
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
