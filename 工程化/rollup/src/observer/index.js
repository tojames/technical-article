import { arrayMethods } from "./array";
import { definePropety } from "../util";

class Observe {
  constructor(value) {
    // console.log(value, "value");
    // 判断一个对象是否被观察过的标识是 __ob__
    definePropety(value, "__ob__", this);

    // 将对象的属性全部便利一遍
    if (Array.isArray(value)) {
      // splice unshift shift sort push reverse pop
      // 将数组对象的__proto__替换成我们处理过的
      value.__proto__ = arrayMethods;
      // 如果数组里面还包裹对象，那么还要观察数组里面的对象。
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  observeArray(value) {
    value.forEach((item) => {
      observe(item);
    });
  }

  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      defineReactive(data, key, data[key]); // Vue.util.definereactive
    }
  }
}

// Object.defineProperty其实也是可以对数组里面的每一项进行监听，
// 但是数组的数据项太大了，只能考虑使用重写数组的7个方法的方式去处理
function defineReactive(data, key, value) {
  // 如果 value 还是对象
  observe(value);

  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");
      return value;
    },
    set(newValue) {
      console.log("设置值");
      if (newValue === value) return;
      // 对于新的值重新监听
      observe(newValue);
      value = newValue;
    },
  });
}

export function observe(data) {
  // console.log(data, "data");

  // 如果已经被监听了，就返回
  if (data.__ob__) {
    return data;
  }
  // 判断对象才能监听
  if (typeof data !== "object" || data === null) {
    return data;
  }
  return new Observe(data);
}
