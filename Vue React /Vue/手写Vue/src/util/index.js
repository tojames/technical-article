// 方便我们使用this.a这种方式取值
export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newValue) {
      vm[data][key] = newValue
    },
  })
}

export function definePropety(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false, // 不可枚举，避免被监听
    configurable: false, // 不可配置
    value: value, // 将this赋值上去
  })
}

/**
 *
 * @param {*} data  当前数据是不是对象
 */
export function isObject(data) {
  return typeof data === "object" && data !== null
}
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  })
}

// 生命周期合并策略，使用数组返回方法
const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
]

let strats = {}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}
  // 遍历父亲
  for (let key in parent) {
    mergeField(key)
  }
  // 遍历儿子，这里可能会有重复
  for (let key in child) {
    //  如果已经合并过了就不需要再次合并了
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // 默认的合并策略 但是有些属性 需要有特殊的合并方式 生命周期的合并
  function mergeField(key) {
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]))
    }
    if (typeof parent[key] === "object" && typeof child[key] === "object") {
      // 出现重复就会覆盖
      options[key] = {
        ...parent[key],
        ...child[key],
      }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      // 父亲为null或者普通值，直接使用child[key]即可
      options[key] = child[key]
    }
  }
  return options
}
