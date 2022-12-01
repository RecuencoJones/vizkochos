const { resolve } = require('path');
const { app, BrowserWindow, screen } = require('electron');
const { registerIpcHandlers } = require('./ipc');
const { isDevelopment } = require('./constants');
const { setMenu } = require('./menu');
const { instances } = require('./instances');
const { initLanguages } = require('./services/languages');
const { logger } = require('./logger');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const window = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js')
    }
  });

  if (isDevelopment) {
    logger.info('running in dev mode');
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    const productionHtml = resolve(__dirname, '..', '..', 'dist', 'index.html');
    window.loadFile(productionHtml);
  }

  instances.set('appWindow', window);
}

function attachToProcessEvents() {
  ['unhandledRejection', 'uncaughtException'].map((type) => {
    process.on(type, async (error) => {
      logger.error(error.stack);
    });
  });
}

async function main() {
  logger.info('starting Vizkochos...');
  logger.info('app version: ' + app.getVersion());
  logger.info('node version: ' + process.versions.node);
  logger.info('electron version: ' + process.versions.electron);
  logger.info('platform: ' + process.platform + ' ' + process.arch);

  attachToProcessEvents();

  await app.whenReady();
  await initLanguages();
  await setMenu();

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
