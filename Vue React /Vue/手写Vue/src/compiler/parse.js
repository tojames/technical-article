export function parser(html) {
  let root,
    currentParent,
    stack = []
  // 一直去截取html，直到长度为0
  while (html) {
    let textEnd = html.indexOf("<")
    if (textEnd === 0) {
      // bind on 都在这里匹配
      // console.log("开始")
      // 开始标签匹配的结果
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1]) //
        break
      }
    }
    // 文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  // 创建AST元素
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1, // 元素类型
      children: [],
      attrs,
      parent: null,
    }
  }

  // 判断标签是否合法 比如 <div><span></div>这种是不合法的，可以使用栈结构去处理
  function start(tagName, attrs) {
    // console.log("tagName:", tagName, "attrs:", attrs)
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
    // console.log(element, "element")
  }
  function end(tagName) {
    let element = stack.pop() // 栈中最后的元素
    // console.log(tagName, "end")
    currentParent = stack[stack.length - 1] // 更新currentParent
    if (currentParent) {
      // 闭合的时候知道它的父级
      element.parent = currentParent
      // 同样也可以知道儿子
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    // console.log(text, "chars")
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      // console.log(start, "start")
      const match = {
        tagName: start[1],
        attrs: [],
      }
      // console.log(match, "match")
      advance(start[0].length) // 删除开始标签
      // 如果直接是闭合标签了，说明没有属性
      let end, attr
      // 只要不是结尾标签&&能匹配到属性 就可以一直走下去
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // attr[0]是" id=\"app\""   att[2]是 ’=‘
        // console.log(attr, "attr", end, "end")
        match.attrs.push({
          name: attr[1], // id
          value: attr[3] || attr[4] || attr[5], // app
        })
        advance(attr[0].length)
      }
      // console.log("end", end)
      // >
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  // 对html进行截取
  function advance(n) {
    html = html.substring(n)
  }

  // console.log(root, "rot")
  return root
}

// 本代码摘自 Vue源码 compile/paser/html-parser
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名 <a-b>
// ?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // my:xx
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则，捕获的内容是标签名
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 结束标签
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{xxx}}
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
