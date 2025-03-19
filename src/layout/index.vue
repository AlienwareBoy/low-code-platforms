<template>
  <p>1</p>
  <div class="layoutFixex">
    <el-container style="height: 100%">
      <div
        class="slider-container"
        :style="[!store.sliderStatus ? 'margin-left:-200px' : '']"
      >
        <div class="admin-title">
          <p class="admin-title-core">
            <span>小程序低代码</span><span>管理系统</span>
          </p>
        </div>
        <div class="user-image">
          <div class="user-image-core" @click="handleClickImage">
            <img src="@/assets/images/demo1.jpg" alt="" />
            <p></p>
          </div>
          <span class="user-image-name">雷电</span>
        </div>
        <Slider :isShow="store.sliderStatus" :routes="routesData" />
        <div class="operating-list">
          <div class="operating-item" @click="handleOpenPassword">
            <i class="iconfont icon-mima"></i>
            <span>修改密码</span>
          </div>
          <el-popconfirm title="确定退出系统么?" @confirm="handleSignOut">
            <template #reference>
              <div class="operating-item">
                <i class="iconfont icon-mima"></i>
                <span>退出系统</span>
              </div>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <el-container direction="vertical">
        <Header
          @onEditUserInfo="handleOpenUserModal"
          @change="handleSignOut"
        ></Header>
        <RouteHistory />
        <el-main
          class="container-main"
          :style="store.sliderStatus ? '' : 'margin-left:0px'"
        >
          <div id="main-content-box" class="main-content-box">
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="KeepLive" :max="10">
                <component :is="Component" :key="route.name"></component>
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!-- <component
      :is="CurrComp"
      v-model:isShow="isShowEditPasswordBox"
      @handleClose="isShowEditPasswordBox = false"
      @onsuccess="
        () => {
          isShowEditPasswordBox = false
          CompType = null
        }
      "
      @onerror="CompType = null"
    ></component> -->
  </div>
</template>
<script lang="ts" setup>
import Header from './header/header.vue'
import Slider from './slider/index.vue'
import RouteHistory from './route-history.vue'
import useStore from '@/store/user'
import useGlobalStore from '@/store/config'
import { storeToRefs } from 'pinia'
import router from '@/router/index'
import storage from '@/utils/storage'
import { Comp, CompTypeInterface } from './user-operating/consts.types'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { getUserInfo } from '@/apis/user'

const store = useGlobalStore()
const user = useStore()
const { routesData } = storeToRefs(user)
interface data {
  CompType: CompTypeInterface
  isShowEditPasswordBox: boolean
}
const KeepLive = computed(() => {
  return store.KeepLives.map((item) => item.name)
})
const state = reactive<data>({
  CompType: null,
  isShowEditPasswordBox: false,
})
const { isShowEditPasswordBox, CompType } = toRefs(state)

const CurrComp = computed(() => {
  return Comp.get(state.CompType)
})
const handleOpenPassword = () => {
  state.isShowEditPasswordBox = true
  state.CompType = 'editPassword'
}
const handleClickImage = () => {
  state.isShowEditPasswordBox = true
  state.CompType = 'editInfo'
}

let handleOpenUserModal = () => {
  console.log('打开modal')
}
const handleSignOut = () => {
  user.logout()
  // resetDynamicRoutes() // 新增路由重置
  router.replace('/login')
}
const init = async () => {
  // const res = await user.updageUserInfo()
  const result = await getUserInfo()
  console.log(result, 'd')
}
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.layoutFixex {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
}

.slider-container {
  position: relative;
  background-color: rgba(0, 8, 78, 1);
  transition: all 0.2s linear;
  margin-left: 0px;
  .operating-list {
    @include flexBox(row, space-around, center);
    position: absolute;
    background: rgba(0, 8, 78, 1);
    bottom: 0px;
    width: 100%;
    left: 0px;
    height: 50px;
    .operating-item {
      span {
        font-size: 14px;
        cursor: pointer;
        color: #fff;
      }
    }
  }
}
// .el-header {
//   padding: 0px;
//   height: 80px;
// }
.content-main {
  margin-left: 200px;
  padding-top: 100px;
}
// :deep(.el-main) {
//   // background: $main;
//   width: 100%;
// }
.container-main {
  position: relative;
  // background: $main;
  transition: all 0.5s ease;
  margin-left: 0px;
  padding: 16px;
  background: #f5f5f5;
}
.main-content-box {
  position: relative;
  padding: 10px 16px;
  background-color: #fff;
  /* height: 43rem; */
  height: calc(100vh - 90px);
  width: 100%;
  top: 0px;
  left: 0px;
}
.user-image {
  margin-top: 17px;
  @include flexBox(column, center, center);
  &-name {
    color: #fff;
    font-size: 30px;
    text-align: center;
    @include textOverflow(150px);
  }
  &-core {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;
    margin-bottom: 18px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.admin-title {
  width: 200px;
  @include flexBox(column, center, center);
  padding: 15px;
  transition: all 0.5s ease;
  background: #00084e;
  &-tips {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    white-space: nowrap;
  }
  &-core {
    white-space: nowrap;
    span {
      font-weight: 400;
      font-size: 24px;
      &:nth-child(1) {
        font-size: 30px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 43.2px;
        color: rgba(42, 130, 228, 1);
      }
      &:nth-child(2) {
        color: rgba(255, 141, 26, 1);
        font-size: 20px;
        font-weight: 400;
      }
    }
    &:nth-child(2) {
      color: #fff;
      font-size: 13px;
      margin-top: 10px;
    }
  }
}
.admin-title-core {
  @include flexBox(column, center, center);
}
</style>
