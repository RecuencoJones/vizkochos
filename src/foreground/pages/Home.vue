<template>
  <main>
    <div>
      <h4>Quickstart</h4>
      <div>
        <router-link to="/contexts/new">Add context</router-link>
      </div>
      <div>
        <router-link to="/contexts">Manage contexts</router-link>
      </div>
      <div>
        <router-link to="/preferences">Manage preferences</router-link>
      </div>
    </div>
    <div>
      <h4>Recently viewed</h4>
      <div v-for="(recent, index) of recents" :key="index">
        <router-link :to="recent.path">{{ recent.name }}</router-link>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      recents: null
    };
  },
  methods: {
    async loadRecents() {
      this.recents = await api.listRecentViews();
    }
  },
  mounted() {
    this.loadRecents();
  }
}
</script>
