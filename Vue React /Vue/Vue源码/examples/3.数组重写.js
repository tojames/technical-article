let oldArray = Object.create(Array.prototype);
['shift', 'unshift', 'push', 'pop', 'reverse','sort'].forEach(method => {
    oldArray[method] = function() { // 这里可以触发页面更新逻辑
        console.log(method)
        Array.prototype[method].call(this,...arguments);
    }
});
let arr = [1,2,3];
arr.__proto__ = oldArray;
arr.unshift(4);
