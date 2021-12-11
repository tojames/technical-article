# 组件



## 组件的作用

> 复用、方便维护，合理拆分组件可以在Vue底层的更新问题，每个组件都有一个watch，可以减少对比。



## Vue.extend

> 组件的初始化是靠`Vue.extend` ,通过寄生组合继承然后调用 `_init()`方法初始化组件，Vue中，它其实把所有的渲染以组件为单位，不断的嵌套



源码解析

```js
路径： core/global-api/extend.js, 省略部分代码

Vue.extend = function (extendOptions: Object): Function {
  // 传递进来的参数，就是options API格式的参数
  extendOptions = extendOptions || {}
  // Vue
  const Super = this
  // sub就是组件的方法，它就像Vue入口一样 执行init方法
  const Sub = function VueComponent (options) {
    this._init(options)
  }
  // 寄生组合继承
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  // 合并处理
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )

  // 将Sub返回出去
  return Sub
}

然后提供给 createComponent方法使用，就可以将这个 Sub里面options参数进行初始化，和调用 installComponentHooks 最后创建虚拟节点，返回出去。这样一个组件就完成了，等着挂载就可以了。
```



prop验证的type类型有哪几种

```js
title:String,
likes: Number,
isPublished: Boolean,
commentIds: Array,
author: Object,
callback: Function,
contactsPromise: Promise

校验
type,require,default,validater

// 自定义验证函数
propF: {
  type: String,
  validator: function (t) {
    // 这个值必须匹配下列字符串中的一个
    return t === 'fade' || t === 'slide'
  },
  default:'slide'
}
```



## 组件的设计原则

```
1.命名要通俗易懂, 代码即注释。
2.默认值要有, 一般把应用较多的设为默认值。
3.容错处理, 极端场景要考虑到, 不能我传错了一个参数你就原地爆炸。
4.场景化, 如一个dialog弹出, 还需要根据不同的状态封装成success, waring, 等。
5.一切皆可配置，可拓展性，颗粒化, 把组件拆分出来。 
6.有详细的文档/注释和变更历史, 能查到来龙去脉, 新版本加了什么功能是因为什么。
```





分为三大类。

1.由 `vue-router` 产生的每个页面。难度低，使用频率最高 

2.业务组件。在项目中不断被复用，比如一个上传图片组件，具有识别，查看，预览，删除等功能，但不具备迁移作用 难度中等，使用频率高。

3.具体功能的基础组件，比如**日期选择器**、**模态框**等 难度最高 使用频率高。

其实我们说，你平时封装过啥组件，我们一般都是在封装业务组件



> 本文，不会介绍 `vue-router`下面的组件，因为我们一直在写。
>
> 会以技术为导向封装功能组件为主。



### 基础组件 ----- 通用弹框组件（全局性的组件）

> 场景：我们后台管理系统经常会用到element-ui这个ui框架。会经常用到这样消息提示组件
>
> this.$message({message: '恭喜你，这是一条成功消息',type: 'success' });
>
> 这种组件都是全局组件和普通页面上的组件有些不一样。
>
> 区别一： 不是挂载app（根组件）上面，而是放在其他标签上面，然后通过定位弄上去。
>
> 区别二：不同于平时我们的业务组件和路由组件使用和渲染方式
>
> 区别三：只需要在js上面操作即可，但是方法做的东西还是挺多的。



#### 具体思路

- this.$message 这个对象肯定是挂载在vue上面，不然怎么能用this调用。
- $message 这个方法肯定是把这个组件的前世今生都在上面，比如现有一个这样的一个弹框就是一个普通vue组件。然后通过把这个组件的实例挂载到vue的构造函数上面，然后渲染。
- {message: '恭喜你，这是一条成功消息',type: 'success' } 参数是一个对象，这个对象就可以在$message里面做很多判断啦。

### code 

```js
准备工作 一个项目
-components
			--alert.js
			--alert.vue
-main.js

开发。
alert.vue 写一个组件
在一个方法里面接收一个参数，用做渲染。 具体代码在github Alert

alert.js 重头戏。 从下往上看。
import Alert from './alert.vue'
import Vue from 'vue'

Alert.newInstance = properties => {
  const props = properties || {}; // 2.1看看没有传参数进来。

  const Instance = new Vue({ // 2.2通过渲染函数将 Alert  得到虚拟dom
    data: props,
    render (h) {
      return h(Alert, {
        props: props
      });
    }
  });

  const component = Instance.$mount(); // 2.3挂载到vue上面
  document.body.appendChild(component.$el); // 2.4挂载到真实的dom上

  const alert = Instance.$children[0];// 2.5Alert组件的实例

  return {
    add (noticeProps) { // 2.6返回 add 这个方法 执行组件里面预先写好的 Alert组件里面的add方法
      alert.add(noticeProps);
    },
  }
};

function entrance({ duration = 1.5, content = '' }) {
  let instance = Alert.newInstance(); // 2.执行 newInstance 方法

  instance.add({ // 3 拿到实例的返回值，调用里面的方法传参数进去组件里面，再去执行相应的方法，渲染完毕。
    content: content,
    duration: duration
  });
}

export default { // 1.导出info这个方法，options接收的参数，return出去马上执行 entrance
  info (options) {
    return entrance(options);
  }
}


顺便把刚刚写的组件全局注册一下，并挂载到原型上面。
在main.js以插件的形式导入组件
// 导入刚刚封装的组件
import  Alert from "./components/alert/alert.js"
Vue.prototype.$Alert = Alert

使用 this.$Alert.info({  content: "我是atoe的全局组件",  duration: 3000  });
      
      
 总结：最核心的思路是触发相应的方法，把预先写好的组件通过render函数，$mount 挂载到vue上面，在渲染到真正的页面上（body）。 Instance.$children[0]是渲染组件的实例，Instance是render函数的返回值
```

上面通过render函数渲染的，实际开发中，真的不多。

#### 下面再去介绍一下好用的方法拿到组件的实例和触发相应组件的方法

```js
触发相应组件的方法：

应当有这样的基础：实现这对方法的关键点在于准确地找到组件实例。那在寻找组件实例上，我们的“惯用伎俩”就是通过遍历来匹配组件的 name 选项，在独立组件（库）里，每个组件的 name 值应当是唯一的

实现这对方法的关键点在于，如何正确地向上或向下找到对应的组件实例，并在它上面触发方法。在设计一个新功能（features）时，可以先确定这个功能的 API 是什么，也就是说方法名、参数、使用样例，确定好 API，再来写具体的代码。
// 广播（broadcast） 和分发（dispatch）
//  emitter.js
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

具体使用方法
有 A.vue 和 B.vue 两个组件，其中 B 是 A 的子组件，中间可能跨多级，在 A 中向 B 通信：
A.vue
<template>
	<button @click="handleClick">触发事件</button>
</template>
<script>
  import Emitter from '../mixins/emitter.js';
  
  export default {
    name: 'componentA',
    mixins: [ Emitter ],
    methods: {
      handleClick () {
        this.broadcast('componentB', 'on-message', 'Hello Vue.js');
      }
    }
  }
</script>

// B.vue
<script>
export default {
  name: 'componentB',
  created () {
    this.$on('on-message', this.showMessage);
  },
  methods: {
    showMessage (text) {
      window.alert(text);
    }
  }
}
</script>
```

```js
拿到组件的实例
// 由一个组件，向上找到最近的指定组件
function findComponentUpward (context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.name;

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
export { findComponentUpward };

// 由一个组件，向上找到所有的指定组件
function findComponentsUpward (context, componentName) {
  let parents = [];
  const parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}
export { findComponentsUpward };

// 由一个组件，向下找到最近的指定组件
function findComponentDownward (context, componentName) {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;

      if (name === componentName) {
        children = child;
        break;
      } else {
        children = findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}
export { findComponentDownward };

// 由一个组件，向下找到所有指定的组件
function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}
export { findComponentsDownward };

// 由一个组件，找到指定组件的兄弟组件
function findBrothersComponents (context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName;
  });
  let index = res.findIndex(item => item._uid === context._uid);
  if (exceptMe) res.splice(index, 1);
  return res;
}
export { findBrothersComponents };
```

#### 顺便唠叨一下组件相关的方法

最基本的prop event slot

provide/inject

渲染组件的extend render $mount

说实话我也不太懂原理，等我看来源码我再来补充吧。

## **对动态组件&&异步组件的理解**

```js
让多个组件使用同一个挂载点，并动态切换，这就是动态组件。

https://cn.vuejs.org/v2/guide/components-dynamic-async.html
https://segmentfault.com/a/1190000012138052
异步组件的功能就是，当我们的项目很大的时候，加载特别慢，可以考虑使用异步组件「不是特别重要的组件可以使用这种方式」来加载（需要的时候才去加载）。
可以减少内存开销，加快渲染速度。

使用
来自vue官网
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

## **组件中写name选项有什么作用**

```
1.项目使用keep-alive时，可搭配组件name进行缓存过滤
2.DOM做递归组件时需要调用自身name
3.vue-devtools调试工具里显示的组见名称是由vue中组件name决定的
```



