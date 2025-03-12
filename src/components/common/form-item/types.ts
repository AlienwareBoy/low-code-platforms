import { UploadRequestOptions, UploadUserFile } from 'element-plus/es/components/upload/src/upload'
import { IDatePickerType } from 'element-plus/lib/components/date-picker/src/date-picker.type'
import { Component, VNode } from 'vue'
import {IMenuGroup} from '@wangeditor/core/dist/core/src/menus/interface'

// 默认
export interface commonConfig {
  formKey: string
  defaultValue: string
}
export interface exportValue {
  curIndex: number
  value: any
  formKey: string
}

// 输入框
export type InputType = 'text' | 'number' | 'textarea'
export interface InputConfigInterface {
  itemType?: InputType
	desc?:string
}
// 单选框
export interface RadioConfigInterface {
	config:SelectItem[]
	desc:string
}

// 时间选择器
export interface timeSelectInterface {
  itemType?: IDatePickerType
	disabledDate?: (date: Date) => boolean
}

// 上传
export interface uploadConfigInterface {
	action?: string
	headers?: Headers | Record<string, any>
	method?: string
	multiple?: boolean
	data?: Record<string, string | Blob | [string | Blob, string]>;
	name?: string
	showFileList?: boolean
	limit?: number
	accept?: string
	fileList?: UploadUserFile[]
	listType?: 'text' | 'picture' | 'picture-card'
	autoUpload?: boolean
	httpRequest?: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>
	disabled?: boolean
	needRawFile?: boolean
}

// custom
export interface CustomConfigInterface {

}

// 下拉选择器
type Children = string | number | boolean | VNode | null | Children[]

type Slot = () => Children

type Slots = { [name: string]: Slot }
export interface SelectItem {
  label: string
  value: string | number | boolean
}
export interface selectConfigInterface {
  // defaultValue: string | number | boolean | object
  h?: (type: string | Component, props?: object | null, children?: Children | Slot | Slots) => VNode
  title?: string
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  multiple?: boolean
  options?: SelectItem[]
  filterable?: boolean
}

//富文本editor
export interface wangEditorInterface {
	readOnly?:boolean // 是否只读
	insertKeys?: { //插入菜单
		index: number,//插入的位置，基于当前的 toolbarKeys
		keys: string | Array<string | IMenuGroup>,//菜单名称
	}
	excludeKeys?:Array<string>//删除某些菜单
	toolbarKeys?:Array<string | IMenuGroup>//配置菜单
}


export type uploadConfig = {
  type: 'upload'
  config?: uploadConfigInterface
}
export type timePickerConfig = {
  type: 'time-select'
  config?: timeSelectInterface
}
export type selectConfig = {
  type: 'select'
  config?: selectConfigInterface
}
export type InputConfig = {
  type: 'input'
  config?: InputConfigInterface
}
export type wangEditorConfig = {
	type:'wang-editor',
	config?:wangEditorInterface
}
export type customConfig = {
  type: 'custom'
  config?: CustomConfigInterface
}
export type RadioConfig={
	type: 'radio'
  config?: RadioConfigInterface
}
