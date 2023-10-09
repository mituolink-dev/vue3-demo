// 用了插件持久化state时里的数据，与loaclstorage里同步绑定
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from "@/apis/user";
import { useCartStore } from './cartStore'
import { mergeCartAPI } from '@/apis/cart'
export const useUserStore = defineStore('user', () => {
    const cartStore = useCartStore()
    // 1.定义管理用户数据的state
    const userInfo = ref({})
    // 2.定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password });
        // 如果请求错误，不会执行后续逻辑，响应拦截器提示用户错误信息
        userInfo.value = res.result
        // console.log(res);
        // 合并购物车的操作
        await mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        cartStore.updateNewList()
    }

    // 退出时清除用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
        // 执行清空购物车的action
        cartStore.clearCart()
    }
    // 3.以对象的格式把state和action return
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: true
})