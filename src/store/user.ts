import { defineStore } from 'pinia'
import router, { dynamicRoutesAdded } from '@/router/index'
import { register, login, refreshToken, getUserInfo } from '@/apis/user'
import { dynamicRoutes } from '@/router/routes'
interface UserInfo {
  userInfo: {
    auths: string[]
  }
}

const useUserStore = defineStore('user', {
  state: () => ({
    routesData: [],
    access_token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoading: false,
    error: null as Error | null,
    userInfo: {
      auths: [],
    },
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async redirectFirst() {
      const firstRoute = router
        .getRoutes()
        .find((r) => !r.meta?.hidden && r.path !== '/login')
      router.push(firstRoute?.path || '/')
    },

    login(username: string, password: string) {
      return new Promise(async (resolve, reject) => {
        this.isLoading = true
        this.error = null
        const { data } = await login({ username, password })

        this.accessToken = data.access_token
        // 2. 递归过滤路由
        const { filteredRoutes } = await dynamicRoutesAdded(data.auths)
        this.routesData = filteredRoutes
        const firstRoute = filteredRoutes[0]?.path || '/'
        await router.push(firstRoute)
        localStorage.setItem('accessToken', this.accessToken)
        resolve({ auths: data.auths })
      })
    },

    async register(userInfo) {
      try {
        this.isLoading = true
        this.error = null
        const response = await register(userInfo)
        return response.data
      } catch (error: any) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async updageUserInfo() {
      return new Promise(async (resolve) => {
        const { data } = await getUserInfo()
        this.accessToken = data.token
        // 2. 递归过滤路由
        const { filteredRoutes } = dynamicRoutesAdded(data.auths)
        console.log(filteredRoutes, 'filteredRoutes--')
        this.routesData = filteredRoutes
        resolve(true)
      })
    },
    setLoading(status) {
      this.isLoading = status
    },
    async refreshTokenAction() {
      try {
        this.isLoading = true
        this.error = null
        const response = await refreshToken(this.refreshToken!)
        this.accessToken = response.data.accessToken
        this.refreshToken = response.data.refreshToken
        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
        return response.data
      } catch (error: any) {
        this.error = error
        this.logout()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.userInfo = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.replace('/login')
    },
  },
})

export default useUserStore
