<template>
  <main class="quickstart rows">
    <div>
      <section>
        <h1>Vizkochos</h1>
        <h3>Visual Kubernetes</h3>
      </section>
    </div>
    <div class="columns">
      <div>
        <section>
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
        </section>
        <section>
          <h4>Recently viewed</h4>
          <div v-for="(recent, index) of recents" :key="index">
            <router-link :to="recent.path">{{ recent.name }}</router-link>
          </div>
        </section>
      </div>
      <div>
        <section>
          <h4>Pinned</h4>
          <div v-if="pinned"></div>
          <div v-else><i>Nothing pinned yet</i></div>
        </section>
        <section>
          <h4>Help</h4>
          <div>
            <a href="#" @click="openGitHubRepository" >View in GitHub</a>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      recents: null,
      pinned: null
    };
  },
  methods: {
    async loadRecents() {
      this.recents = await api.listRecentViews();
    },
    async openGitHubRepository() {
      await api.openGitHubRepository();
    }
  },
  mounted() {
    this.loadRecents();
  }
}
</script>

<style lang="scss">
.quickstart {
  padding: 10vh 20vw;

  h1, h3 {
    color: var(--color-header-background);
  }

  section {
    padding: 2vh 1vw;
  }
}
</style>
