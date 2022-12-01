const i18next = require('i18next');
const { getDB } = require('./db');
const { instances } = require('../instances');
const { logger } = require('../logger');
const en = require('../../languages/en.json');
const es = require('../../languages/es.json');

async function initLanguages() {
  const db = await getDB();

  const language = db?.preferences?.language || 'en';

  logger.info(`init with language: ${ language }`);

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

async function reloadLanguage() {
  const db = await getDB();

  const language = db?.preferences?.language || 'en';

  logger.info(`update language: ${ language }`);

  await i18next.changeLanguage(language);
}

module.exports = { initLanguages, reloadLanguage };
