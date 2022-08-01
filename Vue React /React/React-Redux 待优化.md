# React-Redux

###react-redux[传送门](https://cn.redux.js.org/docs/react-redux/) 

> 它和redux是有些不一样的，它是react自家出的，它的出现为了更好的操作redux。

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

## useSelector

> 获取sotre对应的数据

```js
//index.js 在此文件将不通的reudcer进行统一
import {combineReducers} from 'redux'
import todoReducer from './todoReducer'

export const reducer = combineReducers({
    todoReducer : todoReducer
})


//Top.js在此文件获取todoReducer下声明的store的数据
import {useSelector, useDispatch} from 'react-redux'
const todos = useSelector(state => state.todoReducer.todos)
```



## useDispatch

useDispatch的作用是在子组件中，可以触发对应的reducer的行为操作，进而实现对store的数据更新。具体操作步骤

- 1.`import {useDispatch}from 'react-redux'`
- 2.在函数组件中定义对象`const dispatch = useDispatch()`
- 3.`dispatch((type,payload))`的方式传递行为类型和行为所需要的参数
- 4.`react-redux`会监听行为，改变`store`存储的数据

```js
//App.js
import {useSelector, useDispatch} from 'react-redux'
useEffect(()=>{
        dispatch({
            type:actionType.GET_ALL_TODO
        })
    }, [dispatch])

// Top.js
    const dispatch = useDispatch()

    const _handleKeyEvent = (e)=>{
        const lastTodoId = todos.length === 0 ? 0: todos[todos.length - 1].id
        if (13 === e.keyCode){
            const value = inputRef.current.value
            if (!value.trim()){
                alert('输入的内容不为空')
                return
            }
            const todo = {id:lastTodoId, title:value, finished:false}
            dispatch({
                type: actionType.ADD_ONE_TODO,
                payload: todo
            })
            inputRef.current.value = ''
        }
    }
```

​	
