<template>
  <header class="app-header">
    <nav class="app-header__left">
      <router-link class="title" to="/">vizkochos</router-link>
    </nav>
    <nav class="app-header__right">
      <router-link to="/preferences">Preferences</router-link>
    </nav>
  </header>
</template>

<style lang="scss">
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  padding: .25rem 1rem;
  background-color: var(--color-header-background);
  box-shadow: 0 0 3px 2px var(--color-box-shadow);
  z-index: 2;

  &__left,
  &__right {
    flex: 0;
  }

  .title {
    font-weight: bold;
    font-size: 1.25rem;
    color: var(--color-header-title);
  }

  a {
    color: var(--color-header-link);
  }
}
</style>
