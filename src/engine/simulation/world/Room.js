/**
 * ROOM DEFINITIONS
 * 
 * Defines room types and their properties.
 * Rooms are areas within a floor that have specific purposes.
 */

// ============================================
// ROOM TYPES
// ============================================

export const ROOM_TYPES = {
  // Office rooms
  OFFICE_OPEN: {
    id: 'office_open',
    name: 'Open Office',
    description: 'Open plan work area with desks',
    category: 'work'
  },
  OFFICE_PRIVATE: {
    id: 'office_private',
    name: 'Private Office',
    description: 'Manager or executive office',
    category: 'work'
  },
  CONFERENCE_ROOM: {
    id: 'conference_room',
    name: 'Conference Room',
    description: 'Meeting room',
    category: 'work'
  },
  BREAK_ROOM: {
    id: 'break_room',
    name: 'Break Room',
    description: 'Staff break area',
    category: 'social'
  },
  BATHROOM: {
    id: 'bathroom',
    name: 'Bathroom',
    description: 'Restroom facilities',
    category: 'utility'
  },
  LOBBY: {
    id: 'lobby',
    name: 'Lobby',
    description: 'Building entrance',
    category: 'transit'
  },
  HALLWAY: {
    id: 'hallway',
    name: 'Hallway',
    description: 'Corridor between rooms',
    category: 'transit'
  },
  ELEVATOR_LOBBY: {
    id: 'elevator_lobby',
    name: 'Elevator Lobby',
    description: 'Elevator waiting area',
    category: 'transit'
  },
  SECURITY: {
    id: 'security',
    name: 'Security Office',
    description: 'Security monitoring station',
    category: 'work'
  },
  SERVER_ROOM: {
    id: 'server_room',
    name: 'Server Room',
    description: 'IT infrastructure',
    category: 'utility'
  },
  
  // Home rooms
  BEDROOM: {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Sleeping quarters',
    category: 'home'
  },
  LIVING_ROOM: {
    id: 'living_room',
    name: 'Living Room',
    description: 'Main living area',
    category: 'home'
  },
  KITCHEN: {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Food preparation area',
    category: 'home'
  },
  HOME_BATHROOM: {
    id: 'home_bathroom',
    name: 'Bathroom',
    description: 'Home bathroom',
    category: 'home'
  },
  
  // Outdoor
  STREET: {
    id: 'street',
    name: 'Street',
    description: 'Public road',
    category: 'outdoor'
  },
  YARD: {
    id: 'yard',
    name: 'Yard',
    description: 'House yard',
    category: 'outdoor'
  },
  PARKING: {
    id: 'parking',
    name: 'Parking Lot',
    description: 'Vehicle parking',
    category: 'outdoor'
  }
};

// ============================================
// ROOM CLASS
// ============================================

export class Room {
  constructor(type, id, bounds) {
    this.type = type;
    this.id = id;
    
    // Bounds: { x, y, width, height }
    this.bounds = bounds;
    
    // Owner (for private offices, bedrooms, etc.)
    this.ownerId = null;
    
    // Department assignment (for office rooms)
    this.departmentId = null;
    
    // Interaction points within the room
    this.interactionPoints = []; // Array of { x, y, type }
    
    // Entry points (doors)
    this.entryPoints = []; // Array of { x, y }
  }
  
  /**
   * Check if a point is inside this room
   */
  contains(x, y) {
    return (
      x >= this.bounds.x &&
      x < this.bounds.x + this.bounds.width &&
      y >= this.bounds.y &&
      y < this.bounds.y + this.bounds.height
    );
  }
  
  /**
   * Get center point of room
   */
  getCenter() {
    return {
      x: Math.floor(this.bounds.x + this.bounds.width / 2),
      y: Math.floor(this.bounds.y + this.bounds.height / 2)
    };
  }
  
  /**
   * Add an interaction point
   */
  addInteractionPoint(x, y, type) {
    this.interactionPoints.push({ x, y, type });
  }
  
  /**
   * Add an entry point (door)
   */
  addEntryPoint(x, y) {
    this.entryPoints.push({ x, y });
  }
  
  /**
   * Get a random walkable position within the room
   * (Will need floor grid to check walkability)
   */
  getRandomPosition() {
    const x = this.bounds.x + Math.floor(Math.random() * this.bounds.width);
    const y = this.bounds.y + Math.floor(Math.random() * this.bounds.height);
    return { x, y };
  }
  
  /**
   * Get nearest entry point to a position
   */
  getNearestEntry(fromX, fromY) {
    if (this.entryPoints.length === 0) return null;
    
    let nearest = this.entryPoints[0];
    let nearestDist = Math.abs(fromX - nearest.x) + Math.abs(fromY - nearest.y);
    
    for (const entry of this.entryPoints) {
      const dist = Math.abs(fromX - entry.x) + Math.abs(fromY - entry.y);
      if (dist < nearestDist) {
        nearest = entry;
        nearestDist = dist;
      }
    }
    
    return nearest;
  }
  
  /**
   * Serialize for saving
   */
  serialize() {
    return {
      typeId: this.type.id,
      id: this.id,
      bounds: this.bounds,
      ownerId: this.ownerId,
      departmentId: this.departmentId
    };
  }
}

/**
 * Get room type by ID
 */
export function getRoomType(id) {
  return Object.values(ROOM_TYPES).find(r => r.id === id) || null;
}

export default Room;
