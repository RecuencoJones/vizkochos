<template>
  <main class="sidebar-layout">
    <ContextSidebar class="sidebar-layout__sidebar" />
    <section class="sidebar-layout__main">
      <router-view></router-view>
    </section>
  </main>
</template>

<script>
import { useContext } from '../use/context';
import ContextSidebar from '../components/ContextSidebar.vue';

export default {
  setup() {
    return {
      ...useContext()
    };
  },
  components: {
    ContextSidebar
  },
  async mounted() {
    await api.addRecentView({ name: `Context: ${ this.context }`, path: `/contexts/${ this.context }` });
  }
}
</script>

<style lang="scss">
.sidebar-layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 0;

  &__sidebar {
    flex: 0 0 auto;
    z-index: 1;
    min-width: 10rem;
    overflow: auto;
  }

  &__main {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
