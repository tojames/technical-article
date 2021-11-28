import { observe } from "./observer2/index"
import { proxy } from "./util/index"

export function initState(vm) {
  // vm.$options
  // console.log(vm, "initState");
  const opts = vm.$options

  if (opts.props) {
    intitPrors()
  }

  if (opts.methods) {
    intitMethods()
  }

  if (opts.data) {
    intitData(vm)
  }

  if (opts.computed) {
    intitComputed()
  }

  if (opts.watch) {
    intitWatch()
  }
}

// 数据初始化
function intitData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === "function" ? data.call(vm) : data

  // console.log(data, "data");

  for (let key in data) {
    proxy(vm, "_data", key)
  }
  observe(data)
}
