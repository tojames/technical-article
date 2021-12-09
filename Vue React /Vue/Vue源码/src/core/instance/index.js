import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  // 初始化生命周期
  this._init(options);
}

initMixin(Vue); // 初始化组件，各种参数，挂载参数。
stateMixin(Vue); // 初始化数据相关的实例方法，下面介绍
eventsMixin(Vue); // 事件方法的初始化 $on、$off、$once 、$emit
lifecycleMixin(Vue); // 生命周期初始化，$forceUpdate $destroy
renderMixin(Vue); // $nextTick _render方法

export default Vue;
