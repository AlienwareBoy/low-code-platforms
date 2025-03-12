import request from '@/utils/request'

/**
 * 登陆
 * */
export function login(data: { username: string; password: string }) {
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
  console.log(data.password)
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
export function refreshUserToken(data: {
  accessToken: string | undefined
  refreshToken: string | undefined
}) {
  return request({
    url: '/auth/refresh-token',
    method: 'post',
    data,
  })
}
