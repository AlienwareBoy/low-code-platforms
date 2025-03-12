import request from '@/utils/request'
export function fileUpload(data: any) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}