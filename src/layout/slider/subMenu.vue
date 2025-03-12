<!--  -->
<template>
  <el-sub-menu teleported :data="item" :index="(item.path as string)" :key="item.path" @mouseenter="handleOpenMenu($event, item.name as string)">
    <template #title>
      <div class="title">
        <i :class="['iconfont ', item.meta?.icon]" v-if="item.meta?.icon"></i>
        <span v-if="item.meta"> {{ item.meta.title }}</span>
      </div>
      <!-- <i :class="['iconfont ', item.meta?.icon]"></i>
      <span v-if="item.meta"> {{ item.meta.title }}</span> -->
    </template>
    <template v-for="route in item.children" :key="route.path">
      <template v-if="route.meta && !route.meta.isHidenRoute">
        <el-menu-item :index="item.path + '/' + route.path">
          <p class="elmenuItem">
            {{ route.meta.title }}
          </p>
        </el-menu-item>
      </template>
    </template>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import type { ElMenu as ElMenuRef } from 'element-plus'
interface SliderProps {
  item: RouteRecordRaw
}
const props = withDefaults(defineProps<SliderProps>(), {})
// const state = reactive<DataProps>({ num: 3 })
const ElMenuRefs = ref<InstanceType<typeof ElMenuRef>>()

const handleOpenMenu = (e: { preventDefault: () => void }, name: string) => {
  e.preventDefault()
  ElMenuRefs.value && ElMenuRefs.value.onOpen && ElMenuRefs.value.onOpen(name, [name])
}
const { item } = toRefs(props)
</script>
<style lang="scss" scoped>
:deep(.el-sub-menu__title) {
  // padding: 10px;
}
.elmenuItem {
  height: 40px;
  text-align: center;
  display: block;
  line-height: 40px;
  margin: 0 auto;
  text-align: center;
	color: #fff;
}
.el-menu-item {
  padding: 10px !important;
  height: 40px !important;
}
// .el-sub-menu__title {
//   margin: 0 auto;
// }
.subMenu {
  span {
    margin-left: 10px;
  }
}
.title {
  margin: 0 auto;
  @include flexBox(row, center, center);
  width: 100px;
	color: #fff;
  i {
    margin-right: 10px;
  }
}
</style>
