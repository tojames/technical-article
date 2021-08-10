# 编码优化



# 1.使用Object.freeze()

```js
data中使用 Object.freeze()，原理是Vue2.0 需要通过数据劫持的方式，来观察数据，但是现在无法访问数据了，就不用继续往下面操作了，Object.freeze()只能冻结值，引用类型是无法冻结的，所以可以考虑 deepFreeze，由于是浅冻结，我们想修改属性的话，可以直接修改引用即可。

data() {
  let obj = { a: 123 };
  return {
    obj: Object.freeze(obj),
  };
},
  
那obj需要使用怎么办--克隆。
因为在javascript中, 对象冻结后, 没有办法再解冻, 只能通过克隆一个具有相同属性的新对象, 通过修改新对象的属性来达到目的。
```

```
1.不要将所有的数据都放在data中，data中的数据都会增加getter和setter，会收集对应的 watcher
2. vue 在 v-for 时给每项元素绑定事件需要用事件代理
3. SPA 页面采用keep-alive缓存组件
4.拆分组件( 提高复用性、增加代码的可维护性,减少不必要的渲染 )
5.v-if 当值为false时内部指令不会执行,具有阻断功能，很多情况下使用v-if替代v-show 
6. key 保证唯一性 ( 默认 vue 会采用就地复用策略 )
7.Object.freeze 冻结数据
8.合理使用路由懒加载、异步组件
9.尽量采用runtime运行时版本
10.数据持久化的问题 (防抖、节流)

2、加载性能优化
第三方模块按需导入 ( babel-plugin-component )
滚动到可视区域动态加载 ( https://tangbc.github.io/vue-virtual-scroll-list ) 图片懒加载 (https://github.com/hilongjw/vue-lazyload.git)

3、用户体验
app-skeleton 骨架屏
app-shell app壳
pwa serviceworker

4、SEO优化
预渲染插件 prerender-spa-plugin
服务端渲染 ssr

5、打包优化:
	使用 cdn 的方式加载第三方模块 
	多线程打包 happypack
  splitChunks 抽离公共文件
  sourceMap 生成
  
6、缓存，压缩 
	客户端缓存、服务端缓存
  服务端 gzip 压缩
```

