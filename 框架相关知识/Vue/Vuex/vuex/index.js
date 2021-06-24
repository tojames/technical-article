// import Vue from "vue";
import install from "./install";
// import { forEachValue } from "./utils";
import ModuleCollection from "./module/module-collection";

// 1.Vue.use(Vuex) 是一个对象，有install
// 2.Vuex中有一个Store类
// 3.通乳到组件中，添加store属性

class Store {
  constructor(options) {
    const state = options.state;

    this._action = {};
    this._mutations = {};
    this._warppedGetters = {};

    this._mudules = new ModuleCollection(options);

    // 根模块的状态中，要将子模块通过模块名 定义在根模块上
    installModule(this, state, [], this._mudules.root);
    // console.log(this._action, this._mutations, this._warppedGetters);
  }
}
// Store.install = install 导出使用的问题
export default {
  Store,
  install,
};

/**
 *
 * @param {*} store 容器
 * @param {*} rootState  根模块
 * @param {*} path  所有路径
 * @param {*} module 格式化后的结果
 */
const installModule = (store, rootState, path, module) => {
  // 需要将actions mutations getters 定义在Store中
  module.forEachMutation((mutation, key) => {
    store._mutations[key] = store._mutations[key] || [];
    store._mutations[key].push((payload) => {
      mutation.call(store, module.state, payload);
    });
  });
  module.forEachAction((action, key) => {
    store._actions[key] = store._actions[key] || [];
    store._actions[key].push((payload) => {
      action.call(store, store, payload);
    });
  });
  module.forEachGetter((getter, key) => {
    // 模块中getter的名字重复了会覆盖
    store._warppedGetters[key] = () => {
      return getter(module.state);
    };
  });
  module.forEachChild((child, key) => {
    installModule(store, rootState, [...path, ...key], child);
  });
};
