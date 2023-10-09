// 封装购物车模块
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/apis/cart'
export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    // 1.定义state-cartList
    const cartList = ref([])
    // 获取最新购物车列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    // 定义action-addCart
    const addCart = async (goods) => {

        const { skuId, count } = goods
        if (isLogin.value) {
            // 登录之后的加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            // 添加购物车操作
            // 已添加过 count+=新添加的count
            // 没有添加过 直接push

            const item = cartList.value.find((item) => item.skuId === goods.skuId)
            if (item) {
                // 找到了
                item.count += goods.count
            } else {
                // 没找到
                cartList.value.push(goods)
            }
        }

    }
    // 删除购物车
    const delCart = async (skuId) => {
        if (isLogin.value) {
            // 调用接口实现接口购物车中的删除功能
            await delCartAPI([skuId])
            updateNewList()
        } else {
            // 思路：
            // 1.找到要删除项的下标值 - splice
            // const idx=cartList.value.findIndex((item)=>skuId===item.skuId)
            // cartList.value.splice(idx,1)
            // 2.使用数组的过滤方法-filter
            cartList.value = cartList.value.filter(item => item.skuId !== skuId)
        }

    }
    // 清空购物车
    const clearCart = () => {
        cartList.value = []
    }
    // 单选功能
    const singleCheck = (skuId, selected) => {
        // 通过skuId找到要修改的那一项 然后把它的selected修改为传入的selected
        const item = cartList.value.find(item => item.skuId === skuId)
        item.selected = selected
    }
    //    全选功能
    const allCheck = (selected) => {
        // 把cartList中的每一项的selected都设置为当前的全选框状态
        cartList.value.forEach(item => item.selected = selected)
    }



    //    计算属性
    // 1.总的数量 所有项的count之和
    // reduce((a, c) => a + c.count, 0) 初始a=0 遍历 第一项 a=0+c.count  第二项 a=a+c.count c是每一项
    const allCount = computed(() => {
        return cartList.value.reduce((a, c) => a + c.count, 0)
    })
    // 2 总价 所有项的count*price之和
    const allPrice = computed(() => {
        return cartList.value.reduce((a, c) => a + c.count * c.price, 0)
    })
    // 3.已选择数量
    const selectedCount = computed(() => {
        return cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0)
    })
    // 4.已选择商品价钱合计
    const selectedPrice = computed(() => {
        return cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0)
    })
    // 是否全选
    const isAll = computed(() => {
        // 每项都为true则为true 否则为false
        return cartList.value.every(item => item.selected)
    })

    return {
        singleCheck,
        allCount,
        allPrice,
        cartList,
        addCart,
        delCart,
        isAll,
        allCheck,
        selectedCount,
        selectedPrice,
        clearCart,
        updateNewList
    }
}, {
    persist: true
})