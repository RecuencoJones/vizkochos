<template>
  <aside class="context-sidebar">
    <div>
      <h4>
        <router-link :to="'/contexts/' + context">Overview</router-link>
      </h4>
    </div>
    <div>
      <h4>Cluster</h4>
      <span v-if="config">{{ config.cluster }}</span>
      <span v-else class="text-placeholder"></span>
      <h4>User</h4>
      <span v-if="config">{{ config.user }}</span>
      <span v-else class="text-placeholder"></span>
      <h4>Namespace</h4>
      <span v-if="config">{{ config.namespace }}</span>
      <span v-else class="text-placeholder"></span>
    </div>
    <div v-for="group of groups" :key="group.name">
      <h4>{{ group.name }}</h4>
      <div v-for="resource of group.resources" :key="resource">
        <router-link :to="'/contexts/' + context + '/' + resource">{{ resource }}</router-link>
      </div>
    </div>
  </aside>
</template>

<script>
import { useContext } from '../use/context';
import { resources } from '../config/resources';

export default {
  setup() {
    return useContext();
  },
  data() {
    return {
      config: null,
      groups: resources
    }
  },
  methods: {
    async loadConfig() {
      if (this.context) {
        this.config = await api.getContext(this.context);
      }
    }
  },
  watch: {
    context: {
      immediate: true,
      handler() {
        this.loadConfig();
      }
    }
  }
}
</script>

<style lang="scss">
.context-sidebar {
  padding: 0 2rem;
  background-color: var(--color-sidebar-background);

  h4 {
    color: var(--color-sidebar-heading);
    margin-bottom: 0;
  }

  a, span {
    color: var(--color-sidebar-link);
  }
}
</style>
