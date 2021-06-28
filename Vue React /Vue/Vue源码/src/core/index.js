import Vue from "./instance/index"; // 引入Vue
import { initGlobalAPI } from "./global-api/index"; // 全局api nexttick set Vue.use 等等
import { isServerRendering } from "core/util/env"; // 判断是否为服务端渲染
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext,
});

Vue.version = "__VERSION__";

export default Vue;
