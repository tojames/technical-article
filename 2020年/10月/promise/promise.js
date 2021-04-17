class Promise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.initState();

    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(e);
    }
  }
  initState = () => {
    this.state = Promise.PENDING; // 状态
    this.value = null; // 终值
    this.reason = null; // 拒绝理由
    this.onFulfilledCallback = []; // 成功的回调
    this.onRejectedCallback = []; // 失败的回调
  };
  resolve = (value) => {
    if (this.state === Promise.PENDING) {
      this.state = Promise.FULFILLED;
      this.value = value;
      this.onFulfilledCallback.forEach((item) => item(value));
    }
  };

  reject = (reason) => {
    if (this.state === Promise.PENDING) {
      this.state = Promise.REJECTED;
      this.reason = reason;
      this.onRejectedCallback.forEach((item) => item(reason));
    }
  };

  then = (onFulfilled, onRejected) => {
    // 参数校检
    if (typeof onFulfilled !== "function") {
      onFulfilled = function (value) {
        return value;
      };
    }
    if (typeof onRejected !== "function") {
      onRejected = function (reason) {
        throw reason;
      };
    }

    // 实现链式调用, 且改变了后面then的值, 必须通过新的实例
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === Promise.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === Promise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === Promise.PENDING) {
        this.onFulfilledCallback.push((value) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.onRejectedCallback.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  };
}

Promise.PENDING = "pending";
Promise.FULFILLED = "fulfilled";
Promise.REJECTED = "rejected";
Promise.resolvePromise = (promise2, x, resolve, reject) => {
  let isCalled = false;
  // x 为OnFilflled的返回值
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  } // 判断是否为Promise
  else if (x instanceof Promise) {
    x.then(
      (value) => {
        // resolve(value);
        Promise.resolvePromise(promise2, value, resolve, reject);
      },
      (reason) => {
        reject(reason);
      }
    );
  } // 判断是否为对象或者函数时
  else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 这个try catch 是因为 x.then 可能会在 objdefinedPropety 中 可能报错，这里捕获一下
    try {
      const then = x.then;
      // 函数的时候
      if (typeof then === "function") {
        // 指向丢失重新绑定
        then.call(
          x,
          (value) => {
            if (isCalled) return;
            isCalled = true;
            // resolve(value);
            Promise.resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (isCalled) return;
            isCalled = true;
            reject(reason);
          }
        );
        // 对象的时候
      } else {
        if (isCalled) return;
        isCalled = true;
        resolve(x);
      }
    } catch (e) {
      if (isCalled) return;
      isCalled = true;
      reject(e);
    }
  } // 普通值
  else {
    // 为普通值的时候直接返回即可
    resolve(x);
  }
};

// module.exports = Promise;

// 1、先在后面加上下述代码
// 2、npm 有一个promises-aplus-tests插件 npm i promises-aplus-tests -g 可以全局安装 mac用户最前面加上sudo
// 3、命令行 promises-aplus-tests [js文件名] 即可验证
// 目前是通过他测试 他会测试一个对象
// 语法糖
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
// npm install promises-aplus-tests 用来测试自己的promise 符不符合promisesA+规范
