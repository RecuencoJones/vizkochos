<template>
  <main class="overview">
    <h2>Overview</h2>
    <section>
      <h3>Runtime</h3>
      <div class="stats">
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
      </div>
    </section>
    <section>
      <h3>Configuration</h3>
      <div class="stats">
        <dl>
          <dt>Config Maps</dt>
          <dd v-if="data">{{ data.configmaps }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
        <dl>
          <dt>Secrets</dt>
          <dd v-if="data">{{ data.secrets }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
      </div>
    </section>
    <section>
      <h3>Connectivity</h3>
      <div class="stats">
        <dl>
          <dt>Services</dt>
          <dd v-if="data">{{ data.services }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
        <dl>
          <dt>Ingresses</dt>
          <dd v-if="data">{{ data.ingresses }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
        <dl>
          <dt>Network Policies</dt>
          <dd v-if="data">{{ data.networkpolicies }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
      </div>
    </section>
    <section>
      <h3>Security</h3>
      <div class="stats">
        <dl>
          <dt>Service Accounts</dt>
          <dd v-if="data">{{ data.serviceaccounts }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
        <dl>
          <dt>Roles</dt>
          <dd v-if="data">{{ data.roles }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
        <dl>
          <dt>Role Bindings</dt>
          <dd v-if="data">{{ data.rolebindings }}</dd>
          <dd v-else class="text-placeholder"></dd>
        </dl>
      </div>
    </section>
  </main>
</template>

<script>
import { useContext } from '../use/context';

export default {
  setup() {
    return useContext();
  },
  data() {
    return {
      data: null
    };
  },
  methods: {
    async loadOverviewData() {
      if (this.context) {
        const data = await api.getContextOverview(this.context);
        this.data = data;
      }
    }
  },
  watch: {
    context: {
      immediate: true,
      handler() {
        this.loadOverviewData();
      }
    }
  }
}
</script>

<style lang="scss">
.overview {
  text-align: center;
  padding-top: 5rem;

  .stats {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
}
</style>
