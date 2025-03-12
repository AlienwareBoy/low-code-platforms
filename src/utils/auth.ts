import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RefreshTokenKey = 'vue_admin_template_refresh_token'
function getNeedCheckNameFlagKey() {
  return 'ARMVM-APP-CHECK-NAME-FLAG'
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(refreshToken: string) {
  return Cookies.set(RefreshTokenKey, refreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}





export function removeNeedCheckNameFlag() {
  return Cookies.remove(getNeedCheckNameFlagKey())
}
