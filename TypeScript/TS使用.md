# TypeScript

> 微软的出品，以`JavaScript`为基础的语言，拓展了`JavaScript`「类型、」。`TypeScript`不能被`JavaScript`解析器直接执行，需要通过 `npm i -g typescript `执行 `tsc fileName -w`  编译成`JavaScript`才能执行。
>
> `TypeScript`拥有了静态类型，更加严格的语法，更强大的功能。`TypeScript`可以在代码执行前就完成代码的检查，减小了运行时异常的出现的几率。`TypeScript`代码可以编译为任意版本的`JavaScript`代码，可有效解决不同`JavaScript`运行环境的兼容问题。同样的功能，`TypeScript`的代码量要大于`JavaScript`，但由于`TypeScript`的代码结构更加清晰，变量类型更加明确，在后期代码的维护中`TypeScript`却远远胜于`JavaScript`。

添加了 类型，新特性，丰富配置选项、强大的开发工具



## 基本类型

### 类型声明

给变量设置了类型，使得变量只能存储某种类型的值，不符合规则时报错。

```ts
let 变量: 类型;

let 变量: 类型 = 值;

// 变量声明和赋值是同时进行的，TS编译器会自动判断变量的类型
let 变量 = true;  === let 变量: Boolean = true;

function fn(参数: 类型, 参数: 类型): 类型{
    ...
}
    
```



### 12种类型总结

|  类型   |       例子        |              描述              |
| :-----: | :---------------: | :----------------------------: |
| number  |    1, -33, 2.5    |            任意数字            |
| string  | 'hi', "hi", `hi`  |           任意字符串           |
| boolean |    true、false    |       布尔值true或false        |
| 字面量  |      其本身       |  限制变量的值就是该字面量的值  |
|   any   |         *         |            任意类型            |
| unknown |         *         |         类型安全的any          |
|  void   | 空值（undefined） |     没有值（或undefined）      |
|  never  |      没有值       |          不能是任何值          |
| object  |  {name:'juice'}   |          任意的JS对象          |
|  array  |      [1,2,3]      |           任意JS数组           |
|  tuple  |       [4,5]       | 元素，TS新增类型，固定长度数组 |
|  enum   |    enum{A, B}     |       枚举，TS中新增类型       |

#### 字面量

> 通过字面量可以确定变量的取值范围

```ts
let color: 'red' | 'blue' | 'black';
color = 'red' // color 只能在  'red' | 'blue' | 'black'中选择一个。

let num: 1 | 2 | 3 | 4 | 5;
num = 1 
```

#### any

> any 其实就像我们平时写 `JavaScript`一样没有类型限制一样

```ts
let myAny :any = 1 === let myAny = 1

myAny = 'string'
myAny = false

// 注意这是不好的写法， any类型可以给任意变量类型赋值。
let s : String
s = myAny
```

#### unknown

> 表示未知类型的值，和any有什么区别？

```ts
let myUnknown :unknown
myUnknown = false
myUnknown = "str"
myUnknown = 123

let num : number = 1
// 提示出错。
num = myUnknown

// 注意 unknown类型的变量，不能赋值给其他变量，这就是和any的区别。
```

#### void

> void 用来表示空，以函数为例，就表示没有返回值的函数

```ts
function test() :void{
  return undefined || null
}
```

#### never

> never 表示永远不会返回结果

```ts
function fn2(): never{
  throw new Error('报错了！');
}
```

#### object

> 指定普通对象、函数接收参数的声明

```ts
// 这种指定 object 很鸡肋，因为函数 和对象都没有做到限制
let o :object = {}
o = {}
o = function(){}

// 语法：{属性名:属性值,属性名:属性值}
// 在属性名后边加上?，表示属性是可选的
let o2 :{ name:string,age?:number }
o2 = {name:'juice',age:18}

// [propName:string]:any
let o3 :{ name:string, [propName:string]:any}
o3 =  {name:'juice',age:18,weight:65}

/*
*   设置函数结构的类型声明：
*       语法：(形参:类型, 形参:类型 ...) => 返回值
* */
let f : (name:string,age:number)=> number
f = function(name:string,age:number):number{
  return age
}
```

#### array

> 指定数字接收变量的限制

```ts
/*
*   数组的类型声明：
*       类型[]
*       Array<类型>
* */

let a : string[]
a = [ '1','2' ]

let a2:Array<number>
a2 = [1,2]
```

#### tuple

> `TypeScript` 新增元组，元组就是固定长度的数组

```ts
/*
*    语法：[类型, 类型, 类型]
* */

let t : [string,number]
t = ['juice',18]
```

#### enum

> `TypeScript` 新增

```ts
enum Gender{
  Male=1,  // 这里的数字可以任意指定，不指定就是从0开始
  Female
}

let i: {name: string, gender: Gender};
i = {
  name: 'juice',
  gender: Gender.Male // 将1赋值给gender
}

console.log(i.gender === Gender.Male); // true
```



## 类

> `TypeScript`也拓展了`JavaScript`关于类的写法
>
> 比如：抽象类

### 普通的写法

```ts
class Person{
  name:string
  age:number
  constructor(name:string, age:number){
    this.name = name
  }
  sayHello(){
  console.log('你好',this.name);
   
  }
}

let p = new Person('juice',18)
```

### 继承

> 和原来`JavaScript`的写法一致

```ts
class Parent{
  name:string
  age:number
  constructor(name:string, age:number){
    this.name = name
  }
  sayHello(){
  console.log('你好',this.name);
   
  }
}

class Child extends Parent{
    weight:number
    constructor( name:string,age:number, weight:number){
      // super一定要传参数，调用父类的constructor
      super(name,age)
      this.name = name
      this.age = age
      this.weight = weight
    }
}

let c = new Child('juice',18,65)

console.log(c);
```

###  抽象类

> `TypeScript`新增，abstract开头的类是抽象类，抽象类一般作用于父类，让他不能创建对象实例，只能用于继承。抽象类也可以添加抽象方法。



```ts
abstract class Parent{
  name:string
  age:number
  constructor(name:string, age:number){
    this.name = name
  }
    // 定义一个抽象方法
    // 抽象方法使用 abstract开头，没有方法体
    // 抽象方法只能定义在抽象类中，子类必须对抽象方法进行重写
  abstract sayHello():void;
}

class Child extends Parent{
    weight:number
    constructor( name:string,age:number, weight:number){
      super(name,age)
      this.name = name
      this.age = age
      this.weight = weight
    }
    sayHello(){
      console.log('重新父类sayHello');
      
    }
}

let c = new Child('juice',18,65)

console.log(c);
c.sayHello()
```





## 其他的补充

### & 、｜符号

```ts
let and : {name:string} & {age:number}

and = {name:'juice',age:18} 
```

### 类型别名

```ts
type myType = 1 | 2 | 3 | 4 | 5;
let temp: myType;
temp = 1
```



### 断言

```ts
let s :string = 'str'

s as string

变量 as 类型
<类型>变量
```

### 接口（interface）

> 目的是让当前的方法或类实现这个接口上面的规定，和类上面和抽象方法类似，就是为这些类型命名和为你的代码或第三方代码定义契约。

```ts
interface myInterface {
  name:string;
  age:number;
  sayHello():void
}

类：
class Person implements myInterface{
  age:number
  name:string
  constructor(name:string,age:number){
    this.name = name
    this.age = age
  }
  sayHello(){}
}

console.log( new Person('juice',18));

函数 
function test ( inter:myInterface ):void{}
test( {name:'juice',sayHello: ()=>{} })
```

### 泛型（Generic）

>  在定义函数或是类时，如果遇到类型不明确就可以使用泛型，
>
> 这里的```<T>```就是泛型，T是给这个类型起的名字（不一定非叫T），设置泛型后即可在函数中使用T来表示该类型，就表示某个类型。<String> === <T>或者其他，总是T可以代码任意的类型

```ts
// 函数使用泛型
function fn<T>(a: T): T{
  return a;
}

// 可以直接调用具有泛型的函数
let result = fn(10); // 不指定泛型，TS可以自动对类型进行推断
let result2 = fn<string>('hello'); // 指定泛型

// 类使用泛型
class Person<T>{
  name: T;
  constructor(name: T) {
      this.name = name;
  }
}

let p = new Person('juice')

// 泛型可以同时指定多个
function fn2<T, K>(a: T, b: K):T{
  console.log(b);
  return a;
}

fn2<number, string>(123, 'hello');

// 泛型配合接口使用
interface Inter{
  length: number;
}

// T extends Inter 表示泛型T必须是Inter实现类（子类）
function fn3<T extends Inter>(a: T): number{
  return a.length;
}
 fn3({length:10})
```



# React中使用TS

## 事件相关

```tsx
// click 使用 React.MouseEvent 加 dom 类型的泛型
// HTMLInputElement 代表 input标签 另外一个常用的是 HTMLDivElement
const onClick = (e: React.MouseEvent<HTMLInputElement>) => {};
// onChange使用 React.ChangeEvent 加 dom 类型的泛型
// 一般都是 HTMLInputElement,HTMLSelectElement 可能也会使用
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

如果是form表单中的 onChange不一样。
const onChange = (e: React.FormEvent<HTMLInputElement>) = {};
```

