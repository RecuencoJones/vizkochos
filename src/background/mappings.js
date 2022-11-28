const { CoreV1Api, NetworkingV1Api, AppsV1Api, BatchV1Api, RbacAuthorizationV1Api } = require('@kubernetes/client-node');

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

module.exports = { methodForResourceType, apiForResourceType };
