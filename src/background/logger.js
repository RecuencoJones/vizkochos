const fs = require('fs');
const { resolve } = require('path');
const { shell } = require('electron');
const { createLogger, transports, format } = require('winston');
const { userAppHome, logFile } = require('./constants');

const filename = resolve(userAppHome, logFile);

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [
    new transports.File({ filename }),
    new transports.Console()
  ]
});

async function viewLogs() {
  await shell.openPath(resolve(userAppHome, logFile));
}

async function purgeLogs() {
  try {
    await fs.promises.unlink(filename);
  } catch {}
}

module.exports = { logger, viewLogs, purgeLogs };
