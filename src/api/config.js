import axios from "axios"
import router from "../router"
import ElementUI from 'element-ui';
// import { config } from "vue/types/umd"
//引入进度条
import NProgress from "nprogress"

//中断请求属性并导出
export let CancelToken = axios.CancelToken

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "/api" : "http://www.chst.vip"

axios.defaults.withCredentials = true//允许请求携带认证

//创建请求拦截器解决在请求头中携带token的问题，可以给每个请求都携带上想要传递的内容
axios.interceptors.request.use(config => {
    //进度条在请求拦截器，进入主页面时就会被清掉
    // NProgress.done()
    // console.log(config);
    // config.url= "/users/login/name=zzz"
    //config指的是每一个请求对象
    if (config.url == "/users/login") {return config}//直接放行
    else {
        let token = localStorage.getItem("stu-token")
        config.headers["authorization"] = token
        //放行
        return config
    }

})


//响应拦截二次拦截
axios.interceptors.response.use(config=>{
    // console.log(config);
    let {data} = config
    if(data.code=="1004" || data.code == "10022"){
        //在当前的后台1004代表token校验失败，提示错误，并让页面跳回login
        //token登录信息失效
        ElementUI.Message.error("登录信息失效，请重新登录")
        localStorage.removeItem("stu-token")
        //刷新页面
        
        router.push("/login")
        window.location.reload()
    }
    return config
})


axios.create({
    timeout: 4000
})

export default axios