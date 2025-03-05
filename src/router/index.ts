import App from '@/App.vue'
import BaseMapViewWrapper from '@/views/BaseMapViewWrapper.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BaseMapViewWrapper,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../components/AboutPage.vue')
    }

  ],
})

export default router
