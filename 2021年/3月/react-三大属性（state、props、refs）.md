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
```



触发setState到底做了什么？



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