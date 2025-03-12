<template>
  <el-select
    :model-value="isNotBlank(itemValue) ? itemValue : ''"
    :multiple="config?.multiple || false"
    :collapse-tags-tooltip="config?.collapseTagsTooltip || false"
    :collapse-tags="config?.collapseTags || false"
    :disabled="disabled"
    :filterable="config.filterable"
    size="small"
    :placeholder="placeholder"
    @change="handleChangeValue"
    @remove-tag="handleGetDeleteTags"
    value-key="value">
    <template v-if="config.h">
      {{ config.h }}
    </template>
    <template v-else-if="config.options && config.options.length > 0">
      <p class="select-title" v-if="config.title">{{ config?.title }}</p>
      <el-option
        v-for="item in config.options || []"
        :key="(item.value as string)"
        :label="item.label"
        :value="item.value" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, watch, VNode, Component, computed } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { ItemValue } from '../../filter-config/types'
// 因版本问题,虽然不报错，但是并不能继承，先占位,版本修复问题后解决
import { SelectItem } from './types'
import { createRequestBody } from './mixins'
import { isNotBlank } from '@/utils/utils'

// export interface selectProps extends , commonConfig {
//   d?: number
// }

type Children = string | number | boolean | VNode | null | Children[]

type Slot = () => Children

type Slots = { [name: string]: Slot }
interface selectProps {
  disabled: boolean
  curIndex: number
  placeholder?: string
  formKey: string
  modelForm: Record<any, any>
  defaultValue?: any[] | string | number | boolean | object
  config: {
    h?: (
      type: string | Component,
      props?: object | null,
      children?: Children | Slot | Slots
    ) => VNode
    title?: string
    filterable?: boolean
    collapseTags?: boolean
    collapseTagsTooltip?: boolean
    multiple?: boolean
    options: SelectItem[]
  }
}

interface DataProps {
  itemValue: string | number | boolean | object
}
const props = withDefaults(defineProps<selectProps>(), {
  disabled: false,
  defaultValue: '',
  collapseTagsTooltip: false,
  placeholder: '请选择',
  config: () => {
    return {
      collapseTags: false,
      collapseTagsTooltip: false,
      multiple: false,
      options: [],
    }
  },
})
const handleGetDeleteTags = (val: any) => {
  emits('getDeleteValue', {
    formKey: props.formKey,
    value: val,
    curIndex: props.curIndex,
  })
}
const emits = defineEmits<{
  (e: 'getValue', data: ItemValue): void
  (e: `getDeleteValue`, data: ItemValue): void
  (e: 'update:modelForm', data: any): void
}>()
// const CurrSelectOptions = computed(async () => {
//   if (props.config.options) {
//     if (typeof props.config.options === 'function') {
//       const arr = await props.config.options()
//       console.info(arr, '阿山看了房东叫大叔')
//       return arr as SelectItem[]
//     } else if (typeof props.config.options === 'object') {
//       return typeof props.config.options || []
//     }
//   }
// })

onMounted(() => {
  console.log(props.defaultValue, 'select props.defaultValue')
  state.itemValue = props.defaultValue
})
const handleChangeValue = (value: any) => {
  console.log(value)
  emits('getValue', {
    formKey: props.formKey,
    value: value,
    curIndex: props.curIndex,
  })
  const body = createRequestBody(props.modelForm, { [`${props.formKey}`]: value })
  emits('update:modelForm', body)
}
watch(
  () => props.defaultValue,
  (cur) => {
    state.itemValue = cur
  }
)
onMounted(() => {
  if (props.defaultValue) {
    state.itemValue = props.defaultValue
  }
})
let state = reactive<DataProps>({ itemValue: '' })
let { config, placeholder } = toRefs(props)
let { itemValue } = toRefs(state)
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.select-title {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.17);
  padding: 4px 0px;
}
</style>
