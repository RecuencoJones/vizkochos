<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <section>
        <div>
          Context name
          <input type="text" v-model="name">
        </div>
      </section>
      <section>
        <div>
          Select kubeconfig from dropdown or file
          <select v-model="config" :disabled="!configs">
            <option v-for="option in configs" :key="option.path" :value="option.path">{{ option.name }}</option>
          </select>
          <input type="file" @change="(e) => config = e.target.files[0]">
        </div>
      </section>
      <section>
        <div>
          Select cluster from dropdown
          <select v-model="cluster" :disabled="!clusters">
            <option v-for="option in clusters" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div>
          Select user from dropdown
          <select v-model="user" :disabled="!users">
            <option v-for="option in users" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div>
          Select or type namespace
          <select v-model="namespace" :disabled="!namespaces"></select>
          <input type="text" v-model="namespace">
        </div>
      </section>
      <section>
        <button type="submit">save</button>
      </section>
    </form>
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
      config: null,
      clusters: null,
      cluster: null,
      users: null,
      user: null,
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

    async handleSubmit() {
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
