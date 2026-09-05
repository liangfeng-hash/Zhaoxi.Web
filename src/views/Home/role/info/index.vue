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
          <el-button :type="rolegetrolepage.backColor" :size="rolegetrolepage.size" :icon="initIcon(rolegetrolepage.icon)"
            v-if="rolegetrolepage" @click="roleQuery">{{ rolegetrolepage.btnText }}</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="demo-input-size">

          <el-button :type="roleaddrole.backColor" :size="roleaddrole.size" :icon="initIcon(roleaddrole.icon)"
            v-if="roleaddrole" @click="addOrEditRole(null)">{{ roleaddrole.btnText }}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!-- 当 el-table 元素中注入 data 对象数组后，在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。 可以使用 width 属性来定义列宽。 -->
        <el-table :data="lists" stripe style="width: 100%">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : row.status == 2 ? 'warning' : 'danger'">
                {{ statusFilter(row.status) }}
              </el-tag>
            </template>
          </el-table-column> 
          <el-table-column prop="createTime" label="创建时间" width="230" />
          <el-table-column label="操作" width="450">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">

                <!-- 角色分配菜单 -->
                <el-button v-if="rolesetrolemenus" :type="rolesetrolemenus.backColor" :size="rolesetrolemenus.size"
                  :icon="initIcon(rolesetrolemenus.icon)" 
                  @click="setRoleMenu(row.roleId, row.roleName)">{{ rolesetrolemenus.btnText }}</el-button>

                <!-- 修改角色 -->
                <el-button  v-if="roleputrole" :type="roleputrole.backColor" :size="roleputrole.size" :icon="initIcon(roleputrole.icon)"
                  @click="addOrEditRole(row.roleId)">{{ roleputrole.btnText }}</el-button>

                <!-- 批量分配用户角色 -->
                <el-button v-if="rolebatchSetUserRole" :type="rolebatchSetUserRole.backColor" :size="rolebatchSetUserRole.size"
                  :icon="initIcon(rolebatchSetUserRole.icon)" 
                  @click="batchSetuserRole(row.roleId)">{{ rolebatchSetUserRole.btnText }}</el-button>

                <!-- 删除角色 -->
                <el-button v-if="roledeleterole" :type="roledeleterole.backColor" :size="roledeleterole.size"
                  :icon="initIcon(roledeleterole.icon)" 
                  @click="deleteRole(row.roleId, row.roleName)">{{ roledeleterole.btnText }}</el-button> 
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <div class="pagination">
        <!-- total	总条目数                                                                                                                 @current-change="handleCurrentChange"  页码改变时会触发-->
        <el-pagination background layout="prev, pager, next,sizes" :total="rows" :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-row>
  </el-card>

  <!-- Dialog 对话框--新增角色专用 -->
  <el-dialog v-model="dialogVisible" :title="addorEditTitle" width="40%">
    <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="120px">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="roleForm.roleName" placeholder="角色名" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-switch v-model="roleForm.isEnabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属所有用户">
            <el-switch v-model="roleForm.isRoleUserAll" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subRoleForm(roleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Dialog 对话框--设置角色菜单专用 -->
  <el-dialog v-model="setMenudgVisible" :title="setRoleMenutitile" width="50%">
    <!-- 展示的树结构--包含菜单和按钮 -->
    <div class="custom-tree-node-container">
      <el-tree :data="datatreelist" show-checkbox="true" node-key="id" empty-text="lable" check-on-click-node="true"
        highlight-current="true" :expand-on-click-node="false" ref='treelistTemple'
        :default-checked-keys="selectTreeArray" :props="{
          label: 'menuFllText', children: 'children',
          class: customNodeClass
        }">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-icon>
              <component :is="initIcon(data.icon)"></component>
            </el-icon>
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>

    </div>

    <!-- <div class="custom-tree-node-container">
      <el-tree :data="data" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
        :props="{ class: customNodeClass }" />
    </div> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setMenudgVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subSetRoleMenu">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>


  <!-- Dialog 对话框--设置角色专用 -->
  <el-dialog v-model="setroledgVisible" title="角色批量分配用户" width="40%" height="60%">
    <el-row>
      <el-col :span="8">
        <div class="demo-input-size">
          <el-input v-model="uselistQuery.searchString" class="m-2" placeholder="菜单关键字" />
        </div>
      </el-col>
      <el-col :span="1.5">
        <div class="demo-input-size">
          <el-button type="primary" :icon="Search" @click="userListQyery">查询</el-button>
        </div>
      </el-col>
    </el-row>


    <!-- 批量给角色设置归属多个用户 -->
    <el-table :data="batchSetuserRoleTableAllData" style="cursor:pointer;" @row-click="selectedUser">
      <el-table-column width="80">
        <template #default="{ row }">
          <div class="box-card-setUser" :class="row.selected ? 'userSelected' : 'no-userSelected'">
            <span>{{ row.selected == true ? '选中' : '未选中' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="name" label="用户名" />
      <el-table-column property="status" label="用户状态">
        <template #default="{ row }">
          {{ statusFilter(row.status) }}
        </template>
      </el-table-column>
      <el-table-column property="sex" label="性别">
        <template #default="{ row }">
          {{ sexFilter(row.sex) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :current-page="uselistQuery.pageindex"
      @current-change="userHandleCurrentChange" :total="userTotal" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setroledgVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subBatchSetRole">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

 

<script setup>

import { ref, reactive, onMounted, computed } from 'vue'
import axios from '@/api'
import {
  InfoFilled, Plus, Delete, Edit, Search, Setting,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { markRaw, nextTick } from 'vue'
import { fromPairs } from 'lodash'
import { initIcon, iconList } from '@/common/index'
import { getCurrentMenuPermission } from '@/api/menu'

import { useRouter } from "vue-router";  //导入路由



var menuid = useRouter().currentRoute.value.meta.id;
console.log(`菜单Id:${menuid}`);


// 角色分页列表相关
let lists = ref([]); //角色列表
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
      roleQuery();
    }
  };
};


let rolegetrolepage = ref(); //查询
let roleaddrole = ref(); //添加

let roledeleterole = ref(); //删除
let rolesetrolemenus = ref(); //分配菜单
let rolebatchSetUserRole = ref(); //批量分配用户
let roleputrole = ref();  //修改角色信息






onMounted(async () => {
  roleQuery();
  keydownEvent();

  var menuid = useRouter().currentRoute.value.meta.id;
  console.log(`菜单Id:${menuid}`);
  let buttonArray = await getCurrentMenuPermission(menuid);
  rolegetrolepage.value = buttonArray.find(btn => btn.btnValue == "role-getrolepage");
  roleaddrole.value = buttonArray.find(btn => btn.btnValue == "role-addrole");
  roledeleterole.value = buttonArray.find(btn => btn.btnValue == "role-deleterole");
  rolesetrolemenus.value = buttonArray.find(btn => btn.btnValue == "role-setrolemenus");
  rolebatchSetUserRole.value = buttonArray.find(btn => btn.btnValue == "role-batchsetuserrole");
  roleputrole.value = buttonArray.find(btn => btn.btnValue == "role-putrole");
});

//获取角色详情  https://localhost:7123/api/Role/1/20
async function roleQuery() {
  let reponse = await axios.get(`/Role/${listQuery.pageindex}/${listQuery.pageSize}/${listQuery.searchString}`);
  let { data, success, message } = reponse.data;
  if (success) {
    lists.value = data.dataList;
    rows.value = data.recordCount; //总条数
  } else {
    console.log(message)
  }
}

//状态格式化  0正常 1冻结 2删除
const statusFilter = computed(() => item => {
  switch (item) {
    case 1:
      return '正常 '
    case 2:
      return '冻结'
    case 3:
      return '删除'
    default:
      return "不明状态"
  }
})

//分页 Size改变时会触发
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  listQuery.pageSize = val;
  roleQuery();
}
//页码改变时会触发
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  listQuery.pageindex = val;
  roleQuery();
}




// ---------新增用户的部分
const dialogVisible = ref(false)
const addorEditTitle = ref()
let roleForm = ref({
  roleName: '',
  isEnabled: true,
  isRoleUserAll: false
});


const roleFormRef = ref();

//自定义验证密码
const checkRoleName = async (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入角色名称'))
  }
  else {
    callback();
  }

}

//引用验证规则
const roleRules = ref({
  roleName: [{ validator: checkRoleName, trigger: 'blur' }]
});
//新增角色
const addOrEditRole = async (roleid) => {
  if (roleid) {
    addorEditTitle.value = "修改";
  }
  else {
    addorEditTitle.value = "新增";
  }
  dialogVisible.value = true;
  await nextTick();  //等待Dom加载完成----加载完成后，roleFormRef就可以代表 form了
  roleFormRef.value.resetFields()

}

//https://localhost:7123/api/Role
//提交新增角色信息
const subRoleForm = async (rform) => {

  await rform.validate(async (valid, fields) => {
    if (valid) {
      let reponse = await axios.post(`/Role`, roleForm.value);
      let { success, message } = reponse.data;
      if (success) {
        console.log(message);
        roleQuery();
        dialogVisible.value = false;
        roleFormRef.value.resetFields()
      } else {
        ElMessageBox.alert(message);
      }
    }
  });
};



//----------------------删除角色
const deleteRole = (roleId, roleName) => {
  ElMessageBox.confirm(
    `确定删除角色【${roleName}】?`,
    '删除??',
    {
      type: 'warning',
      icon: markRaw(Delete),
    }
  ).then(async () => {
    let reponse = await axios.delete(`/role/${roleId}`);
    let { data, success, message } = reponse.data;
    if (success) {
      ElMessage({
        type: 'success',
        message: message,
      })
      roleQuery();
    } else {
      ElMessage({
        type: 'danger',
        message: message,
      })
    }
  });
}





//-----------设置菜单专用的-------------------------

const customNodeClass = (data) => {
  if (data.isLeafNode && data.menuType == 1) {
    return 'is-penultimate'
  }
  return null
}

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        isPenultimate: true,
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
          {
            id: 11,
            label: 'Level three 1-1-11',
          },
          {
            id: 12,
            label: 'Level three 1-1-12',
          },
        ],
      },
      {
        id: 1000,
        label: 'Level two 1-1',
        isPenultimate: true,
        children: [
          {
            id: 10009,
            label: 'Level three 1-1-1',
          },
          {
            id: 100010,
            label: 'Level three 1-1-2',
          },
          {
            id: 100011,
            label: 'Level three 1-1-11',
          },
          {
            id: 100012,
            label: 'Level three 1-1-12',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    isPenultimate: true,
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    isPenultimate: true,
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]



//当前控件的引用
const treelistTemple = ref();
//选中的数据
const selectTreeArray = ref([]);
//树展示菜单和按钮的数据
const datatreelist = ref([]);

//设置窗口是否弹出
const setMenudgVisible = ref(false);
const setRoleid = ref(0);
const setRoleMenutitile = ref('');
const setRoleMenu = async (roleId, roleName) => {
  setMenudgVisible.value = true;
  setRoleid.value = roleId;
  setRoleMenutitile.value = `给角色【${roleName}】分配菜单`;
  selectTreeArray.value = [];
  datatreelist.value = [];

  //https://localhost:7123/api/Role/GetAllMenuTreeListAsync/5
  let reponse = await axios.get(`/Role/GetAllMenuTreeListAsync/${roleId}`);
  let { data, success, message, oValue } = reponse.data;
  if (success) {
    datatreelist.value = data;
    selectTreeArray.value = oValue;
  } else {
    ElMessage({
      type: 'danger',
      message: message,
    })
  }
}


//提交设置
const subSetRoleMenu = async () => {
  var node1Array = treelistTemple.value.getCheckedNodes().concat(treelistTemple.value.getHalfCheckedNodes());

  var menuIds = node1Array.filter(c => c.menuType == 1).map(c => c.id);
  var buttonIds = node1Array.filter(c => c.menuType == 2).map(c => c.id);
  var response = await axios.put(`/Role/SetRoleMenusAsync`, { roleId: setRoleid.value, menuIds: menuIds, BtnIds: buttonIds });
  var { success, message } = response.data;
  if (success) {
    ElMessage({
      type: 'success',
      message: message,
    })
    setMenudgVisible.value = false;
  }
  else {
    ElMessage({
      type: 'danger',
      message: message,
    })
  }

}

// // 批量用户分配角色相关
const uselistQuery = reactive({
  pageindex: 1, //第几页
  pageSize: 8, //每页多少条
  searchString: ''  //查询条件
});

let selectedUserIdArray = ref([]);  //记录当前角色是哪些用户所拥有
let currentRoleId = ref(0);
const userTotal = ref(0);      //数据源总条数 
const batchSetuserRoleTableAllData = ref([]);
const setroledgVisible = ref(false);  //控制设置角色弹框  
//弹框--弹出分配用户角色的弹框
const batchSetuserRole = async (roleId) => {
  currentRoleId.value = roleId;
  setroledgVisible.value = true;
  batchSetuserRoleTableAllData.value = [];
  selectedUserIdArray.value = [];
  uselistQuery.pageindex = 1;
  uselistQuery.searchString = '';
  userListQyery();
}

//初始化批量设置用户角色的列表
const userListQyery = async () => {
  var response = await axios
    .get(`/role/GetBatchSetUserRolePageAsync/${currentRoleId.value}/${uselistQuery.pageindex}/${uselistQuery.pageSize}/${uselistQuery.searchString}`);
  var { data, success, message, oValue } = response.data;
  if (success) {

    //赋值给当前列表数据
    batchSetuserRoleTableAllData.value = data.dataList;
    //分页用--数据总条数
    userTotal.value = data.recordCount; //总条数   
    if (selectedUserIdArray.value.length <= 0) {
      //如果前端记录选中的数据中还没有任何数据，在查询第一页数据的时候，就把已经选中的数据赋值上去
      selectedUserIdArray.value = oValue;
    }
    else {
      //如果前端记录选中的数据中已经存在数据了，说明已经参与处理过了一部分。
      //那在选择数据的时候，就应该检查下，把前端记录的已经选中的数据赋值上去，设置默认选中
      batchSetuserRoleTableAllData.value.forEach(element => {
        if (selectedUserIdArray.value.includes(element.userId)) {
          element.selected = true;
        }
        else {
          element.selected = false;
        }
      });
    }
    console.log(selectedUserIdArray.value);
  }
  else {
    ElMessage({
      type: 'danger',
      message: message,
    })
  }
}



//性别格式化
const sexFilter = computed(() => item => {
  switch (item) {
    case 1:
      return '男'
    case 0:
      return '女'
    default:
      return item
  }
})

//选中或者是取消
const selectedUser = (row) => {
  var index = selectedUserIdArray.value.findIndex(item => item === row.userId);
  if (index < 0 && row.selected == false) {
    selectedUserIdArray.value.push(row.userId);
  }
  else if (index >= 0 && row.selected == true) {
    selectedUserIdArray.value.splice(index, 1)
  }


  //循环数据源
  batchSetuserRoleTableAllData.value.forEach(element => {
    if (element.userId == row.userId) {
      element.selected = !element.selected;
    }
  });
}

///弹框中分页列表，切换不同页数据触发
const userHandleCurrentChange = (val) => {
  uselistQuery.pageindex = val;
  userListQyery();
}



//提交
const subBatchSetRole = async () => {
  var reponse = await axios.put(`Role/BatchSetUserRoleAsync`, { roleId: currentRoleId.value, UserIds: selectedUserIdArray.value });
  let { message, success } = reponse.data;
  if (success) {
    ElMessage({
      type: 'success',
      message: message,
    })
    setroledgVisible.value = false;

  }
  else {
    ElMessage({
      type: 'danger',
      message: message,
    })
  }
}

</script>



<style scoped>
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


<!-- ---设置用户菜单的树样式 -->
<style>
.is-penultimate>.el-tree-node__content {
  color: #626aef;
}

.el-tree-node.is-expanded.is-penultimate>.el-tree-node__children {
  /* display: flex; */
  flex-direction: row;
}

.is-penultimate>.el-tree-node__children>div {
  width: 50%;
  float: left;
}
</style>


<style> .box-card-setUser {
   height: 24px !important;
   width: 62px;
   text-align: center;
   background-color: #409EFF !important;
   cursor: pointer;
   border-radius: 5px;
   color: white;
   line-height: 24px;
 }

 .userSelected {
   background-color: #FF820E !important;
   cursor: pointer;
 }

 .no-userSelected {
   background-color: #409EFF !important;
   cursor: pointer;
 }
</style>

 