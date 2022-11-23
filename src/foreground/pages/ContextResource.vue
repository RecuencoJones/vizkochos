<template>
  <section class="resource toolbar-layout">
    <nav class="toolbar">
      <button @click="handleRefresh">refresh</button>
    </nav>
    <section class="view">
      <PodsAdapter v-if="resource === 'pods'" :items="items" @select="handleSelect" />
      <ServicesAdapter v-else-if="resource === 'services'" :items="items" />
      <IngressesAdapter v-else-if="resource === 'ingresses'" :items="items" />
      <DefaultAdapter v-else :items="items" />
    </section>
    <ResourceDetail v-if="item" :item="item" @close="item = null" />
  </section>
</template>

<script>
import { useContext } from '../use/context';
import { useResource } from '../use/resource';
import { adapters } from '../components/resource-table-adapters'
import ResourceDetail from '../components/ResourceDetail.vue';

export default {
  setup() {
    return {
      ...useContext(),
      ...useResource()
    };
  },
  components: {
    ...adapters,
    ResourceDetail
  },
  data() {
    return {
      items: null,
      item: null
    };
  },
  methods: {
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
      }
    }
  }
}
</script>

<style lang="scss">
.resource.toolbar-layout {
  .view {
    padding: 0;
    box-shadow: inset 0 0 3px 0 var(--color-dark-cookie);
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
      background: var(--color-cream);
      cursor: pointer;
    }
  }
}
</style>
