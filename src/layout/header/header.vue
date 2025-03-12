<template>
 <div class="bim-header">
    <div class="fold">
      <div class="menu-fold" @click="handleFoldMenu">
        <el-icon color="#ffffff" class="no-inherit" v-if="!store.sliderStatus"><Expand /></el-icon>
        <el-icon color="#ffffff" class="no-inherit" v-else><Fold /></el-icon>
      </div>
      <Breadcrumb />
    </div>
    <div class="bim-header-right f-c-center">
      <i class="iconfont icon-lingsheng"></i>
      <i class="iconfont icon-yonghu" @click="jumpUserInfo"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import storage from '@/utils/storage'
import Breadcrumb from '../breadcrumb.vue'
import useGlobalStore from '@/store/config'
import { ElIcon } from 'element-plus'
const store = useGlobalStore()
interface DataProps {
  proInfo: any
}
const jumpUserInfo = () => {
  console.log('干嘛士大夫')
  defineEmits({
    change: () => {
      return {
        num: 3,
      }
    },
  })
}
const handleFoldMenu = () => {
  store.setSliderStatus(!store.isShowSlider)
}
onMounted(() => {
  if (storage.get('proInfo')) {
    state.proInfo = storage.get('proInfo')
  }
})
let state = reactive<DataProps>({ proInfo: { projectName: '优算云平台' } })
const { proInfo } = toRefs(state)
</script>
<style lang="scss" scoped>
@import './index.scss';
.fold {
  @include flexBox(row, flex-start, center);
}
.menu-fold {
  cursor: pointer;
  padding-right: 30px;
  // border-right: 1px solid #ccc;
  padding: 5px 10px;
  height: 100%;
  @include flexBox(row, center, center);
}
</style>
