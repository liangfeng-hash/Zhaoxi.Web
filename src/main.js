import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import './style.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import piniaPluginPersist from 'pinia-plugin-persist'


const app = createApp(App)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
  
app.use(router);

let pi=createPinia().use(piniaPluginPersist); 
app.use(pi);

app.mount('#app');
