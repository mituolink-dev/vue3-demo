import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getCategoryAPI} from "@/apis/layout";

export const useCategoryStore = defineStore('category', () => {
    // 导航列表的数据管理，因为导航发了两次重复的请求，造成浪费，进行优化
    // 在父组件Layout中调用方法发请求，此时数组有数据，再在子组件中用数据即可
    // state 导航列表数据
    const CategoryList = ref([]);

    // action 获取导航数据的方法
    const getCategory = async () => {
        const res = await getCategoryAPI();
        console.log('getCategoryAPI', res);
        CategoryList.value = res.result;
    };
    return {
        CategoryList,
        getCategory
    }
})
