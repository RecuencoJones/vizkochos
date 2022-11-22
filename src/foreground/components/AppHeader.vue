<template>
  <header class="app-header">
    <nav class="app-header__left">
      <router-link to="/">vizkochos</router-link>
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

  &__left,
  &__right {
    flex: 0;
  }
}
</style>
