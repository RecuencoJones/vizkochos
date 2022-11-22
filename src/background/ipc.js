const { homedir } = require('os');
const { resolve } = require('path');
const { readdir } = require('fs/promises');
const { ipcMain } = require('electron');
const { KubeConfig } = require('@kubernetes/client-node');
const { getDB, saveDB } = require('./db');
const { methodForResourceType, apiForResourceType } = require('./mappings');

const kubeDir = resolve(homedir(), '.kube');

async function getContextForName(name) {
  const db = await getDB();
  const context = db.contexts.find((context) => context.name === name);

  if (!context) {
    throw new Error(`There is no context with name: ${ name }`)
  }

  return context;
}

function loadKubeConfig(context) {
  const config = new KubeConfig();
  config.loadFromFile(resolve(context.config));

  const cluster = config.getCluster(context.cluster);
  const user = config.getUser(context.user);

  config.loadFromClusterAndUser(cluster, user);

  return config;
}

function hoistOrUnshift(array, item, keyOf) {
  const index = array.findIndex((i) => keyOf(i) === keyOf(item));

  if (~index) {
    array.splice(index, 1);
  }

  array.unshift(item);
}

function registerIpcHandlers() {
  ipcMain.handle('listConfigs', async () => {
    const data = await readdir(kubeDir, { withFileTypes: true });

    return data
      .filter((item) => item.isFile() && !item.name.startsWith('.'))
      .map((item) => ({
        name: item.name,
        path: resolve(kubeDir, item.name)
      }));
  });

  ipcMain.handle('listClusters', async (event, kubeconfig) => {
    const config = new KubeConfig();

    config.loadFromFile(resolve(kubeconfig));

    return config.getClusters().map((cluster) => cluster.name);
  });

  ipcMain.handle('listUsers', async (event, kubeconfig) => {
    const config = new KubeConfig();

    config.loadFromFile(resolve(kubeconfig));

    console.log(kubeconfig)

    return config.getUsers().map((user) => user.name);
  });

  ipcMain.handle('saveContext', async (event, context) => {
    const db = await getDB();

    db.contexts = db.contexts || [];

    const index = db.contexts.findIndex((ctx) => ctx.name === context.name);

    if (~index) {
      db.contexts[index] = context;
    } else {
      db.contexts.push(context);
    }

    await saveDB(db);
  });

  ipcMain.handle('listContexts', async () => {
    const db = await getDB();

    return db.contexts;
  });

  ipcMain.handle('getContext', async (event, contextName) => {
    const context = await getContextForName(contextName);

    return context;
  });

  ipcMain.handle('listResourceType', async (event, contextName, resourceType) => {
    const context = await getContextForName(contextName);
    const config = loadKubeConfig(context);

    const client = config.makeApiClient(apiForResourceType[resourceType]);

    const data = await client[methodForResourceType[resourceType]](context.namespace);

    return data.body.items;
  });

  ipcMain.handle('listRecentViews', async () => {
    const db = await getDB();

    return db.recents;
  });

  ipcMain.handle('addRecentView', async (event, view) => {
    const db = await getDB();

    db.recents = db.recents || [];

    hoistOrUnshift(db.recents, view, (view) => view.path)

    db.recents = db.recents.slice(0, 5).filter(Boolean);

    await saveDB(db);
  });
}

module.exports = { registerIpcHandlers };
