import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index' // 确保已引入路由实例
import { refreshToken } from '@/apis/user'
const baseURL = import.meta.env.VITE_API_URL
let isRefreshing = false // 是否正在刷新 Token
let failedQueue: Array<() => void> = [] // 存储失败的请求
// 创建基础 axios 实例
const request = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器 - 添加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace('Bearer ', '')}`
  }
  return config
})

// 响应拦截器 - 处理 401 错误
request.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
      // if (isRefreshing) {
      //   // 如果正在刷新 Token，将请求加入队列
      //   return new Promise((resolve) => {
      //     failedQueue.push(() => resolve(request(originalRequest)))
      //   })
      // }

      // originalRequest._retry = true
      // isRefreshing = true
      // try {
      //   // 使用 Refresh Token 刷新 Access Token
      //   const newAccessToken = await refreshAccessToken()
      //   if (newAccessToken) {
      //     // 更新请求头中的 Access Token
      //     originalRequest.headers = originalRequest.headers || {}
      //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      //     // 重新发送原始请求
      //     return request(originalRequest)
      //   }
      // } catch (refreshError) {
      //   // 刷新 Token 失败，跳转到登录页
      //   localStorage.removeItem('token')
      //   localStorage.removeItem('refreshToken')
      //   window.location.href = '/login'
      //   return Promise.reject(refreshError)
      // } finally {
      //   isRefreshing = false
      //   // 重新发送队列中的请求
      //   failedQueue.forEach((cb) => cb())
      //   failedQueue = []
      // }
    }
    return Promise.reject(error)
  }
)

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) {
    throw new Error('Refresh Token 不存在')
  }

  try {
    const refresh = localStorage.getItem('refreshToken')
    const accessToken = localStorage.getItem('accessToken')
    const response = await refreshToken({ accessToken, refreshToken: refresh })
    localStorage.setItem('accessToken', accessToken)
    return accessToken
  } catch (error) {
    throw new Error('刷新 Access Token 失败')
  }
}

export default request
