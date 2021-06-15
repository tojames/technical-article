// import link from "./components/link"
// import view from "./components/view"
// 提供给其他组件使用
export let _Vue
let install = function (Vue, options) {
  _Vue = Vue

  console.log(options, "options")
  // 子组件需要router和route属性，需要使用混入
  Vue.mixin({
    beforeCreate() {
      // 这个是根组件
      if (this.$options.router) {
        this._routerRoot = this // this指向当前组件的实例
        this._router = this.$options.router
        // 在当前根组件进行初始化
        console.log(this._router, "this._router")
        this._router.init(this) // this-->根实例
        // 将current属性定义在_route上，并且是响应式
        Vue.util.defineReactive(this, "route", this._router.history.current)
        console.log(this.route, "route")
      } else {
        // 组件渲染是一层层渲染的，到这里的都是子组件
        this.routerRoot = this.$parent && this.$parent._routerRoot
      }
    },
  })

  // 需要挂载全局组件
  Vue.component("router-link", {
    render: (h) => h("h1", {}, "link"),
  })
  Vue.component("router-view", {
    render: (h) => h("h1", {}, "view"),
  })
  // 接着需要挂载全局属性
  Vue.prototype.$router = {} // 路由实例对象「属性及方法」
  Vue.prototype.$route = {} // 路由对象「属性」
}

export default install
