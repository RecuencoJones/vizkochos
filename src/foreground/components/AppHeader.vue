<template>
  <header class="app-header">
    <nav class="app-header__left">
      <router-link class="title" to="/">Vizkochos</router-link>
    </nav>
    <nav class="app-header__right">
      <router-link to="/preferences"><i class="bi-sliders" /></router-link>
    </nav>
  </header>
</template>

<style lang="scss">
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  font-size: 1.25rem;
  padding: .25rem 1rem;
  background-color: var(--color-header-background);
  box-shadow: 0 0 3px 2px var(--color-box-shadow);
  z-index: 2;

  .title {
    font-weight: bold;
    font-size: 1.5rem;
    color: var(--color-header-title);
  }

  a {
    color: var(--color-header-link);
  }
}
</style>
