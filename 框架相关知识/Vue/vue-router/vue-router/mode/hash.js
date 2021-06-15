import { History } from "./base"
export default class HashHistory extends History {
  constructor(router) {
    super(router)
    this.router = router

    // 确保hash模式下 有一个 / 路径
    ensureSlas()
  }
  setUpHashListener() {
    // 拿到hash值
    return getHash()
  }
  getCurrentLocation() {
    window.addEventListener("hashchange", () => {
      this.transitionTo(getHash())
    })
  }
}

function getHash() {
  return window.location.hash.slice(1)
}

function ensureSlas() {
  if (window.location.hash) return // location.hash 有兼容性的，不考虑
  window.location.hash = "/"
}
