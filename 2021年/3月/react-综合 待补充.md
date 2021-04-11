### react 之 代码书写

> React 本身只是一个 DOM 的抽象层，使用组件构建虚拟 DOM。
>
> 这句话真精炼！

react 要求的原生javascript的能力比较高，写法也比较灵活，但是总有高效和低效之分的写法。

#### 1.class组件

**最标准的写法**

```js
	//1.创建组件
		class Weather extends React.Component{
			//构造器调用几次？ ———— 1次
			constructor(props){
				console.log('constructor');
				super(props)
				//初始化状态
				this.state = {isHot:false,wind:'微风'}
			 //解决changeWeather中this指向问题
       // 原理：先执行右侧代码，在Weather原型上找到了changeWeather，通过绑定this，赋值给当前实例				     				// this.changeWeather创建了一个栈来接收新的函数地址，接着render就可以调用当前实例的方法了。
				this.changeWeather = this.changeWeather.bind(this)
			}

			//render调用几次？ ———— 1+n次 1是初始化的那次 n是状态更新的次数
			render(){
				console.log('render');
				//读取状态
				const {isHot,wind} = this.state
        // 这里this.changeWeather 是通过onClick的函数，所以this是丢失的，通过再次bind后就不会丢失了。
				return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}，{wind}</h1>
			}

			//changeWeather调用几次？ ———— 点几次调几次
			changeWeather(){
				//由于changeWeather是作为onClick的回调，所以不是通过实例调用的，是直接调用
				//类中的方法默认开启了局部的严格模式，所以changeWeather中的this为undefined
				
				console.log('changeWeather');
				//获取原来的isHot值
				const isHot = this.state.isHot
				//严重注意：状态必须通过setState进行更新,且更新是一种合并，不是替换。
				this.setState({isHot:!isHot})
				console.log(this);

				//严重注意：状态(state)不可直接更改，下面这行就是直接更改！！！
				//this.state.isHot = !isHot //这是错误的写法
			}
		}
		//2.渲染组件到页面
		ReactDOM.render(<Weather/>,document.getElementById('test'))
```

**开发写法**

> 开发这种写法可以为我们省下很多代码，把construcoor中的内容搬出来写。一种更加简洁的书写方式。

```js
//1.创建组件
	class Weather extends React.Component{
		//初始化状态，这就像普通的对象赋值操作一般
		state = {isHot:false,wind:'微风'}

		render(){
			const {isHot,wind} = this.state
			return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}，{wind}</h1>
		}

		//自定义方法————要用赋值语句的形式+箭头函数，箭头函数去外层找this，找到初始化实例对象的 Weather 类。
		changeWeather = ()=>{
			const isHot = this.state.isHot
			this.setState({isHot:!isHot})
		}
	}
	//2.渲染组件到页面
	ReactDOM.render(<Weather/>,document.getElementById('test'))
		
```

#### 2.规范

```
建议使用 eslint stylelint pretter 

组件一般采用大驼峰命名规则，比如下面这种。 
component/pages「视图」。 模块/功能进行目录结构划分
			└─ User
			    ├─ Form.jsx「尽量写jsx」
			    	class Form extends Component {}，好处就是出错时 React Dev工具进行调试非常方便
			    	如果想避免重名 可以使用这种 class UserForm extends Component {}
			    └─ List.jsx
 
 这些规范定下来之前，每个人都会有想法的，一定要好好沟通，确定下来后务必遵循。
 以后想到了再来补充。  
```

#### 3.Context

> 一种组件通信方式，常用于祖组件和后代组件间通讯

使用

```js
1.创建Context容器对象：
  语法 const XxxContext = React.createContext()
  
2.渲染子组件时，外面包裹XxxContext.Provider,通过value属性给后代组件传递数据：
	<XxxContext.Provider value = {数据}> 子组件 </XxxContext.Provider>
Provider在我们的redux中也用到过。
	
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
//   state = { userName: "果汁", age: 24 };

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
  const [state] = React.useState({ userName: "果汁", age: 24 });

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

#### 4.PureComponent

> 可以关注 PureComponent VS Component
>
> Component的2个问题
>
> 1.只要执行setState(),即使不改变状态，组件也会重新render() 
>
> 2.只当前组件重新render()  就会自动重新render子组件，即使子组件没有使用到props。

**解决Component低效问题**

```
1.上面的问题虽然可以通过声明周期钩子函数 shouldComponentUpdate(nextProps，nextState) 可以控制，当传递数据多的时候不过挺鸡肋的。
2.使用PureComponet
	PureComponet重写了shouldComponentUpdate(),只有state或props数据有变化才返回true
	注意：
		只进行state和props数据的浅比较，如果只是数据对象内部数据变量，返回false。
		不能直接修改state数据，而是要产生新数据
推荐：项目汇总一般使用PureComponent来优化
```

#### 5.render props

**如何向组件内部动态传入带内容的结构（标签）？**

> Vue 使用slot
>
> React  
>
>  1.使用children props 通过组件标签传入结构
>
>  2.使用render props 通过组件标签属性传入结构，而且可以携带数据，一般涌render函数属性

**children props**

```
<A> 
	<B/>
</A>
组件A 使用 this.props.children 即可渲染B组件，问题：但是组件B想不了组件A的数据
```

**render props**

```
<A render={data=> <B data ={data}> </B>} ></A>
A组件：this.props.render 将state数据传入
B组件：读取A组件传入的数据显示 {this.props.data}
```

#### 6.错误边界

> 错误边界(Error boundary):用来捕获后代组件错误，渲染备用页面
>
> 局限只能捕获后代组件生命周期产生的错误，不能捕获自己组件产生的错误和其他组件的合成事件，定时器中产生的错误

```
getDerivedStateFromError 和 componentDidCatch

static getDerivedStateFromError(error){} // 生命周期函数，一旦后代组件报错，就会触发，通过状态判断是否渲染子组件或报错页面

componentDidCatch(error,info){} // 统计页面的错误，可以发送给后台。
```

#### 7.组件通信

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

####  HOC（高阶组件）

