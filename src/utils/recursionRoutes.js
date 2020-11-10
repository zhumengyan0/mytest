//根据服务器用户返回的menulist数据和allroutes进行匹配，得到符合当前用户的有效路由配置

// const { default: allRoutes } = require("../router/allRoutes");
import allRoutes from "../router/allRoutes"

//@param {array} allRoutes 用户的有效的完整的路由配置
//@param {array} menulist 服务器返回的用户菜单名字
const recursionRoutes = (allRoutes,menuList)=>{
    //先声明一个新的数组
    let userRoutes = []
    //双层for循环
    allRoutes.forEach(item=>{
        menuList.forEach(v=>{
            if(item.meta.name===v.name){
                if(v.children&&v.children.length>0){
                    //判断是否有children，以及children类型是否是数组
                    item.children=recursionRoutes(item.children,v.children)
                }
                userRoutes.push(item)
            }
        })
    })
    return userRoutes
}
// let menuList = [
//     {
//         "name": "管理首页"
//     },
//     {
//         "name": "学员管理",
//         "children": [
//             {
//                 "name": "学员项目管理"
//             }
//         ]
//     },
//     {
//         "name": "我的中心"
//     }
// ]
export default recursionRoutes  
// //调用方法
// console.log(recursionRoutes(allRoutes,menuList));