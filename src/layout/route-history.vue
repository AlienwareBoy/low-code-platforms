<template>
  <div class="historyList">
    <div class="routerList" v-if="routeList.length > 0">
      <template v-for="(item, index) in routeList" :key="item.path">
        <div class="history-item">
          <el-tag
            class="ml-2"
            type="warning"
            size="default"
            closable
            @close="handlerClickClose(index, item.name)"
            @click="handlerPathJump(item)"
            >{{ item.title }}</el-tag
          >
        </div>
      </template>
      <span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import storage from '@/utils/storage'
import useGlobalStore from '@/store/config'
import { ElMessage } from 'element-plus'
const store = useGlobalStore()
const route = useRoute()
const router = useRouter()
interface historyItem {
  title: string
  name: string
  createTime: number
}
interface DataProps {
  currActive: string
}

let state = reactive<DataProps>({ currActive: '' })
watch(
  () => route.path,
  (pre, cur) => {
    if (pre !== cur) {
      const nowName = route.name as string
      const item = {
        name: route.name as string,
        title: route.meta?.title || '请写title',
        createTime: new Date().getTime(),
      }
      if (store.KeepLives.length > 0) {
        const routeHave = store.KeepLives.findIndex((item: historyItem) => item.name === nowName)
        if (routeHave === -1) {
          store.KeepLives.push(item)
        }
      } else {
        store.KeepLives.push(item)
      }
      state.currActive = route.name as string
    }

    // let isSamePath = list.map((item) => item.name).indexOf(route.name as string)
    // let title = route.meta.v2 ? (route.meta.title as string) : (route.meta.title as string)
    // let item: historyItem = {
    //   title: title,
    //   name: route.name as string,
    //   createTime: new Date().getTime(),
    // }
    // if (isSamePath === -1) {
    //   list.push(item)
    //   store.KeepLives.push(item)
    // } else {
    //   list.splice(isSamePath, 1, item)
    // }
    // store.$patch({
    //   KeepLives: list,
    // })
    // state.currActive = item.name
  },
  { immediate: true }
)
watch(
  () => store.KeepLives.length,
  (length) => {
    if (length && length === 10) {
      let list = store.KeepLives.sort((a, b) => a.createTime - b.createTime)
      ElMessage.warning(`当前开启的标签页过多，为了保证性能，已经将${list[0].title}标签页自动关闭`)
      list.splice(0, 1)
      store.$patch({
        KeepLives: list,
      })
      store.updateKeepLive(list)
    }
  }
)
const handleDeleteHistory = () => {
  console.log('delete')
}
const routeList = computed(() => {
  return store.KeepLives
})
const handleFoldMenu = () => {
  store.setSliderStatus(!store.isShowSlider)
}
const handlerClickClose = (index: number, name) => {
  if (store.KeepLives.length === 1) return
  let isLastIndex = index === store.KeepLives.length - 1
  console.log(isLastIndex, name, 'isLasd')
  if (isLastIndex) {
    store.KeepLives.splice(index, 1)
    router.push({
      name: store.KeepLives[store.KeepLives.length - 1].name,
    })
  } else if (store.KeepLives[index].name === state.currActive) {
    router.push({
      name: store.KeepLives[store.KeepLives.length - 1].name,
    })
    store.KeepLives.splice(index, 1)
  } else {
    store.KeepLives.splice(index, 1)
  }
}
const handlerPathJump = (item: historyItem) => {
  console.log(item)
  if (route.name === item.name) return
  state.currActive = item.name
  router.replace({
    name: item.name,
  })
}
const { currActive } = toRefs(state)
</script>
<style lang="scss" scoped>
.historyList {
  border-radius: 2px;
  display: flex;

}
.active {
  // border: 1px solid #000000;
}
.el-button:active {
  color: #000000;
}
.el-button:focus,
.el-button:hover {
  background-color: #fafafa;
}
.menu-fold {
  cursor: pointer;
  padding-right: 30px;
  // border-right: 1px solid #ccc;
  padding: 5px 10px;
  height: 100%;
  @include flexBox(row, center, center);
}
.routerList {
  @include flexBox(row, flex-start, center);
	padding: 10px;
  width: 100%;
  overflow-x: scroll;
  overflow-x: scroll;
  // background: $main;
  &::-webkit-scrollbar {
    height: 0px !important;
    background: #ccc;
  }
}
.history-item {
  // background: #0e2045;
  color: #fff;
  font-size: 4px;
  border-radius: 10px;
  padding: 0px 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  span {
    white-space: nowrap;
  }
  cursor: pointer;
  i {
    font-size: 14px;
  }
}
</style>
