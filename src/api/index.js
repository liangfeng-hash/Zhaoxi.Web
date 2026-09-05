/**
 * axios 实例的统一出口
 *
 * 现有组件的 `import axios from '@/api'` 继续可用，不受 API 分层改造影响。
 * 新代码建议改用模块化写法：import { getUserList } from '@/api/user'
 */
import service from './request'

export default service
