import httpInstance from "@/utils/http";

export function getCategory() {
    // 返回promise对象，后续通过await或.then获取结果
    return httpInstance({
        url: 'home/category/head'
    })
}