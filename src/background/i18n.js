const i18next = require('i18next');
const { getDB } = require('./db');
const { instances } = require('./instances');
const en = require('../languages/en.json');
const es = require('../languages/es.json');

async function initLanguages() {
  const db = await getDB();

  const language = db?.preferences?.language || 'en';

  await i18next.init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      es: { translation: es }
    }
  });

  instances.set('i18n', i18next);
}

module.exports = { initLanguages };
