<template>
  <main class="overview">
    <h3>Overview</h3>
    <section class="stats">
      <dl>
        <dt>Pods</dt>
        <dd v-if="data">{{ data.pods }}</dd>
        <dd v-else class="text-placeholder"></dd>
      </dl>
      <dl>
        <dt>Deployments</dt>
        <dd v-if="data">{{ data.deployments }}</dd>
        <dd v-else class="text-placeholder"></dd>
      </dl>
      <dl>
        <dt>Jobs</dt>
        <dd v-if="data">{{ data.jobs }}</dd>
        <dd v-else class="text-placeholder"></dd>
      </dl>
      <dl>
        <dt>Cron Jobs</dt>
        <dd v-if="data">{{ data.cronjobs }}</dd>
        <dd v-else class="text-placeholder"></dd>
      </dl>
    </section>
  </main>
</template>

<style lang="scss">
.overview {
  .stats {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
}
</style>
