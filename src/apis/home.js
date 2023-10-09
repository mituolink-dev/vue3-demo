import httpInstance from "@/utils/http";

//获取banner
export function getBannerAPI(params = {}) {
    // 如果函数不传params参数，则params参数设置为{},再通过解构赋值为1
    // 如果函数传了params参数，则params=传进来的参数对象，再通过解构得到值为2（distributionSite有值为2）
    const { distributionSite = "1" } = params
    return httpInstance({
        url: '/home/banner',
        params: {
            distributionSite
        }
    })
}

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
    return httpInstance({
        url: '/home/new'
    })
}

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
    return httpInstance({
        url: '/home/hot'
    })
}

/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
    return httpInstance({
        url: '/home/goods'
    })
}