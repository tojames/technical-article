# 类class

在 ES6 规范中，引入了 `class` 的概念。使得 JS 开发者终于告别了，直接使用原型对象模仿面向对象中的类和类继承时代。

但是JS 中并没有一个真正的 `class` 原始类型， `class` 仅仅只是对原型对象运用语法糖。所以，只有理解如何使用原型对象实现类和类继承，才能真正地用好 `class`。

**其实就是构造函数写起来太麻烦了，用类会更加的优雅。**

## 构造函数的写法

```js
function Foo(name,age,sex){
　this.name = name;
　this.age = age;
　this.sex = sex;
}

Foo.prototype.belief = function(){ 
　console.log('量变是质变的必要准备，质变是量变积累到一定程度的必然结果！');
}

let f = new Foo ('juice',25,'男');
console.log(f.name,f.age,f.sex); // juice 25 , 男
 f.belief() // 量变是质变的必要准备，质变是量变积累到一定程度的必然结果！


然后看见上面构造函数的写法,写起来也还行,接下来看下面的
```

## **class**

> class是构造函数的语法糖。 即 class 的本质是 构造函数。class继承「extends  」的本质为构造函数的原型链的继承。虽然用了class关键字,但是最后面运行的时候会转换为构造函数运行。

```js
class Person{  // 定义一个名字为Person的类
  // 每个类都必须要有一个 constructor，如果没有显示声明，js 引擎会自动给它添加一个空的构造函数
  // 定义于 constructor 内的属性和方法，即定义在 this 上，属于实例属性和方法，否则属于原型属性和方法。
　　constructor(name,age){ // constructor是一个构造方法，用来接收参数
　　　　this.name = name;  // this代表实例对象
　　　　this.age = age;
    		this.#weight = 50 // 加了 # 就是代表私有属性，目前还在提议中
　　}
  	#getWeight(){ // 私有方法
      return this.#weight
    }
　　say(){  // 这是一个类的方法，注意千万不要加上function
　　　　return   this.name + this.age
　　}
  // 静态方法 通过Person.staticsay() 直接调用.静态方法可以被子类继承
   static staticsay () {
    console.log('hello,我是一个静态方法')
  }
  // 获取当前类名
   getClassName() {
      console.log(Person.name)
   }
  // 获取get 设置值set
  get myname() {
      return 'getter'
  }
 	set myname(val) {
 	    console.log('setter' + val)
 	}
}
var p = new Person('Atoe',25);
console.log(p.name,p.age);
console.log(p.say());
console.log(p.hasOwnProperty('name')); // true 验证当前的属性或者方法是实例上面传过来的还是原型链上面的.
console.log(p.hasOwnProperty('say')); // false
console.log(p.myname); // 直接调用类里面的get方法然后拿到值
console.log(p.myname ="Juice"); // 直接调用类里面的set方法,执行完代码之后,返回设置的值.
```



### 继承

```js
1.super([arguments]); 
// 调用 父对象/父类 的构造函数

2.super.functionOnParent([arguments]); 
// 调用 父对象/父类 上的方法

//在构造函数中使用时，super关键字将单独出现，并且必须在使用this关键字之前使用。super关键字也可以用来调用父对象上的函数。

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
// 子类
class Son extends Parent {
 constructor(height, weight) {
     super(width, height); // 1. super的用法用于继承父类的this和他()里面是父类的参数
  	 // 如果这里的体重身高不写的话,super直接会去父类拿(哪怕写成super(),也是回去父类拿参数),写了就替换。
     this.width = width;   
     this.height = weight;             
     this.name = 'Son';
 	}
 	get sonHeight() {
 	    return this.height 
 	}
 	set sonhHeight(value) {
 	        this.height = value;
 	}
 	getFatherMethods(){
 	  super.sayName(); // 2. 可以通过super调用父类的方法
 	}
 	static getFatherMethods(){
 	  super.staticSayName(); // 访问父类的静态方法
 	}
}
const fn = new Square(175, 70)
fn.getFatherMethods(); // Hi,我是父类 Parent. 这里输出Parent 因为在子类替换了.
```

