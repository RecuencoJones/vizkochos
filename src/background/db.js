const { readFile, writeFile } = require('fs/promises');

const dbPath = 'db.json';

async function getDB() {
  try {
    const contents = await readFile(dbPath, 'utf8');

    return JSON.parse(contents);
  } catch {
    return {};
  }
}

async function saveDB(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { getDB, saveDB }
