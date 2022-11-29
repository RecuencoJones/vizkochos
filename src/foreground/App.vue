<template>
  <div class="app-wrapper" :class="theme || 'theme-default'">
    <AppHeader />
    <router-view class="app-view"></router-view>
    <AppBreadcrumb />
    <div class="modal-wrapper" v-if="showShortcuts">
      <section class="modal">
        <div class="modal__header">
          <button class="btn btn--text" @click="showShortcuts = false" :title="$t('tooltip.close')"><i class="bi-x-lg" /></button>
        </div>
        <div class="modal__main">
          <table class="shortcuts">
            <tbody>
              <tr>
                <th>{{ $t('menu.file.newcontext') }}</th>
                <td><pre>{{ commandOrControl }} + N</pre></td>
              </tr>
              <tr>
                <th>{{ $t('menu.file.quickstart') }}</th>
                <td><pre>{{ commandOrControl }} + 1</pre></td>
              </tr>
              <tr>
                <th>{{ $t('menu.file.contexts') }}</th>
                <td><pre>{{ commandOrControl }} + 2</pre></td>
              </tr>
              <tr>
                <th>{{ $t('menu.file.preferences') }}</th>
                <td><pre>{{ commandOrControl }} + ,</pre></td>
              </tr>
              <tr>
                <th>{{ $t('menu.help.shortcuts') }}</th>
                <td><pre>{{ commandOrControl }} + /</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppBreadcrumb from './components/AppBreadcrumb.vue';
import { events } from './events';

export default {
  components: {
    AppHeader,
    AppBreadcrumb
  },
  data() {
    return {
      listener: this.loadPreferences.bind(this),
      theme: null,
      showShortcuts: false
    }
  },
  computed: {
    commandOrControl() {
      return window.os === 'darwin' ? '⌘' : 'Ctrl';
    }
  },
  methods: {
    async loadPreferences() {
      const preferences = await api.getPreferences();

      this.theme = preferences.theme;
      this.$i18n.locale = preferences.language;
    },

    toggleShortcuts() {
      this.showShortcuts = !this.showShortcuts;
    }
  },
  async mounted() {
    events.on('reload-preferences', this.listener);

    await this.loadPreferences();
  },

  beforeUnmount() {
    events.off('reload-preferences', this.listener);
  }
}
</script>

<style lang="scss">

.app-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: var(--color-main-text);
  background-color: var(--color-main-background);

  .app-header,
  .app-breadcrumb {
    flex: 0 0 auto;
  }

  .app-view {
    flex: 1;
    overflow: auto;
  }

  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: auto;

    .modal {
      margin: 15% auto;
      padding: 1rem;
      width: 30vw;
      border: 1px solid var(--color-modal-border);
      background: var(--color-modal-background);
      box-shadow: 2px 2px 5px 0 var(--color-box-shadow);
    }
  }
}

.shortcuts {
  width: 100%;

  th {
    text-align: left;
  }
}
</style>
