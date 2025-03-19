import { createApp } from 'vue'
import router from './router'
import '@/assets/styles/reset.scss'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import plugins from './plugins'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupDynamicRoutes } from '@/router/index' // 引入权限检查函数
import App from './App.vue'
import { getUserInfo } from './apis/user'
import useUserStore from './store/user'

const root = createApp(App)

// 注册插件
plugins(root)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  root.component(key, component)
}

// 使用 Pinia 和 Router
root.use(createPinia()).use(router)

// 确保路由初始化完成后再挂载应用
router.isReady().then(async () => {
  root.mount('#app')
})
