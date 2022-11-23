<template>
  <main class="toolbar-layout">
    <nav class="toolbar">
      <router-link to="/contexts/new">
        <button>Create context</button>
      </router-link>
    </nav>
    <section class="view">
      <h4>Choose context</h4>
      <div v-for="context of contexts" :key="context.name">
        <router-link :to="'/contexts/' + context.name">{{ context.name }}</router-link>
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
