<template>
  <div class="Login">
    <video
      src="../../../../千峰login.mp4"
      autoplay="autoplay"
      muted="muted"
      loop="loop"
    ></video>
    <!-- 展示组件 -->
    <img src="../../assets/img/pig.jpg" alt="" class="img">
    <el-form
      :model="loginForm"
      
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-loginForm"
    >
      <h1>千峰管理系统</h1>
      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          v-model="loginForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          @keydown.native.enter="submitForm('loginForm')"
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item label="验证码" prop="captcha">
        <el-input
          type="text"
          class="captcha"
          v-model="loginForm.captcha"
          autocomplete="off"
        ></el-input>
        <span class="captcha-svg" v-html="captchaSvg" @click="refreshCaptcha">12345</span>
      </el-form-item>
      <!-- <el-form-item label="年龄" prop="age">
        <el-input v-model.number="loginForm.age"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')"
          >提交</el-button
        >
        <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//引入login.js文件
import { login,getCaptcha,verifyCaptcha } from "@/api";
import {mapMutations} from "vuex"
// console.log(login);
export default {
  //登入逻辑实现
  //1.收集用户输入的username和password传递给后端
  data() {
    //校验用户名
    var validateUsername = (rule, value, callback) => {
      //jsDoc的注释方式
      //@param {object} rule一个表单验证对象
      //@param {string} value 输入框中的输入值
      // console.log(rule);
      // console.log(value);
      // 用户名正则：4-16位（字母，下划线，数字，-）
      // var uPattern = /^[a-zA-Z0-9_-]{4,16}$/
      if (!value) {
        callback("4-16位（字母，下划线，数字，-）");
      } else {
        callback();
      }
    };

    //校验用户密码
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    //校验验证码
    var validateCaptcha = (rule, value, callback) => {
      if (value === "" || value.length!==5) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      captchaSvg: "",//从服务器获取下来的验证码captchaSvg结构
      loginForm: {
        username: "",
        password: "",
        captcha: ""
        // age: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }]
        // age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  //钩子函数
  mounted () {
    this.set_captcha()
  },
  methods: {
    //设置验证码
    set_captcha(){
      //页面一加载，获取验证码
      getCaptcha()
      .then(res=>{
        this.captchaSvg = res.data.img
      })
    },

    //刷新验证码
    refreshCaptcha(){
      this.set_captcha()
    },
    
    ...mapMutations(['SET_USERINFO','SET_PERMISSION_BUTTONS']),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //代表本地校验通过
          //先验证验证码是否正确，如果正确再发送登入请求
          let verifyRes = await verifyCaptcha(this.loginForm.captcha)
          if(!verifyRes.data.state){
            //验证码不正确时
            this.$message.error("验证码输入错误，请重新输入")
            return
          }
          //收集用户输入的username和password
          //调用login方法,发送登入请求
          //打开登录加载动画
          const loading = this.$loading({
            lock: true,
            text: "Loading...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let { username, password } = this.loginForm;
          login(username, password)
            .then(res => {
              //服务器响应登录，关掉登陆框
              loading.close()
              if (res.data && res.data.state) {
                //用户名密码正确
                
                //将token和用户信息存到localStorage
                localStorage.setItem("stu-token", res.data.token);
                localStorage.setItem("stu-userInfo", JSON.stringify(res.data.userInfo));
                localStorage.setItem("stu-permission-buttons", JSON.stringify(res.data.permission.buttons));
                //将用户信息储存到vuex中
                //更改vuex中state['userInfo']的值
                this.SET_USERINFO(res.data.userInfo)
                this.SET_PERMISSION_BUTTONS(res.data.permission.buttons)

                this.$router.push("/Welcome")
                this.$message.success("登录成功")
              } else {
                //用户名或密码错误
                this.$message.error("用户名或密码错误");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
/* //验证码 */


.login {
  /* position: relative; */
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: block;
  /* background-image: '../../assets/img/pig.jpg'; */
}
.img{
  z-index: 99;
  position: absolute;
  top: 100px;
  left: 200px;
  opacity: .3;
}
/* 表单样式 */
.el-form {
  /* z-index: 99; */
  position: absolute;
  top: 150px;
  right: 150px;
  width: 400px;
  height: 520px;
  border: 1px solid #ccc;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 11px;
}
h1 {
  color: white;
  margin-left: 100px;
  margin-top: 120px;
  margin-bottom: 60px;
}
.el-button {
  width: 240px;
  background: linear-gradient(90deg, blue, skyblue);
}
video {
  /* width: 100%; 
    height: 100%; */
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: -99;
}
/* 验证码 */
span{
  position: absolute;
  left: 110px;
  background-color: #fff;
  display: inline-block;
  height: 44px;
  width: 139px;
  border-radius: 5px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}

</style>
