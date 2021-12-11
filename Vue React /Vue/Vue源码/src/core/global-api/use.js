/* @flow */

import { toArray } from "../util/index"; // 将类数组的方法 转换为真的数组，并将不需要转换的参数过滤

export function initUse(Vue: GlobalAPI) {
  // Vue.use(xxx,a,b,vc)
  Vue.use = function (plugin: Function | Object) {
    // 插件缓存
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    // 如果已经有插件 直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1); // 除了第一项其他的参数整合成数组
    args.unshift(this); // 将Vue 放入到数组中 // [Vue,a,b,c]
    // 调用install方法
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    }
    // 直接调用方法
    else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin); // 缓存插件
    return this;
  };
}
