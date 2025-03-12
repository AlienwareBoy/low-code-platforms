import { createApp } from 'vue'
import router from './router'
import '@/assets/styles/reset.scss'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import plugins from './plugins'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { initApp } from './utils/request'
export type Apptype = typeof App
import App from './App.vue'
const root = createApp(App)

plugins(root)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  root.component(key, component)
}
root.use(createPinia()).use(router).mount('#app')
initApp()
