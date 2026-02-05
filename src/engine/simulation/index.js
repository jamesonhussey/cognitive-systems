/**
 * SIMULATION ENGINE
 * 
 * Main entry point for the simulation system.
 * 
 * Usage:
 *   import { simulation, worldState, worldMap } from './engine/simulation';
 *   
 *   // Initialize the world
 *   const characters = worldState.initialize();
 *   worldMap.initialize(characters);
 *   
 *   // Start the simulation
 *   simulation.start();
 *   
 *   // Subscribe to time updates
 *   simulationTime.subscribe(time => console.log(time.timeString));
 */

// Core simulation loop
export { 
  simulation,
  simulationSpeed,
  simulationPaused,
  simulationTime,
  simulationTimeDisplay,
  simulationTickCount,
  SPEED_OPTIONS,
  BASE_TICK_MS
} from './SimulationLoop.js';

// Time management
export { TimeManager } from './TimeManager.js';

// World state
export {
  worldState,
  worldCharacters,
  worldLocations,
  worldInitialized,
  worldStats
} from './WorldState.js';

// World map and locations
export {
  worldMap,
  LOCATIONS,
  LOCATION_NAMES,
  TILE_TYPES,
  ROOM_TYPES,
  Floor
} from './world/index.js';

// Character simulation
export {
  characterSimulation,
  STATES,
  getScheduleForCharacter,
  getScheduledActivity
} from './characters/index.js';

// Simulation manager (handles init/save/load)
export { simulationManager } from './SimulationManager.js';
