/* @flow */

import { ASSET_TYPES } from "shared/constants";
import { isPlainObject, validateComponentName } from "../util/index";

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 以组件为例
      // 如果没有传组件的 definition 的话
      // 就是获取 当前id的组件，其实就是已经注册过的全局组件
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        // 校验一下组件name
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "production" && type === "component") {
          validateComponentName(id);
        }
        if (type === "component" && isPlainObject(definition)) {
          definition.name = definition.name || id;
          // 如果传递了 definition，则是注册全局组件
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          // 注册指令
          definition = { bind: definition, update: definition };
        }
        // 给全局上赋值上这个definition，全局指令、组件、过滤器
        // 过滤器比较简单只是在全局上放一个方法而已。
        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
