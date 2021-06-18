import Vue from "vue";
import VueRouter from "../vue-router/index";
Vue.use(VueRouter);

const constantRouterMap = [
  {
    path: "/home",
    component: () => import("../views/home"),
  },
  {
    path: "/layout",
    component: () => import("../views/layouts/index"),
    children: [
      {
        path: "/about",
        component: () => import("../views/about"),
      },
    ],
  },
];
const router = new VueRouter({
  // mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
  mode: "hash",
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

router.matcher.addRoutes([{ path: "/auth", component: { render: (h) => h("auth") } }]);

export default router;

// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// // 权限   动态路由 修改的时候 需要调用该方法  重置路由
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

// // 1  路由守卫  进入页面之前
router.beforeEach((to, from, next) => {
  console.log("router.beforeEach");
  setTimeout(() => {
    // 迭代器，next执行完毕
    next();
  }, 1000);
});

router.afterEach((to, from, next) => {
  console.log("router.afterEach");
  setTimeout(() => {
    // 迭代器，next执行完毕
    next();
  }, 1000);
});

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
