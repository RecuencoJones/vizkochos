<template>
  <section class="resource-detail">
    <button @click="handleClose">close</button>
    <h3>{{ item.metadata.name }}</h3>
    <details open>
      <summary>
        <strong><i class="bi-card-list" /> Details</strong>
      </summary>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ item.metadata.uid }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{{ item.metadata.name }}</td>
          </tr>
          <tr v-if="item.metadata.labels">
            <th>Labels</th>
            <td>
              <span v-for="(value, label) of item.metadata.labels" :key="label">
                {{ label }}: {{ value }}<br />
              </span>
            </td>
          </tr>
          <tr v-if="item.metadata.annotations">
            <th>Annotations</th>
            <td>
              <span v-for="(value, label) of item.metadata.annotations" :key="label">
                {{ label }}: {{ value }}<br />
              </span>
            </td>
          </tr>
          <tr>
            <th>Created</th>
            <td>{{ item.metadata.creationTimestamp }}</td>
          </tr>
          <tr v-if="item.status && item.status.phase">
            <th>Status</th>
            <td>{{ item.status.phase }}</td>
          </tr>
          <tr v-if="item.metadata.ownerReferences">
            <th>Owner</th>
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
        <strong><i class="bi-justify" /> Logs</strong>
      </summary>
      <pre class="logs" ref="logs"><span v-for="(entry, index) in logs" :key="index">{{ entry }}</span></pre>
    </details>
    <details v-if="item.data" open>
      <summary>
        <strong>
          Data
        </strong>
      </summary>
      <table>
        <tbody>
          <tr v-for="(value, key) of item.data" :key="key">
            <th>{{ key }}</th>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </details>
    <details>
      <summary>
        <strong><i class="bi-filetype-yml" /> Manifest</strong>
      </summary>
      <pre>{{ toYaml(item) }}</pre>
    </details>
  </section>
</template>

<script>
import YAML from 'js-yaml';
import { useContext } from '../use/context';

export default {
  setup() {
    return {
      ...useContext()
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

  table {
    padding: .5rem;

    th {
      text-align: right;
    }

    td, th {
      padding: .5rem;
    }
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
  }

  summary {
    cursor: pointer;
  }
}
</style>
