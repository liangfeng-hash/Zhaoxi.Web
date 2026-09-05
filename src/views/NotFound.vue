<template>
    <el-empty :image-size="200" />
    <div>
        {{ num }}秒后跳转到登录页~
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import router from '../router/index'

let num = ref(5);
onMounted(() => {
     
});


</script>

 
