import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
// 引入 Layout 组件
import Layout from '@/layout/index.vue'
// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: defineAsyncComponent(() => import('@/pages/login/index.vue')),
    meta: {
      auth: ['*'],
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    redirect: '/login',
  },
]

// 异步路由
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/member',
    name: 'Member',
    component: Layout,
    meta: {
      title: '会员管理',
      auths: ['member'],
    },
    children: [
      {
        path: 'list', // 子路由路径不需要以 / 开头
        name: 'MemberList',
        component: () => import('@/pages/member/list/index.vue'),
        meta: {
          title: '会员列表',
          auths: ['member:list'],
        },
      },
      {
        path: 'create', // 子路由路径不需要以 / 开头
        name: 'CreateMember',
        component: () =>
          defineAsyncComponent(
            () => import('../pages/member/create/index.vue')
          ),
        meta: {
          title: '新增会员',
          auths: ['member:create'],
        },
      },
    ],
  },
  {
    path: '/lowcode',
    name: 'LowCode',
    component: Layout,
    meta: {
      title: '低代码',
      auths: ['lowcode'],
      // 需要权限
    },
    children: [
      {
        path: 'list', // 子路由路径不需要以 / 开头
        name: 'LowCodeList',
        component: () => import('@/pages/lowcode/index.vue'),
        meta: {
          title: '增加新页面',
          auths: ['lowcode:create'],
          showInbreadcrumb: true, // 修正：移除多余的 meta 嵌套
        },
      },
    ],
  },
  {
    path: '/material',
    name: 'Material',
    component: Layout,
    meta: {
      title: '物料管理',
      auths: ['material'],
    },
    children: [
      {
        path: 'list', // 子路由路径不需要以 / 开头
        name: 'MaterialList',
        component: () => import('@/pages/material/list/index.vue'),
        meta: {
          title: '物料列表',
          auths: ['material:list'],
        },
      },
      {
        path: 'create', // 子路由路径不需要以 / 开头
        name: 'CreateMember',
        component: () => import('@/pages/member/create/index.vue'),
        meta: {
          title: '新增物料',
          auths: ['material:create'],
        },
      },
    ],
  },
]

// 合并所有路由
const allRoutes: RouteRecordRaw[] = [
  ...constantRoutes,
  ...dynamicRoutes,
  // 404页面需放在最后
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/pages/error/404.vue'),
  //   meta: {
  //     title: '404',
  //     requiresAuth: false,
  //   },
  // },
]

export default allRoutes
