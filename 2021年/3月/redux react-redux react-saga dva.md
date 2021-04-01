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


react-redux 的api，别看长这样，底层就是api。

<Provider store>
  	使组件层级中的 connect() 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 <Provider> 中才能使用 connect() 方法。
    
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
	连接 React 组件与 Redux store。
	连接操作不会改变原来的组件类。
	反而返回一个新的已与 Redux store 连接的组件类，我们称为容器组件。
  mapStateToProps：
  [mapStateToProps(state, [ownProps]): stateProps] (Function): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 	Redux store 发生改变，mapStateToProps 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 ownProps，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，mapStateToProps 也会被调用（例如，当 props 接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）「ownProps暂时没用到过」。
  mapDispatchToProps
  [mapDispatchToProps(dispatch, [ownProps]): dispatchProps] (Object or Function): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中dispatch方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 props 中。
如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 bindActionCreators()。如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。如果指定了该回调函数中第二个参数 ownProps，该参数的值为传递到组件的 props，而且只要组件接收到新 props，mapDispatchToProps 也会被调用。
	mergeProps「暂时没用到过」
[mergeProps(stateProps, dispatchProps, ownProps): props] (Function): 如果指定了这个参数，mapStateToProps() 与 mapDispatchToProps() 的执行结果和组件自身的 props 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 Object.assign({}, ownProps, stateProps, dispatchProps) 的结果。
options「暂时没用到过」
[options] (Object) 如果指定这个参数，可以定制 connector 的行为。
[pure = true] (Boolean): 如果为 true，connector 将执行 shouldComponentUpdate 并且浅对比 mergeProps 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。默认值为 true。
[withRef = false] (Boolean): 如果为 true，connector 会保存一个对被被包含的组件实例的引用，该引用通过 getWrappedInstance() 方法获得。默认值为 false。

还有更多用法去找 react-redux 官网，上面的基本都是复制，因为讲的特别清晰，我这里只是一个笔记，方便以后查看。
```

##  [Redux-saga](https://redux-saga-in-chinese.js.org/docs/introduction/BeginnerTutorial.html)



> 主要用于处理异步的，使得action reducer state 还是保持原有的纯净的特性，这也是为什么Dva会使用saga的解决方案。
>
> redux-saga就是一个中间件，用来处理effect（异步），使用ES6的Generator的语法。
>
> 

```js
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducers";
import rootSaga from "./sagas"; // 引入saga
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
//  将createSagaMiddleware传进applyMiddleware 运行saga，这时候就可以监听dispatch 中的action了「中间件的作用」。

function* watchAsync() {
  console.log("watchIncrementAsync");
  yield takeEvery("takeEvery", function* () {
    const state = yield select();
    console.log(state, "state");
    console.log("takeEvery");
  });

  yield takeLatest("takeLatest", function* () {
    console.log("takeLatest");
  });

  yield throttle(1000, "throttle", function* () {
    console.log("throttle");
  });
}

// 这个 Saga yield 了一个数组，值是调用 helloSaga 和 watchAsync 两个 Saga 的结果。
// 说这两个 Generators 将会同时启动
export default function* rootSaga() {
  yield all([helloSaga(), watchAsync()]);
}

当组件触发相应action的时候都会经过reducer 然后在到saga。

辅助函数
	1.takeEvery(pattern,saga,...args) 在发起 dispatch 到 Store 并且匹配pattern的每一个action上派生一个saga
 	2.takeLatest(pattern,saga,...args) 在发起到Store并且匹配pattern的每一个action上派生一个saga。并且自动取消之前所有已经启动但人在运行中的saga任务。
	3.throttle(ms,pattern,saga,...args) 在发起到Store并且匹配pattern的一个action上派生一个saga，它在派生一次任务之后，仍然将传入的action接收到底层的buffer中，至多保留（最近的）一个。但与此同时，它在ms毫秒内将暂停派生新的任务。
 这三个函数都是通过pattern监听action的。
 
effect 
	1.select(selector,...args) 获取redux的state，如果调用select的参数为空（即yield select()）,那么effect会取得完整的state（与调用getState()的结果相同）
  2.call(fn,...args) 创建一个effect描述信息，用来命令middleware以参数args调用函数fn
  3.take(pattern) 阻塞的方法，用来匹配发出的action 只会监听一次，while(true) {} 可以实现takeEvery，一直监听。
  4.put(action)  用来命令middleware向Store发起一个action，这个effect是非阻塞型的。
```



# [Dva](https://dvajs.com/guide/)

> dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。作者是支付宝
>
> 由于是一个脚手架，很多写法是是需要按照Dva的语法，但是大多都是没有改变，而且官方都给示例。
>
> 在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在`/routes/`目录下，而`/components/`目录下则是纯组件（Presentational Components）。
>
> dva = React-Router + Redux + Redux-saga

```js
说明 我是基于官网脚手架改造的。
npm install dva-cli -g
dva new dva-quickstart

index.js 入口文件
import dva from "dva";
import "./index.css";

const app = dva({
  initialState: {},
});
app.router(require("./router").default);
require("./models").default.forEach((key) => app.model(key.default));
app.start("#root");

router.js
import React from "react";
import { Router, Route, Switch } from "dva/router";
import IndexPage from "./routes/IndexPage";

import Products from "./components/Products";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/pro" exact component={Products} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

-----------------------------------分界线---------------------------------------------------------
component

import React, { Component } from "react";

import { connect } from "dva";
import { Button } from "antd";

class Products extends Component {
  state = {};
  addProdust = () => {
    const { dispatch } = this.props;
    let newObj = { name: "华为Watch", value: 2500, id: 3 };
    dispatch({
      type: "products/add",
      payload: newObj,
    });
  };
  addProdustAsync = () => {
    const { dispatch } = this.props;
    let newObj = { name: "ihphone12", value: 6000, id: 4 };
    dispatch({
      type: "products/addAsync",
      payload: newObj,
    });
  };
  addProdustAsync2 = () => {
    const { dispatch } = this.props;
    let newObj = { name: "小米12", value: 5000, id: 5 };
    dispatch({
      type: "products/addAsync2",
      payload: newObj,
    });
  };
  deleteItem = (id) => {
    console.log(id, "id");
    const { dispatch } = this.props;
    dispatch({
      type: "products/delete",
      payload: id,
    });
  };
  render() {
    console.log("render", this.props);
    let produstList = this.props.produstList;
    let produstView = produstList.map((item, index) => (
      <div key={index + item.value}>
        {item.name}---{item.value}
        <Button onClick={() => this.deleteItem(item.id)}>删除</Button>
      </div>
    ));
    return (
      <div>
        <Button onClick={this.addProdust}>新增产品</Button>
        <Button onClick={this.addProdustAsync}>新增产品Async</Button>
        <Button onClick={this.addProdustAsync2}>新增产品Async2</Button>

        {produstView}
      </div>
    );
  }
}

let mapStateToProps = (state) => ({ produstList: state.products.produstList });
export default connect(mapStateToProps)(Products);
-----------------------------------分界线---------------------------------------------------------
+model
	products
  index

  products.js
  export default {
  namespace: "products",
  state: {
    produstList: [
      { name: "iwatche6", value: 3000, id: 1 },
      { name: "小米手环6", value: 300, id: 2 },
    ],
  },
  reducers: {
    delete(state, { payload: id }) {
      let oldState = JSON.parse(JSON.stringify(state));
      oldState.produstList = state.produstList.filter((item) => item.id !== id);
      return oldState;
    },
    add(state, { payload: data }) {
      let oldState = JSON.parse(JSON.stringify(state));
      oldState.produstList = [...oldState.produstList, data];
      return oldState;
    },
  },

  effects: {
    *addAsync({ payload: data }, { put, call }) {
      yield put({
        type: "add",
        payload: data,
      });
      console.log("run");
    },
    *addAsync2({ payload }, { put, call }) {
      let res = yield call(func); // 调用 func函数，这里的func可以是异步的操作
      yield put({
        type: "add",
        payload: res,
      });
    },
  },
};

let func = () => {
  let product = { name: "小米汽车", value: 100000, id: 6 };
  return product;
};

index.js
/* 
  解决当我们的model越写越多的时候，将会在入口文件中引入太多现在的重复代码
*/

const context = require.context("./", false, /\.js$/);
export default context
  .keys()
  .filter((item) => item !== "./index.js")
  .map((key) => context(key));




app.model 所有的应用逻辑都定义在它上面。
	namespace: 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成
	state: 该 Model 当前的状态。数据保存在这里，直接决定了视图层的输出
	reducers: Action 处理器，处理同步动作，用来算出最新的 State
	effects：Action 处理器，处理异步动作
  	Effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作（不管是异步或同步）。
		call：执行异步函数 const result = yield call(fetch, '/todos'); // 执行 fetch函数
		put：发出一个 Action，类似于 dispatch yield put({ type: 'todos/add', payload: 'Learn Dva'});
    select 用于从state里获取数据。const todos = yield select(state => state.todos);
```

