<template>
  <aside class="context-sidebar">
    <div>
      <h4>
        <router-link :to="'/contexts/' + context"><i class="bi-binoculars" /> {{ $t('sidebar.overview') }}</router-link>
      </h4>
    </div>
    <div>
      <h4><i class="bi-hdd-rack" /> {{ $t('sidebar.cluster') }}</h4>
      <div class="resource-link">
        <span v-if="config">{{ config.cluster }}</span>
        <span v-else class="text-placeholder"></span>
      </div>
      <h4><i class="bi-person" /> {{ $t('sidebar.user') }}</h4>
      <div class="resource-link">
        <span v-if="config">{{ config.user }}</span>
        <span v-else class="text-placeholder"></span>
      </div>
      <h4><i class="bi-tag" /> {{ $t('sidebar.namespace') }}</h4>
      <div class="resource-link">
        <span v-if="config">{{ config.namespace }}</span>
        <span v-else class="text-placeholder"></span>
      </div>
    </div>
    <div v-for="group of groups" :key="group.name">
      <h4><i :class="group.icon" /> {{ $t('sidebar.' + group.name) }}</h4>
      <div class="resource-link" v-for="resource of group.resources" :key="resource">
        <router-link :to="'/contexts/' + context + '/' + resource">{{ $t('sidebar.' + resource) }}</router-link>
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
  padding: 2.5rem 3rem;
  background-color: var(--color-sidebar-background);

  h4 {
    color: var(--color-sidebar-heading);
    margin-bottom: 0;
  }

  a, span {
    color: var(--color-sidebar-link);
  }

  .resource-link {
    padding: 0.25rem 0;
  }
}
</style>
