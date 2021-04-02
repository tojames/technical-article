# Hooks

> React Hook 是React16.8版本新特性
>
> 可以让开发者在函数组件中使用state以及其他的React特性
>
> 函数组件更新状态都会重新执行render，但是useState的值是会被缓存起来，不会重新初始化。



#### 1.State Hook

```
State Hook 让函数组件也可以有state状态，并进行状态数据的读写操作
语法 const [xxx,setXxx] = React.useState(initValue)
 参数：第一次初始化指定的值在内部缓存
 返回值：包含2个元素的数组，第一个为内部当前状态值，第二个为更新状态的函数。
setXxx() 2种写法：
	setXxx(value) 赋值给xxx。
	setXxx(value=>newValue)参数为函数，接收原本的状态值，返回新的状态值，内部用其覆盖原来的状态。
```

#### 2.Effect Hook

```
Effect Hook 可以让你在函数组件中执行副作用操作「用于模拟类组件中的声明周期钩子」
	一般用于 发ajax请求
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
		componentDidMount()
		componentDidUpdate()
		componentWillUnmount()
```

#### 3.Ref Hook

```
Ref Hook 可以在函数组件中存储/查找组件内的标签或任意其他数据
语法 const refContainer = React.useRef()
作用：保存标签对象，功能与React.creatRef() 一样。
```

