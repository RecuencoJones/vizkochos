<template>
  <section class="resource-detail">
    <button @click="handleClose">close</button>
    <h3>{{ item.metadata.name }}</h3>
    <details v-if="item.spec.containers" open>
      <summary>
        <strong>Logs</strong>
      </summary>
      <pre><span v-for="(entry, index) in logs" :key="index">{{ entry }}</span></pre>
    </details>
    <details>
      <summary>
        <strong>Manifest</strong>
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
    return useContext();
  },
  props: [ 'item' ],
  data() {
    return {
      logs: []
    };
  },
  methods: {
    async init(item) {
      if (item.spec.containers) {
        await this.subscribeToLogs(item);
      }
    },

    async close(item) {
      if (item.spec.containers) {
        await this.unsubscribeFromLogs(item);
        this.logs = [];
      }
    },

    async subscribeToLogs(item) {
      await api.subscribeToContainerLogs(this.context, item.metadata.name, item.spec.containers[0].name, (event, text) => {
        this.logs.push(text);
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
  overflow: auto;
  padding: 1rem;
  background-color: var(--color-detail-background);
  box-shadow: 0 0 3px 0 var(--color-dark-cookie);

  pre {
    background-color: var(--color-glace);
    max-height: 25rem;
    min-height: 2rem;
    overflow: auto;
    border: 1px solid black;
    padding: .5rem 1rem;
  }

  summary {
    cursor: pointer;
  }
}
</style>
