<template>
  <div id="module">
    <el-container>
      <NavMenu />
      <el-container>
        <el-header>
          <!-- 面包屑 -->
          <Breadcrumb />

          <div v-if="mainStore().$state.user" style="display: inline-block;float: right;">
            <div style="display: inline-block; overflow: hidden; height: 36px;">
              <span>你好, 欢迎您! {{ mainStore().$state.user.userName }}</span>
            </div>
            <!-- 头像 -->
            <el-image style="width: 33px; height: 33px; padding: 10px;"
              :src="imageUrlFilter(mainStore().$state.user.imageurl)" :fit="fit" />
            <!-- 退出按钮 -->
            <el-button class="exit" type="primary" @click="goBack()">退出</el-button>
          </div>

        </el-header>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script setup>
import NavMenu from './navMenu.vue'
import Breadcrumb from './breadcrumb.vue' //引入组件
import { useRouter } from "vue-router";  //导入路由 
import { baseURL } from '@/common/index'
import { ref, reactive, onMounted, computed } from 'vue'
import mainStore from '../../store/index'

const router = useRouter();  //实例化路由 
//退出
function goBack() {
  mainStore().$patch({
    accessToken: null,
    refreshToken: null,
    menulist: [],
    user: null
  })

  router.push('/login');
}


//图片文件格式化
const imageUrlFilter = computed(() => item => {
  return `${baseURL()}${item}`;
})



</script>

<style scoped></style>