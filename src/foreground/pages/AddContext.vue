<template>
  <main class="toolbar-layout add-context">
    <nav class="toolbar">
      <button class="btn btn--text" @click="triggerFormSubmit"><i class="bi-save" /> {{ $t('page.addcontext.save') }}</button>
    </nav>
    <section class="view">
      <form ref="form" @submit.prevent="handleSubmit" class="form">
        <section>
          <h4>{{ $t('page.addcontext.contextname.title') }}</h4>
          <p>
            {{ $t('page.addcontext.contextname.desc') }}
          </p>
          <div class="form__value">
            <input type="text" v-model="name" :placeholder="$t('page.addcontext.contextname.placeholder')" required>
          </div>
        </section>
        <section>
          <h4>{{ $t('page.addcontext.kubeconfig.title') }}</h4>
          <p>
            {{ $t('page.addcontext.kubeconfig.desc') }}
          </p>
          <div class="form__field">
            <div class="form__value">
              <select v-model="config" :disabled="!configs" required>
                <option disabled selected value="">{{ $t('page.addcontext.kubeconfig.placeholder') }}</option>
                <option v-for="option in configs" :key="option.path" :value="option.path">{{ option.name }}</option>
              </select>
            </div>
          </div>
        </section>
        <section :class="{ disabled: !config }">
          <h4>{{ $t('page.addcontext.contextdetails.title') }}</h4>
          <p>
            {{ $t('page.addcontext.contextdetails.desc') }}
          </p>
          <div class="form__field">
            <div class="form__value">
              <select v-model="cluster" :disabled="!clusters" required>
                <option disabled selected value="">{{ $t('page.addcontext.contextdetails.clusterplaceholder') }}</option>
                <option v-for="option in clusters" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form__value">
              <select v-model="user" :disabled="!users" required>
                <option disabled selected value="">{{ $t('page.addcontext.contextdetails.userplaceholder') }}</option>
                <option v-for="option in users" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="form__value">
              <input type="text" v-model="namespace" :placeholder="$t('page.addcontext.contextdetails.namespaceplaceholder')" required>
            </div>
          </div>
        </section>
        <button ref="submit" type="submit" hidden></button>
      </form>
    </section>
  </main>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    return { router };
  },
  data() {
    return {
      name: null,
      configs: null,
      config: '',
      clusters: null,
      cluster: '',
      users: null,
      user: '',
      namespaces: null,
      namespace: null
    };
  },
  watch: {
    config() {
      Promise.all([
        this.loadClusters(),
        this.loadUsers(),
        this.loadNamespaces()
      ]);
    }
  },
  methods: {
    async loadConfigs() {
      this.configs = null;

      try {
        const data = await api.listConfigs();

        this.configs = data;
      } catch {}
    },

    async loadClusters() {
      this.clusters = null;

      try {
        const data = await api.listClusters(this.config);

        this.clusters = data;
      } catch {}
    },

    async loadUsers() {
      this.users = null;

      try {
        const data = await api.listUsers(this.config);

        this.users = data;
      } catch {}
    },

    loadNamespaces() {
      this.namespaces = null;
    },

    triggerFormSubmit() {
      this.$refs.submit.click();
    },

    async handleSubmit() {
      const isValid = this.$refs.form.checkValidity();

      if (!isValid) {
        return;
      }

      await api.saveContext({
        name: this.name,
        config: this.config,
        cluster: this.cluster,
        user: this.user,
        namespace: this.namespace
      });

      this.router.push('/contexts');
    }
  },
  mounted() {
    this.loadConfigs();
  }
}
</script>

<style lang="scss">
.add-context.toolbar-layout {
  .view {
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

    section {
      padding: 0 2rem 1rem;
      margin: 2rem 0;
      border: 2px solid var(--color-header-background);
      border-radius: 1rem;
      transition: filter .25s;

      &.disabled {
        filter: opacity(.5);
      }
    }

    .or {
      align-self: center;
      margin: 0 1rem;
    }
  }
}
</style>
