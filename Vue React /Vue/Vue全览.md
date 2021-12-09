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

>

## 生命周期的实例方法

$forceUpdate

$destory

$nextTick

$mount

## 全局 API 的实现原理

挂载在 Vue 上的 api

Vue.extend

Vue.nextTick === $nextTick

Veu.set === $set

Vue.delete===$delete

Vue.directive 重点

Vue.filter

Vue.component

Vue.use

Vue.mixin

Vue.compile

Vue.version

## 指令

v-if

v-for

v-on
