// export const fn = () => {
//   console.log("这是rollup");
// };
import { initMixin } from "./init"
import { lifecycleMiXin } from "./lifecyle"
import { renderMiXin } from "./vdom/index"
import { initGlobalAPI } from "./global-api/index"

function Vue(options) {
  // console.log(options, "options");
  this._init(options)
}

// 写成一个个插件，对原形进行扩展。

initMixin(Vue)
lifecycleMiXin(Vue)
renderMiXin(Vue)

// 初始化全局的api
initGlobalAPI(Vue)

// 将Vue导出，将会被执行
export default Vue
