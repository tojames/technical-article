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
    this.onFulfilledCallback = []; // 成功的回调
    this.onRejectCallback = []; // 失败的回调
  };
  resolve = (value) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFFILLED;
      this.value = value;
      this.onFulfilledCallback.forEach((item) => item(value));
    }
  };

  reject = (reject) => {
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED;
      this.reject = reject;
      this.onRejectCallback.forEach((item) => item(reject));
    }
  };

  then = (onFulfilled, onReject) => {
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

    let promise2 = new Promise((resolve, reject) => {
      // 实例化promsie2
      if (this.status === Promise.FULFFILLED) {
        // 拿到状态
        setTimeout(() => {
          let x = onFulfilled(this.value); // 这里就已经把值传出去了
          // resolve(x); // 返回给下一个then
          Promise.resolvePromise(promise2, x, resolve, reject);
        });
      }
      if (this.status === Promise.REJECTED) {
        setTimeout(() => {
          let x = onReject(this.reject);
          Promise.resolvePromise(promise2, x, resolve, reject);
        });
      }

      if (this.status === Promise.PENDING) {
        this.onFulfilledCallback.push((value) => {
          let x = onFulfilled(value);
          console.log(111);
          Promise.resolvePromise(promise2, x, resolve, reject);
        });
        this.onRejectCallback.push((reject) => {
          let x = onReject(reject);
          console.log(222);
          Promise.resolvePromise(promise2, x, resolve, reject);
        });
      }
    });
    return promise2;
  };
}

Promise.PENDING = "pending";
Promise.FULFFILLED = "fulfilled";
Promise.REJECTED = "rejected";
Promise.resolvePromise = (newPromise, x, resolve, reject) => {
  let isCalled = false;
  // x 为OnFilflled的返回值
  if (newPromise === x) {
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  } // 判断是否为Promise
  else if (x instanceof Promise) {
    x.then(
      (value) => {
        // resolve(value);
        Promise.resolvePromise(newPromise, value, resolve, reject);
      },
      (reject) => {
        reject(reject);
      }
    );
  } // 判断是否为对象或者函数时
  else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 这个try catch 是因为 x.then 可能会在 objdefinedPropety 中 可能报错，这里捕获一下
    try {
      // 函数的时候
      if (typeof x.then === "function") {
        x.then(
          (value) => {
            if (isCalled) return;
            isCalled = true;
            // resolve(value);
            Promise.resolvePromise(newPromise, value, resolve, reject);
          },
          (reject) => {
            if (isCalled) return;
            isCalled = true;
            reject(reject);
          }
        );
        // 对象的时候
      } else {
        if (isCalled) return;
        isCalled = true;
        resolve(value);
      }
    } catch (e) {
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
//npm install promises-aplus-tests 用来测试自己的promise 符不符合promisesA+规范
