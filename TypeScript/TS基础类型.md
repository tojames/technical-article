# TypeScript

> 微软的出品，以`JavaScript`为基础的语言，拓展了`JavaScript`「类型」。`TypeScript`不能被`JavaScript`解析器直接执行，需要通过 `npm i -g typescript `执行 `tsc fileName -w`  编译成`JavaScript`才能执行。
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



### 13种类型总结

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
| symbol  |                   |                                |



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

// [propName:string]:any 索引签名
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

> `TypeScript` 新增元组，元组就是固定长度的数组，长度可以不固定

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

#### never

`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

在 TypeScript 中，可以利用 never 类型的特性来实现全面性检查，具体示例如下：

```typescript
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

注意在 else 分支里面，我们把收窄为 never 的 foo 赋值给一个显示声明的 never 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事修改了 Foo 的类型：

```typescript
type Foo = string | number | boolean;
```

然而他忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 else 分支的 foo 类型会被收窄为 `boolean` 类型，导致无法赋值给 never 类型，这时就会产生一个编译错误。通过这个方式，我们可以确保

`controlFlowAnalysisWithNever` 方法总是穷尽了 Foo 的所有可能类型。 通过这个示例，我们可以得出一个结论：**使用 never 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。**





## 断言

### 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型，它没有运行时的影响，只是在编译阶段起作用。。

类型断言有两种形式：

**1.“尖括号” 语法**

> 在React中 ,此语法会和`JSX`冲突，所以不推荐使用。

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

**2.as 语法**

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 null 和非 undefined 类型。**具体而言，x! 将从 x 值域中排除 null 和 undefined 。**

那么非空断言操作符到底有什么用呢？下面我们先来看一下非空断言操作符的一些使用场景。

**1.忽略 undefined 和 null 类型**

```typescript
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

**2.调用函数时忽略 undefined 类型**

```typescript
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

因为 `!` 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

```typescript
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); 
```

以上 TS 代码会编译生成以下 ES5 代码：

```javascript
"use strict";
const a = undefined;
const b = a;
console.log(b);
```

虽然在 TS 代码中，我们使用了非空断言，使得 `const b: number = a!;` 语句可以通过 TypeScript 类型检查器的检查。但在生成的 ES5 代码中，`!` 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 `undefined`。

**3.在嵌套比较深的对象的时候**

当我们访问嵌套比较深的对象的时候，可以通过断言它会是一个对象或者是一个函数，这会避免很多不必要的判断，因为此时我们比编译器更了解自己在做什么。

### 确定赋值断言

允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：

```typescript
let x: number;
initialize();
// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

通过 `let x!: number;` 确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值。



## 类型保护（类型守卫）

**类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。** 换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。TS会结合以下四种语法来推断是否需要提示编译出错问题， 目前主要有四种的方式来实现类型保护：

### in 关键字

```typescript
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}
```

### typeof 关键字

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### instanceof 关键字

```typescript
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

let padder: Padder = new SpaceRepeatingPadder(6);

if (padder instanceof SpaceRepeatingPadder) {
  // padder的类型收窄为 'SpaceRepeatingPadder'
}
```

### 自定义类型保护的类型谓词

```typescript
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```



## 联合类型

### 联合类型

联合类型通常与 `null` 或 `undefined` 一起使用：

```typescript
普通类型联合
const sayHello = (name: string | undefined) => {
  /* ... */
};

sayHello("semlinker");
sayHello(undefined);

字面量联合
let num: 1 | 2 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';
```

### 可辨识联合

TypeScript 可辨识联合（Discriminated Unions）类型，也称为代数数据类型或标签联合类型。**它包含 3 个要点：可辨识、联合类型和类型守卫。**

这种类型的本质是结合联合类型和字面量类型的一种类型保护方法。**如果一个类型是多个类型的联合类型，且多个类型含有一个公共属性，那么就可以利用这个公共属性，来创建不同的类型保护区块。**

**1.可辨识**

可辨识要求联合类型中的每个元素都含有一个单例类型属性，比如：

```typescript
enum CarTransmission {
  Automatic = 200,
  Manual = 300
}

interface Motorcycle {
  vType: "motorcycle"; // discriminant
  make: number; // year
}

interface Car {
  vType: "car"; // discriminant
  transmission: CarTransmission
}

interface Truck {
  vType: "truck"; // discriminant
  capacity: number; // in tons
}
```

在上述代码中，我们分别定义了 `Motorcycle`、 `Car` 和 `Truck` 三个接口，在这些接口中都包含一个 `vType` 属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关。

**2.联合类型**

基于前面定义了三个接口，我们可以创建一个 `Vehicle` 联合类型：

```typescript
type Vehicle = Motorcycle | Car | Truck;
```

现在我们就可以开始使用 `Vehicle` 联合类型，对于 `Vehicle` 类型的变量，它可以表示不同类型的车辆。

**3.类型守卫**

下面我们来定义一个 `evaluatePrice` 方法，该方法用于根据车辆的类型、容量和评估因子来计算价格，具体实现如下：

```typescript
const EVALUATION_FACTOR = Math.PI; 

function evaluatePrice(vehicle: Vehicle) {
  return vehicle.capacity * EVALUATION_FACTOR;
}

const myTruck: Truck = { vType: "truck", capacity: 9.5 };
evaluatePrice(myTruck);
```

对于以上代码，TypeScript 编译器将会提示以下错误信息：

```
Property 'capacity' does not exist on type 'Vehicle'.
Property 'capacity' does not exist on type 'Motorcycle'.
```

原因是在 Motorcycle 接口中，并不存在 `capacity` 属性，而对于 Car 接口来说，它也不存在 `capacity` 属性。那么，现在我们应该如何解决以上问题呢？这时，我们可以使用类型守卫。下面我们来重构一下前面定义的 `evaluatePrice` 方法，重构后的代码如下：

```typescript
function evaluatePrice(vehicle: Vehicle) {
  switch(vehicle.vType) {
    case "car":
      return vehicle.transmission * EVALUATION_FACTOR;
    case "truck":
      return vehicle.capacity * EVALUATION_FACTOR;
    case "motorcycle":
      return vehicle.make * EVALUATION_FACTOR;
  }
}
```

在以上代码中，我们使用 `switch` 和 `case` 运算符来实现类型守卫，从而确保在 `evaluatePrice` 方法中，我们可以安全地访问 `vehicle` 对象中的所包含的属性，来正确的计算该车辆类型所对应的价格。



## 交叉类型

在 TypeScript 中交叉类型是将多个类型合并为一个类型。通过 `&` 运算符可以将现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

```typescript
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };

let point: Point = {
  x: 1,
  y: 1
}
```

在上面代码中我们先定义了 `PartialPointX` 类型，接着使用 `&` 运算符创建一个新的 `Point` 类型，表示一个含有 x 和 y 坐标的点，然后定义了一个 `Point` 类型的变量并初始化。

### 同名基础类型属性的合并

在合并多个类型的过程中，刚好出现某些类型存在相同的成员，会出现 `never`

```typescript
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

type XY = X & Y;
type YX = Y & X;

let p: XY;
let q: YX;
```

在上面的代码中，接口 X  和接口 Y 都含有一个相同的成员 c，但它们的类型不一致。成员 c 的类型会变成 `never` ，这是因为混入后成员 c 的类型为 `string & number`，即成员 c 的类型既可以是 `string` 类型又可以是 `number` 类型。很明显这种类型是不存在的，所以混入后成员 c 的类型为 `never`。

### 同名非基础类型属性的合并

非基本数据类型的话，就像接口一样合并起来。

```typescript
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }

type ABC = A & B & C;

let abc: ABC = {
  x: {
    d: true,
    e: 'semlinker',
    f: 666
  }
};

console.log('abc:', abc);
```



## 函数

### TypeScript 函数与 JavaScript 函数的区别

| TypeScript     | JavaScript         |
| -------------- | ------------------ |
| 含有类型       | 无类型             |
| 箭头函数       | 箭头函数（ES2015） |
| 函数类型       | 无函数类型         |
| 必填和可选参数 | 所有参数都是可选的 |
| 默认参数       | 默认参数           |
| 剩余参数       | 剩余参数           |
| 函数重载       | 无函数重载         |

### 函数类型

```ts
let IdGenerator: (chars: string, nums: number) => string;

function createUserId(name: string, id: number): string {
  return name + id;
}

IdGenerator = createUserId;
```

### 函数重载

> 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

```typescript
为 add 函数提供了多个函数类型定义，从而实现函数的重载。
重载普通方法
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  // type Combinable = string | number;
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

重载类中成员方法
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: string, b: number): string;
  add(a: number, b: string): string;
  add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
    return a + b;
  }
}

const calculator = new Calculator();
const result = calculator.add('Semlinker', ' Kakuqo');
```

这里需要注意的是，当 TypeScript 编译器处理函数重载时，它会查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。另外在 Calculator 类中，`add(a: Combinable, b: Combinable){ }` 并不是重载列表的一部分，因此对于 add 成员方法来说，我们只定义了四个重载方法。



### 注意问题

#### 函数参数解构

```ts
function f({ x: number }) {
  // Error, x is not defined?
  console.log(x);
}

f({ x: 1 });
上面这种情况是给 f函数 传了一个对象。并不是我们解构，所以 x 会报 undefined。

这种写法才是正确的。
function f({ x }: { x: number }) {
  // Error, x is not defined?
  console.log(x);
}

f({ x: 1 });
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





参考：

 https://juejin.cn/post/6872111128135073806
