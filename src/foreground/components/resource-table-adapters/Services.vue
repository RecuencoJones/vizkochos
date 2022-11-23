<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Ports</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid">
        <td>{{ item.metadata.name }}</td>
        <td>{{ item.spec.type }}</td>
        <td>{{ formatPorts(item.spec.ports) }}</td>
        <td>{{ formatAge(item.metadata.creationTimestamp) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { formatAge } from './shared';

export default {
  props: [ 'items' ],
  methods: {
    formatAge,
    formatPorts(ports) {
      return ports.map((({ port, targetPort, protocol }) => {
        let value = `${targetPort}/${protocol}`;

        if (port !== targetPort) {
          value = `${port}:${value}`;
        }

        return value;
      })).join(',')
    }
  }
}
</script>
