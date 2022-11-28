import { createApp } from 'vue';
import App from './App.vue';
import { initI18n } from './languages';
import { initRouter } from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.scss';

async function main() {
  const app = createApp(App);

  const router = initRouter();
  const i18n = await initI18n();

  app.use(router);
  app.use(i18n);

  const appInstance = app.mount('#app');

  window.api.subscribeToAppMenuEvents(
    {
      event: 'file:newContext',
      handler() {
        router.push('/contexts/new');
      }
    },
    {
      event: 'file:quickstart',
      handler() {
        router.push('/');
      }
    },
    {
      event: 'file:contexts',
      handler() {
        router.push('/contexts');
      }
    },
    {
      event: 'file:preferences',
      handler() {
        router.push('/preferences');
      }
    },
    {
      event: 'help:shortcuts',
      handler() {
        appInstance.toggleShortcuts();
      }
    }
  );
}

main();
