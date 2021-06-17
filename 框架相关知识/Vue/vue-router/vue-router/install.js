import link from "./components/link";
import view from "./components/view";
// 提供给其他组件使用
export let _Vue;
let install = function (Vue) {
  _Vue = Vue;

  // 子组件需要router和route属性，需要使用混入
  Vue.mixin({
    beforeCreate() {
      // 这个是根组件
      if (this.$options.router) {
        this._routerRoot = this; // this指向当前组件的实例
        this._router = this.$options.router; // 注入的router
        console.log(this._router, "this._router");
        // 在当前根组件进行初始化

        this._router.init(this); // this-->根实例「根组件」
        // 将current属性定义在_route上，并且是响应式
        Vue.util.defineReactive(this, "_route", this._router.history.current);
        console.log(this.route, "route");
      } else {
        // 组件渲染是一层层渲染的，到这里的都是子组件
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    },
  });

  // 接着需要挂载全局属性

  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route; // 路由对象「属性」
    },
  });

  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    }, //  路由实例对象「属性及方法」
  });

  // 需要挂载全局组件
  Vue.component("router-link", link);
  Vue.component("router-view", view);
};

export default install;
