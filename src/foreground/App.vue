<template>
  <div class="app-wrapper">
    <AppHeader />
    <router-view class="app-view"></router-view>
    <AppBreadcrumb />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppBreadcrumb from './components/AppBreadcrumb.vue';

export default {
  components: {
    AppHeader,
    AppBreadcrumb
  }
}
</script>

<style lang="scss">

.app-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .app-header,
  .app-breadcrumb {
    flex: 0 0 auto;
  }

  .app-view {
    flex: 1;
    overflow: auto;
  }
}
</style>
