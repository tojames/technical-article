#initMixin(Vue)

我们知道 initMixin 起到初始化组件，各种参数，挂载参数的作用。



初始化 initLifecycle

主要负责初始化各种属性

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


初始化事件
```js

export function initEvents(vm: Component) {
  vm._events = Object.create(null); // 实现发布订阅模式
  // 这个参数的作用的是
  // 当我们使用 this.$emit('update:xxx', yyy) 就可以触发方法了，不需要传递回调函数，改变参数
  vm._hasHookEvent = false;
  // init parent attached events
  const listeners = vm.$options._parentListeners; // 所有的事件
  if (listeners) {
    updateComponentListeners(vm, listeners); // 更新组件的事件
  }
}

```

initRender 初始化 $slots，创建虚拟节点，初始化 $attrs、$listeners
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
  if (process.env.NODE_ENV !== "production") {
    defineReactive( vm,"$attrs", (parentData && parentData.attrs) || emptyObject, () => { !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm); }, true );
    defineReactive( vm,"$listeners",options._parentListeners || emptyObject,() => { !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm); },true  );
  } else {
    defineReactive(vm, "$attrs",(parentData && parentData.attrs) || emptyObject, null,true );
    defineReactive(  vm, "$listeners", options._parentListeners || emptyObject, null,  true);
  }
}

```


initInjections 将父级祖父一直往上找_provided对象上的数据，并将数据监听到当前组件，使其可以使用。
```js

export function initInjections(vm: Component) {
  // inject:[a,b,c]
  const result = resolveInject(vm.$options.inject, vm); // 不停的向上查找 inject的属性
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


initProvide 当前组件将数据提供到全局上，存储在_provided对象上
```js
export function initProvide(vm: Component) {
  const provide = vm.$options.provide;
  if (provide) {
    // 将用户定义的provide 挂载到_provided
    vm._provided = typeof provide === "function" ? provide.call(vm) : provide;
  }
}
```


 vm.$mount(vm.$options.el); 其实调用的是 mountComponent，vm._render()核心返回虚拟dom
```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    // 判断Vue的版本是runtime的时候，需要使用v-loader「会将模版转换成render函数」 或者使用完整版处理
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
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      // 渲染得到虚拟节点
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      // 更新节点
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
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



你会发现这里还有另外一个$mount，为什么会这样呢？ 因为下面这段代码属于是一个完整版的Vue，runtime版是没有将template转换为render函数，后面的模版编译我有相应的文章输出
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
