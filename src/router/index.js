import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home";
import Login from "../pages/Login";

//引入allRoutes
import allRoutes from "./allRoutes"

Vue.use(VueRouter);
//真正的路由配置

//解决路由导航到统一路径重复报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: "/login",
    // name: "login",
    component: Login
  },
  // {
  //   path: "/",
  //   name: "home",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "home" */ "../pages/Home"),
  //   //配置子路由
  //   children: allRoutes
  // },
  // {
  //   path: "*",
  //   component: ()=>import(/*webpackChunkName:"page404" */ "../pages/page404")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
