import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/movie-query'
    },
    {
      path: '/movie-query',
      name: 'MovieQuery',
      component: () => import('../views/MovieQuery.vue'),
      meta: { transition: 'slide-fade' }
    },
    {
      path: '/movie-trace',
      name: 'MovieTrace',
      component: () => import('../views/MovieTrace.vue'),
      meta: { transition: 'slide-fade' }
    },
    {
      path: '/relation',
      name: 'Relation',
      component: () => import('../views/Relation.vue'),
      meta: { transition: 'slide-fade' }
    },
    {
      path: '/documentation',
      name: 'Documentation',
      component: () => import('../views/Documentation.vue'),
      meta: { transition: 'slide-fade' }
    }
    
  ]
})

export default router 