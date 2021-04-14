class Promise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw TypeError(`Promise resolver ${executor} is not a function`)
    }
    this.initStatus()

    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      console.log(error)
    }
  }
  initStatus = () => {
    this.status = Promise.PENDING // 状态
    this.value = null // 终值
    this.reject = null // 拒绝理由
    this.onFulfilledCallback = [] // 成功的回调
    this.onRejectCallback = [] // 失败的回调
  }
  resolve = (value) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFFILLED
      this.value = value
      this.onFulfilledCallback.forEach((item) => item(value))
    }
  }

  reject = (reject) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED
      this.reject = reject
      this.onRejectCallback.forEach((item) => item(reject))
    }
  }

  then = (onFulfilled, onReject) => {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => {
        return this.value
      }
    }
    if (typeof onReject !== "function") {
      onReject = () => {
        return this.reject
      }
    }

    let promise2 = new Promise((resolve, reject) => {
      console.log(this, "this")
      if (this.status === Promise.FULFFILLED) {
        setTimeout(() => {
          let x = onFulfilled(this.value) // 这里就已经把 值传出去了
          resolve(x)
        })
      }
      if (this.status === Promise.REJECTED) {
        setTimeout(() => {
          let x = onReject(this.reject)
          resolve(x)
        })
      }

      if (this.status === Promise.PENDING) {
        this.onFulfilledCallback.push((value) => {
          let x = onFulfilled(value)
          console.log(111)
          resolve(x)
        })
        this.onRejectCallback.push((reject) => {
          let x = onReject(reject)
          console.log(222)
          resolve(x)
        })
      }
    })
    return promise2
  }
}

Promise.PENDING = "pending"
Promise.FULFFILLED = "fulfilled"
Promise.REJECTED = "rejected"

module.exports = Promise
