<!--  -->
<template>
  <el-tree
    ref="permissionTree"
    class="tree-border"
    :data="treeData"
    highlight-current
    :default-checked-keys="defaultChecks"
    :props="{
      label: nodes.labelName,
      children: nodes.children,
    }"
    :node-key="nodes.nodeKey"
    empty-text="暂无数据"
    show-checkbox
    @check="nodeClick" />
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { isBlank, isNotBlank } from '@/utils/utils'
import { ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types'
const permissionTree = ref<InstanceType<typeof ElTree>>()
type keyType = 'children' | 'labelName' | 'nodeKey'
interface DataProps {
  defaultChecks: any[] // 默认选中的数据
  treeData: any[] // 渲染的数据
  checks: any[] // 当前被选中的数据
  flatArr: any[]
  id: any
}
interface props {
  nodes: Record<keyType, any>
}
const emits = defineEmits<{
  (
    e: 'updateNodes',
    data: {
      addNodes: string[]
      removeNodes: string[]
    }
  ): void
}>()
const props = withDefaults(defineProps<props>(), {
  nodes: () => {
    return {
      // 节点标识字段
      nodeKey: 'roleId',
      // 角色名称
      labelName: 'roleName',
      // 子级列表字段名
      children: 'children',
    }
  },
})
const init = (defaultChecks: any[], list: any[]) => {
  console.log(defaultChecks, list)
  state.treeData = list
  state.defaultChecks = defaultChecks
  state.checks = defaultChecks
}
//设置被选中的node
const setCheckNodes = () => {
  const checks = state.flatArr.filter((item) => state.checks.includes(item.permissionId))
  if (permissionTree.value) {
    permissionTree.value.setCheckedNodes(checks)
  }
}
const getDiffNodeList = () => {
  let currCheckedList = permissionTree.value?.getCheckedNodes(false, true) as TreeNodeData[]
  let currCheckedCodeList = currCheckedList.map((item) => item[props.nodes.nodeKey])
  console.log(currCheckedCodeList, 'currCheckedCodeList')
  // 找出新勾选的节点
  let addNodes = currCheckedCodeList.filter((item) => state.checks.indexOf(item) < 0)
  let removeNodes = state.checks.filter((item) => currCheckedCodeList.indexOf(item) < 0)
  return { addNodes, removeNodes }
}
const nodeClick = (node, nodeTree) => {
  state.checks = nodeTree.checkedNodes
  console.log(state.defaultChecks)
  console.log(nodeTree.checkedKeys, 'state.defaultChecks, nodeTree.checkedKeys')
  const { addNodes, removeNodes } = modifyArray(state.defaultChecks, nodeTree.checkedKeys)
  emits('updateNodes', { addNodes, removeNodes })
}
const modifyArray = (
  originalArray: string[],
  newArray: string[]
): { removeNodes: string[]; addNodes: string[] } => {
  const removeNodes: string[] = []
  const addNodes: string[] = []

  // 找到被删除的元素
  for (const num of originalArray) {
    if (!newArray.includes(num)) {
      removeNodes.push(num)
    }
  }

  // 找到新增的元素
  for (const num of newArray) {
    if (!originalArray.includes(num)) {
      addNodes.push(num)
    }
  }

  return {
    removeNodes,
    addNodes,
  }
}
const state = reactive<DataProps>({
  flatArr: [],
  treeData: [],
  defaultChecks: [],
  id: null,
  checks: [],
})

defineExpose({
  getDiffNodeList,
  init,
  setCheckNodes,
})
const { treeData, defaultChecks } = toRefs(state)
</script>
<style scoped></style>
