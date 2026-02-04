/**
 * Save Manager - Handles persistent storage
 * 
 * Uses localStorage for web/dev, file system for Electron/Steam
 */

const SAVE_KEY = 'cognitive_game_accounts';

/**
 * Check if we're running in Electron
 */
function isElectron() {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
}

/**
 * Save accounts data
 * @param {Array} accounts - Array of account objects
 */
export async function saveAccounts(accounts) {
  const data = JSON.stringify(accounts, null, 2);
  
  if (isElectron()) {
    // Use Electron IPC to save to file system
    try {
      await window.electronAPI.saveGame(data);
    } catch (error) {
      console.error('Failed to save via Electron:', error);
      // Fallback to localStorage
      localStorage.setItem(SAVE_KEY, data);
    }
  } else {
    // Web/dev mode - use localStorage
    localStorage.setItem(SAVE_KEY, data);
  }
}

/**
 * Load accounts data
 * @returns {Array} Array of account objects
 */
export async function loadAccounts() {
  if (isElectron()) {
    try {
      const data = await window.electronAPI.loadGame();
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load via Electron:', error);
      // Fallback to localStorage
    }
  }
  
  // Web/dev mode or fallback - use localStorage
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse saved data:', error);
    }
  }
  
  return [];
}

/**
 * Delete all save data (for testing)
 */
export async function clearAllSaves() {
  if (isElectron()) {
    try {
      await window.electronAPI.clearSaves();
    } catch (error) {
      console.error('Failed to clear via Electron:', error);
    }
  }
  
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Export save data as JSON string (for manual backup)
 */
export function exportSaveData(accounts) {
  return JSON.stringify(accounts, null, 2);
}

/**
 * Import save data from JSON string
 */
export function importSaveData(jsonString) {
  try {
    const accounts = JSON.parse(jsonString);
    if (Array.isArray(accounts)) {
      return accounts;
    }
  } catch (error) {
    console.error('Failed to import save data:', error);
  }
  return null;
}
