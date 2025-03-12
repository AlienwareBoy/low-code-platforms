<template>
  <div>
    <el-input
      :type="config.itemType"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      size="small"
      :autosize="{ minRows: 2, maxRows: 4 }"
      v-model.trim="itemValue"
      @change.trim="getValue"
      @change.enter="getValue"></el-input>
			<p class="input-desc">{{ config.desc }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import { InputType, exportValue } from './types'
import { createRequestBody } from './mixins'
import { isNotBlank } from '@/utils/utils'
interface InputProps {
  placeholder?: string
  disabled: boolean
  curIndex: number
  formKey: string
  modelForm: Record<any, any>
  defaultValue: string
  config?: {
    maxlength?: number
    itemType?: InputType
		desc:string
  }
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  curIndex: 0,
  formKey: '',
  maxlength: 256,
  defaultValue: '',
  config: () => {
    return {
      itemType: 'text',
    }
  },
})
interface DataProps {
  itemValue: string
}
const getType = () => {
  if (props.config.itemType === 'number') {
    return 'text'
  } else {
    return props.config.itemType || 'text'
  }
}
let state = reactive<DataProps>({ itemValue: '' })
const emits = defineEmits<{
  (e: 'getValue', data: exportValue): void
  (e: 'update:modelForm', data: any): void
}>()
const getValue = (value: string) => {
  if (props.config.itemType === 'number' && !/^[0-9]*$/.test(value)) {
    state.itemValue = ''
    ElMessage.error('请输入数字')
    return
  }
  const body = createRequestBody(props.modelForm, { [`${props.formKey}`]: value })
  emits('update:modelForm', body)
  emits('getValue', {
    formKey: props.formKey,
    value: props.config.itemType === 'number' ? Number(value) : value,
    curIndex: props.curIndex,
  })
}
watch(
  () => props.defaultValue,
  (cur) => {
    console.log()
    if (isNotBlank(cur)) {
      state.itemValue = String(cur).trim()
    } else {
      state.itemValue = ''
    }
  }
)
const init = () => {
  if (props.defaultValue) {
    state.itemValue = props.defaultValue
  } else {
    state.itemValue = ''
  }
}
onMounted(() => {
  init()
})
let { itemValue } = toRefs(state)
let { config, maxlength, disabled, placeholder } = toRefs(props)
</script>
<style lang="scss" scoped>
.input-desc{
	font-size: 14px;
	color: #fff;
}
</style>
