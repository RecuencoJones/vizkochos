<template>
  <main>
    <nav class="toolbar">
      <router-link to="/contexts/new">Create context</router-link>
    </nav>
    <section>
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
