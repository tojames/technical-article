// 即可扁平化 也可以重载路由
export default function createRouteMap(routes, oldPathMap) {
  let pathMap = oldPathMap || Object.create(null); // 防止空
  // 先序遍历
  routes.forEach((route) => {
    addRouteRecored(route, pathMap);
  });

  // console.log(pathMap, "pathMap")
  return {
    pathMap,
  };
}

function addRouteRecored(route, pathMap, parent) {
  // 当访问 / 时 应该渲染home组件
  let path = route.path;
  let recorde = {
    path,
    parent,
    component: route.component,
  };
  // 如果路由存在重复的，只以第一个为准
  if (!pathMap[path]) {
    pathMap[path] = recorde;
  }
  // 递归
  if (route.children) {
    route.children.forEach((childRoute) => {
      addRouteRecored(childRoute, pathMap, recorde);
    });
  }
}
