import { ref, onMounted } from "vue";
import { getCategoryAPI } from "@/apis/category";
// 通过useRoute方法可以获取当前组件的路由参数，因为路由配置那里用的params传参（路径传参），所以route.params.id获取
import { useRoute } from "vue-router";
import { onBeforeRouteUpdate } from "vue-router";
export function useCategory() {
    const categoryData = ref({});
    const route = useRoute();
    // 如果不传参数,id=route.params.id是当前路径的id，传了to.params.id，id=to.params.id，是最新的路由参数的id，发新请求，页面更新新数据
    const getCategory = async (id = route.params.id) => {
        const res = await getCategoryAPI(id);
        categoryData.value = res.result;
    };
    onMounted(() => getCategory());
    // 路由只有参数变化时，会复用组件实例，导致生命周期函数不执行
    // 解决方法 1.在Layout的index.vue中的RouterView中添加独一无二的key，会导致组件重新销毁再加载，简单粗暴，但是性能不好
    // 2.用onBeforeRouteUpdate()，精细化控制，在路由跳转之前
    // 目标：路由参数变化的时候 可以把分类数据接口重新发送
    onBeforeRouteUpdate((to) => {
        getCategory(to.params.id);
    });
    return {
        categoryData
    }
}