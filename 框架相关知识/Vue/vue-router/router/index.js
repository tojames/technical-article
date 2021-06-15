import Vue from "vue"
import VueRouter from "../vue-router/index"
Vue.use(VueRouter)

export const constantRouterMap = [
  {
    path: "/",
    component: () => import("../views/layouts/index"),
    redirect: "/home",
    meta: {
      title: "首页",
      keepAlive: false,
      needLogin: false,
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("../views/home"),
        meta: { title: "首页", keepAlive: false, tabbarShow: true },
      },
      {
        path: "/about",
        name: "Home",
        component: () => import("../views/about"),
        meta: { title: "关于我", keepAlive: false },
      },
    ],
  },
]

const router = new VueRouter({
  // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
  mode: "hash",
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
})

router.matcher.addRoutes([{ path: "/auth", component: { render: (h) => h("auth") } }])

export default router

// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// // 权限   动态路由 修改的时候 需要调用该方法  重置路由
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

// // 1  路由守卫  进入页面之前
// router.beforeEach((to, from, next) => {
//   // 1 填写 页面标题
//   // document.title = to.meta.title
//   // 2 记录页面路由
//   dealWithRoute(from, to)
//   // 3 校验token  跳转路由
//   if (to.meta.needLogin && !localStorage.token) {
//     next({
//       path: 'login',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   } else {
//     next()
//   }
// })

// // 2  路由守卫
// router.afterEach(route => {
//   console.log('router.afterEach route ', route)
//   // 	if (route.meta.title && route.meta.isBack) {
//   // 	//是回退 才刷新
//   // 	if (document.title && document.title != route.meta.title) {
//   // 		location.reload(); //刷新页面标题  reload  document.title 会被置空
//   // 	} else {
//   // 		document.title = route.meta.title;
//   // 	}
//   // }
// })

// // Loading chunk 15 failed  有可能是更新的文件变更后hash 造成找不到原先缓存的文件造成的
// router.onError(error => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed) {
//     router.replace(targetPath)
//   }
// })
