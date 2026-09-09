<template>
   <div class="login">
      <div class="login-content">
         <!-- 表单 -->
         <div class="login-form login-item">
            <p class="login-title">朝夕后台管理系统2233</p>

            <el-form :model="temp" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
               <!-- 用户名 -->
               <el-form-item label="用户名" prop="name">
                  <el-input v-model="temp.name"></el-input>
               </el-form-item>

               <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="temp.password"></el-input>
               </el-form-item>

               <el-form-item>
                  <el-button @click="submitForm(ruleForm)">
                     登录</el-button>
               </el-form-item>
            </el-form>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router' //导入路由  
import { login } from '@/api/auth'
import { ElMessage } from 'element-plus'
import mainStore from '@/store/index'



const router = useRouter();
const temp = reactive({
   name: 'zhaoxi-admin',
   password: '123456'
})

const rules = reactive({
   name: [
      {
         required: true,
         message: '请输入用户名',
         trigger: 'blur',
      },
      {
         min: 3,
         max: 18,
         message: '长度为3-18位',
         trigger: 'blur',
      },
   ],
   password: [
      {
         required: true,
         message: '请输入密码',
         trigger: 'blur',
      },
      // {
      //    min: 3,
      //    max: 18,
      //    message: '长度为3-18位',
      //    trigger: 'blur',
      // },
   ],
})

const ruleForm = ref(null);

function submitForm(formEl) {

   formEl.validate(async valid => {
      if (valid) {
         console.log('ok');
         // 登录成功 开始加载当前用户所拥有的菜单
         let reponse = await login(temp);
         let { data, success, message, oValue } = reponse.data;
         if (success) { 
            mainStore().$patch({
               accessToken: oValue.accesstoken,
               refreshToken: oValue.refreshToken,
               user: data
            })
            router.push("/home")
         }
         else {
            ElMessage({
               message: message,
               type: 'warning',
            })
         }
      } else {
         console.log('error submit!!')
         return false
      }
   })
}

</script>