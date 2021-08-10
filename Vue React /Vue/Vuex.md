# Vuex

> Vuex是一个全局状态管理库

 [使用参考官网](https://vuex.vuejs.org/zh/)

![vuex](https://vuex.vuejs.org/vuex.png)

[原生实现Vuex](./Vuex)

```js
原生实现的思路是
install 负责Stroe初始化，安装在Vue
index 负责主要逻辑



install 就会执行以下的代码，使得所有的组件都有 this.$store, 全局都可以使用我们的Store的实例了
 Vue.mixin({
    beforeCreate() {
      const options = this.$options // 获取optonApi的值
      if (options.store) {
        // 根实例
        this.$store = options.store
      } else if (options.parent && options.parent.$store) {
        // 给每个组件都赋值$store
        this.$store = options.parent.$store
      }
    },
  })

index 主要做的是将 state做成响应式 getters做成可缓存 mutations commit actions dispatch
以及 modules的处理。具体逻辑还是得看源码。
```



# Vuex问答题



#### 什么时候使用Vuex

```
用户信息可以考虑存在Vuex里面
多个组件依赖于同一状态时。
来自不同组件的行为需要变更同一状态。

当然我听过有些项目是所有的接口信息都放在Vuex里面的，应该是要做一些刷新Vuex后数据丢失的问题处理，以及Vuex数据太多的处理机。
```



#### Vuex的5个核心属性是什么？

```js
state 相当于state 
它的实现是通过获取用户定义的状态，所有modules的中的状态，然后是一个tree对象嵌套着，
 然后通过以下代码实现响应式 
 store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  })
	
  // Vuex 可以动态添加模块
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current]
    }, rootState)

    Vue.set(parent, path[path.length - 1], module.state)
  }

getters 相当于computed
getters是存放在一个对象里面，而且是不具备命名空间的，所有如果出现重复的getters的话就会覆盖，
它的底层原理就是，先收集所有modules下面的getters，然后放在 _warppedGetters里面，将computed放在刚刚定义new Vue 作为参数传入
 const computed = {} // 定义计算属性
forEachValue(store._warppedGetters, (fn, key) => {
  // 初始化的时候，先给 computed[key]初始化一个函数，到时候访问就可以缓存起来了
    computed[key] = () => {
      return fn()
    }
	 	// 给store.getters 附加一个key属性，并它会触发上面的computed，从而实现缓存，
    // 意思就是只要template中使用了key了getter 第一次就会触发computed进行缓存起来
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    })
  })

mutations
触发mutations是需要通过commit api来触发，是同步任务
它是将所有modules下面的mutations收集起来，并且加上命名空间，然后放在_mutations里面，我们调用commit就可以执行action，收集这个东西基于发布订阅模式
  commit = (type, payload) => {
    this._mutations[type].forEach((mutation) => mutation.call(this, payload))
  }
  
actions
触发actions是需要通过dispatch api来触发异步任务，其他方式和mutation相似
  dispatch = (type, payload) => {
    this._actions[type].forEach((action) => action.call(this, payload))
  }
  
modules
Vuex的模块化概念，可以将Vuex分开管理，使代码更好管理。使用了命名空间namespaced 可以更好解决冲突 mutation actions 同名的问题，到时候通过 this.$store.commit('/a/b/changeAge') this.$store.dispatch('changeAge')
```



#### 怎么在组件中批量使用Vuex的state状态？

```js
使用mapState辅助函数, 利用对象展开运算符将state混入computed对象中

辅助函数能够方法我们使用Vuex，它的原理是，这里我以action为例，其他的都是同理的
不过值得注意的是，state getters 放在computed下面展开  而mutation action 都是放在methods下面展开

export function mapActiontion(actionArr) {
  let obj = {}
  normalizeMap(actionArr).forEach((item) => {
    console.log(item, "item")
    obj[item.val] = function (payload) {
      this.$store._actions[item.key].forEach((action) => action(payload))
    }
  })
  return obj
}

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map((key) => ({ key, val: key }))
    : Object.keys(map).map((key) => ({ key, val: map[key] }))
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap(map) {
  return Array.isArray(map) || isObject(map)
}

export function isObject(obj) {
  return obj !== null && typeof obj === "object"
}

```



#### Vuex中action和mutation有什么区别？

```js
action 提交的是 mutation，而不是直接变更状态。mutation可以直接变更状态。
action 可以包含任意异步操作。mutation只能是同步操作。
提交方式不同，action 是用this.$store.dispatch('xx',payload)来提交。mutation是用this.$store.commit('xxx',payload)来提交。
接收参数不同，mutation第一个参数是state，而action第一个参数是context，其包含了

{
    state,      // 等同于 `store.state`，若在模块中则为局部状态
    rootState,  // 等同于 `store.state`，只存在于模块中
    commit,     // 等同于 `store.commit`
    dispatch,   // 等同于 `store.dispatch`
    getters,    // 等同于 `store.getters`
    rootGetters // 等同于 `store.getters`，只存在于模块中
}


```



#### Vuex中action通常是异步的，那么如何知道action什么时候结束呢？

```js
在action函数中返回Promise，然后再提交时候用then处理

actions:{
    SET_NUMBER_A({commit},data){
        return new Promise((resolve,reject) =>{
            setTimeout(() =>{
                commit('SET_NUMBER',10);
                resolve();
            },2000)
        })
    }
}
this.$store.dispatch('SET_NUMBER_A').then(() => {
  // ...
})

```



#### 在模块中，getter和mutation和action中怎么访问全局的state和getter？

```
在getter中可以通过第三个参数rootState访问到全局的state,可以通过第四个参数rootGetters访问到全局的getter。
在mutation中不可以访问全局的satat和getter，只能访问到局部的state。
在action中第一个参数context中的context.rootState访问到全局的state，context.rootGetters访问到全局的getter。
```



#### 怎么在带命名空间的模块内提交全局的mutation和action？

```js
将 { root: true } 作为第三参数传给 dispatch 或 commit 即可。

this.$store.dispatch('actionA', null, { root: true })
this.$store.commit('mutationA', null, { root: true })
```



#### 怎么在带命名空间的模块内注册全局的action？

```js
actions: {
    actionA: {
        root: true,
        handler (context, data) { ... }
    }
  }
```



#### Vuex插件有用过吗？怎么用简单介绍一下？

```
Vuex插件就是一个函数，它接收 store 作为唯一参数。在Vuex.Store构造器选项plugins引入。 在store/plugin.js文件中写入


export default function createPlugin(param){
    return store =>{
        //...
    }
}


然后在store/index.js文件中写入
import createPlugin from './plugin.js'
const myPlugin = createPlugin()
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})

```



#### 在v-model上怎么用Vuex中state的值？

```
<input v-model="message">
// ...
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```



#### Vuex的严格模式是什么,有什么作用,怎么开启？

```
在严格模式下，无论何时发生了状态变更且不是由 mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
在Vuex.Store 构造器选项中开启,如下
const store = new Vuex.Store({
    strict:true,
})
```

