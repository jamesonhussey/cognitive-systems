/**
 * NEIGHBORHOOD LAYOUT
 * 
 * Generates the residential area (Company Town) where characters live.
 * Features:
 * - Curved main street connecting to office
 * - Individual houses for each character
 * - Each house has: bedroom, living room, kitchen, bathroom
 */

import { Floor } from '../Floor.js';
import { TILE_TYPES } from '../Tile.js';
import { ROOM_TYPES } from '../Room.js';
import { LOCATIONS, LOCATION_NAMES } from '../WorldMap.js';

// ============================================
// CONFIGURATION
// ============================================

const NEIGHBORHOOD_WIDTH = 80;
const NEIGHBORHOOD_HEIGHT = 60;

const HOUSE_WIDTH = 10;
const HOUSE_HEIGHT = 8;
const HOUSE_SPACING = 2;

// ============================================
// HOUSE GENERATOR
// ============================================

/**
 * Generate a single house at the given position
 */
function generateHouse(floor, houseX, houseY, houseId, facingNorth = true) {
  // Create house outline
  floor.drawRoom(houseX, houseY, HOUSE_WIDTH, HOUSE_HEIGHT, TILE_TYPES.FLOOR);
  
  // ┌──────────┐
  // │ BR │ LR  │
  // │    ├─────│
  // │ KT │ BA  │
  // └────┴─────┘
  
  // Internal wall dividing left/right
  const midX = houseX + 4;
  for (let y = houseY + 1; y < houseY + HOUSE_HEIGHT - 1; y++) {
    floor.setTile(midX, y, TILE_TYPES.WALL);
  }
  
  // Internal wall dividing top/bottom on right side
  const midY = houseY + 4;
  for (let x = midX + 1; x < houseX + HOUSE_WIDTH - 1; x++) {
    floor.setTile(x, midY, TILE_TYPES.WALL);
  }
  
  // Internal doors
  floor.setTile(midX, houseY + 2, TILE_TYPES.DOOR_OPEN); // BR to LR
  floor.setTile(midX, houseY + 5, TILE_TYPES.DOOR_OPEN); // KT to BA
  floor.setTile(houseX + 6, midY, TILE_TYPES.DOOR_OPEN); // LR to BA
  
  // Create rooms
  const bedroom = floor.createRoom(ROOM_TYPES.BEDROOM, houseX + 1, houseY + 1, 3, 6);
  bedroom.id = `${houseId}_bedroom`;
  
  const livingRoom = floor.createRoom(ROOM_TYPES.LIVING_ROOM, midX + 1, houseY + 1, 4, 3);
  livingRoom.id = `${houseId}_living`;
  
  const kitchen = floor.createRoom(ROOM_TYPES.KITCHEN, houseX + 1, midY + 1, 3, 2);
  kitchen.id = `${houseId}_kitchen`;
  
  const bathroom = floor.createRoom(ROOM_TYPES.HOME_BATHROOM, midX + 1, midY + 1, 4, 2);
  bathroom.id = `${houseId}_bathroom`;
  
  // Bedroom furniture
  floor.setTile(houseX + 2, houseY + 2, TILE_TYPES.BED);
  floor.setTile(houseX + 2, houseY + 3, TILE_TYPES.BED);
  
  // Living room furniture
  floor.setTile(houseX + 7, houseY + 2, TILE_TYPES.COUCH);
  floor.setTile(houseX + 8, houseY + 2, TILE_TYPES.TV);
  
  // Kitchen furniture
  floor.setTile(houseX + 2, houseY + 5, TILE_TYPES.FRIDGE);
  floor.setTile(houseX + 3, houseY + 5, TILE_TYPES.STOVE);
  
  // Bathroom furniture
  floor.setTile(houseX + 6, houseY + 5, TILE_TYPES.TOILET);
  floor.setTile(houseX + 7, houseY + 5, TILE_TYPES.SINK);
  floor.setTile(houseX + 8, houseY + 5, TILE_TYPES.SHOWER);
  
  // Front door (entry point)
  let doorX, doorY;
  if (facingNorth) {
    doorX = houseX + 5;
    doorY = houseY + HOUSE_HEIGHT - 1;
  } else {
    doorX = houseX + 5;
    doorY = houseY;
  }
  floor.setTile(doorX, doorY, TILE_TYPES.DOOR);
  
  return {
    id: houseId,
    x: houseX,
    y: houseY,
    doorX,
    doorY,
    bedX: houseX + 2,
    bedY: houseY + 2,
    bedroom,
    livingRoom,
    kitchen,
    bathroom
  };
}

/**
 * Generate the neighborhood layout
 */
export function generateNeighborhood(characterCount) {
  const floor = new Floor(
    LOCATIONS.NEIGHBORHOOD, 
    LOCATION_NAMES[LOCATIONS.NEIGHBORHOOD], 
    NEIGHBORHOOD_WIDTH, 
    NEIGHBORHOOD_HEIGHT
  );
  
  // Fill with grass
  floor.fillRect(0, 0, NEIGHBORHOOD_WIDTH, NEIGHBORHOOD_HEIGHT, TILE_TYPES.GRASS);
  
  // Calculate how many houses we need
  const housesNeeded = characterCount;
  
  // Layout: Main curved road with houses on both sides
  // Road goes from bottom (office connection) curving up and around
  
  // Draw main road - gentle curve from bottom center going up
  const roadY = [];
  const roadStartX = Math.floor(NEIGHBORHOOD_WIDTH / 2);
  
  // Generate curved road path
  for (let y = NEIGHBORHOOD_HEIGHT - 1; y >= 5; y--) {
    // Sinusoidal curve
    const progress = (NEIGHBORHOOD_HEIGHT - 1 - y) / (NEIGHBORHOOD_HEIGHT - 6);
    const offset = Math.sin(progress * Math.PI * 0.8) * 15;
    const x = Math.floor(roadStartX + offset);
    
    roadY[y] = x;
    
    // Draw road (3 tiles wide)
    floor.setTile(x - 1, y, TILE_TYPES.ROAD);
    floor.setTile(x, y, TILE_TYPES.ROAD);
    floor.setTile(x + 1, y, TILE_TYPES.ROAD);
    
    // Sidewalks on both sides
    floor.setTile(x - 2, y, TILE_TYPES.SIDEWALK);
    floor.setTile(x + 2, y, TILE_TYPES.SIDEWALK);
  }
  
  // Draw road at top curving back
  for (let y = 5; y >= 3; y--) {
    const x = roadY[5];
    floor.setTile(x - 1, y, TILE_TYPES.ROAD);
    floor.setTile(x, y, TILE_TYPES.ROAD);
    floor.setTile(x + 1, y, TILE_TYPES.ROAD);
    floor.setTile(x - 2, y, TILE_TYPES.SIDEWALK);
    floor.setTile(x + 2, y, TILE_TYPES.SIDEWALK);
  }
  
  // Place houses along the road
  const houses = [];
  let houseIndex = 0;
  
  // Place houses on left side of road (every 12 units vertically)
  for (let y = NEIGHBORHOOD_HEIGHT - 12; y >= 10 && houseIndex < housesNeeded; y -= (HOUSE_HEIGHT + HOUSE_SPACING + 2)) {
    const roadX = roadY[y] || roadStartX;
    const houseX = roadX - 6 - HOUSE_WIDTH; // Left of road
    
    if (houseX >= 2) {
      // Path from house to sidewalk
      const pathY = y;
      for (let px = houseX + HOUSE_WIDTH; px < roadX - 2; px++) {
        floor.setTile(px, pathY, TILE_TYPES.PATH);
      }
      
      const house = generateHouse(floor, houseX, y - HOUSE_HEIGHT + 1, `house_${houseIndex}`, false);
      houses.push(house);
      houseIndex++;
    }
  }
  
  // Place houses on right side of road
  for (let y = NEIGHBORHOOD_HEIGHT - 12; y >= 10 && houseIndex < housesNeeded; y -= (HOUSE_HEIGHT + HOUSE_SPACING + 2)) {
    const roadX = roadY[y] || roadStartX;
    const houseX = roadX + 6; // Right of road
    
    if (houseX + HOUSE_WIDTH < NEIGHBORHOOD_WIDTH - 2) {
      // Path from house to sidewalk
      const pathY = y;
      for (let px = roadX + 3; px < houseX; px++) {
        floor.setTile(px, pathY, TILE_TYPES.PATH);
      }
      
      const house = generateHouse(floor, houseX, y - HOUSE_HEIGHT + 1, `house_${houseIndex}`, false);
      houses.push(house);
      houseIndex++;
    }
  }
  
  // If we need more houses, add a second row further out
  if (houseIndex < housesNeeded) {
    for (let y = NEIGHBORHOOD_HEIGHT - 12; y >= 10 && houseIndex < housesNeeded; y -= (HOUSE_HEIGHT + HOUSE_SPACING + 2)) {
      const roadX = roadY[y] || roadStartX;
      
      // Far left
      const houseXLeft = roadX - 8 - HOUSE_WIDTH * 2;
      if (houseXLeft >= 2) {
        const house = generateHouse(floor, houseXLeft, y - HOUSE_HEIGHT + 1, `house_${houseIndex}`, false);
        houses.push(house);
        houseIndex++;
      }
      
      if (houseIndex >= housesNeeded) break;
      
      // Far right
      const houseXRight = roadX + 8 + HOUSE_WIDTH;
      if (houseXRight + HOUSE_WIDTH < NEIGHBORHOOD_WIDTH - 2) {
        const house = generateHouse(floor, houseXRight, y - HOUSE_HEIGHT + 1, `house_${houseIndex}`, false);
        houses.push(house);
        houseIndex++;
      }
    }
  }
  
  // Office connection point (bottom of map)
  floor.addSpawnPoint(roadStartX, NEIGHBORHOOD_HEIGHT - 2, 'office_entrance');
  
  // Mark as "to office" indicator
  floor.setTile(roadStartX, NEIGHBORHOOD_HEIGHT - 1, TILE_TYPES.ROAD);
  
  console.log(`[Neighborhood] Generated ${houses.length} houses for ${housesNeeded} characters`);
  
  return { floor, houses };
}

export default generateNeighborhood;
