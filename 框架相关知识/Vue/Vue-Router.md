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

```



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



