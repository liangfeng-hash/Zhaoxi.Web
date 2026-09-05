<template>
  <el-aside width="200px" class="aside">
    <el-menu :default-active="route.path" exact class="el-menu-vertical-demo" router>
      <el-menu-item class="menu" index="/index" style="padding: 0px;">
        <div style="width: 60%; 
      padding-bottom: 30px;
      height: 80%;
      padding-left: 10px;">
          <el-image id="myImage" :src="zhaoxiImage" />
        </div>
      </el-menu-item>
      <NavItem v-for="v in treelist" :key="v.webUrl" :item="v" :basePath="v.webUrl" />
    </el-menu>
  </el-aside>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from "vue-router";  //导入路由
import NavItem from './navItem.vue'  //子组件 
import mainStore from '../../store/index'
import zhaoxiImage from '../../assets/img/zhaoxilogo.png'

const router = useRouter();
const route = useRoute();
// const data = mainStore().$state.menulist; //这个是菜单结果; 
// const leftMenulist = ref(mainStore().$state.menulist);

const treelist = computed(() => mainStore().$state.menulist);

// const initUrl = (weburl, id) => {
//   if (!id) {
//     return `${weburl}/${id}`
//   }
//   return `${weburl}`
// }




const items = reactive([
  {
    menuText: '首页',
    webUrl: '/index',
    icon: 'House'
  },
  {
    menuText: '用户管理',
    webUrl: '',
    icon: 'UserFilled',
    child: [
      { menuText: '用户详情', webUrl: '/user/info', icon: 'Avatar' },
      { menuText: '用户分析', webUrl: '/user/analyse', icon: 'Grid' },
    ]
  },
  {
    menuText: '设备监控',
    webUrl: '/device',
    icon: 'Checked',
    child: [
      { menuText: '设备列表', webUrl: '/device/list', icon: 'List' },
      { menuText: '设备管理', webUrl: '/device/manage', icon: 'Management' },
      { menuText: '设备维修', webUrl: '/device/repair', icon: 'Ticket' },
    ]
  },
  { menuText: '统计分析', webUrl: '/user/info', icon: 'Picture' },

])


</script>

<style scoped></style>


