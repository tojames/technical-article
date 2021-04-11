#### react 之 三大属性（state、props、refs）

> 这三大属性都是继承于React.Component，所以直接在组件上面使用即可，按照class的规则使用即可，但是有一些不同的地方需要补充的。



#### State

[react-state](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)

> 1、不要直接修改 State，正确使用方式为 this.setState({name: '果汁'});
>
> 2、State 的更新可能是异步的，`this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态，但是你确实需要，可以如下操作，需要说明的是，异步不是那种真正的异步，只是react将改变状态的操作合并一起操作，避免频繁render造成性能浪费，合并就需要等待操作，那么开起来就像异步似的。
>
> 3、State 的更新会被合并，里面可能有很多state，但是只会将变化的进行替换，然后将state进行合并一起。
>
> 4、数据是向下流动的，通过state 传递给子组件，子组件通过props接收，虽然子组件不知道他来自哪里，显然这不重要。

```js
初始值简写方式： state = {name: '果汁'};
赋值比较有讲究
1.对象式setState 	语法：setState(stateChange,[callback])
  1.1 stateChange用于改变对象。
  1.2 是可选参数，它在更新完毕render后才被调用，所以能获取到改变后的值。
  
	eg：this.setState({ count: this.state.count + 1 },() => {
        console.log(this.state.count, "回调函数获取state更新后的值");
      }
    );
2.函数式setState 语法:setState(updater,[callback])
  2.1 updater 是一个返回stateChange对象的函数，可以接收到state，props。
  2.2 callback 同上 
  
  this.setState((state) => ({ count: state.count + 1 }));

总结 
		对象式写法是函数式写法的简写方式，采用那种方式看个人喜好。
    但是获取setState执行后的状态，都必须使用回调函数获取。
    不过也可以使用 setTimeout
		setTimeout(()=>{
		   this.setState({count:3})
		 },0)
原理setTimeout 帮助 setState “逃脱”了 React 对它的管控。只要是在 React 管控下的 setState，一定是异步的。
```



触发setState到底做了什么？思路来着一位大佬叫做 「修言」

![](../../static/images/setState-React15%E7%89%88%E6%9C%AC%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

```js
下面基于React15  关于 React 16 之后 Fiber 机制给 setState 带来的改变

// 入口函数在这里就是充当一个分发器的角色
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
// enqueueSetState 做了两件事：
// 将新的 state 放进组件的状态队列里；
// 用 enqueueUpdate 来处理将要更新的实例对象。
// 继续往下走，看看 enqueueUpdate 做了什么：

function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}

// 它引出了一个关键的对象——batchingStrategy，该对象所具备的isBatchingUpdates属性直接决定了当下是要走更新流程，还是应该排队等待；其中的batchedUpdates 方法更是能够直接发起更新流程。由此我们可以大胆推测，batchingStrategy 或许正是 React 内部专门用于管控批量更新的对象。

// 接下来，我们就一起来研究研究这个 batchingStrategy。
 
var ReactDefaultBatchingStrategy = {
  // 全局唯一的锁标识
  isBatchingUpdates: false,
 
  // 发起更新动作的方法
  batchedUpdates: function(callback, a, b, c, d, e) {
    // 缓存锁变量
    var alreadyBatchingStrategy = 
        
        ReactDefaultBatchingStrategy. isBatchingUpdates
    // 把锁“锁上”
    ReactDefaultBatchingStrategy. isBatchingUpdates = true

    if (alreadyBatchingStrategy) {
      callback(a, b, c, d, e)
    } else {
      // 启动事务，将 callback 放进事务里执行，React 中的 Transaction（事务）机制
      transaction.perform(callback, null, a, b, c, d, e)
    }
  }
}

// 这里的“锁”，是指 React 全局唯一的 isBatchingUpdates 变量，isBatchingUpdates 的初始值是 false，意味着“当前并未进行任何批量更新操作”。每当 React 调用 batchedUpdate 去执行更新动作时，会先把这个锁给“锁上”（置为 true），表明“现在正处于批量更新过程中”。当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 dirtyComponents 里排队等候下一次的批量更新，而不能随意“插队”。此处体现的“任务锁”的思想，是 React 面对大量状态仍然能够实现有序分批处理的基石。

Transaction 在 React 源码中的分布可以说非常广泛。如果你在 Debug React 项目的过程中，发现函数调用栈中出现了 initialize、perform、close、closeAll 或者 notifyAll 这样的方法名，那么很可能你当前就处于一个 Trasaction 中。

Transaction 在 React 源码中表现为一个核心类，React 官方曾经这样描述它：Transaction 是创建一个黑盒，该黑盒能够封装任何的方法。因此，那些需要在函数运行前、后运行的方法可以通过此方法封装（即使函数运行中有异常抛出，这些固定的方法仍可运行），实例化 Transaction 时只需提供相关的方法即可。

这段话初读有点拗口，这里我推荐你结合 React 源码中的一段针对 Transaction 的注释来理解它：

* <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>

说白了，Transaction 就像是一个“壳子”，它首先会将目标函数用 wrapper（一组 initialize 及 close 方法称为一个 wrapper） 封装起来，同时需要使用 Transaction 类暴露的 perform 方法去执行它。如上面的注释所示，在 anyMethod 执行之前，perform 会先执行所有 wrapper 的 initialize 方法，执行完后，再执行所有 wrapper 的 close 方法。这就是 React 中的事务机制。

“同步现象”的本质

下面结合对事务机制的理解，我们继续来看在 ReactDefaultBatchingStrategy 这个对象。ReactDefaultBatchingStrategy 其实就是一个批量更新策略事务，它的 wrapper 有两个：FLUSH_BATCHED_UPDATES 和 RESET_BATCHED_UPDATES

在callback 执行完之后，RESET_BATCHED_UPDATES 将isBatchingUpdates置为false，Flush_BATCHED_UPDATES 执行flushBatchedUpdates，然后里面会循环所有dirtyComponent，调用updateComponent来执行所有的生命周期方法 
componentWillReceiveProps -> shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate 最后实现组件的更新

到这里，相信你对 isBatchingUpdates 管控下的批量更新机制已经了然于胸。但是 setState 为何会表现同步这个问题，似乎还是没有从当前展示出来的源码里得到根本上的回答。这是因为 batchingUpdates 这个方法，不仅仅会在 setState 之后才被调用。若我们在 React 源码中全局搜索 batchingUpdates，会发现调用它的地方很多，但与更新流有关的只有这两个地方：
// ReactMount.js
_renderNewRootComponent: function( nextElement, container, shouldReuseMarkup, context ) {
  // 实例化组件
  var componentInstance = instantiateReactComponent(nextElement);
  // 初始渲染直接调用 batchedUpdates 进行同步渲染
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  );
  ...
}
  
  这段代码是在首次渲染组件时会执行的一个方法，我们看到它内部调用了一次 batchedUpdates，这是因为在组件的渲染过程中，会按照顺序调用各个生命周期函数。开发者很有可能在声明周期函数中调用 setState。因此，我们需要通过开启 batch 来确保所有的更新都能够进入 dirtyComponents 里去，进而确保初始渲染流程中所有的 setState 都是生效的。

下面代码是 React 事件系统的一部分。当我们在组件上绑定了事件之后，事件中也有可能会触发 setState。为了确保每一次 setState 都有效，React 同样会在此处手动开启批量更新。

// ReactEventListener.js
dispatchEvent: function (topLevelType, nativeEvent) {
  ...
  try {
    // 处理事件
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}
  
  话说到这里，一切都变得明朗了起来：isBatchingUpdates 这个变量，在 React 的生命周期函数以及合成事件执行前，已经被 React 悄悄修改为了 true，这时我们所做的 setState 操作自然不会立即生效。当函数执行完毕后，事务的 close 方法会再把 isBatchingUpdates 改为 false。

以开头示例中的 increment 方法为例，整个过程像是这样：


increment = () => {
  // 进来先锁上
  isBatchingUpdates = true
  console.log('increment setState前的count', this.state.count)
  this.setState({
    count: this.state.count + 1
  });
  console.log('increment setState后的count', this.state.count)
  // 执行完函数再放开
  isBatchingUpdates = false
}


很明显，在 isBatchingUpdates 的约束下，setState 只能是异步的。而当 setTimeout 从中作祟时，事情就会发生一点点变化：

reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count)
    this.setState({
      count: this.state.count - 1
    });
    console.log('reduce setState后的count', this.state.count)
  },0);
  // 执行完函数再放开
  isBatchingUpdates = false
}

会发现，咱们开头锁上的那个 isBatchingUpdates，对 setTimeout 内部的执行逻辑完全没有约束力。因为 isBatchingUpdates 是在同步代码中变化的，而 setTimeout 的逻辑是异步执行的。当 this.setState 调用真正发生的时候，isBatchingUpdates 早已经被重置为了 false，这就使得当前场景下的 setState 具备了立刻发起同步更新的能力。所以咱们前面说的没错——setState 并不是具备同步这种特性，只是在特定的情境下，它会从 React 的异步管控中“逃脱”掉。

道理很简单，原理却很复杂。最后，我们再一次面对面回答一下标题提出的问题，对整个 setState 工作流做一个总结。

setState 并不是单纯同步/异步的，它的表现会因调用场景的不同而不同：在 React 钩子函数及合成事件中，它表现为异步；而在 setTimeout、setInterval 等函数中，包括在 DOM 原生事件中，它都表现为同步。这种差异，本质上是由 React 事务机制和批量更新机制的工作方式来决定的。

行文至此，相信你已经对 setState 有了知根知底的理解。我们整篇文章的讨论，目前都建立在 React 15 的基础上。React 16 以来，整个 React 核心算法被重写，setState 也不可避免地被“Fiber化”。那么到底什么是“Fiber”，它到底怎样改变着包括 setState 在内的 React 的各个核心技术模块，这就是我们下面两讲要重点讨论的问题了。
```



#### props

[react-props](https://zh-hans.reactjs.org/docs/components-and-props.html)

> 组件允许你将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。它通过props接受任意的入参。
>
> 1、由于props只是一定是父组件传过来的和单向数据流，不支持修改（只读）。

```js
1、传参：当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”。
父组件只要传递参数进来就可以了   let obj = this.state; <Welcome {...obj} />
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}


// 记得引入 import PropTypes from 'prop-types';
2、对标签属性进行类型、必要性的限制 详情请看：https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html
		Person.propTypes = {
			name:PropTypes.string.isRequired, //限制name必传，且为字符串
			sex:PropTypes.string,//限制sex为字符串
			age:PropTypes.number,//限制age为数值
			speak:PropTypes.func,//限制speak为函数
		}
3、指定默认标签属性值
		Person.defaultProps = {
			sex:'男',//sex默认值为男
			age:18 //age默认值为18
		}


```



#### refs 

[react-refs](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)

> 获取dom元素节点。
>
> props是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素。对于这两种情况，
>
> - 管理焦点，文本选择或媒体播放。
> - 触发强制动画。
> - 集成第三方 DOM 库。

```js
1、字符串获取法 ref="input1"。 在当前组件 this.refs 过时
2、ref={c => this.input1 = c }  在当前组件 this。变相将c 赋值给this.input1。缺点 状态变化导致render重新渲染，就是触发两次，第一次是将ref中的回调函数清空 输出null，再次将回调函数赋值回去 第二次才是真正的dom节点，官方也说这其实无关紧要，不过可以避免的，将一个函数赋值上去不执行即可。（推荐使用）
3. ref={this.myRef} myRef = React.createRef()  存放的是this.myRef.current，一次只能放一个dom对象，重新放入就会覆盖，在多数情况上看都是够用的，React中最新的api。


最后记住 不要过度使用ref。 因为react、vue这种都是不建议我们开发者操作dom的，浪费性能，但是有时又不得不用。
```

受控组件的和非受控组件的区别在于，受控组件是需要声明state的，反之。