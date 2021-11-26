// 方便我们使用this.a这种方式取值
export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key];
    },
    set(newValue) {
      vm[data][key] = newValue;
    },
  });
}

export function definePropety(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false, // 不可枚举，避免被监听
    configurable: false, // 不可配置
    value: value, // 将this赋值上去
  });
}
