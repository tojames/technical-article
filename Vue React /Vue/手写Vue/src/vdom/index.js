export function renderMiXin(Vue) {
  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    let vnode = render.call(vm)
    // console.log(vnode, "vnode")
    return vnode
  }
  // 创建元素
  Vue.prototype._c = function () {
    return creatElement(...arguments)
  }
  // 创建文本元素
  Vue.prototype._v = function (text) {
    return createText(text)
  }
  // 将文本展示出来 stirngify
  Vue.prototype._s = function (val) {
    return val === null ? "" : typeof val === "object" ? JSON.stringify(val) : val
  }
}

function creatElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 生成虚拟dom
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  }
}
