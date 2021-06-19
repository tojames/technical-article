import { History } from "./base";
export default class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;

    // 确保hash模式下 有一个 / 路径
    ensureSlas();
  }

  // 获取当前hash值
  setUpHashListener() {
    // 拿到hash值
    window.addEventListener("hashchange", () => {
      this.transitionTo(getHash());
      // console.log(this.transitionTo(getHash()), " this.transitionTo(getHash());");
    });
  }

  // 根据url获取当前的hash值
  getCurrentLocation() {
    return getHash();
  }

  push(location) {
    this.transitionTo(location, () => {
      // 去更新hash值，hash虽然变化，代码有拦截，不会重复变化。
      window.location.hash = location;
    });
  }
}

function getHash() {
  return window.location.hash.slice(1);
}

function ensureSlas() {
  if (window.location.hash) return; // location.hash 有兼容性的，不考虑
  window.location.hash = "/";
}
