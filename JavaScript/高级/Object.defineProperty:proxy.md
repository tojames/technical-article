#  Object.defineProperty()

```js
html
 <input type="text" id="userName" />
 <span id="uName">暂时没有数据</span>
 get：<span id="getName">点击触发get 方法</span>

js:
let obj = {
      userName: "",
};
Object.defineProperty(obj, "userName", {
      // 注意 数据描述符	configurable	enumerable	value	writable
      // 存取描述符  	configurable	enumerable	get	set
      configurable: true, //能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
      enumerable: true, //对象属性是否可通过for-in循环，false为不可循环，默认值为true
      // writable: true, //对象属性是否可修改,flase为不可修改，默认值为true
      // value: "Atoe", //对象属性的默认值，默认值为undefined
      get: function () {
        console.log("get init");
        return "固定值";
      },
      set: function (val) {
        console.log("set init", val);
        document.getElementById("uName").innerText = val;
        document.getElementById("userName").value = val;
      },
    });
    document
      .getElementById("userName")
      .addEventListener("keyup", function (event) {
        obj.userName = event.target.value;
      });
    document
      .getElementById("getName")
      .addEventListener("click", function (event) {
        console.log(obj);
        document.getElementById("uName").innerText = obj.userName;
      });
```



# proxy

代理,可以理解为在对象之前设置一个“拦截”，当该对象被访问的时候，都必须经过这层拦截。意味着你可以在这层拦截中进行各种操作。比如你可以在这层拦截中对原对象进行处理，返回你想返回的数据结构。

ES6 原生提供 Proxy 构造函数，MDN上的解释为：Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

```js
const p = new Proxy(target, handler);
//target： 所要拦截的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
//handler：一个对象，定义要拦截的行为

const p = new Proxy({}, {
    get(target, propKey) {
        return '哈哈，你被我拦截了';
    }
});

console.log(p.name);
```

新增的属性，并不需要重新添加响应式处理，因为 Proxy 是对对象的操作，只要你访问对象，就会走到 Proxy 的逻辑中。
