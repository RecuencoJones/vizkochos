<template>
  <div class="app-breadcrumb">
    <router-link class="crumb" to="/"><i class="bi-house-fill" /> {{ $t('breadcrumb.home') }}</router-link>
    <template v-for="crumb of crumbs" :key="crumb.path" >
      <i class="bi-chevron-right" />
      <router-link class="crumb" :to="crumb.path">
        {{ t('breadcrumb.' + sanitize(crumb.name), sanitize(crumb.name)) }}
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
      return this.route.path.split('/').filter(Boolean).reduce((crumbs, next) => {
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
    t(key, defaultValue) {
      const expectedTranslation = this.$t(key);

      if (expectedTranslation === key) {
        return defaultValue;
      }

      return expectedTranslation;
    },
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
  height: 2rem;
  padding: .25rem 1rem;
  font-size: 1rem;
  background-color: var(--color-breadcrumb-background);

  .crumb {
    padding: 0 .25rem;
    color: var(--color-breadcrumb-link);
  }
}
</style>
