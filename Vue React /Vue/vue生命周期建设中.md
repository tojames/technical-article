# Vue生命周期

> 熟练使用Vue生命周期在日常开发中将事半功倍。

<img src="images/lifecycle.png" alt="lifecycle" style="zoom:50%;" />

> 图片引自Vue官网



## 原理

1.调用 _init方法，作为入口开启生命周期，文件path：core/instance/index.js

```js

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  // 初始化生命周期
  this._init(options);
}
```

2.找到 _init 方法，文件path：core/instance/init，

beforeCreate

created

```js
删除部分源码

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this

    vm._self = vm
    initLifecycle(vm) // 初始化生命周期，把当前vm初始化属性
    initEvents(vm) // 初始化事件
    initRender(vm) // vm.$slots
    callHook(vm, 'beforeCreate') // 把组件的基本信息准备好了，调用beforeCreate这个钩子函数
    initInjections(vm) // resolve injections before data/props 提前注入一些值
    initState(vm) // 初始化state
    initProvide(vm) // resolve provide after data/props 将用户提供的 provide挂在在上面
    callHook(vm, 'created') // 调用created这个钩子函数

    // 如果存在el元素则开始挂载元素，接着找到下面的 beforeMount 和 mounted 生命周期钩子
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}


export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent //  $parent
  if (parent && !options.abstract) { // 排除抽象组件, 查找父亲不是抽象组件，抽象组件不列入父子关系 keep-alive  
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm) // 让父实例记住当前组件实例
  }

  vm.$parent = parent // 增加$parent属性 指向父实例
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```



3.找到 vm.$mount方法，开始挂载元素 文件path：

beforeMount

beforeUpdate

mounted

```js
// 在这里又发现了调用了 mountComponent
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}


path：core/instance/lifecycle

export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  // 挂载之前会先判断你的环境是什么
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    // 在这里把组件挂载上去了
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        // 在组件更新的前时候，触发beforeUpdate，
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    // 调用已经挂载组件的钩子
    callHook(vm, 'mounted')
  }
  return vm
}

```



4.当数据方式变化的时候出发dom更新才会触发

beforeUpdate

updated

```js
// override Vue.prototype._update
function updateVirtualComponent (vnode?: VNode) {
  const vm: Component = this
  const componentId = vm.$options.componentId
  if (vm._isMounted) {
    callHook(vm, 'beforeUpdate')
  }
  vm._vnode = vnode
  if (vm._isMounted && componentId) {
    // TODO: data should be filtered and without bindings
    const data = Object.assign({}, vm._data)
    updateComponentData(componentId, data, () => {
      callHook(vm, 'updated')
    })
  }
}
```



还有两个特殊的生命周期

```js
export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}

export function deactivateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
```



```
理解:
要掌握每个生命周期什么时候被调用
beforeCreate 在实例初始化之后，数据观测(data observer) 之前被调用。
created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置:数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有$el
beforeMount 在挂载开始之前被调用:相关的 render 函数首次被调用。
mounted el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。 beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。 beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。
destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件 监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。
要掌握每个生命周期内部可以做什么事
created 实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。 mounted 实例已经挂载完成，可以进行一些DOM操作
beforeUpdate 可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
updated 可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，
因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用。 destroyed 可以执行一些优化操作,清空定时器，解除绑定事件
```

