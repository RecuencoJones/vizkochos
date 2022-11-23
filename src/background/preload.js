const { contextBridge, ipcRenderer } = require('electron')

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
  )
})
