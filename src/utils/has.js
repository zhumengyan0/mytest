// let buttons = localStorage.getItem("stu-permission-buttons")
//字符串转数组
// buttons = JSON.parse(buttons)
export default(buttons,permission)=>{
    //permission当前拥有的权限
    // console.log(permission);
    //buttons所有的权限
    // console.log(buttons);
    if(!permission){}
    let res = buttons.includes(permission)
    // console.log(res);
    return res
}