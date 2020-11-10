//动态路由
import Home from "../pages/Home"
const dynamicRoutes = [
    {
        path: "/",
        // name: "home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Home,
        //配置子路由
        children: []
      },
      {
        path: "*",
        component: ()=>import(/*webpackChunkName:"page404" */ "../pages/page404")
      }
]

//导出
export default dynamicRoutes