<template>
  <el-card class="box-card">
    <!-- 查询条件 -->
    <el-row class="search-el-row">
      <el-col :span="5">
        <div class="demo-input-size">
          <el-input v-model="listQuery.searchString" class="m-2" placeholder="菜单关键字" />
        </div>
      </el-col>
      <el-col :span="1.5">
        <div class="demo-input-size">

          <el-button :type="menuGetmenutreepage.backColor" :size="menuGetmenutreepage.size"
            :icon="initIcon(menuGetmenutreepage.icon)" v-if="menuGetmenutreepage" @click="menuQuery">{{
              menuGetmenutreepage.btnText }}</el-button>

          <!-- <el-button type="primary" :icon="Search" @click="menuQuery">查询</el-button> -->
        </div>
      </el-col>
      <el-col :span="2">
        <div class="demo-input-size">

          <el-button :type="menuAddmenu.backColor" :size="menuAddmenu.size" :icon="initIcon(menuAddmenu.icon)"
            v-if="menuAddmenu" @click="addMenu">{{ menuAddmenu.btnText }}</el-button>

          <!-- <el-button type="primary" :icon="Plus" @click="addMenu">新增</el-button> -->
        </div>
      </el-col>
    </el-row>

    <!-- 展示列表 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="lists" style="width: 100%; margin-bottom: 20px" row-key="id" border>
          <el-table-column prop="menuText" label="菜单名称">
            <template #default="{ row }">
              <el-icon>
                <component :is="initIcon(row.icon)"></component>
              </el-icon>
              {{ row.menuText }}
            </template>
          </el-table-column>
          <el-table-column prop="menuTypeDescription" label="菜单类型" width="90">
            <template #default="{ row }">
              <el-tag :type="row.menuType == 1 ? 'success' : 'danger'">
                {{ menutypeFilter(row.menuType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderBy" label="排序" width="140" />
          <el-table-column prop="webUrlName" label="路由名称" width="140" />
          <el-table-column prop="webUrl" label="路由地址" width="140" />
          <el-table-column prop="vueFilePath" label="Vue组件地址" width="180" />
          <!-- <el-table-column prop="createName" label="创建人"   /> -->
          <!-- <el-table-column prop="createTime" label="创建时间" width="180" /> -->
          <el-table-column label="操作">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">


                <!-- 编辑菜单 -->
                <el-button :type="menuUpdatemenu.backColor" :size="menuUpdatemenu.size"
                  :icon="initIcon(menuUpdatemenu.icon)" v-if="menuUpdatemenu && row.menuType == 1" @click="EditMenu(row.id)">{{
                    menuUpdatemenu.btnText }}</el-button>


                <!-- <el-button v-if="row.menuType == 1" type="success" @click="EditMenu(row.id)" size="small"
                  :icon="Edit">编辑菜单</el-button> -->

                <!--  编辑按钮 -->
                <el-button :type="menuUpdatebtn.backColor" :size="menuUpdatebtn.size" :icon="initIcon(menuUpdatebtn.icon)"
                  v-if="menuUpdatebtn && row.menuType == 2 " @click="EditBtn(row.id)">{{
                    menuUpdatebtn.btnText }}</el-button>


                <!-- <el-button v-if="row.menuType == 2" type="success" @click="EditBtn(row.id)" size="small"
                  :icon="Edit">编辑按钮</el-button> -->


                <!-- 删除菜单 -->
                <el-button :type="menuDeletemenu.backColor" :size="menuDeletemenu.size"
                  :icon="initIcon(menuDeletemenu.icon)" v-if="menuDeletemenu && row.menuType == 1 && row.isLeafNode"
                  @click="DeleteMenu(row.id, row.menuText)">{{
                    menuDeletemenu.btnText }}</el-button>

                <!-- <el-button v-if="row.menuType == 1 && row.isLeafNode" @click="DeleteMenu(row.id, row.menuText)"
                  type="danger" size="small" :icon="Delete">删除</el-button> -->

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页功能 -->
    <div class="pagination">
      <!-- total	总条目数                                                                                                                                                                                          @current-change="handleCurrentChange"  页码改变时会触发-->
      <el-pagination background layout="prev, pager, next,sizes" :total="rows" :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>

  <!-- Dialog 对话框--新增修改菜单专用 -->
  <el-dialog v-model="dialogVisible" :title="addOrEditTitle" width="40%" :before-close="handleClose">
    <el-form :model="menuForm" :rules="roleRules" ref="addmenuFormRef" label-width="120px">
      <el-form-item label="所属菜单" prop="parentId">
        <el-tree-select v-model="menuForm.parentId" :data="menutreedatalist" :props="{
          value: 'value', label: 'label', children: 'children'
        }" check-strictly="true" change="selectMenu" :render-after-expand="false" placeholder="请选择">
        </el-tree-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuText">
        <el-input v-model="menuForm.menuText" placeholder="菜单名称" />
      </el-form-item>
      <el-form-item label="路由名称" prop="webUrlName">
        <el-input v-model="menuForm.webUrlName" placeholder="路由名称" />
      </el-form-item>
      <el-form-item label="Vue组件路径" prop="vueFilePath">
        <el-input v-model="menuForm.vueFilePath" placeholder="Vue组件路径" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-select v-model="menuForm.icon" filterable placeholder="菜单图标">
          <el-option icon="el-icon-plus" v-for="item in iconList()" :key="item" :label="item" :value="item">
            <el-icon>
              <component :is="initIcon(item)"></component>
            </el-icon>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单排序">
        <el-input-number controls-position="right" v-model="menuForm.orderBy" placeholder="菜单排序" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnabled">
        <el-switch v-model="menuForm.isEnabled" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subMenuForm(addmenuFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>



  <!-- Dialog 对话框--修改按钮专用 -->
  <el-dialog v-model="btnDialogVisible" title="修改按钮" width="40%" :before-close="handleClose">
    <el-form :model="btnForm" :rules="btnRules" ref="editBtnFormRef" label-width="120px">
      <el-form-item label="按钮名称">
        <el-col :span="11">
          <el-form-item prop="btnText">
            <el-input v-model="btnForm.btnText" placeholder="按钮名称" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-select v-model="btnForm.icon" filterable placeholder="菜单图标">
          <el-option icon="el-icon-plus" v-for="item in iconList()" :key="item" :label="item" :value="item">
            <el-icon>
              <component :is="initIcon(item)"></component>
            </el-icon>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单背景" prop="backColor">
        <el-select v-model="btnForm.backColor" filterable placeholder="菜单背景">
          <el-option icon="el-icon-plus" v-for="item in btnbgColorArray" :key="item" :label="item.key"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="按钮大小" prop="size">
        <el-select v-model="btnForm.size" filterable placeholder="选择大小">
          <el-option v-for="item in btnSizeArray" :key="item" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="按钮描述">
        <el-col :span="11">
          <el-form-item prop="description">
            <el-input v-model="btnForm.description" type="textarea" />
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="btnDialogVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subBtnForm(editBtnFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

 


<script lang="ts" setup>


import { ref, reactive, onMounted, computed, markRaw } from 'vue'
import axios from '../../../../api/index'
import { Plus, Delete, Edit, Search, Setting } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { number } from 'echarts';

import { initIcon, iconList } from '@/common/index'
import { getCurrentMenuPermission } from '@/api/menu'
import { useRouter } from "vue-router";  //导入路由

var menuid = useRouter().currentRoute.value.meta.id;
console.log(`菜单Id:${menuid}`);


let lists = ref([]); //菜单信息详情
let rows = ref(1);//总条数
const listQuery = reactive({
  pageindex: 1, //第几页
  pageSize: 10, //每页多少条
  searchString: ''  //查询条件
});



const keydownEvent = () => {
  document.onkeydown = (e) => {
    if (e.defaultPrevented) {
      return;
    }
    const body = document.getElementsByTagName('body')[0];
    // match(xxxx应填写文件在浏览器中的地址，不需要包括https、http或者www)，这里是为了防止其他页面触发
    if (e.keyCode === 13) {
      console.log("按下了回车键");
      menuQuery();
    }
  };
};

let menuDeletemenu = ref(); //删除菜单
let menuUpdatebtn = ref();  //修改按钮
let menuAddmenu = ref();   //添加菜单
let menuUpdatemenu = ref();  //修改菜单
let menuGetmenutreepage = ref(); //查询


//初始化数据
onMounted(async () => {
  menuQuery();
  keydownEvent();
  var menuid = useRouter().currentRoute.value.meta.id;
  console.log(`菜单Id:${menuid}`);
  let buttonArray = await getCurrentMenuPermission(menuid);
  menuDeletemenu.value = buttonArray.find(btn => btn.btnValue == "menu-deletemenu");
  menuUpdatebtn.value = buttonArray.find(btn => btn.btnValue == "menu-updatebtn");
  menuAddmenu.value = buttonArray.find(btn => btn.btnValue == "menu-addmenu");
  menuUpdatemenu.value = buttonArray.find(btn => btn.btnValue == "menu-updatemenu");
  menuGetmenutreepage.value = buttonArray.find(btn => btn.btnValue == "menu-getmenutreepage");

});


//性别格式化
const menutypeFilter = computed(() => item => {
  switch (item) {
    case 1:
      return '菜单'
    case 2:
      return '按钮'
    default:
      return item
  }
})


//获取用户详情  http://47.109.25.112:10089/api/User/1/10
async function menuQuery() {
  let reponse = await axios.get(`/Menu/${listQuery.pageindex}/${listQuery.pageSize}/${listQuery.searchString}`);
  let { data, success, message } = reponse.data;

  if (success) {
    lists.value = data.dataList;
    rows.value = data.recordCount; //总条数
  } else {
    console.log(message)
  }
}

//分页 Size改变时会触发
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  listQuery.pageSize = val;
  menuQuery();
}

//页码改变时会触发
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  listQuery.pageindex = val;
  menuQuery();
}

//提示绑定的结果
const menuForm = ref({
  id: '00000000-0000-0000-0000-000000000000',
  parentId: '00000000-0000-0000-0000-000000000000',
  webUrlName: '',
  menuText: '',
  menuTtype: 1,
  vueFilePath: '',
  icon: '',
  webUrl: '',
  isEnabled: true,
  orderBy: 0,
  isLeafNode: true
});
const menutreedatalist = ref([]);

//控制新增菜单的弹框
const dialogVisible = ref(false)
const addOrEditTitle = ref('新增菜单');
const addMenu = async () => {

  addOrEditTitle.value = "新增菜单";
  menuForm.value = {
    id: '00000000-0000-0000-0000-000000000000',
    parentId: '00000000-0000-0000-0000-000000000000',
    webUrlName: '',
    menuText: '',
    menuTtype: 1,
    vueFilePath: '',
    icon: '',
    webUrl: '',
    isEnabled: true,
    orderBy: 0,
    isLeafNode: true
  };
  menutreedatalist.value = [];
  var reponse = await axios.get(`/Menu/GetMenusTreeSelectList`);
  let { data, success, message } = reponse.data;
  if (success) {
    menutreedatalist.value = data;
    console.log(message);
  } else {
    ElMessageBox.alert("获取树列表失败");
  }

  dialogVisible.value = true;
}

const addmenuFormRef = ref();
//校验相关
//引用验证规则
//校验英文菜单名称
const checkWebUrlName = async (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入路由名称'));
  } else {
    var reg = /[a-zA-Z_a-zA-Z]/;
    if (!reg.test(value)) {
      callback(new Error('路由名称只能由字母组成'));
    }
    else {
      var reponse = await axios.get(`menu/ValidateMenu/${menuForm.value.id}/${value}`)
      var { message, success } = reponse.data;
      if (!success) {
        callback(new Error('路由名称已经存在'));
      }
      else {
        callback();
      }
    }
  }
}


const checkParentId = async (rule, value, callback) => {
  if (value != '00000000-0000-0000-0000-000000000000' && value == menuForm.value.id) {
    callback(new Error('菜单不能作为自己的子菜单'));
  } else {
    callback();
  }
}


const roleRules = ref({
  parentId: [{ validator: checkParentId, trigger: 'blur' }],
  webUrlName: [{ validator: checkWebUrlName, trigger: 'blur' }],
  menuText: [{ required: true, message: '请输入中文菜单名称', trigger: 'blur' }],
  vueFilePath: [{ required: true, message: '请输入vue组件地址', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  webUrl: [{ required: true, message: '请输入WebUrL地址', trigger: 'blur' }]
});

//提交
let subMenuForm = async (uform) => {

  await uform.validate(async (valid, fields) => {
    if (valid) {
      var reponse;
      if (menuForm.value.id == '00000000-0000-0000-0000-000000000000') {
        reponse = await axios.post(`/Menu`, menuForm.value);
      }
      else {
        reponse = await axios.put(`/Menu`, menuForm.value);
      }
      let { message, success } = reponse.data;
      if (success) {
        ElMessage({
          type: 'success',
          message: message,
        })
        dialogVisible.value = false;
        menuQuery();
      } else {
        ElMessageBox.alert(message);
      }
    }
    else {
      console.error('校验失败');
    }
  });
}



//------------------------编辑菜单

//弹出编辑菜单窗口
const EditMenu = async (menuid) => {
  {
    var reponse = await axios.get(`/Menu/GetMenusTreeSelectList/${menuid}`);
    let { data, success, message } = reponse.data;
    if (success) {
      menutreedatalist.value = data;
      console.log(message);
    } else {
      ElMessageBox.alert("获取树列表失败");
    }
  }

  {
    var reponse = await axios.get(`/Menu/GetMenuById/${menuid}`);
    let { success, data } = reponse.data;
    if (success) {
      menuForm.value = data;
      addOrEditTitle.value = "修改菜单";
      dialogVisible.value = true;

    } else {
      ElMessageBox.alert("获取树列表失败");
    }
  }

}


//编辑按钮相关--------------------------
//编辑按钮

const btnSizeArray = [
  { key: "偏大", value: "large" },
  { key: "常规", value: "default" },
  { key: "偏小", value: "small" },
]


const btnbgColorArray = [
  { key: "白色", value: "default" },
  { key: "蓝色", value: "primary" },
  { key: "绿色", value: "success" },
  { key: "灰色", value: "info" },
  { key: "黄色", value: "warning" },
  { key: "红色", value: "danger" },
]



const btnForm = ref({
  btnText: '',
  icon: '',
  backColor: '',
  size: '',
  description: ''
});

const btnRules = ref({
  btnText: [{ required: true, message: '请输入按钮名称-建议在2-3个字左右', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
  backColor: [{ required: true, message: '请选择按钮样式', trigger: 'blur' }],
  size: [{ required: true, message: '请选择按钮大小', trigger: 'blur' }],
  description: [{ required: true, message: '请输入按钮描述', trigger: 'blur' }]
});

let btnDialogVisible = ref(false);
const editBtnFormRef = ref();


const EditBtn = async (btnIid) => {

  var reponse = await axios.get(`/Menu/GetBtnById/${btnIid}`);
  let { success, data } = reponse.data;
  if (success) {
    btnForm.value = data;
    btnDialogVisible.value = true;

  } else {
    ElMessageBox.alert("获取树列表失败");
  }
};

//按钮修改提交
let subBtnForm = async (uform) => {
  await uform.validate(async (valid, fields) => {
    if (valid) {
      var reponse = await axios.put(`/Menu/UpdateBtnAsync`, btnForm.value);
      let { message, success } = reponse.data;
      if (success) {
        ElMessage({
          type: 'success',
          message: message,
        })
        btnDialogVisible.value = false;
        menuQuery();
      } else {
        ElMessageBox.alert(message);
      }
    }
    else {
      console.error('校验失败');
    }
  });
}


//删除菜单
const DeleteMenu = async (menuid, menuName) => {

  ElMessageBox.confirm(
    `确定删除菜单【${menuName}】?`,
    '删除??',
    {
      type: 'warning',
      icon: markRaw(Delete),
    }

  ).then(async () => {
    let reponse = await axios.delete(`/menu/${menuid}`);
    let { data, success, message } = reponse.data;
    if (success) {
      ElMessage({
        type: 'success',
        message: message,
      })
      menuQuery();

    } else {

      ElMessage({
        type: 'warning',
        message: message,
      })
    }
  });
}


const handleClose = (done) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

</script>





<style>
.search-el-row {
  margin-bottom: 20px;

}

.el-row:last-child {
  margin-bottom: 0;

}

.el-col {
  border-radius: 4px;
  padding-left: 5px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>