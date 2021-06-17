import createRouteMap from "./create-route-map";
import { createRoute } from "./mode/base";

export default function createMatcher(routes) {
  // console.log(routes, "routes")
  let { pathMap } = createRouteMap(routes); // 扁平化配置

  const addRoutes = function (routes) {
    createRouteMap(routes, pathMap);
  };
  const match = function (location) {
    // 找到之后还需要找到父级的，通过while
    let record = pathMap[location];
    if (record) {
      return createRoute(record, { path: location });
    }
    // 当没有匹配到记录的时候
    return createRoute(null, {
      path: location,
    });
  };
  return {
    addRoutes, // 动态添加路由
    match, // 匹配路由
  };
}
