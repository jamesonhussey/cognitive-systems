/**
 * CHARACTER SIMULATION
 * 
 * Exports for the character simulation system.
 */

// Schedule system
export {
  SCHEDULE_STANDARD,
  SCHEDULE_SECURITY_MORNING,
  SCHEDULE_SECURITY_EVENING,
  SCHEDULE_SECURITY_NIGHT,
  SCHEDULE_MANAGEMENT,
  getScheduleForCharacter,
  getSchedule,
  getScheduledActivity,
  getNextTransition
} from './Schedule.js';

// State machine
export {
  STATES,
  getState,
  stateAllowsMovement,
  getStateLocation,
  getEnergyDelta,
  stateSatisfiesSocial,
  getDefaultAction,
  isValidTransition
} from './StateMachine.js';

// Main simulation manager
export { characterSimulation } from './CharacterSimulation.js';

// Pathfinding
export {
  findPath,
  getNextStep,
  hasLineOfSight,
  getDistance
} from './Pathfinding.js';
