<template>
  <div>
    <!-- <el-radio-group class="ml-4" v-model="itemValue" @change="getValue">
      <el-radio v-for="option in config.options" :model-value="option.value" size="small"
        >{{ option.label }}
      </el-radio>
    </el-radio-group> -->
    <el-radio-group v-model="radio">
      <el-radio :value="3">Option A</el-radio>
      <el-radio :value="6">Option B</el-radio>
      <el-radio :value="9">Option C</el-radio>
    </el-radio-group>
    <p>{{ config.desc }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import { InputType, SelectItem, exportValue } from './types'
import { createRequestBody } from './mixins'
import { isNotBlank } from '@/utils/utils'
import { ref } from 'vue'

const radio = ref(3)

interface SelectProps {
  placeholder?: string
  disabled: boolean
  curIndex: number
  formKey: string
  modelForm: Record<any, any>
  defaultValue: string
  config?: {
    options: SelectItem[]
    desc?: string
  }
}

const props = withDefaults(defineProps<SelectProps>(), {
  disabled: false,
  curIndex: 0,
  formKey: '',
  maxlength: 256,
  defaultValue: '',
  config: () => {
    return {
      options: [],
    }
  },
})
interface DataProps {
  itemValue: string | number | boolean
}

let state = reactive<DataProps>({ itemValue: 1 })
const emits = defineEmits<{
  (e: 'getValue', data: exportValue): void
  (e: 'update:modelForm', data: any): void
}>()
const getValue = (value: string | number | boolean) => {
  console.log('---', value)
  const body = createRequestBody(props.modelForm, { [`${props.formKey}`]: value })
  emits('update:modelForm', body)
  emits('getValue', {
    formKey: props.formKey,
    value,
    curIndex: props.curIndex,
  })
}
watch(
  () => props.defaultValue,
  (cur) => {
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
    state.itemValue = props.config.options[0].value
  }
}
onMounted(() => {
  init()
})
let { itemValue } = toRefs(state)
let { config } = toRefs(props)
</script>
<style lang="scss" scoped>
.input-desc {
  font-size: 14px;
  color: #fff;
}
</style>
