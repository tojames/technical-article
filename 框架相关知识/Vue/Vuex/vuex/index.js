import install from "./install"

// 1.Vue.use(Vuex) 是一个对象，有install
// 2.Vuex中有一个Store类
// 3.通乳到组件中，添加store属性

class Store {
  constructor(options) {
    console.log(options, "options")
  }
}
// Store.install = install 导出使用的问题
export default {
  Store,
  install,
}
