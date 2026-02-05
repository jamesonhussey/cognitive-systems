/**
 * TILE DEFINITIONS
 * 
 * Defines tile types and their properties for the world grid.
 * Each tile is 1 character-space in size.
 */

// ============================================
// TILE TYPES
// ============================================

export const TILE_TYPES = {
  // Empty/impassable
  VOID: {
    id: 'void',
    char: ' ',
    walkable: false,
    description: 'Empty space'
  },
  
  // Walls and structure
  WALL: {
    id: 'wall',
    char: '#',
    walkable: false,
    description: 'Wall'
  },
  WALL_H: {
    id: 'wall_h',
    char: '─',
    walkable: false,
    description: 'Horizontal wall'
  },
  WALL_V: {
    id: 'wall_v',
    char: '│',
    walkable: false,
    description: 'Vertical wall'
  },
  CORNER_TL: {
    id: 'corner_tl',
    char: '┌',
    walkable: false,
    description: 'Top-left corner'
  },
  CORNER_TR: {
    id: 'corner_tr',
    char: '┐',
    walkable: false,
    description: 'Top-right corner'
  },
  CORNER_BL: {
    id: 'corner_bl',
    char: '└',
    walkable: false,
    description: 'Bottom-left corner'
  },
  CORNER_BR: {
    id: 'corner_br',
    char: '┘',
    walkable: false,
    description: 'Bottom-right corner'
  },
  T_UP: {
    id: 't_up',
    char: '┴',
    walkable: false,
    description: 'T-junction up'
  },
  T_DOWN: {
    id: 't_down',
    char: '┬',
    walkable: false,
    description: 'T-junction down'
  },
  T_LEFT: {
    id: 't_left',
    char: '┤',
    walkable: false,
    description: 'T-junction left'
  },
  T_RIGHT: {
    id: 't_right',
    char: '├',
    walkable: false,
    description: 'T-junction right'
  },
  CROSS: {
    id: 'cross',
    char: '┼',
    walkable: false,
    description: 'Cross junction'
  },
  
  // Doors
  DOOR: {
    id: 'door',
    char: '▯',
    walkable: true,
    description: 'Door'
  },
  DOOR_OPEN: {
    id: 'door_open',
    char: '░',
    walkable: true,
    description: 'Open door'
  },
  
  // Floors
  FLOOR: {
    id: 'floor',
    char: '.',
    walkable: true,
    description: 'Floor'
  },
  FLOOR_CARPET: {
    id: 'floor_carpet',
    char: '·',
    walkable: true,
    description: 'Carpeted floor'
  },
  FLOOR_TILE: {
    id: 'floor_tile',
    char: '░',
    walkable: true,
    description: 'Tiled floor'
  },
  
  // Outdoor
  GRASS: {
    id: 'grass',
    char: '"',
    walkable: true,
    description: 'Grass'
  },
  ROAD: {
    id: 'road',
    char: '▪',
    walkable: true,
    description: 'Road'
  },
  SIDEWALK: {
    id: 'sidewalk',
    char: '▫',
    walkable: true,
    description: 'Sidewalk'
  },
  PATH: {
    id: 'path',
    char: '·',
    walkable: true,
    description: 'Path'
  },
  
  // Furniture - Office
  DESK: {
    id: 'desk',
    char: '▬',
    walkable: false,
    description: 'Desk',
    interactable: true,
    interactionType: 'work'
  },
  CHAIR: {
    id: 'chair',
    char: 'o',
    walkable: true, // Characters sit here
    description: 'Chair',
    interactable: true,
    interactionType: 'sit'
  },
  COMPUTER: {
    id: 'computer',
    char: '□',
    walkable: false,
    description: 'Computer'
  },
  TABLE: {
    id: 'table',
    char: '▀',
    walkable: false,
    description: 'Table'
  },
  FILING_CABINET: {
    id: 'filing_cabinet',
    char: '▐',
    walkable: false,
    description: 'Filing cabinet'
  },
  
  // Furniture - Break room
  COFFEE_MACHINE: {
    id: 'coffee_machine',
    char: '♨',
    walkable: false,
    description: 'Coffee machine',
    interactable: true,
    interactionType: 'coffee'
  },
  VENDING_MACHINE: {
    id: 'vending_machine',
    char: '▌',
    walkable: false,
    description: 'Vending machine',
    interactable: true,
    interactionType: 'snack'
  },
  COUCH: {
    id: 'couch',
    char: '═',
    walkable: true, // Characters sit here
    description: 'Couch',
    interactable: true,
    interactionType: 'relax'
  },
  
  // Furniture - Home
  BED: {
    id: 'bed',
    char: '≡',
    walkable: true, // Characters lie here
    description: 'Bed',
    interactable: true,
    interactionType: 'sleep'
  },
  TV: {
    id: 'tv',
    char: '▣',
    walkable: false,
    description: 'Television',
    interactable: true,
    interactionType: 'watch'
  },
  FRIDGE: {
    id: 'fridge',
    char: '▓',
    walkable: false,
    description: 'Refrigerator',
    interactable: true,
    interactionType: 'food'
  },
  STOVE: {
    id: 'stove',
    char: '▒',
    walkable: false,
    description: 'Stove',
    interactable: true,
    interactionType: 'cook'
  },
  TOILET: {
    id: 'toilet',
    char: 'ℴ',
    walkable: true,
    description: 'Toilet',
    interactable: true,
    interactionType: 'bathroom'
  },
  SINK: {
    id: 'sink',
    char: '∪',
    walkable: false,
    description: 'Sink'
  },
  SHOWER: {
    id: 'shower',
    char: '║',
    walkable: true,
    description: 'Shower',
    interactable: true,
    interactionType: 'shower'
  },
  
  // Special
  ELEVATOR: {
    id: 'elevator',
    char: 'E',
    walkable: true,
    description: 'Elevator',
    interactable: true,
    interactionType: 'elevator'
  },
  STAIRS: {
    id: 'stairs',
    char: '≣',
    walkable: true,
    description: 'Stairs'
  }
};

// ============================================
// TILE CLASS
// ============================================

export class Tile {
  constructor(type = TILE_TYPES.VOID, x = 0, y = 0) {
    this.type = type;
    this.x = x;
    this.y = y;
    
    // Room assignment (set by room creation)
    this.roomId = null;
    this.roomType = null;
    
    // Ownership (for desks, beds, etc.)
    this.ownerId = null; // Character ID
    
    // State
    this.occupied = false;
    this.occupiedBy = null; // Character ID
  }
  
  /**
   * Get the display character for this tile
   */
  getChar() {
    return this.type.char;
  }
  
  /**
   * Check if a character can walk on this tile
   */
  isWalkable() {
    return this.type.walkable && !this.occupied;
  }
  
  /**
   * Check if tile can be interacted with
   */
  isInteractable() {
    return this.type.interactable || false;
  }
  
  /**
   * Get interaction type
   */
  getInteractionType() {
    return this.type.interactionType || null;
  }
  
  /**
   * Set tile as occupied by a character
   */
  setOccupied(characterId) {
    this.occupied = true;
    this.occupiedBy = characterId;
  }
  
  /**
   * Clear occupation
   */
  clearOccupied() {
    this.occupied = false;
    this.occupiedBy = null;
  }
  
  /**
   * Serialize for saving
   */
  serialize() {
    return {
      typeId: this.type.id,
      roomId: this.roomId,
      ownerId: this.ownerId
    };
  }
}

/**
 * Get tile type by ID
 */
export function getTileType(id) {
  return Object.values(TILE_TYPES).find(t => t.id === id) || TILE_TYPES.VOID;
}

export default Tile;
