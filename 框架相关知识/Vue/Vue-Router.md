# Vue-Router

hash模式和history原理，需要注意的是history需要启动vscode服务才可以跑起来

```html
<html>
  <head>
    <title></title>

    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />

    <style></style>
  </head>

  <body>
    <!-- <a href="#/a">/a</a>
    <a href="#/b">/b</a>
    <br /> -->

    <a onclick="goToA()">/a</a>
    <a onclick="goToB()">/b</a>

    <div id="app"></div>

    <script>
      // hash模式 利用的是hashchange的方法
      // const app = document.getElementById("app")
      // let fn = function () {
      //   app.innerHTML = window.location.hash
      // }
      // fn()
      // window.addEventListener("hashchange", fn)

      // history模式
      let fn2 = function () {
        app.innerHTML = window.location.pathname
      }
      function goToA() {
        console.log("AAA")
        history.pushState({}, null, "/a")
        fn2()
      }
      function goToB() {
        console.log("BBB")
        history.pushState({}, null, "/b")
        fn2()
      }
      window.addEventListener("popstate", fn2)
    </script>
  </body>
</html>

下面是Vue-Router源码的图解
```

![router-view](../../static/images/router-view.png)

[手撕源码仓库在这里](./vue-router)

```js
/* 
1. 根据Vue的特性， Vue提供一个install方法，我们只需通过Vue.use(xxx).
  所以在install中，注册全局组件 link view，暴露$router $route,将vue传进来
  在 beforeCreate 生命周期，为每个组件添加_routerRoot，并在根组件在加载的时候初始化操作,然后将当前的匹配的路由做成响应式
  由beforeCreate钩子执行init方法，开启监听路由变化
 */

/* 2.在我们书写Route规则的时候 new VueRouter({...}),通过option把参数传递进来，mode初始化hash实例/history实例 router则进行扁平化，并进行缓存起来
    addRoutes「动态添加路由」，match「匹配路由」，并对匹配到的路由进行赋值 router就是当前实例  current通过 transitionTo 调用updateRoute获取，
*/

/* 3.router-link/router-view 在install的时候已经注册在全局了，router-link 用于跳转，里面调用的是 push方法，push方法是 先是匹配router组件，然后通过给 window.location.hash赋值，
    当我们匹配到了组件后，router-view 渲染组件，如果多层router的话，根据深度「depth」来渲染每一个  
*/

摘自Vue-Router官网

完整的导航解析流程
导航被触发。
在失活的组件里调用离开守卫beforeRouteLeave(to,from,next)。
调用全局的beforeEach( (to,from,next) =>{} )守卫。
在重用的组件里调用 beforeRouteUpdate(to,from,next) 守卫。
在路由配置里调用beforeEnter(to,from,next)路由独享的守卫。
解析异步路由组件。
在被激活的组件里调用beforeRouteEnter(to,from,next)。
在所有组件内守卫和异步路由组件被解析之后调用全局的beforeResolve( (to,from,next) =>{} )解析守卫。
导航被确认。
调用全局的afterEach( (to,from) =>{} )钩子。 没有next方法
触发 DOM 更新。

```



#### 通过问题查漏补缺


```js
1.怎么在组件中监听路由参数的变化？
有两种方法可以监听路由参数的变化，但是只能用在包含<router-view />的组件内。
第一种 watch: {
    '$route'(to, from) {
        //这里监听
    },
},
第二种
beforeRouteUpdate (to, from, next) {
    //这里监听
},

  
2.切换路由后，新页面要滚动到顶部或保持原先的滚动位置怎么做呢？
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

3.如何获取路由传过来的参数？
路由有三种传参方式，获取方式各不相同。
	3.1 meta：路由元信息，写在routes配置文件中。
  3.2 query：
  	this.$route.push({
  	  path:'/home',
  	  query:{
  	      userId:123
  	  }
		})
		浏览器地址：http://localhost:8036/home?userId=123 
		获取方式：this.$route.query.userId
	3.3 params：这种方式比较麻烦。
  	首先要在地址上做配置
		{
		    path: '/home/:userId',
		    name: 'home',
		    component: load('home'),
		    meta: {
		        title: '首页'
		    },
		},
    访问传参
    const userId = '123'
		this.$router.push({ name: 'home', params: { userId } })
		注意用params传参，只能用命名的路由（用name访问），如果用path，params不起作用。
		this.$router.push({ path: '/home', params: { userId }})不生效。
		浏览器地址：http://localhost:8036/home/123
		获取方式：this.$route.params.userId

4.怎么实现路由懒加载呢？
function load(component) {
    //return resolve => require([`views/${component}`], resolve);
    return () => import(`views/${component}`);
}

const routes = [
    {
        path: '/home',
        name: 'home',
        component: load('home'),
        meta: {
            title: '首页'
        },
    },
]

5.如果vue-router使用history模式，部署时要注意什么？
要注意404的问题，因为在history模式下，只是动态的通过js操作window.history来改变浏览器地址栏里的路径，并没有发起http请求，当直接在浏览器里输入这个地址的时候，就一定要对服务器发起http请求，但是这个目标在服务器上又不存在，所以会返回404。
所以要在Ngnix中将所有请求都转发到index.html上就可以了。

location / {
    try_files  $uri $uri/ @router index index.html;
}
location @router {
    rewrite ^.*$ /index.html last;
}

6.Vue-Router有哪几种导航钩子
	导航钩子，主要用来作用是拦截导航，让他完成跳转或取消。
	有三种方式可以植入路由导航过程中：
		6.1.全局的 beforeEach、beforeResolve、afterEach
		6.2.单个路由独享的
				const router = new VueRouter({
    				routes: [
        				{
            				path: '/file',
            				component: File,
            				beforeEnter: (to, from ,next) => {
            				    // do someting
            				}
        				}]   
					});
		6.3组件级的 beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave
```

