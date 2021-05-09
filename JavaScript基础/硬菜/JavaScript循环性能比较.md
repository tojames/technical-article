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
  // 因为这里使用了null，无论输入了 null 还是 undefined，都是只想window的
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

```

**for of**

> for of 循环底层机制
>
> Q1：迭代器iterator规范「具备next方法，每次执行返回一个对象，具备value/done属性」
>
> Q2：让对象具备可迭代性并且使用for of 循环

```

```

