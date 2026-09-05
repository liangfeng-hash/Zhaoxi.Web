/**
 * 认证相关接口
 *
 * 走的是认证站（/auth/），与业务 API（/api/）不是同一个后端，
 * 因此单独建实例，不复用 request.js（那个的 baseURL 指向 /api/）。
 */
import axios from 'axios'
import { authURL } from '@/common/index'

const authRequest = axios.create({
  baseURL: authURL(),
})

/** 登录，返回 accessToken / refreshToken */
export const login = (data) => authRequest.post('auth/Account', data)

/** 用 refreshToken 换新的 accessToken */
export const refreshToken = (token) => {
  authRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return authRequest.get('auth/Account')
}
