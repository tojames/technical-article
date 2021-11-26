import { observe } from ".";

let oldArrayProtoMethods = Array.prototype;

// 继承数组的方法的原型，我们可以在 arrayMethods 中重写方法
export const arrayMethods = Object.create(oldArrayProtoMethods);

let methods = ["push", "splice", "push", "sort", "unshift", "shift", "reverse"];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    console.log("监听了数组方法");
    const result = oldArrayProtoMethods[method].apply(this, args);
    let inserted,
      ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        // 这两个方法都是追加，追加的内容可能都是对象类型，应该被再次进行监听
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2); // 第一个参数是索引，第二个参数删除，第三个参数新增，这里把新增的参数拿到
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    return result;
  };
});
