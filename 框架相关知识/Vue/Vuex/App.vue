<template>
  <div id="app">
    <div style="background: #f09e87">
      <div>state: {{ $store.state.age }}</div>
      <!-- <div>getters:{{ $store.getters.myAge }}</div> -->
      <button @click="$store.commit('changeAge', 5)">点击mutation + 5</button>
      <button @click="$store.dispatch('changeAge', 10)">点击action + 10</button>
    </div>
    <!-- 模块 -->
    <!-- <div>getters:{{ $store.getters.b.myAge }}</div> -->
    <!-- <div>getters:{{ $store.getters.a.myAge }}</div> -->

    <div style="background: skyblue">
      <div>a模块下的state: {{ $store.state.a.age }}</div>

      <button @click="$store.commit('a/changeAge', 5)">a模块点击mutation + 5</button>
      <button @click="$store.dispatch('a/changeAge', 10)">b模块点击action + 10</button>
    </div>
    <div style="background: pink">
      <div>b模块下的state:{{ $store.state.b.age }}</div>

      <button @click="$store.commit('b/changeAge', 5)">b模块点击mutation + 5</button>
      <button @click="$store.dispatch('b/changeAge', 10)">b模块点击action + 10</button>
    </div>

    <!-- 辅助函数 -->
    <br />
    <div>辅助函数mapState{{ age }}</div>
    <div>辅助函数mapGetter{{ myAge }}</div>
    <button @click="changeAge(10)">点击触发辅助函数mapMutation changeAge</button>
    <button @click="actionChangeAge(10)">点击触发mapActiontion a/changeAge 对象</button>
    <button @click="changeAge2(10)">点击触发mapActiontion changeAge2 数组</button>
  </div>
</template>
<script>
import { mapState, mapGetter, mapMutation, mapActiontion } from "./vuex/index"
export default {
  name: "App",
  created() {
    console.log(this.$store, "App 上的store")
  },
  computed: {
    ...mapState(["age"]),
    ...mapGetter(["myAge"]),
  },
  methods: {
    ...mapMutation(["changeAge"]),
    // ...mapActiontion({ "a/changeAge": "actionChangeAge" }),
    ...mapActiontion(["changeAge2"]),
  },
}
</script>
<style lang="scss"></style>
