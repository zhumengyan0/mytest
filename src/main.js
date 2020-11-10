//入口文件
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入自定义的css样式
import "@/assets/styles/base.css"
import "@/assets/styles/el-reset.css"
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入iconfont
import "./assets/iconfont/iconfont.css"

//引入nprogress进度条
import NProgress from "nprogress"
import "nprogress/nprogress.css"

//引入submenu组件
import qfSubMenu from "qf-sub-menu"
// Vue.config.productionTip = false;

//定义自定义全局指令，判断是否具备相应按钮权限
Vue.directive("hasPermission",{
  //钩子函数
  bind(el,binding,VNode){
    //从本地获取按钮
    let buttons = localStorage.getItem("stu-permission-buttons")
    //el展示权限对象
    // console.log(el);
    //binding展示权限按钮
    // console.log(binding);
    if(!has(buttons,binding.value)){
      //禁用按钮
      //el.className按钮的class类名
      // console.log(el.className);
      //先储存class类名，在这基础上加上is-disabled禁用按钮
      let className = el.className
      el.className = className+ " " + "is-disabled"
      el.disabled = true
    }
  }
})

//引入鉴权的方法
import has from "./utils/has"

//将has方法添加到vue全局
Vue.prototype.$has = has

//在vue中使用全局ElementUI
Vue.use(ElementUI);

//将qfSubMenu注入到vue全局
Vue.use(qfSubMenu)

//引进bus
import bus from "./utils/bus"
Vue.prototype.$bus = bus

//路由前置钩子（导航守卫）
router.beforeEach((to,from,next)=>{
  NProgress.start()
  //设置进度条
  // NProgress.set(.99)
  // console.log(to);
  // console.log(from);
  // console.log(next);
  let token = localStorage.getItem("stu-token")||null
  if(token){
    if(store.state.menuList.length===0){
      //说明如果没有用户路由，触发action获取用户路由
      store.dispatch('FETCH_MENULIST')
      .then(()=>{
        next({ path: to.path })
        //这里要注意,next里面传入的参数是即将要进入的路由信息，
        //因为next传参后，当前要进入的路由会被废止，转而进入参数对应的路由
        //虽然是同一个路由，主要是确保addroutes生效了
      })
    }else{
      //用户登录过后localstorage就会有token，
    //如果是注册页面或登录页面，直接放行
    next()
    }
    
  }else{
    if(to.path=="/login"){
      //如果访问的页面是登录注册页面，放行
      next()
    }else{
      //访问的不是登录注册页面，跳转到登录注册页面
      next({path:"/login"})
    }
  }
})

//使用路由后置钩子处理面包屑
router.afterEach( (to,from) => {
  // console.log(to)  
  //切掉matched里面的第0个
  let crumblist = to.matched.slice(1)
  // console.log(crumblist)
  //给传参
  store.commit("SET_CRUMBS",crumblist)
  NProgress.done()
})

//按需引入
// import { Carousel,CarouselItem } from "element-ui"

//注册全局组件
// Vue.component("el-carousel",Carousel)
// Vue.component("el-carousel-item",CarouselItem)

import "./utils/recursionRoutes.js"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
