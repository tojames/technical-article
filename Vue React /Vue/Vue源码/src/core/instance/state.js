/* @flow */
import config from "../config"; // 一大堆的配置信息
import Watcher from "../observer/watcher"; // 监听器
import Dep, { pushTarget, popTarget } from "../observer/dep"; // 收集依赖
import { isUpdatingChildComponent } from "./lifecycle"; // 更新子组件状态，是由生命周期组件渲染来控制prop值的传递

import {
  set, // 设置属性触发的方法
  del, // 删除属性触发的方法
  observe, // 观察数据
  defineReactive, // 监听数据核心方法
  toggleObserving, // 切换监听
} from "../observer/index";

/**
 *  bind：对bind进行兼容处理
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/**
 *  Strict object type check. Only returns true
 *  or plain JavaScript objects.
 *  _toString：const _toString = Object.prototype.toString
 * isPlainObject：
 * export function isPlainObject (obj: any): boolean {
 *   return _toString.call(obj) === '[object Object]'
 * }
 *
 */

/**
 * Check if a string starts with $ or _  检查字符串开头第一个字符是否是 $ or _
 *
 * export function isReserved (str: string): boolean {
 *  const c = (str + '').charCodeAt(0)
 *  return c === 0x24 || c === 0x5F
 * }
 */

/**
 *  hyphenate：
 * Hyphenate a camelCase string.
 * const hyphenateRE = /\B([A-Z])/g
 * export const hyphenate = cached((str: string): string => {
 *   return str.replace(hyphenateRE, '-$1').toLowerCase()
 * })
 *
 */

import {
  warn, // 封装打印在控制台的显示，非生产环境使用
  bind, // 看注释
  noop, // 一个空的函数 export function noop (a?: any, b?: any, c?: any) {}
  hasOwn, // Check whether an object has the property
  hyphenate, // eg 将getName 变成 get-name 看注释
  isReserved, // 看注释
  handleError, // 处理错误
  nativeWatch, // 为了兼容火狐 Firefox has a "watch" function on Object.prototype...
  validateProp, // 返回有效prop
  isPlainObject, // 看注释
  isServerRendering, // 判断环境是 是 ssr 还是 server 是server 返回 server，否则返回false
  isReservedAttribute, // 判断是否是保留属性
} from "../util/index";

// 共享的基础配置信息，用于Object.defineProperty
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

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

function initProps(vm: Component, propsOptions: Object) {
  // propsOptions 校验属性
  const propsData = vm.$options.propsData || {}; // 获取用户的数据
  const props = (vm._props = {}); // 组件的属性都放到_props中  _data;
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    // 如果时根元素，属性需要定义成响应式的
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    // 用户用户的 props:{}
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value); // 定义到_props中
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key); // 将_props代理到实例上
    }
  }
  toggleObserving(true);
}

function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  // 判断如果不是对象，警告
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      // 判断 methods 是否已经存在data中的key，存在，则警告
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    // 判断 props 是否已经存在data中的key，存在，则警告
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      // _ 或者 $ 开头的key是无法被代理的，因为他们都是私有的属性，比如$store、$router
      // 这行代码的作用是为了把监听的数据代理到了 data 上面，方便我们使用this方法
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

export function getData(data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, `data()`);
    return {};
  } finally {
    popTarget();
  }
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher( // 创建watcher
        vm,
        getter || noop, // 用户定义的函数,执行时会让，属性收集计算属性watcher
        noop,
        computedWatcherOptions // {lazy:true}
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      // 如果 data 中已经有了 key 则警告
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      }
      // 如果 prop 中已经有了 key 则警告
      else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
      // 如果 computed 和 method 重名会怎么样？ 答案是method会被替换，因为computed声明在method后面
    }
  }
}

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering(); //
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  debugger;
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        // 如果值是脏的 进行求值操作
        watcher.evaluate(); // this.firstname lastname
      }
      if (Dep.target) {
        // 让计算属性所依赖的属性 收集渲染watcher
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm: Component, methods: Object) {
  const props = vm.$options.props;
  for (const key in methods) {
    if (process.env.NODE_ENV !== "production") {
      if (typeof methods[key] !== "function") {
        warn(
          `Method "${key}" has type "${typeof methods[
            key
          ]}" in the component definition. ` +
            `Did you reference the function correctly?`,
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(`Method "${key}" has already been defined as a prop.`, vm);
      }
      if (key in vm && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
            `Avoid defining component methods that start with _ or $.`
        );
      }
    }
    // 这里的bind 要认真看，他调用的是项目里面的bind， 底层是这样的Function.prototype.bind(context,prams)，注意区分。
    vm[key] =
      typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
  }
}

// 初始化Watch
// watch 为用户书写watch
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        // 创建watch，并且把回调函数传递进去
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

// 创建watch
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 如果传进来是一个对象
  if (isPlainObject(handler)) {
    options = handler; // options接受到了
    handler = handler.handler;
  }
  // 如果是字符串 就是可以让我们写“a.b.c”这样的格式
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  // 去走watch方法
  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  const propsDef = {};
  propsDef.get = function () {
    return this._props;
  };
  // 警告data被替换
  if (process.env.NODE_ENV !== "production") {
    dataDef.set = function () {
      warn(
        "Avoid replacing instance root $data. " +
          "Use nested data properties instead.",
        this
      );
    };
    // 警告属性是只读的
    propsDef.set = function () {
      warn(`$props is readonly.`, this);
    };
  }
  Object.defineProperty(Vue.prototype, "$data", dataDef);
  Object.defineProperty(Vue.prototype, "$props", propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this;
    // 这里还留下了一个 用户可以通过 vm.$watch("xx",()....)的调用方法
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true;
    // 在这里才真正去 watcher类里面进行监听
    const watcher = new Watcher(vm, expOrFn, cb, options); // 创建watcher，数据更新调用cb
    // 如果是immediate为true的话，立即执行传进来的回调函数
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(
          error,
          vm,
          `callback for immediate watcher "${watcher.expression}"`
        );
      }
    }
    // 返回一个闭包去关闭定时器，一般是Vue内部销毁watch时调用的
    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
