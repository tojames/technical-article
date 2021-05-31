/*
 * 面向对象机制：阿里引发“血案”的面试题 
 *   + prototype & __proto__
 *   + 函数的多种角色：函数「普通函数/构造函数」 & 普通对象
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();



/* 
// 课后思考：
var name = '珠峰培训';
function A(x,y){
    var res=x+y;
    console.log(res,this.name);
}
function B(x,y){
    var res=x-y;
    console.log(res,this.name);
}
B.call(A,40,30);
B.call.call.call(A,20,10);
Function.prototype.call(A,60,50);
Function.prototype.call.call.call(A,80,70); 
*/