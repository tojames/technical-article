class Dep {
  constructor() {
    this.subs = []; // subs [watcher]
  }
  depend() {
    this.subs.push(Dep.target);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}
Dep.target = null;
observer(obj); // 响应式属性劫持

// 依赖收集  所有属性都会增加一个dep属性，
// 当渲染的时候取值了 ，这个dep属性 就会将渲染的watcher收集起来
// 数据更新 会让watcher重新执行

// 观察者模式

// 渲染组件时 会创建watcher
class Watcher {
  constructor(render) {
    this.get();
  }
  get() {
    Dep.target = this;
    render(); // 执行render
    Dep.target = null;
  }
  update() {
    this.get();
  }
}
const render = () => {
  console.log(obj.name); // obj.name => get方法
};
new Watcher(render);

function observer(value) {
  // proxy reflect
  if (typeof value === "object" && typeof value !== null)
    for (let key in value) {
      defineReactive(value, key, value[key]);
    }
}
function defineReactive(obj, key, value) {
  let dep = new Dep();
  observer(value);
  Object.defineProperty(obj, key, {
    get() {
      // 收集对应的key 在哪个方法（组件）中被使用
      if (Dep.target) {
        // watcher
        dep.depend(); // 这里会建立 dep 和watcher的关系
      }
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        observer(newValue);
        value = newValue; // 让key对应的方法（组件重新渲染）重新执行
        dep.notify();
      }
    },
  });
}
obj.name = "jw";

// 一个属性一个dep
// 一个dep 对应多个watcher
// 一个watcher 对应多个dep
// dep 和 watcher是多对多的关系
