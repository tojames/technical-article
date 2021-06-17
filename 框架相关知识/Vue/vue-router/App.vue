<template>
  <div id="app">
    <router-link to="/" tag="span">首页</router-link>
    <router-link to="/about" tag="span">关于页面</router-link>
    <router-view :a="1" />
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>
<style lang="scss"></style>
