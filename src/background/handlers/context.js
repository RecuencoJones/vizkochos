const { CoreV1Api, AppsV1Api, BatchV1Api, NetworkingV1Api, RbacAuthorizationV1Api } = require('@kubernetes/client-node');
const { getDB, saveDB } = require('../services/db');
const { getContextForName, loadKubeConfig, deleteContextWithName } = require('../services/kubernetes');

/**
 * @param {import('electron').IpcMain} ipc bus
 */
function useContextHandlers(ipc) {
  ipc.handle('saveContext', async (event, context) => {
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

  ipc.handle('listContexts', async () => {
    const db = await getDB();

    return db.contexts;
  });

  ipc.handle('getContext', async (event, contextName) => {
    const context = await getContextForName(contextName);

    return context;
  });

  ipc.handle('deleteContext', async (event, contextName) => {
    await deleteContextWithName(contextName);
  });

  ipc.handle('getContextOverview', async (event, contextName) => {
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
}

module.exports = { useContextHandlers };
