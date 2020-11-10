<template>
  <div>
    <!-- 远程搜索输入框 -->
    <div>
      <template>
        <el-select
          v-model="searchValue"
          clearable
          filterable
          remote
          @blur="searchBlur"
          @change="searchTextChange"
          reserve-keyword
          placeholder="请输入关键词"
          @clear="clear"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in searchList"
            :key="item.sId"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </template>
      <!-- 搜索按钮 -->
      <el-button
        type="primary"
        icon="el-icon-search"
        class="search"
        @click="searchButton"
      ></el-button>
      <!-- 添加按钮 -->
      <el-button type="primary" 
      @click="addStu"
      v-hasPermission="'add'">
      添加项目
      </el-button>
      <!-- 弹出框 -->
    </div>
    <!-- 可搜索选择框 -->
    <div>
      <span>选择班级：</span>
      <el-select v-model="classes" 
      filterable 
      placeholder="请选择" 
      class="select"
      @visible-change="classVisible"
      @change="classChange"
      >
        <el-option label="全部" value="all"></el-option>
        <el-option
          v-for="(item,index) in classOptions"
          :key="index"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 导出excel -->
    <div class="exportExcel">
      <el-button icon="iconfont icon-excel"
      @click="exportExcel">
      导出excel数据
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="stu-table">
      <el-table :data="stuData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="headimgurl" label="头像" width="100">
          <template scope="scope">
            <img :src="scope.row.headimgurl" width="100" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="class" label="班级" width="180">
        </el-table-column>
        <el-table-column prop="productUrl" label="项目" width="404">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="414"
          class="operate"
        >
          <template scope="{row}">
            <!-- <el-button type="primary" icon="el-icon-view"
            @click="$router.push({name:'studentProfile'})">查看</el-button>
             -->
            <!-- 两种方式都可 -->
            <el-button
              type="primary"
              icon="el-icon-view"
              @click="$router.push({ path: '/StudentManager/studentProfile' })"
              v-hasPermission="'read'"
              >查看</el-button>
            <el-button type="primary" 
              icon="el-icon-edit" 
              @click="editStu(row)"
              v-hasPermission="'edit'"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteStu(row)"
              v-hasPermission="'delete'"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination 
        background 
        hide-on-single-page
        layout="prev, pager, next" 
        :total="total"
        :pageSize="dataCount"
        @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
    <!-- dialog弹出框 -->
    <qf-dialog></qf-dialog>
  </div>
</template>

<script>
// 引入学生信息
import { getStuList,delStu,searchStu,getClasses } from "@/api";
//引入dialog
import dialog from "../../../components/dialog";
// import { mapState,mapMutations } from "vuex"
//引入excel文件
const qee = require("qf-export-excel")
export default {
  components: {
    "qf-dialog": dialog
  },

  data() {
    return {
      //远程搜索
      searchList: [],
      searchValue: "",
      blurSearchValue: "",
      list: [],
      loading: false,
      //搜索班级框
      classOptions: [],
      classes: "",
      //表格加载动画控制
      loading: true,
      //表格数据对象
      stuData: [],
      //获取学员信息传参
      params: {
        class: "",
        count: 4
      },
      //每页的数据数
      dataCount: 4,
      //分页数
      dataPage: 1,
      //总共数据条数
      total: 0
    };
  },
  methods: {
    //更新表格数据
    updateStuTable(params) {
      this.loading = true;
      params = this.params
      params.count = this.dataCount || ""
      params.page = this.dataPage || ""
      //发请求
      getStuList(params)
        .then(res => {
          // console.log(res);
          if (res.data && res.data.state) {
            this.stuData = res.data.data;
            //数据总数
            this.total = res.data.total
            this.loading = false;
          } else {
            this.$message.error("数据获取失败");
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err.message);
          this.$message.error("网络获取数据出错");
          this.loading = false;
        });
    },
    //弹框增加学员
    addStu() {
      this.$bus.$emit("showDialog");
      // addStuDetail()
    },
    //删除学员
    deleteStu(row) {
      console.log(this.stuData);
      console.log(row);
      if (row && row.sId) {
        //确定删除弹出框
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //调用删除请求
            delStu(row.sId)
              .then(res => {
                if (res.data && res.data.state) {
                  // console.log(res);
                  this.$message.success("删除成功");
                  this.updateStuTable();
                } else {
                  this.$message.warning("删除失败");
                }
              })
              .catch(err => {
                console.log("删除出错");
              });
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //编辑学员
    editStu(row) {
      //1.弹出dialog
      //2.数据回显
      //3.更改提交
      this.$bus.$emit("editStuEvent", row);
    },
    //远程搜索框
    //失去焦点但输入框里的值不消失
    searchBlur(searchValue ){
      console.log(searchValue);
      this.searchValue = this.blurSearchValue
    },
    clear(e) {},
    searchTextChange(searchText) {
      this.loading = true
      // console.log(searchText);
      let key = this.searchValue
      let count = this.dataCount
      let params = {
        key,
        count
      }
      //再次调用searchStu接口得到数据
      searchStu(params).then(res => {
        if (res.data && res.data.state) {
          // console.log(res.data.data);
          //更改表格数据对象
          this.stuData = res.data.data;
          this.loading=false
        }else{
          this.message.warning("搜索失败")
        }
      })
      .catch(err=>{
        this.$message.error("搜索出错")
      })
    },
    //远程搜索的方法
    remoteMethod(query) {
      //键盘弹起时获取输入值，赋值第三方变量进行输入框内容
      this.blurSearchValue = query
      //query是输入框输入的值，key是要搜索的名字
      let key = query;
      //调用searchstu函数
      searchStu(key).then(res => {
        if (res.data && res.data.state) {
          // console.log(res.data.data);
          this.searchList = res.data.data;
        }else{
          this.message.warning("搜索失败")
        }
      })
      .catch(err=>{
        this.$message.error("搜索出错")
      })
      // console.log(query);
    },
    //搜索按钮
    searchButton(){
      //请求接口
      this.loading=true
      let key = this.searchValue
      let count = this.dataCount
      let params = {
        key,
        count
      }
      searchStu(params).then(res => {
        if (res.data && res.data.state) {
          // console.log(res.data.data);
          //更改表格数据对象
          this.stuData = res.data.data;
          //对分页总数进行更改
          this.total = res.data.total
          this.loading=false
        }else{
          this.message.warning("搜索失败")
        }
      })
      .catch(err=>{
        this.$message.error("搜索出错")
      })
    },
    //选择班级
    classChange(query){
      let count = this.dataCount
      // console.log(query);
      // this.params.class = query
      //判断是否为全部
      this.params=query==="all"?{count}:{class:query,count}
      this.updateStuTable(this.params)
    },
    //班级选择框展开/收起的事件
    classVisible(isVisible){
      // console.log(isVisible);
      //收起时
      if(!isVisible)return
      //充值dataPage的值，以免后台查不到
      this.dataPage = 1
      //发送获取班级的请求
      getClasses()
      .then(res=>{
        if(res.data && res.data.state){
          // console.log(res);
          this.classOptions = res.data.data
        }
      })
    },
    //导出excel表格
    exportExcel(){
      //定义title
      let titleList = [
        {
          title: "头像",
          key: "headimgurl",
        },
        {
          title: "姓名",
          key: "name",
        },
        {
          title: "班级",
          key: "class",
        },
        {
          title: "项目",
          key: "productUrl",
        }
      ]
      //定义数据源
      let dataSource = this.stuData
      //调用
      qee(titleList,dataSource,"学员数据")
    },
    //改变分页
    changePage(page){
      // console.log(page);
      this.dataPage = page
      this.updateStuTable(this.params)
    }
  },
  mounted() {
    // this.$bus.$on("showDialog",()=>{
    //   this.dialogVisible = !this.dialogVisible
    // })
    this.$bus.$on("updateStuTable", () => {
      this.updateStuTable(this.params);
    });
    //调用getStuList(),页面加载,获取表格数据
    this.updateStuTable(this.params);
  }
};
</script>

<style scoped>
/* 样式只在当前文件有效 */
img {
  width: 80%;
  height: 80%;
  text-align: center;
}
/* 弹出框 */
.el-upload--picture-card i {
  font-size: 28px;
  color: #8c939d;
}
.uploadAvatar {
  text-align: left;
  margin-left: 90px;
}
.el-form-item__label {
  margin-left: 30px;
}
.el-upload--picture-card,
.el-upload-list__item.is-success {
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
}
</style>