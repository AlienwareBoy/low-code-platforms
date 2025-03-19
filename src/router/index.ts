import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRouter,
  type Router,
} from 'vue-router'
import allRoutes, { constantRoutes, dynamicRoutes } from './routes'
import useUserStore from '../store/user'
import { getUserInfo } from '@/apis/user'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

/**
 * 过滤路由，确保用户拥有所有配置的权限
 * @param routes 路由配置
 * @param auths 用户权限列表
 */
export function filterRoutes(
  routes: RouteRecordRaw[],
  auths: string[]
): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 如果没有配置 meta.auths，不允许访问
    if (!route.meta?.auths) return false

    // 检查用户是否拥有所有配置的权限
    const routeAuths = route.meta.auths
    const hasPermission = Array.isArray(routeAuths)
      ? routeAuths.every((auth) => auths.includes(auth)) // 用户必须拥有所有权限
      : auths.includes(routeAuths) // 单个权限直接检查

    // 递归过滤子路由
    if (route.children) {
      const filteredChildren = filterRoutes(route.children, auths)
      if (filteredChildren.length > 0) {
        route.children = filteredChildren
        return hasPermission // 只有父路由和子路由都满足权限时才保留
      }
      return false // 如果没有有效子路由，过滤父路由
    }

    return hasPermission // 如果没有子路由，直接检查父路由权限
  })
}

export function dynamicRoutesAdded(auths: string[]) {
  const filteredRoutes = filterRoutes(dynamicRoutes, auths)
  filteredRoutes.forEach((route) => router.addRoute(route))
  return { filteredRoutes }
}

/**
 * 重置动态路由
 */
export function resetDynamicRoutes() {
  const router = useRouter()
  const currentRoutes = router.getRoutes()

  // 移除所有动态路由
  currentRoutes.forEach((route) => {
    if (!route.meta?.isConstant) {
      // 假设常量路由有 isConstant 标记
      router.removeRoute(route.name as string)
    }
  })
}
// 修改路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.access_token !== null

  // 显示加载提示
  console.log(isLoggedIn, to, 'to')
  userStore.setLoading(true)

  if (isLoggedIn) {
    try {
      // 动态加载路由的逻辑
      await userStore.updageUserInfo()
      console.log(userStore.routesData, 'routesData')

      let hasPath = router.getRoutes().map((v) => v.path)
      console.log(hasPath, 'getRoutes-')

      if (hasPath) {
        // 强制重新触发导航（解决组件未渲染问题）
        if (to.matched.length === 0) {
          next({ ...to, replace: true }) // 强制重新解析当前路径
        } else {
          next()
        }
      } else {
        next('/') // 跳转到首页
      }
    } catch (error) {
      console.error('动态加载路由失败', error)
      // 如果动态加载路由失败，清除登录状态并跳转到登录页
      userStore.logout()
      next('/login')
    } finally {
      // 隐藏加载提示
      userStore.setLoading(false)
    }
  } else {
    // 如果用户未登录，继续导航
    next()
  }
})

export default router
