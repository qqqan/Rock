import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "Layout",
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: "Home",
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/home/:imgUrl',
          name: "ImgHome",
          component: () => import('@/views/home/index.vue')
        }, {
          path: '/folder',
          name: "Folder",
          component: () => import('@/views/folder/index.vue')
        },
      ]
    }
  ]
})

export default router
