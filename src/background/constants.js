const { homedir } = require('os');
const { resolve } = require('path');

const isDevelopment = process.env.MODE === 'development';
const kubeDir = resolve(homedir(), '.kube');
const userAppHome = resolve(homedir(), '.vizkochos');
const dbFile = 'db.json';
const logFile = 'log.txt';

module.exports = { isDevelopment, kubeDir, userAppHome, dbFile, logFile };
