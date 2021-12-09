#initMixin(Vue)

>  initMixin 是初始化组件、各种参数、以及挂载参数的作用



我们看见了 `_init` 挂载在Vue的原型上面，然后什么事情也没有了，它是在哪里执行的呢？

它是在我们new Vue的时候调用的。

```js
function Vue(options) {
  // 初始化生命周期
  this._init(options);
}
```

现在继续看 `_init` 方法到底做了什么，合并属性赋值到`$options`，并且看见执行了很多的方法。

```js
export function initMixin(Vue: Class<Component>) {
  // 向Vue原型挂载 私有方法 _init
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this;
    // a uid
    vm._uid = uid++;

    // a flag to avoid this being observed
    // 如果有_isVue的属性的话就不监听
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 合并参数
      initInternalComponent(vm, options); // _ renderChildren
    } else {
      // 合并属性
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      // 代理vm，里面的逻辑好像不太理解这个操作，最后面不支持 new Proxy 还是  vm._renderProxy = vm
      initProxy(vm);
    } else {
      // 如果是生产环境 则将当前实例赋值，
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm); // 初始化各种属性
    initEvents(vm); // 初始话事件，并且监听父组件的事件，当子组件传值给父组件的时候
    initRender(vm); // $slots  $attrs $listeners 创建虚拟节点
    callHook(vm, "beforeCreate"); // 调用beforeCreate 钩子函数
    initInjections(vm); // 初始化祖父节点注入数据，实现可以监听
    initState(vm); // 初始化状态
    initProvide(vm); // 在当前组件提供数据到全局上
    callHook(vm, "created"); // 调用created 钩子函数

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== "production" && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(`vue ${vm._name} init`, startTag, endTag);
    }

    // 如果存在el元素则开始挂载元素
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
      // core/instance/lifecycle
      // 其实是调用的 mountComponent
    }
  };
}
```



## 初始化 initLifecycle

> 主要负责初始化组件上的各种属性，`$parent`、`$root` 、`$children`、`$refs`、`_watcher`等等还有很多，后面的代码会发现很多地方用到这些属性，Vue它会给每一个组件都初始化带上这些属性。
>



```js

export function initLifecycle(vm: Component) {
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent; //  $parent
  if (parent && !options.abstract) {
    // 排除抽象组件, 查找父亲不是抽象组件，抽象组件不列入父子关系 keep-alive
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm); // 让父实例记住当前组件实例
  }

  // 增加$parent属性 指向父实例
  vm.$parent = parent;
  // 根实例
  vm.$root = parent ? parent.$root : vm;
  // 子组件
  vm.$children = [];
  // 记录dom
  vm.$refs = {};
  // 初始化用来存放 watch 的变量
  vm._watcher = null;
  // 初始化记录组件是否活动，	表示keep-alive中组件状态
  vm._inactive = null;
  // 表示keep-alive中组件状态的属性
  vm._directInactive = false;
  //	当前实例是否完成挂载(对应生命周期图示中的mounted)。
  vm._isMounted = false;
  // 当前实例是否已经被销毁(对应生命周期图示中的destroyed)。
  vm._isDestroyed = false;
  // 当前实例是否正在被销毁,还没有销毁完成(介于生命周期图示中deforeDestroy和destroyed之间)。
  vm._isBeingDestroyed = false;
}
```



## 初始化 initEvents

> 初始化事件，初始化 _events 用于实现 `$once`、`$on`、`$emit`、`$off`存放函数的，基于的是发布订阅模式



```js

export function initEvents(vm: Component) {
  // 实现发布订阅模式
  vm._events = Object.create(null); 
  // 这个参数的作用的是
  // 当我们使用 this.$emit('update:xxx', yyy) 就可以触发方法了
  // 不需要传递回调函数，改变参数
  vm._hasHookEvent = false;
  // init parent attached events
  const listeners = vm.$options._parentListeners; // 所有的事件
  if (listeners) {
    updateComponentListeners(vm, listeners); // 更新组件的事件
  }
}

```



##  初始化 initRender

> 初始化 `$slots`、render创建虚拟节点的方法、 `$attrs`、`$listeners`， `$attrs`、`$listeners`是用与组件传值使用的，`$attrs` ：是props没有接收的值，可以在这里额外的接收，`$listeners` 是记录回调函数的对象。
>
> `$slots` 后续会补充文件解析的，



```js
export function initRender(vm: Component) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees，静态节点
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree 获取占位符节点
  const renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // 私有创建元素的方法
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // normalization is always applied for the public version, used in
  // user-written render functions.
  // 暴露出去给用户使用，true可以检测到用户输入的复杂数据
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data; // 占位符节点上的数据

  /* istanbul ignore else */
  // $attrs $listeners 暴露到组件使用
  // $attrs 使用
	defineReactive(
	      vm,
	      "$attrs",
	      (parentData && parentData.attrs) || emptyObject,
	      null,
	      true
	    );
	defineReactive(
	  vm,
	  "$listeners",
	  options._parentListeners || emptyObject,
	  null,
	  true
	);
}

```



## 初始化 initInjections 

将一直往祖先组件找 `_provided`对象上的数据，并将数据监听到当前组件，使当前组件可以使用。

```js
export function initInjections(vm: Component) {
  // inject:[a,b,c]
  // 不停的向上查找 inject的属性
  const result = resolveInject(vm.$options.inject, vm); 
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach((key) => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== "production") {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
              `overwritten whenever the provided component re-renders. ` +
              `injection being mutated: "${key}"`,
            vm
          );
        });
      } else {
        // 把父亲的provide的数据 定义在当前组件的身上
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}
```



## 初始化 State

> initState方法会初始化 initProps、initMethods、initData、initComputed、initWatch，并且按照顺序去处理。



```js
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props); // 初始化props
  if (opts.methods) initMethods(vm, opts.methods); // 初始化methods
  if (opts.data) {
    initData(vm); // 初始化data
  } else {
    observe((vm._data = {}), true /* asRootData */); // 如果data为空 创建一个观察对象
  }
  if (opts.computed) initComputed(vm, opts.computed); // 初始化计算属性
  if (opts.watch && opts.watch !== nativeWatch) {
    // 初始化watch
    initWatch(vm, opts.watch); // 初始化watch
  }
}
```



## 初始化initProvide

> 在当前组件将数据提供到全局上，存储在 `_provided`对象上

```js
export function initProvide(vm: Component) {
  const provide = vm.$options.provide;
  if (provide) {
    // 将用户定义的provide 挂载到_provided
    vm._provided = typeof provide === "function" ? provide.call(vm) : provide;
  }
}
```



## ` vm.$mount(vm.$options.el)` 

> 其实调用的是 mountComponent,这个方法是将元素挂载到页面上
>
> 需要注意的是 vm.$mount 是有两个不同的版本的，一个是运行时版本，一个是完整版本。
>
> vm._render() 返回虚拟dom



运行时版本，这个版本一般用在开发上，和用在生产上。

能用在开发上的原因是，我们在webapck配置了 `vue-loader`或者`vue-template-compiler`,它会将template转换成render函数直接渲染，它们的底层逻辑就是complier的代码，也就是模版编译，最后加起来就是完整版了。

生产上能用运行时版本的原因是因为，在我们打包上线的时候会将所有的template转换为render函数，这样线上渲染的速度得到加快，而且Vue的文件的大小也会相应的减少。

### 运行时版本

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  // 如果发现没有render函数，那就是生成render函数的时候出问题
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== "production") {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
        vm.$options.el ||
        el
      ) {
        warn(
          "You are using the runtime-only build of Vue where the template " +
            "compiler is not available. Either pre-compile the templates into " +
            "render functions, or use the compiler-included build.",
          vm
        );
      } else {
        warn(
          "Failed to mount component: template or render function not defined.",
          vm
        );
      }
    }
  }
  // 可以准备挂载了调用 beforeMount 钩子函数
  callHook(vm, "beforeMount");

  let updateComponent;
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };


  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 这是渲染watch，当组件发生修改的时候，可以及时通过执行 vm._update(vm._render(), hydrating);
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    // 已经挂载完毕触发 mounted 钩子函数
    callHook(vm, "mounted");
  }
  return vm;
}

// __patch__ 是diff算法把真实的dom算出来，这里可以看我的diff文章
 Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this;
    const prevEl = vm.$el;
    const prevVnode = vm._vnode;
    const restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };
```



### 完整版

> 这是另外一个版本的 `$mount`,它这里涉及到模版编译，后面有相应的文章输出

```js
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  // 解析 template/el and 转换为 render函数
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

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

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};
```

