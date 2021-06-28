import Vue from "vue";
import install from "./install";
import { forEachValue } from "./utils";

// 1.Vue.use(Vuex) 是一个对象，有install
// 2.Vuex中有一个Store类
// 3.通乳到组件中，添加store属性

class Store {
  constructor(options) {
    console.log(options, "options");

    // 1.state
    let state = options.state;

    // 2.getter
    this.getters = {};
    const computed = {};

    // getters 是具有缓存的，底层是基于Vue的computed
    forEachValue(options.getters, (fn, key) => {
      // 将用户的getters定义在实例上
      computed[key] = () => {
        return fn(this.state);
      };

      Object.defineProperty(this.getters, key, {
        // 当我取值，执行计算属性的逻辑,这样就可以缓存起来了
        get: () => this._vm[key],
      });
    });

    this._vm = new Vue({
      data: {
        // 属性如果是通过$开头的 默认不会将这个属性挂载到vm上
        $$state: state, // 会将$$state 对应的对象 都通过defindProperty来惊醒属性劫持
      },
      computed,
    });

    //  3.mutation 基于发布订阅模式
    this.mutations = {};
    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = (payload) => fn(this.state, payload);
    });

    // 4.actions
    this.actions = {};
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn(this, payload);
    });
  }
  // 在严格模式下 mutations 、actions 是有区别的
  // 外面调用commit的时候调用mutations里面的方法  为了保证 commit 的this指向为Store
  commit = (type, payload) => {
    this.mutations[type](payload);
  };

  dispatch = (type, payload) => {
    this.actions[type](payload);
  };

  // 属性访问器
  get state() {
    return this._vm._data.$$state;
  }
}
// Store.install = install 导出使用的问题
export default {
  Store,
  install,
};
