<!--  -->
<template>
  <div>
    <FilterConfig ref="FilterRefs" :config="filters" :btns="filtersBtns" @getForm="getForm" />
    <ButtonGroup :btns="operatingBtns" v-bind="$attrs" />
    <div>
      <CommonTable
        ref="commonTableRef"
        v-model:columns="realColumns"
        :data="tableData"
        :total="total"
        :pagin="pagin"
        :tableConfig="tableConfig"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        v-bind="$attrs">
        <template
          v-for="item in tableColum"
          :key="item.columnKey"
          v-slot:[item.columnKey]="{ data }">
          <slot :name="item.columnKey" :data="data"></slot>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, toRefs, nextTick, onUnmounted, ref, Ref, watch } from 'vue'
import { tablePropsItem } from '../common-table/types'
import { FilterConfigRefs, btnsConfigItem, filterItem } from '../filter-config/types'
import bus from '@/utils/bus'
import { CommonTableRef } from '../common-table/types'
import { removeEmptyProperties } from '@/utils/utils'
import { btnItem } from '../button-group/const.types'
const FilterRefs: Ref<FilterConfigRefs | null> = ref(null)
const commonTableRef: Ref<CommonTableRef | null> = ref(null)
interface props {
  columns: tablePropsItem[] // table colums
  mockData?: Record<any, any>
  operatingBtns: btnItem[]
  tableConfig?: {
    //   element-plus table 同款配置
    rowkey?: string | undefined
    isDbClick?: boolean
  }
  filters: filterItem[]
  filtersBtns: btnsConfigItem[] //筛选器配置
  isNeedFirstReload?: boolean | undefined //  是否需要异步加载组件，父组件设置默认为false,则初始化就加载一起，切换之后，则所有异步筛选器的默认参数到位之后，第一次初始化将携带配置好的参数进行筛选
  ajaxFn: Function // 请求的接口
}
interface DataProps {
  events: any[]
  isLoading: boolean
  searchForm: Record<any, any>
  tableData: Record<any, any>

  pagin: {
    pageSize: number
    pageNo: number
  }
  total: number
}
const realColumns = computed(() => {
  let colums = [
    { type: 'selection', fixed: 'left', columnKey: 'key', label: '筛选' },
    ...props.columns,
  ]
  return colums
})
const props = withDefaults(defineProps<props>(), {
  isNeedFirstReload: undefined,
  filtersBtns: () => {
    return [
      {
        eventName: 'search',
        label: '搜索',
      },
      {
        eventName: 'reset',
        label: '清空',
      },
    ]
  },
})

const tableColum = computed(() => {
  return props.columns.filter((item) => item.isScope)
})
const getForm = (params) => {
  console.info(params, 'params')
  state.searchForm = params
  state.pagin = {
    pageSize: state.pagin.pageSize,
    pageNo: 1,
  }
  // init(state.searchForm)
  reload(true)
}
watch(
  () => props.isNeedFirstReload,
  async (cur) => {
    if (cur) {
      let formData = await FilterRefs.value?.form.modelForm
      console.info('需要获取请求体后请求数据', formData)
      if (formData) {
        init({ ...removeEmptyProperties(formData), ...state.searchForm })
      }
    }
  }
)
const state = reactive<DataProps>({
  events: [],
  isLoading: false,
  tableData: [],
  searchForm: {},
  total: 1,
  pagin: {
    pageSize: 10,
    pageNo: 1,
  },
})
const init = (form = state.searchForm) => {
  console.dir(form, 'form123')
  if (props.mockData) {
    state.tableData = props.mockData
    return
  }
  state.isLoading = true
  state.tableData = []
  props.ajaxFn({ ...state.pagin, ...form }).then((res) => {
    nextTick(() => {
      state.tableData = res.responseData.pageData
      console.info(state.tableData, 'res')
    })
    state.total = res.responseData.total
    state.isLoading = false
  })
}
const handleSizeChange = (pageSize: number) => {
  state.pagin.pageSize = pageSize
  init()
}
const handleCurrentChange = (size: number) => {
  console.log(size, 'size')
  state.pagin.pageNo = size
  init()
}
const handlerOperating = (name: string) => {
  console.log(name, 'name')
  emits(name, {})
}

const emits = defineEmits<{
  (
    e: string,
    data: {
      [formProps: string]: string | number | object
    }
  ): void
}>()
onMounted(async () => {
  console.log('start event')
  if (typeof props.isNeedFirstReload === 'undefined') {
    init(state.searchForm)
  }
})
onUnmounted(() => {
  console.info('over')
})
onActivated(() => {
	console.log(1)
})
onDeactivated(() => {
})
const reload = (isInitCheckStatus = false) => {
  init(state.searchForm)
  isInitCheckStatus && commonTableRef.value?.initCheckStatus()
}
defineExpose({
  reload,
})
const { tableData, total, pagin, isLoading } = toRefs(state)
const { filtersBtns, operatingBtns, filters, tableConfig } = toRefs(props)
</script>
<style scoped></style>
