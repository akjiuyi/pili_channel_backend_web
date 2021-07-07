import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function resetPwd(params) {
  return request({
    url: '/user/resetPwd',
    method: 'POST',
    params: params
  })
}

