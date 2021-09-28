# Set、Map、WeakSet、WeakMap

> 我们知道以上4种数据结构都是基于Hash Table，搜索他们的查询效率特别高，还有Object对象也是。

### 1.Set

****

一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key。

**Set**对象可以存储**任何类型**的数据

```js
var s = new Set(); // 空Set
s.add({})
s.add(function() {})
s.add(Symbol())

var s2 = new Set([1, 2, 3,3]); // 含1, 2, 3
s2.add(4);
s2; // Set {1, 2, 3, 4}
s2.add(4);
s2; // 仍然是 Set {1, 2, 3, 4}

s.values() :获取value值
m.keys() :获取key值
这里的keys和values是一样的

const requests = new Set();
class ApiRequest {
  constructor() {
    requests.add(this);
  }
  makeRequest() {
    if(!request.has(this)) throw new Error("Invalid access");
    // do work
  }
  destory(){
    requests.delete(this)
  }
}

那么 ApiRequest 既不得不参与到生命周期的管理中去，另一方面作为消费者的一方还得时时刻刻记着需要 destory 。
```



### WeakSet

****

 结构与 **Set** 类似，也是不重复的值的集合。

不同：`WeakSet` 的成员只能是**对象**，而不能是其他类型的值。**WeakSet 不可遍历**。

```js
const requests = new WeakSet();
class ApiRequest {
  constructor() {
    requests.add(this);
  }
  makeRequest() {
    if(!request.has(this)) throw new Error("Invalid access");
    // do work
  }
}

其实上文中“需要一个弱引用的集合”和“进行判断时外界对这个对象必然存在引用的”并不完全矛盾。假如在一个模块内部，我既控制了对象的生命周期，而又需要这个集合进行判断，那么的确，这个 WeakSet 确实没有必要。但是假如需要这个集合进行判断的一方并不想控制这个对象的生命周期，那么 WeakSet 倒显得有些必要了。

比如上述代码，ApiRequest 类中想验证 this 对象的来源，于是需要一个集合来存所有通过构造函数构建的对象，ApiRequest 类却并不像参与到实例对象的生命周期中去，直接用 Set 的话，由于Set 对于实例对象存在引用，就会发生内存泄漏。

总而言之，WeakSet 存在于需要考虑生命周期防止内存泄漏的地方。像 js 等一些高级语言由于存在 GC，让程序员不需要直接地去操作内存，避免了很多问题，同时也让一些内存泄漏地问题变得更加隐晦，所以活用 WeakSet/WeakMap 还是很有必要的。

引自 https://zhuanlan.zhihu.com/p/54889129
```



### 1.Map

****

`Map`是一组键值对的结构，具有极快的查找速度。

初始化`Map`可以穿一个二维数组，或者直接初始化一个空`Map`

```js
let m = new Map(); // 空Map
m.set('Adam', 67); // 添加新的key-value
m.set('Bob', 59);
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined

也可以直接存入一个二维数组
let m2 = new Map([['name','Atoe'],['age',22]])
console.log(m.get('name')); //Atoe

m.keys() :获取key值
m.values() :获取value值

entries() 方法返回一个新的包含 [key, value] 对的 Iterator 对象，返回的迭代器的迭代顺序与 Map 对象的插入顺序相同。
例子:
var myMap = new Map();
myMap.set("0", "foo");
myMap.set(1, "bar");
myMap.set({}, "baz");

var mapIter = myMap.entries();
//那么通过next()就可以拿到迭代器里面的东西
console.log(mapIter.next().value); // ["0", "foo"]
console.log(mapIter.next().value); // [1, "bar"]
console.log(mapIter.next().value); // [Object, "baz"]
```



### WeakMap

****

对象是一组**键值对**的集合，`WeakMap`只接受**对象作为键名**（`null`除外），不接受其他类型的值作为键名。

`WeakMap`的键名所指向的对象，**不计入**垃圾回收机制。

因为是弱引用的关系所以不能被遍历

```js
function Constructor() {
    var data = new WeakMap();
 	// 重写构建函数
    Constructor = function() {
    	// 挂一个私有变量存储
        data.set(this, {});
    }
 	// 方法
    Constructor.prototype.doSth = function () {
    	var privateVar = data.get(this);
    	......
    };
    return new Constructor();
};
  
 我们使用data来扩展this对象，用来存储私有变量，这个私有变量在外部无法被访问，而且随this对象的销毁和消失，简直完美。
```



