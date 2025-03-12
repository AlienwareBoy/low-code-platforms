<!--  -->
<template>
  <ElDialog
    destroy-on-close
    :model-value="isShow"
    :title="config.title"
    :width="config.width"
    :close-on-click-modal="false"
    @before-close="close"
    @close="close"
    custom-class="custom-dialog-wrapper">
    <slot name="content"></slot>
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click.stop="handlerError">{{ config.errorText || '取消' }}</ElButton>
        <ElButton v-if="!config.hideConfirmBtn" type="primary" @click="handlerComfirm">{{
          config.comfirmText || '确定'
        }}</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { reactive, toRefs, watch } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
interface ElDialogType {
  modelValue: boolean // 是否展示
  config: {
    // element-plus dialog同款配置
    title: string
    width: string
    comfirmText: string
    errorText: string
		hideConfirmBtn?: boolean
  }
}
interface DataProps {
  isShow: boolean
}

const props = withDefaults(defineProps<ElDialogType>(), {
  modelValue: false,
  config: () => {
    return {
      title: '标题',
      width: '30%',
      comfirmText: '确认',
      errorText: '取消',
			hideConfirmBtn: false
    }
  },
})
let state = reactive<DataProps>({ isShow: false })
const emits = defineEmits<{
  (e: 'update:modelValue', data: boolean): void
  (e: 'close'): void
  (e: 'handlerComfirm'): void
  (e: 'handlerError'): void
}>()
const handlerClose = () => {
  emits('handlerComfirm')
  emits('update:modelValue', false)
}
const handlerComfirm = () => {
  emits('handlerComfirm')
}
const handlerError = () => {
  emits('handlerError')
}
watch(
  () => props.modelValue,
  (cur: boolean) => {
    state.isShow = cur
  },
  { immediate: true }
)
const close = () => {
  emits('update:modelValue', false)
	emits('handlerError')
  emits('close')
}

const { config } = toRefs(props)
const { isShow } = toRefs(state)
</script>
<style lang="scss">
.custom-dialog-wrapper {
  background-color: #20242F;
}
</style>
