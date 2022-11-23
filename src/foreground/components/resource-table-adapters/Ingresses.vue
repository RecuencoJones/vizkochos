<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>URLs</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid" @click="handleSelect(item)">
        <td>{{ item.metadata.name }}</td>
        <td>
          <template v-for="rule of formatRules(item.spec)" :key="rule">
            <a :href="rule.url" target="_blank" rel="noopener noreferrer">{{ rule.url }}</a> &rarr; {{ rule.service }}
            <br/>
          </template>
        </td>
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
    formatRules({ rules, tls }) {
      const urls = [];

      rules.forEach((rule) => {
        const isHttps = tls?.some(({ hosts }) => hosts.some((host) => rule.host === host));

        rule.http?.paths.forEach(({ path, backend }) => {
          urls.push({
            url: `${ isHttps ? 'https' : 'http' }://${ rule.host }${ path }`,
            service: `${ backend?.service?.name }:${ backend?.service?.port.number }`
          });
        });
      });

      return urls;
    },
    handleSelect(item) {
      this.$emit('select', item);
    }
  }
}
</script>
