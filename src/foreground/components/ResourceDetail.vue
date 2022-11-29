<template>
  <section class="resource-detail">
    <button class="btn btn--text" @click="handleClose" :title="$t('tooltip.close')"><i class="bi-x-lg" /></button>
    <h3>{{ item.metadata.name }}</h3>
    <details open>
      <summary>
        <strong><i class="bi-card-list" /> {{ $t('page.detail.details') }}</strong>
      </summary>
      <table class="data">
        <tbody>
          <tr>
            <th>{{ $t('page.detail.id') }}</th>
            <td class="copiable" @click="copyToClipboard(item.metadata.uid)">{{ item.metadata.uid }}</td>
          </tr>
          <tr>
            <th>{{ $t('page.detail.name') }}</th>
            <td class="copiable" @click="copyToClipboard(item.metadata.name)">{{ item.metadata.name }}</td>
          </tr>
          <tr v-if="item.metadata.labels">
            <th>{{ $t('page.detail.labels') }}</th>
            <td>
              <span v-for="(value, label) of item.metadata.labels" :key="label">
                {{ label }}: {{ value }}<br />
              </span>
            </td>
          </tr>
          <tr v-if="item.metadata.annotations">
            <th>{{ $t('page.detail.annotations') }}</th>
            <td>
              <span v-for="(value, label) of item.metadata.annotations" :key="label">
                {{ label }}: {{ value }}<br />
              </span>
            </td>
          </tr>
          <tr>
            <th>{{ $t('page.detail.created') }}</th>
            <td class="copiable" @click="copyToClipboard(item.metadata.creationTimestamp)">{{ formatTimestamp(item.metadata.creationTimestamp) }}</td>
          </tr>
          <tr v-if="item.status && item.status.phase">
            <th>{{ $t('page.detail.status') }}</th>
            <td class="copiable">{{ item.status.phase }}</td>
          </tr>
          <tr v-if="item.metadata.ownerReferences">
            <th>{{ $t('page.detail.owner') }}</th>
            <td>
              <span v-for="owner of item.metadata.ownerReferences" :key="owner.uid">
                {{ owner.kind }}: <router-link :to="'/contexts/' + context + '/' + owner.kind.toLowerCase() + 's?item=' + owner.name">{{ owner.name }}</router-link><br />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </details>
    <details v-if="item.spec && item.spec.containers" open>
      <summary>
        <strong><i class="bi-justify" /> {{ $t('page.detail.logs') }}</strong>
      </summary>
      <pre class="logs" ref="logs"><span v-for="(entry, index) in logs" :key="index">{{ entry }}</span></pre>
    </details>
    <details v-if="item.data" open>
      <summary>
        <strong>{{ $t('page.detail.data') }}</strong>
      </summary>
      <table class="data mono">
        <tbody>
          <tr v-for="(value, key) of item.data" :key="key">
            <th class="copiable" @click="copyToClipboard(key)">{{ key }}</th>
            <td class="copiable" @click="copyToClipboard(value)">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </details>
    <details>
      <summary>
        <strong><i class="bi-filetype-yml" /> {{ $t('page.detail.manifest') }}</strong>
      </summary>
      <pre class="manifest">{{ toYaml(item) }}</pre>
    </details>
  </section>
</template>

<script>
import YAML from 'js-yaml';
import { DateTime } from 'luxon';
import { useContext } from '../use/context';
import { useClipboard } from '../use/clipboard';

export default {
  setup() {
    return {
      ...useContext(),
      ...useClipboard()
    };
  },
  props: [ 'item' ],
  data() {
    return {
      logs: []
    };
  },
  methods: {
    async init(item) {
      if (item.spec?.containers) {
        await this.subscribeToLogs(item);
      }
    },

    async close(item) {
      if (item.spec?.containers) {
        await this.unsubscribeFromLogs(item);
        this.logs = [];
      }
    },

    async subscribeToLogs(item) {
      await api.subscribeToContainerLogs(this.context, item.metadata.name, item.spec.containers[0].name, (event, text) => {
        this.logs.unshift(text);
      });
    },

    async unsubscribeFromLogs(item) {
      await api.unsubscribeFromContainerLogs(this.context, item.metadata.name, item.spec.containers[0].name);
    },

    async handleClose() {
      await this.close(this.item);
      this.$emit('close');
    },

    toYaml(data) {
      return YAML.dump(data, { lineWidth: -1 });
    },

    formatTimestamp(timestamp) {
      const parsed = DateTime.fromMillis(Date.parse(timestamp));

      return parsed.toLocaleString(DateTime.DATETIME_FULL, { locale: this.$i18n.locale })
    }
  },
  watch: {
    item: {
      immediate: true,
      async handler(newValue, oldValue) {
        if (oldValue) {
          await this.close(oldValue);
        }

        if (newValue) {
          await this.init(newValue);
        }
      }
    }
  },
  async beforeUnmount() {
    await this.close(this.item);
  }
};
</script>

<style lang="scss">
.resource-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: white;
  max-width: 50vw;
  min-width: 35vw;
  overflow: auto;
  padding: 1rem;
  background-color: var(--color-detail-background);
  box-shadow: 0 0 3px 0 var(--color-box-shadow);

  th, summary {
    color: var(--color-detail-title);
  }

  table {
    width: 100%;
    padding: .5rem;

    th {
      text-align: left;
    }

    td, th {
      padding: .5rem;
    }
  }

  table.data {
    font-size: .85rem;

    th, td {
      background-color: var(--color-detail-data-background);

      &.copiable:hover {
        cursor: copy;
        color: var(--color-detail-data-hightlight-text);
        background-color: var(--color-detail-data-hightlight-background);
      }
    }

    td {
      white-space: nowrap;
    }
  }

  table.mono {
    font-family: monospace;
  }

  pre {
    background-color: var(--color-glace);
    max-height: 25rem;
    min-height: 2rem;
    overflow: auto;
    border: 1px solid black;
    padding: .5rem 1rem;
  }

  pre.logs {
    display: flex;
    flex-direction: column-reverse;
    background-color: var(--color-detail-logs-background);
  }

  pre.manifest {
    background-color: var(--color-detail-manifest-background);
  }

  summary {
    cursor: pointer;
  }
}
</style>
