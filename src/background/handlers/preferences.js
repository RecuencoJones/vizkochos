const { resolve } = require('path');
const { shell } = require('electron');
const { setMenu } = require('../menu');
const { getDB, saveDB } = require('../services/db');
const { reloadLanguage } = require('../services/languages');
const { userAppHome, logFile } = require('../constants');
const { purgeLogs } = require('../logger');

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function usePreferenceHandlers(ipc) {
  ipc.handle('getPreferences', async () => {
    const db = await getDB();

    return db.preferences || {};
  });

  ipc.handle('savePreferences', async (event, data) => {
    const db = await getDB();

    db.preferences = data;

    await saveDB(db);

    await reloadLanguage();
    await setMenu();
  });

  ipc.handle('openAppDataLocation', () => shell.openPath(userAppHome));
  ipc.handle('viewLogs', () => shell.openPath(resolve(userAppHome, logFile)));
  ipc.handle('purgeLogs', async () => {
    await purgeLogs();
  });
  ipc.handle('purgeAllData', async () => {
    await saveDB({});
    await purgeLogs();
  });
}

module.exports = { usePreferenceHandlers };
