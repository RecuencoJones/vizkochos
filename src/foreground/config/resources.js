export const resources = [
  {
    icon: 'bi-boxes',
    name: 'Runtime',
    resources: [
      'pods',
      'replicasets',
      'deployments',
      'jobs',
      'cronjobs'
    ]
  },
  {
    name: 'Configuration',
    icon: 'bi-gear',
    resources: [
      'configmaps',
      'secrets'
    ]
  },
  {
    name: 'Connectivity',
    icon: 'bi-ethernet',
    resources: [
      'services',
      'ingresses',
      'networkpolicies'
    ]
  }
];
