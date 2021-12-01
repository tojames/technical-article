import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";

export function lifecycleMiXin(Vue) {
  Vue.prototype._update = function (vnode) {
    // console.log(vnode, "vnode")
    let vm = this;
    // 每次都用新的el
    vm.$el = patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  const options = vm.$options; // render
  vm.$el = el; // 真实的dom元素

  // Watcher 就是用来渲染的
  // vm._render 通过解析的render方法 渲染出虚拟dom _c _v _s
  // vm._update 通过虚拟dom 创建真实的dom
  callHook(vm, "beforeMount");
  // 渲染页面
  let updateComponent = () => {
    // 无论是渲染还是更新都会调用此方法
    // 返回的是虚拟dom
    vm._update(vm._render());
  };
  // 渲染watcher 每个组件都有一个watcher,true表示他是一个渲染watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, "beforeUpdate");
    },
    true
  );
  callHook(vm, "mounted");
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]; // [fn,fn,fn]
  if (handlers) {
    // 找到对应的钩子依次执行
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}
