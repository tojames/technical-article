export default function applyMixin(Vue) {
  Vue.mixin({
    beforeCreate() {
      const options = this.$options // 获取optonApi的值
      if (options.store) {
        // 根实例
        this.$store = options.store
      } else if (options.parent && options.parent.$store) {
        // 给每个组件都赋值$store
        this.$store = options.parent.$store
      }
    },
  })
}
