<template>
  <main class="preferences">
    <div v-if="preferences">
      <section class="form">
        <h4>{{ $t('page.preferences.appearance') }}</h4>
        <div class="form__fields">
          <div class="form__field">
            <div class="form__label">
              <label for="theme"><i class="bi-translate" /> {{ $t('page.preferences.language') }}</label>
            </div>
            <div class="form__value">
              <select name="language" @change="handleChangeSelect($event, 'language')">
                <option v-for="language of languages" :key="language.code" :value="language.code" :selected="preferences.language === language.code">{{ language.name }}</option>
              </select>
            </div>
          </div>
          <div class="form__field">
            <div class="form__label">
              <label for="theme"><i class="bi-palette" /> {{ $t('page.preferences.theme') }}</label>
            </div>
            <Colorset />
            <div class="form__value">
              <select name="theme" @change="handleChangeSelect($event, 'theme')">
                <option v-for="theme of themes" :key="theme.class" :value="theme.class" :selected="preferences.theme === theme.class">{{ theme.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section class="form">
        <h4>{{ $t('page.preferences.resourcedetails') }}</h4>
        <div class="form__fields">
          <div class="form__field">
            <div class="form__label">
              <label for="openManifestByDefault">{{ $t('page.preferences.openmanifestbydefault') }}</label>
            </div>
            <div class="form__value">
              <input
                type="checkbox"
                name="openManifestByDefault"
                :checked="preferences.openManifestByDefault"
                @input="handleChangeCheckbox($event, 'openManifestByDefault')">
            </div>
          </div>
        </div>
      </section>
      <section class="form">
        <h4>{{ $t('page.preferences.recents') }}</h4>
        <div class="form__fields">
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="clearRecents"><i class="bi-trash" /> {{ $t('page.preferences.clearrecents') }}</a>
          </div>
        </div>
      </section>
      <section class="form">
        <h4>{{ $t('page.preferences.pins') }}</h4>
        <div class="form__fields">
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="clearPins"><i class="bi-trash" /> {{ $t('page.preferences.clearpins') }}</a>
          </div>
        </div>
      </section>
      <section class="form">
        <h4>{{ $t('page.preferences.advanced') }}</h4>
        <div class="form__fields">
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="openAppDataLocation"><i class="bi-folder2-open" /> {{ $t('page.preferences.openappdatalocation') }}</a>
          </div>
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="viewLogs"><i class="bi-clipboard-pulse" /> {{ $t('page.preferences.viewlogs') }}</a>
          </div>
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="purgeLogs"><i class="bi-clipboard-x" /> {{ $t('page.preferences.purgelogs') }}</a>
          </div>
          <div class="form__field">
            <a class="btn btn--text" href="#" @click.prevent="purgeAllData"><i class="bi-window-x" /> {{ $t('page.preferences.purgealldata') }}</a>
          </div>
        </div>
      </section>
    </div>
    <div v-else>Loading preferences...</div>
  </main>
</template>

<script>
import { themes } from '../themes';
import { languages } from '../languages';
import { events } from '../events';
import Colorset from '../components/Colorset.vue';

export default {
  components: {
    Colorset
  },
  data() {
    return {
      themes,
      languages,
      preferences: null
    };
  },
  methods: {
    async loadPreferences() {
      this.preferences = await api.getPreferences();
    },

    async savePreferences() {
      await api.savePreferences({
        theme: this.preferences.theme,
        language: this.preferences.language,
        openManifestByDefault: this.preferences.openManifestByDefault
      });

      events.emit('reload-preferences');
    },

    async clearRecents() {
      await api.clearRecentViews();
    },

    async clearPins() {
      await api.clearPins();
    },

    async handleChangeSelect(event, preferenceName) {
      this.preferences[preferenceName] = event.target.value;

      await this.savePreferences();
    },

    async handleChangeCheckbox(event, preferenceName) {
      this.preferences[preferenceName] = event.target.checked;

      await this.savePreferences();
    },

    async openAppDataLocation() {
      await api.openAppDataLocation();
    },

    async viewLogs() {
      await api.viewLogs();
    },

    async purgeLogs() {
      await api.purgeLogs();
    },

    async purgeAllData() {
      await api.purgeAllData();
    }
  },
  async mounted() {
    await this.loadPreferences();
  }
}
</script>

<style lang="scss">
.preferences {
  padding: 10vh 20vw;

  @media (max-width: 1000px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  @media (max-width: 600px) {
    padding-left: 20vw;
    padding-right: 20vw;
  }

  @media (max-height: 1000px) {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }

  @media (max-height: 800px) {
    padding-top: 2vh;
    padding-bottom: 2vh;
  }
}
</style>
