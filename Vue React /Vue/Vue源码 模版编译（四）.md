# Vue模版编译

Vue怎么渲染dom？

先将DOM/template转换为render，render就生成虚拟dom，虚拟dom渲染成真实的节点。本篇就是将DOM/template转换为render。



> 模版编译在Vue中并不是所有的版本都有的。
>
> **完整版**：同时包含编译器和运行时的版本。
>
> **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码，就是我们说的模版编译。
>
> **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。



## $mount

我们知道Vue的`$mount` 是有两个不同的api的，一个含有编译器将`template`转换为render函数，另外一个是直接读取render函数的。

现在讲完整版的`$mount`，`src/platforms/web/enrty-runtime-width-compiler.js`，删除部分代码

```js
import Vue from "./runtime/index";
import { compileToFunctions } from "./compiler/index";


const mount = Vue.prototype.$mount; // 这个是 Vue.prototype.$mount 运行时的$mount，很关键。
Vue.prototype.$mount = function (el hydrating
) {
let template = options.template;
  // 如果options没有就去dom中找
  // template = getOuterHTML(el);

  const options = this.$options;
  // 将 template 转换为 render函数
  const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      // 给options添加render属性来存储render函数
      options.render = render;
      options.staticRenderFns = staticRenderFns;
  }
	// 执行运行时的mount，这样完整版和运行时只相差了一个 compileToFunctions，后序的代码都是一样的。
  return mount.call(this, el, hydrating);
};


// 暴露一个compileToFunctions到Vue.compile上。
Vue.compile = compileToFunctions;

export default Vue;

```



## compileToFunctions

> 这个api 是将` template` 转换为render函数的关键，但是细节非常多，我这里讲大概的流程。

在 `src/platforms/web/compiler/index`

```js
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

接着找到了 `src/compiler/index.js`

```js
import { parse } from "./parser/index"; // 解析器
import { optimize } from "./optimizer"; // 优化器
import { generate } from "./codegen/index"; // 生成器
import { createCompilerCreator } from "./create-compiler"; // 主要逻辑都在这里执行，并且返回出去

export const createCompiler = createCompilerCreator(function baseCompile(
  template, options){
  // 1.解析ast语法树
  const ast = parse(template.trim(), options); 
  if (options.optimize !== false) {
    // 2.对ast树进行标记,标记静态节点
    optimize(ast, options); 
  }
   // 3.生成代码
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
```

**核心的方法是 parse 、optimize 、generate** 



## parse 

> 解析器：是将模版解析成AST。

举个例子

```js
template: <div> <p>Hello {{name}}</p> </div>

AST：
let AST = {
  tag: 'div',
  type: 1,
  staticeRoot: fale,
  plain: true,
  parent: undefined,
  attrsList: [],
  sttrsMap: {},
  children: [
    {
      tag: 'p',
      type: 1,
      staticeRoot: fale,
      plain: true,
      parent: { tag: 'div' ,...},
      attrsList: [],
      sttrsMap: {},
      children: [
        {
          type: 2,
          expression:'"Hello "+_s(name)'
          text: 'Hello {{name}}',
          static:false
        }
      ]
    }
  ]
}
```

**原理其实很简单，操作起来很复杂，就是通过大量的正则匹配，将template不断的去截取，然后不断凭借生成AST对象。**

### 源码解读

```js
代码实在太多，我这里找html-parser作为举例，就是解析html了。它这里还有 text-parser、filter-parser

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
通过这些这种去匹配 相应位置的内容。


// 解析html
export function parseHTML(html, options) {
  // 对html处理，一直截取，直到没有
  while (html) {
    last = html;
      // 截取开头 <
      let textEnd = html.indexOf("<");
      if (textEnd === 0) {
        // Comment: 判断注释节点
        if (comment.test(html)) {
          // 匹配注释节点
          // commentEnd 为找到后的位置
          const commentEnd = html.indexOf("-->");

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(
                html.substring(4, commentEnd),
                index,
                index + commentEnd + 3
              );
            }
            // 把html更新，前进commentEnd + 3个位置
            advance(commentEnd + 3);
            continue;
          }
        }

        // End tag:
        const endTagMatch = html.match(endTag); // 结束标签
        if (endTagMatch) {
          const curIndex = index;
          // 前进，更新 html
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag:
        const startTagMatch = parseStartTag(); // 开始标签处理
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            // 前进一个位置
            advance(1);
          }
          continue;
        }
      }

      // 处在中间的文本
      let text, rest, next;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf("<", 1);
          if (next < 0) break;
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd); // 文本处理
      }
    
      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
  
    if (html === last) {
      options.chars && options.chars(html);
      if (
        process.env.NODE_ENV !== "production" &&
        !stack.length &&
        options.warn
      ) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, {
          start: index + html.length,
        });
      }
      break;
    }
  }

  // Clean up any remaining tags
  // 解析结尾标签
  parseEndTag();
}

```



## optimize 

> 优化器，优化器的作用是将AST只能够的静态节点打上标记，比如有些文字是固定的，或者一些不需要改变的内容，在虚拟dom对比的时候和渲染的时候不会重复操作。

它其实操作很简单就是在AST中的 `staticRoot`和`static`改为true即可。

### 源码解读

```js
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root) // static -> true
  // second pass: mark static roots.
  markStaticRoots(root, false) // staticRoot -> true
}

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  )
}

function markStatic (node: ASTNode) {
  node.static = isStatic(node) // 静态节点标记
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if ( // 组件 插槽 不是静态节点
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child) // 递归标记
      if (!child.static) { 
        node.static = false
      }
    }
    if (node.ifConditions) { // 带有v-if条件的节点
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block) // 静态标记
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !( // 节点是静态的，而且有儿子不是文本就标记成staticRoot：true
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) { // 递归遍历子节点
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}

function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || ( // 是pre
    !node.hasBindings && // no dynamic bindings 无动态绑定
    !node.if && !node.for && // not v-if or v-for or v-else 无v-if v-for
    !isBuiltInTag(node.tag) && // not a built-in  是普通标签
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) && // 不是v-for子节点
    Object.keys(node).every(isStaticKey) // 静态key
  ))
}

function isDirectChildOfTemplateFor (node: ASTElement): boolean {
  while (node.parent) {
    node = node.parent
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

```



## generate

> 生成器，它的作用是将AST转换成渲染函数中的内容，然后这个渲染函数执行后，会得到一份Vnode。

举例子

```js
template: <div>Hello {{name}}</div>

假如 parse optimize 都执行完了，到 generate执行，会将传递过来的AST执行成下面这样

'width(this){return _c('div',[_v("Hello "+ _s(name))])}'

注意：这里的 _c/_v/_s 都是生产虚拟dom的方法。
这样执行，通过 width 将this传入，执行方法，返回虚拟dom，所以模版解析完后，是返回一份虚拟dom。
```

### 源码解读

```js
export function generate(ast，options) {
    const state = new CodegenState(options)
    // 元素生成
    const code = ast ? genElement(ast, state) : '_c("div")'
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    }
}

export function genElement(el: ASTElement, state: CodegenState): string {
    if (el.parent) {
        el.pre = el.pre || el.parent.pre
    }
    // 对各种类型做处理
    if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state)
    } else if (el.for && !el.forProcessed) { // 处理v-for
        return genFor(el, state)
    } else if (el.if && !el.ifProcessed) { // 处理v-if
        return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
        return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
        return genSlot(el, state)
    } else {
        // component or element
        let code
        if (el.component) {
            code = genComponent(el.component, el, state)
        } else {
            let data
            if (!el.plain || (el.pre && state.maybeComponent(el))) {
                data = genData(el, state)
            }
            const children = el.inlineTemplate ? null : genChildren(el, state, true)
            code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
        }
        // module transforms
        for (let i = 0; i < state.transforms.length; i++) {
            code = state.transforms[i](el, code)
        }
        return code
    }
}

```

