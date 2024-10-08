import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/index/IndexView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/IndexView.vue')
    },
    {
      path: '/info/:page?',
      name: 'info',
      component: () => import('@/views/info/IndexView.vue')
    },
    {
      path: '/gamepanel',
      name: 'gamepanel',
      component: () => import('@/views/gamepanel/IndexView.vue'),
      redirect: '/options',
      children: [
        {
          path: '/map',
          name: 'map',
          component: () => import('@/views/map/IndexView.vue')
        },
        {
          path: '/options',
          name: 'options',
          component: () => import('@/views/options/IndexView.vue')
        },
        {
          path: '/deck',
          name: 'deck',
          component: () => import('@/views/deck/IndexView.vue')
        },
        {
          path: '/decklist',
          name: 'decklist',
          component: () => import('@/views/decklist/IndexView.vue')
        },
        {
          path: '/bounty',
          name: 'bounty',
          component: () => import('@/views/bounty/IndexView.vue')
        },
        {
          path: '/playerevent',
          name: 'playerevent',
          component: () => import('@/views/playerevent/IndexView.vue')
        },
        {
          path: '/globalevent',
          name: 'globalevent',
          component: () => import('@/views/globalevent/IndexView.vue')
        },
        {
          path: '/shop',
          name: 'shop',
          component: () => import('@/views/shop/IndexView.vue')
        }
      ]
    }
  ]
})

export default router
