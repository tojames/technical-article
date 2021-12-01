import { initState } from "./state"
import { compileToFunctions } from "./compiler/index"
import { mountComponent, callHook } from "./lifecyle"
import { mergeOptions } from "./util/index"
import { nextTick } from "./util/next-tick"

export function initMixin(Vue) {
  // 初始化方法
  Vue.prototype._init = function (options) {
    const vm = this
    // vm.$options = options
    // 将用户传递的 和 全局的进行一个合并
    vm.$options = mergeOptions(vm.constructor.options, options)

    // Vue 响应式数据原理
    // 参考MVVM，不是MVVM
    // 数据变化，视图更新，视图变化数据会被影响.不能跳过数据去更新视图，$ref

    callHook(vm, "beforeCreate")

    // 初始化状态
    initState(vm) // 分割代码

    callHook(vm, "created")
    // 如果用户传入了el属性 需要将页面渲染出来
    // 如果用户传入了el 就要实现挂载流程

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    // 渲染的操作 ，
    // 1.默认会先找render方法
    // 2.如果没有传入render方法会查找template
    // 3.找当前el制定的元素中的内容进行渲染
    // 使用ast解析成rneder函数，所以render函数优先级最高

    // 挂载操作
    const vm = this,
      options = vm.$options

    el = document.querySelector(el)
    vm.$el = el
    // console.log(el, "el")
    // 没有render的时候，将template转化为render方法
    if (!options.render) {
      let template = options.templete
      // 如果template 没有,el有，渲染报错
      if (!template && el) {
        template = el.outerHTML
      }
      console.log(template, "template")
      // 这就是编译原理
      const render = compileToFunctions(template)
      options.render = render
      // 最终得到的就是render，
      // console.log(options.render, "options.render ")
    }
    // 挂载组件
    mountComponent(vm, el)
  }
  // 用户调用的nextTick
  Vue.prototype.$nextTick = nextTick // 注册了nextTick
}
