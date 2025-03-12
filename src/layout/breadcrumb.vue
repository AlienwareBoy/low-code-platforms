<!--  -->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbRoutes"
        :key="index"
        :to="{ path: item.redirect || item.path }">
        <p @click="handlePathChange(item)">{{ item.meta.title }}</p>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, toRefs } from 'vue'
import useGlobalStore from '@/store/config'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const store = useGlobalStore()
const route = useRoute()
// const router=useRouter()
const { menuRoutes } = storeToRefs(store)
interface DataProps {
  num: number
}
const breadcrumbRoutes = computed(() => {
  return route.matched
})
const handlePathChange = (item) => {
  console.info(item)
}
const state = reactive<DataProps>({ num: 3 })
const { num } = toRefs(state)
</script>
<style scoped></style>
