import install from "./install";
import createMatcher from "./create-matcher";
import HashHistory from "./mode/hash";
import BrowserHistory from "./mode/history";

/* 
1. 根据Vue的特性， Vue提供一个install方法，我们只需通过Vue.use(xxx).
  所以在install中，注册全局组件 link view，暴露$router $route,将vue传进来
  在 beforeCreate 生命周期，为每个组件添加_routerRoot，并在根组件在加载的时候初始化操作,然后将当前的匹配的路由做成响应式
  由beforeCreate钩子执行init方法，开启监听路由变化
 */

/* 2.在我们书写Route规则的时候 new VueRouter({...}),通过option把参数传递进来，mode初始化hash实例/history实例 router则进行扁平化，并进行缓存起来
    addRoutes「动态添加路由」，match「匹配路由」，并对匹配到的路由进行赋值 router就是当前实例  current通过 transitionTo 调用updateRoute获取，
*/

/* 3.router-link/router-view 在install的时候已经注册在全局了，router-link 用于跳转，里面调用的是 push方法，push方法是 先是匹配router组件，然后通过给 window.location.hash赋值，
    当我们匹配到了组件后，router-view 渲染组件，如果多层router的话，根据深度「depth」来渲染每一个  
*/
export default class VueRouter {
  // options 接收所有的参数，比如mode route
  constructor(options) {
    // console.log(options, "options");
    // console.log(this, "this")

    // 创建匹配器
    // 用户没有传入默认 []
    // 1.match 痛殴路由来匹配组件
    // 2.addRoutes 动态添加匹配规则
    this.matcher = createMatcher(options.routes || []);

    // 路径切换
    options.mode || "hash"; // 默认hash
    if (options.mode === "hash") {
      this.history = new HashHistory(this);
    } else if (options.mode === "history") {
      this.history = new BrowserHistory(this);
    }

    this.beforeHooks = [];
    this.afterHooks = [];
  }

  // 对用户传进来的东西进行初始化，比如router 扁平化，match
  init(app) {
    // 监听hash值变化，默认跳转到对应的路径上
    const history = this.history;

    // 获取hash值，并且监听hash变化
    history.transitionTo(
      history.getCurrentLocation(), // 获取当前的位置
      () => {
        history.setUpHashListener(); // 监听路由变化，hashchange
      }
    );

    history.listen((route) => {
      app._route = route;
    });
  }

  push(to) {
    this.history.push(to); // 跳转路由
  }
  go() {}

  // 匹配路由的方法
  match(location) {
    return this.matcher.match(location);
  }
  beforeEach(fn) {
    this.beforeHooks.push(fn);
  }
  afterEach(fn) {
    this.afterHooks.push(fn);
  }
}

// 接着安装install
VueRouter.install = install;
