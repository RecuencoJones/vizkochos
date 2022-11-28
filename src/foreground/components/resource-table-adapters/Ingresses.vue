<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t('page.resource.name') }}</th>
        <th>URLs</th>
        <th>{{ $t('page.resource.created') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of items" :key="item.metadata.uid" @click="handleSelect(item)">
        <td>{{ item.metadata.name }}</td>
        <td>
          <template v-for="rule of formatRules(item.spec)" :key="rule">
            <a href="#" @click="openUrl(rule.url)">{{ rule.url }}</a> &rarr; {{ rule.service }}
            <br/>
          </template>
        </td>
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
    },
    async openUrl(url) {
      await api.openUrl(url);
    }
  }
}
</script>
