# initGlobalAPI

> initGlobalAPI 是初始化全局API的，它是先于new Vue执行的，所以可以提供全局方法在Vue的执行过程中执行相应的方法。



```js
export function initGlobalAPI(Vue: GlobalAPI) {
	// 创建options
  Vue.options = Object.create(null);
  // ASSET_TYPES = ['component', 'directive', 'filter']
  // 初始化 components directives filters
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 使用一个base去存储Vue实例
  Vue.options._base = Vue;
  // 默认初始化全局api 则会构建keep-alive，将builtInComponents属性添加到Vue.options.components
  extend(Vue.options.components, builtInComponents);

  initUse(Vue); // 初始化插件的使用
  initMixin(Vue); // 混入,其实原理是参数合并
  initExtend(Vue); // 继承
  initAssetRegisters(Vue); // 注册  'component','directive', 'filter'
}
```



## Vue.extend

> 组件的初始化是靠`Vue.extend` ,通过寄生组合继承然后调用 `_init()`方法初始化组件，Vue中，它其实把所有的渲染以组件为单位，不断的嵌套,它怎么调用的呢，它是通过`this.options._base.extend(definition)` 调用的，_base 其实就是Vue



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





## Vue.nextTick

> nextTick 总是在dom更新后执行一些方法，它的原理是有很多的hack的，主要是基于微任务。Promise，MutationObserver，setImmediate，setTimeout 一直往下找机会执行 timerFunc



```js
源码解析：

const callbacks = [];
let pending = false;

// 执行我们的回调函数
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
let timerFunc;
if (typeof Promise !== "undefined" && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {

  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 将cb push 进去 callbacks
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  // 如果pending为false则运行 timerFunc
  // timerFunc 执行是通过，Promise，MutationObserver，setImmediate，setTimeout 一直往下找机会执行 timerFunc
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}


Vue.nextTick(function () {
  // DOM 更新了
})
```



## Vue.use

> `Vue.use` 是用于给Vue拓展更多的功能的插件，比如`Vue-Router`、`Vuex`。
>
> 目的就是往Vue上面添加属性。
>
> 安装 Vue.js 插件。如果插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。
>
> 该方法需要在调用 `new Vue()` 之前被调用。
>
> 当 install 方法被同一个插件多次调用，插件将只会被安装一次。



```js
export function initUse(Vue: GlobalAPI) {
  // Vue.use(xxx,a,b,vc)
  Vue.use = function (plugin: Function | Object) {
    // 插件缓存
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    // 如果已经有插件 直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    const args = toArray(arguments, 1); // 除了第一项其他的参数整合成数组
    args.unshift(this); // 将Vue 放入到数组中 // [Vue,a,b,c]
    // 调用install方法
    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    }
    // 直接调用方法
    else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin); // 缓存插件
    return this;
  };
}

```



## Vue.mixin

> Vue2.0的混入功能，就是将所以的对象进行合并。

```js
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 全局属性混合
    this.options = mergeOptions(this.options, mixin); 
    return this;
  };
}
```



## Vue.directive、Vue.filter、Vue.component

> 这三个方法同时初始化的，先是初始化对象，接着执行，initAssetRegisters(Vue)。
>
> initAssetRegisters 可以统一处理注册 Vue.directive、Vue.filter、Vue.component



```js
// ASSET_TYPES = ['component', 'directive', 'filter']
// 初始化 components directives filters
ASSET_TYPES.forEach((type) => {
  Vue.options[type + "s"] = Object.create(null);
});

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 以组件为例
      // 如果没有传组件的 definition 的话
      // 就是获取 当前id的组件，其实就是已经注册过的全局组件
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        // 校验一下组件name
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "production" && type === "component") {
          validateComponentName(id);
        }
        if (type === "component" && isPlainObject(definition)) {
          definition.name = definition.name || id;
          // 如果传递了 definition，则是注册全局组件
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          // 注册指令
          definition = { bind: definition, update: definition };
        }
        // 给全局上赋值上这个definition，全局指令、组件、过滤器
        // 过滤器比较简单只是在全局上放一个方法而已。
        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
```

### Vue.component

[Vue组件](https://cn.vuejs.org/v2/guide/components-registration.html)

> 注册全局组件的方式

```js
Vue.component('MyComponentName', { 这里面的参数就是 optionsAPI 的参数 data，template这种})
```

接着 就会调用 `this.options._base.extend(definition)` ，其实就是`Vue.extend`「下面会介绍」



### Vue.filter

> 注册全局过滤器，如果是过滤器的话，直接给当前的key值赋值方法即可。

```js
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})
```



### Vue.directive

> 指令是传对象的话，是一个直接赋值的操作，如果是函数的话，会将函数赋值给 `bind` 和 `update`。

```js
// 注册
Vue.directive('my-directive', {
  bind: function () {},
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
})

// 注册 (指令函数)
Vue.directive('my-directive', function () {
  // 这里将会被 `bind` 和 `update` 调用
})
```



## Vue.compile

> 将一个模板字符串编译成 render 函数。**只在完整版时可用**。



```js
var res = Vue.compile('<div><span>{{ msg }}</span></div>')

new Vue({
  data: {
    msg: 'hello'
  },
  render: res.render,
  staticRenderFns: res.staticRenderFns
})
```

