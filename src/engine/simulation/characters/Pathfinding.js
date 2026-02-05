/**
 * PATHFINDING
 * 
 * A* pathfinding implementation for character movement.
 * Finds the shortest path between two points on a floor grid.
 */

// ============================================
// A* PATHFINDING
// ============================================

/**
 * Find path between two points on a floor
 * @param {Floor} floor - The floor to pathfind on
 * @param {number} startX - Starting X position
 * @param {number} startY - Starting Y position
 * @param {number} endX - Target X position
 * @param {number} endY - Target Y position
 * @returns {Array<{x, y}>} Array of positions forming the path, or empty if no path
 */
export function findPath(floor, startX, startY, endX, endY) {
  // Early exit if start or end is not walkable
  if (!floor.isWalkable(startX, startY) && !(startX === endX && startY === endY)) {
    // Allow starting from current position even if "occupied"
  }
  
  // If we're already at destination
  if (startX === endX && startY === endY) {
    return [];
  }
  
  const openSet = new Set();
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  
  const key = (x, y) => `${x},${y}`;
  const heuristic = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  
  // Initialize start node
  const startKey = key(startX, startY);
  openSet.add(startKey);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(startX, startY, endX, endY));
  
  // Store positions for lookup
  const positions = new Map();
  positions.set(startKey, { x: startX, y: startY });
  
  // Neighbor offsets (4-directional movement)
  const neighbors = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }  // Left
  ];
  
  let iterations = 0;
  const maxIterations = floor.width * floor.height; // Prevent infinite loops
  
  while (openSet.size > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find node in openSet with lowest fScore
    let currentKey = null;
    let lowestF = Infinity;
    
    for (const nodeKey of openSet) {
      const f = fScore.get(nodeKey) || Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = nodeKey;
      }
    }
    
    if (!currentKey) break;
    
    const current = positions.get(currentKey);
    
    // Check if we've reached the goal
    if (current.x === endX && current.y === endY) {
      return reconstructPath(cameFrom, positions, currentKey);
    }
    
    openSet.delete(currentKey);
    closedSet.add(currentKey);
    
    // Check all neighbors
    for (const { dx, dy } of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const neighborKey = key(nx, ny);
      
      // Skip if already evaluated
      if (closedSet.has(neighborKey)) continue;
      
      // Skip if not walkable (unless it's the destination)
      const isDestination = nx === endX && ny === endY;
      if (!isDestination && !floor.isWalkable(nx, ny)) continue;
      
      // Calculate tentative gScore
      const tentativeG = (gScore.get(currentKey) || 0) + 1;
      
      // Discover a new node
      if (!openSet.has(neighborKey)) {
        openSet.add(neighborKey);
        positions.set(neighborKey, { x: nx, y: ny });
      } else if (tentativeG >= (gScore.get(neighborKey) || Infinity)) {
        continue; // Not a better path
      }
      
      // This is the best path so far
      cameFrom.set(neighborKey, currentKey);
      gScore.set(neighborKey, tentativeG);
      fScore.set(neighborKey, tentativeG + heuristic(nx, ny, endX, endY));
    }
  }
  
  // No path found
  return [];
}

/**
 * Reconstruct path from cameFrom map
 */
function reconstructPath(cameFrom, positions, endKey) {
  const path = [];
  let currentKey = endKey;
  
  while (cameFrom.has(currentKey)) {
    const pos = positions.get(currentKey);
    path.unshift({ x: pos.x, y: pos.y });
    currentKey = cameFrom.get(currentKey);
  }
  
  return path;
}

/**
 * Get next step towards a target (without full pathfinding)
 * Useful for simple movement or when path is blocked
 */
export function getNextStep(floor, fromX, fromY, toX, toY) {
  // Calculate direction
  let dx = 0, dy = 0;
  
  if (fromX < toX) dx = 1;
  else if (fromX > toX) dx = -1;
  
  if (fromY < toY) dy = 1;
  else if (fromY > toY) dy = -1;
  
  // Try primary direction
  if (dx !== 0 && floor.isWalkable(fromX + dx, fromY)) {
    return { x: fromX + dx, y: fromY };
  }
  
  if (dy !== 0 && floor.isWalkable(fromX, fromY + dy)) {
    return { x: fromX, y: fromY + dy };
  }
  
  // Try diagonal
  if (dx !== 0 && dy !== 0 && floor.isWalkable(fromX + dx, fromY + dy)) {
    return { x: fromX + dx, y: fromY + dy };
  }
  
  // Try perpendicular
  if (dx !== 0) {
    if (floor.isWalkable(fromX, fromY + 1)) return { x: fromX, y: fromY + 1 };
    if (floor.isWalkable(fromX, fromY - 1)) return { x: fromX, y: fromY - 1 };
  }
  
  if (dy !== 0) {
    if (floor.isWalkable(fromX + 1, fromY)) return { x: fromX + 1, y: fromY };
    if (floor.isWalkable(fromX - 1, fromY)) return { x: fromX - 1, y: fromY };
  }
  
  // Can't move
  return null;
}

/**
 * Check if there's a clear line of sight between two points
 */
export function hasLineOfSight(floor, x1, y1, x2, y2) {
  // Bresenham's line algorithm
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  
  let x = x1;
  let y = y1;
  
  while (x !== x2 || y !== y2) {
    // Skip start position
    if (!(x === x1 && y === y1)) {
      // Skip end position
      if (!(x === x2 && y === y2)) {
        if (!floor.isWalkable(x, y)) {
          return false;
        }
      }
    }
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  
  return true;
}

/**
 * Get distance between two points (Manhattan distance)
 */
export function getDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export default {
  findPath,
  getNextStep,
  hasLineOfSight,
  getDistance
};
