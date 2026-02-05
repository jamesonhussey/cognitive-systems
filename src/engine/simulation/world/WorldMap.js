/**
 * WORLD MAP
 * 
 * Manages all locations in the world:
 * - Office building floors (1-4)
 * - Neighborhood (homes)
 * 
 * Provides methods for:
 * - Floor switching
 * - Cross-floor pathfinding
 * - Character location tracking
 */

import { writable, get } from 'svelte/store';
import { Floor } from './Floor.js';
import { TILE_TYPES } from './Tile.js';
import { ROOM_TYPES } from './Room.js';
import { generateAllOfficeFloors } from './layouts/OfficeLayouts.js';
import { generateNeighborhood } from './layouts/NeighborhoodLayout.js';

// ============================================
// LOCATION IDS
// ============================================

export const LOCATIONS = {
  NEIGHBORHOOD: 'neighborhood',
  FLOOR_1: 'floor_1',
  FLOOR_2: 'floor_2',
  FLOOR_3: 'floor_3',
  FLOOR_4: 'floor_4'
};

export const LOCATION_NAMES = {
  [LOCATIONS.NEIGHBORHOOD]: 'Company Town',
  [LOCATIONS.FLOOR_1]: 'Floor 1 - Lobby & Security',
  [LOCATIONS.FLOOR_2]: 'Floor 2 - Admin & HR',
  [LOCATIONS.FLOOR_3]: 'Floor 3 - Operations',
  [LOCATIONS.FLOOR_4]: 'Floor 4 - Management'
};

// ============================================
// WORLD MAP CLASS
// ============================================

export class WorldMap {
  constructor() {
    // All floors/locations
    this.floors = new Map(); // locationId -> Floor
    
    // Svelte store for current view
    this.currentLocation = writable(LOCATIONS.NEIGHBORHOOD);
    
    // Character location tracking
    this.characterLocations = new Map(); // characterId -> locationId
    
    // Home assignments
    this.homeAssignments = new Map(); // characterId -> { locationId, roomId, bedPosition }
    
    // Desk assignments
    this.deskAssignments = new Map(); // characterId -> { locationId, x, y }
    
    // Initialized flag
    this.initialized = false;
  }
  
  /**
   * Initialize the world map with all locations
   */
  initialize(characters) {
    console.log('[WorldMap] Initializing...');
    
    // Create all floors with proper layouts
    this.createFloors(characters.length);
    
    // Assign homes and desks to characters
    this.assignLocationsToCharacters(characters);
    
    this.initialized = true;
    console.log('[WorldMap] Initialized with', this.floors.size, 'locations');
    
    return this;
  }
  
  /**
   * Create all floor layouts
   */
  createFloors(characterCount) {
    // Generate office floors
    const officeFloors = generateAllOfficeFloors();
    for (const [locationId, floor] of Object.entries(officeFloors)) {
      this.floors.set(locationId, floor);
    }
    
    // Generate neighborhood with houses for all characters
    const { floor: neighborhood, houses } = generateNeighborhood(characterCount);
    this.floors.set(LOCATIONS.NEIGHBORHOOD, neighborhood);
    
    // Store house data for assignment
    this.houses = houses;
  }
  
  /**
   * Assign home and desk locations to characters
   */
  assignLocationsToCharacters(characters) {
    // Department to floor mapping
    const DEPARTMENT_FLOORS = {
      management: LOCATIONS.FLOOR_4,
      hr: LOCATIONS.FLOOR_2,
      research: LOCATIONS.FLOOR_3,
      it: LOCATIONS.FLOOR_3,
      security: LOCATIONS.FLOOR_1,
      sales: LOCATIONS.FLOOR_3,
      marketing: LOCATIONS.FLOOR_3,
      admin: LOCATIONS.FLOOR_2
    };
    
    // Assign houses to characters
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const house = this.houses[i];
      
      if (house) {
        // Assign home (this records which house belongs to which character)
        this.assignHome(
          character.id, 
          LOCATIONS.NEIGHBORHOOD, 
          house.bedroom.id, 
          house.bedX, 
          house.bedY
        );
        
        // Determine where to place the character
        const isNewCharacter = character.sim && character.sim.x === 0 && character.sim.y === 0;
        
        if (isNewCharacter) {
          // New character: place at home (bed position)
          const neighborhood = this.floors.get(LOCATIONS.NEIGHBORHOOD);
          neighborhood.placeCharacter(character.id, house.bedX, house.bedY);
          this.characterLocations.set(character.id, LOCATIONS.NEIGHBORHOOD);
          
          // Update character's sim position to match
          character.sim.x = house.bedX;
          character.sim.y = house.bedY;
          character.sim.floor = LOCATIONS.NEIGHBORHOOD;
        } else if (character.sim) {
          // Restored character: place at their saved position
          const savedFloor = this.floors.get(character.sim.floor);
          if (savedFloor) {
            savedFloor.placeCharacter(character.id, character.sim.x, character.sim.y);
            this.characterLocations.set(character.id, character.sim.floor);
          }
        }
      }
      
      // Find and assign desk based on department
      const deptFloorId = DEPARTMENT_FLOORS[character.department?.id] || LOCATIONS.FLOOR_2;
      const deptFloor = this.floors.get(deptFloorId);
      
      if (deptFloor) {
        // Find an unassigned chair (desk position)
        const chairTile = deptFloor.findUnassignedFurniture('chair');
        if (chairTile) {
          this.assignDesk(character.id, deptFloorId, chairTile.x, chairTile.y);
        }
      }
    }
    
    console.log(`[WorldMap] Assigned ${this.homeAssignments.size} homes and ${this.deskAssignments.size} desks`);
  }
  
  /**
   * Get a floor by location ID
   */
  getFloor(locationId) {
    return this.floors.get(locationId) || null;
  }
  
  /**
   * Get current floor (for viewing)
   */
  getCurrentFloor() {
    return this.floors.get(get(this.currentLocation));
  }
  
  /**
   * Switch the current view to a different location
   */
  switchLocation(locationId) {
    if (this.floors.has(locationId)) {
      this.currentLocation.set(locationId);
    }
  }
  
  /**
   * Get all location IDs
   */
  getLocationIds() {
    return Array.from(this.floors.keys());
  }
  
  /**
   * Get character's current location
   */
  getCharacterLocation(characterId) {
    return this.characterLocations.get(characterId) || LOCATIONS.NEIGHBORHOOD;
  }
  
  /**
   * Move character to a new location
   */
  moveCharacterToLocation(characterId, newLocationId, x, y) {
    const oldLocationId = this.characterLocations.get(characterId);
    
    // Remove from old floor
    if (oldLocationId) {
      const oldFloor = this.floors.get(oldLocationId);
      if (oldFloor) {
        oldFloor.removeCharacter(characterId);
      }
    }
    
    // Add to new floor
    const newFloor = this.floors.get(newLocationId);
    if (newFloor) {
      newFloor.placeCharacter(characterId, x, y);
      this.characterLocations.set(characterId, newLocationId);
    }
  }
  
  /**
   * Get character's home info
   */
  getCharacterHome(characterId) {
    return this.homeAssignments.get(characterId) || null;
  }
  
  /**
   * Get character's desk info
   */
  getCharacterDesk(characterId) {
    return this.deskAssignments.get(characterId) || null;
  }
  
  /**
   * Assign a home to a character
   */
  assignHome(characterId, locationId, roomId, bedX, bedY) {
    this.homeAssignments.set(characterId, {
      locationId,
      roomId,
      bedPosition: { x: bedX, y: bedY }
    });
    
    // Mark bed as owned
    const floor = this.floors.get(locationId);
    if (floor) {
      const tile = floor.getTile(bedX, bedY);
      if (tile) tile.ownerId = characterId;
    }
  }
  
  /**
   * Assign a desk to a character
   */
  assignDesk(characterId, locationId, x, y) {
    this.deskAssignments.set(characterId, {
      locationId,
      x,
      y
    });
    
    // Mark desk chair as owned
    const floor = this.floors.get(locationId);
    if (floor) {
      const tile = floor.getTile(x, y);
      if (tile) tile.ownerId = characterId;
    }
  }
  
  /**
   * Get elevator position for a floor
   */
  getElevatorPosition(locationId) {
    const floor = this.floors.get(locationId);
    if (!floor || floor.elevatorPositions.length === 0) return null;
    return floor.elevatorPositions[0];
  }
  
  /**
   * Get all characters in a location
   */
  getCharactersInLocation(locationId) {
    return Array.from(this.characterLocations.entries())
      .filter(([id, loc]) => loc === locationId)
      .map(([id]) => id);
  }
  
  /**
   * Get counts of characters per location
   */
  getLocationCounts() {
    const counts = {};
    for (const locationId of this.floors.keys()) {
      counts[locationId] = 0;
    }
    
    for (const locationId of this.characterLocations.values()) {
      counts[locationId] = (counts[locationId] || 0) + 1;
    }
    
    return counts;
  }
  
  /**
   * Serialize for saving
   */
  serialize() {
    return {
      floors: Array.from(this.floors.entries()).map(([id, floor]) => ({
        id,
        data: floor.serialize()
      })),
      characterLocations: Array.from(this.characterLocations.entries()),
      homeAssignments: Array.from(this.homeAssignments.entries()),
      deskAssignments: Array.from(this.deskAssignments.entries())
    };
  }
  
  /**
   * Deserialize from save
   */
  deserialize(data) {
    // Restore floors
    this.floors.clear();
    for (const { id, data: floorData } of data.floors) {
      const floor = Floor.deserialize(floorData);
      this.floors.set(id, floor);
    }
    
    // Restore mappings
    this.characterLocations = new Map(data.characterLocations);
    this.homeAssignments = new Map(data.homeAssignments);
    this.deskAssignments = new Map(data.deskAssignments);
    
    this.initialized = true;
  }
}

// Singleton instance
export const worldMap = new WorldMap();

export default worldMap;
