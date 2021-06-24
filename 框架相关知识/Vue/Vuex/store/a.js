import c from "./c";
export default {
  namespaced: true,
  state: {
    age: 11,
  },

  getters: {
    myAge(state) {
      return state.age;
    },
  },
  mutations: {
    changeAge(state, proload) {
      state.age += proload;
    },
  },

  actions: {
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit("changeAge", payload);
      }, 1000);
    },
  },
  // 模块化
  modules: {
    c,
  },
};
