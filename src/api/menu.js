/**
 * 菜单与按钮权限相关接口
 */
import request from './request'

/** 菜单分页列表 */
export const getMenuPage = (pageIndex, pageSize, searchString) =>
  request.get(`/Menu/${pageIndex}/${pageSize}/${searchString}`)

/** 菜单全部列表 */
export const getMenuList = () => request.get('Menu')

/** 按 id 查菜单详情 */
export const getMenuById = (menuId) => request.get(`/Menu/GetMenuById/${menuId}`)

/** 菜单树形下拉数据（新增时用） */
export const getMenuTreeSelect = () => request.get('/Menu/GetMenusTreeSelectList')

/** 菜单树形下拉数据（编辑时排除自身） */
export const getMenuTreeSelectExclude = (menuId) =>
  request.get(`/Menu/GetMenusTreeSelectList/${menuId}`)

/** 路由树形下拉数据 */
export const getRouteTreeSelect = () => request.get('Menu/GetRouteTreeSelectList')

/** 校验菜单名/路由是否重复 */
export const validateMenu = (menuId, value) =>
  request.get(`menu/ValidateMenu/${menuId}/${value}`)

/** 新增菜单 */
export const createMenu = (data) => request.post('/Menu', data)

/** 修改菜单 */
export const updateMenu = (data) => request.put('/Menu', data)

/** 删除菜单 */
export const deleteMenu = (menuId) => request.delete(`/menu/${menuId}`)

/** 按 id 查按钮详情 */
export const getButtonById = (btnId) => request.get(`/Menu/GetBtnById/${btnId}`)

/** 修改按钮 */
export const updateButton = (data) => request.put('/Menu/UpdateBtnAsync', data)

/** 查询当前用户对某菜单的按钮权限 */
export const getCurrentMenuPermission = async (menuId) => {
  const response = await request.get(`/Menu/GetCurrentMenuPermission/${menuId}`)
  const { data, success } = response.data
  return success && Array.isArray(data) ? [...data] : []
}
