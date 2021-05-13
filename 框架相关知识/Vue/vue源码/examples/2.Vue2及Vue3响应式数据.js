// *****************Vue2***************
function observer(value) { // proxy reflect
    if (typeof value === 'object' && typeof value !== null)
        for (let key in value) {
            defineReactive(value, key, value[key]);
        }
}

function defineReactive(obj, key, value) {
    observer(value);
    Object.defineProperty(obj, key, {
        get() { // 收集对应的key 在哪个方法（组件）中被使用
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                observer(newValue);
                value = newValue; // 让key对应的方法（组件重新渲染）重新执行
            }
        }
    })
}
let obj1 = { school: { name: 'zf', age: 12 } };
observer(obj1);
console.log(obj1)



// *****************Vue3***************
let handler = {
    set(target, key, value) {
        return Reflect.set(target, key, value);
    },
    get(target, key) {
        if (typeof target[key] == 'object' && target[key] !== null) {
            return new Proxy(target[key], handler); // 懒代理
        }
        return Reflect.get(target, key);
    }
}
let obj2 = { school: { name: 'zf', age: 12 } };
let proxy = new Proxy(obj2, handler);

proxy.school