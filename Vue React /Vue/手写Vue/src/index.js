import { initMixin } from "./init"
import { lifecycleMiXin } from "./lifecyle"
import { renderMiXin } from "./vdom/index"
import { initGlobalAPI } from "./global-api/index"

function Vue(options) {
  // console.log(options, "options");
  this._init(options)
}

// 写成一个个插件，对原形进行扩展。

initMixin(Vue) // 执行挂载操作
lifecycleMiXin(Vue) // 生命周期，和真正渲染
renderMiXin(Vue) // 将template 转为ast

// 初始化全局的api
initGlobalAPI(Vue)

// 将Vue导出，将会被执行
export default Vue
