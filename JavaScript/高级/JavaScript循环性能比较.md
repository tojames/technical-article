# JavaScript循环性能比较



**for循环和wihile循环**

```js
let arr = new Array(999999).fill(0);

console.time('For Start')
for(let i = 0; i < arr.length; i++ ){}
console.timeEnd('For End')

console.time('While Start')
let i = 0;
while( i < arr.length){
	i++
}
console.timeEnd("While End")

// 结论是他们性能差不多，区别在于里面的代码逻辑，是否在存在闭包和其他的变量内存引用
// 这里将声明变量i 将let 改为 var，两者性能差不多。使用let for会更好，因为for循环里面使用let存在存在块级作用域「用完就释放了」，而while在全局上面定义了，程序执行完了无法释放。就导致了两者性能差不多。
```

**forEach**

>  函数式编程和命令式编程的区别是什么？
>
> ​	函数式编程`forEach`这种就是函数式编程，输入参数，得到结果，灵活性低，效率高。
>
> ​	命令式编程`for`这种就是命令式编程，所有东西都是可控的，灵活性高，效率低。

```js
console.time('ForEach Start')
arr.forEach((item,index)=>{})
console.time('ForEach End')

// 性能稍微比while和for性能慢一些
// 底层原理是使用for循环


Array.prototype.forEach = function (callback,context){
  let arr = this,
  		len = arr.length,
      i = 0
  // 因为这里使用了null，无论输入了 null 还是 undefined，都是指向window的
  context = context == null ? window :context
  for(;i<len;i++){
    
    typeof callback === 'function' ? callback(arr[i],i,context) : null
  }
}
```

**for in**

> for in 循环的BUG及解决方案
>
> Q1：迭代所有可枚举属性「私有&公有」，按照原型链一级级查找很耗性能
>
> Q2：问题很多：不能迭代Symbol属性、迭代顺序会以数字属性优先，公有可枚举的{一般是自定义属性}属性也会进行迭代

```
最慢
```

**for of**

> for of 循环底层机制
>
> Q1：迭代器iterator规范「具备next方法，每次执行返回一个对象，具备value/done属性」
>
> Q2：让对象具备可迭代性并且使用for of 循环
>
> iterator 迭代器
>
>  部分数据结构实现了迭代器规范
>
> ​	拥有属性「Symbol.iterator」即可
>
> ​	数组/Set/Map...「对象和类数组没有实现」
>
> ​	for of循环的原理是按照迭代器规范遍历的
>
> 



```js

for of 的时间是比while，for 都要慢一些，但是比for in快。

// 如何让不具备迭代器规范的 对象，类数组对象「函数的 arguments 对象是可以迭代的」 也可以使用for of
for of 循环的本质的寻找 原型上是否有「Symbol.iterator」

// 思路1:借助用这个对象的 Symbol.iterator
let obj = {
  0: 200,
  1: 300,
  2: 400,
  length: 3,
}
obj[Symbol.iterator] = Array.prototype[Symbol.iterator]
for (let val of obj) {
  console.log(val)
}

let obj = { a: 1 }
Object.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
for (const key of obj) {
  console.log(key)
}

// 思路2 自己再去实现一个迭代器规范
Object.prototype[Symbol.iterator] = function () {
        let that = this, // 当前对象
          i = 0,
          keys = Reflect.ownKeys(that) 
        	// Object.keys(self).concat(Object.getOwnPropertySymbols(self))

        return {
          next() {
            if (i >= that.length) {
              return {
                value: undefined,
                done: true,
              }
            } else {
              return {
                value: that[keys[i++]],
                done: false,
              }
            }
          },
        }
      }
      for (const key of obj) {
        console.log(key)
      }
let obj = {
    name: 'juice',
    age: 24
};
for (let value of obj) {
    console.log(value);
} 

```

