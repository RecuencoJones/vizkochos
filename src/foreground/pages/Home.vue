<template>
  <main class="quickstart rows">
    <div>
      <section>
        <h1>{{ $t('app.name') }}</h1>
        <h3>{{ $t('app.description') }}</h3>
      </section>
    </div>
    <div class="columns">
      <div>
        <section>
          <h4><i class="bi-bookmarks" /> {{ $t('page.home.quickstart') }}</h4>
          <div>
            <router-link to="/contexts/new"><i class="bi-plus-square-dotted" /> {{ $t('page.home.addcontext') }}</router-link>
          </div>
          <div>
            <router-link to="/contexts"><i class="bi-view-list" /> {{ $t('page.home.viewcontexts') }}</router-link>
          </div>
          <div>
            <router-link to="/preferences"><i class="bi-sliders" /> {{ $t('page.home.managepreferences') }}</router-link>
          </div>
        </section>
        <section>
          <h4><i class="bi-clock-history" /> {{ $t('page.home.recents') }}</h4>
          <template v-if="recents && recents.length">
            <div v-for="(recent, index) of recents" :key="index">
              <router-link :to="recent.path"><i class="bi-box" /> {{ recent.name }}</router-link>
            </div>
          </template>
          <div v-else><i>{{ $t('page.home.nothingrecent') }}</i></div>
        </section>
      </div>
      <div>
        <section>
          <h4><i class="bi-pin-angle" /> {{ $t('page.home.pinned') }}</h4>
          <div v-if="pinned"></div>
          <div v-else><i>{{ $t('page.home.nothingpinned') }}</i></div>
        </section>
        <section>
          <h4><i class="bi-info-circle" /> {{ $t('page.home.help') }}</h4>
          <div>
            <a href="#" @click="openGitHubRepository"><i class="bi-github" /> {{ $t('page.home.viewingithub') }}</a>
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

  @media (max-width: 1000px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  @media (max-width: 600px) {
    padding-left: 20vw;
    padding-right: 20vw;
  }

  @media (max-height: 1000px) {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }

  @media (max-height: 800px) {
    padding-top: 2vh;
    padding-bottom: 2vh;
  }

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
