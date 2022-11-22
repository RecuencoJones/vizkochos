<template>
  <div class="app-wrapper">
    <AppHeader />
    <AppBreadcrumb />
    <router-view class="app-view"></router-view>
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
html, body, #app, .app-wrapper {
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.router-link-exact-active {
  font-weight: bold;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
}

.app-sidebar,
.app-breadcrumb {
  flex: 0 0 auto;
}

.app-view {
  flex: 1;
  overflow: auto;
}

main {
  padding: 1rem;
}

dl {
  dt {
    font-weight: bold;
  }

  dd {
    margin-inline-start: 0;
    margin-bottom: .5rem;
  }

  .text-placeholder {
    display: inline-block;
    position: relative;
    width: 5rem;
    height: 1rem;
    background: #ccc;

    &::after {
      animation: shine 1s ease-in-out infinite;
      animation-fill-mode: forwards;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;

      background: rgba(255, 255, 255, 0.13);
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.13) 0%,
        rgba(255, 255, 255, 0.13) 77%,
        rgba(255, 255, 255, 0.5) 92%,
        rgba(255, 255, 255, 0.0) 100%
      );
    }
  }
}

@keyframes shine {
  10% {
    opacity: 1;
    top: 0;
    left: 100%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  }
  100% {
    opacity: 0;
    top: 0;
    left: 3%;
    transition-property: left, top, opacity;
  }
}
</style>
