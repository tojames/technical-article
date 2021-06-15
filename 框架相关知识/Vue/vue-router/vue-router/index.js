import install from "./install"
import createMatcher from "./create-matcher"
import HashHistory from "./mode/hash"
import BrowserHistory from "./mode/history"

export default class VueRouter {
  // options 接收所有的参数，比如mode route
  constructor(options) {
    // console.log(options, "options")
    // console.log(this, "this")

    // 创建匹配器
    // 用户没有传入默认 []
    // 1.match 痛殴路由来匹配组件
    // 2.addRoutes 动态添加匹配规则
    this.matcher = createMatcher(options.routes || [])

    // 路径切换
    options.mode || "hash" // 默认hash
    if (options.mode === "hash") {
      this.history = new HashHistory(this)
    } else if (options.mode === "history") {
      this.history = new BrowserHistory(this)
    }
    console.log(this.history, "this.history")
  }

  // 对用户传进来的东西进行初始化，比如router 扁平化，match
  init(app) {
    // 监听hash值变化，默认跳转到对应的路径上
    const history = this.history

    const setUpHashListener = () => {
      history.setUpHashListener() // 监听路由变化，hashchange
    }
    // 获取hash值，并且监听hash变化
    history.transitionTo(
      history.getCurrentLocation(), // 获取当前的位置
      setUpHashListener
    )

    history.listen((route) => {
      app._router = route
    })

    // setUpHashListener 放hash里
    // transitionTo  放base
    // getCurrentLocation 放到history 和 hash  window.location.hash  window.location.path
    console.log(app, "app")
  }

  // 匹配路由的方法
  match(location) {
    return this.matcher.match(location)
  }
}

// 接着安装install
VueRouter.install = install
