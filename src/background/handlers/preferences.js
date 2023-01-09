const { shell } = require('electron');
const { setMenu } = require('../menu');
const { getDB, saveDB } = require('../services/db');
const { reloadLanguage } = require('../services/languages');
const { userAppHome } = require('../constants');
const { purgeLogs, viewLogs } = require('../logger');

function withDefaultPreferences(data = {}) {
  data.refreshResourcesListSeconds ??= 2;

  return data;
}

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function usePreferenceHandlers(ipc) {
  ipc.handle('getPreferences', async () => {
    const db = await getDB();

    return withDefaultPreferences(db.preferences || {});
  });

  ipc.handle('savePreferences', async (event, data) => {
    const db = await getDB();

    db.preferences = data;

    await saveDB(db);

    await reloadLanguage();
    await setMenu();
  });

  ipc.handle('openAppDataLocation', () => shell.openPath(userAppHome));
  ipc.handle('viewLogs', async () => {
    await viewLogs();
  });
  ipc.handle('purgeLogs', async () => {
    await purgeLogs();
  });
  ipc.handle('purgeAllData', async () => {
    await saveDB({});
    await purgeLogs();
  });
}

module.exports = { usePreferenceHandlers };
