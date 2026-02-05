/**
 * SIMULATION LOOP
 * 
 * The main game loop that drives the simulation.
 * Handles tick timing, speed controls, and pause state.
 * 
 * Speed Settings:
 * - 0: Paused
 * - 1: 1x (1 real second = 1 game minute)
 * - 2: 2x (0.5 real seconds = 1 game minute)
 * - 4: 4x (0.25 real seconds = 1 game minute)
 */

import { writable, derived, get } from 'svelte/store';
import { TimeManager } from './TimeManager.js';

// ============================================
// CONFIGURATION
// ============================================

/**
 * Available speed multipliers
 * Easy to add more speeds (e.g., 8x, 10x)
 */
export const SPEED_OPTIONS = [0, 1, 2, 4];

/**
 * Base tick interval in milliseconds (at 1x speed)
 * 1000ms = 1 second = 1 game minute
 */
export const BASE_TICK_MS = 1000;

// ============================================
// SIMULATION STATE
// ============================================

class SimulationLoop {
  constructor() {
    // Core state
    this.timeManager = new TimeManager();
    this.isRunning = false;
    this.intervalId = null;
    
    // Svelte stores for reactive UI
    this.speed = writable(1); // Current speed multiplier
    this.paused = writable(false);
    this.time = writable(this.timeManager.getTimestamp());
    this.tickCount = writable(0);
    
    // Derived store for display
    this.timeDisplay = derived(this.time, $time => ({
      time: $time.time12Hour,
      day: `Day ${$time.day}`,
      dayName: $time.dayName
    }));
    
    // Callbacks for tick events
    this.tickCallbacks = [];
    
    // Performance tracking
    this.lastTickTime = 0;
    this.ticksPerSecond = 0;
  }
  
  /**
   * Start the simulation loop
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.paused.set(false);
    this.scheduleNextTick();
    
    console.log('[Simulation] Started');
  }
  
  /**
   * Stop the simulation loop
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('[Simulation] Stopped');
  }
  
  /**
   * Pause/unpause the simulation
   */
  togglePause() {
    const currentPaused = get(this.paused);
    
    if (currentPaused) {
      // Unpause
      this.paused.set(false);
      this.speed.set(this.lastSpeed || 1);
      this.scheduleNextTick();
    } else {
      // Pause
      this.lastSpeed = get(this.speed);
      this.paused.set(true);
      this.speed.set(0);
      if (this.intervalId) {
        clearTimeout(this.intervalId);
        this.intervalId = null;
      }
    }
  }
  
  /**
   * Set simulation speed
   * @param {number} speedMultiplier - 0 (paused), 1, 2, or 4
   */
  setSpeed(speedMultiplier) {
    if (!SPEED_OPTIONS.includes(speedMultiplier)) {
      console.warn(`[Simulation] Invalid speed: ${speedMultiplier}`);
      return;
    }
    
    this.speed.set(speedMultiplier);
    
    if (speedMultiplier === 0) {
      this.paused.set(true);
      if (this.intervalId) {
        clearTimeout(this.intervalId);
        this.intervalId = null;
      }
    } else {
      this.paused.set(false);
      // Reschedule with new speed
      if (this.intervalId) {
        clearTimeout(this.intervalId);
      }
      this.scheduleNextTick();
    }
  }
  
  /**
   * Cycle through speed options
   */
  cycleSpeed() {
    const currentSpeed = get(this.speed);
    const currentIndex = SPEED_OPTIONS.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    this.setSpeed(SPEED_OPTIONS[nextIndex]);
  }
  
  /**
   * Schedule the next tick based on current speed
   */
  scheduleNextTick() {
    if (!this.isRunning || get(this.paused)) return;
    
    const speed = get(this.speed);
    if (speed === 0) return;
    
    const tickInterval = BASE_TICK_MS / speed;
    
    this.intervalId = setTimeout(() => {
      this.tick();
      this.scheduleNextTick();
    }, tickInterval);
  }
  
  /**
   * Execute one simulation tick
   */
  tick() {
    // Advance game time
    this.timeManager.tick();
    
    // Update time store
    this.time.set(this.timeManager.getTimestamp());
    
    // Update tick count
    this.tickCount.update(n => n + 1);
    
    // Track performance
    const now = performance.now();
    if (this.lastTickTime > 0) {
      this.ticksPerSecond = 1000 / (now - this.lastTickTime);
    }
    this.lastTickTime = now;
    
    // Execute all registered tick callbacks
    const timestamp = this.timeManager.getTimestamp();
    for (const callback of this.tickCallbacks) {
      try {
        callback(timestamp);
      } catch (error) {
        console.error('[Simulation] Tick callback error:', error);
      }
    }
  }
  
  /**
   * Register a callback to be called on each tick
   * @param {Function} callback - Function to call with timestamp
   * @returns {Function} Unsubscribe function
   */
  onTick(callback) {
    this.tickCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.tickCallbacks.indexOf(callback);
      if (index > -1) {
        this.tickCallbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Manually trigger a single tick (for debugging)
   */
  manualTick() {
    this.tick();
  }
  
  /**
   * Get current time manager
   */
  getTimeManager() {
    return this.timeManager;
  }
  
  /**
   * Serialize state for saving
   */
  serialize() {
    return {
      time: this.timeManager.serialize(),
      speed: get(this.speed),
      tickCount: get(this.tickCount)
    };
  }
  
  /**
   * Restore state from save
   */
  deserialize(data) {
    this.timeManager.deserialize(data.time);
    this.speed.set(data.speed);
    this.tickCount.set(data.tickCount);
    this.time.set(this.timeManager.getTimestamp());
  }
}

// Singleton instance
export const simulation = new SimulationLoop();

// Export stores for easy access
export const simulationSpeed = simulation.speed;
export const simulationPaused = simulation.paused;
export const simulationTime = simulation.time;
export const simulationTimeDisplay = simulation.timeDisplay;
export const simulationTickCount = simulation.tickCount;

export default simulation;
