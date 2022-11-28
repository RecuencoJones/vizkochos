import { createI18n } from 'vue-i18n';
import en from '../languages/en.json';
import es from '../languages/es.json';

export const languages = [
  {
    name: 'English',
    code: 'en',
    default: true
  }, {
    name: 'Español',
    code: 'es'
  }
];

export async function initI18n() {
  const preferences = await api.getPreferences();

  const i18n = createI18n({
    locale: preferences.language || 'en',
    fallbackLocale: 'en',
    messages: {
      en,
      es
    }
  });

  return i18n;
}
