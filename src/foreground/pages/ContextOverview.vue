<template>
  <main class="overview">
    <h2>{{ $t('sidebar.overview') }}</h2>
    <section>
      <h3>{{ $t('sidebar.runtime') }}</h3>
      <div class="stats">
        <dl>
          <dt>{{ $t('sidebar.pods') }}</dt>
          <dd v-if="data">{{ data.pods }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.replicasets') }}</dt>
          <dd v-if="data">{{ data.replicasets }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.deployments') }}</dt>
          <dd v-if="data">{{ data.deployments }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.jobs') }}</dt>
          <dd v-if="data">{{ data.jobs }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.cronjobs') }}</dt>
          <dd v-if="data">{{ data.cronjobs }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
      </div>
    </section>
    <section>
      <h3>{{ $t('sidebar.configuration') }}</h3>
      <div class="stats">
        <dl>
          <dt>{{ $t('sidebar.configmaps') }}</dt>
          <dd v-if="data">{{ data.configmaps }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.secrets') }}</dt>
          <dd v-if="data">{{ data.secrets }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
      </div>
    </section>
    <section>
      <h3>{{ $t('sidebar.connectivity') }}</h3>
      <div class="stats">
        <dl>
          <dt>{{ $t('sidebar.services') }}</dt>
          <dd v-if="data">{{ data.services }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.ingresses') }}</dt>
          <dd v-if="data">{{ data.ingresses }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.networkpolicies') }}</dt>
          <dd v-if="data">{{ data.networkpolicies }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
      </div>
    </section>
    <section>
      <h3>{{ $t('sidebar.security') }}</h3>
      <div class="stats">
        <dl>
          <dt>{{ $t('sidebar.serviceaccounts') }}</dt>
          <dd v-if="data">{{ data.serviceaccounts }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.roles') }}</dt>
          <dd v-if="data">{{ data.roles }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
        </dl>
        <dl>
          <dt>{{ $t('sidebar.rolebindings') }}</dt>
          <dd v-if="data">{{ data.rolebindings }}</dd>
          <dd v-else class="text-placeholder text-placeholder--short"></dd>
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
