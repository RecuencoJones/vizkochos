const { contextBridge, ipcRenderer } = require('electron');

const invokify = (name) => (...args) => ipcRenderer.invoke(name, ...args);

const useLiteralInvokify = (...args) => args.reduce((accum, next) => ({
  [next]: invokify(next),
  ...accum
}), {});

contextBridge.exposeInMainWorld('api', {
  ...useLiteralInvokify(
    'listConfigs',
    'listClusters',
    'listUsers',
    'getContext',
    'saveContext',
    'listContexts',
    'addRecentView',
    'listRecentViews',
    'listResourceType',
    'getContextOverview'
  ),
  async subscribeToContainerLogs(contextName, podName, containerName, fn) {
    ipcRenderer.on(`logs:${ podName }:${ containerName }`, fn);
    await ipcRenderer.invoke('subscribeToContainerLogs', contextName, podName, containerName);
  },
  async unsubscribeFromContainerLogs(contextName, podName, containerName) {
    ipcRenderer.removeAllListeners(`logs:${ podName }:${ containerName }`);
    await ipcRenderer.invoke('unsubscribeFromContainerLogs', contextName, podName, containerName);
  }
});
