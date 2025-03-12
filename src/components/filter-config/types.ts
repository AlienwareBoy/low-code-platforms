import ItemInput from '../common/form-item/item-input.vue'
import ItemSelect from '../common/form-item/item-select.vue'
import ItemUpload from '../common/form-item/item-upload.vue'
import ItemTimeSelect from '../common/form-item/item-time-select.vue'
import ItemRadio from '../common/form-item/item-radio.vue'
import {
  timePickerConfig,
  selectConfig,
  InputConfig,
  uploadConfig,
  wangEditorConfig,
  customConfig,
  RadioConfig,
} from '../common/form-item/types'
import { markRaw, Component } from 'vue'
import { Arrayable } from 'element-plus/es/utils/typescript'
import { FormItemProp } from 'element-plus/es/components/form/src/form-item'
import {
  FormValidateCallback,
  FormValidationResult,
} from 'element-plus/es/components/form/src/types'
type btnType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'

export const itemMap = new Map<string, Component>([
  ['input', markRaw(ItemInput)],
  ['select', markRaw(ItemSelect)],
  ['upload', markRaw(ItemUpload)],
  ['time-select', markRaw(ItemTimeSelect)],
	['radio', markRaw(ItemRadio)],
])
export type formItem = {
  label: string // 筛选器名称
  formKey: string // 筛选器组件
  labelWidth?: number // label 宽度
  placeholder?: string // 文字提示
  disabled?: boolean // 是否可操作
  required?: boolean // 是否必选
  defaultValue?: any // 默认参数 需根据不同组件
  showMessage?: boolean // 展示文案
  isShow?: (params: Record<any, any>) => boolean | boolean // 是否展示
  span?: number // row col 24列 数字
  offset?: number // 相邻间隔
  comp?: any //组件
}
/**
 * 多组件配置
 * */
export type compConfigItem =
  | InputConfig
  | selectConfig
  | timePickerConfig
  | uploadConfig
  | wangEditorConfig
  | customConfig
  | RadioConfig
// 全组件按需配置
export type filterItem = formItem & compConfigItem
/***
 * 默认配置的泛型传这个泛型
 * */
export interface defalutSelectOptions {
  label: string
  value: string
}

export interface btnsConfigItem {
  label: string
  eventName: string
  span?: number
  offset?: number
  push?: number
  pull?: number
}
export interface ItemValue {
  value: any
  formKey: string
  curIndex: number
}
// export interface FilterConfigRules {}
export interface FilterConfigRefs extends HTMLElement {
  form: Record<any, any>
  resetForm: () => void
  getForm: <T>() => T | boolean
  checkParams: () => void
  submitForm: () => Record<any, any>
  reload: () => void
  validateField: (
    props?: Arrayable<FormItemProp> | undefined,
    callback?: FormValidateCallback | undefined
  ) => FormValidationResult
}
