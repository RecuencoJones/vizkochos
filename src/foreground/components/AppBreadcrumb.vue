<template>
  <div class="app-breadcrumb">
    <router-link class="crumb" to="/">home</router-link>
    <template v-for="crumb of crumbs" :key="crumb.path" >
      <span>&gt;</span>
      <router-link class="crumb" :to="crumb.path">
        {{ sanitize(crumb.name) }}
      </router-link>
    </template>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute()

    return { route };
  },
  computed: {
    crumbs() {
      return this.route.fullPath.split('/').filter(Boolean).reduce((crumbs, next) => {
        const lastCrumb = crumbs.at(-1);
        let crumb = { name: next, path: null };

        if (crumbs.at(-1)) {
          crumb.path = [ lastCrumb.path, next ].join('/');
        } else {
          crumb.path = [ '', next ].join('/');
        }

        crumbs.push(crumb);

        return crumbs;
      }, []);
    }
  },
  methods: {
    sanitize(str) {
      return decodeURIComponent(str);
    }
  }
}
</script>

<style lang="scss">
.app-breadcrumb {
  display: flex;
  align-items: center;
  height: 1.5rem;
  padding: .25rem 1rem;
  font-size: .85rem;

  .crumb {
    padding: 0 .25rem;
  }
}
</style>
