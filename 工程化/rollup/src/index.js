// export const fn = () => {
//   console.log("这是rollup");
// };
import { initMixin } from "./init";

function Vue(options) {
  // console.log(options, "options");
  this._init(options);
}

// 写成一个个插件，对原形进行扩展。

initMixin(Vue);

// 将Vue导出，将会被执行
export default Vue;
