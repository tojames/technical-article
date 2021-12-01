# 类class

在 ES6 规范中，引入了 `class` 的概念。使得 `JavaScript` 开发者终于告别了，直接使用原型对象模仿面向对象中的类和类继承时代。

但是  `JavaScript`  中并没有一个真正的 `class` 原始类型， `class` 仅仅只是对原型对象运用语法糖。所以，只有理解如何使用原型对象实现类和类继承，才能真正地用好 `class`。

**其实就是构造函数写起来太麻烦了，用类会更加的优雅。**

## 构造函数的写法

```js
function Foo(height){
　this.height = height;
}

Foo.prototype.bar = function(){ 
　console.log('给原型新增方法');
}

let f = new Foo (10);
console.log(f.height); // 10
 f.belief() // 给原型新增方法


然后看见上面构造函数的写法,写起来也还行,接下来看下面的
```

## **class**

> class是构造函数的语法糖。 即 class 的本质是 构造函数。class继承「extends  」的本质为构造函数的原型链的继承。虽然用了class关键字,但是最后面运行的时候会转换为构造函数运行。

### 普通使用方式

```js
// 定义一个名字为Person的类
class Person{  
  // 每个类都必须要有一个 constructor构造方法，用来接收参数
  // 如果没有显示声明，js 引擎会自动给它添加一个空的构造函数
  // 定义于 constructor 内的属性和方法，即定义在 this 上，属于实例属性和方法，
  // 否则属于原型属性和方法。
　constructor(name){
   	 // this代表实例对象
　　　this.name = name;  
　}
 	// 这是一个类的方法，注意千万不要加上function
　say(){  
　　　return  this.name
　}
  // 获取当前类名
  getClassName() {
    console.log(Person.name)
  }
  // 获取get 设置值set
  get myname() {
    return 'getter ' + this.name
  }
  set myname(val) {
    console.log('setter ' + val)
  }
}
var p = new Person('juice')
console.log(p.name)
console.log(p.say())
console.log(p.hasOwnProperty('name')) // true 验证当前的属性或者方法是实例上面传过来的还是原型链上面的.
console.log(p.hasOwnProperty('say')) // false
console.log(p.myname) // 直接调用类里面的get方法然后拿到值
console.log((p.myname = 'Juice')) // 直接调用类里面的set方法,执行完代码之后,返回设置的值.
```



### 静态方法

`static` 关键字用来定义一个类的一个静态方法。

调用静态方法不需要实例化该类，但不能通过一个类实例调用静态方法。

静态方法通常用于为一个应用程序创建工具函数。

注意：静态方法可以被子类继承

```js
定义
class Person {
   static staticsay() {
     console.log('hello,我是一个静态方法')
   }
}

Person.staticsay()
子类可以调用父类的静态方法
class Child extends Person {}
Child.staticsay()
```

### 私有属性&&私有方法 #

从类外部引用私有字段是错误的。它们只能在类里面中读取或写入。

这样做的好处是，通过定义私有属性/私有方法，可以确保类的用户不会依赖于内部，因为内部可能在不同版本之间发生变化。

```js
class Person {
  #height
  constructor(width, height) {
    this.width = width
    this.#height = height
  }
  #getHeight() {
    return this.#height
  }
  getPrivateProp() {
    return this.#height
  }
  getPrivateMethod() {
    return this.#getHeight()
  }
}
let p = new Person(10, 20)
console.log(p)
console.log(p.width)
// Uncaught SyntaxError: Private field '#height' must be declared in an enclosing class
// p.#height // 这里外面使用的话，会报错说，私有字段只能在calss中定义使用
// p.#getHeight() // 同上
console.log(p.getPrivateProp())
console.log(p.getPrivateMethod())
```



### 继承 extends/super

```js
// 调用 父对象/父类 的构造函数
1.super([arguments]); 

// 调用 父对象/父类 上的方法
2.super.functionOnParent([arguments]); 


// 在构造函数中使用时，super关键字将单独出现，并且必须在使用this关键字之前使用。super关键字也可以用来调用父对象上的函数。

3.extends关键字
// 用来创建一个普通类或者内建对象的子类。继承的.prototype必须是一个Object 或者 null。

// 父类
 class Parent {
    constructor(height, weight) {
        this.name = 'Parent';
        this.height = 180;
        this.weight = 80;
    }
    sayName() {
        console.log('Hi,我是父类', this.name + '.');
    }
   static staticSayName() {
        console.log('Hi,我是static父类', this.name + '.');
    }
}
// 子类继承方式一
class Son extends Parent {
  constructor(height, weight) {
    // 1. super的用法用于继承父类的this和他()里面是父类的参数
    // 2.如果这里的体重身高不写的话,super直接会去父类拿
    // 3.哪怕写成super(),也是回去父类拿参数,写了就替换。
    // super(height,weight)
    super()
    this.name = 'Son'
    this.height = height
  }
}
// Son {name: 'Son', height: 175, weight: 80}
const s = new Son(175)

// 子类继承方式二
class Son extends Parent {
  constructor(height, weight) {
    // 1. super的用法用于继承父类的this和他()里面是父类的参数
    super()
    this.name = 'Son'
    this.height = height
    this.weight = weight
  }

  getFatherMethod() {
    // 可以通过super调用父类的方法,当然this也是可以访问的
    super.sayName()
    // this.sayName()
  }
  getFatherProp() {
    // 继承属性，需要通过this去访问，通过super访问的话是有问题的
    return this.flag
  }
  static getFatherStaticMethod() {
    // 访问父类的静态方法
    super.staticSayName()
  }
}
const s = new Son(175, 70)
s.getFatherMethod() // Hi,我是父类Son.
console.log(s.getFatherProp())
Son.getFatherStaticMethod() // Hi,我是static父类 Son.
```

