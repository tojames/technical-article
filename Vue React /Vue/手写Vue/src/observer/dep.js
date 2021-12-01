let id = 0;
// 多对多的关系，一个属性有一个dep用来收集watcher
// dep 可以存多个watch 一个属性可以有渲染watch $vm.watch ...
// 一个watch 可以对应多个dep，一个页面有很多属性，就会对应多个dep
// class Dep {
//   constructor() {
//     this.id = id++;
//     this.subs = [];
//   }
//   addSub(watcher) {
//     this.subs.push(watcher); // 观察者模式
//   }
//   depend() {
//     Dep.target.addDep(this);
//   }
//   notify() {
//     this.subs.forEach((watcher) => watcher.update());
//   }
// }

class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    this.subs.push(Dep.target);
    console.log(this.subs, "this.depend");
  }
  // 更新所有的watch
  notify() {
    console.log(this.subs, "this.notify");
    this.subs.forEach((watcher) => watcher.update());
  }
}
let stack = [];
// 目前可以做到 将watcher保留起来 和 移除的功能
export function pushTarget(watcher) {
  Dep.target = watcher;
  // stack.push(watcher);
}
export function popTarget() {
  Dep.target = null;
  // stack.pop();
  // Dep.target = stack[stack.length - 1];
}

export default Dep;
