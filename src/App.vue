// 最大的根组建

<template>
  <div id="app">
    
    <router-view />
  </div>
</template>

<script>
export default{
  mounted () {
    //触发actions
    // this.$store.dispatch("FETCH_MENULIST")
  }
}
</script>
<style>

</style>
// app.vue是最大的组件，不需要路由加载
