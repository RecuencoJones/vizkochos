const { homedir } = require('os');
const { resolve } = require('path');
const { mkdirSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { isDevelopment } = require('./constants');

const dbFileName = 'db.json';
const userAppHome = resolve(homedir(), '.vizkochos');
const dbPath = isDevelopment ? dbFileName : resolve(userAppHome, dbFileName);

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
