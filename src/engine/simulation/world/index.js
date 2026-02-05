/**
 * WORLD SYSTEM
 * 
 * Exports for the world/map system.
 */

// Tile system
export { Tile, TILE_TYPES, getTileType } from './Tile.js';

// Room system
export { Room, ROOM_TYPES, getRoomType } from './Room.js';

// Floor management
export { Floor } from './Floor.js';

// World map
export { 
  WorldMap, 
  worldMap, 
  LOCATIONS, 
  LOCATION_NAMES 
} from './WorldMap.js';

// Layout generators
export { 
  generateAllOfficeFloors,
  generateFloor1,
  generateFloor2,
  generateFloor3,
  generateFloor4
} from './layouts/OfficeLayouts.js';

export { generateNeighborhood } from './layouts/NeighborhoodLayout.js';
