/*
 * 面试必备:promise、async/await的细节点
 *   + ajax串行和并行
 *   + await异常处理
 * 思考：ajax并发管控
 *
 * 大部分人都不太会的generator和iterator
 *   + Iterator迭代器规范 && 具备迭代器规范的结构「Symbol.iterator」:数组结构、部分类数组「arguments/NodeList/HTMLCollection」、字符串、Set/Map、generator object...
 *   + for of循环的原理 && 如何让对象使用
 *   + generator基本语法(含传值)
 *   + 基于generator实现串行
 *
 * 课后：重写async/await源码(co.js)
 */

// 模拟数据请求
const queryCallback = (interval, callback) => {
  setTimeout(() => {
    if (typeof callback === "function") callback(interval);
  }, interval);
};
const queryPromise = (interval) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (interval === 2000) reject(interval);
      resolve(interval);
    }, interval);
  });
};
//==========================
// Iterator规范：迭代数据结构中的每一项
//   + 具备next方法
//   + 每一次执行next方法都可以获取到结构中的某一项 {value:迭代这一项的值,done:false/true}
/* class Iterator {
    constructor(assemble) {
        this.assemble = assemble;
        this.index = 0;
    }
    next() {
        if (this.index > this.assemble.length - 1) {
            return {
                value: undefined,
                done: true
            };
        }
        return {
            value: this.assemble[this.index++],
            done: false
        };
    }
}
let itor = new Iterator([10, 20, 30, 40]);
console.log(itor.next()); //{value:10,done:false}
console.log(itor.next()); //{value:20,done:false}
console.log(itor.next()); //{value:30,done:false}
console.log(itor.next()); //{value:40,done:false}
console.log(itor.next()); //{value:undefined,done:true} */

// for of底层处理机制，就是按照Iterator迭代器规范实现的
//   + 验证当前迭代的对象是否具备 Symbol.iterator 这个属性，如果不具备，则直接报错（例如：普通对象就不具备迭代器规范，所以不能使用for of循环）
//   + 具备这个属性，会把属性的值(函数)执行，返回一个具备迭代器规范的对象{有next方法}
//   + 每一轮迭代都是执行依次next，把获取对象中的value拿到，直到done为true的时候，停止迭代
/* let arr = [10, 20, 30, 40];
arr[Symbol.iterator] = function () {
    // this->arr
    let self = this,
        index = 0;
    return {
        next() {
            if (index > self.length - 1) {
                return {
                    value: undefined,
                    done: true
                };
            }
            return {
                value: self[index++],
                done: false
            };
        }
    };
};
for (let value of arr) {
    console.log(value);
} */

// 如何让一个对象也具备迭代器规范，也能使用for of循环
/* Object.prototype[Symbol.iterator] = function () {
    // this -> obj
    let self = this,
        keys = Object.keys(self).concat(Object.getOwnPropertySymbols(self)),
        index = 0;
    return {
        next() {
            if (index > keys.length - 1) {
                return {
                    value: undefined,
                    done: true
                };
            }
            return {
                value: self[keys[index++]],
                done: false
            };
        }
    };
};
let obj = {
    name: 'zhufeng',
    age: 12
};
for (let value of obj) {
    console.log(value);
} */

// generator：生成器函数
//   + 执行：并没有把函数体中的代码执行，她会返回一个具备迭代器规范的对象「next/return/throw/Symbol.iterator」
//   + 执行next方法才会把函数体中的代码执行
//   + 遇到yeild本次执行结束，返回有 value/done 的对象；value值是yeild后的结果！！
/* function* fn() {
    console.log('A');
    yield 1;
    console.log('B');
    yield 2;
    console.log('C');
    return 100;
}
let itor = fn();
console.log(itor.next()); //=>{value:1,done:false}
console.log(itor.next()); //=>{value:2,done:false}
console.log(itor.next()); //=>{value:100,done:true} */

/* function* fn() {
    let res = yield 1;
    console.log(res);
    res = yield 2;
    console.log(res);
    res = yield 3;
    console.log(res);
}
let itor = fn();
console.log(itor.next(100)); //=>{value:1,done:false}  第一次传递的参数没用
console.log(itor.next(200)); //=>{value:2,done:false}  第二次传递的参数是作为上一yeild的返回值的
console.log(itor.next(300)); //=>{value:3,done:false}
console.log(itor.next(400)); //=>{value:undefined,done:true} */

/* function* generator() {
    let result = yield queryPromise(1000); //yeild 后面是一个promise实例
    console.log(`第一个请求结果：${result}`);

    result = yield queryPromise(1001);
    console.log(`第二个请求结果：${result}`);

    result = yield queryPromise(1002);
    console.log(`第三个请求结果：${result}`);
}
let itor = generator();
itor.next().value.then(result => {
    itor.next(result).value.then(result => {
        itor.next(result).value.then(result => {
            itor.next(result);
        });
    });
});
// async/await:就是generator+promise的语法糖「co.js」

// 面试题：手撕 async + await 的源码 */

//==========================
(async function () {
  try {
    let val = await queryPromise(1000);
    console.log(1, val);

    val = await queryPromise(1001);
    console.log(2, val);

    val = await queryPromise(1002);
    console.log(3, val);
  } catch (err) {}
})();

queryPromise(1000)
  .then((val) => {
    console.log(1, val);
    return queryPromise(1001);
  })
  .then((val) => {
    console.log(2, val);
    return queryPromise(1002);
  })
  .then((val) => {
    console.log(3, val);
  });

// queryCallback(1000, (val) => {
//   console.log(1, val);
//   queryCallback(1001, (val) => {
//     console.log(2, val);
//     queryCallback(1002, (val) => {
//       console.log(3, val);
//     });
//   });
// });
