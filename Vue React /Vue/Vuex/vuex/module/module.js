import { forEachValue } from "../utils"

export default class Module {
  // 属性访问器，!! 的好处是强制转为boolean
  get namespaced() {
    return !!this._raw.namespaced
  }
  constructor(newModule) {
    this._raw = newModule // 用户定义的模块
    this._children = {}
    this.state = newModule.state // 当前模块的状态
  }

  getChild(key) {
    // console.log(this, "getChild")
    return this._children[key]
  }
  addChild(key, module) {
    // console.log(this, "addChild")
    this._children[key] = module
  }

  // 给模块拓展方法
  forEachMutation(fn) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, fn)
    }
  }
  forEachAction(fn) {
    if (this._raw.actions) {
      // console.log(this._raw.actions, "this._raw.actions");
      forEachValue(this._raw.actions, fn)
    }
  }
  forEachGetter(fn) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, fn)
    }
  }
  forEachChild(fn) {
    // console.log(this._children, "this._children")
    forEachValue(this._children, fn)
  }
}
