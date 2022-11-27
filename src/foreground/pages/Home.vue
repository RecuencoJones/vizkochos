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
          <h4><i class="bi-bookmarks" /> Quickstart</h4>
          <div>
            <router-link to="/contexts/new"><i class="bi-plus-square-dotted" /> Add context</router-link>
          </div>
          <div>
            <router-link to="/contexts"><i class="bi-view-list" /> View contexts</router-link>
          </div>
          <div>
            <router-link to="/preferences"><i class="bi-sliders" /> Manage preferences</router-link>
          </div>
        </section>
        <section>
          <h4><i class="bi-clock-history" /> Recently viewed</h4>
          <div v-for="(recent, index) of recents" :key="index">
            <router-link :to="recent.path"><i class="bi-box" /> {{ recent.name }}</router-link>
          </div>
        </section>
      </div>
      <div>
        <section>
          <h4><i class="bi-pin-angle" /> Pinned</h4>
          <div v-if="pinned"></div>
          <div v-else><i>Nothing pinned yet</i></div>
        </section>
        <section>
          <h4><i class="bi-info-circle" /> Help</h4>
          <div>
            <a href="#" @click="openGitHubRepository"><i class="bi-github" /> View in GitHub</a>
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

    div {
      padding: .25rem 0;
    }
  }
}
</style>
