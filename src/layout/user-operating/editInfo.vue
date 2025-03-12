<!--  -->
<template>
  <CommonDiaLog
    :config="{
      width: '30%',
      title: '修改资料',
    }"
    v-model:model-value="isShow"
    @update:model-value="$emit('update:isShow', false)"
    @handlerComfirm="handlerComfirm"
    @handlerError="
      () => {
        $emit('update:isShowBox', false)
        $emit('onerror', true)
      }
    "
    @close="$emit('update:isShow', false)"
  >
    <template v-slot:content>
      <div class="edit-info">
        <div class="template-image" >
          <div class="template-image-box template-image-choice" @click="handleChoiceFile">
            <div class="basic"></div>
          </div>
          <div class="template-image-box" @click="defaultImage=mmImage">
            <img :src="mmImage" alt="" />
          </div>
          <div class="template-image-box" @click="defaultImage=ggImage">
            <img :src="ggImage" alt="" />
          </div>
        </div>
        <div class="edit-info-showBox">
          <img :src="defaultImage" alt="" />
        </div>
      </div>
    </template>
  </CommonDiaLog>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'

interface DataProps {
  defaultImage: string
  mmImage: string
  ggImage: string
}
const props = withDefaults(
  defineProps<{
    isShow: boolean
  }>(),
  {}
)
const emits = defineEmits<{
  (e: 'update:isShowBox', data: any): void
  (e: 'onsuccess', data: any): void
  (e: 'onerror', data: any): void
}>()

const handlerComfirm = () => {
  console.info('asdf')
}
const state = reactive<DataProps>({
  defaultImage: new URL('@/assets/images/default.png', import.meta.url).href,
  mmImage: new URL('@/assets/images/mm.png', import.meta.url).href,
  ggImage: new URL('@/assets/images/gg.png', import.meta.url).href,
})
const handleChoiceFile=()=>{

}
const { isShow } = toRefs(props)
const { defaultImage, mmImage, ggImage } = toRefs(state)
</script>
<style lang="scss" scoped>
.edit-info {
  @include flexBox(row, center, center);
  &-showBox {
    margin-left: 40px;
    img {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
.template-image {
  @include flexBox(column, center, center);
  &-choice {
    position: relative;
    background: rgba(0, 0, 0, 0.6);
    width: 80px;
    height: 80px;
    .basic {
      width: 100%;
      height: 100%;
      position: absolute;
      background: url('@/assets/images/default.png') no-repeat;
      left: 0px;
      height: 0px;
      z-index: 10;
    }
  }
  &-box {
    margin-bottom: 20px;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
