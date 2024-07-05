import { Login } from '../interface/index'
import { publicPort } from '../config/servicePort'

import http from '../index'

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(publicPort + `/login`, params)
}

// 注册

export const registerApi = (params: Login.ReqLoginForm) => {
  return http.post(publicPort + `/register`, params)
}

// 用户退出登录
export const logoutApi = () => {
  return http.post(publicPort + `/logout`)
}
