export const resources = [
  {
    icon: 'bi-boxes',
    name: 'runtime',
    resources: [
      'pods',
      'replicasets',
      'deployments',
      'jobs',
      'cronjobs'
    ]
  },
  {
    name: 'configuration',
    icon: 'bi-gear',
    resources: [
      'configmaps',
      'secrets'
    ]
  },
  {
    name: 'connectivity',
    icon: 'bi-ethernet',
    resources: [
      'services',
      'ingresses',
      'networkpolicies'
    ]
  },
  {
    name: 'security',
    icon: 'bi-lock',
    resources: [
      'serviceaccounts',
      'roles',
      'rolebindings'
    ]
  }
];
