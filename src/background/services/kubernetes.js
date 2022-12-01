const { resolve } = require('path');
const { promisify } = require('util');
const { PassThrough } = require('stream');
const { EventEmitter } = require('events');
const { exec } = require('child_process');
const {
  KubeConfig, Log,
  CoreV1Api, NetworkingV1Api, AppsV1Api, BatchV1Api, RbacAuthorizationV1Api
} = require('@kubernetes/client-node');
const { logger } = require('../logger');
const { getDB, saveDB } = require('./db');

const methodForResourceType = {
  pods: 'listNamespacedPod',
  replicasets: 'listNamespacedReplicaSet',
  deployments: 'listNamespacedDeployment',
  jobs: 'listNamespacedJob',
  cronjobs: 'listNamespacedCronJob',
  configmaps: 'listNamespacedConfigMap',
  secrets: 'listNamespacedSecret',
  services: 'listNamespacedService',
  ingresses: 'listNamespacedIngress',
  networkpolicies: 'listNamespacedNetworkPolicy',
  serviceaccounts: 'listNamespacedServiceAccount',
  roles: 'listNamespacedRole',
  rolebindings: 'listNamespacedRoleBinding'
};

const apiForResourceType = {
  pods: CoreV1Api,
  replicasets: AppsV1Api,
  deployments: AppsV1Api,
  jobs: BatchV1Api,
  cronjobs: BatchV1Api,
  configmaps: CoreV1Api,
  secrets: CoreV1Api,
  services: CoreV1Api,
  ingresses: NetworkingV1Api,
  networkpolicies: NetworkingV1Api,
  serviceaccounts: CoreV1Api,
  roles: RbacAuthorizationV1Api,
  rolebindings: RbacAuthorizationV1Api
};

const asyncExec = promisify(exec);

async function attemptRefreshToken(context) {
  logger.debug(`refreshing token for context ${ JSON.stringify(context) }`);

  try {
    await asyncExec(`kubectl version --user ${context.user} --cluster ${context.cluster}`, {
      env: {
        KUBECONFIG: resolve(context.config)
      }
    });
  } catch (err) {
    logger.error('Failed to refresh token');
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

async function getContextForName(name) {
  const db = await getDB();
  const context = db.contexts.find((context) => context.name === name);

  if (!context) {
    throw new Error(`There is no context with name: ${ name }`);
  }

  return context;
}

async function deleteContextWithName(name) {
  const db = await getDB();
  const index = db.contexts.findIndex((context) => context.name === name);

  if (~index) {
    db.contexts.splice(index, 1);

    await saveDB(db);
  }
}

const emitterInstances = new Map();

const createLogStreamName = (namespace, podName, containerName) => `logs:${ namespace }:${ podName }:${ containerName }`;

class LogsEmitter extends EventEmitter {
  constructor(context, podName, containerName) {
    super();

    this.context = context;
    this.podName = podName;
    this.containerName = containerName;
  }

  async init() {
    const config = await loadKubeConfig(this.context);
    const log = new Log(config);

    this._stream = new PassThrough();

    this._stream.on('data', (chunk) => {
      this.emit('data', chunk.toString());
    });

    this._request = await log.log(
      this.context.namespace,
      this.podName,
      this.containerName,
      this._stream,
      { follow: true, tailLines: 20 }
    );
  }

  stop() {
    this._stream.destroy();
    this._request.abort();
  }
}

async function getLogEmitter(context, podName, containerName) {
  const streamName = createLogStreamName(context, podName, containerName);

  if (!emitterInstances.has(streamName)) {
    const instance = new LogsEmitter(context, podName, containerName);

    emitterInstances.set(streamName, instance);

    await instance.init();
  }

  return emitterInstances.get(streamName);
}

function stopLogEmitter(context, podName, containerName) {
  const streamName = createLogStreamName(context, podName, containerName);

  if (emitterInstances.has(streamName)) {
    const emitter = emitterInstances.get(streamName);

    emitter.stop();

    emitterInstances.delete(streamName);
  }
}

module.exports = {
  methodForResourceType, apiForResourceType,
  getContextForName, deleteContextWithName,
  loadKubeConfig, getLogEmitter, stopLogEmitter
};
