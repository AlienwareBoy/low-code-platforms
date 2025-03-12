import { createRouter, createWebHistory, type Router } from 'vue-router'
import allRoutes, { constantRoutes } from './routes'
import useUserAuth from '../store/'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserAuth()
  const isLoggedIn = userStore.token !== null
  userStore.autoLogin()

  // 示例：设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} | 管理系统`
  }
  next()
})

export default router
