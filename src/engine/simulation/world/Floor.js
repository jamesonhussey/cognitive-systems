/**
 * FLOOR
 * 
 * Represents a single floor/area in the world (office floor, neighborhood, etc.)
 * Contains a 2D grid of tiles and manages rooms.
 */

import { Tile, TILE_TYPES, getTileType } from './Tile.js';
import { Room, getRoomType } from './Room.js';

export class Floor {
  constructor(id, name, width, height) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    
    // 2D grid of tiles
    this.grid = [];
    
    // Rooms on this floor
    this.rooms = new Map(); // roomId -> Room
    
    // Special locations
    this.elevatorPositions = []; // { x, y }
    this.spawnPoints = []; // { x, y, type }
    
    // Character positions on this floor (for quick lookup)
    this.characterPositions = new Map(); // characterId -> { x, y }
    
    // Initialize grid with void tiles
    this.initializeGrid();
  }
  
  /**
   * Initialize the grid with void tiles
   */
  initializeGrid() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(new Tile(TILE_TYPES.VOID, x, y));
      }
      this.grid.push(row);
    }
  }
  
  /**
   * Get a tile at position
   */
  getTile(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }
  
  /**
   * Set a tile at position
   */
  setTile(x, y, tileType) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    
    const tile = this.grid[y][x];
    tile.type = tileType;
    return true;
  }
  
  /**
   * Check if a position is walkable
   */
  isWalkable(x, y) {
    const tile = this.getTile(x, y);
    return tile && tile.isWalkable();
  }
  
  /**
   * Fill a rectangular area with a tile type
   */
  fillRect(x, y, width, height, tileType) {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        this.setTile(x + dx, y + dy, tileType);
      }
    }
  }
  
  /**
   * Draw a rectangle outline (walls)
   */
  drawRect(x, y, width, height, wallType = TILE_TYPES.WALL) {
    // Top and bottom
    for (let dx = 0; dx < width; dx++) {
      this.setTile(x + dx, y, wallType);
      this.setTile(x + dx, y + height - 1, wallType);
    }
    // Left and right
    for (let dy = 0; dy < height; dy++) {
      this.setTile(x, y + dy, wallType);
      this.setTile(x + width - 1, y + dy, wallType);
    }
  }
  
  /**
   * Draw a room with walls and floor
   */
  drawRoom(x, y, width, height, floorType = TILE_TYPES.FLOOR) {
    // Fill with floor
    this.fillRect(x, y, width, height, floorType);
    
    // Draw walls
    this.drawRect(x, y, width, height);
  }
  
  /**
   * Create and register a room
   */
  createRoom(roomType, x, y, width, height) {
    const roomId = `${this.id}_room_${this.rooms.size}`;
    const room = new Room(roomType, roomId, { x, y, width, height });
    
    this.rooms.set(roomId, room);
    
    // Assign room to tiles
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const tile = this.getTile(x + dx, y + dy);
        if (tile) {
          tile.roomId = roomId;
          tile.roomType = roomType.id;
        }
      }
    }
    
    return room;
  }
  
  /**
   * Get room by ID
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }
  
  /**
   * Get room at position
   */
  getRoomAt(x, y) {
    const tile = this.getTile(x, y);
    if (!tile || !tile.roomId) return null;
    return this.rooms.get(tile.roomId);
  }
  
  /**
   * Find all rooms of a type
   */
  getRoomsByType(roomTypeId) {
    return Array.from(this.rooms.values()).filter(r => r.type.id === roomTypeId);
  }
  
  /**
   * Add an elevator position
   */
  addElevator(x, y) {
    this.setTile(x, y, TILE_TYPES.ELEVATOR);
    this.elevatorPositions.push({ x, y });
  }
  
  /**
   * Add a spawn point
   */
  addSpawnPoint(x, y, type = 'default') {
    this.spawnPoints.push({ x, y, type });
  }
  
  /**
   * Get spawn point by type
   */
  getSpawnPoint(type = 'default') {
    const point = this.spawnPoints.find(p => p.type === type);
    return point || this.spawnPoints[0] || null;
  }
  
  /**
   * Get nearest elevator to a position
   */
  getNearestElevator(fromX, fromY) {
    if (this.elevatorPositions.length === 0) return null;
    
    let nearest = this.elevatorPositions[0];
    let nearestDist = Math.abs(fromX - nearest.x) + Math.abs(fromY - nearest.y);
    
    for (const pos of this.elevatorPositions) {
      const dist = Math.abs(fromX - pos.x) + Math.abs(fromY - pos.y);
      if (dist < nearestDist) {
        nearest = pos;
        nearestDist = dist;
      }
    }
    
    return nearest;
  }
  
  /**
   * Place a character on this floor
   */
  placeCharacter(characterId, x, y) {
    // Clear old position if character was already on this floor
    if (this.characterPositions.has(characterId)) {
      const oldPos = this.characterPositions.get(characterId);
      const oldTile = this.getTile(oldPos.x, oldPos.y);
      if (oldTile) oldTile.removeOccupant(characterId);
    }
    
    // Set new position
    this.characterPositions.set(characterId, { x, y });
    
    const tile = this.getTile(x, y);
    if (tile) tile.setOccupied(characterId);
  }
  
  /**
   * Remove a character from this floor
   */
  removeCharacter(characterId) {
    const pos = this.characterPositions.get(characterId);
    if (pos) {
      const tile = this.getTile(pos.x, pos.y);
      if (tile) tile.removeOccupant(characterId);
      this.characterPositions.delete(characterId);
    }
  }
  
  /**
   * Get character position
   */
  getCharacterPosition(characterId) {
    return this.characterPositions.get(characterId) || null;
  }
  
  /**
   * Get all character IDs on this floor
   */
  getCharacterIds() {
    return Array.from(this.characterPositions.keys());
  }
  
  /**
   * Find a tile by type
   */
  findTileByType(tileTypeId) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x].type.id === tileTypeId) {
          return { x, y, tile: this.grid[y][x] };
        }
      }
    }
    return null;
  }
  
  /**
   * Find all tiles by type
   */
  findAllTilesByType(tileTypeId) {
    const results = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x].type.id === tileTypeId) {
          results.push({ x, y, tile: this.grid[y][x] });
        }
      }
    }
    return results;
  }
  
  /**
   * Find unassigned furniture of a type
   */
  findUnassignedFurniture(tileTypeId) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.grid[y][x];
        if (tile.type.id === tileTypeId && !tile.ownerId) {
          return { x, y, tile };
        }
      }
    }
    return null;
  }
  
  /**
   * Render floor as ASCII string (for debugging or display)
   */
  renderToString() {
    let output = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.grid[y][x];
        
        // Check if there's a character here
        let char = tile.getChar();
        if (tile.occupiedBy) {
          char = '@'; // Character marker
        }
        
        output += char;
      }
      output += '\n';
    }
    return output;
  }
  
  /**
   * Get render data for the Surveillance View
   * Returns a 2D array of { char, color, bgColor, characterId }
   */
  getRenderData() {
    const data = [];
    
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const tile = this.grid[y][x];
        
        row.push({
          char: tile.getChar(),
          type: tile.type.id,
          walkable: tile.type.walkable,
          roomId: tile.roomId,
          characterId: tile.occupiedBy,
          ownerId: tile.ownerId
        });
      }
      data.push(row);
    }
    
    return data;
  }
  
  /**
   * Serialize for saving
   */
  serialize() {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      // Only save non-void tiles for efficiency
      tiles: this.grid.flatMap((row, y) =>
        row.filter(tile => tile.type.id !== 'void')
          .map(tile => ({
            x: tile.x,
            y: tile.y,
            ...tile.serialize()
          }))
      ),
      rooms: Array.from(this.rooms.values()).map(r => r.serialize()),
      elevatorPositions: this.elevatorPositions,
      spawnPoints: this.spawnPoints
    };
  }
  
  /**
   * Deserialize from save
   */
  static deserialize(data) {
    const floor = new Floor(data.id, data.name, data.width, data.height);
    
    // Restore tiles
    for (const tileData of data.tiles) {
      const tile = floor.getTile(tileData.x, tileData.y);
      if (tile) {
        tile.type = getTileType(tileData.typeId);
        tile.roomId = tileData.roomId;
        tile.ownerId = tileData.ownerId;
      }
    }
    
    // Restore rooms
    for (const roomData of data.rooms) {
      const roomType = getRoomType(roomData.typeId);
      if (roomType) {
        const room = new Room(roomType, roomData.id, roomData.bounds);
        room.ownerId = roomData.ownerId;
        room.departmentId = roomData.departmentId;
        floor.rooms.set(room.id, room);
      }
    }
    
    floor.elevatorPositions = data.elevatorPositions;
    floor.spawnPoints = data.spawnPoints;
    
    return floor;
  }
}

export default Floor;
