import { parseTime } from '@/utils/utils'
import { RouteMeta, RouteRecordRaw, Router } from 'vue-router'

export function timeFormatter(value: number) {
  if (value) {
    const d = new Date()
    d.setTime(value)
    return parseTime(d, '{y}-{m}-{d}')
  }
  return ''
}

export function dataFormatter(value: number) {
  if (value) {
    const d = new Date()
    d.setTime(value)
    return parseTime(d, '{y}-{m}-{d}')
  }
  return ''
}

export function constantsFormatter(value: any, constants: any[]) {
  for (let i in constants) {
    if (value === constants[i].value) {
      return constants[i].label
    }
  }
  return value
}

export function getConstantsField(
  value: any,
  constants: { [x: string]: { [x: string]: any } },
  field: string | number
) {
  for (let i in constants) {
    if (value === constants[i].value) {
      return constants[i][field]
    }
  }
}

export function constantsTypes(value: any, constants: any[]) {
  for (let i in constants) {
    if (value === constants[i].value) {
      return constants[i].type
    }
  }
  return value
}
export function filterAsyncRoutes(routes: any[], auths: string[]) {
  const res: any[] = []
  // console.info(routes, 'routes')
  if (routes && routes.length > 0) {
    routes.forEach((route) => {
      if (hasPermission(route, auths)) {
        route.children = filterAsyncRoutes(route.children, auths)
        res.push(route)
      }
    })
  }
  return res
}
function hasPermission(route: any, auths: string[]) {
  if (route.meta && route.meta.auths) {
    const result = auths.some(
      (auth) => route.meta && route.meta.auths && route.meta.auths.includes(auth)
    )
    return result
  }
}
// export function filterAsyncRoutes(routes: RouteRecordRaw[], auths: string[], router: Router) {
//   const res: RouteRecordRaw[] = []

//   if (routes && routes.length > 0) {
//     routes.forEach((route) => {
//       if (hasPermission(route, auths)) {
//         const clonedRoute = { ...route } // 克隆路由对象，以免直接修改原始路由
//         if (clonedRoute.children) {
//           // 递归过滤子路由
//           clonedRoute.children = filterAsyncRoutes(clonedRoute.children, auths,router)
//         }
//         res.push(clonedRoute)

//         // 利用 addRoute 方法动态添加路由
//         router.addRoute(clonedRoute)
//       }
//     })
//   }

//   return res
// }

// function hasPermission(route: RouteRecordRaw, auths:string[]) {
//   if (route.meta && route.meta.auths) {
//     return auths.some((auth) => route.meta && route.meta.auths && route.meta.auths.includes(auth))
//   }
// }
