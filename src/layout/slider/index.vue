<template>
  <div class="asideContent">
    <el-aside width="200px" class="aside-capacity" :style="isShow ? 'margin-left:0px' : 'margin-left:-200px'">
      <div class="admin-slider">
        <el-menu class="el-menu-vertical-demo" background-color="#00084E" active-text-color="#E6A23C" collapse menu-trigger="click" ref="ElMenuRefs" unique-opened router>
          <template v-for="navMenu in routes">
            <template v-if="!navMenu.meta?.isHidenRoute || false">
              <template v-if="navMenu.meta?.isMenu">
                <el-sub-menu :index="(navMenu.redirect as string)" :key="(navMenu.redirect as string)" teleported>
                  <template #title>
                    <div style="width: 100%; text-align: center" @click="handleToPath(navMenu.path)">
                      <!-- <i :class="['iconfont ', navMenu.meta?.icon]"></i> -->
                      {{ navMenu.meta.title }}
                    </div>
                  </template>
                  <div style="width: 100%; text-align: center">{{ navMenu.meta.title }}</div>
                </el-sub-menu>
              </template>

              <template v-else>
                <!-- {{ navMenu }} -->
                <subMenu :item="navMenu"></subMenu>
              </template>
            </template>
          </template>
        </el-menu>
      </div>
    </el-aside>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, toRefs } from 'vue'
import { ElMenu, ElMenuItem, ElAside } from 'element-plus'
import type { ElMenu as ElMenuRef } from 'element-plus'
import subMenu from './subMenu.vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ElMenuRefs = ref<InstanceType<typeof ElMenuRef>>()
let defaultActive = ref(route.fullPath)
interface SliderProps {
  routes: RouteRecordRaw[]
  isShow: boolean
}
const handleToPath = (path) => {
  router.push({
    path: path,
  })
}
const props = withDefaults(defineProps<SliderProps>(), {
  isShow: true,
})
const handleCloseMenu = (e: { preventDefault: () => void }, name: any) => {
  // e.preventDefault()
  // ElMenuRefs.value && ElMenuRefs.value.onClose && ElMenuRefs.value.onClose(name, [name])
}
const { isShow, routes } = toRefs(props)
</script>
<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-width: auto;
  min-height: 40px;
}
.el-menu {
  width: auto;
  border-right: none;
}
</style>
