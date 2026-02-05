/**
 * WORLD STATE
 * 
 * Central state container for the entire simulation world.
 * Manages:
 * - All characters and their simulation state
 * - World map (office floors, neighborhood)
 * - Global state (time, events)
 * 
 * This is the "source of truth" for everything in the simulation.
 */

import { writable, get } from 'svelte/store';
import { generateOfficePopulation } from '../generation/CharacterGenerator.js';

// ============================================
// WORLD STATE
// ============================================

class WorldState {
  constructor() {
    // Characters
    this.characters = writable([]);
    this.characterMap = new Map(); // Quick lookup by ID
    
    // World locations
    this.locations = writable({
      officeFloors: [],    // Array of floor data
      neighborhood: null    // Neighborhood data
    });
    
    // Simulation state
    this.initialized = writable(false);
    
    // Statistics for debugging
    this.stats = writable({
      characterCount: 0,
      activeCharacters: 0,
      sleepingCharacters: 0
    });
  }
  
  /**
   * Initialize the world with generated characters
   */
  initialize() {
    console.log('[WorldState] Initializing...');
    
    // Generate office population
    const characters = generateOfficePopulation();
    
    // Initialize simulation state for each character
    for (const character of characters) {
      this.initializeCharacterSimState(character);
      this.characterMap.set(character.id, character);
    }
    
    // Store characters
    this.characters.set(characters);
    
    // Update stats
    this.stats.set({
      characterCount: characters.length,
      activeCharacters: 0,
      sleepingCharacters: characters.length
    });
    
    this.initialized.set(true);
    
    console.log(`[WorldState] Initialized with ${characters.length} characters`);
    
    return characters;
  }
  
  /**
   * Initialize simulation-specific state for a character
   */
  initializeCharacterSimState(character) {
    // Position (will be set when world layout is created)
    character.sim = {
      // Current position
      x: 0,
      y: 0,
      floor: 'home', // 'home', 'floor_1', 'floor_2', etc.
      
      // Movement
      targetX: null,
      targetY: null,
      targetFloor: null,
      path: [], // Array of {x, y} waypoints
      isMoving: false,
      
      // State machine
      state: 'sleeping', // Current state
      previousState: null,
      stateStartTime: 0, // When current state started (in game minutes)
      
      // Needs (for Layer 2, initialized now)
      needs: {
        energy: 100,      // 0-100, depletes during day, recovers during sleep
        social: 50,       // 0-100, builds up, satisfied by conversations
        stress: character.state?.stress || 20  // 0-100, from generation
      },
      
      // Current action (for display)
      currentAction: 'Sleeping',
      
      // Schedule tracking
      schedule: null, // Will be assigned based on role
      scheduleIndex: 0,
      
      // Interaction state
      interactingWith: null, // Character ID if in conversation
      interactionTimer: 0
    };
  }
  
  /**
   * Get a character by ID
   */
  getCharacter(id) {
    return this.characterMap.get(id);
  }
  
  /**
   * Get all characters
   */
  getCharacters() {
    return get(this.characters);
  }
  
  /**
   * Get characters by floor
   */
  getCharactersByFloor(floor) {
    return get(this.characters).filter(c => c.sim.floor === floor);
  }
  
  /**
   * Get characters by state
   */
  getCharactersByState(state) {
    return get(this.characters).filter(c => c.sim.state === state);
  }
  
  /**
   * Update a character's simulation state
   */
  updateCharacter(id, updates) {
    const character = this.characterMap.get(id);
    if (!character) return;
    
    Object.assign(character.sim, updates);
    
    // Trigger reactivity
    this.characters.update(chars => chars);
  }
  
  /**
   * Set a character's state
   */
  setCharacterState(id, newState, action = null) {
    const character = this.characterMap.get(id);
    if (!character) return;
    
    character.sim.previousState = character.sim.state;
    character.sim.state = newState;
    
    if (action) {
      character.sim.currentAction = action;
    }
    
    // Trigger reactivity
    this.characters.update(chars => chars);
  }
  
  /**
   * Update statistics
   */
  updateStats() {
    const chars = get(this.characters);
    
    const stats = {
      characterCount: chars.length,
      activeCharacters: chars.filter(c => c.sim.state !== 'sleeping').length,
      sleepingCharacters: chars.filter(c => c.sim.state === 'sleeping').length
    };
    
    this.stats.set(stats);
  }
  
  /**
   * Serialize state for saving
   */
  serialize() {
    const characters = get(this.characters);
    
    return {
      characters: characters.map(c => ({
        id: c.id,
        sim: { ...c.sim }
      }))
    };
  }
  
  /**
   * Restore state from save
   */
  deserialize(data, fullCharacters) {
    // Merge saved sim state back into full characters
    for (const savedChar of data.characters) {
      const fullChar = fullCharacters.find(c => c.id === savedChar.id);
      if (fullChar) {
        fullChar.sim = savedChar.sim;
        this.characterMap.set(fullChar.id, fullChar);
      }
    }
    
    this.characters.set(fullCharacters);
    this.initialized.set(true);
    this.updateStats();
  }
}

// Singleton instance
export const worldState = new WorldState();

// Export stores for easy access
export const worldCharacters = worldState.characters;
export const worldLocations = worldState.locations;
export const worldInitialized = worldState.initialized;
export const worldStats = worldState.stats;

export default worldState;
