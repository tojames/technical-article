# Vue 和 React 比较



## 介绍

### Vue

`Vue` 是一个用于创建用户界面的开源MVVM前端JavaScript框架，也是一个创建单页应用的Web应用框架。它由尤雨溪创建，由他和其他活跃的核心团队成员维护，于2014年2月发布Vue1.0。

### React

`React` 是前端JavaScript工具库， 用于基于UI 组件构建用户界面，也是一个创建单页应用的Web应用框架。 它由Meta「FaceBook」和一个由个人开发者和公司组成的社群维护， 于2013 年 5 月发布React1.0。 

要知道2013年前端领域开发非常依赖`Jquery`，开发工作中经常操作DOM，不论页面变化，还是数据变化都依赖于开发者操作DOM去实现，导致开发效率低、代码臃肿且容易出Bug，有了 `Vue` 和 `React` 后前端领域朝着工程化、组件化、模块化发展，开发者只需把精力放在代码逻辑中，再也不用费太多精力去操作DOM，效率大大提高，当然也提高前端开发者入门水平。



## 相似之处

- 它们都是 `JavaScript`的UI框架，尽管React说它是JavaScript工具库，可是呈现的形态出来就是UI框架。
- Reat 与 Vue 只有框架的骨架，其他的功能如路由、状态管理等是框架分离的库，其他的库可以在以下了解，[awesomeVue](https://awesome-vue.js.org/)、[awesomeReact](https://github.com/enaqx/awesome-react)。

### Virtual DOM

产生的背景是，操作真是DOM大多数情况下都是很昂贵的

#### 介绍

Virtual DOM是一个映射真实DOM的JavaScript对象，如果需要改变任何元素的状态，那么是先在Virtual DOM上进行改变，而不是直接改变真实的DOM。当有变化产生时，一个新的Virtual DOM对象会被创建并计算新旧Virtual DOM之间的差别。之后这些差别会应用在真实的DOM上。

例子如下，我们可以看看下面这个列表在HTML中的代码是如何写的：

```html
<ul class="list">
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

而在JavaScript中，我们可以用对象简单地创造一个针对上面例子的映射：

```js
{
    type: 'ul', 
    props: {'class': 'list'}, 
    children: [
        { type: 'li', props: {}, children: ['item 1'] },
        { type: 'li', props: {}, children: ['item 2'] }
    ]
}

{
  tag: 'div',
  data: { id: 'container' },
  key: undefined,
  children: [
    {
      tag: 'p',
      data: {},
      key: 'test',
      children: [Array],
      text: undefined
    },
    {
      tag: undefined,
      data: undefined,
      key: undefined,
      children: undefined,
      text: '李白'
    }
  ],
  text: undefined
}
```

真实的Virtual DOM会比上面的例子更复杂，但它本质上是一个嵌套着数组的原生对象。

当新一项被加进去这个JavaScript对象时，一个函数会计算新旧Virtual DOM之间的差异并反应在真实的DOM上。计算差异的算法是高性能框架的秘密所在，`React` 和 `Vue` 在实现上有点不同。

`Vue` 会跟踪每一个组件的依赖关系，每一个组件都有一个组件Watch，通过Watch在整个子组件树中找出需要重新渲染的组件，颗粒度控制在组件级别。

`React`  每当应用的状态被改变时，全部子组件都会重新渲染。

类组件：通过`shouldComponentUpdate `这个生命周期方法来进行控制。

函数组件：通过memo、useMemo、useCallBack 用于避免React Hooks中的重复渲染，三者需要组合并结合场景使用。

小结：如果你的应用中，交互复杂，需要处理大量的UI变化，那么使用Virtual DOM是一个好主意。如果你更新元素并不频繁，那么Virtual DOM并不一定适用，性能很可能还不如直接操控DOM。

#### 实现原理

Vue 

React

### 构建工具

Vue 主要使用 Vue-cli

React 主要使用 CRA「Create React App」

Vite 同时支持 React 和 Vue

### Chrome 开发工具

Vue 和 React 都有开发者工具，这样的话可以更加方便的在开发的时候调式。

### 全家桶

Vue 的全家桶包括，Vuex、Vue-Router、Vue-cli，这些都属于Vue开发团队维护的，属于官方库，所以使用体验都非常棒！Vue 让你选择这些库可以少走很多弯路

React的全家桶特别多，没有几个是官方大部分由社区成员开发「React Redux 除外」，所以就会出现百花齐放的结果，开发者都需要按照自己的需求去选择合适的库，以状态管理为例，Redux、React-Redux、Dva、Redux-saga 等等。

### 跨端

Vue 中实现跨端，早期有mapVue等，但是这些没人继续迭代下去都很快就淘汰了，现在最主流是 uniapp，它可以编译出 Android、IOS、H5、小程序。

React 中实现跨端，有 Trao、React Native。Trao可以理解为和uniapp类似跨很多端。React Native 专注于Android、IOS，它是和 Flutter比较的。

### 性能

Vue 通过劫持数据、或者代理所有的数据，当数据量大的时候会出现性能问题，Vue2.0 是全部数据进行递归响应式的，Vue3.0 proxy 是有懒响应式，官方也说Vue3.0性能好一些！

React 则不会有这些困扰



### 服务端渲染

Vue 实现服务端渲染使用的是 [nuxtjs](https://github.com/enaqx/awesome-react)、React 使用的是 [nextjs](https://www.nextjs.cn/)



## 不同点

### 组件

组件思想是一样的，页面通过各种不同组件组合成的，但是组件的使用方式确实不一样的，React 的组件一般拆得更细，是因为React 的灵活性以前拓展性的原因 「高阶组件、Render.props 的应用」。

- Vue 2.0、3.0 optionApi 还是 compositionApi 都是SFC 组件编写方式
  - Vue template会更像传统的HTML写法，style 中写css ，script中写Vue中的代码
- React 使用的是 JSX 编写方式
  - React 中的 JSX 也像传统的HTML写法，但是它的 JavaScript 经常内嵌在HTML里面的，这种称为 JSX，这样的代码会更加的灵活，更加考验开发者的水平。	
  - 更加灵活的 JSX 在大型项目来说特别重要，所以这是 React 适合大型项目的原因。

### 更新状态

Vue2.0 3.0 认为数据是可变的「mutation」，数据通过 Object.defineProperty 劫持，或者通过 Proxy 进行代理，这样当数据发生了变化将会触发响应式系统，发生变化的组件通过diff算法，找出需要渲染的HTML操作DOM 进行渲染。

这样就会导致一个问题，Vue 在大型项目中是绑定了大量的数据，占用的大量的内存，这是Vue为什么只适合中小型项目原因之一。

React 认为数据是不可变的，它们推崇的是函数式编程「以函数组件为例」，状态的更新就需要重新重新执行函数返回 JSX，再去生成虚拟dom，再去通过diff算法，找出需要渲染的HTML操作DOM 进行渲染。







推荐：

http://blog.itpub.net/69981092/viewspace-2710742/