### react-router-dom

react-router 有web「浏览器」 、 native「原生app」、anywhere「都可以使用」区分。 

[react-router-dom（web）](https://react-router.docschina.org/)

只对常用的进行总结。

**1、基础api的使用**

```js
cnpm install react-router-dom

import React from 'react'
import { 路由组件 } from 'react-router-dom' // 组件基本都是要引入的

1、<BrowserRouter> 、<HashRouter>
		  这两个组件定义使用那种路由模式
		  BrowserRouter： 原理：pushState，replaceState 和 popstate 事件，使用 HTML5 历史 API 记录。
			HashRouter：原理：window.location.hash 由于历史记录不支持 location.key 或 location.state，官方推荐					使用BrowserRouter，不过需要服务器配合一起使用。
		 使用 在app.js 根组件中使用 
		 ReactDOM.render(
			<BrowserRouter>
				<App/>
			</BrowserRouter>,
			document.getElementById('root')
		)

2、<Link> 
  声明式导航
		import { Link } from 'react-router-dom'
		<Link to="/about">About</Link> 
			to：`string`， url，search和 hash 属性创建。 <Link to='/courses?sort=name'/> 使用频率更高
		  to:	`object`,
		    <Link to={{
		  		pathname: '/courses',
		  		search: '?sort=name',
		  		hash: '#the-hash',
		  		state: { fromDashboard: true }}}/>
			replace：当前栈替换栈最外层。
  
3、<NavLink> 
  对link再封装了一层
  一个特殊版本的 Link，当它与当前 URL 匹配时，为其渲染元素添加样式属性。
		import { NavLink } from 'react-router-dom'
		<NavLink to="/about">About</NavLink>
			activeClassName: string，类名
		  activeStyle: object，行内样式
			...以后再补充。

4、<Redirect>  
  重定向
  渲染 <Redirect> 将使导航到一个新的地址。这个新的地址会覆盖 history 栈中的当前地址，类似服务器端（HTTP 3xx）的重定向。
  to：string
  to：object
  
  
5、<Route> 
  注册路由
		Route 组件也许是 React Router 中最重要的组件，它最基本的职责是在 window.location 与 Route 的 path 匹配时呈现一些 UI。
	<Route path="/" component={Home}/>
  component 只有当位置匹配时才会渲染的 React 组件。
  官网解析： 当您使用 component（而不是 render 或 children ）Route 使用从给定组件 React.createElement 创			建新的 React element。这意味着，如果您为 component 道具提供了内联功能，则每次渲染都会创建一个新组件。这		会导致现有组件卸载和安装新组件，而不是仅更新现有组件。当使用内联函数进行内联渲染时，使用 render 或者			children
  	render: func
  	这允许方便的内联渲染和包裹，当然里面可以包含标签，组件，那么又是会触发React.createElement，有时就不会。
		警告： <Route component> 优先于 <Route render> 因此不要在同一个 <Route> 使用两者。
		children: func 大部分情况下和render差不多
  	
  	Route props 所有三种渲染方法都将通过相同的三个 Route 属性。
			match
			location
			history
  
 	path: string   任何 path-to-regexp 可以解析的有效的 URL 路径
  exact: bool 如果为 true，则只有在路径完全匹配 location.pathname 时才匹配。 涉及到路由嵌套的时候
  一般不会开的
  
6、<Switch> 
  渲染与该地址匹配的第一个子节点 <Route>「后面的<Route>不在匹配」 或者 <Redirect>。
	<Switch> 的独特之处在于它专门呈现路由
	场景：
			<Route path="/about" component={About}/>
			<Route path="/:user" component={User}/>
			<Route component={NoMatch}/>
如果 URL 是 /about ， 那么 <About> ， <User> ， <NoMatch>将全部渲染，因为他们都与路径匹配。这是通过设计实现的，允许我们以多种方式将 <Route> 组合到应用程序中，类似侧边栏（sidebars）和面包屑导航（breadcrumbs）， bootstrap 标签等等，但是有时候我们只想选择一条 <Route> 进行渲染，如果我们在 /about ，我们又不想匹配 /:user （或者显示404）。以下是如何使用 Switch 执行此操作:

使用Switch
<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/about" component={About}/>
  <Route path="/:user" component={User}/>
  <Route component={NoMatch}/>
</Switch>

现在，如果我们在 /about ，<Switch> 将开始查找匹配的 <Route> ，<Route path="/about”/><Switch> 将停止查找匹配项并渲染 <About> ，同样，如果是 /Michael ，则 < User > 将渲染。


7、history 
		依赖 history 包 ，在不同的 Javascript 环境中，它提供多种不同的形式来实现对 session 历史的管理。
		history 对象通常会具有以下属性和方法：
			length - (number 类型) history 堆栈的条目数
			action - (string 类型) 当前的操作(PUSH, REPLACE, POP)
			location - (object 类型) 当前的位置。location 会具有以下属性：
				pathname - (string 类型) URL 路径
				search - (string 类型) URL 中的查询字符串
				hash - (string 类型) URL 的哈希片段
				state - (object 类型) 提供给例如使用 push(path, state) 操作将 location 放入堆栈时的特定 		location 状态。只在浏览器和内存历史中可用。
			push(path, [state]) - (function 类型) 在 history 堆栈添加一个新条目
			replace(path, [state]) - (function 类型) 替换在 history 堆栈中的当前条目
			go(n) - (function 类型) 将 history 堆栈中的指针调整 n
			goBack() - (function 类型) 等同于 go(-1)
			goForward() - (function 类型) 等同于 go(1)
			block(prompt) - (function 类型) 阻止跳转。(详见 history 文档)。
 注意：history 对象是可变的，因此我们建议从 <Route> 的渲染选项中来访问 location。`外层的location`
 
 8、location 
 		代表应用程序现在在哪，或者甚至它曾经在哪。
			router 将在这几个地方为您提供一个 location 对象：
			Route component as this.props.location
			Route render as ({ location }) => ()
			Route children as ({ location }) => ()
			withRouter as this.props.location

9、match
		一个 match 对象中包涵了有关如何匹配 URL 的信息。match 对象中包涵以下属性：
			params - (object) key／value 与动态路径的 URL 对应解析
			isExact - (boolean) true 如果匹配整个 URL （没有结尾字符）
			path - (string) 用于匹配的路径模式。被嵌套在 <Route> 中使用
			url - (string) 用于匹配部分的 URL 。被嵌套在 <Link> 中使用
			你将会在这些地方用到 match 对象：
			
			Route component 例如 this.props.match
			Route render 例如 ({ match }) => ()
			Route children 例如 ({ match }) => ()
			withRouter 例如 this.props.match
			matchPath 例如 返回值
 
10、withRouter 
	将不是路由组件包装一下，是当前组件拥有history、location、match 属性。
			您可以通过 withRouter 高阶组件访问 history 对象的属性和最近的 <Route> 的 match 。 当路由渲染时， 				withRouter 会将已经更新的 match ， location 和 history 属性传递给被包裹的组件。

const CommonetNameRouter = withRouter(CommonetName)
```

**2、嵌套路由**

```
路由组件的嵌套，
一层层嵌套即可，只要通过path 跳到相应的组件，
```

**3、路由参数**

```js
路由组件和一般组件的区别：路由组件有以下三个属性 history、location、match
history： 一般用在编程式导航
location：取参数，获取当前路由位置
match：去参数

1.params 使用频率最高
		传：<Link to={`routerUrl/${id}/${title}`}>children内容</Link>
		容器：<Route path="/routerUrl/:id/:title" component={ComponentName}/>
		ComponentName 中使用 const {id,title} = this.props.match.params
		取：const {id,title} = this.props.match.params
2.search
		传：<Link to={`/routerUrl/?id=${id}&title=${title}`}>{title}</Link>
		search参数无需声明接收，正常注册路由即可
		容器：<Route path="routerUrl" component={ComponentName}/>
		取：import qs from 'querystring'
			const {search} = this.props.location
			const {id,title} = qs.parse(search.slice(1))
3.state
    传：<Link to={{/pathname:'/routerUrl',state:{id:id,title:title}}}>{title}</Link>
		state参数无需声明接收，正常注册路由即可
		容器：<Route path="routerUrl" component={ComponentName}/>
		取：const {id,title} = this.props.location.state
```

**5、编程式导航**

```js
push跳转+携带params参数
this.props.history.push(`/routerUrl/${id}/${title}`)

push跳转+携带search参数
 this.props.history.push(`/routerUrl?id=${id}&title=${title}`)

push跳转+携带state参数
this.props.history.push(`/routerUrl`,{id,title})
```

**5、路由懒加载**

```js
需要路由懒加载的原因是，当项目很大的时候，一次性加载的话会很慢。
当使用了路由懒加载的话，只加载必须的组件，其他非必须的组件当触发到location变化才发起请求把数据拉回来
import React, { Component,lazy,Suspense} from 'react'  

const ComponentName = lazy(()=> import('./ComponentName') ) // 使用的引用方式


import Loading from './Loading'
const Home = lazy(()=> import('./Home') )
const About = lazy(()=> import('./About'))

export default class Demo extends Component {
	render() {
		return (
			<div>
				<div className="row">
					<div className="col-xs-offset-2 col-xs-8">
						<div className="page-header"><h2>React Router Demo</h2></div>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-2 col-xs-offset-2">
						<div className="list-group">
							{/* 在React中靠路由链接实现切换组件--编写路由链接 */}
							<NavLink className="list-group-item" to="/about">About</NavLink>
							<NavLink className="list-group-item" to="/home">Home</NavLink>
						</div>
					</div>
					<div className="col-xs-6">
						<div className="panel">
							<div className="panel-body">
                // Suspense 包裹可以实现懒加载，fallback 当还在加载的过程中渲染 <Loading/> 组件
								<Suspense fallback={<Loading/>}>
									{/* 注册路由 */}
									<Route path="/about" component={About}/>
									<Route path="/home" component={Home}/>
								</Suspense>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
```

