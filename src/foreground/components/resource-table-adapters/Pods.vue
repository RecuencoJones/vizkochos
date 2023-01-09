<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t('page.resource.name') }}</th>
        <th>{{ $t('page.resource.containers') }}</th>
        <th>{{ $t('page.resource.status') }}</th>
        <th>{{ $t('page.resource.created') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid + '-' + item.metadata.creationTimestamp" @click="handleSelect(item)">
        <td>{{ item.metadata.name }}</td>
        <td v-if="item.status.containerStatuses">
          {{ item.status.containerStatuses.filter((c) => c.ready).length }}/{{ item.status.containerStatuses.length }}
        </td>
        <td v-else>-/-</td>
        <td>{{ item.status.phase }}</td>
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
    handleSelect(item) {
      this.$emit('select', item);
    }
  }
}
</script>
