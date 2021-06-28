<template>
  <div id="app">
    <router-link to="/" tag="a">首页</router-link>
    <br />

    <router-link to="/layout" tag="a">布局</router-link>
    <br />
    <router-link to="/about" tag="a">关于页面</router-link>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  created() {},
};
</script>
<style lang="scss"></style>
