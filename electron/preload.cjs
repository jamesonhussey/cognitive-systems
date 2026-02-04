const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Save/load game data
  saveGame: (data) => ipcRenderer.invoke('save-game', data),
  loadGame: () => ipcRenderer.invoke('load-game'),
  clearSaves: () => ipcRenderer.invoke('clear-saves'),
  getSavePath: () => ipcRenderer.invoke('get-save-path'),
  
  // Platform info
  isElectron: true
});
