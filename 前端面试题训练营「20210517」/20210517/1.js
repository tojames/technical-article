/*
 * 堆栈内存机制：可能你之前学的都是“假前端”
 *   + ECStack & EC(G) & HEAP
 *   + VO(G) & GO
 *   + 变量提升
 */
var a = {
  n: 1,
};
var b = a;
a.x = a = {
  n: 2,
};
console.log(a.x);
console.log(b);

/* // == 比较：两边类型不一样，会进行数据类型转换   对象==数字，把对象转换为数字「Symbol.toPrimitive -> valueOf -> toString -> Number」
var a = {
    i: 0
};
a[Symbol.toPrimitive] = function () {
    return ++this.i;
};
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

/* // 全局上下文：基于var声明的变量是给window(GO)设置属性
var i = 0;
Object.defineProperty(window, 'a', {
    get() {
        return ++i;
    }
});
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

//===================

/* 
// 课后思考：
function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        }
    };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3); 
*/
