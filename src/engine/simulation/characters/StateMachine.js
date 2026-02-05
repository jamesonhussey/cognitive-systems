/**
 * CHARACTER STATE MACHINE
 * 
 * Defines all possible character states and their behaviors.
 * Each state has:
 * - Entry actions (what happens when entering the state)
 * - Tick actions (what happens each tick while in state)
 * - Exit conditions (when to transition out)
 */

// ============================================
// STATE DEFINITIONS
// ============================================

export const STATES = {
  // Rest states
  SLEEPING: {
    id: 'sleeping',
    name: 'Sleeping',
    category: 'rest',
    location: 'home', // Where this state should occur
    allowsMovement: false,
    recoversEnergy: true,
    energyRecoveryRate: 2 // Per tick
  },
  WAKING_UP: {
    id: 'waking_up',
    name: 'Waking Up',
    category: 'rest',
    location: 'home',
    allowsMovement: true,
    recoversEnergy: false
  },
  MORNING_ROUTINE: {
    id: 'morning_routine',
    name: 'Morning Routine',
    category: 'rest',
    location: 'home',
    allowsMovement: true,
    recoversEnergy: false
  },
  
  // Movement states
  COMMUTING: {
    id: 'commuting',
    name: 'Commuting',
    category: 'movement',
    location: 'any',
    allowsMovement: true,
    recoversEnergy: false
  },
  WALKING: {
    id: 'walking',
    name: 'Walking',
    category: 'movement',
    location: 'any',
    allowsMovement: true,
    recoversEnergy: false
  },
  
  // Work states
  WORKING: {
    id: 'working',
    name: 'Working',
    category: 'work',
    location: 'office',
    allowsMovement: false,
    recoversEnergy: false,
    drainsEnergy: true,
    energyDrainRate: 0.5 // Per tick
  },
  
  // Break states
  BREAK: {
    id: 'break',
    name: 'On Break',
    category: 'social',
    location: 'office',
    allowsMovement: true,
    recoversEnergy: true,
    energyRecoveryRate: 0.5
  },
  
  // Home states
  LEISURE: {
    id: 'leisure',
    name: 'Leisure',
    category: 'rest',
    location: 'home',
    allowsMovement: true,
    recoversEnergy: true,
    energyRecoveryRate: 1
  },
  EATING: {
    id: 'eating',
    name: 'Eating',
    category: 'rest',
    location: 'home',
    allowsMovement: false,
    recoversEnergy: true,
    energyRecoveryRate: 1
  },
  
  // Interaction states
  CHATTING: {
    id: 'chatting',
    name: 'Chatting',
    category: 'social',
    location: 'any',
    allowsMovement: false,
    recoversEnergy: false,
    satisfiesSocial: true
  },
  
  // Idle/default
  IDLE: {
    id: 'idle',
    name: 'Idle',
    category: 'other',
    location: 'any',
    allowsMovement: true,
    recoversEnergy: false
  }
};

// ============================================
// STATE HELPER FUNCTIONS
// ============================================

/**
 * Get state by ID
 */
export function getState(stateId) {
  return Object.values(STATES).find(s => s.id === stateId) || STATES.IDLE;
}

/**
 * Check if a state allows movement
 */
export function stateAllowsMovement(stateId) {
  const state = getState(stateId);
  return state.allowsMovement;
}

/**
 * Get the expected location for a state
 */
export function getStateLocation(stateId) {
  const state = getState(stateId);
  return state.location;
}

/**
 * Process energy changes for a state
 * Returns the energy delta (positive = gain, negative = loss)
 */
export function getEnergyDelta(stateId) {
  const state = getState(stateId);
  
  if (state.recoversEnergy) {
    return state.energyRecoveryRate || 1;
  }
  
  if (state.drainsEnergy) {
    return -(state.energyDrainRate || 0.5);
  }
  
  return 0;
}

/**
 * Check if state satisfies social need
 */
export function stateSatisfiesSocial(stateId) {
  const state = getState(stateId);
  return state.satisfiesSocial || false;
}

/**
 * Get action text for a state (default)
 */
export function getDefaultAction(stateId) {
  const state = getState(stateId);
  return state.name;
}

// ============================================
// STATE TRANSITIONS
// ============================================

/**
 * Valid transitions from each state
 * Used for validation, not required for all transitions
 */
export const STATE_TRANSITIONS = {
  sleeping: ['waking_up'],
  waking_up: ['morning_routine', 'commuting', 'leisure'],
  morning_routine: ['commuting', 'leisure'],
  commuting: ['working', 'leisure', 'idle'],
  working: ['break', 'commuting', 'chatting'],
  break: ['working', 'chatting', 'commuting'],
  leisure: ['eating', 'sleeping', 'commuting'],
  eating: ['leisure', 'sleeping'],
  chatting: ['working', 'break', 'leisure', 'idle'],
  idle: ['sleeping', 'working', 'leisure', 'commuting', 'chatting']
};

/**
 * Check if a transition is valid
 */
export function isValidTransition(fromState, toState) {
  const validTargets = STATE_TRANSITIONS[fromState];
  if (!validTargets) return true; // Unknown state, allow
  return validTargets.includes(toState);
}

export default {
  STATES,
  getState,
  stateAllowsMovement,
  getStateLocation,
  getEnergyDelta,
  stateSatisfiesSocial,
  getDefaultAction,
  isValidTransition
};
