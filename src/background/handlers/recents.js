const { getDB, saveDB } = require('../services/db');

function hoistOrUnshift(array, item, keyOf) {
  const index = array.findIndex((i) => keyOf(i) === keyOf(item));

  if (~index) {
    array.splice(index, 1);
  }

  array.unshift(item);
}

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function useRecentHandlers(ipc) {
  ipc.handle('listRecentViews', async () => {
    const db = await getDB();

    return db.recents;
  });

  ipc.handle('clearRecentViews', async () => {
    const db = await getDB();

    db.recents = [];

    await saveDB(db);
  });

  ipc.handle('addRecentView', async (event, view) => {
    const db = await getDB();

    db.recents = db.recents || [];

    hoistOrUnshift(db.recents, view, (view) => view.path);

    db.recents = db.recents.slice(0, 5).filter(Boolean);

    await saveDB(db);
  });
}

module.exports = { useRecentHandlers };
