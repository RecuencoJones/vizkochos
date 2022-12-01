const { resolve } = require('path');
const { readdir } = require('fs/promises');
const { KubeConfig } = require("@kubernetes/client-node");

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function useConfigHandlers(ipc) {
  ipc.handle('listConfigs', async () => {
    const data = await readdir(kubeDir, { withFileTypes: true });

    return data
      .filter((item) => item.isFile() && !item.name.startsWith('.'))
      .map((item) => ({
        name: item.name,
        path: resolve(kubeDir, item.name)
      }));
  });

  ipc.handle('listClusters', async (event, kubeconfig) => {
    const config = new KubeConfig();

    config.loadFromFile(resolve(kubeconfig));

    return config.getClusters().map((cluster) => cluster.name);
  });

  ipc.handle('listUsers', async (event, kubeconfig) => {
    const config = new KubeConfig();

    config.loadFromFile(resolve(kubeconfig));

    return config.getUsers().map((user) => user.name);
  });
}

module.exports = { useConfigHandlers };
