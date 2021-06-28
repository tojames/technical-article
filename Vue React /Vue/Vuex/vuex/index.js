import Vue from "vue"
import install from "./install"
import ModuleCollection from "./module/module-collection"
import { forEachValue } from "./utils"
export * from "./helper"

// 1.Vue.use(Vuex) 是一个对象，有install
// 2.Vuex中有一个Store类
// 3.通乳到组件中，添加store属性

class Store {
  constructor(options) {
    const state = options.state

    this._actions = {}
    this._mutations = {}
    this._warppedGetters = {}

    // 1.处理成一种树的结构数据
    this._modules = new ModuleCollection(options)

    // 2.根模块的状态中，要将子模块通过模块名 定义在根模块上
    installModule(this, state, [], this._modules.root)
    console.log(this._actions, this._mutations, this._warppedGetters)
    console.log(state, "根state")
    // 3.将状态和getters，都定义在当前的vm上
    resetStoreVM(this, state)
  }

  // 在严格模式下 mutations 、actions 是有区别的
  // 外面调用commit的时候调用mutations里面的方法  为了保证 commit 的this指向为Store
  commit = (type, payload) => {
    this._mutations[type].forEach((mutation) => mutation.call(this, payload))
  }

  dispatch = (type, payload) => {
    this._actions[type].forEach((action) => action.call(this, payload))

    // this.actions[type](payload)
  }

  // 属性访问器
  get state() {
    return this._vm._data.$$state
  }
}
// Store.install = install 导出使用的问题
export default {
  Store,
  install,
}

/**
 *
 * @param {*} store 容器
 * @param {*} rootState  根模块
 * @param {*} path  所有路径
 * @param {*} module 格式化后的结果
 */
const installModule = (store, rootState, path, module) => {
  // console.log(path, "pathpathpath")

  // 命名空间 a/changeAge b/changeAge a/c/changeAge 原理就是注册时 将一个命名空间找到对应的方法即可
  let namesapced = store._modules.getNamespaced(path) // 返回前缀即可
  console.log(namesapced, "namesapced")

  // 将所有的子模块的状态安装到父模块的状态上
  if (path.length > 0) {
    // Vuex 可以动态添加模块
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)

    Vue.set(parent, path[path.length - 1], module.state)
  }

  // 需要将actions mutations getters 定义在Store中
  module.forEachMutation((mutation, key) => {
    store._mutations[namesapced + key] = store._mutations[namesapced + key] || []
    store._mutations[namesapced + key].push((payload) => {
      mutation.call(store, module.state, payload)
    })
  })
  module.forEachAction((action, key) => {
    store._actions[namesapced + key] = store._actions[namesapced + key] || []
    store._actions[namesapced + key].push((payload) => {
      action.call(store, store, payload)
    })
  })
  module.forEachGetter((getter, key) => {
    // 模块中getter的名字重复了会覆盖
    store._warppedGetters[key] = () => {
      return getter(module.state)
    }
  })
  // console.log(1111111, module)
  module.forEachChild((child, key) => {
    // 递归加载模块
    installModule(store, rootState, [...path, ...key], child)
  })
  // console.log(22222)
}

/**
 *
 * @param {*} store store实例
 * @param {*} state 状态
 */

function resetStoreVM(store, state) {
  const computed = {} // 定义计算属性
  store.getters = {} // 定义store中的getters
  forEachValue(store._warppedGetters, (fn, key) => {
    computed[key] = () => {
      return fn()
    }

    // 给store.getters 附加一个key属性，并它会触发上面的computed，从而实现缓存，
    // 意思就是只要template中使用了key了getter 第一次就会触发computed进行缓存起来
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    })
  })

  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  })
}
