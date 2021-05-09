# Asynchronous Javascript And XML

#### XHR

#### Axios

> Axios也是对ajax的封装，基于Promise管理请求，解决回调地狱问题（await）

#### fetch

> Fetch是ES6新增的通信方法，不是ajax，但是他本身实现数据通信，就是基于promise管理的





**限制并发数量**

```js
1、解决方案一 使用 https://www.npmjs.com/package/asyncpool

2、手写解决方案

const delay = function delay(interval) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(interval);
        }, interval);
    });
};
let tasks = [() => {
    return delay(1000);
}, () => {
    return delay(1003);
}, () => {
    return delay(1005);
}, () => {
    return delay(1002);
}, () => {
    return delay(1004);
}, () => {
    return delay(1006);
}];

/*
 * JS实现Ajax并发请求控制的两大解决方案
 */
// tasks：数组，数组包含很多方法，每一个方法执行就是发送一个请求「基于Promise管理」

function createRequest(tasks, pool) {
    pool = pool || 5;
    let results = [],
        together = new Array(pool).fill(null),
        index = 0;

    // 并发数组，通过promise
    together = together.map(() => {
        return new Promise((resolve, reject) => {
            const run = function run() {
              // 没有更多任务了，返回出去
                if (index >= tasks.length) {
                    resolve();
                    return;
                };
                let old_index = index,
                    task = tasks[index++];
                task().then(result => {
                    results[old_index] = result;
                    run();
                }).catch(reason => {
                    reject(reason);
                });
            };
            run();
        });
    });
    return Promise.all(together).then(() => results);
} 


createRequest(tasks, 2).then(results => {
    // 都成功，整体才是成功，按顺序存储结果
    console.log('成功-->', results);
}).catch(reason => {
    // 只要有也给失败，整体就是失败
    console.log('失败-->', reason);
});




```

