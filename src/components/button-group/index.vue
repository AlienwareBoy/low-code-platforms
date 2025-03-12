<!--  -->
<template>
  <div class="operaingGroup">
    <el-button
      class="operatingBtns"
      :type="item.type"
      v-for="item in permissionBtn || []"
      :key="item.auth + '-' + item.eventName"
      size="small"
      :disabled="checkisClick(item.disabled) || false"
      @click.stop="handleClick(item)"
      >{{ item.label }}</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { btnItem } from './const.types'
import bus from '@/utils/bus'
import { ElMessage, ElMessageBox } from 'element-plus'
import useStore from '@/store/user'
const store = useStore()
interface props {
  btns?: btnItem[]
}
const checkisClick = (fn?: any) => {
  if (fn) {
    return fn()
  } else {
    return true
  }
}

const permissionBtn = computed(() => {
  let arr = props.btns || []
  if (arr && arr.length > 0) {
    let result: btnItem[] = []
    result =
      props.btns?.filter((item) => {
        return store.BtnPermission.includes(item.auth) || item.auth === '*'
      }) || []
    return result
  } else {
    return []
  }
})
const props = withDefaults(defineProps<props>(), {})
const emits = defineEmits<{
  (e: string, data: string): void
}>()

const action = (label: string, fn: () => void) => {
  ElMessageBox.confirm(`是否执行${label}操作?`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    title: '提示',
    type: 'warning',
  })
    .then(() => {
      fn()
      ElMessage.success('操作成功!')
    })
    .catch(() => {})
}
const handleClick = (item: btnItem) => {
  if (item.beforeMessageBoxFn && item.beforeMessageBoxFn()) {
    action(item.label, item.action)
  }
  console.log(props.btns, 'props.btns')
  emits(item.eventName, '')
  if (props.btns && props.btns.length > 0) {
  }
}
</script>
<style lang="scss" scoped>
.operaingGroup {
  @include flexBox(row, flex-start, center, wrap);
}
.operatingBtns {
  margin-bottom: 2px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>
