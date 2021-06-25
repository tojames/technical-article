<template>
  <div id="app">
    <div style="background: #f09e87">
      <!-- <div>state: {{ $store.state.age }}</div> -->
      <!-- <div>getters:{{ $store.getters.myAge }}</div> -->
      <!-- <button @click="$store.commit('changeAge', 5)">点击mutation + 5</button> -->
      <!-- <button @click="$store.dispatch('changeAge', 10)">点击action + 10</button> -->
    </div>
    <!-- 模块 -->
    <!-- <div>getters:{{ $store.getters.b.myAge }}</div> -->
    <!-- <div>getters:{{ $store.getters.a.myAge }}</div> -->

    <!-- <div style="background: skyblue">
      <div>a模块下的state: {{ $store.state.a.age }}</div>

      <button @click="$store.commit('a/changeAge', 5)">a模块点击mutation + 5</button>
      <button @click="$store.dispatch('a/changeAge', 10)">b模块点击action + 10</button>
    </div>
    <div style="background: pink">
      <div>b模块下的state:{{ $store.state.b.age }}</div>

      <button @click="$store.commit('b/changeAge', 5)">b模块点击mutation + 5</button>
      <button @click="$store.dispatch('b/changeAge', 10)">b模块点击action + 10</button>
    </div> -->
  </div>
</template>
<script>
export default {
  name: "App",
  created() {
    console.log(this.$store, "App 上的store");
  },
};
</script>
<style lang="scss"></style>
