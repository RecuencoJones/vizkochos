const { homedir } = require('os');
const { resolve } = require('path');

const isDevelopment = process.env.MODE === 'development';
const kubeDir = resolve(homedir(), '.kube');
const userAppHome = resolve(homedir(), '.vizkochos');

module.exports = { isDevelopment, kubeDir, userAppHome };
