const { resolve } = require('path');
const { mkdirSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { isDevelopment, userAppHome, dbFile } = require('../constants');

const dbPath = isDevelopment ? dbFile : resolve(userAppHome, dbFile);

if (!isDevelopment) {
  mkdirSync(userAppHome, { recursive: true });
}

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

module.exports = { getDB, saveDB };
