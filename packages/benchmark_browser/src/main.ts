import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHashHistory } from 'vue-router';
import en from './locales/en.json';
import zh from './locales/zh.json';
import App from './App.vue';
import store from './store';
// @ts-ignore
import routes from 'virtual:plugin-pages';

const router = createRouter({
  // @ts-ignore
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
});

const app = createApp(App);
app.use(router).use(store).use(i18n).mount('#app');
