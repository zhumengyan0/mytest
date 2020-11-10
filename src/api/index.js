//引入中断请求
import axios,{ CancelToken } from "./config"

//导出登录接口
export const login = (username,password) => axios({
    url: "/users/login",
    method: "post",
    data: {
        username,
        password
    }
})

//导出登入日志
//_this object 是一个组件实例
// export const getloginLog = (_this) =>
// axios.get('./getloginlog',{
//     CancelToken:new CancelToken(function(c){
//         //c就是一个方法，可以终止请求
//         _this.cancel = c
//     })
// })
export const getloginLog = () => axios.get('/getloginlog')

//获取用户菜单
export const getMenuList = () => axios.get("/permission/getMenuList")

//获取验证码
export const getCaptcha = () => axios.get("/users/getCaptcha")

//刷新验证码
// export const refreshCaptcha = () => axios.get("/users/refreshCaptcha")

//校验验证码
export const verifyCaptcha = (captcha) => axios.get(`/users/verifyCaptcha?captcha=${captcha}`)

//获取用户信息
export const getStuList = (params={}) => axios({
    url: "/students/getstulist",
    params
})

//增加学员信息
export const addStuDetail = (stuDetail) => axios({
    url: "/students/addstu",
    method:"post",
    data: stuDetail
})

//删除学员
export const delStu = (sId) => axios.get(`/students/delstu?sId=${sId}`)

//编辑学员信息
export const updateStu = (updateStuInfor={}) => axios({
    url: "/students/updatestu",
    method: "post",
    data: updateStuInfor
})
//搜索学员信息
export const searchStu = (params) => axios({
    url: "/students/searchstu",
    params
})
//获取班级列表
export const getClasses = () => axios.get("/students/getclasses")