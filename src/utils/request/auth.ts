// src/utils/permission.ts
import { RouteRecordRaw } from 'vue-router'

/**
 * 递归过滤有权限的路由
 * @param routes 待过滤路由
 * @param permissions 权限数组
 */// 优化后的过滤函数（保持你的核心逻辑）
export function filterRoutes(
  routes: RouteRecordRaw[],
  permissions: string[]
): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 先处理子路由
    if (route.children) {
      route.children = filterRoutes(route.children, permissions)
    }

    const meta = route.meta || {}

    // 不需要认证的直接放行
    if (!meta.requiresAuth) return true

    // 检查权限配置
    const routeAuths = meta.auths || []
    
    // 保留三种情况：
    // 1. 通配符权限
    // 2. 有权限交集
    // 3. 包含有效子路由的父级
    return (
      routeAuths.includes('*') ||
      routeAuths.some((auth) => permissions.includes(auth)) ||
      (route.children?.length ?? 0) > 0
    )
  })
}

