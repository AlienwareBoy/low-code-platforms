import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'  // 确保已引入路由实例
const baseURL = import.meta.env.VITE_API_URL

// 创建基础 axios 实例
const request = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
})

// 请求拦截器 - 添加 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace('Bearer ', '')}`
  }
  return config
})

// 响应拦截器 - 处理 401 错误
request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.replace('/login')
    }
    return Promise.reject(error)
  }
)

// 核心刷新用户信息方法
export const updateUserInfo = async () => {
  try {
    // 先检查本地是否存在 token
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    // 调用用户信息接口
    const { data } = await request.get('/auth/userInfo')
    
    // 这里可以处理用户信息存储逻辑
    console.log('用户信息更新成功:', data)
    return data
    
  } catch (error) {
    console.error('用户信息更新失败:', error)
    localStorage.removeItem('token')
    router.replace('/login')
    throw error
  }
}

// 在应用初始化时调用（比如 main.ts）
export const initApp = async () => {
  try {
    await updateUserInfo()
    console.log('用户状态刷新成功，保持当前页面')
  } catch {
    console.log('用户状态已过期，跳转登录')
  }
}

export default request