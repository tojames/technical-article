import { forEachValue } from "../utils";

export default class Module {
  constructor(newModule) {
    this._raw = newModule; // 用户定义的模块
    this._children = {};
    this.state = newModule.state; // 当前模块的状态
  }

  getChild(key) {
    return this._chidren[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }

  // 给模块拓展方法
  forEachMutation(fn) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, fn);
    }
  }
  forEachAction(fn) {
    if (this._raw.actions) {
      // console.log(this._raw.actions, "this._raw.actions");
      forEachValue(this._raw.actions, fn);
    }
  }
  forEachGetter(fn) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, fn);
    }
  }
  forEachChild(fn) {
    forEachValue(this._children, fn);
  }
}
