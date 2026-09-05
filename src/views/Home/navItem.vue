<template>
   <!-- 无子级 -->
   <el-menu-item class="menu" :index="basePath" v-if="!item.children || item.children.length <= 0">
      <el-icon>
         <component :is=initIcon(item.icon)></component>
      </el-icon>
      <span>{{ item.menuText }}</span>
   </el-menu-item>
   <!-- 有子级 -->
   <el-sub-menu class="menu" :index="basePath" v-else>
      <template #title>
         <el-icon>
            <component :is=initIcon(item.icon)></component>
         </el-icon>
         <span>{{ item.menuText }}</span>
      </template>
      <NavItem v-for="sub in item.children" :key="sub.webUrl" :item="sub" :basePath="sub.webUrl" />
   </el-sub-menu>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { initIcon } from '@/common/index'
import {
   House,
   Grid,
   Management,
   List,
   UserFilled,
   Checked,
   Ticket,
   Avatar,
   Picture
} from '@element-plus/icons-vue'


// const initUrl = (weburl, id) => {
//    if (!id) {
//       return `${weburl}/${id}`
//    }
//    return `${weburl}`
// }


function strIconToIocn(stricon) {
   if (stricon == "House") {
      return House;
   }
   else if (stricon == "Grid") {
      return Grid;
   }
   else if (stricon == "Management") {
      return Management;
   }
   else if (stricon == "List") {
      return List;
   }
   else if (stricon == "UserFilled") {
      return UserFilled;
   }
   else if (stricon == "Checked") {
      return Checked;
   }
   else if (stricon == "Ticket") {
      return Ticket;
   }
   else if (stricon == "Avatar") {
      return Avatar;
   }
   else if (stricon == "Picture") {
      return Picture;
   }
   else {
      return Avatar;
   }
}

const { item, basePath } = defineProps({
   item: {
      type: Object,
   },
   basePath: {
      type: String
   }
})

</script> 