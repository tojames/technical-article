# redux react-redux dva

### redux [传送门](https://cn.redux.js.org/)

![redux原理图](../../static/images/redux%E5%8E%9F%E7%90%86%E5%9B%BE.png)

- ```js
  redux项目结构
  + src
    + redux
  		+ actions
      	- user.js(等等各种action文件「按照功能划分」)
    	+ reducers
     	 	- count.js(等等各种reducer文件「按照功能划分」)
  		index.js(通过combineReducers，将所有的reducer文件合并一起传给store)
  		constant(常量文件)
  		store（redux核心文件）
  
  -----------------------------------分界线---------------------------------------------------------
  store.js
  /* 
  	该文件专门用于暴露一个store对象，整个应用只有一个store对象
  */
  
  // 引入createStore，专门用于创建redux中最为核心的store对象
  // applyMiddleware 的作用和thunk结合起来放在createStore中就可以处理一个 异步action返回函数的情况。
  import { createStore, applyMiddleware } from "redux" // cnpm install --save redux
  //引入汇总之后的reducer
  import reducer from "./reducers"
  //引入redux-thunk，用于支持异步action
  import thunk from "redux-thunk" // cnpm install --save redux-thunk
  // 引入redux-devtools-extension 同时谷歌插件也需要安装 Redux DevTools 这样配合起来就可以方便观看状态的变化。
  // cnpm install redux-devtools-extension -D
  import { composeWithDevTools } from "redux-devtools-extension" 
  
  
  //暴露store
  export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
  
  -----------------------------------分界线---------------------------------------------------------
    
  constant.js
  /* 
  	该模块是用于定义action对象中type类型的常量值，目的只有一个：便于管理的同时防止程序员单词写错
  */
  export const INCREMENT = "increment"
  export const DECREMENT = "decrement"
  
  -----------------------------------分界线---------------------------------------------------------
  
  action.js
  /*
  	该文件专门为Count组件生成action对象
  */
  import { INCREMENT, DECREMENT } from "../constant"
  
  export const createIncrementAction = (data) => ({ type: INCREMENT, data })
  export const createDecrementAction = (data) => ({ type: DECREMENT, data })
  
  export const createIncrementAsyncAction = (data) => {
    // dispatch 这个参数是因为我们在 组件外面调用了 dispatch，然后因为是函数的缘故，所以applyMiddleware(thunk),帮我们处理了，
    // 帮我们再次调用里面的函数，dispatch顺便也传了过来。
    return (dispatch) => {
      // 这里将来会是一些异步的操作
      setTimeout(() => {
        dispatch(createIncrementAction(data))
      }, 500)
    }
  }
  
  -----------------------------------分界线---------------------------------------------------------
  
   reducers
  /* 
  	1.该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
  	2.reducer函数会接到两个参数，分别为：之前的状态(preState)，动作对象(action)
  	
  	reducer 默认会先初始化值，内部会传入atcion需要的参数，preState为undefined，type为：'@@redux/InITi.0.i.m.d'「类似这种的随机字符串」，component就可以通过getState()获取初始值，但是如果没有subscribe监听的话，是不能自动呈现数据的，因为没有render，虽然数据改变了。
  	官方定义的规则
  		所有未匹配到的 action，必须把它接收到的第一个参数也就是那个 state 原封不动返回。
  		永远不能返回 undefined。当过早 return 时非常容易犯这个错误，为了避免错误扩散，遇到这种情况时 			combineReducers 会抛异常。
  		如果传入的 state 就是 undefined，一定要返回对应 reducer 的初始 state。根据上一条规则，初始 state 禁止使用 undefined。使用 ES6 的默认参数值语法来设置初始 state 很容易，但你也可以手动检查第一个参数是否为 undefined。
  	
  */
  import { INCREMENT, DECREMENT } from "../constant"
  
  const initState = 0 //初始化状态
  export default function countReducer(preState = initState, action) {
    // console.log(preState);
    //从action对象中获取：type、data
    const { type, data } = action
    //根据type决定如何加工数据
    switch (type) {
      case INCREMENT: //如果是加
        return preState + data
      case DECREMENT: //若果是减
        return preState - data
      default:
        return preState
    }
  }
  -----------------------------------分界线---------------------------------------------------------
    
    使用
  // 在index.js 入口文件全局坚挺根组件
  // 监听store中的state变化，并且render
  store.subscribe(() => {
    ReactDOM.render(<App />, document.getElementById("root"))
  })
  
  
  // 组件
  import { createIncrementAction , createDecrementAction,createIncrementAsyncAction} from "../redux/actions/count"
  //引入store，用于获取redux中保存状态
  import store from '../redux/store'
  
  
  store.dispatch(createIncrementAction(value*1)) // 修改state
  store.getState().xx //获取state 这个xx为reduce合并的时候的值。
  
  
  -----------------------------------分界线---------------------------------------------------------
  
  /*
  总结：当我们页面刚开始运行的时候，store初始化值，state设置为初始值，没有设置默认就是undefined。
  然后全局组件监听页面上的变化，即可渲染到页面上。
  
  */
  
  
  /* 
    store中的api
      getState() 返回应用当前的 state 树，它与 store 的最后一个 reducer 返回值相同。（只声明一个reducer的时候，默认返回当前reducer处理完的state）。
      dispatch(action) 分发 action。这是触发 state 变化的惟一途径。
        过程：将使用当前 getState()的结果「上一次的值」和传入的 action 以同步方式的调用 store 的 reduce 函数。它的返回值会被作为下一个 state。
        从现在开始，这就成为了 getState() 的返回值，同时变化监听器(change listener)会被触发。
        action ：描述应用变化的普通对象，Action 是把数据传入 store 的惟一途径，action通过dispatch调用
        按照约定，action 具有 type 字段来表示它的类型。type 也可被定义为常量或者是从其它模块引入。最好使用字符串，
      subscribe(listener) 添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。
      你可以在回调函数里调用 getState() 来拿到当前 state，一般我们会在index中监听根组件。
  */
  
  
  问题一：
  	为什么 dispatch 可以找到 reducer 呢？ 
  	因为 stroe中直接通过遍历找到对应的reduce
  ```




###react-redux[传送门](https://cn.redux.js.org/docs/react-redux/) 

> 它和redux是有些不一样的，它是react自家出的，它的出现为了更好的操作redux。

![react-redux模型图](../../static/images/react-redux%E6%A8%A1%E5%9E%8B%E5%9B%BE.png)

```js
react-redux 和redux 的关系  `桥` 的作用。

react-redux 帮我们省略了监听redux中的state的变化，如下面代码。
// 监听store中的state变化，并且render
store.subscribe(() => {
  ReactDOM.render(<App />, document.getElementById("root"))
})

容器组件 和UI 组件写在一个文件里面，通过props联系。

1.建立props联系 通过 <Count store={store} />  通过这种方式注入，但是一般不会这么操作。
	使用provider 包裹着 <app /> 如
		import { Provider } from "react-redux"
		ReactDOM.render(<Provider store={store}><App /> </Provider>,document.getElementById("root"))
2.引入react-redux import { connect } from "react-redux" 
3.Count组件
// 映射状态
 const mapStateToProps = state =>({ count: state.count })
// 映射操作方法
 const mapDispatchToProps = dispatch=> ({
    increment:(data)=> dispatch(createIncrementAction(data)),
    decrement:(data)=> dispatch(createDecrementAction(data)),
    asyncInrement:(data)=> dispatch(createIncrementAsyncAction(data)),
  })
4.export default connect(mapStateToProps,mapDispatchToProps)(Count) // 容器组件

/*
mapDispatchToProps简写方式，
原理分析：createIncrementAction 是一个函数，并且接受到了参数，那么就是少了一个dispatch，原来connect帮我们自动分发action出去了「自动帮我们调用action」
const mapDispatchToProps = {
    increment:createIncrementAction,
    decrement:createDecrementAction,
    asyncInrement:createIncrementAsyncAction
}，
如果当我们的页面上面使用的是createIncrementAction这种方法的话，又可以继续简写。
const mapDispatchToProps = {
    createIncrementAction,
    createDecrementAction,
    createIncrementAsyncAction
}，
*/

5.然后Count组件就可以通过props访问容器组件的方法「mapDispatchToProps」和属性「mapStateToProps」
```

##  redux-saga

> 主要用于处理异步的，使得action reducer state 还是保持原有的纯净的特性，这也是为什么Dva会使用saga的解决方案。



# [Dva](https://dvajs.com/guide/)

> dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。作者是支付宝
>
> 由于是一个脚手架，很多写法是是需要按照Dva的语法，但是大多都是没有改变，而且官方都给示例。
>
> 在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在`/routes/`目录下，而`/components/`目录下则是纯组件（Presentational Components）。
>
> dva = React-Router + Redux + Redux-saga

```js

// 创建应用
const app = dva();

// 注册 Model
app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1 },
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'add' });
    },
  },
});

// 注册视图
app.router(() => <ConnectedApp />);

// 启动应用
app.start('#root');


app.model 所有的应用逻辑都定义在它上面。
	namespace: 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成
	state: 该 Model 当前的状态。数据保存在这里，直接决定了视图层的输出
	reducers: Action 处理器，处理同步动作，用来算出最新的 State
	effects：Action 处理器，处理异步动作
  	Effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作（不管是异步或同步）。
		call：执行异步函数
		put：发出一个 Action，类似于 dispatch
```

