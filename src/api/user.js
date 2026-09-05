/**
 * 用户管理相关接口
 */
import request from './request'

/** 用户分页列表 */
export const getUserPage = (pageIndex, pageSize, searchString) =>
  request.get(`/User/${pageIndex}/${pageSize}/${searchString}`)

/** 按 id 查用户详情 */
export const getUserById = (userId) => request.get(`/User/${userId}`)

/** 新增用户 */
export const createUser = (data) => request.post('/User', data)

/** 修改用户 */
export const updateUser = (userId, data) => request.post(`/user/${userId}`, data)

/** 删除用户 */
export const deleteUser = (userId) => request.delete(`/User/${userId}`)

/** 冻结用户 */
export const frozenUser = (userId) => request.put(`/User/FrozenUser/${userId}`)

/** 解冻用户 */
export const normalUser = (userId) => request.put(`/User/NormalUser/${userId}`)

/** 查询用户已分配的角色 */
export const getUserRoles = (userId) => request.get(`/role/${userId}`)

/** 设置单个用户的角色 */
export const setUserRole = (data) => request.put('User/SetUserRoleAsync/', data)
