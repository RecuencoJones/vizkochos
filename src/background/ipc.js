const { ipcMain, shell } = require('electron');
const { usePinHandlers } = require('./handlers/pins');
const { useRecentHandlers } = require('./handlers/recents');
const { usePreferenceHandlers } = require('./handlers/preferences');
const { useContextHandlers } = require('./handlers/context');
const { useConfigHandlers } = require('./handlers/config');
const { useResourceHandlers } = require('./handlers/resources');

const openGitHubRepository = () => shell.openExternal('https://github.com/RecuencoJones/vizkochos');

function registerIpcHandlers() {
  useConfigHandlers(ipcMain);
  usePinHandlers(ipcMain);
  useRecentHandlers(ipcMain);
  useContextHandlers(ipcMain);
  useResourceHandlers(ipcMain);

  usePreferenceHandlers(ipcMain);

  ipcMain.on('openGitHubRepository', openGitHubRepository);
  ipcMain.handle('openGitHubRepository', openGitHubRepository);
  ipcMain.handle('openUrl', (event, url) => shell.openExternal(url));
}

module.exports = { registerIpcHandlers };
