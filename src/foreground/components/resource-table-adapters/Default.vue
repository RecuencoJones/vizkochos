<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid">
        <td>{{ item.metadata.name }}</td>
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
    formatAge
  }
}
</script>
