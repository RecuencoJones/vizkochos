import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import Home from './pages/Home.vue';
import Preferences from './pages/Preferences.vue';
import ListContexts from './pages/ListContexts.vue';
import AddContext from './pages/AddContext.vue';
import Context from './pages/Context.vue';
import ContextOverview from './pages/ContextOverview.vue';
import ContextResource from './pages/ContextResource.vue';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.scss';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/contexts',
      component: ListContexts
    }, {
      path: '/contexts/new',
      component: AddContext
    }, {
      path: '/contexts/:context',
      component: Context,
      children: [
        {
          path: '',
          component: ContextOverview
        }, {
          path: ':resource',
          component: ContextResource
        }
      ]
    }, {
      path: '/preferences',
      component: Preferences
    }
  ]
});

const app = createApp(App);

app.use(router);

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
