import request from '@/utils/request'

export function paymentChannels(params) {
  return request({
    url: '/common/paymentChannels',
    method: 'get',
    params: params
  })
}

export function appProducts(params) {
  return request({
    url: '/common/appProducts',
    method: 'get',
    params: params
  })
}