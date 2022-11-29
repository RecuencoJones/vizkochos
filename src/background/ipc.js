const { resolve } = require('path');
const { readdir } = require('fs/promises');
const { ipcMain, shell } = require('electron');
const { KubeConfig, CoreV1Api, BatchV1Api, AppsV1Api, NetworkingV1Api, RbacAuthorizationV1Api } = require('@kubernetes/client-node');
const { getDB, saveDB } = require('./db');
const { loadKubeConfig } = require('./kubernetes');
const { methodForResourceType, apiForResourceType } = require('./mappings');
const { getLogEmitter, stopLogEmitter } = require('./logs');
const { setMenu } = require('./menu');
const { kubeDir, userAppHome } = require('./constants');
const { reloadLanguage } = require('./i18n');

async function getContextForName(name) {
  const db = await getDB();
  const context = db.contexts.find((context) => context.name === name);

  if (!context) {
    throw new Error(`There is no context with name: ${ name }`);
  }

  return context;
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
    const config = await loadKubeConfig(context);

    const client = config.makeApiClient(apiForResourceType[resourceType]);

    const data = await client[methodForResourceType[resourceType]](context.namespace);

    return data.body.items;
  });

  ipcMain.handle('listRecentViews', async () => {
    const db = await getDB();

    return db.recents;
  });

  ipcMain.handle('clearRecentViews', async () => {
    const db = await getDB();

    db.recents = [];

    await saveDB(db);
  });

  ipcMain.handle('addRecentView', async (event, view) => {
    const db = await getDB();

    db.recents = db.recents || [];

    hoistOrUnshift(db.recents, view, (view) => view.path);

    db.recents = db.recents.slice(0, 5).filter(Boolean);

    await saveDB(db);
  });

  ipcMain.handle('getContextOverview', async (event, contextName) => {
    const context = await getContextForName(contextName);
    const config = await loadKubeConfig(context);

    const coreClient = config.makeApiClient(CoreV1Api);
    const appsClient = config.makeApiClient(AppsV1Api);
    const batchClient = config.makeApiClient(BatchV1Api);
    const netClient = config.makeApiClient(NetworkingV1Api);
    const rbacClient = config.makeApiClient(RbacAuthorizationV1Api);

    const results = await Promise.all([
      coreClient.listNamespacedPod(context.namespace),
      appsClient.listNamespacedReplicaSet(context.namespace),
      appsClient.listNamespacedDeployment(context.namespace),
      batchClient.listNamespacedJob(context.namespace),
      batchClient.listNamespacedCronJob(context.namespace),
      coreClient.listNamespacedConfigMap(context.namespace),
      coreClient.listNamespacedSecret(context.namespace),
      coreClient.listNamespacedService(context.namespace),
      netClient.listNamespacedIngress(context.namespace),
      netClient.listNamespacedNetworkPolicy(context.namespace),
      coreClient.listNamespacedServiceAccount(context.namespace),
      rbacClient.listNamespacedRole(context.namespace),
      rbacClient.listNamespacedRoleBinding(context.namespace)
    ]);

    const [
      pods, replicasets, deployments, jobs, cronjobs,
      configmaps, secrets,
      services, ingresses, networkpolicies,
      serviceaccounts, roles, rolebindings
    ] = results.map((data) => data.body.items.length);

    return {
      pods, replicasets, deployments, jobs, cronjobs,
      configmaps, secrets,
      services, ingresses, networkpolicies,
      serviceaccounts, roles, rolebindings
    };
  });

  ipcMain.handle('subscribeToContainerLogs', async (event, contextName, podName, containerName) => {
    const context = await getContextForName(contextName);
    const emitter = await getLogEmitter(context, podName, containerName);

    console.log('subscribe to', `logs:${ context.namespace }:${ podName }:${ containerName }`);

    emitter.on('data', (data) => {
      event.sender.send(`logs:${ podName }:${ containerName }`, data);
    });
  });

  ipcMain.handle('unsubscribeFromContainerLogs', async (event, contextName, podName, containerName) => {
    const context = await getContextForName(contextName);

    console.log('unsubscribe from', `logs:${ context.namespace }:${ podName }:${ containerName }`);

    stopLogEmitter(context, podName, containerName);
  });

  ipcMain.handle('getPreferences', async () => {
    const db = await getDB();

    return db.preferences || {};
  });

  ipcMain.handle('savePreferences', async (event, data) => {
    const db = await getDB();

    db.preferences = data;

    await saveDB(db);

    await reloadLanguage();
    setMenu();
  });

  const openGitHubRepository = () => shell.openExternal('https://github.com/RecuencoJones/vizkochos');

  ipcMain.on('openGitHubRepository', openGitHubRepository);
  ipcMain.handle('openGitHubRepository', openGitHubRepository);
  ipcMain.handle('openUrl', (event, url) => shell.openExternal(url));
  ipcMain.handle('openAppDataLocation', () => shell.openPath(userAppHome));
}

module.exports = { registerIpcHandlers };
