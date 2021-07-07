import request from '@/utils/request'

export function incomeLists(params) {
  return request({
    url: '/order/incomeLists',
    method: 'get',
    params: params
  })
}

export function incomeStatInfo(params) {
  return request({
    url: '/order/incomeStatInfo',
    method: 'get',
    params: params
  })
}

export function applyWithdraw(params) {
  return request({
    url: '/order/applyWithdraw',
    method: 'post',
    params: params
  })
}

