import { isBlank } from '@/utils/utils'

export default function mapToTree(dataList, includeRoot) {
  let root = { children: [] }
  for (let item of dataList) {
    const pathList = item.treePath.split(',')
    let node = root
    let nextNode
    for (let path of pathList) {
      if (isBlank(path)) {
        continue
      }
      const tmp = node.children.filter((item) => path === item.instancePoolId)
      nextNode = tmp.length > 0 ? tmp[0] : undefined
      if (undefined === nextNode) {
        nextNode = { instancePoolId: path, check: false, children: [] }
        node.children.push(nextNode)
      }
      node = nextNode
    }
    node = Object.assign(node, item)
  }

  if (includeRoot) {
    return [root.children[0]]
  }
  return root.children[0].children
}
