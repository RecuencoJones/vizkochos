const { resolve } = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const { KubeConfig } = require('@kubernetes/client-node');

const asyncExec = promisify(exec);

async function attemptRefreshToken(context) {
  try {
    await asyncExec(`kubectl version --user ${context.user} --cluster ${context.cluster}`);
  } catch (err) {
    console.error('Failed to refresh token');
  }
}

async function loadKubeConfig(context) {
  await attemptRefreshToken(context);

  const config = new KubeConfig();

  config.loadFromFile(resolve(context.config));

  const cluster = config.getCluster(context.cluster);
  const user = config.getUser(context.user);

  config.loadFromClusterAndUser(cluster, user);

  return config;
}

module.exports = { loadKubeConfig };
