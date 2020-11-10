
import Vue from "vue";
import Vuex from "vuex";
//引入获得的用户菜单
import { getMenuList } from "@/api"

//引入allroutes
import allRoutes from "../router/allRoutes"
//引入递归函数
import recursionRoutes from "../utils/recursionRoutes"
// console.log(recursionRoutes);
//引入动态路由
import dynamicRoutes from "../router/dynamicRoutes"
//引入router
import router from "../router"

//刷新页面会丢失信息，所以要从localStorage中去取出
let userInfo = localStorage.getItem("stu-userInfo") || '{}'
//加上一个短路运算
userInfo=JSON.parse(userInfo)
Vue.use(Vuex);

//引入excel文件
// const qee = require("qf-export-excel")
//import qee from "qf-export-excel"

export default new Vuex.Store({
  state: {
    userInfo: {},
    permissionButtons: [],
    //得到来自mutations的数据
    menuList: [],//定义用户侧边栏菜单
    //menuList添加到路由
    //面包屑
    crumbs: [],
    //弹框控制显示或隐藏
    dialogVisible: false,
    //dialog数据源
    stuForm: {
      name: '',
      productUrl: '',
      headimgurl: '',
      class: '',
      age: '',
      city: '',
      degree: '',
      description: ''
    }
  },
  mutations: {
    //更改userInfo
    SET_USERINFO(state,payload){
      state.userInfo=payload
    },
    SET_PERMISSION_BUTTONS(state,payload){
      state.permissionButtons=payload
    },
    SET_MENULIST(state,payload){
      //通过payload接收到了来自actions的sideMenu
      //储存在menuList
      state.menuList=payload
      //mutations得到的数据再给state
      // console.log(state.menuList);
      //动态的将dynamic的路由添加到routes
      //核心方法addroutes(符合路由规则的数据)
      //1.将menuList赋值给dynamicRoutes的home的children数组
      let target = dynamicRoutes.find(item=>item.path==="/")
      target.children = [...state.menuList]
      // console.log(dynamicRoutes);
      //2.动态dynamicRoutes将从menuList得到的数据配置到router
      router.addRoutes(dynamicRoutes)
    },
    //设置面包屑
    SET_CRUMBS(state,payload){
      state.crumbs=payload
    },
    //更改dialog
    CHANGE_DIALOG_VISIBLE(state){
      state.dialogVisible = !state.dialogVisible
    },
    //更改dialog数据源
    SET_SUTFORM(state,payload){
      state.stuForm = payload
    }
  },
  actions: {
    //发送接口请求，获取用户菜单数据
    //得到的结果提交给mutations
    
    async FETCH_MENULIST({ commit }){
      
      //请求回来的用户菜单数据
      let userMenu = await getMenuList()
      // console.log(userMenu);
      //通过allroutes和请求回来的用户菜单数据进行对比，得到的结果提交给mutations
      let sideMenu = recursionRoutes(allRoutes,userMenu.data.menuList)
      // console.log(sideMenu);
      //将结果提交给mutations
      commit("SET_MENULIST",sideMenu)
    }
  },
  getters: {
    
  },
  modules: {
    
  }
});
