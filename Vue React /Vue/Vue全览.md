# Vue 全览

我尝试一下将 Vue，以一个图谱的形式展现出来。

Vue 是一个构造函数，通过给 Vue 原型和 Vue 函数添加函数以及对象，这样就可以拓展 Vue，代码如下。

注意 `_` 开头的变量为 Vue 的私有变量， `$`开头的为 Vue 暴露出来的原型方法/属性

```js
function Vue(options) {
  // 初始化生命周期
  this._init(options)
}

initMixin(Vue) // 初始化组件，各种参数，挂载组件。
stateMixin(Vue) // 初始化数据相关的实例方法，下面介绍
eventsMixin(Vue) // 事件方法的初始化 $on、$off、$once 、$emit
lifecycleMixin(Vue) // 生命周期初始化，$forceUpdate $destroy
renderMixin(Vue) // $nextTick _render方法
```

## initMixin

想详细了解这个方法，可以去看这篇文章

这个方法做了初始化组件到挂载的整个过程。

- 初始化大量的参数比如`$parent`、`$root`
- 初始化事件
- 初始化 render 函数创建元素的方法，插槽「缺解析插槽的文章」
- 初始化 inject
- 初始化 State，数据双向绑定
- 初始化 provide
- 挂载元素，需要经过模版编译过程「缺模版编译的文章」

## stateMixin

在上面的 initMixin 已经初始化 State，但是还有其他操作数据的方法，比如`$set`、`$del`、`$watch`这些全局方法还没有处理。

这些方法比较简单，就不另外分文章出来解析。

```js
export function stateMixin(Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  dataDef.get = function () {
    return this._data
  }
  const propsDef = {}
  propsDef.get = function () {
    return this._props
  }
  // 警告data被替换
  if (process.env.NODE_ENV !== "production") {
    dataDef.set = function () {
      warn("Avoid replacing instance root $data. " + "Use nested data properties instead.", this)
    }
    // 警告属性是只读的
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  Object.defineProperty(Vue.prototype, "$data", dataDef)
  Object.defineProperty(Vue.prototype, "$props", propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (expOrFn: string | Function, cb: any, options?: Object): Function {
    const vm: Component = this
    // 这里还留下了一个 用户可以通过 vm.$watch("xx",()....)的调用方法
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    // 在这里才真正去 watcher类里面进行监听
    const watcher = new Watcher(vm, expOrFn, cb, options) // 创建watcher，数据更新调用cb
    // 如果是immediate为true的话，立即执行传进来的回调函数
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    // 返回一个闭包去关闭定时器，一般是Vue内部销毁watch时调用的
    return function unwatchFn() {
      watcher.teardown()
    }
  }
}
```

### set

> 在对象上设置属性。 如果该属性不存在，则添加新属性并触发更改通知。

```js
export function set(target, key, val) {
  // 如果是数组 Vue.set(array,1,100); 调用重写的splice方法 (这样可以更新视图)
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 如果是对象本身的属性，则直接添加即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 如果是Vue实例 或 根数据data时 报错,（更新_data 无意义）
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        "Avoid adding reactive properties to a Vue instance or its root $data " +
          "at runtime - declare it upfront in the data option."
      )
    return val
  }
  // 如果不是响应式的也不需要将其定义成响应式属性
  if (!ob) {
    target[key] = val
    return val
  }
  // 将属性定义成响应式的
  defineReactive(ob.value, key, val)
  // 通知视图更新
  ob.dep.notify()
  return val
}
```

### del

> 提供删除响应数据的办法

```js
export function del(target, key) {
  // 如果是数组的话，直接删除一项即可，splice是重写过的
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  // 是对象的，直接删除即可
  delete target[key]
  if (!ob) {
    return
  }
  // 通知更新
  ob.dep.notify()
}
```

## eventsMixin

> 事件方法的初始化` $on`、`$off`、`$once` 、`$emit`

```js
export function initEvents(vm: Component) {
  vm._events = Object.create(null) // 实现发布订阅模式
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners // 所有的事件
  if (listeners) {
    updateComponentListeners(vm, listeners) // 更新组件的事件
  }
}

let target: any

function add(event, fn) {
  target.$on(event, fn)
}

function remove(event, fn) {
  target.$off(event, fn)
}

function createOnceHandler(event, fn) {
  const _target = target
  return function onceHandler() {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}

export function updateComponentListeners(vm: Component, listeners: Object, oldListeners: ?Object) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}

export function eventsMixin(Vue: Class<Component>) {
  const hookRE = /^hook:/
  // 监听事件，_events 添加监听方法，原理是发布订阅
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    // 如果是数组的话，循环监听事件
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      // vm._events.change = [fn,fn,fn]
      ;(vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  // 原理简单，重写监听方法，当执行的时候先取消监听方法，接着使用apply执行用户的方法
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on() {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  // 将方法在 _events 中删除 event 中的方法，
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    // 是数组则循环找到相应的方法删除
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    // 找不到 _events，则返回实例
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }

    // 不传fn则把所有的方法删除
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      // 找到相应的fn，然后删除对应的方法
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== "production") {
      const lowerCaseEvent = event.toLowerCase()
      // 严格限制 event 为大写，因为这可能会涉及到 v-on 监听属性
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
            `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
            `Note that HTML attributes are case-insensitive and you cannot use ` +
            `v-on to listen to camelCase events when using in-DOM templates. ` +
            `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event] // vm._events.change = []
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        // 函数执行
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
```



## lifecycleMixin

> 在这个方法主要是挂载了  `_update`用于更新组件操作，`$forceUpdate`用于强制更新组件、`$destroy`用于销毁组件

注意 `$nextTick` 、`$mount` 也是关于生命周期的全局函数

`$mount`  在 initMixin中已经挂载完毕了，可以在 initMiXin详细介绍中了解。

`$nextTick` 在renderMixin中挂载，在下面可以查看。

```js
// 生命周期混合
export function lifecycleMixin(Vue: Class<Component>) {
  // 组件更新方法，用于内部使用
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this;
    // 以前的dom元素
    const prevEl = vm.$el;
    // 以前的虚拟节点
    const prevVnode = vm._vnode;
    // 将vm设置为活跃组件，存在全局变量，返回一个闭包，设置上一个组件变回全局组件，应用于slot
    const restoreActiveInstance = setActiveInstance(vm);
    // 新的虚拟节点
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // 如果不存在 prevVnode，那就直接渲染即可，因为 patch算法 判断有没有传旧节点进来。
    // patch：core/vdom/patch
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    // 重新把刚刚旧组件设置为激活的组件
    restoreActiveInstance();
    // update __vue__ reference
    // 清空 __vue__ 占用的缓存
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC「high order component高阶组件」, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  // 更新组件
  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this;
    // 拿到渲染 watcher 去将至更新
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  // 销毁组件
  Vue.prototype.$destroy = function () {
    const vm: Component = this;
    // 如果是正在销毁的话，避免重复执行
    if (vm._isBeingDestroyed) {
      return;
    }
    callHook(vm, "beforeDestroy");
    vm._isBeingDestroyed = true;
    // remove self from parent
    const parent = vm.$parent;
    // 在父组件移除子组件
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    // 如果有watch的话就会销毁所有的watch
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    let i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    // 监听data数量 --
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    // 清空真实节点
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, "destroyed");
    // turn off all instance listeners.
    // 销毁所有的事件
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

```



## renderMixin

> `$nextTick`在这里定义，还有一个最核心的 _render，将渲染函数生成虚拟dom的方法，它是提供给渲染watch中使用的，因为每一个组件都有一个渲染watch



```js
export function renderMixin(Vue: Class<Component>) {
  // install runtime convenience helpers
  // 给 Vue.prototype 挂载了大量的 helpers 方法
  installRenderHelpers(Vue.prototype);
  // 挂载nextTick方法，返回一个执行函数

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this);
  };

  // 这个方法是提供给渲染watch使用的
  // mountComponent在这个方法，在core/instance/liftcycle
  Vue.prototype._render = function (): VNode {
    const vm: Component = this;
    // render：为经过模版编译的渲染函数
    // _parentVnode 为父亲的虚拟节点
    const { render, _parentVnode } = vm.$options;
    // 处理插槽
    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        // {scopedSlots:{defalt:fn}}
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    let vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      // 这个方法调用的是，将渲染函数转换成虚拟dom节点
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, `render`);
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== "production" && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          );
        } catch (e) {
          handleError(e, vm, `renderError`);
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    // 确保虚拟节点是只有一个节点
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== "production" && Array.isArray(vnode)) {
        warn(
          "Multiple root nodes returned from render function. Render function " +
            "should return a single root node.",
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // 设置虚拟节点的父亲
    vnode.parent = _parentVnode;
    return vnode;
  };
}

```



## 小结

经过上面的方法Vue的主流程已经运行完毕了，但是漏了很多的方法，并且是很有必要的方法将会放在后面。Vue的每一个组件的初始化都需要经过上述的流程，并且通过父子的关系构成层层联系组成组件系统。



## 其他的补充

> 补充剩下没有解析到的方法



### 全局 API 的实现原理

**这些api都是挂载在 Vue 上的**，是在 core/global-api目录下定义的。initGlobalAPI(Vue)

有一篇全局文章引入



### 指令

- v-if
- v-for
- v-on
