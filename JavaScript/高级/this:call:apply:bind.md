# this

> 我们一开始接触 this 的时候,肯定会有点迷惑得,就是觉得怎么有时候力不从心,感觉不是真正学会.
>
> 分为四个方面,优先级越往下越高
>
> - 默认绑定
> - 隐式绑定
> - 显示绑定
> - new 关键字

## 默认绑定

默认绑定的优先级最低，就是上面描述的中任何一个都可以去替换它。那么就只有一个 window。而且在严格模式不会出现默认绑定。
我慢慢解释.

```js
function foo() {
  console.log(this.a) // 这个this是指向window.因为在最外层,那么var声明变量是直接放在window的属性上面,所以当去访问他的属性的时候,可以访问到a.但是当我们es5上使用"use strict"的话,将不会存在window,因为这时的最外层对象是undefined就是不存在,所以会报错.
}
var a = 1
foo()
```

## 隐式绑定

隐式绑定一般发生在对象上调用的时候。

```js
var obj = {
	name : "Juice",
    age : 24,
    method : foo
}
function foo(){
    console.log(this)  // this 指向obj
    console.log(this.age) // 24
}
obj.method();  // 这里验证了那句,谁调用我就,我就指向谁.

// 我要变了.
var myMethod = obj.method; // 将obj.method的属性值是一个foo函数 赋值给myMethod,
myMethod();// 此时myMethod就是foo函数的一个引用,当调用的时候没有出现任何修饰符,那么就是默认绑定,是window.这种情况就出来的丢失隐式绑定
所以他打印的结果是: window undefined.

或许你理解不了,我可以提供一个方法给你
	就是真正调用的时候利用对象(这里的是obj)点语法点出来的,那么他的this指向obj，其实你看见这种说法特别多，但不全对啊。我觉得最关键的是，this执行主体，谁把它执行的，在哪创建，在哪执行都没有必然的关系。函数执行，看方法前面是否有“点”，没有“点”，this是window「严格模式下是undefined」，有“点”，“点”前面是谁this就是谁，这里的“点”是成员访问。
上面说了这些前提是函数里面没有显示绑定。
```

## 显式绑定

显式绑定就是通过我们自己来改变他的 this 指向,我们通常利用 call apply bind 来改变 this 的指向.这三者的区别不大。

- call(this,只接收一个个的参数,按照顺序接收)

- apply(this,[接收一个数组,把参数都放进去])

- bind(this,参数和 call 是一样的,但是区别就是 bind 只会生成一个新的指向函数,不会去执行,call,apply 都会去执行)


回到主题

```js
// 当我们想让this的指向方向改变,或者不受外界隐式应该使用显式绑定
比如刚刚上面的
var obj = {
  name: "Hello",
  age: 18,
  method: foo,
}
function foo() {
  // 当每次调用foo的时候,我在函数内部将this的指向指向了我希望的obj上面,你外面怎么改也是没有用的.
  bar.call(obj) // 这里是会去执行的bar这个函数.
  function bar() {
    console.log(this)
    console.log(this.age)
  }
}

obj.method() // obj 18

//我要变了.
var myMethod = obj.method // 将obj.method的属性值是一个foo函数 赋值给myMethod,
myMethod() // obj 18
```

## new 绑定

优先级最高的 new 绑定

关于 MDN 的描述是：new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。
用户定义的就是我们写的构造函数，内置对象就是一些比如 Date RegExp 等等

### new 原理介绍

```js
function Person(){
   this.name = 'Jack';
   return {age: 18}
}
var p = new Person();
console.log(p)  // {age: 18}
console.log(p.name) // undefined
console.log(p.age) // 18


new 关键字执行之后总是会返回一个对象
要么是实例对象，要么是return语句指定的对象

原生实现
new 关键字会进行如下的操作：
	1.创建一个空的简单JavaScript对象（即{}）
	2.新创建对象的__proto__，指向构造函数的原型对象
	3.执行构造函数，新创建对象作为this的上下文，通过apply，call
	4.如果构造函数没有返回对象，则返回新创建对象。
function _new(ctor, ...args) {
   if (typeof ctor !== "function") {
     throw "ctor must be a function"
   }
   let obj = {}
   // 创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
   obj.__proto__ = Object.create(ctor.prototype);
   let res = ctor.apply(obj, [...args])
   let isObject = typeof res === "object" && res !== null
   let isFunction = typeof res === "function"
   return isObject || isFunction ? res : obj
}
```

## 手撕 apply、call、bind

由于 apply 和 call 基本原理是差不多的，只是参数存在区别，因此我们将这两个的实现方法放在一起讲。

call 是单个参数按照顺序进行一个个放在函数调用里面

apply 是一个数组

```js
Function.prototype._call = function(context, ...args) {
  const key = Symbol('key')
  context[key] = this
  const res = context[key](...args)
  delete context[key]
  return res
}

// func.call(thisArg, param1, param2)
// 目的就是将 func 这个方法添加到 thisArg 下面，然后执行方法，接着删除这个属性，并把这个函数执行的结果返回出来，做到和普通函数一摸一样。


Function.prototype._bind = function(context, ...args) {
  let key = Symbol('key')
  context[key] = this
  return function() {
    return context[key]._call(context, ...args)
  }
}
// 间接调用了call，返回一个函数出来
```



## 谈谈你对this的了解及应用场景?

```js
// 函数执行，看方法前面是否有“点”，没有“点”，this是window「严格模式下是undefined」，有“点”，“点”前面是谁this就是谁
const fn = function fn() {
    console.log(this);
};
let obj = {
    name: 'OBJ',
    fn: fn
};
fn();
obj.fn();

// 给当前元素的某个事件行为绑定方法，当事件行为触发，方法中的this是当前元素本身「排除attachEvent」
document.body.addEventListener('click', function () {
    console.log(this);
});

// 构造函数体中的this是当前类的实例，因为new的时候执行显示绑定中任意一个方法。
function Factory() {
    this.name = 'Hello';
    this.age = 18;
    console.log(this);
}
let f = new Factory;

// 箭头函数中没有执行主体，所用到的this都是其所处上下文中的this
let demo = {
    name: 'DEMO',
    fn() {
        console.log(this); // demo
        setTimeout(function () {
            console.log(this); // window
        }, 1000);

        setTimeout(() => {
            console.log(this); demo
        }, 1000);
    }
};
demo.fn();

// 掌握this的好玩应用：鸭子类型
// 像鸭子，我们就说他是鸭子 -> 类数组像数组「结构、一些操作...」，我们让其用数组上的方法「不能直接用」
function func() {
    // console.log(arguments);
    // 把arguments变为数组,这样就可以用数组的办法了：Array.from/[...arguments]/...
    /!* let result = [];
    for (let i = 0; i < arguments.length; i++) {
        result.push(arguments[i]);
    } *!/
    //  Array.prototype.slice -> [].slice
    /!* let result = Array.prototype.slice.call(arguments);
    console.log(result); *!/

    [].forEach.call(arguments, item => {
        console.log(item);
    });
}
func(10, 20, 30);

// 	构造函数继承 前面继承有讲的。那么需要补充的是， Parent.call(this);  其实是执行Parent 然后将Parent的属性添加一份到当前的this上面「不包含prototype的方法和属性」。
看不懂的可以来这里看 https://juejin.cn/post/7017335994961625102 


// 难度比较高的多层级调用
var name = "Hello Word";
function A(x, y) {
  var res = x + y;
  console.log(res, this.name);
}
function B(x, y) {
  var res = x - y;
  console.log(res, this.name);
}
B.call(A,40,30); // 10 A
B.call.call.call(A, 20, 10); // NaN undefined
// 第一步：this === B.call.call  context === A
// 第二步：context.fn = this;context.fn(20,10) === B.call.call(20,10)「单独拿出去会报错」
// 第三步：this === A context === 20,这里的this是A的原因可能是最外层的this不能更改的原因吧
// 第四步：context.fn = A; context.fn(10) === 20.A(10)。所以call只要调用了两次以上一定是去调用this这个对象
Function.prototype.call(A,60,50); // 空函数，不打印
Function.prototype.call.call.call(A,80,70); // 同上


// 
let obj = {
  a: 1,
  f () {
    return this.a
  }
}
const r = obj.f.bind({ a: 2 }).bind({ a: 3 }).call({ a: 4 })
console.log(r) // 2


(function() {
	var slice = Array.prototype.slice
	Function.prototype.bind = function() {
	  var thatFunc = this,
	    thatArg = arguments[0]
	  var args = slice.call(arguments, 1)
	  if (typeof thatFunc !== 'function') {
	    throw new TypeError('Function.prototype.bind - ' + 'what is trying to be bound is not callable')
    }
    return function() {
      var funcArgs = args.concat(slice.call(arguments))
      return thatFunc.apply(thatArg, funcArgs)
    }
  }
})()

let obj = {
  a: 1,
  f() {
    return this.a
  }
}
// 复制上面的代码 自己断点
const r = obj.f.bind({ a: 2 }) // 第一步： 形成了一个闭包，保存在内存中 this指向是{a:2}的闭包
let r2 = r.bind({ a: 3 }) // 第二步：形成了一个闭包，保存在内存中，和第一个闭包不一样的，this指向是{a:3}的闭包
// 又由于 r 里面是一个闭包，神奇之处就在此，所以返回出去的还是第一步中的闭包
let r3 = r2.call({ a: 4 }) // 调用第一步返回的闭包函数，就打印了。
console.log(r3)


var c = 0;
var user = {
  b: {
    action: () => {
      console.log(this); // 浏览器全部是window，node是undefined 
      return this.c;
    },
    name: 'b',
  },
  c: 1,
  name: 'user',
};

var o = user.b;
var action = user.b.action;

console.log(user.b.action()); // 0
console.log(o.action()); // 0
console.log(action()); // 0

var c = 0;
var user = {
  b: {
    action: function () {
      console.log(this); 
      return this.c;
    },
    name: 'b',
  },
  c: 1,
  name: 'user',
};

var o = user.b;
var action = user.b.action;

console.log(user.b.action()); // undefined
console.log(o.action()); // undefined
console.log(action()); // 0
```

