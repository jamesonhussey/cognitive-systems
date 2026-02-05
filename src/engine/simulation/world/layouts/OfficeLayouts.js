/**
 * OFFICE FLOOR LAYOUTS
 * 
 * Generates the layout for each office floor.
 * 
 * Floor Structure:
 * - Floor 1: Lobby, Security, Building Entrance
 * - Floor 2: Admin, HR, Break Room
 * - Floor 3: Operations (Research, IT, Sales, Marketing)
 * - Floor 4: Management (Executive offices)
 */

import { Floor } from '../Floor.js';
import { TILE_TYPES } from '../Tile.js';
import { ROOM_TYPES } from '../Room.js';
import { LOCATIONS, LOCATION_NAMES } from '../WorldMap.js';

// ============================================
// CONFIGURATION
// ============================================

const FLOOR_WIDTH = 50;
const FLOOR_HEIGHT = 40;

// Department to floor mapping (matches departments.js)
const DEPARTMENT_FLOORS = {
  management: 4,
  hr: 2,
  research: 3,
  it: 3,
  security: 1,
  sales: 3,
  marketing: 3,
  admin: 2
};

// ============================================
// FLOOR GENERATORS
// ============================================

/**
 * Generate Floor 1: Lobby & Security
 */
export function generateFloor1() {
  const floor = new Floor(LOCATIONS.FLOOR_1, LOCATION_NAMES[LOCATIONS.FLOOR_1], FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Main lobby area
  floor.fillRect(1, 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, TILE_TYPES.FLOOR);
  floor.drawRect(0, 0, FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Elevator lobby (center-right)
  const elevatorX = FLOOR_WIDTH - 8;
  const elevatorY = Math.floor(FLOOR_HEIGHT / 2) - 2;
  floor.fillRect(elevatorX, elevatorY, 6, 5, TILE_TYPES.FLOOR_TILE);
  floor.addElevator(elevatorX + 2, elevatorY + 2);
  floor.createRoom(ROOM_TYPES.ELEVATOR_LOBBY, elevatorX, elevatorY, 6, 5);
  
  // Security office (left side)
  const securityRoom = floor.createRoom(ROOM_TYPES.SECURITY, 2, 2, 15, 12);
  floor.drawRoom(2, 2, 15, 12, TILE_TYPES.FLOOR_CARPET);
  
  // Security desks
  for (let i = 0; i < 3; i++) {
    floor.setTile(4 + i * 4, 5, TILE_TYPES.DESK);
    floor.setTile(4 + i * 4, 6, TILE_TYPES.CHAIR);
    floor.setTile(4 + i * 4, 4, TILE_TYPES.COMPUTER);
  }
  
  // Door to security office
  floor.setTile(9, 13, TILE_TYPES.DOOR);
  securityRoom.addEntryPoint(9, 13);
  
  // Main lobby area
  const lobbyRoom = floor.createRoom(ROOM_TYPES.LOBBY, 2, 16, 35, 20);
  
  // Reception desk
  floor.setTile(18, 20, TILE_TYPES.DESK);
  floor.setTile(19, 20, TILE_TYPES.DESK);
  floor.setTile(20, 20, TILE_TYPES.DESK);
  floor.setTile(18, 21, TILE_TYPES.CHAIR);
  
  // Waiting area couches
  floor.setTile(6, 25, TILE_TYPES.COUCH);
  floor.setTile(7, 25, TILE_TYPES.COUCH);
  floor.setTile(8, 25, TILE_TYPES.COUCH);
  floor.setTile(6, 30, TILE_TYPES.COUCH);
  floor.setTile(7, 30, TILE_TYPES.COUCH);
  floor.setTile(8, 30, TILE_TYPES.COUCH);
  
  // Building entrance (bottom)
  floor.setTile(18, FLOOR_HEIGHT - 1, TILE_TYPES.DOOR);
  floor.setTile(19, FLOOR_HEIGHT - 1, TILE_TYPES.DOOR);
  floor.setTile(20, FLOOR_HEIGHT - 1, TILE_TYPES.DOOR);
  floor.addSpawnPoint(19, FLOOR_HEIGHT - 2, 'entrance');
  
  // Bathroom
  const bathroomRoom = floor.createRoom(ROOM_TYPES.BATHROOM, 25, 2, 10, 8);
  floor.drawRoom(25, 2, 10, 8, TILE_TYPES.FLOOR_TILE);
  floor.setTile(28, 9, TILE_TYPES.DOOR);
  floor.setTile(27, 4, TILE_TYPES.TOILET);
  floor.setTile(27, 6, TILE_TYPES.TOILET);
  floor.setTile(31, 4, TILE_TYPES.SINK);
  floor.setTile(32, 4, TILE_TYPES.SINK);
  bathroomRoom.addEntryPoint(28, 9);
  
  return floor;
}

/**
 * Generate Floor 2: Admin & HR
 */
export function generateFloor2() {
  const floor = new Floor(LOCATIONS.FLOOR_2, LOCATION_NAMES[LOCATIONS.FLOOR_2], FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Base floor
  floor.fillRect(1, 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, TILE_TYPES.FLOOR);
  floor.drawRect(0, 0, FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Elevator lobby (center-right)
  const elevatorX = FLOOR_WIDTH - 8;
  const elevatorY = Math.floor(FLOOR_HEIGHT / 2) - 2;
  floor.fillRect(elevatorX, elevatorY, 6, 5, TILE_TYPES.FLOOR_TILE);
  floor.addElevator(elevatorX + 2, elevatorY + 2);
  floor.createRoom(ROOM_TYPES.ELEVATOR_LOBBY, elevatorX, elevatorY, 6, 5);
  
  // HR Office (top-left)
  const hrRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 2, 2, 18, 15);
  hrRoom.departmentId = 'hr';
  floor.drawRoom(2, 2, 18, 15, TILE_TYPES.FLOOR_CARPET);
  
  // HR desks (2 rows of 3)
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 5 + col * 5;
      const y = 5 + row * 5;
      floor.setTile(x, y, TILE_TYPES.DESK);
      floor.setTile(x, y + 1, TILE_TYPES.CHAIR);
      floor.setTile(x + 1, y, TILE_TYPES.COMPUTER);
    }
  }
  
  floor.setTile(10, 16, TILE_TYPES.DOOR);
  hrRoom.addEntryPoint(10, 16);
  
  // Admin Office (bottom-left)
  const adminRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 2, 20, 18, 15);
  adminRoom.departmentId = 'admin';
  floor.drawRoom(2, 20, 18, 15, TILE_TYPES.FLOOR_CARPET);
  
  // Admin desks
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 5 + col * 5;
      const y = 23 + row * 5;
      floor.setTile(x, y, TILE_TYPES.DESK);
      floor.setTile(x, y + 1, TILE_TYPES.CHAIR);
      floor.setTile(x + 1, y, TILE_TYPES.COMPUTER);
    }
  }
  
  floor.setTile(10, 20, TILE_TYPES.DOOR);
  adminRoom.addEntryPoint(10, 20);
  
  // Break Room (right side)
  const breakRoom = floor.createRoom(ROOM_TYPES.BREAK_ROOM, 22, 2, 18, 12);
  floor.drawRoom(22, 2, 18, 12, TILE_TYPES.FLOOR_TILE);
  
  // Break room furniture
  floor.setTile(25, 5, TILE_TYPES.COFFEE_MACHINE);
  floor.setTile(27, 5, TILE_TYPES.VENDING_MACHINE);
  floor.setTile(30, 7, TILE_TYPES.TABLE);
  floor.setTile(31, 7, TILE_TYPES.TABLE);
  floor.setTile(30, 8, TILE_TYPES.CHAIR);
  floor.setTile(31, 8, TILE_TYPES.CHAIR);
  floor.setTile(30, 6, TILE_TYPES.CHAIR);
  floor.setTile(31, 6, TILE_TYPES.CHAIR);
  floor.setTile(35, 7, TILE_TYPES.COUCH);
  floor.setTile(36, 7, TILE_TYPES.COUCH);
  
  floor.setTile(28, 13, TILE_TYPES.DOOR);
  breakRoom.addEntryPoint(28, 13);
  
  // Conference Room
  const confRoom = floor.createRoom(ROOM_TYPES.CONFERENCE_ROOM, 22, 25, 15, 10);
  floor.drawRoom(22, 25, 15, 10, TILE_TYPES.FLOOR_CARPET);
  
  // Conference table
  for (let i = 0; i < 6; i++) {
    floor.setTile(26 + i, 29, TILE_TYPES.TABLE);
  }
  // Chairs around table
  floor.setTile(25, 29, TILE_TYPES.CHAIR);
  floor.setTile(32, 29, TILE_TYPES.CHAIR);
  for (let i = 0; i < 4; i++) {
    floor.setTile(27 + i, 28, TILE_TYPES.CHAIR);
    floor.setTile(27 + i, 30, TILE_TYPES.CHAIR);
  }
  
  floor.setTile(28, 25, TILE_TYPES.DOOR);
  confRoom.addEntryPoint(28, 25);
  
  // Bathroom
  const bathroom = floor.createRoom(ROOM_TYPES.BATHROOM, 38, 25, 8, 10);
  floor.drawRoom(38, 25, 8, 10, TILE_TYPES.FLOOR_TILE);
  floor.setTile(40, 27, TILE_TYPES.TOILET);
  floor.setTile(40, 30, TILE_TYPES.TOILET);
  floor.setTile(43, 27, TILE_TYPES.SINK);
  floor.setTile(38, 29, TILE_TYPES.DOOR);
  bathroom.addEntryPoint(38, 29);
  
  return floor;
}

/**
 * Generate Floor 3: Operations
 */
export function generateFloor3() {
  const floor = new Floor(LOCATIONS.FLOOR_3, LOCATION_NAMES[LOCATIONS.FLOOR_3], FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Base floor
  floor.fillRect(1, 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, TILE_TYPES.FLOOR);
  floor.drawRect(0, 0, FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Elevator lobby
  const elevatorX = FLOOR_WIDTH - 8;
  const elevatorY = Math.floor(FLOOR_HEIGHT / 2) - 2;
  floor.fillRect(elevatorX, elevatorY, 6, 5, TILE_TYPES.FLOOR_TILE);
  floor.addElevator(elevatorX + 2, elevatorY + 2);
  floor.createRoom(ROOM_TYPES.ELEVATOR_LOBBY, elevatorX, elevatorY, 6, 5);
  
  // Research (top-left)
  const researchRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 2, 2, 20, 12);
  researchRoom.departmentId = 'research';
  floor.drawRoom(2, 2, 20, 12, TILE_TYPES.FLOOR_CARPET);
  
  for (let i = 0; i < 4; i++) {
    const x = 5 + i * 4;
    floor.setTile(x, 5, TILE_TYPES.DESK);
    floor.setTile(x, 6, TILE_TYPES.CHAIR);
    floor.setTile(x + 1, 5, TILE_TYPES.COMPUTER);
  }
  
  floor.setTile(12, 13, TILE_TYPES.DOOR);
  researchRoom.addEntryPoint(12, 13);
  
  // IT (top-right)
  const itRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 24, 2, 16, 12);
  itRoom.departmentId = 'it';
  floor.drawRoom(24, 2, 16, 12, TILE_TYPES.FLOOR_CARPET);
  
  for (let i = 0; i < 3; i++) {
    const x = 27 + i * 4;
    floor.setTile(x, 5, TILE_TYPES.DESK);
    floor.setTile(x, 6, TILE_TYPES.CHAIR);
    floor.setTile(x + 1, 5, TILE_TYPES.COMPUTER);
  }
  
  // Server room
  floor.setTile(36, 5, TILE_TYPES.FILING_CABINET);
  floor.setTile(36, 6, TILE_TYPES.FILING_CABINET);
  floor.setTile(36, 7, TILE_TYPES.FILING_CABINET);
  
  floor.setTile(30, 13, TILE_TYPES.DOOR);
  itRoom.addEntryPoint(30, 13);
  
  // Sales (bottom-left)
  const salesRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 2, 16, 18, 12);
  salesRoom.departmentId = 'sales';
  floor.drawRoom(2, 16, 18, 12, TILE_TYPES.FLOOR_CARPET);
  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 5 + col * 5;
      const y = 19 + row * 4;
      floor.setTile(x, y, TILE_TYPES.DESK);
      floor.setTile(x, y + 1, TILE_TYPES.CHAIR);
    }
  }
  
  floor.setTile(10, 16, TILE_TYPES.DOOR);
  salesRoom.addEntryPoint(10, 16);
  
  // Marketing (bottom-middle)
  const marketingRoom = floor.createRoom(ROOM_TYPES.OFFICE_OPEN, 22, 16, 18, 12);
  marketingRoom.departmentId = 'marketing';
  floor.drawRoom(22, 16, 18, 12, TILE_TYPES.FLOOR_CARPET);
  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 25 + col * 5;
      const y = 19 + row * 4;
      floor.setTile(x, y, TILE_TYPES.DESK);
      floor.setTile(x, y + 1, TILE_TYPES.CHAIR);
    }
  }
  
  floor.setTile(30, 16, TILE_TYPES.DOOR);
  marketingRoom.addEntryPoint(30, 16);
  
  // Break Room (bottom right corner)
  const breakRoom = floor.createRoom(ROOM_TYPES.BREAK_ROOM, 2, 30, 16, 8);
  floor.drawRoom(2, 30, 16, 8, TILE_TYPES.FLOOR_TILE);
  floor.setTile(5, 33, TILE_TYPES.COFFEE_MACHINE);
  floor.setTile(7, 33, TILE_TYPES.VENDING_MACHINE);
  floor.setTile(12, 33, TILE_TYPES.COUCH);
  floor.setTile(13, 33, TILE_TYPES.COUCH);
  floor.setTile(9, 30, TILE_TYPES.DOOR);
  breakRoom.addEntryPoint(9, 30);
  
  // Bathroom
  const bathroom = floor.createRoom(ROOM_TYPES.BATHROOM, 22, 30, 8, 8);
  floor.drawRoom(22, 30, 8, 8, TILE_TYPES.FLOOR_TILE);
  floor.setTile(24, 32, TILE_TYPES.TOILET);
  floor.setTile(24, 35, TILE_TYPES.TOILET);
  floor.setTile(27, 32, TILE_TYPES.SINK);
  floor.setTile(22, 34, TILE_TYPES.DOOR);
  bathroom.addEntryPoint(22, 34);
  
  return floor;
}

/**
 * Generate Floor 4: Management
 */
export function generateFloor4() {
  const floor = new Floor(LOCATIONS.FLOOR_4, LOCATION_NAMES[LOCATIONS.FLOOR_4], FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Base floor - premium carpet
  floor.fillRect(1, 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, TILE_TYPES.FLOOR_CARPET);
  floor.drawRect(0, 0, FLOOR_WIDTH, FLOOR_HEIGHT);
  
  // Elevator lobby
  const elevatorX = FLOOR_WIDTH - 8;
  const elevatorY = Math.floor(FLOOR_HEIGHT / 2) - 2;
  floor.fillRect(elevatorX, elevatorY, 6, 5, TILE_TYPES.FLOOR_TILE);
  floor.addElevator(elevatorX + 2, elevatorY + 2);
  floor.createRoom(ROOM_TYPES.ELEVATOR_LOBBY, elevatorX, elevatorY, 6, 5);
  
  // Director's Office (large, top)
  const directorRoom = floor.createRoom(ROOM_TYPES.OFFICE_PRIVATE, 2, 2, 20, 15);
  directorRoom.departmentId = 'management';
  floor.drawRoom(2, 2, 20, 15, TILE_TYPES.FLOOR_CARPET);
  
  // Director's desk
  floor.setTile(10, 8, TILE_TYPES.DESK);
  floor.setTile(11, 8, TILE_TYPES.DESK);
  floor.setTile(12, 8, TILE_TYPES.DESK);
  floor.setTile(11, 9, TILE_TYPES.CHAIR);
  floor.setTile(11, 7, TILE_TYPES.COMPUTER);
  
  // Guest chairs
  floor.setTile(8, 11, TILE_TYPES.CHAIR);
  floor.setTile(14, 11, TILE_TYPES.CHAIR);
  
  // Bookshelf/filing
  floor.setTile(4, 4, TILE_TYPES.FILING_CABINET);
  floor.setTile(5, 4, TILE_TYPES.FILING_CABINET);
  floor.setTile(6, 4, TILE_TYPES.FILING_CABINET);
  
  floor.setTile(11, 16, TILE_TYPES.DOOR);
  directorRoom.addEntryPoint(11, 16);
  
  // Manager Offices (2 smaller offices)
  const manager1 = floor.createRoom(ROOM_TYPES.OFFICE_PRIVATE, 2, 20, 12, 10);
  manager1.departmentId = 'management';
  floor.drawRoom(2, 20, 12, 10, TILE_TYPES.FLOOR_CARPET);
  floor.setTile(6, 24, TILE_TYPES.DESK);
  floor.setTile(6, 25, TILE_TYPES.CHAIR);
  floor.setTile(7, 24, TILE_TYPES.COMPUTER);
  floor.setTile(7, 20, TILE_TYPES.DOOR);
  manager1.addEntryPoint(7, 20);
  
  const manager2 = floor.createRoom(ROOM_TYPES.OFFICE_PRIVATE, 16, 20, 12, 10);
  manager2.departmentId = 'management';
  floor.drawRoom(16, 20, 12, 10, TILE_TYPES.FLOOR_CARPET);
  floor.setTile(20, 24, TILE_TYPES.DESK);
  floor.setTile(20, 25, TILE_TYPES.CHAIR);
  floor.setTile(21, 24, TILE_TYPES.COMPUTER);
  floor.setTile(21, 20, TILE_TYPES.DOOR);
  manager2.addEntryPoint(21, 20);
  
  // Executive Conference Room (right side)
  const confRoom = floor.createRoom(ROOM_TYPES.CONFERENCE_ROOM, 25, 2, 15, 15);
  floor.drawRoom(25, 2, 15, 15, TILE_TYPES.FLOOR_CARPET);
  
  // Large conference table
  for (let x = 28; x <= 35; x++) {
    floor.setTile(x, 8, TILE_TYPES.TABLE);
    floor.setTile(x, 9, TILE_TYPES.TABLE);
  }
  // Chairs
  for (let x = 28; x <= 35; x++) {
    floor.setTile(x, 7, TILE_TYPES.CHAIR);
    floor.setTile(x, 10, TILE_TYPES.CHAIR);
  }
  
  floor.setTile(32, 16, TILE_TYPES.DOOR);
  confRoom.addEntryPoint(32, 16);
  
  // Executive Break Area
  const breakRoom = floor.createRoom(ROOM_TYPES.BREAK_ROOM, 2, 32, 26, 6);
  floor.drawRoom(2, 32, 26, 6, TILE_TYPES.FLOOR_TILE);
  floor.setTile(5, 34, TILE_TYPES.COFFEE_MACHINE);
  floor.setTile(10, 34, TILE_TYPES.COUCH);
  floor.setTile(11, 34, TILE_TYPES.COUCH);
  floor.setTile(12, 34, TILE_TYPES.COUCH);
  floor.setTile(20, 34, TILE_TYPES.TABLE);
  floor.setTile(20, 35, TILE_TYPES.CHAIR);
  floor.setTile(21, 35, TILE_TYPES.CHAIR);
  floor.setTile(14, 32, TILE_TYPES.DOOR);
  breakRoom.addEntryPoint(14, 32);
  
  // Private Bathroom
  const bathroom = floor.createRoom(ROOM_TYPES.BATHROOM, 30, 32, 8, 6);
  floor.drawRoom(30, 32, 8, 6, TILE_TYPES.FLOOR_TILE);
  floor.setTile(32, 34, TILE_TYPES.TOILET);
  floor.setTile(35, 34, TILE_TYPES.SINK);
  floor.setTile(30, 34, TILE_TYPES.DOOR);
  bathroom.addEntryPoint(30, 34);
  
  return floor;
}

/**
 * Generate all office floors
 */
export function generateAllOfficeFloors() {
  return {
    [LOCATIONS.FLOOR_1]: generateFloor1(),
    [LOCATIONS.FLOOR_2]: generateFloor2(),
    [LOCATIONS.FLOOR_3]: generateFloor3(),
    [LOCATIONS.FLOOR_4]: generateFloor4()
  };
}

export default generateAllOfficeFloors;
