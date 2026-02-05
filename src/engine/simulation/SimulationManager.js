/**
 * SIMULATION MANAGER
 * 
 * Central manager that handles:
 * - Initializing simulation on login
 * - Generating characters for new accounts
 * - Saving/loading simulation state
 * - Auto-saving periodically
 * 
 * This should be called from the game state, NOT from individual apps.
 */

import { get } from 'svelte/store';
import { simulation, simulationTime, simulationTickCount } from './SimulationLoop.js';
import { worldState, worldCharacters } from './WorldState.js';
import { worldMap } from './world/WorldMap.js';
import { characterSimulation } from './characters/CharacterSimulation.js';
import { generateOfficePopulation } from '../generation/CharacterGenerator.js';

// ============================================
// CONFIGURATION
// ============================================

const AUTO_SAVE_INTERVAL_MS = 60000; // Save every 60 seconds
const SIMULATION_SAVE_KEY = 'cognitive_game_simulation';

// ============================================
// SIMULATION MANAGER
// ============================================

class SimulationManager {
  constructor() {
    this.initialized = false;
    this.currentAccountId = null;
    this.autoSaveIntervalId = null;
    this.tickUnsubscribe = null;
    this.lastSaveTime = 0;
  }
  
  /**
   * Initialize simulation for a new account
   * Called when creating a new account
   * Returns the generated simulation data to be saved with the account
   */
  generateNewSimulation() {
    console.log('[SimulationManager] Generating new simulation...');
    
    // Generate office population
    const characters = generateOfficePopulation();
    
    // Create initial simulation data
    const simulationData = {
      version: 1,
      createdAt: new Date().toISOString(),
      
      // Time state
      time: {
        totalMinutes: 7 * 60, // 7:00 AM
        day: 1
      },
      
      // Characters with their base data (not sim state yet)
      characters: characters.map(c => ({
        // Base character data
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: c.fullName,
        employeeId: c.employeeId,
        dob: c.dob,
        department: c.department,
        role: c.role,
        traits: c.traits,
        disposition: c.disposition,
        phantoms: c.phantoms,
        relationships: c.relationships,
        priorities: c.priorities,
        fileSystem: c.fileSystem,
        state: c.state,
        
        // Initial simulation state
        sim: {
          x: 0,
          y: 0,
          floor: 'neighborhood',
          state: 'sleeping',
          intention: 'sleeping',
          currentAction: 'Sleeping',
          needs: {
            energy: 100,
            social: 50,
            stress: c.state?.stress || 20
          }
        }
      })),
      
      // Tick count
      tickCount: 0
    };
    
    console.log(`[SimulationManager] Generated ${characters.length} characters`);
    
    return simulationData;
  }
  
  /**
   * Start the simulation for a logged-in account
   * Called when user logs in
   */
  startSimulation(accountId, simulationData) {
    if (this.initialized && this.currentAccountId === accountId) {
      console.log('[SimulationManager] Simulation already running for this account');
      return;
    }
    
    console.log('[SimulationManager] Starting simulation for account:', accountId);
    
    // Stop any existing simulation
    this.stopSimulation();
    
    this.currentAccountId = accountId;
    
    // Restore or initialize the simulation
    if (simulationData) {
      this.restoreSimulation(simulationData);
    } else {
      console.warn('[SimulationManager] No simulation data, generating new...');
      const newData = this.generateNewSimulation();
      this.restoreSimulation(newData);
    }
    
    // Register tick callback for character simulation
    // Store the unsubscribe function so we can clean up later
    this.tickUnsubscribe = simulation.onTick((timestamp) => {
      characterSimulation.tick(timestamp);
    });
    
    // Start the simulation loop
    simulation.start();
    
    // Start auto-save
    this.startAutoSave();
    
    // Expose to window for dev tools
    if (typeof window !== 'undefined') {
      window._simulationCharacters = () => get(worldCharacters);
      window._simulationTime = () => simulation.getTimeManager().getTimestamp();
    }
    
    this.initialized = true;
    console.log('[SimulationManager] Simulation started');
  }
  
  /**
   * Restore simulation from saved data
   */
  restoreSimulation(data) {
    console.log('[SimulationManager] Restoring simulation from save...');
    
    // Restore time
    if (data.time) {
      simulation.getTimeManager().deserialize(data.time);
      simulation.time.set(simulation.getTimeManager().getTimestamp());
    }
    
    // Restore tick count
    if (data.tickCount !== undefined) {
      simulation.tickCount.set(data.tickCount);
    }
    
    // Restore characters to world state
    const characters = data.characters || [];
    
    // Initialize each character with simulation state
    for (const charData of characters) {
      // Ensure sim state exists
      if (!charData.sim) {
        charData.sim = {
          x: 0,
          y: 0,
          floor: 'neighborhood',
          state: 'sleeping',
          intention: 'sleeping',
          currentAction: 'Sleeping',
          needs: { energy: 100, social: 50, stress: 20 },
          path: [],
          isMoving: false,
          targetX: null,
          targetY: null,
          targetFloor: null
        };
      }
      
      worldState.characterMap.set(charData.id, charData);
    }
    
    worldState.characters.set(characters);
    worldState.initialized.set(true);
    
    // Initialize world map with characters
    worldMap.initialize(characters);
    
    // Restore character positions on the map
    for (const char of characters) {
      if (char.sim.floor && char.sim.x !== undefined && char.sim.y !== undefined) {
        const floor = worldMap.getFloor(char.sim.floor);
        if (floor) {
          floor.placeCharacter(char.id, char.sim.x, char.sim.y);
        }
        worldMap.characterLocations.set(char.id, char.sim.floor);
      }
    }
    
    // Initialize character simulation (schedules, etc.)
    characterSimulation.initialize();
    
    worldState.updateStats();
    
    console.log(`[SimulationManager] Restored ${characters.length} characters`);
  }
  
  /**
   * Stop the simulation
   */
  stopSimulation() {
    if (!this.initialized) return;
    
    console.log('[SimulationManager] Stopping simulation...');
    
    // Stop auto-save
    this.stopAutoSave();
    
    // Unsubscribe from tick callback
    if (this.tickUnsubscribe) {
      this.tickUnsubscribe();
      this.tickUnsubscribe = null;
    }
    
    // Stop the simulation loop
    simulation.stop();
    
    // Reset world state
    worldState.initialized.set(false);
    worldState.characters.set([]);
    worldState.characterMap.clear();
    
    this.initialized = false;
    this.currentAccountId = null;
  }
  
  /**
   * Get current simulation state for saving
   */
  getSimulationState() {
    const characters = get(worldCharacters);
    
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      
      // Time state
      time: simulation.getTimeManager().serialize(),
      
      // Tick count
      tickCount: get(simulationTickCount),
      
      // Characters with current simulation state
      characters: characters.map(c => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: c.fullName,
        employeeId: c.employeeId,
        dob: c.dob,
        department: c.department,
        role: c.role,
        traits: c.traits,
        disposition: c.disposition,
        phantoms: c.phantoms,
        relationships: c.relationships,
        priorities: c.priorities,
        fileSystem: c.fileSystem,
        state: c.state,
        
        // Current simulation state
        sim: {
          x: c.sim.x,
          y: c.sim.y,
          floor: c.sim.floor,
          state: c.sim.state,
          intention: c.sim.intention,
          previousState: c.sim.previousState,
          currentAction: c.sim.currentAction,
          needs: { ...c.sim.needs },
          isMoving: c.sim.isMoving,
          targetX: c.sim.targetX,
          targetY: c.sim.targetY,
          targetFloor: c.sim.targetFloor
          // Note: path is not saved, will be recalculated
        }
      }))
    };
  }
  
  /**
   * Start auto-save interval
   */
  startAutoSave() {
    this.stopAutoSave();
    
    this.autoSaveIntervalId = setInterval(() => {
      this.triggerAutoSave();
    }, AUTO_SAVE_INTERVAL_MS);
    
    console.log(`[SimulationManager] Auto-save enabled (every ${AUTO_SAVE_INTERVAL_MS / 1000}s)`);
  }
  
  /**
   * Stop auto-save interval
   */
  stopAutoSave() {
    if (this.autoSaveIntervalId) {
      clearInterval(this.autoSaveIntervalId);
      this.autoSaveIntervalId = null;
    }
  }
  
  /**
   * Trigger an auto-save
   * This dispatches an event that gameState should listen to
   */
  triggerAutoSave() {
    if (!this.initialized || !this.currentAccountId) return;
    
    const state = this.getSimulationState();
    this.lastSaveTime = Date.now();
    
    // Dispatch custom event for gameState to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('simulation-autosave', {
        detail: {
          accountId: this.currentAccountId,
          simulationData: state
        }
      }));
    }
  }
  
  /**
   * Check if simulation is running
   */
  isRunning() {
    return this.initialized && simulation.isRunning;
  }
  
  /**
   * Get current account ID
   */
  getCurrentAccountId() {
    return this.currentAccountId;
  }
}

// Singleton instance
export const simulationManager = new SimulationManager();

export default simulationManager;
