<template>
  <main class="preferences">
    <form @submit.prevent>
      <table v-if="preferences">
        <tbody>
          <tr>
            <th>{{ $t('page.preferences.theme') }}</th>
            <td>
              <select @change="handleChangeTheme">
                <option v-for="theme of themes" :key="theme.class" :value="theme.class" :selected="preferences.theme === theme.class">{{ theme.name }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>{{ $t('page.preferences.language') }}</th>
            <td>
              <select @change="handleChangeLanguage">
                <option v-for="language of languages" :key="language.code" :value="language.code" :selected="preferences.language === language.code">{{ language.name }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </main>
</template>

<script>
import { themes } from '../themes';
import { languages } from '../languages';
import { events } from '../events';

export default {
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
        language: this.preferences.language
      });

      events.emit('reload-preferences');
    },

    async handleChangeTheme(event) {
      this.preferences.theme = event.target.value;

      await this.savePreferences();
    },

    async handleChangeLanguage(event) {
      this.preferences.language = event.target.value;

      await this.savePreferences();
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
}
</style>
