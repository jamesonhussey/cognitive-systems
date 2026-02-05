/**
 * NEIGHBORHOOD LAYOUT
 * 
 * Generates the residential area (Company Town) where characters live.
 * Uses a simple grid layout to guarantee enough houses for all characters.
 * 
 * Layout (from bottom to top):
 * - Spawn point at bottom (connects to office)
 * - Short entrance road
 * - Horizontal streets with houses on both sides
 * - Main road runs vertically through the center
 */

import { Floor } from '../Floor.js';
import { TILE_TYPES } from '../Tile.js';
import { ROOM_TYPES } from '../Room.js';
import { LOCATIONS, LOCATION_NAMES } from '../WorldMap.js';

// ============================================
// CONFIGURATION - Easy to tweak!
// ============================================

const HOUSE_WIDTH = 10;
const HOUSE_HEIGHT = 8;
const HOUSE_SPACING_X = 2;  // Space between houses horizontally
const STREET_WIDTH = 3;     // Width of horizontal streets
const SIDEWALK_WIDTH = 1;   // Sidewalk on each side of street
const HOUSES_PER_SIDE = 3;  // Houses per side of main road per street (6 per street side)
const BUFFER_HOUSES = 10;   // Extra houses for future hires
const MARGIN = 4;           // Edge margin
const ENTRANCE_ROAD_LENGTH = 3; // Short road from spawn to first intersection

// ============================================
// HOUSE GENERATOR
// ============================================

function generateHouse(floor, houseX, houseY, houseId, doorOnBottom = true) {
  // Create house outline with floor inside
  floor.drawRoom(houseX, houseY, HOUSE_WIDTH, HOUSE_HEIGHT, TILE_TYPES.FLOOR);
  
  // Internal wall dividing left/right (at x+4)
  const midX = houseX + 4;
  for (let y = houseY + 1; y < houseY + HOUSE_HEIGHT - 1; y++) {
    floor.setTile(midX, y, TILE_TYPES.WALL);
  }
  
  // Internal wall dividing top/bottom on right side (at y+4)
  const midY = houseY + 4;
  for (let x = midX + 1; x < houseX + HOUSE_WIDTH - 1; x++) {
    floor.setTile(x, midY, TILE_TYPES.WALL);
  }
  
  // Internal doors (open)
  floor.setTile(midX, houseY + 2, TILE_TYPES.DOOR_OPEN);
  floor.setTile(midX, houseY + 5, TILE_TYPES.DOOR_OPEN);
  floor.setTile(houseX + 6, midY, TILE_TYPES.DOOR_OPEN);
  
  // Create room objects
  const bedroom = floor.createRoom(ROOM_TYPES.BEDROOM, houseX + 1, houseY + 1, 3, 3);
  bedroom.id = `${houseId}_bedroom`;
  
  const livingRoom = floor.createRoom(ROOM_TYPES.LIVING_ROOM, midX + 1, houseY + 1, 4, 3);
  livingRoom.id = `${houseId}_living`;
  
  const kitchen = floor.createRoom(ROOM_TYPES.KITCHEN, houseX + 1, houseY + 4, 3, 3);
  kitchen.id = `${houseId}_kitchen`;
  
  const bathroom = floor.createRoom(ROOM_TYPES.HOME_BATHROOM, midX + 1, midY + 1, 4, 2);
  bathroom.id = `${houseId}_bathroom`;
  
  // Furniture
  floor.setTile(houseX + 2, houseY + 2, TILE_TYPES.BED);
  floor.setTile(houseX + 3, houseY + 2, TILE_TYPES.BED);
  floor.setTile(houseX + 6, houseY + 2, TILE_TYPES.COUCH);
  floor.setTile(houseX + 7, houseY + 2, TILE_TYPES.TV);
  floor.setTile(houseX + 2, houseY + 5, TILE_TYPES.FRIDGE);
  floor.setTile(houseX + 3, houseY + 5, TILE_TYPES.STOVE);
  floor.setTile(houseX + 6, houseY + 5, TILE_TYPES.TOILET);
  floor.setTile(houseX + 7, houseY + 5, TILE_TYPES.SINK);
  floor.setTile(houseX + 8, houseY + 5, TILE_TYPES.SHOWER);
  
  // Front door
  const doorX = houseX + 5;
  const doorY = doorOnBottom ? houseY + HOUSE_HEIGHT - 1 : houseY;
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
 * Calculate dimensions for the neighborhood
 */
function calculateLayout(characterCount) {
  const housesNeeded = characterCount + BUFFER_HOUSES;
  const housesPerStreet = HOUSES_PER_SIDE * 2 * 2; // 2 sides of road × 2 sides of street
  const streetsNeeded = Math.ceil(housesNeeded / housesPerStreet);
  
  // Width calculation
  const housesWidth = (HOUSE_WIDTH + HOUSE_SPACING_X) * HOUSES_PER_SIDE;
  const mainRoadWidth = STREET_WIDTH + SIDEWALK_WIDTH * 2;
  const width = MARGIN + housesWidth + mainRoadWidth + housesWidth + MARGIN;
  
  // Height calculation: each street block contains north houses + street + south houses
  const streetBlockHeight = HOUSE_HEIGHT + 2 + STREET_WIDTH + 2 + HOUSE_HEIGHT;
  const height = MARGIN + (streetsNeeded * streetBlockHeight) + ENTRANCE_ROAD_LENGTH + MARGIN;
  
  return { 
    width: Math.max(width, 100), 
    height: Math.max(height, 80), 
    housesNeeded, 
    streetsNeeded,
    streetBlockHeight
  };
}

/**
 * Generate the neighborhood layout
 */
export function generateNeighborhood(characterCount) {
  const { width, height, housesNeeded, streetsNeeded, streetBlockHeight } = calculateLayout(characterCount);
  
  const floor = new Floor(
    LOCATIONS.NEIGHBORHOOD, 
    LOCATION_NAMES[LOCATIONS.NEIGHBORHOOD], 
    width, 
    height
  );
  
  // Fill with grass
  floor.fillRect(0, 0, width, height, TILE_TYPES.GRASS);
  
  const houses = [];
  let houseIndex = 0;
  const centerX = Math.floor(width / 2);
  
  // Calculate starting Y for first street (from bottom)
  // First street's south houses start just above the entrance
  const firstStreetSouthHouseY = height - MARGIN - ENTRANCE_ROAD_LENGTH - HOUSE_HEIGHT;
  const firstStreetY = firstStreetSouthHouseY - 2; // Street is above south houses
  
  // Track the highest Y we've built to (for main road)
  let highestY = height;
  
  // Build streets from bottom to top
  for (let s = 0; s < streetsNeeded && houseIndex < housesNeeded; s++) {
    const streetY = firstStreetY - (s * streetBlockHeight);
    
    // Check if this street would be off the map
    if (streetY - STREET_WIDTH < MARGIN) break;
    
    // Calculate house positions
    const southHouseY = streetY + 2; // South houses below street
    const northHouseY = streetY - STREET_WIDTH - 2 - HOUSE_HEIGHT; // North houses above street
    
    // Check if north houses would be off map
    const canBuildNorth = northHouseY >= MARGIN;
    
    // Draw horizontal street
    for (let x = MARGIN; x < width - MARGIN; x++) {
      for (let sy = 0; sy < STREET_WIDTH; sy++) {
        floor.setTile(x, streetY - sy, TILE_TYPES.ROAD);
      }
      floor.setTile(x, streetY + 1, TILE_TYPES.SIDEWALK); // Below street
      if (canBuildNorth) {
        floor.setTile(x, streetY - STREET_WIDTH, TILE_TYPES.SIDEWALK); // Above street
      }
    }
    
    // Update highest Y
    highestY = Math.min(highestY, canBuildNorth ? northHouseY : streetY - STREET_WIDTH);
    
    // === BUILD SOUTH HOUSES (below street, doors face north) ===
    if (southHouseY + HOUSE_HEIGHT <= height - MARGIN - ENTRANCE_ROAD_LENGTH + 2) {
      // West side of main road
      let houseX = MARGIN;
      for (let h = 0; h < HOUSES_PER_SIDE && houseIndex < housesNeeded; h++) {
        if (houseX + HOUSE_WIDTH <= centerX - 3) {
          const doorX = houseX + 5;
          for (let py = streetY + 1; py < southHouseY; py++) {
            floor.setTile(doorX, py, TILE_TYPES.PATH);
          }
          houses.push(generateHouse(floor, houseX, southHouseY, `house_${houseIndex}`, false));
          houseIndex++;
        }
        houseX += HOUSE_WIDTH + HOUSE_SPACING_X;
      }
      
      // East side of main road
      houseX = centerX + 3;
      for (let h = 0; h < HOUSES_PER_SIDE && houseIndex < housesNeeded; h++) {
        if (houseX + HOUSE_WIDTH <= width - MARGIN) {
          const doorX = houseX + 5;
          for (let py = streetY + 1; py < southHouseY; py++) {
            floor.setTile(doorX, py, TILE_TYPES.PATH);
          }
          houses.push(generateHouse(floor, houseX, southHouseY, `house_${houseIndex}`, false));
          houseIndex++;
        }
        houseX += HOUSE_WIDTH + HOUSE_SPACING_X;
      }
    }
    
    // === BUILD NORTH HOUSES (above street, doors face south) ===
    if (canBuildNorth) {
      // West side of main road
      let houseX = MARGIN;
      for (let h = 0; h < HOUSES_PER_SIDE && houseIndex < housesNeeded; h++) {
        if (houseX + HOUSE_WIDTH <= centerX - 3) {
          const doorX = houseX + 5;
          for (let py = northHouseY + HOUSE_HEIGHT; py <= streetY - STREET_WIDTH; py++) {
            floor.setTile(doorX, py, TILE_TYPES.PATH);
          }
          houses.push(generateHouse(floor, houseX, northHouseY, `house_${houseIndex}`, true));
          houseIndex++;
        }
        houseX += HOUSE_WIDTH + HOUSE_SPACING_X;
      }
      
      // East side of main road
      houseX = centerX + 3;
      for (let h = 0; h < HOUSES_PER_SIDE && houseIndex < housesNeeded; h++) {
        if (houseX + HOUSE_WIDTH <= width - MARGIN) {
          const doorX = houseX + 5;
          for (let py = northHouseY + HOUSE_HEIGHT; py <= streetY - STREET_WIDTH; py++) {
            floor.setTile(doorX, py, TILE_TYPES.PATH);
          }
          houses.push(generateHouse(floor, houseX, northHouseY, `house_${houseIndex}`, true));
          houseIndex++;
        }
        houseX += HOUSE_WIDTH + HOUSE_SPACING_X;
      }
    }
  }
  
  // Draw main road ONLY from spawn to highest street (not all the way to top)
  for (let y = height - MARGIN; y >= highestY - 2; y--) {
    floor.setTile(centerX - 1, y, TILE_TYPES.ROAD);
    floor.setTile(centerX, y, TILE_TYPES.ROAD);
    floor.setTile(centerX + 1, y, TILE_TYPES.ROAD);
    floor.setTile(centerX - 2, y, TILE_TYPES.SIDEWALK);
    floor.setTile(centerX + 2, y, TILE_TYPES.SIDEWALK);
  }
  
  // Spawn point at bottom center
  const spawnY = height - MARGIN;
  floor.addSpawnPoint(centerX, spawnY, 'office_entrance');
  
  console.log(`[Neighborhood] Generated ${houses.length} houses for ${characterCount} characters (${houses.length - characterCount} buffer)`);
  
  if (houses.length < characterCount) {
    console.error(`[Neighborhood] ERROR: Not enough houses! Generated ${houses.length}, needed ${characterCount}`);
  }
  
  return { floor, houses };
}

export default generateNeighborhood;
