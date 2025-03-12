<template>
  <el-date-picker
    v-model="value"
    end-placeholder="结束日期"
    placeholder="选择日期范围"
    range-separator="至"
    size="small"
    start-placeholder="开始日期"
    :default-time="getDefaultTime()"
    :type="config.itemType"
		:disabled-date="config.disabledDate"
    value-format="YYYY-MM-DD HH:mm:ss"
    @change="getValue" />
</template>
<!--     :default-value="[new Date('2000-01-01 00:00:00'), new Date('2000-01-01 23:59:59')]"
 -->
<script setup lang="ts">
import { reactive, toRefs, onMounted, watch } from 'vue'
import { ElDatePicker, dayjs } from 'element-plus'
import { ItemValue } from '../../filter-config/types'
// import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { createRequestBody } from './mixins'
import { isNotBlank } from '@/utils/utils'
const defaultValue = [
  dayjs().hour(0).minute(0).second(0),
  dayjs().add(1, 'day').hour(23).minute(59).second(59),
]
interface timeSelectProps {
  placeholder?: string
  disabled: boolean
  curIndex: number
  formKey: string
  modelForm: Record<any, any>
  defaultValue: any
  config?: {
    pickerOptions?: any
    itemType: string
    clearable?: boolean
		disabledDate: (date: Date) => boolean
  }
}
interface DataProps {
  value: any
}
const emits = defineEmits<{
  (e: 'getValue', data: ItemValue): void
  (e: 'update:modelForm', data: any): void
}>()
let state = reactive<DataProps>({ value: '' })
const props = withDefaults(defineProps<timeSelectProps>(), {
  formKey: '',
  defaultValue: '',
  config: () => {
    return {
      itemType: 'datetime',
			disabledDate: () => false
    }
  },
})
const getValue = (value: any) => {
  if (props.config.itemType === 'datetimerange') {
    emits('getValue', {
      curIndex: props.curIndex,
      formKey: props.formKey,
      value: state.value,
    })
    const body = createRequestBody(props.modelForm, { [`${props.formKey}`]: value })
    emits('update:modelForm', body)
  } else {
    emits('getValue', {
      curIndex: props.curIndex,
      formKey: props.formKey,
      value: state.value,
    })
    const body = createRequestBody(props.modelForm, {
      [`${props.formKey}TimeStart
`]: value,
      [`${props.formKey}EndStart`]: value[1],
    })
    emits('update:modelForm', body)
  }
}
const getDefaultTime = () => {
  if (props.defaultValue) {
    return props.defaultValue
  } else {
    if (props.config.itemType === 'datetimerange') {
      return defaultValue
    } else {
      return [dayjs()]
    }
  }
}
const initTime = () => {
  if (isNotBlank(props.defaultValue)) {
    state.value = props.defaultValue
  } else {
    state.value = props.config.itemType === 'datetimerange' ? defaultValue : ''
  }
}
watch(
  props,
  () => {
    initTime()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  initTime()
})
const { value } = toRefs(state)
const { config } = toRefs(props)
</script>
<style lang="scss" scoped></style>
