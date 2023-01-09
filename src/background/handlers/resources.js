const { getContextForName, loadKubeConfig, apiForResourceType, methodForResourceType, getLogEmitter, stopLogEmitter } = require('../services/kubernetes');
const { logger } = require('../logger');

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function useResourceHandlers(ipc) {
  ipc.handle('listResourceType', async (event, contextName, resourceType) => {
    const context = await getContextForName(contextName);
    const config = await loadKubeConfig(context);

    const client = config.makeApiClient(apiForResourceType[resourceType]);

    const data = await client[methodForResourceType[resourceType].list](context.namespace, true);

    return data.body.items;
  });

  ipc.handle('deleteResourceType', async (event, contextName, resourceType, resourceName) => {
    const context = await getContextForName(contextName);
    const config = await loadKubeConfig(context);

    const client = config.makeApiClient(apiForResourceType[resourceType]);

    await client[methodForResourceType[resourceType].delete](resourceName, context.namespace);
  });

  ipc.handle('subscribeToContainerLogs', async (event, contextName, podName, containerName) => {
    const context = await getContextForName(contextName);
    const emitter = await getLogEmitter(context, podName, containerName);

    logger.info(`subscribe to logs:${ context.namespace }:${ podName }:${ containerName }`);

    emitter?.on('data', (data) => {
      event.sender.send(`logs:${ podName }:${ containerName }`, data);
    });
  });

  ipc.handle('unsubscribeFromContainerLogs', async (event, contextName, podName, containerName) => {
    const context = await getContextForName(contextName);

    logger.info(`unsubscribe from logs:${ context.namespace }:${ podName }:${ containerName }`);

    stopLogEmitter(context, podName, containerName);
  });
}

module.exports = { useResourceHandlers };
