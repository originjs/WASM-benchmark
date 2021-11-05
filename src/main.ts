import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import en from './locales/en.json'
import zh from './locales/zh.json'
import App from './App.vue'
import store from './store'
import Default from './layouts/default.vue'
import Index from './pages/index.vue'

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      { path: '/', component: Index }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

const app = createApp(App);
app.use(router).use(store).use(i18n).mount('#app')
