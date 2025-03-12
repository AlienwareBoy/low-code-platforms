<template>
  <div style="margin: 20px" v-loading="isLoading">
    <div>
      <el-table
        ref="commonTableRefs"
        :data="getRenderTree"
        :style="{
          width: width,
        }"
        :indent="50"
        :select-on-indeterminate="false"
        :row-key="(props.tableConfig && props.tableConfig?.rowkey) || undefined"
        stripe
        :tree-props="tableConfig?.treeProps || undefined"
        @row-dblclick="handleDblClick"
        @select="handleSelectionClick"
        @select-all="selectAll">
        <template v-for="header in columns" :key="header.columnKey">
          <el-table-column
            v-if="header.type === 'expand'"
            type="expand"
            :width="header.width ? header.width : 60">
            <template #default="scope">
              <div class="flexDiv">
                <slot :name="header.columnKey" :data="scope.row"></slot>
              </div>
            </template>
          </el-table-column>
          <!-- 自定义table的select -->
          <el-table-column
            :fixed="header.fixed || false"
            width="40"
            align="center"
            v-if="header.type === 'selection' && !props.tableConfig?.rowkey">
            <template v-slot:header>
              <el-checkbox
                v-model="isAllCheck"
                :indeterminate="isIndeterminate"
                @change="handlerSelectAllBox"></el-checkbox>
            </template>
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.isCheck"
                @change="handleChangeSelectionItem"></el-checkbox>
            </template>
          </el-table-column>
          <!-- 用于级联table的操作 -->
          <el-table-column
            v-else-if="header.type === 'selection' && props.tableConfig?.rowkey"
            type="selection"
            width="40"></el-table-column>

          <el-table-column
            :fixed="header.fixed || false"
            :width="header.width"
            align="center"
            v-if="!header.type">
            <template v-slot:header>
              <div>
                <p class="headerLabel">{{ header.label }}</p>
              </div>
            </template>
            <template
              #default="scope"
              :style="{
                width: header.width || '100px',
              }">
              <p v-if="header.isScope">
                <slot :name="header.columnKey" :data="scope.row"></slot>
              </p>
              <div
                class="textStyle"
                v-else-if="
                  scope.row &&
                  header.columnKey &&
                  isNotBlank(scope.row[header.columnKey]) &&
                  header.conversionList
                ">
                <el-tooltip
                  class="box-item"
                  :content="conversionText(scope.row[header.columnKey], header.conversionList)"
                  placement="top">
                  <p class="textStyle">
                    {{ conversionText(scope.row[header.columnKey], header.conversionList) }}
                  </p>
                </el-tooltip>
              </div>
              <span class="textStyle" v-else>{{ scope.row[header.columnKey] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>

  <div class="pagin" v-if="isShowPagin">
    <el-pagination
      v-model:current-pageNo="currPage"
      v-model:pageNo-size="currPagesize"
      :pageNo-sizes="[10, 20, 50, 100]"
      :small="true"
      :disabled="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="width: 100%" />
  </div>
  <RowDescription
    v-if="isShowDescription"
    v-model:isShowDescription="isShowDescription"
    :rowData="rowData"
    :columns="columns"
    :hideConfirmBtn="true"
    @update:isShowBox="isShowDescription = false" />
</template>

<script setup lang="ts">
/**
 *
 * */
import { reactive, toRefs, ref, watch, onMounted, computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import type { CheckboxValueType, ElTable as commonTableType } from 'element-plus'
import { tablePropsItem } from './types'
import { isBlank, isNotBlank } from '@/utils/utils'
import { Column } from 'element-plus/es/components/table-v2/src/types'
import RowDescription from './operating/rowDescription.vue'
interface DataProps {
  realData: any[]
  isLoading: boolean
  isallSection: false
  currPage: number
  currPagesize: number
  selection: any[] // 当前被选中的数据
  isAllCheck: CheckboxValueType
  isIndeterminate: boolean
  isShowDescription: boolean
  rowData: object
}
const commonTableRefs = ref<InstanceType<typeof commonTableType>>()
const emits = defineEmits<{
  (e: 'handleSelectionChange', data: any): void
  (e: 'handleSizeChange', size: number): void
  (e: 'handleCurrentChange', size: number): void
  (e: 'handlerSelectAll', ids: any[]): void
  (e: 'handlerSelect', ids: any[]): void
}>()
interface tableProps<T = any> {
  total?: number
  isShowPagin?: boolean
  width?: string
  columns: tablePropsItem[]
  tableConfig?: {
    rowkey?: string | undefined
    isSelectLower?: boolean //能否级联 暂时无用
    treeProps?: {
      children: string
      hasChildren: string
    }
    isDbClick?: boolean // 是否支持双击某一行
  }
  pagin?: {
    pageNo: number
    pageSize: number
  }
  data: Array<{
    [dataKey: string]: string | number
  }>
}
watch(
  () => props.pagin,
  (cur) => {
    if (cur) {
      state.currPage = cur.pageNo
      state.currPagesize = cur.rows
    }
  }
)
watch(
  () => props.data,
  (cur) => {
    if (cur.length > 0) {
      init()
    } else {
      state.realData = []
    }
  },
  { deep: true }
)
watch(
  () => props.data.length,
  (cur) => {
    if (cur) {
      init()
    }
  }
)
const props = withDefaults(defineProps<tableProps>(), {
  isShowPagin: true,
  columns: () => [],
  data: () => [],
  rowkey: undefined,
  tableConfig: () => {
    return {
      isSelectLower: false,
    }
  },
  width: '100%',
  pagin: () => {
    return {
      pageNo: 1,
      rows: 10,
    }
  },
})
/**
 * 在非树形列表中,点选全部复选框
 * */
const handlerSelectAllBox = (val: CheckboxValueType) => {
  state.realData = state.realData.map((item) => {
    return {
      ...item,
      isCheck: val,
    }
  })
  state.isIndeterminate = false
  state.selection = state.realData
  emits('handlerSelectAll', val ? state.realData : [])
}
/**
 * 选择全部复选框
 * */
const selectAll = (selection: any[]) => {
  emits('handlerSelectAll', selection)
}
const setTableCheckboxAllStatus = (status: boolean) => {
  state.realData = state.realData.map((item) => {
    return {
      ...item,
      isCheck: status,
    }
  })
}
/**
 * 批量选中或单个选择数据
 * */
const setTableCheckboxStatus = (data: Record<any, any>[] | Record<any, any>, status: boolean) => {
  if (Array.isArray(data)) {
    state.realData = state.realData.map((item) => {
      return {
        ...item,
        isCheck: status,
      }
    })
  } else {
    let index = state.realData.findIndex(
      (item) =>
        item[props.tableConfig?.rowkey as string] === data[props.tableConfig?.rowkey as string]
    )
    if (index === -1) {
      console.error('未找到当前数据，请检查')
    } else {
      state.realData.splice(index, 1, {
        ...state.realData[index],
        isCheck: status,
      })
    }
  }
}
const handleSelectionClick = (selection: any[]) => {
  emits('handlerSelect', selection)
}
/**
 * 在非树形列表中,批量选中或单个选择数据
 * */
const handleChangeSelectionItem = () => {
  const selection = state.realData.filter((item) => item.isCheck)
  const isIndeterminate = selection.length !== state.realData.length
  if (isIndeterminate) {
    state.isIndeterminate = selection.length > 0 ? true : false
  } else {
    state.isIndeterminate = false
  }
  state.selection = selection
  console.info('自定义复选框', selection)
  emits('handlerSelect', selection)
}
/**
 * 暂未使用
 * */
const getSelectTreeNode = (list) => {
  let selectList: any[] = []
  list.forEach((item) => {
    if (item.isCheck) {
      selectList.push(item)
    }
    if (isNotBlank(item.children)) {
      selectList = selectList.concat(getSelectTreeNode(item.children))
    }
  })
  return selectList
}
/**
 * 双击
 * */
const handleDblClick = (row: any, column: Column) => {
  console.log(row, column, event)
  if (!props.tableConfig?.isDbClick) return
  state.isShowDescription = true
  state.rowData = row
}
// 转换类型文案
const conversionText = (text: any, list: any[] | object) => {
  let label = ''
  if (Array.isArray(list) && list.length > 0) {
    const arr = list.find((item: any) => item.value === text)
    if (isBlank(arr)) {
      console.error('转换失败：', text, list)
      return ''
    }
    return arr.label
  } else {
    if (typeof text === 'string' && text.length > 0) {
      let textArr = text.split(',')
      label = textArr
        .map((item: string) => {
          return (list as any)[item]
        })
        .join('、')
    }
    return label
  }
}
/**
 * 在非树形结构中,初始化所有列表的选中状态
 * @param val
 */
const initTableCheckStatus = (val: CheckboxValueType) => {
  state.realData = state.realData.map((item) => {
    return {
      ...item,
      isCheck: val,
    }
  })
  state.isAllCheck = val
}
/**
 * 点选分页器
 * @param val
 */
const handleSizeChange = (val: number) => {
  if (!props.tableConfig?.rowkey) {
    initTableCheckStatus(false)
    state.isAllCheck = false
    state.selection = []
    state.isIndeterminate = false
  }
  emits('handleSizeChange', val)
}
/**
 * 点选分页器数量
 * @param val
 */
const handleCurrentChange = (val: number) => {
  if (!props.tableConfig?.rowkey) {
    initTableCheckStatus(false)
    state.isAllCheck = false
    state.isIndeterminate = false
  }
  state.selection = []
  emits('handleCurrentChange', val)
}
const getSelectionRow = () => {
  return commonTableRefs.value!.getSelectionRows()
}
/**
 * 在非树形结构中，初始化传入的初始化数据
 * @param val
 */
const isCheckChangeArr = (tree: any[]) => {
  let res: any[] = []
  let selectIdxs = state.selection.map((item) => item.selectIdx)
  tree.forEach((item, index) => {
    if (item.children && item.children.length > 0) {
      if (!item.hasOwnProperty('isCheck')) {
        if (selectIdxs.includes(item.selectIdx)) {
          item.isCheck = true
        } else {
          item.isCheck = false
        }
      }
      item.index = index
      item.parentId = -1
      isCheckChangeArr(item.children)
      res.push(item)
    } else {
      item.parentId = item[props.tableConfig?.rowkey as string]
      if (!item.hasOwnProperty('isCheck')) {
        if (selectIdxs.includes(item.selectIdx)) {
          item.isCheck = true
        } else {
          item.isCheck = false
        }
      }
      item.index = index
      res.push(item)
    }
  })
  const isCheckListCount = tree.filter((item) => item.isCheck).length
  if (isCheckListCount > 0 && tree.length === isCheckListCount) {
    state.isAllCheck = true
  }
  if (isCheckListCount === 0) {
    state.isAllCheck = false
    state.isIndeterminate = false
  }
  return res
}
let state = reactive<DataProps>({
  isIndeterminate: false,
  isAllCheck: false,
  selection: [],
  realData: [],
  isLoading: false,
  isallSection: false,
  currPage: 1,
  currPagesize: 10,
  isShowDescription: false,
  rowData: {},
})
const getRenderTree = computed(() => {
  return state.realData
})
const init = () => {
  if (props.data.length > 0) {
    let data = JSON.parse(JSON.stringify(props.data))
    data.forEach((item: any, idx: number) => {
      item.selectIdx = `1-${idx}`
    })
    const arr = isCheckChangeArr(data)
    state.realData = JSON.parse(JSON.stringify(arr))
  }
}
const initCheckStatus = () => {
  state.isAllCheck = false
  state.isIndeterminate = false
  state.selection = []
}
onMounted(() => {
  init()
})
let { columns, width, tableConfig, isShowPagin } = toRefs(props)
let { currPage, isIndeterminate, isAllCheck, currPagesize, isLoading, isShowDescription, rowData } =
  toRefs(state)
defineExpose({
  getSelectionRow,
  init,
  initCheckStatus,
})
</script>
<style lang="scss" scoped>
@import './index.scss';
.textStyle {
  @include textOverflow(100%, inline);
  font-size: 12px;
}
.pagin {
  @include flexBox(row, space-between, center);
  width: 100%;
  margin-top: 20px;
}
</style>
