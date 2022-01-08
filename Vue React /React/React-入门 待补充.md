# React

> React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。

react 要求原生javascript的能力比较高，写法也比较灵活，但是总有高效和低效之分的写法。

## 组件命名

```
组件一般采用大驼峰命名规则，比如下面这种。 
component/pages「视图」。 模块/功能进行目录结构划分
			└─ User
			    ├─ Form.jsx「尽量写jsx」
			    	class Form extends Component {}，好处就是出错时 React Dev工具进行调试非常方便
			    	如果想避免重名 可以使用这种 class UserForm extends Component {}
			    └─ List.jsx
```

## Context

> 一种组件通信方式，用于跨组件通讯

```js
1.创建Context容器对象：
  语法 const XxxContext = React.createContext()
  
2.渲染子组件时，外面包裹XxxContext.Provider,通过value属性给后代组件传递数据：
	<XxxContext.Provider value = {数据}> 子组件 </XxxContext.Provider>
	
3.后台组件读取数据：
  3.1 仅适用于类组件
  	static contextType = XxxContext // 声明接收context
  	this.context // 读取context中的value
  3.2 类组件 函数组件都可以使用
  	<XxxContext.Consumer>
  		{
  		// 这个函数就是便利传过来的每一项数据，
  			value =>{}
  		}
  	</XxxContext.Consumer>
  	
实例
import React, { Component } from "react";
const userNameContext = React.createContext();
const { Provider, Consumer } = userNameContext;
// export default class A extends Component {
//   state = { userName: "果汁", age: 18 };

//   render() {
//     return (
//       <div>
//         我是A组件
//         <Provider value={{ ...this.state }}>
//           <B />
//         </Provider>
//       </div>
//     );
//   }
// }

export default function A() {
  const [state] = React.useState({ userName: "果汁", age: 18 });

  return (
    <div>
      我是A组件
      <Provider value={{ ...state }}>
        <B />
      </Provider>
    </div>
  );
}

class B extends Component {
  render() {
    return (
      <div>
        我是B组件
        <C />
      </div>
    );
  }
}

// class C extends Component {
//   static contextType = userNameContext;

//   render() {
//     const { userName, age } = this.context;
//     console.log(this.context, "skdfsdf");
//     return (
//       <div>
//         我是C组件
//         {userName}-{age}
//       </div>
//     );
//   }
// }

function C() {
  return (
    <div>
      我是C组件
      <Consumer>{(value) => `${value.userName}---${value.age}`}</Consumer>
    </div>
  );
}
```

## 受控组件&非受控组件

> 对于form表单中提交的数据来说的。
>
> 受控组件：通过表单项的状态的改变收集状态的。类似Vue的双向数据绑定，收集到的状态存起来。
>
> 非受控组件：当触发事件的时候才获取数据进行提交「先用现取」，就是没有控制表单里面的组件。
>
> 受控和非受控的区别在于，状态是什么时候获取的，受控是改变就获取，非受控是提交时获取。



## Fragment

> 因为JSX的语法限制，必须存在根标签，Fragment 组件能够在不额外创建 DOM 元素的情况下，让 render() 方法中返回多个元素。一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

```jsx
import React,{Component,Fragment} from 'react'

export default class A extends Component{
	render(){
		<Fragment key={xx}>
      <p>11</p>
      <p>22</p>
    </Fragment>
	}
}

这样渲染出来的A组件是没有根标签的，以前的做法是使用div去包裹，会导致嵌套很深。

写法二
注意：不能携带key值，而且 Fragment 只允许传递key属性
export default class A extends Component{
	render(){
		<>
      <p>11</p>
      <p>22</p>
    </>
	}
}
```



## PureComponent

> 可以关注 PureComponent VS Component
>
> Component的2个问题
>
> 1.只要执行setState(),即使不改变状态，组件也会重新render() 
>
> 2.当前组件重新render()  就会自动重新render子组件，即使子组件没有使用到props。

**解决Component低效问题**

```
1.上面的问题虽然可以通过声明周期钩子函数 shouldComponentUpdate(nextProps，nextState) 可以控制，当传递数据多的时候不过挺鸡肋的。
2.使用PureComponet
	PureComponet重写了shouldComponentUpdate(),只有state或props数据有变化才返回true
	注意：
		只进行state和props数据的浅比较，如果只是数据对象内部数据变量，返回false。
		不能直接修改state数据，而是要产生新数据
推荐：项目汇总一般使用PureComponent来优化


class A extends React.PureComponent {
  render() {
    return(
      <div>
       	React.PureComponent
      </div>
    )
  }
}

class B extends React.Component {
  constructor() {}
    render() {
    return(
      <div>
       	React.Component
      </div>
    )
  }
}  

pureComponent继承Component， 和Component唯一的区别就是加了个属性
pureComponentPrototype.isPureReactComponent = true;
```

## render props

**如何向组件内部动态传入带内容的结构（标签）？**

> Vue 使用slot
>
> React  
>
>  1.使用children props 通过组件标签传入结构
>
>  2.使用render props 通过组件标签属性传入结构，而且可以携带数据，一般用render函数属性

**children props**

```
<A> 
	<B/>
</A>
组件A 使用 this.props.children 即可渲染B组件，问题：但是组件B用不了组件A的数据
```

**render props**

```
<A render={data=> <B data ={data}> </B>} ></A>
A组件：this.props.render 将state数据传入
B组件：读取A组件传入的数据显示 {this.props.data}
```

## 错误边界

> 错误边界(Error boundary):用来捕获后代组件错误，渲染备用页面
>
> 局限只能捕获后代组件生命周期产生的错误，不能捕获自己组件产生的错误和其他组件的合成事件，定时器中产生的错误

```
getDerivedStateFromError 和 componentDidCatch

static getDerivedStateFromError(error){} // 生命周期函数，一旦后代组件报错，就会触发，通过状态判断是否渲染子组件或报错页面

componentDidCatch(error,info){} // 统计页面的错误，可以发送给后台。
```

## 组件通信

**通信方式**

```
1.props：
	（1).children props 
	 (2).render props
	 
2.消息订阅-发布
	pubs-sub、event等等
	
3.集中式管理：
	redux、dva
	
4.conText
	生产者-消费者
```

**使用场景**

```
父子组件：props 
兄弟组件：消息订阅-发布、集中式管理
祖孙组件（跨级组件）：消息订阅-发布、集中式管理、conText HOC（高阶组件）
```



## lazyLoad&Suspense

> 路由懒加载，一个react中的lazy函数。
>
> 需要使用Suspense包裹着路由组件

```TSX
import React，{ lazy} from 'react'

const Home = lazy(()=>{import ('./Home')})
// fallback：路由组件在请求过程中显示的组件，当路由组件加载完毕，将会被替换为路由组件。
<Suspense fallback={<h1>加载ing...</h1>}>
	<Route path="/home" component={Home} />
</Suspense> 
```



##  HOC（高阶组件）

> Higher-Order Component 是一个函数，接收包装的组件，返回一个增强功能后的组件
>
> 高阶组件内部创建一个类组件，在这个类组件中提供复用的状态逻辑代码，通过prop将复用的状态传递给被包装组件后，经过包装组件处理后返回新的组件。
>
> 目的：UI和状态逻辑分开，实现状态逻辑复用

```tsx
// 创建高阶组件
function withMouse (WrappedComponent) {
// 该组件提供复用的状态逻辑
	class Mouse extends React . Component {
		// 鼠标状态
		state = {
			x: 0,
			y: 0
    }
		handleMouseMove = e => {
			this. setState({
			x: e.clientX,
			y: e.clientY
		})

		// 控制鼠标状态的逻辑
		componentDidMount() {
			window.addEventListener ( ' mousemove '，this.handleMouseMove )
		}
		componentwillUnmount(){
			window.removeEventL istener( ' mousemove', this . handleMouseMove)
		}
		render(){
		  return <WrappedComponent {...this.state} {...this.props} >< /WrappedComponent>
		}
  }

	Mouse.displayName = `WithMouse${getDisplayName(WrappedComponent)}`
  
	return Mouse
}
        
function getDisplayName(WrappedComponent){
   return WrappedComponent.displayName || WrappedComponent.name || 'Component' ;       
}

// 用来测试高阶组件
const Position = props => (
	<р> 鼠标当前位置:(х:{prpps.x}, у: {props.y})</p>
      
// 调用高阶组件得到新的组件     
const MousePosition = withMouse(Position)
      
class App extends React.Component (
	render( ){
    return (
      <div> 
				<h1>高阶组件< /h1>
        <MousePosition/>
			</div>  
    )
}

displayName 可以设置组件的名字，为了防止组件复用后，组件名字都叫Mouse
```

