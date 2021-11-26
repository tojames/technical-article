import { initState } from "./state";
export function initMixin(Vue) {
  // 初始化方法
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // Vue 响应式数据原理
    // 参考MVVM，不是MVVM
    // 数据变化，视图更新，视图变化数据会被影响.不能跳过数据去更新视图，$ref
    initState(vm);
  };
}
