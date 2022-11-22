const { resolve } = require('path');
const { app, BrowserWindow, screen } = require('electron');
const { registerIpcHandlers } = require('./ipc');

const buildDir = resolve(__dirname, '..', '..', 'dist');

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js')
    }
  });

  if (app.isPackaged) {
    window.loadFile(resolve(buildDir, 'index.html'));
  } else {
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools();
  }
}

async function main() {
  await app.whenReady();

  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

app.on('window-all-closed', () => {
  app.quit();
});

main();
