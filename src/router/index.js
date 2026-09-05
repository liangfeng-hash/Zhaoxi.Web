import { createRouter, createWebHashHistory } from 'vue-router'
import axios from '@/api'
import mainStore from '../store/index';

const routes = [
   {
      path: '/',
      redirect: '/login'
   },
   {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/index.vue')
   },
   {
      name: "notfound",
      path: "/:pathMatch(.*)",
      component: () => import("../views/NotFound.vue")
   },
   {
      path: '/home',
      name: 'home',
      redirect: '/index',
      meta: { title: '首页' },
      component: () => import('../views/Home/index.vue'),
      children: [
         {
            path: '/index/:id?',
            name: 'index',
            meta: { title: '工作台' },
            component: () => import('../views/Home/index/index.vue')
         },
         // {
         //    path: '/user',
         //    name: 'user',
         //    meta: { title: '用户管理' },
         //    component: () => import('../views/Home/user/info/index.vue'),
         //    children: [
         //       {
         //          path: '/hello',
         //          name: 'hello',
         //          meta: { title: '工作台' },
         //          component: () => import('../views/Home/index/index.vue')
         //       }] 
         // },
         // {
         //    path: '/menu',
         //    name: 'menu',
         //    meta: { title: '菜单管理' },
         //    component: () => import('../views/Home/menu/info/index.vue'),
         // },
         // {
         //    path: '/role',
         //    name: 'role',
         //    meta: { title: '角色管理' },
         //    component: () => import('../views/Home/role/info/index.vue'),
         // },
         // {
         //    path: '/census',
         //    name: 'census',
         //    meta: { title: '统计分析' },
         //    component: () => import('../views/Home/census/index.vue')
         // },
         // {
         //    path: '/device',
         //    name: 'device',
         //    meta: { title: '设备监控' },
         //    component: () => import('../views/Home/device/list/index.vue'),
         //    children: [
         //       {
         //          path: 'list',  //设备列表
         //          name: 'list',
         //          meta: { title: '设备列表' },
         //          component: () => import('../views/Home/device/list/index.vue')
         //       },
         //       {
         //          path: '/device/manage',  //设备管理
         //          name: 'manage',
         //          meta: { title: '设备管理' },
         //          component: () => import('../views/Home/device/manage/index.vue')
         //       },
         //       {
         //          path: '/device/repair',  //设备维修
         //          name: 'repair',
         //          meta: { title: '设备维修' },
         //          component: () => import('../views/Home/device/repair/index.vue')
         //       },
         //    ]
         // }
      ]
   }
]







// console.log(modules); 
// console.log(modules['../views/Home/role/info/index.vue']);  
const router = createRouter({
   history: createWebHashHistory(),
   routes
})




//动态读取路由数据，添加动态路由
const SettingUserRouter = async () => {
   // //用作保存路由数据的数组---来自于api接口 "Menu/GetRouteTreeSelectList"
   let routeData = [];

   //开始请求api 获取路由数据
   //   let reponse = await axios.get("Menu/GetRouteTreeSelectList");
   let reponse = await axios.get("Menu");
   let { success, data } = reponse.data;
   if (success) {
      console.log("开始初始化路由信息");
      routeData = data;
      mainStore().initMenu(data);
   }
   else {
      // console.error("动态路由数据错了~");
      routeData = [];
   }

   // //读取当前项目中Views文件夹下的vue后缀的文件
   const modules = import.meta.glob('../views/Home/*/info/*.vue')
   //开始加载路由对应的Vue组件
   var initRoute = (routelist) => {
      var returnRoteArray = [];
      routelist.forEach(item => {
         let obj = {
            name: item.webUrlName,
            meta: {
               title: item.menuText,
               id: item.id
            },
            path: item.webUrl,
            component: modules[item.vueFilePath],
            children: []
         };

         if (item.children && item.children.length > 0) {
            obj.children = initRoute(item.children);

            returnRoteArray.push(obj);
         }
         else {
            returnRoteArray.push(obj);
         }
      });

      return returnRoteArray;
   }


   let treeRoutelist = initRoute(routeData);

   //开始动态添加路由节点-添加到全局状态
   treeRoutelist.forEach(item => {
      router.addRoute('home', item)
   });
}





// 需要在beforeEach里面使用pinia，否则无法成功初始化
router.beforeEach(async (to, from, next) => {
   if (to.path != "/login") {
      await SettingUserRouter();
      // console.log(router.getRoutes());
   }

   if (mainStore().$state.accessToken == "" || !mainStore().$state.accessToken) {
      if (to.path != "/login") {
         next("/login")
      }
   }

   // 由于统一配置了404页面的原因，这里要判断一下当前是否已经进入404页面
   if (to.name == "notfound") {
      // 由于是在导航里动态添加的路由，刷新页面时无法读取（刷新页面时没有跳转所以没有触发导航机制）
      // 所以要进行手动跳转到动态添加的路由，但是前提是跳转的path在路由中存在才行
      if (router.getRoutes().find(p => p.path == to.path)) {
         // 经过一些列判断后没问题则跳转
         next(to.path)
         return;
      }
   }
   next()
})




export default router