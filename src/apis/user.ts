import request from '@/utils/request'
import { RouteRecordRaw } from 'vue-router'

/**
 * 登陆
 * */
export function login(data: {
  username: string
  password: string
}): Promise<UserResponse> {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
/**
 * 注册
 * */
export function register(data: { username: string; password: string }) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}

/**
 *  获取当前登录用户信息
 * */
export function getUserInfo() {
  return request({
    url: '/auth/userInfo',
    method: 'get',
  })
}
/**
 * 登出接口
 * */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}
/**
 * 刷新token
 * */
export function refreshToken(data: {
  accessToken: string | undefined
  refreshToken: string | undefined
}) {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
    data,
  })
}

// 添加响应类型定义
interface UserResponse {
  data: {
    token: string
    access_token: string
    auths: string[]
    refreshToken: string
  }
}
