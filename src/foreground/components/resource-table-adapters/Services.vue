<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t('page.resource.name') }}</th>
        <th>{{ $t('page.resource.type') }}</th>
        <th>{{ $t('page.resource.ports') }}</th>
        <th>{{ $t('page.resource.created') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid" @click="handleSelect(item)">
        <td>{{ item.metadata.name }}</td>
        <td>{{ item.spec.type }}</td>
        <td>{{ formatPorts(item.spec.ports) }}</td>
        <td>{{ formatAge(item.metadata.creationTimestamp, $i18n.locale) }}</td>
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
      if (!ports) {
        return '-';
      }

      return ports.map((({ port, targetPort, protocol }) => {
        let value = `${targetPort}/${protocol}`;

        if (port !== targetPort) {
          value = `${port}:${value}`;
        }

        return value;
      })).join(',')
    },
    handleSelect(item) {
      this.$emit('select', item);
    }
  }
}
</script>
