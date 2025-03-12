<!-- 列表某一行被双击时展示的明细弹窗 -->
<template>
  <CommonDiaLog
    :config="{
      title: '明细',
      hideConfirmBtn: true,
    }"
    v-model:model-value="isShowDescription"
    @update:model-value="$emit('update:isShowDescription', false)"
    @handlerError="handlerCloseReview">
    <template v-slot:content>
      <el-descriptions title="" :column="2" border>
        <el-descriptions-item v-for="item in descriptions">
          <template #label>
            <div class="cell-item">
              {{ item.label }}
            </div>
          </template>
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </CommonDiaLog>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import { tablePropsItem } from '../types'
import { timeFormatter } from '@/utils/formatter'
import { conversionText } from '@/utils/utils'
interface props {
  isShowDescription: boolean
  rowData: any
  columns: tablePropsItem[]
}

const emits = defineEmits<{
  (e: 'update:isShowDescription', data: any): void
}>()
const descriptions = computed(() => {
  let colArr = props.columns.filter(
    (item) => item.columnKey !== 'operating' && item.type !== 'selection'
  )
  let contents = colArr.map((item) => {
    item.value = props.rowData[`${item.columnKey}`]
    if (item.conversionList) {
      item.value = conversionText(props.rowData[item.columnKey], item.conversionList)
    }
    if (item.columnKey.indexOf('Time') > -1) {
      item.value = timeFormatter(props.rowData[item.columnKey])
    }
    if (Array.isArray(props.rowData[item.columnKey])) {
      item.value = props.rowData[item.columnKey].join('、')
    }
    return {
      label: item.label,
      value: item.value,
    }
  })
  return contents
})
const handlerCloseReview = () => {
  emits('update:isShowDescription', false)
}
const props = withDefaults(defineProps<props>(), {
  isShowDescription: false,
})
let { isShowDescription } = toRefs(props)
</script>
<style scoped lang="scss">
.el-descriptions {
  margin-top: 20px;
  :deep(.el-descriptions__body) {
    overflow: auto;
  }
}
.cell-item {
  display: inline-flex;
  align-items: center;
}
</style>
