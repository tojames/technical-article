// 提供给其他组件使用
import applyMixin from "./mixin"
export let Vue

// 将store中的属性，方法，添加到组件中
let install = function (_Vue) {
  Vue = _Vue
  applyMixin(_Vue)
}

export default install
