export default {
  namespaced: true,
  state: {
    age: 12,
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
        commit("b/changeAge", payload)
      }, 1000)
    },
  },
}
