<template>
  <aside class="context-sidebar">
    <div>
      <dl>
        <dt>Cluster</dt>
        <dd v-if="config">{{ config.cluster }}</dd>
        <dd v-else class="text-placeholder"></dd>
        <dt>User</dt>
        <dd v-if="config">{{ config.user }}</dd>
        <dd v-else class="text-placeholder"></dd>
        <dt>Namespace</dt>
        <dd v-if="config">{{ config.namespace }}</dd>
        <dd v-else class="text-placeholder"></dd>
      </dl>
    </div>
    <div>
      <router-link :to="'/contexts/' + context">Overview</router-link>
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
      this.config = await api.getContext(this.context)
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
  padding-right: 1rem;
}
</style>
