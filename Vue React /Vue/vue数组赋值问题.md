# Vue数组的赋值问题

#### 解决办法一 ：

```js
// 这种办法并不是万能的
this.$set(target,key,value)
```

#### 解决办法二：

```js
// 当嵌套很深的时候这个方法比上面效果更好
// 对你所要操作的数组执行这些方法。
this.replenishSpouse.spouseImg['204'][1] = e; // 理想当然就是赋值，必须可以的呀，但是数组Vue是不支持这种操作的，需要通过数组方法才可以。

****************
this.replenishHolders.holdersImg['204'].splice(2,0) 
// 我是用了这种方法，splice(arrLenght,0) 
***************
// 以下操作可以引起界面刷新：push，pop ，unshift，shift，reverse，sort，splice
// 以下操作不会引起界面刷新：slice，concat ，filter
```

由于 JavaScript 的限制，Vue 不能检测以下变动的数组：

那么为什么那些方法可以响应式到data上面呢，是因为Vue对那些方法进行了一层封装。封装了之后调用

Object.defineProperty这个方法。自然问题得以解决。



