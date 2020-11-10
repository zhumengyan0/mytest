<template>
  <div>
    <!-- <button @click="send">发送请求</button>
    <button @click="abort">发送中断请求</button> -->
    <template>
      <el-table :data="welcomeData" border style="width: 100%">
        <el-table-column prop="username" label="登入账户" width="180">
        </el-table-column>
        <el-table-column prop="lastLogin.ip" label="上次登入ip" >
        </el-table-column>
        <el-table-column prop="lastLogin.loginTime" label="上次登入时间" > 
        </el-table-column>
        <el-table-column prop="nowLogin.ip" label="本次登入ip" >
        </el-table-column>
        <el-table-column prop="nowLogin.loginTime" label="本次登入时间" >
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
//引入日志getloginLog
import { getloginLog } from "@/api";
export default {
  data () {
    return {
      welcomeData: []
    }
  },
  created () {
    //调用getloginLog
    getloginLog()
    .then(res=>{
      if(res.data.state && res.data){
        console.log(res);
        this.welcomeData = res.data.data
      }
    })
  },
  methods: {
    // send() {
    //   getloginLog(this).then(res => {
    //     console.log(res);
    //   });
    // },
    // abort() {
    //   //this.cancel终止请求
    //   // console.log(this.cancel);
    //   if (typeof this.cancel === "function") {
    //     //调用终止请求
    //     console.log(this.cancel);
    //   }
    // }
  }
};
</script>