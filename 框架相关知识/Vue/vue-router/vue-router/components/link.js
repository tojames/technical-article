export default {
  name: "routerLink",
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "a",
    },
  },
  methods: {
    handler(to) {
      console.log(this.$router, "this")
      this.$router.push(to)
    },
  },
  render() {
    let { tag, to } = this
    // jsx 语法
    return <tag onClick={this.handler.bind(this, to)}>{this.$slots.default}</tag>
  },
}
