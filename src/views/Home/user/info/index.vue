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
          <el-button v-if="usergetuserpage" :type="usergetuserpage.backColor ? usergetuserpage.backColor : 'primary'"
            :size="usergetuserpage.size" :icon="initIcon(usergetuserpage.icon)" @click="userQuery">{{
              usergetuserpage.btnText }}</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="demo-input-size">
          <el-button v-if="useradduser" :type="useradduser.backColor ? useradduser.backColor : 'primary'"
            :size="useradduser.size" :icon="initIcon(useradduser.icon)" @click="addUser">{{
              useradduser.btnText }}</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!-- 当 el-table 元素中注入 data 对象数组后，在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。 可以使用 width 属性来定义列宽。 -->
        <el-table :data="lists" stripe style="width: 100%">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="name" width="120" label="姓名" />
          <el-table-column prop="imageurl" label="头像" width="60">
            <template #default="{ row }">
              <el-image :preview-src-list="[imageUrlFilter(row.imageurl)]" :preview-teleported="true"
                style="width: 30px; height: 30px" :src="imageUrlFilter(row.imageurl)" :fit="fit" />
            </template>
          </el-table-column>
          <el-table-column prop="email" width="180" label="Email" />
          <el-table-column prop="sex" label="性别" width="60">
            <template #default="{ row }">
              <el-tag :type="row.sex == 0 ? '' : 'danger'">
                {{ sexFilter(row.sex) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="60" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : row.status == 2 ? 'warning' : 'danger'">
                {{ statusFilter(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <div style="display: flex; align-items: center">

                <!-- 用户分配角色 usersetuserrole-->
                <el-button v-if="usersetuserrole"
                  :type="usersetuserrole.backColor ? usersetuserrole.backColor : 'primary'" :size="usersetuserrole.size"
                  :icon="initIcon(usersetuserrole.icon)" @click="setuserRole(row.userId, row.name)">{{
                    usersetuserrole.btnText }}</el-button>

                <!-- 用户分配菜单按钮 usersetusermenuandbtn-->
                <el-button :type="usersetusermenuandbtn.backColor ? usersetusermenuandbtn.backColor : 'primary'"
                  :size="usersetusermenuandbtn.size" :icon="initIcon(usersetusermenuandbtn.icon)"
                  v-if="usersetusermenuandbtn" @click="setuserMenu(row.userId, row.name)">{{ usersetusermenuandbtn.btnText
                  }}</el-button>

                <!-- 冻结 userfrozenuser-->
                <el-button v-if="row.status == 1 && userfrozenuser"
                  :type="userfrozenuser.backColor ? userfrozenuser.backColor : 'primary'" :size="userfrozenuser.size"
                  :icon="initIcon(userfrozenuser.icon)"
                  @click="frozenUser(row.userId, row.name, row.status)">冻结</el-button>

                <!-- 解冻 userfrozenuser -->
                <el-button v-if="row.status == 2 && usernormaluser"
                  :type="usernormaluser.backColor ? usernormaluser.backColor : 'primary'" :size="usernormaluser.size"
                  :icon="initIcon(usernormaluser.icon)"
                  @click="frozenUser(row.userId, row.name, row.status)">解冻</el-button>

                <!-- 删除用户信息  userdeleteuser-->
                <el-button v-if="row.userType > 1 && userdeleteuser" :type="userdeleteuser.backColor"
                  :size="userdeleteuser.size" :icon="initIcon(userdeleteuser.icon)"
                  @click="deleteUser(row.userId, row.name)">{{
                    userdeleteuser.btnText }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <div class="pagination">
        <!-- total	总条目数                                                                                                                   @current-change="handleCurrentChange"  页码改变时会触发-->
        <el-pagination background layout="prev, pager, next,sizes" :total="rows" :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-row>
  </el-card>

  <!-- Dialog 对话框--新增用户专用 -->
  <el-dialog v-model="dialogVisible" title="新增用户" width="40%">
    <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="120px">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="userForm.name" placeholder="用户名称" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户密码" prop="password">
            <el-input type="password" v-model="userForm.password" placeholder="用户密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="userForm.confirmPassword" placeholder="确认密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="userForm.sex">
              <el-radio label=1>男性</el-radio>
              <el-radio label=0>女性</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="isEnabled">
            <el-switch v-model="userForm.isEnabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户头像" prop="imageUrl">
            <el-upload class="avatar-uploader" :action="imageApiUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="userForm.imageUrl" :src="baseImageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.number="userForm.mobile" placeholder="手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model.number="userForm.phone" placeholder="电话号码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="qq号码" prop="qq">
            <el-input v-model="userForm.qq" placeholder="qq号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信">
            <el-input v-model="userForm.weChat" placeholder="微信" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="userForm.email" placeholder="邮箱地址" />
      </el-form-item>

      <el-form-item label="详细地址">
        <el-input v-model="userForm.address" type="textarea" placeholder="详细地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subUseForm(userFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Dialog 对话框--设置菜单专用 -->
  <el-dialog v-model="setMenudgVisible" :title="setmenutitile" width="70%">
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
            <span v-if="node.disabled" style="color: red;">【已通过角色分配】</span>
          </span>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setMenudgVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subSetMenuAndBtn">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>


  <!-- Dialog 对话框--设置角色专用 -->
  <el-dialog v-model="setroledgVisible" :title="setroletitile" width="50%" height="60%">
    <div class="flex-container">
      <el-tooltip class="box-item" effect="dark" :content="item.roleName" v-for="item in roleDataList"
        :key="item.roleId" placement="top-start">
        <el-card class="box-card-setRole" :class="item.selected ? 'roleSelected' : 'no-roleSelected'"
          @click="selectCurrentItem(item)">
          <span>
            <!-- 通过方法格式化。超出部分。。。结尾 -->
            {{ ellipsisFilter(item.roleName) }}
          </span>
        </el-card>
      </el-tooltip>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setroledgVisible = false">
          取消</el-button>
        <el-button type="primary" @click="subSetRole">
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
import { apiUrl, baseURL, initIcon } from '@/common/index'
import { getCurrentMenuPermission } from '@/api/menu'
import { useRouter } from "vue-router";  //导入路由





// 用户分页列表相关
let lists = ref([]); //用户详情
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
      userQuery();
    }
  };
};


//添加用户
let useradduser = ref();

//修改用户信息
let userputuser = ref();

//用户分页查询
let usergetuserpage = ref();

//设置用户角色
let usersetuserrole = ref();

//设置用户菜单
let usersetusermenuandbtn = ref();

//删除用户信息
let userdeleteuser = ref();

//冻结用户
let userfrozenuser = ref();

//解冻用户
let usernormaluser = ref();



onMounted(async () => {
  userQuery();
  keydownEvent();//绑定回车事件 
  //获取按钮数据 
  var menuid = useRouter().currentRoute.value.meta.id;
  console.log(`菜单Id:${menuid}`);
  let buttonArray = await getCurrentMenuPermission(menuid);

  useradduser.value = buttonArray.find(btn => btn.btnValue == "user-adduser");
  userputuser.value = buttonArray.find(btn => btn.btnValue == "user-putuser");
  usergetuserpage.value = buttonArray.find(btn => btn.btnValue == "user-getuserpage");
  usersetuserrole.value = buttonArray.find(btn => btn.btnValue == "user-setuserrole");
  usersetusermenuandbtn.value = buttonArray.find(btn => btn.btnValue == "user-setusermenuandbtn");
  userdeleteuser.value = buttonArray.find(btn => btn.btnValue == "user-deleteuser");
  userfrozenuser.value = buttonArray.find(btn => btn.btnValue == "user-frozenuser");
  usernormaluser.value = buttonArray.find(btn => btn.btnValue == "user-normaluser");

});

//获取用户详情  http://47.109.25.112:10089/api/User/1/10
async function userQuery() {
  let reponse = await axios.get(`/User/${listQuery.pageindex}/${listQuery.pageSize}/${listQuery.searchString}`);
  let { data, success, message } = reponse.data;
  if (success) {
    lists.value = data.dataList;
    rows.value = data.recordCount; //总条数
  } else {
    console.log(message)
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
      return item
  }
})

//图片文件格式化
const imageUrlFilter = computed(() => item => {
  return `${baseURL()}${item}`;
})


//分页 Size改变时会触发
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  listQuery.pageSize = val;
  userQuery();
}
//页码改变时会触发
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  listQuery.pageindex = val;
  userQuery();
}


// ---------新增用户的部分
const dialogVisible = ref(false);
const userFormRef = ref();
const imageApiUrl = `${apiUrl()}File`;

//自定义验证密码
const checkPassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请确认密码'))
  }
  if (value != userForm.value.password) {
    return callback(new Error('两次密码不一致'))
  }
  callback();
}

//验证邮箱
const checkEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请正确填写邮箱'));
  } else {
    if (value !== '请正确填写邮箱') {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(value)) {
        callback(new Error('邮箱地址格式不对'));
      }
    }
    callback();
  }
}

//引用验证规则
const userRules = ref({
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: checkPassword, trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  isEnabled: [{ required: true, message: '你确定是否启用', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请选择头像', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { type: 'number', message: '手机号必须为数字', trigger: 'blur' }
  ],
  phone: [{ type: 'number', message: '电话号码必须为数字', trigger: 'blur' }],
  email: [{ validator: checkEmail, trigger: 'blur' }]
});


let baseImageUrl = ref();
let userForm = ref({});


const addUser = async () => {

  dialogVisible.value = true;
  await nextTick();  //等待Dom加载完成----加载完成后， userFormRef就可以代表 form了
  userFormRef.value.resetFields()

}

//提交新增用户信息
const subUseForm = async (uform) => {
  await uform.validate(async (valid, fields) => {
    console.log(valid);
    if (valid) {
      let reponse = await axios.post(`/User`, userForm.value);
      let { data, success, message } = reponse.data;
      if (success) {
        userQuery();
        dialogVisible.value = false;
        ElMessage({
          type: 'success',
          message: message,
        })
      } else {
        ElMessageBox.alert(message);
      }
    }
  });

};



//文件上传前触发的行为
const beforeAvatarUpload = (uploadFile) => {
  console.log(uploadFile);
}

///文件上传成功后，api响应了结果了，触发这里？
const handleAvatarSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response);
  console.log(uploadFile);
  console.log(uploadFiles);
  if (response.success) {
    userForm.value.imageUrl = response.data;
  }
  baseImageUrl.value = `${baseURL()}${response.data}`
}

//----------------------删除用户信息
const deleteUser = (userid, username) => {
  ElMessageBox.confirm(
    `确定删除用户【${username}】?`,
    '删除??',
    {
      type: 'warning',
      icon: markRaw(Delete),
    }
  ).then(async () => {
    let reponse = await axios.delete(`/User/${userid}`);
    let { data, success, message } = reponse.data;
    if (success) {

      userQuery();
      ElMessage({
        type: 'success',
        message: message,
      })

    } else {
      ElMessage({
        type: 'danger',
        message: message,
      })
    }
  });
}

//----------------------冻结用户信息
const frozenUser = (userid, username, status) => {
  var confirmmessge = `确定冻结用户【${username}】?`;
  var confirmmessageType = 'warning'
  if (status == 2) {
    confirmmessge = `确定解冻用户【${username}】?`;
    confirmmessageType = 'success'
  }

  ElMessageBox.confirm(
    confirmmessge,
    confirmmessageType,
    {
      type: confirmmessageType,
      icon: markRaw(InfoFilled),
    }
  ).then(async () => {
    let reponse;
    if (status == 1) {
      reponse = await axios.put(`/User/FrozenUser/${userid}`);
    }
    else {
      reponse = await axios.put(`/User/NormalUser/${userid}`);
    }

    let { data, success, message } = reponse.data;
    if (success) {
      ElMessage({
        type: 'success',
        message: message,
      })
      userQuery();
    } else {
      ElMessage({
        type: 'danger',
        message: message,
      })
    }
  });
}



//-----------设置菜单专用的-------------------------

//当前控件的引用
const treelistTemple = ref();
//选中的数据
const selectTreeArray = ref([1, 4, 9]);
//树展示菜单和按钮的数据
const datatreelist = ref([]);

//设置窗口是否弹出
const setMenudgVisible = ref(false);
const setuserid = ref(0);
const setmenutitile = ref('');
const setuserMenu = async (userId, username) => {
  setMenudgVisible.value = true;

  datatreelist.value = [];
  selectTreeArray.value = [];

  setuserid.value = userId;
  setmenutitile.value = `给用户【${username}】分配菜单`;
  let reponse = await axios.get(`/User/${userId}`, userForm.value);
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

const customNodeClass = (data) => {
  if (data.isLeafNode && data.menuType == 1) {
    return 'is-penultimate'
  }
  return null
}



//提交设置
const subSetMenuAndBtn = async () => {

  var node1Array = treelistTemple.value.getCheckedNodes().concat(treelistTemple.value.getHalfCheckedNodes());
  var menuIds = node1Array.filter(c => c.menuType == 1 && c.disabled == false).map(c => c.id);
  var btnIds = node1Array.filter(c => c.menuType == 2 && c.disabled == false).map(c => c.id);

  var obj = { UserId: setuserid.value, BtnIds: btnIds, MenuIds: menuIds };
  var response = await axios.post(`/user/${setuserid.value}`, obj);
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


//格式化展示
const ellipsisFilter = computed(() => value => {
  if (!value) return ''
  if (value.length > 3) {
    return value.slice(0, 3) + '...'
  }
  return value
})






//勾选其中某一个角色
const selectCurrentItem = (item) => {
  roleDataList.value.forEach(element => {
    if (item.roleId == element.roleId) {
      item.selected = !item.selected;
    }
  });
}




// // 用户分配角色相关 
let roleDataList = ref([]);  //前端分页总数据--后台一次获取

const setroledgVisible = ref(false);  //控制设置角色弹框
const setroletitile = ref('');        //弹框弹出展示的头信息
const setroleUserid = ref(0);         //操作哪个用户的id 
//弹框--弹出分配用户角色的弹框
const setuserRole = async (userId, username) => {
  setroleUserid.value = userId;
  setroletitile.value = `给用户【${username}】分配角色`;

  roleDataList.value = [];   //保存所有角色数据的数组； 
  var response = await axios.get(`/role/${userId}`);  //获取数据，获取到的是全量的数据 
  var { data, success, message, oValue } = response.data;
  if (success) {
    setroledgVisible.value = true;  //获取到数据了，就弹框弹出
    roleDataList.value = data;        //把后台返回的值，赋值给前端全量数据 
  }
  else {
    ElMessage({
      type: 'danger',
      message: message,
    })
  }
}

//提交
const subSetRole = async () => {
  var rolleIdArray = roleDataList.value
    .filter(c => c.selected == true)
    .map(c => c.roleId);

  var userid = setroleUserid.value;
  var reponse = await axios.put(`User/SetUserRoleAsync/`, { userId: userid, selectRoleIdList: rolleIdArray });
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
<style scoped>
.is-penultimate>.el-tree-node__content {
  color: #626aef;
}

.el-tree-node.is-expanded.is-penultimate>.el-tree-node__children {
  display: flex;
  flex-direction: row;
}

.is-penultimate>.el-tree-node__children>div {
  width: 25%;
}
</style>


<style scoped>
.el-table__row-Info {
  cursor: pointer !important
}
</style>


<!-- 图片上传控件的样式 -->
<style scoped>
.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
}
</style>


<style  scoped>
.flex-container {

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.box-card-setRole {
  height: 35px !important;
  width: 120px;
  margin: 2px;
  text-align: center;
  line-height: 0px;
  background-color: #409EFF !important;
  cursor: pointer;
}

.roleSelected {
  background-color: #FF820E !important;
  cursor: pointer;
}

.no-roleSelected {
  background-color: #409EFF !important;
  cursor: pointer;
}
</style>


<!-- 设置用户菜单按钮的树样式 -->
<style scoped>
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