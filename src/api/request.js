import axios from "axios";
import { apiUrl, authURL } from '@/common/index'
import mainStore from '@/store/index'
import router from '@/router/index'
import { ElMessage } from 'element-plus'


const service = axios.create({
     baseURL: apiUrl(),
})

//请求拦截器---在axios 发起请求之前要做的事儿   aop思想~~
service.interceptors.request.use(config => {

     var token = mainStore().accessToken;

     //这里就是配置 axiox 请求api的时候,带上的token 
     config.headers.Authorization = 'Bearer ' + token;

     return config;
});

//响应拦截器
service.interceptors.response.use(async response => {

     let { data, success, oValue, message } = response.data;
     if (success == false && oValue == 401) {
          // router.push("/login")
          //准备刷新token
          var refreshToken = mainStore().refreshToken;
          const reponse = (await axionRefreshToken(refreshToken)).data;
          if (reponse.success) {

               mainStore().$patch({
                    accessToken: reponse.data,
                    refreshToken: reponse.oValue
               })
               service.defaults.headers.common['Authorization'] = `Bearer ${data}`;
               return service(response.config);
          }
          else {
               router.push("/login");
          }
     }
     else if (success == false && oValue == 403) {

          ElMessage({
               message: "对不起,您不具备操作此功能的权限,请联系管理员",
               type: 'warning',
          })

     }
     return response;
}, err => {
     return Promise.reject(err);
})


//使用refreshtoken 去刷新 accesstoken
const axionRefreshToken = async (refreshtoken) => {
     const axionInstance = axios.create({
          baseURL: authURL(),
     })

     axionInstance.defaults.headers.common['Authorization'] = `Bearer ${refreshtoken}`;

     return axionInstance.get("auth/Account");
}


export default service;