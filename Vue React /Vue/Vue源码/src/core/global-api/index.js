/* @flow */

import config from "../config";
import { initUse } from "./use";
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import { initAssetRegisters } from "./assets";
import { set, del } from "../observer/index";
import { ASSET_TYPES } from "shared/constants";
import builtInComponents from "../components/index";
import { observe } from "core/observer/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  // 不能修改，修改则警告
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  //  util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = <>(obj: T): T => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  //  ASSET_TYPES = ['component', 'directive', 'filter']
  // 初始化 components directives filters
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;
  // 默认初始化全局api 则会构建keep-alive，将builtInComponents属性添加到Vue.options.components
  extend(Vue.options.components, builtInComponents);

  initUse(Vue); // 初始化插件的使用
  initMixin(Vue); // 混入,其实原理是参数合并
  initExtend(Vue); // 继承
  initAssetRegisters(Vue); // 注册  'component','directive', 'filter'
}
