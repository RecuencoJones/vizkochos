<template>
  <section class="resource toolbar-layout">
    <nav class="toolbar">
      <a class="btn btn--text" href="#" @click.prevent="handleRefresh"><i class="bi-arrow-clockwise" /> {{ $t('page.resource.refresh') }}</a>
      <input type="text" :placeholder="$t('page.resource.filter')" v-model="filter">
    </nav>
    <section class="view">
      <PodsAdapter v-if="resource === 'pods'" :items="filteredItems" @select="handleSelect" />
      <ServicesAdapter v-else-if="resource === 'services'" :items="filteredItems" @select="handleSelect" />
      <IngressesAdapter v-else-if="resource === 'ingresses'" :items="filteredItems" @select="handleSelect" />
      <DefaultAdapter v-else :items="filteredItems" @select="handleSelect" />
    </section>
    <ResourceDetail v-if="item" :item="item" @close="item = null" />
  </section>
</template>

<script>
import { useRoute } from 'vue-router';
import { useContext } from '../use/context';
import { useResource } from '../use/resource';
import { adapters } from '../components/resource-table-adapters'
import ResourceDetail from '../components/ResourceDetail.vue';
import { ref, watch } from 'vue';

export default {
  setup() {
    const route = useRoute();
    const itemName = ref();

    watch(
      () => route.query.item,
      (value) => itemName.value = value
    );

    return {
      ...useContext(),
      ...useResource(),
      itemName
    };
  },
  components: {
    ...adapters,
    ResourceDetail
  },
  data() {
    return {
      preferences: null,
      items: null,
      item: null,
      filter: null,
      autoRefreshTimeout: null
    };
  },
  computed: {
    filteredItems() {
      if (!this.items) {
        return null;
      }

      return this.items.filter((item) => !this.filter || item.metadata.name.includes(this.filter.toLowerCase()));
    },

    refreshResourcesListSeconds() {
      return this.preferences?.refreshResourcesListSeconds || 2;
    }
  },
  methods: {
    async loadResourceItems({ silent = false } = {}) {
      if (!silent) {
        this.items = null;
      }

      const context = this.context;
      const resource = this.resource;
      const itemName = this.itemName;

      if (context && resource) {
        this.items = await api.listResourceType(context, resource);
      }

      if (itemName) {
        this.item = this.items.find((item) => itemName === item.metadata.name);
      }
    },
    async handleRefresh(opts) {
      await this.loadResourceItems(opts);
    },
    autoRefresh() {
      this.autoRefreshTimeout = setTimeout(async () => {
        await this.handleRefresh({ silent: true });
        this.autoRefresh();
      }, this.refreshResourcesListSeconds * 1000);
    },
    handleSelect(item) {
      this.item = item;
    }
  },
  watch: {
    resource: {
      immediate: true,
      async handler() {
        this.item = null;
        await this.loadResourceItems();

        clearTimeout(this.autoRefreshTimeout);

        this.autoRefresh();
      }
    }
  },
  async mounted() {
    this.preferences = await api.getPreferences();
  },
  beforeUnmount() {
    clearTimeout(this.autoRefreshTimeout);
  }
}
</script>

<style lang="scss">
.resource.toolbar-layout {
  .toolbar {
    padding-left: 0;
  }

  .view {
    padding: 0;
    box-shadow: inset 0 0 3px 0 var(--color-box-shadow);

    table {
      width: 100%;
      white-space: nowrap;
      border-collapse: collapse;

      thead th {
        position: sticky;
        top: 0;
        color: var(--color-resource-table-header-text);
        background: var(--color-resource-table-header-background);
      }

      th {
        text-align: start;
      }

      td, th {
        padding: .5rem 1rem;
      }

      tbody tr:hover {
        color: var(--color-resource-table-highlight-text);
        background: var(--color-resource-table-highlight-background);
        cursor: pointer;
      }
    }
  }
}
</style>
