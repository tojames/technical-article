export default {
  namespaced: true,
  state: {
    age: 13,
  },

  getters: {
    myAge(state) {
      return state.age
    },
  },
  mutations: {
    changeAge(state, proload) {
      state.age += proload
    },
  },

  actions: {
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit("a/c/changeAge", payload)
      }, 1000)
    },
  },
}
