const { logger } = require('../logger');
const { setMenu } = require('../menu');
const { getDB, saveDB } = require('../services/db');

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function usePinHandlers(ipc) {
  ipc.handle('listPins', async () => {
    const db = await getDB();

    return db.pinned;
  });

  ipc.handle('clearPins', async () => {
    const db = await getDB();

    db.pinned = [];

    await saveDB(db);
  });

  ipc.handle('addPin', async (event, pin) => {
    const db = await getDB();

    db.pinned = db.pinned || [];
    db.pinned.push(pin);

    if (db.pinned.length === 10) {
      logger.warn('limited to 10 pins');

      return;
    }

    await saveDB(db);
    await setMenu();
  });
}

module.exports = { usePinHandlers };
