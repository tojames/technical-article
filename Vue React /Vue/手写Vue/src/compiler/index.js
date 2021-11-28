import { parser } from "./parse"
import { generate } from "./generate"

export function compileToFunctions(template) {
  // 将html模版 ===》render函数
  // 1.将html代码转换成‘ast’语法树，使用一棵树结构把语言描述出来
  // <div id="a"></div>
  // { attrs:[{id:'a'}],tag:'div',children:[] },
  // 像虚拟dom，但是ast不仅仅可以生成虚拟dom，还可以对各类语言进行描述解析
  let ast = parser(template)

  // 2.优化静态节点
  // 3.通过这棵树，重新的生成代码,就是转换为render函数
  let code = generate(ast)
  console.log(code, "code")
  // 4.将字符串变成函数,通过with函数可以去到this
  let render = new Function(`with(this){return ${code}}`)
  return render
  console.log(render, "render")
}

// let obj = { a: 1 }
// with (obj) {
//   console.log(a)
// }
