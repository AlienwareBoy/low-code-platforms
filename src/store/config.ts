import { defineStore } from 'pinia'
import routes from '@/router/index'
import { RouteRecordRaw } from 'vue-router'

interface adminProps {
  excludeHistory: { title: string; name: string; createTime: number }[]
  isShowSlider: boolean
  isPadding: boolean
  routes: RouteRecordRaw[]
  KeepLives: { title: string; name: string; createTime: number }[]
}
const useGlobalStore = defineStore('config', {
  state: (): adminProps => {
    return {
      excludeHistory:[],
      KeepLives: [],
      routes,
      isPadding: true,
      isShowSlider: true,
    }
  },
  getters: {
    menuRoutes(state) {
      return state.routes
    },
    sliderStatus(state) {
      return state.isShowSlider
    },
    layoutCantainerPadding(state) {
      return state.isPadding
    },
  },
  actions: {
    updateKeepLive(list: { title: string; name: string }[]) {
      this.KeepLives = list
    },
    deleteKeepLive(route: { title: string; name: string }) {},
    setSliderStatus(status: boolean) {
      this.isShowSlider = status
    },
    setLayoutCantainerPadding(status: boolean) {
      this.isPadding = status
    },
  },
})
export default useGlobalStore
