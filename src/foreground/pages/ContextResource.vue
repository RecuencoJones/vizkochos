<template>
  <section class="resource">
    <nav class="toolbar">
      <button @click="handleRefresh">refresh</button>
    </nav>
    <div class="view">
      <table v-if="resource === 'pods'">
        <thead>
          <tr>
            <th>Name</th>
            <th>Containers</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items" :key="item.metadata.uid">
            <td>{{ item.metadata.name }}</td>
            <td>{{ item.status.containerStatuses.filter((c) => c.ready).length }}/{{ item.status.containerStatuses.length }}</td>
            <td>{{ item.status.phase }}</td>
            <td>{{ formatAge(item.metadata.creationTimestamp) }}</td>
          </tr>
        </tbody>
      </table>
      <table v-else-if="resource === 'services'">
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
      <table v-else-if="resource === 'ingresses'">
        <thead>
          <tr>
            <th>Name</th>
            <th>URLs</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items" :key="item.metadata.uid">
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
      <table v-else>
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
    </div>
  </section>
</template>

<script>
import { DateTime } from 'luxon';
import { useContext } from '../use/context';
import { useResource } from '../use/resource';

export default {
  setup() {
    return {
      ...useContext(),
      ...useResource()
    };
  },
  data() {
    return {
      items: null
    };
  },
  methods: {
    formatAge(timestamp) {
      const createdDate = DateTime.fromMillis(Date.parse(timestamp));

      return createdDate.toRelative({ style: 'short' });
    },
    formatPorts(ports) {
      return ports.map((({ port, targetPort, protocol }) => {
        let value = `${targetPort}/${protocol}`;

        if (port !== targetPort) {
          value = `${port}:${value}`;
        }

        return value;
      })).join(',')
    },
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
    async loadResourceItems() {
      this.items = null;
      const context = this.context;
      const resource = this.resource;

      if (context && resource) {
        this.items = await api.listResourceType(context, resource);
      }
    },
    async handleRefresh() {
      await this.loadResourceItems();
    }
  },
  watch: {
    resource: {
      immediate: true,
      async handler() {
        await this.loadResourceItems();
      }
    }
  }
}
</script>

<style lang="scss">
.resource {
  height: 100%;
  display: flex;
  flex-direction: column;

  .toolbar {
    flex: 0;
  }

  .view {
    flex: 1;
    height: 100%;
    overflow: auto;
  }

  table {
    width: 100%;
    white-space: nowrap;
    border-collapse: collapse;

    thead th {
      position: sticky;
      top: 0;
      background: white;
    }

    th {
      text-align: start;
    }

    td, th {
      padding: .5rem 1rem;
    }

    tbody tr:hover {
      background: #eee;
    }
  }
}
</style>
