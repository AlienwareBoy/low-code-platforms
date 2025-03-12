import { ButtonType, IconProps } from 'element-plus'

export interface btnItem {
  auth?: string // 权限没有则不显示
  disabled?: () => boolean // 是否可编辑，默认显示
  eventName: string // 自定义事件名
  label: string // 按钮名称
  type: ButtonType // element-plus  同款type
  icon?: IconProps  // icon
  beforeMessageBoxFn?: () => boolean //   事件前置判断
  action?: Request //调用的接口
}
