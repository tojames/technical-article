export default {
  name: "RouterView",
  functional: true, // 函数式组件，性能高，不用创建实例 === react 组件
  render(h, context) {
    // // 获取当前对应要渲染的记录
    let { parent, data } = context;
    let route = parent.$route; // this.current
    let depth = 0;
    data.routerView = true;

    // App.vue 默认调用render函数，父亲没有routerView属性，说明式第一层，并且设置routerView=true、
    while (parent) {
      // router-view 的父标签
      // $vnode 代表的是占位符vnode,组件的标签名的虚拟节点
      // _vnode组件内部渲染的虚拟节点
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      parent = parent.$parent; // 找父亲
    }

    // 第一层router-view 渲染第一个record 第二个router-view 渲染第二个
    // console.log(route, "route1111");
    let record = route.matched[depth];
    if (!record) {
      return h(); // 空的虚拟节点  注释节点
    }
    return h(record.component, data);
  },
};
