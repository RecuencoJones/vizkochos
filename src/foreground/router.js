import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Preferences from './pages/Preferences.vue';
import ListContexts from './pages/ListContexts.vue';
import AddContext from './pages/AddContext.vue';
import Context from './pages/Context.vue';
import ContextOverview from './pages/ContextOverview.vue';
import ContextResource from './pages/ContextResource.vue';

export function initRouter() {
  return createRouter({
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
}
