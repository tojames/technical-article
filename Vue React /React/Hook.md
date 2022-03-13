# Hook



> React Hook 是React16.8版本新特性,**函数组件更新状态都会重新执行render，state的值是会被缓存起来，不会重新初始化。**
>
> 原理：是通过遍历链表来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果是不可控的，所以使用Hook是有相应的使用规则「eslint」。
>
> 作用：代码抽离，做到可复用，增强React函数组件的能力。



## Hooks 规则

- 只在 React 函数中调用 Hook或者在自定义 Hook 中调用其他 Hook 。

  - 自定义Hook： JavaScript 函数中调用其他的Hook，不能在包含逻辑语句中，并引入调用的时候必须顶层执行。

- 只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook，推荐启用 eslint-plugin-react-hooks插件进行强制校验。

  

**原因：不要在循环、条件或嵌套函数中调用 Hook。因为hooks 的底层是一个hook 接着一个hook 实例通过链表next连接起来的，但被代码破坏了其执行顺序，或者有些hook并没有执行就会导致 hook的状态对应不起来，就是初始化和更新执行的hook数量不一致时，控制台会提示 rendered fewer hooks than expected.this may be caused by an accidental early return statement。**



## React 内置 Hook

### 基础的Hook

#### State Hook

```jsx
State Hook 让函数组件也可以有state状态，并进行状态数据的读写操作，当状态发生了改变就会触发函数组件的渲染。
语法 const [xxx,setXxx] = React.useState(initValue)
 参数：第一次初始化指定的值在内部缓存
 返回值：包含2个元素的数组，第一个为内部当前状态值，第二个为更新状态的函数。
setXxx() 2种写法：
	setXxx(value) 赋值给xxx。
	setXxx(value=>newValue)参数为函数，接收原本的状态值，返回新的状态值，内部用其覆盖原来的状态。
	
function A(){
	// console.log(this) // undefined
	const [count,setCount] = React.useState(0)
	
  function add(){
    setCount(count++)
    // setCount(value=>value+1)
  }
  
	return (
    <div>
    	<span> { count } </span>
      <button onClick={ add }>+ 1</button>
    </div>	
	)
}
```

#### Effect Hook

> 对操作可能产生副作用的时候，请使用 `useEffect`,因为这样可能避免 `re-render`

```tsx
Effect Hook 可以让你在函数组件中执行副作用操作「用于模拟类组件中的声明周期钩子」
	一般用于 发ajax请求
  修改 state状态
	设置订阅/启动定时器
	手动更改真实DOM
	语法和说明
	useEffect(()=>{
		// 在此可以执行任何带副作用的操作
		return ()=>{
				//在组件卸载前执行，做一些收尾工作，比如清除定时器，取消订阅。
		}
	},[stateValue]) // 如果指定的是[],回调函数只会在第一次render() 后执行
	
可以把useEffect Hook 是类组件的三个生命周期函数的组合
componentDidMount() // 组件第一次渲染时就会执行
componentDidUpdate() // 当第二个参数不传时每次都会触发，或者传入了React.useState(xx)某个值，当值变化时才会触发。
componentWillUnmount() // 是一个参数的返回值，这里返回了一个回调函数做一些卸载出来
```

#### useContext

> 它的原理和`React类组件是相同的`，是一种跨组件传参数的解决方案。
>
> 在 React-入门文章有详解。

```tsx
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);  
  return (    
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!    
    </button>
  );
}
```

### 额外的 Hook

#### useReducer

> useState 的替代方案，在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

```tsx
普通写法，在 reducer 可以对状态变化的时候进行一些处理，这种可以更加灵活处理数据。
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}


另外一种写法，这样做的好处主要有两个
	initialCount不用马上确认，通过传参数确认
  重置initialCount非常方便
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```



#### useCallback

> 缓存回调函数，传函数进去，返回函数，当时这个函数经过react缓存过的，所以不会每次组件重新渲染都会重新定义函数

##### 哪些情况-个组件会重新渲染?

- 组件自己的state变化;
- 父组件传递过来的props变化;
- 父组件重新渲染了。

##### useCallback使用场景

- 对于需要传递**函数**给子组件的场合，不使用useCallback的话，子组件每次都会重新渲染;
- 在调用节流、防抖函数时。

```tsx
const memoizedCallback = useCallback(
  () => { doSomething(a, b)},
  [a, b]
);

注意：这里的 [a, b]，可以使用 []，除非真的想传参数进去，因为doSomething里面的参数可以通过memoizedCallback传进去。
[],用来监听数据是否变化了，才会刷新缓存函数。
const memoizedCallback = useCallback(
  () => { doSomething(a, b)},
  []
);
// 这就就可以拿到外面传进去的值
memoizedCallback(a,b)
```



#### useMemo

> 缓存变量，如果一些值的计算量很大，那么可以用useMemo来做一个缓存， 只有依赖变
> 化时才会重新计算，而不是每次渲染时都进行计算。

```tsx
// 当a，b的值变化了，才会重新计算memoizedValue
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

注意和 React.memo的区别， React.memo是对组件传进来的props进行浅比较，如果浅比较没有改变则不渲染，改变则渲染。

```tsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```



##### 考虑useMemo和useCallback的时机

- 在出现性能问题后，进行优化时可以考虑使用useMemo和useCallback对性
  能进行一定定的优化;
- 如果没有性能问题可以不用，这样可以更专注于代码本身逻辑。



#### useRef

> 操作dom的hook

```tsx
Ref Hook 可以在函数组件中存储/查找组件内的标签或任意其他数据
语法 const refContainer = React.useRef()
作用：保存标签对象，功能与React.creatRef() 一样。

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // current 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```



#### useImperativeHandle

##### React. forwardRef 

> 目的是为了获取跨组件的dom元素。

```tsx
// 可以转发
const FancyButton1 = React.forwardRef((props, ref) => (
	<div>
		<input ref=(ref} />
		<button> { props.children } </ button>
</div>
));

// 普通组件做不到。
const FancyButton = props => (
	<div>
		<input ref=(props.ref] />
		<button> { props.children } </ button>
</div>
)

function Aрр() {
	const ref = React.createRef();
	const handleClick = React.useCallback(() => ref.current. focus(),[])
	return <div>
		<FancyButton ref={ ref }>Click me !</FancyButton>
		<button onClick={ handleClick }>获取焦点</ but ton>
</div>
}
```

##### useImperativeHandle

```tsx
/**
知识点:
官方概念:自定义要开放给父组件的实例值。
简要理解就是通过父组件访问子组件的实例，包括状态也可以。
第三个个参数的作用。
@param {*} props
@param {*} ref
*/
function FancyInput(props, ref) {
	const inputRef = useRef( );
	useImperativeHandle(ref, () => ({
		focus: () => {
			inputRef.current.focus();
  }
	}));
	return <input ref={inputRef} />;
}

// 目的就是用于forwardRef 的参数。返回的 FancyInput 是具备forwardRef 功能的函数组件。
// 也就是下面使用中可以传递refs 的组件。

FancyInput = forwardRef(FancyInput);
const App = props => {
	const fancyInputRef = useRef();
	return <div>
		<FancyInput ref={ fancyInputRef} /><hr 1>
		<button onClick={() => fancyInputRef.current.focus( )}>父组件调用子组件的focus</button>
	</div>
}
```



**注意：useImperativeHandle 以前名称为 useImperativeMethod**

#### useLayoutEffect

> useLayoutEffect是同步渲染，useEffect是异步的，如果存在“阻塞渲染”这个同步的需求，那么可以使用 useLayoutEffect，否则都是用useEffect。其他方面这两个api都一致。
>

```tsx
useEffect(() => {
	console.log( 'from Effect') 
}, [])

useLayoutEffect(() => {
	console.log( 'from layoutEffect')
}, [])

// from layoutEffect
// from Effect
就是先执行 useLayoutEffect 比 useEffect 先执行。
```



#### useDebugValue

> `seDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。
>
> 它的价值在于，当我们console.log 的时候会有一定的耗时，它可以在开发工具上面看见状态的变化，可以使用多次。

```tsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签  // e.g. "FriendStatus: Online"  
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```

## [ahook「非内置Hook」](https://ahooks.js.org/zh-CN/)

> 一个阿里出的hook，有很多。



# 自定义Hook

> hook的思想都是一致的，自定义 Hook，可以按照业务逻辑将组件逻辑提取到可重用的函数中。

### 约定

```
1.创建了一个 useXXX 的函数，但是内部并没有用任何其它 Hooks，那么这个函数就不是一个 Hook，而只是一个普通的函数。但是如果用了其它 Hooks ，那么它就是一个 Hook。
2.名字一定是以 use 开头的函数，这样 React 才能够知道这个函数是一个 Hook，有eslint校验；
函数内部一定调用了其它的 Hooks，可以是内置的 Hooks，也可以是其它自定义 Hooks。这样才能够让组件刷新，或者去产生副作用。
```



 

# 问题

**1.为什么不能在函数组件外部使用Hooks**

**2.React Hooks的状态保存在哪里**

**3.为什么传入两次相同的状态，函数组件不更新**

**4.函数组件的useState和类组件的setState有什么区别**

https://www.bilibili.com/video/BV19h411Y7gy?from=search&seid=12964227978943724250&spm_id_from=333.337.0.0

[React-Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html)