// 定义懒加载插件
// 引入vueUse中的方法
import { useIntersectionObserver } from '@vueuse/core'
export const lazyPlugin = {
    install(app) {
        // 给图片添加v-img-lazy指令实现图片懒加载，当图片进入视口时，再设置.src属性，再去加载网络请求，提升性能
        app.directive('img-lazy', {
            mounted(el, binding) {
                // el:指令绑定的那个元素 img
                // binding:binding.value 指令等于号后面绑定的表达式的值 图片url
                const { stop } = useIntersectionObserver(
                    el,
                    ([{ isIntersecting }]) => {
                        // 当绑定的元素进入视口时，isIntersecting=true,设置.src属性，加载网络请求，加载完毕后将监听事件停止，不然会一直监听
                        // console.log(isIntersecting);
                        if (isIntersecting) {
                            el.src = binding.value
                            stop()
                        }
                    },
                )
            }
        })

    }
}
