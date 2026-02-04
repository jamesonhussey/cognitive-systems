const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production';

// Get save directory path
function getSaveDirectory() {
  // Use app.getPath('userData') for proper OS-specific location
  // Windows: C:\Users\<user>\AppData\Roaming\<app>
  // Mac: ~/Library/Application Support/<app>
  // Linux: ~/.config/<app>
  return app.getPath('userData');
}

function getSaveFilePath() {
  return path.join(getSaveDirectory(), 'save_data.json');
}

// Ensure save directory exists
function ensureSaveDirectory() {
  const dir = getSaveDirectory();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    backgroundColor: '#0a0a0f',
    show: false
  });

  // Remove menu bar for cleaner look
  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });
}

// IPC Handlers for save/load
ipcMain.handle('save-game', async (event, data) => {
  try {
    ensureSaveDirectory();
    fs.writeFileSync(getSaveFilePath(), data, 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Save error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-game', async () => {
  try {
    const filePath = getSaveFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return data;
    }
    return null;
  } catch (error) {
    console.error('Load error:', error);
    return null;
  }
});

ipcMain.handle('clear-saves', async () => {
  try {
    const filePath = getSaveFilePath();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (error) {
    console.error('Clear error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-save-path', async () => {
  return getSaveFilePath();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
