<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200">
        <h1 class="logo"></h1>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :router="true"
          :collapse="isCollapse"
        >
          <qf-sub-menu :sideMenu="menuList"></qf-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <div class="dong" @click="change">
                  <i href="#" v-if="isChange" class="iconfont icon-shouqi"></i>
                  <i
                    href="#"
                    v-else-if="!isChange"
                    class="iconfont icon-zhankai"
                  ></i>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light center">
                <span>千峰管理系统</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple center">
                <el-avatar
                  shape="square"
                  :size="40"
                  src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2181797468,3537497331&fm=11&gp=0.jpg"
                ></el-avatar>
                <span>欢迎您：</span
                ><b class="nickname" @click="$router.push('/Mine')">{{ userInfo.nickname }}</b
                ><a href="#" class="quit" @click="quit">退出</a>
              </div>
            </el-col>
          </el-row>
        </el-header>

        <!-- 主体区域 -->
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:crumb.path}" v-for="crumb in crumbs" :key="crumb.index">
              {{crumb.meta.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- <home></home>递归 -->
  </div>
</template>

<script>
// import { getloginLog } from "@/api";
import { mapState } from "vuex";
// import subMenu from "../../components/subMenu"
export default {
  // name: "home",
  //组件循环
  computed: {
    //映射
    ...mapState(["userInfo", "menuList","crumbs"])
  },
  data() {
    return {
      isCollapse: false,
      isChange: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //退出登录
    quit() {
      // 清除token，userInfo
      localStorage.removeItem("stu-token");
      localStorage.removeItem("stu-userInfo");
      //跳转到登录页
      this.$router.push("/login");
      //刷新页面
      window.location.reload();
    },
    change() {
      this.isCollapse = !this.isCollapse;
      this.isChange = !this.isChange;
    }
  },
  // components: {
  //   subMenu
  // },
  mounted() {
    // getloginLog().then(res => {
    //   console.log(res);
    // });

    //触发actions
    // this.$store.dispatch("FETCH_MENULIST")
  }
};
</script>
 
<style scoped>
.quit {
  cursor: pointer;
  color: deeppink;
}
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  background-color: pink;
  color: white;
  /* text-align: center; */
  font-size: 20px;
  font-family: "楷体";
  height: 60px;
  /* line-height: 60px; */
}
/* 侧边栏 */
.el-aside {
  /* background-color: #d3dce6; */
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  background-color: pink;
}
.logo{
  height: 60px;
  /* width: 200px; */
  background-image: url(http://chst.vip:8081/stu2/img/logo.be8bbddf.png);
  background-size: 80%;
  background-position: 50%;
  background-repeat: no-repeat;
}
h1{
  padding: 0;
  margin: 0;
}
.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
/* 侧边栏 动画效果*/
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

/* 头部 */
.el-row {
  margin-bottom: 20px;
  /* background-color: skyblue; */
  /* &:last-child {
      margin-bottom: 0;
    } */
}
.el-col {
  border-radius: 4px;
}
/* .bg-purple-dark {
  background: #99a9bf;
} */
.bg-purple {
  /* background: #d3dce6; */
  line-height: 36px;
}
span {
  vertical-align: middle;
}
.bg-purple-light {
  /* background: #e5e9f2; */
  line-height: 36px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  /* background-color: #f9fafc; */
}
p {
  font-size: 14px;
  color: #fff;
}
.grid-content span {
  margin-right: 10px;
  text-decoration: black;
}
b {
  margin-right: 10px;
}
.center {
  text-align: center;
}
.icon-daohangshouqi- {
  font-size: 30px;
}
.iconfont {
  font-size: 25px;
}
</style>
