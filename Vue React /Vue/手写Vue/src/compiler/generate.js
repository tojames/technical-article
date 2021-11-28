// 模版 <div id="app" style="color:red">hello{{name}} <span>hello</span> </div>
// 输出 render(){
//  return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),
// _c('span',null,_v('hello')))
//}
// _c 创建元素， _s JSON.stringify, _v 文本节点

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{xxx}}

export function generate(el) {
  let children = genChildren(el)
  let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : "undefined"} ${
    children ? `,${children}` : []
  } )`
  // console.log(code, "code")
  return code
}

function gen(node) {
  // console.log(node, "node")
  if (node.type === 1) {
    return generate(node) // 生成元素节点的字符串
  } else {
    // 文本节点 tyoe =3
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = [] // 存放每一段的代码
    let lastIndex = (defaultTagRE.lastIndex = 0) // 如果正则是全局模式，需要每次使用前前置为0
    let match, index // 每次匹配到的结果
    while ((match = defaultTagRE.exec(text))) {
      index = match.index // 保存匹配到的索引
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join("+")})`
  }
}

function genChildren(el) {
  const children = el.children
  if (children) {
    // 将所有转化后的儿子用逗号拼接起来
    // console.log(children, "children")
    return children.map((child) => gen(child)).join(",")
  }
}

function genProps(attrs) {
  // console.log(attrs, "attrs")
  let str = ""
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === "style") {
      let obj = {}
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":")
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  // console.log(str, "str")
  return `{ ${str.slice(0, -1)} }`
}
