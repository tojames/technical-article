export function patch(oldVnode, vnode) {
  // console.log(oldVnode, vnode, "oldVnode,vnode ")
  // 将虚拟节点转化成真实的节点
  let el = createElm(vnode) // 产生真实的dom
  // console.log(el, "el")
  let parentElm = oldVnode.parentNode
  parentElm.insertBefore(el, oldVnode.nextSibling)
  // 删除老节点
  parentElm.removeChild(oldVnode)

  return el
}

function createElm(vnode) {
  undefined
  // console.log(vnode, "vnode")
  let { tag, children, key, data, text } = vnode
  // console.log(vnode, "vnode")
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag)
    // 属性处理
    updateProperties(vnode)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // console.log(text, "Text")
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let el = vnode.el
  let newProps = vnode.data || {}
  for (const key in newProps) {
    if (key === "style") {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === "class") {
      el.className = el.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
