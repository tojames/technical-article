/* @flow */
// VNode表示一个真实的dom元素，所有的真实的DOM节点都是通过vnode创建并插入到页面中
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag; // 节点名称
    this.data = data; // 节点上的数据 attrs/stkye/id
    this.children = children; // 子节点的列表
    this.text = text; // 文本节点的文本
    this.elm = elm;
    this.ns = undefined;
    this.context = context; // 当前组件实例
    this.fnContext = undefined; // 函数式组件实例
    this.fnOptions = undefined; // 函数式组件参数 props tag children
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions; // 组件节点参数 props tag children
    this.componentInstance = undefined; // 当前组件实例
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false; // 注释节点
    this.isCloned = false; // 克隆节点
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance;
  }
}

// 创建一个注释节点
export const createEmptyVNode = (text: string = "") => {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};
// 创建一个文本节点
export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
// 克隆节点的作用在于静态节点和插槽节点
// 当组件的某个状态发生了变化后，当前组件会通过虚拟dom 重新渲染，静态节点是不会变化的，除了首次渲染，
// 因此使用克隆节点渲染，而不用每次都重新创建，直接使用克隆节点渲染即可
// 只需要将vnode节点的属性赋值给克隆节点即可
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}
