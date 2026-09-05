/**
 * 角色管理相关接口
 */
import request from './request'

/** 角色分页列表 */
export const getRolePage = (pageIndex, pageSize, searchString) =>
  request.get(`/Role/${pageIndex}/${pageSize}/${searchString}`)

/** 新增角色 */
export const createRole = (data) => request.post('/Role', data)

/** 删除角色 */
export const deleteRole = (roleId) => request.delete(`/role/${roleId}`)

/** 查询角色可分配的菜单树（含已勾选状态） */
export const getRoleMenuTree = (roleId) =>
  request.get(`/Role/GetAllMenuTreeListAsync/${roleId}`)

/** 保存角色的菜单权限 */
export const setRoleMenus = (data) => request.put('/Role/SetRoleMenusAsync', data)

/** 批量给用户分配角色 */
export const batchSetUserRole = (data) => request.put('Role/BatchSetUserRoleAsync', data)
