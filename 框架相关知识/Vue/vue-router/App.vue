<template>
  <div id="app">
    <router-link to="/home" tag="span">首页</router-link>
    <router-link to="/layout" tag="span">布局</router-link>
    <router-link to="/about" tag="span">关于页面</router-link>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>
<style lang="scss"></style>
