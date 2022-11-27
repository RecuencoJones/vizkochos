const { resolve } = require('path');
const { app, BrowserWindow, screen } = require('electron');
const { registerIpcHandlers } = require('./ipc');
const { isDevelopment } = require('./constants');
const { setMenu } = require('./menu');
const { windows } = require('./windows');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js')
    }
  });

  if (isDevelopment) {
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools();
  } else {
    const productionHtml = resolve(__dirname, '..', '..', 'dist', 'index.html');
    window.loadFile(productionHtml);
  }

  windows.set('appWindow', window);
};

async function main() {
  await app.whenReady();

  setMenu();
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
