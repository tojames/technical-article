class History {
  constructor(router) {
    this.router = router;

    // 当外面创建完路由后，现有一个默认值路径和匹配到的记录做成一个映射表
    // 比如 到匹配到了 /home/b 那home放在第一个router-view  /b 放在第二个router-voew
    // 就是一个路径匹配到了两个组件，都是需要去渲染的
    // 默认创建history时，路径应该是/，匹配到记录是[]
    this.current = createRoute(null, {
      path: "/",
    });

    // console.log(this.current, "this.current");
    this.router.match();
  }

  // 记录回调函数
  listen(cb) {
    this.cb = cb;
  }
  transitionTo(location, onComplete) {
    // 根据路径加载不同的组件
    // console.log(location, "location")
    // 这个route 就是当前最新的匹配结果
    let route = this.router.match(location); // {"/",matched:[]}

    if (location == this.current.path && route.matched.length == this.current.matched.length) return; // 防止重复跳转

    // 在更新之前先调用注册好导航守卫
    let queue = [].concat(this.router.beforeHooks, this.router.afterHooks);

    const iterator = (hook, next) => {
      hook(this.current, route, () => {
        next();
      });
    };

    // runQueue的作用 经常被问
    runQueue(queue, iterator, () => {
      // 更新路由
      this.updateRoute(route);
      // console.log(onComplete, "onComplete")
      onComplete && onComplete();
    });
  }
  updateRoute(route) {
    this.current = route; // 每次切换路由时都会更改current属性
    // 试图重新渲染几个要求？
    // 1.模版中要用
    // 2.current 得是响应式得
    this.cb && this.cb(route);
  }
}
export { History, createRoute };

function createRoute(record, location) {
  // console.log(record, "record")
  let res = [];
  if (record) {
    while (record) {
      res.unshift(record);
      // 找到爸爸，找不到就会undefined
      record = record.parent;
    }
  }
  return {
    ...location,
    matched: res,
  };
}

// 异步迭代
// 可以实现中间件的逻辑，串行执行
function runQueue(queue, iterator, cb) {
  function step(index) {
    if (index >= queue.length) return cb();
    let hook = queue[index];
    // 先执行第一个，将第二个hook执行的逻辑当作参数传入
    iterator(hook, () => step(index + 1));
  }
  step(0);
}
