# Vue指令

Vue中的指令分为内置指令和自定义指令。

## 内置指令

分别为 **v-on、v-bind、v-if、v-show、v-for**。

它们的实现方式是各不相同的，因为它们的能力更加复杂，所以需要底层的算法支持，自定义指令是做不到的。



## 自定义指令

是通过 `Vue.directive`去添加的，它的原理是挺简单的，就是添加执行的方法。

### Vue.directive

> 指令是传对象的话，是一个直接赋值的操作，如果是函数的话，会将函数赋值给 `bind` 和 `update`。

```js
// 注册
Vue.directive('my-directive', {
  bind: function () {},
  inserted: function () {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {}
})

// 注册 (指令函数)
Vue.directive('my-directive', function () {
  // 这里将会被 `bind` 和 `update` 调用
})


// 这是我项目中使用控制权限的指令
Vue.directive('permission', {
  inserted(el, bind, vnode) {
    // 当前绑定的dom元素
    console.log(el, 'el') 
    // 绑定的参数：expression、v-permission
    console.log(bind, 'bind') 
    // VNode：这里可以通过 context 可以访问到当前组件的参数
    console.log(vnode, 'vnode')
    const { value } = bind
    // 获取存在Vuex中的权限
    const roles = store.getters.func_permissions
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role)
      })
      // 如果没有权限的话，就把当前孩子remove
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  },
})

```



自定义指令例子如下。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue指令</title></title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.js"></script>

  </head>
  <body>
    <div id="app">
      <input type="text" v-model="inputValue" v-focus="1" />
    </div>
    <script>
      Vue.directive('focus', {
        // 第一次绑定元素时调用
        bind(el, bind, vnode) {
          console.log('bind')
        },
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function(el) {
          console.log('inserted')
          el.focus()
        },
        // 所在组件VNode发生更新时调用
        update() {
          console.log('update')
        },
        // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
        componentUpdated() {
          console.log('componentUpdated')
        },
        // 只调用一次，指令与元素解绑时调用
        unbind() {
          console.log('unbind')
        }
      })
      new Vue({
        data: {
          inputValue: ''
        }
      }).$mount('#app')
    </script>
  </body>
</html>

```

