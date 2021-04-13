class Promise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.initStatus();

    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      console.log(error);
    }
  }
  initStatus = () => {
    this.status = Promise.PENDING; // 状态
    this.value = null; // 终值
    this.reject = null; // 拒绝理由
  };
  resolve = (value) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFFILLED;
      this.value = value;
    }
  };

  reject = (reject) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED;
      this.reject = reject;
    }
  };

  then = (onFulfilled, onReject) => {
    console.log("执行了then", this.status);
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => {
        return this.value;
      };
    }
    if (typeof onReject !== "function") {
      onReject = () => {
        return this.reject;
      };
    }

    if (this.status === Promise.FULFFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === Promise.REJECTED) {
      onReject(this.reject);
    }
  };
}

Promise.PENDING = "pending";
Promise.FULFFILLED = "fulfilled";
Promise.REJECTED = "rejected";

module.exports = Promise;
