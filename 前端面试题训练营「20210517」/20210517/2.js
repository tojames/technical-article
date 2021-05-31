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
