<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Containers</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid" @click="handleSelect(item)">
        <td>{{ item.metadata.name }}</td>
        <td>{{ item.status.containerStatuses.filter((c) => c.ready).length }}/{{ item.status.containerStatuses.length }}</td>
        <td>{{ item.status.phase }}</td>
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
    handleSelect(item) {
      this.$emit('select', item);
    }
  }
}
</script>
