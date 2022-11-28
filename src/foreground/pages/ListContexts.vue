<template>
  <main class="toolbar-layout contexts">
    <nav class="toolbar">
      <router-link to="/contexts/new"><i class="bi-plus-square-dotted" /> {{ $t('page.contexts.addcontext') }}</router-link>
    </nav>
    <section class="view">
      <h4>{{ $t('page.contexts.choosecontext') }}</h4>
      <div v-for="context of contexts" :key="context.name">
        <router-link :to="'/contexts/' + context.name"><i class="bi-box" /> {{ context.name }}</router-link>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      contexts: null
    }
  },
  methods: {
    async loadContexts() {
      this.contexts = await api.listContexts();
    }
  },
  mounted() {
    this.loadContexts()
  }
}
</script>

<style lang="scss">
.contexts.toolbar-layout {
  .view {
    padding: 10vh 20vw;

    div {
      padding: 0.25rem 0;
    }
  }
}
</style>
