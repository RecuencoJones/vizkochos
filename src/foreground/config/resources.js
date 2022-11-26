export const resources = [
  {
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
    resources: [
      'configmaps',
      'secrets'
    ]
  },
  {
    name: 'Connectivity',
    resources: [
      'services',
      'ingresses',
      'networkpolicies'
    ]
  }
];
