<<<<<<< HEAD
/*
 * 面向对象机制：阿里引发“血案”的面试题
 *   + prototype & __proto__
 *   + 函数的多种角色：函数「普通函数/构造函数」 & 普通对象
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
// function Foo() {
//   getName = function () {
//     console.log(1);
//   };
//   return this;
// }
// Foo.getName = function () {
//   console.log(2);
// };
// Foo.prototype.getName = function () {
//   console.log(3);
// };
// var getName = function () {
//   console.log(4);
// };
// function getName() {
//   console.log(5);
// }
// Foo.getName();
// getName();
// Foo().getName();
// getName();
// new Foo.getName();
// new Foo().getName();
// new new Foo().getName();

// 课后思考：
var name = "Hello Word";
function A(x, y) {
  var res = x + y;
  console.log(res, this.name);
}
function B(x, y) {
  var res = x - y;
  console.log(res, this.name);
}
debugger;
// B.call(A,40,30);
B.call.call.call(A, 20, 10);
// Function.prototype.call(A,60,50);
// Function.prototype.call.call.call(A,80,70);
=======
var name = "juice"
function A(x, y) {
  var res = x + y
  console.log(res, this.name)
}
function B(x, y) {
  var res = x - y
  console.log(res, this.name)
}
// call apply bind  原理都是 将目标对象挂载当前对象上面，达到借用的效用，然后删除借用对象，保持对象不被改变。
B.call(A, 40, 30) // 70，unidefined
B.call.call.call(A, 20, 10) // 30 undefined
Function.prototype.call(A, 60, 50) //
Function.prototype.call.call.call(A, 80, 70)
>>>>>>> 58fbd02b41094029530d54a2f3d22d2707d7c715
