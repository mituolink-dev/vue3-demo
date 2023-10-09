// axios基础的封装 创建axios实例
import axios from "axios";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { useUserStore } from '@/stores/user'
import router from '@/router'
// axios.create()方法可以执行多次，每次执行就会生成一个新的实例
// 如果项目里不同的业务模块需要的接口基地址不同，需要const http1=axios.create({baseURL:'url1'})  const http2=axios.create({baseURL:'url2'})
// 后续哪个接口要用哪个基地址再去引入哪个实例
const httpInstance = axios.create({
    // 基地址
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    // baseURL: 'http://127.0.0.1:8080',
    // 超时时间
    timeout: 5000
})
// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    // 1.从pinia获取token数据
    const userStore = useUserStore()
    // 2.按照后端的要求拼接 token数据
    const token = userStore.userInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    const userStore = useUserStore()
    // 统一错误提示
    ElMessage({ type: "warning", message: e.response.data.message })
    // 401token失效处理
    // 1.清除本地用户数据
    // 2.跳转到登录页
    if (e.response.status === 401) {
        userStore.clearUserInfo()
        router.push('/login')
    }
    return Promise.reject(e)
})
export default httpInstance
