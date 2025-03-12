type typeProps = 'selection' | 'index' | 'expand'

/**
 * columnKey table对应的key值
 */
export interface tablePropsItem {
  conversionList?: any[] | object // 用于展示当数据是一个常量数组时，匹配对应的中文
  label: string // 展示的文字
  columnKey: string // 展现的key值
  type?: typeProps //列类型
  isallSection?: boolean // 是否全选
  rowKey?: string
  isSelection?: boolean //是否选中
  width?: number //固定宽
  isScope?: boolean // 自定义显示内容，使用columnKey为具名插槽
  fixed?: boolean | 'left' | 'right' // 是否固定
	value?: string | undefined | null
}
export interface tableDataItem {
  itemKey: string
}
export interface CommonTableRef extends HTMLElement {
  init: () => void
  getSelectionRow: () => any[]
  initTableCheckStatus: (data: boolean | number | string) => any[]
	initCheckStatus: () => void
}
