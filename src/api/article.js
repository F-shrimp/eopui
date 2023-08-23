import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://127.0.0.1:5050/api/mana_info/show_info/',
    // url: 'http://127.0.0.1:5050/show_apinfo',
    method: 'get',
    params: query
  })
}

export function createrespecInfo(data) {
  return request({
    // url: 'http://127.0.0.1:5050/insert_info',
    url: 'http://127.0.0.1:5050/api/mana_info/insert_info/',
    method: 'get',
    params: data
  })
}

export function updaterespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/api/mana_info/update_info/',
    // url: 'http://127.0.0.1:5050/update_info',
    method: 'get',
    params: data
  })
}

export function findrespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/api/mana_info/show_rdinfo',
    method: 'get',
    params: data
  })
}

export function deleterespecInfo(data) {
  return request({
    // url: 'http://127.0.0.1:5050/del_info',
    url: 'http://127.0.0.1:5050/api/mana_info/delete_info',
    method: 'get',
    params: data
  })
}

export function ips_getinfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/ips_getinfo',
    method: 'get',
    params: data
  })
}
