import Vue from "vue"
import Vuex from "../vuex/index"
// import Vuex from "vuex";
import a from "./a"
import b from "./b"

Vue.use(Vuex)

const store = new Vuex.Store({
  namespaced: true,
  state: {
    // a，b 会编译到这里
    age: 10,
  },

  getters: {
    myAge(state) {
      return state.age
    },
  },
  mutations: {
    // 在没有namespace 合并 mutations
    changeAge(state, proload) {
      state.age += proload
    },
  },

  actions: {
    // 在没有namespace 合并 actions
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit("changeAge", payload)
      }, 1000)
    },

    changeAge2({ commit }, payload) {
      setTimeout(() => {
        commit("changeAge", payload)
      }, 1000)
    },
  },

  // 模块化
  modules: {
    a,
    b,
  },
})

export default store
